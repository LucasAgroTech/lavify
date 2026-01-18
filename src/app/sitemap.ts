import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getAllCidadeSlugs, cidadesBrasil } from "@/lib/seo-cities";
import { getAllPaginaSEOSlugs } from "@/lib/seo-keywords";
import { servicosAutomotivos } from "@/lib/seo-services";
import { problemasLavaJato } from "@/lib/seo-problems";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/para-empresas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/encontrar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/entrar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cadastro`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Páginas SEO programático - cidades
  const cidadeSlugs = getAllCidadeSlugs();
  const cidadePages: MetadataRoute.Sitemap = cidadeSlugs.map((slug) => ({
    url: `${baseUrl}/sistema-lava-rapido/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Páginas SEO programático - keywords estratégicas
  const keywordSlugs = getAllPaginaSEOSlugs();
  const keywordPages: MetadataRoute.Sitemap = keywordSlugs.map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // ═══════════════════════════════════════════════════════════════════
  // NOVAS PÁGINAS DE SEO PROGRAMÁTICO
  // ═══════════════════════════════════════════════════════════════════

  // Páginas de Soluções (Serviço + Cidade)
  const cidadesTop30 = cidadesBrasil.slice(0, 30);
  const solucoesPages: MetadataRoute.Sitemap = [];
  
  for (const servico of servicosAutomotivos) {
    for (const cidade of cidadesTop30) {
      solucoesPages.push({
        url: `${baseUrl}/solucoes/${servico.slug}-${cidade.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      });
    }
  }

  // Páginas de Guias (Problemas)
  const guiasPages: MetadataRoute.Sitemap = [];
  
  // Guias sem cidade
  for (const problema of problemasLavaJato) {
    guiasPages.push({
      url: `${baseUrl}/guias/${problema.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    });
  }
  
  // Guias com cidade (apenas alguns problemas que fazem sentido)
  const problemasComCidade = [
    "tabela-precos-lavagem",
    "tabela-precos-estetica-automotiva",
    "como-abrir-lava-jato",
  ];
  
  const cidadesTop20 = cidadesBrasil.slice(0, 20);
  
  for (const problemaSlug of problemasComCidade) {
    for (const cidade of cidadesTop20) {
      guiasPages.push({
        url: `${baseUrl}/guias/${problemaSlug}-${cidade.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════

  // Páginas dinâmicas dos lava jatos
  let lavaJatoPages: MetadataRoute.Sitemap = [];
  
  try {
    const lavaJatos = await prisma.lavaJato.findMany({
      where: { ativo: true, slug: { not: null } },
      select: { slug: true, createdAt: true },
    });

    lavaJatoPages = lavaJatos.map((lj) => ({
      url: `${baseUrl}/lavajato/${lj.slug}`,
      lastModified: lj.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Erro ao gerar sitemap de lava jatos:", error);
  }

  return [
    ...staticPages, 
    ...keywordPages, 
    ...cidadePages, 
    ...solucoesPages,
    ...guiasPages,
    ...lavaJatoPages
  ];
}
