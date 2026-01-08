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
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [busca, setBusca] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/encontrar?busca=${encodeURIComponent(busca)}`);
  }

  return (
    <div>
      {/* Hero - Mobile First */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative px-4 py-12 lg:py-24 lg:max-w-7xl lg:mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-cyan-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Seu carro brilhando em minutos</span>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
              Encontre o{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Lava Jato
              </span>{" "}
              perfeito
            </h1>
            
            <p className="mt-4 text-base lg:text-xl text-slate-300">
              Agende lavagens, compare preços e receba seu carro brilhando
            </p>

            {/* Search Mobile */}
            <form onSubmit={handleSearch} className="mt-8">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Sua cidade ou bairro..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 text-base"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-3 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Buscar Lava Jatos
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Actions Mobile */}
      <section className="px-4 -mt-4 relative z-10 lg:hidden">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Search, label: "Buscar", href: "/encontrar" },
              { icon: MapPin, label: "Próximos", href: "/encontrar" },
              { icon: Star, label: "Melhores", href: "/encontrar?ordenar=avaliacao" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-xs font-medium text-slate-700">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Mobile Optimized */}
      <section className="px-4 py-12 lg:py-20">
        <div className="lg:max-w-7xl lg:mx-auto">
          <h2 className="text-xl lg:text-3xl font-bold text-slate-800 text-center mb-8">
            Como Funciona
          </h2>

          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
            {[
              {
                step: "1",
                icon: Search,
                title: "Busque",
                description: "Encontre lava jatos perto de você",
              },
              {
                step: "2",
                icon: Clock,
                title: "Agende",
                description: "Escolha data e horário que preferir",
              },
              {
                step: "3",
                icon: Sparkles,
                title: "Relaxe",
                description: "Receba seu carro brilhando",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm lg:flex-col lg:text-center lg:p-8"
              >
                <div className="relative">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-cyan-600" />
                  </div>
                  <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <div className="flex-1 lg:mt-4">
                  <h3 className="font-semibold text-slate-800 lg:text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 lg:hidden" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Mobile Cards */}
      <section className="px-4 pb-12 lg:py-20 lg:bg-slate-100">
        <div className="lg:max-w-7xl lg:mx-auto">
          <h2 className="text-xl lg:text-3xl font-bold text-slate-800 text-center mb-6">
            Por que usar
          </h2>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
            {[
              { icon: Clock, title: "Economia de tempo", color: "from-cyan-500 to-blue-500" },
              { icon: Star, title: "Avaliações reais", color: "from-amber-500 to-orange-500" },
              { icon: Shield, title: "Seguro", color: "from-emerald-500 to-green-500" },
              { icon: MapPin, title: "Perto de você", color: "from-purple-500 to-violet-500" },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-4 shadow-sm text-center"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mx-auto mb-3`}
                >
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-sm text-slate-800">
                  {benefit.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Card Mobile */}
      <section className="px-4 pb-8 lg:py-20">
        <div className="lg:max-w-4xl lg:mx-auto">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 lg:p-12 text-center text-white">
            <h2 className="text-xl lg:text-3xl font-bold mb-3">
              Pronto para começar?
            </h2>
            <p className="text-cyan-100 mb-6 text-sm lg:text-base">
              Encontre o lava jato perfeito agora mesmo
            </p>
            <Link
              href="/encontrar"
              className="inline-flex items-center gap-2 px-6 py-3 lg:px-8 lg:py-4 bg-white text-cyan-600 font-semibold rounded-xl active:scale-[0.98] transition-transform"
            >
              Buscar Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Business - Mobile */}
      <section className="px-4 pb-8 lg:hidden">
        <Link
          href="/registro"
          className="flex items-center justify-between bg-slate-900 rounded-2xl p-4 text-white"
        >
          <div>
            <p className="text-sm text-slate-400">Tem um lava jato?</p>
            <p className="font-semibold">Cadastre-se como parceiro</p>
          </div>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
