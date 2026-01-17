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
    setClientes(data.clientes || []);
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
      <div className="lg:hidden min-h-screen bg-slate-50 pb-40">
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

        {/* Floating Summary - Posicionado acima da nav (h-16 = 64px + safe-area) */}
        <div className="fixed left-0 right-0 bottom-16 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 lg:hidden safe-area-pb">
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-slate-800">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalServicos)}
                </p>
                {tempoTotal > 0 && (
                  <p className="text-xs text-slate-400">• {tempoTotal} min</p>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {servicosSelecionados.length === 0 
                  ? "Nenhum serviço" 
                  : `${servicosSelecionados.length} serviço${servicosSelecionados.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSubmit({
                  clienteId: clienteSelecionado,
                  veiculoId: veiculoId,
                  previsaoSaida: "",
                });
              }}
              disabled={submitting || !step1Done || !step2Done || !step3Done}
              className={`flex-shrink-0 px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                step1Done && step2Done && step3Done && !submitting
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
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
      <div className="hidden lg:block p-6 xl:p-8 min-h-screen bg-slate-50">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Nova Ordem de Serviço</h1>
                <p className="text-slate-500 text-sm">Preencha os dados para criar uma nova OS</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-3 gap-6">
              
              {/* Coluna Esquerda - Cliente e Veículo */}
              <div className="col-span-2 space-y-6">
                
                {/* Cliente e Veículo em linha */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Cliente */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <h3 className="font-semibold text-slate-800">Cliente</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNovoCliente(true)}
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Novo
                      </button>
                    </div>
                    
                    <select
                      {...register("clienteId", { required: true })}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    >
                      <option value="">Selecione o cliente</option>
                      {clientes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome} - {c.telefone}
                        </option>
                      ))}
                    </select>

                    {clienteObj && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{clienteObj.nome}</p>
                          <p className="text-sm text-slate-500">{clienteObj.telefone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Veículo */}
                  <div className={`bg-white rounded-xl border border-slate-200 p-5 ${!clienteSelecionado ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-500" />
                        <h3 className="font-semibold text-slate-800">Veículo</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowNovoVeiculo(true)}
                        disabled={!clienteSelecionado}
                        className="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                        Novo
                      </button>
                    </div>
                    
                    <select
                      {...register("veiculoId", { required: true })}
                      disabled={!clienteSelecionado}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 disabled:bg-slate-100"
                    >
                      <option value="">Selecione o veículo</option>
                      {veiculosSelecionados.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.placa} - {v.modelo} {v.cor || ""}
                        </option>
                      ))}
                    </select>

                    {veiculoObj && (
                      <div className="mt-3 p-3 bg-slate-50 rounded-lg flex items-center gap-3">
                        <div className="bg-slate-800 text-white px-3 py-1.5 rounded-md">
                          <span className="font-mono font-bold text-sm">{veiculoObj.placa}</span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{veiculoObj.modelo}</p>
                          {veiculoObj.cor && <p className="text-sm text-slate-500">{veiculoObj.cor}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Serviços */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-slate-500" />
                      <h3 className="font-semibold text-slate-800">Serviços</h3>
                    </div>
                    {servicosSelecionados.length > 0 && (
                      <span className="text-sm text-cyan-600 font-medium">
                        {servicosSelecionados.length} selecionado{servicosSelecionados.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {servicos.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {servicos.map((servico) => {
                        const selecionado = servicosSelecionados.includes(servico.id);
                        return (
                          <button
                            key={servico.id}
                            type="button"
                            onClick={() => toggleServico(servico.id)}
                            className={`
                              flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all
                              ${selecionado
                                ? "border-cyan-500 bg-cyan-50"
                                : "border-slate-200 hover:border-slate-300"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                selecionado ? "border-cyan-500 bg-cyan-500" : "border-slate-300"
                              }`}>
                                {selecionado && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">{servico.nome}</p>
                                <p className="text-xs text-slate-500">{servico.tempoEstimado} min</p>
                              </div>
                            </div>
                            <span className="font-semibold text-emerald-600">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(servico.preco)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <Wrench className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum serviço cadastrado</p>
                    </div>
                  )}
                </div>

                {/* Previsão */}
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <h3 className="font-semibold text-slate-800">Previsão de Saída</h3>
                    <span className="text-sm text-slate-400">(opcional)</span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <input
                      type="datetime-local"
                      {...register("previsaoSaida")}
                      className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                    {tempoTotal > 0 && (
                      <p className="text-sm text-slate-500">
                        Tempo estimado: <strong className="text-slate-800">{tempoTotal} min</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Coluna Direita - Resumo */}
              <div className="col-span-1">
                <div className="sticky top-8 bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="p-5 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Resumo da OS</h3>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Cliente selecionado */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Cliente</span>
                      <span className="font-medium text-slate-800">
                        {clienteObj?.nome || "—"}
                      </span>
                    </div>

                    {/* Veículo selecionado */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Veículo</span>
                      <span className="font-medium text-slate-800">
                        {veiculoObj?.placa || "—"}
                      </span>
                    </div>

                    {/* Serviços */}
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-sm text-slate-500 mb-2">Serviços</p>
                      {servicosSelecionados.length > 0 ? (
                        <div className="space-y-2">
                          {servicos
                            .filter((s) => servicosSelecionados.includes(s.id))
                            .map((s) => (
                              <div key={s.id} className="flex items-center justify-between text-sm">
                                <span className="text-slate-700">{s.nome}</span>
                                <span className="font-medium text-slate-800">
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(s.preco)}
                                </span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">Nenhum serviço selecionado</p>
                      )}
                    </div>

                    {/* Tempo */}
                    {tempoTotal > 0 && (
                      <div className="flex items-center justify-between text-sm pt-3 border-t border-slate-100">
                        <span className="text-slate-500">Tempo estimado</span>
                        <span className="font-medium text-slate-800">{tempoTotal} min</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="p-5 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-600 font-medium">Total</span>
                      <span className="text-2xl font-bold text-slate-800">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(totalServicos)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || !clienteSelecionado || !veiculoId || servicosSelecionados.length === 0}
                      className={`
                        w-full py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors
                        ${clienteSelecionado && veiculoId && servicosSelecionados.length > 0 && !submitting
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }
                      `}
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Criando...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Criar Ordem de Serviço
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
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
