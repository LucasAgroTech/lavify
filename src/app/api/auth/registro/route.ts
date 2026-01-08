import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

// POST - Registrar novo lava jato + usuário admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      // Dados do lava jato
      nomeLavaJato,
      cnpj,
      telefoneLavaJato,
      endereco,
      // Dados do usuário
      nome,
      email,
      senha,
      telefone,
    } = body;

    // Verifica se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    // Verifica se CNPJ já existe (se fornecido)
    if (cnpj) {
      const lavaJatoExistente = await prisma.lavaJato.findUnique({
        where: { cnpj },
      });

      if (lavaJatoExistente) {
        return NextResponse.json(
          { error: "Este CNPJ já está cadastrado" },
          { status: 400 }
        );
      }
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha);

    // Cria o lava jato e o usuário admin em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Gera slug único
      const baseSlug = nomeLavaJato
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
          nome: nomeLavaJato,
          slug,
          cnpj,
          telefone: telefoneLavaJato,
          endereco,
        },
      });

      // Cria o usuário admin
      const usuario = await tx.usuario.create({
        data: {
          email,
          senha: senhaHash,
          nome,
          telefone,
          role: "ADMIN",
          lavaJatoId: lavaJato.id,
        },
      });

      return { lavaJato, usuario };
    });

    // Cria a sessão
    await createSession(
      resultado.usuario.id,
      resultado.lavaJato.id,
      resultado.usuario.role
    );

    return NextResponse.json({
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
    }, { status: 201 });

  } catch (error) {
    console.error("Erro ao registrar:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}

