// ============================================
// CONFIGURAÇÃO DE PLANOS E FUNCIONALIDADES
// ============================================

export type PlanType = "STARTER" | "PRO" | "PREMIUM";

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  price: number; // em centavos
  priceDisplay: string;
  stripePriceId: string | null;
  features: string[];
  limits: {
    osPerMonth: number; // -1 = ilimitado
    usuarios: number;
    agendamentoOnline: boolean;
    estoque: boolean;
    financeiro: boolean;
    fidelidade: boolean;
    whatsappApi: boolean;
    relatoriosAvancados: boolean;
    multiUnidades: boolean;
    suportePrioritario: boolean;
  };
  badge?: string;
  popular?: boolean;
}

// IDs dos preços no Stripe (configurar após criar no dashboard)
export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
  PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY || "",
  PREMIUM_MONTHLY: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || "",
  PREMIUM_YEARLY: process.env.STRIPE_PRICE_PREMIUM_YEARLY || "",
};

export type BillingInterval = "monthly" | "yearly";

export interface PricingOption {
  interval: BillingInterval;
  price: number; // em centavos
  priceDisplay: string;
  pricePerMonth: string; // para mostrar economia no anual
  stripePriceId: string;
  savings?: string; // ex: "Economize 2 meses"
}

export const PLANS: Record<PlanType, Plan> = {
  STARTER: {
    id: "STARTER",
    name: "Starter",
    description: "Para quem está começando",
    price: 0,
    priceDisplay: "Grátis",
    stripePriceId: null,
    badge: "Grátis",
    features: [
      "Dashboard básico",
      "Kanban do pátio",
      "Cadastro de clientes",
      "Até 30 OSs por mês",
      "1 usuário",
    ],
    limits: {
      osPerMonth: 30,
      usuarios: 1,
      agendamentoOnline: false,
      estoque: false,
      financeiro: false,
      fidelidade: false,
      whatsappApi: false,
      relatoriosAvancados: false,
      multiUnidades: false,
      suportePrioritario: false,
    },
  },
  PRO: {
    id: "PRO",
    name: "Profissional",
    description: "Para lava-rápidos em crescimento",
    price: 4790, // R$ 47,90
    priceDisplay: "R$ 47,90",
    stripePriceId: STRIPE_PRICE_IDS.PRO_MONTHLY,
    popular: true,
    badge: "Mais Popular",
    features: [
      "Tudo do Starter +",
      "Agendamento online 24h",
      "Controle de estoque",
      "Alertas de estoque baixo",
      "Até 150 OSs por mês",
      "3 usuários",
      "Notificação WhatsApp",
    ],
    limits: {
      osPerMonth: 150,
      usuarios: 3,
      agendamentoOnline: true,
      estoque: true,
      financeiro: false,
      fidelidade: false,
      whatsappApi: true,
      relatoriosAvancados: false,
      multiUnidades: false,
      suportePrioritario: false,
    },
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "Premium",
    description: "Para operações profissionais",
    price: 9790, // R$ 97,90
    priceDisplay: "R$ 97,90",
    stripePriceId: STRIPE_PRICE_IDS.PREMIUM_MONTHLY,
    badge: "Completo",
    features: [
      "Tudo do Pro +",
      "OSs ilimitadas",
      "Usuários ilimitados",
      "Financeiro completo",
      "Programa de fidelidade",
      "Cashback automático",
      "Relatórios avançados",
      "Multi-unidades",
      "Suporte prioritário",
    ],
    limits: {
      osPerMonth: -1, // ilimitado
      usuarios: -1, // ilimitado
      agendamentoOnline: true,
      estoque: true,
      financeiro: true,
      fidelidade: true,
      whatsappApi: true,
      relatoriosAvancados: true,
      multiUnidades: true,
      suportePrioritario: true,
    },
  },
};

