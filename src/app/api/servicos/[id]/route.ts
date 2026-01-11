import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PATCH - Atualiza um serviço
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
    const { nome, preco, tempoEstimado } = body;

    // Verificar se o serviço pertence ao lava jato
    const servicoExistente = await prisma.servico.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!servicoExistente) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    const servico = await prisma.servico.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(preco !== undefined && { preco }),
        ...(tempoEstimado !== undefined && { tempoEstimado }),
      },
    });

    return NextResponse.json(servico);
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar serviço" },
      { status: 500 }
    );
  }
}

// DELETE - Remove um serviço
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

    // Verificar se o serviço pertence ao lava jato
    const servicoExistente = await prisma.servico.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!servicoExistente) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se o serviço está sendo usado em alguma OS
    const osComServico = await prisma.itemOrdem.count({
      where: { servicoId: id },
    });

    if (osComServico > 0) {
      return NextResponse.json(
        { error: "Este serviço não pode ser excluído pois está sendo usado em ordens de serviço" },
        { status: 400 }
      );
    }

    await prisma.servico.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    return NextResponse.json(
      { error: "Erro ao excluir serviço" },
      { status: 500 }
    );
  }
}

