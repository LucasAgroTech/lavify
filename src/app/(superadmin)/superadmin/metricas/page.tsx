"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  ClipboardList,
  DollarSign,
  Target,
  Zap,
  AlertTriangle,
  Crown,
  Activity,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Metricas {
  funil: {
    totalCadastros: number;
    cadastrosHoje: number;
    cadastrosSemana: number;
    cadastrosMes: number;
    cadastrosMesPassado: number;
    crescimentoCadastros: number;
    emTrial: number;
    trialExpirando: number;
    convertidos: number;
    cancelados: number;
    taxaConversao: number;
    porPlano: Record<string, number>;
    porStripeStatus: Record<string, number>;
  };
  engajamento: {
    totalOS: number;
    osHoje: number;
    osSemana: number;
    osMes: number;
    lavaJatosAtivos: number;
    taxaAtivacao: number;
    totalClientes: number;
    clientesMes: number;
    totalAgendamentos: number;
    agendamentosMes: number;
    loginsHoje: number;
    loginsSemana: number;
    lavaJatosQueLogaram: number;
  };
  receita: {
    faturamentoMes: number;
    faturamentoMesPassado: number;
  };
  tendencias: {
    cadastrosPorDia: { data: string; quantidade: number }[];
    osPorDia: { data: string; quantidade: number }[];
  };
  topLavaJatos: {
    nome: string;
    plano: string;
    stripeStatus: string | null;
    osNoMes: number;
  }[];
}

