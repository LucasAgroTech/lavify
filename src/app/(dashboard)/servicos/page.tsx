"use client";

import { useState, useEffect } from "react";
import { Droplets, Plus, Clock, DollarSign } from "lucide-react";
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

  async function criarServico(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nome = form.get("nome") as string;
    const preco = parseFloat(form.get("preco") as string);
    const tempoEstimado = parseInt(form.get("tempoEstimado") as string);

    const res = await fetch("/api/servicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, preco, tempoEstimado }),
    });

    if (res.ok) {
      await fetchServicos();
      setShowModal(false);
    }
  }

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
          <h1 className="text-3xl font-bold text-slate-800">Serviços</h1>
          <p className="text-slate-500 mt-1">
            Gerencie os serviços oferecidos
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          Novo Serviço
        </Button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((servico) => (
            <Card
              key={servico.id}
              className="hover:shadow-md transition-shadow group"
            >
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

      {servicos.length === 0 && !loading && (
        <div className="text-center py-12">
          <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-600 font-medium">Nenhum serviço cadastrado</h3>
          <p className="text-slate-400 text-sm mt-1">
            Cadastre seu primeiro serviço
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Serviço"
      >
        <form onSubmit={criarServico} className="space-y-4">
          <Input
            name="nome"
            label="Nome do serviço"
            placeholder="Ex: Lavagem Completa"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="preco"
              label="Preço (R$)"
              type="number"
              step="0.01"
              placeholder="50.00"
              required
            />
            <Input
              name="tempoEstimado"
              label="Tempo (minutos)"
              type="number"
              placeholder="30"
              required
            />
          </div>
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

