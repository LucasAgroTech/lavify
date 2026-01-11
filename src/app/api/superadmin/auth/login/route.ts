import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSuperAdminSession } from "@/lib/superAdminAuth";

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca super admin
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!superAdmin) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    if (!superAdmin.ativo) {
      return NextResponse.json(
        { error: "Conta desativada" },
        { status: 401 }
      );
    }

    // Verifica senha
    const senhaCorreta = await verifyPassword(senha, superAdmin.senha);
    if (!senhaCorreta) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Cria sessão
    await createSuperAdminSession(superAdmin.id, superAdmin.email);

    return NextResponse.json({
      success: true,
      superAdmin: {
        id: superAdmin.id,
        nome: superAdmin.nome,
        email: superAdmin.email,
      },
    });
  } catch (error) {
    console.error("Erro no login super admin:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

