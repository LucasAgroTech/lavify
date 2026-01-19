"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Building2,
  ChevronDown,
  Plus,
  Send,
  X,
  Filter,
  Activity,
  Eye,
  ThermometerSun,
  Flame,
  Snowflake,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadInfo {
  status: string;
  temperatura: number;
  whatsappEnviado: boolean;
  whatsappRespondeu: boolean;
  emailEnviado: boolean;
  emailRespondeu: boolean;
  ligacaoFeita: boolean;
  ligacaoAtendeu: boolean;
  demonstracaoAgendada: boolean;
  demonstracaoRealizada: boolean;
  dataUltimoContato: string | null;
  dataProximoContato: string | null;
  notas: string | null;
  interacoes: Interacao[];
}

interface Interacao {
  id: string;
  tipo: string;
  descricao: string;
  resultado: string | null;
  createdAt: string;
}

interface Lead {
  id: string;
  nome: string;
  telefone: string | null;
  cnpj: string | null;
  endereco: string | null;
  plano: string;
  stripeStatus: string | null;
  ativo: boolean;
  createdAt: string;
  dono: {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
  } | null;
  stats: {
    ordens: number;
    clientes: number;
    usuarios: number;
  };
  ultimaAtividade: string | null;
  leadInfo: LeadInfo;
}

