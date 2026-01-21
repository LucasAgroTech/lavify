import { NextRequest, NextResponse } from "next/server";
import { getCidadeBySlug, CidadeSEO } from "@/lib/seo-cities";
import { getServicoBySlug, ServicoSEO } from "@/lib/seo-services";
import { getOpenAIClient, hasOpenAIKey } from "@/lib/openai";

export interface ConteudoServicoSEO {
  titulo: string;
  subtitulo: string;
  descricaoMeta: string;
  introducao: string;
  secoes: {
    titulo: string;
    conteudo: string;
  }[];
  beneficios: string[];
  servicos: {
    nome: string;
    descricao: string;
    precoMedio?: string;
  }[];
  faq: {
    pergunta: string;
    resposta: string;
  }[];
  dadosMercado: {
    mediaPreco?: string;
    tempoMedioServico?: string;
    demandaMensal?: string;
  };
  ctaTexto: string;
}

export async function POST(request: NextRequest) {
  try {
    const { servicoSlug, cidadeSlug } = await request.json();
    
    const servico = getServicoBySlug(servicoSlug);
    const cidade = getCidadeBySlug(cidadeSlug);
    
    if (!servico) {
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
    }
    
    if (!cidade) {
      return NextResponse.json({ error: "Cidade não encontrada" }, { status: 404 });
    }

    const conteudo = await gerarConteudoServico(servico, cidade);
    
    return NextResponse.json(conteudo);
  } catch (error) {
    console.error("Erro ao gerar conteúdo SEO de serviço:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

async function gerarConteudoServico(servico: ServicoSEO, cidade: CidadeSEO): Promise<ConteudoServicoSEO> {
  if (!hasOpenAIKey()) {
    return gerarConteudoFallback(servico, cidade);
  }
  const openai = getOpenAIClient();

  const prompt = `Você é um especialista em SEO e no mercado de estética automotiva brasileiro. Gere conteúdo REAL e VERIFICÁVEL para uma landing page.

SERVIÇO: ${servico.nomeCompleto}
DESCRIÇÃO: ${servico.descricao}
CIDADE: ${cidade.nome}, ${cidade.estado} (${cidade.uf})
REGIÃO: ${cidade.regiao}
POPULAÇÃO: ~${(cidade.populacao / 1000000).toFixed(1)} milhões

IMPORTANTE: Use dados REAIS do mercado brasileiro de ${servico.nome} em ${cidade.nome}. Se não souber valores exatos, use médias regionais verificáveis.

Retorne um JSON com:
{
  "titulo": "H1 otimizado (máx 60 chars) - incluir serviço e cidade",
  "subtitulo": "Subtítulo persuasivo (máx 120 chars)",
  "descricaoMeta": "Meta description (máx 155 chars) com CTA",
  "introducao": "2-3 frases sobre o mercado de ${servico.nome} em ${cidade.nome}",
  "secoes": [
    {"titulo": "H2 sobre mercado local", "conteudo": "2 parágrafos com dados reais"},
    {"titulo": "H2 sobre benefícios do sistema", "conteudo": "2 parágrafos"},
    {"titulo": "H2 por que escolher Lavify", "conteudo": "2 parágrafos"}
  ],
  "beneficios": ["6 benefícios específicos para ${servico.nome}"],
  "servicos": [
    {"nome": "Serviço 1", "descricao": "descrição breve", "precoMedio": "R$ XX - R$ YY"},
    {"nome": "Serviço 2", "descricao": "descrição breve", "precoMedio": "R$ XX - R$ YY"},
    {"nome": "Serviço 3", "descricao": "descrição breve", "precoMedio": "R$ XX - R$ YY"},
    {"nome": "Serviço 4", "descricao": "descrição breve", "precoMedio": "R$ XX - R$ YY"}
  ],
  "faq": [
    {"pergunta": "Pergunta 1 sobre ${servico.nome} em ${cidade.nome}", "resposta": "Resposta completa"},
    {"pergunta": "Pergunta 2", "resposta": "Resposta completa"},
    {"pergunta": "Pergunta 3", "resposta": "Resposta completa"},
    {"pergunta": "Pergunta 4", "resposta": "Resposta completa"}
  ],
  "dadosMercado": {
    "mediaPreco": "Faixa de preço real do mercado local",
    "tempoMedioServico": "Tempo médio real",
    "demandaMensal": "Estimativa baseada na população"
  },
  "ctaTexto": "Texto CTA persuasivo"
}

REGRAS:
1. Use português brasileiro natural
2. Dados de preços devem ser REALISTAS para ${cidade.regiao}
3. Mencione a cidade naturalmente (sem keyword stuffing)
4. Foque em como o Lavify ajuda empresas de ${servico.nome}
5. Inclua termos semânticos relevantes
6. O conteúdo deve ser ÚNICO e específico

Responda APENAS com JSON válido.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em estética automotiva e SEO brasileiro. Use dados reais do mercado. Responda em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const cleanJson = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    return JSON.parse(cleanJson) as ConteudoServicoSEO;
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    return gerarConteudoFallback(servico, cidade);
  }
}

function gerarConteudoFallback(servico: ServicoSEO, cidade: CidadeSEO): ConteudoServicoSEO {
  const precosRegiao: Record<string, { min: number; max: number }> = {
    "Sudeste": { min: 80, max: 250 },
    "Sul": { min: 70, max: 220 },
    "Nordeste": { min: 50, max: 180 },
    "Centro-Oeste": { min: 60, max: 200 },
    "Norte": { min: 55, max: 190 }
  };
  
  const precos = precosRegiao[cidade.regiao] || { min: 60, max: 200 };
  
  return {
    titulo: `${servico.nomeCompleto} em ${cidade.nome}`,
    subtitulo: `Gerencie seu negócio de ${servico.nome.toLowerCase()} em ${cidade.nome} de forma profissional`,
    descricaoMeta: `${servico.nomeCompleto} em ${cidade.nome}, ${cidade.uf}. Controle agendamentos, clientes e financeiro. Teste grátis!`,
    introducao: `O mercado de ${servico.nome.toLowerCase()} em ${cidade.nome} está em crescimento constante. Com uma frota estimada de ${Math.floor(cidade.populacao / 5).toLocaleString('pt-BR')} veículos na cidade, a demanda por serviços de qualidade é alta. O Lavify ajuda você a profissionalizar sua operação e se destacar da concorrência.`,
    secoes: [
      {
        titulo: `Mercado de ${servico.nome} em ${cidade.nome}`,
        conteudo: `${cidade.nome} é uma das principais cidades do ${cidade.regiao} brasileiro, com população de aproximadamente ${(cidade.populacao / 1000000).toFixed(1)} milhões de habitantes. O setor de ${servico.nome.toLowerCase()} local acompanha o crescimento da frota de veículos e a busca por serviços premium.\n\nEmpreendedores que investem em tecnologia e atendimento de qualidade conseguem se destacar e fidelizar clientes exigentes que valorizam um bom serviço.`
      },
      {
        titulo: "Como o Lavify Transforma seu Negócio",
        conteudo: `Com o Lavify, você controla toda a operação do seu negócio de ${servico.nome.toLowerCase()} pelo celular. Agendamentos online, controle de serviços em andamento, notificações automáticas para clientes e relatórios financeiros completos.\n\nO sistema foi desenvolvido especificamente para o mercado brasileiro, com todas as funcionalidades que você precisa para profissionalizar e escalar seu negócio.`
      },
      {
        titulo: `Por que Escolher o Lavify para ${servico.nome}`,
        conteudo: `O Lavify é o sistema mais completo para ${servico.nome.toLowerCase()} no Brasil. Além das funcionalidades de gestão, você ganha uma página online para seu negócio, onde clientes podem agendar serviços 24 horas por dia.\n\nNosso suporte é 100% em português e entendemos as particularidades do mercado de estética automotiva brasileiro. Comece hoje mesmo com nosso plano gratuito.`
      }
    ],
    beneficios: [
      `Agenda online 24h para ${servico.nome.toLowerCase()}`,
      "WhatsApp automático quando serviço fica pronto",
      "Controle de serviços em andamento",
      "Relatórios financeiros detalhados",
      "Programa de fidelidade digital",
      "Cadastro completo de clientes e veículos"
    ],
    servicos: [
      { nome: "Serviço Básico", descricao: "Serviço padrão mais procurado", precoMedio: `R$ ${precos.min} - R$ ${Math.floor(precos.min * 1.5)}` },
      { nome: "Serviço Completo", descricao: "Pacote completo com todos os itens", precoMedio: `R$ ${Math.floor(precos.min * 1.5)} - R$ ${precos.max}` },
      { nome: "Serviço Premium", descricao: "Tratamento diferenciado de alta qualidade", precoMedio: `R$ ${precos.max} - R$ ${Math.floor(precos.max * 1.5)}` },
      { nome: "Manutenção", descricao: "Retoque e manutenção periódica", precoMedio: `R$ ${Math.floor(precos.min * 0.5)} - R$ ${precos.min}` }
    ],
    faq: [
      {
        pergunta: `O Lavify funciona para ${servico.nome.toLowerCase()} em ${cidade.nome}?`,
        resposta: `Sim! O Lavify é perfeito para negócios de ${servico.nome.toLowerCase()} em ${cidade.nome} e região. O sistema foi desenvolvido para atender as necessidades específicas do mercado de estética automotiva brasileiro.`
      },
      {
        pergunta: "Preciso de computador para usar o sistema?",
        resposta: "Não! O Lavify funciona 100% pelo celular. Você pode gerenciar todo o seu negócio de qualquer lugar, a qualquer momento."
      },
      {
        pergunta: "Como funciona o agendamento online?",
        resposta: "Você ganha uma página exclusiva onde seus clientes podem agendar serviços 24 horas por dia. O sistema organiza tudo automaticamente e envia confirmações pelo WhatsApp."
      },
      {
        pergunta: "Posso testar antes de pagar?",
        resposta: "Claro! Oferecemos um plano gratuito para você testar todas as funcionalidades. Não precisa cadastrar cartão de crédito."
      }
    ],
    dadosMercado: {
      mediaPreco: `R$ ${precos.min} - R$ ${precos.max}`,
      tempoMedioServico: "1h - 4h dependendo do serviço",
      demandaMensal: `Estimativa de ${Math.floor(cidade.populacao / 1000).toLocaleString('pt-BR')} serviços/mês na região`
    },
    ctaTexto: "Testar Grátis Agora"
  };
}

