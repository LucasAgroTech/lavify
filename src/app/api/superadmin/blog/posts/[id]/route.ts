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

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Obter post específico
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const superAdmin = await verificarSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return NextResponse.json({ error: "Erro ao buscar post" }, { status: 500 });
  }
}

// PUT - Atualizar post
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const superAdmin = await verificarSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const postExistente = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!postExistente) {
      return NextResponse.json({ error: "Post não encontrado" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    // Campos atualizáveis
    if (body.titulo !== undefined) updateData.titulo = body.titulo;
    if (body.metaDescricao !== undefined) updateData.metaDescricao = body.metaDescricao;
    if (body.introducao !== undefined) updateData.introducao = body.introducao;
    if (body.secoes !== undefined) updateData.conteudo = JSON.stringify(body.secoes);
    if (body.conclusao !== undefined) updateData.conclusao = body.conclusao;
    if (body.palavrasChave !== undefined) updateData.palavrasChave = body.palavrasChave;
    if (body.categoria !== undefined) updateData.categoria = body.categoria;
    if (body.faq !== undefined) updateData.faq = JSON.stringify(body.faq);
    if (body.pillarPage !== undefined) updateData.pillarPage = body.pillarPage;
    if (body.artigosRelacionados !== undefined) updateData.artigosRelacionados = body.artigosRelacionados;

    // Atualizar status
    if (body.status !== undefined) {
      updateData.status = body.status;
      // Se publicando pela primeira vez
      if (body.status === "PUBLICADO" && postExistente.status !== "PUBLICADO") {
        updateData.publicadoEm = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      post,
      url: `/blog/${post.slug}`,
    });
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return NextResponse.json({ error: "Erro ao atualizar post" }, { status: 500 });
  }
}

// DELETE - Excluir post
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const superAdmin = await verificarSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir post:", error);
    return NextResponse.json({ error: "Erro ao excluir post" }, { status: 500 });
  }
}

