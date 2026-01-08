"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: string;
  lavaJato: {
    id: string;
    nome: string;
    logoUrl?: string;
    corPrimaria: string;
  };
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Rotas públicas que não precisam de autenticação
const rotasPublicas = ["/login", "/registro"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Redireciona baseado no estado de auth
    if (!loading) {
      const isRotaPublica = rotasPublicas.includes(pathname);

      if (!usuario && !isRotaPublica) {
        router.push("/login");
      } else if (usuario && isRotaPublica) {
        router.push("/");
      }
    }
  }, [usuario, loading, pathname, router]);

  async function checkAuth() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUsuario(data);
      } else {
        setUsuario(null);
      }
    } catch {
      setUsuario(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, senha: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        await checkAuth();
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch {
      return { success: false, error: "Erro ao conectar ao servidor" };
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUsuario(null);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  async function refreshUser() {
    await checkAuth();
  }

  // Mostra loading enquanto verifica auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se está em rota pública, renderiza sem verificar auth
  if (rotasPublicas.includes(pathname)) {
    return (
      <AuthContext.Provider value={{ usuario, loading, login, logout, refreshUser }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Se não está logado e não é rota pública, não renderiza (vai redirecionar)
  if (!usuario) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

