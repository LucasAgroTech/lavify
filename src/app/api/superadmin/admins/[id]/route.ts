import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";
import bcrypt from "bcryptjs";

// PATCH - Atualizar super admin
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const admin = await prisma.superAdmin.findUnique({
      where: { id },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Super Admin não encontrado" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.nome !== undefined) {
      updateData.nome = body.nome;
    }

    if (body.email !== undefined) {
      // Verifica se email já existe em outro admin
      const existente = await prisma.superAdmin.findFirst({
        where: {
          email: body.email.toLowerCase(),
          NOT: { id },
        },
      });

      if (existente) {
        return NextResponse.json(
          { error: "Este email já está em uso" },
          { status: 400 }
        );
      }

      updateData.email = body.email.toLowerCase();
    }

    if (body.senha !== undefined && body.senha.length > 0) {
      if (body.senha.length < 8) {
        return NextResponse.json(
          { error: "Senha deve ter no mínimo 8 caracteres" },
          { status: 400 }
        );
      }
      updateData.senha = await bcrypt.hash(body.senha, 12);
    }

    if (body.ativo !== undefined) {
      // Não permite desativar a si mesmo
      if (id === session.superAdminId && body.ativo === false) {
        return NextResponse.json(
          { error: "Você não pode desativar sua própria conta" },
          { status: 400 }
        );
      }
      updateData.ativo = body.ativo;
    }

    const updated = await prisma.superAdmin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        nome: true,
        ativo: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar super admin:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar super admin" },
      { status: 500 }
    );
  }
}

// DELETE - Remover super admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Não permite deletar a si mesmo
    if (id === session.superAdminId) {
      return NextResponse.json(
        { error: "Você não pode excluir sua própria conta" },
        { status: 400 }
      );
    }

    const admin = await prisma.superAdmin.findUnique({
      where: { id },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Super Admin não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se é o último admin ativo
    const countAtivos = await prisma.superAdmin.count({
      where: { ativo: true },
    });

    if (countAtivos <= 1 && admin.ativo) {
      return NextResponse.json(
        { error: "Não é possível excluir o último Super Admin ativo" },
        { status: 400 }
      );
    }

    // Deleta sessões do admin
    await prisma.sessaoSuperAdmin.deleteMany({
      where: { superAdminId: id },
    });

    // Deleta o admin
    await prisma.superAdmin.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir super admin:", error);
    return NextResponse.json(
      { error: "Erro ao excluir super admin" },
      { status: 500 }
    );
  }
}

