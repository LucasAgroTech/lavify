"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Plus,
  Loader2,
  Eye,
  EyeOff,
  X,
  Check,
  Trash2,
  Edit2,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SuperAdmin {
  id: string;
  email: string;
  nome: string;
  ativo: boolean;
  createdAt: string;
}

export default function SuperAdminAdmins() {
  const [admins, setAdmins] = useState<SuperAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<SuperAdmin | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Form
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/superadmin/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const resetForm = () => {
    setNome("");
    setEmail("");
    setSenha("");
    setErro("");
    setEditando(null);
    setMostrarSenha(false);
  };

  const abrirModal = (admin?: SuperAdmin) => {
    if (admin) {
      setEditando(admin);
      setNome(admin.nome);
      setEmail(admin.email);
      setSenha("");
    } else {
      resetForm();
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const url = editando
        ? `/api/superadmin/admins/${editando.id}`
        : "/api/superadmin/admins";

      const body: Record<string, string> = { nome, email };
      if (senha) body.senha = senha;

      const res = await fetch(url, {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao salvar");
        return;
      }

      fetchAdmins();
      fecharModal();
    } catch {
      setErro("Erro de conexão");
    } finally {
      setSalvando(false);
    }
  };

  const handleToggleAtivo = async (admin: SuperAdmin) => {
    try {
      const res = await fetch(`/api/superadmin/admins/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !admin.ativo }),
      });

      if (res.ok) {
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao atualizar");
      }
    } catch {
      alert("Erro de conexão");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/superadmin/admins/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAdmins();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao excluir");
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setConfirmDelete(null);
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
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Super Admins</h1>
          <p className="text-slate-400 text-sm">
            Gerencie os administradores do sistema
          </p>
        </div>

        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 text-white font-medium text-sm rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Admin
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    admin.ativo
                      ? "bg-gradient-to-br from-red-500 to-orange-600"
                      : "bg-slate-700"
                  }`}
                >
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{admin.nome}</h3>
                    {!admin.ativo && (
                      <span className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                        INATIVO
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Toggle Ativo */}
                <button
                  onClick={() => handleToggleAtivo(admin)}
                  className={`p-2 rounded-lg transition-colors ${
                    admin.ativo
                      ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                  }`}
                  title={admin.ativo ? "Desativar" : "Ativar"}
                >
                  {admin.ativo ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>

                {/* Editar */}
                <button
                  onClick={() => abrirModal(admin)}
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Excluir */}
                <button
                  onClick={() => setConfirmDelete(admin.id)}
                  className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-slate-500 text-xs mt-3">
              Criado em {format(new Date(admin.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        ))}

        {admins.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum Super Admin encontrado</p>
          </div>
        )}
      </div>

      {/* Modal Criar/Editar */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editando ? "Editar Super Admin" : "Novo Super Admin"}
              </h2>
              <button
                onClick={fecharModal}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nome do admin"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {editando ? "Nova Senha (deixe vazio para manter)" : "Senha"}
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="••••••••"
                    minLength={editando ? 0 : 8}
                    required={!editando}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {erro}
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 py-3 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {salvando ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      {editando ? "Salvar" : "Criar"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Excluir Super Admin?
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 bg-slate-700 text-slate-300 font-medium rounded-xl hover:bg-slate-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

