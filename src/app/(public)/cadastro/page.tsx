"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Droplets,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Phone,
  ArrowLeft,
  Calendar,
  Car,
  Bell,
  Gift,
  CheckCircle,
  Sparkles,
} from "lucide-react";

// Máscara para telefone
function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
}

// Benefícios de criar conta
const beneficios = [
  { icon: Calendar, text: "Agende serviços online 24h" },
  { icon: Car, text: "Histórico de todos os serviços" },
  { icon: Bell, text: "Notificações quando pronto" },
  { icon: Gift, text: "Programa de fidelidade" },
];

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
  });

  // Validação em tempo real
  useEffect(() => {
    const errors: Record<string, string> = {};

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Email inválido";
    }

    if (form.senha && form.senha.length > 0 && form.senha.length < 6) {
      errors.senha = "Mínimo 6 caracteres";
    }

    setFieldErrors(errors);
  }, [form]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    const name = e.target.name;

    if (name === "telefone") {
      value = formatPhone(value);
    }

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.senha.length < 6) {
      setErro("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErro("Corrija os erros antes de continuar");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const res = await fetch("/api/cliente/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          telefone: form.telefone.replace(/\D/g, ""),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/meus-agendamentos");
        router.refresh();
      } else {
        setErro(data.error || "Erro ao criar conta");
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
          <h1 className="text-2xl font-bold text-slate-800">Criar Conta</h1>
          <p className="text-slate-500 mt-1">
            Para agendar serviços de lava jato
          </p>
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {beneficios.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-3 rounded-xl bg-cyan-50 border border-cyan-100"
            >
              <b.icon className="w-5 h-5 text-cyan-600" />
              <span className="text-xs text-cyan-800 font-medium">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
          {erro && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top duration-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{erro}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div className="relative">
              <User
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focused === "nome" ? "text-cyan-500" : "text-slate-400"
                }`}
              />
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                onFocus={() => setFocused("nome")}
                onBlur={() => setFocused(null)}
                placeholder=" "
                required
                className="peer w-full pl-12 pr-4 py-4 pt-6 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-cyan-500 transition-all"
              />
              <label
                className={`absolute left-12 transition-all pointer-events-none ${
                  form.nome || focused === "nome"
                    ? "top-2 text-xs text-cyan-600 font-medium"
                    : "top-1/2 -translate-y-1/2 text-slate-400"
                }`}
              >
                Seu nome completo
              </label>
              {form.nome.length > 2 && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <Mail
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  fieldErrors.email
                    ? "text-red-400"
                    : focused === "email"
                    ? "text-cyan-500"
                    : "text-slate-400"
                }`}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder=" "
                required
                className={`peer w-full pl-12 pr-4 py-4 pt-6 rounded-xl border-2 bg-white text-slate-800 focus:outline-none transition-all ${
                  fieldErrors.email
                    ? "border-red-300 focus:border-red-500"
                    : "border-slate-200 focus:border-cyan-500"
                }`}
              />
              <label
                className={`absolute left-12 transition-all pointer-events-none ${
                  form.email || focused === "email"
                    ? `top-2 text-xs font-medium ${
                        fieldErrors.email ? "text-red-500" : "text-cyan-600"
                      }`
                    : "top-1/2 -translate-y-1/2 text-slate-400"
                }`}
              >
                Seu email
              </label>
              {form.email && !fieldErrors.email && form.email.includes("@") && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div className="relative">
              <Phone
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  focused === "telefone" ? "text-cyan-500" : "text-slate-400"
                }`}
              />
              <input
                type="tel"
                name="telefone"
                value={form.telefone}
                onChange={handleChange}
                onFocus={() => setFocused("telefone")}
                onBlur={() => setFocused(null)}
                placeholder=" "
                className="peer w-full pl-12 pr-4 py-4 pt-6 rounded-xl border-2 border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-cyan-500 transition-all"
              />
              <label
                className={`absolute left-12 transition-all pointer-events-none ${
                  form.telefone || focused === "telefone"
                    ? "top-2 text-xs text-cyan-600 font-medium"
                    : "top-1/2 -translate-y-1/2 text-slate-400"
                }`}
              >
                WhatsApp (para notificações)
              </label>
              {form.telefone.replace(/\D/g, "").length >= 10 && (
                <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Senha */}
            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  fieldErrors.senha
                    ? "text-red-400"
                    : focused === "senha"
                    ? "text-cyan-500"
                    : "text-slate-400"
                }`}
              />
              <input
                type={showSenha ? "text" : "password"}
                name="senha"
                value={form.senha}
                onChange={handleChange}
                onFocus={() => setFocused("senha")}
                onBlur={() => setFocused(null)}
                placeholder=" "
                required
                minLength={6}
                className={`peer w-full pl-12 pr-12 py-4 pt-6 rounded-xl border-2 bg-white text-slate-800 focus:outline-none transition-all ${
                  fieldErrors.senha
                    ? "border-red-300 focus:border-red-500"
                    : form.senha.length >= 6
                    ? "border-green-300 focus:border-green-500"
                    : "border-slate-200 focus:border-cyan-500"
                }`}
              />
              <label
                className={`absolute left-12 transition-all pointer-events-none ${
                  form.senha || focused === "senha"
                    ? `top-2 text-xs font-medium ${
                        fieldErrors.senha ? "text-red-500" : "text-cyan-600"
                      }`
                    : "top-1/2 -translate-y-1/2 text-slate-400"
                }`}
              >
                Crie uma senha (mín. 6 caracteres)
              </label>
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showSenha ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {fieldErrors.senha && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {fieldErrors.senha}
                </p>
              )}
            </div>

            {/* Força da senha */}
            {form.senha && (
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      form.senha.length >= i * 2
                        ? form.senha.length >= 8
                          ? "bg-green-500"
                          : form.senha.length >= 6
                          ? "bg-yellow-500"
                          : "bg-red-500"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Object.keys(fieldErrors).length > 0}
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
                  Criando conta...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Criar Conta Grátis
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-slate-500">
            Ao criar uma conta, você concorda com nossos{" "}
            <Link href="#" className="text-cyan-600">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="#" className="text-cyan-600">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        {/* Já tem conta */}
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Já tem conta?{" "}
            <Link href="/entrar" className="text-cyan-600 font-semibold">
              Fazer login
            </Link>
          </p>
        </div>

        {/* É dono de lava jato? */}
        <div className="mt-8 p-4 bg-slate-100 rounded-xl text-center">
          <p className="text-sm text-slate-600">
            É dono de um lava jato?{" "}
            <Link href="/registro" className="text-cyan-600 font-semibold">
              Cadastre seu negócio aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
