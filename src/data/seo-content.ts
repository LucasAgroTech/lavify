// Conteúdo SEO pré-gerado para todas as cidades
// Este arquivo é gerado automaticamente e pode ser atualizado via API

import { cidadesBrasil, CidadeSEO } from "@/lib/seo-cities";

// ═══════════════════════════════════════════════════════════════════════════
// FAQs ÚNICOS POR REGIÃO - Evita conteúdo duplicado entre cidades
// ═══════════════════════════════════════════════════════════════════════════
function getFAQPorRegiao(regiao: string, cidade: string): { pergunta: string; resposta: string }[] {
  const faqsPorRegiao: Record<string, { pergunta: string; resposta: string }[]> = {
    "Sudeste": [
      {
        pergunta: "O sistema aguenta o volume de carros do Sudeste?",
        resposta: "Com certeza! O Lavify foi projetado para alto volume. O Kanban suporta dezenas de carros simultâneos e funciona fluido mesmo em dias de pico."
      },
      {
        pergunta: "Funciona bem com o ritmo acelerado das grandes cidades?",
        resposta: "Perfeito para isso. O WhatsApp automático e agendamento online agilizam o atendimento. Menos ligações, menos fila, mais carros lavados por dia."
      },
      {
        pergunta: "Consigo competir com as grandes redes usando o Lavify?",
        resposta: "O Lavify profissionaliza seu lava jato para competir de igual. Agendamento online, fidelidade digital e atendimento automatizado - as mesmas ferramentas das redes, no seu negócio."
      }
    ],
    "Sul": [
      {
        pergunta: "O sistema se adapta ao padrão de qualidade do Sul?",
        resposta: "O Lavify foi pensado para quem preza qualidade. Histórico completo por veículo, checklist de entrada e controle detalhado de cada serviço realizado."
      },
      {
        pergunta: "Funciona no frio intenso quando o movimento cai?",
        resposta: "Nos períodos de baixo movimento, o programa de fidelidade e remarketing por WhatsApp ajudam a manter os clientes voltando regularmente."
      },
      {
        pergunta: "O sistema ajuda a fidelizar os clientes exigentes da região?",
        resposta: "Sim! Com histórico por veículo, preferências salvas e programa de fidelidade, você oferece atendimento personalizado que os clientes do Sul valorizam."
      }
    ],
    "Nordeste": [
      {
        pergunta: "O sistema ajuda a lidar com a poeira constante?",
        resposta: "O agendamento online permite que clientes marquem lavagens frequentes facilmente. E o programa de fidelidade incentiva visitas regulares para manter o carro limpo."
      },
      {
        pergunta: "Funciona bem com internet móvel?",
        resposta: "O Lavify é otimizado para funcionar mesmo com conexões mais lentas. Interface leve que carrega rápido no 4G e não consome muitos dados."
      },
      {
        pergunta: "Tem custo acessível para lava jatos da região?",
        resposta: "Nossos planos cabem no bolso de qualquer lava jato. Comece grátis por 7 dias e depois escolha o plano que se encaixa no seu faturamento."
      }
    ],
    "Centro-Oeste": [
      {
        pergunta: "Funciona para lavar caminhonetes e veículos rurais?",
        resposta: "Perfeito para isso! Você pode criar categorias de preço por tipo de veículo. SUVs, pickups e caminhonetes podem ter preços diferenciados automaticamente."
      },
      {
        pergunta: "O sistema atende quem trabalha com frota de fazendas?",
        resposta: "Sim! Você pode cadastrar frotas corporativas com condições especiais e o sistema controla cada veículo da frota separadamente."
      },
      {
        pergunta: "Ajuda a organizar os picos de movimento pós-colheita?",
        resposta: "O agendamento online distribui melhor a demanda ao longo do dia. E nos picos, o Kanban visual ajuda a equipe a não perder o controle."
      }
    ],
    "Norte": [
      {
        pergunta: "O sistema funciona bem com chuvas frequentes?",
        resposta: "Nos dias chuvosos com menos movimento, use o WhatsApp do Lavify para avisar clientes sobre promoções e preencher a agenda."
      },
      {
        pergunta: "Funciona com a internet disponível na região?",
        resposta: "O Lavify é leve e otimizado. Funciona bem mesmo com conexões mais modestas, tanto no celular quanto no computador."
      },
      {
        pergunta: "Tem suporte para quem está começando na região?",
        resposta: "Nosso sistema é intuitivo e você aprende a usar em minutos. E qualquer dúvida, nosso suporte está disponível para ajudar."
      }
    ]
  };

  return faqsPorRegiao[regiao] || faqsPorRegiao["Sudeste"];
}

