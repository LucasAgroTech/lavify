import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  ArrowRight, 
  ChevronDown,
  FileText,
  BookOpen,
  Calculator,
  ClipboardList,
  Table,
  MapPin
} from "lucide-react";
import { getCidadeBySlug, cidadesBrasil } from "@/lib/seo-cities";
import { getProblemaBySlug, problemasLavaJato, ProblemaSEO } from "@/lib/seo-problems";
import { getConteudoRico } from "@/data/seo-guias-content";
import {
  getAuthorForContent,
  generateArticleWithAuthorSchema,
} from "@/lib/authors";
import { AuthorByline } from "@/components/AuthorByline";
import { AuthorBox } from "@/components/AuthorBox";

// Função para converter markdown simples em HTML
function processarMarkdown(texto: string): string {
  if (!texto) return "";
  return texto
    // Negrito: **texto** ou __texto__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Itálico: *texto* ou _texto_
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    // Quebras de linha: \n\n para <br/><br/>
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Parser do slug: pode ser apenas problema ou problema-cidade
function parseSlug(slug: string): { problemaSlug: string; cidadeSlug: string | null } | null {
  // Primeiro tenta encontrar problema exato
  const problemaExato = getProblemaBySlug(slug);
  if (problemaExato) {
    return { problemaSlug: slug, cidadeSlug: null };
  }
  
  // Tenta encontrar problema + cidade
  for (const problema of problemasLavaJato) {
    if (slug.startsWith(problema.slug + "-")) {
      const cidadeSlug = slug.substring(problema.slug.length + 1);
      const cidade = getCidadeBySlug(cidadeSlug);
      if (cidade) {
        return { problemaSlug: problema.slug, cidadeSlug };
      }
    }
  }
  
  return null;
}

// Gerar páginas estáticas
export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  
  // Todas as páginas de problemas sem cidade
  for (const problema of problemasLavaJato) {
    params.push({ slug: problema.slug });
  }
  
  // Problemas com cidade (apenas top 20 cidades para alguns problemas)
  const problemasComCidade = [
    "tabela-precos-lavagem",
    "tabela-precos-estetica-automotiva",
    "como-abrir-lava-jato",
  ];
  
  const cidadesTop = cidadesBrasil.slice(0, 20);
  
  for (const problemaSlug of problemasComCidade) {
    for (const cidade of cidadesTop) {
      params.push({ slug: `${problemaSlug}-${cidade.slug}` });
    }
  }
  
  return params;
}

// Gerar metadata dinâmica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  
  if (!parsed) return { title: "Página não encontrada" };
  
  const problema = getProblemaBySlug(parsed.problemaSlug);
  if (!problema) return { title: "Página não encontrada" };
  
  const cidade = parsed.cidadeSlug ? getCidadeBySlug(parsed.cidadeSlug) : null;
  const localidade = cidade ? ` em ${cidade.nome}` : "";

  const title = `${problema.tituloCompleto}${localidade} | Lavify`;
  const description = `${problema.descricao} Guia completo e atualizado para ${new Date().getFullYear()}.`;

  return {
    title,
    description,
    keywords: problema.keywords,
    openGraph: {
      title,
      description,
      type: "article",
      locale: "pt_BR",
      siteName: "Lavify",
    },
    alternates: {
      canonical: `/guias/${slug}`,
    },
  };
}

// Ícone por tipo
const iconesPorTipo: Record<string, React.ComponentType<{ className?: string }>> = {
  guia: BookOpen,
  tabela: Table,
  checklist: ClipboardList,
  calculadora: Calculator,
  modelo: FileText,
};

// Buscar conteúdo rico do arquivo de dados
function getConteudoFallback(problema: ProblemaSEO, cidade: { nome: string; uf: string; regiao: string; slug?: string; estado?: string; populacao?: number; keywords?: string[] } | null) {
  // Usar o conteúdo rico do arquivo de dados
  return getConteudoRico(problema.slug, cidade);
}

