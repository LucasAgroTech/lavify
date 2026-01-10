import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { enviarMensagemWhatsApp, templates } from "@/lib/whatsapp";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { checkOsLimit } from "@/lib/subscription";

// GET - Lista ordens do lava jato logado
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const ordens = await prisma.ordemServico.findMany({
      where: { lavaJatoId: session.lavaJatoId },
      include: {
        cliente: true,
        veiculo: true,
        itens: {
          include: {
            servico: true,
          },
        },
      },
      orderBy: {
        dataEntrada: "desc",
      },
    });

    return NextResponse.json(ordens);
  } catch (error) {
    console.error("Erro ao buscar ordens:", error);
    return NextResponse.json(
      { error: "Erro ao buscar ordens" },
      { status: 500 }
    );
  }
}

// POST - Cria ordem no lava jato logado
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Verificar limite de OSs do plano
    const osCheck = await checkOsLimit(session.lavaJatoId);
    if (!osCheck.isValid) {
      return NextResponse.json(
        { error: osCheck.message, upgradeRequired: true },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      clienteId,
      veiculoId,
      servicosIds,
      previsaoSaida,
      checklistEntrada,
      observacoes,
    } = body;

    // Valida se o cliente pertence ao lava jato
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

    // Valida se o veículo pertence ao lava jato
    const veiculo = await prisma.veiculo.findFirst({
      where: {
        id: veiculoId,
        lavaJatoId: session.lavaJatoId,
      },
    });

    if (!veiculo) {
      return NextResponse.json(
        { error: "Veículo não encontrado" },
        { status: 404 }
      );
    }

    // Busca os serviços para calcular o total
    const servicos = await prisma.servico.findMany({
      where: {
        id: { in: servicosIds },
        lavaJatoId: session.lavaJatoId, // Garante que são serviços do lava jato
      },
    });

    const total = servicos.reduce((acc, s) => acc + s.preco, 0);

    // Gera o próximo código sequencial para este lava jato
    const ultimaOS = await prisma.ordemServico.findFirst({
      where: { lavaJatoId: session.lavaJatoId },
      orderBy: { codigo: "desc" },
    });
    const proximoCodigo = (ultimaOS?.codigo || 0) + 1;

    // Cria a OS
    const ordem = await prisma.ordemServico.create({
      data: {
        codigo: proximoCodigo,
        clienteId,
        veiculoId,
        previsaoSaida: previsaoSaida ? new Date(previsaoSaida) : null,
        checklistEntrada: checklistEntrada ? JSON.stringify(checklistEntrada) : null,
        observacoes,
        total,
        lavaJatoId: session.lavaJatoId,
        itens: {
          create: servicos.map((s) => ({
            servicoId: s.id,
            preco: s.preco,
          })),
        },
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

    // Envia mensagem WhatsApp de confirmação
    const previsaoFormatada = ordem.previsaoSaida
      ? format(ordem.previsaoSaida, "HH:mm", { locale: ptBR })
      : "em breve";

    await enviarMensagemWhatsApp({
      telefone: ordem.cliente.telefone,
      mensagem: templates.osRecebida(
        ordem.cliente.nome,
        `${ordem.veiculo.modelo} ${ordem.veiculo.cor || ""}`.trim(),
        previsaoFormatada
      ),
    });

    return NextResponse.json(ordem, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar ordem:", error);
    return NextResponse.json(
      { error: "Erro ao criar ordem de serviço" },
      { status: 500 }
    );
  }
}
