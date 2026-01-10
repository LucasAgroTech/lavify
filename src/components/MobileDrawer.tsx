"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  X,
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
  Calendar,
  UsersRound,
  Crown,
  Lock,
  ChevronRight,
} from "lucide-react";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
  requiredPlan?: string[];
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

const planBadges: Record<string, { label: string; bgColor: string; textColor: string }> = {
  STARTER: { label: "Starter", bgColor: "bg-slate-100", textColor: "text-slate-600" },
  PRO: { label: "Pro", bgColor: "bg-cyan-100", textColor: "text-cyan-700" },
  PREMIUM: { label: "Premium", bgColor: "bg-amber-100", textColor: "text-amber-700" },
};

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: {
    id: string;
    nome: string;
    email: string;
    role: string;
    lavaJato: {
      nome: string;
      corPrimaria: string;
    };
  } | null;
  currentPlan: string;
}

export function MobileDrawer({ isOpen, onClose, usuario, currentPlan }: MobileDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Fechar ao mudar de rota
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Bloquear scroll do body quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  if (!isOpen) return null;

  const planBadge = planBadges[currentPlan] || planBadges.STARTER;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${usuario?.lavaJato.corPrimaria || "#06b6d4"}, #3b82f6)`,
              }}
            >
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                {usuario?.lavaJato.nome || "Lavify"}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${planBadge.bgColor} ${planBadge.textColor}`}>
                Plano {planBadge.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {usuario?.nome?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-800 truncate">
                {usuario?.nome || "Usuário"}
              </p>
              <p className="text-xs text-slate-500">
                {roleLabels[usuario?.role || ""] || "Membro"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {menuItems
            .filter((item) => {
              if (!item.roles) return true;
              return usuario?.role && item.roles.includes(usuario.role);
            })
            .map((item) => {
              const isActive = pathname === item.href;
              const isLocked = item.requiredPlan && !item.requiredPlan.includes(currentPlan);

              if (isLocked) {
                return (
                  <Link
                    key={item.href}
                    href="/planos"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 bg-slate-50"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 font-medium">{item.label}</span>
                    <Lock className="w-4 h-4" />
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-cyan-50 text-cyan-600"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-cyan-500" : ""}`} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ${isActive ? "text-cyan-500" : "text-slate-300"}`} />
                </Link>
              );
            })}

          {/* Planos */}
          {usuario?.role === "ADMIN" && (
            <Link
              href="/planos"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                pathname === "/planos"
                  ? "bg-amber-50 text-amber-600"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Crown className={`w-5 h-5 ${pathname === "/planos" ? "text-amber-500" : ""}`} />
              <span className="flex-1 font-medium">Planos e Assinatura</span>
              <ChevronRight className={`w-4 h-4 ${pathname === "/planos" ? "text-amber-500" : "text-slate-300"}`} />
            </Link>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 space-y-2">
          <Link
            href="/configuracoes"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configurações</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair da conta</span>
          </button>
        </div>
      </div>
    </>
  );
}

