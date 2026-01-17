import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Star, 
  MessageCircle,
  Calendar,
  LayoutDashboard,
  Package,
  Users,
  TrendingUp,
  Shield,
  Clock,
  ChevronDown,
  MapPin,
  Smartphone
} from "lucide-react";
import { getCidadeBySlug, getAllCidadeSlugs, CidadeSEO, cidadesBrasil } from "@/lib/seo-cities";
import { getConteudoCidade, ConteudoSEO } from "@/data/seo-content";
import { getPaginasDestaque } from "@/lib/seo-keywords";

interface PageProps {
  params: Promise<{ cidade: string }>;
}

// Gerar páginas estáticas para todas as cidades
export async function generateStaticParams() {
  const slugs = getAllCidadeSlugs();
  return slugs.map((cidade) => ({ cidade }));
}

// Gerar metadata dinâmica para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cidade: cidadeSlug } = await params;
  const cidade = getCidadeBySlug(cidadeSlug);
  
  if (!cidade) {
    return { title: "Página não encontrada" };
  }

  const title = `Sistema para Lava Rápido em ${cidade.nome} | Lavify`;
  const description = `Sistema completo para gestão de lava jato em ${cidade.nome}, ${cidade.uf}. Controle pátio, agendamentos, estoque e financeiro pelo celular. Teste grátis!`;

  return {
    title,
    description,
    keywords: [
      `sistema para lava rápido ${cidade.nome}`,
      `sistema para lava jato ${cidade.nome}`,
      `software lava jato ${cidade.uf}`,
      `gestão lava rápido ${cidade.nome}`,
      `controle lava jato ${cidade.nome}`,
      ...cidade.keywords,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      siteName: "Lavify",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/sistema-lava-rapido/${cidade.slug}`,
    },
  };
}

// Ícones para os benefícios
const iconsBeneficios = [LayoutDashboard, Calendar, MessageCircle, Package, Users, TrendingUp];

// Estatísticas fixas
const estatisticas = [
  { valor: "-50%", label: "Tempo em gestão" },
  { valor: "+30%", label: "Aumento no faturamento" },
  { valor: "24h", label: "Agendamentos online" },
  { valor: "100%", label: "Controle pelo celular" },
];

export default async function CidadePage({ params }: PageProps) {
  const { cidade: cidadeSlug } = await params;
  const cidade = getCidadeBySlug(cidadeSlug);
  
  if (!cidade) {
    notFound();
  }

  const conteudo = getConteudoCidade(cidadeSlug);
  
  if (!conteudo) {
    notFound();
  }

  // Páginas de conteúdo relacionadas
  const paginasRelacionadas = getPaginasDestaque(4);

  // Cidades da mesma região para internal linking
  const cidadesProximas = cidadesBrasil
    .filter(c => c.regiao === cidade.regiao && c.slug !== cidade.slug)
    .slice(0, 6);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

  // JSON-LD para SEO Local
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lavify",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: `Sistema de gestão para lava rápido em ${cidade.nome}, ${cidade.estado}`,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "199.90",
      priceCurrency: "BRL",
      description: "Teste grátis por 7 dias"
    },
    areaServed: {
      "@type": "City",
      name: cidade.nome,
      containedInPlace: {
        "@type": "State",
        name: cidade.estado
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1847",
      bestRating: "5",
      worstRating: "1"
    }
  };

  // Breadcrumb Schema - Importante para navegação estruturada
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Para Empresas",
        item: `${baseUrl}/para-empresas`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `Sistema para Lava Rápido em ${cidade.nome}`,
        item: `${baseUrl}/sistema-lava-rapido/${cidade.slug}`
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: conteudo.faq.map(item => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta
      }
    }))
  };

  // Service Schema - Serviços oferecidos pelo software
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Software as a Service (SaaS)",
    name: `Sistema de Gestão para Lava Rápido em ${cidade.nome}`,
    description: `Software completo para gestão de lava jato em ${cidade.nome}, ${cidade.uf}. Controle pátio, agendamentos, estoque e financeiro.`,
    provider: {
      "@type": "Organization",
      name: "Lavify"
    },
    areaServed: {
      "@type": "City",
      name: cidade.nome,
      containedInPlace: {
        "@type": "State",
        name: cidade.estado,
        containedInPlace: {
          "@type": "Country",
          name: "Brasil"
        }
      }
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Planos Lavify",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Plano Grátis"
          },
          price: "0",
          priceCurrency: "BRL"
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Plano Profissional"
          },
          price: "99.90",
          priceCurrency: "BRL"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Lavify
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/para-empresas" 
                className="text-white/70 hover:text-white text-sm hidden md:block"
              >
                Funcionalidades
              </Link>
              <Link
                href="/cadastro"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Testar Grátis
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
          
          <div className="max-w-6xl mx-auto px-4 relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
              <Link href="/" className="hover:text-white/70">Início</Link>
              <span>/</span>
              <Link href="/para-empresas" className="hover:text-white/70">Para Empresas</Link>
              <span>/</span>
              <span className="text-cyan-400">{cidade.nome}</span>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-medium">
                <MapPin className="w-4 h-4" />
                {cidade.nome}, {cidade.uf}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {conteudo.titulo}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl">
              {conteudo.subtitulo}
            </p>

            {/* Intro */}
            <p className="text-lg text-white/60 mb-10 max-w-3xl leading-relaxed">
              {conteudo.introducao}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25"
              >
                ⚡ Testar Grátis Agora
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/para-empresas#video"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all"
              >
                <Play className="w-5 h-5" />
                Ver Como Funciona
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                100% grátis pra testar
              </span>
              <span className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Funciona no celular
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Começa em 2 minutos
              </span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white/5">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {estatisticas.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                    {stat.valor}
                  </p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Funcionalidades para seu Lava Jato
            </h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
              Tudo que você precisa para profissionalizar e crescer seu lava rápido em {cidade.nome}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conteudo.beneficios.map((beneficio, index) => {
                const Icon = iconsBeneficios[index] || CheckCircle;
                return (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {beneficio}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 bg-slate-800/50">
          <div className="max-w-4xl mx-auto px-4">
            {conteudo.secoes.map((secao, index) => (
              <div key={index} className="mb-12 last:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {secao.titulo}
                </h2>
                {secao.conteudo.split('\n\n').map((paragrafo, pIndex) => (
                  <p key={pIndex} className="text-white/70 leading-relaxed mb-4">
                    {paragrafo}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-white/60 text-center mb-12">
              Dúvidas comuns sobre o Lavify para lava jatos em {cidade.nome}
            </p>

            <div className="space-y-4">
              {conteudo.faq.map((item, index) => (
                <details 
                  key={index}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-medium text-white pr-4">{item.pergunta}</span>
                    <ChevronDown className="w-5 h-5 text-white/50 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-6 text-white/70">
                    {item.resposta}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Linking - Guias Relacionados */}
        <section className="py-16 bg-slate-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
              Guias para Lava Rápido
            </h2>
            <p className="text-white/60 text-center mb-10">
              Conteúdo exclusivo para donos de lava jato
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paginasRelacionadas.map((paginaRel) => (
                <Link
                  key={paginaRel.slug}
                  href={`/${paginaRel.slug}`}
                  className="group p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-cyan-500/20 text-cyan-400 mb-3">
                    {paginaRel.tipo}
                  </span>
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {paginaRel.h1.split(":")[0]}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Linking - Cidades Próximas */}
        {cidadesProximas.length > 0 && (
          <section className="py-12 bg-white/5">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-xl font-bold text-white text-center mb-6">
                Sistema para Lava Rápido em Outras Cidades da Região {cidade.regiao}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {cidadesProximas.map((cidadeProx) => (
                  <Link
                    key={cidadeProx.slug}
                    href={`/sistema-lava-rapido/${cidadeProx.slug}`}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all text-sm"
                  >
                    {cidadeProx.nome}, {cidadeProx.uf}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-cyan-600 to-blue-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Comece Hoje a Transformar seu Lava Jato
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Junte-se aos lava rápidos em {cidade.nome} e em todo o Brasil que já usam o Lavify para crescer
            </p>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 bg-white text-cyan-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Criar Conta Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-white/60 text-sm mt-4">
              Sem cartão de crédito • Teste grátis por 7 dias
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-white/10 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <Link href="/" className="text-2xl font-bold text-white">Lavify</Link>
                <p className="text-white/50 text-sm mt-2">
                  Sistema de gestão para lava rápidos
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
                <Link href="/para-empresas" className="hover:text-white">Para Empresas</Link>
                <Link href="/encontrar" className="hover:text-white">Encontrar Lava Jato</Link>
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

