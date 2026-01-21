/**
 * API de Geração de Conteúdo SEO Enriquecido
 * 
 * POST /api/seo/generate-enriched
 * 
 * Gera conteúdo único e otimizado para páginas programáticas,
 * com cache em banco de dados para evitar regeneração.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCidadeBySlug } from "@/lib/seo-cities";
import { getProblemaBySlug } from "@/lib/seo-problems";
import {
  ContextoEnriquecimento,
  ConteudoEnriquecido,
} from "@/lib/seo-ai-prompts";
import {
  gerarConteudoEnriquecido,
  gerarConteudoFallbackEnriquecido,
  gerarCacheKey,
} from "@/lib/seo-content-generator";

interface RequestBody {
  tema: string;
  tipoConteudo: "guia" | "tabela" | "checklist" | "servico" | "cidade";
  cidadeSlug?: string;
  forceRegenerate?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { tema, tipoConteudo, cidadeSlug, forceRegenerate } = body;

    if (!tema || !tipoConteudo) {
      return NextResponse.json(
        { error: "tema e tipoConteudo são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca informações do problema/tema
    const problema = getProblemaBySlug(tema);
    
    // Busca informações da cidade (se fornecida)
    const cidade = cidadeSlug ? getCidadeBySlug(cidadeSlug) : undefined;

    // Monta o contexto de enriquecimento
    const contexto: ContextoEnriquecimento = {
      tema,
      tipoConteudo,
      cidade: cidade
        ? {
            nome: cidade.nome,
            uf: cidade.uf,
            regiao: cidade.regiao,
            populacao: cidade.populacao,
          }
        : undefined,
      keywords: problema?.keywords || [tema],
      descricaoBase: problema?.descricao || `Informações sobre ${tema}`,
    };

    // Gera chave de cache
    const cacheKey = gerarCacheKey(contexto);

    // Verifica se já existe no cache (se não forçar regeneração)
    if (!forceRegenerate) {
      const cached = await prisma.sEOContentCache.findUnique({
        where: { cacheKey },
      });

      if (cached && cached.conteudo) {
        // Verifica se não expirou
        const agora = new Date();
        if (!cached.expiresAt || cached.expiresAt > agora) {
          return NextResponse.json({
            success: true,
            fromCache: true,
            cacheKey,
            conteudo: JSON.parse(cached.conteudo) as ConteudoEnriquecido,
            metadata: {
              geradoPorIA: cached.geradoPorIA,
              modeloIA: cached.modeloIA,
              createdAt: cached.createdAt,
            },
          });
        }
      }
    }

    // Gera novo conteúdo
    const startTime = Date.now();
    let conteudo: ConteudoEnriquecido;
    let geradoPorIA = false;
    let modeloIA: string | null = null;

    // Tenta gerar com IA
    const conteudoIA = await gerarConteudoEnriquecido(contexto);

    if (conteudoIA) {
      conteudo = conteudoIA;
      geradoPorIA = true;
      modeloIA = "gpt-4o-mini";
    } else {
      // Fallback para conteúdo pré-definido
      conteudo = gerarConteudoFallbackEnriquecido(contexto);
    }

    const tempoGeracao = Date.now() - startTime;

    // Salva no cache (upsert)
    await prisma.sEOContentCache.upsert({
      where: { cacheKey },
      update: {
        conteudo: JSON.stringify(conteudo),
        geradoPorIA,
        modeloIA,
        tempoGeracao,
        updatedAt: new Date(),
        // Cache expira em 30 dias
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        cacheKey,
        tema,
        tipoConteudo,
        cidadeNome: cidade?.nome,
        cidadeUf: cidade?.uf,
        cidadeRegiao: cidade?.regiao,
        conteudo: JSON.stringify(conteudo),
        geradoPorIA,
        modeloIA,
        tempoGeracao,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      fromCache: false,
      cacheKey,
      conteudo,
      metadata: {
        geradoPorIA,
        modeloIA,
        tempoGeracao,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Erro ao gerar conteúdo SEO enriquecido:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar conteúdo" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seo/generate-enriched?cacheKey=xxx
 * 
 * Recupera conteúdo do cache por chave
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cacheKey = searchParams.get("cacheKey");
    const tema = searchParams.get("tema");
    const cidadeSlug = searchParams.get("cidade");

    // Se tem cacheKey, busca diretamente
    if (cacheKey) {
      const cached = await prisma.sEOContentCache.findUnique({
        where: { cacheKey },
      });

      if (cached) {
        return NextResponse.json({
          success: true,
          fromCache: true,
          cacheKey,
          conteudo: JSON.parse(cached.conteudo) as ConteudoEnriquecido,
          metadata: {
            geradoPorIA: cached.geradoPorIA,
            modeloIA: cached.modeloIA,
            createdAt: cached.createdAt,
          },
        });
      }

      return NextResponse.json(
        { error: "Conteúdo não encontrado no cache" },
        { status: 404 }
      );
    }

    // Se tem tema, gera a chave e busca
    if (tema) {
      const cidade = cidadeSlug ? getCidadeBySlug(cidadeSlug) : undefined;
      const problema = getProblemaBySlug(tema);

      const contexto: ContextoEnriquecimento = {
        tema,
        tipoConteudo: (problema?.tipo as ContextoEnriquecimento["tipoConteudo"]) || "guia",
        cidade: cidade
          ? {
              nome: cidade.nome,
              uf: cidade.uf,
              regiao: cidade.regiao,
              populacao: cidade.populacao,
            }
          : undefined,
        keywords: problema?.keywords || [tema],
        descricaoBase: problema?.descricao || `Informações sobre ${tema}`,
      };

      const generatedKey = gerarCacheKey(contexto);

      const cached = await prisma.sEOContentCache.findUnique({
        where: { cacheKey: generatedKey },
      });

      if (cached) {
        return NextResponse.json({
          success: true,
          fromCache: true,
          cacheKey: generatedKey,
          conteudo: JSON.parse(cached.conteudo) as ConteudoEnriquecido,
          metadata: {
            geradoPorIA: cached.geradoPorIA,
            modeloIA: cached.modeloIA,
            createdAt: cached.createdAt,
          },
        });
      }

      return NextResponse.json(
        { 
          error: "Conteúdo não encontrado no cache",
          cacheKey: generatedKey,
          hint: "Use POST para gerar o conteúdo" 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Forneça cacheKey ou tema" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erro ao buscar conteúdo SEO:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

