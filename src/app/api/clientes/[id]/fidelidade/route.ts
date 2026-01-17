import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST - Adicionar ou resgatar carimbo
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { acao } = body; // "adicionar" ou "resgatar"

    // Buscar configurações do lava jato
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: session.lavaJatoId },
      select: {
        fidelidadeAtiva: true,
        metaFidelidade: true,
      },
    });

    if (!lavaJato?.fidelidadeAtiva) {
      return NextResponse.json(
        { error: "Programa de fidelidade não está ativo" },
        { status: 400 }
      );
    }

    // Buscar cliente
    const cliente = await prisma.cliente.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    if (!cliente.participaFidelidade) {
      return NextResponse.json(
        { error: "Cliente não participa do programa de fidelidade" },
        { status: 400 }
      );
    }

    const meta = lavaJato.metaFidelidade;

    if (acao === "adicionar") {
      // Adicionar 1 ponto de fidelidade
      await prisma.cliente.update({
        where: { id },
        data: {
          pontosFidelidade: { increment: 1 },
        },
      });

      const novosPontos = cliente.pontosFidelidade + 1;
      const carimbosAtuais = novosPontos % meta;
      const completou = carimbosAtuais === 0 && novosPontos > 0;

      return NextResponse.json({
        success: true,
        pontosFidelidade: novosPontos,
        carimbos: carimbosAtuais,
        completouCartao: completou,
        mensagem: completou 
          ? `🎉 Parabéns! ${cliente.nome} completou o cartão e ganhou 1 lavagem grátis!`
          : `✅ Carimbo adicionado! ${carimbosAtuais}/${meta}`,
      });
    } 
    
    if (acao === "resgatar") {
      // Verificar se tem pontos suficientes para resgatar
      if (cliente.pontosFidelidade < meta) {
        return NextResponse.json(
          { error: `Cliente precisa de ${meta} carimbos para resgatar. Atual: ${cliente.pontosFidelidade}` },
          { status: 400 }
        );
      }

      // Subtrair os pontos da meta
      await prisma.cliente.update({
        where: { id },
        data: {
          pontosFidelidade: { decrement: meta },
        },
      });

      const novosPontos = cliente.pontosFidelidade - meta;

      return NextResponse.json({
        success: true,
        pontosFidelidade: novosPontos,
        carimbos: novosPontos % meta,
        mensagem: `🎁 Lavagem grátis resgatada com sucesso!`,
      });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (error) {
    console.error("Erro ao gerenciar fidelidade:", error);
    return NextResponse.json(
      { error: "Erro ao gerenciar fidelidade" },
      { status: 500 }
    );
  }
}

// GET - Buscar status de fidelidade do cliente
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Buscar configurações do lava jato
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: session.lavaJatoId },
      select: {
        fidelidadeAtiva: true,
        metaFidelidade: true,
      },
    });

    // Buscar cliente
    const cliente = await prisma.cliente.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
      select: {
        pontosFidelidade: true,
        participaFidelidade: true,
      },
    });

    if (!cliente) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    const meta = lavaJato?.metaFidelidade || 10;
    const carimbos = cliente.pontosFidelidade % meta;
    const premiosDisponiveis = Math.floor(cliente.pontosFidelidade / meta);

    return NextResponse.json({
      fidelidadeAtiva: lavaJato?.fidelidadeAtiva || false,
      participaFidelidade: cliente.participaFidelidade,
      meta,
      pontosFidelidade: cliente.pontosFidelidade,
      carimbos,
      premiosDisponiveis,
    });
  } catch (error) {
    console.error("Erro ao buscar fidelidade:", error);
    return NextResponse.json(
      { error: "Erro ao buscar fidelidade" },
      { status: 500 }
    );
  }
}

