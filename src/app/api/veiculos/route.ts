import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Lista veículos do lava jato logado
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("clienteId");

    const veiculos = await prisma.veiculo.findMany({
      where: {
        lavaJatoId: session.lavaJatoId,
        ...(clienteId && { clienteId }),
      },
      include: {
        cliente: true,
      },
      orderBy: {
        placa: "asc",
      },
    });

    return NextResponse.json(veiculos);
  } catch (error) {
    console.error("Erro ao buscar veículos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar veículos" },
      { status: 500 }
    );
  }
}

// POST - Cria veículo no lava jato logado
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { placa, modelo, cor, clienteId } = body;

    // Valida se o cliente pertence ao lava jato do usuário
    const cliente = await prisma.cliente.findFirst({
      where: {
        id: clienteId,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const veiculo = await prisma.veiculo.create({
      data: {
        placa: placa.toUpperCase(),
        modelo,
        cor,
        clienteId,
        lavaJatoId: session.lavaJatoId,
      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(veiculo, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar veículo:", error);
    return NextResponse.json(
      { error: "Erro ao criar veículo" },
      { status: 500 }
    );
  }
}
