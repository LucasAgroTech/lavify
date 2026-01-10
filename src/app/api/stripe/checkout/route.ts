import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { stripe, getStripeUrls } from "@/lib/stripe";
import { PLANS, PlanType, TRIAL_DAYS } from "@/lib/plans";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Apenas ADMIN pode gerenciar assinatura
    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Apenas administradores podem gerenciar a assinatura" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { planId } = body as { planId: PlanType };

    // Validar plano
    const plan = PLANS[planId];
    if (!plan || !plan.stripePriceId) {
      return NextResponse.json(
        { error: "Plano inválido" },
        { status: 400 }
      );
    }

    // Buscar lava jato
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: session.lavaJatoId },
      include: {
        usuarios: {
          where: { id: session.userId },
          select: { email: true, nome: true },
        },
      },
    });

    if (!lavaJato) {
      return NextResponse.json(
        { error: "Lava jato não encontrado" },
        { status: 404 }
      );
    }

    const userEmail = lavaJato.usuarios[0]?.email;
    const userName = lavaJato.usuarios[0]?.nome;

    // Criar ou recuperar customer no Stripe
    let customerId = lavaJato.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName,
        metadata: {
          lavaJatoId: lavaJato.id,
          lavaJatoNome: lavaJato.nome,
        },
      });
      customerId = customer.id;

      // Salvar customer ID
      await prisma.lavaJato.update({
        where: { id: lavaJato.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Verificar se já tem assinatura ativa
    if (lavaJato.stripeSubscriptionId && lavaJato.stripeStatus === "active") {
      // Redirecionar para o portal para fazer upgrade/downgrade
      return NextResponse.json(
        { error: "Você já possui uma assinatura ativa. Use o portal para alterar." },
        { status: 400 }
      );
    }

    // Calcular trial (apenas se nunca teve assinatura)
    const hasHadSubscription = lavaJato.stripeSubscriptionId !== null;
    const trialPeriodDays = hasHadSubscription ? undefined : TRIAL_DAYS;

    // Criar checkout session
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const urls = getStripeUrls(origin);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      subscription_data: trialPeriodDays
        ? {
            trial_period_days: trialPeriodDays,
            metadata: {
              lavaJatoId: lavaJato.id,
              planId: planId,
            },
          }
        : {
            metadata: {
              lavaJatoId: lavaJato.id,
              planId: planId,
            },
          },
      success_url: urls.success,
      cancel_url: urls.cancel,
      metadata: {
        lavaJatoId: lavaJato.id,
        planId: planId,
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      locale: "pt-BR",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento" },
      { status: 500 }
    );
  }
}

