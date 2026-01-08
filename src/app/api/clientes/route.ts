import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Lista clientes do lava jato logado
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const clientes = await prisma.cliente.findMany({
      where: { lavaJatoId: session.lavaJatoId },
      include: {
        veiculos: true,
        _count: {
          select: { ordens: true },
        },
      },
      orderBy: {
        nome: "asc",
      },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}

// POST - Cria cliente no lava jato logado
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, telefone, email, planoMensal } = body;

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        email,
        planoMensal: planoMensal || false,
        lavaJatoId: session.lavaJatoId,
      },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}
