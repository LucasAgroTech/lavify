import Stripe from "stripe";

// Inicializa o cliente Stripe (lazy initialization para evitar erro no build)
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY não configurada");
    }
    stripeInstance = new Stripe(secretKey, {
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export para compatibilidade
export const stripe = {
  get customers() { return getStripe().customers; },
  get checkout() { return getStripe().checkout; },
  get subscriptions() { return getStripe().subscriptions; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
};

// URLs de retorno
export const getStripeUrls = (origin: string) => ({
  success: `${origin}/dashboard?upgrade=success`,
  cancel: `${origin}/planos?upgrade=canceled`,
  portal: `${origin}/dashboard`,
});

