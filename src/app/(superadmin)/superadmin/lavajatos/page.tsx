"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Building2,
  Users,
  Car,
  ClipboardList,
  Crown,
  Loader2,
  ChevronDown,
  Check,
  X,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LavaJato {
  id: string;
  nome: string;
  slug: string | null;
  cnpj: string | null;
  telefone: string | null;
  ativo: boolean;
  plano: string;
  stripeStatus: string | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  createdAt: string;
  _count: {
    usuarios: number;
    clientes: number;
    ordens: number;
    agendamentos: number;
  };
}

interface Stats {
  total: number;
  ativos: number;
  inativos: number;
  porPlano: Record<string, number>;
}

export default function SuperAdminLavaJatos() {
  const [lavajatos, setLavajatos] = useState<LavaJato[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroPlano, setFiltroPlano] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [selecionado, setSelecionado] = useState<LavaJato | null>(null);
  const [salvando, setSalvando] = useState(false);

  const fetchLavajatos = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filtroPlano) params.set("plano", filtroPlano);
      if (filtroStatus) params.set("status", filtroStatus);

      const res = await fetch(`/api/superadmin/lavajatos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLavajatos(data.lavajatos);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLavajatos();
  }, [search, filtroPlano, filtroStatus]);

  const handleUpdate = async (id: string, data: Partial<LavaJato>) => {
    setSalvando(true);
    try {
      const res = await fetch(`/api/superadmin/lavajatos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        fetchLavajatos();
        setSelecionado(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setSalvando(false);
    }
  };

  const planos = ["STARTER", "PRO", "PREMIUM"];

  const getPlanoColor = (plano: string) => {
    switch (plano) {
      case "PREMIUM":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "PRO":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "trialing":
        return "text-blue-400";
      case "past_due":
        return "text-amber-400";
      case "canceled":
        return "text-red-400";
      default:
        return "text-slate-500";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Lava-Jatos</h1>
          <p className="text-slate-400 text-sm">
            {stats?.total} cadastrados • {stats?.ativos} ativos
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, slug ou CNPJ..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Filtro Plano */}
        <div className="relative">
          <select
            value={filtroPlano}
            onChange={(e) => setFiltroPlano(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todos os Planos</option>
            {planos.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>

        {/* Filtro Status */}
        <div className="relative">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todos os Status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {lavajatos.map((lj) => (
          <div
            key={lj.id}
            className={`bg-slate-800/50 border rounded-2xl p-4 transition-all ${
              selecionado?.id === lj.id
                ? "border-red-500/50 ring-1 ring-red-500/20"
                : "border-slate-700 hover:border-slate-600"
            }`}
          >
            {/* Header do card */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    lj.ativo
                      ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                      : "bg-slate-700"
                  }`}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{lj.nome}</h3>
                    {!lj.ativo && (
                      <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                        INATIVO
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {lj.slug && (
                      <a
                        href={`/lavajato/${lj.slug}`}
                        target="_blank"
                        className="flex items-center gap-1 hover:text-cyan-400"
                      >
                        /{lj.slug}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {lj.cnpj && <span>• {lj.cnpj}</span>}
                  </div>
                </div>
              </div>

              {/* Plano Badge */}
              <div
                className={`px-3 py-1 text-xs font-medium rounded-lg border ${getPlanoColor(
                  lj.plano
                )}`}
              >
                {lj.plano}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                <Users className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <p className="text-white font-medium text-sm">{lj._count.usuarios}</p>
                <p className="text-slate-500 text-[10px]">Usuários</p>
              </div>
              <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                <Car className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <p className="text-white font-medium text-sm">{lj._count.clientes}</p>
                <p className="text-slate-500 text-[10px]">Clientes</p>
              </div>
              <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                <ClipboardList className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <p className="text-white font-medium text-sm">{lj._count.ordens}</p>
                <p className="text-slate-500 text-[10px]">OSs</p>
              </div>
              <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                <Calendar className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                <p className="text-white font-medium text-sm">{lj._count.agendamentos}</p>
                <p className="text-slate-500 text-[10px]">Agendamentos</p>
              </div>
            </div>

            {/* Status e Datas */}
            <div className="flex items-center justify-between text-xs mb-3">
              <div className="flex items-center gap-3">
                <span className={getStatusColor(lj.stripeStatus)}>
                  {lj.stripeStatus === "active"
                    ? "✓ Assinatura Ativa"
                    : lj.stripeStatus === "trialing"
                    ? "⏱ Em Trial"
                    : lj.stripeStatus === "past_due"
                    ? "⚠ Pagamento Pendente"
                    : lj.stripeStatus === "canceled"
                    ? "✕ Cancelado"
                    : "Sem assinatura"}
                </span>
                {lj.currentPeriodEnd && (
                  <span className="text-slate-500">
                    até {format(new Date(lj.currentPeriodEnd), "dd/MM/yyyy")}
                  </span>
                )}
              </div>
              <span className="text-slate-500">
                Criado em {format(new Date(lj.createdAt), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
              {/* Toggle Ativo */}
              <button
                onClick={() => handleUpdate(lj.id, { ativo: !lj.ativo })}
                disabled={salvando}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  lj.ativo
                    ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                }`}
              >
                {lj.ativo ? (
                  <>
                    <ToggleRight className="w-4 h-4" />
                    Ativo
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4" />
                    Inativo
                  </>
                )}
              </button>

              {/* Alterar Plano */}
              <div className="flex items-center gap-1 ml-auto">
                {planos.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleUpdate(lj.id, { plano: p })}
                    disabled={salvando || lj.plano === p}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      lj.plano === p
                        ? getPlanoColor(p)
                        : "bg-slate-700/50 text-slate-400 hover:bg-slate-600"
                    }`}
                  >
                    {lj.plano === p && <Check className="w-3 h-3 inline mr-1" />}
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {lavajatos.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum lava-jato encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

