"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  DollarSign, 
  Boxes,
  X,
  Check,
  Loader2,
  ArrowLeft,
  ChevronRight,
  Search,
  Pencil,
} from "lucide-react";

interface Produto {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
  custoPorUnidade: number;
  pontoReposicao: number;
  estoqueBaixo: boolean;
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "baixo" | "ok">("todos");
  const [produtoExpandido, setProdutoExpandido] = useState<string | null>(null);

  // Form states
  const [formNome, setFormNome] = useState("");
  const [formQuantidade, setFormQuantidade] = useState("");
  const [formUnidade, setFormUnidade] = useState("");
  const [formCusto, setFormCusto] = useState("");
  const [formMinimo, setFormMinimo] = useState("");

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    setLoading(true);
    try {
      const res = await fetch("/api/produtos");
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  function abrirModal() {
    setFormNome("");
    setFormQuantidade("");
    setFormUnidade("");
    setFormCusto("");
    setFormMinimo("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);

    try {
    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          nome: formNome,
          quantidade: parseFloat(formQuantidade),
          unidade: formUnidade,
          custoPorUnidade: parseFloat(formCusto),
          pontoReposicao: parseFloat(formMinimo),
      }),
    });

    if (res.ok) {
      await fetchProdutos();
      setShowModal(false);
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setSalvando(false);
    }
  }

  const produtosEstoqueBaixo = produtos.filter((p) => p.estoqueBaixo);
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + (p.quantidade * p.custoPorUnidade), 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  // Filtrar produtos
  const produtosFiltrados = produtos.filter((p) => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = 
      filtro === "todos" || 
      (filtro === "baixo" && p.estoqueBaixo) ||
      (filtro === "ok" && !p.estoqueBaixo);
    return matchBusca && matchFiltro;
  });

  // Loading
  if (loading) {
    return (
      <>
        <div className="lg:hidden min-h-screen bg-slate-50">
          <div className="sticky top-14 z-20 bg-white border-b border-slate-100 p-4">
            <div className="animate-pulse">
              <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-48 bg-slate-200 rounded mb-4" />
              <div className="h-10 bg-slate-200 rounded-xl" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white border border-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center min-h-[400px] p-8">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
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
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Estoque</h1>
                <p className="text-sm text-slate-500">{produtos.length} produtos</p>
              </div>
              <button
                onClick={abrirModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white font-medium active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Novo</span>
              </button>
            </div>

            {/* Stats Mobile - Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
              <div className="flex-shrink-0 bg-slate-50 rounded-xl p-3 min-w-[100px]">
                <p className="text-lg font-bold text-slate-800">{produtos.length}</p>
                <p className="text-[10px] text-slate-500">Produtos</p>
              </div>
              <div className="flex-shrink-0 bg-emerald-50 rounded-xl p-3 min-w-[120px]">
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(valorTotalEstoque).replace('R$', 'R$ ')}</p>
                <p className="text-[10px] text-emerald-700">Valor Total</p>
              </div>
              <div className={`flex-shrink-0 rounded-xl p-3 min-w-[100px] ${produtosEstoqueBaixo.length > 0 ? 'bg-red-50' : 'bg-slate-50'}`}>
                <p className={`text-lg font-bold ${produtosEstoqueBaixo.length > 0 ? 'text-red-600' : 'text-slate-800'}`}>
                  {produtosEstoqueBaixo.length}
                </p>
                <p className={`text-[10px] ${produtosEstoqueBaixo.length > 0 ? 'text-red-600' : 'text-slate-500'}`}>
                  Baixo
                </p>
              </div>
            </div>

            {/* Busca */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                inputMode="search"
                placeholder="Buscar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              {busca && (
                <button onClick={() => setBusca("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-300 rounded-full">
                  <X className="w-3 h-3 text-slate-600" />
                </button>
              )}
            </div>

            {/* Filtros */}
            <div className="flex gap-2">
              {[
                { key: "todos", label: "Todos" },
                { key: "baixo", label: "Baixo" },
                { key: "ok", label: "OK" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFiltro(f.key as typeof filtro)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filtro === f.key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alerta de estoque baixo */}
        {produtosEstoqueBaixo.length > 0 && filtro !== "ok" && (
          <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-800">
                {produtosEstoqueBaixo.length} produto{produtosEstoqueBaixo.length > 1 ? 's' : ''} baixo
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {produtosEstoqueBaixo.slice(0, 3).map((p) => (
                <span key={p.id} className="text-[10px] bg-white text-red-700 px-2 py-0.5 rounded border border-red-200">
                  {p.nome}
                </span>
              ))}
              {produtosEstoqueBaixo.length > 3 && (
                <span className="text-[10px] text-red-600">+{produtosEstoqueBaixo.length - 3}</span>
              )}
            </div>
          </div>
        )}

        {/* Lista de produtos */}
        <div className="p-4 space-y-2">
          {produtosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-semibold">
                {busca ? "Nenhum produto encontrado" : "Nenhum produto"}
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-4">
                {busca ? "Tente outro termo" : "Cadastre seu primeiro produto"}
              </p>
              {!busca && (
                <button onClick={abrirModal} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-medium rounded-xl text-sm">
                  <Plus className="w-4 h-4" /> Cadastrar
                </button>
              )}
            </div>
          ) : (
            produtosFiltrados.map((produto) => {
              const isExpanded = produtoExpandido === produto.id;
              const percentual = Math.min((produto.quantidade / (produto.pontoReposicao * 2)) * 100, 100);
              
              return (
                <div key={produto.id} className={`bg-white rounded-xl border overflow-hidden ${produto.estoqueBaixo ? 'border-red-200' : 'border-slate-200'}`}>
                  {/* Card Header */}
                  <button onClick={() => setProdutoExpandido(isExpanded ? null : produto.id)} className="w-full p-3 text-left">
                    <div className="flex items-center gap-3">
                      {/* Ícone */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${produto.estoqueBaixo ? 'bg-red-100' : 'bg-emerald-100'}`}>
                        <Package className={`w-5 h-5 ${produto.estoqueBaixo ? 'text-red-600' : 'text-emerald-600'}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-slate-800 text-sm truncate">{produto.nome}</h3>
                          {produto.estoqueBaixo && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded uppercase">
                              Baixo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {produto.quantidade} {produto.unidade} • Mín: {produto.pontoReposicao}
                        </p>
                      </div>

                      {/* Barra de nível */}
                      <div className="flex-shrink-0 w-16">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${produto.estoqueBaixo ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${percentual}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-slate-400 text-center mt-0.5">{Math.round(percentual)}%</p>
                      </div>

                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Card Expandido */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-2 py-3">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-800">{produto.quantidade}</span>
                          <span className="text-slate-500 text-xs ml-1">{produto.unidade}</span>
                          <p className="text-[10px] text-slate-500">Quantidade</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-800">{produto.pontoReposicao}</span>
                          <span className="text-slate-500 text-xs ml-1">{produto.unidade}</span>
                          <p className="text-[10px] text-slate-500">Mínimo</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-800">{formatCurrency(produto.custoPorUnidade)}</span>
                          <p className="text-[10px] text-slate-500">Custo/Un</p>
                        </div>
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <span className="font-bold text-emerald-600">{formatCurrency(produto.quantidade * produto.custoPorUnidade)}</span>
                          <p className="text-[10px] text-emerald-700">Valor Total</p>
                        </div>
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
            <h1 className="text-2xl font-bold text-slate-800">Estoque</h1>
            <p className="text-slate-500 text-sm mt-0.5">{produtos.length} produtos cadastrados</p>
          </div>
          <button
              onClick={abrirModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{produtos.length}</p>
                <p className="text-sm text-slate-500">Produtos</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Boxes className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{formatCurrency(valorTotalEstoque)}</p>
                <p className="text-sm text-slate-500">Valor Total</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-800">{produtos.filter(p => !p.estoqueBaixo).length}</p>
                <p className="text-sm text-slate-500">Em Estoque</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-cyan-600" />
              </div>
            </div>
          </div>
          <div className={`rounded-xl border p-4 ${produtosEstoqueBaixo.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-2xl font-bold ${produtosEstoqueBaixo.length > 0 ? 'text-red-600' : 'text-slate-800'}`}>{produtosEstoqueBaixo.length}</p>
                <p className={`text-sm ${produtosEstoqueBaixo.length > 0 ? 'text-red-600' : 'text-slate-500'}`}>Estoque Baixo</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${produtosEstoqueBaixo.length > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                <AlertTriangle className={`w-5 h-5 ${produtosEstoqueBaixo.length > 0 ? 'text-red-600' : 'text-slate-400'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Alerta de estoque baixo */}
        {produtosEstoqueBaixo.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-red-800">
                {produtosEstoqueBaixo.length} produto{produtosEstoqueBaixo.length > 1 ? 's' : ''} abaixo do ponto de reposição
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {produtosEstoqueBaixo.map((produto) => (
                  <span key={produto.id} className="text-xs bg-white text-red-700 px-2 py-1 rounded border border-red-200 font-medium">
                    {produto.nome}: {produto.quantidade}{produto.unidade}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {produtos.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-700 font-medium">Nenhum produto cadastrado</h3>
              <p className="text-slate-500 text-sm mt-1">Cadastre os produtos do seu estoque</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Produto</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantidade</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Mínimo</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Nível</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Custo/Un</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produtos.map((produto) => {
                  const percentual = Math.min((produto.quantidade / (produto.pontoReposicao * 2)) * 100, 100);
                  return (
                    <tr key={produto.id} className={`hover:bg-slate-50 transition-colors ${produto.estoqueBaixo ? 'bg-red-50/50' : ''}`}>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${produto.estoqueBaixo ? 'bg-red-100' : 'bg-emerald-100'}`}>
                            <Package className={`w-5 h-5 ${produto.estoqueBaixo ? 'text-red-600' : 'text-emerald-600'}`} />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800">{produto.nome}</span>
                            {produto.estoqueBaixo && (
                              <span className="ml-2 text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase">
                                Baixo
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-lg font-bold ${produto.estoqueBaixo ? 'text-red-600' : 'text-slate-800'}`}>
                          {produto.quantidade}
                        </span>
                        <span className="text-slate-500 text-sm ml-1">{produto.unidade}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-slate-600">{produto.pontoReposicao}</span>
                        <span className="text-slate-400 text-sm ml-1">{produto.unidade}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="w-24 mx-auto">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${produto.estoqueBaixo ? 'bg-red-500' : 'bg-emerald-500'}`}
                              style={{ width: `${percentual}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 text-center mt-1">{Math.round(percentual)}%</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-slate-600">{formatCurrency(produto.custoPorUnidade)}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(produto.quantidade * produto.custoPorUnidade)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {produtos.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
              <span>{produtos.length} produtos</span>
              <span>Valor total em estoque: <strong className="text-emerald-600">{formatCurrency(valorTotalEstoque)}</strong></span>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* ==================== MODAL ==================== */}
      {showModal && (
        <>
          {/* Mobile Modal */}
          <div className="fixed inset-0 z-[100] lg:hidden bg-white flex flex-col">
            <div className="flex-shrink-0 bg-white border-b border-slate-100 p-4 flex items-center gap-4">
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg font-bold text-slate-800">Novo Produto</h2>
            </div>

            <form id="mobile-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do produto</label>
                <input
                  type="text"
                  value={formNome} 
                  onChange={(e) => setFormNome(e.target.value)} 
                  required
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400" 
                  placeholder="Ex: Shampoo Automotivo" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantidade</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formQuantidade} 
                    onChange={(e) => setFormQuantidade(e.target.value)} 
                    required
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800" 
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Unidade</label>
                  <input
                    type="text"
                    value={formUnidade} 
                    onChange={(e) => setFormUnidade(e.target.value)} 
                    required
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800" 
                    placeholder="ml" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Custo/Un (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formCusto} 
                    onChange={(e) => setFormCusto(e.target.value)} 
                    required
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800" 
                    placeholder="0.05"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mínimo</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formMinimo} 
                    onChange={(e) => setFormMinimo(e.target.value)} 
                    required
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800" 
                    placeholder="1000"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">Você será alertado quando a quantidade for menor que o mínimo.</p>
            </form>

            <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4 flex gap-3" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl">
                Cancelar
              </button>
              <button type="submit" form="mobile-form" disabled={salvando}
                className="flex-1 py-3 bg-slate-800 text-white font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Salvar
              </button>
            </div>
          </div>

          {/* Desktop Modal */}
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Novo Produto</h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do produto *</label>
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    required
                    placeholder="Ex: Shampoo Automotivo 5L"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantidade *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formQuantidade}
                      onChange={(e) => setFormQuantidade(e.target.value)}
                      required
                      placeholder="5000"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Unidade *</label>
                    <input
                      type="text"
                      value={formUnidade}
                      onChange={(e) => setFormUnidade(e.target.value)}
                      required
                      placeholder="ml, un, g"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Custo/Un (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formCusto}
                      onChange={(e) => setFormCusto(e.target.value)}
                      required
                      placeholder="0.05"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Ponto Reposição *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formMinimo}
                      onChange={(e) => setFormMinimo(e.target.value)}
                      required
                      placeholder="1000"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">O sistema alertará quando a quantidade for menor que o ponto de reposição.</p>
              </form>

              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-100">
                  Cancelar
                </button>
                <button
                  onClick={() => { const f = document.querySelector('form') as HTMLFormElement; f?.requestSubmit(); }}
                  disabled={salvando}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                Cadastrar
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
