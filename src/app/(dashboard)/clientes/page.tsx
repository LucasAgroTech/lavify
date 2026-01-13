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
      <div className="hidden lg:block p-8 xl:p-10 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
              <p className="text-slate-500">
                {clientes.length} clientes cadastrados
              </p>
            </div>
          </div>
          <Button onClick={abrirModalCriar} icon={<Plus className="w-5 h-5" />} className="px-6 py-3 text-base">
            Novo Cliente
          </Button>
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{clientes.length}</p>
                <p className="text-sm text-slate-500">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{clientes.filter(c => c.planoMensal).length}</p>
                <p className="text-sm text-slate-500">Mensalistas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Car className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{clientes.reduce((acc, c) => acc + c.veiculos.length, 0)}</p>
                <p className="text-sm text-slate-500">Veículos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{clientes.reduce((acc, c) => acc + c.pontosFidelidade, 0)}</p>
                <p className="text-sm text-slate-500">Pontos Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou placa..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-base shadow-sm"
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
        </div>

        {/* Lista */}
        {clientesFiltrados.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-semibold text-lg">Nenhum cliente encontrado</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">
              {busca ? "Tente outro termo de busca" : "Cadastre seu primeiro cliente"}
            </p>
            {!busca && (
              <Button onClick={abrirModalCriar} icon={<Plus className="w-4 h-4" />}>
                Cadastrar Cliente
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {clientesFiltrados.map((cliente) => (
              <div 
                key={cliente.id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 group relative"
              >
                {/* Botões de ação */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button
                    onClick={() => handleWhatsApp(cliente.telefone, cliente.nome)}
                    className="p-2.5 bg-green-100 hover:bg-green-500 hover:text-white text-green-600 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => abrirModalEditar(cliente)}
                    className="p-2.5 bg-slate-100 hover:bg-slate-700 hover:text-white text-slate-600 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/25">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-slate-800 truncate">
                          {cliente.nome}
                        </h3>
                        {cliente.planoMensal && (
                          <Crown className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 mt-1">
                        <Phone className="w-4 h-4" />
                        <span>{cliente.telefone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-amber-600">
                        <Award className="w-5 h-5" />
                        <span className="font-bold text-lg">{cliente.pontosFidelidade}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Pontos</p>
                    </div>
                    <div className="text-center border-x border-slate-100">
                      <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                        <Car className="w-5 h-5" />
                        <span className="font-bold text-lg">{cliente.veiculos.length}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Veículos</p>
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-lg text-slate-700">
                        {cliente._count.ordens}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">Ordens</p>
                    </div>
                  </div>

                  {/* Veículos */}
                  {cliente.veiculos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cliente.veiculos.slice(0, 3).map((v) => (
                        <span
                          key={v.id}
                          className="text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-mono font-medium"
                        >
                          {v.placa}
                        </span>
                      ))}
                      {cliente.veiculos.length > 3 && (
                        <span className="text-sm text-slate-400 px-2 py-1.5">
                          +{cliente.veiculos.length - 3} mais
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
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
