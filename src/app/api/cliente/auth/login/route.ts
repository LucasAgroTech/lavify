import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createClientSession } from "@/lib/auth-cliente";

// POST - Login de cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    // Busca cliente
    const cliente = await prisma.usuarioCliente.findUnique({
      where: { email },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    if (!cliente.ativo) {
      return NextResponse.json(
        { error: "Conta desativada" },
        { status: 401 }
      );
    }

    // Verifica senha
    const senhaValida = await verifyPassword(senha, cliente.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Cria sessão
    await createClientSession(cliente.id);

    return NextResponse.json({
      success: true,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      },
    });

  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}

