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
  const [menuAberto, setMenuAberto] = useState(false);

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
    { href: "/superadmin/lavajatos", icon: Building2, label: "Lava-Jatos" },
    { href: "/superadmin/admins", icon: Users, label: "Super Admins" },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-lg">Super Admin</p>
              <p className="text-slate-400 text-xs -mt-0.5">Lavify Control Panel</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-red-500/20 text-red-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User + Mobile Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-medium">{superAdmin?.nome}</p>
              <p className="text-slate-400 text-xs">{superAdmin?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Sair</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuAberto && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuAberto(false)} />
          <div className="absolute top-16 left-0 right-0 bg-slate-800 border-b border-slate-700 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
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
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}

