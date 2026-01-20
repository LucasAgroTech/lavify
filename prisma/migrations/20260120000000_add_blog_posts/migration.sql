-- CreateEnum
CREATE TYPE "StatusPost" AS ENUM ('RASCUNHO', 'PUBLICADO', 'ARQUIVADO');

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "metaDescricao" TEXT NOT NULL,
    "introducao" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "conclusao" TEXT NOT NULL,
    "palavrasChave" TEXT[],
    "categoria" TEXT NOT NULL DEFAULT 'guia',
    "faq" TEXT,
    "pillarPage" TEXT,
    "artigosRelacionados" TEXT[],
    "autorId" TEXT NOT NULL DEFAULT 'lucas-pinheiro',
    "autorNome" TEXT NOT NULL DEFAULT 'Lucas Pinheiro',
    "status" "StatusPost" NOT NULL DEFAULT 'RASCUNHO',
    "publicadoEm" TIMESTAMP(3),
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "geradoPorIA" BOOLEAN NOT NULL DEFAULT true,
    "modeloIA" TEXT,
    "tokensUsados" INTEGER,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");

-- CreateIndex
CREATE INDEX "BlogPost_categoria_idx" ON "BlogPost"("categoria");

-- CreateIndex
CREATE INDEX "BlogPost_publicadoEm_idx" ON "BlogPost"("publicadoEm");

-- CreateIndex
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");

