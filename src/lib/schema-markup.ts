/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCHEMA MARKUP LIBRARY - Lavify
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Biblioteca centralizada de Schema Markup (JSON-LD) otimizada para:
 * - Rich Snippets no Google
 * - Maior CTR nos resultados de busca
 * - E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
 * 
 * Tipos implementados:
 * 1. SoftwareApplication (SaaS)
 * 2. Organization (Marca)
 * 3. WebSite (Search Action)
 * 4. FAQPage (Perguntas Expandíveis)
 * 5. Product/Offer (Planos e Preços)
 * 6. LocalBusiness (SEO Local)
 * 7. Person (Autor - E-E-A-T)
 * 8. BreadcrumbList (Navegação)
 * 9. HowTo (Guias passo-a-passo)
 * 10. Article/BlogPosting
 * 
 * Referência: https://schema.org
 * Validador: https://search.google.com/test/rich-results
 * ═══════════════════════════════════════════════════════════════════════════
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

// ═══════════════════════════════════════════════════════════════════════════
// 1. SOFTWARE APPLICATION (Principal para SaaS)
// ═══════════════════════════════════════════════════════════════════════════
export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/#software`,
  name: "Lavify",
  alternateName: "Lavify - Sistema para Lava Rápido",
  description: "Sistema de gestão completo para lava rápido e lava jato. Controle pátio, agendamentos, estoque, equipe e financeiro pelo celular.",
  url: BASE_URL,
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Gestão Empresarial",
  operatingSystem: "Web Browser, iOS, Android",
  softwareVersion: "2.0",
  releaseNotes: "Nova versão com Kanban visual, WhatsApp automático e programa de fidelidade",
  
  // ⭐ AGREGGATE RATING - Gera as estrelinhas douradas
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1847",
    reviewCount: "1523",
    bestRating: "5",
    worstRating: "1",
  },
  
  // 💰 OFFERS - Mostra preços no snippet
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "199.90",
    priceCurrency: "BRL",
    offerCount: "4",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2026-12-31",
    seller: {
      "@type": "Organization",
      name: "Lavify",
    },
  },
  
  // 🎯 FEATURES
  featureList: [
    "Kanban visual do pátio em tempo real",
    "Agendamento online 24 horas",
    "Notificações automáticas no WhatsApp",
    "Controle de estoque com alertas",
    "Gestão financeira completa",
    "Controle de equipe e comissões",
    "Programa de fidelidade configurável",
    "Relatórios gerenciais",
    "Acesso pelo celular de qualquer lugar",
  ],
  
  // 📸 IMAGENS
  screenshot: [
    `${BASE_URL}/hero-1.webp`,
    `${BASE_URL}/hero-2.webp`,
    `${BASE_URL}/hero-3.webp`,
  ],
  
  // 🏢 PUBLISHER
  author: {
    "@type": "Organization",
    name: "Lavify",
    url: BASE_URL,
  },
  
  // 🎓 REQUISITOS
  softwareRequirements: "Navegador web moderno (Chrome, Firefox, Safari, Edge)",
  memoryRequirements: "Mínimo 2GB RAM",
  storageRequirements: "Baseado em nuvem - sem instalação",
};

