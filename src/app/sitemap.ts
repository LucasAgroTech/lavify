import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

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

  return [...staticPages, ...lavaJatoPages];
}





