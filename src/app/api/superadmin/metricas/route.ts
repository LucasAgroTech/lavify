import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// GET - Métricas completas do sistema
export async function GET() {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const agora = new Date();
    const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const inicioSemana = new Date(agora);
    inicioSemana.setDate(agora.getDate() - 7);
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const inicioMesPassado = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
    const fimMesPassado = new Date(agora.getFullYear(), agora.getMonth(), 0);

    // ========================================
    // FUNIL DE CONVERSÃO
    // ========================================
    
    // Total de cadastros
    const totalCadastros = await prisma.lavaJato.count();
    
    // Cadastros por período
    const cadastrosHoje = await prisma.lavaJato.count({
      where: { createdAt: { gte: inicioHoje } },
    });
    const cadastrosSemana = await prisma.lavaJato.count({
      where: { createdAt: { gte: inicioSemana } },
    });
    const cadastrosMes = await prisma.lavaJato.count({
      where: { createdAt: { gte: inicioMes } },
    });
    const cadastrosMesPassado = await prisma.lavaJato.count({
      where: {
        createdAt: { gte: inicioMesPassado, lte: fimMesPassado },
      },
    });

    // Por plano
    const porPlano = await prisma.lavaJato.groupBy({
      by: ["plano"],
      _count: true,
    });

    // Por status Stripe
    const porStripeStatus = await prisma.lavaJato.groupBy({
      by: ["stripeStatus"],
      _count: true,
    });

    // Convertidos (planos pagos ativos)
    const convertidos = await prisma.lavaJato.count({
      where: {
        stripeStatus: "active",
        plano: { in: ["PRO", "PREMIUM"] },
      },
    });

    // Em trial
    const emTrial = await prisma.lavaJato.count({
      where: { stripeStatus: "trialing" },
    });

    // Trial expirando em 3 dias
    const tresDias = new Date();
    tresDias.setDate(tresDias.getDate() + 3);
    const trialExpirando = await prisma.lavaJato.count({
      where: {
        stripeStatus: "trialing",
        trialEndsAt: { lte: tresDias },
      },
    });

    // Cancelados
    const cancelados = await prisma.lavaJato.count({
      where: { stripeStatus: "canceled" },
    });

    // ========================================
    // ENGAJAMENTO / USO DA PLATAFORMA
    // ========================================

    // Ordens de serviço
    const totalOS = await prisma.ordemServico.count();
    const osHoje = await prisma.ordemServico.count({
      where: { dataEntrada: { gte: inicioHoje } },
    });
    const osSemana = await prisma.ordemServico.count({
      where: { dataEntrada: { gte: inicioSemana } },
    });
    const osMes = await prisma.ordemServico.count({
      where: { dataEntrada: { gte: inicioMes } },
    });

    // Lava-jatos ativos (com OS nos últimos 7 dias)
    const lavaJatosAtivos = await prisma.ordemServico.groupBy({
      by: ["lavaJatoId"],
      where: { dataEntrada: { gte: inicioSemana } },
    });

    // Clientes cadastrados
    const totalClientes = await prisma.cliente.count();
    const clientesMes = await prisma.cliente.count({
      where: { createdAt: { gte: inicioMes } },
    });

    // Agendamentos
    const totalAgendamentos = await prisma.agendamento.count();
    const agendamentosMes = await prisma.agendamento.count({
      where: { createdAt: { gte: inicioMes } },
    });

    // ========================================
    // RECEITA / FATURAMENTO
    // ========================================

    // Faturamento total (receitas dos lava-jatos)
    const faturamentoMes = await prisma.financeiro.aggregate({
      where: {
        tipo: "RECEITA",
        data: { gte: inicioMes },
      },
      _sum: { valor: true },
    });

    const faturamentoMesPassado = await prisma.financeiro.aggregate({
      where: {
        tipo: "RECEITA",
        data: { gte: inicioMesPassado, lte: fimMesPassado },
      },
      _sum: { valor: true },
    });

    // ========================================
    // TENDÊNCIAS (últimos 30 dias por dia)
    // ========================================

    const cadastrosPorDia: { data: string; quantidade: number }[] = [];
    const osPorDia: { data: string; quantidade: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const dia = new Date();
      dia.setDate(dia.getDate() - i);
      const inicioDia = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate());
      const fimDia = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 23, 59, 59);

      const cadastrosDia = await prisma.lavaJato.count({
        where: { createdAt: { gte: inicioDia, lte: fimDia } },
      });

      const osDia = await prisma.ordemServico.count({
        where: { dataEntrada: { gte: inicioDia, lte: fimDia } },
      });

      cadastrosPorDia.push({
        data: `${dia.getDate().toString().padStart(2, "0")}/${(dia.getMonth() + 1).toString().padStart(2, "0")}`,
        quantidade: cadastrosDia,
      });

      osPorDia.push({
        data: `${dia.getDate().toString().padStart(2, "0")}/${(dia.getMonth() + 1).toString().padStart(2, "0")}`,
        quantidade: osDia,
      });
    }

    // ========================================
    // TOP LAVA-JATOS (mais ativos)
    // ========================================

    const topLavaJatos = await prisma.ordemServico.groupBy({
      by: ["lavaJatoId"],
      _count: true,
      where: { dataEntrada: { gte: inicioMes } },
      orderBy: { _count: { lavaJatoId: "desc" } },
      take: 10,
    });

    const topLavaJatosDetalhes = await Promise.all(
      topLavaJatos.map(async (item) => {
        const lavaJato = await prisma.lavaJato.findUnique({
          where: { id: item.lavaJatoId },
          select: { nome: true, plano: true, stripeStatus: true },
        });
        return {
          nome: lavaJato?.nome || "Desconhecido",
          plano: lavaJato?.plano || "STARTER",
          stripeStatus: lavaJato?.stripeStatus,
          osNoMes: item._count,
        };
      })
    );

    // ========================================
    // LOGINS RECENTES
    // ========================================

    const loginsHoje = await prisma.atividadeLog.count({
      where: {
        tipo: "LOGIN",
        createdAt: { gte: inicioHoje },
      },
    });

    const loginsSemana = await prisma.atividadeLog.count({
      where: {
        tipo: "LOGIN",
        createdAt: { gte: inicioSemana },
      },
    });

    // Lava-jatos únicos que logaram esta semana
    const loginsUnicos = await prisma.atividadeLog.groupBy({
      by: ["lavaJatoId"],
      where: {
        tipo: "LOGIN",
        createdAt: { gte: inicioSemana },
        lavaJatoId: { not: null },
      },
    });

    // ========================================
    // CÁLCULO DE TAXAS
    // ========================================

    const taxaConversao = totalCadastros > 0 ? ((convertidos / totalCadastros) * 100).toFixed(1) : "0";
    const taxaAtivacao = totalCadastros > 0 ? ((lavaJatosAtivos.length / totalCadastros) * 100).toFixed(1) : "0";
    const crescimentoCadastros = cadastrosMesPassado > 0 
      ? (((cadastrosMes - cadastrosMesPassado) / cadastrosMesPassado) * 100).toFixed(1)
      : "0";

    return NextResponse.json({
      funil: {
        totalCadastros,
        cadastrosHoje,
        cadastrosSemana,
        cadastrosMes,
        cadastrosMesPassado,
        crescimentoCadastros: parseFloat(crescimentoCadastros),
        emTrial,
        trialExpirando,
        convertidos,
        cancelados,
        taxaConversao: parseFloat(taxaConversao),
        porPlano: porPlano.reduce((acc, curr) => {
          acc[curr.plano] = curr._count;
          return acc;
        }, {} as Record<string, number>),
        porStripeStatus: porStripeStatus.reduce((acc, curr) => {
          acc[curr.stripeStatus || "sem_status"] = curr._count;
          return acc;
        }, {} as Record<string, number>),
      },
      engajamento: {
        totalOS,
        osHoje,
        osSemana,
        osMes,
        lavaJatosAtivos: lavaJatosAtivos.length,
        taxaAtivacao: parseFloat(taxaAtivacao),
        totalClientes,
        clientesMes,
        totalAgendamentos,
        agendamentosMes,
        loginsHoje,
        loginsSemana,
        lavaJatosQueLogaram: loginsUnicos.length,
      },
      receita: {
        faturamentoMes: faturamentoMes._sum.valor || 0,
        faturamentoMesPassado: faturamentoMesPassado._sum.valor || 0,
      },
      tendencias: {
        cadastrosPorDia,
        osPorDia,
      },
      topLavaJatos: topLavaJatosDetalhes,
    });
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar métricas" },
      { status: 500 }
    );
  }
}
