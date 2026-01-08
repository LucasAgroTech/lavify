"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Car,
  User,
  Wrench,
  Clock,
  Plus,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input, Select } from "@/components/Input";
import { Modal } from "@/components/Modal";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  veiculos: Veiculo[];
}

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  cor: string | null;
  clienteId: string;
}

interface Servico {
  id: string;
  nome: string;
  preco: number;
  tempoEstimado: number;
}

interface FormData {
  clienteId: string;
  veiculoId: string;
  previsaoSaida: string;
}

export default function NovaOSPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm<FormData>();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [showNovoVeiculo, setShowNovoVeiculo] = useState(false);

  const clienteSelecionado = watch("clienteId");
  const veiculosSelecionados =
    clientes.find((c) => c.id === clienteSelecionado)?.veiculos || [];

  useEffect(() => {
    Promise.all([fetchClientes(), fetchServicos()]).finally(() =>
      setLoading(false)
    );
  }, []);

  async function fetchClientes() {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    setClientes(data);
  }

  async function fetchServicos() {
    const res = await fetch("/api/servicos");
    const data = await res.json();
    setServicos(data);
  }

  function toggleServico(servicoId: string) {
    setServicosSelecionados((prev) =>
      prev.includes(servicoId)
        ? prev.filter((id) => id !== servicoId)
        : [...prev, servicoId]
    );
  }

  const totalServicos = servicos
    .filter((s) => servicosSelecionados.includes(s.id))
    .reduce((acc, s) => acc + s.preco, 0);

  const tempoTotal = servicos
    .filter((s) => servicosSelecionados.includes(s.id))
    .reduce((acc, s) => acc + s.tempoEstimado, 0);

  async function onSubmit(data: FormData) {
    if (servicosSelecionados.length === 0) {
      alert("Selecione pelo menos um serviço");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/ordens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          servicosIds: servicosSelecionados,
        }),
      });

      if (res.ok) {
        router.push("/kanban");
      } else {
        alert("Erro ao criar OS");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar OS");
    } finally {
      setSubmitting(false);
    }
  }

  async function criarCliente(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nome = form.get("nome") as string;
    const telefone = form.get("telefone") as string;

    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone }),
    });

    if (res.ok) {
      await fetchClientes();
      setShowNovoCliente(false);
    }
  }

  async function criarVeiculo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const placa = form.get("placa") as string;
    const modelo = form.get("modelo") as string;
    const cor = form.get("cor") as string;

    const res = await fetch("/api/veiculos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        placa,
        modelo,
        cor,
        clienteId: clienteSelecionado,
      }),
    });

    if (res.ok) {
      await fetchClientes();
      setShowNovoVeiculo(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="h-[400px] bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Nova OS</h1>
          <p className="text-slate-500 mt-1">
            Registre uma nova ordem de serviço
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Cliente */}
        <Card title="Cliente" icon={<User className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  label="Selecione o cliente"
                  options={clientes.map((c) => ({
                    value: c.id,
                    label: `${c.nome} - ${c.telefone}`,
                  }))}
                  {...register("clienteId", { required: true })}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowNovoCliente(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Novo
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Veículo */}
        <Card title="Veículo" icon={<Car className="w-5 h-5" />}>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  label="Selecione o veículo"
                  options={veiculosSelecionados.map((v) => ({
                    value: v.id,
                    label: `${v.placa} - ${v.modelo} ${v.cor || ""}`,
                  }))}
                  disabled={!clienteSelecionado}
                  {...register("veiculoId", { required: true })}
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowNovoVeiculo(true)}
                  disabled={!clienteSelecionado}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Novo
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Serviços */}
        <Card title="Serviços" icon={<Wrench className="w-5 h-5" />}>
          <div className="grid grid-cols-2 gap-4">
            {servicos.map((servico) => {
              const selecionado = servicosSelecionados.includes(servico.id);
              return (
                <button
                  key={servico.id}
                  type="button"
                  onClick={() => toggleServico(servico.id)}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all duration-200
                    ${
                      selecionado
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-slate-200 hover:border-slate-300"
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-800">
                        {servico.nome}
                      </p>
                      <p className="text-sm text-slate-500">
                        {servico.tempoEstimado} min
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(servico.preco)}
                      </span>
                      {selecionado && (
                        <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {servicos.length === 0 && (
            <p className="text-slate-400 text-center py-8">
              Nenhum serviço cadastrado. Cadastre serviços primeiro.
            </p>
          )}
        </Card>

        {/* Previsão */}
        <Card title="Previsão" icon={<Clock className="w-5 h-5" />}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="Previsão de Saída"
              {...register("previsaoSaida")}
            />
            <div className="flex items-end">
              <div className="text-sm text-slate-500">
                Tempo estimado: <strong>{tempoTotal} min</strong>
              </div>
            </div>
          </div>
        </Card>

        {/* Resumo e Submit */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100">Total da OS</p>
              <p className="text-4xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalServicos)}
              </p>
              <p className="text-cyan-100 mt-1">
                {servicosSelecionados.length} serviço(s) selecionado(s)
              </p>
            </div>
            <Button
              type="submit"
              disabled={submitting || servicosSelecionados.length === 0}
              className="bg-white text-cyan-600 hover:bg-cyan-50 shadow-none"
              size="lg"
            >
              {submitting ? "Criando..." : "Criar OS"}
            </Button>
          </div>
        </div>
      </form>

      {/* Modal Novo Cliente */}
      <Modal
        isOpen={showNovoCliente}
        onClose={() => setShowNovoCliente(false)}
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
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowNovoCliente(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Novo Veículo */}
      <Modal
        isOpen={showNovoVeiculo}
        onClose={() => setShowNovoVeiculo(false)}
        title="Novo Veículo"
      >
        <form onSubmit={criarVeiculo} className="space-y-4">
          <Input
            name="placa"
            label="Placa"
            placeholder="ABC-1234"
            required
            style={{ textTransform: "uppercase" }}
          />
          <Input name="modelo" label="Modelo" placeholder="Ex: Honda Civic" required />
          <Input name="cor" label="Cor" placeholder="Ex: Prata" />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowNovoVeiculo(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

