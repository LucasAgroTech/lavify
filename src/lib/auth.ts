import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "lavajato-secret-key-change-in-production";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias

export interface SessionPayload {
  userId: string;
  lavaJatoId: string;
  role: string;
}

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verificar senha
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Gerar token JWT
export function generateToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verificar token JWT
export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

// Criar sessão no banco e cookie
export async function createSession(userId: string, lavaJatoId: string, role: string) {
  const token = generateToken({ userId, lavaJatoId, role });
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // Salva sessão no banco
  await prisma.sessao.create({
    data: {
      token,
      usuarioId: userId,
      expiresAt,
    },
  });

  // Define cookie
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

// Obter sessão atual
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  // Verifica JWT
  const payload = verifyToken(token);
  if (!payload) return null;

  // Verifica se sessão existe no banco
  const sessao = await prisma.sessao.findUnique({
    where: { token },
    include: { usuario: true },
  });

  if (!sessao || sessao.expiresAt < new Date()) {
    // Sessão expirada ou não existe
    if (sessao) {
      await prisma.sessao.delete({ where: { id: sessao.id } });
    }
    return null;
  }

  return {
    userId: sessao.usuarioId,
    lavaJatoId: sessao.usuario.lavaJatoId,
    role: sessao.usuario.role,
  };
}

// Logout - remover sessão
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    await prisma.sessao.deleteMany({ where: { token } });
    cookieStore.delete("session");
  }
}

// Verificar se usuário tem permissão
export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

// Permissões por funcionalidade
export const PERMISSIONS = {
  // Gerenciamento de equipe
  EQUIPE_VIEW: ["ADMIN", "GERENTE"],
  EQUIPE_MANAGE: ["ADMIN"],
  
  // Kanban - todos podem mover
  KANBAN_MOVE: ["ADMIN", "GERENTE", "ATENDENTE", "LAVADOR_SENIOR", "LAVADOR_JUNIOR"],
  
  // Agendamentos
  AGENDAMENTOS_VIEW: ["ADMIN", "GERENTE", "ATENDENTE", "LAVADOR_SENIOR", "LAVADOR_JUNIOR"],
  AGENDAMENTOS_MANAGE: ["ADMIN", "GERENTE", "ATENDENTE", "LAVADOR_SENIOR"],
  
  // Ordens de Serviço
  OS_CREATE: ["ADMIN", "GERENTE", "ATENDENTE", "LAVADOR_SENIOR"],
  OS_VIEW: ["ADMIN", "GERENTE", "ATENDENTE", "LAVADOR_SENIOR", "LAVADOR_JUNIOR"],
  
  // Clientes e Veículos
  CLIENTES_MANAGE: ["ADMIN", "GERENTE", "ATENDENTE"],
  VEICULOS_MANAGE: ["ADMIN", "GERENTE", "ATENDENTE", "LAVADOR_SENIOR"],
  
  // Serviços e Estoque
  SERVICOS_MANAGE: ["ADMIN", "GERENTE"],
  ESTOQUE_MANAGE: ["ADMIN", "GERENTE"],
  
  // Financeiro
  FINANCEIRO_VIEW: ["ADMIN"],
  FINANCEIRO_MANAGE: ["ADMIN"],
  
  // Dashboard completo vs simplificado
  DASHBOARD_FULL: ["ADMIN", "GERENTE"],
  DASHBOARD_BASIC: ["ATENDENTE", "LAVADOR_SENIOR", "LAVADOR_JUNIOR"],
} as const;

export function canAccess(userRole: string, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(userRole as never);
}

// Middleware helper para APIs - retorna sessão ou erro
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Não autorizado");
  }
  return session;
}

