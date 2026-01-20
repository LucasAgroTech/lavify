import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  BookOpen,
  Droplets,
} from "lucide-react";
import {
  getAuthorBySlug,
  getAllAuthorSlugs,
  generateAuthorPersonSchema,
} from "@/lib/authors";
import { todasPaginasSEO, paginasGuias } from "@/lib/seo-keywords";
import { problemasLavaJato } from "@/lib/seo-problems";
import { AuthorBoxFeatured } from "@/components/AuthorBox";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

// Gerar páginas estaticamente
export async function generateStaticParams() {
  const slugs = getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Metadados dinâmicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return { title: "Autor não encontrado" };
  }

  return {
    title: `${author.nomeCompleto} | ${author.cargo} - Lavify`,
    description: author.bio,
    alternates: {
      canonical: `/autor/${author.slug}`,
    },
    openGraph: {
      title: `${author.nomeCompleto} - ${author.cargo}`,
      description: author.bio,
      type: "profile",
      url: `${baseUrl}/autor/${author.slug}`,
      images: [
        {
          url: `${baseUrl}${author.fotoUrl}`,
          width: 400,
          height: 400,
          alt: `Foto de ${author.nome}`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: author.nomeCompleto,
      description: author.bio,
    },
    // Garantir indexação
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  // Schema JSON-LD para Person
  const personSchema = generateAuthorPersonSchema(author, baseUrl);

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: author.nome,
        item: `${baseUrl}/autor/${author.slug}`,
      },
    ],
  };

  // Artigos do autor (todos os artigos são atribuídos ao autor)
  const artigos = [
    ...todasPaginasSEO.slice(0, 12),
    ...problemasLavaJato.slice(0, 6).map((p) => ({
      slug: `guias/${p.slug}`,
      titulo: p.tituloCompleto,
      h1: p.titulo,
      descricaoMeta: p.descricao,
      tipo: "guia" as const,
      keywords: p.keywords,
      prioridade: 4,
    })),
  ];

  // Categorias únicas
  const categorias = [...new Set(artigos.map((a) => a.tipo))];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Lavify</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-white/70 hover:text-white font-medium hidden sm:block"
            >
              Blog
            </Link>
            <Link
              href="/cadastro"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm"
            >
              Testar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-sm text-white/50">
        <Link href="/" className="hover:text-white/70">
          Home
        </Link>
        <ChevronRight className="inline-block w-3 h-3 mx-2" />
        <Link href="/blog" className="hover:text-white/70">
          Blog
        </Link>
        <ChevronRight className="inline-block w-3 h-3 mx-2" />
        <span className="text-white/70">{author.nome}</span>
      </div>

      {/* Hero - Perfil do Autor */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <AuthorBoxFeatured author={author} />
        </div>
      </section>

      {/* Artigos do Autor */}
      <section className="py-16 bg-slate-800/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                Artigos de {author.nome.split(" ")[0]}
              </h2>
              <p className="text-white/50 text-sm">
                {artigos.length} artigos publicados
              </p>
            </div>
          </div>

          {/* Filtros por categoria */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categorias.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/70 text-sm capitalize"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Grid de artigos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artigos.map((artigo) => (
              <Link
                key={artigo.slug}
                href={`/${artigo.slug}`}
                className="group bg-slate-800 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all"
              >
                <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-cyan-500/20 text-cyan-400 mb-3">
                  {artigo.tipo}
                </span>
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {artigo.h1.split(":")[0]}
                </h3>
                <p className="text-white/50 text-sm line-clamp-2 mb-4">
                  {artigo.descricaoMeta}
                </p>
                <div className="flex items-center gap-1 text-cyan-400 text-sm font-medium">
                  Ler artigo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Ver mais */}
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all"
            >
              Ver todos os artigos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Experimente o Lavify
          </h2>
          <p className="text-cyan-100 text-lg mb-8">
            O sistema de gestão para lava-rápidos criado por {author.nome.split(" ")[0]}
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-cyan-700 font-bold rounded-2xl hover:shadow-2xl transition-all text-lg"
          >
            Testar Grátis por 7 Dias
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Lavify</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <Link href="/para-empresas" className="hover:text-white">
                Para Empresas
              </Link>
              <Link href="/blog" className="hover:text-white">
                Blog
              </Link>
              <Link href="/encontrar" className="hover:text-white">
                Encontrar Lava Jato
              </Link>
              <Link href="/entrar" className="hover:text-white">
                Entrar
              </Link>
            </nav>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
            © 2026 Lavify. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

