"use client";

import { useEffect, useState } from "react";
import {
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Droplets,
  Clock,
  Calendar,
  Bell,
  Wrench,
  ChevronRight,
  Columns3,
  Sparkles,
  ArrowUpRight,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { StatCard, Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  ordensPorStatus: Record<string, number>;
  osHoje: number;
  osEmAndamento: number;
  faturamentoHoje: number;
  faturamentoMes: number;
  totalClientes: number;
  clientesNovosMes: number;
  produtosEstoqueBaixo: {
    id: string;
    nome: string;
    quantidade: number;
    pontoReposicao: number;
    unidade: string;
  }[];
  servicosMaisVendidos: {
    servicoId: string;
    nome: string;
    _count: number;
  }[];
  agendamentosPendentes: number;
  agendamentosHoje: number;
}

interface Usuario {
  nome: string;
  role: string;
  lavaJato: {
    nome: string;
  };
}

// Quick Actions para mobile
const quickActions = [
  { 
    href: "/nova-os", 
    label: "Nova OS", 
    icon: Wrench, 
    color: "from-cyan-500 to-blue-600",
    description: "Criar ordem"
  },
  { 
    href: "/kanban", 
    label: "Pátio", 
    icon: Columns3, 
    color: "from-amber-500 to-orange-600",
    description: "Ver fila"
  },
  { 
    href: "/clientes", 
    label: "Clientes", 
    icon: Users, 
    color: "from-emerald-500 to-teal-600",
    description: "Cadastros"
  },
  { 
    href: "/equipe", 
    label: "Equipe", 
    icon: UsersRound, 
    color: "from-purple-500 to-indigo-600",
    description: "Gerenciar"
  },
];

// Status config
const statusConfig = [
  { key: "AGUARDANDO", label: "Aguardando", emoji: "🚗", color: "bg-amber-500", bgLight: "bg-amber-50", border: "border-amber-200" },
  { key: "LAVANDO", label: "Lavando", emoji: "🧽", color: "bg-cyan-500", bgLight: "bg-cyan-50", border: "border-cyan-200" },
  { key: "FINALIZANDO", label: "Finalizando", emoji: "✨", color: "bg-blue-500", bgLight: "bg-blue-50", border: "border-blue-200" },
  { key: "PRONTO", label: "Pronto", emoji: "✅", color: "bg-emerald-500", bgLight: "bg-emerald-50", border: "border-emerald-200" },
];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchUsuario();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsuario() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const json = await res.json();
        setUsuario(json);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatCurrencyCompact = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1)}k`;
    }
    return formatCurrency(value);
  };

  const chartData = data?.servicosMaisVendidos?.map((s) => ({
    name: s.nome.length > 15 ? s.nome.substring(0, 15) + "..." : s.nome,
    quantidade: s._count,
  })) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const totalEmPatio = statusConfig.reduce((acc, s) => acc + (data?.ordensPorStatus?.[s.key] || 0), 0);

  // Loading skeleton
  if (loading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="lg:hidden p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-200 rounded-2xl" />
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 w-20 bg-slate-200 rounded-2xl flex-shrink-0" />
              ))}
            </div>
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="h-48 bg-slate-200 rounded-2xl" />
          </div>
        </div>

        {/* Desktop Loading */}
        <div className="hidden lg:block p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64" />
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden min-h-screen bg-slate-50">
        {/* Header com saudação */}
        <div className="bg-white border-b border-slate-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">{getGreeting()},</p>
              <h1 className="text-xl font-bold text-slate-800">
                {usuario?.nome?.split(" ")[0] || "Usuário"}! 👋
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase">
                {new Date().toLocaleDateString("pt-BR", { weekday: "short" })}
              </p>
              <p className="text-xl font-bold text-slate-800">
                {new Date().getDate()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Resumo */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-800">{data?.osHoje || 0}</span>
                  <p className="text-xs text-slate-500">OS hoje</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-800">
                    {formatCurrencyCompact(data?.faturamentoHoje || 0)}
                  </span>
                  <p className="text-xs text-slate-500">Faturado hoje</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4 pb-24">
          {/* Alertas Compactos */}
          {(data?.agendamentosPendentes ?? 0) > 0 && (
            <Link
              href="/agendamentos"
              className="flex items-center gap-3 bg-cyan-50 border border-cyan-200 rounded-xl p-3 animate-slide-in"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-cyan-800 text-sm">
                  {data?.agendamentosPendentes} agendamento{(data?.agendamentosPendentes ?? 0) > 1 ? 's' : ''} pendente{(data?.agendamentosPendentes ?? 0) > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-cyan-600">Toque para confirmar</p>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </Link>
          )}

          {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 && (
            <Link
              href="/estoque"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3 animate-slide-in"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-800 text-sm">
                  {data?.produtosEstoqueBaixo?.length} produto{(data?.produtosEstoqueBaixo?.length ?? 0) > 1 ? 's' : ''} com estoque baixo
                </p>
                <p className="text-xs text-red-600 truncate">
                  {data?.produtosEstoqueBaixo?.slice(0, 2).map(p => p.nome).join(", ")}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </Link>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 mb-3">ACESSO RÁPIDO</h2>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg mb-2 active:scale-95 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Status do Pátio - Visual */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Columns3 className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Pátio Agora</h3>
              </div>
              <Link 
                href="/kanban"
                className="text-sm text-cyan-600 font-medium flex items-center gap-1"
              >
                Ver fila
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {totalEmPatio > 0 ? (
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {statusConfig.map((status) => {
                    const count = data?.ordensPorStatus?.[status.key] || 0;
                    return (
                      <Link
                        key={status.key}
                        href="/kanban"
                        className={`${status.bgLight} ${status.border} border rounded-xl p-3 text-center active:scale-95 transition-transform`}
                      >
                        <span className="text-2xl">{status.emoji}</span>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{count}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{status.label}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">Pátio vazio!</p>
                <p className="text-xs text-slate-400">Nenhum veículo no momento</p>
              </div>
            )}
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">Resumo do Mês</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Faturamento</p>
                    <p className="font-bold text-lg text-emerald-700">
                      {formatCurrency(data?.faturamentoMes || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Total Clientes</p>
                  <p className="text-xl font-bold text-slate-800">{data?.totalClientes || 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Novos este mês</p>
                  <p className="text-xl font-bold text-cyan-600">
                    {(data?.clientesNovosMes || 0) > 0 ? `+${data?.clientesNovosMes}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Serviços mais vendidos - Mobile */}
          {chartData && chartData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Top Serviços</h3>
              </div>

              <div className="space-y-3">
                {data?.servicosMaisVendidos?.slice(0, 5).map((servico, index) => (
                  <div key={servico.servicoId} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-slate-200 text-slate-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}º
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{servico.nome}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">{servico._count}</span>
                      <span className="text-xs text-slate-400 ml-1">vendas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-5 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-[1400px] mx-auto space-y-4">
          
          {/* Header Tech */}
          <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {usuario?.lavaJato?.nome || "Lava Jato"}
                </h1>
                <p className="text-slate-400 text-sm font-mono">
                  {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Alertas inline */}
              {(data?.agendamentosPendentes ?? 0) > 0 && (
                <Link href="/agendamentos" className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2.5 hover:bg-blue-500/20 transition-all group">
                  <Bell className="w-4 h-4 text-blue-400 group-hover:animate-pulse" />
                  <span className="text-blue-300 font-bold text-sm">{data?.agendamentosPendentes}</span>
                </Link>
              )}
              {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 && (
                <Link href="/estoque" className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 hover:bg-red-500/20 transition-all">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 font-bold text-sm">{data?.produtosEstoqueBaixo?.length}</span>
                </Link>
              )}
              <Link 
                href="/nova-os"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25"
              >
                <Wrench className="w-4 h-4" />
                Nova OS
              </Link>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Coluna Esquerda */}
            <div className="col-span-8 space-y-4">
              
              {/* Métricas Tech */}
              <div className="grid grid-cols-4 gap-3">
                {/* OS Hoje */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 group hover:border-cyan-500/50 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                      <Car className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white font-mono">{data?.osHoje || 0}</p>
                      <p className="text-xs text-cyan-400/80 font-medium uppercase tracking-wide">OS Hoje</p>
                    </div>
                  </div>
                </div>

                {/* No Pátio */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 group hover:border-amber-500/50 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/30 flex items-center justify-center">
                      <Columns3 className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white font-mono">{data?.osEmAndamento || 0}</p>
                      <p className="text-xs text-amber-400/80 font-medium uppercase tracking-wide">No Pátio</p>
                    </div>
                  </div>
                </div>

                {/* Faturamento Hoje */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 group hover:border-emerald-500/50 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-400 font-mono">{formatCurrencyCompact(data?.faturamentoHoje || 0)}</p>
                      <p className="text-xs text-emerald-400/80 font-medium uppercase tracking-wide">Hoje</p>
                    </div>
                  </div>
                </div>

                {/* Faturamento Mês */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white font-mono">{formatCurrencyCompact(data?.faturamentoMes || 0)}</p>
                      <p className="text-xs text-purple-300/80 font-medium uppercase tracking-wide">Este Mês</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status do Pátio */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <Columns3 className="w-4 h-4 text-slate-300" />
                    </div>
                    Fila do Pátio
                  </h3>
                  <Link href="/kanban" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 group">
                    Ver Kanban
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: "AGUARDANDO", label: "Aguardando", emoji: "🚗", gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/40", text: "text-amber-300" },
                    { key: "LAVANDO", label: "Lavando", emoji: "🧽", gradient: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/40", text: "text-cyan-300" },
                    { key: "FINALIZANDO", label: "Finalizando", emoji: "✨", gradient: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/40", text: "text-blue-300" },
                    { key: "PRONTO", label: "Pronto", emoji: "✅", gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/40", text: "text-emerald-300" },
                  ].map((status) => {
                    const count = data?.ordensPorStatus?.[status.key] || 0;
                    return (
                      <div
                        key={status.key}
                        className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${status.gradient} border ${status.border} p-4 text-center`}
                      >
                        <span className="text-3xl mb-2 block">{status.emoji}</span>
                        <p className="text-4xl font-bold text-white font-mono">{count}</p>
                        <p className={`text-xs font-semibold ${status.text} mt-1 uppercase tracking-wide`}>{status.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gráfico */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
                <h3 className="font-bold text-white mb-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-slate-300" />
                  </div>
                  Serviços Mais Vendidos
                </h3>
                {chartData && chartData.length > 0 ? (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 11, fill: '#cbd5e1' }} 
                          axisLine={false} 
                          tickLine={false}
                          width={120}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            border: '1px solid #334155', 
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px'
                          }}
                          formatter={(value) => [`${value} vendas`, '']}
                        />
                        <Bar 
                          dataKey="quantidade" 
                          fill="url(#barGradient)" 
                          radius={[0, 8, 8, 0]}
                          barSize={28}
                        />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center text-slate-500">
                    <Droplets className="w-10 h-10 mb-2 text-slate-600" />
                    <p className="text-sm">Nenhum serviço registrado ainda</p>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="col-span-4 space-y-4">
              
              {/* Card Faturamento */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-5 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/80 font-semibold text-sm uppercase tracking-wide">Faturamento do Mês</span>
                  </div>
                  <p className="text-4xl font-bold mb-2 font-mono">{formatCurrency(data?.faturamentoMes || 0)}</p>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    Média: {formatCurrency((data?.faturamentoMes || 0) / new Date().getDate())}/dia
                  </div>
                </div>
              </div>

              {/* Clientes */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <Users className="w-4 h-4 text-slate-300" />
                    </div>
                    Clientes
                  </h3>
                  <Link href="/clientes" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                    Ver todos →
                  </Link>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold text-white font-mono">{data?.totalClientes || 0}</p>
                  {data?.clientesNovosMes && data.clientesNovosMes > 0 && (
                    <span className="text-sm text-emerald-400 font-bold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                      +{data.clientesNovosMes}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-2">cadastrados no sistema</p>
              </div>

              {/* Distribuição */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
                <h3 className="font-bold text-white mb-4">Distribuição</h3>
                <div className="space-y-3">
                  {[
                    { key: "AGUARDANDO", label: "Aguardando", color: "from-amber-500 to-orange-500", bg: "bg-amber-500" },
                    { key: "LAVANDO", label: "Lavando", color: "from-cyan-500 to-blue-500", bg: "bg-cyan-500" },
                    { key: "FINALIZANDO", label: "Finalizando", color: "from-blue-500 to-indigo-500", bg: "bg-blue-500" },
                    { key: "PRONTO", label: "Pronto", color: "from-emerald-500 to-teal-500", bg: "bg-emerald-500" },
                  ].map((status) => {
                    const count = data?.ordensPorStatus?.[status.key] || 0;
                    const total = statusConfig.reduce((acc, s) => acc + (data?.ordensPorStatus?.[s.key] || 0), 0);
                    const percent = total > 0 ? (count / total) * 100 : 0;

                    return (
                      <div key={status.key} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${status.bg}`} />
                        <span className="text-xs text-slate-400 w-20">{status.label}</span>
                        <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${status.color} rounded-full transition-all`} 
                            style={{ width: `${percent}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-white w-6 text-right font-mono">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estoque Status */}
              <div className={`relative overflow-hidden rounded-2xl border p-5 ${
                (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl ${
                  (data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'
                }`} />
                <div className="relative flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                      ? 'bg-red-500/20 border border-red-500/30' 
                      : 'bg-emerald-500/20 border border-emerald-500/30'
                  }`}>
                    <Package className={`w-6 h-6 ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-bold ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'text-red-300' : 'text-emerald-300'
                    }`}>
                      {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                        ? `${data?.produtosEstoqueBaixo?.length} produto(s) baixo`
                        : 'Estoque OK'
                      }
                    </p>
                    <p className={`text-xs ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'text-red-400/70' : 'text-emerald-400/70'
                    }`}>
                      {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'Precisa repor' : 'Tudo abastecido'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/kanban", label: "Pátio", icon: Columns3, color: "hover:border-amber-500/50 hover:bg-amber-500/5" },
                  { href: "/clientes", label: "Clientes", icon: Users, color: "hover:border-blue-500/50 hover:bg-blue-500/5" },
                  { href: "/servicos", label: "Serviços", icon: Droplets, color: "hover:border-cyan-500/50 hover:bg-cyan-500/5" },
                  { href: "/agendamentos", label: "Agenda", icon: Calendar, color: "hover:border-purple-500/50 hover:bg-purple-500/5" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 bg-slate-800/50 rounded-xl border border-slate-700/50 px-4 py-3 transition-all ${item.color}`}
                  >
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                  </Link>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
