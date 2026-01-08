"use client";

import { useState, useEffect } from "react";
import { Package, Plus, AlertTriangle, TrendingDown } from "lucide-react";
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Estoque</h1>
          <p className="text-slate-500 mt-1">
            Controle de produtos e insumos
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          Novo Produto
        </Button>
      </div>

      {/* Alerta de estoque baixo */}
      {produtosEstoqueBaixo.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-800">
                Atenção! {produtosEstoqueBaixo.length} produto(s) com estoque
                baixo
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                {produtosEstoqueBaixo.map((produto) => (
                  <Badge key={produto.id} variant="danger" size="sm">
                    {produto.nome}: {produto.quantidade}
                    {produto.unidade}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-52 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtos.map((produto) => (
            <Card
              key={produto.id}
              className={`hover:shadow-md transition-shadow ${
                produto.estoqueBaixo ? "ring-2 ring-red-200" : ""
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        produto.estoqueBaixo
                          ? "bg-red-100 text-red-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {produto.nome}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Custo: {formatCurrency(produto.custoPorUnidade)}/
                        {produto.unidade}
                      </p>
                    </div>
                  </div>
                  {produto.estoqueBaixo && (
                    <Badge variant="danger" size="sm">
                      Baixo
                    </Badge>
                  )}
                </div>

                {/* Quantidade */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        Quantidade atual
                      </p>
                      <p
                        className={`text-3xl font-bold ${
                          produto.estoqueBaixo
                            ? "text-red-600"
                            : "text-slate-800"
                        }`}
                      >
                        {produto.quantidade}
                        <span className="text-lg text-slate-400 ml-1">
                          {produto.unidade}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Ponto de reposição</p>
                      <p className="text-sm text-slate-600">
                        {produto.pontoReposicao}
                        {produto.unidade}
                      </p>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div className="mt-4">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          produto.estoqueBaixo ? "bg-red-500" : "bg-emerald-500"
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
            </Card>
          ))}
        </div>
      )}

      {produtos.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-600 font-medium">Nenhum produto cadastrado</h3>
          <p className="text-slate-400 text-sm mt-1">
            Cadastre seu primeiro produto
          </p>
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

