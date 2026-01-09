import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Detalhes de um agendamento
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

    const agendamento = await prisma.agendamento.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
      include: {
        cliente: true,
        veiculo: true,
        servicos: {
          include: {
            servico: true,
          },
        },
      },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(agendamento);
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamento" },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar status do agendamento
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
    const { status, motivoCancelamento } = body;

    // Verifica se o agendamento pertence ao lava jato
    const agendamento = await prisma.agendamento.findFirst({
      where: {
        id,
        lavaJatoId: session.lavaJatoId,
      },
      include: {
        cliente: true,
        veiculo: true,
        servicos: {
          include: {
            servico: true,
          },
        },
      },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = { status };

    if (motivoCancelamento) {
      updateData.motivoCancelamento = motivoCancelamento;
    }

    // Se o cliente chegou (mudou para EM_ANDAMENTO), criar OS automaticamente
    if (status === "EM_ANDAMENTO" && agendamento.status !== "EM_ANDAMENTO") {
      // 1. Busca ou cria Cliente do lava jato
      // Primeiro tenta encontrar cliente já existente neste lava-jato
      const clienteOrConditions = [];
      if (agendamento.cliente.email) {
        clienteOrConditions.push({ email: agendamento.cliente.email });
      }
      if (agendamento.cliente.telefone) {
        clienteOrConditions.push({ telefone: agendamento.cliente.telefone });
      }

      let cliente = clienteOrConditions.length > 0
        ? await prisma.cliente.findFirst({
            where: {
              lavaJatoId: session.lavaJatoId,
              OR: clienteOrConditions,
            },
          })
        : null;

      if (!cliente) {
        // Tenta criar novo cliente para este lava-jato
        // Se email já existe (constraint unique), usa o cliente original do agendamento
        try {
          cliente = await prisma.cliente.create({
            data: {
              nome: agendamento.cliente.nome,
              email: agendamento.cliente.email,
              telefone: agendamento.cliente.telefone,
              lavaJatoId: session.lavaJatoId,
            },
          });
        } catch (error: unknown) {
          // Se falhou por constraint de email, usar o cliente original do agendamento
          const prismaError = error as { code?: string };
          if (prismaError.code === "P2002") {
            // Tenta buscar sem filtro de lavaJatoId ou usa cliente original
            cliente = await prisma.cliente.findFirst({
              where: {
                OR: clienteOrConditions,
              },
            });
            
            // Se ainda não encontrou, usa o cliente do agendamento diretamente
            if (!cliente) {
              cliente = agendamento.cliente;
            }
          } else {
            throw error;
          }
        }
      }

      // 2. Busca ou cria Veículo do lava jato
      let veiculo = await prisma.veiculo.findFirst({
        where: {
          lavaJatoId: session.lavaJatoId,
          placa: agendamento.veiculo.placa,
        },
      });

      if (!veiculo) {
        veiculo = await prisma.veiculo.create({
          data: {
            placa: agendamento.veiculo.placa,
            modelo: agendamento.veiculo.modelo,
            cor: agendamento.veiculo.cor,
            clienteId: cliente.id,
            lavaJatoId: session.lavaJatoId,
          },
        });
      }

      // 3. Gera o próximo código de OS
      const ultimaOS = await prisma.ordemServico.findFirst({
        where: { lavaJatoId: session.lavaJatoId },
        orderBy: { codigo: "desc" },
      });
      const novoCodigo = (ultimaOS?.codigo || 0) + 1;

      // 4. Calcula tempo estimado total
      const tempoTotal = agendamento.servicos.reduce(
        (acc, s) => acc + (s.servico.tempoEstimado || 30),
        0
      );
      const previsaoSaida = new Date();
      previsaoSaida.setMinutes(previsaoSaida.getMinutes() + tempoTotal);

      // 5. Cria a Ordem de Serviço já vinculada ao agendamento
      await prisma.ordemServico.create({
        data: {
          codigo: novoCodigo,
          status: "LAVANDO", // Já está em andamento
          dataEntrada: new Date(),
          previsaoSaida,
          clienteId: cliente.id,
          veiculoId: veiculo.id,
          lavaJatoId: session.lavaJatoId,
          agendamentoId: id, // Vincula diretamente ao agendamento
          total: agendamento.totalEstimado,
          observacoes: agendamento.observacoes,
          itens: {
            create: agendamento.servicos.map((s) => ({
              servicoId: s.servicoId,
              preco: s.preco,
            })),
          },
        },
      });
    }

    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id },
      data: updateData,
      include: {
        cliente: true,
        veiculo: true,
        servicos: {
          include: {
            servico: true,
          },
        },
      },
    });

    return NextResponse.json(agendamentoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
      { status: 500 }
    );
  }
}
