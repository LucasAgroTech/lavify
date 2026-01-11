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
          HERO SECTION - Mobile First
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

        <div className="relative px-5 pt-8 pb-10">
          {/* Badge de destaque */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[13px] font-medium px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span>Seu carro brilhando em minutos</span>
            </div>
            </div>

          {/* Headline impactante */}
          <h1 className="text-[28px] sm:text-[32px] font-bold text-white text-center leading-[1.2] mb-4">
            Chega de Procurar{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Lava Jato
              </span>{" "}
            na Rua
            </h1>
            
          {/* Subheadline */}
          <p className="text-slate-300 text-center text-[15px] leading-relaxed mb-8 max-w-sm mx-auto">
            Encontre os melhores lava jatos da sua região, compare preços e
            agende online em segundos.
            </p>

          {/* Search box otimizado para mobile */}
          <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
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
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[16px] rounded-2xl shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Buscar Lava Jatos
              </button>
            </form>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 mt-6 text-[12px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>100% Grátis</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600" />
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sem cadastro</span>
            </div>
          </div>
        </div>

        {/* Quick stats mobile */}
        <div className="px-5 pb-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { valor: "500+", label: "Lava Jatos", icon: Car },
              { valor: "50k+", label: "Agendamentos", icon: Calendar },
              { valor: "4.8", label: "Avaliação", icon: Star },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10"
              >
                <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-white font-bold text-[16px]">{stat.valor}</p>
                <p className="text-slate-400 text-[11px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          QUICK ACTIONS - Ações rápidas mobile
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 -mt-3 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-100">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Search, label: "Buscar", sublabel: "Encontre", href: "/encontrar", cor: "from-cyan-500 to-blue-500" },
              { icon: MapPin, label: "Próximos", sublabel: "Perto de você", href: "/encontrar", cor: "from-emerald-500 to-green-500" },
              { icon: Star, label: "Top 10", sublabel: "Mais bem avaliados", href: "/encontrar?ordenar=avaliacao", cor: "from-amber-500 to-orange-500" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 active:bg-slate-100 active:scale-[0.98] transition-all"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.cor} flex items-center justify-center shadow-lg`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-slate-800">{action.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          COMO FUNCIONA - Steps visuais
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-10">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-cyan-500" />
          <h2 className="text-[13px] font-semibold text-cyan-600 uppercase tracking-wide">
            Super Simples
          </h2>
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 leading-tight mb-6">
          Como Funciona?
        </h3>

        <div className="space-y-3">
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
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 active:scale-[0.99] transition-transform"
            >
              {/* Número e ícone */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.cor} flex items-center justify-center shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                  {item.step}
                </span>
              </div>

              {/* Texto */}
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-[15px]">{item.title}</h4>
                <p className="text-slate-500 text-[13px] leading-snug">{item.desc}</p>
              </div>

              {/* Seta de continuação (menos no último) */}
              {index < 3 && (
                <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BENEFÍCIOS - Por que usar
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-10 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-rose-500" />
          <h2 className="text-[13px] font-semibold text-rose-600 uppercase tracking-wide">
            Benefícios
          </h2>
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 leading-tight mb-6">
          Por Que Usar o Lavify?
        </h3>

        <div className="grid grid-cols-2 gap-3">
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
              className="bg-slate-50 rounded-2xl p-4 border border-slate-100"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${benefit.cor} flex items-center justify-center mb-3 shadow-lg`}
              >
                <benefit.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-slate-900 text-[14px] mb-1">
                {benefit.title}
              </h4>
              <p className="text-slate-500 text-[12px] leading-snug">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SOCIAL PROOF - Depoimentos
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-10">
        <div className="flex items-center gap-2 mb-2">
          <ThumbsUp className="w-5 h-5 text-blue-500" />
          <h2 className="text-[13px] font-semibold text-blue-600 uppercase tracking-wide">
            Quem Usa Recomenda
          </h2>
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 leading-tight mb-6">
          O Que Nossos Clientes Dizem
        </h3>

        {/* Carrossel de depoimentos */}
        <div className="overflow-x-auto scrollbar-hide -mx-5 px-5">
          <div className="flex gap-4 pb-2">
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
                className="flex-shrink-0 w-[280px] bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
              >
                <StarRating rating={depo.rating} />
                <p className="text-slate-600 text-[14px] leading-relaxed mt-3 mb-4">
                  &ldquo;{depo.texto}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-[14px]">
                      {depo.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-[14px]">
                      {depo.nome}
                    </p>
                    <p className="text-slate-400 text-[12px]">{depo.cidade}</p>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TIPOS DE SERVIÇO - O que você encontra
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-10 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Car className="w-5 h-5 text-indigo-500" />
          <h2 className="text-[13px] font-semibold text-indigo-600 uppercase tracking-wide">
            Serviços
          </h2>
        </div>
        <h3 className="text-[20px] font-bold text-slate-900 leading-tight mb-6">
          Encontre o Serviço Ideal
        </h3>

        <div className="space-y-3">
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
              className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border border-slate-100"
            >
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-[15px]">
                  {servico.titulo}
                </h4>
                <p className="text-slate-500 text-[13px]">{servico.desc}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-cyan-600 text-[14px]">
                  {servico.preco}
                </p>
                <div className="flex items-center gap-1 text-slate-400 text-[12px]">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{servico.tempo}</span>
                </div>
              </div>
              </div>
            ))}
          </div>

        <Link
          href="/encontrar"
          className="flex items-center justify-center gap-2 w-full mt-6 py-3.5 bg-slate-900 text-white font-semibold text-[15px] rounded-xl active:scale-[0.98] transition-transform"
        >
          Ver Todos os Serviços
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          NÚMEROS - Credibilidade
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-10 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center mb-8">
          <h3 className="text-[20px] font-bold text-white leading-tight">
            Números que{" "}
            <span className="text-cyan-400">Impressionam</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { valor: "500+", label: "Lava Jatos Parceiros", icon: Building2 },
            { valor: "50.000+", label: "Agendamentos Feitos", icon: Calendar },
            { valor: "4.8", label: "Nota Média", icon: Star },
            { valor: "98%", label: "Clientes Satisfeitos", icon: Heart },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/10"
            >
              <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-white font-bold text-[24px]">{stat.valor}</p>
              <p className="text-slate-400 text-[12px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-10">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 text-center text-white shadow-xl shadow-cyan-500/20">
          <BadgeCheck className="w-10 h-10 mx-auto mb-4 text-white/90" />
          <h2 className="text-[20px] font-bold mb-2">
            Pronto Para Brilhar?
            </h2>
          <p className="text-cyan-100 text-[14px] mb-6">
            Encontre o lava jato perfeito agora mesmo. É grátis!
            </p>
            <Link
              href="/encontrar"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-600 font-bold text-[15px] rounded-xl active:scale-[0.98] transition-transform shadow-lg"
            >
              Buscar Agora
            <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BANNER PARA LAVA JATOS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 pb-8">
        <Link
          href="/para-empresas"
          className="flex items-center justify-between bg-slate-900 rounded-2xl p-5 text-white active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          <div>
              <p className="text-slate-400 text-[12px]">Tem um lava jato?</p>
              <p className="font-bold text-[15px]">Cresça com o Lavify</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </Link>
      </section>

    </div>
  );
}
