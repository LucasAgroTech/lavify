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
        pontosFidelidade: true,
        participaFidelidade: true,
        lavaJatoId: true,
        lavaJato: {
          select: {
            nome: true,
            fidelidadeAtiva: true,
            metaFidelidade: true,
          },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    // Calcular dados de fidelidade
    const fidelidadeAtiva = cliente.lavaJato?.fidelidadeAtiva || false;
    const meta = cliente.lavaJato?.metaFidelidade || 10;
    const carimbos = fidelidadeAtiva ? cliente.pontosFidelidade % meta : 0;
    const premiosDisponiveis = fidelidadeAtiva ? Math.floor(cliente.pontosFidelidade / meta) : 0;

    return NextResponse.json({
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      // Dados de fidelidade
      fidelidade: {
        ativa: fidelidadeAtiva && cliente.participaFidelidade,
        participa: cliente.participaFidelidade,
        meta,
        pontosTotais: cliente.pontosFidelidade,
        carimbos,
        premiosDisponiveis,
        lavaJatoNome: cliente.lavaJato?.nome || null,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}
