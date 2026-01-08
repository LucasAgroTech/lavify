import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Detalhes de um lava jato específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const lavaJato = await prisma.lavaJato.findUnique({
      where: { slug, ativo: true },
      select: {
        id: true,
        nome: true,
        slug: true,
        telefone: true,
        endereco: true,
        logoUrl: true,
        corPrimaria: true,
        // Todos os serviços ativos
        servicos: {
          where: { ativo: true },
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            tempoEstimado: true,
          },
          orderBy: { nome: "asc" },
        },
      },
    });

    if (!lavaJato) {
      return NextResponse.json(
        { error: "Lava jato não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(lavaJato);
  } catch (error) {
    console.error("Erro ao buscar lava jato:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lava jato" },
      { status: 500 }
    );
  }
}
