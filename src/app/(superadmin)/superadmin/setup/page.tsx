"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Loader2, AlertCircle, Check, Key } from "lucide-react";

export default function SuperAdminSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [setupNecessario, setSetupNecessario] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const res = await fetch("/api/superadmin/setup");
        const data = await res.json();
        setSetupNecessario(data.setupNecessario);

        if (!data.setupNecessario) {
          router.replace("/superadmin/login");
        }
      } catch {
        setErro("Erro ao verificar setup");
      } finally {
        setLoading(false);
      }
    };

    checkSetup();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);

    try {
      const res = await fetch("/api/superadmin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha, nome, setupKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao criar Super Admin");
        return;
      }

      setSucesso(true);
      setTimeout(() => {
        router.replace("/superadmin/login");
      }, 2000);
    } catch {
      setErro("Erro de conexão");
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!setupNecessario) {
    return null;
  }

  if (sucesso) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Super Admin Criado!</h1>
          <p className="text-slate-400">Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

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

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Setup Inicial</h1>
          <p className="text-slate-400 text-sm mt-1">
            Configure o primeiro Super Admin do sistema
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Seu nome"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@lavify.com.br"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Senha (mínimo 8 caracteres)
              </label>
              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Setup Key */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Key className="w-4 h-4 inline mr-1" />
                Chave de Setup
              </label>
              <input
                type="password"
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Chave secreta de setup"
                required
              />
              <p className="text-slate-500 text-xs mt-1">
                Fornecida pelo desenvolvedor do sistema
              </p>
            </div>

            {/* Erro */}
            {erro && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {erro}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={salvando}
              className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {salvando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Criar Super Admin
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

