"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, Search, Calendar, CircleUser } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Função para verificar se o link está ativo
  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 pb-14 lg:pb-0">
      {/* Header Desktop */}
      <header className="hidden lg:block bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-800">Lavify</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/encontrar" className="text-slate-600 hover:text-slate-900 font-medium">
                Encontrar Lava Jato
              </Link>
              <Link href="/como-funciona" className="text-slate-600 hover:text-slate-900 font-medium">
                Como Funciona
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/entrar" className="text-slate-600 hover:text-slate-900 font-medium">
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Header Mobile - Compacto e Fixo */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 h-12">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-base text-slate-800">Lavify</span>
          </Link>
          
          <Link
            href="/perfil"
            className="flex items-center justify-center"
          >
            <CircleUser className="w-7 h-7 text-slate-600" />
          </Link>
        </div>
      </header>

      {/* Spacer para o header mobile */}
      <div className="h-12 lg:hidden" />

      {/* Content */}
      <main className="lg:min-h-[calc(100vh-64px)]">{children}</main>

      {/* Bottom Navigation Mobile - Fixo */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-pb">
        <div className="flex items-center justify-around h-14">
          <Link
            href="/"
            className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all ${
              isActive("/") 
                ? "text-cyan-600" 
                : "text-slate-500"
            }`}
          >
            <Droplets className={`w-6 h-6 ${isActive("/") ? "text-cyan-500" : ""}`} />
            <span className="text-[10px] font-medium">Início</span>
          </Link>
          <Link
            href="/encontrar"
            className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all ${
              isActive("/encontrar") 
                ? "text-cyan-600" 
                : "text-slate-500"
            }`}
          >
            <Search className={`w-6 h-6 ${isActive("/encontrar") ? "text-cyan-500" : ""}`} />
            <span className="text-[10px] font-medium">Buscar</span>
          </Link>
          <Link
            href="/meus-agendamentos"
            className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all ${
              isActive("/meus-agendamentos") 
                ? "text-cyan-600" 
                : "text-slate-500"
            }`}
          >
            <Calendar className={`w-6 h-6 ${isActive("/meus-agendamentos") ? "text-cyan-500" : ""}`} />
            <span className="text-[10px] font-medium">Agenda</span>
          </Link>
        </div>
      </nav>

      {/* Footer Desktop Only */}
      <footer className="hidden lg:block bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">Lavify</span>
              </div>
              <p className="text-slate-400 text-sm">
                A plataforma que conecta você aos melhores lava jatos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Para Clientes</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/encontrar" className="hover:text-white">Encontrar</Link></li>
                <li><Link href="/cadastro" className="hover:text-white">Criar Conta</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Para Lava Jatos</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/registro" className="hover:text-white">Cadastrar</Link></li>
                <li><Link href="/login" className="hover:text-white">Área do Parceiro</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/ajuda" className="hover:text-white">Ajuda</Link></li>
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500 text-sm">
            © 2026 Lavify
          </div>
        </div>
      </footer>
    </div>
  );
}
