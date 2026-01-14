"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Car,
  Phone,
  Mail,
  Check,
  X,
  Loader2,
  ChevronDown,
  MessageCircle,
  AlertCircle,
  Play,
  CalendarDays,
  CalendarClock,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  Users,
  DollarSign,
} from "lucide-react";
import { format, isToday, isTomorrow, isPast, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Agendamento {
  id: string;
  dataHora: string;
  status: string;
  observacoes: string | null;
  totalEstimado: number;
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
  };
  veiculo: {
    placa: string;
    modelo: string;
    cor: string | null;
  };
  servicos: {
    servico: {
      nome: string;
      preco: number;
      tempoEstimado: number;
    };
  }[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  PENDENTE: { label: "Pendente", color: "text-amber-700", bg: "bg-amber-100", dot: "bg-amber-500" },
  CONFIRMADO: { label: "Confirmado", color: "text-emerald-700", bg: "bg-emerald-100", dot: "bg-emerald-500" },
  EM_ANDAMENTO: { label: "Em andamento", color: "text-blue-700", bg: "bg-blue-100", dot: "bg-blue-500" },
  CONCLUIDO: { label: "Concluído", color: "text-slate-700", bg: "bg-slate-200", dot: "bg-slate-500" },
  CANCELADO: { label: "Cancelado", color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
  NAO_COMPARECEU: { label: "Não compareceu", color: "text-red-700", bg: "bg-red-100", dot: "bg-red-500" },
};

const tabs = [
  { id: "PENDENTE", label: "Pendentes", icon: Clock, color: "amber" },
  { id: "CONFIRMADO", label: "Confirmados", icon: Check, color: "emerald" },
  { id: "EM_ANDAMENTO", label: "Em Andamento", icon: Play, color: "blue" },
  { id: "all", label: "Todos", icon: CalendarDays, color: "slate" },
];

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDENTE");
  const [atualizando, setAtualizando] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetchAgendamentos();
  }, [activeTab]);

  async function fetchAgendamentos() {
    setLoading(true);
    try {
      const params = activeTab !== "all" ? `?status=${activeTab}` : "";
      const res = await fetch(`/api/agendamentos${params}`);
      if (res.ok) {
        setAgendamentos(await res.json());
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(id: string, novoStatus: string) {
    setAtualizando(id);
    try {
      const res = await fetch(`/api/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) {
        fetchAgendamentos();
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setAtualizando(null);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const tempoTotal = (servicos: Agendamento["servicos"]) =>
    servicos.reduce((acc, s) => acc + s.servico.tempoEstimado, 0);

  // Filtrar por busca
  const agendamentosFiltrados = agendamentos.filter(ag => 
    busca === "" || 
    ag.cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    ag.veiculo.placa.toLowerCase().includes(busca.toLowerCase()) ||
    ag.veiculo.modelo.toLowerCase().includes(busca.toLowerCase())
  );

  // Agrupar por data
  const agendamentosPorData = agendamentosFiltrados.reduce((acc, ag) => {
    const data = format(new Date(ag.dataHora), "yyyy-MM-dd");
    if (!acc[data]) acc[data] = [];
    acc[data].push(ag);
    return acc;
  }, {} as Record<string, Agendamento[]>);

  const datasOrdenadas = Object.keys(agendamentosPorData).sort();

  // Stats
  const pendentes = agendamentos.filter(a => a.status === "PENDENTE").length;
  const confirmados = agendamentos.filter(a => a.status === "CONFIRMADO").length;
  const hoje = agendamentos.filter(a => isToday(new Date(a.dataHora))).length;
  const valorTotal = agendamentosFiltrados.reduce((acc, a) => acc + a.totalEstimado, 0);

  const getDataLabel = (dataStr: string) => {
    const data = new Date(dataStr);
    if (isToday(data)) return "Hoje";
    if (isTomorrow(data)) return "Amanhã";
    return format(data, "EEEE", { locale: ptBR });
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Agendamentos</h1>
              <p className="text-sm text-slate-500">Gerencie seus horários</p>
            </div>
            <button
              onClick={() => fetchAgendamentos()}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
            >
              <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabs Mobile */}
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-cyan-500 text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista Mobile */}
        <div className="p-4 space-y-4 pb-24">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
          ) : agendamentos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-700">Nenhum agendamento</h3>
              <p className="text-slate-500 text-sm mt-1">
                {activeTab === "PENDENTE"
                  ? "Não há agendamentos pendentes"
                  : "Não há agendamentos para exibir"}
              </p>
            </div>
          ) : (
            datasOrdenadas.map((data) => (
              <div key={data}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-slate-800 capitalize">
                    {getDataLabel(data)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {format(new Date(data), "d/MM", { locale: ptBR })}
                  </span>
                  <span className="ml-auto text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {agendamentosPorData[data].length}
                  </span>
                </div>

                <div className="space-y-3">
                  {agendamentosPorData[data].map((ag) => {
                    const status = statusConfig[ag.status] || statusConfig.PENDENTE;
                    const dataHora = new Date(ag.dataHora);

                    return (
                      <div
                        key={ag.id}
                        className="bg-white rounded-xl border border-slate-100 overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                {format(dataHora, "HH:mm")}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{ag.cliente.nome}</p>
                                <p className="text-sm text-slate-500">{ag.veiculo.modelo} • {ag.veiculo.placa}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {ag.servicos.map((s, i) => (
                              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                {s.servico.nome}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              ~{tempoTotal(ag.servicos)} min
                            </span>
                            <span className="font-bold text-cyan-600">{formatCurrency(ag.totalEstimado)}</span>
                          </div>
                        </div>

                        {ag.status === "PENDENTE" && (
                          <div className="flex border-t border-slate-100">
                            <button
                              onClick={() => atualizarStatus(ag.id, "CANCELADO")}
                              disabled={atualizando === ag.id}
                              className="flex-1 py-3 text-red-600 text-sm font-medium"
                            >
                              Recusar
                            </button>
                            <div className="w-px bg-slate-100" />
                            <button
                              onClick={() => atualizarStatus(ag.id, "CONFIRMADO")}
                              disabled={atualizando === ag.id}
                              className="flex-1 py-3 text-emerald-600 text-sm font-medium"
                            >
                              {atualizando === ag.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Confirmar"}
                            </button>
                          </div>
                        )}

                        {ag.status === "CONFIRMADO" && (
                          <div className="flex border-t border-slate-100">
                            <button
                              onClick={() => atualizarStatus(ag.id, "EM_ANDAMENTO")}
                              disabled={atualizando === ag.id}
                              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium"
                            >
                              {atualizando === ag.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Iniciar Lavagem"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-6 xl:p-8 min-h-screen bg-slate-50">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Agendamentos</h1>
              <p className="text-slate-500 text-sm mt-0.5">Gerencie os agendamentos dos clientes</p>
            </div>
            <button
              onClick={() => fetchAgendamentos()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm font-medium">Pendentes</span>
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-600">{pendentes}</p>
              <p className="text-xs text-slate-400 mt-1">aguardando confirmação</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm font-medium">Confirmados</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{confirmados}</p>
              <p className="text-xs text-slate-400 mt-1">prontos para atendimento</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm font-medium">Hoje</span>
                <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <CalendarClock className="w-4 h-4 text-cyan-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{hoje}</p>
              <p className="text-xs text-slate-400 mt-1">agendamentos hoje</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-sm font-medium">Valor Total</span>
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{formatCurrency(valorTotal)}</p>
              <p className="text-xs text-slate-400 mt-1">em agendamentos</p>
            </div>
          </div>

          {/* Tabs e Busca */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                      isActive
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === "PENDENTE" && pendentes > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-amber-100 text-amber-700'}`}>
                        {pendentes}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cliente, placa..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Lista */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            </div>
          ) : agendamentosFiltrados.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">Nenhum agendamento</h3>
              <p className="text-slate-500 mt-2">
                {busca ? "Nenhum resultado encontrado para sua busca" : activeTab === "PENDENTE"
                  ? "Não há agendamentos pendentes de confirmação"
                  : "Não há agendamentos para exibir"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {datasOrdenadas.map((data) => (
                <div key={data} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {/* Data Header */}
                  <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 capitalize">
                        {getDataLabel(data)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {format(new Date(data), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <span className="ml-auto text-sm bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium">
                      {agendamentosPorData[data].length} agendamento{agendamentosPorData[data].length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Table */}
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">Horário</th>
                        <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente</th>
                        <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">Veículo</th>
                        <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">Serviços</th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tempo</th>
                        <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor</th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {agendamentosPorData[data].map((ag) => {
                        const status = statusConfig[ag.status] || statusConfig.PENDENTE;
                        const dataHora = new Date(ag.dataHora);

                        return (
                          <tr key={ag.id} className="hover:bg-slate-50 transition-colors">
                            {/* Horário */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                  {format(dataHora, "HH:mm")}
                                </div>
                              </div>
                            </td>

                            {/* Cliente */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                  <span className="text-slate-700 font-semibold">{ag.cliente.nome.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">{ag.cliente.nome}</p>
                                  {ag.cliente.telefone && (
                                    <a
                                      href={`https://wa.me/55${ag.cliente.telefone.replace(/\D/g, "")}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      {ag.cliente.telefone}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Veículo */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <Car className="w-4 h-4 text-slate-400" />
                                <div>
                                  <p className="font-medium text-slate-800">{ag.veiculo.modelo}</p>
                                  <p className="text-xs text-slate-500 font-mono">{ag.veiculo.placa}</p>
                                </div>
                              </div>
                            </td>

                            {/* Serviços */}
                            <td className="py-4 px-6">
                              <div className="flex flex-wrap gap-1">
                                {ag.servicos.slice(0, 2).map((s, i) => (
                                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                    {s.servico.nome}
                                  </span>
                                ))}
                                {ag.servicos.length > 2 && (
                                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                    +{ag.servicos.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Tempo */}
                            <td className="py-4 px-6 text-center">
                              <span className="text-sm text-slate-600">~{tempoTotal(ag.servicos)} min</span>
                            </td>

                            {/* Valor */}
                            <td className="py-4 px-6 text-right">
                              <span className="font-semibold text-emerald-600">{formatCurrency(ag.totalEstimado)}</span>
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                {status.label}
                              </span>
                            </td>

                            {/* Ações */}
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                {ag.status === "PENDENTE" && (
                                  <>
                                    <button
                                      onClick={() => atualizarStatus(ag.id, "CANCELADO")}
                                      disabled={atualizando === ag.id}
                                      className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => atualizarStatus(ag.id, "CONFIRMADO")}
                                      disabled={atualizando === ag.id}
                                      className="px-4 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                                    >
                                      {atualizando === ag.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Check className="w-4 h-4" />
                                      )}
                                      Confirmar
                                    </button>
                                  </>
                                )}

                                {ag.status === "CONFIRMADO" && (
                                  <>
                                    <button
                                      onClick={() => atualizarStatus(ag.id, "NAO_COMPARECEU")}
                                      disabled={atualizando === ag.id}
                                      className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                      Faltou
                                    </button>
                                    <button
                                      onClick={() => atualizarStatus(ag.id, "EM_ANDAMENTO")}
                                      disabled={atualizando === ag.id}
                                      className="px-4 py-1.5 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-1"
                                    >
                                      {atualizando === ag.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Play className="w-4 h-4" />
                                      )}
                                      Iniciar
                                    </button>
                                  </>
                                )}

                                {ag.status === "EM_ANDAMENTO" && (
                                  <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    No Kanban
                                  </span>
                                )}

                                {(ag.status === "CONCLUIDO" || ag.status === "CANCELADO" || ag.status === "NAO_COMPARECEU") && (
                                  <span className="text-sm text-slate-400">—</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
