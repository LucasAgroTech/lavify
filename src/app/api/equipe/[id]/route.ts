import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword, hasPermission } from "@/lib/auth";

// GET - Buscar membro específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const usuario = await prisma.usuario.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        ativo: true,
        createdAt: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar membro
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Apenas ADMIN pode editar membros
    if (!hasPermission(session.role, ["ADMIN"])) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { nome, email, telefone, senha, role, ativo } = body;

    // Verificar se usuário existe e pertence ao mesmo lavaJato
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!usuarioExistente) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Não permitir editar a si mesmo para evitar perda de acesso
    if (id === session.userId && (role || ativo === false)) {
      return NextResponse.json(
        { error: "Você não pode alterar seu próprio cargo ou desativar sua conta" },
        { status: 400 }
      );
    }

    // Validar role se fornecido
    if (role) {
      const rolesPermitidos = ["GERENTE", "ATENDENTE", "LAVADOR_SENIOR", "LAVADOR_JUNIOR"];
      // Não permitir criar outro ADMIN
      if (role === "ADMIN") {
        return NextResponse.json(
          { error: "Não é possível atribuir cargo de Admin" },
          { status: 400 }
        );
      }
      if (!rolesPermitidos.includes(role)) {
        return NextResponse.json(
          { error: "Cargo inválido" },
          { status: 400 }
        );
      }
    }

    // Se mudar email, verificar duplicidade
    if (email && email !== usuarioExistente.email) {
      const emailExiste = await prisma.usuario.findUnique({
        where: { email },
      });
      if (emailExiste) {
        return NextResponse.json(
          { error: "Este email já está em uso" },
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao: Record<string, unknown> = {};
    if (nome) dadosAtualizacao.nome = nome;
    if (email) dadosAtualizacao.email = email;
    if (telefone !== undefined) dadosAtualizacao.telefone = telefone;
    if (role) dadosAtualizacao.role = role;
    if (ativo !== undefined) dadosAtualizacao.ativo = ativo;
    if (senha) dadosAtualizacao.senha = await hashPassword(senha);

    const usuario = await prisma.usuario.update({
      where: { id },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        ativo: true,
        createdAt: true,
      },
    });

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

// DELETE - Remover membro (soft delete via ativo = false, ou hard delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Apenas ADMIN pode remover membros
    if (!hasPermission(session.role, ["ADMIN"])) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const { id } = await params;

    // Não permitir deletar a si mesmo
    if (id === session.userId) {
      return NextResponse.json(
        { error: "Você não pode remover sua própria conta" },
        { status: 400 }
      );
    }

    // Verificar se usuário existe e pertence ao mesmo lavaJato
    const usuario = await prisma.usuario.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Não permitir deletar outro ADMIN
    if (usuario.role === "ADMIN") {
      return NextResponse.json(
        { error: "Não é possível remover um administrador" },
        { status: 400 }
      );
    }

    // Deletar sessões do usuário
    await prisma.sessao.deleteMany({
      where: { usuarioId: id },
    });

    // Deletar usuário
    await prisma.usuario.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
    return NextResponse.json(
      { error: "Erro ao remover usuário" },
      { status: 500 }
    );
  }
}

