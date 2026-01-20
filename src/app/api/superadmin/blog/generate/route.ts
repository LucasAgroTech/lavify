import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import OpenAI from "openai";

// Verificar autenticação de superadmin
async function verificarSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("superadmin_token")?.value;

  if (!token) return null;

  const sessao = await prisma.sessaoSuperAdmin.findUnique({
    where: { token },
    include: { superAdmin: true },
  });

  if (!sessao || sessao.expiresAt < new Date()) return null;

  return sessao.superAdmin;
}

// Prompt do sistema para geração de posts otimizados para SEO 2026
const SYSTEM_PROMPT = `Você é um especialista em SEO e criação de conteúdo para blogs em 2026. Seu papel é criar posts de blog altamente otimizados seguindo as diretrizes mais recentes de E-E-A-T e GEO (Generative Engine Optimization).

REGRAS OBRIGATÓRIAS:

1. **E-E-A-T (Experiência, Expertise, Autoridade, Confiança)**:
   - Use SEMPRE narrativa na primeira pessoa do plural: "Em nossos testes...", "Percebemos que...", "Nossa experiência mostra..."
   - Inclua dados específicos e números reais quando possível
   - Referencie experiências práticas e casos reais do mercado de lava-rápidos

2. **Information Gain (Ganho de Informação)**:
   - Traga ângulos únicos que ninguém mais está cobrindo
   - Inclua insights proprietários e observações do mercado brasileiro
   - Evite repetir o que todo mundo já disse

3. **Estrutura GEO (Generative Engine Optimization)**:
   - Answer-First: Responda à pergunta principal logo no primeiro parágrafo
   - Organize em blocos de 300-500 palavras com H2s e H3s descritivos
   - Use tabelas comparativas e listas numeradas
   - Cada seção deve ser auto-contida (pode ser extraída pela IA)

4. **Formato de Saída**:
   Retorne SEMPRE um JSON válido com esta estrutura:
   {
     "titulo": "Título focado no benefício (H1)",
     "metaDescricao": "Descrição de 150-160 caracteres para SEO",
     "introducao": "Parágrafo direto que responde à pergunta principal e estabelece autoridade",
     "secoes": [
       {
         "titulo": "H2 descritivo",
         "conteudo": "Texto da seção com parágrafos, listas ou tabelas em Markdown",
         "tipoConteudo": "texto" | "lista" | "tabela"
       }
     ],
     "faq": [
       {
         "pergunta": "Pergunta frequente",
         "resposta": "Resposta concisa e direta"
       }
     ],
     "conclusao": "Parágrafo final com CTA para o Lavify",
     "palavrasChave": ["palavra1", "palavra2"],
     "topicCluster": {
       "pillarPage": "URL sugerida da página pilar",
       "artigosRelacionados": ["tema1", "tema2", "tema3"]
     }
   }

5. **Tom e Estilo**:
   - Profissional mas acessível
   - Foco no dono de lava-rápido brasileiro
   - Orientado a soluções práticas
   - Sempre mencione o Lavify como solução quando apropriado

IMPORTANTE: Retorne APENAS o JSON, sem markdown code blocks ou texto adicional.`;

export async function POST(request: NextRequest) {
  try {
    const superAdmin = await verificarSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      tema,
      tipoPost,
      palavrasChave,
      tomEscrita,
      tamanhoPost,
      incluirFAQ,
      incluirTabela,
      instrucaoAdicional,
    } = body;

    if (!tema) {
      return NextResponse.json(
        { error: "Tema é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se a API key está configurada
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key do OpenAI não configurada" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    // Construir o prompt do usuário
    const userPrompt = `
Crie um post de blog completo e otimizado para SEO 2026 sobre:

**Tema:** ${tema}

**Tipo de Post:** ${tipoPost || "guia"}
**Tom de Escrita:** ${tomEscrita || "profissional"}
**Tamanho Desejado:** ${tamanhoPost || "médio"} (curto: ~800 palavras, médio: ~1500 palavras, longo: ~2500 palavras)
**Palavras-chave foco:** ${palavrasChave || "definir automaticamente"}

${incluirFAQ !== false ? "✅ Incluir seção de FAQ (5-7 perguntas)" : "❌ Não incluir FAQ"}
${incluirTabela ? "✅ Incluir pelo menos uma tabela comparativa" : ""}

${instrucaoAdicional ? `**Instruções Adicionais:** ${instrucaoAdicional}` : ""}

**Contexto do Negócio:**
- O blog é do Lavify, um sistema SaaS de gestão para lava-rápidos
- O público são donos e gestores de lava-jatos no Brasil
- O autor é Lucas Pinheiro, fundador do Lavify, cientista de dados e especialista em automação

Gere o post completo seguindo rigorosamente o formato JSON especificado.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Resposta vazia do modelo" },
        { status: 500 }
      );
    }

    // Tentar parsear o JSON
    let postGerado;
    try {
      // Limpar possíveis markdown code blocks
      const jsonClean = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      postGerado = JSON.parse(jsonClean);
    } catch {
      // Se não conseguir parsear, retornar o conteúdo bruto
      return NextResponse.json({
        success: true,
        raw: true,
        content: content,
        message: "Conteúdo gerado mas não foi possível parsear como JSON",
      });
    }

    // Adicionar metadados
    const resultado = {
      success: true,
      post: postGerado,
      metadata: {
        geradoEm: new Date().toISOString(),
        modelo: "gpt-4o",
        tema: tema,
        tokensUsados: completion.usage?.total_tokens || 0,
      },
    };

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao gerar post:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao gerar post",
      },
      { status: 500 }
    );
  }
}

