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
      <div className="hidden lg:block p-5 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-[1400px] mx-auto space-y-4">
          
          {/* Header Tech */}
          <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Financeiro</h1>
                <p className="text-slate-400 text-sm font-mono">
                  {new Date().toLocaleDateString("pt-BR", { month: "short", year: "numeric" }).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Variação */}
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
                variacaoMes >= 0 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                {variacaoMes >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-bold text-lg font-mono ${variacaoMes >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {variacaoMes >= 0 ? '+' : ''}{variacaoMes}%
                </span>
                <span className="text-xs text-slate-500">vs mês anterior</span>
              </div>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Coluna Esquerda */}
            <div className="col-span-8 space-y-4">
              
              {/* Cards de Lucro, Receita e Despesa - TECH STYLE */}
              <div className="grid grid-cols-3 gap-4">
                {/* Lucro do Mês */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                        <PiggyBank className="w-6 h-6 text-purple-300" />
                      </div>
                      <span className="text-purple-300/80 font-medium text-sm uppercase tracking-wide">Lucro do Mês</span>
                    </div>
                    <p className="text-4xl font-bold text-white font-mono">{formatCurrency(lucro)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${lucro >= 0 ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                      <span className={`text-xs ${lucro >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {lucro >= 0 ? 'Positivo' : 'Negativo'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receitas - Card Tech Estético */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-5 group hover:border-emerald-500/50 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-emerald-400/80 font-medium text-sm uppercase tracking-wide">Receitas</span>
                    </div>
                    <p className="text-4xl font-bold text-emerald-400 font-mono">+{formatCurrencyShort(totalReceitas)}</p>
                    <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-full" />
                    </div>
                  </div>
                </div>

                {/* Despesas - Card Tech Estético */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-red-500/30 p-5 group hover:border-red-500/50 transition-all">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/40 flex items-center justify-center">
                        <ArrowDownRight className="w-6 h-6 text-red-400" />
                      </div>
                      <span className="text-red-400/80 font-medium text-sm uppercase tracking-wide">Despesas</span>
                    </div>
                    <p className="text-4xl font-bold text-red-400 font-mono">-{formatCurrencyShort(totalDespesas)}</p>
                    <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all"
                        style={{ width: `${totalReceitas > 0 ? Math.min((totalDespesas / totalReceitas) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico Tech */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-slate-300" />
                    </div>
                    Fluxo de Caixa Semanal
                  </h3>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                      <span className="text-slate-400">Receitas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-400" />
                      <span className="text-slate-400">Despesas</span>
                    </div>
                  </div>
                </div>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="dia" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickFormatter={(v) => `R$${v}`}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          border: "1px solid #334155",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "12px",
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
                  <div className="h-[220px] flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <Receipt className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Sem movimentações nesta semana</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Receitas e Despesas Recentes - Tech Style */}
              <div className="grid grid-cols-2 gap-4">
                {/* Receitas Recentes */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h3 className="font-semibold text-white text-sm">Receitas Recentes</h3>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                      +{formatCurrencyShort(receitasRecentes.reduce((a, b) => a + b.valor, 0))}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-700/30 max-h-[180px] overflow-y-auto">
                    {receitasRecentes.length > 0 ? (
                      receitasRecentes.slice(0, 5).map((item) => (
                        <div key={item.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-700/20 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-200 text-sm truncate">{item.desc}</p>
                            <p className="text-xs text-slate-500 font-mono">{item.hora}</p>
                          </div>
                          <span className="font-bold text-emerald-400 text-sm ml-2 font-mono">
                            +{formatCurrencyShort(item.valor)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center text-slate-500 text-sm">
                        Nenhuma receita recente
                      </div>
                    )}
                  </div>
                </div>

                {/* Despesas Recentes */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      </div>
                      <h3 className="font-semibold text-white text-sm">Despesas Recentes</h3>
                    </div>
                    <span className="text-xs text-red-400 font-bold bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
                      -{formatCurrencyShort(despesasRecentes.reduce((a, b) => a + b.valor, 0))}
                    </span>
                  </div>
                  <div className="divide-y divide-slate-700/30 max-h-[180px] overflow-y-auto">
                    {despesasRecentes.length > 0 ? (
                      despesasRecentes.slice(0, 5).map((item) => (
                        <div key={item.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-700/20 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-200 text-sm truncate">{item.desc}</p>
                            <p className="text-xs text-slate-500 font-mono">{item.hora}</p>
                          </div>
                          <span className="font-bold text-red-400 text-sm ml-2 font-mono">
                            -{formatCurrencyShort(item.valor)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center text-slate-500 text-sm">
                        Nenhuma despesa registrada
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="col-span-4 space-y-4">
              
              {/* Card Faturamento Destaque */}
              <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl p-5 text-white">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white/80 font-semibold text-sm uppercase tracking-wide">Faturamento do Mês</span>
                  </div>
                  <p className="text-5xl font-bold mb-2 font-mono">{formatCurrency(faturamentoMes)}</p>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    Média: {formatCurrency(faturamentoMes / new Date().getDate())}/dia
                  </div>
                </div>
              </div>

              {/* Stats Grid Tech */}
              <div className="grid grid-cols-2 gap-3">
                {/* Hoje */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 hover:border-slate-600/50 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-slate-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">Hoje</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{formatCurrencyShort(faturamentoHoje)}</p>
                  </div>
                </div>

                {/* Ticket Médio */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 hover:border-violet-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-violet-400" />
                      </div>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">Ticket</span>
                    </div>
                    <p className="text-2xl font-bold text-violet-400 font-mono">{formatCurrencyShort(ticketMedio)}</p>
                  </div>
                </div>

                {/* OS no Mês */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 hover:border-amber-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">OS Mês</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{totalOsMes}</p>
                  </div>
                </div>

                {/* Média/dia */}
                <div className="relative overflow-hidden bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 hover:border-cyan-500/30 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">Média</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{(totalOsMes / new Date().getDate()).toFixed(1)}</p>
                  </div>
                </div>
              </div>

              {/* Balanço Visual Tech */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
                <h3 className="font-bold text-white mb-4">Balanço do Mês</h3>
                <div className="space-y-4">
                  {/* Receitas */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Receitas</span>
                      <span className="font-bold text-emerald-400 font-mono">+{formatCurrencyShort(totalReceitas)}</span>
                    </div>
                    <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  
                  {/* Despesas */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Despesas</span>
                      <span className="font-bold text-red-400 font-mono">-{formatCurrencyShort(totalDespesas)}</span>
                    </div>
                    <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all"
                        style={{ width: `${totalReceitas > 0 ? Math.min((totalDespesas / totalReceitas) * 100, 100) : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Lucro */}
                  <div className="border-t border-slate-700/50 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300">Lucro Líquido</span>
                      <span className={`text-2xl font-bold font-mono ${lucro >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatCurrency(lucro)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Margem de {totalReceitas > 0 ? ((lucro / totalReceitas) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Indicador de Saúde Tech */}
              <div className={`relative overflow-hidden rounded-2xl border p-5 ${
                lucro > 0 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : lucro === 0 
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl ${
                  lucro > 0 ? 'bg-emerald-500/20' : lucro === 0 ? 'bg-amber-500/20' : 'bg-red-500/20'
                }`} />
                <div className="relative flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    lucro > 0 
                      ? 'bg-emerald-500/20 border border-emerald-500/30' 
                      : lucro === 0 
                        ? 'bg-amber-500/20 border border-amber-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    {lucro > 0 ? (
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    ) : lucro === 0 ? (
                      <AlertCircle className="w-6 h-6 text-amber-400" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${
                      lucro > 0 ? 'text-emerald-400' : lucro === 0 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {lucro > 0 ? 'Mês Positivo!' : lucro === 0 ? 'Equilíbrio' : 'Mês Negativo'}
                    </p>
                    <p className={`text-xs ${
                      lucro > 0 ? 'text-emerald-400/70' : lucro === 0 ? 'text-amber-400/70' : 'text-red-400/70'
                    }`}>
                      {lucro > 0 ? 'Continue assim!' : lucro === 0 ? 'Aumente receitas' : 'Revise despesas'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
