"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  LayoutDashboard,
  Building2,
  LogOut,
  Menu,
  X,
  Loader2,
  Users,
  Target,
  BarChart3,
  Sparkles,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SuperAdmin {
  id: string;
  nome: string;
  email: string;
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Não aplicar layout nas páginas públicas (login e setup)
  const isPublicPage = pathname === "/superadmin/login" || pathname === "/superadmin/setup";

  useEffect(() => {
    if (isPublicPage) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/superadmin/auth/me");
        if (!res.ok) {
          router.replace("/superadmin/login");
          return;
        }
        const data = await res.json();
        setSuperAdmin(data);
      } catch {
        router.replace("/superadmin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [isPublicPage, router]);

  const handleLogout = async () => {
    await fetch("/api/superadmin/auth/logout", { method: "POST" });
    router.replace("/superadmin/login");
  };

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { href: "/superadmin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/superadmin/metricas", icon: BarChart3, label: "Métricas" },
    { href: "/superadmin/performance", icon: Activity, label: "Performance" },
    { href: "/superadmin/crm", icon: Target, label: "CRM" },
    { href: "/superadmin/lavajatos", icon: Building2, label: "Lava-Jatos" },
    { href: "/superadmin/usuarios", icon: Users, label: "Usuários" },
    { href: "/superadmin/blog", icon: Sparkles, label: "Blog IA" },
    { href: "/superadmin/admins", icon: Shield, label: "Super Admins" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar Desktop */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-full bg-slate-800 border-r border-slate-700 z-50 transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-56"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Super Admin</p>
                <p className="text-slate-500 text-xs">Lavify</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-500/20 text-red-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  } ${sidebarCollapsed ? "justify-center" : ""}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User + Collapse Button */}
        <div className="border-t border-slate-700 p-3">
          {!sidebarCollapsed && superAdmin && (
            <div className="mb-3 px-2">
              <p className="text-white text-sm font-medium truncate">{superAdmin.nome}</p>
              <p className="text-slate-500 text-xs truncate">{superAdmin.email}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-xl text-sm transition-colors ${
                sidebarCollapsed ? "w-full justify-center" : "flex-1"
              }`}
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span>Sair</span>}
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white rounded-xl transition-colors"
              title={sidebarCollapsed ? "Expandir" : "Recolher"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm">Super Admin</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-14 left-0 right-0 bottom-0 bg-slate-800 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-red-500/20 text-red-400"
                        : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-700">
              {superAdmin && (
                <div className="mb-4">
                  <p className="text-white font-medium">{superAdmin.nome}</p>
                  <p className="text-slate-500 text-sm">{superAdmin.email}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main
        className={`flex-1 min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-56"
        } pt-14 md:pt-0`}
      >
        {children}
      </main>
    </div>
  );
}
