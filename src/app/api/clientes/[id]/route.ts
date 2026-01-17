import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Busca um cliente específico
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

    const cliente = await prisma.cliente.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
      include: {
        veiculos: true,
        _count: {
          select: { ordens: true },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cliente" },
      { status: 500 }
    );
  }
}

// PATCH - Atualiza um cliente
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
    const { nome, telefone, email, planoMensal, participaFidelidade } = body;

    // Verifica se o cliente pertence ao lava jato
    const clienteExistente = await prisma.cliente.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(telefone && { telefone }),
        ...(email !== undefined && { email }),
        ...(planoMensal !== undefined && { planoMensal }),
        ...(participaFidelidade !== undefined && { participaFidelidade }),
      },
      include: {
        veiculos: true,
        _count: {
          select: { ordens: true },
        },
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}

// DELETE - Remove um cliente
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

    // Verifica se o cliente pertence ao lava jato
    const clienteExistente = await prisma.cliente.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se o cliente tem ordens de serviço
    const ordensCount = await prisma.ordemServico.count({
      where: { clienteId: id },
    });

    if (ordensCount > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir cliente com ordens de serviço" },
        { status: 400 }
      );
    }

    // Verifica se o cliente tem agendamentos
    const agendamentosCount = await prisma.agendamento.count({
      where: { clienteId: id },
    });

    if (agendamentosCount > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir cliente com agendamentos" },
        { status: 400 }
      );
    }

    // Remove veículos do cliente primeiro
    await prisma.veiculo.deleteMany({
      where: { clienteId: id },
    });

    // Remove o cliente
    await prisma.cliente.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    return NextResponse.json(
      { error: "Erro ao excluir cliente" },
      { status: 500 }
    );
  }
}

