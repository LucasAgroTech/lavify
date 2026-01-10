"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Building2,
  Phone,
  MapPin,
  Palette,
  Hash,
  FileText,
  Save,
  Loader2,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  Droplets,
  Crown,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LavaJatoConfig {
  id: string;
  nome: string;
  slug: string | null;
  cnpj: string | null;
  telefone: string | null;
  endereco: string | null;
  logoUrl: string | null;
  corPrimaria: string;
  ativo: boolean;
  plano: string;
  createdAt: string;
}

const coresPredefinidas = [
  { cor: "#06b6d4", nome: "Cyan" },
  { cor: "#3b82f6", nome: "Azul" },
  { cor: "#8b5cf6", nome: "Roxo" },
  { cor: "#ec4899", nome: "Pink" },
  { cor: "#ef4444", nome: "Vermelho" },
  { cor: "#f97316", nome: "Laranja" },
  { cor: "#eab308", nome: "Amarelo" },
  { cor: "#22c55e", nome: "Verde" },
  { cor: "#14b8a6", nome: "Teal" },
  { cor: "#64748b", nome: "Cinza" },
];

const planLabels: Record<string, { label: string; color: string; bg: string }> = {
  STARTER: { label: "Starter", color: "text-slate-600", bg: "bg-slate-100" },
  PRO: { label: "Pro", color: "text-cyan-700", bg: "bg-cyan-100" },
  PREMIUM: { label: "Premium", color: "text-amber-700", bg: "bg-amber-100" },
};

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [config, setConfig] = useState<LavaJatoConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [erro, setErro] = useState("");
  const [copied, setCopied] = useState(false);

  // Form states
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [corPrimaria, setCorPrimaria] = useState("#06b6d4");

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/configuracoes");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setNome(data.nome || "");
        setSlug(data.slug || "");
        setCnpj(formatCNPJ(data.cnpj || ""));
        setTelefone(formatTelefone(data.telefone || ""));
        setEndereco(data.endereco || "");
        setCorPrimaria(data.corPrimaria || "#06b6d4");
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  function formatCNPJ(value: string): string {
    const nums = value.replace(/\D/g, "");
    if (nums.length <= 14) {
      return nums
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }
    return value;
  }

  function formatTelefone(value: string): string {
    const nums = value.replace(/\D/g, "");
    if (nums.length <= 11) {
      if (nums.length <= 10) {
        return nums
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2");
      }
      return nums
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  }

  function handleCNPJChange(value: string) {
    setCnpj(formatCNPJ(value));
  }

  function handleTelefoneChange(value: string) {
    setTelefone(formatTelefone(value));
  }

  function handleSlugChange(value: string) {
    // Permitir apenas letras minúsculas, números e hífens
    const formatted = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");
    setSlug(formatted);
  }

  async function handleSave() {
    setErro("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/configuracoes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          slug,
          cnpj: cnpj.replace(/\D/g, ""),
          telefone: telefone.replace(/\D/g, ""),
          endereco,
          corPrimaria,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao salvar");
        setSaving(false);
        return;
      }

      setConfig(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setErro("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }

  function copyLink() {
    const link = `https://www.lavify.com.br/lavajato/${slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <>
        {/* Mobile Loading */}
        <div className="lg:hidden p-4 pt-18 pb-24">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48" />
            <div className="h-20 bg-slate-200 rounded-xl" />
            <div className="h-48 bg-slate-200 rounded-xl" />
            <div className="h-48 bg-slate-200 rounded-xl" />
          </div>
        </div>
        {/* Desktop Loading */}
        <div className="hidden lg:flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      </>
    );
  }

  const planInfo = planLabels[config?.plano || "STARTER"];

  return (
    <div className="pb-24 lg:pb-0">
      {/* ==================== MOBILE VERSION ==================== */}
      <div className="lg:hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 p-4 pt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Configurações</h1>
              <p className="text-sm text-slate-500">Edite seu lava-rápido</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Card de Preview */}
          <div 
            className="rounded-2xl p-4 text-white"
            style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corPrimaria}dd)` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">{nome || "Seu Lava-Rápido"}</h2>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/20`}>
                  <Crown className="w-3 h-3" />
                  Plano {planInfo.label}
                </span>
              </div>
            </div>
            {slug && (
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm truncate">
                  lavify.com.br/lavajato/{slug}
                </div>
                <button
                  onClick={copyLink}
                  className="p-2 bg-white/20 rounded-lg active:scale-95 transition-transform"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
                <Link
                  href={`/lavajato/${slug}`}
                  target="_blank"
                  className="p-2 bg-white/20 rounded-lg active:scale-95 transition-transform"
                >
                  <ExternalLink className="w-5 h-5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mensagens */}
          {erro && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {erro}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm">
              <Check className="w-4 h-4 flex-shrink-0" />
              Configurações salvas com sucesso!
            </div>
          )}

          {/* Informações Básicas */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-500" />
                Informações Básicas
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome do estabelecimento
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base"
                  placeholder="Ex: Auto Lavagem Express"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Slug (link personalizado)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">lavify.com.br/lavajato/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="flex-1 px-3 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base"
                    placeholder="seu-lavajato"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  CNPJ
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base"
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Phone className="w-5 h-5 text-cyan-500" />
                Contato
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Telefone / WhatsApp
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={telefone}
                  onChange={(e) => handleTelefoneChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base"
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Endereço
                </label>
                <textarea
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl text-slate-800 placeholder:text-slate-400 text-base resize-none"
                  placeholder="Rua, número, bairro, cidade - UF"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Personalização */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-500" />
                Personalização
              </h3>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Cor principal
              </label>
              <div className="grid grid-cols-5 gap-3">
                {coresPredefinidas.map((item) => (
                  <button
                    key={item.cor}
                    onClick={() => setCorPrimaria(item.cor)}
                    className={`
                      w-full aspect-square rounded-xl transition-all
                      ${corPrimaria === item.cor ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : ""}
                    `}
                    style={{ backgroundColor: item.cor }}
                    title={item.nome}
                  >
                    {corPrimaria === item.cor && (
                      <Check className="w-5 h-5 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm text-slate-600">Cor personalizada:</label>
                <input
                  type="color"
                  value={corPrimaria}
                  onChange={(e) => setCorPrimaria(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <span className="text-sm text-slate-500 font-mono">{corPrimaria}</span>
              </div>
            </div>
          </div>

          {/* Botão Salvar Fixo */}
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg z-30">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/30 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP VERSION ==================== */}
      <div className="hidden lg:block p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
              <Settings className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
              <p className="text-slate-500">Gerencie as informações do seu lava-rápido</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center gap-2 hover:shadow-cyan-500/30 transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>

        {/* Mensagens */}
        {erro && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {erro}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-600 rounded-xl">
            <Check className="w-5 h-5 flex-shrink-0" />
            Configurações salvas com sucesso!
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="col-span-2 space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-500" />
                <h3 className="font-semibold text-slate-800">Informações Básicas</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nome do estabelecimento
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="Ex: Auto Lavagem Express"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Slug (link personalizado)
                    </label>
                    <div className="flex items-center">
                      <span className="text-sm text-slate-400 mr-1">/lavajato/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                        placeholder="seu-lavajato"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={cnpj}
                      onChange={(e) => handleCNPJChange(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Phone className="w-5 h-5 text-cyan-500" />
                <h3 className="font-semibold text-slate-800">Contato e Localização</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => handleTelefoneChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Endereço completo
                  </label>
                  <textarea
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none"
                    placeholder="Rua, número, bairro, cidade - UF"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Personalização */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Palette className="w-5 h-5 text-cyan-500" />
                <h3 className="font-semibold text-slate-800">Personalização</h3>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Cor principal do seu estabelecimento
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {coresPredefinidas.map((item) => (
                      <button
                        key={item.cor}
                        onClick={() => setCorPrimaria(item.cor)}
                        className={`
                          w-10 h-10 rounded-xl transition-all
                          ${corPrimaria === item.cor ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-105"}
                        `}
                        style={{ backgroundColor: item.cor }}
                        title={item.nome}
                      >
                        {corPrimaria === item.cor && (
                          <Check className="w-4 h-4 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={corPrimaria}
                      onChange={(e) => setCorPrimaria(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0"
                    />
                    <span className="text-sm text-slate-500 font-mono">{corPrimaria}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div 
              className="rounded-2xl p-6 text-white"
              style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corPrimaria}dd)` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold">{nome || "Seu Lava-Rápido"}</h2>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-white/20`}>
                    <Crown className="w-3 h-3" />
                    Plano {planInfo.label}
                  </span>
                </div>
              </div>
              <p className="text-white/70 text-sm mb-4">Prévia do seu estabelecimento</p>
              {slug && (
                <div className="space-y-2">
                  <div className="bg-white/10 rounded-lg px-3 py-2 text-sm truncate">
                    lavify.com.br/lavajato/{slug}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyLink}
                      className="flex-1 py-2 bg-white/20 rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-white/30 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copiado!" : "Copiar Link"}
                    </button>
                    <Link
                      href={`/lavajato/${slug}`}
                      target="_blank"
                      className="py-2 px-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Plano Atual */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h4 className="font-semibold text-slate-800 mb-3">Seu Plano</h4>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${planInfo.bg} ${planInfo.color} font-medium`}>
                <Crown className="w-4 h-4" />
                {planInfo.label}
              </div>
              <Link
                href="/planos"
                className="block mt-4 text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Gerenciar plano →
              </Link>
            </div>

            {/* Info */}
            <div className="bg-slate-50 rounded-2xl p-4 text-sm text-slate-600">
              <p className="mb-2">
                <strong>Dica:</strong> Personalize a cor do seu lava-rápido para combinar com sua identidade visual.
              </p>
              <p>
                O slug é usado para criar o link único do seu estabelecimento para agendamentos online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

