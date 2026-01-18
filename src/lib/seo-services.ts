// Serviços automotivos para SEO programático
// Combinação Serviço + Cidade gera páginas únicas

export interface ServicoSEO {
  slug: string;
  nome: string;
  nomeCompleto: string;
  descricao: string;
  keywords: string[];
  emoji: string;
}

export const servicosAutomotivos: ServicoSEO[] = [
  {
    slug: "estetica-automotiva",
    nome: "Estética Automotiva",
    nomeCompleto: "Sistema de Gestão para Estética Automotiva",
    descricao: "Gerencie seu centro de estética automotiva com controle de serviços premium, agendamentos e fidelização de clientes.",
    keywords: ["estética automotiva", "detalhamento automotivo", "polimento", "cristalização", "higienização interna"],
    emoji: "✨"
  },
  {
    slug: "lavagem-a-seco",
    nome: "Lavagem a Seco",
    nomeCompleto: "Software para Lavagem a Seco Automotiva",
    descricao: "Sistema especializado para empresas de lavagem a seco. Controle de produtos ecológicos, agendamentos e gestão de equipe móvel.",
    keywords: ["lavagem a seco", "lavagem ecológica", "dry wash", "lavagem sem água", "lavagem sustentável"],
    emoji: "🌿"
  },
  {
    slug: "martelinho-de-ouro",
    nome: "Martelinho de Ouro",
    nomeCompleto: "Sistema para Martelinho de Ouro",
    descricao: "Controle ordens de serviço de funilaria sem pintura, acompanhe cada reparo e gerencie orçamentos de forma profissional.",
    keywords: ["martelinho de ouro", "funilaria sem pintura", "reparos de amassados", "PDR", "paintless dent repair"],
    emoji: "🔨"
  },
  {
    slug: "vitrificacao",
    nome: "Vitrificação",
    nomeCompleto: "Software para Vitrificação e Coating",
    descricao: "Gerencie serviços de vitrificação, coating cerâmico e proteção de pintura. Controle garantias e agendamentos de manutenção.",
    keywords: ["vitrificação", "coating cerâmico", "proteção de pintura", "ceramic coating", "nano coating"],
    emoji: "💎"
  },
  {
    slug: "polimento",
    nome: "Polimento Automotivo",
    nomeCompleto: "Sistema para Polimento e Correção de Pintura",
    descricao: "Sistema para gerenciar serviços de polimento, correção de pintura e tratamento de superfícies.",
    keywords: ["polimento automotivo", "correção de pintura", "espelhamento", "revitalização de pintura"],
    emoji: "🪞"
  },
  {
    slug: "higienizacao-interna",
    nome: "Higienização Interna",
    nomeCompleto: "Software para Higienização e Limpeza Interna",
    descricao: "Controle serviços de higienização de bancos, carpetes, forros e sistema de ar condicionado automotivo.",
    keywords: ["higienização interna", "limpeza de bancos", "higienização de ar condicionado", "limpeza de estofados"],
    emoji: "🧹"
  },
  {
    slug: "lava-rapido",
    nome: "Lava Rápido",
    nomeCompleto: "Sistema Completo para Lava Rápido",
    descricao: "Sistema completo para gestão de lava rápido. Controle pátio, equipe, financeiro e agendamentos em um só lugar.",
    keywords: ["lava rápido", "lava jato", "lavagem de carros", "car wash"],
    emoji: "🚗"
  },
  {
    slug: "lava-jato",
    nome: "Lava Jato",
    nomeCompleto: "Software de Gestão para Lava Jato",
    descricao: "Gerencie seu lava jato de forma profissional. WhatsApp automático, controle de pátio e relatórios financeiros.",
    keywords: ["lava jato", "lava-jato", "lavagem automotiva", "wash center"],
    emoji: "💦"
  }
];

// Função para buscar serviço pelo slug
export function getServicoBySlug(slug: string): ServicoSEO | undefined {
  return servicosAutomotivos.find(s => s.slug === slug);
}

// Função para gerar todos os slugs de serviços
export function getAllServicoSlugs(): string[] {
  return servicosAutomotivos.map(s => s.slug);
}

// Gerar combinações serviço + cidade
export function gerarCombinacoes(cidades: { slug: string; nome: string }[]): Array<{ servico: ServicoSEO; cidadeSlug: string; cidadeNome: string; slug: string }> {
  const combinacoes: Array<{ servico: ServicoSEO; cidadeSlug: string; cidadeNome: string; slug: string }> = [];
  
  for (const servico of servicosAutomotivos) {
    for (const cidade of cidades) {
      combinacoes.push({
        servico,
        cidadeSlug: cidade.slug,
        cidadeNome: cidade.nome,
        slug: `${servico.slug}-${cidade.slug}`
      });
    }
  }
  
  return combinacoes;
}

