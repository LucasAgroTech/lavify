import { NextResponse } from "next/server";
import { getClientSession } from "@/lib/auth-cliente";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getClientSession();

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: session.clienteId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
      },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}
