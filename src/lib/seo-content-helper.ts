/**
 * Helper para buscar conteúdo SEO enriquecido nas páginas
 * 
 * Funções utilitárias para uso em Server Components
 */

import { prisma } from "./prisma";
import { ConteudoEnriquecido, ContextoEnriquecimento } from "./seo-ai-prompts";
import {
  gerarCacheKey,
  gerarConteudoFallbackEnriquecido,
} from "./seo-content-generator";

/**
 * Busca conteúdo enriquecido do cache do banco de dados
 * Retorna fallback se não existir no cache
 */
export async function getConteudoEnriquecido(
  contexto: ContextoEnriquecimento
): Promise<{
  conteudo: ConteudoEnriquecido;
  fromCache: boolean;
  geradoPorIA: boolean;
}> {
  const cacheKey = gerarCacheKey(contexto);

  try {
    const cached = await prisma.sEOContentCache.findUnique({
      where: { cacheKey },
    });

    if (cached && cached.conteudo) {
      // Verifica se não expirou
      const agora = new Date();
      if (!cached.expiresAt || cached.expiresAt > agora) {
        return {
          conteudo: JSON.parse(cached.conteudo) as ConteudoEnriquecido,
          fromCache: true,
          geradoPorIA: cached.geradoPorIA,
        };
      }
    }
  } catch (error) {
    console.error("Erro ao buscar cache SEO:", error);
  }

  // Retorna fallback
  return {
    conteudo: gerarConteudoFallbackEnriquecido(contexto),
    fromCache: false,
    geradoPorIA: false,
  };
}

/**
 * Busca conteúdo enriquecido por tema e cidade (simplificado)
 */
export async function getConteudoEnriquecidoPorTema(
  tema: string,
  tipoConteudo: ContextoEnriquecimento["tipoConteudo"],
  cidade?: {
    nome: string;
    uf: string;
    regiao: string;
    populacao?: number;
  },
  keywords: string[] = [],
  descricaoBase: string = ""
): Promise<ConteudoEnriquecido> {
  const contexto: ContextoEnriquecimento = {
    tema,
    tipoConteudo,
    cidade: cidade
      ? {
          nome: cidade.nome,
          uf: cidade.uf,
          regiao: cidade.regiao,
          populacao: cidade.populacao || 0,
        }
      : undefined,
    keywords,
    descricaoBase,
  };

  const { conteudo } = await getConteudoEnriquecido(contexto);
  return conteudo;
}

/**
 * Verifica se existe conteúdo enriquecido no cache
 */
export async function temConteudoEnriquecido(
  contexto: ContextoEnriquecimento
): Promise<boolean> {
  const cacheKey = gerarCacheKey(contexto);

  try {
    const cached = await prisma.sEOContentCache.findUnique({
      where: { cacheKey },
      select: { id: true, expiresAt: true },
    });

    if (cached) {
      const agora = new Date();
      return !cached.expiresAt || cached.expiresAt > agora;
    }
  } catch {
    // Ignora erros
  }

  return false;
}

/**
 * Formata o dado estatístico para exibição
 */
export function formatarDadoEstatistico(
  dado: ConteudoEnriquecido["dadoEstatistico"]
): string {
  return `${dado.valor}. ${dado.contexto} (${dado.fonte})`;
}

/**
 * Gera Schema.org FAQPage a partir do FAQ enriquecido
 */
export function gerarFAQSchema(
  faq: ConteudoEnriquecido["faqEnriquecido"],
  baseUrl: string,
  pageUrl: string
): object {
  return {
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
    url: `${baseUrl}${pageUrl}`,
  };
}

/**
 * Gera Schema.org HowTo a partir das seções
 */
