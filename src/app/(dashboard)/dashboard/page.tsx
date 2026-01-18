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
      <div className="hidden lg:block p-5 min-h-screen bg-slate-100">
        <div className="max-w-[1400px] mx-auto space-y-4">
          
          {/* Header Compacto */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  {usuario?.lavaJato?.nome || "Lava Jato"}
                </h1>
                <p className="text-slate-500 text-sm">
                  {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Alertas inline */}
              {(data?.agendamentosPendentes ?? 0) > 0 && (
                <Link href="/agendamentos" className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-100 transition-colors">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-medium text-sm">{data?.agendamentosPendentes}</span>
                </Link>
              )}
              {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 && (
                <Link href="/estoque" className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-100 transition-colors">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 font-medium text-sm">{data?.produtosEstoqueBaixo?.length}</span>
                </Link>
              )}
              <Link 
                href="/nova-os"
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
              >
                <Wrench className="w-4 h-4" />
                Nova OS
              </Link>
            </div>
          </div>

          {/* Grid Principal - Layout Compacto para Print */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Coluna Esquerda - Métricas + Pátio */}
            <div className="col-span-8 space-y-4">
              
              {/* Métricas do Dia - Compactas */}
              <div className="grid grid-cols-4 gap-3">
                {/* OS Hoje */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <Car className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{data?.osHoje || 0}</p>
                      <p className="text-xs text-slate-500">OS hoje</p>
                    </div>
                  </div>
                </div>

                {/* No Pátio */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Columns3 className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{data?.osEmAndamento || 0}</p>
                      <p className="text-xs text-slate-500">No pátio</p>
                    </div>
                  </div>
                </div>

                {/* Faturamento Hoje */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrencyCompact(data?.faturamentoHoje || 0)}</p>
                      <p className="text-xs text-slate-500">Hoje</p>
                    </div>
                  </div>
                </div>

                {/* Faturamento Mês */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{formatCurrencyCompact(data?.faturamentoMes || 0)}</p>
                      <p className="text-xs text-slate-400">Este mês</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status do Pátio - Destaque Visual */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Columns3 className="w-5 h-5 text-slate-600" />
                    Fila do Pátio
                  </h3>
                  <Link href="/kanban" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                    Ver Kanban
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {statusConfig.map((status) => {
                    const count = data?.ordensPorStatus?.[status.key] || 0;
                    return (
                      <div
                        key={status.key}
                        className={`rounded-xl border-2 ${status.border} ${status.bgLight} p-4 text-center`}
                      >
                        <span className="text-2xl mb-1 block">{status.emoji}</span>
                        <p className="text-3xl font-bold text-slate-800">{count}</p>
                        <p className="text-xs font-medium text-slate-600 mt-1">{status.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gráfico Principal - Top Serviços com Barras */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-slate-600" />
                  Serviços Mais Vendidos
                </h3>
                {chartData && chartData.length > 0 ? (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 12, fill: '#475569' }} 
                          axisLine={false} 
                          tickLine={false}
                          width={120}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: 'none', 
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '12px'
                          }}
                          formatter={(value: number) => [`${value} vendas`, '']}
                        />
                        <Bar 
                          dataKey="quantidade" 
                          fill="#06b6d4" 
                          radius={[0, 4, 4, 0]}
                          barSize={24}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
                    <Droplets className="w-10 h-10 mb-2 text-slate-300" />
                    <p className="text-sm">Nenhum serviço registrado ainda</p>
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita - Resumo + Clientes */}
            <div className="col-span-4 space-y-4">
              
              {/* Card Destaque - Faturamento */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 text-emerald-200" />
                  <span className="text-emerald-100 font-medium text-sm">Faturamento do Mês</span>
                </div>
                <p className="text-4xl font-bold mb-1">{formatCurrency(data?.faturamentoMes || 0)}</p>
                <p className="text-emerald-200 text-sm">
                  Média diária: {formatCurrency((data?.faturamentoMes || 0) / new Date().getDate())}
                </p>
              </div>

              {/* Clientes */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-600" />
                    Clientes
                  </h3>
                  <Link href="/clientes" className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                    Ver todos
                  </Link>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold text-slate-800">{data?.totalClientes || 0}</p>
                  {data?.clientesNovosMes && data.clientesNovosMes > 0 && (
                    <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      +{data.clientesNovosMes} novos
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-1">cadastrados no sistema</p>
              </div>

              {/* Distribuição de Status */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-800 mb-4">Distribuição</h3>
                <div className="space-y-2.5">
                  {[
                    { key: "AGUARDANDO", label: "Aguardando", color: "bg-amber-500" },
                    { key: "LAVANDO", label: "Lavando", color: "bg-cyan-500" },
                    { key: "FINALIZANDO", label: "Finalizando", color: "bg-blue-500" },
                    { key: "PRONTO", label: "Pronto", color: "bg-emerald-500" },
                  ].map((status) => {
                    const count = data?.ordensPorStatus?.[status.key] || 0;
                    const total = statusConfig.reduce((acc, s) => acc + (data?.ordensPorStatus?.[s.key] || 0), 0);
                    const percent = total > 0 ? (count / total) * 100 : 0;

                    return (
                      <div key={status.key} className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${status.color} flex-shrink-0`} />
                        <span className="text-xs text-slate-600 w-20">{status.label}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${status.color} rounded-full transition-all`} style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estoque Status */}
              <div className={`rounded-xl border p-5 ${
                (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                      ? 'bg-red-100' 
                      : 'bg-emerald-100'
                  }`}>
                    <Package className={`w-5 h-5 ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                        ? 'text-red-600' 
                        : 'text-emerald-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                        ? 'text-red-800' 
                        : 'text-emerald-800'
                    }`}>
                      {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                        ? `${data?.produtosEstoqueBaixo?.length} produto(s) baixo`
                        : 'Estoque OK'
                      }
                    </p>
                    <p className={`text-xs ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                        ? 'text-red-600' 
                        : 'text-emerald-600'
                    }`}>
                      {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                        ? 'Precisa repor'
                        : 'Tudo abastecido'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas Compactas */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/kanban", label: "Pátio", icon: Columns3 },
                  { href: "/clientes", label: "Clientes", icon: Users },
                  { href: "/servicos", label: "Serviços", icon: Droplets },
                  { href: "/agendamentos", label: "Agenda", icon: Calendar },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2.5 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    <item.icon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
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
