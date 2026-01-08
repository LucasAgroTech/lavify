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
            cidade: true,
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
      },
      orderBy: { dataHora: "desc" },
    });

    // Para agendamentos com OS vinculada, busca o status atual da OS
    const agendamentosComStatusOS = await Promise.all(
      agendamentos.map(async (agendamento) => {
        if (agendamento.ordemServicoId) {
          const os = await prisma.ordemServico.findUnique({
            where: { id: agendamento.ordemServicoId },
            select: {
              id: true,
              codigo: true,
              status: true,
              dataEntrada: true,
              previsaoSaida: true,
              dataFinalizacao: true,
            },
          });
          return {
            ...agendamento,
            ordemServico: os,
          };
        }
        return {
          ...agendamento,
          ordemServico: null,
        };
      })
    );

    return NextResponse.json(agendamentosComStatusOS);
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
    const veiculo = await prisma.veiculoCliente.findFirst({
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

    // Verifica se o lava jato aceita agendamentos
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: lavaJatoId },
    });

    if (!lavaJato || !lavaJato.ativo) {
      return NextResponse.json(
        { error: "Lava jato não encontrado" },
        { status: 404 }
      );
    }

    if (!lavaJato.aceitaAgendamento) {
      return NextResponse.json(
        { error: "Este lava jato não aceita agendamentos online" },
        { status: 400 }
      );
    }

    // Verifica se a data é válida (futuro + tempo mínimo)
    const dataAgendamento = new Date(dataHora);
    const agora = new Date();
    const tempoMinimo = lavaJato.tempoMinimoAgendamento * 60 * 1000;

    if (dataAgendamento.getTime() < agora.getTime() + tempoMinimo) {
      return NextResponse.json(
        { error: `Agendamento deve ser feito com no mínimo ${lavaJato.tempoMinimoAgendamento} minutos de antecedência` },
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
            precoNoMomento: s.preco,
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

