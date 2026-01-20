// Componente Box de Autor - Exibido ao final de cada artigo
// Segue diretrizes E-E-A-T para SEO de Autoridade

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Github, Instagram, Twitter, Globe, ArrowRight } from "lucide-react";
import type { Author } from "@/lib/authors";

interface AuthorBoxProps {
  author: Author;
  className?: string;
  variant?: "default" | "compact" | "featured";
}

export function AuthorBox({
  author,
  className = "",
  variant = "default",
}: AuthorBoxProps) {
  const socialLinks = [
    { key: "linkedin", icon: Linkedin, url: author.redesSociais.linkedin, label: "LinkedIn" },
    { key: "github", icon: Github, url: author.redesSociais.github, label: "GitHub" },
    { key: "instagram", icon: Instagram, url: author.redesSociais.instagram, label: "Instagram" },
    { key: "twitter", icon: Twitter, url: author.redesSociais.twitter, label: "Twitter" },
    { key: "website", icon: Globe, url: author.redesSociais.website, label: "Website" },
  ].filter((link) => link.url);

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl ${className}`}>
        <Link
          href={`/autor/${author.slug}`}
          className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0"
        >
          {author.fotoUrl ? (
            <Image
              src={author.fotoUrl}
              alt={author.nome}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
              {author.nome.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
          )}
        </Link>
        <div>
          <Link
            href={`/autor/${author.slug}`}
            className="font-semibold text-white hover:text-cyan-400 transition-colors"
          >
            {author.nome}
          </Link>
          <p className="text-cyan-400 text-sm">{author.cargo}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <Link
          href={`/autor/${author.slug}`}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 ring-4 ring-cyan-500/20 hover:ring-cyan-500/40 transition-all mx-auto sm:mx-0"
        >
          {author.fotoUrl ? (
            <Image
              src={author.fotoUrl}
              alt={`Foto de ${author.nome}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
              {author.nome
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-white/50 text-sm mb-1">Escrito por</p>
          <Link
            href={`/autor/${author.slug}`}
            className="text-xl md:text-2xl font-bold text-white hover:text-cyan-400 transition-colors"
          >
            {author.nome}
          </Link>
          <p className="text-cyan-400 font-medium mt-1">
            {author.cargo} · {author.especialidade}
          </p>

          {/* Bio */}
          <p className="text-white/70 mt-4 leading-relaxed text-sm md:text-base">
            {author.bio}
          </p>

          {/* Social Links */}
          <div className="flex items-center justify-center sm:justify-start gap-3 mt-5">
            {socialLinks.map((link) => (
              <a
                key={link.key}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer me"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                aria-label={`${author.nome} no ${link.label}`}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA para página do autor */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <Link
          href={`/autor/${author.slug}`}
          className="inline-flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors group"
        >
          Ver todos os artigos de {author.nome.split(" ")[0]}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

// Versão para página de autor (featured)
export function AuthorBoxFeatured({
  author,
  className = "",
}: {
  author: Author;
  className?: string;
}) {
  const socialLinks = [
    { key: "linkedin", icon: Linkedin, url: author.redesSociais.linkedin, label: "LinkedIn" },
    { key: "github", icon: Github, url: author.redesSociais.github, label: "GitHub" },
    { key: "instagram", icon: Instagram, url: author.redesSociais.instagram, label: "Instagram" },
    { key: "twitter", icon: Twitter, url: author.redesSociais.twitter, label: "Twitter" },
    { key: "website", icon: Globe, url: author.redesSociais.website, label: "Website" },
  ].filter((link) => link.url);

  return (
    <div className={`text-center ${className}`}>
      {/* Avatar grande */}
      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 mx-auto ring-4 ring-cyan-500/30 mb-6">
        {author.fotoUrl ? (
          <Image
            src={author.fotoUrl}
            alt={`Foto de ${author.nomeCompleto}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-4xl">
            {author.nome
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        )}
      </div>

      {/* Nome e cargo */}
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {author.nomeCompleto}
      </h1>
      <p className="text-xl text-cyan-400 font-medium mb-4">
        {author.cargo}
      </p>
      <p className="text-white/60 mb-6">{author.especialidade}</p>

      {/* Social Links - rel="me" para verificação */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {socialLinks.map((link) => (
          <a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer me"
            className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/70 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
            aria-label={`${author.nome} no ${link.label}`}
          >
            <link.icon className="w-6 h-6" />
          </a>
        ))}
      </div>

      {/* Bio expandida */}
      <div className="max-w-3xl mx-auto text-left">
        <div className="prose prose-invert prose-lg">
          {author.bioExpandida.split("\n\n").map((paragrafo, index) => (
            <p key={index} className="text-white/70 leading-relaxed mb-4">
              {paragrafo}
            </p>
          ))}
        </div>
      </div>

      {/* Credenciais */}
      <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
        {/* Formação */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              🎓
            </span>
            Formação
          </h3>
          <ul className="space-y-2">
            {author.credenciais.formacao.map((item, index) => (
              <li key={index} className="text-white/60 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Certificações */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              ✓
            </span>
            Certificações
          </h3>
          <ul className="space-y-2">
            {author.credenciais.certificacoes.map((item, index) => (
              <li key={index} className="text-white/60 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Experiência */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-400">
              💼
            </span>
            Experiência
          </h3>
          <ul className="space-y-2">
            {author.credenciais.experiencia.map((item, index) => (
              <li key={index} className="text-white/60 text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

