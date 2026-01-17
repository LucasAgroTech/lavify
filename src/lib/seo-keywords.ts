// Palavras-chave estratégicas para SEO B2B - Sistemas para Lava Rápido

export interface PaginaSEO {
  slug: string;
  titulo: string;
  h1: string;
  descricaoMeta: string;
  keywords: string[];
  tipo: "problema" | "funcionalidade" | "comparativo" | "guia";
  prioridade: number; // 1-5, sendo 5 mais importante
}

// Páginas focadas em PROBLEMAS/DORES do dono de lava jato
export const paginasProblemas: PaginaSEO[] = [
  {
    slug: "como-organizar-lava-rapido",
    titulo: "Como Organizar um Lava Rápido | Sistema de Gestão",
    h1: "Como Organizar um Lava Rápido de Forma Profissional",
    descricaoMeta: "Aprenda como organizar seu lava rápido com sistema de gestão. Controle pátio, filas, equipe e financeiro. Teste grátis por 7 dias!",
    keywords: ["como organizar lava rapido", "organização lava jato", "gestão lava rapido"],
    tipo: "problema",
    prioridade: 5
  },
  {
    slug: "como-controlar-patio-lava-jato",
    titulo: "Como Controlar o Pátio do Lava Jato | Kanban Visual",
    h1: "Como Controlar o Pátio do Lava Jato em Tempo Real",
    descricaoMeta: "Sistema Kanban para controle visual do pátio. Saiba onde cada carro está: aguardando, lavando ou pronto. Teste grátis!",
    keywords: ["controle patio lava jato", "kanban lava rapido", "organizar patio lava jato"],
    tipo: "problema",
    prioridade: 5
  },
  {
    slug: "como-enviar-whatsapp-automatico-lava-jato",
    titulo: "WhatsApp Automático para Lava Jato | Avise o Cliente",
    h1: "Como Enviar WhatsApp Automático Quando o Carro Fica Pronto",
    descricaoMeta: "Automatize o aviso ao cliente quando o carro ficar pronto. WhatsApp automático integrado ao sistema. Teste grátis!",
    keywords: ["whatsapp automatico lava jato", "avisar cliente lava rapido", "notificação lava jato"],
    tipo: "problema",
    prioridade: 5
  },
  {
    slug: "como-fazer-agendamento-online-lava-rapido",
    titulo: "Agendamento Online para Lava Rápido | 24 Horas",
    h1: "Como Implementar Agendamento Online no Seu Lava Rápido",
    descricaoMeta: "Permita que clientes agendem pelo celular 24h. Sistema de agendamento online para lava jato. Teste grátis por 7 dias!",
    keywords: ["agendamento online lava rapido", "agendar lavagem online", "sistema agendamento lava jato"],
    tipo: "problema",
    prioridade: 5
  },
  {
    slug: "como-controlar-estoque-lava-jato",
    titulo: "Controle de Estoque para Lava Jato | Alertas Automáticos",
    h1: "Como Controlar o Estoque do Lava Jato com Alertas",
    descricaoMeta: "Sistema de controle de estoque com alertas antes de acabar. Saiba quanto produto usa em cada lavagem. Teste grátis!",
    keywords: ["controle estoque lava jato", "estoque lava rapido", "gestão estoque lava jato"],
    tipo: "problema",
    prioridade: 4
  },
  {
    slug: "como-controlar-financeiro-lava-rapido",
    titulo: "Controle Financeiro para Lava Rápido | Fluxo de Caixa",
    h1: "Como Controlar o Financeiro do Lava Rápido",
    descricaoMeta: "Sistema de controle financeiro completo. Faturamento, despesas e lucro em tempo real. Teste grátis por 7 dias!",
    keywords: ["controle financeiro lava rapido", "fluxo caixa lava jato", "financeiro lava jato"],
    tipo: "problema",
    prioridade: 4
  },
  {
    slug: "como-gerenciar-equipe-lava-jato",
    titulo: "Como Gerenciar Equipe de Lava Jato | Controle de Funcionários",
    h1: "Como Gerenciar a Equipe do Seu Lava Jato",
    descricaoMeta: "Sistema para gestão de equipe. Controle quem faz o quê, produtividade e comissões. Teste grátis!",
    keywords: ["gerenciar equipe lava jato", "funcionarios lava rapido", "controle equipe lava jato"],
    tipo: "problema",
    prioridade: 4
  },
  {
    slug: "como-fidelizar-clientes-lava-rapido",
    titulo: "Como Fidelizar Clientes no Lava Rápido | CRM",
    h1: "Como Fidelizar Clientes no Seu Lava Rápido",
    descricaoMeta: "Sistema CRM para lava jato. Histórico de clientes, programa de pontos e comunicação automática. Teste grátis!",
    keywords: ["fidelizar clientes lava rapido", "crm lava jato", "clientes lava rapido"],
    tipo: "problema",
    prioridade: 4
  },
];