// Opções de preço para cada plano (mensal e anual)
export const PRICING_OPTIONS: Record<Exclude<PlanType, "STARTER">, { monthly: PricingOption; yearly: PricingOption }> = {
  PRO: {
    monthly: {
      interval: "monthly",
      price: 4790,
      priceDisplay: "R$ 47,90",
      pricePerMonth: "R$ 47,90",
      stripePriceId: STRIPE_PRICE_IDS.PRO_MONTHLY,
    },
    yearly: {
      interval: "yearly",
      price: 47900, // R$ 479,00/ano
      priceDisplay: "R$ 479,00",
      pricePerMonth: "R$ 39,92",
      stripePriceId: STRIPE_PRICE_IDS.PRO_YEARLY,
      savings: "Economize 2 meses",
    },
  },
  PREMIUM: {
    monthly: {
      interval: "monthly",
      price: 9790,
      priceDisplay: "R$ 97,90",
      pricePerMonth: "R$ 97,90",
      stripePriceId: STRIPE_PRICE_IDS.PREMIUM_MONTHLY,
    },
    yearly: {
      interval: "yearly",
      price: 67900, // R$ 679,00/ano (desconto maior - ~7 meses grátis)
      priceDisplay: "R$ 679,00",
      pricePerMonth: "R$ 56,58",
      stripePriceId: STRIPE_PRICE_IDS.PREMIUM_YEARLY,
      savings: "Economize 5 meses!",
    },
  },
};

// Duração do trial em dias
export const TRIAL_DAYS = 7;

// ============================================
// FUNÇÕES DE VERIFICAÇÃO DE ACESSO
// ============================================

export type FeatureKey = keyof Plan["limits"];

/**
 * Verifica se o plano tem acesso a uma funcionalidade
 */
export function hasFeature(planId: PlanType, feature: FeatureKey): boolean {
  const plan = PLANS[planId];
  if (!plan) return false;

  const value = plan.limits[feature];
  
  // Para booleanos
  if (typeof value === "boolean") return value;
  
  // Para números, qualquer valor > 0 ou -1 (ilimitado) significa que tem
  if (typeof value === "number") return value !== 0;
  
  return false;
}

/**
 * Verifica se atingiu o limite de OSs do mês
 */
export function isOsLimitReached(planId: PlanType, currentCount: number): boolean {
  const plan = PLANS[planId];
  if (!plan) return true;
  
  const limit = plan.limits.osPerMonth;
  if (limit === -1) return false; // ilimitado
  
  return currentCount >= limit;
}

/**
 * Verifica se atingiu o limite de usuários
 */
export function isUserLimitReached(planId: PlanType, currentCount: number): boolean {
  const plan = PLANS[planId];
  if (!plan) return true;
  
  const limit = plan.limits.usuarios;
  if (limit === -1) return false; // ilimitado
  
  return currentCount >= limit;
}

/**
 * Retorna a lista de funcionalidades bloqueadas para um plano
 */
export function getBlockedFeatures(planId: PlanType): FeatureKey[] {
  const plan = PLANS[planId];
  if (!plan) return [];
  
  const blocked: FeatureKey[] = [];
  
  for (const [key, value] of Object.entries(plan.limits)) {
    if (value === false || value === 0) {
      blocked.push(key as FeatureKey);
    }
  }
  
  return blocked;
}

/**
 * Verifica se o trial expirou
 */
export function isTrialExpired(trialEndsAt: Date | null): boolean {
  if (!trialEndsAt) return true;
  return new Date() > new Date(trialEndsAt);
}

/**
 * Verifica se a assinatura está ativa (paga ou em trial válido)
 */
export function isSubscriptionActive(
  stripeStatus: string | null,
  trialEndsAt: Date | null
): boolean {
  // Status ativo do Stripe
  if (stripeStatus === "active" || stripeStatus === "trialing") {
    return true;
  }
  
  // Está em trial válido
  if (trialEndsAt && !isTrialExpired(trialEndsAt)) {
    return true;
  }
  
  return false;
}

/**
 * Mapeia rotas do dashboard para funcionalidades
 */
export const ROUTE_FEATURE_MAP: Record<string, FeatureKey | null> = {
  "/dashboard": null, // sempre liberado
  "/kanban": null, // sempre liberado
  "/nova-os": null, // sempre liberado (mas tem limite de quantidade)
  "/clientes": null, // sempre liberado
  "/veiculos": null, // sempre liberado
  "/agendamentos": "agendamentoOnline",
  "/estoque": "estoque",
  "/financeiro": "financeiro",
  "/servicos": null, // sempre liberado
  "/equipe": null, // sempre liberado (mas tem limite de quantidade)
};

/**
 * Verifica se uma rota está liberada para o plano
 */
export function isRouteAllowed(planId: PlanType, route: string): boolean {
  const feature = ROUTE_FEATURE_MAP[route];
  
  // Rota não tem restrição
  if (feature === null || feature === undefined) return true;
  
  return hasFeature(planId, feature);
}

