import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Lista agendamentos do lava jato
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {
      lavaJatoId: session.lavaJatoId,
    };

    if (status) {
      where.status = status;
    }

    const agendamentos = await prisma.agendamento.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
        veiculo: {
          select: {
            id: true,
            placa: true,
            modelo: true,
            cor: true,
          },
        },
        servicos: {
          include: {
            servico: {
              select: {
                id: true,
                nome: true,
                preco: true,
                tempoEstimado: true,
              },
            },
          },
        },
      },
      orderBy: { dataHora: "asc" },
    });

    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}