// Páginas focadas em FUNCIONALIDADES do sistema
export const paginasFuncionalidades: PaginaSEO[] = [
  {
    slug: "sistema-kanban-lava-jato",
    titulo: "Sistema Kanban para Lava Jato | Controle Visual do Pátio",
    h1: "Sistema Kanban para Lava Jato: Controle Visual do Pátio",
    descricaoMeta: "Kanban visual para lava rápido. Arraste e solte carros entre colunas. Veja o status de cada veículo em tempo real. Teste grátis!",
    keywords: ["kanban lava jato", "sistema kanban lava rapido", "controle visual lava jato"],
    tipo: "funcionalidade",
    prioridade: 5
  },
  {
    slug: "aplicativo-para-lava-jato",
    titulo: "Aplicativo para Lava Jato | Gerencie pelo Celular",
    h1: "Aplicativo para Lava Jato: Gerencie de Qualquer Lugar",
    descricaoMeta: "App para gestão de lava rápido. Controle seu negócio pelo celular de qualquer lugar. Funciona no Android e iPhone. Teste grátis!",
    keywords: ["aplicativo lava jato", "app lava rapido", "aplicativo gestao lava jato"],
    tipo: "funcionalidade",
    prioridade: 5
  },
  {
    slug: "software-para-lava-rapido",
    titulo: "Software para Lava Rápido | Sistema Completo de Gestão",
    h1: "Software para Lava Rápido: Sistema Completo de Gestão",
    descricaoMeta: "Software completo para lava rápido. Pátio, agendamento, estoque, financeiro e equipe em um só lugar. Teste grátis 7 dias!",
    keywords: ["software lava rapido", "software gestao lava jato", "programa lava rapido"],
    tipo: "funcionalidade",
    prioridade: 5
  },
  {
    slug: "sistema-ordem-de-servico-lava-jato",
    titulo: "Sistema de Ordem de Serviço para Lava Jato | OS Digital",
    h1: "Sistema de Ordem de Serviço para Lava Jato",
    descricaoMeta: "Crie OS digital em segundos. Histórico completo, serviços, valores e status. Sistema de ordem de serviço para lava rápido. Teste grátis!",
    keywords: ["ordem de servico lava jato", "os lava rapido", "sistema os lava jato"],
    tipo: "funcionalidade",
    prioridade: 4
  },
  {
    slug: "sistema-gestao-lava-jato-online",
    titulo: "Sistema de Gestão para Lava Jato Online | 100% na Nuvem",
    h1: "Sistema de Gestão para Lava Jato 100% Online",
    descricaoMeta: "Sistema online para lava jato. Acesse de qualquer dispositivo, sem instalação. Dados seguros na nuvem. Teste grátis por 7 dias!",
    keywords: ["sistema gestao lava jato online", "sistema lava jato nuvem", "gestao online lava rapido"],
    tipo: "funcionalidade",
    prioridade: 4
  },
];

