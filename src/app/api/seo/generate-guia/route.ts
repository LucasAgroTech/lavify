import { NextRequest, NextResponse } from "next/server";
import { getCidadeBySlug, CidadeSEO } from "@/lib/seo-cities";
import { getProblemaBySlug, ProblemaSEO } from "@/lib/seo-problems";

// Inicialização dinâmica do OpenAI
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  const OpenAI = require("openai").default;
  return new OpenAI({ apiKey });
}

export interface ConteudoGuiaSEO {
  titulo: string;
  subtitulo: string;
  descricaoMeta: string;
  introducao: string;
  secoes: {
    titulo: string;
    conteudo: string;
    lista?: string[];
  }[];
  tabela?: {
    titulo: string;
    colunas: string[];
    linhas: string[][];
  };
  checklist?: {
    titulo: string;
    itens: { item: string; descricao: string }[];
  };
  faq: {
    pergunta: string;
    resposta: string;
  }[];
  conclusao: string;
  ctaTexto: string;
}

export async function POST(request: NextRequest) {
  try {
    const { problemaSlug, cidadeSlug } = await request.json();
    
    const problema = getProblemaBySlug(problemaSlug);
    
    if (!problema) {
      return NextResponse.json({ error: "Guia não encontrado" }, { status: 404 });
    }
    
    // Cidade é opcional para guias
    const cidadeData = cidadeSlug ? getCidadeBySlug(cidadeSlug) : null;
    const cidade: CidadeSEO | null = cidadeData || null;

    const conteudo = await gerarConteudoGuia(problema, cidade);
    
    return NextResponse.json(conteudo);
  } catch (error) {
    console.error("Erro ao gerar conteúdo SEO de guia:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

async function gerarConteudoGuia(problema: ProblemaSEO, cidade: CidadeSEO | null): Promise<ConteudoGuiaSEO> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    return gerarConteudoFallback(problema, cidade);
  }

  const cidadeInfo = cidade 
    ? `CIDADE: ${cidade.nome}, ${cidade.estado} (${cidade.uf})\nREGIÃO: ${cidade.regiao}\nPOPULAÇÃO: ~${(cidade.populacao / 1000000).toFixed(1)} milhões`
    : "ESCOPO: Brasil inteiro";

  const prompt = `Você é um especialista em lava jatos e estética automotiva no Brasil. Gere conteúdo REAL, VERIFICÁVEL e ÚTIL para um guia/artigo.

TEMA: ${problema.tituloCompleto}
TIPO: ${problema.tipo}
DESCRIÇÃO: ${problema.descricao}
${cidadeInfo}

IMPORTANTE: 
- Use informações REAIS e ATUALIZADAS do mercado brasileiro
- Para tabelas de preços, use valores REAIS praticados no mercado
- Para guias fiscais, use informações CORRETAS da legislação brasileira
- Inclua dados verificáveis sempre que possível

Retorne um JSON com:
{
  "titulo": "H1 otimizado (máx 60 chars)",
  "subtitulo": "Subtítulo útil (máx 120 chars)",
  "descricaoMeta": "Meta description (máx 155 chars)",
  "introducao": "3-4 frases introdutórias que prendam atenção",
  "secoes": [
    {
      "titulo": "H2 relevante",
      "conteudo": "2-3 parágrafos com informação útil",
      "lista": ["item 1", "item 2", "item 3"] // opcional
    }
  ],
  ${problema.tipo === "tabela" ? `"tabela": {
    "titulo": "Título da tabela",
    "colunas": ["Coluna 1", "Coluna 2", "Coluna 3"],
    "linhas": [
      ["Dado 1", "Dado 2", "Dado 3"],
      ["Dado 1", "Dado 2", "Dado 3"]
    ]
  },` : ""}
  ${problema.tipo === "checklist" ? `"checklist": {
    "titulo": "Título do checklist",
    "itens": [
      {"item": "Item 1", "descricao": "Por que é importante"},
      {"item": "Item 2", "descricao": "Por que é importante"}
    ]
  },` : ""}
  "faq": [
    {"pergunta": "Pergunta frequente 1", "resposta": "Resposta completa"},
    {"pergunta": "Pergunta frequente 2", "resposta": "Resposta completa"},
    {"pergunta": "Pergunta frequente 3", "resposta": "Resposta completa"}
  ],
  "conclusao": "Parágrafo de conclusão com CTA sutil para o Lavify",
  "ctaTexto": "Texto CTA"
}

REGRAS:
1. Português brasileiro natural e profissional
2. Informações PRECISAS e ÚTEIS
3. Conteúdo deve resolver o problema do leitor
4. Mencione o Lavify apenas na conclusão de forma natural
5. Inclua pelo menos 4 seções de conteúdo
6. Para ${problema.tipo}: foque em ${problema.tipo === "tabela" ? "dados organizados" : problema.tipo === "checklist" ? "lista prática de itens" : problema.tipo === "guia" ? "passo a passo detalhado" : "informação estruturada"}

Responda APENAS com JSON válido.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em lava jatos e empreendedorismo no Brasil. Use dados reais e atualizados. Responda em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const cleanJson = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    return JSON.parse(cleanJson) as ConteudoGuiaSEO;
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    return gerarConteudoFallback(problema, cidade);
  }
}

function gerarConteudoFallback(problema: ProblemaSEO, cidade: CidadeSEO | null): ConteudoGuiaSEO {
  const localidade = cidade ? ` em ${cidade.nome}` : "";
  const locUF = cidade ? `, ${cidade.uf}` : "";
  
  // Conteúdo específico por tipo de problema
  if (problema.slug.includes("tabela-precos-lavagem")) {
    return gerarTabelaPrecos(problema, cidade);
  }
  
  if (problema.slug.includes("checklist")) {
    return gerarChecklist(problema, cidade);
  }
  
  // Fallback genérico para guias
  return {
    titulo: `${problema.titulo}${localidade}`,
    subtitulo: problema.descricao,
    descricaoMeta: `${problema.tituloCompleto}${localidade}${locUF}. Guia completo e atualizado para donos de lava jato.`,
    introducao: `Este guia completo sobre ${problema.titulo.toLowerCase()} foi criado para ajudar donos de lava jato${localidade} a profissionalizar suas operações. Reunimos informações práticas e atualizadas do mercado brasileiro.`,
    secoes: [
      {
        titulo: "Por que isso é importante",
        conteudo: `Entender sobre ${problema.titulo.toLowerCase()} é essencial para qualquer empreendedor do setor de lava jato${localidade}. Negócios bem organizados conseguem atender mais clientes, reduzir custos e aumentar a lucratividade.\n\nMuitos donos de lava jato perdem dinheiro por não terem processos estruturados. Este guia vai ajudar você a mudar isso.`
      },
      {
        titulo: "Como aplicar na prática",
        conteudo: `Implementar boas práticas de ${problema.titulo.toLowerCase()} não precisa ser complicado. Comece com o básico e vá evoluindo conforme seu negócio cresce.\n\nO mais importante é manter a consistência e documentar seus processos. Isso facilita o treinamento de novos funcionários e garante qualidade no atendimento.`,
        lista: [
          "Documente todos os processos",
          "Treine sua equipe regularmente",
          "Use ferramentas de gestão",
          "Acompanhe métricas importantes",
          "Faça ajustes baseados em dados"
        ]
      },
      {
        titulo: "Erros comuns a evitar",
        conteudo: `Conhecer os erros mais comuns ajuda você a não repeti-los. Muitos lava jatos${localidade} enfrentam os mesmos desafios.\n\nA falta de controle é o principal problema. Sem dados, você não sabe o que está funcionando e o que precisa melhorar.`,
        lista: [
          "Não ter controle financeiro",
          "Ignorar a satisfação do cliente",
          "Não investir em marketing",
          "Depender de processos manuais",
          "Não usar tecnologia a seu favor"
        ]
      },
      {
        titulo: "Próximos passos",
        conteudo: `Agora que você entende sobre ${problema.titulo.toLowerCase()}, é hora de colocar em prática. Comece implementando uma mudança por vez.\n\nUm sistema de gestão pode ajudar muito nesse processo, automatizando tarefas repetitivas e dando visibilidade sobre todo o seu negócio.`
      }
    ],
    faq: [
      {
        pergunta: `Qual o primeiro passo para ${problema.titulo.toLowerCase()}?`,
        resposta: "Comece organizando as informações que você já tem. Documente seus processos atuais e identifique os pontos de melhoria. A partir daí, implemente mudanças gradualmente."
      },
      {
        pergunta: "Quanto tempo leva para ver resultados?",
        resposta: "Resultados podem aparecer em poucas semanas se você for consistente. O importante é manter as mudanças e ajustar conforme necessário. Negócios que usam ferramentas de gestão veem resultados mais rápido."
      },
      {
        pergunta: "Preciso de muito investimento?",
        resposta: "Não necessariamente. Muitas melhorias dependem mais de organização do que de dinheiro. Ferramentas como o Lavify oferecem planos gratuitos para você começar sem investimento."
      }
    ],
    conclusao: `Implementar boas práticas de ${problema.titulo.toLowerCase()} é um diferencial competitivo importante para lava jatos${localidade}. Com o Lavify, você pode automatizar grande parte desses processos e focar no que realmente importa: atender bem seus clientes e crescer seu negócio.`,
    ctaTexto: "Testar Lavify Grátis"
  };
}

function gerarTabelaPrecos(problema: ProblemaSEO, cidade: CidadeSEO | null): ConteudoGuiaSEO {
  const localidade = cidade ? ` em ${cidade.nome}` : "";
  const regiao = cidade?.regiao || "Brasil";
  
  // Ajustar preços por região
  const multiplicador: Record<string, number> = {
    "Sudeste": 1.2,
    "Sul": 1.1,
    "Centro-Oeste": 1.0,
    "Nordeste": 0.85,
    "Norte": 0.9,
    "Brasil": 1.0
  };
  
  const mult = multiplicador[regiao] || 1.0;
  
  const formatPreco = (valor: number) => `R$ ${Math.round(valor * mult)},00`;
  const formatFaixa = (min: number, max: number) => `${formatPreco(min)} - ${formatPreco(max)}`;
  
  return {
    titulo: `Tabela de Preços de Lavagem${localidade}`,
    subtitulo: `Preços atualizados de serviços de lava jato${localidade} para ${new Date().getFullYear()}`,
    descricaoMeta: `Tabela de preços de lavagem automotiva${localidade}. Valores atualizados de lavagem simples, completa, higienização e mais.`,
    introducao: `Conhecer os preços praticados no mercado${localidade} é essencial para precificar seus serviços de forma competitiva. Esta tabela reúne valores médios de referência para os principais serviços de lava jato, atualizados para ${new Date().getFullYear()}.`,
    secoes: [
      {
        titulo: "Como usar esta tabela",
        conteudo: `Os valores apresentados são médias do mercado${localidade} e servem como referência. Preços podem variar conforme localização, qualidade dos produtos usados e diferenciais do estabelecimento.\n\nLava jatos em áreas nobres ou com serviços premium podem cobrar valores acima da média. O importante é entregar qualidade compatível com o preço cobrado.`
      },
      {
        titulo: "Fatores que influenciam o preço",
        conteudo: `Diversos fatores afetam a precificação de serviços de lava jato${localidade}. Entender isso ajuda você a definir preços justos.`,
        lista: [
          "Localização do estabelecimento",
          "Tamanho e tipo do veículo",
          "Qualidade dos produtos utilizados",
          "Tempo de execução do serviço",
          "Nível de sujeira do veículo",
          "Serviços adicionais inclusos"
        ]
      },
      {
        titulo: "Dicas para aumentar o ticket médio",
        conteudo: `Oferecer pacotes e serviços complementares é a melhor forma de aumentar o faturamento sem aumentar proporcionalmente os custos.\n\nClientes que já estão no seu lava jato estão mais propensos a adicionar serviços. Use técnicas de venda cruzada e crie combos atrativos.`
      }
    ],
    tabela: {
      titulo: `Tabela de Preços - Lavagem Automotiva${localidade}`,
      colunas: ["Serviço", "Carro Popular", "SUV/Pickup", "Tempo Médio"],
      linhas: [
        ["Lavagem Simples", formatFaixa(25, 40), formatFaixa(35, 55), "20-30 min"],
        ["Lavagem Completa", formatFaixa(45, 70), formatFaixa(60, 90), "40-60 min"],
        ["Lavagem + Cera", formatFaixa(60, 90), formatFaixa(80, 120), "50-70 min"],
        ["Higienização Interna", formatFaixa(80, 150), formatFaixa(100, 180), "60-90 min"],
        ["Lavagem Técnica Motor", formatFaixa(50, 80), formatFaixa(60, 100), "30-45 min"],
        ["Polimento Simples", formatFaixa(150, 250), formatFaixa(200, 350), "2-3 horas"],
        ["Cristalização de Vidros", formatFaixa(80, 150), formatFaixa(100, 180), "1-2 horas"],
        ["Limpeza de Ar Condicionado", formatFaixa(60, 100), formatFaixa(70, 120), "30-45 min"]
      ]
    },
    faq: [
      {
        pergunta: `Qual o preço médio de uma lavagem${localidade}?`,
        resposta: `Uma lavagem simples${localidade} custa em média ${formatFaixa(25, 40)} para carros populares. Lavagens completas ficam entre ${formatFaixa(45, 70)}. Valores podem variar conforme o estabelecimento e serviços inclusos.`
      },
      {
        pergunta: "Devo cobrar mais de SUVs e pickups?",
        resposta: "Sim, é prática comum do mercado. Veículos maiores exigem mais tempo, produtos e mão de obra. A diferença costuma ser de 30% a 50% a mais que carros populares."
      },
      {
        pergunta: "Como definir o preço ideal?",
        resposta: "Calcule seus custos (produtos, mão de obra, aluguel, etc), some sua margem de lucro desejada e compare com a concorrência. O preço deve ser competitivo mas garantir lucratividade."
      }
    ],
    conclusao: `Manter uma tabela de preços atualizada e bem definida é fundamental para a gestão do seu lava jato${localidade}. Com o Lavify, você cadastra seus serviços com preços e o sistema calcula tudo automaticamente, incluindo comissões e relatórios financeiros.`,
    ctaTexto: "Automatizar Meu Lava Jato"
  };
}

function gerarChecklist(problema: ProblemaSEO, cidade: CidadeSEO | null): ConteudoGuiaSEO {
  const localidade = cidade ? ` em ${cidade.nome}` : "";
  
  return {
    titulo: problema.titulo,
    subtitulo: problema.descricao,
    descricaoMeta: `${problema.tituloCompleto}. Download grátis do checklist completo para seu lava jato.`,
    introducao: `Um bom checklist é essencial para padronizar o atendimento no seu lava jato${localidade}. Use este modelo como base e adapte às necessidades do seu negócio.`,
    secoes: [
      {
        titulo: "Por que usar checklist",
        conteudo: `Checklists garantem que nenhum passo seja esquecido, mesmo em dias corridos. Eles padronizam o atendimento e facilitam o treinamento de novos funcionários.\n\nLava jatos que usam checklists têm menos reclamações e maior satisfação dos clientes.`
      },
      {
        titulo: "Como implementar",
        conteudo: `Imprima o checklist ou use uma versão digital no celular. O importante é que seja fácil de usar e que a equipe realmente preencha.\n\nCom o Lavify, você pode criar checklists digitais personalizados que ficam salvos no histórico de cada veículo.`,
        lista: [
          "Treine toda a equipe no uso",
          "Faça o preenchimento obrigatório",
          "Revise regularmente os itens",
          "Guarde os registros preenchidos",
          "Use para resolver disputas com clientes"
        ]
      }
    ],
    checklist: {
      titulo: problema.titulo,
      itens: [
        { item: "Verificar quilometragem", descricao: "Anote a quilometragem atual do veículo" },
        { item: "Nível de combustível", descricao: "Registre o nível aproximado de combustível" },
        { item: "Pertences no interior", descricao: "Pergunte sobre objetos de valor" },
        { item: "Arranhões e amassados", descricao: "Fotografe danos pré-existentes" },
        { item: "Estado dos pneus", descricao: "Verifique se há pneus carecas ou furados" },
        { item: "Retrovisores e antenas", descricao: "Anote posição e estado" },
        { item: "Funcionamento das travas", descricao: "Teste se todas funcionam" },
        { item: "Estado do painel", descricao: "Verifique luzes de alerta acesas" },
        { item: "Assinatura do cliente", descricao: "Colha assinatura confirmando vistoria" }
      ]
    },
    faq: [
      {
        pergunta: "Preciso fazer checklist em todos os carros?",
        resposta: "Sim, recomendamos fazer em 100% dos veículos. Mesmo clientes frequentes. Isso protege você de reclamações infundadas e profissionaliza o atendimento."
      },
      {
        pergunta: "O cliente precisa assinar?",
        resposta: "É altamente recomendado. A assinatura do cliente confirmando o estado do veículo na entrada é sua proteção em caso de disputas."
      },
      {
        pergunta: "Posso fazer checklist digital?",
        resposta: "Sim! É ainda melhor porque fica salvo automaticamente. O Lavify permite criar checklists digitais com fotos que ficam no histórico do veículo."
      }
    ],
    conclusao: `Usar checklists é uma prática simples que profissionaliza muito seu lava jato${localidade}. Com o Lavify, você digitaliza todo esse processo e tem acesso ao histórico completo de cada veículo que passou pelo seu estabelecimento.`,
    ctaTexto: "Digitalizar Meu Lava Jato"
  };
}

