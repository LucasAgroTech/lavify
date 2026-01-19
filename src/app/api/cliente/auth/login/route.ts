import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createClientSession } from "@/lib/auth-cliente";
import {
  checkRateLimit,
  getClientIP,
  getRateLimitHeaders,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limit";
import { validateLogin, sanitizeString } from "@/lib/validation";

// POST - Login de cliente
export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting por IP
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, "login");

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: rateLimitResult.blocked
            ? "Muitas tentativas de login. Tente novamente mais tarde."
            : "Limite de requisições excedido. Aguarde.",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    // 2. Parse do body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // 3. Sanitização
    const email = sanitizeString(body.email || "").toLowerCase();
    const senha = body.senha || "";

    // 4. Validação
    const validation = validateLogin({ email, senha });
    if (!validation.valid) {
      recordFailedAttempt(clientIP, "login");
      return NextResponse.json(
        { error: Object.values(validation.errors)[0] },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 5. Busca cliente
    const cliente = await prisma.cliente.findUnique({
      where: { email },
    });

    if (!cliente || !cliente.senha) {
      recordFailedAttempt(clientIP, "login");
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 6. Verifica senha
    const senhaValida = await verifyPassword(senha, cliente.senha);

    if (!senhaValida) {
      recordFailedAttempt(clientIP, "login");
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 7. Login bem-sucedido - reseta rate limit
    resetRateLimit(clientIP, "login");

    // 8. Cria sessão
    await createClientSession(cliente.id);

    return NextResponse.json(
      {
        success: true,
        cliente: {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
