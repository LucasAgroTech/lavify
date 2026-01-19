import { prisma } from "@/lib/prisma";

type TipoAtividade =
  | "LOGIN"
  | "LOGOUT"
  | "OS_CRIADA"
  | "OS_FINALIZADA"
  | "OS_ENTREGUE"
  | "CLIENTE_CRIADO"
  | "VEICULO_CRIADO"
  | "AGENDAMENTO_CRIADO"
  | "PAGAMENTO_RECEBIDO"
  | "SERVICO_CRIADO"
  | "PRODUTO_CRIADO"
  | "EQUIPE_CRIADA"
  | "CONFIG_ALTERADA"
  | "PAGINA_ACESSADA";

interface LogAtividadeParams {
  lavaJatoId?: string | null;
  usuarioId?: string | null;
  usuarioNome?: string | null;
  usuarioEmail?: string | null;
  tipo: TipoAtividade;
  descricao: string;
  metadata?: Record<string, unknown>;
  pagina?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAtividade(params: LogAtividadeParams) {
  try {
    await prisma.atividadeLog.create({
      data: {
        lavaJatoId: params.lavaJatoId,
        usuarioId: params.usuarioId,
        usuarioNome: params.usuarioNome,
        usuarioEmail: params.usuarioEmail,
        tipo: params.tipo,
        descricao: params.descricao,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        pagina: params.pagina,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    // Log silencioso - não deve quebrar a aplicação
    console.error("Erro ao logar atividade:", error);
  }
}

// Helper para extrair IP da request
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}
