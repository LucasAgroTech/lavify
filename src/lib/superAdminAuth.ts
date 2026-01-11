import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "lavajato-secret-key-change-in-production";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas (mais curto por segurança)

export interface SuperAdminPayload {
  superAdminId: string;
  email: string;
  isSuperAdmin: true;
}

// Hash de senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Verificar senha
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Gerar token JWT para Super Admin
export function generateSuperAdminToken(payload: SuperAdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

// Verificar token JWT
export function verifySuperAdminToken(token: string): SuperAdminPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SuperAdminPayload;
    if (!payload.isSuperAdmin) return null;
    return payload;
  } catch {
    return null;
  }
}

// Criar sessão de Super Admin
export async function createSuperAdminSession(superAdminId: string, email: string) {
  const token = generateSuperAdminToken({ superAdminId, email, isSuperAdmin: true });
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // Salva sessão no banco
  await prisma.sessaoSuperAdmin.create({
    data: {
      token,
      superAdminId,
      expiresAt,
    },
  });

  // Define cookie separado para super admin
  const cookieStore = await cookies();
  cookieStore.set("superadmin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

// Obter sessão de Super Admin
export async function getSuperAdminSession(): Promise<SuperAdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("superadmin_session")?.value;

  if (!token) return null;

  // Verifica JWT
  const payload = verifySuperAdminToken(token);
  if (!payload) return null;

  // Verifica se sessão existe no banco
  const sessao = await prisma.sessaoSuperAdmin.findUnique({
    where: { token },
    include: { superAdmin: true },
  });

  if (!sessao || sessao.expiresAt < new Date()) {
    // Sessão expirada ou não existe
    if (sessao) {
      await prisma.sessaoSuperAdmin.delete({ where: { id: sessao.id } });
    }
    return null;
  }

  if (!sessao.superAdmin.ativo) {
    return null;
  }

  return {
    superAdminId: sessao.superAdminId,
    email: sessao.superAdmin.email,
    isSuperAdmin: true,
  };
}

// Logout de Super Admin
export async function destroySuperAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("superadmin_session")?.value;

  if (token) {
    await prisma.sessaoSuperAdmin.deleteMany({ where: { token } });
    cookieStore.delete("superadmin_session");
  }
}

// Middleware helper para APIs - retorna sessão ou erro
export async function requireSuperAdmin(): Promise<SuperAdminPayload> {
  const session = await getSuperAdminSession();
  if (!session) {
    throw new Error("Acesso negado - Super Admin necessário");
  }
  return session;
}

