"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Car,
  Loader2,
  Plus,
  ChevronRight,
  Phone,
  CheckCircle,
  XCircle,
  Sparkles,
  Timer,
  CircleDot,
  PartyPopper,
  Droplets,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrdemServico {
  id: string;
  codigo: number;
  status: "AGUARDANDO" | "LAVANDO" | "FINALIZANDO" | "PRONTO" | "ENTREGUE";
  dataEntrada: string;
  previsaoSaida: string | null;
  dataFinalizacao: string | null;
}

interface Agendamento {
  id: string;
  dataHora: string;
  status: string;
  totalEstimado: number;
  ordemServicoId: string | null;
  ordemServico: OrdemServico | null;
  lavaJato: {
    nome: string;
    slug: string;
    endereco: string | null;
    telefone: string | null;
    logoUrl: string | null;
  };
  veiculo: {
    placa: string;
    modelo: string;
  };
  servicos: {
    servico: {
      nome: string;
    };
  }[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDENTE: { label: "Aguardando", color: "text-amber-700", bg: "bg-amber-50" },
  CONFIRMADO: { label: "Confirmado", color: "text-emerald-700", bg: "bg-emerald-50" },
  EM_ANDAMENTO: { label: "Em andamento", color: "text-blue-700", bg: "bg-blue-50" },
  CONCLUIDO: { label: "Concluído", color: "text-slate-600", bg: "bg-slate-100" },
  CANCELADO: { label: "Cancelado", color: "text-red-700", bg: "bg-red-50" },
};

// Status detalhado da OS para exibir progresso
const osStatusConfig: Record<string, { label: string; emoji: string; step: number }> = {
  AGUARDANDO: { label: "Na fila", emoji: "🚗", step: 1 },
  LAVANDO: { label: "Lavando", emoji: "🧽", step: 2 },
  FINALIZANDO: { label: "Finalizando", emoji: "✨", step: 3 },
  PRONTO: { label: "Pronto!", emoji: "✅", step: 4 },
  ENTREGUE: { label: "Entregue", emoji: "🎉", step: 5 },
};

// Componente de progresso da lavagem - Timeline melhorada
function ProgressoLavagem({ status }: { status: string }) {
  const config = osStatusConfig[status];
  if (!config) return null;
  
  const steps = [
    { key: "AGUARDANDO", emoji: "🚗", label: "Fila", bgClass: "bg-amber-500", ringClass: "ring-amber-200", textClass: "text-amber-700", bgLightClass: "bg-amber-100" },
    { key: "LAVANDO", emoji: "🧽", label: "Lavando", bgClass: "bg-cyan-500", ringClass: "ring-cyan-200", textClass: "text-cyan-700", bgLightClass: "bg-cyan-100" },
    { key: "FINALIZANDO", emoji: "✨", label: "Finalizando", bgClass: "bg-blue-500", ringClass: "ring-blue-200", textClass: "text-blue-700", bgLightClass: "bg-blue-100" },
    { key: "PRONTO", emoji: "✅", label: "Pronto", bgClass: "bg-emerald-500", ringClass: "ring-emerald-200", textClass: "text-emerald-700", bgLightClass: "bg-emerald-100" },
  ];

  // Calcula a porcentagem de progresso baseado no step
  const getProgressWidth = () => {
    if (config.step === 1) return '0%';
    if (config.step === 2) return '33.33%';
    if (config.step === 3) return '66.66%';
    if (config.step >= 4) return '100%';
    return '0%';
  };

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-xl shadow-sm">
      <div className="mb-2">
        <span className="text-xs font-bold text-cyan-800 uppercase tracking-wide">
          Progresso da Lavagem
        </span>
      </div>
      
      {/* Timeline melhorada */}
      <div className="relative pt-2">
        {/* Linha de fundo */}
        <div className="absolute top-6 left-0 right-0 h-1.5 bg-slate-200 rounded-full" />
        
        {/* Linha de progresso animada */}
        <div 
          className="absolute top-6 left-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: getProgressWidth() }}
        />
        
        {/* Círculos e labels */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNum = index + 1;
            const isCompleted = config.step > stepNum;
            const isCurrent = config.step === stepNum;
            
            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-base z-10
                    transition-all duration-500
                    ${isCompleted 
                      ? "bg-cyan-500 text-white shadow-md scale-110" 
                      : isCurrent
                      ? `${step.bgClass} text-white shadow-lg scale-125 ring-4 ${step.ringClass} animate-pulse`
                      : "bg-white text-slate-400 border-2 border-slate-300"
                    }
                  `}
                >
                  {step.emoji}
                </div>
                <span className={`text-[11px] mt-2 font-bold text-center max-w-[60px] ${
                  isCompleted 
                    ? "text-cyan-700" 
                    : isCurrent
                    ? step.textClass
                    : "text-slate-400"
                }`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <div className={`mt-1 px-2 py-0.5 rounded-full ${step.bgLightClass} ${step.textClass} text-[10px] font-semibold`}>
                    Agora
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MeusAgendamentosPage() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAgendamentos(showLoading = true) {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch("/api/cliente/agendamentos");

      if (res.status === 401) {
        router.push("/entrar");
        return;
      }

      if (res.ok) {
        setAgendamentos(await res.json());
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    fetchAgendamentos();

    // Polling: Atualiza a cada 10 segundos se houver agendamentos em andamento
    // Intervalo menor para atualização mais frequente da timeline
    const interval = setInterval(() => {
      const temEmAndamento = agendamentos.some(
        (a) => a.ordemServico && 
          a.ordemServico.status !== "ENTREGUE" && 
          a.ordemServico.status !== "PRONTO"
      );
      if (temEmAndamento) {
        fetchAgendamentos(false); // Atualiza sem mostrar loading
      }
    }, 10000); // Reduzido para 10 segundos para atualização mais rápida

    return () => clearInterval(interval);
  }, [agendamentos.length]); // Re-configura quando muda o número de agendamentos

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  // Função para determinar prioridade de ordenação
  // Carros em processo de lavagem (LAVANDO, FINALIZANDO) têm prioridade máxima
  const getPrioridade = (ag: Agendamento): number => {
    if (!ag.ordemServico) return 0;
    
    const osStatus = ag.ordemServico.status;
    
    // Prioridade máxima: em processo de lavagem
    if (osStatus === "LAVANDO") return 100;
    if (osStatus === "FINALIZANDO") return 90;
    
    // Alta prioridade: aguardando ou pronto
    if (osStatus === "AGUARDANDO") return 50;
    if (osStatus === "PRONTO") return 40;
    
    // Prioridade normal: outros status
    return 0;
  };

  // Separar e ordenar agendamentos
  const proximos = agendamentos
    .filter(
      (a) => new Date(a.dataHora) >= new Date() && !["CANCELADO", "CONCLUIDO"].includes(a.status)
    )
    .sort((a, b) => {
      // Primeiro ordena por prioridade (em lavagem primeiro)
      const prioridadeA = getPrioridade(a);
      const prioridadeB = getPrioridade(b);
      
      if (prioridadeA !== prioridadeB) {
        return prioridadeB - prioridadeA; // Maior prioridade primeiro
      }
      
      // Se mesma prioridade, ordena por data/hora
      return new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime();
    });
    
  const anteriores = agendamentos.filter(
    (a) => new Date(a.dataHora) < new Date() || ["CANCELADO", "CONCLUIDO"].includes(a.status)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-6 lg:max-w-2xl lg:mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Meus Agendamentos</h1>
        <Link
          href="/encontrar"
          className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-500/30"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo</span>
        </Link>
      </div>

      {agendamentos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Nenhum agendamento</h3>
          <p className="text-sm text-slate-600 mt-1 mb-6">
            Que tal agendar sua primeira lavagem?
          </p>
          <Link
            href="/encontrar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30"
          >
            Encontrar Lava Jato
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Próximos - Com destaque para os em lavagem */}
          {proximos.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Próximos</h2>
              <div className="space-y-4">
                {proximos.map((ag) => {
                  // Verifica se está em processo de lavagem
                  const estaLavando = Boolean(ag.ordemServico && 
                    (ag.ordemServico.status === "LAVANDO" || ag.ordemServico.status === "FINALIZANDO"));
                  
                  return (
                    <div 
                      key={ag.id}
                      className={estaLavando ? "relative" : ""}
                    >
                      {estaLavando && (
                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
                      )}
                      <AgendamentoCard 
                        agendamento={ag} 
                        formatCurrency={formatCurrency}
                        isEmLavagem={estaLavando}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Anteriores */}
          {anteriores.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Histórico</h2>
              <div className="space-y-4">
                {anteriores.map((ag) => (
                  <AgendamentoCard key={ag.id} agendamento={ag} formatCurrency={formatCurrency} isHistory />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AgendamentoCard({
  agendamento,
  formatCurrency,
  isHistory,
  isEmLavagem,
}: {
  agendamento: Agendamento;
  formatCurrency: (v: number) => string;
  isHistory?: boolean;
  isEmLavagem?: boolean;
}) {
  const status = statusConfig[agendamento.status] || statusConfig.PENDENTE;
  const dataHora = new Date(agendamento.dataHora);
  
  // Se tem OS vinculada e não está entregue, mostra o progresso
  const mostrarProgresso = agendamento.ordemServico && 
    agendamento.ordemServico.status !== "ENTREGUE" &&
    !isHistory;

  // Determina o label do status baseado na OS (se existir)
  const getStatusDisplay = () => {
    if (agendamento.ordemServico) {
      const osStatus = agendamento.ordemServico.status;
      
      if (osStatus === "PRONTO") {
        return {
          label: "Pronto para retirada!",
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: "bg-emerald-500",
          textColor: "text-white",
        };
      }
      if (osStatus === "AGUARDANDO") {
        return {
          label: "Na fila de espera",
          icon: <Car className="w-5 h-5" />,
          bgColor: "bg-amber-500",
          textColor: "text-white",
        };
      }
      if (osStatus === "LAVANDO") {
        return {
          label: "Lavando agora",
          icon: <Droplets className="w-5 h-5" />,
          bgColor: "bg-cyan-500",
          textColor: "text-white",
        };
      }
      if (osStatus === "FINALIZANDO") {
        return {
          label: "Finalizando",
          icon: <Sparkles className="w-5 h-5" />,
          bgColor: "bg-blue-500",
          textColor: "text-white",
        };
      }
      if (osStatus === "ENTREGUE") {
        return {
          label: "Entregue",
          icon: <PartyPopper className="w-5 h-5" />,
          bgColor: "bg-slate-500",
          textColor: "text-white",
        };
      }
    }
    
    // Status do agendamento (sem OS vinculada)
    if (agendamento.status === "PENDENTE") {
      return {
        label: "Aguardando confirmação",
        icon: <Timer className="w-5 h-5" />,
        bgColor: "bg-amber-500",
        textColor: "text-white",
      };
    }
    if (agendamento.status === "CONFIRMADO") {
      return {
        label: "Confirmado",
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: "bg-emerald-500",
        textColor: "text-white",
      };
    }
    if (agendamento.status === "CANCELADO") {
      return {
        label: "Cancelado",
        icon: <XCircle className="w-5 h-5" />,
        bgColor: "bg-red-500",
        textColor: "text-white",
      };
    }
    if (agendamento.status === "CONCLUIDO") {
      return {
        label: "Concluído",
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: "bg-slate-500",
        textColor: "text-white",
      };
    }
    
    return null;
  };
  
  const statusDisplay = getStatusDisplay();

  return (
    <div className={`
      bg-white rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300
      ${isEmLavagem 
        ? "border-cyan-400 shadow-cyan-200/50 shadow-2xl ring-2 ring-cyan-100" 
        : "border-slate-200"
      }
      ${isHistory ? "opacity-70" : ""}
    `}>
      {/* Header com data */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-semibold capitalize">
            {format(dataHora, "EEE, d MMM", { locale: ptBR })}
          </span>
        </div>
        <span className="text-white text-lg font-bold">
          {format(dataHora, "HH:mm")}
        </span>
      </div>
      
      {/* Status - largura total */}
      {statusDisplay && (
        <div className={`px-4 py-3 flex items-center justify-center gap-2 ${statusDisplay.bgColor}`}>
          {statusDisplay.icon}
          <span className={`text-sm font-bold ${statusDisplay.textColor}`}>
            {statusDisplay.label}
          </span>
        </div>
      )}

      <div className="p-4">
        {/* Lava Jato - simplificado */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
          >
            {agendamento.lavaJato.nome.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-900 truncate">
              {agendamento.lavaJato.nome}
            </p>
            {agendamento.lavaJato.endereco && (
              <p className="text-xs text-slate-600 truncate flex items-center gap-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {agendamento.lavaJato.endereco}
              </p>
            )}
          </div>
        </div>

        {/* Veículo - compacto */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-slate-100 rounded-lg">
          <Car className="w-4 h-4 text-slate-600" />
          <span className="font-semibold text-slate-800 text-sm">{agendamento.veiculo.modelo}</span>
          <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
            {agendamento.veiculo.placa}
          </span>
        </div>

        {/* Serviços - compacto */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {agendamento.servicos.slice(0, 2).map((s, i) => (
            <span key={i} className="text-xs font-semibold bg-cyan-50 text-cyan-800 px-2 py-1 rounded-md">
              {s.servico.nome}
            </span>
          ))}
          {agendamento.servicos.length > 2 && (
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
              +{agendamento.servicos.length - 2}
            </span>
          )}
        </div>

        {/* Progresso da Lavagem - Mostra quando tem OS em andamento */}
        {mostrarProgresso && (
          <ProgressoLavagem status={agendamento.ordemServico!.status} />
        )}

        {/* Previsão de entrega */}
        {agendamento.ordemServico?.previsaoSaida && !isHistory && agendamento.ordemServico.status !== "PRONTO" && (
          <div className="flex items-center gap-2 mt-3 p-2 bg-blue-50 rounded-lg text-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-blue-800">
              Previsão: <strong>{format(new Date(agendamento.ordemServico.previsaoSaida), "HH:mm")}</strong>
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Total</span>
              <span className="font-bold text-lg text-slate-900 block">
                {formatCurrency(agendamento.totalEstimado)}
              </span>
            </div>

            {!isHistory && agendamento.lavaJato.telefone && (
              <a
                href={`tel:${agendamento.lavaJato.telefone}`}
                className="flex items-center gap-2 text-sm font-bold text-white bg-slate-800 px-4 py-2 rounded-lg"
              >
                <Phone className="w-4 h-4" />
                Ligar
              </a>
            )}
          </div>

          {isHistory && (
            <Link
              href={`/lavajato/${agendamento.lavaJato.slug}`}
              className="flex items-center justify-center gap-2 w-full mt-3 text-sm font-bold text-white bg-cyan-600 px-4 py-2.5 rounded-lg"
            >
              Agendar novamente
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

