import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronDown,
  MapPin,
  ExternalLink
} from "lucide-react";
import { getCidadeBySlug, getAllCidadeSlugs, cidadesBrasil } from "@/lib/seo-cities";

interface PageProps {
  params: Promise<{ cidade: string }>;
}

// Gerar páginas estáticas
export async function generateStaticParams() {
  const slugs = getAllCidadeSlugs();
  return slugs.map((cidade) => ({ cidade }));
}

// Gerar metadata dinâmica
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cidade: cidadeSlug } = await params;
  const cidade = getCidadeBySlug(cidadeSlug);
  
  if (!cidade) {
    return { title: "Página não encontrada" };
  }

  const title = `Sistema para Lava Rápido em ${cidade.nome} | Lavify`;
  const description = `Sistema de gestão para lava jato em ${cidade.nome}, ${cidade.uf}. Controle pátio, agendamentos e financeiro. Teste grátis!`;

  return {
    title,
    description,
    keywords: [
      `sistema para lava rápido ${cidade.nome}`,
      `sistema para lava jato ${cidade.nome}`,
      `software lava jato ${cidade.uf}`,
      ...cidade.keywords,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      siteName: "Lavify",
    },
    alternates: {
      canonical: `/sistema-lava-rapido/${cidade.slug}`,
    },
  };
}

// Conteúdo ÚNICO por região (não se repete entre cidades da mesma região)
const conteudoPorRegiao: Record<string, {
  contexto: string;
  diferenciais: string[];
  faq: { pergunta: string; resposta: string }[];
}> = {
  "Sudeste": {
    contexto: "No Sudeste, a concorrência entre lava jatos é intensa. O diferencial está em oferecer uma experiência profissional: agendamento online, aviso automático quando o carro está pronto e controle de fidelidade. O Lavify coloca essas ferramentas na sua mão.",
    diferenciais: [
      "Kanban visual para alto volume de carros",
      "WhatsApp automático reduz ligações e filas",
      "Agendamento online 24h para competir com grandes redes"
    ],
    faq: [
      {
        pergunta: "O sistema aguenta alto volume de carros?",
        resposta: "Sim. O Lavify foi projetado para alto volume. O Kanban suporta dezenas de carros simultâneos."
      },
      {
        pergunta: "Ajuda a competir com grandes redes?",
        resposta: "Sim. Agendamento online, fidelidade digital e WhatsApp automático - as mesmas ferramentas das grandes redes."
      }
    ]
  },
  "Sul": {
    contexto: "O cliente do Sul valoriza qualidade e profissionalismo. Ele percebe quando o atendimento é organizado, quando você lembra do carro dele e quando o serviço é entregue no prazo. O Lavify permite esse nível de profissionalismo.",
    diferenciais: [
      "Histórico detalhado por veículo e cliente",
      "Checklist de entrada para garantir qualidade",
      "Programa de fidelidade para clientes recorrentes"
    ],
    faq: [
      {
        pergunta: "O sistema mantém histórico dos clientes?",
        resposta: "Sim. Histórico completo por veículo mostra todos os serviços anteriores e preferências do cliente."
      },
      {
        pergunta: "Funciona no frio quando o movimento cai?",
        resposta: "Sim. O programa de fidelidade e remarketing por WhatsApp ajudam a manter clientes voltando."
      }
    ]
  },
  "Nordeste": {
    contexto: "O Nordeste é a região que mais cresce em número de veículos. Com o clima quente e poeira constante, a demanda por lavagem é frequente. O Lavify é leve, funciona bem no 4G e tem planos acessíveis.",
    diferenciais: [
      "Sistema leve que funciona no 4G",
      "Planos acessíveis para qualquer porte",
      "Agendamento para lavagens frequentes"
    ],
    faq: [
      {
        pergunta: "O sistema funciona bem com internet móvel?",
        resposta: "Sim. O Lavify é otimizado para conexões mais lentas. Interface leve que carrega rápido no 4G."
      },
      {
        pergunta: "Os planos são acessíveis?",
        resposta: "Sim. Comece grátis por 7 dias e depois escolha o plano que se encaixa no seu faturamento."
      }
    ]
  },
  "Centro-Oeste": {
    contexto: "O Centro-Oeste tem características únicas: caminhonetes do agronegócio, frotas de fazendas e o trânsito das capitais. O Lavify permite diferenciar preços por tipo de veículo e gerenciar frotas corporativas.",
    diferenciais: [
      "Categorias de preço por tipo de veículo",
      "Gestão de frotas corporativas",
      "Kanban para organizar picos de movimento"
    ],
    faq: [
      {
        pergunta: "Posso cobrar diferente para caminhonetes?",
        resposta: "Sim. Você cria categorias de preço por tipo de veículo. SUVs, pickups e caminhonetes podem ter valores diferenciados."
      },
      {
        pergunta: "O sistema atende frotas de fazendas?",
        resposta: "Sim. Você cadastra frotas corporativas com condições especiais e controla cada veículo separadamente."
      }
    ]
  },
  "Norte": {
    contexto: "No Norte, o desafio está em manter o fluxo constante de clientes. Nos dias parados, cada cliente faz diferença. O Lavify é simples de usar e ajuda a trazer clientes de volta com promoções por WhatsApp.",
    diferenciais: [
      "Interface simples e intuitiva",
      "WhatsApp para promoções em dias parados",
      "Sistema leve que funciona em qualquer conexão"
    ],
    faq: [
      {
        pergunta: "O sistema é fácil de usar?",
        resposta: "Muito. Interface intuitiva que você aprende em minutos. Feita para o dia a dia corrido do lava jato."
      },
      {
        pergunta: "Ajuda em dias de pouco movimento?",
        resposta: "Sim. Use o WhatsApp integrado para avisar clientes sobre promoções e preencher a agenda."
      }
    ]
  }
};

