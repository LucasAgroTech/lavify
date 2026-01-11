import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Busca um veículo específico
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

    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
      include: {
        cliente: true,
      },
    });

    if (!veiculo) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(veiculo);
  } catch (error) {
    console.error("Erro ao buscar veículo:", error);
    return NextResponse.json(
      { error: "Erro ao buscar veículo" },
      { status: 500 }
    );
  }
}

// PATCH - Atualiza um veículo
export async function PATCH(
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
    const { placa, modelo, cor, clienteId } = body;

    // Verifica se o veículo pertence ao lava jato
    const veiculoExistente = await prisma.veiculo.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!veiculoExistente) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      );
    }

    // Se clienteId foi fornecido, valida se pertence ao lava jato
    if (clienteId) {
      const cliente = await prisma.cliente.findFirst({
        where: {
          id: clienteId,
          lavaJatoId: session.lavaJatoId,
        },
      });

      if (!cliente) {
        return NextResponse.json(
          { error: "Cliente não encontrado" },
          { status: 404 }
        );
      }
    }

    const veiculo = await prisma.veiculo.update({
      where: { id },
      data: {
        ...(placa && { placa: placa.toUpperCase() }),
        ...(modelo && { modelo }),
        ...(cor !== undefined && { cor }),
        ...(clienteId && { clienteId }),
      },
      include: {
        cliente: true,
      },
    });

    return NextResponse.json(veiculo);
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar veículo" },
      { status: 500 }
    );
  }
}

// DELETE - Remove um veículo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Verifica se o veículo pertence ao lava jato
    const veiculoExistente = await prisma.veiculo.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!veiculoExistente) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se o veículo tem ordens de serviço
    const ordensCount = await prisma.ordemServico.count({
      where: { veiculoId: id },
    });

    if (ordensCount > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir veículo com ordens de serviço. Este veículo possui histórico de lavagens." },
        { status: 400 }
      );
    }

    // Verifica se o veículo tem agendamentos
    const agendamentosCount = await prisma.agendamento.count({
      where: { veiculoId: id },
    });

    if (agendamentosCount > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir veículo com agendamentos" },
        { status: 400 }
      );
    }

    // Remove o veículo
    await prisma.veiculo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir veículo:", error);
    return NextResponse.json(
      { error: "Erro ao excluir veículo" },
      { status: 500 }
    );
  }
}