export default function MetricasPage() {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const res = await fetch("/api/superadmin/metricas");
        if (res.ok) {
          const data = await res.json();
          setMetricas(data);
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetricas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="p-6 text-center text-slate-400">
        Erro ao carregar métricas
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // Dados do funil visual
  const funilData = [
    { etapa: "Cadastros", valor: metricas.funil.totalCadastros, cor: "from-blue-500 to-cyan-500" },
    { etapa: "Em Trial", valor: metricas.funil.emTrial, cor: "from-amber-500 to-yellow-500" },
    { etapa: "Convertidos", valor: metricas.funil.convertidos, cor: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Métricas & Performance</h1>
            <p className="text-slate-400 text-sm">Visão completa do funil e engrenagens do sistema</p>
          </div>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Taxa de Conversão */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">CONVERSÃO</span>
          </div>
          <p className="text-3xl font-bold text-white">{metricas.funil.taxaConversao}%</p>
          <p className="text-xs text-slate-400 mt-1">
            {metricas.funil.convertidos} de {metricas.funil.totalCadastros} cadastros
          </p>
        </div>

        {/* Taxa de Ativação */}
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-medium">ATIVAÇÃO</span>
          </div>
          <p className="text-3xl font-bold text-white">{metricas.engajamento.taxaAtivacao}%</p>
          <p className="text-xs text-slate-400 mt-1">
            {metricas.engajamento.lavaJatosAtivos} ativos na semana
          </p>
        </div>

        {/* Crescimento */}
        <div className={`bg-gradient-to-br ${metricas.funil.crescimentoCadastros >= 0 ? "from-emerald-500/20 to-green-500/10 border-emerald-500/30" : "from-red-500/20 to-rose-500/10 border-red-500/30"} border rounded-2xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            {metricas.funil.crescimentoCadastros >= 0 ? (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-xs font-medium ${metricas.funil.crescimentoCadastros >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              CRESCIMENTO
            </span>
          </div>
          <p className="text-3xl font-bold text-white">
            {metricas.funil.crescimentoCadastros >= 0 ? "+" : ""}{metricas.funil.crescimentoCadastros}%
          </p>
          <p className="text-xs text-slate-400 mt-1">vs mês anterior</p>
        </div>

        {/* Trial Expirando */}
        <div className={`bg-gradient-to-br ${metricas.funil.trialExpirando > 0 ? "from-amber-500/20 to-orange-500/10 border-amber-500/30" : "from-slate-500/20 to-slate-500/10 border-slate-500/30"} border rounded-2xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-5 h-5 ${metricas.funil.trialExpirando > 0 ? "text-amber-400" : "text-slate-400"}`} />
            <span className={`text-xs font-medium ${metricas.funil.trialExpirando > 0 ? "text-amber-400" : "text-slate-400"}`}>
              TRIAL EXPIRANDO
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{metricas.funil.trialExpirando}</p>
          <p className="text-xs text-slate-400 mt-1">próximos 3 dias</p>
        </div>
      </div>

      {/* Funil Visual */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 mb-6">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          Funil de Conversão
        </h2>
        
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {funilData.map((item, index) => {
            const width = Math.max(20, (item.valor / funilData[0].valor) * 100);
            return (
              <div key={item.etapa} className="flex items-center">
                <div className="text-center">
                  <div
                    className={`bg-gradient-to-r ${item.cor} rounded-xl py-4 px-6 md:px-8 mb-2 transition-all hover:scale-105`}
                    style={{ minWidth: `${width}%`, maxWidth: "200px" }}
                  >
                    <p className="text-2xl md:text-3xl font-bold text-white">{item.valor}</p>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400">{item.etapa}</p>
                </div>
                {index < funilData.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-slate-600 mx-1 md:mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Status detalhado */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-4 border-t border-slate-700">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs">STARTER</span>
            </div>
            <p className="text-lg font-bold text-slate-300">{metricas.funil.porPlano.STARTER || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <Crown className="w-4 h-4" />
              <span className="text-xs">PRO</span>
            </div>
            <p className="text-lg font-bold text-blue-400">{metricas.funil.porPlano.PRO || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Crown className="w-4 h-4" />
              <span className="text-xs">PREMIUM</span>
            </div>
            <p className="text-lg font-bold text-amber-400">{metricas.funil.porPlano.PREMIUM || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs">ATIVOS</span>
            </div>
            <p className="text-lg font-bold text-green-400">{metricas.funil.porStripeStatus.active || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
              <XCircle className="w-4 h-4" />
              <span className="text-xs">CANCELADOS</span>
            </div>
            <p className="text-lg font-bold text-red-400">{metricas.funil.cancelados}</p>
          </div>
        </div>
      </div>

      {/* Grid de Gráficos e Métricas */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Cadastros */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Cadastros (últimos 30 dias)
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metricas.tendencias.cadastrosPorDia}>
                <defs>
                  <linearGradient id="colorCadastros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="data"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={false}
                  interval={6}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area
                  type="monotone"
                  dataKey="quantidade"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCadastros)"
                  name="Cadastros"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-xs text-slate-500">Hoje</p>
              <p className="text-lg font-bold text-white">{metricas.funil.cadastrosHoje}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Semana</p>
              <p className="text-lg font-bold text-white">{metricas.funil.cadastrosSemana}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Mês</p>
              <p className="text-lg font-bold text-white">{metricas.funil.cadastrosMes}</p>
            </div>
          </div>
        </div>

        {/* Gráfico de OS */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            Ordens de Serviço (últimos 30 dias)
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricas.tendencias.osPorDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="data"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={false}
                  interval={6}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Bar dataKey="quantidade" fill="#10b981" radius={[2, 2, 0, 0]} name="OS Criadas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-xs text-slate-500">Hoje</p>
              <p className="text-lg font-bold text-white">{metricas.engajamento.osHoje}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Semana</p>
              <p className="text-lg font-bold text-white">{metricas.engajamento.osSemana}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Mês</p>
              <p className="text-lg font-bold text-white">{metricas.engajamento.osMes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Engajamento e Top Lava-Jatos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Métricas de Engajamento */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Engajamento da Plataforma
          </h3>
          
          <div className="space-y-4">
            {/* Logins */}
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Logins</p>
                  <p className="text-xs text-slate-500">{metricas.engajamento.lavaJatosQueLogaram} lava-jatos na semana</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{metricas.engajamento.loginsSemana}</p>
                <p className="text-xs text-slate-500">{metricas.engajamento.loginsHoje} hoje</p>
              </div>
            </div>

            {/* Clientes */}
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Clientes Cadastrados</p>
                  <p className="text-xs text-slate-500">pelos lava-jatos</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{metricas.engajamento.totalClientes.toLocaleString()}</p>
                <p className="text-xs text-slate-500">+{metricas.engajamento.clientesMes} no mês</p>
              </div>
            </div>

            {/* Agendamentos */}
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Agendamentos</p>
                  <p className="text-xs text-slate-500">feitos pelo app</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{metricas.engajamento.totalAgendamentos.toLocaleString()}</p>
                <p className="text-xs text-slate-500">+{metricas.engajamento.agendamentosMes} no mês</p>
              </div>
            </div>

            {/* Total OS */}
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Total de OS</p>
                  <p className="text-xs text-slate-500">criadas no sistema</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{metricas.engajamento.totalOS.toLocaleString()}</p>
                <p className="text-xs text-slate-500">+{metricas.engajamento.osMes} no mês</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Lava-Jatos */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Top 10 Lava-Jatos (OS no mês)
          </h3>
          
          <div className="space-y-2 max-h-[340px] overflow-y-auto">
            {metricas.topLavaJatos.map((lj, index) => (
              <div
                key={lj.nome}
                className="flex items-center justify-between p-2.5 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? "bg-amber-500 text-white" :
                    index === 1 ? "bg-slate-400 text-white" :
                    index === 2 ? "bg-amber-700 text-white" :
                    "bg-slate-700 text-slate-400"
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium truncate max-w-[150px]">{lj.nome}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        lj.plano === "PREMIUM" ? "bg-amber-500/20 text-amber-400" :
                        lj.plano === "PRO" ? "bg-blue-500/20 text-blue-400" :
                        "bg-slate-500/20 text-slate-400"
                      }`}>
                        {lj.plano}
                      </span>
                      {lj.stripeStatus === "active" && (
                        <span className="text-[10px] text-green-400">●</span>
                      )}
                      {lj.stripeStatus === "trialing" && (
                        <span className="text-[10px] text-amber-400">● trial</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">{lj.osNoMes}</p>
                  <p className="text-[10px] text-slate-500">OS</p>
                </div>
              </div>
            ))}

            {metricas.topLavaJatos.length === 0 && (
              <p className="text-center text-slate-500 py-8">Nenhuma OS criada no mês</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
