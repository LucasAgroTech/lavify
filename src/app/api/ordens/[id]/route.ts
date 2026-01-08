import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { enviarMensagemWhatsApp, templates } from "@/lib/whatsapp";
import { StatusOS } from "@prisma/client";

// Função para abater estoque
async function abaterEstoqueOS(osId: string) {
  const os = await prisma.ordemServico.findUnique({
    where: { id: osId },
    include: {
      itens: {
        include: {
          servico: {
            include: {
              produtos: {
                include: {
                  produto: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!os) return;

  for (const item of os.itens) {
    for (const consumo of item.servico.produtos) {
      await prisma.produto.update({
        where: { id: consumo.produtoId },
        data: {
          quantidade: {
            decrement: consumo.quantidade,
          },
        },
      });
    }
  }
}

// GET - Busca uma ordem específica
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

    const ordem = await prisma.ordemServico.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId, // Garante que é do lava jato do usuário
      },
      include: {
        cliente: true,
        veiculo: true,
        itens: {
          include: {
            servico: true,
          },
        },
        transacoes: true,
      },
    });

    if (!ordem) {
      return NextResponse.json(
        { error: "Ordem não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(ordem);
  } catch (error) {
    console.error("Erro ao buscar ordem:", error);
    return NextResponse.json(
      { error: "Erro ao buscar ordem" },
      { status: 500 }
    );
  }
}

// Mapeamento de status da OS para status do Agendamento
function mapOSStatusToAgendamento(osStatus: StatusOS): string | null {
  switch (osStatus) {
    case StatusOS.AGUARDANDO:
    case StatusOS.LAVANDO:
    case StatusOS.FINALIZANDO:
      return "EM_ANDAMENTO";
    case StatusOS.PRONTO:
    case StatusOS.ENTREGUE:
      return "CONCLUIDO";
    default:
      return null;
  }
}

// PATCH - Atualiza status da ordem (usado pelo Kanban)
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
    const { status, ...outrosCampos } = body;

    // Busca a ordem atual (verificando se pertence ao lava jato)
    const ordemAtual = await prisma.ordemServico.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
      include: {
        cliente: true,
        veiculo: true,
      },
    });

    if (!ordemAtual) {
      return NextResponse.json(
        { error: "Ordem não encontrada" },
        { status: 404 }
      );
    }

    // Se está finalizando a OS, abate o estoque
    if (
      status === StatusOS.FINALIZANDO &&
      ordemAtual.status !== StatusOS.FINALIZANDO
    ) {
      await abaterEstoqueOS(id);
    }

    // Atualiza a ordem
    const ordem = await prisma.ordemServico.update({
      where: { id },
      data: {
        status: status as StatusOS,
        ...(status === StatusOS.ENTREGUE && { dataFinalizacao: new Date() }),
        ...outrosCampos,
      },
      include: {
        cliente: true,
        veiculo: true,
        itens: {
          include: {
            servico: true,
          },
        },
      },
    });

    // Sincroniza status do agendamento vinculado (se existir)
    if (ordem.agendamentoId) {
      const agendamento = await prisma.agendamento.findUnique({
        where: { id: ordem.agendamentoId },
      });

      if (agendamento) {
        const novoStatusAgendamento = mapOSStatusToAgendamento(status as StatusOS);
        if (novoStatusAgendamento && agendamento.status !== novoStatusAgendamento) {
          await prisma.agendamento.update({
            where: { id: agendamento.id },
            data: { status: novoStatusAgendamento as "EM_ANDAMENTO" | "CONCLUIDO" },
          });
        }
      }
    }

    // Envia mensagem WhatsApp quando status muda para PRONTO
    if (status === StatusOS.PRONTO && ordemAtual.status !== StatusOS.PRONTO) {
      await enviarMensagemWhatsApp({
        telefone: ordem.cliente.telefone,
        mensagem: templates.osPronta(
          ordem.cliente.nome,
          `${ordem.veiculo.modelo} ${ordem.veiculo.cor || ""}`.trim()
        ),
      });
    }

    // Adiciona pontos quando ENTREGUE
    if (status === StatusOS.ENTREGUE && ordemAtual.status !== StatusOS.ENTREGUE) {
      const pontos = Math.floor(ordem.total / 10);

      await prisma.cliente.update({
        where: { id: ordem.clienteId },
        data: {
          pontosFidelidade: {
            increment: pontos,
          },
        },
      });

      await enviarMensagemWhatsApp({
        telefone: ordem.cliente.telefone,
        mensagem: templates.osEntregue(ordem.cliente.nome, pontos),
      });
    }

    return NextResponse.json(ordem);
  } catch (error) {
    console.error("Erro ao atualizar ordem:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar ordem" },
      { status: 500 }
    );
  }
}

// DELETE - Remove uma ordem
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

    // Verifica se a ordem pertence ao lava jato
    const ordem = await prisma.ordemServico.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!ordem) {
      return NextResponse.json(
        { error: "Ordem não encontrada" },
        { status: 404 }
      );
    }

    // Remove itens primeiro (cascade não funciona bem com SQLite)
    await prisma.itemOrdem.deleteMany({
      where: { osId: id },
    });

    await prisma.ordemServico.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar ordem:", error);
    return NextResponse.json(
      { error: "Erro ao deletar ordem" },
      { status: 500 }
    );
  }
}
