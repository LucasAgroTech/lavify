import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// GET - Detalhes de um lava-jato
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const lavajato = await prisma.lavaJato.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
            ativo: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            clientes: true,
            veiculos: true,
            ordens: true,
            agendamentos: true,
            servicos: true,
            produtos: true,
          },
        },
      },
    });

    if (!lavajato) {
      return NextResponse.json(
        { error: "Lava-jato não encontrado" },
        { status: 404 }
      );
    }

    // Estatísticas financeiras
    const faturamento = await prisma.financeiro.aggregate({
      where: {
        lavaJatoId: id,
        tipo: "RECEITA",
      },
      _sum: { valor: true },
    });

    return NextResponse.json({
      ...lavajato,
      faturamentoTotal: faturamento._sum.valor || 0,
    });
  } catch (error) {
    console.error("Erro ao buscar lava-jato:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lava-jato" },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar lava-jato (plano, status, etc)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const lavajato = await prisma.lavaJato.findUnique({
      where: { id },
    });

    if (!lavajato) {
      return NextResponse.json(
        { error: "Lava-jato não encontrado" },
        { status: 404 }
      );
    }

    // Campos permitidos para atualização pelo super admin
    const updateData: Record<string, unknown> = {};

    if (body.plano !== undefined) {
      updateData.plano = body.plano;
    }

    if (body.ativo !== undefined) {
      updateData.ativo = body.ativo;
    }

    if (body.stripeStatus !== undefined) {
      updateData.stripeStatus = body.stripeStatus;
    }

    if (body.currentPeriodEnd !== undefined) {
      updateData.currentPeriodEnd = body.currentPeriodEnd
        ? new Date(body.currentPeriodEnd)
        : null;
    }

    if (body.trialEndsAt !== undefined) {
      updateData.trialEndsAt = body.trialEndsAt
        ? new Date(body.trialEndsAt)
        : null;
    }

    const updated = await prisma.lavaJato.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar lava-jato:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar lava-jato" },
      { status: 500 }
    );
  }
}

// DELETE - Remover lava-jato (cuidado!)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const lavajato = await prisma.lavaJato.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            ordens: true,
            clientes: true,
          },
        },
      },
    });

    if (!lavajato) {
      return NextResponse.json(
        { error: "Lava-jato não encontrado" },
        { status: 404 }
      );
    }

    // Aviso: não permite deletar se tiver dados
    if (lavajato._count.ordens > 0 || lavajato._count.clientes > 0) {
      return NextResponse.json(
        {
          error: "Este lava-jato possui dados associados. Desative-o em vez de excluir.",
          ordens: lavajato._count.ordens,
          clientes: lavajato._count.clientes,
        },
        { status: 400 }
      );
    }

    // Deleta em cascata (se não tiver dados)
    await prisma.lavaJato.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar lava-jato:", error);
    return NextResponse.json(
      { error: "Erro ao deletar lava-jato" },
      { status: 500 }
    );
  }
}

