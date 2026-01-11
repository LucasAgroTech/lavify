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
  ChevronRight,
  Search,
  X,
  Sparkles,
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
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNovoCliente, setShowNovoCliente] = useState(false);
  const [showNovoVeiculo, setShowNovoVeiculo] = useState(false);
  const [searchCliente, setSearchCliente] = useState("");
  const [showClienteList, setShowClienteList] = useState(false);

  const clienteSelecionado = watch("clienteId");
  const veiculoId = watch("veiculoId");
  const clienteObj = clientes.find((c) => c.id === clienteSelecionado);
  const veiculosSelecionados = clienteObj?.veiculos || [];
  const veiculoObj = veiculosSelecionados.find((v) => v.id === veiculoId);

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

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchCliente.toLowerCase()) ||
      c.telefone.includes(searchCliente)
  );

  function selecionarCliente(cliente: Cliente) {
    setValue("clienteId", cliente.id);
    setValue("veiculoId", "");
    setShowClienteList(false);
    setSearchCliente("");
  }

  async function onSubmit(data: FormData) {
    // Usar valores do estado diretamente para garantir consistência no mobile
    const clienteIdFinal = data.clienteId || clienteSelecionado;
    const veiculoIdFinal = data.veiculoId || veiculoId;
    
    if (!clienteIdFinal) {
      alert("Selecione um cliente");
      return;
    }
    
    if (!veiculoIdFinal) {
      alert("Selecione um veículo");
      return;
    }
    
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
          clienteId: clienteIdFinal,
          veiculoId: veiculoIdFinal,
          previsaoSaida: data.previsaoSaida || null,
          servicosIds: servicosSelecionados,
        }),
      });

      if (res.ok) {
        // Usar replace para não permitir voltar para o form de criação
        router.replace("/kanban");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao criar OS");
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
      const novoCliente = await res.json();
      await fetchClientes();
      setValue("clienteId", novoCliente.id);
      setShowNovoCliente(false);
    }
  }

  async function criarVeiculo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const placa = (form.get("placa") as string).toUpperCase();
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
      const novoVeiculo = await res.json();
      await fetchClientes();
      setValue("veiculoId", novoVeiculo.id);
      setShowNovoVeiculo(false);
    }
  }

  // Loading
  if (loading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="lg:hidden p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 rounded-xl" />
            <div className="h-24 bg-slate-200 rounded-xl" />
            <div className="h-24 bg-slate-200 rounded-xl" />
            <div className="h-48 bg-slate-200 rounded-xl" />
          </div>
        </div>
        {/* Desktop Loading */}
        <div className="hidden lg:block p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64" />
            <div className="h-[400px] bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  // Calcular progresso
  const step1Done = !!clienteSelecionado;
  const step2Done = !!veiculoId;
  const step3Done = servicosSelecionados.length > 0;

  return (
    <>
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden min-h-screen bg-slate-50 pb-48">
        {/* Header */}
        <div className="sticky top-14 z-20 bg-white border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-slate-800">Nova OS</h1>
              <p className="text-xs text-slate-500">Criar ordem de serviço</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-3">
            <div className={`flex-1 h-1.5 rounded-full ${step1Done ? "bg-cyan-500" : "bg-slate-200"}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step2Done ? "bg-cyan-500" : "bg-slate-200"}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step3Done ? "bg-cyan-500" : "bg-slate-200"}`} />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Step 1: Cliente */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step1Done ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {step1Done ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">1</span>}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">Cliente</p>
                <p className="text-xs text-slate-500">Quem é o dono do veículo?</p>
              </div>
            </div>

            <div className="p-4">
              {clienteObj ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{clienteObj.nome}</p>
                    <p className="text-sm text-slate-500">{clienteObj.telefone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setValue("clienteId", "");
                      setValue("veiculoId", "");
                    }}
                    className="p-2 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowClienteList(true)}
                    className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-left"
                  >
                    <Search className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-500">Buscar cliente...</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNovoCliente(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Novo Cliente
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Veículo */}
          <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${!step1Done ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step2Done ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {step2Done ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">2</span>}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">Veículo</p>
                <p className="text-xs text-slate-500">Qual carro será lavado?</p>
              </div>
            </div>

            <div className="p-4">
              {veiculosSelecionados.length > 0 ? (
                <div className="space-y-2">
                  {veiculosSelecionados.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setValue("veiculoId", v.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        veiculoId === v.id
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-slate-200"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        veiculoId === v.id ? "bg-cyan-500" : "bg-slate-100"
                      }`}>
                        <Car className={`w-5 h-5 ${veiculoId === v.id ? "text-white" : "text-slate-500"}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-mono font-bold text-slate-800">{v.placa}</p>
                        <p className="text-sm text-slate-500">{v.modelo} {v.cor && `• ${v.cor}`}</p>
                      </div>
                      {veiculoId === v.id && (
                        <Check className="w-5 h-5 text-cyan-500" />
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowNovoVeiculo(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Adicionar Veículo
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-500 text-sm mb-3">Nenhum veículo cadastrado</p>
                  <button
                    type="button"
                    onClick={() => setShowNovoVeiculo(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-xl font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Cadastrar Veículo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Serviços */}
          <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${!step2Done ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step3Done ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {step3Done ? <Check className="w-4 h-4" /> : <span className="text-sm font-bold">3</span>}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">Serviços</p>
                <p className="text-xs text-slate-500">O que será feito?</p>
              </div>
              {servicosSelecionados.length > 0 && (
                <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs font-bold rounded-full">
                  {servicosSelecionados.length}
                </span>
              )}
            </div>

            <div className="p-4 space-y-2">
              {servicos.length > 0 ? (
                servicos.map((servico) => {
                  const selecionado = servicosSelecionados.includes(servico.id);
                  return (
                    <button
                      key={servico.id}
                      type="button"
                      onClick={() => toggleServico(servico.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        selecionado
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-slate-200"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selecionado ? "border-cyan-500 bg-cyan-500" : "border-slate-300"
                      }`}>
                        {selecionado && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-slate-800">{servico.nome}</p>
                        <p className="text-xs text-slate-500">{servico.tempoEstimado} min</p>
                      </div>
                      <span className="font-bold text-emerald-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(servico.preco)}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <Wrench className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>Nenhum serviço cadastrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Hidden inputs for form */}
          <input type="hidden" {...register("clienteId")} />
          <input type="hidden" {...register("veiculoId")} />
        </form>

        {/* Floating Summary - 80px para ficar acima da nav + safe area */}
        <div className="fixed left-0 right-0 bg-white border-t border-slate-200 shadow-lg p-4 z-30 lg:hidden" style={{ bottom: '80px' }}>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-800">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalServicos)}
              </p>
              {tempoTotal > 0 && (
                <p className="text-xs text-slate-500">{tempoTotal} min estimados</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                // Chamar submit diretamente sem depender do form
                onSubmit({
                  clienteId: clienteSelecionado,
                  veiculoId: veiculoId,
                  previsaoSaida: "",
                });
              }}
              disabled={submitting || !step1Done || !step2Done || !step3Done}
              className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-all ${
                step1Done && step2Done && step3Done && !submitting
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </span>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Criar OS
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal: Lista de Clientes */}
        {showClienteList && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={() => setShowClienteList(false)}
            />
            {/* Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-[60] lg:hidden animate-slide-in" style={{ maxHeight: '80vh' }}>
              {/* Header fixo */}
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-100 p-4">
                <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg text-slate-800">Buscar Cliente</h2>
                  <button 
                    type="button"
                    onClick={() => setShowClienteList(false)} 
                    className="p-2 rounded-full bg-slate-100"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    inputMode="search"
                    placeholder="Nome ou telefone..."
                    value={searchCliente}
                    onChange={(e) => setSearchCliente(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base"
                  />
                </div>
              </div>
              {/* Lista scrollável */}
              <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(80vh - 200px)' }}>
                <div className="p-4 space-y-2">
                  {clientesFiltrados.map((cliente) => (
                    <button
                      key={cliente.id}
                      type="button"
                      onClick={() => selecionarCliente(cliente)}
                      className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-left active:bg-slate-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{cliente.nome}</p>
                        <p className="text-sm text-slate-500">{cliente.telefone}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </button>
                  ))}
                  {clientesFiltrados.length === 0 && searchCliente && (
                    <div className="text-center py-8 text-slate-400">
                      <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>Nenhum cliente encontrado</p>
                      <p className="text-sm">Tente outro nome ou telefone</p>
                    </div>
                  )}
                  {clientesFiltrados.length === 0 && !searchCliente && clientes.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                      <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>Nenhum cliente cadastrado</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Footer fixo */}
              <div className="sticky bottom-0 p-4 bg-white border-t border-slate-100 safe-area-pb">
                <button
                  type="button"
                  onClick={() => {
                    setShowClienteList(false);
                    setShowNovoCliente(true);
                  }}
                  className="w-full py-3 bg-cyan-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:bg-cyan-600"
                >
                  <Plus className="w-5 h-5" />
                  Cadastrar Novo Cliente
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-8 space-y-6 max-w-4xl">
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
      </div>

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
    </>
  );
}