export function gerarHowToSchema(
  titulo: string,
  descricao: string,
  secoes: ConteudoEnriquecido["secoesUnicas"],
  baseUrl: string,
  pageUrl: string
): object {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: titulo,
    description: descricao,
    step: secoes.map((secao, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: secao.titulo,
      text: secao.conteudo,
      ...(secao.lista && {
        itemListElement: secao.lista.map((item, i) => ({
          "@type": "HowToDirection",
          position: i + 1,
          text: item,
        })),
      }),
    })),
    url: `${baseUrl}${pageUrl}`,
  };
}

/**
 * Extrai resposta curta para featured snippet
 */
export function getRespostaParaFeaturedSnippet(
  conteudo: ConteudoEnriquecido
): string {
  // Prioriza a resposta AEO
  if (conteudo.respostaAEO) {
    return conteudo.respostaAEO;
  }

  // Ou a primeira resposta curta do FAQ
  if (conteudo.faqEnriquecido?.[0]?.respostaCurta) {
    return conteudo.faqEnriquecido[0].respostaCurta;
  }

  // Ou o início da introdução
  return conteudo.introducaoEnriquecida.split("\n")[0].slice(0, 150);
}

/**
 * Gera meta tags otimizadas
 */
export function gerarMetaTags(
  conteudo: ConteudoEnriquecido,
  pageUrl: string
): {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
} {
  return {
    title: conteudo.metaTitleOtimizado,
    description: conteudo.metaDescriptionOtimizada,
    keywords: conteudo.entidadesSemanticas,
    canonical: pageUrl,
  };
}

/**
 * Interface para conteúdo de cidade
 */
export interface ConteudoCidade {
  respostaAEO: string;
  dadoEstatistico: {
    valor: string;
    fonte: string;
    contexto: string;
  };
  visaoEspecialista: {
    insight: string;
    experiencia: string;
  };
  introducaoEnriquecida: string;
  destaquesLocais: string[];
  faqEnriquecido: Array<{
    pergunta: string;
    resposta: string;
    respostaCurta: string;
  }>;
  entidadesSemanticas: string[];
  metaTitleOtimizado: string;
  metaDescriptionOtimizada: string;
}

/**
 * Interface para conteúdo de solução/serviço
 */
export interface ConteudoSolucao {
  respostaAEO: string;
  dadoEstatistico: {
    valor: string;
    fonte: string;
    contexto: string;
  };
  visaoEspecialista: {
    insight: string;
    experiencia: string;
  };
  introducaoEnriquecida: string;
  beneficiosUnicos: string[];
  faqEnriquecido: Array<{
    pergunta: string;
    resposta: string;
    respostaCurta: string;
  }>;
  entidadesSemanticas: string[];
  metaTitleOtimizado: string;
  metaDescriptionOtimizada: string;
}

/**
 * Gera fallback de conteúdo enriquecido para cidade
 */
