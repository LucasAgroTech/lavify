"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock } from "lucide-react";
import Link from "next/link";

export default function SuperAdminSetup() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para login após 3 segundos
    const timer = setTimeout(() => {
      router.replace("/superadmin/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg mb-6">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Setup Desabilitado</h1>
        
        <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
          Por motivos de segurança, o setup público foi desabilitado. Novos Super Admins só podem ser criados por um administrador existente.
        </p>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">Precisa de acesso?</p>
              <p className="text-slate-400 text-xs">Contate um Super Admin existente</p>
            </div>
          </div>
        </div>

        <Link
          href="/superadmin/login"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
        >
          Ir para Login
        </Link>

        <p className="text-slate-500 text-xs mt-6">
          Redirecionando automaticamente em 5 segundos...
        </p>
      </div>
    </div>
  );
}

