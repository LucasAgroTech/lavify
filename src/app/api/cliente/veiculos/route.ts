import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientSession } from "@/lib/auth-cliente";

// GET - Lista veículos do cliente
export async function GET() {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const veiculos = await prisma.veiculoCliente.findMany({
      where: { clienteId: session.clienteId },
      orderBy: { modelo: "asc" },
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

// POST - Adicionar veículo
export async function POST(request: NextRequest) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { placa, modelo, marca, ano, cor } = body;

    const veiculo = await prisma.veiculoCliente.create({
      data: {
        placa: placa.toUpperCase(),
        modelo,
        marca,
        ano,
        cor,
        clienteId: session.clienteId,
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

