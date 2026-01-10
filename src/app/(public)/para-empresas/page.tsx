"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Kanban,
  Package,
  CalendarClock,
  MessageCircle,
  Building2,
  Wallet,
  Gift,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Smartphone,
  Zap,
  Target,
  Car,
  Droplets,
  Sparkles,
  CircleDollarSign,
  HeartHandshake,
  Lock,
  Crown,
  UserCog,
  Wrench,
  Play,
  X,
} from "lucide-react";

// FAQ Accordion Component - Otimizado para toque mobile
function FAQItem({
  pergunta,
  resposta,
}: {
  pergunta: string;
  resposta: string;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <button
      onClick={() => setAberto(!aberto)}
      className="w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.98] transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-semibold text-slate-800 text-[15px] leading-snug">
          {pergunta}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5 transition-transform duration-300 ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          aberto ? "max-h-96 mt-4" : "max-h-0"
        }`}
      >
        <p className="text-slate-600 text-[14px] leading-relaxed">{resposta}</p>
      </div>
    </button>
  );
}

// Feature Card para carrossel mobile
function FeatureCard({
  icon: Icon,
  titulo,
  descricao,
  destaque,
  cor,
}: {
  icon: React.ElementType;
  titulo: string;
  descricao: string;
  destaque: string;
  cor: string;
}) {
  return (
    <div className="flex-shrink-0 w-[85vw] max-w-[320px] snap-center">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cor} flex items-center justify-center mb-4 shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{titulo}</h3>
        <p className="text-slate-600 text-[14px] leading-relaxed mb-3">
          {descricao}
        </p>
        <div className="flex items-center gap-2 text-[13px] text-cyan-600 font-medium">
          <Zap className="w-4 h-4" />
          <span>{destaque}</span>
        </div>
      </div>
    </div>
  );
}

export default function LandingPageEmpresas() {
  const [videoAberto, setVideoAberto] = useState(false);

  const funcionalidades = [
    {
      icon: LayoutDashboard,
      titulo: "Dashboard em Tempo Real",
      descricao: "Veja faturamento, ticket médio e OSs do dia em uma única tela.",
      destaque: "Métricas ao vivo",
      cor: "from-cyan-500 to-blue-600",
    },
    {
      icon: Kanban,
      titulo: "Kanban Visual do Pátio",
      descricao: "Arraste cada carro entre colunas e veja seu pátio como nunca.",
      destaque: "Drag-and-drop simples",
      cor: "from-blue-500 to-indigo-600",
    },
    {
      icon: Package,
      titulo: "Estoque Inteligente",
      descricao: "Alerta antes de acabar. Saiba o custo de cada gota na OS.",
      destaque: "Abate automático",
      cor: "from-amber-500 to-orange-600",
    },
    {
      icon: CalendarClock,
      titulo: "Agendamento Online 24h",
      descricao: "Clientes agendam sozinhos, de madrugada ou feriado.",
      destaque: "Venda enquanto dorme",
      cor: "from-emerald-500 to-green-600",
    },
    {
      icon: MessageCircle,
      titulo: "WhatsApp Automático",
      descricao: "Notifique o cliente quando o carro ficar pronto em 1 clique.",
      destaque: "API oficial integrada",
      cor: "from-green-500 to-emerald-600",
    },
    {
      icon: Building2,
      titulo: "Multi-Unidades",
      descricao: "Gerencie várias lojas de um único login.",
      destaque: "Escale sem perder controle",
      cor: "from-purple-500 to-violet-600",
    },
    {
      icon: Wallet,
      titulo: "Financeiro Integrado",
      descricao: "Cada OS fechada já entra no caixa. Lucro real calculado.",
      destaque: "Feche o caixa em 2 min",
      cor: "from-emerald-500 to-teal-600",
    },
    {
      icon: Gift,
      titulo: "Fidelidade & Cashback",
      descricao: "Programas de pontos ou cashback automáticos.",
      destaque: "Aumente a recorrência",
      cor: "from-pink-500 to-rose-600",
    },
    {
      icon: Users,
      titulo: "CRM de Clientes",
      descricao: "Histórico completo: veículos, serviços, gastos, última visita.",
      destaque: "Dados que viram vendas",
      cor: "from-sky-500 to-blue-600",
    },
    {
      icon: ShieldCheck,
      titulo: "Controle de Permissões",
      descricao: "Defina o que cada funcionário pode ver e fazer.",
      destaque: "Viaje tranquilo",
      cor: "from-slate-600 to-slate-800",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION - Mobile First
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        {/* Background sutil */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative px-5 pt-8 pb-12">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[13px] font-medium px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span>Para Donos de Lava-Rápido</span>
            </div>
          </div>

          {/* Headline - Otimizada para leitura mobile */}
          <h1 className="text-[28px] sm:text-[32px] font-bold text-white text-center leading-[1.2] mb-5">
            Chega de Correr Atrás de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Planilha e Estoque
            </span>
          </h1>

          {/* Subheadline curta */}
          <p className="text-slate-300 text-center text-[15px] leading-relaxed mb-8 max-w-sm mx-auto">
            Gerencie seu pátio, estoque e financeiro em um único sistema — que
            até seu lavador vai conseguir usar.
          </p>

          {/* CTA Principal - Grande para toque fácil */}
          <div className="space-y-3">
            <Link
              href="/registro"
              className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[16px] rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-transform"
            >
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setVideoAberto(true)}
              className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-white/20 text-white font-semibold text-[15px] rounded-2xl active:scale-[0.98] transition-transform"
            >
              <Play className="w-5 h-5" />
              Ver Como Funciona
            </button>
          </div>

          {/* Trust badges em linha */}
          <div className="flex items-center justify-center gap-4 mt-8 text-[12px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sem cartão</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Setup rápido</span>
            </div>
          </div>
        </div>

        {/* Preview visual compacto - Kanban mini */}
        <div className="px-5 pb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-slate-500 text-[11px] ml-2">Kanban do Pátio</span>
            </div>

            {/* Mini Kanban */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {[
                { status: "Aguardando", cor: "bg-amber-500", placas: ["ABC-1D23", "DEF-4G56"] },
                { status: "Lavando", cor: "bg-blue-500", placas: ["GHI-7J89"] },
                { status: "Pronto", cor: "bg-emerald-500", placas: ["JKL-0M12", "NOP-3Q45", "RST-6U78"] },
              ].map((col) => (
                <div key={col.status} className="flex-shrink-0 w-[100px]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className={`w-2 h-2 rounded-full ${col.cor}`} />
                    <span className="text-slate-400 text-[10px] font-medium truncate">
                      {col.status}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {col.placas.map((placa) => (
                      <div
                        key={placa}
                        className="bg-slate-700/50 rounded-lg px-2 py-1.5 flex items-center gap-1.5"
                      >
                        <Car className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-400 text-[10px] font-mono">
                          {placa}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PAIN SECTION - Cards empilhados mobile
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 -mt-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-[13px] font-semibold text-red-600 uppercase tracking-wide">
            Você Conhece Isso?
          </h2>
        </div>

        {/* Pain cards - Stack vertical mobile */}
        <div className="space-y-3">
          {[
            {
              icon: Package,
              titulo: "Estoque acaba na hora errada",
              texto: "Shampoo termina no sábado lotado. Você só descobre quando é tarde.",
            },
            {
              icon: Car,
              titulo: "Briga pra saber qual carro está pronto",
              texto: "Cliente liga, funcionário para, ninguém sabe o status real.",
            },
            {
              icon: Clock,
              titulo: "Cliente esquece de buscar",
              texto: "Carro fica ocupando espaço, você não consegue atender novos.",
            },
          ].map((pain) => (
            <div
              key={pain.titulo}
              className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <pain.icon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-[15px] mb-1">
                  {pain.titulo}
                </h3>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {pain.texto}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Frase de transição */}
        <p className="text-center text-slate-600 text-[14px] mt-8 leading-relaxed">
          Você trabalha <span className="font-bold text-slate-900">12h por dia</span> e ainda
          sente que o negócio não roda sem você.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FUNCIONALIDADES - Carrossel horizontal mobile
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white">
        <div className="px-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-cyan-500" />
            <h2 className="text-[13px] font-semibold text-cyan-600 uppercase tracking-wide">
              A Solução
            </h2>
          </div>
          <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
            10 Ferramentas Para Profissionalizar Seu Negócio
          </h3>
          <p className="text-slate-600 text-[14px] mt-2">
            Deslize para ver todas →
          </p>
        </div>

        {/* Carrossel horizontal */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-5 pb-4 snap-x snap-mandatory">
            {funcionalidades.map((func) => (
              <FeatureCard key={func.titulo} {...func} />
            ))}
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i === 0 ? "bg-cyan-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DIFERENCIAL - Por que diferente de planilha
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-[20px] font-bold text-white leading-tight mb-2">
            Por Que é Diferente de Uma{" "}
            <span className="text-cyan-400">Planilha?</span>
          </h2>
          <p className="text-slate-400 text-[14px]">
            Planilha não pensa. Lavify trabalha por você.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              icon: AlertTriangle,
              cor: "from-amber-500 to-orange-600",
              titulo: "Alertas Proativos",
              itens: ["Estoque baixo? Aviso antes de acabar", "OS parada? Notificação na hora"],
            },
            {
              icon: Kanban,
              cor: "from-blue-500 to-indigo-600",
              titulo: "Pátio Visual",
              itens: ["Drag-and-drop que qualquer um usa", "Cores indicam status sem clicar"],
            },
            {
              icon: Package,
              cor: "from-emerald-500 to-teal-600",
              titulo: "Estoque Automático",
              itens: ["Abate produto ao fechar OS", "Custo real de cada serviço"],
            },
          ].map((item) => (
            <div
              key={item.titulo}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.cor} flex items-center justify-center`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-[16px]">{item.titulo}</h3>
              </div>
              <ul className="space-y-2">
                {item.itens.map((texto) => (
                  <li key={texto} className="flex items-center gap-2 text-slate-300 text-[14px]">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{texto}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BENEFÍCIO CLIENTE FINAL - Card visual mobile
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <HeartHandshake className="w-5 h-5 text-emerald-500" />
          <h2 className="text-[13px] font-semibold text-emerald-600 uppercase tracking-wide">
            Para Seu Cliente
          </h2>
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 leading-tight mb-6">
          Seu Cliente Também Ganha
        </h3>

        <div className="space-y-4">
          {[
            {
              icon: CalendarClock,
              cor: "from-emerald-500 to-green-600",
              titulo: "Agendamento Online",
              texto: "Página exclusiva onde agendam 24h por dia",
            },
            {
              icon: Gift,
              cor: "from-pink-500 to-rose-600",
              titulo: "Cashback Automático",
              texto: "Ganha créditos a cada visita e volta mais vezes",
            },
            {
              icon: MessageCircle,
              cor: "from-green-500 to-emerald-600",
              titulo: "Aviso no WhatsApp",
              texto: "Recebe notificação quando carro fica pronto",
            },
          ].map((item) => (
            <div key={item.titulo} className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.cor} flex items-center justify-center flex-shrink-0`}
              >
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[15px]">{item.titulo}</h4>
                <p className="text-slate-600 text-[13px]">{item.texto}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0 ml-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CONTROLE DE ACESSO - Visual simples mobile
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-slate-50">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-slate-600" />
          <h2 className="text-[13px] font-semibold text-slate-600 uppercase tracking-wide">
            Segurança
          </h2>
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 leading-tight mb-2">
          Cada Um Vê Só o Que Precisa
        </h3>
        <p className="text-slate-600 text-[14px] mb-6">
          Viaje tranquilo. O sistema controla o acesso.
        </p>

        <div className="space-y-3">
          {[
            {
              icon: Crown,
              role: "Admin",
              badge: "Você",
              badgeColor: "bg-amber-100 text-amber-700",
              acesso: "Tudo: financeiro, relatórios, config",
              cor: "from-amber-500 to-orange-600",
            },
            {
              icon: UserCog,
              role: "Gerente",
              acesso: "OSs, clientes, estoque",
              cor: "from-blue-500 to-indigo-600",
            },
            {
              icon: Wrench,
              role: "Lavador",
              acesso: "Só move carros no Kanban",
              cor: "from-slate-500 to-gray-600",
            },
          ].map((item) => (
            <div
              key={item.role}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.cor} flex items-center justify-center flex-shrink-0`}
              >
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-[15px]">{item.role}</h4>
                  {item.badge && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-[13px] truncate">{item.acesso}</p>
              </div>
              <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ - Cards expansíveis mobile
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-white">
        <h2 className="text-[20px] font-bold text-slate-900 text-center mb-6">
          Perguntas Frequentes
        </h2>

        <div className="space-y-3">
          <FAQItem
            pergunta="Preciso instalar algo no computador?"
            resposta="Não! Funciona 100% no navegador. Acesse www.lavify.com.br, faça login e pronto. Nada de instalação."
          />
          <FAQItem
            pergunta="Funciona no celular?"
            resposta="Sim! Interface feita mobile-first. Seu lavador pode arrastar carros no Kanban pelo celular, você acompanha o caixa de qualquer lugar."
          />
          <FAQItem
            pergunta="Como funciona o WhatsApp?"
            resposta="Usamos a API oficial. Quando a OS muda para 'Pronto', você clica em notificar e a mensagem sai automaticamente pelo seu número comercial."
          />
          <FAQItem
            pergunta="E se meu lavador não souber usar?"
            resposta="O Kanban é visual: arrastar carro de 'Lavando' para 'Pronto' é tão simples quanto mover um post-it. Em 10 minutos qualquer um aprende."
          />
          <FAQItem
            pergunta="Posso testar antes de pagar?"
            resposta="Sim! Crie sua conta grátis e explore tudo. Sem cartão de crédito, sem compromisso."
          />
          <FAQItem
            pergunta="Meus dados ficam seguros?"
            resposta="Dados criptografados, servidores seguros, backup diário automático. Só você e quem autorizar tem acesso."
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA FINAL - Fixo no mobile
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-bold text-white leading-tight mb-3">
            Profissionalize Seu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Lava-Rápido
            </span>
          </h2>
          <p className="text-slate-400 text-[14px]">
            Controle real do pátio, estoque e dinheiro — num sistema que seu time vai usar.
          </p>
        </div>

        <Link
          href="/registro"
          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[16px] rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-transform"
        >
          Criar Minha Conta Grátis
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[12px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Setup 5min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span>Suporte</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          RODAPÉ MOBILE
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="px-5 py-8 bg-slate-950">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Lavify</span>
        </div>

        <div className="flex items-center justify-center gap-6 text-[13px] text-slate-400 mb-6">
          <Link href="/registro" className="hover:text-white transition-colors">
            Criar Conta
          </Link>
          <Link href="/entrar" className="hover:text-white transition-colors">
            Entrar
          </Link>
        </div>

        <p className="text-center text-[12px] text-slate-500">
          © 2026 Lavify. Todos os direitos reservados.
        </p>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          STICKY CTA MOBILE - Fixo no rodapé
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-lg border-t border-slate-200 lg:hidden safe-area-pb">
        <Link
          href="/registro"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[15px] rounded-xl shadow-lg active:scale-[0.98] transition-transform"
        >
          Começar Grátis
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Espaçador para o CTA fixo */}
      <div className="h-20 lg:hidden" />

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL DE VÍDEO
      ═══════════════════════════════════════════════════════════════════════ */}
      {videoAberto && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-5"
          onClick={() => setVideoAberto(false)}
        >
          <button
            onClick={() => setVideoAberto(false)}
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="w-full max-w-lg aspect-video bg-slate-800 rounded-2xl flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm text-slate-400">Vídeo demonstrativo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
