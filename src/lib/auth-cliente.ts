import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "lavajato-secret-key-change-in-production";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 dias

interface ClientSessionPayload {
  clienteId: string;
  type: "cliente";
}

// Gerar token para cliente
function generateClientToken(clienteId: string): string {
  return jwt.sign({ clienteId, type: "cliente" }, JWT_SECRET, { expiresIn: "30d" });
}

// Verificar token
function verifyClientToken(token: string): ClientSessionPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as ClientSessionPayload;
    if (payload.type !== "cliente") return null;
    return payload;
  } catch {
    return null;
  }
}

// Criar sessão do cliente
export async function createClientSession(clienteId: string) {
  const token = generateClientToken(clienteId);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await prisma.sessao.create({
    data: {
      token,
      clienteId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("cliente_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return token;
}

// Obter sessão do cliente
export async function getClientSession(): Promise<{ clienteId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("cliente_session")?.value;

  if (!token) return null;

  const payload = verifyClientToken(token);
  if (!payload) return null;

  const sessao = await prisma.sessao.findUnique({
    where: { token },
    include: { cliente: true },
  });

  if (!sessao || !sessao.cliente || sessao.expiresAt < new Date()) {
    if (sessao) {
      await prisma.sessao.delete({ where: { id: sessao.id } });
    }
    return null;
  }

  return { clienteId: sessao.clienteId! };
}

// Destruir sessão do cliente
export async function destroyClientSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cliente_session")?.value;

  if (token) {
    await prisma.sessao.deleteMany({ where: { token } });
    cookieStore.delete("cliente_session");
  }
}

