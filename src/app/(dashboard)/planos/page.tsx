"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Crown,
  Check,
  X,
  Loader2,
  CreditCard,
  ArrowRight,
  Clock,
  Users,
  FileText,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Gift,
  Star,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Rocket,
  Calendar,
  Package,
  DollarSign,
  MessageCircle,
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

type BillingInterval = "monthly" | "yearly";

// Benefícios destacados do plano PRO
const proBenefits = [
  { icon: Calendar, title: "Agendamento 24h", desc: "Clientes agendam sozinhos" },
  { icon: Package, title: "Controle de Estoque", desc: "Nunca fique sem produtos" },
  { icon: MessageCircle, title: "WhatsApp API", desc: "Notificações automáticas" },
  { icon: Users, title: "3 Usuários", desc: "Toda equipe no sistema" },
];

// FAQ items
const faqItems = [
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Cancele quando quiser. Você mantém acesso até o fim do período pago.",
  },
  {
    question: "Como funciona o trial de 7 dias?",
    answer: "Teste gratuitamente por 7 dias. Se cancelar antes, não paga nada.",
  },
  {
    question: "E se eu ultrapassar o limite?",
    answer: "Você recebe um aviso e pode fazer upgrade. Suas OSs não são afetadas.",
  },
  {
    question: "Qual a diferença mensal/anual?",
    answer: "No anual você economiza até 5 meses! Paga uma vez e usa o ano todo.",
  },
];

