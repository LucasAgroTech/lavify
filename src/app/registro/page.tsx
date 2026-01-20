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
  Building,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Calendar,
  BarChart3,
  MessageSquare,
  Shield,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/Button";

// Máscara para CNPJ: 00.000.000/0000-00
function formatCNPJ(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .substring(0, 18);
}

// Máscara para telefone: (00) 00000-0000
function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .substring(0, 15);
}

// Tooltip component
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-slate-400 hover:text-cyan-500 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-xl animate-in fade-in duration-200">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
}

// Input com label flutuante
function FloatingInput({
  label,
  tooltip,
  icon: Icon,
  error,
  success,
  ...props
}: {
  label: string;
  tooltip?: string;
  icon: React.ElementType;
  error?: string;
  success?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(props.value);

  return (
    <div className="relative">
      <Icon
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          error ? "text-red-400" : focused ? "text-cyan-500" : "text-slate-400"
        }`}
      />
      <input
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        className={`w-full pl-12 ${tooltip ? "pr-20" : "pr-4"} py-4 pt-6 rounded-xl border-2 bg-white text-slate-800 focus:outline-none transition-all ${
          error
            ? "border-red-300 focus:border-red-500"
            : success
            ? "border-green-300 focus:border-green-500"
            : "border-slate-200 focus:border-cyan-500"
        }`}
        placeholder=" "
      />
      <label
        className={`absolute left-12 transition-all pointer-events-none ${
          focused || hasValue
            ? "top-2 text-xs text-cyan-600 font-medium"
            : "top-1/2 -translate-y-1/2 text-slate-400"
        }`}
      >
        {label}
      </label>
      {tooltip && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Tooltip text={tooltip} />
        </div>
      )}
      {success && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
          <Check className="w-5 h-5" />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}

// Benefícios do sistema
const beneficios = [
  { icon: Calendar, title: "Agendamento Online", desc: "Clientes agendam 24h" },
  { icon: BarChart3, title: "Kanban Visual", desc: "Gestão do pátio" },
  { icon: MessageSquare, title: "WhatsApp", desc: "Notificações automáticas" },
  { icon: Shield, title: "7 Dias Grátis", desc: "Sem cartão de crédito" },
];

export default function RegistroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    nomeLavaJato: "",
    cnpj: "",
    telefoneLavaJato: "",
    endereco: "",
    nome: "",
    email: "",
    senha: "",
    telefone: "",
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

    if (form.cnpj && form.cnpj.replace(/\D/g, "").length > 0 && form.cnpj.replace(/\D/g, "").length !== 14) {
      errors.cnpj = "CNPJ deve ter 14 dígitos";
    }

    setFieldErrors(errors);
  }, [form]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    const name = e.target.name;

    // Aplicar máscaras
    if (name === "cnpj") {
      value = formatCNPJ(value);
    } else if (name === "telefoneLavaJato" || name === "telefone") {
      value = formatPhone(value);
    }

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (step === 1) {
      if (!form.nomeLavaJato.trim()) {
        setErro("Nome do lava jato é obrigatório");
        return;
      }
      setErro("");
      setStep(2);
      return;
    }

    if (!form.nome || !form.email || !form.senha) {
      setErro("Preencha todos os campos obrigatórios");
      return;
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErro("Corrija os erros antes de continuar");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const res = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cnpj: form.cnpj.replace(/\D/g, ""),
          telefoneLavaJato: form.telefoneLavaJato.replace(/\D/g, ""),
          telefone: form.telefone.replace(/\D/g, ""),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
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
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

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
            Cadastre seu
            <br />
            lava jato em
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              2 minutos
            </span>
          </h2>

          {/* Benefícios */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {beneficios.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{b.title}</p>
                  <p className="text-white/50 text-xs">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-4 mt-12 p-4 rounded-xl bg-white/5 border border-white/10">
            <div
              className={`flex items-center gap-2 ${
                step >= 1 ? "text-cyan-400" : "text-slate-500"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step > 1
                    ? "bg-cyan-500 text-white"
                    : step === 1
                    ? "bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {step > 1 ? <Check className="w-5 h-5" /> : "1"}
              </div>
              <div className="hidden xl:block">
                <span className="font-medium text-sm">Lava Jato</span>
                <p className="text-xs text-white/50">Dados do negócio</p>
              </div>
            </div>

            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ${
                  step > 1 ? "w-full" : "w-0"
                }`}
              />
            </div>

            <div
              className={`flex items-center gap-2 ${
                step >= 2 ? "text-cyan-400" : "text-slate-500"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= 2
                    ? "bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                2
              </div>
              <div className="hidden xl:block">
                <span className="font-medium text-sm">Sua Conta</span>
                <p className="text-xs text-white/50">Acesso ao sistema</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Lado direito - Formulário */}
      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Header mobile */}
        <div className="lg:hidden p-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-800">Lavify</span>
          </Link>
        </div>

        {/* Steps mobile */}
        <div className="lg:hidden px-4 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 flex-1 p-2 rounded-lg transition-all ${
                step === 1 ? "bg-cyan-50 border border-cyan-200" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > 1
                    ? "bg-cyan-500 text-white"
                    : step === 1
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    step === 1 ? "text-cyan-700" : "text-slate-500"
                  }`}
                >
                  Lava Jato
                </p>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-300" />

            <div
              className={`flex items-center gap-2 flex-1 p-2 rounded-lg transition-all ${
                step === 2 ? "bg-cyan-50 border border-cyan-200" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= 2
                    ? "bg-cyan-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                2
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    step === 2 ? "text-cyan-700" : "text-slate-500"
                  }`}
                >
                  Sua Conta
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8">
              {/* Header do form */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  {step === 1 ? "Etapa 1 de 2" : "Etapa 2 de 2"}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {step === 1 ? "Dados do Lava Jato" : "Crie sua Conta"}
                </h2>
                <p className="text-slate-500 mt-2">
                  {step === 1
                    ? "Precisamos de algumas informações sobre seu negócio"
                    : "Você será o administrador do sistema"}
                </p>
              </div>

              {erro && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top duration-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{erro}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 1 ? (
                  <>
                    <FloatingInput
                      icon={Building}
                      label="Nome do Lava Jato *"
                      name="nomeLavaJato"
                      value={form.nomeLavaJato}
                      onChange={handleChange}
                      tooltip="Como seus clientes conhecem seu negócio"
                      required
                      success={form.nomeLavaJato.length > 2}
                    />

                    <FloatingInput
                      icon={Building}
                      label="CNPJ (opcional)"
                      name="cnpj"
                      value={form.cnpj}
                      onChange={handleChange}
                      tooltip="Necessário apenas para emissão de notas fiscais"
                      error={fieldErrors.cnpj}
                      success={
                        form.cnpj.replace(/\D/g, "").length === 14 &&
                        !fieldErrors.cnpj
                      }
                    />

                    <FloatingInput
                      icon={Phone}
                      label="WhatsApp do Lava Jato"
                      name="telefoneLavaJato"
                      value={form.telefoneLavaJato}
                      onChange={handleChange}
                      tooltip="Clientes podem entrar em contato por aqui"
                      success={form.telefoneLavaJato.replace(/\D/g, "").length >= 10}
                    />

                    <FloatingInput
                      icon={MapPin}
                      label="Endereço"
                      name="endereco"
                      value={form.endereco}
                      onChange={handleChange}
                      tooltip="Para clientes encontrarem você"
                      success={form.endereco.length > 5}
                    />

                    <div className="pt-2 text-xs text-slate-400 flex items-center gap-1">
                      <span className="text-red-400">*</span> Campo obrigatório
                    </div>
                  </>
                ) : (
                  <>
                    <FloatingInput
                      icon={User}
                      label="Seu Nome Completo *"
                      name="nome"
                      value={form.nome}
                      onChange={handleChange}
                      tooltip="Como você quer ser chamado no sistema"
                      required
                      success={form.nome.length > 2}
                    />

                    <FloatingInput
                      icon={Mail}
                      label="Seu Email *"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      tooltip="Usado para login e notificações importantes"
                      required
                      error={fieldErrors.email}
                      success={
                        form.email.includes("@") &&
                        form.email.includes(".") &&
                        !fieldErrors.email
                      }
                    />

                    <FloatingInput
                      icon={Phone}
                      label="Seu WhatsApp"
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      tooltip="Para contato direto se necessário"
                      success={form.telefone.replace(/\D/g, "").length >= 10}
                    />

                    <div className="relative">
                      <Lock
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                          fieldErrors.senha ? "text-red-400" : "text-slate-400"
                        }`}
                      />
                      <input
                        type={showSenha ? "text" : "password"}
                        name="senha"
                        value={form.senha}
                        onChange={handleChange}
                        placeholder=" "
                        required
                        minLength={6}
                        className={`w-full pl-12 pr-12 py-4 pt-6 rounded-xl border-2 bg-white text-slate-800 focus:outline-none transition-all ${
                          fieldErrors.senha
                            ? "border-red-300 focus:border-red-500"
                            : form.senha.length >= 6
                            ? "border-green-300 focus:border-green-500"
                            : "border-slate-200 focus:border-cyan-500"
                        }`}
                      />
                      <label className="absolute left-12 top-2 text-xs text-cyan-600 font-medium pointer-events-none">
                        Senha (mín. 6 caracteres) *
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

                    <div className="pt-2 text-xs text-slate-400 flex items-center gap-1">
                      <span className="text-red-400">*</span> Campo obrigatório
                    </div>
                  </>
                )}

                {/* Botões */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto sm:flex-1"
                      icon={<ArrowLeft className="w-4 h-4" />}
                    >
                      Voltar
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={loading || Object.keys(fieldErrors).length > 0}
                    className="w-full sm:flex-1 py-3"
                    size="lg"
                  >
                    {step === 1 ? (
                      <>
                        Próximo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : loading ? (
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
                        Criando...
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Criar Conta
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* O que acontece depois */}
              {step === 2 && (
                <div className="mt-6 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                  <p className="text-sm font-medium text-cyan-800 mb-2">
                    ✨ Após criar sua conta:
                  </p>
                  <ul className="text-xs text-cyan-700 space-y-1">
                    <li>• Acesso imediato ao dashboard</li>
                    <li>• 7 dias grátis para testar tudo</li>
                    <li>• Suporte via WhatsApp se precisar</li>
                  </ul>
                </div>
              )}

              <div className="mt-8 text-center">
                <p className="text-slate-500">
                  Já tem uma conta?{" "}
                  <Link
                    href="/login"
                    className="text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    Faça login
                  </Link>
                </p>
              </div>
            </div>

            {/* Selo de segurança */}
            <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-xs">
              <Shield className="w-4 h-4" />
              <span>Seus dados estão protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
