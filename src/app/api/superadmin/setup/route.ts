import { NextResponse } from "next/server";

// Setup desabilitado por segurança
// Novos super admins devem ser criados pelo painel de super admin

export async function POST() {
  return NextResponse.json(
    { error: "Setup desabilitado. Contate um Super Admin existente." },
    { status: 403 }
  );
}

export async function GET() {
  return NextResponse.json({
    setupNecessario: false,
    mensagem: "Setup desabilitado por segurança.",
  });
}

