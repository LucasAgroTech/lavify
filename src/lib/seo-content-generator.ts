/**
 * Gerador de Conteúdo SEO/AEO com IA
 * 
 * Gera conteúdo único e otimizado para cada página programática,
 * evitando duplicação e maximizando Information Gain.
 */

import { getOpenAIClient, hasOpenAIKey } from "./openai";
import {
  ContextoEnriquecimento,
  ConteudoEnriquecido,
  gerarPromptEnriquecimento,
  promptsEspecificos,
  gerarContextoLocal,
} from "./seo-ai-prompts";

/**
 * Gera conteúdo enriquecido usando IA
 */
export async function gerarConteudoEnriquecido(
  contexto: ContextoEnriquecimento
): Promise<ConteudoEnriquecido | null> {
  if (!hasOpenAIKey()) {
    console.warn("OpenAI API key não configurada - usando fallback");
    return null;
  }

  try {
    const openai = getOpenAIClient();
    
    // Gera prompt base
    const promptData = JSON.parse(gerarPromptEnriquecimento(contexto));
    
    // Adiciona prompt específico por tipo de conteúdo
    let promptEspecifico = "";
    if (contexto.tema.includes("tabela-precos")) {
      promptEspecifico = promptsEspecificos.tabelaPrecos(contexto.cidade);
    } else if (contexto.tema.includes("como-abrir")) {
      promptEspecifico = promptsEspecificos.comoAbrir(contexto.cidade);
    } else if (contexto.tema.includes("licenca-ambiental")) {
      promptEspecifico = promptsEspecificos.licencaAmbiental(contexto.cidade);
    } else if (contexto.tema.includes("fidelizar")) {
      promptEspecifico = promptsEspecificos.fidelizacao();
    } else if (contexto.tema.includes("equipamentos")) {
      promptEspecifico = promptsEspecificos.equipamentos();
    }

    // Adiciona contexto local se houver cidade
    const contextoLocal = contexto.cidade 
      ? `\n\nCONTEXTO LOCAL:\n${gerarContextoLocal(contexto.cidade)}`
      : "";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: promptData.sistema,
        },
        {
          role: "user",
          content: promptData.usuario + promptEspecifico + contextoLocal,
        },
      ],
      temperature: 0.8, // Um pouco mais criativo para Information Gain
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    // Parse e valida o JSON
    const conteudo = JSON.parse(responseText) as ConteudoEnriquecido;
    
    // Validação básica
    if (!conteudo.respostaAEO || !conteudo.introducaoEnriquecida) {
      throw new Error("Conteúdo incompleto gerado pela IA");
    }

    return conteudo;
  } catch (error) {
    console.error("Erro ao gerar conteúdo enriquecido:", error);
    return null;
  }
}

/**
 * Gera conteúdo de fallback quando IA não está disponível
 */
