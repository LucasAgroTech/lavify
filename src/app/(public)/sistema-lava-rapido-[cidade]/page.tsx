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
import { getCidadeBySlug, getAllCidadeSlugs, CidadeSEO } from "@/lib/seo-cities";

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
      canonical: `/sistema-lava-rapido-${cidade.slug}`,
    },
  };
}

// Conteúdo gerado (em produção, pode vir de cache/banco de dados)
function getConteudo(cidade: CidadeSEO) {
  return {
    titulo: `Sistema para Lava Rápido em ${cidade.nome}`,
    subtitulo: `Gerencie seu lava jato em ${cidade.nome} de forma simples e profissional`,
    introducao: `Se você tem um lava rápido em ${cidade.nome}, sabe como é desafiador manter tudo organizado. Clientes aguardando, carros no pátio, equipe para coordenar e as contas para fechar no final do mês. O Lavify foi criado para resolver exatamente esses problemas.`,
    secoes: [
      {
        titulo: `Por que Lava Jatos em ${cidade.nome} Precisam de um Sistema`,
        conteudo: `${cidade.nome} é uma cidade com grande frota de veículos e, consequentemente, uma demanda crescente por serviços de lava rápido. Com uma população de aproximadamente ${(cidade.populacao / 1000000).toFixed(1)} milhões de habitantes, a concorrência no setor é alta.\n\nPara se destacar, não basta oferecer um bom serviço de lavagem. É preciso ter controle total das operações, atender os clientes com agilidade e manter as finanças organizadas. Um sistema de gestão especializado é o diferencial que separa os lava jatos que crescem dos que ficam para trás.`
      },
      {
        titulo: "Funcionalidades Pensadas para Seu Dia a Dia",
        conteudo: `O Lavify oferece tudo que você precisa para profissionalizar seu lava jato: Kanban visual para acompanhar cada carro no pátio, agendamento online que funciona 24 horas por dia, envio automático de mensagens no WhatsApp quando o serviço fica pronto, controle de estoque inteligente que avisa antes de acabar, e relatórios financeiros completos.\n\nTudo isso acessível do seu celular, de qualquer lugar. Você pode sair do estabelecimento sabendo exatamente o que está acontecendo em tempo real.`
      },
      {
        titulo: `Transforme Seu Lava Jato em ${cidade.nome}`,
        conteudo: `Lava rápidos em ${cidade.nome} e região ${cidade.regiao} já descobriram como o Lavify pode transformar suas operações. O sistema é intuitivo, não precisa de treinamento complexo e começa a dar resultados desde o primeiro dia de uso.\n\nAlém disso, oferecemos suporte em português, preços acessíveis para todos os tamanhos de negócio e uma equipe que entende as particularidades do mercado brasileiro de estética automotiva.`
      }
    ],
    beneficios: [
      { titulo: "Pátio Visual", descricao: "Veja onde cada carro está no kanban", icon: LayoutDashboard },
      { titulo: "Agendamento 24h", descricao: "Clientes agendam sozinhos", icon: Calendar },
      { titulo: "WhatsApp Automático", descricao: "Avise quando ficar pronto", icon: MessageCircle },
      { titulo: "Estoque Inteligente", descricao: "Alertas antes de acabar", icon: Package },
      { titulo: "Equipe Organizada", descricao: "Controle quem faz o quê", icon: Users },
      { titulo: "Financeiro Completo", descricao: "Fluxo de caixa em tempo real", icon: TrendingUp },
    ],
    faq: [
      {
        pergunta: `O Lavify funciona para lava jatos pequenos em ${cidade.nome}?`,
        resposta: `Sim! O Lavify foi pensado para atender desde lava rápidos com um funcionário até grandes operações com múltiplas equipes. Temos planos que cabem no bolso de qualquer empreendedor em ${cidade.nome}.`
      },
      {
        pergunta: "Preciso instalar algum programa no computador?",
        resposta: "Não! O Lavify funciona 100% online, direto no navegador ou no celular. Você só precisa de internet para acessar de qualquer lugar, inclusive fora do seu lava jato."
      },
      {
        pergunta: "Como funciona o período de teste gratuito?",
        resposta: "Você pode testar todas as funcionalidades do Lavify gratuitamente por 7 dias, sem precisar cadastrar cartão de crédito. É só criar sua conta e começar a usar imediatamente."
      },
      {
        pergunta: `Quantos lava jatos em ${cidade.nome} já usam o Lavify?`,
        resposta: `O Lavify atende lava rápidos em todo o Brasil, incluindo ${cidade.nome} e outras cidades do ${cidade.estado}. Nossa base de clientes cresce a cada dia com empreendedores que buscam profissionalizar suas operações.`
      }
    ],
    estatisticas: [
      { valor: "-50%", label: "Tempo em gestão" },
      { valor: "+30%", label: "Aumento no faturamento" },
      { valor: "24h", label: "Agendamentos online" },
      { valor: "100%", label: "Controle pelo celular" },
    ]
  };
}

export default async function CidadePage({ params }: PageProps) {
  const { cidade: cidadeSlug } = await params;
  const cidade = getCidadeBySlug(cidadeSlug);
  
  if (!cidade) {
    notFound();
  }

  const conteudo = getConteudo(cidade);

  // JSON-LD para SEO Local
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lavify",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: `Sistema de gestão para lava rápido em ${cidade.nome}, ${cidade.estado}`,
    offers: {
      "@type": "Offer",
      price: "0",
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
      ratingCount: "127",
      bestRating: "5"
    }
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
              {conteudo.estatisticas.map((stat, index) => (
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
              {conteudo.beneficios.map((beneficio, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                    <beneficio.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {beneficio.titulo}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {beneficio.descricao}
                  </p>
                </div>
              ))}
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

