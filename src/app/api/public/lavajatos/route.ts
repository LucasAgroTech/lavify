import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Lista lava jatos públicos (para clientes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get("busca");

    const lavajatos = await prisma.lavaJato.findMany({
      where: {
        ativo: true,
        ...(busca && {
          OR: [
            { nome: { contains: busca, mode: "insensitive" } },
            { endereco: { contains: busca, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        nome: true,
        slug: true,
        telefone: true,
        endereco: true,
        logoUrl: true,
        corPrimaria: true,
        // Alguns serviços
        servicos: {
          where: { ativo: true },
          select: {
            id: true,
            nome: true,
            preco: true,
            tempoEstimado: true,
          },
          take: 4,
        },
      },
      orderBy: { nome: "asc" },
    });

    return NextResponse.json(lavajatos);
  } catch (error) {
    console.error("Erro ao buscar lava jatos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lava jatos" },
      { status: 500 }
    );
  }
}
