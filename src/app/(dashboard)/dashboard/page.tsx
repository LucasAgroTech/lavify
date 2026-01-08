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

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const chartData = data?.servicosMaisVendidos?.map((s) => ({
    name: s.nome.length > 15 ? s.nome.substring(0, 15) + "..." : s.nome,
    quantidade: s._count,
  })) || [];

  return (
    <div className="p-8 space-y-8">
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
  );
}
