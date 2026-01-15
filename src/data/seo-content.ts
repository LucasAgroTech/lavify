// Conteúdo SEO pré-gerado para todas as cidades
// Este arquivo é gerado automaticamente e pode ser atualizado via API

import { cidadesBrasil, CidadeSEO } from "@/lib/seo-cities";

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
    secoes: [
      {
        titulo: `O Mercado de Lava Jatos em ${cidade.nome}`,
        conteudo: `${cidade.nome}, no ${cidade.estado}, é ${ctx.caracteristica}. Isso significa ${ctx.mercado}, onde lava rápidos precisam oferecer não apenas um bom serviço de lavagem, mas também uma experiência profissional do início ao fim.\n\nMuitos empreendedores ainda gerenciam seus lava jatos com cadernos, planilhas e muita memória. O resultado? Clientes esperando sem previsão, equipe desorganizada, estoque que acaba de surpresa e dificuldade para saber se o negócio está dando lucro. O Lavify resolve tudo isso.`
      },
      {
        titulo: "Como o Lavify Transforma Seu Lava Jato",
        conteudo: `O Lavify é um sistema completo pensado especificamente para lava rápidos. Com o **Kanban visual**, você vê exatamente onde cada carro está: aguardando, lavando, secando ou pronto. Arraste e solte para atualizar o status em segundos.\n\nO **agendamento online** funciona 24 horas. Seus clientes marcam pelo celular, a qualquer hora, e você acorda com a agenda organizada. Quando o serviço termina, um **WhatsApp automático** avisa o cliente. Sem precisar ligar, sem atrasos. Além disso, o controle de **estoque** avisa antes de acabar e os **relatórios financeiros** mostram exatamente quanto você está faturando.`
      },
      {
        titulo: `Por que Lava Rápidos em ${cidade.nome} Escolhem o Lavify`,
        conteudo: `O Lavify foi desenvolvido por quem entende o dia a dia de um lava jato brasileiro. Por isso, é simples de usar - seu funcionário aprende em minutos, sem treinamento complicado. Funciona no celular, então você pode acompanhar seu negócio de qualquer lugar de ${cidade.nome} ou viajando.\n\nOferecemos **teste grátis de 7 dias** sem precisar cadastrar cartão. Assim você experimenta todas as funcionalidades antes de decidir. E nossos planos cabem no bolso de qualquer lava jato, do pequeno ao grande.`
      }
    ],
    beneficios: [
      "Kanban visual para controle do pátio",
      "Agendamento online que funciona 24h",
      "WhatsApp automático quando o carro fica pronto",
      "Controle de estoque com alertas",
      "Relatórios de faturamento em tempo real",
      "Acesso pelo celular de qualquer lugar"
    ],
    faq: [
      {
        pergunta: `O Lavify funciona para lava jatos pequenos em ${cidade.nome}?`,
        resposta: `Com certeza! O Lavify foi pensado para atender desde lava rápidos com um funcionário até operações com múltiplas equipes. Nossos planos são flexíveis e se adaptam ao tamanho do seu negócio em ${cidade.nome}.`
      },
      {
        pergunta: "Preciso de computador ou posso usar só o celular?",
        resposta: `O Lavify funciona 100% online, tanto no computador quanto no celular. Você pode gerenciar seu lava jato inteiro pelo smartphone, de qualquer lugar com internet.`
      },
      {
        pergunta: "O teste gratuito tem alguma limitação?",
        resposta: `Não! Durante os 7 dias de teste, você tem acesso a todas as funcionalidades do plano Pro, sem limitações. E não pedimos cartão de crédito para começar.`
      },
      {
        pergunta: `Quantos lava jatos em ${cidade.nome} já usam o Lavify?`,
        resposta: `O Lavify atende lava rápidos em todo o Brasil, incluindo ${cidade.nome} e diversas cidades do ${cidade.estado}. Nossa base cresce a cada dia com empreendedores que querem profissionalizar seu negócio.`
      }
    ],
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

