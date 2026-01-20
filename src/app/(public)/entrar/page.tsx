"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Droplets,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function EntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const res = await fetch("/api/cliente/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/meus-agendamentos");
        router.refresh();
      } else {
        setErro(data.error || "Email ou senha incorretos");
      }
    } catch {
      setErro("Erro ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Logo e título */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Entrar</h1>
          <p className="text-slate-500 mt-1">Acesse seus agendamentos</p>
        </div>

        {/* O que você pode fazer */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-cyan-50 border border-cyan-100">
            <Calendar className="w-5 h-5 text-cyan-600" />
            <span className="text-xs text-cyan-800 font-medium">
              Ver agendamentos
            </span>
          </div>
          <div className="flex-1 flex items-center gap-2 p-3 rounded-xl bg-cyan-50 border border-cyan-100">
            <Car className="w-5 h-5 text-cyan-600" />
            <span className="text-xs text-cyan-800 font-medium">
              Histórico de serviços
            </span>
          </div>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
          {erro && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-in slide-in-from-top duration-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{erro}</p>
                <p className="text-xs text-red-500 mt-0.5">
                  Verifique seus dados e tente novamente
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focused === "email" ? "text-cyan-500" : "text-slate-400"
                }`}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder=" "
                required
                className="peer w-full pl-12 pr-4 py-4 pt-6 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-cyan-500 transition-all"
              />
              <label
                className={`absolute left-12 transition-all pointer-events-none ${
                  email || focused === "email"
                    ? "top-2 text-xs text-cyan-600 font-medium"
                    : "top-1/2 -translate-y-1/2 text-slate-400"
                }`}
              >
                Seu email
              </label>
              {email && email.includes("@") && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Senha */}
            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focused === "senha" ? "text-cyan-500" : "text-slate-400"
                }`}
              />
              <input
                type={showSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onFocus={() => setFocused("senha")}
                onBlur={() => setFocused(null)}
                placeholder=" "
                required
                className="peer w-full pl-12 pr-12 py-4 pt-6 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-cyan-500 transition-all"
              />
              <label
                className={`absolute left-12 transition-all pointer-events-none ${
                  senha || focused === "senha"
                    ? "top-2 text-xs text-cyan-600 font-medium"
                    : "top-1/2 -translate-y-1/2 text-slate-400"
                }`}
              >
                Sua senha
              </label>
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showSenha ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dica */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <p className="text-xs text-amber-700">
            💡 Use o email que você cadastrou ao criar sua conta
          </p>
        </div>

        {/* Não tem conta */}
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-cyan-600 font-semibold">
              Cadastre-se grátis
            </Link>
          </p>
        </div>

        {/* É dono de lava jato? */}
        <div className="mt-8 p-4 bg-slate-100 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            É dono de um lava jato?{" "}
            <Link href="/login" className="text-cyan-600 font-semibold">
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