export default async function CidadePage({ params }: PageProps) {
  const { cidade: cidadeSlug } = await params;
  const cidade = getCidadeBySlug(cidadeSlug);
  
  if (!cidade) {
    notFound();
  }

  const conteudo = conteudoPorRegiao[cidade.regiao] || conteudoPorRegiao["Sudeste"];
  
  // Cidades próximas para internal linking
  const cidadesProximas = cidadesBrasil
    .filter(c => c.regiao === cidade.regiao && c.slug !== cidade.slug)
    .slice(0, 4);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

  // Schema simplificado
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
      description: "Teste grátis"
    },
    areaServed: {
      "@type": "City",
      name: cidade.nome
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-900">
        {/* Header Simples */}
        <header className="border-b border-white/10 py-4">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">
              Lavify
            </Link>
            <Link 
              href="/para-empresas" 
              className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
            >
              Ver todas as funcionalidades
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white/70">Início</Link>
            <span>/</span>
            <Link href="/para-empresas" className="hover:text-white/70">Para Empresas</Link>
            <span>/</span>
            <span className="text-white/70">{cidade.nome}</span>
          </div>

          {/* Tag de localização */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {cidade.nome}, {cidade.uf} • {cidade.regiao}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Sistema para Lava Rápido em {cidade.nome}
          </h1>
          
          {/* Contexto regional */}
          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            {conteudo.contexto}
          </p>

          {/* Diferenciais para esta região */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">
              O que o Lavify oferece para lava jatos em {cidade.nome}:
            </h2>
            <ul className="space-y-3">
              {conteudo.diferenciais.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <span className="text-cyan-400 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-white/10">
              <Link 
                href="/para-empresas" 
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
              >
                Ver todas as funcionalidades do Lavify
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* FAQ regional */}
          {conteudo.faq.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-6">
                Perguntas frequentes
              </h2>
              <div className="space-y-3">
                {conteudo.faq.map((item, index) => (
                  <details 
                    key={index}
                    className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                      <span className="font-medium text-white pr-4 text-sm">{item.pergunta}</span>
                      <ChevronDown className="w-4 h-4 text-white/50 group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-4 pb-4 text-white/60 text-sm">{item.resposta}</div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* CTA simples */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-6 text-center mb-10">
            <p className="text-white/90 mb-4">
              Quer conhecer o Lavify para seu lava jato em {cidade.nome}?
            </p>
            <Link
              href="/para-empresas"
              className="inline-flex items-center gap-2 bg-white text-cyan-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-white/90"
            >
              Conheça o Lavify
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Links relacionados */}
          {cidadesProximas.length > 0 && (
            <div className="border-t border-white/10 pt-8">
              <h3 className="text-sm font-medium text-white/50 mb-3">
                Sistema para lava rápido em outras cidades do {cidade.regiao}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {cidadesProximas.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/sistema-lava-rapido/${c.slug}`}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/30 text-sm"
                  >
                    {c.nome}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer mínimo */}
        <footer className="border-t border-white/10 py-6 mt-8">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <span>© {new Date().getFullYear()} Lavify</span>
            <div className="flex gap-4">
              <Link href="/para-empresas" className="hover:text-white/60">Para Empresas</Link>
              <Link href="/login" className="hover:text-white/60">Entrar</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
