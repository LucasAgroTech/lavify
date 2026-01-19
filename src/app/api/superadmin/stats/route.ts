import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// GET - Estatísticas gerais do sistema
export async function GET() {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Contagens gerais
    const [
      totalLavajatos,
      lavajatosAtivos,
      totalUsuarios,
      totalClientes,
      totalOrdens,
      totalAgendamentos,
    ] = await Promise.all([
      prisma.lavaJato.count(),
      prisma.lavaJato.count({ where: { ativo: true } }),
      prisma.usuario.count(),
      prisma.cliente.count(),
      prisma.ordemServico.count(),
      prisma.agendamento.count(),
    ]);

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

    // Faturamento total do mês
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const faturamentoMes = await prisma.financeiro.aggregate({
      where: {
        tipo: "RECEITA",
        data: { gte: inicioMes },
      },
      _sum: { valor: true },
    });

    // Lava-jatos criados no mês
    const novosMes = await prisma.lavaJato.count({
      where: { createdAt: { gte: inicioMes } },
    });

    // Últimos 7 dias - ordens por dia
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

    const ordensUltimos7Dias = await prisma.ordemServico.count({
      where: { dataEntrada: { gte: seteDiasAtras } },
    });

    // ========================================
    // USUÁRIOS NOVOS POR SEMANA (últimas 8 semanas)
    // ========================================
    const usuariosPorSemana: { semana: string; quantidade: number }[] = [];
    
    for (let i = 7; i >= 0; i--) {
      const inicioSemana = new Date();
      inicioSemana.setDate(inicioSemana.getDate() - (i * 7) - inicioSemana.getDay());
      inicioSemana.setHours(0, 0, 0, 0);
      
      const fimSemana = new Date(inicioSemana);
      fimSemana.setDate(fimSemana.getDate() + 6);
      fimSemana.setHours(23, 59, 59, 999);

      const quantidade = await prisma.usuario.count({
        where: {
          createdAt: {
            gte: inicioSemana,
            lte: fimSemana,
          },
        },
      });

      // Formatar a semana como "DD/MM"
      const semanaLabel = `${inicioSemana.getDate().toString().padStart(2, "0")}/${(inicioSemana.getMonth() + 1).toString().padStart(2, "0")}`;

      usuariosPorSemana.push({
        semana: semanaLabel,
        quantidade,
      });
    }

    // Usuários novos na última semana
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
    
    const usuariosNovosUltimaSemana = await prisma.usuario.count({
      where: { createdAt: { gte: umaSemanaAtras } },
    });

    return NextResponse.json({
      lavajatos: {
        total: totalLavajatos,
        ativos: lavajatosAtivos,
        inativos: totalLavajatos - lavajatosAtivos,
        novosMes,
      },
      usuarios: {
        total: totalUsuarios,
        novosUltimaSemana: usuariosNovosUltimaSemana,
        porSemana: usuariosPorSemana,
      },
      clientes: totalClientes,
      ordens: {
        total: totalOrdens,
        ultimos7Dias: ordensUltimos7Dias,
      },
      agendamentos: totalAgendamentos,
      faturamentoMes: faturamentoMes._sum.valor || 0,
      porPlano: porPlano.reduce((acc, curr) => {
        acc[curr.plano] = curr._count;
        return acc;
      }, {} as Record<string, number>),
      porStripeStatus: porStripeStatus.reduce((acc, curr) => {
        acc[curr.stripeStatus || "sem_status"] = curr._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

