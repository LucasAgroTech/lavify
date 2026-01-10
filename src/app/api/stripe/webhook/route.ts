import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { PLANS, PlanType, PRICING_OPTIONS } from "@/lib/plans";
import Stripe from "stripe";

// Desabilitar body parser para webhooks
export const runtime = "nodejs";

// Função para determinar o plano pelo priceId
function getPlanByPriceId(priceId: string): PlanType {
  // Verificar em PRICING_OPTIONS (mensal e anual)
  for (const [planKey, options] of Object.entries(PRICING_OPTIONS)) {
    if (options.monthly.stripePriceId === priceId || options.yearly.stripePriceId === priceId) {
      return planKey as PlanType;
    }
  }
  
  // Verificar em PLANS (fallback para stripePriceId direto)
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.stripePriceId === priceId) {
      return key as PlanType;
    }
  }
  
  return "STARTER";
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    console.error("Webhook: Missing stripe-signature header");
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Webhook: STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
  
  console.log(`Webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoiceFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// ============================================
// HANDLERS
// ============================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const lavaJatoId = session.metadata?.lavaJatoId;
  const planId = session.metadata?.planId as PlanType;

  if (!lavaJatoId || !planId) {
    console.error("Missing metadata in checkout session");
    return;
  }

  // Buscar subscription completa
  const subscriptionId = session.subscription as string;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Calcular trial end
  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;

  // Atualizar lava jato
  await prisma.lavaJato.update({
    where: { id: lavaJatoId },
    data: {
      plano: planId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0]?.price.id,
      stripeStatus: subscription.status,
      trialEndsAt,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Checkout completed for lavaJato ${lavaJatoId}, plan: ${planId}`);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  // Buscar lava jato pelo customer ID
  const lavaJato = await prisma.lavaJato.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!lavaJato) {
    console.error("LavaJato not found for customer:", subscription.customer);
    return;
  }

  // Determinar o plano pelo price ID (suporta mensal e anual)
  const priceId = subscription.items.data[0]?.price.id;
  const planId = priceId ? getPlanByPriceId(priceId) : "STARTER";

  // Calcular trial end
  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;

  // Atualizar
  await prisma.lavaJato.update({
    where: { id: lavaJato.id },
    data: {
      plano: planId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeStatus: subscription.status,
      trialEndsAt,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Subscription updated for lavaJato ${lavaJato.id}, plan: ${planId}, status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const lavaJato = await prisma.lavaJato.findFirst({
    where: { stripeCustomerId: subscription.customer as string },
  });

  if (!lavaJato) {
    console.error("LavaJato not found for customer:", subscription.customer);
    return;
  }

  // Voltar para plano gratuito
  await prisma.lavaJato.update({
    where: { id: lavaJato.id },
    data: {
      plano: "STARTER",
      stripeStatus: "canceled",
      cancelAtPeriodEnd: false,
    },
  });

  console.log(`Subscription canceled for lavaJato ${lavaJato.id}`);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const lavaJato = await prisma.lavaJato.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (!lavaJato) return;

  // Atualizar status para ativo
  await prisma.lavaJato.update({
    where: { id: lavaJato.id },
    data: {
      stripeStatus: "active",
    },
  });

  console.log(`Invoice paid for lavaJato ${lavaJato.id}`);
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const lavaJato = await prisma.lavaJato.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (!lavaJato) return;

  // Marcar como past_due
  await prisma.lavaJato.update({
    where: { id: lavaJato.id },
    data: {
      stripeStatus: "past_due",
    },
  });

  console.log(`Invoice failed for lavaJato ${lavaJato.id}`);
}