interface Stats {
  total: number;
  novos: number;
  emContato: number;
  convertidos: number;
  perdidos: number;
  inativos: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  NOVO: { label: "Novo", color: "text-blue-400", bg: "bg-blue-500/20" },
  CONTATO_INICIAL: { label: "Contato Inicial", color: "text-cyan-400", bg: "bg-cyan-500/20" },
  EM_NEGOCIACAO: { label: "Em Negociação", color: "text-amber-400", bg: "bg-amber-500/20" },
  DEMONSTRACAO: { label: "Demonstração", color: "text-purple-400", bg: "bg-purple-500/20" },
  CONVERTIDO: { label: "Convertido", color: "text-green-400", bg: "bg-green-500/20" },
  PERDIDO: { label: "Perdido", color: "text-red-400", bg: "bg-red-500/20" },
  INATIVO: { label: "Inativo", color: "text-slate-400", bg: "bg-slate-500/20" },
};

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [novaInteracao, setNovaInteracao] = useState({ tipo: "", descricao: "" });

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filtroStatus) params.set("status", filtroStatus);

      const res = await fetch(`/api/superadmin/leads?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [search, filtroStatus]);

  const atualizarLead = async (leadId: string, dados: Partial<LeadInfo>) => {
    setSalvando(true);
    try {
      const res = await fetch(`/api/superadmin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (res.ok) {
        fetchLeads();
        if (leadSelecionado?.id === leadId) {
          setLeadSelecionado((prev) =>
            prev ? { ...prev, leadInfo: { ...prev.leadInfo, ...dados } as LeadInfo } : null
          );
        }
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setSalvando(false);
    }
  };

  const adicionarInteracao = async () => {
    if (!leadSelecionado || !novaInteracao.tipo || !novaInteracao.descricao) return;

    setSalvando(true);
    try {
      const res = await fetch(`/api/superadmin/leads/${leadSelecionado.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaInteracao),
      });

      if (res.ok) {
        setNovaInteracao({ tipo: "", descricao: "" });
        fetchLeads();
        // Atualizar lead selecionado
        const leadRes = await fetch(`/api/superadmin/leads/${leadSelecionado.id}`);
        if (leadRes.ok) {
          const data = await leadRes.json();
          setLeadSelecionado({
            ...leadSelecionado,
            leadInfo: data.lead.leadInfo,
          });
        }
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setSalvando(false);
    }
  };

  const getTemperaturaIcon = (temp: number) => {
    if (temp >= 70) return <Flame className="w-4 h-4 text-red-400" />;
    if (temp >= 40) return <ThermometerSun className="w-4 h-4 text-amber-400" />;
    return <Snowflake className="w-4 h-4 text-blue-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">CRM - Gestão de Leads</h1>
        <p className="text-slate-400 text-sm">
          Gerencie contatos e acompanhe o funil de vendas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        <button
          onClick={() => setFiltroStatus("")}
          className={`p-3 rounded-xl text-center transition-all ${
            filtroStatus === "" ? "bg-cyan-500/20 border-cyan-500" : "bg-slate-800/50"
          } border border-slate-700 hover:border-cyan-500`}
        >
          <p className="text-xl font-bold text-white">{stats?.total || 0}</p>
          <p className="text-slate-400 text-xs">Total</p>
        </button>
        <button
          onClick={() => setFiltroStatus("NOVO")}
          className={`p-3 rounded-xl text-center transition-all ${
            filtroStatus === "NOVO" ? "bg-blue-500/20 border-blue-500" : "bg-slate-800/50"
          } border border-slate-700 hover:border-blue-500`}
        >
          <p className="text-xl font-bold text-blue-400">{stats?.novos || 0}</p>
          <p className="text-slate-400 text-xs">Novos</p>
        </button>
        <button
          onClick={() => setFiltroStatus("EM_NEGOCIACAO")}
          className={`p-3 rounded-xl text-center transition-all ${
            filtroStatus === "EM_NEGOCIACAO" ? "bg-amber-500/20 border-amber-500" : "bg-slate-800/50"
          } border border-slate-700 hover:border-amber-500`}
        >
          <p className="text-xl font-bold text-amber-400">{stats?.emContato || 0}</p>
          <p className="text-slate-400 text-xs">Em Contato</p>
        </button>
        <button
          onClick={() => setFiltroStatus("CONVERTIDO")}
          className={`p-3 rounded-xl text-center transition-all ${
            filtroStatus === "CONVERTIDO" ? "bg-green-500/20 border-green-500" : "bg-slate-800/50"
          } border border-slate-700 hover:border-green-500`}
        >
          <p className="text-xl font-bold text-green-400">{stats?.convertidos || 0}</p>
          <p className="text-slate-400 text-xs">Convertidos</p>
        </button>
        <button
          onClick={() => setFiltroStatus("PERDIDO")}
          className={`p-3 rounded-xl text-center transition-all ${
            filtroStatus === "PERDIDO" ? "bg-red-500/20 border-red-500" : "bg-slate-800/50"
          } border border-slate-700 hover:border-red-500`}
        >
          <p className="text-xl font-bold text-red-400">{stats?.perdidos || 0}</p>
          <p className="text-slate-400 text-xs">Perdidos</p>
        </button>
        <button
          onClick={() => setFiltroStatus("INATIVO")}
          className={`p-3 rounded-xl text-center transition-all ${
            filtroStatus === "INATIVO" ? "bg-slate-500/20 border-slate-500" : "bg-slate-800/50"
          } border border-slate-700 hover:border-slate-500`}
        >
          <p className="text-xl font-bold text-slate-400">{stats?.inativos || 0}</p>
          <p className="text-slate-400 text-xs">Inativos</p>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, telefone ou CNPJ..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Lista de Leads */}
      <div className="space-y-3">
        {leads.map((lead) => {
          const status = statusConfig[lead.leadInfo.status] || statusConfig.NOVO;

          return (
            <div
              key={lead.id}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 hover:border-slate-600 transition-colors cursor-pointer"
              onClick={() => setLeadSelecionado(lead)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="text-white font-semibold truncate">{lead.nome}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                      {status.label}
                    </span>
                    {lead.plano !== "STARTER" && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                        {lead.plano}
                      </span>
                    )}
                    {getTemperaturaIcon(lead.leadInfo.temperatura)}
                  </div>

                  {/* Info do Dono */}
                  {lead.dono && (
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {lead.dono.nome}
                      </span>
                      {lead.dono.telefone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {lead.dono.telefone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        {lead.dono.email}
                      </span>
                    </div>
                  )}

                  {/* Checklist resumido */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className={`flex items-center gap-1 ${lead.leadInfo.whatsappEnviado ? "text-green-400" : "text-slate-600"}`}>
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </span>
                    <span className={`flex items-center gap-1 ${lead.leadInfo.emailEnviado ? "text-green-400" : "text-slate-600"}`}>
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </span>
                    <span className={`flex items-center gap-1 ${lead.leadInfo.ligacaoFeita ? "text-green-400" : "text-slate-600"}`}>
                      <Phone className="w-3.5 h-3.5" />
                      Ligação
                    </span>
                    <span className={`flex items-center gap-1 ${lead.leadInfo.demonstracaoRealizada ? "text-green-400" : "text-slate-600"}`}>
                      <Eye className="w-3.5 h-3.5" />
                      Demo
                    </span>
                  </div>
                </div>

                {/* Stats e Atividade */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span>{lead.stats.ordens} OS</span>
                    <span>{lead.stats.clientes} clientes</span>
                  </div>
                  {lead.ultimaAtividade && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                      <Activity className="w-3 h-3" />
                      {formatDistanceToNow(new Date(lead.ultimaAtividade), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 mt-1">
                    Cadastro: {format(new Date(lead.createdAt), "dd/MM/yy")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {leads.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum lead encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes do Lead */}
      {leadSelecionado && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => setLeadSelecionado(null)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <div>
                <h2 className="text-white font-semibold text-lg">{leadSelecionado.nome}</h2>
                {leadSelecionado.dono && (
                  <p className="text-slate-400 text-sm">{leadSelecionado.dono.email}</p>
                )}
              </div>
              <button
                onClick={() => setLeadSelecionado(null)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Status e Temperatura */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Status</label>
                  <select
                    value={leadSelecionado.leadInfo.status}
                    onChange={(e) =>
                      atualizarLead(leadSelecionado.id, { status: e.target.value } as Partial<LeadInfo>)
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  >
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">
                    Temperatura: {leadSelecionado.leadInfo.temperatura}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={leadSelecionado.leadInfo.temperatura}
                    onChange={(e) =>
                      atualizarLead(leadSelecionado.id, { temperatura: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Checklist de Contato
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "whatsappEnviado", label: "WhatsApp Enviado", icon: MessageCircle },
                    { key: "whatsappRespondeu", label: "WhatsApp Respondeu", icon: MessageCircle },
                    { key: "emailEnviado", label: "Email Enviado", icon: Mail },
                    { key: "emailRespondeu", label: "Email Respondeu", icon: Mail },
                    { key: "ligacaoFeita", label: "Ligação Feita", icon: Phone },
                    { key: "ligacaoAtendeu", label: "Ligação Atendeu", icon: Phone },
                    { key: "demonstracaoAgendada", label: "Demo Agendada", icon: Calendar },
                    { key: "demonstracaoRealizada", label: "Demo Realizada", icon: Eye },
                  ].map(({ key, label, icon: Icon }) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 cursor-pointer hover:bg-slate-900"
                    >
                      <input
                        type="checkbox"
                        checked={leadSelecionado.leadInfo[key as keyof LeadInfo] as boolean}
                        onChange={(e) =>
                          atualizarLead(leadSelecionado.id, { [key]: e.target.checked })
                        }
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                      />
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Último Contato</label>
                  <input
                    type="date"
                    value={
                      leadSelecionado.leadInfo.dataUltimoContato
                        ? format(new Date(leadSelecionado.leadInfo.dataUltimoContato), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) =>
                      atualizarLead(leadSelecionado.id, { dataUltimoContato: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Próximo Contato</label>
                  <input
                    type="date"
                    value={
                      leadSelecionado.leadInfo.dataProximoContato
                        ? format(new Date(leadSelecionado.leadInfo.dataProximoContato), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={(e) =>
                      atualizarLead(leadSelecionado.id, { dataProximoContato: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="text-xs text-slate-500 block mb-1">Notas</label>
                <textarea
                  value={leadSelecionado.leadInfo.notas || ""}
                  onChange={(e) =>
                    atualizarLead(leadSelecionado.id, { notas: e.target.value })
                  }
                  placeholder="Anotações sobre o lead..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm resize-none"
                />
              </div>

              {/* Nova Interação */}
              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  Adicionar Interação
                </h3>
                <div className="flex gap-2">
                  <select
                    value={novaInteracao.tipo}
                    onChange={(e) => setNovaInteracao({ ...novaInteracao, tipo: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  >
                    <option value="">Tipo...</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                    <option value="LIGACAO">Ligação</option>
                    <option value="REUNIAO">Reunião</option>
                    <option value="NOTA">Nota</option>
                  </select>
                  <input
                    type="text"
                    value={novaInteracao.descricao}
                    onChange={(e) => setNovaInteracao({ ...novaInteracao, descricao: e.target.value })}
                    placeholder="Descreva a interação..."
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  />
                  <button
                    onClick={adicionarInteracao}
                    disabled={salvando || !novaInteracao.tipo || !novaInteracao.descricao}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg disabled:opacity-50"
                  >
                    {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Histórico de Interações */}
              {leadSelecionado.leadInfo.interacoes && leadSelecionado.leadInfo.interacoes.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    Histórico
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {leadSelecionado.leadInfo.interacoes.map((interacao) => (
                      <div
                        key={interacao.id}
                        className="flex items-start gap-3 p-2 rounded-lg bg-slate-900/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                          {interacao.tipo === "WHATSAPP" && <MessageCircle className="w-4 h-4 text-green-400" />}
                          {interacao.tipo === "EMAIL" && <Mail className="w-4 h-4 text-blue-400" />}
                          {interacao.tipo === "LIGACAO" && <Phone className="w-4 h-4 text-amber-400" />}
                          {interacao.tipo === "REUNIAO" && <Calendar className="w-4 h-4 text-purple-400" />}
                          {interacao.tipo === "NOTA" && <Activity className="w-4 h-4 text-slate-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{interacao.descricao}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {format(new Date(interacao.createdAt), "dd/MM/yy HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
