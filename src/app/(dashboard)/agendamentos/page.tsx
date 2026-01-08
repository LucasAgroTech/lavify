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
} from "lucide-react";
import { format } from "date-fns";
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

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDENTE: { label: "Pendente", color: "text-amber-700", bg: "bg-amber-100" },
  CONFIRMADO: { label: "Confirmado", color: "text-emerald-700", bg: "bg-emerald-100" },
  EM_ANDAMENTO: { label: "Em andamento", color: "text-blue-700", bg: "bg-blue-100" },
  CONCLUIDO: { label: "Concluído", color: "text-slate-700", bg: "bg-slate-200" },
  CANCELADO: { label: "Cancelado", color: "text-red-700", bg: "bg-red-100" },
  NAO_COMPARECEU: { label: "Não compareceu", color: "text-red-700", bg: "bg-red-100" },
};

const tabs = [
  { id: "PENDENTE", label: "Pendentes" },
  { id: "CONFIRMADO", label: "Confirmados" },
  { id: "EM_ANDAMENTO", label: "Em Andamento" },
  { id: "all", label: "Todos" },
];

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDENTE");
  const [atualizando, setAtualizando] = useState<string | null>(null);

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

  // Agrupar por data
  const agendamentosPorData = agendamentos.reduce((acc, ag) => {
    const data = format(new Date(ag.dataHora), "yyyy-MM-dd");
    if (!acc[data]) acc[data] = [];
    acc[data].push(ag);
    return acc;
  }, {} as Record<string, Agendamento[]>);

  const datasOrdenadas = Object.keys(agendamentosPorData).sort();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Agendamentos</h1>
          <p className="text-slate-500 mt-1">
            Gerencie os agendamentos dos clientes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeTab === tab.id
                ? "bg-cyan-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      ) : agendamentos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700">
            Nenhum agendamento
          </h3>
          <p className="text-slate-500 mt-2">
            {activeTab === "PENDENTE"
              ? "Não há agendamentos pendentes de confirmação"
              : "Não há agendamentos para exibir"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {datasOrdenadas.map((data) => (
            <div key={data}>
              {/* Data Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {format(new Date(data), "EEEE", { locale: ptBR })}
                  </p>
                  <p className="text-sm text-slate-500">
                    {format(new Date(data), "d 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <span className="ml-auto bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                  {agendamentosPorData[data].length} agendamento(s)
                </span>
              </div>

              {/* Cards */}
              <div className="grid gap-4 lg:grid-cols-2">
                {agendamentosPorData[data].map((ag) => {
                  const status = statusConfig[ag.status] || statusConfig.PENDENTE;
                  const dataHora = new Date(ag.dataHora);

                  return (
                    <div
                      key={ag.id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                            {format(dataHora, "HH:mm")}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">
                              {ag.cliente.nome}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Car className="w-3.5 h-3.5" />
                              {ag.veiculo.modelo} - {ag.veiculo.placa}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="p-4 space-y-3">
                        {/* Serviços */}
                        <div className="flex flex-wrap gap-1">
                          {ag.servicos.map((s, i) => (
                            <span
                              key={i}
                              className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                            >
                              {s.servico.nome}
                            </span>
                          ))}
                        </div>

                        {/* Info */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              ~{tempoTotal(ag.servicos)} min
                            </span>
                          </div>
                          <span className="font-bold text-cyan-600">
                            {formatCurrency(ag.totalEstimado)}
                          </span>
                        </div>

                        {/* Contato */}
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                          {ag.cliente.telefone && (
                            <a
                              href={`tel:${ag.cliente.telefone}`}
                              className="flex items-center gap-1 text-sm text-slate-600 hover:text-cyan-600"
                            >
                              <Phone className="w-4 h-4" />
                              {ag.cliente.telefone}
                            </a>
                          )}
                          {ag.cliente.telefone && (
                            <a
                              href={`https://wa.me/55${ag.cliente.telefone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                            >
                              <MessageCircle className="w-4 h-4" />
                              WhatsApp
                            </a>
                          )}
                        </div>

                        {/* Observações */}
                        {ag.observacoes && (
                          <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg text-sm text-amber-700">
                            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <p>{ag.observacoes}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {ag.status === "PENDENTE" && (
                        <div className="flex border-t border-slate-100">
                          <button
                            onClick={() => atualizarStatus(ag.id, "CANCELADO")}
                            disabled={atualizando === ag.id}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Recusar
                          </button>
                          <div className="w-px bg-slate-100" />
                          <button
                            onClick={() => atualizarStatus(ag.id, "CONFIRMADO")}
                            disabled={atualizando === ag.id}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                          >
                            {atualizando === ag.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Confirmar
                          </button>
                        </div>
                      )}

                      {ag.status === "CONFIRMADO" && (
                        <div className="flex border-t border-slate-100">
                          <button
                            onClick={() => atualizarStatus(ag.id, "NAO_COMPARECEU")}
                            disabled={atualizando === ag.id}
                            className="flex-1 flex items-center justify-center gap-2 py-3 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                          >
                            Não compareceu
                          </button>
                          <div className="w-px bg-slate-100" />
                          <button
                            onClick={() => atualizarStatus(ag.id, "EM_ANDAMENTO")}
                            disabled={atualizando === ag.id}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50"
                          >
                            {atualizando === ag.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                            Iniciar Lavagem
                          </button>
                        </div>
                      )}

                      {ag.status === "EM_ANDAMENTO" && (
                        <div className="flex border-t border-slate-100">
                          <div className="flex-1 flex items-center justify-center gap-2 py-3 text-blue-600 bg-blue-50">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="font-medium">Em andamento no Kanban</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

