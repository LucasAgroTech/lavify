import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSuperAdminSession } from "@/lib/superAdminAuth";

// GET - Buscar lead específico com histórico completo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id },
      include: {
        leadInfo: {
          include: {
            interacoes: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
        usuarios: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            role: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            ordens: true,
            clientes: true,
            servicos: true,
            produtos: true,
          },
        },
      },
    });

    if (!lavaJato) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    // Buscar atividades do lava-jato
    const atividades = await prisma.atividadeLog.findMany({
      where: { lavaJatoId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ lead: lavaJato, atividades });
  } catch (error) {
    console.error("Erro ao buscar lead:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lead" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar informações do lead (checklist, status, notas)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verificar se já existe leadInfo
    const existingLead = await prisma.leadInfo.findUnique({
      where: { lavaJatoId: id },
    });

    let leadInfo;

    if (existingLead) {
      // Atualizar existente
      leadInfo = await prisma.leadInfo.update({
        where: { lavaJatoId: id },
        data: {
          status: body.status,
          temperatura: body.temperatura,
          whatsappEnviado: body.whatsappEnviado,
          whatsappRespondeu: body.whatsappRespondeu,
          emailEnviado: body.emailEnviado,
          emailRespondeu: body.emailRespondeu,
          ligacaoFeita: body.ligacaoFeita,
          ligacaoAtendeu: body.ligacaoAtendeu,
          demonstracaoAgendada: body.demonstracaoAgendada,
          demonstracaoRealizada: body.demonstracaoRealizada,
          dataUltimoContato: body.dataUltimoContato ? new Date(body.dataUltimoContato) : undefined,
          dataProximoContato: body.dataProximoContato ? new Date(body.dataProximoContato) : undefined,
          notas: body.notas,
          motivoPerda: body.motivoPerda,
        },
      });
    } else {
      // Criar novo
      leadInfo = await prisma.leadInfo.create({
        data: {
          lavaJatoId: id,
          status: body.status || "NOVO",
          temperatura: body.temperatura || 0,
          whatsappEnviado: body.whatsappEnviado || false,
          whatsappRespondeu: body.whatsappRespondeu || false,
          emailEnviado: body.emailEnviado || false,
          emailRespondeu: body.emailRespondeu || false,
          ligacaoFeita: body.ligacaoFeita || false,
          ligacaoAtendeu: body.ligacaoAtendeu || false,
          demonstracaoAgendada: body.demonstracaoAgendada || false,
          demonstracaoRealizada: body.demonstracaoRealizada || false,
          dataUltimoContato: body.dataUltimoContato ? new Date(body.dataUltimoContato) : null,
          dataProximoContato: body.dataProximoContato ? new Date(body.dataProximoContato) : null,
          notas: body.notas || null,
          motivoPerda: body.motivoPerda || null,
        },
      });
    }

    return NextResponse.json({ success: true, leadInfo });
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar lead" },
      { status: 500 }
    );
  }
}

// POST - Adicionar interação ao lead
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Garantir que existe leadInfo
    let leadInfo = await prisma.leadInfo.findUnique({
      where: { lavaJatoId: id },
    });

    if (!leadInfo) {
      leadInfo = await prisma.leadInfo.create({
        data: { lavaJatoId: id },
      });
    }

    // Criar interação
    const interacao = await prisma.leadInteracao.create({
      data: {
        leadInfoId: leadInfo.id,
        tipo: body.tipo,
        descricao: body.descricao,
        resultado: body.resultado,
      },
    });

    // Atualizar data do último contato
    await prisma.leadInfo.update({
      where: { id: leadInfo.id },
      data: { dataUltimoContato: new Date() },
    });

    return NextResponse.json({ success: true, interacao });
  } catch (error) {
    console.error("Erro ao adicionar interação:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar interação" },
      { status: 500 }
    );
  }
}
