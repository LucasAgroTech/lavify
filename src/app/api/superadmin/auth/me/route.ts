import { NextResponse } from "next/server";
import { getSuperAdminSession } from "@/lib/superAdminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSuperAdminSession();

    if (!session) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const superAdmin = await prisma.superAdmin.findUnique({
      where: { id: session.superAdminId },
      select: {
        id: true,
        email: true,
        nome: true,
        createdAt: true,
      },
    });

    if (!superAdmin) {
      return NextResponse.json(
        { error: "Super Admin não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(superAdmin);
  } catch (error) {
    console.error("Erro ao buscar super admin:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}

