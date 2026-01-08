import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Lista serviços do lava jato logado
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const servicos = await prisma.servico.findMany({
      where: {
        lavaJatoId: session.lavaJatoId,
        ativo: true,
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(servicos);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json(
      { error: "Erro ao buscar serviços" },
      { status: 500 }
    );
  }
}

// POST - Cria serviço no lava jato logado
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, descricao, preco, tempoEstimado, produtosConsumo } = body;

    const servico = await prisma.servico.create({
      data: {
        nome,
        descricao,
        preco,
        tempoEstimado,
        lavaJatoId: session.lavaJatoId,
        produtos: produtosConsumo
          ? {
              create: produtosConsumo.map(
                (p: { produtoId: string; quantidade: number }) => ({
                  produtoId: p.produtoId,
                  quantidade: p.quantidade,
                })
              ),
            }
          : undefined,
      },
      include: {
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });

    return NextResponse.json(servico, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao criar serviço" },
      { status: 500 }
    );
  }
}