// ═══════════════════════════════════════════════════════════════════════════
// 2. ORGANIZATION (Autoridade da Marca)
// ═══════════════════════════════════════════════════════════════════════════
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Lavify",
  legalName: "Lavify Tecnologia LTDA",
  alternateName: ["Lavify App", "Sistema Lavify", "Lavify para Lava Rápido"],
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/lavify.png`,
    width: "512",
    height: "512",
  },
  image: `${BASE_URL}/og-image.png`,
  description: "Empresa brasileira especializada em software de gestão para lava rápidos e lava jatos. Transformamos a gestão do seu negócio com tecnologia simples e eficiente.",
  foundingDate: "2024",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasília",
      addressRegion: "DF",
      addressCountry: "BR",
    },
  },
  
  // 🔗 REDES SOCIAIS (sameAs)
  sameAs: [
    "https://www.instagram.com/lavifyapp",
    "https://www.facebook.com/lavifyapp",
    "https://www.linkedin.com/company/lavify",
    "https://twitter.com/lavifyapp",
    "https://www.youtube.com/@lavifyapp",
  ],
  
  // 📞 CONTATO
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Portuguese"],
      areaServed: "BR",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      availableLanguage: ["Portuguese"],
      areaServed: "BR",
    },
  ],
  
  // 📍 ENDEREÇO
  address: {
    "@type": "PostalAddress",
    addressCountry: "BR",
    addressRegion: "DF",
    addressLocality: "Brasília",
  },
  
  // 🏆 AGREGGATE RATING
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1847",
    bestRating: "5",
    worstRating: "1",
  },
  
  // 👤 FUNDADOR
  founder: {
    "@type": "Person",
    name: "Lucas Pinheiro",
    url: `${BASE_URL}/autor/lucas-pinheiro`,
  },
  
  // 🎯 ÁREA DE ATUAÇÃO
  areaServed: {
    "@type": "Country",
    name: "Brasil",
  },
  
  // 💼 SETOR
  industry: "Software & Technology",
  
  // 📧 EMAIL
  email: "contato@lavify.com.br",
};

// ═══════════════════════════════════════════════════════════════════════════
// 3. WEBSITE (Search Action para Sitelinks Searchbox)
// ═══════════════════════════════════════════════════════════════════════════
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Lavify",
  alternateName: "Lavify - Sistema para Lava Rápido",
  url: BASE_URL,
  description: "Plataforma de gestão para lava rápido e lava jato. Encontre lava-jatos, agende lavagens e gerencie seu negócio.",
  inLanguage: "pt-BR",
  
  // 🔍 SEARCH ACTION (Sitelinks Searchbox)
  potentialAction: [
    {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/encontrar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  ],
  
  // 🏢 PUBLISHER
  publisher: {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
  },
  
  // 📰 COPYRIGHTS
  copyrightHolder: {
    "@type": "Organization",
    name: "Lavify",
  },
  copyrightYear: "2024",
};

// ═══════════════════════════════════════════════════════════════════════════
// 4. FAQ PAGE (Perguntas Expandíveis nos Resultados)
// ═══════════════════════════════════════════════════════════════════════════
export interface FAQItem {
  pergunta: string;
  resposta: string;
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.resposta,
      },
    })),
  };
}

// FAQ da landing page /para-empresas
// ⚠️ IMPORTANTE: Este conteúdo DEVE ser IDÊNTICO ao FAQ visível na página
// para evitar "Spammy Structured Data" e penalização do Google
export const landingPageFAQs: FAQItem[] = [
  {
    pergunta: "Preciso instalar algo no computador?",
    resposta: "Não! Funciona 100% no navegador. Acesse www.lavify.com.br, faça login e pronto. Nada de instalação.",
  },
  {
    pergunta: "Funciona no celular?",
    resposta: "Sim! Interface feita mobile-first. Seu lavador pode arrastar carros no Kanban pelo celular, você acompanha o caixa de qualquer lugar.",
  },
  {
    pergunta: "E se meu lavador não souber usar?",
    resposta: "O Kanban é visual: arrastar carro de 'Lavando' para 'Pronto' é tão simples quanto mover um post-it. Em 10 minutos qualquer um aprende.",
  },
  {
    pergunta: "Como configuro os níveis de equipe?",
    resposta: "Na aba Equipe, você cadastra cada funcionário e escolhe o nível: Gerente, Atendente, Lavador Sênior ou Lavador. O sistema já aplica as permissões automaticamente.",
  },
  {
    pergunta: "Posso criar meu próprio programa de fidelidade?",
    resposta: "Sim! Você escolhe entre pontos, cashback ou plano mensal. Define as regras (quantos pontos por real, % de cashback) e o sistema faz tudo automaticamente.",
  },
  {
    pergunta: "Meus dados ficam seguros?",
    resposta: "Dados criptografados, servidores seguros, backup diário automático. Só você e quem autorizar tem acesso.",
  },
];

export const landingPageFAQSchema = generateFAQSchema(landingPageFAQs);

// ═══════════════════════════════════════════════════════════════════════════
// 5. PRODUCT/OFFER (Planos e Preços)
// ═══════════════════════════════════════════════════════════════════════════
export const productOffersSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${BASE_URL}/planos/#product`,
  name: "Lavify - Sistema de Gestão para Lava Rápido",
  description: "Sistema completo de gestão para lava rápido e lava jato com Kanban visual, agendamento online, WhatsApp automático e muito mais.",
  url: `${BASE_URL}/para-empresas`,
  brand: {
    "@type": "Brand",
    name: "Lavify",
  },
  
  // ⭐ RATING
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "1523",
    bestRating: "5",
    worstRating: "1",
  },
  
  // 💰 OFERTAS (Planos)
  offers: [
    {
      "@type": "Offer",
      name: "Plano Starter",
      description: "Ideal para começar. Até 50 clientes, Kanban básico, 1 usuário.",
      price: "0",
      priceCurrency: "BRL",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/registro`,
      seller: {
        "@type": "Organization",
        name: "Lavify",
      },
    },
    {
      "@type": "Offer",
      name: "Plano Pro",
      description: "Para lava-jatos em crescimento. Clientes ilimitados, WhatsApp automático, 3 usuários, relatórios.",
      price: "97.00",
      priceCurrency: "BRL",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/registro?plano=pro`,
      seller: {
        "@type": "Organization",
        name: "Lavify",
      },
    },
    {
      "@type": "Offer",
      name: "Plano Premium",
      description: "Solução completa. Tudo do Pro + Fidelidade, Múltiplas unidades, Usuários ilimitados, API.",
      price: "199.90",
      priceCurrency: "BRL",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/registro?plano=premium`,
      seller: {
        "@type": "Organization",
        name: "Lavify",
      },
    },
  ],
  
  // 📸 IMAGEM
  image: `${BASE_URL}/og-image.png`,
  
  // 🏷️ CATEGORIA
  category: "Software > Business Software > Management Software",
};

// ═══════════════════════════════════════════════════════════════════════════
// 6. LOCAL BUSINESS (SEO Local para Lava-Jatos)
// ═══════════════════════════════════════════════════════════════════════════
export interface LavaJatoInfo {
  nome: string;
  slug: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  horarioAbertura?: string;
  horarioFechamento?: string;
  avaliacao?: number;
  totalAvaliacoes?: number;
  servicos?: string[];
  imagem?: string;
}

export function generateLocalBusinessSchema(lavaJato: LavaJatoInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    "@id": `${BASE_URL}/lavajato/${lavaJato.slug}/#localbusiness`,
    name: lavaJato.nome,
    url: `${BASE_URL}/lavajato/${lavaJato.slug}`,
    image: lavaJato.imagem || `${BASE_URL}/og-image.png`,
    telephone: lavaJato.telefone,
    
    address: lavaJato.endereco ? {
      "@type": "PostalAddress",
      streetAddress: lavaJato.endereco,
      addressLocality: lavaJato.cidade,
      addressRegion: lavaJato.estado,
      addressCountry: "BR",
    } : undefined,
    
    ...(lavaJato.avaliacao && lavaJato.totalAvaliacoes && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: lavaJato.avaliacao.toString(),
        reviewCount: lavaJato.totalAvaliacoes.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    }),
    
    ...(lavaJato.horarioAbertura && lavaJato.horarioFechamento && {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: lavaJato.horarioAbertura,
        closes: lavaJato.horarioFechamento,
      },
    }),
    
    ...(lavaJato.servicos && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços",
        itemListElement: lavaJato.servicos.map((servico, index) => ({
          "@type": "Offer",
          position: index + 1,
          itemOffered: {
            "@type": "Service",
            name: servico,
          },
        })),
      },
    }),
    
    priceRange: "$$",
    paymentAccepted: "Dinheiro, Cartão de Crédito, Cartão de Débito, Pix",
    currenciesAccepted: "BRL",
    
    // Integração com Lavify
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/agendar/${lavaJato.slug}`,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      result: {
        "@type": "Reservation",
        name: "Agendamento de Lavagem",
      },
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. PERSON (Autor - E-E-A-T)
// ═══════════════════════════════════════════════════════════════════════════
export const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/autor/lucas-pinheiro/#person`,
  name: "Lucas Pinheiro",
  givenName: "Lucas",
  familyName: "Pinheiro",
  url: `${BASE_URL}/autor/lucas-pinheiro`,
  image: `${BASE_URL}/as-pinheiro.webp`,
  jobTitle: "Fundador & Desenvolvedor",
  description: "Cientista de dados e desenvolvedor. Fundador do Lavify, especialista em automação e tecnologia para estética automotiva.",
  
  sameAs: [
    "https://www.linkedin.com/in/lucas-pinheiro-da-costa-rodrigues-18068b191/",
    "https://github.com/LucasAgroTech",
    "https://lucaspinheiro.dev.br",
  ],
  
  worksFor: {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Lavify",
  },
  
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "Pontifícia Universidade Católica do Paraná",
    },
    {
      "@type": "EducationalOrganization",
      name: "Faculdade CNA",
    },
  ],
  
  knowsAbout: [
    "Gestão de Lava Rápido",
    "Automação Empresarial",
    "Big Data",
    "Marketing Intelligence",
    "Desenvolvimento Web",
    "Python",
    "Machine Learning",
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// 8. BREADCRUMB LIST (Navegação Estruturada)
// ═══════════════════════════════════════════════════════════════════════════
export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? (item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`) : undefined,
    })),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. HOW TO (Guias Passo-a-Passo)
// ═══════════════════════════════════════════════════════════════════════════
export interface HowToStep {
  titulo: string;
  descricao: string;
  imagem?: string;
}

export function generateHowToSchema(
  titulo: string,
  descricao: string,
  passos: HowToStep[],
  options: {
    tempoTotal?: string; // ISO 8601 duration, ex: "PT30M"
    custo?: { valor: string; moeda: string };
    ferramentas?: string[];
  } = {}
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: titulo,
    description: descricao,
    
    ...(options.tempoTotal && { totalTime: options.tempoTotal }),
    
    ...(options.custo && {
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: options.custo.moeda,
        value: options.custo.valor,
      },
    }),
    
    ...(options.ferramentas && {
      tool: options.ferramentas.map((ferramenta) => ({
        "@type": "HowToTool",
        name: ferramenta,
      })),
    }),
    
    step: passos.map((passo, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: passo.titulo,
      text: passo.descricao,
      ...(passo.imagem && {
        image: {
          "@type": "ImageObject",
          url: passo.imagem,
        },
      }),
    })),
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. ARTICLE/BLOG POSTING
// ═══════════════════════════════════════════════════════════════════════════
export interface ArticleInfo {
  titulo: string;
  descricao: string;
  slug: string;
  imagem?: string;
  dataPublicacao?: string;
  dataModificacao?: string;
  categoria?: string;
  palavrasChave?: string[];
}

export function generateArticleSchema(article: ArticleInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE_URL}/blog/${article.slug}/#article`,
    headline: article.titulo,
    description: article.descricao,
    url: `${BASE_URL}/blog/${article.slug}`,
    image: article.imagem || `${BASE_URL}/og-image.png`,
    datePublished: article.dataPublicacao,
    dateModified: article.dataModificacao || article.dataPublicacao,
    
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/autor/lucas-pinheiro/#person`,
      name: "Lucas Pinheiro",
      url: `${BASE_URL}/autor/lucas-pinheiro`,
    },
    
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Lavify",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/lavify.png`,
      },
    },
    
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${article.slug}`,
    },
    
    ...(article.categoria && { articleSection: article.categoria }),
    ...(article.palavrasChave && { keywords: article.palavrasChave.join(", ") }),
    
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTAÇÃO DE SCHEMAS GLOBAIS
// ═══════════════════════════════════════════════════════════════════════════
export const globalSchemas = {
  softwareApplication: softwareApplicationSchema,
  organization: organizationSchema,
  website: websiteSchema,
  author: authorSchema,
  productOffers: productOffersSchema,
  landingPageFAQ: landingPageFAQSchema,
};

// Helper para converter schema para string JSON
export function schemaToJSON(schema: object): string {
  return JSON.stringify(schema);
}

// Helper para criar script tag de Schema
export function createSchemaScript(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

