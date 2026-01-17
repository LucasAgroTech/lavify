-- AlterTable
ALTER TABLE "LavaJato" ADD COLUMN "fidelidadeAtiva" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "LavaJato" ADD COLUMN "metaFidelidade" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN "participaFidelidade" BOOLEAN NOT NULL DEFAULT true;

