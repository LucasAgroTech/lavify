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
 * Busca conteúdo enriquecido para página de cidade
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

  return null;
}

/**
 * Busca conteúdo enriquecido para página de solução/serviço
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

  return null;
}

