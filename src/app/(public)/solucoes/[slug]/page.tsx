import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  ArrowRight, 
  Play, 
  MessageCircle,
  Calendar,
  LayoutDashboard,
  Package,
  Users,
  TrendingUp,
  Clock,
  ChevronDown,
  MapPin,
  Smartphone,
  Star,
  Sparkles
} from "lucide-react";
import { getCidadeBySlug, cidadesBrasil } from "@/lib/seo-cities";
import { getServicoBySlug, servicosAutomotivos } from "@/lib/seo-services";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Parser do slug: servico-cidade
function parseSlug(slug: string): { servicoSlug: string; cidadeSlug: string } | null {
  // Tentar encontrar qual serviço corresponde ao início do slug
  for (const servico of servicosAutomotivos) {
    if (slug.startsWith(servico.slug + "-")) {
      const cidadeSlug = slug.substring(servico.slug.length + 1);
      return { servicoSlug: servico.slug, cidadeSlug };
    }
  }
  return null;
}

// Gerar páginas estáticas para todas as combinações
export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  
  // Top 30 cidades para cada serviço
  const cidadesTop = cidadesBrasil.slice(0, 30);
  
  for (const servico of servicosAutomotivos) {
    for (const cidade of cidadesTop) {
      params.push({ slug: `${servico.slug}-${cidade.slug}` });
    }
  }
  
  return params;
}

// Gerar metadata dinâmica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  
  if (!parsed) return { title: "Página não encontrada" };
  
  const servico = getServicoBySlug(parsed.servicoSlug);
  const cidade = getCidadeBySlug(parsed.cidadeSlug);
  
  if (!servico || !cidade) return { title: "Página não encontrada" };

  const title = `${servico.nomeCompleto} em ${cidade.nome} | Lavify`;
  const description = `${servico.descricao} Software especializado para ${cidade.nome}, ${cidade.uf}. Teste grátis!`;

  return {
    title,
    description,
    keywords: [
      `${servico.nome.toLowerCase()} ${cidade.nome}`,
      `software ${servico.nome.toLowerCase()} ${cidade.uf}`,
      `sistema ${servico.nome.toLowerCase()}`,
      ...servico.keywords,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      siteName: "Lavify",
    },
    alternates: {
      canonical: `/solucoes/${slug}`,
    },
  };
}

// Dados de serviços oferecidos por tipo
const servicosPorTipo: Record<string, { nome: string; descricao: string; preco: string }[]> = {
  "estetica-automotiva": [
    { nome: "Polimento Técnico", descricao: "Correção de pintura e remoção de riscos", preco: "R$ 300 - R$ 800" },
    { nome: "Vitrificação", descricao: "Proteção duradoura da pintura", preco: "R$ 800 - R$ 2.500" },
    { nome: "Higienização Completa", descricao: "Limpeza profunda do interior", preco: "R$ 150 - R$ 400" },
    { nome: "Cristalização de Vidros", descricao: "Proteção e hidrofugação", preco: "R$ 100 - R$ 250" },
  ],
  "lavagem-a-seco": [
    { nome: "Lavagem Ecológica Externa", descricao: "Lavagem sem uso de água", preco: "R$ 50 - R$ 100" },
    { nome: "Lavagem Interna", descricao: "Aspiração e limpeza de painéis", preco: "R$ 60 - R$ 120" },
    { nome: "Pacote Completo", descricao: "Interna + Externa", preco: "R$ 100 - R$ 200" },
    { nome: "Revitalização de Plásticos", descricao: "Tratamento de superfícies", preco: "R$ 40 - R$ 80" },
  ],
  "martelinho-de-ouro": [
    { nome: "Reparo Pequeno Amassado", descricao: "Até 3cm de diâmetro", preco: "R$ 80 - R$ 150" },
    { nome: "Reparo Médio Amassado", descricao: "3cm a 8cm de diâmetro", preco: "R$ 150 - R$ 350" },
    { nome: "Reparo Grande", descricao: "Acima de 8cm", preco: "R$ 350 - R$ 800" },
    { nome: "Granizo", descricao: "Orçamento por veículo", preco: "A partir de R$ 500" },
  ],
  "vitrificacao": [
    { nome: "Coating Cerâmico 9H", descricao: "Proteção premium 3-5 anos", preco: "R$ 1.500 - R$ 4.000" },
    { nome: "Vitrificação Simples", descricao: "Proteção 1-2 anos", preco: "R$ 800 - R$ 1.500" },
    { nome: "PPF (Película Protetora)", descricao: "Proteção física da pintura", preco: "R$ 2.000 - R$ 15.000" },
    { nome: "Manutenção Coating", descricao: "Reativação anual", preco: "R$ 200 - R$ 500" },
  ],
};

const iconsBeneficios = [LayoutDashboard, Calendar, MessageCircle, Package, Users, TrendingUp];

