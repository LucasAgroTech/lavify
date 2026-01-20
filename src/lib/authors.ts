// Sistema de Autoria para SEO E-E-A-T
// Autores especializados para construção de autoridade no nicho de lava-rápidos

export interface Author {
  id: string;
  slug: string;
  nome: string;
  nomeCompleto: string;
  cargo: string;
  especialidade: string;
  bio: string;
  bioExpandida: string;
  fotoUrl: string;
  redesSociais: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  // Áreas de expertise para mapeamento temático
  expertiseAreas: string[];
  // Credenciais para E-E-A-T
  credenciais: {
    formacao: string[];
    certificacoes: string[];
    experiencia: string[];
  };
  // Dados da organização para Schema
  organizacao: {
    nome: string;
    cargo: string;
    url: string;
  };
}

// Categorias de conteúdo para mapeamento de autoridade
export type CategoriaConteudo = 
  | "gestao"
  | "financeiro"
  | "tecnologia"
  | "marketing"
  | "operacoes"
  | "sustentabilidade"
  | "legal"
  | "frotas";

// Mapeamento de tipos de página para categorias
export const categoriasPorTipo: Record<string, CategoriaConteudo[]> = {
  "problema": ["gestao", "operacoes"],
  "funcionalidade": ["tecnologia", "gestao"],
  "comparativo": ["gestao", "tecnologia"],
  "guia": ["gestao", "operacoes", "financeiro"],
};

// Autor principal: Lucas Pinheiro - Fundador do Lavify
export const lucasPinheiro: Author = {
  id: "lucas-pinheiro",
  slug: "lucas-pinheiro",
  nome: "Lucas Pinheiro",
  nomeCompleto: "Lucas Pinheiro da Costa Rodrigues",
  cargo: "Fundador & Desenvolvedor",
  especialidade: "Automação e Tecnologia para Estética Automotiva",
  bio: "Lucas Pinheiro é cientista de dados, desenvolvedor e fundador do Lavify. Especialista em automação de processos e sistemas de gestão para pequenos negócios, combina expertise técnica com visão prática do mercado de lava-rápidos.",
  bioExpandida: `Lucas Pinheiro da Costa Rodrigues é cientista de dados, desenvolvedor full-stack e empreendedor no setor de tecnologia para pequenos negócios. Com pós-graduação em Big Data Aplicado ao Marketing Intelligence pela PUC-PR e formação em Gestão do Agronegócio pela Faculdade CNA, Lucas combina uma sólida base analítica com visão estratégica de negócios.

Ao longo de sua carreira, atuou como cientista de dados na EMBRAPII, consultor de banco de dados no Ministério da Saúde e assessor técnico no Instituto CNA, desenvolvendo expertise em análise de dados, automação de processos e criação de sistemas inteligentes.

Fundou o Lavify com a missão de democratizar a tecnologia de gestão para lava-rápidos e estéticas automotivas no Brasil. O sistema nasceu da observação das dificuldades enfrentadas por donos de lava-jato que ainda gerenciam seus negócios com planilhas e papel, oferecendo uma solução moderna, intuitiva e acessível.

Lucas escreve sobre gestão de lava-rápidos, automação de processos, tecnologia para pequenos negócios e estratégias de crescimento no setor de estética automotiva.`,
  fotoUrl: "/as-pinheiro.webp",
  redesSociais: {
    linkedin: "https://www.linkedin.com/in/lucas-pinheiro-da-costa-rodrigues-18068b191/",
    github: "https://github.com/lucaspinheiro",
    website: "https://www.lavify.com.br",
  },
  expertiseAreas: [
    "gestao",
    "tecnologia",
    "financeiro",
    "marketing",
    "operacoes",
    "sustentabilidade",
    "legal",
    "frotas",
  ],
  credenciais: {
    formacao: [
      "Pós-graduação em Big Data Aplicado ao Marketing Intelligence - PUC-PR",
      "Tecnólogo em Gestão do Agronegócio - Faculdade CNA",
    ],
    certificacoes: [
      "Machine Learning Model - Codecademy",
      "Python Web Apps with Flask - Codecademy",
    ],
    experiencia: [
      "Cientista de Dados Pleno - EMBRAPII",
      "Consultor de Banco de Dados - Ministério da Saúde",
      "Assessor Técnico - Instituto CNA",
      "Analista de Mídia - Pólvora Comunicação",
    ],
  },
  organizacao: {
    nome: "Lavify",
    cargo: "Fundador & Desenvolvedor",
    url: "https://www.lavify.com.br",
  },
};