// Páginas focadas em COMPARATIVOS e decisão de compra
export const paginasComparativos: PaginaSEO[] = [
  {
    slug: "melhor-sistema-para-lava-rapido",
    titulo: "Melhor Sistema para Lava Rápido em 2026 | Comparativo",
    h1: "Melhor Sistema para Lava Rápido em 2026",
    descricaoMeta: "Comparativo dos melhores sistemas para lava rápido. Funcionalidades, preços e avaliações. Escolha o ideal para seu negócio!",
    keywords: ["melhor sistema lava rapido", "melhor software lava jato", "comparativo sistema lava jato"],
    tipo: "comparativo",
    prioridade: 5
  },
  {
    slug: "quanto-custa-sistema-lava-jato",
    titulo: "Quanto Custa um Sistema para Lava Jato? | Preços 2026",
    h1: "Quanto Custa um Sistema para Lava Jato?",
    descricaoMeta: "Descubra quanto custa um sistema de gestão para lava jato. Preços, planos e o que está incluso. Compare antes de contratar!",
    keywords: ["quanto custa sistema lava jato", "preco sistema lava rapido", "valor software lava jato"],
    tipo: "comparativo",
    prioridade: 5
  },
  {
    slug: "sistema-lava-jato-gratis",
    titulo: "Sistema para Lava Jato Grátis | Teste 7 Dias",
    h1: "Sistema para Lava Jato Grátis: Teste por 7 Dias",
    descricaoMeta: "Teste o sistema Lavify grátis por 7 dias. Todas as funcionalidades liberadas, sem cartão de crédito. Comece agora!",
    keywords: ["sistema lava jato gratis", "software lava rapido gratis", "sistema gestao lava jato gratis"],
    tipo: "comparativo",
    prioridade: 5
  },
  {
    slug: "sistema-lava-jato-simples",
    titulo: "Sistema para Lava Jato Simples de Usar | Fácil",
    h1: "Sistema para Lava Jato Simples e Fácil de Usar",
    descricaoMeta: "Sistema intuitivo para lava jato. Sua equipe aprende em minutos, sem treinamento complicado. Teste grátis por 7 dias!",
    keywords: ["sistema lava jato simples", "sistema lava rapido facil", "software lava jato intuitivo"],
    tipo: "comparativo",
    prioridade: 4
  },
  {
    slug: "sistema-lava-jato-completo",
    titulo: "Sistema para Lava Jato Completo | Tudo em Um",
    h1: "Sistema para Lava Jato Completo: Tudo que Você Precisa",
    descricaoMeta: "Sistema completo para lava jato. Pátio, agendamento, WhatsApp, estoque, financeiro e equipe. Tudo em um só lugar. Teste grátis!",
    keywords: ["sistema lava jato completo", "software lava rapido completo", "gestao completa lava jato"],
    tipo: "comparativo",
    prioridade: 4
  },
];

// Páginas de GUIAS e conteúdo educativo
export const paginasGuias: PaginaSEO[] = [
  {
    slug: "como-abrir-lava-rapido",
    titulo: "Como Abrir um Lava Rápido em 2026 | Guia Completo",
    h1: "Como Abrir um Lava Rápido: Guia Completo 2026",
    descricaoMeta: "Guia completo para abrir um lava rápido. Investimento, equipamentos, documentação e dicas de gestão. Tudo que você precisa saber!",
    keywords: ["como abrir lava rapido", "abrir lava jato", "montar lava rapido"],
    tipo: "guia",
    prioridade: 4
  },
  {
    slug: "como-aumentar-faturamento-lava-jato",
    titulo: "Como Aumentar o Faturamento do Lava Jato | Dicas",
    h1: "Como Aumentar o Faturamento do Seu Lava Jato",
    descricaoMeta: "Dicas práticas para aumentar o faturamento do lava jato. Agendamento online, fidelização e organização. Comece a aplicar hoje!",
    keywords: ["aumentar faturamento lava jato", "lucrar mais lava rapido", "crescer lava jato"],
    tipo: "guia",
    prioridade: 4
  },
  {
    slug: "erros-comuns-lava-rapido",
    titulo: "7 Erros Comuns de Donos de Lava Rápido | Evite!",
    h1: "7 Erros Comuns que Donos de Lava Rápido Cometem",
    descricaoMeta: "Descubra os erros mais comuns de donos de lava rápido e como evitá-los. Melhore sua gestão e aumente seus lucros!",
    keywords: ["erros lava rapido", "problemas lava jato", "dificuldades lava rapido"],
    tipo: "guia",
    prioridade: 3
  },
];