export default async function SolucaoPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  
  if (!parsed) notFound();
  
  const servico = getServicoBySlug(parsed.servicoSlug);
  const cidade = getCidadeBySlug(parsed.cidadeSlug);
  
  if (!servico || !cidade) notFound();

  const servicosOferecidos = servicosPorTipo[servico.slug] || servicosPorTipo["estetica-automotiva"];
  
  // Cidades próximas para internal linking
  const cidadesProximas = cidadesBrasil
    .filter(c => c.regiao === cidade.regiao && c.slug !== cidade.slug)
    .slice(0, 6);

  const beneficios = [
    `Agenda online 24h para ${servico.nome.toLowerCase()}`,
    "WhatsApp automático para clientes",
    "Controle de serviços em andamento",
    "Relatórios financeiros detalhados",
    "Programa de fidelidade digital",
    "Cadastro de clientes e veículos"
  ];

  const faq = [
    {
      pergunta: `O Lavify funciona para ${servico.nome.toLowerCase()} em ${cidade.nome}?`,
      resposta: `Sim! O Lavify é perfeito para negócios de ${servico.nome.toLowerCase()} em ${cidade.nome} e região. O sistema foi desenvolvido para atender as necessidades específicas do mercado brasileiro.`
    },
    {
      pergunta: "Preciso de computador para usar o sistema?",
      resposta: "Não! O Lavify funciona 100% pelo celular. Você pode gerenciar todo o seu negócio de qualquer lugar, a qualquer momento."
    },
    {
      pergunta: `Quanto custa o sistema para ${servico.nome.toLowerCase()}?`,
      resposta: "Oferecemos planos a partir de R$ 0,00! Você pode testar todas as funcionalidades gratuitamente antes de escolher um plano pago."
    },
    {
      pergunta: "Como funciona o agendamento online?",
      resposta: "Você ganha uma página exclusiva onde seus clientes podem agendar serviços 24 horas. O sistema organiza automaticamente e envia confirmações por WhatsApp."
    }
  ];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Lavify - ${servico.nomeCompleto}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: `${servico.descricao} em ${cidade.nome}, ${cidade.estado}`,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "199.90",
      priceCurrency: "BRL"
    },
    areaServed: {
      "@type": "City",
      name: cidade.nome,
      containedInPlace: {
        "@type": "State",
        name: cidade.estado
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Lavify
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/para-empresas" className="text-white/70 hover:text-white text-sm hidden md:block">
                Funcionalidades
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

        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
          
          <div className="max-w-6xl mx-auto px-4 relative">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
              <Link href="/" className="hover:text-white/70">Início</Link>
              <span>/</span>
              <Link href="/para-empresas" className="hover:text-white/70">Soluções</Link>
              <span>/</span>
              <span className="text-cyan-400">{servico.nome} em {cidade.nome}</span>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-4 py-1.5 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {servico.emoji} {servico.nome}
              </span>
              <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/60 px-4 py-1.5 rounded-full text-sm">
                <MapPin className="w-4 h-4" />
                {cidade.nome}, {cidade.uf}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {servico.nomeCompleto} em{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {cidade.nome}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-8 max-w-3xl">
              {servico.descricao}
            </p>

            <p className="text-lg text-white/60 mb-10 max-w-3xl leading-relaxed">
              O mercado de {servico.nome.toLowerCase()} em {cidade.nome} está em crescimento. 
              Com uma população de {(cidade.populacao / 1000000).toFixed(1)} milhões de habitantes 
              e frota de veículos cada vez maior, a demanda por serviços de qualidade é alta. 
              O Lavify ajuda você a se destacar da concorrência.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/cadastro"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 shadow-lg shadow-emerald-500/25"
              >
                ⚡ Testar Grátis Agora
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/para-empresas#video"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20"
              >
                <Play className="w-5 h-5" />
                Ver Como Funciona
              </Link>
            </div>

            {/* Trust */}
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

        {/* Tabela de Serviços */}
        <section className="py-16 bg-white/5">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Serviços de {servico.nome} em {cidade.nome}
            </h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
              Preços de referência do mercado local. Gerencie todos esses serviços com o Lavify.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {servicosOferecidos.map((srv, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white">{srv.nome}</h3>
                    <span className="text-cyan-400 font-bold">{srv.preco}</span>
                  </div>
                  <p className="text-white/60 text-sm">{srv.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Por que usar o Lavify para {servico.nome}
            </h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
              Funcionalidades que fazem a diferença no dia a dia do seu negócio
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {beneficios.map((beneficio, index) => {
                const Icon = iconsBeneficios[index] || CheckCircle;
                return (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{beneficio}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-slate-800/50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-white/60 text-center mb-12">
              Dúvidas sobre o Lavify para {servico.nome.toLowerCase()} em {cidade.nome}
            </p>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <details 
                  key={index}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-medium text-white pr-4">{item.pergunta}</span>
                    <ChevronDown className="w-5 h-5 text-white/50 group-open:rotate-180 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-6 text-white/70">{item.resposta}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Linking - Cidades */}
        {cidadesProximas.length > 0 && (
          <section className="py-12 bg-white/5">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-xl font-bold text-white text-center mb-6">
                {servico.nome} em Outras Cidades do {cidade.regiao}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {cidadesProximas.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/solucoes/${servico.slug}-${c.slug}`}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all text-sm"
                  >
                    {c.nome}, {c.uf}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Internal Linking - Outros Serviços */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-xl font-bold text-white text-center mb-6">
              Outros Serviços em {cidade.nome}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {servicosAutomotivos
                .filter(s => s.slug !== servico.slug)
                .slice(0, 6)
                .map((s) => (
                  <Link
                    key={s.slug}
                    href={`/solucoes/${s.slug}-${cidade.slug}`}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 hover:border-cyan-500/30 transition-all text-sm"
                  >
                    {s.emoji} {s.nome}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-cyan-600 to-blue-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Comece Hoje a Profissionalizar seu Negócio
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Junte-se aos empreendedores de {servico.nome.toLowerCase()} em {cidade.nome} 
              que já usam o Lavify para crescer
            </p>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 bg-white text-cyan-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/90 shadow-lg"
            >
              Criar Conta Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-white/60 text-sm mt-4">
              Sem cartão de crédito • Teste grátis
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-white/10 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <Link href="/" className="text-2xl font-bold text-white">Lavify</Link>
                <p className="text-white/50 text-sm mt-2">Sistema de gestão para estética automotiva</p>
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

