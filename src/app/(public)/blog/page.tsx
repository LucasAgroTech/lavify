import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Lightbulb,
  Scale,
  Rocket,
  ArrowRight,
  Droplets,
  ChevronRight,
  Zap,
  MapPin,
  PenLine,
  Calendar,
} from "lucide-react";
import {
  todasPaginasSEO,
  paginasProblemas,
  paginasFuncionalidades,
  paginasComparativos,
  paginasGuias,
  paginasLongTail,
} from "@/lib/seo-keywords";
import { cidadesBrasil } from "@/lib/seo-cities";
import { getAuthorForContent } from "@/lib/authors";
import { AuthorBylineCompact } from "@/components/AuthorByline";
import { prisma } from "@/lib/prisma";

// Sempre buscar dados frescos do banco
export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

// Buscar posts do banco de dados
async function getPostsDoBanco() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLICADO" },
      orderBy: { publicadoEm: "desc" },
      take: 10,
    });
    return posts;
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return [];
  }
}

export const metadata: Metadata = {
  title: "Blog e Guias para Lava Rápido | Lavify",
  description:
    "Artigos, guias e dicas para donos de lava jato. Aprenda como organizar, aumentar faturamento e profissionalizar seu lava rápido.",
  keywords: [
    "blog lava rapido",
    "guias lava jato",
    "dicas lava rapido",
    "como abrir lava jato",
    "gestao lava rapido",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog e Guias para Lava Rápido | Lavify",
    description:
      "Artigos, guias e dicas para donos de lava jato. Aprenda como organizar, aumentar faturamento e profissionalizar seu lava rápido.",
    type: "website",
    url: `${baseUrl}/blog`,
  },
};

// Categorias com ícones
const categorias = [
  {
    id: "problema",
    titulo: "Como Resolver",
    descricao: "Soluções para problemas do dia a dia",
    icon: Lightbulb,
    cor: "from-amber-500 to-orange-600",
    paginas: paginasProblemas,
  },
  {
    id: "funcionalidade",
    titulo: "Funcionalidades",
    descricao: "Conheça as ferramentas do sistema",
    icon: Rocket,
    cor: "from-cyan-500 to-blue-600",
    paginas: [...paginasFuncionalidades, ...paginasLongTail.filter(p => p.tipo === "funcionalidade")],
  },
  {
    id: "comparativo",
    titulo: "Comparativos",
    descricao: "Escolha a melhor opção",
    icon: Scale,
    cor: "from-violet-500 to-purple-600",
    paginas: [...paginasComparativos, ...paginasLongTail.filter(p => p.tipo === "comparativo")],
  },
  {
    id: "guia",
    titulo: "Guias Completos",
    descricao: "Aprenda do zero ao avançado",
    icon: BookOpen,
    cor: "from-emerald-500 to-green-600",
    paginas: paginasGuias,
  },
];

// Cidades populares para destaque
const cidadesDestaque = cidadesBrasil.slice(0, 12);

