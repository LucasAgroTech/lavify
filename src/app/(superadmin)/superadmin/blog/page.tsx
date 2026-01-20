"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  Save,
  Upload,
  ExternalLink,
  LayoutList,
  PenLine,
  MessageSquareQuote,
  RotateCcw,
  List,
  Type,
  AlignLeft,
  Zap,
  X,
} from "lucide-react";

interface Secao {
  id: string;
  titulo: string;
  conteudo: string;
  collapsed?: boolean;
}

interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

interface BlogPostDB {
  id: string;
  slug: string;
  titulo: string;
  metaDescricao: string;
  categoria: string;
  status: "RASCUNHO" | "PUBLICADO" | "ARQUIVADO";
  publicadoEm: string | null;
  createdAt: string;
}

export default function BlogEditorPage() {
  // Tabs
  const [activeTab, setActiveTab] = useState<"editor" | "posts">("editor");

  // Editor - Campos do Post
  const [titulo, setTitulo] = useState("");
  const [metaDescricao, setMetaDescricao] = useState("");
  const [categoria, setCategoria] = useState("guia");
  const [palavrasChave, setPalavrasChave] = useState("");
  const [introducao, setIntroducao] = useState("");
  const [secoes, setSecoes] = useState<Secao[]>([
    { id: "1", titulo: "", conteudo: "", collapsed: false },
  ]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [conclusao, setConclusao] = useState("");

  // Estados de IA
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ field: string; text: string } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Estados gerais
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Lista de posts
  const [posts, setPosts] = useState<BlogPostDB[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Carregar posts
  useEffect(() => {
    if (activeTab === "posts") {
      carregarPosts();
    }
  }, [activeTab]);

  const carregarPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/superadmin/blog/posts", {
        credentials: "include",
      });
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Funções de Seções
  const adicionarSecao = () => {
    setSecoes([
      ...secoes,
      { id: Date.now().toString(), titulo: "", conteudo: "", collapsed: false },
    ]);
  };

  const removerSecao = (id: string) => {
    if (secoes.length > 1) {
      setSecoes(secoes.filter((s) => s.id !== id));
    }
  };

  const atualizarSecao = (id: string, field: "titulo" | "conteudo", value: string) => {
    setSecoes(secoes.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const toggleSecaoCollapse = (id: string) => {
    setSecoes(secoes.map((s) => (s.id === id ? { ...s, collapsed: !s.collapsed } : s)));
  };

  const moverSecao = (id: string, direcao: "up" | "down") => {
    const index = secoes.findIndex((s) => s.id === id);
    if (
      (direcao === "up" && index === 0) ||
      (direcao === "down" && index === secoes.length - 1)
    )
      return;

    const newSecoes = [...secoes];
    const newIndex = direcao === "up" ? index - 1 : index + 1;
    [newSecoes[index], newSecoes[newIndex]] = [newSecoes[newIndex], newSecoes[index]];
    setSecoes(newSecoes);
  };

  // Funções de FAQ
  const adicionarFaq = () => {
    setFaq([...faq, { id: Date.now().toString(), pergunta: "", resposta: "" }]);
  };

  const removerFaq = (id: string) => {
    setFaq(faq.filter((f) => f.id !== id));
  };

  const atualizarFaq = (id: string, field: "pergunta" | "resposta", value: string) => {
    setFaq(faq.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  // IA - Gerar sugestões
  const gerarSugestao = async (campo: string, contexto: string) => {
    setAiLoading(campo);
    setAiSuggestion(null);
    setAiError(null);

    try {
      const promptPorCampo: Record<string, string> = {
        titulo: `Sugira 3 títulos SEO otimizados para um post de blog sobre: ${contexto || "gestão de lava-rápido"}. Formato: apenas os títulos, um por linha.`,
        meta: `Crie uma meta descrição SEO (150-160 caracteres) para um post sobre: ${titulo || contexto}`,
        introducao: `Escreva uma introdução E-E-A-T (primeira pessoa, com experiência) para um post sobre: ${titulo}. Máximo 3 parágrafos.`,
        secao: `Sugira o conteúdo para uma seção de blog sobre: ${contexto}. Use parágrafos, listas quando apropriado. Máximo 400 palavras.`,
        conclusao: `Escreva uma conclusão com CTA para o Lavify sobre: ${titulo}. Máximo 2 parágrafos.`,
        keywords: `Sugira 8-10 palavras-chave SEO para um post sobre: ${titulo || contexto}. Formato: palavras separadas por vírgula.`,
      };

      const res = await fetch("/api/superadmin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tema: promptPorCampo[campo] || promptPorCampo.secao?.replace("${contexto}", contexto) || contexto,
          modo: "sugestao",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro na API");
      }

      if (data.content) {
        setAiSuggestion({ field: campo, text: data.content });
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Resposta vazia da IA");
      }
    } catch (err) {
      console.error("Erro na IA:", err);
      setAiError(err instanceof Error ? err.message : "Erro ao gerar sugestão");
    } finally {
      setAiLoading(null);
    }
  };

  const aplicarSugestao = (campo: string, texto: string) => {
    switch (campo) {
      case "titulo":
        setTitulo(texto.split("\n")[0].replace(/^\d+\.\s*/, "").trim());
        break;
      case "meta":
        setMetaDescricao(texto.slice(0, 160));
        break;
      case "introducao":
        setIntroducao(texto);
        break;
      case "conclusao":
        setConclusao(texto);
        break;
      case "keywords":
        setPalavrasChave(texto);
        break;
      default:
        if (campo.startsWith("secao-")) {
          const secaoId = campo.replace("secao-", "");
          atualizarSecao(secaoId, "conteudo", texto);
        }
    }
    setAiSuggestion(null);
  };

  // Salvar/Publicar
  const handleSalvar = async (status: "RASCUNHO" | "PUBLICADO") => {
    if (!titulo.trim()) {
      setError("O título é obrigatório");
      return;
    }

    if (status === "PUBLICADO") {
      setPublishing(true);
    } else {
      setSaving(true);
    }
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/superadmin/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          titulo,
          metaDescricao: metaDescricao || titulo,
          introducao,
          secoes: secoes.map((s) => ({ titulo: s.titulo, conteudo: s.conteudo })),
          conclusao,
          palavrasChave: palavrasChave.split(",").map((k) => k.trim()).filter(Boolean),
          categoria,
          faq: faq.filter((f) => f.pergunta && f.resposta),
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao salvar");
      }

      if (status === "PUBLICADO") {
        setPublishedUrl(data.url);
        setSuccessMessage("Post publicado com sucesso!");
      } else {
        setSuccessMessage("Rascunho salvo com sucesso!");
      }

      if (status === "PUBLICADO") {
        setTimeout(() => {
          limparFormulario();
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  const limparFormulario = () => {
    setTitulo("");
    setMetaDescricao("");
    setIntroducao("");
    setSecoes([{ id: "1", titulo: "", conteudo: "", collapsed: false }]);
    setFaq([]);
    setConclusao("");
    setPalavrasChave("");
    setPublishedUrl(null);
    setSuccessMessage(null);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    setDeletingId(id);
    try {
      await fetch(`/api/superadmin/blog/posts/${id}`, { 
        method: "DELETE",
        credentials: "include",
      });
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAtualizarStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/superadmin/blog/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      carregarPosts();
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  };

  // Componente de botão IA
  const BotaoIA = ({
    campo,
    contexto = "",
    label = "IA",
  }: {
    campo: string;
    contexto?: string;
    label?: string;
  }) => (
    <button
      onClick={() => gerarSugestao(campo, contexto)}
      disabled={aiLoading === campo}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-lg transition-colors disabled:opacity-50"
      title="Gerar sugestão com IA"
    >
      {aiLoading === campo ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Sparkles className="w-3 h-3" />
      )}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header da Página */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <PenLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Editor de Blog</h1>
              <p className="text-sm text-slate-400">Redija posts otimizados para SEO 2026</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "editor"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <PenLine className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "posts"
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <LayoutList className="w-4 h-4" />
              Posts
              {posts.length > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                  {posts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mensagens */}
      {(error || successMessage || publishedUrl || aiError) && (
        <div className="max-w-6xl mx-auto mb-4 space-y-2">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          {aiError && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm flex items-center justify-between">
              <span>⚠️ Erro na IA: {aiError}</span>
              <button onClick={() => setAiError(null)} className="text-amber-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center justify-between">
              <span>✅ {successMessage}</span>
              {publishedUrl && (
                <Link
                  href={publishedUrl}
                  target="_blank"
                  className="flex items-center gap-1 text-green-300 hover:text-green-200"
                >
                  Ver post <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sugestão de IA (Modal flutuante) */}
      {aiSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Sugestão da IA
              </h3>
              <button
                onClick={() => setAiSuggestion(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-900 rounded-xl p-4 mb-4 max-h-60 overflow-y-auto">
              <p className="text-slate-300 text-sm whitespace-pre-wrap">{aiSuggestion.text}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAiSuggestion(null)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm"
              >
                Descartar
              </button>
              <button
                onClick={() => aplicarSugestao(aiSuggestion.field, aiSuggestion.text)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-medium"
              >
                Aplicar Sugestão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Editor */}
      {activeTab === "editor" && (
        <div className="max-w-6xl mx-auto">
          {/* Ações do Editor */}
          <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  showPreview
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:text-white"
                }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={limparFormulario}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Limpar
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSalvar("RASCUNHO")}
                disabled={saving || !titulo.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Rascunho
              </button>
              <button
                onClick={() => handleSalvar("PUBLICADO")}
                disabled={publishing || !titulo.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/30 disabled:opacity-50"
              >
                {publishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Publicar
              </button>
            </div>
          </div>

          <div className={`grid ${showPreview ? "lg:grid-cols-2" : "grid-cols-1"} gap-6`}>
            {/* Formulário */}
            <div className="space-y-6">
              {/* Título e Meta */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Type className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">Título e SEO</h2>
                </div>

                {/* Título */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Título (H1) *</label>
                    <BotaoIA campo="titulo" contexto={titulo || "gestão de lava-rápido"} label="Sugerir" />
                  </div>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Como Organizar o Pátio do Lava-Rápido para Aumentar Produtividade"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                {/* Meta Descrição */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">
                      Meta Descrição
                      <span className="text-slate-500 ml-2">({metaDescricao.length}/160)</span>
                    </label>
                    <BotaoIA campo="meta" contexto={titulo} label="Gerar" />
                  </div>
                  <textarea
                    value={metaDescricao}
                    onChange={(e) => setMetaDescricao(e.target.value.slice(0, 160))}
                    placeholder="Aprenda técnicas práticas para organizar seu lava-rápido..."
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    rows={2}
                  />
                </div>

                {/* Categoria e Palavras-chave */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="guia">📚 Guia</option>
                      <option value="tutorial">🎯 Tutorial</option>
                      <option value="comparativo">⚖️ Comparativo</option>
                      <option value="lista">📋 Lista</option>
                      <option value="case">📊 Case</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-slate-300">Palavras-chave</label>
                      <BotaoIA campo="keywords" contexto={titulo} label="Gerar" />
                    </div>
                    <input
                      type="text"
                      value={palavrasChave}
                      onChange={(e) => setPalavrasChave(e.target.value)}
                      placeholder="lava rapido, gestão, produtividade"
                      className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>
                </div>
              </div>

              {/* Introdução */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlignLeft className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold text-white">Introdução</h2>
                  </div>
                  <BotaoIA campo="introducao" contexto={titulo} label="Gerar com IA" />
                </div>
                <textarea
                  value={introducao}
                  onChange={(e) => setIntroducao(e.target.value)}
                  placeholder="Escreva uma introdução que responda à pergunta principal do leitor..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  rows={5}
                />
                <p className="text-xs text-slate-500 mt-2">
                  💡 Use primeira pessoa: &quot;Em nossa experiência...&quot;
                </p>
              </div>

              {/* Seções */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <List className="w-5 h-5 text-amber-400" />
                    <h2 className="text-lg font-semibold text-white">Seções do Conteúdo</h2>
                  </div>
                  <button
                    onClick={adicionarSecao}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-4">
                  {secoes.map((secao, index) => (
                    <div
                      key={secao.id}
                      className="border border-slate-600 rounded-xl overflow-hidden"
                    >
                      <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50">
                        <span className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs text-slate-300">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={secao.titulo}
                          onChange={(e) => atualizarSecao(secao.id, "titulo", e.target.value)}
                          placeholder="Título da seção (H2)"
                          className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                        />
                        <BotaoIA
                          campo={`secao-${secao.id}`}
                          contexto={secao.titulo || titulo}
                          label="IA"
                        />
                        <button
                          onClick={() => moverSecao(secao.id, "up")}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moverSecao(secao.id, "down")}
                          disabled={index === secoes.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleSecaoCollapse(secao.id)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          {secao.collapsed ? "+" : "−"}
                        </button>
                        {secoes.length > 1 && (
                          <button
                            onClick={() => removerSecao(secao.id)}
                            className="p-1 text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {!secao.collapsed && (
                        <div className="p-4">
                          <textarea
                            value={secao.conteudo}
                            onChange={(e) => atualizarSecao(secao.id, "conteudo", e.target.value)}
                            placeholder="Conteúdo da seção..."
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                            rows={6}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote className="w-5 h-5 text-violet-400" />
                    <h2 className="text-lg font-semibold text-white">FAQ (Opcional)</h2>
                  </div>
                  <button
                    onClick={adicionarFaq}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>

                {faq.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    Adicione perguntas frequentes para melhorar o SEO
                  </p>
                ) : (
                  <div className="space-y-4">
                    {faq.map((item, index) => (
                      <div key={item.id} className="border border-slate-600 rounded-xl p-4">
                        <div className="flex items-start gap-2 mb-3">
                          <span className="text-violet-400 font-bold">Q{index + 1}:</span>
                          <input
                            type="text"
                            value={item.pergunta}
                            onChange={(e) => atualizarFaq(item.id, "pergunta", e.target.value)}
                            placeholder="Pergunta frequente..."
                            className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                          />
                          <button
                            onClick={() => removerFaq(item.id)}
                            className="text-slate-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          value={item.resposta}
                          onChange={(e) => atualizarFaq(item.id, "resposta", e.target.value)}
                          placeholder="Resposta..."
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-sm"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Conclusão */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-rose-400" />
                    <h2 className="text-lg font-semibold text-white">Conclusão</h2>
                  </div>
                  <BotaoIA campo="conclusao" contexto={titulo} label="Gerar" />
                </div>
                <textarea
                  value={conclusao}
                  onChange={(e) => setConclusao(e.target.value)}
                  placeholder="Conclusão com CTA para o Lavify..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="lg:sticky lg:top-6 lg:self-start">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 bg-slate-700/50 border-b border-slate-600 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-white">Preview</span>
                  </div>
                  <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {titulo ? (
                      <>
                        <span className="inline-block px-2 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded mb-3 capitalize">
                          {categoria}
                        </span>
                        <h1 className="text-xl font-bold text-white mb-3">{titulo}</h1>
                        {metaDescricao && (
                          <p className="text-sm text-slate-400 mb-4 italic">{metaDescricao}</p>
                        )}
                        {introducao && (
                          <div className="text-sm text-slate-300 mb-6 whitespace-pre-wrap">
                            {introducao}
                          </div>
                        )}
                        {secoes.filter((s) => s.titulo || s.conteudo).map((secao, i) => (
                          <div key={secao.id} className="mb-6">
                            {secao.titulo && (
                              <h2 className="text-lg font-semibold text-white mb-2">{secao.titulo}</h2>
                            )}
                            {secao.conteudo && (
                              <p className="text-sm text-slate-400 whitespace-pre-wrap">
                                {secao.conteudo}
                              </p>
                            )}
                          </div>
                        ))}
                        {faq.filter((f) => f.pergunta).length > 0 && (
                          <div className="mb-6">
                            <h2 className="text-lg font-semibold text-white mb-3">FAQ</h2>
                            {faq.filter((f) => f.pergunta).map((f) => (
                              <div key={f.id} className="mb-3">
                                <p className="text-sm font-medium text-violet-300">{f.pergunta}</p>
                                <p className="text-sm text-slate-400">{f.resposta}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {conclusao && (
                          <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{conclusao}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">
                          Comece a escrever para ver o preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Posts */}
      {activeTab === "posts" && (
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
            {loadingPosts ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />
                <p className="text-slate-400">Carregando posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Nenhum post ainda</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Comece a escrever seu primeiro post no Editor
                </p>
                <button
                  onClick={() => setActiveTab("editor")}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium"
                >
                  Ir para o Editor
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-900/50 text-xs font-semibold text-slate-400 uppercase">
                  <div className="col-span-5">Título</div>
                  <div className="col-span-2">Categoria</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Data</div>
                  <div className="col-span-1">Ações</div>
                </div>

                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-700/30"
                  >
                    <div className="col-span-5">
                      <h3 className="font-medium text-white line-clamp-1">{post.titulo}</h3>
                      <p className="text-xs text-slate-500">/blog/{post.slug}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-lg capitalize">
                        {post.categoria}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <select
                        value={post.status}
                        onChange={(e) => handleAtualizarStatus(post.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-lg border-0 cursor-pointer ${
                          post.status === "PUBLICADO"
                            ? "bg-green-500/20 text-green-400"
                            : post.status === "RASCUNHO"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-600 text-slate-400"
                        }`}
                      >
                        <option value="RASCUNHO">Rascunho</option>
                        <option value="PUBLICADO">Publicado</option>
                        <option value="ARQUIVADO">Arquivado</option>
                      </select>
                    </div>
                    <div className="col-span-2 text-sm text-slate-400">
                      {new Date(post.publicadoEm || post.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="col-span-1 flex items-center gap-1">
                      {post.status === "PUBLICADO" && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-cyan-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        onClick={() => handleExcluir(post.id)}
                        disabled={deletingId === post.id}
                        className="p-2 text-slate-400 hover:text-red-400 disabled:opacity-50"
                      >
                        {deletingId === post.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
