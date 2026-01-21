/**
 * Sistema de Prompts SEO/AEO Otimizados
 * 
 * Estratégia 2026: Information Gain + E-E-A-T + AEO First
 * 
 * - AEO First: Resposta direta de 150 chars para capturar AI Overview
 * - Information Gain: Dados estatísticos, insights de especialista, perspectivas únicas
 * - E-E-A-T: Experiência prática, metodologia de teste, visão do especialista
 * - Escaneabilidade: Parágrafos curtos, bullet points, tabelas
 */

export interface ContextoEnriquecimento {
  tema: string;
  tipoConteudo: "guia" | "tabela" | "checklist" | "servico" | "cidade";
  cidade?: {
    nome: string;
    uf: string;
    regiao: string;
    populacao: number;
  };
  keywords: string[];
  descricaoBase: string;
}

export interface ConteudoEnriquecido {
  // AEO First - Resposta direta (máx 150 chars)
  respostaAEO: string;
  
  // Information Gain - Dados únicos
  dadoEstatistico: {
    valor: string;
    fonte: string;
    contexto: string;
  };
  
  // E-E-A-T - Visão do Especialista
  visaoEspecialista: {
    insight: string;
    metodologia?: string;
    experiencia: string;
  };
  
  // Conteúdo enriquecido por seção
  introducaoEnriquecida: string;
  secoesUnicas: {
    titulo: string;
    conteudo: string;
    lista?: string[];
    destaque?: string;
  }[];
  
  // Tabela comparativa/resumo
  tabelaEnriquecida?: {
    titulo: string;
    colunas: string[];
    linhas: string[][];
    notaRodape?: string;
  };
  
  // FAQ otimizado para rich snippets
  faqEnriquecido: {
    pergunta: string;
    resposta: string;
    respostaCurta: string; // Para position zero
  }[];
  
  // Entidades semânticas identificadas
  entidadesSemanticas: string[];
  
  // Meta otimizado
  metaTitleOtimizado: string;
  metaDescriptionOtimizada: string;
}

/**
 * Gera o prompt otimizado para enriquecimento de conteúdo SEO/AEO
 */
export function gerarPromptEnriquecimento(contexto: ContextoEnriquecimento): string {
  const localidade = contexto.cidade 
    ? `em ${contexto.cidade.nome}, ${contexto.cidade.uf} (região ${contexto.cidade.regiao}, ~${(contexto.cidade.populacao / 1000000).toFixed(1)}M habitantes)` 
    : "no Brasil";

  const promptSistema = `Você é um Especialista em SEO de Performance e AEO (Answer Engine Optimization) em 2026, com foco no mercado brasileiro de lava jatos e estética automotiva.

MISSÃO: Criar conteúdo que priorize "Information Gain" (Ganho de Informação) e autoridade (E-E-A-T), FUGINDO do lugar-comum da IA generativa básica.

REGRAS CRÍTICAS:
1. NUNCA repita conteúdo genérico que já existe em outros sites
2. SEMPRE inclua um dado ou estatística específica (pode ser hipotética mas realista)
3. USE perspectivas técnicas de quem realmente trabalha no setor
4. PERSONALIZE para a localidade quando fornecida
5. TOM: Profissional, eficiente, "Lean" - sem enrolação
6. PARÁGRAFOS: máximo 3 linhas cada
7. PORTUGUÊS BRASILEIRO natural e coloquial de especialista`;

  const promptUsuario = `Gere conteúdo SEO/AEO ÚNICO sobre: "${contexto.tema}"
Tipo: ${contexto.tipoConteudo}
Local: ${localidade}
Keywords: ${contexto.keywords.slice(0, 5).join(", ")}
Base: ${contexto.descricaoBase}

Retorne JSON com esta estrutura EXATA:

{
  "respostaAEO": "Resposta DIRETA de até 150 caracteres para a dor principal do usuário. Capture o AI Overview do Google aqui.",
  
  "dadoEstatistico": {
    "valor": "Dado numérico específico (ex: '73% dos lava jatos...' ou 'R$ 45.000 de faturamento médio...')",
    "fonte": "Fonte do dado (ex: 'Pesquisa SEBRAE 2025', 'Dados do setor automotivo', 'Levantamento com 500 lava jatos')",
    "contexto": "Por que esse dado é relevante para o leitor"
  },
  
  "visaoEspecialista": {
    "insight": "Um insight técnico ESPECÍFICO que só um especialista saberia (dica prática, erro comum, atalho)",
    "metodologia": "Como você testou/validou isso (opcional)",
    "experiencia": "Uma frase sobre experiência prática (ex: 'Nos últimos 5 anos acompanhando lava jatos...')"
  },
  
  "introducaoEnriquecida": "3-4 frases de introdução que prendam atenção imediatamente. Máx 3 linhas por parágrafo. Inclua o dado estatístico naturalmente.",
  
  "secoesUnicas": [
    {
      "titulo": "Título H2 otimizado com entidade semântica",
      "conteudo": "2-3 parágrafos ÚNICOS. Máx 3 linhas cada. Informação que não existe em outros lugares.",
      "lista": ["Item prático 1", "Item prático 2", "Item prático 3"],
      "destaque": "Uma frase de destaque em negrito que resume a seção"
    }
  ],
  
  "tabelaEnriquecida": {
    "titulo": "Título da tabela com dados ${contexto.cidade ? `de ${contexto.cidade.nome}` : "atualizados"}",
    "colunas": ["Coluna 1", "Coluna 2", "Coluna 3"],
    "linhas": [["Dado real 1", "Dado real 2", "Dado real 3"]],
    "notaRodape": "Nota explicativa sobre os dados ou fonte"
  },
  
  "faqEnriquecido": [
    {
      "pergunta": "Pergunta frequente otimizada para voz",
      "resposta": "Resposta completa de 2-3 frases",
      "respostaCurta": "Resposta de 1 frase para position zero"
    }
  ],
  
  "entidadesSemanticas": ["lista", "de", "termos", "correlatos", "ao", "tema"],
  
  "metaTitleOtimizado": "Título SEO com keyword principal | Lavify (máx 60 chars)",
  "metaDescriptionOtimizada": "Meta description persuasiva com CTA sutil (máx 155 chars)"
}

IMPORTANTE:
- Gere pelo menos 4 seções únicas
- Cada seção deve ter informação que NÃO existe em outros sites
- Inclua pelo menos 3 perguntas no FAQ
- A tabela deve ter dados ${contexto.cidade ? `específicos para ${contexto.cidade.regiao}` : "do mercado brasileiro"}
- Entidades semânticas devem ser termos LSI relacionados ao tema

Responda APENAS com o JSON válido, sem markdown.`;

  return JSON.stringify({
    sistema: promptSistema,
    usuario: promptUsuario
  });
}

