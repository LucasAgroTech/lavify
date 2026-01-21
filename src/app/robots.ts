/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROBOTS.TXT - Lavify
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Configuração otimizada para Google 2026:
 * - Permite indexação de todo conteúdo público
 * - Bloqueia áreas administrativas e de API
 * - Referencia o sitemap.xml
 * - Configurações específicas para bots de IA (GPTBot, etc.)
 * 
 * Referência: https://developers.google.com/search/docs/crawling-indexing/robots
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

  return {
    rules: [
      // ─────────────────────────────────────────────────────────────────────
      // REGRA PRINCIPAL: Googlebot e todos os crawlers
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "*",
        allow: [
          "/",                      // Homepage
          "/para-empresas",         // Landing B2B
          "/blog",                  // Blog e artigos
          "/blog/",                 // Posts individuais
          "/encontrar",             // Diretório de lava-jatos
          "/lavajato/",             // Páginas públicas de lava-jatos
          "/sistema-lava-rapido/",  // Páginas de cidade
          "/solucoes/",             // Páginas de soluções
          "/guias/",                // Guias educacionais
          "/autor/",                // Páginas de autor (E-E-A-T)
          "/cadastro",              // Cadastro cliente
          "/entrar",                // Login cliente
          "/registro",              // Registro lava-jato
          "/login",                 // Login lava-jato
        ],
        disallow: [
          // Áreas administrativas
          "/dashboard",
          "/dashboard/",
          "/superadmin",
          "/superadmin/",
          "/configuracoes",
          "/kanban",
          "/nova-os",
          "/equipe",
          "/clientes",
          "/financeiro",
          "/estoque",
          "/servicos",
          "/veiculos",
          "/perfil",
          "/agendamentos",
          "/meus-agendamentos",
          "/planos",
          
          // APIs (não devem ser indexadas)
          "/api/",
          
          // Recursos do Next.js
          "/_next/",
          
          // Agendamento público (fluxo interno)
          "/agendar/",
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // REGRA ESPECÍFICA: Googlebot-Image
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "Googlebot-Image",
        allow: [
          "/",
          "/*.png$",
          "/*.jpg$",
          "/*.jpeg$",
          "/*.webp$",
          "/*.svg$",
        ],
        disallow: [
          "/api/",
          "/_next/",
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // REGRA PARA BOTS DE IA (GPTBot, ChatGPT, Bard, etc.)
      // Permitimos indexação para aparecer em respostas de IA
      // ─────────────────────────────────────────────────────────────────────
      {
        userAgent: "GPTBot",
        allow: [
          "/",
          "/para-empresas",
          "/blog",
          "/blog/",
          "/guias/",
          "/autor/",
        ],
        disallow: [
          "/api/",
          "/dashboard",
          "/superadmin",
          "/_next/",
        ],
      },
      {
        userAgent: "ChatGPT-User",
        allow: [
          "/",
          "/para-empresas",
          "/blog",
          "/blog/",
          "/guias/",
        ],
        disallow: [
          "/api/",
          "/dashboard",
          "/superadmin",
        ],
      },
      {
        userAgent: "Google-Extended",
        allow: [
          "/",
          "/para-empresas",
          "/blog",
          "/blog/",
          "/guias/",
        ],
        disallow: [
          "/api/",
          "/dashboard",
          "/superadmin",
        ],
      },
    ],

    // ─────────────────────────────────────────────────────────────────────
    // SITEMAP
    // ─────────────────────────────────────────────────────────────────────
    sitemap: `${baseUrl}/sitemap.xml`,

    // ─────────────────────────────────────────────────────────────────────
    // HOST (opcional, mas recomendado para domínio canônico)
    // ─────────────────────────────────────────────────────────────────────
    host: baseUrl,
  };
}

