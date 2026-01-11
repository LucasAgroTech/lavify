"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  Search,
  Crown,
  UserCog,
  Headphones,
  Wrench,
  HardHat,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Filter,
  UserPlus,
} from "lucide-react";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  role: string;
  ativo: boolean;
  createdAt: string;
}

type RoleKey = "ADMIN" | "GERENTE" | "ATENDENTE" | "LAVADOR_SENIOR" | "LAVADOR_JUNIOR";

const ROLES_CONFIG: Record<RoleKey, { label: string; descricao: string; cor: string; bgCor: string; icon: React.ElementType }> = {
  ADMIN: {
    label: "Administrador",
    descricao: "Acesso total ao sistema",
    cor: "text-amber-700",
    bgCor: "bg-amber-50",
    icon: Crown,
  },
  GERENTE: {
    label: "Gerente",
    descricao: "OSs, clientes, estoque, agendamentos",
    cor: "text-blue-700",
    bgCor: "bg-blue-50",
    icon: UserCog,
  },
  ATENDENTE: {
    label: "Atendente",
    descricao: "Criar OS, clientes, veículos",
    cor: "text-purple-700",
    bgCor: "bg-purple-50",
    icon: Headphones,
  },
  LAVADOR_SENIOR: {
    label: "Lavador Sênior",
    descricao: "Kanban + Agendamentos + Novos carros",
    cor: "text-emerald-700",
    bgCor: "bg-emerald-50",
    icon: Wrench,
  },
  LAVADOR_JUNIOR: {
    label: "Lavador Júnior",
    descricao: "Apenas move carros no Kanban",
    cor: "text-slate-700",
    bgCor: "bg-slate-100",
    icon: HardHat,
  },
};

const ROLES_DISPONIVEIS: RoleKey[] = ["GERENTE", "ATENDENTE", "LAVADOR_SENIOR", "LAVADOR_JUNIOR"];

