import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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

// Função para gerar slug a partir do título
function gerarSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove hífens duplicados
    .slice(0, 80); // Limita tamanho
}

// GET - Listar todos os posts
export async function GET(request: NextRequest) {
  try {
    const superAdmin = await verificarSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const categoria = searchParams.get("categoria");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (categoria) where.categoria = categoria;

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Erro ao listar posts:", error);
    return NextResponse.json(
      { error: "Erro ao listar posts" },
      { status: 500 }
    );
  }
}

// POST - Criar novo post
export async function POST(request: NextRequest) {
  try {
    const superAdmin = await verificarSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const {
      titulo,
      metaDescricao,
      introducao,
      secoes,
      conclusao,
      palavrasChave,
      categoria,
      faq,
      pillarPage,
      artigosRelacionados,
      status,
      modeloIA,
      tokensUsados,
    } = body;

    if (!titulo) {
      return NextResponse.json(
        { error: "O título é obrigatório" },
        { status: 400 }
      );
    }

    // Gerar slug único
    let slug = gerarSlug(titulo);
    const existente = await prisma.blogPost.findUnique({ where: { slug } });
    if (existente) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        slug,
        titulo,
        metaDescricao: metaDescricao || titulo,
        introducao: introducao || "",
        conteudo: secoes ? JSON.stringify(secoes) : "[]",
        conclusao: conclusao || "",
        palavrasChave: palavrasChave || [],
        categoria: categoria || "guia",
        faq: faq && faq.length > 0 ? JSON.stringify(faq) : null,
        pillarPage,
        artigosRelacionados: artigosRelacionados || [],
        status: status === "PUBLICADO" ? "PUBLICADO" : "RASCUNHO",
        publicadoEm: status === "PUBLICADO" ? new Date() : null,
        geradoPorIA: false, // Redação manual
        modeloIA: modeloIA || null,
        tokensUsados: tokensUsados || null,
      },
    });

    return NextResponse.json({
      success: true,
      post,
      url: `/blog/${post.slug}`,
    });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 });
  }
}

