import { NextResponse } from "next/server";
import { destroyClientSession } from "@/lib/auth-cliente";

export async function POST() {
  try {
    await destroyClientSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
    return NextResponse.json({ error: "Erro ao fazer logout" }, { status: 500 });
  }
}

