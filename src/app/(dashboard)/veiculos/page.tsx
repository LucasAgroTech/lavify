"use client";

import { useState, useEffect } from "react";
import { Car, Plus, Search, User } from "lucide-react";
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

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busca, setBusca] = useState("");

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
      setClientes(await clientesRes.json());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function criarVeiculo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const placa = form.get("placa") as string;
    const modelo = form.get("modelo") as string;
    const cor = form.get("cor") as string;
    const clienteId = form.get("clienteId") as string;

    const res = await fetch("/api/veiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placa, modelo, cor, clienteId }),
    });

    if (res.ok) {
      await fetchData();
      setShowModal(false);
    }
  }

  const veiculosFiltrados = veiculos.filter(
    (v) =>
      v.placa.toLowerCase().includes(busca.toLowerCase()) ||
      v.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      v.cliente.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const cores = [
    "bg-slate-400",
    "bg-red-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-400",
    "bg-slate-800",
    "bg-white border border-slate-200",
    "bg-gray-300",
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Veículos</h1>
          <p className="text-slate-500 mt-1">
            Gerencie os veículos cadastrados
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          Novo Veículo
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por placa, modelo ou cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
        />
      </div>

      {/* Lista */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {veiculosFiltrados.map((veiculo) => (
            <Card key={veiculo.id} className="hover:shadow-md transition-shadow">
              <div className="space-y-3">
                {/* Placa estilizada */}
                <div className="bg-slate-100 rounded-xl p-4 text-center">
                  <span className="font-mono font-bold text-2xl text-slate-800 tracking-wider">
                    {veiculo.placa}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700">
                      {veiculo.modelo}
                    </span>
                  </div>

                  {veiculo.cor && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          cores[Math.floor(Math.random() * cores.length)]
                        }`}
                      />
                      {veiculo.cor}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-500 pt-2 border-t border-slate-100">
                    <User className="w-4 h-4" />
                    {veiculo.cliente.nome}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {veiculosFiltrados.length === 0 && !loading && (
        <div className="text-center py-12">
          <Car className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-600 font-medium">Nenhum veículo encontrado</h3>
          <p className="text-slate-400 text-sm mt-1">
            Cadastre seu primeiro veículo
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Veículo"
      >
        <form onSubmit={criarVeiculo} className="space-y-4">
          <Select
            name="clienteId"
            label="Cliente"
            options={clientes.map((c) => ({
              value: c.id,
              label: `${c.nome} - ${c.telefone}`,
            }))}
            required
          />
          <Input
            name="placa"
            label="Placa"
            placeholder="ABC-1234"
            required
            style={{ textTransform: "uppercase" }}
          />
          <Input
            name="modelo"
            label="Modelo"
            placeholder="Ex: Honda Civic"
            required
          />
          <Input name="cor" label="Cor" placeholder="Ex: Prata" />
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

