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

          {/* Botão Salvar Fixo - 80px para ficar acima da nav + safe area */}
          <div className="fixed left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-lg z-30 lg:hidden" style={{ bottom: '80px' }}>
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
      <div className="hidden lg:block p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>
            <p className="text-slate-500 mt-1">Personalize e gerencie as informações do seu lava-rápido</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 disabled:opacity-50 flex items-center gap-2 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
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

        {/* Mensagens de Status */}
        {erro && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium">Erro ao salvar</p>
              <p className="text-sm text-red-600">{erro}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium">Sucesso!</p>
              <p className="text-sm text-emerald-600">Configurações salvas com sucesso</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-8">
          {/* Coluna Principal - 8 colunas */}
          <div className="col-span-8 space-y-6">
            {/* Card de Preview Principal */}
            <div 
              className="rounded-2xl p-8 text-white relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${corPrimaria}, ${corPrimaria}cc)` }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Droplets className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-2xl mb-1">{nome || "Seu Lava-Rápido"}</h2>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                      <Crown className="w-4 h-4" />
                      Plano {planInfo.label}
                    </span>
                  </div>
                </div>
                
                {slug && (
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-sm">
                      <span className="text-white/70">lavify.com.br/lavajato/</span>
                      <span className="font-semibold">{slug}</span>
                    </div>
                    <button
                      onClick={copyLink}
                      className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                      title="Copiar link"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <Link
                      href={`/lavajato/${slug}`}
                      target="_blank"
                      className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
                      title="Abrir página"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  </div>
                )}
              </div>
              
              {copied && (
                <div className="absolute top-4 right-4 bg-white/90 text-slate-800 px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg animate-pulse">
                  Link copiado!
                </div>
              )}
            </div>

            {/* Grid de Formulários */}
            <div className="grid grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Informações Básicas</h3>
                      <p className="text-xs text-slate-500">Dados do estabelecimento</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome do estabelecimento
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all"
                      placeholder="Ex: Auto Lavagem Express"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Hash className="w-4 h-4 inline mr-1 text-slate-400" />
                      Slug (link personalizado)
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500/20 focus-within:border-cyan-500 transition-all">
                      <span className="px-4 text-sm text-slate-400 bg-slate-100 py-3 border-r border-slate-200">/lavajato/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        className="flex-1 px-4 py-3 bg-transparent focus:outline-none"
                        placeholder="seu-lavajato"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-1 text-slate-400" />
                      CNPJ
                    </label>
                    <input
                      type="text"
                      value={cnpj}
                      onChange={(e) => handleCNPJChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all"
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>
                </div>
              </div>

              {/* Contato e Localização */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Contato e Localização</h3>
                      <p className="text-xs text-slate-500">Como clientes encontram você</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Telefone / WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={telefone}
                        onChange={(e) => handleTelefoneChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all"
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                      />
                      <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Endereço completo
                    </label>
                    <div className="relative">
                      <textarea
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 focus:bg-white transition-all resize-none"
                        placeholder="Rua, número, bairro, cidade - UF"
                        rows={3}
                      />
                      <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalização - Full Width */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Personalização Visual</h3>
                    <p className="text-xs text-slate-500">Defina a identidade visual do seu lava-rápido</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Escolha a cor principal do seu estabelecimento
                </label>
                <div className="flex items-center gap-6">
                  <div className="flex gap-3">
                    {coresPredefinidas.map((item) => (
                      <button
                        key={item.cor}
                        onClick={() => setCorPrimaria(item.cor)}
                        className={`
                          w-12 h-12 rounded-xl transition-all relative group
                          ${corPrimaria === item.cor 
                            ? "ring-2 ring-offset-2 ring-slate-400 scale-110 shadow-lg" 
                            : "hover:scale-110 hover:shadow-md"}
                        `}
                        style={{ backgroundColor: item.cor }}
                        title={item.nome}
                      >
                        {corPrimaria === item.cor && (
                          <Check className="w-5 h-5 text-white mx-auto" />
                        )}
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {item.nome}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="h-12 w-px bg-slate-200" />
                  
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Cor personalizada</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={corPrimaria}
                          onChange={(e) => setCorPrimaria(e.target.value)}
                          className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200"
                        />
                        <span className="text-sm text-slate-600 font-mono bg-slate-100 px-3 py-2 rounded-lg">{corPrimaria}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 4 colunas */}
          <div className="col-span-4 space-y-6">
            {/* Seu Plano */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  Seu Plano Atual
                </h4>
              </div>
              <div className="p-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${planInfo.bg} ${planInfo.color} font-semibold text-lg`}>
                  <Crown className="w-5 h-5" />
                  {planInfo.label}
                </div>
                <p className="text-sm text-slate-500 mt-3">
                  {config?.plano === "STARTER" && "Plano gratuito com funcionalidades básicas"}
                  {config?.plano === "PRO" && "Plano profissional com todas as ferramentas"}
                  {config?.plano === "PREMIUM" && "Plano completo com recursos ilimitados"}
                </p>
                <Link
                  href="/planos"
                  className="mt-4 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {config?.plano === "STARTER" ? "Fazer Upgrade" : "Gerenciar Plano"}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 p-6">
              <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Dicas Úteis
              </h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>Personalize a <strong>cor</strong> para combinar com sua identidade visual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>O <strong>slug</strong> é o link único para agendamentos online</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>Mantenha o <strong>telefone</strong> atualizado para notificações</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                  <span>O <strong>CNPJ</strong> é opcional mas recomendado</span>
                </li>
              </ul>
            </div>

            {/* Status da Conta */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="font-semibold text-slate-800 mb-4">Status da Conta</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Ativo
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Criado em</span>
                  <span className="text-sm font-medium text-slate-700">
                    {config?.createdAt ? new Date(config.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-500">ID do Lava-Rápido</span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {config?.id?.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

