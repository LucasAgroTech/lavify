import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";
import bcrypt from "bcryptjs";

// GET - Listar todos os super admins
export async function GET() {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const admins = await prisma.superAdmin.findMany({
      select: {
        id: true,
        email: true,
        nome: true,
        ativo: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Erro ao listar super admins:", error);
    return NextResponse.json(
      { error: "Erro ao listar super admins" },
      { status: 500 }
    );
  }
}

// POST - Criar novo super admin
export async function POST(request: NextRequest) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { email, senha, nome } = await request.json();

    if (!email || !senha || !nome) {
      return NextResponse.json(
        { error: "Email, senha e nome são obrigatórios" },
        { status: 400 }
      );
    }

    if (senha.length < 8) {
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 8 caracteres" },
        { status: 400 }
      );
    }

    // Verifica se email já existe
    const existente = await prisma.superAdmin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const novoAdmin = await prisma.superAdmin.create({
      data: {
        email: email.toLowerCase(),
        senha: senhaHash,
        nome,
      },
      select: {
        id: true,
        email: true,
        nome: true,
        ativo: true,
        createdAt: true,
      },
    });

    return NextResponse.json(novoAdmin, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar super admin:", error);
    return NextResponse.json(
      { error: "Erro ao criar super admin" },
      { status: 500 }
    );
  }
}