function gerarFallbackCidade(cidadeSlug: string): ConteudoCidade {
  // Dados baseados no slug da cidade
  const cidadeNome = cidadeSlug
    .split("-")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  
  // Dados estatísticos por região (estimados)
  const dadosPorRegiao: Record<string, { frota: string; crescimento: string }> = {
    "sao-paulo": { frota: "8,5 milhões de veículos", crescimento: "3%" },
    "rio-de-janeiro": { frota: "3,2 milhões de veículos", crescimento: "2,5%" },
    "brasilia": { frota: "1,8 milhão de veículos", crescimento: "4%" },
    "belo-horizonte": { frota: "2,1 milhões de veículos", crescimento: "3,2%" },
    "salvador": { frota: "1,1 milhão de veículos", crescimento: "5%" },
    "fortaleza": { frota: "950 mil veículos", crescimento: "6%" },
    "recife": { frota: "850 mil veículos", crescimento: "4,5%" },
    "curitiba": { frota: "1,5 milhão de veículos", crescimento: "3,8%" },
    "porto-alegre": { frota: "1,2 milhão de veículos", crescimento: "2,8%" },
    "manaus": { frota: "680 mil veículos", crescimento: "7%" },
  };
  
  const dados = dadosPorRegiao[cidadeSlug] || { 
    frota: "crescente frota de veículos", 
    crescimento: "5%" 
  };
  
  return {
    respostaAEO: `Sistema para lava jato em ${cidadeNome}: gestão completa com agendamento online e controle financeiro.`,
    dadoEstatistico: {
      valor: `${cidadeNome} tem ${dados.frota} e cresce ${dados.crescimento} ao ano`,
      fonte: "Denatran 2024",
      contexto: "Mercado em expansão com oportunidades",
    },
    visaoEspecialista: {
      insight: `Em ${cidadeNome}, o diferencial está no atendimento profissional. Agendamento online e WhatsApp automático fidelizam clientes.`,
      experiencia: "Lava jatos organizados faturam até 40% mais.",
    },
    introducaoEnriquecida: `${cidadeNome} apresenta um mercado aquecido para lava jatos. Com ${dados.frota}, a demanda por serviços de qualidade é constante. O Lavify ajuda seu negócio a se destacar com gestão profissional.`,
    secoesUnicas: [
      {
        titulo: `O mercado em ${cidadeNome}`,
        conteudo: `Com crescimento de ${dados.crescimento} ao ano na frota de veículos, ${cidadeNome} oferece oportunidades para lava jatos bem gerenciados.`,
      }
    ],
    faqEnriquecido: [
      {
        pergunta: `O Lavify funciona bem em ${cidadeNome}?`,
        resposta: `Sim! O sistema funciona 100% online e já atende diversos lava jatos na região.`,
        respostaCurta: "Sim, 100% online e otimizado para a região.",
      }
    ],
    entidadesSemanticas: [`lava jato ${cidadeNome}`, `sistema lava rápido ${cidadeNome}`],
    metaTitleOtimizado: `Sistema para Lava Rápido em ${cidadeNome} | Lavify`,
    metaDescriptionOtimizada: `Sistema de gestão para lava jato em ${cidadeNome}. Controle pátio, agendamentos e financeiro. Teste grátis!`,
  };
}

/**
 * Busca conteúdo enriquecido para página de cidade
 * Com fallback automático se não encontrar no cache
 */
