"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Loader2 } from "lucide-react";

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
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    verificarAuth();
  }, []);

  async function verificarAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
        setAutenticado(true);
        // Buscar assinatura
        fetchSubscription();
      } else {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
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

  const handleCloseDrawer = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!autenticado) {
    return null;
  }

  const currentPlan = subscription?.plan.id || "STARTER";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Header - visible only on mobile */}
      <MobileHeader
        lavaJatoNome={usuario?.lavaJato.nome}
        corPrimaria={usuario?.lavaJato.corPrimaria}
        userName={usuario?.nome}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onMenuClick={() => setMobileMenuOpen(true)}
        userRole={usuario?.role}
        currentPlan={currentPlan}
      />

      {/* Mobile Drawer Menu */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={handleCloseDrawer}
        usuario={usuario}
        currentPlan={currentPlan}
      />
    </div>
  );
}
