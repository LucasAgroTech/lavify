"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Phone, 
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
  Calendar,
  TrendingUp,
  AlertTriangle,
  Gift,
  Stamp,
  Send,
  Sparkles,
  Filter,
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
  createdAt: string;
  veiculos: { id: string; placa: string; modelo: string; cor?: string }[];
  _count: { ordens: number };
  totalGasto: number;
  ultimaLavagem: UltimaLavagem | null;
  diasSemVir: number | null;
  carimbos: number;
  lavágensPremio: number;
  status: "novo" | "ativo" | "regular" | "inativo" | "sumido";
}

type FiltroStatus = "todos" | "ativo" | "regular" | "inativo" | "sumido" | "mensal";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [clienteWhatsApp, setClienteWhatsApp] = useState<Cliente | null>(null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroStatus>("todos");
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [clienteExpandido, setClienteExpandido] = useState<string | null>(null);

  // Form states
  const [formNome, setFormNome] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formPlanoMensal, setFormPlanoMensal] = useState(false);

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

  function abrirModalCriar() {
    setEditando(null);
    setFormNome("");
    setFormTelefone("");
    setFormPlanoMensal(false);
    setShowModal(true);
  }

  function abrirModalEditar(cliente: Cliente) {
    setEditando(cliente);
    setFormNome(cliente.nome);
    setFormTelefone(cliente.telefone);
    setFormPlanoMensal(cliente.planoMensal);
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

  function getMensagensMarketing(cliente: Cliente) {
    const primeiroNome = cliente.nome.split(" ")[0];
    
    return [
      {
        tipo: "saudade",
        icone: Ghost,
        titulo: "Sentimos sua falta!",
        cor: "text-violet-600 bg-violet-50",
        mensagem: `Olá ${primeiroNome}! 👋\n\nSentimos sua falta por aqui! Faz um tempinho que seu carro não vem nos visitar.\n\n🚗 Que tal agendar uma lavagem? Seu carro merece brilhar!\n\nResponda essa mensagem para agendar. 😊`,
      },
      {
        tipo: "fidelidade",
        icone: Gift,
        titulo: "Cartão Fidelidade",
        cor: "text-amber-600 bg-amber-50",
        mensagem: `Olá ${primeiroNome}! 🎉\n\nVocê já tem ${cliente.carimbos} carimbo${cliente.carimbos !== 1 ? 's' : ''} no seu cartão fidelidade!\n\n🎁 Complete 10 e ganhe uma LAVAGEM GRÁTIS!\n\nVem lavar o carro e garantir mais um carimbo! 🚗✨`,
      },
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
        return { label: "Inativo", cor: "bg-orange-100 text-orange-700", icone: AlertTriangle };
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
    // Filtro de busca
    const matchBusca = 
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.includes(busca) ||
      c.veiculos.some(v => v.placa.toLowerCase().includes(busca.toLowerCase()));

    // Filtro de status
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

  return (
    <div className="pb-24 lg:pb-0">
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden min-h-screen bg-slate-50">
        {/* Header */}
        <div className="sticky top-14 z-20 bg-white border-b border-slate-100 shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-slate-800">Clientes</h1>
                <p className="text-sm text-slate-500">{clientes.length} cadastrados</p>
              </div>
              <button
                onClick={abrirModalCriar}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/30 active:scale-95 transition-transform"
              >
                <Plus className="w-5 h-5" />
                <span>Novo</span>
              </button>
            </div>

            {/* Busca */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                inputMode="search"
                placeholder="Nome, telefone ou placa..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {busca && (
                <button
                  onClick={() => setBusca("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-300 rounded-full"
                >
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
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filtro === f.key
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="p-4 space-y-3">
          {clientesFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-semibold text-lg">
                {busca ? "Nenhum cliente encontrado" : "Nenhum cliente"}
              </h3>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                {busca ? "Tente outro termo de busca" : "Cadastre seu primeiro cliente"}
              </p>
              {!busca && (
                <button
                  onClick={abrirModalCriar}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 text-white font-medium rounded-xl active:scale-95 transition-transform"
                >
                  <Plus className="w-5 h-5" />
                  Cadastrar Cliente
                </button>
              )}
            </div>
          ) : (
            clientesFiltrados.map((cliente) => {
              const isExpanded = clienteExpandido === cliente.id;
              const statusConfig = getStatusConfig(cliente.status);
              const StatusIcon = statusConfig.icone;
              
              return (
                <div
                  key={cliente.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setClienteExpandido(isExpanded ? null : cliente.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {cliente.nome}
                          </h3>
                          {cliente.planoMensal && (
                            <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusConfig.cor}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">{cliente.telefone}</p>
                        
                        {/* Última lavagem */}
                        {cliente.ultimaLavagem ? (
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(cliente.ultimaLavagem.data), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        ) : (
                          <p className="text-xs text-slate-400 mt-1">Ainda não lavou</p>
                        )}
                      </div>

                      {/* Carimbos Visual */}
                      <div className="flex-shrink-0 text-center">
                        <div className="flex gap-0.5 mb-1">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < cliente.carimbos ? "bg-amber-500" : "bg-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-400">{cliente.carimbos}/10</p>
                      </div>

                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Card Expandido */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 animate-slide-in">
                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-2 py-4">
                        <div className="text-center p-2 bg-cyan-50 rounded-xl">
                          <span className="font-bold text-cyan-600">{cliente._count.ordens}</span>
                          <p className="text-[10px] text-cyan-700">Lavagens</p>
                        </div>
                        <div className="text-center p-2 bg-emerald-50 rounded-xl">
                          <span className="font-bold text-emerald-600 text-sm">{formatCurrency(cliente.totalGasto).replace('R$', '')}</span>
                          <p className="text-[10px] text-emerald-700">Total</p>
                        </div>
                        <div className="text-center p-2 bg-amber-50 rounded-xl">
                          <span className="font-bold text-amber-600">{cliente.carimbos}</span>
                          <p className="text-[10px] text-amber-700">Carimbos</p>
                        </div>
                        <div className="text-center p-2 bg-violet-50 rounded-xl">
                          <span className="font-bold text-violet-600">{cliente.lavágensPremio}</span>
                          <p className="text-[10px] text-violet-700">Prêmios</p>
                        </div>
                      </div>

                      {/* Cartão de Fidelidade Visual */}
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-white">
                            <Stamp className="w-5 h-5" />
                            <span className="font-bold text-sm">Cartão Fidelidade</span>
                          </div>
                          {cliente.carimbos >= 9 && (
                            <span className="px-2 py-1 bg-white/20 rounded-full text-[10px] text-white font-bold">
                              QUASE LÁ! 🎉
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1.5 justify-center">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                i < cliente.carimbos 
                                  ? "bg-white" 
                                  : "bg-white/20 border border-white/30"
                              }`}
                            >
                              {i < cliente.carimbos && (
                                <Check className="w-4 h-4 text-amber-600" />
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-white/80 text-[11px] text-center mt-2">
                          {10 - cliente.carimbos} lavagen{10 - cliente.carimbos !== 1 ? 's' : ''} para ganhar 1 GRÁTIS!
                        </p>
                      </div>

                      {/* Veículos */}
                      {cliente.veiculos.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-2">Veículos:</p>
                          <div className="flex flex-wrap gap-2">
                            {cliente.veiculos.map((v) => (
                              <span
                                key={v.id}
                                className="inline-flex items-center gap-1.5 text-sm bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg"
                              >
                                <span className="font-mono font-bold">{v.placa}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">{v.modelo}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ações */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirWhatsAppModal(cliente)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium active:scale-95 transition-transform"
                        >
                          <Send className="w-5 h-5" />
                          Marketing
                        </button>
                        <button
                          onClick={() => abrirModalEditar(cliente)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium active:scale-95 transition-transform"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
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
              <Plus className="w-4 h-4" />
              Novo Cliente
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{stats.ativos}</p>
                  <p className="text-sm text-slate-500">Ativos</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.inativos}</p>
                  <p className="text-sm text-slate-500">Inativos (+30d)</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.sumidos}</p>
                  <p className="text-sm text-slate-500">Sumidos (+60d)</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Ghost className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-600">{stats.mensalistas}</p>
                  <p className="text-sm text-slate-500">Mensalistas</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Tabela */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Barra de busca e filtros */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone ou placa..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filtro === f.key
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabela */}
            {clientesFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-700 font-medium">Nenhum cliente encontrado</h3>
                <p className="text-slate-500 text-sm mt-1">
                  {busca ? "Tente outro termo de busca" : "Cadastre seu primeiro cliente"}
                </p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Cliente</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Última Lavagem</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Fidelidade</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Lavagens</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Gasto</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientesFiltrados.map((cliente) => {
                    const statusConfig = getStatusConfig(cliente.status);
                    
                    return (
                      <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                        {/* Cliente */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white font-semibold text-sm">
                              {cliente.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800">{cliente.nome}</span>
                                {cliente.planoMensal && (
                                  <Crown className="w-4 h-4 text-amber-500" />
                                )}
                              </div>
                              <p className="text-sm text-slate-500">{cliente.telefone}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.cor}`}>
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Última Lavagem */}
                        <td className="py-3 px-4">
                          {cliente.ultimaLavagem ? (
                            <div>
                              <p className="text-sm text-slate-700">
                                {formatDistanceToNow(new Date(cliente.ultimaLavagem.data), { 
                                  addSuffix: true, 
                                  locale: ptBR 
                                })}
                              </p>
                              <p className="text-xs text-slate-400">{cliente.ultimaLavagem.servico}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">Nunca</span>
                          )}
                        </td>

                        {/* Fidelidade */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <div className="flex gap-0.5">
                              {[...Array(10)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < cliente.carimbos ? "bg-amber-500" : "bg-slate-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500 ml-1">{cliente.carimbos}/10</span>
                          </div>
                        </td>

                        {/* Lavagens */}
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-slate-800">{cliente._count.ordens}</span>
                        </td>

                        {/* Total Gasto */}
                        <td className="py-3 px-4 text-right">
                          <span className="font-semibold text-emerald-600">{formatCurrency(cliente.totalGasto)}</span>
                        </td>

                        {/* Ações */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => abrirWhatsAppModal(cliente)}
                              className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="WhatsApp Marketing"
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

            {/* Footer */}
            {clientesFiltrados.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 text-sm text-slate-500">
                Mostrando {clientesFiltrados.length} de {clientes.length} clientes
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
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg font-bold text-slate-800">
                {editando ? "Editar Cliente" : "Novo Cliente"}
              </h2>
            </div>

            <form id="mobile-cliente-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nome completo</label>
                <input
                  type="text"
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="João da Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Telefone (WhatsApp)</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={formTelefone}
                  onChange={(e) => setFormTelefone(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-100 border-0 rounded-xl text-base text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setFormPlanoMensal(!formPlanoMensal)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    formPlanoMensal ? "border-amber-500 bg-amber-50" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    formPlanoMensal ? "bg-amber-500" : "bg-slate-100"
                  }`}>
                    <Crown className={`w-6 h-6 ${formPlanoMensal ? "text-white" : "text-slate-400"}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-slate-800">Plano Mensal</p>
                    <p className="text-sm text-slate-500">Cliente com assinatura mensal</p>
                  </div>
                  {formPlanoMensal && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4 flex gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="mobile-cliente-form"
                disabled={salvando}
                className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                {salvando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {editando ? "Salvar" : "Cadastrar"}
              </button>
            </div>
          </div>

          {/* Desktop Modal */}
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                  {editando ? "Editar Cliente" : "Novo Cliente"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo</label>
                  <input
                    type="text"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    required
                    placeholder="João da Silva"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone (WhatsApp)</label>
                  <input
                    type="tel"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    required
                    placeholder="(11) 99999-9999"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setFormPlanoMensal(!formPlanoMensal)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    formPlanoMensal ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Crown className={`w-5 h-5 ${formPlanoMensal ? "text-amber-500" : "text-slate-400"}`} />
                  <span className="flex-1 text-left font-medium text-sm text-slate-700">Plano Mensal</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formPlanoMensal ? "border-amber-400 bg-amber-400" : "border-slate-300"
                  }`}>
                    {formPlanoMensal && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              </form>

              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium text-sm rounded-lg hover:bg-slate-100 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const form = document.querySelector('form') as HTMLFormElement;
                    if (form) form.requestSubmit();
                  }}
                  disabled={salvando}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {salvando && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editando ? "Salvar" : "Cadastrar"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== MODAL WHATSAPP MARKETING ==================== */}
      {showWhatsAppModal && clienteWhatsApp && (
        <>
          {/* Mobile */}
          <div className="fixed inset-0 z-[100] lg:hidden bg-white flex flex-col">
            <div className="flex-shrink-0 bg-white border-b border-slate-100 p-4 flex items-center gap-4">
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-800">WhatsApp Marketing</h2>
                <p className="text-sm text-slate-500">{clienteWhatsApp.nome}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-sm text-slate-600 mb-4">
                Escolha uma mensagem para enviar:
              </p>
              
              {getMensagensMarketing(clienteWhatsApp).map((msg) => {
                const MsgIcon = msg.icone;
                return (
                  <button
                    key={msg.tipo}
                    onClick={() => enviarWhatsApp(clienteWhatsApp.telefone, msg.mensagem)}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-left active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${msg.cor}`}>
                        <MsgIcon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-800">{msg.titulo}</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">{msg.mensagem.substring(0, 100)}...</p>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  const phone = clienteWhatsApp.telefone.replace(/\D/g, "");
                  window.open(`https://wa.me/55${phone}`, "_blank");
                  setShowWhatsAppModal(false);
                }}
                className="w-full p-4 bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <MessageCircle className="w-5 h-5" />
                Abrir conversa em branco
              </button>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">WhatsApp Marketing</h2>
                  <p className="text-sm text-slate-500">Enviar mensagem para {clienteWhatsApp.nome}</p>
                </div>
                <button onClick={() => setShowWhatsAppModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                {getMensagensMarketing(clienteWhatsApp).map((msg) => {
                  const MsgIcon = msg.icone;
                  return (
                    <button
                      key={msg.tipo}
                      onClick={() => enviarWhatsApp(clienteWhatsApp.telefone, msg.mensagem)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-left hover:bg-slate-100 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${msg.cor}`}>
                          <MsgIcon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800">{msg.titulo}</span>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2">{msg.mensagem.substring(0, 100)}...</p>
                    </button>
                  );
                })}
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={() => {
                    const phone = clienteWhatsApp.telefone.replace(/\D/g, "");
                    window.open(`https://wa.me/55${phone}`, "_blank");
                    setShowWhatsAppModal(false);
                  }}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Abrir conversa em branco
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
