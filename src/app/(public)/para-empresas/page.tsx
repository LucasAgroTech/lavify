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
  Palmtree,
  Coffee,
  Star,
  Award,
  Percent,
  RotateCcw,
  BadgeCheck,
  Headphones,
  Briefcase,
  Medal,
} from "lucide-react";

// FAQ Accordion Component
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

  const niveisEquipe = [
    {
      icon: Crown,
      nivel: "Administrador",
      badge: "Você",
      badgeColor: "bg-amber-100 text-amber-700",
      descricao: "Acesso total ao sistema",
      permissoes: [
        "Financeiro completo",
        "Relatórios e métricas",
        "Configurações do sistema",
        "Gerenciar toda equipe",
        "Criar programas de fidelidade",
      ],
      cor: "from-amber-500 to-orange-600",
    },
    {
      icon: Briefcase,
      nivel: "Gerente",
      descricao: "Braço direito do dono",
      permissoes: [
        "Ver e criar OSs",
        "Gerenciar clientes",
        "Controlar estoque",
        "Ver equipe e escalas",
        "Relatórios básicos",
      ],
      cor: "from-blue-500 to-indigo-600",
    },
    {
      icon: Headphones,
      nivel: "Atendente",
      descricao: "Recepção e atendimento",
      permissoes: [
        "Criar novas OSs",
        "Cadastrar clientes",
        "Ver Kanban do pátio",
        "Consultar preços",
      ],
      cor: "from-cyan-500 to-blue-600",
    },
    {
      icon: Medal,
      nivel: "Lavador Sênior",
      descricao: "Lavador experiente",
      permissoes: [
        "Mover carros no Kanban",
        "Iniciar e finalizar OSs",
        "Ver detalhes do serviço",
        "Reportar problemas",
      ],
      cor: "from-emerald-500 to-green-600",
    },
    {
      icon: Wrench,
      nivel: "Lavador",
      descricao: "Execução básica",
      permissoes: [
        "Mover carros no Kanban",
        "Ver serviços pendentes",
        "Marcar como finalizado",
      ],
      cor: "from-slate-500 to-gray-600",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION - Foco na DOR
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
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[13px] font-medium px-4 py-2 rounded-full">
              <Palmtree className="w-4 h-4" />
              <span>Liberdade para o Dono</span>
            </div>
          </div>

          {/* Headline - Foco na DOR */}
          <h1 className="text-[28px] sm:text-[32px] font-bold text-white text-center leading-[1.2] mb-5">
            Seu Lava-Rápido{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Para Quando Você Não Está?
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-300 text-center text-[15px] leading-relaxed mb-8 max-w-sm mx-auto">
            Chega de ser escravo do próprio negócio. Com Lavify, sua equipe opera{" "}
            <span className="text-white font-semibold">sem depender de você</span> — e você acompanha tudo pelo celular.
          </p>

          {/* CTA Principal */}
          <div className="space-y-3">
            <Link
              href="/registro"
              className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[16px] rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-transform"
            >
              Quero Minha Liberdade
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

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-8 text-[12px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Grátis 14 dias</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sem cartão</span>
            </div>
          </div>
        </div>

        {/* Visual - Dono relaxando */}
        <div className="px-5 pb-8">
          <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-5 border border-white/10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Coffee className="w-8 h-8 text-amber-400" />
              <Palmtree className="w-10 h-10 text-emerald-400" />
              <Smartphone className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-white font-semibold text-[15px] mb-1">
              Você na praia, seu negócio funcionando
            </p>
            <p className="text-slate-400 text-[13px]">
              Acompanhe tudo em tempo real pelo celular
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DOR PRINCIPAL - O negócio não roda sem o dono
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 -mt-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-[13px] font-semibold text-red-600 uppercase tracking-wide">
            A Dor Que Você Conhece
          </h2>
        </div>

        {/* Headline da dor */}
        <h3 className="text-[22px] font-bold text-slate-900 leading-tight mb-6">
          Você Trabalha <span className="text-red-600">12h Por Dia</span> e Ainda Assim...
        </h3>

        <div className="space-y-3">
          {[
            {
              icon: Clock,
              titulo: "Não consegue tirar um dia de folga",
              texto: "Sem você, ninguém sabe onde está cada carro, qual serviço fazer, ou como fechar o caixa.",
            },
            {
              icon: AlertTriangle,
              titulo: "Tudo depende de você",
              texto: "Funcionário liga pra perguntar preço. Cliente reclama porque ninguém sabia o status do carro.",
            },
            {
              icon: TrendingUp,
              titulo: "Não consegue crescer",
              texto: "Como abrir outra unidade se você mal dá conta dessa? Escalar parece impossível.",
            },
            {
              icon: Wallet,
              titulo: "Dinheiro some e você não sabe onde",
              texto: "Estoque acabando sem você perceber, descontos não autorizados, caixa que não fecha.",
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
                <h4 className="font-bold text-slate-900 text-[15px] mb-1">
                  {pain.titulo}
                </h4>
                <p className="text-slate-600 text-[13px] leading-relaxed">
                  {pain.texto}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Frase de transição */}
        <div className="mt-8 p-5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-200">
          <p className="text-center text-slate-700 text-[15px] leading-relaxed">
            <span className="font-bold text-cyan-700">E se você pudesse...</span><br />
            Tirar férias, cuidar da família, ou simplesmente dormir tranquilo — sabendo que o negócio está funcionando?
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SOLUÇÃO - Autonomia da Equipe
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-cyan-500" />
          <h2 className="text-[13px] font-semibold text-cyan-600 uppercase tracking-wide">
            A Solução
          </h2>
        </div>
        <h3 className="text-[22px] font-bold text-slate-900 leading-tight mb-2">
          Equipe Que Funciona{" "}
          <span className="text-cyan-600">Sem Você</span>
        </h3>
        <p className="text-slate-600 text-[14px] mb-8">
          Cada membro sabe exatamente o que fazer — e você controla tudo pelo celular.
        </p>

        {/* Níveis de Equipe */}
        <div className="space-y-4">
          {niveisEquipe.map((item, index) => (
            <div
              key={item.nivel}
              className="bg-slate-50 rounded-2xl p-5 border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.cor} flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-[16px]">{item.nivel}</h4>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[13px]">{item.descricao}</p>
                </div>
              </div>
              
              {/* Permissões */}
              <div className="grid grid-cols-1 gap-2">
                {item.permissoes.map((perm) => (
                  <div key={perm} className="flex items-center gap-2 text-[13px]">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-700">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Destaque */}
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-white/90" />
            <div>
              <p className="text-white font-bold text-[15px]">
                Cada um vê só o que precisa
              </p>
              <p className="text-emerald-100 text-[13px]">
                Lavador não vê financeiro. Gerente não altera configurações.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PROGRAMAS DE FIDELIDADE - Destaque especial
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-gradient-to-b from-pink-50 to-rose-50">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-pink-500" />
          <h2 className="text-[13px] font-semibold text-pink-600 uppercase tracking-wide">
            Fidelização
          </h2>
        </div>
        <h3 className="text-[22px] font-bold text-slate-900 leading-tight mb-2">
          Crie Programas de Fidelidade{" "}
          <span className="text-pink-600">No Seu App</span>
        </h3>
        <p className="text-slate-600 text-[14px] mb-8">
          Cliente que volta é cliente que você não precisa conquistar de novo. Automatize a fidelização.
        </p>

        <div className="space-y-4">
          {/* Pontos */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[16px]">Programa de Pontos</h4>
                <p className="text-slate-500 text-[13px]">A cada R$ gasto, ganha pontos</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-amber-800 text-[14px]">
                <span className="font-bold">Exemplo:</span> A cada R$ 10 = 1 ponto. Com 100 pontos = 1 lavagem grátis.
              </p>
            </div>
          </div>

          {/* Cashback */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                <Percent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[16px]">Cashback Automático</h4>
                <p className="text-slate-500 text-[13px]">% volta como crédito para próxima visita</p>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-emerald-800 text-[14px]">
                <span className="font-bold">Exemplo:</span> 5% de cashback. Lavou R$ 100 = R$ 5 de crédito.
              </p>
            </div>
          </div>

          {/* Plano Mensal */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[16px]">Plano Mensal</h4>
                <p className="text-slate-500 text-[13px]">Assinatura com lavagens ilimitadas</p>
              </div>
            </div>
            <div className="bg-cyan-50 rounded-xl p-4">
              <p className="text-cyan-800 text-[14px]">
                <span className="font-bold">Exemplo:</span> R$ 149/mês = lavagens ilimitadas. Receita recorrente garantida.
              </p>
            </div>
          </div>
        </div>

        {/* Benefício */}
        <div className="mt-6 flex items-center gap-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-5">
          <Award className="w-10 h-10 text-white/90" />
          <div>
            <p className="text-white font-bold text-[15px]">
              Aumente em até 40% a recorrência
            </p>
            <p className="text-pink-100 text-[13px]">
              Clientes fidelizados voltam mais e gastam mais.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DOR DO CLIENTE FINAL - Agendamento
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Car className="w-5 h-5 text-cyan-400" />
          <h2 className="text-[13px] font-semibold text-cyan-400 uppercase tracking-wide">
            Para Seu Cliente
          </h2>
        </div>
        
        <h3 className="text-[22px] font-bold text-white leading-tight mb-3">
          Chega de Cliente{" "}
          <span className="text-amber-400">Rodando a Cidade</span>
        </h3>
        
        <p className="text-slate-300 text-[15px] leading-relaxed mb-8">
          Seu cliente também sofre: fica rodando de lava-jato em lava-jato procurando um que não esteja lotado. 
          <span className="text-white font-semibold"> Com agendamento online, ele resolve em 2 minutos.</span>
        </p>

        {/* Comparativo visual */}
        <div className="space-y-4">
          {/* Sem agendamento */}
          <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-5 border border-red-500/20">
            <p className="text-red-400 text-[12px] font-bold uppercase mb-3">😤 Sem Agendamento</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-red-500/30 border-2 border-slate-800 flex items-center justify-center">
                    <Car className="w-4 h-4 text-red-400" />
                  </div>
                ))}
              </div>
              <span className="text-slate-400 text-[13px]">Fila enorme...</span>
            </div>
            <ul className="space-y-2">
              {[
                "Vai até o lava-jato e encontra fila",
                "Tenta outro, mesma coisa",
                "Perde 1 hora rodando a cidade",
                "Desiste ou aceita esperar muito",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-400 text-[13px]">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Com agendamento */}
          <div className="bg-emerald-500/10 backdrop-blur-sm rounded-2xl p-5 border border-emerald-500/20">
            <p className="text-emerald-400 text-[12px] font-bold uppercase mb-3">😎 Com Lavify</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/30 border-2 border-slate-800 flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-emerald-300 text-[13px] font-medium">Horário garantido!</span>
            </div>
            <ul className="space-y-2">
              {[
                "Abre o celular, escolhe o horário",
                "Chega na hora marcada, sem fila",
                "Deixa o carro e vai resolver a vida",
                "Recebe WhatsApp quando está pronto",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-300 text-[13px]">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Benefício para o dono */}
        <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-white/90" />
            <div>
              <p className="text-white font-bold text-[15px]">
                Cliente satisfeito = cliente fiel
              </p>
              <p className="text-cyan-100 text-[13px]">
                E você ainda organiza melhor seu dia com agendamentos previsíveis.
              </p>
            </div>
          </div>
        </div>

        {/* Link para página do cliente */}
        <div className="mt-6 p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <p className="text-slate-400 text-[13px] mb-3">Seu cliente terá uma página exclusiva:</p>
          <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3">
            <Droplets className="w-6 h-6 text-cyan-400" />
            <div className="flex-1">
              <p className="text-white font-mono text-[13px]">lavify.com.br/seulava</p>
              <p className="text-slate-500 text-[11px]">Agendamento 24h por dia</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FUNCIONALIDADES - Carrossel
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white">
        <div className="px-5 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-cyan-500" />
            <h2 className="text-[13px] font-semibold text-cyan-600 uppercase tracking-wide">
              Ferramentas
            </h2>
          </div>
          <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
            Tudo Que Você Precisa
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
          TRANSFORMAÇÃO - Antes x Depois
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-[20px] font-bold text-white leading-tight mb-2">
            Sua Vida{" "}
            <span className="text-cyan-400">Antes x Depois</span>
          </h2>
        </div>

        <div className="space-y-4">
          {/* Antes */}
          <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-5 border border-red-500/20">
            <p className="text-red-400 text-[12px] font-bold uppercase mb-3">❌ Antes</p>
            <ul className="space-y-2">
              {[
                "Trabalha 12h por dia, 7 dias por semana",
                "Não consegue tirar férias",
                "Funcionário liga para tudo",
                "Não sabe quanto está lucrando",
                "Cliente reclama de demora",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-300 text-[14px]">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Depois */}
          <div className="bg-emerald-500/10 backdrop-blur-sm rounded-2xl p-5 border border-emerald-500/20">
            <p className="text-emerald-400 text-[12px] font-bold uppercase mb-3">✓ Com Lavify</p>
            <ul className="space-y-2">
              {[
                "Equipe opera sozinha com o sistema",
                "Tira férias e acompanha pelo celular",
                "Cada um sabe exatamente o que fazer",
                "Dashboard mostra lucro real em tempo real",
                "WhatsApp avisa cliente automaticamente",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-300 text-[14px]">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ
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
            pergunta="E se meu lavador não souber usar?"
            resposta="O Kanban é visual: arrastar carro de 'Lavando' para 'Pronto' é tão simples quanto mover um post-it. Em 10 minutos qualquer um aprende."
          />
          <FAQItem
            pergunta="Como configuro os níveis de equipe?"
            resposta="Na aba Equipe, você cadastra cada funcionário e escolhe o nível: Gerente, Atendente, Lavador Sênior ou Lavador. O sistema já aplica as permissões automaticamente."
          />
          <FAQItem
            pergunta="Posso criar meu próprio programa de fidelidade?"
            resposta="Sim! Você escolhe entre pontos, cashback ou plano mensal. Define as regras (quantos pontos por real, % de cashback) e o sistema faz tudo automaticamente."
          />
          <FAQItem
            pergunta="Meus dados ficam seguros?"
            resposta="Dados criptografados, servidores seguros, backup diário automático. Só você e quem autorizar tem acesso."
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-12 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-bold text-white leading-tight mb-3">
            Pronto Para Ter Sua{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Liberdade?
            </span>
          </h2>
          <p className="text-slate-400 text-[14px]">
            Seu negócio rodando sem você. Sua equipe sabendo o que fazer. Você vivendo.
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
            <BadgeCheck className="w-4 h-4" />
            <span>14 dias grátis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4" />
            <span>100% Mobile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span>Suporte</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          RODAPÉ
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
          STICKY CTA MOBILE
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
