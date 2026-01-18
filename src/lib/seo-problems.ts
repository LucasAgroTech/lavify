// Problemas/Guias para SEO programático
// Cada problema pode ser combinado com cidades

export interface ProblemaSEO {
  slug: string;
  titulo: string;
  tituloCompleto: string;
  descricao: string;
  keywords: string[];
  tipo: "guia" | "tabela" | "checklist" | "calculadora" | "modelo";
  emoji: string;
}

export const problemasLavaJato: ProblemaSEO[] = [
  // Guias Fiscais/Legais
  {
    slug: "como-emitir-nota-fiscal-lava-jato",
    titulo: "Como Emitir Nota Fiscal",
    tituloCompleto: "Como Emitir Nota Fiscal em Lava Jato",
    descricao: "Guia completo sobre emissão de nota fiscal para lava rápido. MEI, ME, notas de serviço e obrigações fiscais.",
    keywords: ["nota fiscal lava jato", "nf-e lava rápido", "emitir nota lava jato", "MEI lava jato"],
    tipo: "guia",
    emoji: "📄"
  },
  {
    slug: "como-abrir-lava-jato",
    titulo: "Como Abrir um Lava Jato",
    tituloCompleto: "Guia Completo: Como Abrir um Lava Jato",
    descricao: "Passo a passo para abrir seu lava rápido. Documentação, licenças ambientais, equipamentos e investimento inicial.",
    keywords: ["abrir lava jato", "montar lava rápido", "investimento lava jato", "licença lava jato"],
    tipo: "guia",
    emoji: "🚀"
  },
  {
    slug: "licenca-ambiental-lava-jato",
    titulo: "Licença Ambiental para Lava Jato",
    tituloCompleto: "Como Obter Licença Ambiental para Lava Jato",
    descricao: "Entenda as exigências ambientais para lava jato: caixa separadora de água e óleo, tratamento de efluentes e documentação.",
    keywords: ["licença ambiental lava jato", "caixa separadora", "efluentes lava jato", "legislação ambiental"],
    tipo: "guia",
    emoji: "🌱"
  },
  
  // Tabelas de Preços
  {
    slug: "tabela-precos-lavagem",
    titulo: "Tabela de Preços de Lavagem",
    tituloCompleto: "Tabela de Preços de Lavagem Automotiva",
    descricao: "Referência de preços para serviços de lava jato. Lavagem simples, completa, enceramento, higienização e mais.",
    keywords: ["preço lavagem carro", "tabela preços lava jato", "quanto custa lavar carro", "valores lavagem"],
    tipo: "tabela",
    emoji: "💰"
  },
  {
    slug: "tabela-precos-estetica-automotiva",
    titulo: "Tabela de Preços Estética",
    tituloCompleto: "Tabela de Preços de Estética Automotiva",
    descricao: "Preços de referência para polimento, vitrificação, coating cerâmico, correção de pintura e detalhamento.",
    keywords: ["preço polimento", "preço vitrificação", "preço coating", "tabela estética automotiva"],
    tipo: "tabela",
    emoji: "💎"
  },
  
  // Checklists Operacionais
  {
    slug: "checklist-entrada-veiculo",
    titulo: "Checklist de Entrada de Veículo",
    tituloCompleto: "Checklist de Entrada de Veículo para Lava Jato",
    descricao: "Modelo de checklist para receber veículos no lava jato. Evite problemas e proteja seu negócio.",
    keywords: ["checklist lava jato", "entrada veículo", "vistoria carro", "formulário entrada"],
    tipo: "checklist",
    emoji: "✅"
  },
  {
    slug: "checklist-limpeza-interna",
    titulo: "Checklist de Limpeza Interna",
    tituloCompleto: "Checklist Completo de Higienização Interna",
    descricao: "Lista completa de itens para higienização interna de veículos. Bancos, carpetes, painéis, vidros e mais.",
    keywords: ["checklist limpeza carro", "higienização interna", "limpeza completa veículo"],
    tipo: "checklist",
    emoji: "📋"
  },
  
  // Gestão e Produtividade
  {
    slug: "como-aumentar-faturamento-lava-jato",
    titulo: "Como Aumentar Faturamento",
    tituloCompleto: "Como Aumentar o Faturamento do Lava Jato",
    descricao: "Estratégias comprovadas para aumentar o faturamento do seu lava rápido. Marketing, fidelização e upsell.",
    keywords: ["aumentar faturamento lava jato", "lucrar mais lava rápido", "estratégias lava jato"],
    tipo: "guia",
    emoji: "📈"
  },
  {
    slug: "como-fidelizar-clientes-lava-jato",
    titulo: "Como Fidelizar Clientes",
    tituloCompleto: "Como Fidelizar Clientes no Lava Jato",
    descricao: "Programas de fidelidade, cartão de carimbos digital, WhatsApp marketing e técnicas de retenção de clientes.",
    keywords: ["fidelizar clientes lava jato", "programa fidelidade", "cartão fidelidade lava jato"],
    tipo: "guia",
    emoji: "❤️"
  },
  {
    slug: "como-controlar-estoque-lava-jato",
    titulo: "Como Controlar Estoque",
    tituloCompleto: "Controle de Estoque para Lava Jato",
    descricao: "Sistema e métodos para controlar estoque de produtos de limpeza, ceras, shampoos e insumos.",
    keywords: ["estoque lava jato", "controle produtos lava rápido", "gestão insumos"],
    tipo: "guia",
    emoji: "📦"
  },
  
  // Equipamentos
  {
    slug: "equipamentos-lava-jato",
    titulo: "Equipamentos para Lava Jato",
    tituloCompleto: "Lista de Equipamentos para Montar Lava Jato",
    descricao: "Lista completa de equipamentos: lavadora de alta pressão, aspirador, compressor, politriz e mais.",
    keywords: ["equipamentos lava jato", "máquinas lava rápido", "lavadora alta pressão", "politriz"],
    tipo: "guia",
    emoji: "🔧"
  },
  {
    slug: "produtos-limpeza-automotiva",
    titulo: "Produtos de Limpeza Automotiva",
    tituloCompleto: "Melhores Produtos de Limpeza Automotiva",
    descricao: "Guia de produtos para lava jato: shampoos, ceras, desengraxantes, limpa pneus e mais.",
    keywords: ["produtos lava jato", "shampoo automotivo", "cera carnaúba", "desengraxante"],
    tipo: "guia",
    emoji: "🧴"
  },
  
  // Marketing
  {
    slug: "marketing-digital-lava-jato",
    titulo: "Marketing Digital para Lava Jato",
    tituloCompleto: "Marketing Digital para Lava Jato: Guia Completo",
    descricao: "Estratégias de marketing digital para lava rápido. Google Meu Negócio, Instagram, WhatsApp Business e mais.",
    keywords: ["marketing lava jato", "divulgar lava rápido", "instagram lava jato", "google meu negócio"],
    tipo: "guia",
    emoji: "📱"
  },
  {
    slug: "mensagens-whatsapp-lava-jato",
    titulo: "Mensagens WhatsApp para Lava Jato",
    tituloCompleto: "Modelos de Mensagens WhatsApp para Lava Jato",
    descricao: "Modelos prontos de mensagens para WhatsApp: confirmação, carro pronto, promoções e remarketing.",
    keywords: ["mensagem whatsapp lava jato", "modelo mensagem", "template whatsapp"],
    tipo: "modelo",
    emoji: "💬"
  }
];

