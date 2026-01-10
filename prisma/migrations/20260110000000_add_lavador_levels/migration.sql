-- AlterEnum: Adiciona novos níveis de lavadores
-- Nota: Em PostgreSQL, novos valores de enum precisam ser commitados antes de usar
-- Então separamos a adição dos valores (que é auto-commit no deploy)
ALTER TYPE "RoleUsuario" ADD VALUE IF NOT EXISTS 'LAVADOR_SENIOR';
ALTER TYPE "RoleUsuario" ADD VALUE IF NOT EXISTS 'LAVADOR_JUNIOR';

