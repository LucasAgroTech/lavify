/**
 * API de Geração em Lote de Conteúdo SEO Enriquecido
 * 
 * POST /api/seo/generate-batch
 * 
 * Gera conteúdo para múltiplas páginas programáticas de uma vez.
 * Útil para pré-popular o cache antes de publicar.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cidadesBrasil } from "@/lib/seo-cities";
import { problemasLavaJato } from "@/lib/seo-problems";
import {
  ContextoEnriquecimento,
} from "@/lib/seo-ai-prompts";
import {
  gerarConteudoEnriquecido,
  gerarConteudoFallbackEnriquecido,
  gerarCacheKey,
} from "@/lib/seo-content-generator";

interface RequestBody {
  tipo: "guias" | "cidades" | "todos";
  limite?: number;
  apenasNaoGerados?: boolean;
  forceRegenerate?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { 
      tipo = "todos", 
      limite = 10, 
      apenasNaoGerados = true,
      forceRegenerate = false 
    } = body;

    const resultados: {
      cacheKey: string;
      sucesso: boolean;
      geradoPorIA: boolean;
      erro?: string;
    }[] = [];

    // Coleta os contextos a serem gerados
    const contextos: ContextoEnriquecimento[] = [];

    // Guias sem cidade
    if (tipo === "guias" || tipo === "todos") {
      for (const problema of problemasLavaJato) {
        contextos.push({
          tema: problema.slug,
          tipoConteudo: problema.tipo as ContextoEnriquecimento["tipoConteudo"],
          keywords: problema.keywords,
          descricaoBase: problema.descricao,
        });
      }
    }

    // Guias com cidades (top 20)
    if (tipo === "cidades" || tipo === "todos") {
      const cidadesTop = cidadesBrasil.slice(0, 20);
      const problemasComCidade = [
        "tabela-precos-lavagem",
        "tabela-precos-estetica-automotiva",
        "como-abrir-lava-jato",
      ];

      for (const problemaSlug of problemasComCidade) {
        const problema = problemasLavaJato.find((p) => p.slug === problemaSlug);
        if (!problema) continue;

        for (const cidade of cidadesTop) {
          contextos.push({
            tema: problema.slug,
            tipoConteudo: problema.tipo as ContextoEnriquecimento["tipoConteudo"],
            cidade: {
              nome: cidade.nome,
              uf: cidade.uf,
              regiao: cidade.regiao,
              populacao: cidade.populacao,
            },
            keywords: problema.keywords,
            descricaoBase: problema.descricao,
          });
        }
      }
    }

    // Filtra os que já existem no cache (se apenasNaoGerados)
    let contextosParaGerar = contextos;
    
    if (apenasNaoGerados && !forceRegenerate) {
      const cacheKeys = contextos.map((c) => gerarCacheKey(c));
      const existentes = await prisma.sEOContentCache.findMany({
        where: { cacheKey: { in: cacheKeys } },
        select: { cacheKey: true },
      });
      const existentesSet = new Set(existentes.map((e) => e.cacheKey));
      
      contextosParaGerar = contextos.filter(
        (c) => !existentesSet.has(gerarCacheKey(c))
      );
    }

    // Limita a quantidade
    contextosParaGerar = contextosParaGerar.slice(0, limite);

    // Gera cada conteúdo
    for (const contexto of contextosParaGerar) {
      const cacheKey = gerarCacheKey(contexto);
      
      try {
        const startTime = Date.now();
        
        // Tenta gerar com IA
        let conteudo = await gerarConteudoEnriquecido(contexto);
        let geradoPorIA = !!conteudo;
        
        // Fallback se IA falhar
        if (!conteudo) {
          conteudo = gerarConteudoFallbackEnriquecido(contexto);
        }

        const tempoGeracao = Date.now() - startTime;

        // Salva no cache
        await prisma.sEOContentCache.upsert({
          where: { cacheKey },
          update: {
            conteudo: JSON.stringify(conteudo),
            geradoPorIA,
            modeloIA: geradoPorIA ? "gpt-4o-mini" : null,
            tempoGeracao,
            updatedAt: new Date(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          create: {
            cacheKey,
            tema: contexto.tema,
            tipoConteudo: contexto.tipoConteudo,
            cidadeNome: contexto.cidade?.nome,
            cidadeUf: contexto.cidade?.uf,
            cidadeRegiao: contexto.cidade?.regiao,
            conteudo: JSON.stringify(conteudo),
            geradoPorIA,
            modeloIA: geradoPorIA ? "gpt-4o-mini" : null,
            tempoGeracao,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        resultados.push({
          cacheKey,
          sucesso: true,
          geradoPorIA,
        });

        // Aguarda um pouco entre requisições para não sobrecarregar a API
        if (geradoPorIA) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } catch (error) {
        resultados.push({
          cacheKey,
          sucesso: false,
          geradoPorIA: false,
          erro: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    // Estatísticas
    const stats = {
      total: resultados.length,
      sucesso: resultados.filter((r) => r.sucesso).length,
      falha: resultados.filter((r) => !r.sucesso).length,
      geradosPorIA: resultados.filter((r) => r.geradoPorIA).length,
      pendentes: contextos.length - contextosParaGerar.length,
    };

    return NextResponse.json({
      success: true,
      stats,
      resultados,
    });
  } catch (error) {
    console.error("Erro ao gerar conteúdo em lote:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar conteúdo em lote" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seo/generate-batch
 * 
 * Retorna estatísticas do cache de conteúdo SEO
 */
export async function GET() {
  try {
    const [total, geradosPorIA, porTipo, porRegiao] = await Promise.all([
      prisma.sEOContentCache.count(),
      prisma.sEOContentCache.count({ where: { geradoPorIA: true } }),
      prisma.sEOContentCache.groupBy({
        by: ["tipoConteudo"],
        _count: true,
      }),
      prisma.sEOContentCache.groupBy({
        by: ["cidadeRegiao"],
        _count: true,
      }),
    ]);

    // Calcula quantas páginas programáticas existem no total
    const totalGuias = problemasLavaJato.length;
    const cidadesTop = cidadesBrasil.slice(0, 20);
    const problemasComCidade = 3; // tabela-precos-lavagem, tabela-precos-estetica, como-abrir
    const totalComCidade = problemasComCidade * cidadesTop.length;
    const totalPaginas = totalGuias + totalComCidade;

    return NextResponse.json({
      cache: {
        total,
        geradosPorIA,
        fallback: total - geradosPorIA,
        porTipo: porTipo.reduce(
          (acc, item) => ({ ...acc, [item.tipoConteudo]: item._count }),
          {}
        ),
        porRegiao: porRegiao.reduce(
          (acc, item) => ({ ...acc, [item.cidadeRegiao || "sem-cidade"]: item._count }),
          {}
        ),
      },
      paginasProgramaticas: {
        total: totalPaginas,
        guiasSemCidade: totalGuias,
        guiasComCidade: totalComCidade,
        cobertura: `${((total / totalPaginas) * 100).toFixed(1)}%`,
      },
    });
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

