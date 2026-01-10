"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Crown,
  Check,
  X,
  Zap,
  Star,
  Loader2,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Clock,
  Users,
  FileText,
  ExternalLink,
  Sparkles,
  Shield,
  TrendingUp,
} from "lucide-react";

interface Plan {
  id: string;
  name: string;
  priceDisplay: string;
  limits: {
    osPerMonth: number;
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
}

interface SubscriptionData {
  plan: Plan;
  subscription: {
    status: string;
    isActive: boolean;
    isInTrial: boolean;
    trialDaysRemaining: number;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
    hasStripeCustomer: boolean;
    hasSubscription: boolean;
  };
  usage: {
    osThisMonth: number;
    osLimit: number | string;
    osPercentage: number;
    usersCount: number;
    userLimit: number | string;
  };
}

const PLANS_DISPLAY = [
  {
    id: "STARTER",
    name: "Starter",
    description: "Para quem está começando",
    price: 0,
    priceDisplay: "Grátis",
    badge: null,
    popular: false,
    features: [
      { name: "Dashboard básico", included: true },
      { name: "Kanban do pátio", included: true },
      { name: "Cadastro de clientes", included: true },
      { name: "Até 30 OSs/mês", included: true },
      { name: "1 usuário", included: true },
      { name: "Agendamento online", included: false },
      { name: "Controle de estoque", included: false },
      { name: "Financeiro completo", included: false },
      { name: "WhatsApp API", included: false },
      { name: "Fidelidade/Cashback", included: false },
    ],
  },
  {
    id: "PRO",
    name: "Profissional",
    description: "Para lava-rápidos em crescimento",
    price: 4790,
    priceDisplay: "R$ 47,90",
    badge: "Mais Popular",
    popular: true,
    features: [
      { name: "Tudo do Starter +", included: true, highlight: true },
      { name: "Agendamento online 24h", included: true },
      { name: "Controle de estoque", included: true },
      { name: "Alertas de estoque baixo", included: true },
      { name: "Até 150 OSs/mês", included: true },
      { name: "3 usuários", included: true },
      { name: "WhatsApp API", included: true },
      { name: "Financeiro completo", included: false },
      { name: "Fidelidade/Cashback", included: false },
      { name: "Multi-unidades", included: false },
    ],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    description: "Para operações profissionais",
    price: 9790,
    priceDisplay: "R$ 97,90",
    badge: "Completo",
    popular: false,
    features: [
      { name: "Tudo do Pro +", included: true, highlight: true },
      { name: "OSs ilimitadas", included: true },
      { name: "Usuários ilimitados", included: true },
      { name: "Financeiro completo", included: true },
      { name: "Programa de fidelidade", included: true },
      { name: "Cashback automático", included: true },
      { name: "Relatórios avançados", included: true },
      { name: "Multi-unidades", included: true },
      { name: "Suporte prioritário", included: true },
      { name: "Tudo liberado!", included: true },
    ],
  },
];

export default function PlanosPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/assinatura");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Erro ao buscar assinatura:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  async function handleCheckout(planId: string) {
    setCheckoutLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erro ao iniciar checkout");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setCheckoutLoading(null);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erro ao abrir portal");
      }
    } catch (error) {
      console.error("Erro no portal:", error);
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  const currentPlanId = subscription?.plan.id || "STARTER";
  const isActive = subscription?.subscription.isActive || false;
  const isInTrial = subscription?.subscription.isInTrial || false;
  const trialDays = subscription?.subscription.trialDaysRemaining || 0;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
          <Crown className="w-4 h-4" />
          <span>Planos e Preços</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">
          Escolha o Plano Ideal Para Seu Negócio
        </h1>
        <p className="text-slate-500">
          Comece grátis e faça upgrade quando precisar. Cancele a qualquer momento.
        </p>
      </div>

      {/* Trial Banner */}
      {isInTrial && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900">
              Você está no período de teste gratuito
            </h3>
            <p className="text-amber-700 text-sm">
              Restam <strong>{trialDays} dias</strong> de acesso completo. Assine agora para não perder nenhuma funcionalidade!
            </p>
          </div>
        </div>
      )}

      {/* Current Usage */}
      {subscription && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
            Seu Uso Este Mês
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* OSs */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Ordens de Serviço
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {subscription.usage.osThisMonth} / {subscription.usage.osLimit}
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    subscription.usage.osPercentage > 80
                      ? "bg-red-500"
                      : subscription.usage.osPercentage > 50
                      ? "bg-amber-500"
                      : "bg-cyan-500"
                  }`}
                  style={{ width: `${Math.min(subscription.usage.osPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Usuários */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    Usuários
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {subscription.usage.usersCount} / {subscription.usage.userLimit}
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{
                    width:
                      subscription.usage.userLimit === "Ilimitado"
                        ? "10%"
                        : `${Math.min(
                            (subscription.usage.usersCount /
                              (subscription.usage.userLimit as number)) *
                              100,
                            100
                          )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {PLANS_DISPLAY.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const isUpgrade = PLANS_DISPLAY.findIndex((p) => p.id === plan.id) >
            PLANS_DISPLAY.findIndex((p) => p.id === currentPlanId);

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all ${
                plan.popular
                  ? "border-cyan-500 shadow-lg shadow-cyan-500/10"
                  : isCurrentPlan
                  ? "border-emerald-500"
                  : "border-slate-200"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white ${
                    plan.popular
                      ? "bg-cyan-500"
                      : "bg-slate-700"
                  } rounded-bl-xl`}
                >
                  {plan.badge}
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute top-0 left-0 px-3 py-1 text-xs font-bold text-white bg-emerald-500 rounded-br-xl">
                  Plano Atual
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800">
                    {plan.name}
                  </h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">
                      {plan.priceDisplay}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-slate-500 text-sm">/mês</span>
                    )}
                  </div>
                  {plan.price > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      7 dias grátis para testar
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <div className="mb-6">
                  {isCurrentPlan ? (
                    subscription?.subscription.hasSubscription ? (
                      <button
                        onClick={handlePortal}
                        disabled={portalLoading}
                        className="w-full py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                      >
                        {portalLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Gerenciar Assinatura
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Plano Ativo
                      </button>
                    )
                  ) : plan.price === 0 ? (
                    <button
                      disabled
                      className="w-full py-3 bg-slate-100 text-slate-500 font-semibold rounded-xl cursor-not-allowed"
                    >
                      Plano Gratuito
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={checkoutLoading !== null}
                      className={`w-full py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      {checkoutLoading === plan.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {isUpgrade ? "Fazer Upgrade" : "Assinar"}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 ${
                        feature.highlight ? "font-medium" : ""
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={
                          feature.included ? "text-slate-700" : "text-slate-400"
                        }
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-cyan-500" />
          Perguntas Frequentes
        </h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">
              Posso cancelar a qualquer momento?
            </h3>
            <p className="text-slate-600">
              Sim! Você pode cancelar sua assinatura quando quiser. Você continuará
              tendo acesso até o fim do período já pago.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">
              O que acontece se eu ultrapassar o limite de OSs?
            </h3>
            <p className="text-slate-600">
              Você receberá um aviso e poderá fazer upgrade para um plano maior.
              Não se preocupe, suas OSs existentes não serão afetadas.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">
              Como funciona o trial de 7 dias?
            </h3>
            <p className="text-slate-600">
              Ao assinar um plano pago, você tem 7 dias para testar gratuitamente.
              Se cancelar antes do fim do trial, não será cobrado.
            </p>
          </div>
        </div>
      </div>

      {/* Manage Subscription Link */}
      {subscription?.subscription.hasSubscription && (
        <div className="text-center">
          <button
            onClick={handlePortal}
            disabled={portalLoading}
            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
          >
            {portalLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                Gerenciar pagamentos, faturas e cancelamento
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

