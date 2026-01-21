/**
 * Cliente OpenAI Singleton
 * Evita criar múltiplas instâncias que podem causar memory leaks
 */
import OpenAI from "openai";

// Cache do cliente em variável global para evitar recriação
const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

/**
 * Retorna uma instância singleton do cliente OpenAI
 * Usa a variável de ambiente OPENAI_API_KEY
 */
export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada");
  }

  // Retorna instância existente se disponível
  if (globalForOpenAI.openai) {
    return globalForOpenAI.openai;
  }

  // Cria nova instância com configurações otimizadas
  globalForOpenAI.openai = new OpenAI({
    apiKey,
    maxRetries: 2,
    timeout: 60000, // 60 segundos
  });

  return globalForOpenAI.openai;
}

/**
 * Verifica se a API Key está configurada
 */
export function hasOpenAIKey(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

