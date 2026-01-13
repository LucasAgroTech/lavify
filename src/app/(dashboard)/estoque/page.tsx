"use client";

import { useState, useEffect } from "react";
import { Package, Plus, AlertTriangle, TrendingDown, DollarSign, Boxes } from "lucide-react";

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

  async function criarProduto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nome = form.get("nome") as string;
    const quantidade = parseFloat(form.get("quantidade") as string);
    const unidade = form.get("unidade") as string;
    const custoPorUnidade = parseFloat(form.get("custoPorUnidade") as string);
    const pontoReposicao = parseFloat(form.get("pontoReposicao") as string);

    const res = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        quantidade,
        unidade,
        custoPorUnidade,
        pontoReposicao,
      }),
    });

    if (res.ok) {
      await fetchProdutos();
      setShowModal(false);
    }
  }

  const produtosEstoqueBaixo = produtos.filter((p) => p.estoqueBaixo);
  const valorTotalEstoque = produtos.reduce((acc, p) => acc + (p.quantidade * p.custoPorUnidade), 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="p-6 xl:p-8 min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Estoque</h1>
            <p className="text-slate-500 text-sm mt-0.5">{produtos.length} produtos cadastrados</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
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
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full mx-auto" />
            </div>
          ) : produtos.length === 0 ? (
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
                      {/* Produto */}
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

                      {/* Quantidade */}
                      <td className="py-4 px-4 text-center">
                        <span className={`text-lg font-bold ${produto.estoqueBaixo ? 'text-red-600' : 'text-slate-800'}`}>
                          {produto.quantidade}
                        </span>
                        <span className="text-slate-500 text-sm ml-1">{produto.unidade}</span>
                      </td>

                      {/* Mínimo */}
                      <td className="py-4 px-4 text-center">
                        <span className="text-slate-600">{produto.pontoReposicao}</span>
                        <span className="text-slate-400 text-sm ml-1">{produto.unidade}</span>
                      </td>

                      {/* Nível (barra) */}
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

                      {/* Custo/Un */}
                      <td className="py-4 px-4 text-right">
                        <span className="text-slate-600">{formatCurrency(produto.custoPorUnidade)}</span>
                      </td>

                      {/* Valor Total */}
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

          {/* Footer */}
          {produtos.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
              <span>{produtos.length} produtos</span>
              <span>Valor total em estoque: <strong className="text-emerald-600">{formatCurrency(valorTotalEstoque)}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Novo Produto</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <TrendingDown className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={criarProduto} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome do produto *</label>
                <input
                  name="nome"
                  type="text"
                  required
                  placeholder="Ex: Shampoo Automotivo 5L"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantidade *</label>
                  <input
                    name="quantidade"
                    type="number"
                    step="0.01"
                    required
                    placeholder="5000"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Unidade *</label>
                  <input
                    name="unidade"
                    type="text"
                    required
                    placeholder="ml, un, g"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Custo/Un (R$) *</label>
                  <input
                    name="custoPorUnidade"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.05"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Ponto Reposição *</label>
                  <input
                    name="pontoReposicao"
                    type="number"
                    step="0.01"
                    required
                    placeholder="1000"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">O sistema alertará quando a quantidade for menor que o ponto de reposição.</p>
            </form>

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
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

