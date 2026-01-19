import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// DELETE - Remover usuário e opcionalmente o lava-jato
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
    const { searchParams } = new URL(request.url);
    const deletarLavaJato = searchParams.get("deletarLavaJato") === "true";

    // Busca o usuário
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: {
        lavaJato: {
          include: {
            _count: {
              select: { usuarios: true },
            },
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Se é para deletar o lava-jato junto (ou se é o único usuário)
    if (deletarLavaJato || usuario.lavaJato._count.usuarios === 1) {
      // Deleta tudo relacionado ao lava-jato em cascata
      await prisma.$transaction(async (tx) => {
        // Deletar itens de ordens primeiro
        await tx.itemOrdem.deleteMany({
          where: {
            ordemServico: { lavaJatoId: usuario.lavaJatoId },
          },
        });

        // Deletar ordens de serviço
        await tx.ordemServico.deleteMany({
          where: { lavaJatoId: usuario.lavaJatoId },
        });

        // Deletar agendamentos
        await tx.agendamento.deleteMany({
          where: { lavaJatoId: usuario.lavaJatoId },
        });

        // Deletar veículos dos clientes
        await tx.veiculo.deleteMany({
          where: { cliente: { lavaJatoId: usuario.lavaJatoId } },
        });

        // Deletar clientes
        await tx.cliente.deleteMany({
          where: { lavaJatoId: usuario.lavaJatoId },
        });

        // Deletar produtos
        await tx.produto.deleteMany({
          where: { lavaJatoId: usuario.lavaJatoId },
        });

        // Deletar serviços
        await tx.servico.deleteMany({
          where: { lavaJatoId: usuario.lavaJatoId },
        });

        // Deletar financeiro
        await tx.financeiro.deleteMany({
          where: { lavaJatoId: usuario.lavaJatoId },
        });

        // Deletar usuários
        await tx.usuario.deleteMany({
          where: { lavaJatoId: usuario.lavaJatoId },
        });

        // Deletar o lava-jato
        await tx.lavaJato.delete({
          where: { id: usuario.lavaJatoId },
        });
      });

      return NextResponse.json({
        success: true,
        message: `Lava-jato "${usuario.lavaJato.nome}" e todos os dados removidos`,
        deletedLavaJato: true,
      });
    } else {
      // Deleta apenas o usuário
      await prisma.usuario.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: `Usuário "${usuario.nome}" removido`,
        deletedLavaJato: false,
      });
    }
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao deletar usuário" },
      { status: 500 }
    );
  }
}
