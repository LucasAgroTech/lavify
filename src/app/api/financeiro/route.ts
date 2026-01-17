import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { 
  startOfDay, 
  endOfDay, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek,
  endOfWeek,
  subMonths,
  format,
  eachDayOfInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";

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
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 }); // Segunda
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 });
    const mesAnteriorInicio = startOfMonth(subMonths(hoje, 1));
    const mesAnteriorFim = endOfMonth(subMonths(hoje, 1));

    // ========================================
    // FATURAMENTO DO DIA (OS finalizadas)
    // ========================================
    const faturamentoHojeResult = await prisma.ordemServico.aggregate({
      where: {
        lavaJatoId,
        status: { in: ["PRONTO", "ENTREGUE"] },
        OR: [
          { dataFinalizacao: { gte: inicioHoje, lte: fimHoje } },
          { dataFinalizacao: null, dataEntrada: { gte: inicioHoje, lte: fimHoje } },
        ],
      },
      _sum: { total: true },
    });
    const faturamentoHoje = faturamentoHojeResult._sum.total || 0;

    // ========================================
    // FATURAMENTO DO MÊS (OS finalizadas)
    // ========================================
    const faturamentoMesResult = await prisma.ordemServico.aggregate({
      where: {
        lavaJatoId,
        status: { in: ["PRONTO", "ENTREGUE"] },
        OR: [
          { dataFinalizacao: { gte: inicioMes, lte: fimMes } },
          { dataFinalizacao: null, dataEntrada: { gte: inicioMes, lte: fimMes } },
        ],
      },
      _sum: { total: true },
    });
    const faturamentoMes = faturamentoMesResult._sum.total || 0;

    // ========================================
    // FATURAMENTO DO MÊS ANTERIOR (para comparação)
    // ========================================
    const faturamentoMesAnteriorResult = await prisma.ordemServico.aggregate({
      where: {
        lavaJatoId,
        status: { in: ["PRONTO", "ENTREGUE"] },
        OR: [
          { dataFinalizacao: { gte: mesAnteriorInicio, lte: mesAnteriorFim } },
          { dataFinalizacao: null, dataEntrada: { gte: mesAnteriorInicio, lte: mesAnteriorFim } },
        ],
      },
      _sum: { total: true },
    });
    const faturamentoMesAnterior = faturamentoMesAnteriorResult._sum.total || 0;

    // Calcular variação percentual
    const variacaoMes = faturamentoMesAnterior > 0 
      ? ((faturamentoMes - faturamentoMesAnterior) / faturamentoMesAnterior) * 100 
      : faturamentoMes > 0 ? 100 : 0;

    // ========================================
    // RECEITAS DO MÊS (Financeiro + OS)
    // ========================================
    const receitasFinanceiro = await prisma.financeiro.aggregate({
      where: {
        lavaJatoId,
        tipo: "RECEITA",
        data: { gte: inicioMes, lte: fimMes },
      },
      _sum: { valor: true },
    });
    const totalReceitas = Math.max(
      faturamentoMes,
      receitasFinanceiro._sum.valor || 0
    );

    // ========================================
    // DESPESAS DO MÊS
    // ========================================
    const despesasResult = await prisma.financeiro.aggregate({
      where: {
        lavaJatoId,
        tipo: "DESPESA",
        data: { gte: inicioMes, lte: fimMes },
      },
      _sum: { valor: true },
    });
    const totalDespesas = despesasResult._sum.valor || 0;

    // ========================================
    // LUCRO
    // ========================================
    const lucro = totalReceitas - totalDespesas;

    // ========================================
    // RECEITAS RECENTES (últimas 10)
    // ========================================
    const receitasRecentes = await prisma.ordemServico.findMany({
      where: {
        lavaJatoId,
        status: { in: ["PRONTO", "ENTREGUE"] },
      },
      orderBy: { dataFinalizacao: "desc" },
      take: 10,
      select: {
        id: true,
        codigo: true,
        total: true,
        dataFinalizacao: true,
        dataEntrada: true,
        itens: {
          select: {
            servico: { select: { nome: true } },
          },
        },
      },
    });

    const receitasFormatadas = receitasRecentes.map((os) => ({
      id: os.id,
      desc: `OS #${os.codigo} - ${os.itens[0]?.servico.nome || "Serviço"}`,
      valor: os.total,
      data: os.dataFinalizacao || os.dataEntrada,
      hora: format(os.dataFinalizacao || os.dataEntrada, "HH:mm"),
    }));

    // ========================================
    // DESPESAS RECENTES (últimas 10)
    // ========================================
    const despesasRecentes = await prisma.financeiro.findMany({
      where: {
        lavaJatoId,
        tipo: "DESPESA",
      },
      orderBy: { data: "desc" },
      take: 10,
      select: {
        id: true,
        descricao: true,
        valor: true,
        data: true,
      },
    });

    const despesasFormatadas = despesasRecentes.map((d) => ({
      id: d.id,
      desc: d.descricao,
      valor: d.valor,
      data: d.data,
      hora: format(d.data, "dd/MM"),
    }));

    // ========================================
    // DADOS DO GRÁFICO SEMANAL
    // ========================================
    const diasSemana = eachDayOfInterval({
      start: inicioSemana,
      end: fimSemana,
    });

    const chartData = await Promise.all(
      diasSemana.map(async (dia) => {
        const inicioDia = startOfDay(dia);
        const fimDia = endOfDay(dia);

        // Receitas do dia (OS finalizadas)
        const receitaDia = await prisma.ordemServico.aggregate({
          where: {
            lavaJatoId,
            status: { in: ["PRONTO", "ENTREGUE"] },
            OR: [
              { dataFinalizacao: { gte: inicioDia, lte: fimDia } },
              { dataFinalizacao: null, dataEntrada: { gte: inicioDia, lte: fimDia } },
            ],
          },
          _sum: { total: true },
        });

        // Despesas do dia
        const despesaDia = await prisma.financeiro.aggregate({
          where: {
            lavaJatoId,
            tipo: "DESPESA",
            data: { gte: inicioDia, lte: fimDia },
          },
          _sum: { valor: true },
        });

        return {
          dia: format(dia, "EEE", { locale: ptBR }).charAt(0).toUpperCase() + 
               format(dia, "EEE", { locale: ptBR }).slice(1),
          receita: receitaDia._sum.total || 0,
          despesa: despesaDia._sum.valor || 0,
        };
      })
    );

    // ========================================
    // TOTAL DE OS DO MÊS
    // ========================================
    const totalOsMes = await prisma.ordemServico.count({
      where: {
        lavaJatoId,
        dataEntrada: { gte: inicioMes, lte: fimMes },
      },
    });

    // ========================================
    // TICKET MÉDIO
    // ========================================
    const ticketMedio = totalOsMes > 0 ? faturamentoMes / totalOsMes : 0;

    return NextResponse.json({
      faturamentoHoje,
      faturamentoMes,
      faturamentoMesAnterior,
      variacaoMes: Math.round(variacaoMes * 10) / 10, // 1 casa decimal
      totalReceitas,
      totalDespesas,
      lucro,
      ticketMedio,
      totalOsMes,
      receitasRecentes: receitasFormatadas,
      despesasRecentes: despesasFormatadas,
      chartData,
    });
  } catch (error) {
    console.error("Erro ao buscar dados financeiros:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados financeiros" },
      { status: 500 }
    );
  }
}

