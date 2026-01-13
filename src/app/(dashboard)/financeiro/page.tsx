"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
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

  const receitasRecentes = [
    { desc: "OS #156 - Lavagem Completa", valor: 150, hora: "14:32" },
    { desc: "OS #155 - Polimento", valor: 280, hora: "13:15" },
    { desc: "OS #154 - Lavagem Simples", valor: 50, hora: "11:45" },
    { desc: "OS #153 - Higienização", valor: 200, hora: "10:20" },
  ];

  const despesasRecentes = [
    { desc: "Reposição Shampoo 20L", valor: 89.9, hora: "Ontem" },
    { desc: "Conta de Água", valor: 320, hora: "03/01" },
    { desc: "Cera Automotiva", valor: 156, hora: "02/01" },
    { desc: "Energia Elétrica", valor: 480, hora: "01/01" },
  ];

  const totalReceitas = 9300;
  const totalDespesas = 1530;
  const lucro = totalReceitas - totalDespesas;

  if (loading) {
    return (
      <div className="p-6 xl:p-8 min-h-screen bg-slate-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl" />
              ))}
            </div>
            <div className="h-80 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 xl:p-8 min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Financeiro</h1>
            <p className="text-slate-500 text-sm mt-0.5">Acompanhe receitas e despesas</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 font-medium">
              {new Date().toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(data?.faturamentoHoje || 0)}</p>
                <p className="text-sm text-slate-500">Hoje</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(data?.faturamentoMes || 0)}</p>
                <p className="text-sm text-slate-500">Este Mês</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalReceitas)}</p>
                <p className="text-sm text-slate-500">Receitas</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</p>
                <p className="text-sm text-slate-500">Despesas</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(lucro)}</p>
                <p className="text-sm text-slate-300">Lucro</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Fluxo de Caixa Semanal</h2>
              <p className="text-sm text-slate-500">Receitas vs Despesas</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Receitas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-600">Despesas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="dia" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(v) => `R$${v}`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "13px",
                }}
                formatter={(value) => formatCurrency(value as number)}
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
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-2 gap-6">
          {/* Receitas */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Receitas Recentes</h3>
              </div>
              <span className="text-sm text-emerald-600 font-medium">+{formatCurrency(receitasRecentes.reduce((a, b) => a + b.valor, 0))}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {receitasRecentes.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{item.desc}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.hora}</p>
                  </div>
                  <span className="font-semibold text-emerald-600">
                    +{formatCurrency(item.valor)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Despesas */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-800">Despesas Recentes</h3>
              </div>
              <span className="text-sm text-red-600 font-medium">-{formatCurrency(despesasRecentes.reduce((a, b) => a + b.valor, 0))}</span>
            </div>
            <div className="divide-y divide-slate-100">
              {despesasRecentes.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-700 text-sm">{item.desc}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.hora}</p>
                  </div>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(item.valor)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

