-- AlterEnum: Adiciona novos níveis de lavadores
-- Primeiro, renomeia LAVADOR para LAVADOR_SENIOR (mantendo os existentes)
ALTER TYPE "RoleUsuario" ADD VALUE 'LAVADOR_SENIOR';
ALTER TYPE "RoleUsuario" ADD VALUE 'LAVADOR_JUNIOR';

-- Atualiza usuários existentes com role LAVADOR para LAVADOR_SENIOR
UPDATE "Usuario" SET "role" = 'LAVADOR_SENIOR' WHERE "role" = 'LAVADOR';

