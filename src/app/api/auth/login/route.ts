import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import {
  checkRateLimit,
  getClientIP,
  getRateLimitHeaders,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limit";
import { validateLogin, sanitizeString } from "@/lib/validation";

// POST - Login
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

    // 2. Parse e validação do body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
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

    // 5. Busca usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        lavaJato: {
          select: {
            id: true,
            nome: true,
            ativo: true,
          },
        },
      },
    });

    // Resposta genérica para não revelar se email existe
    if (!usuario) {
      recordFailedAttempt(clientIP, "login");
      // Delay artificial para dificultar timing attacks
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 6. Verifica se usuário está ativo
    if (!usuario.ativo) {
      recordFailedAttempt(clientIP, "login");
      return NextResponse.json(
        { error: "Usuário desativado. Entre em contato com o administrador." },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 7. Verifica se lava jato está ativo
    if (!usuario.lavaJato.ativo) {
      recordFailedAttempt(clientIP, "login");
      return NextResponse.json(
        { error: "Estabelecimento desativado. Entre em contato com o suporte." },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 8. Verifica senha
    const senhaValida = await verifyPassword(senha, usuario.senha);

    if (!senhaValida) {
      recordFailedAttempt(clientIP, "login");
      return NextResponse.json(
        { error: "Email ou senha incorretos" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 9. Login bem-sucedido - reseta rate limit
    resetRateLimit(clientIP, "login");

    // 10. Cria sessão
    await createSession(usuario.id, usuario.lavaJatoId, usuario.role);

    return NextResponse.json(
      {
        success: true,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
        },
        lavaJato: {
          id: usuario.lavaJato.id,
          nome: usuario.lavaJato.nome,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
