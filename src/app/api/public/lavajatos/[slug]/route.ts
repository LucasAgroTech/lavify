import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Detalhes de um lava jato específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const lavaJato = await prisma.lavaJato.findUnique({
      where: { slug, ativo: true },
      select: {
        id: true,
        nome: true,
        slug: true,
        telefone: true,
        whatsapp: true,
        email: true,
        endereco: true,
        cidade: true,
        estado: true,
        cep: true,
        latitude: true,
        longitude: true,
        descricao: true,
        logoUrl: true,
        bannerUrl: true,
        corPrimaria: true,
        horarioFuncionamento: true,
        aceitaAgendamento: true,
        tempoMinimoAgendamento: true,
        verificado: true,
        // Todos os serviços ativos
        servicos: {
          where: { ativo: true },
          select: {
            id: true,
            nome: true,
            descricao: true,
            preco: true,
            tempoEstimado: true,
            destaque: true,
          },
          orderBy: [
            { destaque: "desc" },
            { nome: "asc" },
          ],
        },
        // Avaliações recentes
        avaliacoes: {
          select: {
            id: true,
            nota: true,
            comentario: true,
            createdAt: true,
            cliente: {
              select: {
                nome: true,
                fotoUrl: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: {
            avaliacoes: true,
          },
        },
      },
    });

    if (!lavaJato) {
      return NextResponse.json(
        { error: "Lava jato não encontrado" },
        { status: 404 }
      );
    }

    // Calcula média das avaliações
    const todasAvaliacoes = await prisma.avaliacao.findMany({
      where: { lavaJatoId: lavaJato.id },
      select: { nota: true },
    });

    const somaNotas = todasAvaliacoes.reduce((acc, a) => acc + a.nota, 0);
    const mediaNotas = todasAvaliacoes.length > 0 ? somaNotas / todasAvaliacoes.length : 0;

    return NextResponse.json({
      ...lavaJato,
      mediaAvaliacoes: Math.round(mediaNotas * 10) / 10,
      totalAvaliacoes: lavaJato._count.avaliacoes,
    });
  } catch (error) {
    console.error("Erro ao buscar lava jato:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lava jato" },
      { status: 500 }
    );
  }
}

