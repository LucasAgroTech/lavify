/**
 * Performance Monitor para Heroku
 * Monitora uso de memória por funcionalidade
 */

interface PerformanceMetric {
  name: string;
  memoryBefore: number;
  memoryAfter: number;
  memoryUsed: number;
  duration: number;
  timestamp: Date;
}

// Armazena as últimas 100 métricas
const metrics: PerformanceMetric[] = [];
const MAX_METRICS = 100;

// Funções com alto uso de memória detectadas
const highMemoryFunctions: Map<string, { count: number; avgMemory: number }> = new Map();

/**
 * Obtém uso de memória atual em MB
 */
export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
    rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
    external: Math.round(usage.external / 1024 / 1024 * 100) / 100,
  };
}

/**
 * Wrapper para monitorar funções assíncronas
 */
export async function monitorAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const memBefore = process.memoryUsage().heapUsed;
  const startTime = Date.now();

  try {
    const result = await fn();

    const memAfter = process.memoryUsage().heapUsed;
    const memUsed = (memAfter - memBefore) / 1024 / 1024; // MB
    const duration = Date.now() - startTime;

    // Registra métrica
    const metric: PerformanceMetric = {
      name,
      memoryBefore: memBefore / 1024 / 1024,
      memoryAfter: memAfter / 1024 / 1024,
      memoryUsed: memUsed,
      duration,
      timestamp: new Date(),
    };

    metrics.push(metric);
    if (metrics.length > MAX_METRICS) {
      metrics.shift();
    }

    // Atualiza estatísticas de funções com alto uso
    if (memUsed > 5) {
      // Mais de 5MB
      const existing = highMemoryFunctions.get(name);
      if (existing) {
        existing.count++;
        existing.avgMemory = (existing.avgMemory + memUsed) / 2;
      } else {
        highMemoryFunctions.set(name, { count: 1, avgMemory: memUsed });
      }
    }

    // Log em produção se usar muita memória
    if (memUsed > 10 && process.env.NODE_ENV === "production") {
      console.warn(
        `[PERF] Alto uso de memória: ${name} usou ${memUsed.toFixed(2)}MB em ${duration}ms`
      );
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[PERF] Erro em ${name} após ${duration}ms:`, error);
    throw error;
  }
}

/**
 * Obtém relatório de performance
 */
export function getPerformanceReport() {
  const memory = getMemoryUsage();
  const recentMetrics = metrics.slice(-20);

  // Agrupa por nome e calcula médias
  const byFunction: Record<
    string,
    { count: number; avgMemory: number; avgDuration: number; maxMemory: number }
  > = {};

  for (const m of metrics) {
    if (!byFunction[m.name]) {
      byFunction[m.name] = { count: 0, avgMemory: 0, avgDuration: 0, maxMemory: 0 };
    }
    byFunction[m.name].count++;
    byFunction[m.name].avgMemory += m.memoryUsed;
    byFunction[m.name].avgDuration += m.duration;
    byFunction[m.name].maxMemory = Math.max(
      byFunction[m.name].maxMemory,
      m.memoryUsed
    );
  }

  // Calcula médias
  for (const key of Object.keys(byFunction)) {
    byFunction[key].avgMemory /= byFunction[key].count;
    byFunction[key].avgDuration /= byFunction[key].count;
  }

  // Ordena por uso de memória
  const sortedFunctions = Object.entries(byFunction)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.avgMemory - a.avgMemory);

  return {
    currentMemory: memory,
    totalMetrics: metrics.length,
    recentMetrics,
    functionStats: sortedFunctions.slice(0, 10),
    highMemoryAlerts: Array.from(highMemoryFunctions.entries()).map(
      ([name, stats]) => ({
        name,
        ...stats,
      })
    ),
    uptime: process.uptime(),
  };
}

/**
 * Limpa métricas antigas
 */
export function clearMetrics() {
  metrics.length = 0;
  highMemoryFunctions.clear();
}

