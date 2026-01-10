"use client";

import { useEffect, useState, DragEvent, useRef, TouchEvent } from "react";
import { 
  Car, 
  Clock, 
  User, 
  Phone, 
  RefreshCw, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { StatusBadge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type StatusOS =
  | "AGUARDANDO"
  | "LAVANDO"
  | "FINALIZANDO"
  | "PRONTO"
  | "ENTREGUE";

interface OrdemServico {
  id: string;
  codigo: number;
  status: StatusOS;
  dataEntrada: string;
  previsaoSaida: string | null;
  total: number;
  cliente: {
    id: string;
    nome: string;
    telefone: string;
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

const colunas: { status: StatusOS; titulo: string; tituloMobile: string; emoji: string; borderColor: string; bgColor: string; headerBg: string; dotColor: string }[] = [
  { status: "AGUARDANDO", titulo: "🚗 Aguardando", tituloMobile: "Aguardando", emoji: "🚗", borderColor: "border-amber-300", bgColor: "bg-amber-50", headerBg: "bg-amber-100", dotColor: "bg-amber-400" },
  { status: "LAVANDO", titulo: "🧽 Lavando", tituloMobile: "Lavando", emoji: "🧽", borderColor: "border-cyan-300", bgColor: "bg-cyan-50", headerBg: "bg-cyan-100", dotColor: "bg-cyan-400" },
  { status: "FINALIZANDO", titulo: "✨ Finalizando", tituloMobile: "Finalizando", emoji: "✨", borderColor: "border-blue-300", bgColor: "bg-blue-50", headerBg: "bg-blue-100", dotColor: "bg-blue-400" },
  { status: "PRONTO", titulo: "✅ Pronto", tituloMobile: "Pronto", emoji: "✅", borderColor: "border-emerald-300", bgColor: "bg-emerald-50", headerBg: "bg-emerald-100", dotColor: "bg-emerald-400" },
];

// Mapeia o próximo status
const proximoStatus: Record<StatusOS, StatusOS | null> = {
  AGUARDANDO: "LAVANDO",
  LAVANDO: "FINALIZANDO",
  FINALIZANDO: "PRONTO",
  PRONTO: "ENTREGUE",
  ENTREGUE: null,
};

export default function KanbanPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<StatusOS | null>(null);
  const [activeTab, setActiveTab] = useState<StatusOS>("AGUARDANDO");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [updatingCard, setUpdatingCard] = useState<string | null>(null);
  
  // Touch swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    fetchOrdens();
  }, []);

  async function fetchOrdens() {
    setLoading(true);
    try {
      const res = await fetch("/api/ordens");
      const data = await res.json();
      const ordensArray = Array.isArray(data) ? data : [];
      setOrdens(ordensArray.filter((o: OrdemServico) => o.status !== "ENTREGUE"));
    } catch (error) {
      console.error("Erro ao buscar ordens:", error);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(id: string, novoStatus: StatusOS) {
    setUpdatingCard(id);
    try {
      const res = await fetch(`/api/ordens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) {
        const ordemAtualizada = await res.json();
        if (novoStatus === "ENTREGUE") {
          setOrdens((prev) => prev.filter((o) => o.id !== id));
        } else {
        setOrdens((prev) =>
          prev.map((o) => (o.id === id ? ordemAtualizada : o))
        );
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingCard(null);
    }
  }

  // Desktop drag handlers
  function handleDragStart(e: DragEvent, ordem: OrdemServico) {
    e.dataTransfer.setData("ordemId", ordem.id);
    setDragging(ordem.id);
  }

  function handleDragEnd() {
    setDragging(null);
    setDropTarget(null);
  }

  function handleDragOver(e: DragEvent, status: StatusOS) {
    e.preventDefault();
    setDropTarget(status);
  }

  function handleDragLeave() {
    setDropTarget(null);
  }

  function handleDrop(e: DragEvent, novoStatus: StatusOS) {
    e.preventDefault();
    const ordemId = e.dataTransfer.getData("ordemId");
    const ordem = ordens.find((o) => o.id === ordemId);

    if (ordem && ordem.status !== novoStatus) {
      setOrdens((prev) =>
        prev.map((o) => (o.id === ordemId ? { ...o, status: novoStatus } : o))
      );
      atualizarStatus(ordemId, novoStatus);
    }

    setDropTarget(null);
    setDragging(null);
  }

  // Mobile touch handlers
  function handleTouchStart(e: TouchEvent) {
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function handleTouchMove(e: TouchEvent) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      const currentIndex = colunas.findIndex((c) => c.status === activeTab);
      if (diff > 0 && currentIndex < colunas.length - 1) {
        // Swipe left -> próxima coluna
        setActiveTab(colunas[currentIndex + 1].status);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right -> coluna anterior
        setActiveTab(colunas[currentIndex - 1].status);
      }
    }
  }

  function handleMoveToNext(ordem: OrdemServico) {
    const proximo = proximoStatus[ordem.status];
    if (proximo) {
      setOrdens((prev) =>
        prev.map((o) => (o.id === ordem.id ? { ...o, status: proximo } : o))
      );
      atualizarStatus(ordem.id, proximo);
    }
  }

  function handleWhatsApp(telefone: string, nome: string, placa: string) {
    const message = encodeURIComponent(
      `Olá ${nome}! 🚗\n\nSeu veículo ${placa} está pronto para retirada!\n\nAguardamos você.`
    );
    const phone = telefone.replace(/\D/g, "");
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  }

  function getOrdensPorStatus(status: StatusOS) {
    return ordens.filter((o) => o.status === status);
  }

  // Loading skeleton
  if (loading) {
    return (
      <>
        {/* Desktop Loading */}
        <div className="hidden lg:block p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[600px] bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
        
        {/* Mobile Loading */}
        <div className="lg:hidden p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-48" />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-24 bg-slate-200 rounded-full flex-shrink-0" />
              ))}
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </>
    );
  }

  const activeColumn = colunas.find((c) => c.status === activeTab) || colunas[0];
  const ordensAtivas = getOrdensPorStatus(activeTab);

  return (
    <>
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden">
        {/* Header Mobile */}
        <div className="sticky top-14 z-30 bg-white border-b border-slate-100">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-slate-800">Fila do Pátio</h1>
              <button 
                onClick={fetchOrdens}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 active:scale-95 transition-transform"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {colunas.map((coluna) => {
                const count = getOrdensPorStatus(coluna.status).length;
                const isActive = activeTab === coluna.status;
                
                return (
                  <button
                    key={coluna.status}
                    onClick={() => setActiveTab(coluna.status)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all
                      ${isActive 
                        ? `${coluna.headerBg} ${coluna.borderColor} border-2 font-semibold text-slate-800` 
                        : 'bg-slate-100 text-slate-600 border-2 border-transparent'
                      }
                    `}
                  >
                    <span>{coluna.emoji}</span>
                    <span className="text-sm">{coluna.tituloMobile}</span>
                    {count > 0 && (
                      <span className={`
                        w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center
                        ${isActive ? 'bg-white text-slate-800' : 'bg-slate-200 text-slate-600'}
                      `}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cards Container com Swipe */}
        <div 
          className={`min-h-[calc(100vh-200px)] ${activeColumn.bgColor} p-4`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {colunas.map((coluna, index) => (
              <div 
                key={coluna.status}
                className={`h-1.5 rounded-full transition-all ${
                  coluna.status === activeTab 
                    ? `w-6 ${coluna.dotColor}` 
                    : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Navegação entre colunas */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                const idx = colunas.findIndex(c => c.status === activeTab);
                if (idx > 0) setActiveTab(colunas[idx - 1].status);
              }}
              disabled={activeTab === colunas[0].status}
              className={`p-2 rounded-xl ${
                activeTab === colunas[0].status 
                  ? 'opacity-30' 
                  : 'bg-white shadow-sm active:scale-95'
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                {ordensAtivas.length} veículo{ordensAtivas.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-slate-500">
                Deslize para navegar
              </p>
            </div>

            <button
              onClick={() => {
                const idx = colunas.findIndex(c => c.status === activeTab);
                if (idx < colunas.length - 1) setActiveTab(colunas[idx + 1].status);
              }}
              disabled={activeTab === colunas[colunas.length - 1].status}
              className={`p-2 rounded-xl ${
                activeTab === colunas[colunas.length - 1].status 
                  ? 'opacity-30' 
                  : 'bg-white shadow-sm active:scale-95'
              }`}
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {ordensAtivas.map((ordem) => {
              const isExpanded = expandedCard === ordem.id;
              const isUpdating = updatingCard === ordem.id;
              const proximo = proximoStatus[ordem.status];
              const proximaColuna = colunas.find(c => c.status === proximo);

              return (
                <div
                  key={ordem.id}
                  className={`
                    bg-white rounded-2xl shadow-sm border-2 border-white overflow-hidden
                    transition-all duration-200
                    ${isUpdating ? 'opacity-50 scale-95' : ''}
                  `}
                >
                  {/* Card Header - Sempre visível */}
                  <button
                    onClick={() => setExpandedCard(isExpanded ? null : ordem.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      {/* Placa destacada */}
                      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg">
                        <span className="font-mono font-bold text-sm">{ordem.veiculo.placa}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {ordem.veiculo.modelo}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {ordem.itens.map(i => i.servico.nome).join(", ")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(ordem.total)}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-400 justify-end">
                          <Clock className="w-3 h-3" />
                          {format(new Date(ordem.dataEntrada), "HH:mm")}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Card Expandido */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 animate-slide-in">
                      {/* Info do Cliente */}
                      <div className="py-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>{ordem.cliente.nome}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{ordem.cliente.telefone}</span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        {/* Botão WhatsApp - Apenas quando pronto */}
                        {ordem.status === "PRONTO" && (
                          <button
                            onClick={() => handleWhatsApp(
                              ordem.cliente.telefone, 
                              ordem.cliente.nome.split(" ")[0],
                              ordem.veiculo.placa
                            )}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium active:scale-95 transition-transform"
                          >
                            <MessageCircle className="w-5 h-5" />
                            Avisar Cliente
                          </button>
                        )}

                        {/* Botão Avançar */}
                        {proximo && (
                          <button
                            onClick={() => handleMoveToNext(ordem)}
                            disabled={isUpdating}
                            className={`
                              flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium
                              active:scale-95 transition-all
                              ${proximo === "ENTREGUE" 
                                ? 'bg-emerald-500 text-white' 
                                : `${proximaColuna?.headerBg} text-slate-700 border-2 ${proximaColuna?.borderColor}`
                              }
                            `}
                          >
                            {proximo === "ENTREGUE" ? (
                              <>
                                <CheckCircle2 className="w-5 h-5" />
                                Entregar
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-5 h-5" />
                                {proximaColuna?.emoji} {proximaColuna?.tituloMobile}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {ordensAtivas.length === 0 && (
              <div className="text-center py-12 bg-white/50 rounded-2xl">
                <Car className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Nenhum veículo</p>
                <p className="text-sm text-slate-400">nesta etapa</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Fila do Pátio</h1>
          <p className="text-slate-500 mt-1">
            Arraste os cards para atualizar o status
          </p>
        </div>
        <Button onClick={fetchOrdens} icon={<RefreshCw className="w-4 h-4" />}>
          Atualizar
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-6 min-h-[calc(100vh-200px)]">
        {colunas.map((coluna) => {
          const ordensColuna = getOrdensPorStatus(coluna.status);
          const isDropTarget = dropTarget === coluna.status;

          return (
            <div
              key={coluna.status}
              className={`
                ${coluna.bgColor} rounded-2xl p-4 transition-all duration-200
                border-2 ${coluna.borderColor}
                ${isDropTarget ? "ring-2 ring-cyan-400 ring-offset-2 scale-[1.02]" : ""}
              `}
              onDragOver={(e) => handleDragOver(e, coluna.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, coluna.status)}
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${coluna.borderColor}`}
              >
                <h2 className={`font-semibold text-slate-700 ${coluna.headerBg} px-3 py-1 rounded-lg`}>
                  {coluna.titulo}
                </h2>
                <span className="text-sm font-medium text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                  {ordensColuna.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {ordensColuna.map((ordem) => (
                  <div
                    key={ordem.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ordem)}
                    onDragEnd={handleDragEnd}
                    className={`
                      bg-white rounded-xl p-4 shadow-md border-2 border-slate-200
                      cursor-grab active:cursor-grabbing
                      hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5
                      transition-all duration-200
                      ${dragging === ordem.id ? "opacity-50 scale-95 rotate-2" : ""}
                    `}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          #{ordem.codigo}
                        </span>
                        <StatusBadge status={ordem.status} />
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800">
                        {ordem.veiculo.modelo}
                      </span>
                      {ordem.veiculo.cor && (
                        <span className="text-sm text-slate-500">
                          ({ordem.veiculo.cor})
                        </span>
                      )}
                    </div>

                    {/* Plate */}
                    <div className="inline-block bg-slate-100 px-3 py-1 rounded-lg mb-3">
                      <span className="font-mono font-bold text-slate-700">
                        {ordem.veiculo.placa}
                      </span>
                    </div>

                    {/* Services */}
                    <div className="text-sm text-slate-600 mb-3">
                      {ordem.itens.map((item, i) => (
                        <span key={item.id}>
                          {item.servico.nome}
                          {i < ordem.itens.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>

                    {/* Client Info */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <User className="w-3.5 h-3.5" />
                      <span>{ordem.cliente.nome}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{ordem.cliente.telefone}</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(ordem.dataEntrada), "HH:mm", {
                          locale: ptBR,
                        })}
                      </div>
                      <span className="font-semibold text-emerald-600">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(ordem.total)}
                      </span>
                    </div>
                  </div>
                ))}

                {ordensColuna.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    <Car className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum veículo</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}

