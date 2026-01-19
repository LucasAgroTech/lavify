import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// GET - Listar todos os leads com info de CRM
export async function GET(request: NextRequest) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Buscar todos os lava-jatos com suas informações de lead
    const lavaJatos = await prisma.lavaJato.findMany({
      where: {
        ...(search && {
          OR: [
            { nome: { contains: search, mode: "insensitive" } },
            { telefone: { contains: search, mode: "insensitive" } },
            { cnpj: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(status && {
          leadInfo: {
            status: status as "NOVO" | "CONTATO_INICIAL" | "EM_NEGOCIACAO" | "DEMONSTRACAO" | "CONVERTIDO" | "PERDIDO" | "INATIVO",
          },
        }),
      },
      include: {
        leadInfo: {
          include: {
            interacoes: {
              orderBy: { createdAt: "desc" },
              take: 5,
            },
          },
        },
        usuarios: {
          where: { role: "ADMIN" },
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
          take: 1,
        },
        _count: {
          select: {
            ordens: true,
            clientes: true,
            usuarios: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Buscar última atividade de cada lava-jato
    const ultimasAtividades = await prisma.atividadeLog.groupBy({
      by: ["lavaJatoId"],
      _max: { createdAt: true },
      where: {
        lavaJatoId: { not: null },
      },
    });

    const atividadesMap = new Map(
      ultimasAtividades.map((a) => [a.lavaJatoId, a._max.createdAt])
    );

    // Formatar dados para o frontend
    const leads = lavaJatos.map((lj) => ({
      id: lj.id,
      nome: lj.nome,
      telefone: lj.telefone,
      cnpj: lj.cnpj,
      endereco: lj.endereco,
      plano: lj.plano,
      stripeStatus: lj.stripeStatus,
      ativo: lj.ativo,
      createdAt: lj.createdAt,
      dono: lj.usuarios[0] || null,
      stats: {
        ordens: lj._count.ordens,
        clientes: lj._count.clientes,
        usuarios: lj._count.usuarios,
      },
      ultimaAtividade: atividadesMap.get(lj.id) || null,
      leadInfo: lj.leadInfo || {
        status: "NOVO",
        temperatura: 0,
        whatsappEnviado: false,
        whatsappRespondeu: false,
        emailEnviado: false,
        emailRespondeu: false,
        ligacaoFeita: false,
        ligacaoAtendeu: false,
        demonstracaoAgendada: false,
        demonstracaoRealizada: false,
        dataUltimoContato: null,
        dataProximoContato: null,
        notas: null,
        interacoes: [],
      },
    }));

    // Estatísticas
    const stats = {
      total: leads.length,
      novos: leads.filter((l) => l.leadInfo.status === "NOVO").length,
      emContato: leads.filter((l) => 
        ["CONTATO_INICIAL", "EM_NEGOCIACAO", "DEMONSTRACAO"].includes(l.leadInfo.status)
      ).length,
      convertidos: leads.filter((l) => l.leadInfo.status === "CONVERTIDO").length,
      perdidos: leads.filter((l) => l.leadInfo.status === "PERDIDO").length,
      inativos: leads.filter((l) => l.leadInfo.status === "INATIVO").length,
    };

    return NextResponse.json({ leads, stats });
  } catch (error) {
    console.error("Erro ao listar leads:", error);
    return NextResponse.json(
      { error: "Erro ao listar leads" },
      { status: 500 }
    );
  }
}
