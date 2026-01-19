import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// GET - Listar atividades com filtros
export async function GET(request: NextRequest) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lavaJatoId = searchParams.get("lavaJatoId");
    const tipo = searchParams.get("tipo");
    const limit = parseInt(searchParams.get("limit") || "100");

    const atividades = await prisma.atividadeLog.findMany({
      where: {
        ...(lavaJatoId && { lavaJatoId }),
        ...(tipo && { tipo }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Agrupar por lava-jato para resumo
    const resumoPorLavaJato = await prisma.atividadeLog.groupBy({
      by: ["lavaJatoId"],
      _count: true,
      _max: { createdAt: true },
      where: {
        lavaJatoId: { not: null },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Últimos 7 dias
        },
      },
    });

    // Contar por tipo de atividade
    const porTipo = await prisma.atividadeLog.groupBy({
      by: ["tipo"],
      _count: true,
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24h
        },
      },
    });

    return NextResponse.json({
      atividades,
      resumoPorLavaJato,
      porTipo: porTipo.reduce((acc, curr) => {
        acc[curr.tipo] = curr._count;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error("Erro ao listar atividades:", error);
    return NextResponse.json(
      { error: "Erro ao listar atividades" },
      { status: 500 }
    );
  }
}
