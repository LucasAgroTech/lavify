import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  ChevronDown,
  MapPin,
  Sparkles,
  ExternalLink,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import { getCidadeBySlug, cidadesBrasil } from "@/lib/seo-cities";
import { getServicoBySlug, servicosAutomotivos } from "@/lib/seo-services";
import { getConteudoSolucao } from "@/lib/seo-content-helper";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Parser do slug: servico-cidade
function parseSlug(slug: string): { servicoSlug: string; cidadeSlug: string } | null {
  for (const servico of servicosAutomotivos) {
    if (slug.startsWith(servico.slug + "-")) {
      const cidadeSlug = slug.substring(servico.slug.length + 1);
      return { servicoSlug: servico.slug, cidadeSlug };
    }
  }
  return null;
}

// Gerar páginas estáticas
export async function generateStaticParams() {
  const params: { slug: string }[] = [];
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

// Conteúdo ÚNICO por tipo de serviço (não se repete entre cidades)
const conteudoPorServico: Record<string, {
  descricaoDetalhada: string;
  diferenciais: string[];
  faq: { pergunta: string; resposta: string }[];
}> = {
  "estetica-automotiva": {
    descricaoDetalhada: "A estética automotiva exige controle de garantias, documentação fotográfica e acompanhamento de serviços de alto valor. O Lavify foi desenvolvido para centros de estética que precisam gerenciar polimentos, vitrificações e coatings com profissionalismo.",
    diferenciais: [
      "Controle de garantias com vencimento automático",
      "Galeria de fotos antes/depois por serviço",
      "Histórico técnico completo por veículo"
    ],
    faq: [
      {
        pergunta: "O sistema controla garantia de vitrificação e coating?",
        resposta: "Sim. Você cadastra a garantia de cada serviço e o sistema avisa automaticamente quando está próximo do vencimento."
      },
      {
        pergunta: "Consigo anexar fotos antes/depois?",
        resposta: "Sim. O Lavify permite anexar fotos em cada ordem de serviço, criando um portfólio automático."
      }
    ]
  },
  "lavagem-a-seco": {
    descricaoDetalhada: "A lavagem a seco demanda controle de produtos ecológicos, gestão de equipes móveis e agendamentos com endereço. O Lavify organiza tudo isso para você focar no atendimento.",
    diferenciais: [
      "Gestão de equipe móvel com rotas",
      "Controle de consumo de produtos",
      "Agendamento com captura de endereço"
    ],
    faq: [
      {
        pergunta: "O sistema ajuda a controlar os produtos ecológicos?",
        resposta: "Sim. O controle de estoque avisa quando os produtos estão acabando e calcula o consumo médio por lavagem."
      },
      {
        pergunta: "Funciona para equipes que atendem em domicílio?",
        resposta: "Perfeito para isso. O agendamento online captura o endereço do cliente automaticamente."
      }
    ]
  },
  "martelinho-de-ouro": {
    descricaoDetalhada: "O martelinho de ouro precisa de orçamentos detalhados, acompanhamento de reparos e gestão de fila de veículos. O Lavify ajuda você a organizar cada serviço com documentação completa.",
    diferenciais: [
      "Orçamentos com fotos e descrição detalhada",
      "Acompanhamento de status por reparo",
      "Controle de fila de veículos aguardando"
    ],
    faq: [
      {
        pergunta: "Como faço orçamentos de reparo pelo sistema?",
        resposta: "Você cria ordens de serviço detalhadas com descrição de cada amassado, fotos e valor. O cliente recebe por WhatsApp."
      },
      {
        pergunta: "O sistema ajuda a organizar a fila de veículos?",
        resposta: "Sim. O Kanban visual mostra todos os veículos e o status de cada reparo."
      }
    ]
  },
  "vitrificacao": {
    descricaoDetalhada: "Serviços de vitrificação e coating cerâmico exigem registro técnico detalhado, controle de garantias e agendamento de manutenções. O Lavify organiza todo o ciclo de vida do coating.",
    diferenciais: [
      "Registro de marca, camadas e tempo de cura",
      "Controle de garantias com alerta de vencimento",
      "Lembrete automático de manutenção"
    ],
    faq: [
      {
        pergunta: "Como registro os detalhes técnicos do coating?",
        resposta: "Nas observações da ordem de serviço você registra marca, número de camadas, tempo de cura e outros detalhes."
      },
      {
        pergunta: "O cliente recebe certificado de garantia?",
        resposta: "Você pode enviar por WhatsApp um comprovante com todos os detalhes do serviço, data e período de garantia."
      }
    ]
  },
  "polimento": {
    descricaoDetalhada: "O polimento automotivo requer documentação visual, registro de níveis de correção e controle de produtos utilizados. O Lavify ajuda você a profissionalizar cada serviço.",
    diferenciais: [
      "Registro do tipo de polimento realizado",
      "Fotos comparativas antes/depois",
      "Controle de produtos e boinas"
    ],
    faq: [
      {
        pergunta: "Consigo registrar o nível de correção alcançado?",
        resposta: "Sim. Você pode detalhar na ordem de serviço o tipo de polimento, produtos usados e resultado obtido."
      },
      {
        pergunta: "Como mostro o antes/depois pro cliente?",
        resposta: "Anexe fotos na ordem de serviço e envie pelo WhatsApp integrado."
      }
    ]
  },
  "higienizacao-interna": {
    descricaoDetalhada: "A higienização interna precisa diferenciar tipos de materiais, controlar produtos químicos e gerenciar tempos variados. O Lavify organiza cada detalhe do serviço.",
    diferenciais: [
      "Serviços separados para tecido e couro",
      "Checklist de pontos higienizados",
      "Controle de produtos químicos"
    ],
    faq: [
      {
        pergunta: "O sistema diferencia higienização de tecido e couro?",
        resposta: "Sim. Você pode criar serviços separados com preços e tempos diferentes para cada tipo de material."
      },
      {
        pergunta: "Posso ajustar o tempo para carros muito sujos?",
        resposta: "Sim. No agendamento você adiciona observações e ajusta o tempo estimado."
      }
    ]
  },
  "lava-rapido": {
    descricaoDetalhada: "O lava rápido precisa de controle de pátio em tempo real, gestão de fila e comunicação rápida com clientes. O Lavify foi feito para o ritmo acelerado da lavagem automotiva.",
    diferenciais: [
      "Kanban visual para controle do pátio",
      "WhatsApp automático quando o carro fica pronto",
      "Dashboard de faturamento em tempo real"
    ],
    faq: [
      {
        pergunta: "O Kanban funciona bem no celular?",
        resposta: "Foi feito mobile-first. Seus funcionários arrastam os carros entre colunas direto pelo celular."
      },
      {
        pergunta: "Consigo ver quantos carros lavei no dia?",
        resposta: "Sim. O dashboard mostra serviços do dia, da semana e do mês, com faturamento em tempo real."
      }
    ]
  },
  "lava-jato": {
    descricaoDetalhada: "O lava jato precisa organizar múltiplos boxes, controlar equipe e manter o cliente informado. O Lavify centraliza a gestão para você focar na qualidade do serviço.",
    diferenciais: [
      "Kanban visual para todos os boxes",
      "Aviso automático de carro pronto",
      "Controle financeiro integrado"
    ],
    faq: [
      {
        pergunta: "O cliente recebe aviso quando o carro fica pronto?",
        resposta: "Sim. Com um clique você envia WhatsApp automático avisando que o veículo está pronto."
      },
      {
        pergunta: "Funciona para lava jato com vários boxes?",
        resposta: "Perfeito. O Kanban visual mostra todos os boxes e onde cada carro está no processo."
      }
    ]
  }
};

export default async function SolucaoPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  
  if (!parsed) notFound();
  
  const servico = getServicoBySlug(parsed.servicoSlug);
  const cidade = getCidadeBySlug(parsed.cidadeSlug);
  
  if (!servico || !cidade) notFound();

  const conteudo = conteudoPorServico[servico.slug] || conteudoPorServico["lava-rapido"];
  
  // Busca conteúdo enriquecido do banco de dados
  const conteudoEnriquecido = await getConteudoSolucao(servico.slug);
  
  // Cidades próximas para internal linking
  const cidadesProximas = cidadesBrasil
    .filter(c => c.regiao === cidade.regiao && c.slug !== cidade.slug)
    .slice(0, 4);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

  // Schema simplificado
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Lavify - ${servico.nomeCompleto}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: `${servico.descricao} em ${cidade.nome}, ${cidade.estado}`,
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
            <span className="text-white/70">{servico.nome}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-full text-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {servico.emoji} {servico.nome}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded-full text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {cidade.nome}, {cidade.uf}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {servico.nomeCompleto} em {cidade.nome}
          </h1>
          
          {/* Resposta AEO - Featured Snippet */}
          {conteudoEnriquecido?.respostaAEO && (
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-5 mb-8">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-white font-medium leading-relaxed">
                  {conteudoEnriquecido.respostaAEO}
                </p>
              </div>
            </div>
          )}
          
          {/* Descrição do serviço */}
          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            {conteudoEnriquecido?.introducaoEnriquecida || conteudo.descricaoDetalhada}
          </p>
          
          {/* Information Gain: Dado Estatístico */}
          {conteudoEnriquecido?.dadoEstatistico && (
            <div className="bg-slate-800/50 border border-white/10 rounded-xl p-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">
                    {conteudoEnriquecido.dadoEstatistico.valor}
                  </p>
                  <p className="text-white/60 text-sm">
                    {conteudoEnriquecido.dadoEstatistico.contexto}
                  </p>
                  <p className="text-white/40 text-xs mt-2">
                    Fonte: {conteudoEnriquecido.dadoEstatistico.fonte}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Visão do Especialista (E-E-A-T) */}
          {conteudoEnriquecido?.visaoEspecialista && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wide mb-2">Visão do Especialista</p>
                  <p className="text-white font-medium mb-2">
                    {conteudoEnriquecido.visaoEspecialista.insight}
                  </p>
                  <p className="text-white/60 text-sm italic">
                    {conteudoEnriquecido.visaoEspecialista.experiencia}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Benefícios Únicos (enriquecido) ou Diferenciais (fallback) */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
            <h2 className="text-lg font-semibold text-white mb-4">
              {conteudoEnriquecido?.beneficiosUnicos ? 
                `Por que usar Lavify para ${servico.nome.toLowerCase()}:` :
                `O que o Lavify oferece para ${servico.nome.toLowerCase()}:`
              }
            </h2>
            <ul className="space-y-3">
              {(conteudoEnriquecido?.beneficiosUnicos || conteudo.diferenciais).map((item, index) => (
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

          {/* FAQ enriquecido ou padrão */}
          {((conteudoEnriquecido?.faqEnriquecido && conteudoEnriquecido.faqEnriquecido.length > 0) || conteudo.faq.length > 0) && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-6">
                Perguntas frequentes sobre {servico.nome}
              </h2>
              <div className="space-y-3">
                {/* FAQ Enriquecido (prioridade) */}
                {conteudoEnriquecido?.faqEnriquecido?.map((item, index) => (
                  <details 
                    key={`enriched-${index}`}
                    className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                      <span className="font-medium text-white pr-4 text-sm">{item.pergunta}</span>
                      <ChevronDown className="w-4 h-4 text-white/50 group-open:rotate-180 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-4 pb-4">
                      {item.respostaCurta && (
                        <p className="text-cyan-400 text-sm font-medium mb-2">
                          → {item.respostaCurta}
                        </p>
                      )}
                      <p className="text-white/60 text-sm">{item.resposta}</p>
                    </div>
                  </details>
                ))}
                {/* FAQ Padrão (fallback) */}
                {!conteudoEnriquecido?.faqEnriquecido && conteudo.faq.map((item, index) => (
                  <details 
                    key={`default-${index}`}
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
              Quer saber mais sobre o Lavify para {servico.nome.toLowerCase()}?
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
          <div className="border-t border-white/10 pt-8">
            {/* Outras cidades */}
            {cidadesProximas.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white/50 mb-3">
                  {servico.nome} em outras cidades:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cidadesProximas.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/solucoes/${servico.slug}-${c.slug}`}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/30 text-sm"
                    >
                      {c.nome}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Outros serviços */}
            <div>
              <h3 className="text-sm font-medium text-white/50 mb-3">
                Outros serviços em {cidade.nome}:
              </h3>
              <div className="flex flex-wrap gap-2">
                {servicosAutomotivos
                  .filter(s => s.slug !== servico.slug)
                  .slice(0, 4)
                  .map((s) => (
                    <Link
                      key={s.slug}
                      href={`/solucoes/${s.slug}-${cidade.slug}`}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:border-white/30 text-sm"
                    >
                      {s.emoji} {s.nome}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
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
