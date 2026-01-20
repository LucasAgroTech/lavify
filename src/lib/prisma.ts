import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Limitar connection pool via URL para Heroku
// Adiciona ?connection_limit=5 à URL do banco se não existir
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL || "";
  const limit = process.env.PRISMA_CONNECTION_LIMIT || "5";

  if (!url) return url;

  // Se já tem connection_limit, retorna como está
  if (url.includes("connection_limit")) return url;

  // Adiciona connection_limit à URL
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}connection_limit=${limit}`;
}

// Configuração otimizada para ambientes serverless/Heroku
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

// Singleton para evitar múltiplas instâncias e memory leaks
globalForPrisma.prisma = prisma;

