import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

// POST - Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    // Busca usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        lavaJato: {
          select: {
            id: true,
            nome: true,
            ativo: true,
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Verifica se usuário está ativo
    if (!usuario.ativo) {
      return NextResponse.json(
        { error: "Usuário desativado. Entre em contato com o administrador." },
        { status: 401 }
      );
    }

    // Verifica se lava jato está ativo
    if (!usuario.lavaJato.ativo) {
      return NextResponse.json(
        { error: "Estabelecimento desativado. Entre em contato com o suporte." },
        { status: 401 }
      );
    }

    // Verifica senha
    const senhaValida = await verifyPassword(senha, usuario.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401 }
      );
    }

    // Cria sessão
    await createSession(usuario.id, usuario.lavaJatoId, usuario.role);

    return NextResponse.json({
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
      lavaJato: {
        id: usuario.lavaJato.id,
        nome: usuario.lavaJato.nome,
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

