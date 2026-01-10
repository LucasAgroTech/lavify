-- AlterEnum: Adiciona novos níveis de lavadores
-- Nota: IF NOT EXISTS evita erro se já existir (deploy parcial anterior)
ALTER TYPE "RoleUsuario" ADD VALUE IF NOT EXISTS 'LAVADOR_SENIOR';
ALTER TYPE "RoleUsuario" ADD VALUE IF NOT EXISTS 'LAVADOR_JUNIOR';

