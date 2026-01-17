import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { differenceInDays } from "date-fns";

// GET - Lista clientes do lava jato logado com dados completos
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar configurações de fidelidade do lava jato
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: session.lavaJatoId },
      select: {
        fidelidadeAtiva: true,
        metaFidelidade: true,
      },
    });

    const fidelidadeAtiva = lavaJato?.fidelidadeAtiva ?? false;
    const metaFidelidade = lavaJato?.metaFidelidade ?? 10;

    const clientes = await prisma.cliente.findMany({
      where: { lavaJatoId: session.lavaJatoId },
      include: {
        veiculos: true,
        ordens: {
          where: {
            status: { in: ["PRONTO", "ENTREGUE"] },
          },
          orderBy: { dataFinalizacao: "desc" },
          take: 1,
          select: {
            id: true,
            codigo: true,
            total: true,
            dataFinalizacao: true,
            dataEntrada: true,
            itens: {
              select: {
                servico: { select: { nome: true } },
              },
            },
          },
        },
        _count: {
          select: { ordens: true },
        },
      },
      orderBy: {
        nome: "asc",
      },
    });

    // Buscar total gasto por cliente
    const clientesComDados = await Promise.all(
      clientes.map(async (cliente) => {
        // Total gasto
        const totalGasto = await prisma.ordemServico.aggregate({
          where: {
            clienteId: cliente.id,
            status: { in: ["PRONTO", "ENTREGUE"] },
          },
          _sum: { total: true },
        });

        // Última lavagem
        const ultimaLavagem = cliente.ordens[0];
        const dataUltimaLavagem = ultimaLavagem?.dataFinalizacao || ultimaLavagem?.dataEntrada || null;
        
        // Dias desde última visita
        const diasSemVir = dataUltimaLavagem 
          ? differenceInDays(new Date(), new Date(dataUltimaLavagem))
          : null;

        // Carimbos baseados nos pontos de fidelidade - usa a meta configurada
        const carimbos = cliente.pontosFidelidade % metaFidelidade;
        const lavagensGratis = Math.floor(cliente.pontosFidelidade / metaFidelidade);

        return {
          id: cliente.id,
          nome: cliente.nome,
          telefone: cliente.telefone,
          email: cliente.email,
          pontosFidelidade: cliente.pontosFidelidade,
          saldoCashback: cliente.saldoCashback,
          planoMensal: cliente.planoMensal,
          participaFidelidade: cliente.participaFidelidade,
          createdAt: cliente.createdAt,
          veiculos: cliente.veiculos,
          _count: cliente._count,
          // Novos campos
          totalGasto: totalGasto._sum.total || 0,
          ultimaLavagem: ultimaLavagem ? {
            id: ultimaLavagem.id,
            codigo: ultimaLavagem.codigo,
            data: dataUltimaLavagem,
            valor: ultimaLavagem.total,
            servico: ultimaLavagem.itens[0]?.servico.nome || "Lavagem",
          } : null,
          diasSemVir,
          carimbos,
          lavagensGratis,
          status: diasSemVir === null 
            ? "novo" 
            : diasSemVir <= 7 
              ? "ativo" 
              : diasSemVir <= 30 
                ? "regular" 
                : diasSemVir <= 60 
                  ? "inativo" 
                  : "sumido",
        };
      })
    );

    // Retornar também as configurações de fidelidade
    return NextResponse.json({
      clientes: clientesComDados,
      fidelidadeConfig: {
        ativa: fidelidadeAtiva,
        meta: metaFidelidade,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}

// POST - Cria cliente no lava jato logado
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { nome, telefone, email, planoMensal, participaFidelidade } = body;

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        telefone,
        email,
        planoMensal: planoMensal || false,
        participaFidelidade: participaFidelidade !== false, // default true
        lavaJatoId: session.lavaJatoId,
      },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao criar cliente" },
      { status: 500 }
    );
  }
}
