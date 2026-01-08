"use client";

import { useEffect, useState, DragEvent } from "react";
import { Car, Clock, User, Phone, MoreVertical, RefreshCw } from "lucide-react";
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

const colunas: { status: StatusOS; titulo: string; cor: string }[] = [
  { status: "AGUARDANDO", titulo: "🚗 Aguardando", cor: "border-amber-400" },
  { status: "LAVANDO", titulo: "🧽 Lavando", cor: "border-cyan-400" },
  { status: "FINALIZANDO", titulo: "✨ Finalizando", cor: "border-blue-400" },
  { status: "PRONTO", titulo: "✅ Pronto", cor: "border-emerald-400" },
];

export default function KanbanPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<StatusOS | null>(null);

  useEffect(() => {
    fetchOrdens();
  }, []);

  async function fetchOrdens() {
    setLoading(true);
    try {
      const res = await fetch("/api/ordens");
      const data = await res.json();
      // Filtra apenas ordens não entregues
      const ordensArray = Array.isArray(data) ? data : [];
      setOrdens(ordensArray.filter((o: OrdemServico) => o.status !== "ENTREGUE"));
    } catch (error) {
      console.error("Erro ao buscar ordens:", error);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(id: string, novoStatus: StatusOS) {
    try {
      const res = await fetch(`/api/ordens/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) {
        const ordemAtualizada = await res.json();
        setOrdens((prev) =>
          prev.map((o) => (o.id === id ? ordemAtualizada : o))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }

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
      // Atualiza localmente primeiro para UI responsiva
      setOrdens((prev) =>
        prev.map((o) => (o.id === ordemId ? { ...o, status: novoStatus } : o))
      );
      // Depois sincroniza com o backend
      atualizarStatus(ordemId, novoStatus);
    }

    setDropTarget(null);
    setDragging(null);
  }

  function getOrdensPorStatus(status: StatusOS) {
    return ordens.filter((o) => o.status === status);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-64" />
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[600px] bg-slate-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
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
                bg-slate-100/50 rounded-2xl p-4 transition-all duration-200
                border-2 border-dashed
                ${isDropTarget ? "kanban-column-drop-active border-cyan-400" : "border-transparent"}
              `}
              onDragOver={(e) => handleDragOver(e, coluna.status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, coluna.status)}
            >
              {/* Column Header */}
              <div
                className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${coluna.cor}`}
              >
                <h2 className="font-semibold text-slate-700">{coluna.titulo}</h2>
                <span className="text-sm text-slate-500 bg-white px-2 py-1 rounded-lg">
                  {ordensColuna.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-4">
                {ordensColuna.map((ordem) => (
                  <div
                    key={ordem.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ordem)}
                    onDragEnd={handleDragEnd}
                    className={`
                      bg-white rounded-xl p-4 shadow-sm border border-slate-100
                      cursor-grab active:cursor-grabbing
                      hover:shadow-md transition-all duration-200
                      ${dragging === ordem.id ? "kanban-card-dragging" : ""}
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
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
  );
}

