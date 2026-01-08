import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientSession } from "@/lib/auth-cliente";

// GET - Lista agendamentos do cliente
export async function GET() {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: { clienteId: session.clienteId },
      include: {
        lavaJato: {
          select: {
            id: true,
            nome: true,
            slug: true,
            endereco: true,
            telefone: true,
            logoUrl: true,
          },
        },
        veiculo: true,
        servicos: {
          include: {
            servico: {
              select: {
                nome: true,
                preco: true,
              },
            },
          },
        },
        ordemServico: {
          select: {
            id: true,
            codigo: true,
            status: true,
            dataEntrada: true,
            previsaoSaida: true,
            dataFinalizacao: true,
          },
        },
      },
      orderBy: { dataHora: "desc" },
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

// POST - Criar novo agendamento
export async function POST(request: NextRequest) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { lavaJatoId, veiculoId, servicosIds, dataHora, observacoes } = body;

    // Verifica se o veículo pertence ao cliente
    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id: veiculoId,
        clienteId: session.clienteId,
      },
    });

    if (!veiculo) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se o lava jato existe e está ativo
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: lavaJatoId },
    });

    if (!lavaJato || !lavaJato.ativo) {
      return NextResponse.json(
        { error: "Lava jato não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se a data é válida (futuro)
    const dataAgendamento = new Date(dataHora);
    const agora = new Date();

    if (dataAgendamento.getTime() < agora.getTime()) {
      return NextResponse.json(
        { error: "A data do agendamento deve ser no futuro" },
        { status: 400 }
      );
    }

    // Busca os serviços e calcula total
    const servicos = await prisma.servico.findMany({
      where: {
        id: { in: servicosIds },
        lavaJatoId,
        ativo: true,
      },
    });

    if (servicos.length === 0) {
      return NextResponse.json(
        { error: "Selecione pelo menos um serviço" },
        { status: 400 }
      );
    }

    const totalEstimado = servicos.reduce((acc, s) => acc + s.preco, 0);

    // Cria o agendamento
    const agendamento = await prisma.agendamento.create({
      data: {
        dataHora: dataAgendamento,
        observacoes,
        clienteId: session.clienteId,
        veiculoId,
        lavaJatoId,
        totalEstimado,
        servicos: {
          create: servicos.map((s) => ({
            servicoId: s.id,
            preco: s.preco,
          })),
        },
      },
      include: {
        lavaJato: {
          select: {
            nome: true,
            endereco: true,
          },
        },
        veiculo: true,
        servicos: {
          include: {
            servico: true,
          },
        },
      },
    });

    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}
