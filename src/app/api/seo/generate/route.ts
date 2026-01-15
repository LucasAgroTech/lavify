import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getCidadeBySlug, CidadeSEO } from "@/lib/seo-cities";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ConteudoSEO {
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

export async function POST(request: NextRequest) {
  try {
    const { cidadeSlug } = await request.json();
    
    const cidade = getCidadeBySlug(cidadeSlug);
    if (!cidade) {
      return NextResponse.json({ error: "Cidade não encontrada" }, { status: 404 });
    }

    const conteudo = await gerarConteudoSEO(cidade);
    
    return NextResponse.json(conteudo);
  } catch (error) {
    console.error("Erro ao gerar conteúdo SEO:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

async function gerarConteudoSEO(cidade: CidadeSEO): Promise<ConteudoSEO> {
  const prompt = `Você é um especialista em SEO e copywriting para SaaS brasileiro. Gere conteúdo otimizado para SEO para uma landing page do Lavify - Sistema de Gestão para Lava Rápidos/Lava Jatos.

CIDADE: ${cidade.nome}, ${cidade.estado} (${cidade.uf})
REGIÃO: ${cidade.regiao}
POPULAÇÃO: ~${(cidade.populacao / 1000).toFixed(0)} mil habitantes

OBJETIVO: Ranquear para buscas como "sistema para lava rápido ${cidade.nome.toLowerCase()}", "software lava jato ${cidade.uf}", etc.

Retorne um JSON com a seguinte estrutura:
{
  "titulo": "H1 otimizado (máx 60 caracteres) - incluir cidade",
  "subtitulo": "Subtítulo persuasivo (máx 120 caracteres)",
  "descricaoMeta": "Meta description otimizada (máx 155 caracteres) com call-to-action",
  "introducao": "Parágrafo introdutório de 2-3 frases focado na dor do dono de lava jato na cidade",
  "secoes": [
    {
      "titulo": "Título da seção H2",
      "conteudo": "Conteúdo de 2-3 parágrafos otimizado"
    }
  ],
  "beneficios": ["Benefício 1", "Benefício 2", "Benefício 3", "Benefício 4", "Benefício 5", "Benefício 6"],
  "faq": [
    {
      "pergunta": "Pergunta frequente sobre sistema para lava jato em ${cidade.nome}",
      "resposta": "Resposta completa e útil"
    }
  ],
  "ctaTexto": "Texto do botão de CTA persuasivo"
}

REGRAS:
1. Use português brasileiro natural e persuasivo
2. Mencione a cidade naturalmente no conteúdo (sem keyword stuffing)
3. Foque nos benefícios: controle de pátio, agendamento online, WhatsApp automático, financeiro integrado
4. Inclua termos semânticos: gestão, controle, organização, automação, produtividade
5. Tom: profissional mas acessível para donos de lava jatos
6. Inclua 3 seções diferentes sobre: (1) Desafios de gestão na cidade, (2) Funcionalidades do sistema, (3) Por que escolher o Lavify
7. Inclua 4 FAQs relevantes para a região
8. O conteúdo deve ser ÚNICO e não genérico

Responda APENAS com o JSON válido, sem markdown ou explicações.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em gerar conteúdo SEO em português brasileiro. Responda sempre em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    
    // Limpar possíveis caracteres extras
    const cleanJson = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    return JSON.parse(cleanJson) as ConteudoSEO;
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    
    // Fallback com conteúdo template
    return gerarConteudoFallback(cidade);
  }
}

function gerarConteudoFallback(cidade: CidadeSEO): ConteudoSEO {
  return {
    titulo: `Sistema para Lava Rápido em ${cidade.nome}`,
    subtitulo: `Gerencie seu lava jato em ${cidade.nome} de forma simples e profissional`,
    descricaoMeta: `Sistema completo para lava rápido em ${cidade.nome}, ${cidade.uf}. Controle pátio, agendamentos, estoque e financeiro. Teste grátis!`,
    introducao: `Se você tem um lava rápido em ${cidade.nome}, sabe como é desafiador manter tudo organizado. Clientes aguardando, carros no pátio, equipe para coordenar e as contas para fechar no final do mês. O Lavify foi criado para resolver exatamente esses problemas.`,
    secoes: [
      {
        titulo: `Desafios de Gestão de Lava Jato em ${cidade.nome}`,
        conteudo: `${cidade.nome} é uma cidade com grande frota de veículos e, consequentemente, uma demanda crescente por serviços de lava rápido. Porém, muitos empreendedores do setor ainda enfrentam dificuldades com controle manual, perda de clientes por falta de organização e problemas no fluxo de caixa.\n\nA boa notícia é que a tecnologia pode transformar completamente a forma como você gerencia seu negócio. Com um sistema especializado, você ganha tempo, reduz erros e oferece uma experiência muito melhor para seus clientes.`
      },
      {
        titulo: "Funcionalidades que Fazem a Diferença",
        conteudo: `O Lavify oferece tudo que você precisa para profissionalizar seu lava jato: Kanban visual para acompanhar cada carro no pátio, agendamento online que funciona 24 horas, envio automático de mensagens no WhatsApp quando o serviço fica pronto, controle de estoque inteligente e relatórios financeiros completos.\n\nTudo isso acessível do seu celular, de qualquer lugar. Você não precisa mais ficar preso ao estabelecimento para saber o que está acontecendo.`
      },
      {
        titulo: `Por que Lava Jatos em ${cidade.nome} Escolhem o Lavify`,
        conteudo: `Lava rápidos em ${cidade.nome} e região já descobriram como o Lavify pode transformar suas operações. O sistema é intuitivo, não precisa de treinamento complexo e começa a dar resultados desde o primeiro dia.\n\nAlém disso, oferecemos suporte em português, preços acessíveis para todos os tamanhos de negócio e uma equipe que entende as particularidades do mercado brasileiro de estética automotiva.`
      }
    ],
    beneficios: [
      "Controle visual do pátio em tempo real",
      "Agendamento online 24 horas",
      "Notificações automáticas no WhatsApp",
      "Gestão de estoque com alertas",
      "Relatórios financeiros completos",
      "Acesso pelo celular de qualquer lugar"
    ],
    faq: [
      {
        pergunta: `O Lavify funciona para lava jatos pequenos em ${cidade.nome}?`,
        resposta: `Sim! O Lavify foi pensado para atender desde lava rápidos com um funcionário até grandes operações com múltiplas equipes. Temos planos que cabem no bolso de qualquer empreendedor.`
      },
      {
        pergunta: "Preciso instalar algum programa no computador?",
        resposta: "Não! O Lavify funciona 100% online, direto no navegador ou no celular. Você só precisa de internet para acessar de qualquer lugar."
      },
      {
        pergunta: "Como funciona o período de teste gratuito?",
        resposta: "Você pode testar todas as funcionalidades do Lavify gratuitamente, sem precisar cadastrar cartão de crédito. É só criar sua conta e começar a usar."
      },
      {
        pergunta: `Posso migrar os dados do meu lava jato em ${cidade.nome} para o Lavify?`,
        resposta: "Sim! Nossa equipe pode ajudar você a importar sua base de clientes e configurar tudo certinho para começar com o pé direito."
      }
    ],
    ctaTexto: "Testar Grátis Agora"
  };
}

