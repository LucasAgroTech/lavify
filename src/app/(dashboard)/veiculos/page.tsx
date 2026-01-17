"use client";

import { useState, useEffect } from "react";
import { 
  Car, 
  Plus, 
  Search, 
  User, 
  X, 
  ArrowLeft, 
  Check, 
  Loader2,
  ChevronRight,
  Pencil,
  Trash2,
  Phone,
  Palette,
} from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input, Select } from "@/components/Input";
import { Modal } from "@/components/Modal";

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  cor: string | null;
  cliente: {
    id: string;
    nome: string;
    telefone: string;
  };
}

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
}

// Mapeamento de cores para classes CSS
const coresMap: Record<string, string> = {
  branco: "bg-white border border-slate-300",
  branca: "bg-white border border-slate-300",
  prata: "bg-gradient-to-br from-slate-200 to-slate-400",
  cinza: "bg-slate-400",
  preto: "bg-slate-900",
  preta: "bg-slate-900",
  azul: "bg-blue-500",
  vermelho: "bg-red-500",
  vermelha: "bg-red-500",
  verde: "bg-emerald-500",
  amarelo: "bg-yellow-400",
  amarela: "bg-yellow-400",
  laranja: "bg-orange-500",
  marrom: "bg-amber-800",
  bege: "bg-amber-100",
  rosa: "bg-pink-400",
  roxo: "bg-purple-500",
  roxa: "bg-purple-500",
  dourado: "bg-gradient-to-br from-yellow-400 to-amber-600",
  dourada: "bg-gradient-to-br from-yellow-400 to-amber-600",
  champagne: "bg-gradient-to-br from-amber-100 to-amber-300",
};