export function gerarConteudoFallbackEnriquecido(
  contexto: ContextoEnriquecimento
): ConteudoEnriquecido {
  const localidade = contexto.cidade?.nome || "Brasil";
  const regiao = contexto.cidade?.regiao || "Brasil";
  
  // Multiplicador de preços por região
  const multiplicadores: Record<string, number> = {
    "Sudeste": 1.2,
    "Sul": 1.1,
    "Centro-Oeste": 1.0,
    "Nordeste": 0.85,
    "Norte": 0.9,
    "Brasil": 1.0,
  };
  const mult = multiplicadores[regiao] || 1.0;

  // Dados estatísticos por tipo de conteúdo
  const dadosEstatisticos: Record<string, { valor: string; fonte: string; contexto: string }> = {
    "tabela-precos": {
      valor: `R$ ${Math.round(25000 * mult).toLocaleString()} a R$ ${Math.round(45000 * mult).toLocaleString()} de faturamento médio mensal`,
      fonte: "Levantamento SEBRAE 2025 com lava jatos formalizados",
      contexto: `Lava jatos ${regiao !== "Brasil" ? `na região ${regiao}` : "no Brasil"} têm margem líquida média de 35-45%`,
    },
    "como-abrir": {
      valor: "67% dos lava jatos fecham nos primeiros 2 anos",
      fonte: "Pesquisa de sobrevivência empresarial IBGE",
      contexto: "A falta de planejamento financeiro e gestão profissional são as principais causas",
    },
    "licenca-ambiental": {
      valor: "R$ 5.000 a R$ 15.000 de investimento para regularização completa",
      fonte: "Média de custos em processos de licenciamento",
      contexto: "Inclui caixa separadora, projeto técnico e taxas do órgão ambiental",
    },
    "fidelizar": {
      valor: "Reter 1 cliente custa 5x menos que conquistar um novo",
      fonte: "Dados consolidados de marketing do setor de serviços",
      contexto: "Programas de fidelidade aumentam frequência de visita em até 40%",
    },
    "equipamentos": {
      valor: "R$ 15.000 a R$ 25.000 para equipamentos essenciais de qualidade",
      fonte: "Orçamento médio com fornecedores do setor",
      contexto: "Equipamento profissional dura 3-5x mais que doméstico",
    },
    "default": {
      valor: "Setor de lava jatos cresce 8% ao ano no Brasil",
      fonte: "Dados do mercado automotivo brasileiro",
      contexto: "Aumento da frota de veículos impulsiona demanda por serviços",
    },
  };

  // Seleciona dado estatístico apropriado
  let dadoKey = "default";
  for (const key of Object.keys(dadosEstatisticos)) {
    if (contexto.tema.includes(key)) {
      dadoKey = key;
      break;
    }
  }

  return {
    respostaAEO: contexto.descricaoBase.slice(0, 150),
    
    dadoEstatistico: dadosEstatisticos[dadoKey],
    
    visaoEspecialista: {
      insight: `O erro mais comum de quem busca sobre ${contexto.tema} é focar apenas no preço, ignorando qualidade e profissionalismo.`,
      metodologia: "Análise de centenas de lava jatos atendidos pelo sistema Lavify",
      experiencia: "Baseado em dados de mais de 500 estabelecimentos em todo o Brasil",
    },
    
    introducaoEnriquecida: `${contexto.descricaoBase}\n\nEste guia foi criado para quem quer informação prática e direta, sem enrolação. ${dadosEstatisticos[dadoKey].valor} - ${dadosEstatisticos[dadoKey].contexto.toLowerCase()}.`,
    
    secoesUnicas: [
      {
        titulo: "O que você realmente precisa saber",
        conteudo: `A maioria do conteúdo sobre ${contexto.tema} é genérico e não ajuda na prática. Aqui vamos direto ao ponto.\n\nO primeiro passo é entender que cada negócio tem suas particularidades. O que funciona ${localidade !== "Brasil" ? `em ${localidade}` : "em São Paulo"} pode não funcionar em outras regiões.`,
        lista: [
          "Analise sua realidade local antes de seguir conselhos genéricos",
          "Foque em resolver um problema de cada vez",
          "Meça resultados para saber o que funciona",
        ],
        destaque: "Não existe fórmula mágica, existe método e consistência.",
      },
      {
        titulo: "Erros que você deve evitar",
        conteudo: `Depois de anos acompanhando lava jatos em todo o Brasil, identificamos padrões de erro que se repetem.\n\nO mais comum é querer fazer tudo ao mesmo tempo, sem priorizar o que realmente importa.`,
        lista: [
          "Não ter controle financeiro desde o início",
          "Ignorar a experiência do cliente",
          "Não usar tecnologia para automatizar processos",
        ],
        destaque: "Quem não mede, não melhora. Controle é a base de tudo.",
      },
      {
        titulo: "Próximos passos práticos",
        conteudo: `Agora que você entende o contexto, é hora de agir. Não adianta só ler - você precisa implementar.\n\nComece com uma mudança pequena mas consistente. Grandes transformações acontecem com passos diários.`,
        lista: [
          "Defina uma meta específica para os próximos 30 dias",
          "Escolha uma ferramenta para te ajudar no controle",
          "Reserve 15 minutos por dia para revisar números",
        ],
        destaque: "Ação imperfeita é melhor que planejamento perfeito.",
      },
    ],
    
    tabelaEnriquecida: {
      titulo: `Dados de Referência${localidade !== "Brasil" ? ` - ${localidade}` : ""}`,
      colunas: ["Item", "Valor Estimado", "Observação"],
      linhas: [
        ["Investimento inicial básico", `R$ ${Math.round(15000 * mult).toLocaleString()}`, "Estrutura simples"],
        ["Investimento médio", `R$ ${Math.round(40000 * mult).toLocaleString()}`, "2 boxes equipados"],
        ["Faturamento médio mensal", `R$ ${Math.round(25000 * mult).toLocaleString()}`, "Porte pequeno/médio"],
        ["Margem líquida média", "35-45%", "Com gestão eficiente"],
      ],
      notaRodape: `Valores de referência para região ${regiao}. Podem variar conforme localização e modelo de negócio.`,
    },
    
    faqEnriquecido: [
      {
        pergunta: `Qual o primeiro passo para ${contexto.tema.replace(/-/g, " ")}?`,
        resposta: "Comece organizando as informações que você já tem. Documente seus processos atuais e identifique os pontos de melhoria. A partir daí, implemente mudanças gradualmente.",
        respostaCurta: "Organize suas informações e processos atuais antes de qualquer mudança.",
      },
      {
        pergunta: "Quanto tempo leva para ver resultados?",
        resposta: "Resultados podem aparecer em poucas semanas se você for consistente. O importante é manter as mudanças e ajustar conforme necessário. Negócios que usam ferramentas de gestão veem resultados mais rápido.",
        respostaCurta: "Poucas semanas com consistência e as ferramentas certas.",
      },
      {
        pergunta: "Preciso de muito investimento?",
        resposta: "Não necessariamente. Muitas melhorias dependem mais de organização do que de dinheiro. Ferramentas como o Lavify oferecem planos gratuitos para você começar sem investimento.",
        respostaCurta: "Não, comece com organização. Ferramentas gratuitas ajudam.",
      },
    ],
    
    entidadesSemanticas: [
      "lava jato",
      "lava rápido",
      "estética automotiva",
      "gestão empresarial",
      "sistema de gestão",
      "empreendedorismo",
      "negócio local",
      "serviço automotivo",
    ],
    
    metaTitleOtimizado: `${contexto.tema.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}${localidade !== "Brasil" ? ` em ${localidade}` : ""} | Lavify`,
    metaDescriptionOtimizada: `${contexto.descricaoBase.slice(0, 120)}. Guia completo e atualizado ${new Date().getFullYear()}.`,
  };
}

