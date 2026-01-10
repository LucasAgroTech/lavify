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
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Busca */}
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
        
        {/* Filtro por cargo */}
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
              {/* Header do grupo */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg ${config.bgCor} flex items-center justify-center`}>
                  <config.icon className={`w-4 h-4 ${config.cor}`} />
                </div>
                <h2 className="font-semibold text-slate-700">{config.label}</h2>
                <span className="text-sm text-slate-400">({usuariosDoRole.length})</span>
              </div>

              {/* Cards dos usuários */}
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
                    {/* Badge inativo */}
                    {!usuario.ativo && (
                      <span className="absolute top-2 right-2 text-[10px] font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Inativo
                      </span>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Avatar */}
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

                      {/* Menu de ações (apenas para não-admins) */}
                      {roleKey !== "ADMIN" && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuAberto(menuAberto === usuario.id ? null : usuario.id);
                            }}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-400" />
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

      {/* Modal de criar/editar */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            {/* Header */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {erro && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {erro}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome completo
                </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Telefone (opcional)
                </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cargo
                </label>
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

              {/* Botões */}
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