export default async function GuiaPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  
  if (!parsed) notFound();
  
  const problema = getProblemaBySlug(parsed.problemaSlug);
  if (!problema) notFound();
  
  const cidadeData = parsed.cidadeSlug ? getCidadeBySlug(parsed.cidadeSlug) : null;
  const cidade = cidadeData || null;
  const localidade = cidade ? ` em ${cidade.nome}` : "";
  
  const conteudo = getConteudoFallback(problema, cidade);
  const Icon = iconesPorTipo[problema.tipo] || BookOpen;
  
  // Guias relacionados
  const guiasRelacionados = problemasLavaJato
    .filter(p => p.slug !== problema.slug)
    .slice(0, 4);
  
  // Cidades relacionadas (se for guia com cidade)
  const cidadesRelacionadas = cidade
    ? cidadesBrasil.filter(c => c.regiao === cidade.regiao && c.slug !== cidade.slug).slice(0, 6)
    : [];

  // Autor do artigo (E-E-A-T)
  const author = getAuthorForContent("guia");
  const dataPublicacao = "2026-01-01";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

  // JSON-LD com Autor (E-E-A-T)
  const jsonLd = generateArticleWithAuthorSchema(
    {
      titulo: conteudo.titulo,
      descricao: conteudo.introducao,
      slug: `guias/${slug}`,
      dataPublicacao,
    },
    author,
    baseUrl
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Lavify
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/para-empresas" className="text-white/70 hover:text-white text-sm hidden md:block">
                Para Empresas
              </Link>
              <Link
                href="/cadastro"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90"
              >
                Testar Grátis
              </Link>
            </div>
          </div>
        </header>

        {/* Hero do Artigo */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
              <Link href="/" className="hover:text-white/70">Início</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white/70">Guias</Link>
              <span>/</span>
              <span className="text-cyan-400">{problema.titulo}</span>
            </div>

            {/* Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-medium">
                <Icon className="w-4 h-4" />
                {problema.tipo.charAt(0).toUpperCase() + problema.tipo.slice(1)}
              </span>
              {cidade && (
                <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 px-4 py-1.5 rounded-full text-sm">
                  <MapPin className="w-4 h-4" />
                  {cidade.nome}, {cidade.uf}
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {problema.emoji} {conteudo.titulo}
            </h1>
            
            <p className="text-xl text-white/70 mb-8">
              {conteudo.subtitulo}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/50 mb-8">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {conteudo.secoes?.length || 3} seções
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Atualizado {new Date().getFullYear()}
              </span>
            </div>

            {/* Byline do Autor - E-E-A-T */}
            <AuthorByline
              author={author}
              dataPublicacao={dataPublicacao}
              tempoLeitura={7}
            />
          </div>
        </section>

        {/* Conteúdo */}
        <article className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            {/* Introdução */}
            <p 
              className="text-lg text-slate-600 leading-relaxed mb-12"
              dangerouslySetInnerHTML={{ __html: processarMarkdown(conteudo.introducao) }}
            />

            {/* Tabela (se houver) */}
            {conteudo.tabela && (
              <div className="mb-12 overflow-x-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{conteudo.tabela.titulo}</h2>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      {conteudo.tabela.colunas.map((col, i) => (
                        <th key={i} className="text-left p-4 font-semibold text-slate-900 border-b-2 border-slate-200">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {conteudo.tabela.linhas.map((linha, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        {linha.map((cel, j) => (
                          <td key={j} className={`p-4 ${j === 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                            {cel}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Checklist (se houver) */}
            {conteudo.checklist && (
              <div className="mb-12 bg-slate-50 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-cyan-600" />
                  Checklist Completo
                </h2>
                <div className="space-y-4">
                  {conteudo.checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-200">
                      <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{item.item}</h4>
                        <p className="text-slate-600 text-sm">{item.descricao}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seções */}
            {conteudo.secoes?.map((secao, index) => {
              const secaoComLista = secao as { titulo: string; conteudo: string; lista?: string[] };
              return (
                <div key={index} className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">{secao.titulo}</h2>
                  <div 
                    className="text-slate-600 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: processarMarkdown(secao.conteudo) }}
                  />
                  {secaoComLista.lista && secaoComLista.lista.length > 0 && (
                    <ul className="list-none space-y-2">
                      {secaoComLista.lista.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-600">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span dangerouslySetInnerHTML={{ __html: processarMarkdown(item) }} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}

            {/* FAQ */}
            {conteudo.faq && conteudo.faq.length > 0 && (
              <div className="mt-12 pt-12 border-t border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Perguntas Frequentes</h2>
                <div className="space-y-4">
                  {conteudo.faq.map((item, index) => (
                    <details 
                      key={index}
                      className="group bg-slate-50 border border-slate-200 rounded-xl overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                        <span className="font-medium text-slate-900 pr-4">{item.pergunta}</span>
                        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <div 
                        className="px-5 pb-5 text-slate-600"
                        dangerouslySetInnerHTML={{ __html: processarMarkdown(item.resposta) }}
                      />
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Box do Autor - E-E-A-T */}
            <div className="mt-12 mb-12">
              <AuthorBox author={author} />
            </div>

            {/* CTA Box */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Automatize seu Lava Jato com o Lavify
              </h3>
              <p className="text-white/80 mb-6">
                Controle pátio, agendamentos, financeiro e equipe em um só lugar. Teste grátis!
              </p>
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-white text-cyan-600 px-8 py-3 rounded-xl font-bold hover:bg-white/90"
              >
                Testar Grátis
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </article>

        {/* Guias Relacionados */}
        <section className="py-12 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Outros Guias para Lava Jato
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {guiasRelacionados.map((guia) => {
                const GuiaIcon = iconesPorTipo[guia.tipo] || BookOpen;
                return (
                  <Link
                    key={guia.slug}
                    href={`/guias/${guia.slug}`}
                    className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-cyan-500 hover:shadow-lg transition-all"
                  >
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-600 uppercase tracking-wide mb-2">
                      <GuiaIcon className="w-4 h-4" />
                      {guia.tipo}
                    </span>
                    <h3 className="font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      {guia.emoji} {guia.titulo}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cidades Relacionadas */}
        {cidadesRelacionadas.length > 0 && (
          <section className="py-12">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-xl font-bold text-slate-900 text-center mb-6">
                {problema.titulo} em outras cidades
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {cidadesRelacionadas.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/guias/${problema.slug}-${c.slug}`}
                    className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-slate-600 hover:text-cyan-600 hover:border-cyan-500 transition-all text-sm"
                  >
                    {c.nome}, {c.uf}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-slate-900 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <Link href="/" className="text-2xl font-bold text-white">Lavify</Link>
                <p className="text-white/50 text-sm mt-2">Sistema de gestão para lava rápidos</p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
                <Link href="/para-empresas" className="hover:text-white">Para Empresas</Link>
                <Link href="/blog" className="hover:text-white">Guias</Link>
                <Link href="/login" className="hover:text-white">Entrar</Link>
              </div>
            </div>
            <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
              © {new Date().getFullYear()} Lavify. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

