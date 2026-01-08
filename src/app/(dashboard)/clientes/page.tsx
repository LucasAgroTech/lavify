"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Phone, Award, Search, Car } from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { Badge } from "@/components/Badge";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  pontosFidelidade: number;
  saldoCashback: number;
  planoMensal: boolean;
  veiculos: { id: string; placa: string; modelo: string }[];
  _count: { ordens: number };
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busca, setBusca] = useState("");

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

  async function criarCliente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nome = form.get("nome") as string;
    const telefone = form.get("telefone") as string;
    const planoMensal = form.get("planoMensal") === "on";

    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone, planoMensal }),
    });

    if (res.ok) {
      await fetchClientes();
      setShowModal(false);
    }
  }

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.includes(busca)
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
          <p className="text-slate-500 mt-1">
            Gerencie sua base de clientes
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nome ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
        />
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
          {clientesFiltrados.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-md transition-shadow">
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

      {clientesFiltrados.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-600 font-medium">Nenhum cliente encontrado</h3>
          <p className="text-slate-400 text-sm mt-1">
            Cadastre seu primeiro cliente
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Cliente"
      >
        <form onSubmit={criarCliente} className="space-y-4">
          <Input name="nome" label="Nome completo" required />
          <Input
            name="telefone"
            label="Telefone (WhatsApp)"
            placeholder="(11) 99999-9999"
            required
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="planoMensal"
              id="planoMensal"
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
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

