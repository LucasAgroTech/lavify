import { NextRequest, NextResponse } from "next/server";
import { cidadesBrasil, CidadeSEO } from "@/lib/seo-cities";
import * as fs from "fs";
import * as path from "path";

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

// Inicialização dinâmica do OpenAI
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const OpenAI = require("openai").default;
  return new OpenAI({ apiKey });
}

async function gerarConteudo(cidade: CidadeSEO): Promise<ConteudoSEO> {
  const openai = getOpenAIClient();
  if (!openai) throw new Error("OpenAI não configurado");

  const prompt = `Gere conteúdo SEO em JSON para landing page do Lavify (Sistema para Lava Rápido) na cidade: ${cidade.nome}, ${cidade.uf}.

Retorne APENAS JSON válido:
{
  "titulo": "Sistema para Lava Rápido em ${cidade.nome}",
  "subtitulo": "Frase persuasiva sobre gestão de lava jato",
  "descricaoMeta": "Meta description com CTA (max 155 chars)",
  "introducao": "Parágrafo sobre desafios de lava jatos na cidade",
  "secoes": [
    {"titulo": "Desafios em ${cidade.nome}", "conteudo": "2 parágrafos"},
    {"titulo": "Funcionalidades", "conteudo": "2 parágrafos"},
    {"titulo": "Por que Lavify", "conteudo": "2 parágrafos"}
  ],
  "beneficios": ["6 benefícios curtos"],
  "faq": [
    {"pergunta": "Pergunta 1", "resposta": "Resposta"},
    {"pergunta": "Pergunta 2", "resposta": "Resposta"},
    {"pergunta": "Pergunta 3", "resposta": "Resposta"},
    {"pergunta": "Pergunta 4", "resposta": "Resposta"}
  ],
  "ctaTexto": "Testar Grátis"
}

Use português brasileiro. Seja específico para ${cidade.nome}/${cidade.regiao}. Responda SÓ o JSON.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const text = completion.choices[0]?.message?.content || "";
  const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  
  try {
    return JSON.parse(clean);
  } catch {
    // Fallback se JSON inválido
    return gerarFallback(cidade);
  }
}

function gerarFallback(cidade: CidadeSEO): ConteudoSEO {
  return {
    titulo: `Sistema para Lava Rápido em ${cidade.nome}`,
    subtitulo: `Gerencie seu lava jato em ${cidade.nome} de forma simples e profissional`,
    descricaoMeta: `Sistema completo para lava rápido em ${cidade.nome}, ${cidade.uf}. Controle pátio, agendamentos e financeiro. Teste grátis!`,
    introducao: `Se você tem um lava rápido em ${cidade.nome}, sabe como é desafiador manter tudo organizado. O Lavify foi criado para resolver esses problemas.`,
    secoes: [
      {
        titulo: `Desafios de Gestão em ${cidade.nome}`,
        conteudo: `${cidade.nome} é uma cidade com grande frota de veículos e demanda crescente por serviços de lava rápido. A concorrência é alta e a organização faz a diferença.\n\nUm sistema especializado ajuda você a ganhar tempo, reduzir erros e oferecer uma experiência melhor para seus clientes.`
      },
      {
        titulo: "Funcionalidades que Transformam",
        conteudo: `O Lavify oferece: Kanban visual do pátio, agendamento online 24h, WhatsApp automático quando o serviço fica pronto, controle de estoque e relatórios financeiros.\n\nTudo acessível do celular, de qualquer lugar. Você não precisa estar no estabelecimento para saber o que está acontecendo.`
      },
      {
        titulo: `Por que Escolher o Lavify em ${cidade.nome}`,
        conteudo: `Lava rápidos na região ${cidade.regiao} já descobriram como o Lavify pode transformar suas operações. O sistema é intuitivo e dá resultados desde o primeiro dia.\n\nOferecemos suporte em português e preços acessíveis para todos os tamanhos de negócio.`
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
        resposta: `Sim! O Lavify atende desde lava rápidos com um funcionário até grandes operações. Temos planos para todos os tamanhos.`
      },
      {
        pergunta: "Preciso instalar algum programa?",
        resposta: "Não! O Lavify funciona 100% online, no navegador ou celular. Só precisa de internet."
      },
      {
        pergunta: "Como funciona o teste gratuito?",
        resposta: "Você testa todas as funcionalidades gratuitamente por 7 dias, sem cadastrar cartão."
      },
      {
        pergunta: "Posso migrar meus dados?",
        resposta: "Sim! Nossa equipe ajuda você a importar sua base de clientes e configurar tudo."
      }
    ],
    ctaTexto: "Testar Grátis Agora"
  };
}

// Armazenamento em memória (em produção, usar banco de dados ou arquivo)
let conteudosGerados: Record<string, ConteudoSEO> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cidade = searchParams.get("cidade");
  
  if (cidade) {
    return NextResponse.json(conteudosGerados[cidade] || null);
  }
  
  return NextResponse.json({
    total: Object.keys(conteudosGerados).length,
    cidades: Object.keys(conteudosGerados),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action, cidade: cidadeSlug } = await request.json();
    
    if (action === "generate-one" && cidadeSlug) {
      const cidade = cidadesBrasil.find(c => c.slug === cidadeSlug);
      if (!cidade) {
        return NextResponse.json({ error: "Cidade não encontrada" }, { status: 404 });
      }
      
      const conteudo = await gerarConteudo(cidade);
      conteudosGerados[cidadeSlug] = conteudo;
      
      return NextResponse.json({ success: true, cidade: cidadeSlug, conteudo });
    }
    
    if (action === "generate-all") {
      const results: { cidade: string; status: string }[] = [];
      
      for (const cidade of cidadesBrasil) {
        if (conteudosGerados[cidade.slug]) {
          results.push({ cidade: cidade.nome, status: "skip" });
          continue;
        }
        
        try {
          const conteudo = await gerarConteudo(cidade);
          conteudosGerados[cidade.slug] = conteudo;
          results.push({ cidade: cidade.nome, status: "ok" });
          
          // Delay para rate limit
          await new Promise(r => setTimeout(r, 500));
        } catch (error: any) {
          // Usar fallback em caso de erro
          conteudosGerados[cidade.slug] = gerarFallback(cidade);
          results.push({ cidade: cidade.nome, status: "fallback" });
        }
      }
      
      return NextResponse.json({
        success: true,
        total: Object.keys(conteudosGerados).length,
        results
      });
    }
    
    if (action === "export") {
      return NextResponse.json(conteudosGerados);
    }
    
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

