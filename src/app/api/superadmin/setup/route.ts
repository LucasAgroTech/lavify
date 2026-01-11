import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST - Criar primeiro Super Admin (apenas se não existir nenhum)
export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe algum super admin
    const existente = await prisma.superAdmin.count();

    if (existente > 0) {
      return NextResponse.json(
        { error: "Setup já realizado. Use o login normal." },
        { status: 403 }
      );
    }

    const { email, senha, nome, setupKey } = await request.json();

    // Chave secreta para setup (definir em variável de ambiente)
    const SETUP_KEY = process.env.SUPER_ADMIN_SETUP_KEY || "lavify-super-admin-setup-2024";

    if (setupKey !== SETUP_KEY) {
      return NextResponse.json(
        { error: "Chave de setup inválida" },
        { status: 401 }
      );
    }

    if (!email || !senha || !nome) {
      return NextResponse.json(
        { error: "Email, senha e nome são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar senha forte
    if (senha.length < 8) {
      return NextResponse.json(
        { error: "Senha deve ter no mínimo 8 caracteres" },
        { status: 400 }
      );
    }

    // Criar super admin
    const senhaHash = await bcrypt.hash(senha, 12);

    const superAdmin = await prisma.superAdmin.create({
      data: {
        email: email.toLowerCase(),
        senha: senhaHash,
        nome,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Super Admin criado com sucesso!",
      superAdmin: {
        id: superAdmin.id,
        email: superAdmin.email,
        nome: superAdmin.nome,
      },
    });
  } catch (error) {
    console.error("Erro no setup:", error);
    return NextResponse.json(
      { error: "Erro ao criar Super Admin" },
      { status: 500 }
    );
  }
}

// GET - Verificar se setup é necessário
export async function GET() {
  try {
    const count = await prisma.superAdmin.count();

    return NextResponse.json({
      setupNecessario: count === 0,
      mensagem: count === 0
        ? "Nenhum Super Admin encontrado. Configure o primeiro."
        : "Setup já realizado.",
    });
  } catch (error) {
    console.error("Erro ao verificar setup:", error);
    return NextResponse.json(
      { error: "Erro ao verificar" },
      { status: 500 }
    );
  }
}

