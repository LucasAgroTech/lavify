"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Phone, 
  Award, 
  Search, 
  Car, 
  X,
  Check,
  Loader2,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Pencil,
  Trash2,
  Crown,
} from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  pontosFidelidade: number;
  saldoCashback: number;
  planoMensal: boolean;
  veiculos: { id: string; placa: string; modelo: string; cor?: string }[];
  _count: { ordens: number };
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [clienteExpandido, setClienteExpandido] = useState<string | null>(null);

  // Form states
  const [formNome, setFormNome] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formPlanoMensal, setFormPlanoMensal] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    setLoading(true);
    try {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  function abrirModalCriar() {
    setEditando(null);
    setFormNome("");
    setFormTelefone("");
    setFormPlanoMensal(false);
    setShowModal(true);
  }

  function abrirModalEditar(cliente: Cliente) {
    setEditando(cliente);
    setFormNome(cliente.nome);
    setFormTelefone(cliente.telefone);
    setFormPlanoMensal(cliente.planoMensal);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);

    try {
      const payload = {
        nome: formNome,
        telefone: formTelefone,
        planoMensal: formPlanoMensal,
      };

      const url = editando ? `/api/clientes/${editando.id}` : "/api/clientes";
      const method = editando ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchClientes();
        setShowModal(false);
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao salvar cliente");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar cliente");
    } finally {
      setSalvando(false);
    }
  }

  function handleWhatsApp(telefone: string, nome: string) {
    const phone = telefone.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá ${nome.split(" ")[0]}! 🚗`);
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  }

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.includes(busca) ||
      c.veiculos.some(v => v.placa.toLowerCase().includes(busca.toLowerCase()))
  );

  // Loading
  if (loading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="lg:hidden min-h-screen bg-slate-50">
          <div className="sticky top-14 z-20 bg-white border-b border-slate-100 p-4">
            <div className="animate-pulse">
              <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-48 bg-slate-200 rounded mb-4" />
              <div className="h-12 bg-slate-200 rounded-xl" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white border border-slate-200 rounded-2xl animate-pulse" />
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Clientes</h1>
                <p className="text-sm text-slate-500">{clientes.length} cadastrados</p>
              </div>
              <button
                onClick={abrirModalCriar}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform"
              >
                <Plus className="w-5 h-5" />
                <span>Novo</span>
              </button>
            </div>

            {/* Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                inputMode="search"
                placeholder="Nome, telefone ou placa..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {busca && (
                <button
                  onClick={() => setBusca("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-300 rounded-full"
                >
                  <X className="w-3 h-3 text-slate-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="p-4 space-y-3">
          {clientesFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-semibold text-lg">
                {busca ? "Nenhum cliente encontrado" : "Nenhum cliente"}
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                {busca ? "Tente outro termo de busca" : "Cadastre seu primeiro cliente"}
              </p>
              {!busca && (
                <button
                  onClick={abrirModalCriar}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white font-medium rounded-xl active:scale-95 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Cadastrar Cliente
                </button>
              )}
            </div>
          ) : (
            clientesFiltrados.map((cliente) => {
              const isExpanded = clienteExpandido === cliente.id;
              
              return (
                <div
                  key={cliente.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  {/* Card Header - Clicável */}
                  <button
                    onClick={() => setClienteExpandido(isExpanded ? null : cliente.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {cliente.nome}
                          </h3>
                          {cliente.planoMensal && (
                            <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-sm text-slate-500">{cliente.telefone}</span>
                          {cliente.veiculos.length > 0 && (
                            <span className="text-xs text-slate-400">
                              • {cliente.veiculos.length} veículo{cliente.veiculos.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats resumido */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-800">{cliente._count.ordens}</p>
                          <p className="text-[10px] text-slate-400">OS</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Card Expandido */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 animate-slide-in">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 py-4">
                        <div className="text-center p-2 bg-amber-50 rounded-xl">
                          <div className="flex items-center justify-center gap-1 text-amber-600">
                            <Award className="w-4 h-4" />
                            <span className="font-bold">{cliente.pontosFidelidade}</span>
                          </div>
                          <p className="text-xs text-amber-700">Pontos</p>
                        </div>
                        <div className="text-center p-2 bg-emerald-50 rounded-xl">
                          <div className="flex items-center justify-center gap-1 text-emerald-600">
                            <Car className="w-4 h-4" />
                            <span className="font-bold">{cliente.veiculos.length}</span>
                          </div>
                          <p className="text-xs text-emerald-700">Veículos</p>
                        </div>
                        <div className="text-center p-2 bg-cyan-50 rounded-xl">
                          <span className="font-bold text-cyan-600">
                            {cliente._count.ordens}
                          </span>
                          <p className="text-xs text-cyan-700">Ordens</p>
                        </div>
                      </div>

                      {/* Veículos */}
                      {cliente.veiculos.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-2">Veículos:</p>
                          <div className="flex flex-wrap gap-2">
                            {cliente.veiculos.map((v) => (
                              <span
                                key={v.id}
                                className="inline-flex items-center gap-1.5 text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg"
                              >
                                <span className="font-mono font-bold">{v.placa}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">{v.modelo}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleWhatsApp(cliente.telefone, cliente.nome)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium active:scale-95 transition-transform"
                        >
                          <MessageCircle className="w-5 h-5" />
                          WhatsApp
                        </button>
                        <button
                          onClick={() => abrirModalEditar(cliente)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium active:scale-95 transition-transform"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
            <p className="text-slate-500 mt-1">
              Gerencie sua base de clientes
            </p>
          </div>
          <Button onClick={abrirModalCriar} icon={<Plus className="w-4 h-4" />}>
            Novo Cliente
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou placa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
          />
        </div>

        {/* Lista */}
        {clientesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-slate-600 font-medium">Nenhum cliente encontrado</h3>
            <p className="text-slate-400 text-sm mt-1">
              {busca ? "Tente outro termo de busca" : "Cadastre seu primeiro cliente"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientesFiltrados.map((cliente) => (
              <Card key={cliente.id} className="hover:shadow-md transition-shadow group relative">
                {/* Botões de ação */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleWhatsApp(cliente.telefone, cliente.nome)}
                    className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => abrirModalEditar(cliente)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {cliente.nome}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <Phone className="w-3.5 h-3.5" />
                          {cliente.telefone}
                        </div>
                      </div>
                    </div>
                    {cliente.planoMensal && (
                      <Badge variant="success" size="sm">
                        Mensal
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-amber-500">
                        <Award className="w-4 h-4" />
                        <span className="font-bold">{cliente.pontosFidelidade}</span>
                      </div>
                      <p className="text-xs text-slate-500">Pontos</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-emerald-500">
                        <Car className="w-4 h-4" />
                        <span className="font-bold">{cliente.veiculos.length}</span>
                      </div>
                      <p className="text-xs text-slate-500">Veículos</p>
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-slate-700">
                        {cliente._count.ordens}
                      </span>
                      <p className="text-xs text-slate-500">OS</p>
                    </div>
                  </div>

                  {/* Veículos */}
                  {cliente.veiculos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cliente.veiculos.slice(0, 3).map((v) => (
                        <span
                          key={v.id}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-mono"
                        >
                          {v.placa}
                        </span>
                      ))}
                      {cliente.veiculos.length > 3 && (
                        <span className="text-xs text-slate-400">
                          +{cliente.veiculos.length - 3}
                        </span>
                      )}
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
                {editando ? "Editar Cliente" : "Novo Cliente"}
              </h2>
            </div>

            {/* Form */}
            <form id="mobile-cliente-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
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
                  Telefone (WhatsApp)
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setFormPlanoMensal(!formPlanoMensal)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    formPlanoMensal
                      ? "border-amber-500 bg-amber-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    formPlanoMensal ? "bg-amber-500" : "bg-slate-100"
                  }`}>
                    <Crown className={`w-6 h-6 ${formPlanoMensal ? "text-white" : "text-slate-400"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-800">Plano Mensal</p>
                    <p className="text-sm text-slate-500">Cliente com assinatura mensal</p>
                  </div>
                  {formPlanoMensal && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
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
                form="mobile-cliente-form"
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
          <div className="hidden lg:block">
            <Modal
              isOpen={true}
              onClose={() => setShowModal(false)}
              title={editando ? "Editar Cliente" : "Novo Cliente"}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  label="Nome completo" 
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  required 
                />
                <Input
                  label="Telefone (WhatsApp)"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="planoMensal"
                    checked={formPlanoMensal}
                    onChange={(e) => setFormPlanoMensal(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="planoMensal" className="text-sm text-slate-700">
                    Cliente com plano mensal
                  </label>
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
          </div>
        </>
      )}
    </div>
  );
}
