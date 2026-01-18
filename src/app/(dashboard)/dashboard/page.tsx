"use client";

import { useEffect, useState } from "react";
import {
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Droplets,
  Clock,
  Calendar,
  Bell,
  Wrench,
  ChevronRight,
  Columns3,
  Sparkles,
  ArrowUpRight,
  UsersRound,
  MessageCircle,
  Send,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { StatCard, Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OrdemServico {
  id: string;
  codigo: number;
  status: string;
  dataEntrada: string;
  total: number;
  cliente: {
    id: string;
    nome: string;
    telefone: string | null;
  };
  veiculo: {
    id: string;
    placa: string;
    modelo: string;
    cor: string | null;
  };
  itens: {
    id: string;
    preco: number;
    servico: {
      id: string;
      nome: string;
    };
  }[];
}

interface DashboardData {
  ordensPorStatus: Record<string, number>;
  osHoje: number;
  osEmAndamento: number;
  faturamentoHoje: number;
  faturamentoMes: number;
  totalClientes: number;
  clientesNovosMes: number;
  produtosEstoqueBaixo: {
    id: string;
    nome: string;
    quantidade: number;
    pontoReposicao: number;
    unidade: string;
  }[];
  servicosMaisVendidos: {
    servicoId: string;
    nome: string;
    _count: number;
  }[];
  agendamentosPendentes: number;
  agendamentosHoje: number;
  ultimasOS: OrdemServico[];
}

interface Usuario {
  nome: string;
  role: string;
  lavaJato: {
    nome: string;
  };
}

// Quick Actions para mobile
const quickActions = [
  { 
    href: "/nova-os", 
    label: "Nova OS", 
    icon: Wrench, 
    color: "from-cyan-500 to-blue-600",
    description: "Criar ordem"
  },
  { 
    href: "/kanban", 
    label: "Pátio", 
    icon: Columns3, 
    color: "from-amber-500 to-orange-600",
    description: "Ver fila"
  },
  { 
    href: "/clientes", 
    label: "Clientes", 
    icon: Users, 
    color: "from-emerald-500 to-teal-600",
    description: "Cadastros"
  },
  { 
    href: "/equipe", 
    label: "Equipe", 
    icon: UsersRound, 
    color: "from-purple-500 to-indigo-600",
    description: "Gerenciar"
  },
];

// Status config
const statusConfig = [
  { key: "AGUARDANDO", label: "Aguardando", emoji: "🚗", color: "bg-amber-500", bgLight: "bg-amber-50", border: "border-amber-200" },
  { key: "LAVANDO", label: "Lavando", emoji: "🧽", color: "bg-cyan-500", bgLight: "bg-cyan-50", border: "border-cyan-200" },
  { key: "FINALIZANDO", label: "Finalizando", emoji: "✨", color: "bg-blue-500", bgLight: "bg-blue-50", border: "border-blue-200" },
  { key: "PRONTO", label: "Pronto", emoji: "✅", color: "bg-emerald-500", bgLight: "bg-emerald-50", border: "border-emerald-200" },
];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
    fetchUsuario();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsuario() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const json = await res.json();
        setUsuario(json);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatCurrencyCompact = (value: number) => {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1)}k`;
    }
    return formatCurrency(value);
  };

  const chartData = data?.servicosMaisVendidos?.map((s) => ({
    name: s.nome.length > 15 ? s.nome.substring(0, 15) + "..." : s.nome,
    quantidade: s._count,
  })) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const totalEmPatio = statusConfig.reduce((acc, s) => acc + (data?.ordensPorStatus?.[s.key] || 0), 0);

  // Função para enviar OS via WhatsApp
  function enviarOSWhatsApp(ordem: OrdemServico) {
    if (!ordem.cliente.telefone) {
      alert("Cliente não tem telefone cadastrado!");
      return;
    }

    const servicos = ordem.itens.map(item => `• ${item.servico.nome}`).join("\n");
    const dataFormatada = format(new Date(ordem.dataEntrada), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    
    const mensagem = `
🚗 *ORDEM DE SERVIÇO #${ordem.codigo}*

📅 *Data:* ${dataFormatada}

👤 *Cliente:* ${ordem.cliente.nome}
🚘 *Veículo:* ${ordem.veiculo.modelo}
🔖 *Placa:* ${ordem.veiculo.placa}
${ordem.veiculo.cor ? `🎨 *Cor:* ${ordem.veiculo.cor}` : ""}

🧽 *Serviços:*
${servicos}

💰 *Total:* ${formatCurrency(ordem.total)}

✅ *Status:* ${ordem.status === "ENTREGUE" ? "Entregue" : ordem.status === "PRONTO" ? "Pronto para retirada" : "Em andamento"}

_${usuario?.lavaJato?.nome || "Lava Jato"}_
    `.trim();

    const telefone = ordem.cliente.telefone.replace(/\D/g, "");
    const url = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  }

  // Loading skeleton
  if (loading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="lg:hidden p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-slate-200 rounded-2xl" />
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 w-20 bg-slate-200 rounded-2xl flex-shrink-0" />
              ))}
            </div>
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="h-48 bg-slate-200 rounded-2xl" />
          </div>
        </div>

        {/* Desktop Loading */}
        <div className="hidden lg:block p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64" />
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden min-h-screen bg-slate-50">
        {/* Header com saudação */}
        <div className="bg-white border-b border-slate-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">{getGreeting()},</p>
              <h1 className="text-xl font-bold text-slate-800">
                {usuario?.nome?.split(" ")[0] || "Usuário"}! 👋
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase">
                {new Date().toLocaleDateString("pt-BR", { weekday: "short" })}
              </p>
              <p className="text-xl font-bold text-slate-800">
                {new Date().getDate()}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Resumo */}
        <div className="px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-800">{data?.osHoje || 0}</span>
                  <p className="text-xs text-slate-500">OS hoje</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-slate-800">
                    {formatCurrencyCompact(data?.faturamentoHoje || 0)}
                  </span>
                  <p className="text-xs text-slate-500">Faturado hoje</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4 pb-24">
          {/* Alertas Compactos */}
          {(data?.agendamentosPendentes ?? 0) > 0 && (
            <Link
              href="/agendamentos"
              className="flex items-center gap-3 bg-cyan-50 border border-cyan-200 rounded-xl p-3 animate-slide-in"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-cyan-800 text-sm">
                  {data?.agendamentosPendentes} agendamento{(data?.agendamentosPendentes ?? 0) > 1 ? 's' : ''} pendente{(data?.agendamentosPendentes ?? 0) > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-cyan-600">Toque para confirmar</p>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </Link>
          )}

          {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 && (
            <Link
              href="/estoque"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3 animate-slide-in"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-800 text-sm">
                  {data?.produtosEstoqueBaixo?.length} produto{(data?.produtosEstoqueBaixo?.length ?? 0) > 1 ? 's' : ''} com estoque baixo
                </p>
                <p className="text-xs text-red-600 truncate">
                  {data?.produtosEstoqueBaixo?.slice(0, 2).map(p => p.nome).join(", ")}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </Link>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-semibold text-slate-500 mb-3">ACESSO RÁPIDO</h2>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg mb-2 active:scale-95 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Status do Pátio - Visual */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Columns3 className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Pátio Agora</h3>
              </div>
              <Link 
                href="/kanban"
                className="text-sm text-cyan-600 font-medium flex items-center gap-1"
              >
                Ver fila
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {totalEmPatio > 0 ? (
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {statusConfig.map((status) => {
                    const count = data?.ordensPorStatus?.[status.key] || 0;
                    return (
                      <Link
                        key={status.key}
                        href="/kanban"
                        className={`${status.bgLight} ${status.border} border rounded-xl p-3 text-center active:scale-95 transition-transform`}
                      >
                        <span className="text-2xl">{status.emoji}</span>
                        <p className="text-2xl font-bold text-slate-800 mt-1">{count}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{status.label}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">Pátio vazio!</p>
                <p className="text-xs text-slate-400">Nenhum veículo no momento</p>
              </div>
            )}
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">Resumo do Mês</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Faturamento</p>
                    <p className="font-bold text-lg text-emerald-700">
                      {formatCurrency(data?.faturamentoMes || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Total Clientes</p>
                  <p className="text-xl font-bold text-slate-800">{data?.totalClientes || 0}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500">Novos este mês</p>
                  <p className="text-xl font-bold text-cyan-600">
                    {(data?.clientesNovosMes || 0) > 0 ? `+${data?.clientesNovosMes}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comprovante Automático - Mobile */}
          {data?.ultimasOS && data.ultimasOS.length > 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-1 shadow-xl shadow-green-500/20">
              {/* Background decorativo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '16px 16px'
                }} />
              </div>
              
              <div className="relative bg-white rounded-xl overflow-hidden">
                {/* Header com efeito */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Send className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">Comprovante Automático</h3>
                        <p className="text-green-100 text-xs">Envie a OS direto pro WhatsApp</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-white text-xs font-semibold">{data.ultimasOS.length} OS</span>
                    </div>
                  </div>
                </div>
                
                {/* Lista de OS */}
                <div className="divide-y divide-slate-100">
                  {data.ultimasOS.map((ordem, index) => (
                    <div key={ordem.id} className="p-4 hover:bg-slate-50 transition-colors">
                      {/* Mini comprovante visual */}
                      <div className="flex gap-4">
                        {/* Ícone lateral com linha pontilhada */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            ordem.status === "PRONTO" ? "bg-emerald-100" :
                            ordem.status === "ENTREGUE" ? "bg-slate-100" :
                            ordem.status === "LAVANDO" ? "bg-cyan-100" :
                            "bg-amber-100"
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              ordem.status === "PRONTO" ? "text-emerald-600" :
                              ordem.status === "ENTREGUE" ? "text-slate-500" :
                              ordem.status === "LAVANDO" ? "text-cyan-600" :
                              "text-amber-600"
                            }`} />
                          </div>
                          {index < data.ultimasOS.length - 1 && (
                            <div className="w-0.5 flex-1 bg-slate-200 mt-2 rounded-full" style={{backgroundImage: 'repeating-linear-gradient(to bottom, #e2e8f0 0px, #e2e8f0 4px, transparent 4px, transparent 8px)'}} />
                          )}
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-slate-900 text-white text-xs font-mono px-2 py-1 rounded-md">
                                  OS #{ordem.codigo}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {format(new Date(ordem.dataEntrada), "HH:mm")}
                                </span>
                              </div>
                              <p className="font-bold text-slate-800">{ordem.cliente.nome}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-emerald-600">{formatCurrency(ordem.total)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                            <Car className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{ordem.veiculo.placa}</span>
                            <span className="text-slate-400">•</span>
                            <span>{ordem.veiculo.modelo}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {ordem.itens.map((item, i) => (
                              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                {item.servico.nome}
                              </span>
                            ))}
                          </div>

                          {/* Botão WhatsApp destacado */}
                          {ordem.cliente.telefone ? (
                            <button
                              onClick={() => enviarOSWhatsApp(ordem)}
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl active:scale-[0.98] transition-all shadow-lg shadow-green-500/20"
                            >
                              <MessageCircle className="w-5 h-5" />
                              Enviar Comprovante via WhatsApp
                            </button>
                          ) : (
                            <div className="text-center py-2 text-xs text-slate-400 italic">
                              Cliente sem telefone cadastrado
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Serviços mais vendidos - Mobile */}
          {chartData && chartData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Top Serviços</h3>
              </div>

              <div className="space-y-3">
                {data?.servicosMaisVendidos?.slice(0, 5).map((servico, index) => (
                  <div key={servico.servicoId} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-slate-200 text-slate-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {index + 1}º
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{servico.nome}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800">{servico._count}</span>
                      <span className="text-xs text-slate-400 ml-1">vendas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-5 min-h-screen bg-slate-100">
        <div className="max-w-[1400px] mx-auto space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Droplets className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  {usuario?.lavaJato?.nome || "Lava Jato"}
                </h1>
                <p className="text-slate-500 text-sm">
                  {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(data?.agendamentosPendentes ?? 0) > 0 && (
                <Link href="/agendamentos" className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 hover:bg-blue-100 transition-all">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-bold text-sm">{data?.agendamentosPendentes}</span>
                </Link>
              )}
              {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 && (
                <Link href="/estoque" className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 hover:bg-red-100 transition-all">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700 font-bold text-sm">{data?.produtosEstoqueBaixo?.length}</span>
                </Link>
              )}
              <Link 
                href="/nova-os"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/20"
              >
                <Wrench className="w-4 h-4" />
                Nova OS
              </Link>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-12 gap-4">
            
            {/* Coluna Esquerda */}
            <div className="col-span-8 space-y-4">
              
              {/* Métricas */}
              <div className="grid grid-cols-4 gap-3">
                {/* OS Hoje */}
                <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-4 group hover:shadow-md hover:border-cyan-300 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-100 to-transparent rounded-full blur-2xl opacity-60" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 flex items-center justify-center">
                      <Car className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-800">{data?.osHoje || 0}</p>
                      <p className="text-xs text-cyan-600 font-semibold uppercase tracking-wide">OS Hoje</p>
                    </div>
                  </div>
                </div>

                {/* No Pátio */}
                <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-4 group hover:shadow-md hover:border-amber-300 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100 to-transparent rounded-full blur-2xl opacity-60" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center">
                      <Columns3 className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-slate-800">{data?.osEmAndamento || 0}</p>
                      <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">No Pátio</p>
                    </div>
                  </div>
                </div>

                {/* Faturamento Hoje */}
                <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm p-4 group hover:shadow-md hover:border-emerald-300 transition-all">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-transparent rounded-full blur-2xl opacity-60" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{formatCurrencyCompact(data?.faturamentoHoje || 0)}</p>
                      <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Hoje</p>
                    </div>
                  </div>
                </div>

                {/* Faturamento Mês */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{formatCurrencyCompact(data?.faturamentoMes || 0)}</p>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Este Mês</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status do Pátio */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Columns3 className="w-4 h-4 text-slate-600" />
                    </div>
                    Fila do Pátio
                  </h3>
                  <Link href="/kanban" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold flex items-center gap-1.5 group">
                    Ver Kanban
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { key: "AGUARDANDO", label: "Aguardando", emoji: "🚗", bg: "bg-gradient-to-br from-amber-50 to-orange-50", border: "border-amber-200", text: "text-amber-700" },
                    { key: "LAVANDO", label: "Lavando", emoji: "🧽", bg: "bg-gradient-to-br from-cyan-50 to-blue-50", border: "border-cyan-200", text: "text-cyan-700" },
                    { key: "FINALIZANDO", label: "Finalizando", emoji: "✨", bg: "bg-gradient-to-br from-blue-50 to-indigo-50", border: "border-blue-200", text: "text-blue-700" },
                    { key: "PRONTO", label: "Pronto", emoji: "✅", bg: "bg-gradient-to-br from-emerald-50 to-teal-50", border: "border-emerald-200", text: "text-emerald-700" },
                  ].map((status) => {
                    const count = data?.ordensPorStatus?.[status.key] || 0;
                    return (
                      <div
                        key={status.key}
                        className={`relative overflow-hidden rounded-xl ${status.bg} border-2 ${status.border} p-4 text-center hover:shadow-md transition-all`}
                      >
                        <span className="text-3xl mb-2 block">{status.emoji}</span>
                        <p className="text-4xl font-bold text-slate-800">{count}</p>
                        <p className={`text-xs font-semibold ${status.text} mt-1 uppercase tracking-wide`}>{status.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gráfico */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-slate-600" />
                  </div>
                  Serviços Mais Vendidos
                </h3>
                {chartData && chartData.length > 0 ? (
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 11, fill: '#475569' }} 
                          axisLine={false} 
                          tickLine={false}
                          width={120}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b', 
                            border: 'none', 
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '12px'
                          }}
                          formatter={(value) => [`${value} vendas`, '']}
                        />
                        <Bar 
                          dataKey="quantidade" 
                          fill="url(#barGradient)" 
                          radius={[0, 8, 8, 0]}
                          barSize={28}
                        />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center text-slate-400">
                    <Droplets className="w-10 h-10 mb-2 text-slate-300" />
                    <p className="text-sm">Nenhum serviço registrado ainda</p>
                  </div>
                )}
              </div>

              {/* Comprovante Automático - Desktop */}
              {data?.ultimasOS && data.ultimasOS.length > 0 && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 p-1 shadow-xl shadow-green-500/20">
                  {/* Background decorativo */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  <div className="relative bg-white rounded-xl overflow-hidden">
                    {/* Header impressionante */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <Send className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-2xl">Comprovante Automático</h3>
                            <p className="text-green-100 text-sm flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              Envie a OS direto pro WhatsApp do cliente
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          <span className="text-white font-bold">{data.ultimasOS.length} OS hoje</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Grid de comprovantes */}
                    <div className="p-5 grid grid-cols-1 gap-4">
                      {data.ultimasOS.map((ordem) => (
                        <div 
                          key={ordem.id} 
                          className="relative group bg-gradient-to-r from-slate-50 to-white rounded-xl border-2 border-slate-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5 transition-all overflow-hidden"
                        >
                          {/* Linha decorativa lateral */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            ordem.status === "PRONTO" ? "bg-gradient-to-b from-emerald-400 to-emerald-600" :
                            ordem.status === "ENTREGUE" ? "bg-gradient-to-b from-slate-400 to-slate-500" :
                            ordem.status === "LAVANDO" ? "bg-gradient-to-b from-cyan-400 to-cyan-600" :
                            "bg-gradient-to-b from-amber-400 to-amber-600"
                          }`} />
                          
                          <div className="pl-5 pr-4 py-4 flex items-center gap-6">
                            {/* Código da OS estilizado */}
                            <div className="flex-shrink-0 text-center">
                              <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Ordem</p>
                                <p className="text-xl font-mono font-bold">#{ordem.codigo}</p>
                              </div>
                            </div>

                            {/* Informações principais */}
                            <div className="flex-1 min-w-0 grid grid-cols-3 gap-6">
                              {/* Cliente */}
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Cliente</p>
                                <p className="font-bold text-slate-800 truncate">{ordem.cliente.nome}</p>
                                <p className="text-xs text-slate-500">{ordem.cliente.telefone || "Sem telefone"}</p>
                              </div>

                              {/* Veículo */}
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Veículo</p>
                                <p className="font-bold text-slate-800">{ordem.veiculo.placa}</p>
                                <p className="text-xs text-slate-500 truncate">{ordem.veiculo.modelo}</p>
                              </div>

                              {/* Serviços */}
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Serviços</p>
                                <div className="flex flex-wrap gap-1">
                                  {ordem.itens.slice(0, 2).map((item, i) => (
                                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                      {item.servico.nome}
                                    </span>
                                  ))}
                                  {ordem.itens.length > 2 && (
                                    <span className="text-xs text-slate-400">+{ordem.itens.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status */}
                            <div className="flex-shrink-0 text-center">
                              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                                ordem.status === "PRONTO" ? "bg-emerald-100 text-emerald-700" :
                                ordem.status === "ENTREGUE" ? "bg-slate-100 text-slate-600" :
                                ordem.status === "LAVANDO" ? "bg-cyan-100 text-cyan-700" :
                                "bg-amber-100 text-amber-700"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  ordem.status === "PRONTO" ? "bg-emerald-500" :
                                  ordem.status === "ENTREGUE" ? "bg-slate-400" :
                                  ordem.status === "LAVANDO" ? "bg-cyan-500" :
                                  "bg-amber-500"
                                }`} />
                                {ordem.status === "AGUARDANDO" ? "Aguardando" :
                                 ordem.status === "LAVANDO" ? "Lavando" :
                                 ordem.status === "FINALIZANDO" ? "Finalizando" :
                                 ordem.status === "PRONTO" ? "Pronto" : "Entregue"}
                              </span>
                              <p className="text-xs text-slate-400 mt-1">
                                {format(new Date(ordem.dataEntrada), "HH:mm")}
                              </p>
                            </div>

                            {/* Valor */}
                            <div className="flex-shrink-0 text-right min-w-[100px]">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total</p>
                              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(ordem.total)}</p>
                            </div>

                            {/* Botão WhatsApp */}
                            <div className="flex-shrink-0">
                              {ordem.cliente.telefone ? (
                                <button
                                  onClick={() => enviarOSWhatsApp(ordem)}
                                  className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                  <MessageCircle className="w-5 h-5" />
                                  <span>Enviar</span>
                                </button>
                              ) : (
                                <div className="px-5 py-3 bg-slate-100 rounded-xl text-slate-400 text-sm italic">
                                  Sem telefone
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coluna Direita */}
            <div className="col-span-4 space-y-4">
              
              {/* Card Faturamento */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90 font-semibold text-sm uppercase tracking-wide">Faturamento do Mês</span>
                  </div>
                  <p className="text-4xl font-bold mb-2">{formatCurrency(data?.faturamentoMes || 0)}</p>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    Média: {formatCurrency((data?.faturamentoMes || 0) / new Date().getDate())}/dia
                  </div>
                </div>
              </div>

              {/* Clientes */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-slate-600" />
                    </div>
                    Clientes
                  </h3>
                  <Link href="/clientes" className="text-xs text-cyan-600 hover:text-cyan-700 font-semibold">
                    Ver todos →
                  </Link>
                </div>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold text-slate-800">{data?.totalClientes || 0}</p>
                  {data?.clientesNovosMes && data.clientesNovosMes > 0 && (
                    <span className="text-sm text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      +{data.clientesNovosMes}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm mt-2">cadastrados no sistema</p>
              </div>

              {/* Distribuição */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-4">Distribuição</h3>
                <div className="space-y-3">
                  {[
                    { key: "AGUARDANDO", label: "Aguardando", color: "from-amber-400 to-orange-500", dot: "bg-amber-500" },
                    { key: "LAVANDO", label: "Lavando", color: "from-cyan-400 to-blue-500", dot: "bg-cyan-500" },
                    { key: "FINALIZANDO", label: "Finalizando", color: "from-blue-400 to-indigo-500", dot: "bg-blue-500" },
                    { key: "PRONTO", label: "Pronto", color: "from-emerald-400 to-teal-500", dot: "bg-emerald-500" },
                  ].map((status) => {
                    const count = data?.ordensPorStatus?.[status.key] || 0;
                    const total = statusConfig.reduce((acc, s) => acc + (data?.ordensPorStatus?.[s.key] || 0), 0);
                    const percent = total > 0 ? (count / total) * 100 : 0;

                    return (
                      <div key={status.key} className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
                        <span className="text-xs text-slate-600 w-20 font-medium">{status.label}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${status.color} rounded-full transition-all`} 
                            style={{ width: `${percent}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estoque Status */}
              <div className={`relative overflow-hidden rounded-2xl border-2 p-5 ${
                (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                  ? 'bg-red-50 border-red-200' 
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl ${
                  (data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'bg-red-200' : 'bg-emerald-200'
                }`} />
                <div className="relative flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    (data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                      ? 'bg-red-100 border border-red-200' 
                      : 'bg-emerald-100 border border-emerald-200'
                  }`}>
                    <Package className={`w-6 h-6 ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'text-red-600' : 'text-emerald-600'
                    }`} />
                  </div>
                  <div>
                    <p className={`font-bold ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'text-red-700' : 'text-emerald-700'
                    }`}>
                      {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 
                        ? `${data?.produtosEstoqueBaixo?.length} produto(s) baixo`
                        : 'Estoque OK'
                      }
                    </p>
                    <p className={`text-xs ${
                      (data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {(data?.produtosEstoqueBaixo?.length ?? 0) > 0 ? 'Precisa repor' : 'Tudo abastecido'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/kanban", label: "Pátio", icon: Columns3, hover: "hover:border-amber-300 hover:bg-amber-50" },
                  { href: "/clientes", label: "Clientes", icon: Users, hover: "hover:border-blue-300 hover:bg-blue-50" },
                  { href: "/servicos", label: "Serviços", icon: Droplets, hover: "hover:border-cyan-300 hover:bg-cyan-50" },
                  { href: "/agendamentos", label: "Agenda", icon: Calendar, hover: "hover:border-purple-300 hover:bg-purple-50" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-3 transition-all shadow-sm ${item.hover}`}
                  >
                    <item.icon className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                  </Link>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
