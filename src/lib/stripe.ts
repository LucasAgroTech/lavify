import Stripe from "stripe";

// Inicializa o cliente Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

// URLs de retorno
export const getStripeUrls = (origin: string) => ({
  success: `${origin}/dashboard?upgrade=success`,
  cancel: `${origin}/planos?upgrade=canceled`,
  portal: `${origin}/dashboard`,
});

