"use client";

import { Droplets, Bell } from "lucide-react";

interface MobileHeaderProps {
  lavaJatoNome?: string;
  corPrimaria?: string;
  userName?: string;
}

export function MobileHeader({ lavaJatoNome, corPrimaria, userName }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-40 lg:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo e Nome */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
            style={{
              background: `linear-gradient(135deg, ${corPrimaria || "#06b6d4"}, #3b82f6)`,
            }}
          >
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm truncate max-w-[140px]">
              {lavaJatoNome || "Lavify"}
            </h1>
            {userName && (
              <p className="text-[10px] text-slate-500">
                Olá, {userName.split(" ")[0]}!
              </p>
            )}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <button className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            {/* Badge de notificação */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

