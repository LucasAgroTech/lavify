/**
 * Sistema de Rate Limiting para proteção contra ataques
 * - Limita tentativas por IP
 * - Bloqueio temporário após exceder limite
 * - Proteção contra força bruta
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil: number | null;
}

// Armazenamento em memória (em produção, usar Redis para múltiplas instâncias)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configurações
const RATE_LIMIT_CONFIG = {
  // Login - Mais tolerante para erros de digitação
  login: {
    maxAttempts: 10,          // Máximo de tentativas
    windowMs: 15 * 60 * 1000, // Janela de 15 minutos
    blockDurationMs: 15 * 60 * 1000, // Bloqueio de 15 minutos
  },
  // Registro - Tolerante para erros de validação de senha
  register: {
    maxAttempts: 15,          // Máximo de tentativas (usuário pode errar validações)
    windowMs: 30 * 60 * 1000, // Janela de 30 minutos
    blockDurationMs: 10 * 60 * 1000, // Bloqueio de 10 minutos
  },
  // API geral
  api: {
    maxAttempts: 100,        // Máximo de requisições
    windowMs: 60 * 1000,     // Janela de 1 minuto
    blockDurationMs: 5 * 60 * 1000, // Bloqueio de 5 minutos
  },
};

type RateLimitType = keyof typeof RATE_LIMIT_CONFIG;

/**
 * Limpa entradas expiradas do store
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    const config = key.split(":")[0] as RateLimitType;
    const settings = RATE_LIMIT_CONFIG[config] || RATE_LIMIT_CONFIG.api;
    
    // Remove se a janela expirou e não está bloqueado
    if (
      now - entry.firstAttempt > settings.windowMs &&
      (!entry.blockedUntil || now > entry.blockedUntil)
    ) {
      rateLimitStore.delete(key);
    }
  }
}

// Limpa a cada 5 minutos
setInterval(cleanupExpired, 5 * 60 * 1000);

/**
 * Extrai IP do request
 */
export function getClientIP(request: Request): string {
  // Vercel/Cloudflare headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return "unknown";
}

/**
 * Verifica rate limit
 * @returns { allowed: boolean, remaining: number, resetIn: number, blocked: boolean }
 */
export function checkRateLimit(
  identifier: string,
  type: RateLimitType = "api"
): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  blocked: boolean;
  retryAfter?: number;
} {
  const config = RATE_LIMIT_CONFIG[type];
  const key = `${type}:${identifier}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // Se está bloqueado, verifica se o bloqueio expirou
  if (entry?.blockedUntil) {
    if (now < entry.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: Math.ceil((entry.blockedUntil - now) / 1000),
        blocked: true,
        retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }
    // Bloqueio expirou, reseta
    rateLimitStore.delete(key);
    entry = undefined;
  }

  // Nova entrada ou janela expirada
  if (!entry || now - entry.firstAttempt > config.windowMs) {
    entry = {
      count: 1,
      firstAttempt: now,
      blockedUntil: null,
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetIn: Math.ceil(config.windowMs / 1000),
      blocked: false,
    };
  }

  // Incrementa contador
  entry.count++;

  // Verifica se excedeu limite
  if (entry.count > config.maxAttempts) {
    entry.blockedUntil = now + config.blockDurationMs;
    rateLimitStore.set(key, entry);
    
    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil(config.blockDurationMs / 1000),
      blocked: true,
      retryAfter: Math.ceil(config.blockDurationMs / 1000),
    };
  }

  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxAttempts - entry.count,
    resetIn: Math.ceil((entry.firstAttempt + config.windowMs - now) / 1000),
    blocked: false,
  };
}

/**
 * Reseta rate limit para um identificador (ex: após login bem-sucedido)
 */
export function resetRateLimit(identifier: string, type: RateLimitType = "api") {
  const key = `${type}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Registra tentativa falha (incrementa contador mais rápido)
 */
export function recordFailedAttempt(identifier: string, type: RateLimitType = "api") {
  const key = `${type}:${identifier}`;
  const entry = rateLimitStore.get(key);
  
  if (entry) {
    // Tentativas falhas contam em dobro
    entry.count++;
    rateLimitStore.set(key, entry);
  }
}

/**
 * Headers de rate limit para resposta
 */
export function getRateLimitHeaders(result: ReturnType<typeof checkRateLimit>) {
  const headers: Record<string, string> = {
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetIn.toString(),
  };
  
  if (result.retryAfter) {
    headers["Retry-After"] = result.retryAfter.toString();
  }
  
  return headers;
}
