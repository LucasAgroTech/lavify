"use client";

import { useState } from "react";
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

export default function BlogGeneratorPage() {
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

  const temasRapidos = [
    "Como organizar o pátio do lava-rápido para aumentar produtividade",
    "Guia completo de precificação para serviços de estética automotiva",
    "Como fidelizar clientes no lava-jato: programa de pontos e cashback",
    "Gestão de estoque para lava rápido: produtos essenciais e controle",
    "WhatsApp no lava-jato: automatização e atendimento profissional",
    "Como calcular o lucro real do seu lava rápido",
    "Licenciamento ambiental para lava-jato: guia completo 2026",
    "Sistema de agendamento online: por que seu lava-jato precisa",
  ];

  const handleGerarPost = async () => {
    if (!tema.trim()) {
      setError("Por favor, informe um tema para o post");
      return;
    }

    setLoading(true);
    setError(null);
    setPostGerado(null);
    setRawContent(null);

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
        // Expandir todas as seções por padrão
        setExpandedSections(new Set(data.post.secoes.map((_: unknown, i: number) => i)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar post");
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Gerador de Posts para Blog
            </h1>
            <p className="text-slate-400 text-sm">
              Crie conteúdo otimizado para SEO 2026 com IA
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="space-y-6">
          {/* Card Principal */}
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
                💡 Sugestões de temas
              </label>
              <div className="flex flex-wrap gap-2">
                {temasRapidos.slice(0, 4).map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setTema(t)}
                    className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-violet-600/30 text-slate-300 hover:text-violet-300 rounded-lg transition-colors border border-slate-600 hover:border-violet-500/50"
                  >
                    {t.slice(0, 40)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo e Tom em Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo de Post
                </label>
                <select
                  value={tipoPost}
                  onChange={(e) => setTipoPost(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="guia">📚 Guia Completo</option>
                  <option value="tutorial">🎯 Tutorial Passo a Passo</option>
                  <option value="comparativo">⚖️ Comparativo</option>
                  <option value="case">📊 Estudo de Caso</option>
                  <option value="lista">📋 Lista/Checklist</option>
                  <option value="problema">🔧 Resolução de Problema</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tom de Escrita
                </label>
                <select
                  value={tomEscrita}
                  onChange={(e) => setTomEscrita(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="profissional">👔 Profissional</option>
                  <option value="amigavel">😊 Amigável</option>
                  <option value="tecnico">🔬 Técnico</option>
                  <option value="conversacional">💬 Conversacional</option>
                </select>
              </div>
            </div>

            {/* Tamanho e Palavras-chave */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tamanho do Post
                </label>
                <select
                  value={tamanhoPost}
                  onChange={(e) => setTamanhoPost(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="curto">Curto (~800 palavras)</option>
                  <option value="medio">Médio (~1500 palavras)</option>
                  <option value="longo">Longo (~2500 palavras)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Palavras-chave (opcional)
                </label>
                <input
                  type="text"
                  value={palavrasChave}
                  onChange={(e) => setPalavrasChave(e.target.value)}
                  placeholder="lava rapido, gestao, patio"
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {/* Opções */}
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incluirFAQ}
                  onChange={(e) => setIncluirFAQ(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-sm text-slate-300 flex items-center gap-1">
                  <MessageSquareQuote className="w-4 h-4" />
                  Incluir FAQ
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incluirTabela}
                  onChange={(e) => setIncluirTabela(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-sm text-slate-300 flex items-center gap-1">
                  <Table className="w-4 h-4" />
                  Incluir Tabela
                </span>
              </label>
            </div>

            {/* Instrução Adicional */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Instruções Adicionais (opcional)
              </label>
              <textarea
                value={instrucaoAdicional}
                onChange={(e) => setInstrucaoAdicional(e.target.value)}
                placeholder="Ex: Foque em lava-jatos pequenos, mencione a funcionalidade de agendamento do Lavify..."
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                rows={2}
              />
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
                  Gerando post otimizado...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Post com IA
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Dicas SEO 2026 */}
          <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/20 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-violet-300 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Dicas SEO 2026
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                <span><strong className="text-slate-300">E-E-A-T:</strong> Narrativa em primeira pessoa com experiência real</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                <span><strong className="text-slate-300">GEO:</strong> Estrutura modular para extração por LLMs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                <span><strong className="text-slate-300">Answer-First:</strong> Resposta direta no primeiro parágrafo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">•</span>
                <span><strong className="text-slate-300">Information Gain:</strong> Dados e ângulos únicos</span>
              </li>
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
                  Markdown
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

              {/* Metadata */}
              {metadata && (
                <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                  <span>Gerado em {new Date(metadata.geradoEm).toLocaleString("pt-BR")}</span>
                  <span>{metadata.tokensUsados} tokens</span>
                </div>
              )}

              {/* Conteúdo */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden max-h-[70vh] overflow-y-auto">
                {rawContent ? (
                  <div className="p-6">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                      {rawContent}
                    </pre>
                  </div>
                ) : postGerado && viewMode === "preview" ? (
                  <div className="divide-y divide-slate-700">
                    {/* Título e Meta */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h2 className="text-xl font-bold text-white">
                          {postGerado.titulo}
                        </h2>
                        <button
                          onClick={() => copiarParaClipboard(postGerado.titulo, "titulo")}
                          className="p-2 text-slate-400 hover:text-violet-400 transition-colors"
                        >
                          {copied === "titulo" ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-slate-400 bg-slate-700/50 p-3 rounded-lg">
                        <span className="text-xs text-slate-500 block mb-1">Meta Descrição:</span>
                        {postGerado.metaDescricao}
                      </p>
                    </div>

                    {/* Introdução */}
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-violet-400 mb-2">Introdução</h3>
                      <p className="text-slate-300 leading-relaxed">
                        {postGerado.introducao}
                      </p>
                    </div>

                    {/* Seções */}
                    {postGerado.secoes.map((secao, index) => (
                      <div key={index} className="border-t border-slate-700">
                        <button
                          onClick={() => toggleSection(index)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-colors"
                        >
                          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-violet-400" />
                            {secao.titulo}
                          </h3>
                          {expandedSections.has(index) ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        {expandedSections.has(index) && (
                          <div className="px-6 pb-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {secao.conteudo}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* FAQ */}
                    {postGerado.faq && postGerado.faq.length > 0 && (
                      <div className="p-6">
                        <h3 className="text-sm font-semibold text-violet-400 mb-4 flex items-center gap-2">
                          <ListChecks className="w-4 h-4" />
                          FAQ ({postGerado.faq.length} perguntas)
                        </h3>
                        <div className="space-y-3">
                          {postGerado.faq.map((item, i) => (
                            <details key={i} className="group">
                              <summary className="cursor-pointer text-sm font-medium text-white hover:text-violet-400 transition-colors list-none flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                                {item.pergunta}
                              </summary>
                              <p className="mt-2 ml-6 text-sm text-slate-400">
                                {item.resposta}
                              </p>
                            </details>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Conclusão */}
                    <div className="p-6">
                      <h3 className="text-sm font-semibold text-violet-400 mb-2">Conclusão</h3>
                      <p className="text-slate-300 leading-relaxed">
                        {postGerado.conclusao}
                      </p>
                    </div>

                    {/* Palavras-chave e Topic Cluster */}
                    <div className="p-6 bg-slate-900/50">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {postGerado.palavrasChave.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-violet-500/20 text-violet-300 rounded-lg"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                      {postGerado.topicCluster && (
                        <div className="text-xs text-slate-500">
                          <p className="mb-1">
                            <strong className="text-slate-400">Pillar Page:</strong>{" "}
                            {postGerado.topicCluster.pillarPage}
                          </p>
                          <p>
                            <strong className="text-slate-400">Relacionados:</strong>{" "}
                            {postGerado.topicCluster.artigosRelacionados.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : postGerado && viewMode === "markdown" ? (
                  <div className="p-6">
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => copiarParaClipboard(gerarMarkdown(), "markdown")}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
                      >
                        {copied === "markdown" ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar Markdown
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-900 p-4 rounded-lg overflow-x-auto">
                      {gerarMarkdown()}
                    </pre>
                  </div>
                ) : postGerado && viewMode === "json" ? (
                  <div className="p-6">
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() =>
                          copiarParaClipboard(JSON.stringify(postGerado, null, 2), "json")
                        }
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
                      >
                        {copied === "json" ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar JSON
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs text-slate-300 font-mono bg-slate-900 p-4 rounded-lg overflow-x-auto">
                      {JSON.stringify(postGerado, null, 2)}
                    </pre>
                  </div>
                ) : null}
              </div>

              {/* Botão Regenerar */}
              <button
                onClick={handleGerarPost}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Regenerar Post
              </button>
            </>
          )}

          {/* Empty State */}
          {!postGerado && !rawContent && !loading && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Nenhum post gerado ainda
              </h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Preencha o tema e as configurações ao lado para gerar um post
                otimizado para SEO 2026 usando IA.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

