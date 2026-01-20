import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  BookOpen,
  Droplets,
  Calendar,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  getAuthorBySlug,
  generateArticleWithAuthorSchema,
  lucasPinheiro,
} from "@/lib/authors";
import { AuthorByline } from "@/components/AuthorByline";
import { AuthorBox } from "@/components/AuthorBox";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

// Buscar post do banco
async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLICADO" },
  });
  return post;
}

// Buscar posts relacionados
async function getPostsRelacionados(categoria: string, slugAtual: string) {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: "PUBLICADO",
      categoria,
      slug: { not: slugAtual },
    },
    take: 4,
    orderBy: { publicadoEm: "desc" },
  });
  return posts;
}

// Metadados dinâmicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post não encontrado" };
  }

  return {
    title: `${post.titulo} | Blog Lavify`,
    description: post.metaDescricao,
    keywords: post.palavrasChave,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.titulo,
      description: post.metaDescricao,
      type: "article",
      url: `${baseUrl}/blog/${post.slug}`,
      publishedTime: post.publicadoEm?.toISOString(),
      modifiedTime: post.atualizadoEm.toISOString(),
      authors: [post.autorNome],
    },
    twitter: {
      card: "summary_large_image",
      title: post.titulo,
      description: post.metaDescricao,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Função para processar Markdown simples
function processarMarkdown(texto: string): string {
  if (!texto) return "";
  return texto
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Parsear conteúdo JSON
  let secoes: { titulo: string; conteudo: string }[] = [];
  try {
    secoes = JSON.parse(post.conteudo);
  } catch {
    secoes = [];
  }

  // Parsear FAQ
  let faq: { pergunta: string; resposta: string }[] = [];
  try {
    if (post.faq) {
      faq = JSON.parse(post.faq);
    }
  } catch {
    faq = [];
  }

  // Autor
  const author = getAuthorBySlug(post.autorId) || lucasPinheiro;

  // Posts relacionados
  const postsRelacionados = await getPostsRelacionados(post.categoria, post.slug);

  // Schema JSON-LD
  const articleSchema = generateArticleWithAuthorSchema(
    {
      titulo: post.titulo,
      descricao: post.metaDescricao,
      slug: `blog/${post.slug}`,
      dataPublicacao: post.publicadoEm?.toISOString().split("T")[0],
      dataModificacao: post.atualizadoEm.toISOString().split("T")[0],
    },
    author,
    baseUrl
  );

  // FAQ Schema
  const faqSchema = faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta,
      },
    })),
  } : null;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.titulo, item: `${baseUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

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
      <div className="max-w-4xl mx-auto px-4 pt-6 text-sm text-white/50">
        <Link href="/" className="hover:text-white/70">Home</Link>
        <ChevronRight className="inline-block w-3 h-3 mx-2" />
        <Link href="/blog" className="hover:text-white/70">Blog</Link>
        <ChevronRight className="inline-block w-3 h-3 mx-2" />
        <span className="text-white/70">{post.titulo.slice(0, 40)}...</span>
      </div>

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Categoria */}
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            {post.categoria.charAt(0).toUpperCase() + post.categoria.slice(1)}
          </span>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.titulo}
          </h1>

          {/* Meta descrição */}
          <p className="text-lg text-white/60 mb-8">
            {post.metaDescricao}
          </p>

          {/* Byline */}
          <AuthorByline
            author={author}
            dataPublicacao={post.publicadoEm?.toISOString().split("T")[0]}
            tempoLeitura={Math.ceil((post.introducao.length + post.conteudo.length) / 1500)}
          />
        </div>
      </section>

      {/* Conteúdo */}
      <article className="pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Introdução */}
          <div
            className="text-lg text-white/80 leading-relaxed mb-12"
            dangerouslySetInnerHTML={{ __html: processarMarkdown(post.introducao) }}
          />

          {/* Seções */}
          {secoes.map((secao, index) => (
            <div key={index} className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
                  {index + 1}
                </span>
                {secao.titulo}
              </h2>
              <div
                className="text-white/70 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: processarMarkdown(secao.conteudo) }}
              />
            </div>
          ))}

          {/* FAQ */}
          {faq.length > 0 && (
            <div className="mt-12 pt-12 border-t border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <details
                    key={index}
                    className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <span className="font-medium text-white pr-4">
                        {item.pergunta}
                      </span>
                      <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div
                      className="px-5 pb-5 text-white/60"
                      dangerouslySetInnerHTML={{ __html: processarMarkdown(item.resposta) }}
                    />
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Conclusão */}
          {post.conclusao && (
            <div className="mt-12 p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                Conclusão
              </h2>
              <div
                className="text-white/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: processarMarkdown(post.conclusao) }}
              />
            </div>
          )}

          {/* Palavras-chave */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.palavrasChave.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded-full text-white/50"
              >
                {kw}
              </span>
            ))}
          </div>

          {/* Author Box */}
          <div className="mt-12">
            <AuthorBox author={author} />
          </div>
        </div>
      </article>

      {/* Posts Relacionados */}
      {postsRelacionados.length > 0 && (
        <section className="py-16 bg-slate-800/50 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Artigos Relacionados
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {postsRelacionados.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group bg-slate-800 border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-all"
                >
                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded bg-cyan-500/20 text-cyan-400 mb-2">
                    {p.categoria}
                  </span>
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 text-sm">
                    {p.titulo}
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
      )}

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
              <Link href="/para-empresas" className="hover:text-white">Para Empresas</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/entrar" className="hover:text-white">Entrar</Link>
              <Link href="/cadastro" className="hover:text-white">Cadastrar</Link>
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

