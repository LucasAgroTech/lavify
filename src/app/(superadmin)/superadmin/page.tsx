"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  Car,
  ClipboardList,
  TrendingUp,
  Crown,
  Loader2,
  ArrowUpRight,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  lavajatos: {
    total: number;
    ativos: number;
    inativos: number;
    novosMes: number;
  };
  usuarios: number;
  clientes: number;
  ordens: {
    total: number;
    ultimos7Dias: number;
  };
  agendamentos: number;
  faturamentoMes: number;
  porPlano: Record<string, number>;
  porStripeStatus: Record<string, number>;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/superadmin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erro ao carregar stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  const cards = [
    {
      label: "Lava-Jatos Ativos",
      value: stats?.lavajatos.ativos || 0,
      total: stats?.lavajatos.total || 0,
      icon: Building2,
      cor: "from-cyan-500 to-blue-600",
      href: "/superadmin/lavajatos",
    },
    {
      label: "Usuários",
      value: stats?.usuarios || 0,
      icon: Users,
      cor: "from-violet-500 to-purple-600",
    },
    {
      label: "Clientes Cadastrados",
      value: stats?.clientes || 0,
      icon: Car,
      cor: "from-emerald-500 to-green-600",
    },
    {
      label: "Ordens de Serviço",
      value: stats?.ordens.total || 0,
      sub: `${stats?.ordens.ultimos7Dias || 0} nos últimos 7 dias`,
      icon: ClipboardList,
      cor: "from-amber-500 to-orange-600",
    },
    {
      label: "Agendamentos",
      value: stats?.agendamentos || 0,
      icon: CalendarClock,
      cor: "from-pink-500 to-rose-600",
    },
    {
      label: "Faturamento do Mês",
      value: `R$ ${(stats?.faturamentoMes || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      cor: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm">Visão geral do sistema Lavify</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 md:p-5 relative overflow-hidden group"
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${card.cor} flex items-center justify-center mb-3 shadow-lg`}
            >
              <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>

            {/* Value */}
            <p className="text-xl md:text-2xl font-bold text-white mb-1">
              {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
            </p>

            {/* Label */}
            <p className="text-slate-400 text-xs md:text-sm">{card.label}</p>

            {/* Sub info */}
            {card.sub && (
              <p className="text-slate-500 text-[10px] md:text-xs mt-1">{card.sub}</p>
            )}
            {card.total !== undefined && (
              <p className="text-slate-500 text-[10px] md:text-xs mt-1">
                de {card.total} total
              </p>
            )}

            {/* Link */}
            {card.href && (
              <Link
                href={card.href}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Planos */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Por Plano */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-amber-400" />
            <h2 className="text-white font-semibold">Distribuição por Plano</h2>
          </div>

          <div className="space-y-3">
            {Object.entries(stats?.porPlano || {}).map(([plano, count]) => {
              const total = stats?.lavajatos.total || 1;
              const percent = Math.round((count / total) * 100);
              const cores: Record<string, string> = {
                STARTER: "bg-slate-500",
                PRO: "bg-blue-500",
                PREMIUM: "bg-amber-500",
              };

              return (
                <div key={plano}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-300">{plano}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cores[plano] || "bg-cyan-500"} transition-all`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Por Status Stripe */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h2 className="text-white font-semibold">Status de Assinatura</h2>
          </div>

          <div className="space-y-3">
            {Object.entries(stats?.porStripeStatus || {}).map(([status, count]) => {
              const labels: Record<string, string> = {
                active: "Ativo",
                trialing: "Em Trial",
                past_due: "Pagamento Pendente",
                canceled: "Cancelado",
                sem_status: "Sem Assinatura",
              };

              const cores: Record<string, string> = {
                active: "text-green-400",
                trialing: "text-blue-400",
                past_due: "text-amber-400",
                canceled: "text-red-400",
                sem_status: "text-slate-400",
              };

              return (
                <div
                  key={status}
                  className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0"
                >
                  <span className={`text-sm ${cores[status] || "text-slate-300"}`}>
                    {labels[status] || status}
                  </span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-white font-semibold mb-3">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/superadmin/lavajatos"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
          >
            <Building2 className="w-4 h-4" />
            Gerenciar Lava-Jatos
          </Link>
        </div>
      </div>
    </div>
  );
}

