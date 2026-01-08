"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Calendar,
  Loader2,
  Check,
  ArrowLeft,
  Share,
  Heart,
} from "lucide-react";

interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  tempoEstimado: number;
}

interface LavaJato {
  id: string;
  nome: string;
  slug: string;
  telefone: string | null;
  endereco: string | null;
  logoUrl: string | null;
  corPrimaria: string;
  servicos: Servico[];
}

interface Props {
  slug: string;
}

export default function LavaJatoClient({ slug }: Props) {
  const router = useRouter();

  const [lavaJato, setLavaJato] = useState<LavaJato | null>(null);
  const [loading, setLoading] = useState(true);
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [showAllServices, setShowAllServices] = useState(false);

  useEffect(() => {
    fetchLavaJato();
  }, [slug]);

  async function fetchLavaJato() {
    try {
      const res = await fetch(`/api/public/lavajatos/${slug}`);
      if (res.ok) {
        setLavaJato(await res.json());
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const totalSelecionado = lavaJato?.servicos
    ?.filter((s) => servicosSelecionados.includes(s.id))
    .reduce((acc, s) => acc + s.preco, 0) || 0;

  const servicos = lavaJato?.servicos || [];
  const servicosExibidos = showAllServices ? servicos : servicos.slice(0, 4);

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

  return (
    <div className="pb-24">
      {/* Header Mobile */}
      <div className="sticky top-12 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between lg:hidden">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <div className="flex items-center gap-3">
          <button className="p-1">
            <Share className="w-5 h-5 text-slate-700" />
          </button>
          <button className="p-1">
            <Heart className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Banner */}
      <div
        className="h-48 lg:h-64 relative"
        style={{
          background: `linear-gradient(135deg, ${lavaJato.corPrimaria}, #3b82f6)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-16 relative z-10 lg:max-w-4xl lg:mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <div className="flex items-start gap-3">
            <div
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${lavaJato.corPrimaria}, #3b82f6)`,
              }}
            >
              {lavaJato.logoUrl ? (
                <img src={lavaJato.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
              ) : (
                lavaJato.nome.charAt(0)
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg lg:text-2xl font-bold text-slate-800 truncate">
                {lavaJato.nome}
              </h1>

              {lavaJato.endereco && (
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{lavaJato.endereco}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-2 mt-4">
            {lavaJato.telefone && (
              <a
                href={`tel:${lavaJato.telefone}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 rounded-xl text-slate-700 text-sm font-medium active:bg-slate-200"
              >
                <Phone className="w-4 h-4" />
                Ligar
              </a>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="mt-4 bg-white rounded-2xl shadow-sm p-4">
          <h2 className="font-bold text-slate-800 mb-4">Serviços</h2>

          {servicos.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              Nenhum serviço cadastrado ainda.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {servicosExibidos.map((servico) => {
                  const selecionado = servicosSelecionados.includes(servico.id);

                  return (
                    <button
                      key={servico.id}
                      onClick={() => toggleServico(servico.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all active:scale-[0.99] ${
                        selecionado
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selecionado ? "bg-cyan-500 border-cyan-500" : "border-slate-300"
                        }`}
                      >
                        {selecionado && <Check className="w-3 h-3 text-white" />}
                      </div>

                      <div className="flex-1 text-left">
                        <span className="font-medium text-slate-800">{servico.nome}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {servico.tempoEstimado} min
                        </div>
                      </div>

                      <span className="font-bold text-cyan-600">
                        {formatCurrency(servico.preco)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {servicos.length > 4 && !showAllServices && (
                <button
                  onClick={() => setShowAllServices(true)}
                  className="w-full mt-3 py-2 text-sm text-cyan-600 font-medium"
                >
                  Ver todos os {servicos.length} serviços
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      {servicosSelecionados.length > 0 && (
        <div className="fixed bottom-14 lg:bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 safe-area-pb">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-500">
                {servicosSelecionados.length} serviço{servicosSelecionados.length !== 1 && "s"}
              </p>
              <p className="text-xl font-bold text-slate-800">
                {formatCurrency(totalSelecionado)}
              </p>
            </div>
            <Link
              href={`/agendar/${lavaJato.slug}?servicos=${servicosSelecionados.join(",")}`}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
            >
              <Calendar className="w-5 h-5" />
              Agendar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

