"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Kanban,
  Package,
  CalendarClock,
  MessageCircle,
  Wallet,
  Gift,
  Users,
  Check,
  ChevronDown,
  ArrowRight,
  Smartphone,
  Zap,
  Droplets,
  Play,
  X,
  BadgeCheck,
} from "lucide-react";

// FAQ Accordion Component
function FAQItem({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const [aberto, setAberto] = useState(false);

  return (
    <button
      onClick={() => setAberto(!aberto)}
      className="w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-slate-200 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-semibold text-slate-800 text-[15px] leading-snug">
          {pergunta}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </div>
      {aberto && (
        <p className="text-slate-600 text-[14px] leading-relaxed mt-4">
          {resposta}
        </p>
      )}
    </button>
  );
}

// Funcionalidade Card simples
function FeatureCard({
  icon: Icon,
  titulo,
  descricao,
  cor,
}: {
  icon: React.ElementType;
  titulo: string;
  descricao: string;
  cor: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cor} flex items-center justify-center mb-4`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-bold text-slate-900 text-[16px] mb-2">{titulo}</h3>
      <p className="text-slate-500 text-[14px] leading-relaxed">{descricao}</p>
    </div>
  );
}

export default function LandingPageEmpresas() {
  const [videoAberto, setVideoAberto] = useState(false);
  const [slideAtual, setSlideAtual] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const imagensHero = ["/hero-1.webp", "/hero-2.webp", "/hero-3.webp", "/hero-4.webp"];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % imagensHero.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [imagensHero.length]);

  // 6 funcionalidades principais
  const funcionalidades = [
    {
      icon: Kanban,
      titulo: "Kanban do Pátio",
      descricao: "Arraste carros entre etapas. Visualize tudo em tempo real.",
      cor: "from-violet-500 to-purple-600",
    },
    {
      icon: CalendarClock,
      titulo: "Agendamento Online",
      descricao: "Clientes agendam sozinhos 24h. Você acorda com agenda cheia.",
      cor: "from-emerald-500 to-green-600",
    },
    {
      icon: MessageCircle,
      titulo: "WhatsApp Automático",
      descricao: "Cliente notificado quando pronto + comprovante enviado.",
      cor: "from-green-500 to-emerald-600",
    },
    {
      icon: Wallet,
      titulo: "Financeiro Integrado",
      descricao: "Cada OS entra no caixa. Lucro calculado automaticamente.",
      cor: "from-cyan-500 to-blue-600",
    },
    {
      icon: Package,
      titulo: "Controle de Estoque",
      descricao: "Alerta antes de acabar. Custo por produto em cada OS.",
      cor: "from-amber-500 to-orange-600",
    },
    {
      icon: Gift,
      titulo: "Programa de Fidelidade",
      descricao: "Pontos, cashback ou plano mensal. Cliente volta sempre.",
      cor: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO - Direto ao ponto
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative px-5 pt-8 pb-12 lg:pt-16 lg:pb-20 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[13px] font-semibold px-4 py-2 rounded-full">
              <Smartphone className="w-4 h-4" />
              <span>Celular e Computador</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[28px] lg:text-[48px] font-bold text-white text-center leading-tight mb-4">
            Sistema Completo para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Lava-Rápido
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-300 text-center text-[15px] lg:text-[18px] leading-relaxed mb-8 max-w-2xl mx-auto">
            Controle <span className="text-white font-semibold">pátio</span>,{" "}
            <span className="text-white font-semibold">caixa</span> e{" "}
            <span className="text-white font-semibold">equipe</span> pelo celular.
            Cliente agenda e recebe{" "}
            <span className="text-cyan-400 font-semibold">WhatsApp quando pronto</span>.
          </p>

          {/* Imagem/Vídeo */}
          {isMobile === null && (
            <div className="relative mb-8 max-w-[320px] lg:max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-slate-800/50 animate-pulse">
                <div className="aspect-[9/16] lg:aspect-[16/7]" />
              </div>
            </div>
          )}

          {isMobile === true && (
            <div className="relative mb-8 w-full max-w-[280px] mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-auto"
                  poster="/hero-mobile-poster.jpg"
                >
                  <source src="/hero-mobile.mp4" type="video/mp4" />
                </video>
                <button
                  onClick={() => setVideoAberto(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                    <Play className="w-7 h-7 text-slate-900 ml-1" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {isMobile === false && (
            <div className="hidden lg:block relative mb-8 max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 max-h-[400px]">
                <div
                  className="flex transition-transform duration-500"
                  style={{ transform: `translateX(-${slideAtual * 100}%)` }}
                >
                  {imagensHero.map((img, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <Image
                        src={img}
                        alt={`Sistema Lavify ${index + 1}`}
                        width={2860}
                        height={1342}
                        className="w-full h-auto object-cover object-top"
                        priority={index === 0}
                        quality={85}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {imagensHero.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSlideAtual(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      slideAtual === index ? "bg-cyan-400 w-6" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/registro"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all"
            >
              <Zap className="w-5 h-5" />
              Testar Grátis
            </Link>
            <button
              onClick={() => setVideoAberto(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-2xl active:scale-[0.98] hover:bg-white/10 transition-all"
            >
              <Play className="w-5 h-5" />
              Ver Demo
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-[12px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>7 dias grátis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sem cartão</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Começa em 2 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FUNCIONALIDADES - 6 cards simples
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[24px] lg:text-[36px] font-bold text-slate-900 mb-3">
              Tudo que você precisa
            </h2>
            <p className="text-slate-500 text-[15px] lg:text-[17px]">
              Um sistema completo para gerenciar seu lava-rápido
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {funcionalidades.map((func) => (
              <FeatureCard key={func.titulo} {...func} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          BENEFÍCIOS - Lista simples
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[24px] lg:text-[36px] font-bold text-white mb-3">
              Por que usar o Lavify?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: LayoutDashboard, text: "Dashboard com métricas em tempo real" },
              { icon: Users, text: "Controle de permissões por funcionário" },
              { icon: CalendarClock, text: "Agendamento online 24 horas" },
              { icon: MessageCircle, text: "Notificações automáticas por WhatsApp" },
              { icon: Wallet, text: "Financeiro integrado com cada OS" },
              { icon: Package, text: "Estoque com alertas de reposição" },
              { icon: Gift, text: "Programas de fidelidade automáticos" },
              { icon: Smartphone, text: "Funciona 100% no celular" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-white text-[15px]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ - Compacto
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-16 lg:py-24 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[24px] lg:text-[32px] font-bold text-slate-900 text-center mb-10">
            Dúvidas Frequentes
          </h2>

          <div className="space-y-3">
            <FAQItem
              pergunta="Preciso instalar algo?"
              resposta="Não! Funciona 100% no navegador. Acesse lavify.com.br, faça login e pronto."
            />
            <FAQItem
              pergunta="Funciona no celular?"
              resposta="Sim! Interface feita para mobile. Gerencie tudo pelo celular de qualquer lugar."
            />
            <FAQItem
              pergunta="Minha equipe vai conseguir usar?"
              resposta="O Kanban é visual e simples. Arrastar carros é como mover post-its. Em 10 minutos qualquer um aprende."
            />
            <FAQItem
              pergunta="Meus dados ficam seguros?"
              resposta="Sim! Dados criptografados, servidores seguros e backup diário automático."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="px-5 py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-[24px] lg:text-[36px] font-bold text-white mb-4">
            Comece agora,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              é grátis
            </span>
          </h2>
          <p className="text-slate-400 text-[15px] lg:text-[17px] mb-8">
            7 dias para testar todas as funcionalidades. Sem cartão de crédito.
          </p>

          <Link
            href="/registro"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[16px] rounded-2xl shadow-lg active:scale-[0.98] transition-all"
          >
            Criar Conta Grátis
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div className="flex items-center justify-center gap-6 mt-8 text-[13px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4" />
              <span>7 dias grátis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gift className="w-4 h-4" />
              <span>Plano Freemium</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="px-5 py-8 bg-slate-950">
        <div className="max-w-5xl mx-auto">
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
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
          </div>

          <p className="text-center text-[12px] text-slate-500">
            © 2026 Lavify. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          STICKY CTA MOBILE
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 lg:hidden">
        <Link
          href="/registro"
          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-emerald-400 to-green-500 text-slate-900 font-bold text-[16px] rounded-2xl shadow-xl active:scale-[0.97] transition-all"
        >
          <Zap className="w-5 h-5" />
          COMEÇAR GRÁTIS
        </Link>
      </div>
      <div className="h-20 lg:hidden" />

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL DE VÍDEO
      ═══════════════════════════════════════════════════════════════════════ */}
      {videoAberto && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setVideoAberto(false)}
        >
          <button
            onClick={() => setVideoAberto(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {isMobile ? (
            <div
              className="relative w-full max-w-[320px] aspect-[9/16] bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src="https://player.vimeo.com/video/1155801555?autoplay=1&loop=0&muted=0&title=0&byline=0&portrait=0"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            </div>
          ) : (
            <div
              className="relative w-full max-w-[900px] aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src="https://player.vimeo.com/video/1154178109?autoplay=1&loop=0&muted=0&title=0&byline=0&portrait=0"
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
