import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// GET - Lista todos os lava-jatos com estatísticas
export async function GET(request: NextRequest) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const plano = searchParams.get("plano") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { cnpj: { contains: search, mode: "insensitive" } },
      ];
    }

    if (plano) {
      where.plano = plano;
    }

    if (status === "ativo") {
      where.ativo = true;
    } else if (status === "inativo") {
      where.ativo = false;
    }

    const lavajatos = await prisma.lavaJato.findMany({
      where,
      include: {
        _count: {
          select: {
            usuarios: true,
            clientes: true,
            ordens: true,
            agendamentos: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Estatísticas gerais
    const stats = await prisma.lavaJato.aggregate({
      _count: true,
    });

    const statsByPlan = await prisma.lavaJato.groupBy({
      by: ["plano"],
      _count: true,
    });

    const activeCount = await prisma.lavaJato.count({
      where: { ativo: true },
    });

    return NextResponse.json({
      lavajatos,
      stats: {
        total: stats._count,
        ativos: activeCount,
        inativos: stats._count - activeCount,
        porPlano: statsByPlan.reduce((acc, curr) => {
          acc[curr.plano] = curr._count;
          return acc;
        }, {} as Record<string, number>),
      },
    });
  } catch (error) {
    console.error("Erro ao listar lava-jatos:", error);
    return NextResponse.json(
      { error: "Erro ao listar lava-jatos" },
      { status: 500 }
    );
  }
}

