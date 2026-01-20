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
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
} from "lucide-react";
import { Button } from "@/components/Button";

// O que o usuário vai encontrar ao entrar
const oQueEsperar = [
  { icon: LayoutDashboard, text: "Dashboard com visão geral" },
  { icon: Calendar, text: "Agendamentos do dia" },
  { icon: FileText, text: "Ordens de serviço" },
  { icon: Users, text: "Gestão de clientes" },
];

export default function LoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setErro(data.error || "Email ou senha incorretos");
      }
    } catch {
      setErro("Erro ao conectar ao servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Padrão de fundo */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30">
              <Droplets className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Lavify</h1>
              <p className="text-cyan-300">Sistema de Gestão</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Bem-vindo
            <br />
            de volta ao
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              seu painel
            </span>
          </h2>

          {/* O que vai encontrar */}
          <div className="mt-8">
            <p className="text-white/60 text-sm mb-4">
              Ao entrar você terá acesso a:
            </p>
            <div className="space-y-3">
              {oQueEsperar.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-white/80">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decoração */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header mobile */}
        <div className="lg:hidden p-4 flex items-center justify-center border-b border-slate-200 bg-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-800">Lavify</span>
          </Link>
        </div>

        {/* Formulário */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 lg:hidden">
                  <Droplets className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Entrar na sua conta
                </h2>
                <p className="text-slate-500 mt-2">
                  Acesse o painel do seu lava jato
                </p>
              </div>

              {erro && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top duration-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{erro}</p>
                    <p className="text-xs text-red-500 mt-0.5">
                      Verifique seus dados e tente novamente
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Mail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
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

                <div className="relative">
                  <Lock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors ${
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4"
                  size="lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
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
                    </span>
                  ) : (
                    <>
                      Entrar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Dica de acesso rápido */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 text-center">
                  💡 Dica: Use o email que você cadastrou ao criar sua conta
                </p>
              </div>

              <div className="mt-8 text-center">
                <p className="text-slate-500">
                  Não tem uma conta?{" "}
                  <Link
                    href="/registro"
                    className="text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    Cadastre seu lava jato
                  </Link>
                </p>
              </div>
            </div>

            {/* É cliente? */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                Você é um <strong>cliente</strong> de lava jato?{" "}
                <Link href="/entrar" className="text-cyan-600 font-medium">
                  Entre aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
