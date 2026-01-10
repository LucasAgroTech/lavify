"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Columns3,
  Users,
  Car,
  Wrench,
  Package,
  DollarSign,
  Droplets,
  LogOut,
  Settings,
  ChevronDown,
  Calendar,
  UsersRound,
  Crown,
  Sparkles,
  Lock,
} from "lucide-react";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  lavaJato: {
    id: string;
    nome: string;
    logoUrl?: string;
    corPrimaria: string;
    plano: string;
  };
}

interface SubscriptionInfo {
  plan: {
    id: string;
    name: string;
  };
  subscription: {
    isInTrial: boolean;
    trialDaysRemaining: number;
  };
}

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
  requiredPlan?: string[]; // Planos que têm acesso
}

const menuItems: MenuItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agendamentos", label: "Agendamentos", icon: Calendar, requiredPlan: ["PRO", "PREMIUM"] },
  { href: "/kanban", label: "Fila do Pátio", icon: Columns3 },
  { href: "/nova-os", label: "Nova OS", icon: Wrench, roles: ["ADMIN", "GERENTE", "ATENDENTE", "LAVADOR_SENIOR"] },
  { href: "/clientes", label: "Clientes", icon: Users, roles: ["ADMIN", "GERENTE", "ATENDENTE"] },
  { href: "/veiculos", label: "Veículos", icon: Car, roles: ["ADMIN", "GERENTE", "ATENDENTE"] },
  { href: "/servicos", label: "Serviços", icon: Droplets, roles: ["ADMIN", "GERENTE"] },
  { href: "/estoque", label: "Estoque", icon: Package, roles: ["ADMIN", "GERENTE"], requiredPlan: ["PRO", "PREMIUM"] },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign, roles: ["ADMIN"], requiredPlan: ["PREMIUM"] },
  { href: "/equipe", label: "Equipe", icon: UsersRound, roles: ["ADMIN", "GERENTE"] },
];

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  GERENTE: "Gerente",
  ATENDENTE: "Atendente",
  LAVADOR_SENIOR: "Lavador Sênior",
  LAVADOR_JUNIOR: "Lavador Júnior",
};

const planBadges: Record<string, { label: string; color: string }> = {
  STARTER: { label: "Starter", color: "bg-slate-500" },
  PRO: { label: "Pro", color: "bg-cyan-500" },
  PREMIUM: { label: "Premium", color: "bg-amber-500" },
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchUsuario();
    fetchSubscription();
  }, []);

  async function fetchUsuario() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  }

  async function fetchSubscription() {
    try {
      const res = await fetch("/api/assinatura");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Erro ao buscar assinatura:", error);
    }
  }

  const currentPlan = subscription?.plan.id || "STARTER";

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl z-50 flex flex-col">
      {/* Logo e Nome do Lava Jato */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-700/50">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${usuario?.lavaJato.corPrimaria || "#06b6d4"}, #3b82f6)`,
            boxShadow: `0 10px 20px -5px ${usuario?.lavaJato.corPrimaria || "#06b6d4"}40`
          }}
        >
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-lg tracking-tight truncate">
            {usuario?.lavaJato.nome || "Carregando..."}
          </h1>
          <p className="text-xs text-slate-400">Sistema de Gestão</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems
          .filter((item) => {
            // Se não tem restrição de roles, todos podem ver
            if (!item.roles) return true;
            // Verifica se o usuário tem permissão
            return usuario?.role && item.roles.includes(usuario.role);
          })
          .map((item) => {
            const isActive = pathname === item.href;
            const isLocked = item.requiredPlan && !item.requiredPlan.includes(currentPlan);
            
            // Se está bloqueado, mostra com ícone de cadeado
            if (isLocked) {
              return (
                <Link
                  key={item.href}
                  href="/planos"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-700/30 transition-all duration-200 group"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  <Lock className="w-4 h-4 ml-auto text-slate-600" />
                </Link>
              );
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/10"
                    : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-cyan-400" : ""
                  }`}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                )}
              </Link>
            );
          })}
        
        {/* Link de Planos - sempre visível para Admin */}
        {usuario?.role === "ADMIN" && (
          <Link
            href="/planos"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              pathname === "/planos"
                ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 shadow-lg shadow-amber-500/10"
                : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
            }`}
          >
            <Crown className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              pathname === "/planos" ? "text-amber-400" : ""
            }`} />
            <span className="font-medium">Planos</span>
            {pathname === "/planos" && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
            )}
          </Link>
        )}
      </nav>
      
      {/* Banner de Upgrade (para plano Starter) */}
      {usuario?.role === "ADMIN" && currentPlan === "STARTER" && (
        <div className="px-4 pb-2">
          <Link
            href="/planos"
            className="block p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl hover:border-cyan-500/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-semibold">Faça Upgrade</span>
            </div>
            <p className="text-slate-400 text-xs">
              Desbloqueie todas as funcionalidades
            </p>
          </Link>
        </div>
      )}

      {/* Usuário */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {usuario?.nome?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="font-medium text-sm truncate">
                {usuario?.nome || "Carregando..."}
              </p>
              <p className="text-xs text-slate-400">
                {roleLabels[usuario?.role || ""] || usuario?.role}
              </p>
            </div>
            <ChevronDown 
              className={`w-4 h-4 text-slate-400 transition-transform ${showMenu ? "rotate-180" : ""}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
              <Link
                href="/configuracoes"
                className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Configurações</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