// Páginas LONG-TAIL - Buscas específicas de alta intenção
export const paginasLongTail: PaginaSEO[] = [
  // Variações de "sistema"
  {
    slug: "programa-para-lava-jato",
    titulo: "Programa para Lava Jato | Gestão Completa",
    h1: "Programa para Lava Jato: Gestão Completa e Simples",
    descricaoMeta: "Programa completo para gerenciar seu lava jato. Controle pátio, clientes, estoque e financeiro. Teste grátis por 7 dias!",
    keywords: ["programa para lava jato", "programa lava rapido", "programa gestao lava jato"],
    tipo: "funcionalidade",
    prioridade: 5
  },
  {
    slug: "planilha-lava-jato",
    titulo: "Planilha para Lava Jato? Sistema é Melhor | Compare",
    h1: "Planilha para Lava Jato: Por que um Sistema é Melhor",
    descricaoMeta: "Saia da planilha de Excel! Sistema de gestão para lava jato é mais seguro e prático. Compare e descubra por que migrar.",
    keywords: ["planilha lava jato", "excel lava rapido", "planilha controle lava jato"],
    tipo: "comparativo",
    prioridade: 4
  },
  // Buscas por nicho específico
  {
    slug: "sistema-lava-jato-pequeno",
    titulo: "Sistema para Lava Jato Pequeno | Plano Gratuito",
    h1: "Sistema para Lava Jato Pequeno: Comece Grátis",
    descricaoMeta: "Sistema pensado para lava jato pequeno. Plano gratuito disponível, sem complicação. Ideal para quem está começando!",
    keywords: ["sistema lava jato pequeno", "lava jato pequeno sistema", "software lava rapido pequeno"],
    tipo: "comparativo",
    prioridade: 5
  },
  {
    slug: "sistema-lava-jato-ecologico",
    titulo: "Sistema para Lava Jato Ecológico | Lavagem a Seco",
    h1: "Sistema para Lava Jato Ecológico e Lavagem a Seco",
    descricaoMeta: "Sistema de gestão para lava jato ecológico e lavagem a seco. Controle produtos, custos e clientes conscientes.",
    keywords: ["sistema lava jato ecologico", "lava jato a seco sistema", "lavagem ecologica sistema"],
    tipo: "funcionalidade",
    prioridade: 3
  },
  {
    slug: "sistema-estetica-automotiva",
    titulo: "Sistema para Estética Automotiva | Gestão Completa",
    h1: "Sistema para Estética Automotiva: Polimento e Detalhamento",
    descricaoMeta: "Sistema de gestão para estética automotiva. Controle polimento, vitrificação, higienização e mais. Teste grátis!",
    keywords: ["sistema estetica automotiva", "software estetica automotiva", "gestao estetica automotiva"],
    tipo: "funcionalidade",
    prioridade: 4
  },
  // Buscas por benefícios específicos
  {
    slug: "sistema-lava-jato-com-whatsapp",
    titulo: "Sistema para Lava Jato com WhatsApp | Aviso Automático",
    h1: "Sistema para Lava Jato com WhatsApp Integrado",
    descricaoMeta: "Sistema para lava jato com WhatsApp automático. Cliente recebe aviso quando carro fica pronto. Teste grátis!",
    keywords: ["sistema lava jato whatsapp", "lava jato aviso whatsapp", "whatsapp lava rapido"],
    tipo: "funcionalidade",
    prioridade: 5
  },
  {
    slug: "sistema-lava-jato-com-agendamento",
    titulo: "Sistema para Lava Jato com Agendamento Online",
    h1: "Sistema para Lava Jato com Agendamento Online 24h",
    descricaoMeta: "Sistema para lava jato com agendamento online. Cliente agenda pelo celular 24h. Reduza filas e aumente vendas!",
    keywords: ["sistema lava jato agendamento", "agendamento online lava jato", "lava rapido agendamento"],
    tipo: "funcionalidade",
    prioridade: 5
  },
  {
    slug: "sistema-lava-jato-controle-estoque",
    titulo: "Sistema para Lava Jato com Controle de Estoque",
    h1: "Sistema para Lava Jato com Controle de Estoque Inteligente",
    descricaoMeta: "Sistema para lava jato com controle de estoque. Alerta antes de acabar, custo por lavagem calculado. Teste grátis!",
    keywords: ["sistema lava jato estoque", "controle estoque lava rapido", "gestao estoque lava jato"],
    tipo: "funcionalidade",
    prioridade: 4
  },
  // Buscas por plataforma
  {
    slug: "sistema-lava-jato-celular",
    titulo: "Sistema para Lava Jato no Celular | 100% Mobile",
    h1: "Sistema para Lava Jato no Celular: Gerencie de Qualquer Lugar",
    descricaoMeta: "Sistema para lava jato que funciona no celular. Controle seu negócio de qualquer lugar, pelo Android ou iPhone.",
    keywords: ["sistema lava jato celular", "app lava jato celular", "lava rapido celular"],
    tipo: "funcionalidade",
    prioridade: 5
  },
  // Buscas por preço
  {
    slug: "sistema-lava-jato-barato",
    titulo: "Sistema para Lava Jato Barato | A Partir de R$49",
    h1: "Sistema para Lava Jato Barato: Planos que Cabem no Bolso",
    descricaoMeta: "Sistema para lava jato barato e completo. Planos a partir de R$49/mês. Tem até plano gratuito! Compare preços.",
    keywords: ["sistema lava jato barato", "software lava rapido barato", "sistema lava jato preco"],
    tipo: "comparativo",
    prioridade: 5
  },
  {
    slug: "sistema-lava-jato-mensalidade",
    titulo: "Sistema para Lava Jato sem Fidelidade | Cancele Quando Quiser",
    h1: "Sistema para Lava Jato sem Fidelidade: Mensalidade Flexível",
    descricaoMeta: "Sistema para lava jato sem contrato de fidelidade. Pague mensalidade e cancele quando quiser. Sem multa!",
    keywords: ["sistema lava jato mensalidade", "lava jato sem fidelidade", "sistema mensal lava rapido"],
    tipo: "comparativo",
    prioridade: 4
  },
  // Buscas por dor específica
  {
    slug: "como-acabar-fila-lava-jato",
    titulo: "Como Acabar com a Fila no Lava Jato | Agendamento",
    h1: "Como Acabar com a Fila no Lava Jato: Sistema de Agendamento",
    descricaoMeta: "Aprenda como acabar com filas no seu lava jato usando agendamento online. Clientes satisfeitos, pátio organizado!",
    keywords: ["fila lava jato", "acabar fila lava rapido", "organizar fila lava jato"],
    tipo: "problema",
    prioridade: 4
  },
  {
    slug: "como-cobrar-clientes-lava-jato",
    titulo: "Como Cobrar Clientes no Lava Jato | Sistema Financeiro",
    h1: "Como Cobrar Clientes no Lava Jato de Forma Organizada",
    descricaoMeta: "Sistema de cobrança para lava jato. Controle o que cada cliente deve, histórico de pagamentos e muito mais.",
    keywords: ["cobrar clientes lava jato", "cobranca lava rapido", "fiado lava jato"],
    tipo: "problema",
    prioridade: 4
  },
  {
    slug: "como-calcular-lucro-lava-jato",
    titulo: "Como Calcular o Lucro do Lava Jato | Relatórios",
    h1: "Como Calcular o Lucro Real do Seu Lava Jato",
    descricaoMeta: "Aprenda a calcular o lucro real do lava jato. Sistema mostra faturamento, custos e lucro líquido automaticamente.",
    keywords: ["lucro lava jato", "calcular lucro lava rapido", "margem lava jato"],
    tipo: "problema",
    prioridade: 4
  },
];

