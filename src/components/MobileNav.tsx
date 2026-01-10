"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Columns3,
  Wrench,
  Menu,
  Crown,
} from "lucide-react";

interface MobileNavProps {
  onMenuClick: () => void;
  userRole?: string;
  currentPlan?: string;
}

// Itens principais para a navegação mobile (máximo 5)
const mobileNavItems = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/kanban", label: "Pátio", icon: Columns3 },
  { href: "/nova-os", label: "Nova OS", icon: Wrench, highlight: true },
];

export function MobileNav({ onMenuClick, userRole, currentPlan }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          
          // Botão destacado para Nova OS
          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-medium text-slate-600 mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px]"
            >
              <item.icon
                className={`w-6 h-6 ${
                  isActive ? "text-cyan-500" : "text-slate-400"
                }`}
              />
              <span
                className={`text-[10px] font-medium mt-1 ${
                  isActive ? "text-cyan-600" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-cyan-500" />
              )}
            </Link>
          );
        })}

        {/* Planos (se admin) */}
        {userRole === "ADMIN" && (
          <Link
            href="/planos"
            className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px]"
          >
            <Crown
              className={`w-6 h-6 ${
                pathname === "/planos" ? "text-amber-500" : "text-slate-400"
              }`}
            />
            <span
              className={`text-[10px] font-medium mt-1 ${
                pathname === "/planos" ? "text-amber-600" : "text-slate-500"
              }`}
            >
              Planos
            </span>
          </Link>
        )}

        {/* Menu Hamburger */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px]"
        >
          <Menu className="w-6 h-6 text-slate-400" />
          <span className="text-[10px] font-medium text-slate-500 mt-1">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}

