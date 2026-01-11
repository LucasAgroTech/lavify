import { NextResponse } from "next/server";
import { destroySuperAdminSession } from "@/lib/superAdminAuth";

export async function POST() {
  try {
    await destroySuperAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json(
      { error: "Erro ao fazer logout" },
      { status: 500 }
    );
  }
}

