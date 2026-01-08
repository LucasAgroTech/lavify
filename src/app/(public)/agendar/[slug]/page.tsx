"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Car,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Servico {
  id: string;
  nome: string;
  preco: number;
  tempoEstimado: number;
}

interface LavaJato {
  id: string;
  nome: string;
  slug: string;
  endereco: string | null;
  cidade: string | null;
  telefone: string | null;
  corPrimaria: string;
  horarioFuncionamento: string | null;
  tempoMinimoAgendamento: number;
  aceitaAgendamento: boolean;
  servicos: Servico[];
}

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  cor: string | null;
}

function AgendarContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const servicosPreSelecionados = searchParams.get("servicos")?.split(",") || [];

  const [lavaJato, setLavaJato] = useState<LavaJato | null>(null);
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // Estado do formulário
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>(servicosPreSelecionados);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<string>("");
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horaSelecionada, setHoraSelecionada] = useState<string>("");
  const [observacoes, setObservacoes] = useState("");
  const [showAddVeiculo, setShowAddVeiculo] = useState(false);
  const [novoVeiculo, setNovoVeiculo] = useState({ placa: "", modelo: "", cor: "" });

  // Step
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetchData();
  }, [slug]);

  async function fetchData() {
    try {
      const [lavaJatoRes, veiculosRes] = await Promise.all([
        fetch(`/api/public/lavajatos/${slug}`),
        fetch("/api/cliente/veiculos"),
      ]);

      if (lavaJatoRes.ok) {
        const lj = await lavaJatoRes.json();
        setLavaJato(lj);
        // Se já tem serviços pré-selecionados, valida
        if (servicosPreSelecionados.length > 0) {
          const validIds = lj.servicos.map((s: Servico) => s.id);
          setServicosSelecionados(servicosPreSelecionados.filter((id: string) => validIds.includes(id)));
        }
      }

      if (veiculosRes.ok) {
        const v = await veiculosRes.json();
        setVeiculos(v);
        if (v.length > 0) setVeiculoSelecionado(v[0].id);
      } else if (veiculosRes.status === 401) {
        router.push(`/entrar?redirect=/agendar/${slug}`);
        return;
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleServico(id: string) {
    setServicosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleAddVeiculo(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/cliente/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoVeiculo),
      });

      if (res.ok) {
        const veiculo = await res.json();
        setVeiculos([...veiculos, veiculo]);
        setVeiculoSelecionado(veiculo.id);
        setShowAddVeiculo(false);
        setNovoVeiculo({ placa: "", modelo: "", cor: "" });
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  async function handleSubmit() {
    if (!dataSelecionada || !horaSelecionada || !veiculoSelecionado || servicosSelecionados.length === 0) {
      setErro("Preencha todos os campos");
      return;
    }

    setEnviando(true);
    setErro("");

    const [hora, minuto] = horaSelecionada.split(":").map(Number);
    const dataHora = setMinutes(setHours(dataSelecionada, hora), minuto);

    try {
      const res = await fetch("/api/cliente/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lavaJatoId: lavaJato?.id,
          veiculoId: veiculoSelecionado,
          servicosIds: servicosSelecionados,
          dataHora: dataHora.toISOString(),
          observacoes,
        }),
      });

      if (res.ok) {
        setSucesso(true);
        setTimeout(() => {
          router.push("/meus-agendamentos");
        }, 2000);
      } else {
        const data = await res.json();
        setErro(data.error || "Erro ao criar agendamento");
      }
    } catch {
      setErro("Erro ao conectar ao servidor");
    } finally {
      setEnviando(false);
    }
  }

  // Gerar próximos 7 dias
  const proximosDias = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1));

  // Gerar horários disponíveis (08:00 - 18:00 por padrão)
  const horariosDisponiveis = (() => {
    if (!lavaJato) return [];
    const abertura = 8;
    const fechamento = 18;
    const horarios: string[] = [];
    for (let h = abertura; h < fechamento; h++) {
      horarios.push(`${String(h).padStart(2, "0")}:00`);
      horarios.push(`${String(h).padStart(2, "0")}:30`);
    }
    return horarios;
  })();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const totalSelecionado = lavaJato?.servicos
    .filter((s) => servicosSelecionados.includes(s.id))
    .reduce((acc, s) => acc + s.preco, 0) || 0;

  const tempoTotal = lavaJato?.servicos
    .filter((s) => servicosSelecionados.includes(s.id))
    .reduce((acc, s) => acc + s.tempoEstimado, 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!lavaJato) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-xl font-bold text-slate-800">Não encontrado</h2>
        <Link href="/encontrar" className="text-cyan-600 mt-2 block">
          Voltar para busca
        </Link>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          Agendamento Realizado!
        </h2>
        <p className="text-slate-500 mt-2 text-center">
          Aguarde a confirmação do lava jato
        </p>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="sticky top-12 z-40 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 lg:top-0">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div>
          <h1 className="font-semibold text-slate-800">Agendar Lavagem</h1>
          <p className="text-xs text-slate-500">{lavaJato.nome}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : 1}
            </div>
            <span className="text-xs text-slate-500 mt-2">Serviços</span>
          </div>

          {/* Line 1-2 */}
          <div className={`flex-1 h-1 rounded mx-2 mt-[14px] ${step > 1 ? "bg-cyan-500" : "bg-slate-100"}`} />

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : 2}
            </div>
            <span className="text-xs text-slate-500 mt-2">Data/Hora</span>
          </div>

          {/* Line 2-3 */}
          <div className={`flex-1 h-1 rounded mx-2 mt-[14px] ${step > 2 ? "bg-cyan-500" : "bg-slate-100"}`} />

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > 3 ? <Check className="w-4 h-4" /> : 3}
            </div>
            <span className="text-xs text-slate-500 mt-2">Veículo</span>
          </div>
        </div>
      </div>

      {erro && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {erro}
        </div>
      )}

      {/* Step 1: Serviços */}
      {step === 1 && (
        <div className="px-4">
          <h2 className="font-semibold text-slate-800 mb-3">Escolha os serviços</h2>
          <div className="space-y-2">
            {lavaJato.servicos.map((servico) => {
              const selecionado = servicosSelecionados.includes(servico.id);
              return (
                <button
                  key={servico.id}
                  onClick={() => toggleServico(servico.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selecionado ? "border-cyan-500 bg-cyan-50" : "border-slate-100 bg-white"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selecionado ? "bg-cyan-500 border-cyan-500" : "border-slate-300"
                    }`}
                  >
                    {selecionado && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-800">{servico.nome}</p>
                    <p className="text-xs text-slate-500">{servico.tempoEstimado} min</p>
                  </div>
                  <span className="font-bold text-cyan-600">{formatCurrency(servico.preco)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Data e Hora */}
      {step === 2 && (
        <div className="px-4 space-y-6">
          {/* Data */}
          <div>
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-500" />
              Escolha o dia
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {proximosDias.map((dia) => {
                const selecionado = dataSelecionada?.toDateString() === dia.toDateString();
                return (
                  <button
                    key={dia.toISOString()}
                    onClick={() => setDataSelecionada(dia)}
                    className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                      selecionado
                        ? "bg-cyan-500 text-white"
                        : "bg-white border border-slate-200 text-slate-700"
                    }`}
                  >
                    <p className={`text-xs uppercase ${selecionado ? "text-cyan-100" : "text-slate-500"}`}>
                      {format(dia, "EEE", { locale: ptBR })}
                    </p>
                    <p className="text-xl font-bold">{format(dia, "d")}</p>
                    <p className={`text-xs ${selecionado ? "text-cyan-100" : "text-slate-500"}`}>
                      {format(dia, "MMM", { locale: ptBR })}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hora */}
          <div>
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-500" />
              Escolha o horário
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {horariosDisponiveis.map((hora) => {
                const selecionado = horaSelecionada === hora;
                return (
                  <button
                    key={hora}
                    onClick={() => setHoraSelecionada(hora)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                      selecionado
                        ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-white border border-slate-200 text-slate-800 hover:border-cyan-300"
                    }`}
                  >
                    {hora}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Veículo */}
      {step === 3 && (
        <div className="px-4 space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Car className="w-5 h-5 text-cyan-500" />
            Selecione o veículo
          </h2>

          {veiculos.length === 0 && !showAddVeiculo ? (
            <div className="text-center py-8 bg-white rounded-xl">
              <Car className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 mb-4">Nenhum veículo cadastrado</p>
              <button
                onClick={() => setShowAddVeiculo(true)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-xl font-medium"
              >
                Adicionar Veículo
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {veiculos.map((veiculo) => {
                  const selecionado = veiculoSelecionado === veiculo.id;
                  return (
                    <button
                      key={veiculo.id}
                      onClick={() => setVeiculoSelecionado(veiculo.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        selecionado ? "border-cyan-500 bg-cyan-50" : "border-slate-100 bg-white"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selecionado ? "bg-cyan-500 border-cyan-500" : "border-slate-300"
                        }`}
                      >
                        {selecionado && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Car className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-slate-800">{veiculo.modelo}</p>
                        <p className="text-xs text-slate-500 font-mono">{veiculo.placa}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {!showAddVeiculo && (
                <button
                  onClick={() => setShowAddVeiculo(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar outro veículo
                </button>
              )}
            </>
          )}

          {showAddVeiculo && (
            <form onSubmit={handleAddVeiculo} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
              <p className="font-medium text-slate-800">Novo veículo</p>
              <input
                type="text"
                placeholder="Placa (ex: ABC1234)"
                value={novoVeiculo.placa}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value.toUpperCase() })}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Modelo (ex: Honda Civic)"
                value={novoVeiculo.modelo}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Cor (opcional)"
                value={novoVeiculo.cor}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, cor: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVeiculo(false)}
                  className="flex-1 py-2 text-slate-600 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-cyan-500 text-white rounded-xl font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          )}

          {/* Observações */}
          <div className="mt-6">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Alguma informação adicional..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {/* Resumo e Botões */}
      <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            {servicosSelecionados.length > 0 && (
              <>
                <p className="text-sm text-slate-500">
                  {servicosSelecionados.length} serviço(s) • ~{tempoTotal} min
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {formatCurrency(totalSelecionado)}
                </p>
              </>
            )}
          </div>

          <div className="flex gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium"
              >
                Voltar
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && servicosSelecionados.length === 0 || step === 2 && (!dataSelecionada || !horaSelecionada)}
                className="px-6 py-2.5 bg-cyan-500 text-white rounded-xl font-medium disabled:opacity-50 flex items-center gap-2"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={enviando || !veiculoSelecionado}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {enviando ? "Agendando..." : "Confirmar"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgendarPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    }>
      <AgendarContent />
    </Suspense>
  );
}
