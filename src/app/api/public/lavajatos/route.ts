import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Lista lava jatos públicos (para clientes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cidade = searchParams.get("cidade");
    const busca = searchParams.get("busca");

    const lavajatos = await prisma.lavaJato.findMany({
      where: {
        ativo: true,
        ...(cidade && { cidade: { contains: cidade } }),
        ...(busca && {
          OR: [
            { nome: { contains: busca } },
            { endereco: { contains: busca } },
            { cidade: { contains: busca } },
          ],
        }),
      },
      select: {
        id: true,
        nome: true,
        slug: true,
        telefone: true,
        whatsapp: true,
        endereco: true,
        cidade: true,
        estado: true,
        descricao: true,
        logoUrl: true,
        bannerUrl: true,
        corPrimaria: true,
        horarioFuncionamento: true,
        aceitaAgendamento: true,
        verificado: true,
        // Média de avaliações
        avaliacoes: {
          select: {
            nota: true,
          },
        },
        // Serviços em destaque
        servicos: {
          where: { ativo: true, destaque: true },
          select: {
            id: true,
            nome: true,
            preco: true,
            tempoEstimado: true,
          },
          take: 4,
        },
        _count: {
          select: {
            avaliacoes: true,
          },
        },
      },
      orderBy: [
        { verificado: "desc" },
        { nome: "asc" },
      ],
    });

    // Calcula média das avaliações
    const lavaJatosComMedia = lavajatos.map((lj) => {
      const somaNotas = lj.avaliacoes.reduce((acc, a) => acc + a.nota, 0);
      const mediaNotas = lj.avaliacoes.length > 0 ? somaNotas / lj.avaliacoes.length : 0;

      return {
        ...lj,
        avaliacoes: undefined,
        mediaAvaliacoes: Math.round(mediaNotas * 10) / 10,
        totalAvaliacoes: lj._count.avaliacoes,
      };
    });

    return NextResponse.json(lavaJatosComMedia);
  } catch (error) {
    console.error("Erro ao buscar lava jatos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lava jatos" },
      { status: 500 }
    );
  }
}

