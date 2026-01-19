"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Users,
  Crown,
  Loader2,
  ChevronDown,
  Building2,
  Mail,
  Phone,
  UserCog,
  User,
  Wrench,
  ExternalLink,
  Trash2,
  AlertTriangle,
  X,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  role: string;
  ativo: boolean;
  createdAt: string;
  lavaJato: {
    id: string;
    nome: string;
    slug: string | null;
    plano: string;
    ativo: boolean;
  };
}

interface Stats {
  total: number;
  admins: number;
  gerentes: number;
  atendentes: number;
  lavadores: number;
  ativos: number;
}

interface UsuariosPorSemana {
  semana: string;
  quantidade: number;
}

interface StatsGerais {
  usuarios: {
    total: number;
    novosUltimaSemana: number;
    porSemana: UsuariosPorSemana[];
  };
}

export default function SuperAdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsGerais, setStatsGerais] = useState<StatsGerais | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroRole, setFiltroRole] = useState("");
  
  // Estado para modal de deletar
  const [modalDeletar, setModalDeletar] = useState<{
    aberto: boolean;
    usuario: Usuario | null;
    deletando: boolean;
  }>({ aberto: false, usuario: null, deletando: false });

  const fetchUsuarios = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filtroRole) params.set("role", filtroRole);

      const res = await fetch(`/api/superadmin/usuarios?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data.usuarios);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatsGerais = async () => {
    try {
      const res = await fetch("/api/superadmin/stats");
      if (res.ok) {
        const data = await res.json();
        setStatsGerais(data);
      }
    } catch (error) {
      console.error("Erro ao buscar stats:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchStatsGerais();
  }, [search, filtroRole]);

  const handleDeletar = async (deletarLavaJato: boolean) => {
    if (!modalDeletar.usuario) return;
    
    setModalDeletar((prev) => ({ ...prev, deletando: true }));
    
    try {
      const res = await fetch(
        `/api/superadmin/usuarios/${modalDeletar.usuario.id}?deletarLavaJato=${deletarLavaJato}`,
        { method: "DELETE" }
      );
      
      if (res.ok) {
        // Atualizar lista
        fetchUsuarios();
        fetchStatsGerais();
        setModalDeletar({ aberto: false, usuario: null, deletando: false });
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao deletar");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao deletar usuário");
    } finally {
      setModalDeletar((prev) => ({ ...prev, deletando: false }));
    }
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "ADMIN":
        return {
          label: "Dono/Admin",
          icon: Crown,
          color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          isDono: true,
        };
      case "GERENTE":
        return {
          label: "Gerente",
          icon: UserCog,
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          isDono: false,
        };
      case "ATENDENTE":
        return {
          label: "Atendente",
          icon: User,
          color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          isDono: false,
        };
      case "LAVADOR_SENIOR":
        return {
          label: "Lavador Sênior",
          icon: Wrench,
          color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
          isDono: false,
        };
      case "LAVADOR_JUNIOR":
        return {
          label: "Lavador Júnior",
          icon: Wrench,
          color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
          isDono: false,
        };
      default:
        return {
          label: role,
          icon: User,
          color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
          isDono: false,
        };
    }
  };

  const roles = [
    { value: "ADMIN", label: "Dono/Admin" },
    { value: "GERENTE", label: "Gerente" },
    { value: "ATENDENTE", label: "Atendente" },
    { value: "LAVADOR_SENIOR", label: "Lavador Sênior" },
    { value: "LAVADOR_JUNIOR", label: "Lavador Júnior" },
  ];

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Usuários</h1>
        <p className="text-slate-400 text-sm">
          {stats?.total} usuários no sistema • {stats?.admins} donos de lava-jato
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
          <Crown className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats?.admins || 0}</p>
          <p className="text-slate-500 text-xs">Donos/Admins</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
          <UserCog className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats?.gerentes || 0}</p>
          <p className="text-slate-500 text-xs">Gerentes</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
          <User className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats?.atendentes || 0}</p>
          <p className="text-slate-500 text-xs">Atendentes</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
          <Wrench className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats?.lavadores || 0}</p>
          <p className="text-slate-500 text-xs">Lavadores</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
          <Users className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{stats?.ativos || 0}</p>
          <p className="text-slate-500 text-xs">Ativos</p>
        </div>
      </div>

      {/* Gráfico de Usuários Novos por Semana */}
      {statsGerais?.usuarios?.porSemana && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white font-semibold">Usuários Novos por Semana</h2>
            </div>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">
              +{statsGerais.usuarios.novosUltimaSemana} esta semana
            </span>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsGerais.usuarios.porSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="semana"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={{ stroke: "#475569" }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#94a3b8" }}
                  formatter={(value: number) => [`${value} usuários`, "Novos"]}
                />
                <Bar
                  dataKey="quantidade"
                  fill="url(#gradientCyan)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradientCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, email ou telefone..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Filtro Role */}
        <div className="relative">
          <select
            value={filtroRole}
            onChange={(e) => setFiltroRole(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todos os Cargos</option>
            {roles.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {usuarios.map((usuario) => {
          const roleInfo = getRoleInfo(usuario.role);
          const RoleIcon = roleInfo.icon;

          return (
            <div
              key={usuario.id}
              className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      roleInfo.isDono
                        ? "bg-gradient-to-br from-amber-500 to-orange-600"
                        : usuario.ativo
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600"
                        : "bg-slate-700"
                    }`}
                  >
                    {roleInfo.isDono ? (
                      <Crown className="w-6 h-6 text-white" />
                    ) : (
                      <RoleIcon className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <div>
                    {/* Nome e Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold">{usuario.nome}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${roleInfo.color}`}
                      >
                        {roleInfo.label}
                      </span>
                      {!usuario.ativo && (
                        <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                          INATIVO
                        </span>
                      )}
                    </div>

                    {/* Email e Telefone */}
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                        {usuario.email}
                      </span>
                      {usuario.telefone && (
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5" />
                          {usuario.telefone}
                        </span>
                      )}
                    </div>

                    {/* Lava-Jato */}
                    <div className="flex items-center gap-2 mt-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-300 text-sm">
                        {usuario.lavaJato.nome}
                      </span>
                      {usuario.lavaJato.slug && (
                        <Link
                          href={`/lavajato/${usuario.lavaJato.slug}`}
                          target="_blank"
                          className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                        >
                          /{usuario.lavaJato.slug}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          usuario.lavaJato.plano === "PREMIUM"
                            ? "bg-amber-500/20 text-amber-400"
                            : usuario.lavaJato.plano === "PRO"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {usuario.lavaJato.plano}
                      </span>
                      {!usuario.lavaJato.ativo && (
                        <span className="text-[10px] text-red-400">(Inativo)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Data e Botão Deletar */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-slate-500 text-xs">
                      Criado em
                    </p>
                    <p className="text-slate-400 text-sm">
                      {format(new Date(usuario.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <button
                    onClick={() => setModalDeletar({ aberto: true, usuario, deletando: false })}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remover usuário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {usuarios.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {modalDeletar.aberto && modalDeletar.usuario && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-white font-semibold">Remover Usuário</h3>
              </div>
              <button
                onClick={() => setModalDeletar({ aberto: false, usuario: null, deletando: false })}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="mb-6">
              <p className="text-slate-300 mb-3">
                Você está prestes a remover <strong className="text-white">{modalDeletar.usuario.nome}</strong>
              </p>
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-sm">
                <p className="text-slate-400">
                  <span className="text-slate-500">Email:</span> {modalDeletar.usuario.email}
                </p>
                <p className="text-slate-400">
                  <span className="text-slate-500">Lava-Jato:</span> {modalDeletar.usuario.lavaJato.nome}
                </p>
                <p className="text-slate-400">
                  <span className="text-slate-500">Cargo:</span> {modalDeletar.usuario.role}
                </p>
              </div>
            </div>

            {/* Opções de Exclusão */}
            <div className="space-y-3">
              <button
                onClick={() => handleDeletar(false)}
                disabled={modalDeletar.deletando}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {modalDeletar.deletando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                Remover Apenas Usuário
              </button>
              
              <button
                onClick={() => handleDeletar(true)}
                disabled={modalDeletar.deletando}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {modalDeletar.deletando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Remover Lava-Jato Completo
              </button>

              <p className="text-xs text-center text-slate-500">
                ⚠️ Remover o lava-jato apaga todos os dados: ordens, clientes, financeiro, etc.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