// Todas as páginas combinadas
export const todasPaginasSEO: PaginaSEO[] = [
  ...paginasProblemas,
  ...paginasFuncionalidades,
  ...paginasComparativos,
  ...paginasGuias,
  ...paginasLongTail,
].sort((a, b) => b.prioridade - a.prioridade);

// Função para buscar página pelo slug
export function getPaginaSEOBySlug(slug: string): PaginaSEO | undefined {
  return todasPaginasSEO.find(p => p.slug === slug);
}

// Função para gerar todos os slugs
export function getAllPaginaSEOSlugs(): string[] {
  return todasPaginasSEO.map(p => p.slug);
}

// Função para buscar páginas relacionadas (Internal Linking)
export function getPaginasRelacionadas(slug: string, limite: number = 4): PaginaSEO[] {
  const paginaAtual = getPaginaSEOBySlug(slug);
  if (!paginaAtual) return [];

  // Prioriza páginas do mesmo tipo, depois por keywords em comum
  const pontuacao = (pagina: PaginaSEO): number => {
    if (pagina.slug === slug) return -1; // Exclui a própria página
    
    let pontos = 0;
    
    // Mesmo tipo: +3 pontos
    if (pagina.tipo === paginaAtual.tipo) pontos += 3;
    
    // Keywords em comum: +2 pontos por keyword
    const keywordsComuns = pagina.keywords.filter(k => 
      paginaAtual.keywords.some(pk => 
        k.includes(pk.split(" ")[0]) || pk.includes(k.split(" ")[0])
      )
    );
    pontos += keywordsComuns.length * 2;
    
    // Alta prioridade: +1 ponto
    if (pagina.prioridade >= 4) pontos += 1;
    
    return pontos;
  };

  return todasPaginasSEO
    .filter(p => p.slug !== slug)
    .sort((a, b) => pontuacao(b) - pontuacao(a))
    .slice(0, limite);
}

// Função para buscar páginas por tipo
export function getPaginasPorTipo(tipo: PaginaSEO["tipo"], limite?: number): PaginaSEO[] {
  const paginas = todasPaginasSEO.filter(p => p.tipo === tipo);
  return limite ? paginas.slice(0, limite) : paginas;
}

// Função para buscar páginas de maior prioridade (para destaque)
export function getPaginasDestaque(limite: number = 6): PaginaSEO[] {
  return todasPaginasSEO
    .filter(p => p.prioridade >= 4)
    .slice(0, limite);
}

