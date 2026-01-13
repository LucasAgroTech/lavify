"use client";

import { useState, useEffect } from "react";
import { Package, Plus, AlertTriangle, TrendingDown, DollarSign, Boxes } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";

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
    <div className="p-8 xl:p-10 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Estoque</h1>
            <p className="text-slate-500">
              Controle de produtos e insumos
            </p>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-5 h-5" />} className="px-6 py-3 text-base">
          Novo Produto
        </Button>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Boxes className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{produtos.length}</p>
              <p className="text-sm text-slate-500">Produtos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(valorTotalEstoque)}</p>
              <p className="text-sm text-slate-500">Valor em estoque</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{produtos.filter(p => !p.estoqueBaixo).length}</p>
              <p className="text-sm text-slate-500">Em estoque</p>
            </div>
          </div>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${produtosEstoqueBaixo.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${produtosEstoqueBaixo.length > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${produtosEstoqueBaixo.length > 0 ? 'text-red-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${produtosEstoqueBaixo.length > 0 ? 'text-red-600' : 'text-slate-800'}`}>{produtosEstoqueBaixo.length}</p>
              <p className={`text-sm ${produtosEstoqueBaixo.length > 0 ? 'text-red-600' : 'text-slate-500'}`}>Estoque baixo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de estoque baixo */}
      {produtosEstoqueBaixo.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center shadow-lg shadow-red-500/10">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-red-800">
                Atenção! {produtosEstoqueBaixo.length} produto{produtosEstoqueBaixo.length > 1 ? 's' : ''} com estoque baixo
              </h3>
              <p className="text-red-600 text-sm mt-1 mb-4">
                Estes produtos estão abaixo do ponto de reposição e precisam ser reabastecidos.
              </p>
              <div className="flex flex-wrap gap-2">
                {produtosEstoqueBaixo.map((produto) => (
                  <span key={produto.id} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-red-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="font-medium text-red-800">{produto.nome}</span>
                    <span className="text-red-600 font-bold">{produto.quantidade}{produto.unidade}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-52 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <div
              key={produto.id}
              className={`bg-white rounded-2xl shadow-sm border p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group ${
                produto.estoqueBaixo ? "border-red-200 ring-2 ring-red-100" : "border-slate-100"
              }`}
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                        produto.estoqueBaixo
                          ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/25"
                          : "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-emerald-500/25"
                      }`}
                    >
                      <Package className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        {produto.nome}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {formatCurrency(produto.custoPorUnidade)}/{produto.unidade}
                      </p>
                    </div>
                  </div>
                  {produto.estoqueBaixo && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                      Baixo
                    </span>
                  )}
                </div>

                {/* Quantidade */}
                <div className="pt-5 border-t border-slate-100">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">
                        Quantidade atual
                      </p>
                      <p
                        className={`text-4xl font-bold ${
                          produto.estoqueBaixo
                            ? "text-red-600"
                            : "text-slate-800"
                        }`}
                      >
                        {produto.quantidade}
                        <span className="text-lg text-slate-400 ml-1 font-normal">
                          {produto.unidade}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Mínimo</p>
                      <p className="text-lg font-semibold text-slate-600">
                        {produto.pontoReposicao}
                        <span className="text-sm text-slate-400 ml-0.5">{produto.unidade}</span>
                      </p>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        produto.estoqueBaixo ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-gradient-to-r from-emerald-500 to-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (produto.quantidade /
                            (produto.pontoReposicao * 2)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {produtos.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-slate-700 font-semibold text-lg">Nenhum produto cadastrado</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Cadastre os produtos do seu estoque
          </p>
          <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
            Cadastrar Produto
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Produto"
      >
        <form onSubmit={criarProduto} className="space-y-4">
          <Input
            name="nome"
            label="Nome do produto"
            placeholder="Ex: Shampoo Automotivo 5L"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="quantidade"
              label="Quantidade inicial"
              type="number"
              step="0.01"
              placeholder="5000"
              required
            />
            <Input
              name="unidade"
              label="Unidade"
              placeholder="ml, un, g"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="custoPorUnidade"
              label="Custo por unidade (R$)"
              type="number"
              step="0.01"
              placeholder="0.05"
              required
            />
            <Input
              name="pontoReposicao"
              label="Ponto de reposição"
              type="number"
              step="0.01"
              placeholder="1000"
              required
            />
          </div>
          <p className="text-xs text-slate-500">
            O sistema alertará quando a quantidade for menor que o ponto de
            reposição.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