// ═══════════════════════════════════════════════════════════════════════════
// BENEFÍCIOS VARIADOS POR REGIÃO - Evita lista idêntica em todas as páginas
// ═══════════════════════════════════════════════════════════════════════════
function getBeneficiosPorRegiao(regiao: string): string[] {
  const beneficiosPorRegiao: Record<string, string[]> = {
    "Sudeste": [
      "Kanban visual para alto volume de carros",
      "WhatsApp automático reduz ligações",
      "Agendamento online 24h agiliza o fluxo",
      "Dashboard de faturamento em tempo real",
      "Gestão de múltiplas equipes",
      "Programa de fidelidade para clientes frequentes"
    ],
    "Sul": [
      "Histórico detalhado por veículo",
      "Checklist de entrada para qualidade",
      "Controle rigoroso de cada serviço",
      "Fidelidade digital para clientes recorrentes",
      "Relatórios gerenciais completos",
      "Acesso de qualquer lugar pelo celular"
    ],
    "Nordeste": [
      "Sistema leve que funciona no 4G",
      "Agendamento online para lavagens frequentes",
      "WhatsApp automático economiza tempo",
      "Planos acessíveis para qualquer porte",
      "Controle de estoque com alertas",
      "Programa de fidelidade simples e efetivo"
    ],
    "Centro-Oeste": [
      "Categorias de preço por tipo de veículo",
      "Gestão de frotas corporativas",
      "Kanban visual para organizar picos",
      "Controle de estoque de produtos",
      "Relatórios de serviços por categoria",
      "Acesso remoto pelo celular"
    ],
    "Norte": [
      "Interface leve e otimizada",
      "WhatsApp para promoções em dias parados",
      "Agendamento online 24 horas",
      "Sistema intuitivo e fácil de aprender",
      "Controle financeiro simplificado",
      "Funciona no celular e computador"
    ]
  };

  return beneficiosPorRegiao[regiao] || beneficiosPorRegiao["Sudeste"];
}

// ═══════════════════════════════════════════════════════════════════════════
// SEÇÕES DE CONTEÚDO VARIADAS POR REGIÃO
// ═══════════════════════════════════════════════════════════════════════════
function getSecoesPorRegiao(
  regiao: string, 
  cidade: string, 
  estado: string, 
  ctx: { clima: string; caracteristica: string; mercado: string },
  populacao: string
): { titulo: string; conteudo: string }[] {
  
  const secoesBase = [
    {
      titulo: `O Mercado de Lava Jatos em ${cidade}`,
      conteudo: `${cidade}, no ${estado}, é ${ctx.caracteristica}. Com aproximadamente ${populacao} de habitantes e frota em crescimento, ${ctx.mercado}.\n\n${ctx.clima} fazem do mercado de lava rápido uma oportunidade de negócio promissora. Mas para se destacar, você precisa de organização e eficiência profissional.`
    }
  ];

  // Segunda seção varia por região
  const segundaSecaoPorRegiao: Record<string, { titulo: string; conteudo: string }> = {
    "Sudeste": {
      titulo: "Competindo no Mercado Mais Exigente do Brasil",
      conteudo: `No Sudeste, a concorrência é acirrada. Grandes redes, lava jatos de bairro e apps de lavagem disputam os mesmos clientes. O diferencial está na experiência: quem oferece agendamento online, avisa quando o carro está pronto e mantém o cliente fidelizado, ganha.\n\nO Lavify coloca essas ferramentas na sua mão. O **Kanban visual** organiza o alto volume de carros. O **WhatsApp automático** elimina as ligações. O **agendamento online** funciona 24h. Você compete de igual com as grandes redes.`
    },
    "Sul": {
      titulo: "Qualidade e Profissionalismo que o Cliente Sulista Espera",
      conteudo: `O cliente do Sul valoriza qualidade e profissionalismo. Ele nota quando o atendimento é organizado, quando você lembra do carro dele, quando o serviço é entregue no prazo.\n\nO Lavify permite esse nível de profissionalismo. O **histórico por veículo** mostra todos os serviços anteriores. O **checklist de entrada** documenta o estado do carro. O **programa de fidelidade** reconhece clientes recorrentes. Cada detalhe que o cliente sulista valoriza, você entrega.`
    },
    "Nordeste": {
      titulo: "Crescimento e Oportunidade no Nordeste",
      conteudo: `O Nordeste é a região que mais cresce em número de veículos no Brasil. Com o clima quente e a poeira constante, a demanda por lavagem é frequente. É um mercado cheio de oportunidades para quem se organiza.\n\nO Lavify funciona mesmo com internet móvel, tem planos que cabem em qualquer bolso e é tão simples que você aprende em minutos. O **agendamento online** facilita lavagens frequentes e o **programa de fidelidade** faz o cliente voltar sempre.`
    },
    "Centro-Oeste": {
      titulo: "Atendendo a Frota do Agronegócio e Frotas Urbanas",
      conteudo: `O Centro-Oeste tem características únicas: caminhonetes do agronegócio, frotas de fazendas e o trânsito das capitais que cresce a cada ano. Veículos robustos que precisam de cuidado especial.\n\nO Lavify permite criar **categorias de preço por tipo de veículo** - SUVs, pickups e caminhonetes podem ter valores diferenciados. Para frotas, você cadastra condições especiais e controla cada veículo separadamente. O **Kanban** ajuda a organizar os picos de movimento.`
    },
    "Norte": {
      titulo: "Simplicidade e Eficiência para o Mercado do Norte",
      conteudo: `No Norte, o desafio está em manter o fluxo constante de clientes e aproveitar ao máximo os dias de movimento. Nos dias parados, cada cliente faz diferença.\n\nO Lavify é simples de usar e funciona bem mesmo com conexões modestas. Use o **WhatsApp integrado** para avisar clientes sobre promoções em dias de pouco movimento. O **agendamento online** funciona 24h para o cliente marcar quando quiser. Sistema intuitivo que você aprende em minutos.`
    }
  };

  const terceiraSecao = {
    titulo: `Por que Escolher o Lavify em ${cidade}`,
    conteudo: `O Lavify foi desenvolvido por quem entende o dia a dia de um lava jato brasileiro. Funciona no celular, é simples de usar e tem preço justo.\n\nOferecemos **teste grátis de 7 dias** sem cartão de crédito. Experimente todas as funcionalidades antes de decidir. Nossos planos se adaptam ao tamanho do seu negócio - do lava jato com um funcionário até operações com múltiplas equipes.`
  };

  return [
    secoesBase[0],
    segundaSecaoPorRegiao[regiao] || segundaSecaoPorRegiao["Sudeste"],
    terceiraSecao
  ];
}