export default function EquipePage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroRole, setFiltroRole] = useState<string>("todos");
  
  // Modal states
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"criar" | "editar">("criar");
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [menuAberto, setMenuAberto] = useState<string | null>(null);
  
  // Form states
  const [formNome, setFormNome] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formSenha, setFormSenha] = useState("");
  const [formRole, setFormRole] = useState<RoleKey>("LAVADOR_JUNIOR");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Confirm delete
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletando, setDeletando] = useState(false);
  
  // Mobile states
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchEquipe = useCallback(async () => {
    try {
      const res = await fetch("/api/equipe");
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipe();
  }, [fetchEquipe]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside() {
      setMenuAberto(null);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  function abrirModalCriar() {
    setModalTipo("criar");
    setUsuarioEditando(null);
    setFormNome("");
    setFormEmail("");
    setFormTelefone("");
    setFormSenha("");
    setFormRole("LAVADOR_JUNIOR");
    setErro("");
    setModalAberto(true);
  }

  function abrirModalEditar(usuario: Usuario) {
    setModalTipo("editar");
    setUsuarioEditando(usuario);
    setFormNome(usuario.nome);
    setFormEmail(usuario.email);
    setFormTelefone(usuario.telefone || "");
    setFormSenha("");
    setFormRole(usuario.role as RoleKey);
    setErro("");
    setModalAberto(true);
    setMenuAberto(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const payload: Record<string, unknown> = {
        nome: formNome,
        email: formEmail,
        telefone: formTelefone || null,
        role: formRole,
      };

      if (modalTipo === "criar") {
        if (!formSenha) {
          setErro("Senha é obrigatória para novos usuários");
          setSalvando(false);
          return;
        }
        payload.senha = formSenha;
      } else if (formSenha) {
        payload.senha = formSenha;
      }

      const url = modalTipo === "criar" 
        ? "/api/equipe" 
        : `/api/equipe/${usuarioEditando?.id}`;
      
      const method = modalTipo === "criar" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao salvar");
        setSalvando(false);
        return;
      }

      await fetchEquipe();
      setModalAberto(false);
    } catch {
      setErro("Erro de conexão");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletando(true);
    try {
      const res = await fetch(`/api/equipe/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchEquipe();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao remover");
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setDeletando(false);
      setConfirmDelete(null);
    }
  }

  async function toggleAtivo(usuario: Usuario) {
    try {
      const res = await fetch(`/api/equipe/${usuario.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !usuario.ativo }),
      });
      if (res.ok) {
        await fetchEquipe();
      }
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
    setMenuAberto(null);
  }

  // Filtrar usuários
  const usuariosFiltrados = usuarios.filter((u) => {
    const matchBusca = 
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase());
    const matchRole = filtroRole === "todos" || u.role === filtroRole;
    return matchBusca && matchRole;
  });

  // Agrupar por role para exibição
  const usuariosPorRole = usuariosFiltrados.reduce((acc, u) => {
    const role = u.role as RoleKey;
    if (!acc[role]) acc[role] = [];
    acc[role].push(u);
    return acc;
  }, {} as Record<RoleKey, Usuario[]>);

  // Contagem por cargo
  const contagemPorRole = usuarios.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="lg:hidden min-h-screen bg-slate-50">
          {/* Header skeleton */}
          <div className="sticky top-14 z-20 bg-white border-b border-slate-100 p-4 space-y-4">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-6 w-24 bg-slate-200 rounded" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
                <div className="h-12 w-28 bg-slate-200 rounded-xl" />
              </div>
              <div className="h-12 bg-slate-200 rounded-xl" />
            </div>
          </div>
          {/* Cards skeleton */}
          <div className="p-4 space-y-3">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-24 bg-slate-200 rounded-full flex-shrink-0 animate-pulse" />
              ))}
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        {/* Desktop Loading */}
        <div className="hidden lg:flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <div className="pb-24 lg:pb-0">
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden min-h-screen bg-slate-50">
        {/* Header - Sticky abaixo do MobileHeader (top-14 = 56px) */}
        <div className="sticky top-14 z-20 bg-white border-b border-slate-100 shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Equipe</h1>
                <p className="text-sm text-slate-500">{usuarios.length} membros</p>
              </div>
              <button
                onClick={abrirModalCriar}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform"
              >
                <UserPlus className="w-5 h-5" />
                <span>Adicionar</span>
              </button>
            </div>

            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                inputMode="search"
                placeholder="Buscar por nome ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base"
              />
              {filtroRole !== "todos" && (
                <button
                  onClick={() => setFiltroRole("todos")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-cyan-500 text-white rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Filtros por cargo (horizontal scroll) */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
            <button
              onClick={() => setFiltroRole("todos")}
              className={`
                flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                ${filtroRole === "todos"
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600"
                }
              `}
            >
              Todos ({usuarios.length})
            </button>
            {Object.entries(ROLES_CONFIG).map(([key, config]) => {
              const count = contagemPorRole[key] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setFiltroRole(key)}
                  className={`
                    flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${filtroRole === key
                      ? `${config.bgCor} ${config.cor} ring-2 ring-offset-1 ring-current`
                      : "bg-slate-100 text-slate-600"
                    }
                  `}
                >
                  <span>{config.label.split(' ')[0]}</span>
                  <span className="bg-white/50 px-1.5 py-0.5 rounded-full text-xs">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de usuários */}
        <div className="p-4 space-y-3">
          {usuariosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-600 font-medium">Nenhum membro encontrado</p>
              <p className="text-sm text-slate-400 mt-1">
                {busca ? "Tente outra busca" : "Adicione membros à sua equipe"}
              </p>
              {!busca && (
                <button
                  onClick={abrirModalCriar}
                  className="mt-4 px-4 py-2 bg-cyan-500 text-white font-medium rounded-xl active:scale-95 transition-transform"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Adicionar Membro
                </button>
              )}
            </div>
          ) : (
            usuariosFiltrados.map((usuario) => {
              const roleConfig = ROLES_CONFIG[usuario.role as RoleKey] || ROLES_CONFIG.LAVADOR_JUNIOR;
              const isExpanded = expandedCard === usuario.id;
              const isAdmin = usuario.role === "ADMIN";

              return (
                <div
                  key={usuario.id}
                  className={`
                    bg-white rounded-2xl border-2 overflow-hidden transition-all
                    ${!usuario.ativo ? "opacity-60 border-slate-200" : "border-slate-100"}
                    ${isExpanded ? "shadow-lg border-cyan-200" : "shadow-sm"}
                  `}
                >
                  {/* Card Header - Clicável */}
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : usuario.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-xl ${roleConfig.bgCor} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-lg font-bold ${roleConfig.cor}`}>
                          {usuario.nome.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {usuario.nome}
                          </h3>
                          {!usuario.ativo && (
                            <span className="text-[10px] font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex-shrink-0">
                              Inativo
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${roleConfig.bgCor} ${roleConfig.cor}`}>
                            <roleConfig.icon className="w-3 h-3" />
                            {roleConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Chevron */}
                      <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-cyan-50' : 'bg-slate-50'}`}>
                        {isExpanded ? (
                          <ChevronUp className={`w-5 h-5 ${isExpanded ? 'text-cyan-500' : 'text-slate-400'}`} />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Card Expandido */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 animate-slide-in">
                      {/* Info */}
                      <div className="py-3 space-y-2">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{usuario.email}</span>
                        </div>
                        {usuario.telefone && (
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span>{usuario.telefone}</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-2">
                          {roleConfig.descricao}
                        </p>
                      </div>

                      {/* Ações (apenas para não-admins) */}
                      {!isAdmin && (
                        <div className="flex gap-2 pt-3 border-t border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModalEditar(usuario);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium active:scale-95 transition-transform"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAtivo(usuario);
                            }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium active:scale-95 transition-transform ${
                              usuario.ativo
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {usuario.ativo ? (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4" />
                                Ativar
                              </>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(usuario.id);
                            }}
                            className="w-12 flex items-center justify-center py-3 bg-red-50 text-red-600 rounded-xl active:scale-95 transition-transform"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-7 h-7 text-cyan-500" />
              Equipe
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gerencie os membros da sua equipe
            </p>
          </div>
          <button
            onClick={abrirModalCriar}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-[0.98] transition-all"
          >
            <Plus className="w-5 h-5" />
            Adicionar Membro
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>
          <select
            value={filtroRole}
            onChange={(e) => setFiltroRole(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
          >
            <option value="todos">Todos os cargos</option>
            {Object.entries(ROLES_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {/* Lista de usuários agrupados */}
        <div className="space-y-6">
          {Object.entries(ROLES_CONFIG).map(([roleKey, config]) => {
            const usuariosDoRole = usuariosPorRole[roleKey as RoleKey];
            if (!usuariosDoRole || usuariosDoRole.length === 0) return null;

            return (
              <div key={roleKey}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${config.bgCor} flex items-center justify-center`}>
                    <config.icon className={`w-4 h-4 ${config.cor}`} />
                  </div>
                  <h2 className="font-semibold text-slate-700">{config.label}</h2>
                  <span className="text-sm text-slate-400">({usuariosDoRole.length})</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {usuariosDoRole.map((usuario) => (
                    <div
                      key={usuario.id}
                      className={`relative bg-white rounded-xl border p-4 transition-all ${
                        usuario.ativo 
                          ? "border-slate-200 hover:shadow-md" 
                          : "border-slate-200 bg-slate-50 opacity-60"
                      }`}
                    >
                      {!usuario.ativo && (
                        <span className="absolute top-2 right-2 text-[10px] font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          Inativo
                        </span>
                      )}

                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full ${config.bgCor} flex items-center justify-center flex-shrink-0`}>
                          <span className={`font-semibold ${config.cor}`}>
                            {usuario.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {usuario.nome}
                          </h3>
                          <p className="text-sm text-slate-500 truncate">
                            {usuario.email}
                          </p>
                          {usuario.telefone && (
                            <p className="text-sm text-slate-400 truncate">
                              {usuario.telefone}
                            </p>
                          )}
                        </div>

                        {roleKey !== "ADMIN" && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuAberto(menuAberto === usuario.id ? null : usuario.id);
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <Filter className="w-4 h-4 text-slate-400" />
                            </button>

                            {menuAberto === usuario.id && (
                              <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10">
                                <button
                                  onClick={() => abrirModalEditar(usuario)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <Pencil className="w-4 h-4" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => toggleAtivo(usuario)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  {usuario.ativo ? (
                                    <>
                                      <EyeOff className="w-4 h-4" />
                                      Desativar
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4" />
                                      Ativar
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmDelete(usuario.id);
                                    setMenuAberto(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remover
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>Nenhum membro encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de criar/editar */}
      {modalAberto && (
        <>
          {/* Mobile Modal - Fullscreen - z-[100] para ficar acima de TUDO */}
          <div className="fixed inset-0 z-[100] lg:hidden bg-white flex flex-col">
            {/* Header - Fixo no topo */}
            <div className="flex-shrink-0 bg-white border-b border-slate-100 p-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg font-bold text-slate-800">
                {modalTipo === "criar" ? "Adicionar Membro" : "Editar Membro"}
              </h2>
            </div>

            {/* Form - Área scrollável */}
            <form id="mobile-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 pb-28 space-y-5">
              {erro && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {erro}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="João da Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  inputMode="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="joao@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Senha {modalTipo === "editar" && <span className="text-slate-400">(deixe em branco para manter)</span>}
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    value={formSenha}
                    onChange={(e) => setFormSenha(e.target.value)}
                    required={modalTipo === "criar"}
                    className="w-full px-4 py-3 pr-12 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder={modalTipo === "criar" ? "Senha de acesso" : "Nova senha (opcional)"}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400"
                  >
                    {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Cargo
                </label>
                <div className="space-y-3">
                  {ROLES_DISPONIVEIS.map((roleKey) => {
                    const config = ROLES_CONFIG[roleKey];
                    const isSelected = formRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => setFormRole(roleKey)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? "border-cyan-500 bg-cyan-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl ${config.bgCor} flex items-center justify-center flex-shrink-0`}>
                          <config.icon className={`w-5 h-5 ${config.cor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800">{config.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{config.descricao}</p>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Botões fixos */}
            <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="mobile-form"
                disabled={salvando}
                className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                {salvando ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    {modalTipo === "criar" ? "Adicionar" : "Salvar"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Modal */}
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">
                  {modalTipo === "criar" ? "Adicionar Membro" : "Editar Membro"}
                </h2>
                <button
                  onClick={() => setModalAberto(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                {erro && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {erro}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="João da Silva"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="joao@exemplo.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone (opcional)</label>
                  <input
                    type="tel"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Senha {modalTipo === "editar" && "(deixe em branco para manter)"}
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarSenha ? "text" : "password"}
                      value={formSenha}
                      onChange={(e) => setFormSenha(e.target.value)}
                      required={modalTipo === "criar"}
                      className="w-full px-4 py-2.5 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                      placeholder={modalTipo === "criar" ? "Senha de acesso" : "Nova senha (opcional)"}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cargo</label>
                  <div className="space-y-2">
                    {ROLES_DISPONIVEIS.map((roleKey) => {
                      const config = ROLES_CONFIG[roleKey];
                      return (
                        <label
                          key={roleKey}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            formRole === roleKey
                              ? "border-cyan-500 bg-cyan-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={roleKey}
                            checked={formRole === roleKey}
                            onChange={() => setFormRole(roleKey)}
                            className="sr-only"
                          />
                          <div className={`w-8 h-8 rounded-lg ${config.bgCor} flex items-center justify-center`}>
                            <config.icon className={`w-4 h-4 ${config.cor}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800 text-sm">{config.label}</p>
                            <p className="text-xs text-slate-500">{config.descricao}</p>
                          </div>
                          {formRole === roleKey && (
                            <Check className="w-5 h-5 text-cyan-500" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalAberto(false)}
                    className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {salvando ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {modalTipo === "criar" ? "Adicionar" : "Salvar"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Remover membro?
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              Esta ação não pode ser desfeita. O acesso do usuário será removido permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deletando}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletando}
                className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {deletando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

