// ============================================
// HELPERS DE VERIFICAÇÃO DE ASSINATURA
// ============================================

import { prisma } from "@/lib/prisma";
import { PLANS, PlanType, hasFeature, FeatureKey, isOsLimitReached, isUserLimitReached } from "@/lib/plans";

export interface SubscriptionCheck {
  isValid: boolean;
  plan: PlanType;
  message?: string;
}

/**
 * Verifica se o lava jato tem acesso a uma funcionalidade
 */
export async function checkFeatureAccess(
  lavaJatoId: string,
  feature: FeatureKey
): Promise<SubscriptionCheck> {
  const lavaJato = await prisma.lavaJato.findUnique({
    where: { id: lavaJatoId },
    select: {
      plano: true,
      stripeStatus: true,
      trialEndsAt: true,
    },
  });

  if (!lavaJato) {
    return { isValid: false, plan: "STARTER", message: "Lava jato não encontrado" };
  }

  const planId = lavaJato.plano as PlanType;
  
  // Verificar se a assinatura está ativa (para planos pagos)
  if (planId !== "STARTER") {
    const isActive = 
      lavaJato.stripeStatus === "active" || 
      lavaJato.stripeStatus === "trialing" ||
      (lavaJato.trialEndsAt && new Date(lavaJato.trialEndsAt) > new Date());
    
    if (!isActive) {
      return { 
        isValid: false, 
        plan: planId, 
        message: "Sua assinatura expirou. Renove para continuar usando esta funcionalidade." 
      };
    }
  }

  // Verificar se o plano tem acesso à funcionalidade
  if (!hasFeature(planId, feature)) {
    const planName = PLANS[planId]?.name || planId;
    return { 
      isValid: false, 
      plan: planId, 
      message: `Esta funcionalidade não está disponível no plano ${planName}. Faça upgrade para desbloquear.` 
    };
  }

  return { isValid: true, plan: planId };
}

/**
 * Verifica se pode criar mais OSs no mês
 */
export async function checkOsLimit(lavaJatoId: string): Promise<SubscriptionCheck> {
  const lavaJato = await prisma.lavaJato.findUnique({
    where: { id: lavaJatoId },
    select: {
      plano: true,
      _count: {
        select: {
          ordens: {
            where: {
              dataEntrada: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              },
            },
          },
        },
      },
    },
  });

  if (!lavaJato) {
    return { isValid: false, plan: "STARTER", message: "Lava jato não encontrado" };
  }

  const planId = lavaJato.plano as PlanType;
  const currentCount = lavaJato._count.ordens;
  const plan = PLANS[planId];
  const limit = plan?.limits.osPerMonth || 30;

  if (isOsLimitReached(planId, currentCount)) {
    return { 
      isValid: false, 
      plan: planId, 
      message: `Você atingiu o limite de ${limit} OSs deste mês. Faça upgrade para criar mais.` 
    };
  }

  return { isValid: true, plan: planId };
}

/**
 * Verifica se pode adicionar mais usuários
 */
export async function checkUserLimit(lavaJatoId: string): Promise<SubscriptionCheck> {
  const lavaJato = await prisma.lavaJato.findUnique({
    where: { id: lavaJatoId },
    select: {
      plano: true,
      _count: {
        select: {
          usuarios: true,
        },
      },
    },
  });

  if (!lavaJato) {
    return { isValid: false, plan: "STARTER", message: "Lava jato não encontrado" };
  }

  const planId = lavaJato.plano as PlanType;
  const currentCount = lavaJato._count.usuarios;
  const plan = PLANS[planId];
  const limit = plan?.limits.usuarios || 1;

  if (isUserLimitReached(planId, currentCount)) {
    return { 
      isValid: false, 
      plan: planId, 
      message: `Você atingiu o limite de ${limit} usuário(s). Faça upgrade para adicionar mais.` 
    };
  }

  return { isValid: true, plan: planId };
}

/**
 * Retorna o plano atual do lava jato
 */
export async function getCurrentPlan(lavaJatoId: string): Promise<PlanType> {
  const lavaJato = await prisma.lavaJato.findUnique({
    where: { id: lavaJatoId },
    select: { plano: true },
  });

  return (lavaJato?.plano as PlanType) || "STARTER";
}

