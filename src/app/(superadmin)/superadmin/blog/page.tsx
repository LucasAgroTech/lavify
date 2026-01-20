"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Loader2,
  Wand2,
  ListChecks,
  Table,
  MessageSquareQuote,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Code2,
  Eye,
  Lightbulb,
  Upload,
  Archive,
  ExternalLink,
  Trash2,
  Calendar,
  LayoutList,
  PenLine,
} from "lucide-react";

interface PostGerado {
  titulo: string;
  metaDescricao: string;
  introducao: string;
  secoes: {
    titulo: string;
    conteudo: string;
    tipoConteudo?: string;
  }[];
  faq?: {
    pergunta: string;
    resposta: string;
  }[];
  conclusao: string;
  palavrasChave: string[];
  topicCluster?: {
    pillarPage: string;
    artigosRelacionados: string[];
  };
}

interface Metadata {
  geradoEm: string;
  modelo: string;
  tema: string;
  tokensUsados: number;
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

export default function BlogGeneratorPage() {
  // Tabs
  const [activeTab, setActiveTab] = useState<"gerar" | "posts">("gerar");

  // Gerador
  const [tema, setTema] = useState("");
  const [tipoPost, setTipoPost] = useState("guia");
  const [palavrasChave, setPalavrasChave] = useState("");
  const [tomEscrita, setTomEscrita] = useState("profissional");
  const [tamanhoPost, setTamanhoPost] = useState("medio");
  const [incluirFAQ, setIncluirFAQ] = useState(true);
  const [incluirTabela, setIncluirTabela] = useState(true);
  const [instrucaoAdicional, setInstrucaoAdicional] = useState("");

  const [loading, setLoading] = useState(false);
  const [postGerado, setPostGerado] = useState<PostGerado | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [rawContent, setRawContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"preview" | "json" | "markdown">("preview");
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

  // Publicação
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  // Lista de posts
  const [posts, setPosts] = useState<BlogPostDB[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const temasRapidos = [
    "Como organizar o pátio do lava-rápido para aumentar produtividade",
    "Guia completo de precificação para serviços de estética automotiva",
    "Como fidelizar clientes no lava-jato: programa de pontos e cashback",
    "Gestão de estoque para lava rápido: produtos essenciais e controle",
    "WhatsApp no lava-jato: automatização e atendimento profissional",
    "Como calcular o lucro real do seu lava rápido",
  ];

  // Carregar posts quando mudar para a aba de posts
  useEffect(() => {
    if (activeTab === "posts") {
      carregarPosts();
    }
  }, [activeTab]);

  const carregarPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/superadmin/blog/posts");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleGerarPost = async () => {
    if (!tema.trim()) {
      setError("Por favor, informe um tema para o post");
      return;
    }

    setLoading(true);
    setError(null);
    setPostGerado(null);
    setRawContent(null);
    setPublishedUrl(null);

    try {
      const res = await fetch("/api/superadmin/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tema,
          tipoPost,
          palavrasChave,
          tomEscrita,
          tamanhoPost,
          incluirFAQ,
          incluirTabela,
          instrucaoAdicional,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar post");
      }

      if (data.raw) {
        setRawContent(data.content);
      } else {
        setPostGerado(data.post);
        setMetadata(data.metadata);
        setExpandedSections(new Set(data.post.secoes.map((_: unknown, i: number) => i)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar post");
    } finally {
      setLoading(false);
    }
  };

  const handlePublicar = async (status: "RASCUNHO" | "PUBLICADO") => {
    if (!postGerado) return;

    setPublishing(true);
    setError(null);

    try {
      const res = await fetch("/api/superadmin/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: postGerado.titulo,
          metaDescricao: postGerado.metaDescricao,
          introducao: postGerado.introducao,
          secoes: postGerado.secoes,
          conclusao: postGerado.conclusao,
          palavrasChave: postGerado.palavrasChave,
          categoria: tipoPost,
          faq: postGerado.faq,
          pillarPage: postGerado.topicCluster?.pillarPage,
          artigosRelacionados: postGerado.topicCluster?.artigosRelacionados,
          status,
          modeloIA: metadata?.modelo,
          tokensUsados: metadata?.tokensUsados,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao publicar");
      }

      setPublishedUrl(data.url);
      
      // Recarregar lista de posts
      if (activeTab === "posts") {
        carregarPosts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao publicar");
    } finally {
      setPublishing(false);
    }
  };

  const handleExcluir = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/superadmin/blog/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Erro ao excluir:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAtualizarStatus = async (id: string, status: "PUBLICADO" | "RASCUNHO" | "ARQUIVADO") => {
    try {
      const res = await fetch(`/api/superadmin/blog/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        carregarPosts();
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const copiarParaClipboard = async (texto: string, id: string) => {
    await navigator.clipboard.writeText(texto);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const gerarMarkdown = () => {
    if (!postGerado) return "";

    let md = `# ${postGerado.titulo}\n\n`;
    md += `> ${postGerado.metaDescricao}\n\n`;
    md += `${postGerado.introducao}\n\n`;

    postGerado.secoes.forEach((secao) => {
      md += `## ${secao.titulo}\n\n${secao.conteudo}\n\n`;
    });

    if (postGerado.faq && postGerado.faq.length > 0) {
      md += `## Perguntas Frequentes\n\n`;
      postGerado.faq.forEach((item) => {
        md += `### ${item.pergunta}\n\n${item.resposta}\n\n`;
      });
    }

    md += `## Conclusão\n\n${postGerado.conclusao}\n\n`;
    md += `---\n\n**Palavras-chave:** ${postGerado.palavrasChave.join(", ")}\n`;

    return md;
  };

  const toggleSection = (index: number) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedSections(newSet);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Blog com IA
            </h1>
            <p className="text-slate-400 text-sm">
              Gere e publique posts otimizados para SEO 2026
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("gerar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === "gerar"
              ? "bg-violet-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <PenLine className="w-4 h-4" />
          Gerar Post
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
            activeTab === "posts"
              ? "bg-violet-600 text-white"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <LayoutList className="w-4 h-4" />
          Posts Publicados
          {posts.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
              {posts.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab: Lista de Posts */}
      {activeTab === "posts" && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          {loadingPosts ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />
              <p className="text-slate-400">Carregando posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhum post ainda
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Gere seu primeiro post na aba &quot;Gerar Post&quot;
              </p>
              <button
                onClick={() => setActiveTab("gerar")}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium"
              >
                Criar Post
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {/* Header da tabela */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-900/50 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <div className="col-span-5">Título</div>
                <div className="col-span-2">Categoria</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Data</div>
                <div className="col-span-1">Ações</div>
              </div>

              {/* Lista de posts */}
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-700/30 transition-colors"
                >
                  <div className="col-span-5">
                    <h3 className="font-medium text-white line-clamp-1">
                      {post.titulo}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      /blog/{post.slug}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded-lg capitalize">
                      {post.categoria}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={post.status}
                      onChange={(e) => handleAtualizarStatus(post.id, e.target.value as "PUBLICADO" | "RASCUNHO" | "ARQUIVADO")}
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
                    {post.publicadoEm
                      ? new Date(post.publicadoEm).toLocaleDateString("pt-BR")
                      : new Date(post.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="col-span-1 flex items-center gap-1">
                    {post.status === "PUBLICADO" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="Ver post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleExcluir(post.id)}
                      disabled={deletingId === post.id}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Excluir"
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
      )}

      {/* Tab: Gerador */}
      {activeTab === "gerar" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Formulário */}
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-violet-400" />
                Configuração do Post
              </h2>

              {/* Tema */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tema do Post *
                </label>
                <textarea
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ex: Como organizar o pátio do lava-rápido para maximizar produtividade"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Temas Rápidos */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  💡 Sugestões
                </label>
                <div className="flex flex-wrap gap-2">
                  {temasRapidos.slice(0, 3).map((t, i) => (
                    <button
                      key={i}
                      onClick={() => setTema(t)}
                      className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-violet-600/30 text-slate-300 hover:text-violet-300 rounded-lg transition-colors border border-slate-600 hover:border-violet-500/50"
                    >
                      {t.slice(0, 35)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de opções */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={tipoPost}
                    onChange={(e) => setTipoPost(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="guia">📚 Guia</option>
                    <option value="tutorial">🎯 Tutorial</option>
                    <option value="comparativo">⚖️ Comparativo</option>
                    <option value="lista">📋 Lista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tamanho
                  </label>
                  <select
                    value={tamanhoPost}
                    onChange={(e) => setTamanhoPost(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="curto">Curto (~800)</option>
                    <option value="medio">Médio (~1500)</option>
                    <option value="longo">Longo (~2500)</option>
                  </select>
                </div>
              </div>

              {/* Opções */}
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incluirFAQ}
                    onChange={(e) => setIncluirFAQ(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-violet-500"
                  />
                  <span className="text-sm text-slate-300 flex items-center gap-1">
                    <MessageSquareQuote className="w-4 h-4" />
                    FAQ
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incluirTabela}
                    onChange={(e) => setIncluirTabela(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-violet-500"
                  />
                  <span className="text-sm text-slate-300 flex items-center gap-1">
                    <Table className="w-4 h-4" />
                    Tabela
                  </span>
                </label>
              </div>

              {/* Botão Gerar */}
              <button
                onClick={handleGerarPost}
                disabled={loading || !tema.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar com IA
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Dicas */}
            <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/20 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-violet-300 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                SEO 2026
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>• <strong className="text-slate-300">E-E-A-T:</strong> Experiência real do autor</li>
                <li>• <strong className="text-slate-300">GEO:</strong> Estrutura para LLMs</li>
                <li>• <strong className="text-slate-300">Answer-First:</strong> Resposta no início</li>
              </ul>
            </div>
          </div>

          {/* Preview/Resultado */}
          <div className="space-y-4">
            {(postGerado || rawContent) && (
              <>
                {/* Tabs de Visualização */}
                <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "preview"
                        ? "bg-violet-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode("markdown")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "markdown"
                        ? "bg-violet-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    MD
                  </button>
                  <button
                    onClick={() => setViewMode("json")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "json"
                        ? "bg-violet-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Code2 className="w-4 h-4" />
                    JSON
                  </button>
                </div>

                {/* Conteúdo Preview */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden max-h-[50vh] overflow-y-auto">
                  {rawContent ? (
                    <div className="p-6">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                        {rawContent}
                      </pre>
                    </div>
                  ) : postGerado && viewMode === "preview" ? (
                    <div className="divide-y divide-slate-700">
                      {/* Título */}
                      <div className="p-5">
                        <h2 className="text-lg font-bold text-white mb-2">
                          {postGerado.titulo}
                        </h2>
                        <p className="text-sm text-slate-400">
                          {postGerado.metaDescricao}
                        </p>
                      </div>

                      {/* Introdução */}
                      <div className="p-5">
                        <h3 className="text-xs font-semibold text-violet-400 mb-2 uppercase">
                          Introdução
                        </h3>
                        <p className="text-sm text-slate-300 line-clamp-4">
                          {postGerado.introducao}
                        </p>
                      </div>

                      {/* Seções colapsáveis */}
                      {postGerado.secoes.slice(0, 3).map((secao, index) => (
                        <div key={index}>
                          <button
                            onClick={() => toggleSection(index)}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30"
                          >
                            <span className="text-sm font-medium text-white">
                              {secao.titulo}
                            </span>
                            {expandedSections.has(index) ? (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                          {expandedSections.has(index) && (
                            <div className="px-5 pb-4 text-xs text-slate-400 line-clamp-6">
                              {secao.conteudo}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Palavras-chave */}
                      <div className="p-4 bg-slate-900/50">
                        <div className="flex flex-wrap gap-1">
                          {postGerado.palavrasChave.slice(0, 5).map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-violet-500/20 text-violet-300 rounded"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : postGerado && viewMode === "markdown" ? (
                    <div className="p-4">
                      <button
                        onClick={() => copiarParaClipboard(gerarMarkdown(), "md")}
                        className="mb-3 flex items-center gap-2 px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-lg"
                      >
                        {copied === "md" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        Copiar
                      </button>
                      <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                        {gerarMarkdown().slice(0, 2000)}...
                      </pre>
                    </div>
                  ) : postGerado && viewMode === "json" ? (
                    <div className="p-4">
                      <button
                        onClick={() => copiarParaClipboard(JSON.stringify(postGerado, null, 2), "json")}
                        className="mb-3 flex items-center gap-2 px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-lg"
                      >
                        {copied === "json" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        Copiar
                      </button>
                      <pre className="text-xs text-slate-300 font-mono">
                        {JSON.stringify(postGerado, null, 2).slice(0, 2000)}...
                      </pre>
                    </div>
                  ) : null}
                </div>

                {/* Botões de Ação */}
                {postGerado && !publishedUrl && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handlePublicar("RASCUNHO")}
                      disabled={publishing}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                    >
                      {publishing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                      Salvar Rascunho
                    </button>
                    <button
                      onClick={() => handlePublicar("PUBLICADO")}
                      disabled={publishing}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-500/30 disabled:opacity-50"
                    >
                      {publishing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Publicar Agora
                    </button>
                  </div>
                )}

                {/* URL Publicada */}
                {publishedUrl && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Post publicado!</span>
                    </div>
                    <Link
                      href={publishedUrl}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-sm text-green-300 hover:text-green-200"
                    >
                      {publishedUrl}
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* Regenerar */}
                <button
                  onClick={handleGerarPost}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Regenerar
                </button>
              </>
            )}

            {/* Empty State */}
            {!postGerado && !rawContent && !loading && (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Pronto para criar
                </h3>
                <p className="text-slate-400 text-sm">
                  Preencha o tema e clique em &quot;Gerar com IA&quot;
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
