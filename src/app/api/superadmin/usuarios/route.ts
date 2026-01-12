import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// GET - Listar todos os usuários do sistema
export async function GET(request: NextRequest) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const lavaJatoId = searchParams.get("lavaJatoId") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { telefone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (lavaJatoId) {
      where.lavaJatoId = lavaJatoId;
    }

    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        role: true,
        ativo: true,
        createdAt: true,
        lavaJato: {
          select: {
            id: true,
            nome: true,
            slug: true,
            plano: true,
            ativo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Estatísticas
    const stats = {
      total: usuarios.length,
      admins: usuarios.filter((u) => u.role === "ADMIN").length,
      gerentes: usuarios.filter((u) => u.role === "GERENTE").length,
      atendentes: usuarios.filter((u) => u.role === "ATENDENTE").length,
      lavadores: usuarios.filter((u) => 
        u.role === "LAVADOR_SENIOR" || u.role === "LAVADOR_JUNIOR"
      ).length,
      ativos: usuarios.filter((u) => u.ativo).length,
    };

    return NextResponse.json({ usuarios, stats });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao listar usuários" },
      { status: 500 }
    );
  }
}

