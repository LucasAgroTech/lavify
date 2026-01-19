import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import {
  checkRateLimit,
  getClientIP,
  getRateLimitHeaders,
  recordFailedAttempt,
  resetRateLimit,
} from "@/lib/rate-limit";
import { validateRegistration, sanitizeString } from "@/lib/validation";

// POST - Registrar novo lava jato + usuário admin
export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting por IP (mais restritivo para registro)
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, "register");

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: rateLimitResult.blocked
            ? "Muitas tentativas de cadastro. Tente novamente mais tarde."
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
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    // 3. Sanitização de entrada
    const dadosSanitizados = {
      nomeLavaJato: sanitizeString(body.nomeLavaJato || ""),
      cnpj: sanitizeString(body.cnpj || "").replace(/\D/g, ""),
      telefoneLavaJato: sanitizeString(body.telefoneLavaJato || ""),
      endereco: sanitizeString(body.endereco || ""),
      nome: sanitizeString(body.nome || ""),
      email: sanitizeString(body.email || "").toLowerCase(),
      senha: body.senha || "", // Não sanitizar senha (pode ter caracteres especiais)
      telefone: sanitizeString(body.telefone || ""),
    };

    // 4. Validação completa
    const validation = validateRegistration(dadosSanitizados);
    if (!validation.valid) {
      recordFailedAttempt(clientIP, "register");
      return NextResponse.json(
        { error: Object.values(validation.errors)[0], errors: validation.errors },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 5. Verifica se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: dadosSanitizados.email },
    });

    if (usuarioExistente) {
      recordFailedAttempt(clientIP, "register");
      // Delay artificial para não revelar informação
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    // 6. Verifica se CNPJ já existe (se fornecido)
    if (dadosSanitizados.cnpj) {
      const lavaJatoExistente = await prisma.lavaJato.findUnique({
        where: { cnpj: dadosSanitizados.cnpj },
      });

      if (lavaJatoExistente) {
        recordFailedAttempt(clientIP, "register");
        return NextResponse.json(
          { error: "Este CNPJ já está cadastrado" },
          { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
        );
      }
    }

    // 7. Hash da senha
    const senhaHash = await hashPassword(dadosSanitizados.senha);

    // 8. Cria o lava jato e o usuário admin em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Gera slug único
      const baseSlug = dadosSanitizados.nomeLavaJato
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Verifica se slug já existe e adiciona número se necessário
      let slug = baseSlug;
      let counter = 1;
      while (await tx.lavaJato.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Cria o lava jato
      const lavaJato = await tx.lavaJato.create({
        data: {
          nome: dadosSanitizados.nomeLavaJato,
          slug,
          cnpj: dadosSanitizados.cnpj || null,
          telefone: dadosSanitizados.telefoneLavaJato || null,
          endereco: dadosSanitizados.endereco || null,
        },
      });

      // Cria o usuário admin
      const usuario = await tx.usuario.create({
        data: {
          email: dadosSanitizados.email,
          senha: senhaHash,
          nome: dadosSanitizados.nome,
          telefone: dadosSanitizados.telefone || null,
          role: "ADMIN",
          lavaJatoId: lavaJato.id,
        },
      });

      return { lavaJato, usuario };
    });

    // 9. Registro bem-sucedido - reseta rate limit
    resetRateLimit(clientIP, "register");

    // 10. Cria a sessão
    await createSession(
      resultado.usuario.id,
      resultado.lavaJato.id,
      resultado.usuario.role
    );

    return NextResponse.json(
      {
        success: true,
        usuario: {
          id: resultado.usuario.id,
          nome: resultado.usuario.nome,
          email: resultado.usuario.email,
          role: resultado.usuario.role,
        },
        lavaJato: {
          id: resultado.lavaJato.id,
          nome: resultado.lavaJato.nome,
        },
      },
      { status: 201, headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error("Erro ao registrar:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