export default async function BlogPage() {
  // Autor do blog (E-E-A-T)
  const author = getAuthorForContent();
  
  // Buscar posts publicados do banco
  const postsDoBanco = await getPostsDoBanco();

  // JSON-LD para a página de blog com autor real
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Lavify - Gestão de Lava Rápido",
    description: "Artigos e guias para donos de lava jato",
    url: `${baseUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Lavify",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/lavify.png`,
      },
    },
    author: {
      "@type": "Person",
      name: author.nomeCompleto,
      url: `${baseUrl}/autor/${author.slug}`,
      jobTitle: author.cargo,
      sameAs: [author.redesSociais.linkedin].filter(Boolean),
    },
    blogPost: [
      // Posts do banco de dados (prioridade)
      ...postsDoBanco.map((post) => ({
        "@type": "BlogPosting",
        headline: post.titulo,
        description: post.metaDescricao,
        url: `${baseUrl}/blog/${post.slug}`,
        datePublished: post.publicadoEm?.toISOString(),
        dateModified: post.atualizadoEm?.toISOString(),
        author: {
          "@type": "Person",
          name: post.autorNome || author.nomeCompleto,
          url: `${baseUrl}/autor/${author.slug}`,
        },
      })),
      // Posts estáticos de SEO
      ...todasPaginasSEO.slice(0, 10 - postsDoBanco.length).map((pagina) => ({
        "@type": "BlogPosting",
        headline: pagina.h1,
        description: pagina.descricaoMeta,
        url: `${baseUrl}/${pagina.slug}`,
        author: {
          "@type": "Person",
          name: author.nomeCompleto,
          url: `${baseUrl}/autor/${author.slug}`,
        },
      })),
    ],
  };

  const breadcrumbJsonLd = {
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
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
              href="/para-empresas"
              className="text-white/70 hover:text-white font-medium hidden sm:block"
            >
              Para Empresas
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
        <span className="text-white/70">Blog</span>
      </div>

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Central de Conteúdo
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Blog e Guias para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Lava Rápido
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-8 max-w-3xl mx-auto">
            Artigos, guias práticos e dicas para donos de lava jato que querem
            profissionalizar e crescer seu negócio.
          </p>

          <div className="text-white/40 text-sm">
            {todasPaginasSEO.length + postsDoBanco.length} artigos disponíveis
          </div>
        </div>
      </section>

      {/* Posts do Blog (do banco de dados) */}
      {postsDoBanco.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-cyan-900/20 to-transparent border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <PenLine className="w-6 h-6 text-cyan-400" />
              Artigos do Blog
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsDoBanco.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-slate-800 border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-cyan-500/10 transition-all"
                >
                  <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-cyan-500/20 text-cyan-400 mb-3">
                    {post.categoria || "Artigo"}
                  </span>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
                    {post.titulo}
                  </h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">
                    {post.metaDescricao}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publicadoEm
                        ? new Date(post.publicadoEm).toLocaleDateString("pt-BR")
                        : "Recente"}
                    </div>
                    <div className="flex items-center gap-1 text-cyan-400 font-medium">
                      Ler
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Artigos em Destaque */}
      <section className="py-12 bg-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-400" />
            Em Destaque
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todasPaginasSEO
              .filter((p) => p.prioridade === 5)
              .slice(0, 6)
              .map((pagina) => (
                <Link
                  key={pagina.slug}
                  href={`/${pagina.slug}`}
                  className="group bg-slate-800 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-slate-800/80 transition-all"
                >
                  <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-cyan-500/20 text-cyan-400 mb-3">
                    {pagina.tipo}
                  </span>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                    {pagina.h1.split(":")[0]}
                  </h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">
                    {pagina.descricaoMeta}
                  </p>
                  <div className="flex items-center justify-between">
                    <AuthorBylineCompact author={author} />
                    <div className="flex items-center gap-1 text-cyan-400 text-sm font-medium">
                      Ler
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      {categorias.map((categoria) => (
        <section key={categoria.id} className="py-12 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoria.cor} flex items-center justify-center`}
              >
                <categoria.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{categoria.titulo}</h2>
                <p className="text-white/50 text-sm">{categoria.descricao}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoria.paginas.map((pagina) => (
                <Link
                  key={pagina.slug}
                  href={`/${pagina.slug}`}
                  className="group p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2 text-sm">
                    {pagina.h1.split(":")[0]}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-cyan-400 text-xs">
                    Ler
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Páginas por Cidade */}
      <section className="py-12 bg-slate-800/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Por Cidade</h2>
              <p className="text-white/50 text-sm">
                Sistema para lava rápido em sua cidade
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {cidadesDestaque.map((cidade) => (
              <Link
                key={cidade.slug}
                href={`/sistema-lava-rapido/${cidade.slug}`}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 hover:border-rose-500/30 transition-all text-sm"
              >
                {cidade.nome}, {cidade.uf}
              </Link>
            ))}
          </div>

          <Link
            href="/sistema-lava-rapido/sao-paulo"
            className="inline-flex items-center gap-1 text-cyan-400 text-sm font-medium hover:text-cyan-300"
          >
            Ver todas as {cidadesBrasil.length} cidades
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Testar o Lavify?
          </h2>
          <p className="text-cyan-100 text-lg mb-8">
            7 dias grátis, sem cartão de crédito
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-cyan-700 font-bold rounded-2xl hover:shadow-2xl transition-all text-lg"
          >
            Começar Grátis
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
              <Link href="/encontrar" className="hover:text-white">
                Encontrar Lava Jato
              </Link>
              <Link href="/entrar" className="hover:text-white">
                Entrar
              </Link>
              <Link href="/cadastro" className="hover:text-white">
                Cadastrar
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

