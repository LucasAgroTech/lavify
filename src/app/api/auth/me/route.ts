import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Retorna dados do usuário logado
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        lavaJato: {
          select: {
            id: true,
            nome: true,
            slug: true,
            logoUrl: true,
            corPrimaria: true,
            plano: true,
          },
        },
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
      { error: "Erro ao buscar dados" },
      { status: 500 }
    );
  }
}

