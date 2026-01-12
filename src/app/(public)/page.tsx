"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Check,
  Car,
  Calendar,
  Gift,
  Zap,
  Heart,
  ThumbsUp,
  Timer,
  BadgeCheck,
  TrendingUp,
  Building2,
} from "lucide-react";

// Componente de avaliação com estrelas
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < rating ? "text-amber-400 fill-amber-400" : "text-slate-300"
          }`}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [busca, setBusca] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/encontrar?busca=${encodeURIComponent(busca)}`);
  }

  return (
    <div className="bg-slate-50">
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION - Mobile First + Desktop
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative px-5 pt-8 pb-10 lg:pt-20 lg:pb-16 lg:px-8 max-w-6xl mx-auto">
          {/* Badge de destaque */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[13px] lg:text-[14px] font-medium px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span>Seu carro brilhando em minutos</span>
            </div>
          </div>

          {/* Headline impactante */}
          <h1 className="text-[28px] sm:text-[32px] lg:text-[52px] font-bold text-white text-center leading-[1.2] mb-4 lg:mb-6">
            Chega de Procurar{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Lava Jato
            </span>{" "}
            na Rua
          </h1>
            
          {/* Subheadline */}
          <p className="text-slate-300 text-center text-[15px] lg:text-[18px] leading-relaxed mb-8 max-w-sm lg:max-w-2xl mx-auto">
            Encontre os melhores lava jatos da sua região, compare preços e
            agende online em segundos.
          </p>

          {/* Search box - Desktop: inline */}
          <form onSubmit={handleSearch} className="space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-center lg:gap-3 max-w-2xl mx-auto">
            <div className="relative lg:flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Digite sua cidade ou bairro..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-[16px]"
              />
            </div>
            <button
              type="submit"
              className="w-full lg:w-auto lg:px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[16px] rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] lg:hover:shadow-xl lg:hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar Lava Jatos
            </button>
          </form>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 lg:gap-6 mt-6 lg:mt-8 text-[12px] lg:text-[13px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>100% Grátis</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sem cadastro</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600 hidden lg:block" />
            <div className="hidden lg:flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Agendamento instantâneo</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="px-5 pb-6 lg:pb-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-3 lg:gap-6">
            {[
              { valor: "500+", label: "Lava Jatos", icon: Car },
              { valor: "50k+", label: "Agendamentos", icon: Calendar },
              { valor: "4.8", label: "Avaliação", icon: Star },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-5 text-center border border-white/10 lg:hover:bg-white/10 transition-colors"
              >
                <stat.icon className="w-5 h-5 lg:w-7 lg:h-7 text-cyan-400 mx-auto mb-1 lg:mb-2" />
                <p className="text-white font-bold text-[16px] lg:text-[24px]">{stat.valor}</p>
                <p className="text-slate-400 text-[11px] lg:text-[13px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          QUICK ACTIONS - Ações rápidas
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 lg:px-8 -mt-3 lg:-mt-6 relative z-10 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-slate-100">
          <div className="grid grid-cols-3 gap-3 lg:gap-6">
            {[
              { icon: Search, label: "Buscar", sublabel: "Encontre lava jatos", href: "/encontrar", cor: "from-cyan-500 to-blue-500" },
              { icon: MapPin, label: "Próximos", sublabel: "Perto de você", href: "/encontrar", cor: "from-emerald-500 to-green-500" },
              { icon: Star, label: "Top 10", sublabel: "Mais bem avaliados", href: "/encontrar?ordenar=avaliacao", cor: "from-amber-500 to-orange-500" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 lg:gap-3 p-3 lg:p-5 rounded-xl bg-slate-50 active:bg-slate-100 active:scale-[0.98] lg:hover:bg-slate-100 lg:hover:shadow-md transition-all"
              >
                <div className={`w-11 h-11 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${action.cor} flex items-center justify-center shadow-lg`}>
                  <action.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] lg:text-[15px] font-semibold text-slate-800">{action.label}</p>
                  <p className="hidden lg:block text-[12px] text-slate-500">{action.sublabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          COMO FUNCIONA - Steps visuais
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 lg:px-8 py-10 lg:py-20 max-w-6xl mx-auto">
        <div className="lg:text-center">
          <div className="flex items-center gap-2 mb-2 lg:justify-center">
            <Zap className="w-5 h-5 text-cyan-500" />
            <h2 className="text-[13px] lg:text-[14px] font-semibold text-cyan-600 uppercase tracking-wide">
              Super Simples
            </h2>
          </div>
          <h3 className="text-[20px] lg:text-[32px] font-bold text-slate-900 leading-tight mb-6 lg:mb-12">
            Como Funciona?
          </h3>
        </div>

        {/* Mobile: lista vertical / Desktop: grid horizontal */}
        <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
          {[
            {
              step: "1",
              icon: Search,
              title: "Busque",
              desc: "Digite sua cidade e veja os lava jatos disponíveis",
              cor: "from-cyan-500 to-blue-600",
            },
            {
              step: "2",
              icon: ThumbsUp,
              title: "Compare",
              desc: "Veja preços, avaliações e fotos de cada lugar",
              cor: "from-blue-500 to-indigo-600",
            },
            {
              step: "3",
              icon: Calendar,
              title: "Agende",
              desc: "Escolha data, horário e serviço online",
              cor: "from-indigo-500 to-purple-600",
            },
            {
              step: "4",
              icon: Sparkles,
              title: "Brilhe!",
              desc: "Retire seu carro impecável no horário marcado",
              cor: "from-purple-500 to-pink-600",
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="flex items-center gap-4 lg:flex-col lg:text-center bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100 active:scale-[0.99] lg:hover:shadow-lg lg:hover:border-slate-200 transition-all"
            >
              {/* Número e ícone */}
              <div className="relative">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${item.cor} flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-slate-900 text-white text-[11px] lg:text-[12px] font-bold flex items-center justify-center">
                  {item.step}
                </span>
              </div>

              {/* Texto */}
              <div className="flex-1 lg:flex-none lg:mt-4">
                <h4 className="font-bold text-slate-900 text-[15px] lg:text-[17px]">{item.title}</h4>
                <p className="text-slate-500 text-[13px] lg:text-[14px] leading-snug lg:mt-1">{item.desc}</p>
              </div>

              {/* Seta de continuação - só mobile */}
              {index < 3 && (
                <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0 lg:hidden" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BENEFÍCIOS - Por que usar
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 lg:px-8 py-10 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="lg:text-center">
            <div className="flex items-center gap-2 mb-2 lg:justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
              <h2 className="text-[13px] lg:text-[14px] font-semibold text-rose-600 uppercase tracking-wide">
                Benefícios
              </h2>
            </div>
            <h3 className="text-[20px] lg:text-[32px] font-bold text-slate-900 leading-tight mb-6 lg:mb-12">
              Por Que Usar o Lavify?
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {[
              {
                icon: Clock,
                title: "Economize Tempo",
                desc: "Nada de ligar ou ir até o local",
                cor: "from-cyan-500 to-blue-600",
              },
              {
                icon: Star,
                title: "Avaliações Reais",
                desc: "Veja o que outros clientes dizem",
                cor: "from-amber-500 to-orange-600",
              },
              {
                icon: Shield,
                title: "100% Seguro",
                desc: "Lava jatos verificados",
                cor: "from-emerald-500 to-green-600",
              },
              {
                icon: Gift,
                title: "Ganhe Cashback",
                desc: "Acumule créditos a cada lavagem",
                cor: "from-pink-500 to-rose-600",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="bg-slate-50 rounded-2xl p-4 lg:p-6 border border-slate-100 lg:hover:shadow-lg lg:hover:border-slate-200 transition-all"
              >
                <div
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${benefit.cor} flex items-center justify-center mb-3 lg:mb-4 shadow-lg`}
                >
                  <benefit.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <h4 className="font-bold text-slate-900 text-[14px] lg:text-[16px] mb-1">
                  {benefit.title}
                </h4>
                <p className="text-slate-500 text-[12px] lg:text-[14px] leading-snug">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SOCIAL PROOF - Depoimentos
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 lg:px-8 py-10 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="lg:text-center">
            <div className="flex items-center gap-2 mb-2 lg:justify-center">
              <ThumbsUp className="w-5 h-5 text-blue-500" />
              <h2 className="text-[13px] lg:text-[14px] font-semibold text-blue-600 uppercase tracking-wide">
                Quem Usa Recomenda
              </h2>
            </div>
            <h3 className="text-[20px] lg:text-[32px] font-bold text-slate-900 leading-tight mb-6 lg:mb-12">
              O Que Nossos Clientes Dizem
            </h3>
          </div>

          {/* Mobile: Carrossel / Desktop: Grid */}
          <div className="overflow-x-auto scrollbar-hide -mx-5 px-5 lg:mx-0 lg:px-0 lg:overflow-visible">
            <div className="flex gap-4 pb-2 lg:grid lg:grid-cols-3 lg:gap-6">
              {[
                {
                  nome: "Carlos M.",
                  cidade: "São Paulo",
                  texto: "Nunca mais perdi tempo ligando pra lava jato. Agendo em 2 minutos e o carro fica impecável!",
                  rating: 5,
                },
                {
                  nome: "Ana Paula",
                  cidade: "Rio de Janeiro",
                  texto: "Achei um lava jato pertinho de casa que não conhecia. Preço justo e atendimento top.",
                  rating: 5,
                },
                {
                  nome: "Roberto S.",
                  cidade: "Belo Horizonte",
                  texto: "O sistema de agendamento é muito prático. Escolho o horário que quero e pronto.",
                  rating: 4,
                },
              ].map((depo, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] lg:w-full bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-slate-100 lg:hover:shadow-lg lg:hover:border-slate-200 transition-all"
                >
                  <StarRating rating={depo.rating} />
                  <p className="text-slate-600 text-[14px] lg:text-[15px] leading-relaxed mt-3 mb-4">
                    &ldquo;{depo.texto}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-[14px] lg:text-[16px]">
                        {depo.nome.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-[14px] lg:text-[15px]">
                        {depo.nome}
                      </p>
                      <p className="text-slate-400 text-[12px] lg:text-[13px]">{depo.cidade}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TIPOS DE SERVIÇO - O que você encontra
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 lg:px-8 py-10 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="lg:text-center">
            <div className="flex items-center gap-2 mb-2 lg:justify-center">
              <Car className="w-5 h-5 text-indigo-500" />
              <h2 className="text-[13px] lg:text-[14px] font-semibold text-indigo-600 uppercase tracking-wide">
                Serviços
              </h2>
            </div>
            <h3 className="text-[20px] lg:text-[32px] font-bold text-slate-900 leading-tight mb-6 lg:mb-12">
              Encontre o Serviço Ideal
            </h3>
          </div>

          <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-4 max-w-4xl mx-auto">
            {[
              {
                titulo: "Lavagem Simples",
                preco: "A partir de R$ 30",
                tempo: "30 min",
                desc: "Lavagem externa completa",
              },
              {
                titulo: "Lavagem Completa",
                preco: "A partir de R$ 60",
                tempo: "1h",
                desc: "Externa + interna + aspiração",
              },
              {
                titulo: "Polimento",
                preco: "A partir de R$ 150",
                tempo: "3h",
                desc: "Correção de riscos e brilho",
              },
              {
                titulo: "Estética Completa",
                preco: "A partir de R$ 300",
                tempo: "6h",
                desc: "Higienização total + proteção",
              },
            ].map((servico) => (
              <div
                key={servico.titulo}
                className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 lg:p-5 border border-slate-100 lg:hover:shadow-lg lg:hover:border-slate-200 transition-all"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-[15px] lg:text-[16px]">
                    {servico.titulo}
                  </h4>
                  <p className="text-slate-500 text-[13px] lg:text-[14px]">{servico.desc}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-cyan-600 text-[14px] lg:text-[15px]">
                    {servico.preco}
                  </p>
                  <div className="flex items-center gap-1 text-slate-400 text-[12px] lg:text-[13px]">
                    <Timer className="w-3.5 h-3.5" />
                    <span>{servico.tempo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 lg:mt-10">
            <Link
              href="/encontrar"
              className="flex items-center justify-center gap-2 w-full lg:w-auto lg:px-10 py-3.5 lg:py-4 bg-slate-900 text-white font-semibold text-[15px] lg:text-[16px] rounded-xl active:scale-[0.98] lg:hover:bg-slate-800 transition-all"
            >
              Ver Todos os Serviços
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          NÚMEROS - Credibilidade
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 lg:px-8 py-10 lg:py-20 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 lg:mb-12">
            <h3 className="text-[20px] lg:text-[32px] font-bold text-white leading-tight">
              Números que{" "}
              <span className="text-cyan-400">Impressionam</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { valor: "500+", label: "Lava Jatos Parceiros", icon: Building2 },
              { valor: "50.000+", label: "Agendamentos Feitos", icon: Calendar },
              { valor: "4.8", label: "Nota Média", icon: Star },
              { valor: "98%", label: "Clientes Satisfeitos", icon: Heart },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 lg:p-6 text-center border border-white/10 lg:hover:bg-white/10 transition-colors"
              >
                <stat.icon className="w-6 h-6 lg:w-8 lg:h-8 text-cyan-400 mx-auto mb-2 lg:mb-3" />
                <p className="text-white font-bold text-[24px] lg:text-[32px]">{stat.valor}</p>
                <p className="text-slate-400 text-[12px] lg:text-[14px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 lg:px-8 py-10 lg:py-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 lg:p-12 text-center text-white shadow-xl shadow-cyan-500/20">
          <BadgeCheck className="w-10 h-10 lg:w-14 lg:h-14 mx-auto mb-4 text-white/90" />
          <h2 className="text-[20px] lg:text-[32px] font-bold mb-2 lg:mb-3">
            Pronto Para Brilhar?
          </h2>
          <p className="text-cyan-100 text-[14px] lg:text-[17px] mb-6 lg:mb-8">
            Encontre o lava jato perfeito agora mesmo. É grátis!
          </p>
          <Link
            href="/encontrar"
            className="inline-flex items-center gap-2 px-8 lg:px-12 py-4 lg:py-5 bg-white text-cyan-600 font-bold text-[15px] lg:text-[17px] rounded-xl active:scale-[0.98] lg:hover:shadow-xl transition-all shadow-lg"
          >
            Buscar Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BANNER PARA LAVA JATOS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 lg:px-8 pb-8 lg:pb-16 max-w-4xl mx-auto">
        <Link
          href="/para-empresas"
          className="flex items-center justify-between bg-slate-900 rounded-2xl p-5 lg:p-6 text-white active:scale-[0.99] lg:hover:bg-slate-800 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div>
              <p className="text-slate-400 text-[12px] lg:text-[14px]">Tem um lava jato?</p>
              <p className="font-bold text-[15px] lg:text-[17px]">Cresça com o Lavify</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 text-slate-400" />
        </Link>
      </section>

    </div>
  );
}
