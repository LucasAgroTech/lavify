/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SITEMAP INDEX - Lavify
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Estrutura otimizada para Google 2026:
 * - Sitemap Index principal apontando para sitemaps segmentados
 * - Organização por tipo de conteúdo
 * - Prioridades estratégicas baseadas em valor de conversão
 * - LastModified preciso por tipo de página
 * 
 * Referência: https://developers.google.com/search/docs/crawling-indexing/sitemaps
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getAllCidadeSlugs, cidadesBrasil } from "@/lib/seo-cities";
import { servicosAutomotivos } from "@/lib/seo-services";
import { problemasLavaJato } from "@/lib/seo-problems";

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÃO E CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

// Data base para conteúdo estático (última atualização significativa)
const LAST_MAJOR_UPDATE = new Date("2026-01-21");

// Tipos de prioridade baseados em valor de conversão (0-1, sendo 1 máximo)
const PRIORITY = {
  CRITICAL: 1,        // Homepage, landing principal
  HIGH: 0.9,          // Blog, páginas de conversão
  MEDIUM_HIGH: 0.8,   // Conteúdo SEO principal, lava-jatos
  MEDIUM: 0.7,        // Guias, soluções
  MEDIUM_LOW: 0.6,    // Páginas de cidade secundárias
  LOW: 0.5,           // Login, cadastro, utilitários
  MINIMAL: 0.3,       // Páginas de suporte
};

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gera data ISO para o sitemap de forma consistente
 */
function toSitemapDate(date: Date | null | undefined): Date {
  return date || LAST_MAJOR_UPDATE;
}

/**
 * Cria entrada de sitemap padronizada
 */
