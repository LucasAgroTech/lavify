import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createClientSession } from "@/lib/auth-cliente";

// POST - Registrar novo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, senha, telefone } = body;

    // Verifica se email já existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (clienteExistente) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha);

    // Cria o cliente
    const cliente = await prisma.cliente.create({
      data: {
        email,
        senha: senhaHash,
        nome,
        telefone,
      },
    });

    // Cria a sessão
    await createClientSession(cliente.id);

    return NextResponse.json({
      success: true,
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Erro ao registrar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
