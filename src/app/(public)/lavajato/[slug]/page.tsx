"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  BadgeCheck,
  Calendar,
  MessageCircle,
  Loader2,
  Check,
  ArrowLeft,
  Share,
  Heart,
  ChevronRight,
} from "lucide-react";

interface Servico {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  tempoEstimado: number;
  destaque: boolean;
}

interface Avaliacao {
  id: string;
  nota: number;
  comentario: string | null;
  createdAt: string;
  cliente: {
    nome: string;
  };
}

interface LavaJato {
  id: string;
  nome: string;
  slug: string;
  telefone: string | null;
  whatsapp: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  descricao: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  corPrimaria: string;
  aceitaAgendamento: boolean;
  verificado: boolean;
  mediaAvaliacoes: number;
  totalAvaliacoes: number;
  servicos: Servico[];
  avaliacoes: Avaliacao[];
}

export default function LavaJatoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

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
    .filter((s) => servicosSelecionados.includes(s.id))
    .reduce((acc, s) => acc + s.preco, 0) || 0;

  const servicosExibidos = showAllServices
    ? lavaJato?.servicos || []
    : (lavaJato?.servicos || []).slice(0, 4);

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
        className="h-48 lg:h-64 bg-gradient-to-br from-slate-300 to-slate-400 relative"
        style={{
          backgroundImage: lavaJato.bannerUrl ? `url(${lavaJato.bannerUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg lg:text-2xl font-bold text-slate-800 truncate">
                  {lavaJato.nome}
                </h1>
                {lavaJato.verificado && (
                  <BadgeCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                )}
              </div>

              {(lavaJato.endereco || lavaJato.cidade) && (
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {[lavaJato.endereco, lavaJato.cidade, lavaJato.estado].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-800">
                    {lavaJato.mediaAvaliacoes || "Novo"}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({lavaJato.totalAvaliacoes})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {lavaJato.descricao && (
            <p className="text-sm text-slate-600 mt-4 line-clamp-2">
              {lavaJato.descricao}
            </p>
          )}

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
            {lavaJato.whatsapp && (
              <a
                href={`https://wa.me/55${lavaJato.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-100 rounded-xl text-emerald-700 text-sm font-medium active:bg-emerald-200"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Services */}
        <div className="mt-4 bg-white rounded-2xl shadow-sm p-4">
          <h2 className="font-bold text-slate-800 mb-4">Serviços</h2>

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
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{servico.nome}</span>
                      {servico.destaque && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
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

          {lavaJato.servicos.length > 4 && !showAllServices && (
            <button
              onClick={() => setShowAllServices(true)}
              className="w-full mt-3 py-2 text-sm text-cyan-600 font-medium"
            >
              Ver todos os {lavaJato.servicos.length} serviços
            </button>
          )}
        </div>

        {/* Reviews */}
        {lavaJato.avaliacoes.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">Avaliações</h2>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold">{lavaJato.mediaAvaliacoes}</span>
              </div>
            </div>

            <div className="space-y-4">
              {lavaJato.avaliacoes.slice(0, 3).map((avaliacao) => (
                <div key={avaliacao.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                      {avaliacao.cliente.nome.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">
                        {avaliacao.cliente.nome}
                      </p>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < avaliacao.nota ? "text-amber-400 fill-amber-400" : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {avaliacao.comentario && (
                    <p className="text-sm text-slate-600 mt-2">{avaliacao.comentario}</p>
                  )}
                </div>
              ))}
            </div>

            {lavaJato.avaliacoes.length > 3 && (
              <button className="w-full mt-3 py-2 text-sm text-cyan-600 font-medium flex items-center justify-center gap-1">
                Ver todas avaliações
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
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
            {lavaJato.aceitaAgendamento ? (
              <Link
                href={`/agendar/${lavaJato.slug}?servicos=${servicosSelecionados.join(",")}`}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
              >
                <Calendar className="w-5 h-5" />
                Agendar
              </Link>
            ) : (
              <a
                href={`https://wa.me/55${lavaJato.whatsapp?.replace(/\D/g, "")}?text=Olá! Gostaria de agendar uma lavagem.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