function createEntry(
  path: string,
  options: {
    lastModified?: Date | null;
    changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority?: number;
  } = {}
): MetadataRoute.Sitemap[0] {
  return {
    url: path.startsWith("http") ? path : `${BASE_URL}${path}`,
    lastModified: toSitemapDate(options.lastModified),
    changeFrequency: options.changeFrequency || "weekly",
    priority: options.priority ?? PRIORITY.MEDIUM,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// GERADOR DE SITEMAP
// ═══════════════════════════════════════════════════════════════════════════

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPages: MetadataRoute.Sitemap = [];

  // ─────────────────────────────────────────────────────────────────────────
  // 1. PÁGINAS CORE (Alta Prioridade de Conversão)
  // ─────────────────────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    // Homepage - Máxima prioridade
    createEntry("/", {
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: PRIORITY.CRITICAL,
    }),
    
    // Landing B2B - Alta conversão
    createEntry("/para-empresas", {
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: "weekly",
      priority: PRIORITY.CRITICAL,
    }),
    
    // Blog Hub - Content Marketing
    createEntry("/blog", {
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: PRIORITY.HIGH,
    }),
    
    // Diretório de Lava-Jatos
    createEntry("/encontrar", {
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: PRIORITY.HIGH,
    }),
  ];
  
  allPages.push(...corePages);

  // ─────────────────────────────────────────────────────────────────────────
  // 2. PÁGINAS DE CONVERSÃO (Fluxo de Cadastro)
  // ─────────────────────────────────────────────────────────────────────────
  const conversionPages: MetadataRoute.Sitemap = [
    createEntry("/registro", {
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: "monthly",
      priority: PRIORITY.MEDIUM_HIGH,
    }),
    createEntry("/cadastro", {
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: "monthly",
      priority: PRIORITY.LOW,
    }),
    createEntry("/login", {
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: "yearly",
      priority: PRIORITY.LOW,
    }),
    createEntry("/entrar", {
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: "yearly",
      priority: PRIORITY.LOW,
    }),
  ];
  
  allPages.push(...conversionPages);

  // ─────────────────────────────────────────────────────────────────────────
  // 3. PÁGINAS DE CIDADE (SEO Local)
  // ─────────────────────────────────────────────────────────────────────────
  const cidadeSlugs = getAllCidadeSlugs();
  
  const cidadePages: MetadataRoute.Sitemap = cidadeSlugs.map((slug, index) => {
    // Top 20 cidades têm prioridade maior (mais tráfego potencial)
    const priority = index < 20 ? PRIORITY.MEDIUM_HIGH : PRIORITY.MEDIUM;
    
    return createEntry(`/sistema-lava-rapido/${slug}`, {
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: "monthly",
      priority,
    });
  });
  
  allPages.push(...cidadePages);

  // ─────────────────────────────────────────────────────────────────────────
  // 4. PÁGINAS DE SOLUÇÕES (Serviço + Cidade)
  // ─────────────────────────────────────────────────────────────────────────
  const cidadesTop30 = cidadesBrasil.slice(0, 30);
  const solucoesPages: MetadataRoute.Sitemap = [];
  
  for (const servico of servicosAutomotivos) {
    for (let i = 0; i < cidadesTop30.length; i++) {
      const cidade = cidadesTop30[i];
      // Cidades maiores (top 10) têm prioridade maior
      const priority = i < 10 ? PRIORITY.MEDIUM : PRIORITY.MEDIUM_LOW;
      
      solucoesPages.push(
        createEntry(`/solucoes/${servico.slug}-${cidade.slug}`, {
          lastModified: LAST_MAJOR_UPDATE,
          changeFrequency: "monthly",
          priority,
        })
      );
    }
  }
  
  allPages.push(...solucoesPages);

  // ─────────────────────────────────────────────────────────────────────────
  // 5. GUIAS EDUCACIONAIS (com conteúdo enriquecido)
  // ─────────────────────────────────────────────────────────────────────────
  const guiasPages: MetadataRoute.Sitemap = [];
  
  // Guias sem cidade (conteúdo principal)
  for (const problema of problemasLavaJato) {
    guiasPages.push(
      createEntry(`/guias/${problema.slug}`, {
        lastModified: LAST_MAJOR_UPDATE,
        changeFrequency: "monthly",
        priority: PRIORITY.MEDIUM_HIGH,
      })
    );
  }
  
  // Guias com cidade (SEO local específico)
  const problemasComCidade = [
    "tabela-precos-lavagem",
    "tabela-precos-estetica-automotiva",
    "como-abrir-lava-jato",
  ];
  
  const cidadesTop20 = cidadesBrasil.slice(0, 20);
  
  for (const problemaSlug of problemasComCidade) {
    for (let i = 0; i < cidadesTop20.length; i++) {
      const cidade = cidadesTop20[i];
      const priority = i < 10 ? PRIORITY.MEDIUM : PRIORITY.MEDIUM_LOW;
      
      guiasPages.push(
        createEntry(`/guias/${problemaSlug}-${cidade.slug}`, {
          lastModified: LAST_MAJOR_UPDATE,
          changeFrequency: "monthly",
          priority,
        })
      );
    }
  }
  
  allPages.push(...guiasPages);

  // ─────────────────────────────────────────────────────────────────────────
  // 6. AUTOR (E-E-A-T)
  // ─────────────────────────────────────────────────────────────────────────
  const autorPages: MetadataRoute.Sitemap = [
    createEntry("/autor/lucas-pinheiro", {
      lastModified: LAST_MAJOR_UPDATE,
      changeFrequency: "monthly",
      priority: PRIORITY.MEDIUM,
    }),
  ];
  
  allPages.push(...autorPages);

  // ─────────────────────────────────────────────────────────────────────────
  // 7. LAVA-JATOS CADASTRADOS (Conteúdo Dinâmico)
  // ─────────────────────────────────────────────────────────────────────────
  try {
    const lavaJatos = await prisma.lavaJato.findMany({
      where: { 
        ativo: true, 
        slug: { not: null } 
      },
      select: { 
        slug: true, 
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const lavaJatoPages: MetadataRoute.Sitemap = lavaJatos.map((lj) => 
      createEntry(`/lavajato/${lj.slug}`, {
        lastModified: lj.createdAt,
        changeFrequency: "weekly",
        priority: PRIORITY.MEDIUM_HIGH,
      })
    );
    
    allPages.push(...lavaJatoPages);
  } catch (error) {
    console.error("[Sitemap] Erro ao buscar lava-jatos:", error);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 8. BLOG POSTS (Conteúdo Dinâmico - Alta Prioridade SEO)
  // ─────────────────────────────────────────────────────────────────────────
  try {
    const blogPosts = await prisma.blogPost.findMany({
      where: { status: "PUBLICADO" },
      select: { 
        slug: true, 
        publicadoEm: true, 
        atualizadoEm: true,
        categoria: true,
      },
      orderBy: { publicadoEm: "desc" },
    }) as Array<{
      slug: string;
      publicadoEm: Date | null;
      atualizadoEm: Date;
      categoria: string;
    }>;

    const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => {
      // Posts mais recentes têm prioridade maior
      const isRecent = post.publicadoEm && 
        (new Date().getTime() - new Date(post.publicadoEm).getTime()) < 30 * 24 * 60 * 60 * 1000;
      
      return createEntry(`/blog/${post.slug}`, {
        lastModified: post.atualizadoEm || post.publicadoEm,
        changeFrequency: isRecent ? "daily" : "weekly",
        priority: isRecent ? PRIORITY.HIGH : PRIORITY.MEDIUM_HIGH,
      });
    });
    
    allPages.push(...blogPostPages);
  } catch (error) {
    console.error("[Sitemap] Erro ao buscar blog posts:", error);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOG DE ESTATÍSTICAS (apenas em desenvolvimento)
  // ─────────────────────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    SITEMAP GERADO                             ║
╠═══════════════════════════════════════════════════════════════╣
║  Total de URLs: ${String(allPages.length).padStart(5)}                                    ║
║  - Core:        ${String(corePages.length).padStart(5)}                                    ║
║  - Conversão:   ${String(conversionPages.length).padStart(5)}                                    ║
║  - Cidades:     ${String(cidadePages.length).padStart(5)}                                    ║
║  - Soluções:    ${String(solucoesPages.length).padStart(5)}                                    ║
║  - Guias:       ${String(guiasPages.length).padStart(5)}                                    ║
╚═══════════════════════════════════════════════════════════════╝
    `);
  }

  return allPages;
}

// ═══════════════════════════════════════════════════════════════════════════
// METADATA EXPORT (robots.txt integration)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Para referência no robots.txt:
 * Sitemap: https://www.lavify.com.br/sitemap.xml
 */
