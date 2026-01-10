import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { PLANS, PlanType, isSubscriptionActive, isTrialExpired, TRIAL_DAYS } from "@/lib/plans";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar lava jato com dados de assinatura
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: session.lavaJatoId },
      select: {
        id: true,
        nome: true,
        plano: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripeStatus: true,
        trialEndsAt: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
        createdAt: true,
        _count: {
          select: {
            ordens: {
              where: {
                dataEntrada: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
              },
            },
            usuarios: true,
          },
        },
      },
    });

    if (!lavaJato) {
      return NextResponse.json(
        { error: "Lava jato não encontrado" },
        { status: 404 }
      );
    }

    const planId = lavaJato.plano as PlanType;
    const plan = PLANS[planId] || PLANS.STARTER;

    // Calcular dias de trial restantes
    let trialDaysRemaining = 0;
    let isInTrial = false;

    if (lavaJato.trialEndsAt) {
      const now = new Date();
      const trialEnd = new Date(lavaJato.trialEndsAt);
      if (trialEnd > now) {
        trialDaysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        isInTrial = true;
      }
    } else if (!lavaJato.stripeSubscriptionId) {
      // Conta nova sem assinatura - calcular trial desde criação
      const createdAt = new Date(lavaJato.createdAt);
      const trialEnd = new Date(createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
      const now = new Date();
      
      if (trialEnd > now) {
        trialDaysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        isInTrial = true;
      }
    }

    // Status da assinatura
    const isActive = isSubscriptionActive(
      lavaJato.stripeStatus,
      lavaJato.trialEndsAt
    );

    // Uso atual
    const osThisMonth = lavaJato._count.ordens;
    const usersCount = lavaJato._count.usuarios;
    const osLimit = plan.limits.osPerMonth;
    const userLimit = plan.limits.usuarios;

    return NextResponse.json({
      plan: {
        id: plan.id,
        name: plan.name,
        priceDisplay: plan.priceDisplay,
        limits: plan.limits,
      },
      subscription: {
        status: lavaJato.stripeStatus || (isInTrial ? "trialing" : "inactive"),
        isActive,
        isInTrial,
        trialDaysRemaining,
        currentPeriodEnd: lavaJato.currentPeriodEnd,
        cancelAtPeriodEnd: lavaJato.cancelAtPeriodEnd,
        hasStripeCustomer: !!lavaJato.stripeCustomerId,
        hasSubscription: !!lavaJato.stripeSubscriptionId,
      },
      usage: {
        osThisMonth,
        osLimit: osLimit === -1 ? "Ilimitado" : osLimit,
        osPercentage: osLimit === -1 ? 0 : Math.round((osThisMonth / osLimit) * 100),
        usersCount,
        userLimit: userLimit === -1 ? "Ilimitado" : userLimit,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar assinatura:", error);
    return NextResponse.json(
      { error: "Erro ao buscar informações da assinatura" },
      { status: 500 }
    );
  }
}