export default function PlanosPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showAllPlans, setShowAllPlans] = useState(false);

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
        body: JSON.stringify({ planId, interval: billingInterval }),
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
  const isInTrial = subscription?.subscription.isInTrial || false;
  const trialDays = subscription?.subscription.trialDaysRemaining || 0;
  const isProOrHigher = currentPlanId === "PRO" || currentPlanId === "PREMIUM";

  return (
    <>
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden min-h-screen bg-slate-50 pb-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 text-white px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-cyan-300 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Experimente 7 dias grátis</span>
            </div>
            
            <h1 className="text-2xl font-bold mb-2">
              Profissionalize Seu Lava Jato
            </h1>
            <p className="text-slate-300 text-sm">
              Automatize agendamentos, controle estoque e fidelize clientes.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-400">+500 lava-rápidos usam</p>
            </div>
          </div>
        </div>

        {/* Trial Banner */}
        {isInTrial && (
          <div className="mx-4 -mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-4 shadow-lg relative z-10">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8" />
              <div>
                <p className="font-bold">Período de Teste Ativo</p>
                <p className="text-sm opacity-90">
                  Restam <strong>{trialDays} dias</strong> grátis
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Usage (se tiver assinatura) */}
        {subscription && currentPlanId !== "STARTER" && (
          <div className="mx-4 mt-4 bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-semibold text-slate-800">Seu Uso</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">OSs este mês</p>
                <p className="text-lg font-bold text-slate-800">
                  {subscription.usage.osThisMonth}/{subscription.usage.osLimit}
                </p>
                <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      subscription.usage.osPercentage > 80 ? "bg-red-500" : "bg-cyan-500"
                    }`}
                    style={{ width: `${Math.min(subscription.usage.osPercentage, 100)}%` }}
                  />
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Usuários</p>
                <p className="text-lg font-bold text-slate-800">
                  {subscription.usage.usersCount}/{subscription.usage.userLimit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main CTA - Plano PRO */}
        <div className="px-4 mt-6">
          {/* PRO Card - Destaque Principal */}
          <div className="bg-white rounded-2xl border-2 border-cyan-500 shadow-xl shadow-cyan-500/10 overflow-hidden relative">
            {/* Badge */}
            <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              ⭐ MAIS POPULAR
            </div>

            {currentPlanId === "PRO" && (
              <div className="absolute top-0 left-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-br-xl">
                ✓ Atual
              </div>
            )}

            <div className="p-5">
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Plano Profissional</h2>
                <p className="text-slate-500 text-sm">Tudo que seu lava jato precisa</p>
              </div>

              {/* Preço */}
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">R$ 47,90</span>
                  <span className="text-slate-500">/mês</span>
                </div>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  💳 7 dias grátis para testar
                </p>
              </div>

              {/* Benefícios visuais */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {proBenefits.map((benefit, i) => (
                  <div key={i} className="bg-cyan-50 rounded-xl p-3">
                    <benefit.icon className="w-5 h-5 text-cyan-600 mb-1" />
                    <p className="text-sm font-semibold text-slate-800">{benefit.title}</p>
                    <p className="text-xs text-slate-500">{benefit.desc}</p>
                  </div>
                ))}
              </div>

              {/* Features List */}
              <div className="space-y-2 mb-5">
                {[
                  "Até 150 OSs por mês",
                  "Dashboard completo",
                  "Kanban do pátio",
                  "Alertas de estoque baixo",
                  "Cadastro de clientes ilimitado",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              {currentPlanId === "PRO" ? (
                subscription?.subscription.hasSubscription ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="w-full py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    {portalLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Gerenciar Assinatura
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full py-4 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-center flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Plano Ativo
                  </div>
                )
              ) : (
                <button
                  onClick={() => handleCheckout("PRO")}
                  disabled={checkoutLoading !== null}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  {checkoutLoading === "PRO" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      Começar Agora - 7 Dias Grátis
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Garantia */}
            <div className="bg-slate-50 px-5 py-3 flex items-center justify-center gap-2 border-t border-slate-100">
              <Shield className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500">Cancele quando quiser, sem multa</span>
            </div>
          </div>

          {/* Toggle para ver outros planos */}
          <button
            onClick={() => setShowAllPlans(!showAllPlans)}
            className="w-full mt-4 py-3 text-slate-600 font-medium flex items-center justify-center gap-2"
          >
            {showAllPlans ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Ocultar outros planos
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Ver todos os planos
              </>
            )}
          </button>

          {/* Outros planos (colapsável) */}
          {showAllPlans && (
            <div className="space-y-4 mt-4 animate-slide-in">
              {/* Starter */}
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">Starter</h3>
                    <p className="text-xs text-slate-500">Para começar</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-800">Grátis</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["30 OSs/mês", "1 usuário", "Kanban básico"].map((f, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
                {currentPlanId === "STARTER" ? (
                  <div className="py-2 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg text-center">
                    ✓ Plano Atual
                  </div>
                ) : (
                  <div className="py-2 bg-slate-100 text-slate-500 text-sm font-medium rounded-lg text-center">
                    Plano Gratuito
                  </div>
                )}
              </div>

              {/* Premium */}
              <div className="bg-white rounded-xl border-2 border-amber-200 p-4 relative">
                <div className="absolute -top-2 right-4 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  COMPLETO
                </div>
                {currentPlanId === "PREMIUM" && (
                  <div className="absolute -top-2 left-4 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    ✓ Atual
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800">Premium</h3>
                    <p className="text-xs text-slate-500">Operação profissional</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-800">R$ 97,90</span>
                    <span className="text-xs text-slate-500">/mês</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["OSs ilimitadas", "Usuários ilimitados", "Financeiro", "Fidelidade"].map((f, i) => (
                    <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
                {currentPlanId === "PREMIUM" ? (
                  subscription?.subscription.hasSubscription ? (
                    <button
                      onClick={handlePortal}
                      disabled={portalLoading}
                      className="w-full py-2 border-2 border-slate-200 text-slate-700 font-medium rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gerenciar"}
                    </button>
                  ) : (
                    <div className="py-2 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg text-center">
                      ✓ Plano Ativo
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => handleCheckout("PREMIUM")}
                    disabled={checkoutLoading !== null}
                    className="w-full py-2 bg-amber-500 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  >
                    {checkoutLoading === "PREMIUM" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>Assinar Premium</>
                    )}
                  </button>
                )}
              </div>

              {/* Toggle Anual */}
              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-emerald-600" />
                  <div className="flex-1">
                    <p className="font-bold text-emerald-800">Economize com o Anual!</p>
                    <p className="text-sm text-emerald-600">
                      PRO: R$ 39,92/mês (2 meses grátis)
                    </p>
                    <p className="text-sm text-emerald-600">
                      Premium: R$ 56,58/mês (5 meses grátis!)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Garantias */}
        <div className="px-4 mt-8">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
              <Shield className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
              <p className="text-xs font-medium text-slate-800">Pagamento Seguro</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
              <Zap className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
              <p className="text-xs font-medium text-slate-800">Ativação Imediata</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
              <Clock className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
              <p className="text-xs font-medium text-slate-800">7 Dias Grátis</p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="px-4 mt-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Dúvidas Frequentes</h2>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <span className="font-medium text-slate-800 text-sm">{item.question}</span>
                  {expandedFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {expandedFaq === i && (
                  <div className="px-4 pb-3 animate-slide-in">
                    <p className="text-sm text-slate-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manage Subscription */}
        {subscription?.subscription.hasSubscription && (
          <div className="px-4 mt-8 text-center">
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="inline-flex items-center gap-2 text-cyan-600 font-medium text-sm"
            >
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ExternalLink className="w-4 h-4" />
                  Gerenciar pagamentos e faturas
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-6 space-y-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-600 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <Crown className="w-4 h-4" />
            <span>Planos e Preços</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Escolha o Plano Ideal Para Seu Negócio
          </h1>
          <p className="text-slate-500">
            Comece com 7 dias grátis e faça upgrade quando precisar. Cancele a qualquer momento.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-slate-100 p-1 rounded-xl inline-flex items-center gap-1">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingInterval === "monthly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingInterval("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billingInterval === "yearly"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Anual
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                Economize até 42%
              </span>
            </button>
          </div>
        </div>

        {/* Trial Banner */}
        {isInTrial && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 max-w-3xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900">Período de Teste Ativo</h3>
              <p className="text-amber-700 text-sm">
                Restam <strong>{trialDays} dias</strong> de acesso completo. Assine agora para garantir!
              </p>
            </div>
          </div>
        )}

        {/* Current Usage */}
        {subscription && currentPlanId !== "STARTER" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-3xl mx-auto">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              Seu Uso Este Mês
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Ordens de Serviço</span>
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
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Usuários</span>
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
                              (subscription.usage.usersCount / (subscription.usage.userLimit as number)) * 100,
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
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Starter */}
          <div className={`bg-white rounded-2xl border-2 overflow-hidden ${currentPlanId === "STARTER" ? "border-emerald-500" : "border-slate-200"}`}>
            {currentPlanId === "STARTER" && (
              <div className="bg-emerald-500 text-white text-xs font-bold text-center py-1">
                ✓ Plano Atual
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800">Starter</h3>
              <p className="text-slate-500 text-sm mb-4">Para quem está começando</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-slate-900">Grátis</span>
              </div>
              <button disabled className="w-full py-3 bg-slate-100 text-slate-500 font-semibold rounded-xl cursor-not-allowed mb-6">
                Plano Gratuito
              </button>
              <ul className="space-y-3">
                {["Dashboard básico", "Kanban do pátio", "Cadastro de clientes", "Até 30 OSs/mês", "1 usuário"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">{f}</span>
                  </li>
                ))}
                {["Agendamento online", "Controle de estoque", "Financeiro", "WhatsApp API"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <X className="w-5 h-5 text-slate-300" />
                    <span className="text-slate-400">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PRO - Destaque */}
          <div className={`bg-white rounded-2xl border-2 overflow-hidden shadow-xl relative ${currentPlanId === "PRO" ? "border-emerald-500" : "border-cyan-500"} shadow-cyan-500/10`}>
            <div className="bg-cyan-500 text-white text-xs font-bold text-center py-1">
              {currentPlanId === "PRO" ? "✓ Plano Atual" : "⭐ MAIS POPULAR"}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800">Profissional</h3>
              <p className="text-slate-500 text-sm mb-4">Para lava-rápidos em crescimento</p>
              <div className="mb-6">
                {billingInterval === "yearly" ? (
                  <>
                    <span className="text-3xl font-bold text-slate-900">R$ 39,92</span>
                    <span className="text-slate-500">/mês</span>
                    <p className="text-xs text-slate-400 mt-1">R$ 479,00/ano</p>
                    <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                      <Gift className="w-3 h-3" />
                      2 meses grátis
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-slate-900">R$ 47,90</span>
                    <span className="text-slate-500">/mês</span>
                    <p className="text-xs text-emerald-600 mt-1">7 dias grátis para testar</p>
                  </>
                )}
              </div>
              {currentPlanId === "PRO" ? (
                subscription?.subscription.hasSubscription ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="w-full py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 mb-6"
                  >
                    {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Gerenciar</>}
                  </button>
                ) : (
                  <div className="w-full py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-center mb-6 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Plano Ativo
                  </div>
                )
              ) : (
                <button
                  onClick={() => handleCheckout("PRO")}
                  disabled={checkoutLoading !== null}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mb-6 hover:shadow-cyan-500/30 transition-all"
                >
                  {checkoutLoading === "PRO" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4" /> Começar Agora</>}
                </button>
              )}
              <ul className="space-y-3">
                {["Tudo do Starter +", "Agendamento online 24h", "Controle de estoque", "Alertas de estoque baixo", "Até 150 OSs/mês", "3 usuários", "WhatsApp API"].map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 ${i === 0 ? "font-medium" : ""}`}>
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium */}
          <div className={`bg-white rounded-2xl border-2 overflow-hidden ${currentPlanId === "PREMIUM" ? "border-emerald-500" : "border-amber-300"}`}>
            <div className={`text-white text-xs font-bold text-center py-1 ${currentPlanId === "PREMIUM" ? "bg-emerald-500" : "bg-amber-500"}`}>
              {currentPlanId === "PREMIUM" ? "✓ Plano Atual" : "COMPLETO"}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800">Premium</h3>
              <p className="text-slate-500 text-sm mb-4">Para operações profissionais</p>
              <div className="mb-6">
                {billingInterval === "yearly" ? (
                  <>
                    <span className="text-3xl font-bold text-slate-900">R$ 56,58</span>
                    <span className="text-slate-500">/mês</span>
                    <p className="text-xs text-slate-400 mt-1">R$ 679,00/ano</p>
                    <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                      <Gift className="w-3 h-3" />
                      5 meses grátis!
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-slate-900">R$ 97,90</span>
                    <span className="text-slate-500">/mês</span>
                    <p className="text-xs text-emerald-600 mt-1">7 dias grátis para testar</p>
                  </>
                )}
              </div>
              {currentPlanId === "PREMIUM" ? (
                subscription?.subscription.hasSubscription ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="w-full py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 mb-6"
                  >
                    {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Gerenciar</>}
                  </button>
                ) : (
                  <div className="w-full py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-center mb-6 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Plano Ativo
                  </div>
                )
              ) : (
                <button
                  onClick={() => handleCheckout("PREMIUM")}
                  disabled={checkoutLoading !== null}
                  className="w-full py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 flex items-center justify-center gap-2 mb-6 transition-all"
                >
                  {checkoutLoading === "PREMIUM" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ArrowRight className="w-4 h-4" /> Fazer Upgrade</>}
                </button>
              )}
              <ul className="space-y-3">
                {["Tudo do Pro +", "OSs ilimitadas", "Usuários ilimitados", "Financeiro completo", "Programa de fidelidade", "Cashback automático", "Relatórios avançados", "Multi-unidades", "Suporte prioritário"].map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 ${i === 0 ? "font-medium" : ""}`}>
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>
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
    </>
  );
}
