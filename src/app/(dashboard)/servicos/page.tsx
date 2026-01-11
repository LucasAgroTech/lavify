"use client";

import { useState, useEffect } from "react";
import { 
  Droplets, 
  Plus, 
  Clock, 
  DollarSign, 
  Pencil, 
  Trash2, 
  X, 
  Check,
  Loader2,
  Package,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";

interface Servico {
  id: string;
  nome: string;
  preco: number;
  tempoEstimado: number;
  produtos: {
    id: string;
    quantidade: number;
    produto: {
      id: string;
      nome: string;
      unidade: string;
    };
  }[];
}

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Servico | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [deletando, setDeletando] = useState(false);

  // Form states
  const [formNome, setFormNome] = useState("");
  const [formPreco, setFormPreco] = useState("");
  const [formTempo, setFormTempo] = useState("");

  useEffect(() => {
    fetchServicos();
  }, []);

  async function fetchServicos() {
    setLoading(true);
    try {
      const res = await fetch("/api/servicos");
      const data = await res.json();
      setServicos(data);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  }

  function abrirModalCriar() {
    setEditando(null);
    setFormNome("");
    setFormPreco("");
    setFormTempo("");
    setShowModal(true);
  }

  function abrirModalEditar(servico: Servico) {
    setEditando(servico);
    setFormNome(servico.nome);
    setFormPreco(servico.preco.toString());
    setFormTempo(servico.tempoEstimado.toString());
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);

    try {
      const payload = {
        nome: formNome,
        preco: parseFloat(formPreco),
        tempoEstimado: parseInt(formTempo),
      };

      const url = editando ? `/api/servicos/${editando.id}` : "/api/servicos";
      const method = editando ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchServicos();
        setShowModal(false);
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao salvar serviço");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar serviço");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletando(true);
    try {
      const res = await fetch(`/api/servicos/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchServicos();
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao excluir serviço");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir serviço");
    } finally {
      setDeletando(false);
      setConfirmDelete(null);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // Loading
  if (loading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="lg:hidden min-h-screen bg-slate-50">
          <div className="sticky top-14 z-20 bg-white border-b border-slate-100 p-4">
            <div className="animate-pulse">
              <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-48 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        {/* Desktop Loading */}
        <div className="hidden lg:block p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="grid grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="pb-24 lg:pb-0">
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden min-h-screen bg-slate-50">
        {/* Header */}
        <div className="sticky top-14 z-20 bg-white border-b border-slate-100 shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Serviços</h1>
                <p className="text-sm text-slate-500">{servicos.length} cadastrados</p>
              </div>
              <button
                onClick={abrirModalCriar}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform"
              >
                <Plus className="w-5 h-5" />
                <span>Novo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista de serviços */}
        <div className="p-4 space-y-3">
          {servicos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Droplets className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-semibold text-lg">Nenhum serviço</h3>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                Cadastre os serviços oferecidos pelo seu lava-jato
              </p>
              <button
                onClick={abrirModalCriar}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white font-medium rounded-xl active:scale-95 transition-transform"
              >
                <Plus className="w-5 h-5" />
                Cadastrar Serviço
              </button>
            </div>
          ) : (
            servicos.map((servico) => (
              <div
                key={servico.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Ícone */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
                      <Droplets className="w-6 h-6" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-lg truncate">
                        {servico.nome}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>{servico.tempoEstimado} min</span>
                        </div>
                        {servico.produtos.length > 0 && (
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Package className="w-4 h-4" />
                            <span>{servico.produtos.length}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Preço */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(servico.preco)}
                      </p>
                    </div>
                  </div>

                  {/* Produtos (se houver) */}
                  {servico.produtos.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-2">Produtos utilizados:</p>
                      <div className="flex flex-wrap gap-2">
                        {servico.produtos.map((p) => (
                          <span
                            key={p.id}
                            className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg"
                          >
                            {p.produto.nome} ({p.quantidade}{p.produto.unidade})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => abrirModalEditar(servico)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium active:scale-95 transition-transform"
                    >
                      <Pencil className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(servico.id)}
                      className="w-12 flex items-center justify-center py-2.5 bg-red-50 text-red-600 rounded-xl active:scale-95 transition-transform"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Serviços</h1>
            <p className="text-slate-500 mt-1">
              Gerencie os serviços oferecidos
            </p>
          </div>
          <Button onClick={abrirModalCriar} icon={<Plus className="w-4 h-4" />}>
            Novo Serviço
          </Button>
        </div>

        {/* Lista */}
        {servicos.length === 0 ? (
          <div className="text-center py-12">
            <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-slate-600 font-medium">Nenhum serviço cadastrado</h3>
            <p className="text-slate-400 text-sm mt-1">
              Cadastre seu primeiro serviço
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicos.map((servico) => (
              <Card
                key={servico.id}
                className="hover:shadow-md transition-shadow group relative"
              >
                {/* Botões de ação */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => abrirModalEditar(servico)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(servico.id)}
                    className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                      <Droplets className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-lg">
                        {servico.nome}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        {servico.tempoEstimado} min
                      </div>
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Preço</span>
                    </div>
                    <span className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(servico.preco)}
                    </span>
                  </div>

                  {/* Produtos consumidos */}
                  {servico.produtos.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-2">
                        Produtos consumidos:
                      </p>
                      <div className="space-y-1">
                        {servico.produtos.map((p) => (
                          <div
                            key={p.id}
                            className="text-xs flex justify-between text-slate-600"
                          >
                            <span>{p.produto.nome}</span>
                            <span>
                              {p.quantidade}
                              {p.produto.unidade}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de criar/editar */}
      {showModal && (
        <>
          {/* Mobile Modal - Fullscreen */}
          <div className="fixed inset-0 z-[100] lg:hidden bg-white flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-slate-100 p-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg font-bold text-slate-800">
                {editando ? "Editar Serviço" : "Novo Serviço"}
              </h2>
            </div>

            {/* Form */}
            <form id="mobile-servico-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do serviço
                </label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Ex: Lavagem Completa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    value={formPreco}
                    onChange={(e) => setFormPreco(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="50.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tempo (min)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={formTempo}
                    onChange={(e) => setFormTempo(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="30"
                  />
                </div>
              </div>

              {/* Preview do serviço */}
              {formNome && (
                <div className="bg-slate-50 rounded-xl p-4 mt-4">
                  <p className="text-xs text-slate-500 mb-3">Prévia:</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{formNome}</p>
                      <p className="text-sm text-slate-500">
                        {formTempo ? `${formTempo} min` : "-- min"}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-emerald-600">
                      {formPreco ? formatCurrency(parseFloat(formPreco)) : "R$ --"}
                    </p>
                  </div>
                </div>
              )}
            </form>

            {/* Botões fixos */}
            <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="mobile-servico-form"
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
                    {editando ? "Salvar" : "Cadastrar"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Modal */}
          <Modal
            isOpen={true}
            onClose={() => setShowModal(false)}
            title={editando ? "Editar Serviço" : "Novo Serviço"}
            className="hidden lg:block"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome do serviço"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                placeholder="Ex: Lavagem Completa"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Preço (R$)"
                  type="number"
                  step="0.01"
                  value={formPreco}
                  onChange={(e) => setFormPreco(e.target.value)}
                  placeholder="50.00"
                  required
                />
                <Input
                  label="Tempo (minutos)"
                  type="number"
                  value={formTempo}
                  onChange={(e) => setFormTempo(e.target.value)}
                  placeholder="30"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={salvando}>
                  {salvando ? "Salvando..." : editando ? "Salvar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </Modal>
        </>
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Excluir serviço?
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              Esta ação não pode ser desfeita. O serviço será removido permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deletando}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletando}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {deletando ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Excluir
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
