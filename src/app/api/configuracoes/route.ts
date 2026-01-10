import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET - Buscar configurações do lava-rápido
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const lavaJato = await prisma.lavaJato.findUnique({
      where: { id: session.lavaJatoId },
      select: {
        id: true,
        nome: true,
        slug: true,
        cnpj: true,
        telefone: true,
        endereco: true,
        logoUrl: true,
        corPrimaria: true,
        ativo: true,
        plano: true,
        createdAt: true,
      },
    });

    if (!lavaJato) {
      return NextResponse.json({ error: "Lava-rápido não encontrado" }, { status: 404 });
    }

    return NextResponse.json(lavaJato);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// PATCH - Atualizar configurações do lava-rápido
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Apenas ADMIN pode editar configurações
    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const body = await request.json();
    const { nome, slug, cnpj, telefone, endereco, corPrimaria } = body;

    // Validações básicas
    if (nome !== undefined && nome.trim().length < 3) {
      return NextResponse.json({ error: "Nome deve ter pelo menos 3 caracteres" }, { status: 400 });
    }

    // Verificar se slug já existe (se foi alterado)
    if (slug) {
      const slugFormatado = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      const existeSlug = await prisma.lavaJato.findFirst({
        where: {
          slug: slugFormatado,
          id: { not: session.lavaJatoId },
        },
      });

      if (existeSlug) {
        return NextResponse.json({ error: "Este slug já está em uso" }, { status: 400 });
      }
    }

    // Verificar se CNPJ já existe (se foi alterado)
    if (cnpj) {
      const cnpjLimpo = cnpj.replace(/\D/g, "");
      if (cnpjLimpo.length > 0 && cnpjLimpo.length !== 14) {
        return NextResponse.json({ error: "CNPJ inválido" }, { status: 400 });
      }

      if (cnpjLimpo.length === 14) {
        const existeCnpj = await prisma.lavaJato.findFirst({
          where: {
            cnpj: cnpjLimpo,
            id: { not: session.lavaJatoId },
          },
        });

        if (existeCnpj) {
          return NextResponse.json({ error: "Este CNPJ já está cadastrado" }, { status: 400 });
        }
      }
    }

    // Montar objeto de atualização
    const updateData: Record<string, unknown> = {};

    if (nome !== undefined) updateData.nome = nome.trim();
    if (slug !== undefined) updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (cnpj !== undefined) updateData.cnpj = cnpj.replace(/\D/g, "") || null;
    if (telefone !== undefined) updateData.telefone = telefone || null;
    if (endereco !== undefined) updateData.endereco = endereco || null;
    if (corPrimaria !== undefined) updateData.corPrimaria = corPrimaria;

    const lavaJatoAtualizado = await prisma.lavaJato.update({
      where: { id: session.lavaJatoId },
      data: updateData,
      select: {
        id: true,
        nome: true,
        slug: true,
        cnpj: true,
        telefone: true,
        endereco: true,
        logoUrl: true,
        corPrimaria: true,
        ativo: true,
        plano: true,
      },
    });

    return NextResponse.json(lavaJatoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