/**
 * Prompts específicos por tipo de conteúdo
 */
export const promptsEspecificos = {
  tabelaPrecos: (cidade?: { nome: string; regiao: string }) => `
FOCO ESPECIAL PARA TABELA DE PREÇOS:
- Inclua variação sazonal (verão vs inverno)
- Diferencie por porte do veículo (popular, SUV, pickup)
- Adicione nota sobre fatores que influenciam preço
- ${cidade ? `Valores calibrados para ${cidade.regiao}` : "Valores médios Brasil"}
- Mencione tendência de preços (subindo, estável, etc.)
`,

  comoAbrir: (cidade?: { nome: string; uf: string }) => `
FOCO ESPECIAL PARA "COMO ABRIR":
- Inclua estimativa de ROI/payback
- Mencione sazonalidade do negócio na região
- Liste 3 erros mais comuns de quem está começando
- ${cidade ? `Requisitos específicos de ${cidade.nome}/${cidade.uf}` : "Visão geral Brasil"}
- Dica de diferenciação da concorrência
`,

  licencaAmbiental: (cidade?: { nome: string; uf: string }) => `
FOCO ESPECIAL PARA LICENÇA AMBIENTAL:
- Órgão responsável ${cidade ? `em ${cidade.uf}` : "por estado"}
- Prazo médio real de obtenção
- Custo estimado com taxas e projeto
- Documentação completa necessária
- Multa média por funcionamento irregular
`,

  fidelizacao: () => `
FOCO ESPECIAL PARA FIDELIZAÇÃO:
- Taxa de retenção média do setor
- Custo de aquisição vs retenção
- Estratégia de WhatsApp que funciona
- Programa de pontos com números reais
- Métricas de sucesso para acompanhar
`,

  equipamentos: () => `
FOCO ESPECIAL PARA EQUIPAMENTOS:
- Marcas com melhor custo-benefício atual
- Vida útil média de cada equipamento
- Custo de manutenção anual estimado
- O que NÃO comprar (erros comuns)
- Ordem de prioridade de compra
`
};

/**
 * Gera variações semânticas para evitar repetição de keywords
 */
export function gerarVariacoesSEO(termoPrincipal: string): string[] {
  const variacoes: Record<string, string[]> = {
    "lava jato": ["lava rápido", "lavagem automotiva", "centro de lavagem", "estética veicular"],
    "sistema": ["software", "plataforma", "ferramenta", "aplicativo", "solução"],
    "gestão": ["controle", "gerenciamento", "administração", "organização"],
    "preço": ["valor", "custo", "investimento", "tabela", "quanto custa"],
    "abrir": ["montar", "inaugurar", "começar", "iniciar", "criar"],
    "cliente": ["consumidor", "motorista", "dono de veículo", "público"],
    "fidelizar": ["reter", "manter", "fidelidade", "recorrência", "volta"]
  };

  for (const [termo, lista] of Object.entries(variacoes)) {
    if (termoPrincipal.toLowerCase().includes(termo)) {
      return lista;
    }
  }

  return [termoPrincipal];
}

/**
 * Gera contexto local para personalização
 */
export function gerarContextoLocal(cidade: {
  nome: string;
  uf: string;
  regiao: string;
  populacao: number;
}): string {
  const contextos: Record<string, string> = {
    "Sudeste": `No Sudeste, a concorrência é acirrada com redes de franquias. O diferencial está em personalização e tecnologia. ${cidade.nome} tem perfil de cliente exigente que valoriza conveniência.`,
    "Sul": `O Sul tem cultura de cuidado com veículos acima da média nacional. Clientes em ${cidade.nome} buscam qualidade premium e aceitam pagar mais por serviço diferenciado.`,
    "Nordeste": `O Nordeste é o mercado que mais cresce em volume de veículos. ${cidade.nome} tem demanda frequente por lavagem devido ao clima. Preços são mais sensíveis.`,
    "Centro-Oeste": `O Centro-Oeste tem perfil de frotas (agronegócio) e veículos maiores. ${cidade.nome} demanda estrutura para pickups e SUVs, com lavagem de barro intenso.`,
    "Norte": `O Norte tem desafios logísticos mas demanda crescente. ${cidade.nome} precisa de soluções que funcionem em conexões mais lentas e com equipes menores.`
  };

  return contextos[cidade.regiao] || contextos["Sudeste"];
}

