"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Award, 
  Search, 
  Car, 
  X,
  Check,
  Loader2,
  ArrowLeft,
  ChevronRight,
  MessageCircle,
  Pencil,
  Crown,
  Clock,
  Gift,
  Stamp,
  Send,
  Sparkles,
  DollarSign,
  UserX,
  UserCheck,
  Ghost,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UltimaLavagem {
  id: string;
  codigo: number;
  data: string;
  valor: number;
  servico: string;
}

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  pontosFidelidade: number;
  saldoCashback: number;
  planoMensal: boolean;
  participaFidelidade: boolean;
  createdAt: string;
  veiculos: { id: string; placa: string; modelo: string; cor?: string }[];
  _count: { ordens: number };
  totalGasto: number;
  ultimaLavagem: UltimaLavagem | null;
  diasSemVir: number | null;
  carimbos: number;
  lavagensGratis: number;
  status: "novo" | "ativo" | "regular" | "inativo" | "sumido";
}

interface FidelidadeConfig {
  ativa: boolean;
  meta: number;
}

type FiltroStatus = "todos" | "ativo" | "regular" | "inativo" | "sumido" | "mensal";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fidelidadeConfig, setFidelidadeConfig] = useState<FidelidadeConfig>({ ativa: false, meta: 10 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [clienteWhatsApp, setClienteWhatsApp] = useState<Cliente | null>(null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("todos");
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [clienteExpandido, setClienteExpandido] = useState<string | null>(null);
  const [processandoFidelidade, setProcessandoFidelidade] = useState<string | null>(null);
  const [mensagemFidelidade, setMensagemFidelidade] = useState<string | null>(null);

  // Form states
  const [formNome, setFormNome] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formPlanoMensal, setFormPlanoMensal] = useState(false);
  const [formParticipaFidelidade, setFormParticipaFidelidade] = useState(true);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    setLoading(true);
    try {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data.clientes || []);
      setFidelidadeConfig(data.fidelidadeConfig || { ativa: false, meta: 10 });
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  function abrirModalCriar() {
    setEditando(null);
    setFormNome("");
    setFormTelefone("");
    setFormPlanoMensal(false);
    setFormParticipaFidelidade(true);
    setShowModal(true);
  }

  function abrirModalEditar(cliente: Cliente) {
    setEditando(cliente);
    setFormNome(cliente.nome);
    setFormTelefone(cliente.telefone);
    setFormPlanoMensal(cliente.planoMensal);
    setFormParticipaFidelidade(cliente.participaFidelidade);
    setShowModal(true);
  }

  function abrirWhatsAppModal(cliente: Cliente) {
    setClienteWhatsApp(cliente);
    setShowWhatsAppModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);

    try {
      const payload = {
        nome: formNome,
        telefone: formTelefone,
        planoMensal: formPlanoMensal,
        participaFidelidade: formParticipaFidelidade,
      };

      const url = editando ? `/api/clientes/${editando.id}` : "/api/clientes";
      const method = editando ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchClientes();
        setShowModal(false);
      } else {
        const data = await res.json();
        alert(data.error || "Erro ao salvar cliente");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar cliente");
    } finally {
      setSalvando(false);
    }
  }

  function enviarWhatsApp(telefone: string, mensagem: string) {
    const phone = telefone.replace(/\D/g, "");
    const message = encodeURIComponent(mensagem);
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
    setShowWhatsAppModal(false);
  }

  async function gerenciarFidelidade(clienteId: string, acao: "adicionar" | "resgatar") {
    setProcessandoFidelidade(clienteId);
    setMensagemFidelidade(null);

    try {
      const res = await fetch(`/api/clientes/${clienteId}/fidelidade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acao }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensagemFidelidade(data.mensagem);
        // Atualizar lista de clientes
        await fetchClientes();
        // Limpar mensagem após 3 segundos
        setTimeout(() => setMensagemFidelidade(null), 3000);
      } else {
        alert(data.error || "Erro ao processar");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar");
    } finally {
      setProcessandoFidelidade(null);
    }
  }

  function getMensagensMarketing(cliente: Cliente) {
    const primeiroNome = cliente.nome.split(" ")[0];
    const meta = fidelidadeConfig.meta;
    
    return [
      {
        tipo: "saudade",
        icone: Ghost,
        titulo: "Sentimos sua falta!",
        cor: "text-violet-600 bg-violet-50",
        mensagem: `Olá ${primeiroNome}! 👋\n\nSentimos sua falta por aqui! Faz um tempinho que seu carro não vem nos visitar.\n\n🚗 Que tal agendar uma lavagem? Seu carro merece brilhar!\n\nResponda essa mensagem para agendar. 😊`,
      },
      ...(fidelidadeConfig.ativa && cliente.participaFidelidade ? [{
        tipo: "fidelidade",
        icone: Gift,
        titulo: "Cartão Fidelidade",
        cor: "text-amber-600 bg-amber-50",
        mensagem: `Olá ${primeiroNome}! 🎉\n\nVocê já tem ${cliente.carimbos} carimbo${cliente.carimbos !== 1 ? 's' : ''} no seu cartão fidelidade!\n\n🎁 Complete ${meta} e ganhe uma LAVAGEM GRÁTIS!\n\nVem lavar o carro e garantir mais um carimbo! 🚗✨`,
      }] : []),
      {
        tipo: "promocao",
        icone: Sparkles,
        titulo: "Promoção Especial",
        cor: "text-emerald-600 bg-emerald-50",
        mensagem: `Olá ${primeiroNome}! 🌟\n\nTemos uma promoção especial para clientes VIP como você!\n\n✨ [DESCREVA SUA PROMOÇÃO AQUI]\n\nVálido somente esta semana! Aproveite! 🚗💨`,
      },
      {
        tipo: "agradecimento",
        icone: Award,
        titulo: "Agradecimento",
        cor: "text-cyan-600 bg-cyan-50",
        mensagem: `Olá ${primeiroNome}! 😊\n\nObrigado por ser nosso cliente!\n\n🏆 Você já fez ${cliente._count.ordens} lavagem${cliente._count.ordens !== 1 ? 's' : ''} conosco!\n\nConte sempre com a gente para deixar seu carro brilhando! ✨🚗`,
      },
    ];
  }

  function getStatusConfig(status: Cliente["status"]) {
    switch (status) {
      case "novo":
        return { label: "Novo", cor: "bg-blue-100 text-blue-700", icone: Plus };
      case "ativo":
        return { label: "Ativo", cor: "bg-emerald-100 text-emerald-700", icone: UserCheck };
      case "regular":
        return { label: "Regular", cor: "bg-amber-100 text-amber-700", icone: Clock };
      case "inativo":
        return { label: "Inativo", cor: "bg-orange-100 text-orange-700", icone: Clock };
      case "sumido":
        return { label: "Sumido", cor: "bg-red-100 text-red-700", icone: UserX };
      default:
        return { label: "—", cor: "bg-slate-100 text-slate-700", icone: Users };
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  // Aplicar filtros
  const clientesFiltrados = clientes.filter((c) => {
    const matchBusca = 
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.includes(busca) ||
      c.veiculos.some(v => v.placa.toLowerCase().includes(busca.toLowerCase()));

    const matchFiltro = 
      filtro === "todos" ||
      (filtro === "mensal" && c.planoMensal) ||
      c.status === filtro;

    return matchBusca && matchFiltro;
  });

  // Stats
  const stats = {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === "ativo" || c.status === "regular").length,
    inativos: clientes.filter(c => c.status === "inativo").length,
    sumidos: clientes.filter(c => c.status === "sumido").length,
    mensalistas: clientes.filter(c => c.planoMensal).length,
  };

  // Loading
  if (loading) {
    return (
      <>
        <div className="lg:hidden min-h-screen bg-slate-50">
          <div className="sticky top-14 z-20 bg-white border-b border-slate-100 p-4">
            <div className="animate-pulse">
              <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-48 bg-slate-200 rounded mb-4" />
              <div className="h-12 bg-slate-200 rounded-xl" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
        <div className="hidden lg:block p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-slate-200 rounded" />
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl" />
              ))}
            </div>
            <div className="h-96 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </>
    );
  }

  const meta = fidelidadeConfig.meta;

  return (
    <div className="pb-24 lg:pb-0">
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden min-h-screen bg-slate-50">
        {/* Header */}
        <div className="sticky top-14 z-20 bg-white border-b border-slate-100 shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Clientes</h1>
                <p className="text-sm text-slate-500">{clientes.length} cadastrados</p>
              </div>
              <button
                onClick={abrirModalCriar}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white font-medium active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Novo</span>
              </button>
            </div>

            {/* Busca */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                inputMode="search"
                placeholder="Nome, telefone ou placa..."
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

            {/* Filtros Mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {[
                { key: "todos", label: "Todos", count: stats.total },
                { key: "ativo", label: "Ativos", count: stats.ativos },
                { key: "inativo", label: "Inativos", count: stats.inativos },
                { key: "sumido", label: "Sumidos", count: stats.sumidos },
                { key: "mensal", label: "Mensalistas", count: stats.mensalistas },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFiltro(f.key as FiltroStatus)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filtro === f.key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="p-4 space-y-2">
          {clientesFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-semibold">
                {busca ? "Nenhum cliente encontrado" : "Nenhum cliente"}
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-4">
                {busca ? "Tente outro termo" : "Cadastre seu primeiro cliente"}
              </p>
              {!busca && (
                <button onClick={abrirModalCriar} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-medium rounded-xl text-sm">
                  <Plus className="w-4 h-4" /> Cadastrar
                </button>
              )}
            </div>
          ) : (
            clientesFiltrados.map((cliente) => {
              const isExpanded = clienteExpandido === cliente.id;
              const statusConfig = getStatusConfig(cliente.status);
              const mostrarFidelidade = fidelidadeConfig.ativa && cliente.participaFidelidade;
              
              return (
                <div key={cliente.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {/* Card Header */}
                  <button onClick={() => setClienteExpandido(isExpanded ? null : cliente.id)} className="w-full p-3 text-left">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-slate-800 text-sm truncate">{cliente.nome}</h3>
                          {cliente.planoMensal && <Crown className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500">{cliente.telefone}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${statusConfig.cor}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>

                      {/* Stats compacto */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {mostrarFidelidade && (
                          <div className="text-center">
                            <div className="flex gap-0.5">
                              {[...Array(meta)].map((_, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < cliente.carimbos ? "bg-emerald-500" : "bg-slate-200"}`} />
                              ))}
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5">{cliente.carimbos}/{meta}</p>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800">{cliente._count.ordens}</p>
                          <p className="text-[9px] text-slate-400">lavagens</p>
                        </div>
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                  </button>

                  {/* Card Expandido */}
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-slate-100">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2 py-3">
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-800 text-sm">{cliente._count.ordens}</span>
                          <p className="text-[10px] text-slate-500">Lavagens</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-emerald-600 text-sm">{formatCurrency(cliente.totalGasto).replace('R$', '')}</span>
                          <p className="text-[10px] text-slate-500">Total</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50 rounded-lg">
                          {cliente.ultimaLavagem ? (
                            <>
                              <span className="font-bold text-slate-800 text-sm">{cliente.diasSemVir}d</span>
                              <p className="text-[10px] text-slate-500">Última</p>
                            </>
                          ) : (
                            <>
                              <span className="font-bold text-slate-400 text-sm">—</span>
                              <p className="text-[10px] text-slate-500">Nunca</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Cartão de Fidelidade Visual */}
                      {mostrarFidelidade && (
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-white">
                              <Stamp className="w-4 h-4" />
                              <span className="font-semibold text-xs">Fidelidade</span>
                            </div>
                            {cliente.lavagensGratis > 0 && (
                              <span className="px-2 py-0.5 bg-amber-400 rounded-full text-[10px] text-amber-900 font-bold">
                                🎁 {cliente.lavagensGratis} grátis
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 justify-center">
                            {[...Array(meta)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-md flex items-center justify-center ${
                                  i < cliente.carimbos ? "bg-white" : "bg-white/20 border border-white/30"
                                }`}
                              >
                                {i < cliente.carimbos && <Check className="w-3 h-3 text-emerald-600" />}
                              </div>
                            ))}
                          </div>
                          <p className="text-white/80 text-[10px] text-center mt-2">
                            {cliente.carimbos}/{meta} carimbos
                          </p>
                          
                          {/* Botões de Fidelidade */}
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={(e) => { e.stopPropagation(); gerenciarFidelidade(cliente.id, "adicionar"); }}
                              disabled={processandoFidelidade === cliente.id}
                              className="flex-1 flex items-center justify-center gap-1 py-2 bg-white text-emerald-600 rounded-lg font-bold text-xs disabled:opacity-50 active:scale-95 transition-transform"
                            >
                              {processandoFidelidade === cliente.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="w-3 h-3" /> Carimbo
                                </>
                              )}
                            </button>
                            {cliente.lavagensGratis > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); gerenciarFidelidade(cliente.id, "resgatar"); }}
                                disabled={processandoFidelidade === cliente.id}
                                className="flex-1 flex items-center justify-center gap-1 py-2 bg-amber-400 text-amber-900 rounded-lg font-bold text-xs disabled:opacity-50 active:scale-95 transition-transform"
                              >
                                <Gift className="w-3 h-3" /> Resgatar
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Veículos */}
                      {cliente.veiculos.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {cliente.veiculos.map((v) => (
                            <span key={v.id} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                              <Car className="w-3 h-3" />
                              <span className="font-mono font-semibold">{v.placa}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirWhatsAppModal(cliente)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 text-white rounded-lg font-medium text-sm active:scale-95 transition-transform"
                        >
                          <Send className="w-4 h-4" /> Marketing
                        </button>
                        <button
                          onClick={() => abrirModalEditar(cliente)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium text-sm active:scale-95 transition-transform"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Editar
                        </button>
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
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
              <p className="text-slate-500 text-sm mt-0.5">Gestão completa de clientes e fidelidade</p>
            </div>
            <button
              onClick={abrirModalCriar}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Novo Cliente
            </button>
          </div>

          {/* Mensagem de Fidelidade */}
          {mensagemFidelidade && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
              <Gift className="w-6 h-6 text-emerald-600" />
              <p className="font-medium text-emerald-800">{mensagemFidelidade}</p>
            </div>
          )}

          {/* Stats - Responsivo */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{stats.ativos}</p>
                  <p className="text-xs text-slate-500">Ativos</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.inativos}</p>
                  <p className="text-xs text-slate-500">Inativos</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Ghost className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.sumidos}</p>
                  <p className="text-xs text-slate-500">Sumidos</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 xl:col-span-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.mensalistas}</p>
                  <p className="text-xs text-white/80">Mensalistas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { key: "todos", label: "Todos" },
                  { key: "ativo", label: "Ativos" },
                  { key: "inativo", label: "Inativos" },
                  { key: "sumido", label: "Sumidos" },
                  { key: "mensal", label: "Mensalistas" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFiltro(f.key as FiltroStatus)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filtro === f.key ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {clientesFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-700 font-medium">Nenhum cliente encontrado</h3>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Última</th>
                    {fidelidadeConfig.ativa && (
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase min-w-[180px]">Fidelidade</th>
                    )}
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Lavagens</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientesFiltrados.map((cliente) => {
                    const statusConfig = getStatusConfig(cliente.status);
                    const mostrarFidelidade = fidelidadeConfig.ativa && cliente.participaFidelidade;
                    
                    return (
                      <tr key={cliente.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-semibold text-sm">
                              {cliente.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800 text-sm">{cliente.nome}</span>
                                {cliente.planoMensal && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                              </div>
                              <p className="text-xs text-slate-500">{cliente.telefone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusConfig.cor}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {cliente.ultimaLavagem ? (
                            <span className="text-sm text-slate-600">
                              {formatDistanceToNow(new Date(cliente.ultimaLavagem.data), { addSuffix: true, locale: ptBR })}
                            </span>
                          ) : (
                            <span className="text-sm text-slate-400">Nunca</span>
                          )}
                        </td>
                        {fidelidadeConfig.ativa && (
                          <td className="py-3 px-4">
                            {mostrarFidelidade ? (
                              <div className="flex items-center gap-3">
                                {/* Barra de Progresso Visual */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all"
                                        style={{ width: `${(cliente.carimbos / meta) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{cliente.carimbos}/{meta}</span>
                                  </div>
                                  {cliente.lavagensGratis > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                                      <Gift className="w-3 h-3" /> {cliente.lavagensGratis} grátis
                                    </span>
                                  )}
                                </div>
                                {/* Botões */}
                                <div className="flex gap-1 flex-shrink-0">
                                  <button
                                    onClick={() => gerenciarFidelidade(cliente.id, "adicionar")}
                                    disabled={processandoFidelidade === cliente.id}
                                    className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg disabled:opacity-50"
                                    title="Dar carimbo"
                                  >
                                    {processandoFidelidade === cliente.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                  </button>
                                  {cliente.lavagensGratis > 0 && (
                                    <button
                                      onClick={() => gerenciarFidelidade(cliente.id, "resgatar")}
                                      disabled={processandoFidelidade === cliente.id}
                                      className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg disabled:opacity-50"
                                      title="Resgatar prêmio"
                                    >
                                      <Gift className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        )}
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-slate-800">{cliente._count.ordens}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-semibold text-emerald-600">{formatCurrency(cliente.totalGasto)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => abrirWhatsAppModal(cliente)}
                              className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Marketing"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => abrirModalEditar(cliente)}
                              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {clientesFiltrados.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-sm text-slate-500">
                {clientesFiltrados.length} de {clientes.length} clientes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== MODAL CRIAR/EDITAR ==================== */}
      {showModal && (
        <>
          {/* Mobile Modal */}
          <div className="fixed inset-0 z-[100] lg:hidden bg-white flex flex-col">
            <div className="flex-shrink-0 bg-white border-b border-slate-100 p-4 flex items-center gap-4">
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg font-bold text-slate-800">{editando ? "Editar" : "Novo"} Cliente</h2>
            </div>

            <form id="mobile-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome</label>
                <input type="text" value={formNome} onChange={(e) => setFormNome(e.target.value)} required
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800" placeholder="João da Silva" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">WhatsApp</label>
                <input type="tel" inputMode="tel" value={formTelefone} onChange={(e) => setFormTelefone(e.target.value)} required
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800" placeholder="(11) 99999-9999" />
              </div>
              
              {/* Toggle Mensal */}
              <button type="button" onClick={() => setFormPlanoMensal(!formPlanoMensal)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${formPlanoMensal ? "border-amber-400 bg-amber-50" : "border-slate-200"}`}>
                <Crown className={`w-5 h-5 ${formPlanoMensal ? "text-amber-500" : "text-slate-400"}`} />
                <span className="flex-1 text-left text-sm font-medium text-slate-700">Mensalista</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formPlanoMensal ? "border-amber-400 bg-amber-400" : "border-slate-300"}`}>
                  {formPlanoMensal && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>

              {/* Toggle Fidelidade (só se ativa no lava jato) */}
              {fidelidadeConfig.ativa && (
                <button type="button" onClick={() => setFormParticipaFidelidade(!formParticipaFidelidade)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${formParticipaFidelidade ? "border-emerald-400 bg-emerald-50" : "border-slate-200"}`}>
                  <Gift className={`w-5 h-5 ${formParticipaFidelidade ? "text-emerald-500" : "text-slate-400"}`} />
                  <span className="flex-1 text-left text-sm font-medium text-slate-700">Programa Fidelidade</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formParticipaFidelidade ? "border-emerald-400 bg-emerald-400" : "border-slate-300"}`}>
                    {formParticipaFidelidade && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              )}
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
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">{editando ? "Editar" : "Novo"} Cliente</h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                  <input type="text" value={formNome} onChange={(e) => setFormNome(e.target.value)} required placeholder="João da Silva"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                  <input type="tel" value={formTelefone} onChange={(e) => setFormTelefone(e.target.value)} required placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm" />
                </div>
                <button type="button" onClick={() => setFormPlanoMensal(!formPlanoMensal)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 ${formPlanoMensal ? "border-amber-400 bg-amber-50" : "border-slate-200"}`}>
                  <Crown className={`w-5 h-5 ${formPlanoMensal ? "text-amber-500" : "text-slate-400"}`} />
                  <span className="flex-1 text-left font-medium text-sm">Mensalista</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formPlanoMensal ? "border-amber-400 bg-amber-400" : "border-slate-300"}`}>
                    {formPlanoMensal && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
                {fidelidadeConfig.ativa && (
                  <button type="button" onClick={() => setFormParticipaFidelidade(!formParticipaFidelidade)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 ${formParticipaFidelidade ? "border-emerald-400 bg-emerald-50" : "border-slate-200"}`}>
                    <Gift className={`w-5 h-5 ${formParticipaFidelidade ? "text-emerald-500" : "text-slate-400"}`} />
                    <span className="flex-1 text-left font-medium text-sm">Programa Fidelidade</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formParticipaFidelidade ? "border-emerald-400 bg-emerald-400" : "border-slate-300"}`}>
                      {formParticipaFidelidade && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                )}
              </form>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-100">
                  Cancelar
                </button>
                <button onClick={() => { const f = document.querySelector('form') as HTMLFormElement; f?.requestSubmit(); }} disabled={salvando}
                  className="px-5 py-2 bg-slate-800 text-white font-medium text-sm rounded-lg disabled:opacity-50 flex items-center gap-2">
                  {salvando && <Loader2 className="w-4 h-4 animate-spin" />} Salvar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== MODAL WHATSAPP MARKETING ==================== */}
      {showWhatsAppModal && clienteWhatsApp && (
        <>
          {/* Mobile - Bottom Sheet */}
          <div className="fixed inset-0 z-[100] lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowWhatsAppModal(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] flex flex-col">
              <div className="flex justify-center pt-2 pb-1"><div className="w-10 h-1 bg-slate-300 rounded-full" /></div>
              <div className="px-4 pb-3 border-b border-slate-100">
                <p className="font-bold text-slate-800">WhatsApp Marketing</p>
                <p className="text-sm text-slate-500">{clienteWhatsApp.nome}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {getMensagensMarketing(clienteWhatsApp).map((msg) => {
                  const MsgIcon = msg.icone;
                  return (
                    <button key={msg.tipo} onClick={() => enviarWhatsApp(clienteWhatsApp.telefone, msg.mensagem)}
                      className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-left active:bg-slate-100">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${msg.cor}`}><MsgIcon className="w-4 h-4" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{msg.titulo}</p>
                        <p className="text-xs text-slate-500 truncate">{msg.mensagem.substring(0, 40)}...</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  );
                })}
              </div>
              <div className="p-3 border-t border-slate-100" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
                <button onClick={() => { window.open(`https://wa.me/55${clienteWhatsApp.telefone.replace(/\D/g, "")}`, "_blank"); setShowWhatsAppModal(false); }}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-sm">
                  <MessageCircle className="w-4 h-4" /> Conversa em branco
                </button>
              </div>
            </div>
          </div>

          {/* Desktop - Compact */}
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 text-sm">WhatsApp Marketing</p>
                  <p className="text-xs text-slate-500">{clienteWhatsApp.nome}</p>
                </div>
                <button onClick={() => setShowWhatsAppModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 space-y-1">
                {getMensagensMarketing(clienteWhatsApp).map((msg) => {
                  const MsgIcon = msg.icone;
                  return (
                    <button key={msg.tipo} onClick={() => enviarWhatsApp(clienteWhatsApp.telefone, msg.mensagem)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-slate-50">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${msg.cor}`}><MsgIcon className="w-4 h-4" /></div>
                      <span className="font-medium text-slate-800 text-sm">{msg.titulo}</span>
                    </button>
                  );
                })}
              </div>
              <div className="p-2 border-t border-slate-100">
                <button onClick={() => { window.open(`https://wa.me/55${clienteWhatsApp.telefone.replace(/\D/g, "")}`, "_blank"); setShowWhatsAppModal(false); }}
                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Conversa em branco
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
