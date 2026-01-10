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
    href: "/servicos", 
    label: "Serviços", 
    icon: Droplets, 
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
        <div className="px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Car className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-2xl font-bold text-white">{data?.osHoje || 0}</span>
              </div>
              <p className="text-xs text-slate-400">OS hoje</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {formatCurrencyCompact(data?.faturamentoHoje || 0)}
                </span>
              </div>
              <p className="text-xs text-slate-400">Faturado hoje</p>
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
      <div className="hidden lg:block p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1">
              Bem-vindo ao Lavify
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </div>
        </div>

        {/* Alerta de agendamentos pendentes */}
        {data?.agendamentosPendentes && data.agendamentosPendentes > 0 && (
          <Link
            href="/agendamentos"
            className="block bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-5 animate-slide-in hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Bell className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cyan-800">
                  Novos Agendamentos!
                </h3>
                <p className="text-cyan-600 text-sm mt-1">
                  Você tem {data.agendamentosPendentes} agendamento(s) aguardando confirmação
                </p>
              </div>
              <div className="flex items-center gap-2 text-cyan-600">
                <span className="text-sm font-medium">Ver agendamentos</span>
                <Calendar className="w-5 h-5" />
              </div>
            </div>
          </Link>
        )}

        {/* Alerta de estoque baixo */}
        {data?.produtosEstoqueBaixo && data.produtosEstoqueBaixo.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 animate-slide-in">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">
                  Atenção! Estoque Baixo
                </h3>
                <p className="text-red-600 text-sm mt-1">
                  {data.produtosEstoqueBaixo.length} produto(s) precisam de
                  reposição
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.produtosEstoqueBaixo.map((produto) => (
                    <Badge key={produto.id} variant="danger" size="sm">
                      {produto.nome}: {produto.quantidade}
                      {produto.unidade}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="OS Hoje"
            value={data?.osHoje || 0}
            icon={<Car className="w-7 h-7" />}
            color="cyan"
          />
          <StatCard
            title="Em Andamento"
            value={data?.osEmAndamento || 0}
            icon={<Droplets className="w-7 h-7" />}
            color="amber"
          />
          <StatCard
            title="Faturamento Hoje"
            value={formatCurrency(data?.faturamentoHoje || 0)}
            icon={<DollarSign className="w-7 h-7" />}
            color="green"
          />
          <StatCard
            title="Faturamento Mês"
            value={formatCurrency(data?.faturamentoMes || 0)}
            icon={<TrendingUp className="w-7 h-7" />}
            color="purple"
          />
        </div>

        {/* Segunda linha de stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total de Clientes"
            value={data?.totalClientes || 0}
            icon={<Users className="w-7 h-7" />}
            color="cyan"
          />
          <StatCard
            title="Clientes Novos (Mês)"
            value={data?.clientesNovosMes || 0}
            icon={<Users className="w-7 h-7" />}
            color="green"
          />
          <StatCard
            title="Produtos em Estoque Baixo"
            value={data?.produtosEstoqueBaixo?.length || 0}
            icon={<Package className="w-7 h-7" />}
            color={data?.produtosEstoqueBaixo?.length ? "red" : "green"}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status das OS */}
          <Card title="Status das Ordens" icon={<Car className="w-5 h-5" />}>
            <div className="space-y-4">
              {[
                { key: "AGUARDANDO", label: "Aguardando", color: "bg-amber-500" },
                { key: "LAVANDO", label: "Lavando", color: "bg-cyan-500" },
                {
                  key: "FINALIZANDO",
                  label: "Finalizando",
                  color: "bg-blue-500",
                },
                { key: "PRONTO", label: "Pronto", color: "bg-emerald-500" },
                { key: "ENTREGUE", label: "Entregue", color: "bg-slate-400" },
              ].map((status) => {
                const count = data?.ordensPorStatus?.[status.key] || 0;
                const total = Object.values(data?.ordensPorStatus || {}).reduce(
                  (a, b) => a + b,
                  0
                );
                const percent = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={status.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{status.label}</span>
                      <span className="font-medium text-slate-800">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${status.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Serviços mais vendidos */}
          <Card
            title="Serviços Mais Vendidos"
            icon={<Droplets className="w-5 h-5" />}
          >
            {chartData && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="quantidade"
                    fill="url(#colorGradient)"
                    radius={[0, 8, 8, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-slate-400">
                Nenhum serviço registrado ainda
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