// Lista de todos os autores (para expansão futura)
export const autores: Author[] = [lucasPinheiro];

// Funções de busca
export function getAuthorBySlug(slug: string): Author | undefined {
  return autores.find((a) => a.slug === slug);
}

export function getAuthorById(id: string): Author | undefined {
  return autores.find((a) => a.id === id);
}

export function getAllAuthorSlugs(): string[] {
  return autores.map((a) => a.slug);
}

// Obter autor para um tipo de conteúdo
// Por enquanto retorna sempre Lucas, mas preparado para múltiplos autores
export function getAuthorForContent(tipo?: string): Author {
  // Para expansão futura: mapear autores por área de expertise
  // const categorias = tipo ? categoriasPorTipo[tipo] || [] : [];
  // const autorEspecializado = autores.find(a => 
  //   categorias.some(cat => a.expertiseAreas.includes(cat))
  // );
  // return autorEspecializado || lucasPinheiro;
  
  return lucasPinheiro;
}

// Gerar Schema JSON-LD para Person (página de autor)
export function generateAuthorPersonSchema(author: Author, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/autor/${author.slug}#person`,
    name: author.nomeCompleto,
    givenName: author.nome.split(" ")[0],
    familyName: author.nome.split(" ").slice(1).join(" "),
    jobTitle: author.cargo,
    description: author.bio,
    url: `${baseUrl}/autor/${author.slug}`,
    image: `${baseUrl}${author.fotoUrl}`,
    sameAs: [
      author.redesSociais.linkedin,
      author.redesSociais.github,
      author.redesSociais.instagram,
      author.redesSociais.twitter,
      author.redesSociais.website,
    ].filter(Boolean),
    worksFor: {
      "@type": "Organization",
      name: author.organizacao.nome,
      url: author.organizacao.url,
    },
    alumniOf: author.credenciais.formacao.map((formacao) => ({
      "@type": "EducationalOrganization",
      name: formacao.split(" - ")[1] || formacao,
    })),
    knowsAbout: [
      "Gestão de Lava Rápido",
      "Automação de Processos",
      "Sistemas de Gestão",
      "Estética Automotiva",
      "Tecnologia para Pequenos Negócios",
      "Análise de Dados",
      "Marketing Digital",
    ],
  };
}

// Gerar Schema JSON-LD para Article com autor
export function generateArticleWithAuthorSchema(
  article: {
    titulo: string;
    descricao: string;
    slug: string;
    dataPublicacao?: string;
    dataModificacao?: string;
    imagemUrl?: string;
  },
  author: Author,
  baseUrl: string
) {
  const dataPublicacao = article.dataPublicacao || "2026-01-01";
  const dataModificacao = article.dataModificacao || new Date().toISOString().split("T")[0];

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${baseUrl}/${article.slug}#article`,
    headline: article.titulo,
    description: article.descricao,
    url: `${baseUrl}/${article.slug}`,
    image: article.imagemUrl || `${baseUrl}/og-image.png`,
    datePublished: dataPublicacao,
    dateModified: dataModificacao,
    author: {
      "@type": "Person",
      "@id": `${baseUrl}/autor/${author.slug}#person`,
      name: author.nomeCompleto,
      url: `${baseUrl}/autor/${author.slug}`,
      jobTitle: author.cargo,
      sameAs: [
        author.redesSociais.linkedin,
        author.redesSociais.github,
      ].filter(Boolean),
    },
    publisher: {
      "@type": "Organization",
      name: "Lavify",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${article.slug}`,
    },
    isAccessibleForFree: true,
    inLanguage: "pt-BR",
  };
}

