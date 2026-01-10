import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { stripe, getStripeUrls } from "@/lib/stripe";

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

    // Buscar lava jato
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: session.lavaJatoId },
    });

    if (!lavaJato || !lavaJato.stripeCustomerId) {
      return NextResponse.json(
        { error: "Nenhuma assinatura encontrada" },
        { status: 404 }
      );
    }

    // Criar portal session
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const urls = getStripeUrls(origin);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: lavaJato.stripeCustomerId,
      return_url: urls.portal,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Erro ao criar portal:", error);
    return NextResponse.json(
      { error: "Erro ao abrir portal de pagamento" },
      { status: 500 }
    );
  }
}