// Função para buscar problema pelo slug
export function getProblemaBySlug(slug: string): ProblemaSEO | undefined {
  return problemasLavaJato.find(p => p.slug === slug);
}

// Função para gerar todos os slugs de problemas
export function getAllProblemaSlugs(): string[] {
  return problemasLavaJato.map(p => p.slug);
}

// Função para filtrar por tipo
export function getProblemasByTipo(tipo: ProblemaSEO["tipo"]): ProblemaSEO[] {
  return problemasLavaJato.filter(p => p.tipo === tipo);
}

// Gerar combinações problema + cidade (apenas para alguns problemas que fazem sentido)
export function gerarCombinacoesProblemaCidade(
  problemas: ProblemaSEO[],
  cidades: { slug: string; nome: string }[]
): Array<{ problema: ProblemaSEO; cidadeSlug: string; cidadeNome: string; slug: string }> {
  // Apenas alguns problemas fazem sentido ter versão por cidade
  const problemasComCidade = [
    "tabela-precos-lavagem",
    "tabela-precos-estetica-automotiva",
    "como-abrir-lava-jato",
    "licenca-ambiental-lava-jato"
  ];
  
  const combinacoes: Array<{ problema: ProblemaSEO; cidadeSlug: string; cidadeNome: string; slug: string }> = [];
  
  for (const problema of problemas) {
    if (problemasComCidade.includes(problema.slug)) {
      // Limitar a top 30 cidades para não gerar páginas demais
      const cidadesTop = cidades.slice(0, 30);
      for (const cidade of cidadesTop) {
        combinacoes.push({
          problema,
          cidadeSlug: cidade.slug,
          cidadeNome: cidade.nome,
          slug: `${problema.slug}-${cidade.slug}`
        });
      }
    }
  }
  
  return combinacoes;
}