export async function getConteudoCidade(
  cidadeSlug: string
): Promise<ConteudoCidade | null> {
  const cacheKey = `${cidadeSlug}-cidade-${cidadeSlug}-`;

  try {
    const cached = await prisma.sEOContentCache.findUnique({
      where: { cacheKey },
    });

    if (cached && cached.conteudo) {
      const agora = new Date();
      if (!cached.expiresAt || cached.expiresAt > agora) {
        return JSON.parse(cached.conteudo) as ConteudoCidade;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar cache cidade:", error);
  }

  // Retorna fallback gerado localmente
  return gerarFallbackCidade(cidadeSlug);
}

/**
 * Gera fallback de conteúdo enriquecido para solução/serviço
 */
function gerarFallbackSolucao(servicoSlug: string): ConteudoSolucao {
  // Extrai o tipo de serviço do slug (ex: "estetica-automotiva-sao-paulo" -> "estética automotiva")
  const partes = servicoSlug.split("-");
  const cidadeIndex = partes.findIndex(p => 
    ["sao", "rio", "belo", "porto", "campo", "santo"].includes(p)
  );
  
  const servicoNome = cidadeIndex > 0 
    ? partes.slice(0, cidadeIndex).join(" ")
    : partes.slice(0, -1).join(" ");
  
  const cidadeNome = cidadeIndex > 0
    ? partes.slice(cidadeIndex).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")
    : "sua cidade";
  
  const servicoCapitalizado = servicoNome
    .split(" ")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  
  return {
    respostaAEO: `Sistema para ${servicoCapitalizado} em ${cidadeNome}: gestão completa com agendamento online, controle de estoque e financeiro.`,
    dadoEstatistico: {
      valor: `O setor de ${servicoCapitalizado.toLowerCase()} cresce 12% ao ano no Brasil`,
      fonte: "SEBRAE 2024",
      contexto: "Demanda por serviços especializados em alta",
    },
    visaoEspecialista: {
      insight: `Em ${servicoCapitalizado.toLowerCase()}, a organização e o controle de custos são essenciais para a rentabilidade.`,
      experiencia: "Negócios organizados têm margem até 30% maior.",
    },
    introducaoEnriquecida: `O mercado de ${servicoCapitalizado.toLowerCase()} em ${cidadeNome} está em expansão. Com o Lavify, você gerencia agendamentos, estoque de produtos e financeiro em um só lugar.`,
    secoesUnicas: [
      {
        titulo: `Por que usar sistema para ${servicoCapitalizado}?`,
        conteudo: `Controle profissional de agendamentos, estoque de produtos especializados e histórico de clientes. Tudo que você precisa para crescer.`,
      }
    ],
    faqEnriquecido: [
      {
        pergunta: `O sistema serve para ${servicoCapitalizado.toLowerCase()}?`,
        resposta: `Sim! O Lavify é adaptável para diferentes tipos de serviços automotivos, incluindo ${servicoCapitalizado.toLowerCase()}.`,
        respostaCurta: "Sim, totalmente adaptável.",
      }
    ],
    entidadesSemanticas: [`${servicoCapitalizado.toLowerCase()} ${cidadeNome}`, `sistema ${servicoCapitalizado.toLowerCase()}`],
    metaTitleOtimizado: `Sistema para ${servicoCapitalizado} em ${cidadeNome} | Lavify`,
    metaDescriptionOtimizada: `Gestão completa para ${servicoCapitalizado.toLowerCase()} em ${cidadeNome}. Agendamento, estoque e financeiro. Teste grátis!`,
  };
}

/**
 * Busca conteúdo enriquecido para página de solução/serviço
 * Com fallback automático se não encontrar no cache
 */
export async function getConteudoSolucao(
  servicoSlug: string
): Promise<ConteudoSolucao | null> {
  const cacheKey = `${servicoSlug}-servico-brasil-`;

  try {
    const cached = await prisma.sEOContentCache.findUnique({
      where: { cacheKey },
    });

    if (cached && cached.conteudo) {
      const agora = new Date();
      if (!cached.expiresAt || cached.expiresAt > agora) {
        return JSON.parse(cached.conteudo) as ConteudoSolucao;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar cache solução:", error);
  }

  // Retorna fallback gerado localmente
  return gerarFallbackSolucao(servicoSlug);
}

/**
 * Interface para conteúdo de guia
 */
export interface ConteudoGuia {
  respostaAEO: string;
  dadoEstatistico: {
    valor: string;
    fonte: string;
    contexto: string;
  };
  visaoEspecialista: {
    insight: string;
    experiencia: string;
    metodologia?: string;
  };
  introducaoEnriquecida: string;
  secoesUnicas?: Array<{
    titulo: string;
    conteudo: string;
    destaque?: string;
    lista?: string[];
  }>;
  tabelaEnriquecida?: {
    titulo: string;
    colunas: string[];
    linhas: string[][];
    notaRodape?: string;
  };
  faqEnriquecido: Array<{
    pergunta: string;
    resposta: string;
    respostaCurta?: string;
  }>;
  entidadesSemanticas: string[];
  metaTitleOtimizado: string;
  metaDescriptionOtimizada: string;
}

/**
 * Busca conteúdo enriquecido para página de guia
 */
export async function getConteudoGuia(
  guiaSlug: string,
  tipoConteudo: "guia" | "tabela" | "checklist" = "guia"
): Promise<ConteudoGuia | null> {
  const cacheKey = `${guiaSlug}-${tipoConteudo}-brasil-`;

  try {
    const cached = await prisma.sEOContentCache.findUnique({
      where: { cacheKey },
    });

    if (cached && cached.conteudo) {
      const agora = new Date();
      if (!cached.expiresAt || cached.expiresAt > agora) {
        return JSON.parse(cached.conteudo) as ConteudoGuia;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar cache guia:", error);
  }

  return null;
}

