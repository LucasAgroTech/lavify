"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, StatCard } from "@/components/Card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  faturamentoHoje: number;
  faturamentoMes: number;
}

export default function FinanceiroPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // Dados fictícios para o gráfico (em um app real, viriam do backend)
  const chartData = [
    { dia: "Seg", receita: 850, despesa: 150 },
    { dia: "Ter", receita: 1200, despesa: 200 },
    { dia: "Qua", receita: 950, despesa: 180 },
    { dia: "Qui", receita: 1500, despesa: 250 },
    { dia: "Sex", receita: 1800, despesa: 300 },
    { dia: "Sáb", receita: 2200, despesa: 350 },
    { dia: "Dom", receita: 800, despesa: 100 },
  ];

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

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Financeiro</h1>
          <p className="text-slate-500 mt-1">
            Acompanhe receitas e despesas
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600">
            {new Date().toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          color="cyan"
        />
        <StatCard
          title="Receitas"
          value={formatCurrency(9300)}
          icon={<ArrowUpRight className="w-7 h-7" />}
          color="green"
        />
        <StatCard
          title="Despesas"
          value={formatCurrency(1530)}
          icon={<ArrowDownRight className="w-7 h-7" />}
          color="red"
        />
      </div>

      {/* Gráfico */}
      <Card title="Fluxo de Caixa Semanal" icon={<TrendingUp className="w-5 h-5" />}>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="dia" stroke="#94a3b8" fontSize={12} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(v) => `R$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="receita"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReceita)"
              name="Receita"
            />
            <Area
              type="monotone"
              dataKey="despesa"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDespesa)"
              name="Despesa"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Receitas Recentes" icon={<ArrowUpRight className="w-5 h-5" />}>
          <div className="space-y-4">
            {[
              { desc: "OS #156 - Lavagem Completa", valor: 150, hora: "14:32" },
              { desc: "OS #155 - Polimento", valor: 280, hora: "13:15" },
              { desc: "OS #154 - Lavagem Simples", valor: 50, hora: "11:45" },
              { desc: "OS #153 - Higienização", valor: 200, hora: "10:20" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-700">{item.desc}</p>
                  <p className="text-xs text-slate-400">{item.hora}</p>
                </div>
                <span className="font-semibold text-emerald-600">
                  +{formatCurrency(item.valor)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Despesas Recentes" icon={<ArrowDownRight className="w-5 h-5" />}>
          <div className="space-y-4">
            {[
              { desc: "Reposição Shampoo 20L", valor: 89.9, hora: "Ontem" },
              { desc: "Conta de Água", valor: 320, hora: "03/01" },
              { desc: "Cera Automotiva", valor: 156, hora: "02/01" },
              { desc: "Energia Elétrica", valor: 480, hora: "01/01" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-700">{item.desc}</p>
                  <p className="text-xs text-slate-400">{item.hora}</p>
                </div>
                <span className="font-semibold text-red-600">
                  -{formatCurrency(item.valor)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

