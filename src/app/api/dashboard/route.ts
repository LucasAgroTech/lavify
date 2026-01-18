import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { startOfDay, startOfMonth, endOfDay, endOfMonth } from "date-fns";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { lavaJatoId } = session;
    const hoje = new Date();
    const inicioHoje = startOfDay(hoje);
    const fimHoje = endOfDay(hoje);
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);

    // Contagem de OS por status
    const ordensPorStatus = await prisma.ordemServico.groupBy({
      by: ["status"],
      where: { lavaJatoId },
      _count: true,
    });

    // OS do dia
    const osHoje = await prisma.ordemServico.count({
      where: {
        lavaJatoId,
        dataEntrada: {
          gte: inicioHoje,
          lte: fimHoje,
        },
      },
    });

    // Faturamento do dia - OS finalizadas (PRONTO ou ENTREGUE) do dia
    // Considera dataFinalizacao se existir, senão usa dataEntrada
    const faturamentoHojeOS = await prisma.ordemServico.aggregate({
      where: {
        lavaJatoId,
        status: {
          in: ["PRONTO", "ENTREGUE"],
        },
        OR: [
          // Se tem dataFinalizacao, usa ela
          {
            dataFinalizacao: {
              gte: inicioHoje,
              lte: fimHoje,
            },
          },
          // Se não tem dataFinalizacao, usa dataEntrada
          {
            dataFinalizacao: null,
            dataEntrada: {
              gte: inicioHoje,
              lte: fimHoje,
            },
          },
        ],
      },
      _sum: {
        total: true,
      },
    });

    // Também soma receitas do Financeiro
    const faturamentoHojeFinanceiro = await prisma.financeiro.aggregate({
      where: {
        lavaJatoId,
        tipo: "RECEITA",
        data: {
          gte: inicioHoje,
          lte: fimHoje,
        },
      },
      _sum: {
        valor: true,
      },
    });

    // Usa o maior valor entre OS e Financeiro
    const faturamentoHoje = Math.max(
      faturamentoHojeOS._sum.total || 0,
      faturamentoHojeFinanceiro._sum.valor || 0
    );

    // Faturamento do mês - OS finalizadas (PRONTO ou ENTREGUE) do mês
    const faturamentoMesOS = await prisma.ordemServico.aggregate({
      where: {
        lavaJatoId,
        status: {
          in: ["PRONTO", "ENTREGUE"],
        },
        OR: [
          // Se tem dataFinalizacao, usa ela
          {
            dataFinalizacao: {
              gte: inicioMes,
              lte: fimMes,
            },
          },
          // Se não tem dataFinalizacao, usa dataEntrada
          {
            dataFinalizacao: null,
            dataEntrada: {
              gte: inicioMes,
              lte: fimMes,
            },
          },
        ],
      },
      _sum: {
        total: true,
      },
    });

    // Também soma receitas do Financeiro
    const faturamentoMesFinanceiro = await prisma.financeiro.aggregate({
      where: {
        lavaJatoId,
        tipo: "RECEITA",
        data: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
      _sum: {
        valor: true,
      },
    });

    // Usa o maior valor entre OS e Financeiro
    const faturamentoMes = Math.max(
      faturamentoMesOS._sum.total || 0,
      faturamentoMesFinanceiro._sum.valor || 0
    );

    // Total de clientes
    const totalClientes = await prisma.cliente.count({
      where: { lavaJatoId },
    });

    // Clientes novos no mês
    const clientesNovosMes = await prisma.cliente.count({
      where: {
        lavaJatoId,
        createdAt: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
    });

    // Produtos com estoque baixo
    const produtos = await prisma.produto.findMany({
      where: { lavaJatoId, ativo: true },
    });
    const produtosEstoqueBaixo = produtos
      .filter((p) => p.quantidade <= p.pontoReposicao)
      .map((p) => ({
        id: p.id,
        nome: p.nome,
        quantidade: p.quantidade,
        pontoReposicao: p.pontoReposicao,
        unidade: p.unidade,
      }));

    // Serviços mais vendidos
    const servicosMaisVendidos = await prisma.itemOrdem.groupBy({
      by: ["servicoId"],
      where: {
        os: { lavaJatoId },
      },
      _count: true,
      orderBy: {
        _count: {
          servicoId: "desc",
        },
      },
      take: 5,
    });

    const servicosIds = servicosMaisVendidos.map((s) => s.servicoId);
    const servicos = await prisma.servico.findMany({
      where: { id: { in: servicosIds } },
    });

    const servicosComNome = servicosMaisVendidos.map((s) => ({
      ...s,
      nome: servicos.find((serv) => serv.id === s.servicoId)?.nome || "N/A",
    }));

    // OS em andamento
    const osEmAndamento = await prisma.ordemServico.count({
      where: {
        lavaJatoId,
        status: {
          notIn: ["ENTREGUE"],
        },
      },
    });

    // Agendamentos pendentes
    const agendamentosPendentes = await prisma.agendamento.count({
      where: {
        lavaJatoId,
        status: "PENDENTE",
      },
    });

    // Agendamentos de hoje
    const agendamentosHoje = await prisma.agendamento.count({
      where: {
        lavaJatoId,
        dataHora: {
          gte: inicioHoje,
          lte: fimHoje,
        },
        status: {
          in: ["PENDENTE", "CONFIRMADO"],
        },
      },
    });

    // Últimas 5 OSs do dia
    const ultimasOS = await prisma.ordemServico.findMany({
      where: {
        lavaJatoId,
        dataEntrada: {
          gte: inicioHoje,
          lte: fimHoje,
        },
      },
      orderBy: {
        dataEntrada: "desc",
      },
      take: 5,
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
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
        itens: {
          include: {
            servico: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      ordensPorStatus: ordensPorStatus.reduce(
        (acc, item) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      osHoje,
      osEmAndamento,
      faturamentoHoje,
      faturamentoMes,
      totalClientes,
      clientesNovosMes,
      produtosEstoqueBaixo,
      servicosMaisVendidos: servicosComNome,
      agendamentosPendentes,
      agendamentosHoje,
      ultimasOS,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados" },
      { status: 500 }
    );
  }
}
