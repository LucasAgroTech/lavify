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
          {data?.agendamentosPendentes && data.agendamentosPendentes > 0 && (
            <Link
              href="/agendamentos"
              className="flex items-center gap-3 bg-cyan-50 border border-cyan-200 rounded-xl p-3 animate-slide-in"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-cyan-800 text-sm">
                  {data.agendamentosPendentes} agendamento{data.agendamentosPendentes > 1 ? 's' : ''} pendente{data.agendamentosPendentes > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-cyan-600">Toque para confirmar</p>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </Link>
          )}

          {data?.produtosEstoqueBaixo && data.produtosEstoqueBaixo.length > 0 && (
            <Link
              href="/estoque"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3 animate-slide-in"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-800 text-sm">
                  {data.produtosEstoqueBaixo.length} produto{data.produtosEstoqueBaixo.length > 1 ? 's' : ''} com estoque baixo
                </p>
                <p className="text-xs text-red-600 truncate">
                  {data.produtosEstoqueBaixo.slice(0, 2).map(p => p.nome).join(", ")}
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
                  <p className="text-xl font-bold text-cyan-600">+{data?.clientesNovosMes || 0}</p>
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
      <div className="hidden lg:block p-6 xl:p-8 min-h-screen bg-slate-50">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Header Simples */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {getGreeting()}, {usuario?.nome?.split(" ")[0] || "Usuário"}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {usuario?.lavaJato?.nome} • {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <Link 
              href="/nova-os"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              <Wrench className="w-4 h-4" />
              Nova OS
            </Link>
          </div>

          {/* Alertas */}
          {(data?.agendamentosPendentes && data.agendamentosPendentes > 0) || (data?.produtosEstoqueBaixo && data.produtosEstoqueBaixo.length > 0) ? (
            <div className="flex gap-4">
              {data?.agendamentosPendentes && data.agendamentosPendentes > 0 && (
                <Link href="/agendamentos" className="flex-1 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 hover:bg-blue-100 transition-colors">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800 font-medium text-sm">{data.agendamentosPendentes} agendamento(s) pendente(s)</span>
                  <ChevronRight className="w-4 h-4 text-blue-400 ml-auto" />
                </Link>
              )}
              {data?.produtosEstoqueBaixo && data.produtosEstoqueBaixo.length > 0 && (
                <Link href="/estoque" className="flex-1 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 hover:bg-red-100 transition-colors">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800 font-medium text-sm">{data.produtosEstoqueBaixo.length} produto(s) com estoque baixo</span>
                  <ChevronRight className="w-4 h-4 text-red-400 ml-auto" />
                </Link>
              )}
            </div>
          ) : null}

          {/* Grid Principal - Métricas do Dia */}
          <div className="grid grid-cols-4 gap-4">
            {/* OS Hoje */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium">OS Hoje</span>
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Car className="w-4 h-4 text-cyan-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{data?.osHoje || 0}</p>
              <p className="text-xs text-slate-400 mt-1">ordens de serviço</p>
            </div>

            {/* Em Andamento */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium">No Pátio</span>
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Columns3 className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{data?.osEmAndamento || 0}</p>
              <p className="text-xs text-slate-400 mt-1">veículos agora</p>
            </div>

            {/* Faturamento Hoje */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium">Faturamento Hoje</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{formatCurrency(data?.faturamentoHoje || 0)}</p>
              <p className="text-xs text-slate-400 mt-1">receita do dia</p>
            </div>

            {/* Faturamento Mês */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-sm font-medium">Faturamento Mês</span>
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(data?.faturamentoMes || 0)}</p>
              <p className="text-xs text-slate-400 mt-1">acumulado</p>
            </div>
          </div>

          {/* Seção Status do Pátio + Métricas Secundárias */}
          <div className="grid grid-cols-3 gap-4">
            {/* Status do Pátio */}
            <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Status do Pátio</h3>
                <Link href="/kanban" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                  Ver fila completa
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {statusConfig.map((status) => {
                  const count = data?.ordensPorStatus?.[status.key] || 0;
                  return (
                    <Link
                      key={status.key}
                      href="/kanban"
                      className={`rounded-lg border ${status.border} ${status.bgLight} p-4 text-center hover:shadow-sm transition-all`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${status.color}`} />
                        <span className="text-xs font-medium text-slate-600">{status.label}</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-800">{count}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Clientes e Estoque */}
            <div className="space-y-4">
              {/* Clientes */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-sm font-medium">Clientes</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-2xl font-bold text-slate-800">{data?.totalClientes || 0}</p>
                  {data?.clientesNovosMes && data.clientesNovosMes > 0 && (
                    <span className="text-sm text-emerald-600 font-medium mb-1">+{data.clientesNovosMes} este mês</span>
                  )}
                </div>
              </div>

              {/* Estoque */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 text-sm font-medium">Estoque</span>
                  <Package className="w-4 h-4 text-slate-400" />
                </div>
                {data?.produtosEstoqueBaixo && data.produtosEstoqueBaixo.length > 0 ? (
                  <div className="flex items-end gap-3">
                    <p className="text-2xl font-bold text-red-600">{data.produtosEstoqueBaixo.length}</p>
                    <span className="text-sm text-red-600 font-medium mb-1">produto(s) baixo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm text-emerald-600 font-medium">Tudo em ordem</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Seção Inferior - Gráficos */}
          <div className="grid grid-cols-2 gap-4">
            {/* Distribuição de Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Distribuição de Status</h3>
              <div className="space-y-3">
                {[
                  { key: "AGUARDANDO", label: "Aguardando", color: "bg-amber-500" },
                  { key: "LAVANDO", label: "Lavando", color: "bg-cyan-500" },
                  { key: "FINALIZANDO", label: "Finalizando", color: "bg-blue-500" },
                  { key: "PRONTO", label: "Pronto", color: "bg-emerald-500" },
                  { key: "ENTREGUE", label: "Entregue", color: "bg-slate-400" },
                ].map((status) => {
                  const count = data?.ordensPorStatus?.[status.key] || 0;
                  const total = Object.values(data?.ordensPorStatus || {}).reduce((a, b) => a + b, 0);
                  const percent = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={status.key} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${status.color} flex-shrink-0`} />
                      <span className="text-sm text-slate-600 w-24">{status.label}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${status.color} rounded-full`} style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-800 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Serviços */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Top Serviços do Mês</h3>
              {chartData && chartData.length > 0 ? (
                <div className="space-y-3">
                  {data?.servicosMaisVendidos?.slice(0, 5).map((servico, index) => (
                    <div key={servico.servicoId} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                        index === 0 ? 'bg-amber-100 text-amber-700' :
                        index === 1 ? 'bg-slate-200 text-slate-600' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm text-slate-700 truncate">{servico.nome}</span>
                      <span className="text-sm font-semibold text-slate-800">{servico._count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                  <Droplets className="w-8 h-8 mb-2 text-slate-300" />
                  <p className="text-sm">Nenhum serviço registrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { href: "/kanban", label: "Fila do Pátio", icon: Columns3, desc: "Ver veículos" },
              { href: "/clientes", label: "Clientes", icon: Users, desc: "Gerenciar cadastros" },
              { href: "/servicos", label: "Serviços", icon: Droplets, desc: "Ver catálogo" },
              { href: "/agendamentos", label: "Agendamentos", icon: Calendar, desc: "Próximos horários" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-4 py-3 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <item.icon className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
