import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Lista produtos do lava jato logado
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const estoqueBaixo = searchParams.get("estoqueBaixo");

    const produtos = await prisma.produto.findMany({
      where: {
        lavaJatoId: session.lavaJatoId,
        ativo: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    // Adiciona flag de estoque baixo
    const produtosComStatus = produtos.map((p) => ({
      ...p,
      estoqueBaixo: p.quantidade <= p.pontoReposicao,
    }));

    if (estoqueBaixo === "true") {
      return NextResponse.json(produtosComStatus.filter((p) => p.estoqueBaixo));
    }

    return NextResponse.json(produtosComStatus);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

// POST - Cria produto no lava jato logado
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, descricao, quantidade, unidade, custoPorUnidade, pontoReposicao } = body;

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        quantidade,
        unidade,
        custoPorUnidade,
        pontoReposicao,
        lavaJatoId: session.lavaJatoId,
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
