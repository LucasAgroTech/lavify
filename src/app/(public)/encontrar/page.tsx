"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  Clock,
  BadgeCheck,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";

interface LavaJato {
  id: string;
  nome: string;
  slug: string;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  descricao: string | null;
  logoUrl: string | null;
  corPrimaria: string;
  aceitaAgendamento: boolean;
  verificado: boolean;
  mediaAvaliacoes: number;
  totalAvaliacoes: number;
  servicos: {
    id: string;
    nome: string;
    preco: number;
  }[];
}

function EncontrarContent() {
  const searchParams = useSearchParams();
  const buscaInicial = searchParams.get("busca") || "";

  const [lavajatos, setLavajatos] = useState<LavaJato[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState(buscaInicial);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLavaJatos();
  }, []);

  async function fetchLavaJatos() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busca) params.set("busca", busca);

      const res = await fetch(`/api/public/lavajatos?${params}`);
      const data = await res.json();
      setLavajatos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro:", error);
      setLavajatos([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchLavaJatos();
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="min-h-screen">
      {/* Search Header - Sticky on Mobile */}
      <div className="sticky top-12 lg:top-16 z-40 bg-white border-b border-slate-100 px-4 py-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar lava jato..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-600" />
          </button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4">
            {["Próximos", "Melhores avaliados", "Menor preço", "Agendamento online"].map(
              (filter) => (
                <button
                  key={filter}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 active:bg-slate-200"
                >
                  {filter}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
          </div>
        ) : lavajatos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700">
              Nenhum lava jato encontrado
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Tente buscar em outra região
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Results count */}
            <p className="text-sm text-slate-500">
              {lavajatos.length} lava jato{lavajatos.length !== 1 && "s"} encontrado{lavajatos.length !== 1 && "s"}
            </p>

            {lavajatos.map((lj) => (
              <Link
                key={lj.id}
                href={`/lavajato/${lj.slug}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 active:scale-[0.99] transition-transform"
              >
                <div className="flex gap-4 p-4">
                  {/* Logo */}
                  <div
                    className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl"
                    style={{
                      background: `linear-gradient(135deg, ${lj.corPrimaria}, #3b82f6)`,
                    }}
                  >
                    {lj.logoUrl ? (
                      <img
                        src={lj.logoUrl}
                        alt={lj.nome}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      lj.nome.charAt(0)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-slate-800 truncate">
                            {lj.nome}
                          </h3>
                          {lj.verificado && (
                            <BadgeCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        {(lj.cidade || lj.endereco) && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {lj.cidade || lj.endereco}
                          </p>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium text-slate-700">
                          {lj.mediaAvaliacoes || "Novo"}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 mt-2">
                      {lj.aceitaAgendamento && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          Agendamento
                        </span>
                      )}
                      {lj.servicos.length > 0 && (
                        <span className="text-xs text-slate-500">
                          A partir de{" "}
                          <span className="font-semibold text-cyan-600">
                            {formatCurrency(Math.min(...lj.servicos.map((s) => s.preco)))}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EncontrarPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
      </div>
    }>
      <EncontrarContent />
    </Suspense>
  );
}
