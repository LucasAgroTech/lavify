"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  ChevronLeft,
  ChevronRight,
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
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Começa no PRO (índice 1)
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Centraliza no plano PRO ao carregar (mobile)
  useEffect(() => {
    if (!loading && carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85;
      carouselRef.current.scrollTo({
        left: cardWidth, // Índice 1 (PRO)
        behavior: "auto",
      });
    }
  }, [loading]);

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

        {/* Swipe Hint */}
        <div className="flex items-center justify-center gap-2 mt-6 mb-2 text-slate-500">
          <ChevronLeft className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-medium">Arraste para ver todos os planos</span>
          <ChevronRight className="w-4 h-4 animate-pulse" />
        </div>

        {/* Indicadores */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {["STARTER", "PRO", "PREMIUM"].map((planId, i) => (
            <button
              key={planId}
              onClick={() => {
                setActiveCardIndex(i);
                carouselRef.current?.scrollTo({
                  left: i * (carouselRef.current.offsetWidth * 0.85),
                  behavior: "smooth",
                });
              }}
              className={`h-2 rounded-full transition-all ${
                activeCardIndex === i
                  ? i === 1
                    ? "w-8 bg-cyan-500"
                    : i === 2
                    ? "w-8 bg-amber-500"
                    : "w-8 bg-slate-400"
                  : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Carrossel de Planos */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            const scrollLeft = target.scrollLeft;
            const cardWidth = target.offsetWidth * 0.85;
            const newIndex = Math.round(scrollLeft / cardWidth);
            if (newIndex !== activeCardIndex && newIndex >= 0 && newIndex <= 2) {
              setActiveCardIndex(newIndex);
            }
          }}
        >
          {/* Card STARTER */}
          <div className={`flex-shrink-0 w-[85%] snap-center bg-white rounded-2xl border-2 overflow-hidden ${
            currentPlanId === "STARTER" ? "border-emerald-500" : "border-slate-200"
          }`}>
            {currentPlanId === "STARTER" && (
              <div className="bg-emerald-500 text-white text-xs font-bold text-center py-1.5">
                ✓ Plano Atual
              </div>
            )}
            <div className="p-5">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Starter</h2>
                <p className="text-slate-500 text-sm">Para quem está começando</p>
              </div>

              <div className="mb-5">
                <span className="text-4xl font-bold text-slate-900">Grátis</span>
              </div>

              <div className="space-y-2 mb-5">
                {["Dashboard básico", "Kanban do pátio", "Cadastro de clientes", "Até 30 OSs/mês", "1 usuário"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
                {["Agendamento online", "Controle de estoque", "WhatsApp API"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <X className="w-4 h-4 text-slate-300" />
                    <span className="text-sm text-slate-400">{feature}</span>
                  </div>
                ))}
              </div>

              <button disabled className="w-full py-4 bg-slate-100 text-slate-500 font-semibold rounded-xl cursor-not-allowed">
                Plano Gratuito
              </button>
            </div>
          </div>

          {/* Card PRO - Destaque */}
          <div className={`flex-shrink-0 w-[85%] snap-center bg-white rounded-2xl border-2 shadow-xl overflow-hidden ${
            currentPlanId === "PRO" ? "border-emerald-500" : "border-cyan-500"
          } shadow-cyan-500/10`}>
            <div className={`text-white text-xs font-bold text-center py-1.5 ${
              currentPlanId === "PRO" ? "bg-emerald-500" : "bg-cyan-500"
            }`}>
              {currentPlanId === "PRO" ? "✓ Plano Atual" : "⭐ MAIS POPULAR"}
            </div>
            <div className="p-5">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Profissional</h2>
                <p className="text-slate-500 text-sm">Tudo que seu lava jato precisa</p>
              </div>

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
              <div className="grid grid-cols-2 gap-2 mb-4">
                {proBenefits.map((benefit, i) => (
                  <div key={i} className="bg-cyan-50 rounded-lg p-2">
                    <benefit.icon className="w-4 h-4 text-cyan-600 mb-0.5" />
                    <p className="text-xs font-semibold text-slate-800">{benefit.title}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-5">
                {["Até 150 OSs por mês", "Dashboard completo", "Alertas de estoque baixo", "3 usuários"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              {currentPlanId === "PRO" ? (
                subscription?.subscription.hasSubscription ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="w-full py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    {portalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Gerenciar</>}
                  </button>
                ) : (
                  <div className="w-full py-4 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-center flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Plano Ativo
                  </div>
                )
              ) : (
                <button
                  onClick={() => handleCheckout("PRO")}
                  disabled={checkoutLoading !== null}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  {checkoutLoading === "PRO" ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Rocket className="w-5 h-5" /> Começar Agora</>}
                </button>
              )}
            </div>
            <div className="bg-slate-50 px-5 py-2 flex items-center justify-center gap-2 border-t border-slate-100">
              <Shield className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] text-slate-500">Cancele quando quiser</span>
            </div>
          </div>

          {/* Card PREMIUM */}
          <div className={`flex-shrink-0 w-[85%] snap-center bg-white rounded-2xl border-2 overflow-hidden ${
            currentPlanId === "PREMIUM" ? "border-emerald-500" : "border-amber-300"
          }`}>
            <div className={`text-white text-xs font-bold text-center py-1.5 ${
              currentPlanId === "PREMIUM" ? "bg-emerald-500" : "bg-amber-500"
            }`}>
              {currentPlanId === "PREMIUM" ? "✓ Plano Atual" : "👑 COMPLETO"}
            </div>
            <div className="p-5">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-800">Premium</h2>
                <p className="text-slate-500 text-sm">Operação profissional</p>
              </div>

              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">R$ 97,90</span>
                  <span className="text-slate-500">/mês</span>
                </div>
                <p className="text-xs text-emerald-600 font-medium mt-1">
                  💳 7 dias grátis para testar
                </p>
              </div>

              <div className="space-y-2 mb-5">
                {[
                  "Tudo do Pro +",
                  "OSs ilimitadas",
                  "Usuários ilimitados",
                  "Financeiro completo",
                  "Programa de fidelidade",
                  "Cashback automático",
                  "Multi-unidades",
                  "Suporte prioritário",
                ].map((feature, i) => (
                  <div key={i} className={`flex items-center gap-2 ${i === 0 ? "font-medium" : ""}`}>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              {currentPlanId === "PREMIUM" ? (
                subscription?.subscription.hasSubscription ? (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="w-full py-4 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    {portalLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Gerenciar</>}
                  </button>
                ) : (
                  <div className="w-full py-4 bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-center flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Plano Ativo
                  </div>
                )
              ) : (
                <button
                  onClick={() => handleCheckout("PREMIUM")}
                  disabled={checkoutLoading !== null}
                  className="w-full py-4 bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  {checkoutLoading === "PREMIUM" ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Crown className="w-5 h-5" /> Assinar Premium</>}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dica de Economia Anual */}
        <div className="mx-4 mt-2 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-800 text-sm">💰 Economize com o Anual!</p>
              <p className="text-xs text-emerald-600">PRO: R$ 39,92/mês • Premium: R$ 56,58/mês</p>
            </div>
          </div>
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
      <div className="hidden lg:block p-6 xl:p-8 min-h-screen bg-slate-50">
        <div className="max-w-[1200px] mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Planos e Preços</h1>
              <p className="text-slate-500 text-sm mt-0.5">Escolha o plano ideal para seu negócio</p>
            </div>
            
            {/* Billing Toggle */}
            <div className="bg-white border border-slate-200 p-1 rounded-lg inline-flex items-center gap-1">
              <button
                onClick={() => setBillingInterval("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingInterval === "monthly"
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingInterval("yearly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  billingInterval === "yearly"
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Anual
                <span className={`text-xs px-1.5 py-0.5 rounded ${billingInterval === "yearly" ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                  -42%
                </span>
              </button>
            </div>
          </div>

          {/* Trial Banner */}
          {isInTrial && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Período de Teste Ativo</p>
                <p className="text-amber-700 text-sm">
                  Restam <strong>{trialDays} dias</strong> de acesso completo
                </p>
              </div>
            </div>
          )}

          {/* Current Usage */}
          {subscription && currentPlanId !== "STARTER" && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-500" />
                <h2 className="font-semibold text-slate-800">Seu Uso Este Mês</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Ordens de Serviço</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {subscription.usage.osThisMonth} / {subscription.usage.osLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        subscription.usage.osPercentage > 80 ? "bg-red-500" : "bg-cyan-500"
                      }`}
                      style={{ width: `${Math.min(subscription.usage.osPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Usuários</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {subscription.usage.usersCount} / {subscription.usage.userLimit}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{
                        width: subscription.usage.userLimit === "Ilimitado" ? "10%" : `${Math.min((subscription.usage.usersCount / (subscription.usage.userLimit as number)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Starter */}
            <div className={`bg-white rounded-xl border-2 overflow-hidden ${currentPlanId === "STARTER" ? "border-emerald-500" : "border-slate-200"}`}>
              {currentPlanId === "STARTER" && (
                <div className="bg-emerald-500 text-white text-xs font-bold text-center py-1.5">
                  ✓ Plano Atual
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800">Starter</h3>
                <p className="text-slate-500 text-sm mb-4">Para quem está começando</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">Grátis</span>
                </div>

                <button disabled className="w-full py-2.5 bg-slate-100 text-slate-500 font-medium rounded-lg cursor-not-allowed mb-6 text-sm">
                  Plano Gratuito
                </button>

                <div className="space-y-3">
                  {["Dashboard básico", "Kanban do pátio", "Cadastro de clientes", "Até 30 OSs/mês", "1 usuário"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{f}</span>
                    </div>
                  ))}
                  {["Agendamento online", "Controle de estoque", "Financeiro", "WhatsApp API"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <X className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      <span className="text-slate-400">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PRO - Destaque */}
            <div className={`bg-white rounded-xl border-2 overflow-hidden shadow-lg relative ${currentPlanId === "PRO" ? "border-emerald-500" : "border-cyan-500"}`}>
              <div className={`text-white text-xs font-bold text-center py-1.5 ${currentPlanId === "PRO" ? "bg-emerald-500" : "bg-cyan-500"}`}>
                {currentPlanId === "PRO" ? "✓ Plano Atual" : "⭐ MAIS POPULAR"}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800">Profissional</h3>
                <p className="text-slate-500 text-sm mb-4">Tudo que seu lava-rápido precisa</p>
                
                <div className="mb-6">
                  {billingInterval === "yearly" ? (
                    <>
                      <span className="text-3xl font-bold text-slate-900">R$ 39,92</span>
                      <span className="text-slate-500 text-sm">/mês</span>
                      <p className="text-xs text-slate-400 mt-1">R$ 479,00/ano</p>
                      <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded">
                        <Gift className="w-3 h-3" />
                        2 meses grátis
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-slate-900">R$ 47,90</span>
                      <span className="text-slate-500 text-sm">/mês</span>
                      <p className="text-xs text-emerald-600 mt-1">7 dias grátis para testar</p>
                    </>
                  )}
                </div>

                {currentPlanId === "PRO" ? (
                  subscription?.subscription.hasSubscription ? (
                    <button
                      onClick={handlePortal}
                      disabled={portalLoading}
                      className="w-full py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-2 mb-6 text-sm hover:bg-slate-50"
                    >
                      {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Gerenciar</>}
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-emerald-100 text-emerald-700 font-medium rounded-lg text-center mb-6 flex items-center justify-center gap-2 text-sm">
                      <Check className="w-4 h-4" /> Plano Ativo
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => handleCheckout("PRO")}
                    disabled={checkoutLoading !== null}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 mb-6 text-sm transition-colors"
                  >
                    {checkoutLoading === "PRO" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4" /> Começar Agora</>}
                  </button>
                )}

                <div className="space-y-3">
                  {["Tudo do Starter +", "Agendamento online 24h", "Controle de estoque", "Alertas de estoque", "Até 150 OSs/mês", "3 usuários", "WhatsApp API"].map((f, i) => (
                    <div key={i} className={`flex items-center gap-2.5 text-sm ${i === 0 ? "font-medium" : ""}`}>
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium */}
            <div className={`bg-white rounded-xl border-2 overflow-hidden ${currentPlanId === "PREMIUM" ? "border-emerald-500" : "border-amber-400"}`}>
              <div className={`text-white text-xs font-bold text-center py-1.5 ${currentPlanId === "PREMIUM" ? "bg-emerald-500" : "bg-amber-500"}`}>
                {currentPlanId === "PREMIUM" ? "✓ Plano Atual" : "👑 COMPLETO"}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800">Premium</h3>
                <p className="text-slate-500 text-sm mb-4">Operação profissional completa</p>
                
                <div className="mb-6">
                  {billingInterval === "yearly" ? (
                    <>
                      <span className="text-3xl font-bold text-slate-900">R$ 56,58</span>
                      <span className="text-slate-500 text-sm">/mês</span>
                      <p className="text-xs text-slate-400 mt-1">R$ 679,00/ano</p>
                      <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded">
                        <Gift className="w-3 h-3" />
                        5 meses grátis!
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-slate-900">R$ 97,90</span>
                      <span className="text-slate-500 text-sm">/mês</span>
                      <p className="text-xs text-emerald-600 mt-1">7 dias grátis para testar</p>
                    </>
                  )}
                </div>

                {currentPlanId === "PREMIUM" ? (
                  subscription?.subscription.hasSubscription ? (
                    <button
                      onClick={handlePortal}
                      disabled={portalLoading}
                      className="w-full py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg flex items-center justify-center gap-2 mb-6 text-sm hover:bg-slate-50"
                    >
                      {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Gerenciar</>}
                    </button>
                  ) : (
                    <div className="w-full py-2.5 bg-emerald-100 text-emerald-700 font-medium rounded-lg text-center mb-6 flex items-center justify-center gap-2 text-sm">
                      <Check className="w-4 h-4" /> Plano Ativo
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => handleCheckout("PREMIUM")}
                    disabled={checkoutLoading !== null}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 mb-6 text-sm transition-colors"
                  >
                    {checkoutLoading === "PREMIUM" ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Crown className="w-4 h-4" /> Assinar Premium</>}
                  </button>
                )}

                <div className="space-y-3">
                  {["Tudo do Pro +", "OSs ilimitadas", "Usuários ilimitados", "Financeiro completo", "Fidelidade e Cashback", "Multi-unidades", "Suporte prioritário"].map((f, i) => (
                    <div key={i} className={`flex items-center gap-2.5 text-sm ${i === 0 ? "font-medium" : ""}`}>
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Garantias */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="grid grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">Pagamento Seguro</p>
                  <p className="text-xs text-slate-500">Via Stripe</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">Ativação Imediata</p>
                  <p className="text-xs text-slate-500">Acesso instantâneo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">7 Dias Grátis</p>
                  <p className="text-xs text-slate-500">Teste sem compromisso</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">Cancele Quando Quiser</p>
                  <p className="text-xs text-slate-500">Sem multa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Manage Subscription Link */}
          {subscription?.subscription.hasSubscription && (
            <div className="text-center">
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 font-medium text-sm"
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
      </div>
    </>
  );
}
