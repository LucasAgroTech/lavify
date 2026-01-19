import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSuperAdminSession } from "@/lib/superAdminAuth";
import {
  checkRateLimit,
  getClientIP,
  getRateLimitHeaders,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limit";
import { sanitizeString, isValidEmail } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting MUITO restritivo para superadmin
    const clientIP = getClientIP(request);
    // Usa "register" que tem limite mais baixo (3 tentativas por hora)
    const rateLimitResult = checkRateLimit(clientIP, "register");

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Acesso bloqueado temporariamente.",
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

    const email = sanitizeString(body.email || "").toLowerCase();
    const senha = body.senha || "";

    // 3. Validação básica
    if (!email || !senha) {
      recordFailedAttempt(clientIP, "register");
      return NextResponse.json(
        { error: "Email e senha são obrigatórios" },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    if (!isValidEmail(email)) {
      recordFailedAttempt(clientIP, "register");
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 4. Busca super admin
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { email },
    });

    if (!superAdmin) {
      recordFailedAttempt(clientIP, "register");
      // Delay artificial + resposta genérica
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    if (!superAdmin.ativo) {
      recordFailedAttempt(clientIP, "register");
      return NextResponse.json(
        { error: "Conta desativada" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 5. Verifica senha
    const senhaCorreta = await verifyPassword(senha, superAdmin.senha);
    if (!senhaCorreta) {
      recordFailedAttempt(clientIP, "register");
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 6. Login bem-sucedido - reseta rate limit
    resetRateLimit(clientIP, "register");

    // 7. Cria sessão
    await createSuperAdminSession(superAdmin.id, superAdmin.email);

    // Log de acesso (importante para auditoria)
    console.log(`[SUPERADMIN LOGIN] ${superAdmin.email} - IP: ${clientIP} - ${new Date().toISOString()}`);

    return NextResponse.json(
      {
        success: true,
        superAdmin: {
          id: superAdmin.id,
          nome: superAdmin.nome,
          email: superAdmin.email,
        },
      },
      { headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error("Erro no login super admin:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
