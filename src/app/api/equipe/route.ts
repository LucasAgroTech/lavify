import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword, hasPermission } from "@/lib/auth";

// GET - Listar membros da equipe
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Apenas ADMIN e GERENTE podem ver a equipe
    if (!hasPermission(session.role, ["ADMIN", "GERENTE"])) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const usuarios = await prisma.usuario.findMany({
      where: { lavaJatoId: session.lavaJatoId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        ativo: true,
        createdAt: true,
      },
      orderBy: [
        { role: "asc" },
        { nome: "asc" },
      ],
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar equipe:", error);
    return NextResponse.json(
      { error: "Erro ao buscar equipe" },
      { status: 500 }
    );
  }
}

// POST - Adicionar novo membro à equipe
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Apenas ADMIN pode adicionar membros
    if (!hasPermission(session.role, ["ADMIN"])) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const body = await request.json();
    const { nome, email, telefone, senha, role } = body;

    // Validações
    if (!nome || !email || !senha || !role) {
      return NextResponse.json(
        { error: "Nome, email, senha e cargo são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar role permitido
    const rolesPermitidos = ["GERENTE", "ATENDENTE", "LAVADOR_SENIOR", "LAVADOR_JUNIOR"];
    if (!rolesPermitidos.includes(role)) {
      return NextResponse.json(
        { error: "Cargo inválido" },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Este email já está em uso" },
        { status: 400 }
      );
    }

    // Criar usuário
    const senhaHash = await hashPassword(senha);
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        telefone,
        senha: senhaHash,
        role,
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

    return NextResponse.json(usuario, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}