function getCorClass(cor: string | null): string {
  if (!cor) return "bg-slate-300";
  const corLower = cor.toLowerCase().trim();
  return coresMap[corLower] || "bg-slate-300";
}

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Veiculo | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [veiculoExpandido, setVeiculoExpandido] = useState<string | null>(null);

  // Form states
  const [formClienteId, setFormClienteId] = useState("");
  const [formPlaca, setFormPlaca] = useState("");
  const [formModelo, setFormModelo] = useState("");
  const [formCor, setFormCor] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");
  const [showClienteDropdown, setShowClienteDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [veiculosRes, clientesRes] = await Promise.all([
        fetch("/api/veiculos"),
        fetch("/api/clientes"),
      ]);
      setVeiculos(await veiculosRes.json());
      const clientesData = await clientesRes.json();
      setClientes(clientesData.clientes || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  function abrirModalCriar() {
    setEditando(null);
    setFormClienteId("");
    setFormPlaca("");
    setFormModelo("");
    setFormCor("");
    setBuscaCliente("");
    setShowModal(true);
  }

  function abrirModalEditar(veiculo: Veiculo) {
    setEditando(veiculo);
    setFormClienteId(veiculo.cliente.id);
    setFormPlaca(veiculo.placa);
    setFormModelo(veiculo.modelo);
    setFormCor(veiculo.cor || "");
    setBuscaCliente(veiculo.cliente.nome);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formClienteId) {
      alert("Selecione um cliente");
      return;
    }
    setSalvando(true);

    try {
      const payload = {
        clienteId: formClienteId,
        placa: formPlaca.toUpperCase(),
        modelo: formModelo,
        cor: formCor || null,
      };

      const url = editando ? `/api/veiculos/${editando.id}` : "/api/veiculos";
      const method = editando ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchData();
        setShowModal(false);
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao salvar veículo");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar veículo");
    } finally {
      setSalvando(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este veículo?")) return;

    try {
      const res = await fetch(`/api/veiculos/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchData();
        setVeiculoExpandido(null);
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao excluir veículo");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir veículo");
    }
  }

  const veiculosFiltrados = veiculos.filter(
    (v) =>
      v.placa.toLowerCase().includes(busca.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      v.cliente.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
      c.telefone.includes(buscaCliente)
  );

  const clienteSelecionado = clientes.find((c) => c.id === formClienteId);

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
              <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        {/* Desktop Loading */}
        <div className="hidden lg:block p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="grid grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-40 bg-slate-200 rounded-2xl" />
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
                <h1 className="text-xl font-bold text-slate-800">Veículos</h1>
                <p className="text-sm text-slate-500">{veiculos.length} cadastrados</p>
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
                placeholder="Placa, modelo ou cliente..."
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

        {/* Lista de veículos */}
        <div className="p-4 space-y-3">
          {veiculosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Car className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-semibold text-lg">
                {busca ? "Nenhum veículo encontrado" : "Nenhum veículo"}
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                {busca ? "Tente outro termo de busca" : "Cadastre seu primeiro veículo"}
              </p>
              {!busca && (
                <button
                  onClick={abrirModalCriar}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white font-medium rounded-xl active:scale-95 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Cadastrar Veículo
                </button>
              )}
            </div>
          ) : (
            veiculosFiltrados.map((veiculo) => {
              const isExpanded = veiculoExpandido === veiculo.id;

              return (
                <div
                  key={veiculo.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  {/* Card Header - Clicável */}
                  <button
                    onClick={() => setVeiculoExpandido(isExpanded ? null : veiculo.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      {/* Placa estilizada */}
                      <div className="flex-shrink-0 bg-slate-100 rounded-xl px-3 py-2 border-2 border-slate-200">
                        <span className="font-mono font-bold text-lg text-slate-800 tracking-wider">
                          {veiculo.placa}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {veiculo.modelo}
                          </h3>
                          {veiculo.cor && (
                            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${getCorClass(veiculo.cor)}`} />
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm text-slate-500 truncate">
                            {veiculo.cliente.nome}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {/* Card Expandido */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 animate-slide-in">
                      {/* Detalhes */}
                      <div className="py-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                            <Car className="w-5 h-5 text-cyan-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Modelo</p>
                            <p className="font-medium text-slate-800">{veiculo.modelo}</p>
                          </div>
                        </div>

                        {veiculo.cor && (
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Palette className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="text-xs text-slate-500">Cor</p>
                                <p className="font-medium text-slate-800">{veiculo.cor}</p>
                              </div>
                              <div className={`w-6 h-6 rounded-full ${getCorClass(veiculo.cor)}`} />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Proprietário</p>
                            <p className="font-medium text-slate-800">{veiculo.cliente.nome}</p>
                            <p className="text-sm text-slate-500">{veiculo.cliente.telefone}</p>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirModalEditar(veiculo)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium active:scale-95 transition-transform"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(veiculo.id)}
                          className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50 text-red-600 rounded-xl font-medium active:scale-95 transition-transform"
                        >
                          <Trash2 className="w-4 h-4" />
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
      <div className="hidden lg:block p-6 xl:p-8 min-h-screen bg-slate-50">
        <div className="max-w-[1400px] mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Veículos</h1>
              <p className="text-slate-500 text-sm mt-0.5">{veiculos.length} veículos cadastrados</p>
            </div>
            <button
              onClick={abrirModalCriar}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Veículo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{veiculos.length}</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{new Set(veiculos.map(v => v.cliente.id)).size}</p>
                  <p className="text-sm text-slate-500">Proprietários</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-cyan-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{new Set(veiculos.map(v => v.modelo.split(' ')[0])).size}</p>
                  <p className="text-sm text-slate-500">Marcas</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{new Set(veiculos.filter(v => v.cor).map(v => v.cor?.toLowerCase())).size}</p>
                  <p className="text-sm text-slate-500">Cores</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Busca e Tabela */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Barra de busca */}
            <div className="p-4 border-b border-slate-100">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por placa, modelo ou cliente..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
                {busca && (
                  <button
                    onClick={() => setBusca("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    <X className="w-3 h-3 text-slate-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Tabela */}
            {veiculosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-700 font-medium">Nenhum veículo encontrado</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {busca ? "Tente outro termo de busca" : "Cadastre seu primeiro veículo"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Placa</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Modelo</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cor</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Proprietário</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Telefone</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {veiculosFiltrados.map((veiculo) => (
                    <tr key={veiculo.id} className="hover:bg-slate-50 transition-colors">
                      {/* Placa */}
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded text-sm tracking-wider">
                          {veiculo.placa}
                        </span>
                      </td>

                      {/* Modelo */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{veiculo.modelo}</span>
                      </td>

                      {/* Cor */}
                      <td className="py-3 px-4">
                        {veiculo.cor ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex-shrink-0 ${getCorClass(veiculo.cor)}`} />
                            <span className="text-slate-600 text-sm">{veiculo.cor}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </td>

                      {/* Proprietário */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-white font-medium text-xs">
                            {veiculo.cliente.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-slate-700">{veiculo.cliente.nome}</span>
                        </div>
                      </td>

                      {/* Telefone */}
                      <td className="py-3 px-4">
                        <span className="text-slate-600 text-sm">{veiculo.cliente.telefone}</span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => abrirModalEditar(veiculo)}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(veiculo.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Footer com contagem */}
            {veiculosFiltrados.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-sm text-slate-500">
                Mostrando {veiculosFiltrados.length} de {veiculos.length} veículos
              </div>
            )}
          </div>
        </div>
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
                {editando ? "Editar Veículo" : "Novo Veículo"}
              </h2>
            </div>

            {/* Form */}
            <form id="mobile-veiculo-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
              {/* Seleção de Cliente */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cliente *
                </label>
                {clienteSelecionado ? (
                  <div className="flex items-center gap-3 p-3 bg-cyan-50 border-2 border-cyan-500 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center text-white font-bold">
                      {clienteSelecionado.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{clienteSelecionado.nome}</p>
                      <p className="text-sm text-slate-500">{clienteSelecionado.telefone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormClienteId("");
                        setBuscaCliente("");
                      }}
                      className="p-2 bg-slate-100 rounded-lg"
                    >
                      <X className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar cliente..."
                      value={buscaCliente}
                      onChange={(e) => {
                        setBuscaCliente(e.target.value);
                        setShowClienteDropdown(true);
                      }}
                      onFocus={() => setShowClienteDropdown(true)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    
                    {/* Dropdown de clientes */}
                    {showClienteDropdown && buscaCliente && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 max-h-60 overflow-y-auto z-10">
                        {clientesFiltrados.length === 0 ? (
                          <p className="p-4 text-sm text-slate-500 text-center">
                            Nenhum cliente encontrado
                          </p>
                        ) : (
                          clientesFiltrados.slice(0, 5).map((cliente) => (
                            <button
                              key={cliente.id}
                              type="button"
                              onClick={() => {
                                setFormClienteId(cliente.id);
                                setBuscaCliente(cliente.nome);
                                setShowClienteDropdown(false);
                              }}
                              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 active:bg-slate-100 text-left border-b border-slate-100 last:border-0"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                {cliente.nome.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{cliente.nome}</p>
                                <p className="text-sm text-slate-500">{cliente.telefone}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Placa */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Placa *
                </label>
                <input
                  type="text"
                  value={formPlaca}
                  onChange={(e) => setFormPlaca(e.target.value.toUpperCase())}
                  required
                  maxLength={8}
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono uppercase tracking-wider"
                  placeholder="ABC1D23"
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={formModelo}
                  onChange={(e) => setFormModelo(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Ex: Honda Civic"
                />
              </div>

              {/* Cor */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cor
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formCor}
                    onChange={(e) => setFormCor(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-12"
                    placeholder="Ex: Prata"
                  />
                  {formCor && (
                    <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${getCorClass(formCor)}`} />
                  )}
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {["Branco", "Prata", "Preto", "Azul", "Vermelho"].map((cor) => (
                    <button
                      key={cor}
                      type="button"
                      onClick={() => setFormCor(cor)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        formCor.toLowerCase() === cor.toLowerCase()
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {cor}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Botões fixos */}
            <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="mobile-veiculo-form"
                disabled={salvando || !formClienteId}
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
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                  {editando ? "Editar Veículo" : "Novo Veículo"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Cliente */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cliente *
                  </label>
                  <select
                    value={formClienteId}
                    onChange={(e) => setFormClienteId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 bg-white"
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome} - {c.telefone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Placa */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Placa *
                  </label>
                  <input
                    type="text"
                    value={formPlaca}
                    onChange={(e) => setFormPlaca(e.target.value.toUpperCase())}
                    required
                    maxLength={8}
                    placeholder="ABC1D23"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-mono uppercase tracking-wider"
                  />
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formModelo}
                    onChange={(e) => setFormModelo(e.target.value)}
                    required
                    placeholder="Ex: Honda Civic"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                {/* Cor */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Cor
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formCor}
                      onChange={(e) => setFormCor(e.target.value)}
                      placeholder="Ex: Prata"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 pr-12"
                    />
                    {formCor && (
                      <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full ${getCorClass(formCor)}`} />
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {["Branco", "Prata", "Preto", "Azul", "Vermelho"].map((cor) => (
                      <button
                        key={cor}
                        type="button"
                        onClick={() => setFormCor(cor)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                          formCor.toLowerCase() === cor.toLowerCase()
                            ? "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cor}
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = document.querySelector('form') as HTMLFormElement;
                    if (form) form.requestSubmit();
                  }}
                  disabled={salvando || !formClienteId}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {salvando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    editando ? "Salvar" : "Cadastrar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