export interface ConteudoSEO {
  titulo: string;
  subtitulo: string;
  descricaoMeta: string;
  introducao: string;
  secoes: {
    titulo: string;
    conteudo: string;
  }[];
  beneficios: string[];
  faq: {
    pergunta: string;
    resposta: string;
  }[];
  ctaTexto: string;
}

// Função para gerar conteúdo baseado na cidade
export function gerarConteudoPorCidade(cidade: CidadeSEO): ConteudoSEO {
  const populacaoFormatada = cidade.populacao >= 1000000 
    ? `${(cidade.populacao / 1000000).toFixed(1)} milhões` 
    : `${(cidade.populacao / 1000).toFixed(0)} mil`;

  // Variações de conteúdo baseadas na região
  const contextoRegional: Record<string, { clima: string; caracteristica: string; mercado: string }> = {
    "Sudeste": {
      clima: "O ritmo acelerado e a grande quantidade de veículos",
      caracteristica: "polo econômico do país",
      mercado: "mercado competitivo e exigente"
    },
    "Sul": {
      clima: "A organização e qualidade características da região",
      caracteristica: "região com alto padrão de serviços",
      mercado: "clientes que valorizam profissionalismo"
    },
    "Nordeste": {
      clima: "O clima quente e a poeira constante",
      caracteristica: "região em crescimento acelerado",
      mercado: "demanda crescente por serviços de qualidade"
    },
    "Centro-Oeste": {
      clima: "O agronegócio forte e a frota de veículos robustos",
      caracteristica: "centro estratégico do Brasil",
      mercado: "mercado em expansão"
    },
    "Norte": {
      clima: "O clima úmido e as particularidades da região",
      caracteristica: "região com características únicas",
      mercado: "mercado com grande potencial de crescimento"
    },
  };

  const ctx = contextoRegional[cidade.regiao] || contextoRegional["Sudeste"];

  return {
    titulo: `Sistema para Lava Rápido em ${cidade.nome}`,
    subtitulo: `Gerencie seu lava jato em ${cidade.nome} com tecnologia. Controle total pelo celular.`,
    descricaoMeta: `Sistema de gestão para lava rápido em ${cidade.nome}, ${cidade.uf}. Kanban, agendamento online, WhatsApp automático. Teste grátis 7 dias!`,
    introducao: `Com cerca de ${populacaoFormatada} de habitantes, ${cidade.nome} tem uma frota de veículos que cresce a cada dia. ${ctx.clima} fazem do mercado de lava rápido uma excelente oportunidade de negócio. Mas para se destacar, você precisa de organização e eficiência. É aí que o Lavify entra.`,
    // Seções com conteúdo variado por região
    secoes: getSecoesPorRegiao(cidade.regiao, cidade.nome, cidade.estado, ctx, populacaoFormatada),
    // Benefícios variados por região para evitar repetição
    beneficios: getBeneficiosPorRegiao(cidade.regiao),
    // FAQs específicos por região (evita conteúdo duplicado entre cidades)
    faq: getFAQPorRegiao(cidade.regiao, cidade.nome),
    ctaTexto: "Testar Grátis por 7 Dias"
  };
}

// Cache de conteúdo gerado
const conteudoCache: Record<string, ConteudoSEO> = {};

export function getConteudoCidade(slug: string): ConteudoSEO | null {
  // Verificar cache primeiro
  if (conteudoCache[slug]) {
    return conteudoCache[slug];
  }

  // Buscar cidade
  const cidade = cidadesBrasil.find(c => c.slug === slug);
  if (!cidade) return null;

  // Gerar e cachear
  const conteudo = gerarConteudoPorCidade(cidade);
  conteudoCache[slug] = conteudo;
  
  return conteudo;
}

// Exportar todas as cidades para uso no sitemap
export function getAllConteudos(): Record<string, ConteudoSEO> {
  cidadesBrasil.forEach(cidade => {
    if (!conteudoCache[cidade.slug]) {
      conteudoCache[cidade.slug] = gerarConteudoPorCidade(cidade);
    }
  });
  return conteudoCache;
}

