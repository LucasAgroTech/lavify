// Componente de Byline do Autor - Exibido abaixo do título do artigo
// Segue diretrizes E-E-A-T para SEO de Autoridade

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import type { Author } from "@/lib/authors";

interface AuthorBylineProps {
  author: Author;
  dataPublicacao?: string;
  tempoLeitura?: number;
  className?: string;
}

export function AuthorByline({
  author,
  dataPublicacao,
  tempoLeitura,
  className = "",
}: AuthorBylineProps) {
  const dataFormatada = dataPublicacao
    ? new Date(dataPublicacao).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Avatar */}
      <Link
        href={`/autor/${author.slug}`}
        className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 ring-2 ring-white/20 hover:ring-cyan-500/50 transition-all"
      >
        {author.fotoUrl ? (
          <Image
            src={author.fotoUrl}
            alt={`Foto de ${author.nome}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
            {author.nome
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white/60 text-sm">Por</span>
          <Link
            href={`/autor/${author.slug}`}
            className="font-semibold text-white hover:text-cyan-400 transition-colors"
          >
            {author.nome}
          </Link>
          <span className="text-white/40">|</span>
          <span className="text-cyan-400 text-sm font-medium">
            {author.especialidade}
          </span>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-white/50 text-sm mt-1">
          {dataFormatada && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {dataFormatada}
            </span>
          )}
          {tempoLeitura && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {tempoLeitura} min de leitura
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Versão compacta para listagens
export function AuthorBylineCompact({
  author,
  className = "",
}: {
  author: Author;
  className?: string;
}) {
  return (
    <Link
      href={`/autor/${author.slug}`}
      className={`inline-flex items-center gap-2 group ${className}`}
    >
      <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0">
        {author.fotoUrl ? (
          <Image
            src={author.fotoUrl}
            alt={author.nome}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
            {author.nome[0]}
          </div>
        )}
      </div>
      <span className="text-white/70 text-sm group-hover:text-cyan-400 transition-colors">
        {author.nome}
      </span>
    </Link>
  );
}