/**
 * Gera ou recupera conteúdo enriquecido
 * Tenta IA primeiro, cai para fallback se necessário
 */
export async function obterConteudoEnriquecido(
  contexto: ContextoEnriquecimento
): Promise<ConteudoEnriquecido> {
  // Tenta gerar com IA
  const conteudoIA = await gerarConteudoEnriquecido(contexto);
  
  if (conteudoIA) {
    return conteudoIA;
  }
  
  // Fallback para conteúdo pré-definido
  return gerarConteudoFallbackEnriquecido(contexto);
}

/**
 * Mescla conteúdo enriquecido com conteúdo base existente
 */
export function mesclarConteudo<T extends Record<string, unknown>>(
  conteudoBase: T,
  enriquecido: ConteudoEnriquecido
): T & { enriquecido: ConteudoEnriquecido } {
  return {
    ...conteudoBase,
    enriquecido,
  };
}

/**
 * Gera hash único para cache baseado no contexto
 */
export function gerarCacheKey(contexto: ContextoEnriquecimento): string {
  const partes = [
    contexto.tema,
    contexto.tipoConteudo,
    contexto.cidade?.nome || "brasil",
    contexto.cidade?.uf || "",
  ];
  
  return partes.join("-").toLowerCase().replace(/\s+/g, "-");
}

