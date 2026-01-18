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
  ChevronRight,
  Receipt,
  AlertCircle,
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

interface ChartDataItem {
  dia: string;
  receita: number;
  despesa: number;
}

interface TransacaoItem {
  id: string;
  desc: string;
  valor: number;
  data: string;
  hora: string;
}

interface FinanceiroData {
  faturamentoHoje: number;
  faturamentoMes: number;
  faturamentoMesAnterior: number;
  variacaoMes: number;
  totalReceitas: number;
  totalDespesas: number;
  lucro: number;
  ticketMedio: number;
  totalOsMes: number;
  receitasRecentes: TransacaoItem[];
  despesasRecentes: TransacaoItem[];
  chartData: ChartDataItem[];
}

export default function FinanceiroPage() {
  const [data, setData] = useState<FinanceiroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setError(null);
      const res = await fetch("/api/financeiro");
      if (!res.ok) throw new Error("Erro ao buscar dados");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Não foi possível carregar os dados financeiros");
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000) {
      return `R$${(value / 1000).toFixed(1)}k`;
    }
    return formatCurrency(value);
  };

  if (loading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="lg:hidden p-4 pb-24 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-40" />
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-24 bg-slate-200 rounded-xl" />
              <div className="h-24 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-48 bg-slate-200 rounded-xl" />
          </div>
        </div>
        {/* Desktop Loading */}
        <div className="hidden lg:block p-6 xl:p-8 min-h-screen bg-slate-50">
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
      </>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">{error || "Erro ao carregar dados"}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const {
    faturamentoHoje,
    faturamentoMes,
    variacaoMes,
    totalReceitas,
    totalDespesas,
    lucro,
    ticketMedio,
    totalOsMes,
    receitasRecentes,
    despesasRecentes,
    chartData,
  } = data;

  return (
    <div className="pb-24 lg:pb-0">
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Financeiro</h1>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Card de Lucro Principal */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-300">Lucro do Mês</span>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{formatCurrency(lucro)}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className={variacaoMes >= 0 ? "text-emerald-400" : "text-red-400"}>
                {variacaoMes >= 0 ? "+" : ""}{variacaoMes}%
              </span>
              <span className="text-slate-400">vs mês anterior</span>
            </div>
          </div>

          {/* Grid de Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-xs text-slate-500">Hoje</span>
              </div>
              <p className="text-lg font-bold text-slate-800">
                {formatCurrencyShort(faturamentoHoje)}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-cyan-600" />
                </div>
                <span className="text-xs text-slate-500">Este Mês</span>
              </div>
              <p className="text-lg font-bold text-slate-800">
                {formatCurrencyShort(faturamentoMes)}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-xs text-slate-500">Receitas</span>
              </div>
              <p className="text-lg font-bold text-emerald-600">
                {formatCurrencyShort(totalReceitas)}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-xs text-slate-500">Despesas</span>
              </div>
              <p className="text-lg font-bold text-red-600">
                {formatCurrencyShort(totalDespesas)}
              </p>
            </div>
          </div>

          {/* Ticket Médio e Total OS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-violet-600" />
                </div>
                <span className="text-xs text-slate-500">Ticket Médio</span>
              </div>
              <p className="text-lg font-bold text-slate-800">
                {formatCurrency(ticketMedio)}
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs text-slate-500">OS no Mês</span>
              </div>
              <p className="text-lg font-bold text-slate-800">{totalOsMes}</p>
            </div>
          </div>

          {/* Gráfico Simplificado Mobile */}
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Fluxo Semanal</h2>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-500">Receita</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-slate-500">Despesa</span>
                </div>
              </div>
            </div>
            {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barGap={2}>
                <XAxis 
                  dataKey="dia" 
                  stroke="#94a3b8" 
                  fontSize={10} 
                  axisLine={false} 
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "8px 12px",
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                  <Bar dataKey="receita" fill="#10b981" radius={[4, 4, 0, 0]} name="Receita" />
                  <Bar dataKey="despesa" fill="#ef4444" radius={[4, 4, 0, 0]} name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
                Sem dados para exibir
              </div>
            )}
          </div>

          {/* Receitas Recentes */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">Receitas</h3>
              </div>
              <span className="text-xs text-emerald-600 font-medium">
                +{formatCurrency(receitasRecentes.reduce((a, b) => a + b.valor, 0))}
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {receitasRecentes.length > 0 ? (
                receitasRecentes.slice(0, 3).map((item) => (
                  <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm truncate">{item.desc}</p>
                    <p className="text-xs text-slate-400">{item.hora}</p>
                  </div>
                  <span className="font-semibold text-emerald-600 text-sm ml-2">
                    +{formatCurrency(item.valor)}
                  </span>
                </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-slate-400 text-sm">
                  Nenhuma receita recente
                </div>
              )}
            </div>
          </div>

          {/* Despesas Recentes */}
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                  <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm">Despesas</h3>
              </div>
              <span className="text-xs text-red-600 font-medium">
                -{formatCurrency(despesasRecentes.reduce((a, b) => a + b.valor, 0))}
              </span>
            </div>
            <div className="divide-y divide-slate-50">
              {despesasRecentes.length > 0 ? (
                despesasRecentes.slice(0, 3).map((item) => (
                  <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm truncate">{item.desc}</p>
                    <p className="text-xs text-slate-400">{item.hora}</p>
                  </div>
                  <span className="font-semibold text-red-600 text-sm ml-2">
                    -{formatCurrency(item.valor)}
                  </span>
                </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-slate-400 text-sm">
                  Nenhuma despesa registrada
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-6 xl:p-8 min-h-screen bg-slate-50">
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

          {/* Card de Lucro Principal - Destaque */}
          <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-2xl p-6 text-white">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                  <PiggyBank className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Lucro do Mês</p>
                  <p className="text-3xl xl:text-4xl font-bold">{formatCurrency(lucro)}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 xl:gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(totalReceitas)}</p>
                  <p className="text-xs text-slate-400">Receitas</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">-{formatCurrency(totalDespesas)}</p>
                  <p className="text-xs text-slate-400">Despesas</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <p className={`text-xl font-bold ${variacaoMes >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {variacaoMes >= 0 ? "+" : ""}{variacaoMes}%
                  </p>
                  <p className="text-xs text-slate-400">vs mês anterior</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - Responsivo */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-slate-600" />
                </div>
                <span className="text-sm text-slate-500 font-medium">Hoje</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(faturamentoHoje)}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-sm text-slate-500 font-medium">Este Mês</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(faturamentoMes)}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5 text-violet-600" />
                </div>
                <span className="text-sm text-slate-500 font-medium">Ticket Médio</span>
              </div>
              <p className="text-2xl font-bold text-violet-600">{formatCurrency(ticketMedio)}</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-sm text-slate-500 font-medium">OS no Mês</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">{totalOsMes}</p>
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
            {chartData.length > 0 ? (
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
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Sem movimentações nesta semana</p>
                </div>
              </div>
            )}
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
                <span className="text-sm text-emerald-600 font-medium">
                  +{formatCurrency(receitasRecentes.reduce((a, b) => a + b.valor, 0))}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {receitasRecentes.length > 0 ? (
                  receitasRecentes.map((item) => (
                    <div key={item.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-700 text-sm">{item.desc}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.hora}</p>
                    </div>
                    <span className="font-semibold text-emerald-600">
                      +{formatCurrency(item.valor)}
                    </span>
                  </div>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma receita recente</p>
                  </div>
                )}
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
                <span className="text-sm text-red-600 font-medium">
                  -{formatCurrency(despesasRecentes.reduce((a, b) => a + b.valor, 0))}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {despesasRecentes.length > 0 ? (
                  despesasRecentes.map((item) => (
                    <div key={item.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-medium text-slate-700 text-sm">{item.desc}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.hora}</p>
                    </div>
                    <span className="font-semibold text-red-600">
                      -{formatCurrency(item.valor)}
                    </span>
                  </div>
                  ))
                ) : (
                  <div className="px-5 py-8 text-center text-slate-400">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma despesa registrada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
