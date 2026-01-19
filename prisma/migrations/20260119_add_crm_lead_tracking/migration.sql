-- CreateEnum
CREATE TYPE "StatusLead" AS ENUM ('NOVO', 'CONTATO_INICIAL', 'EM_NEGOCIACAO', 'DEMONSTRACAO', 'CONVERTIDO', 'PERDIDO', 'INATIVO');

-- CreateTable
CREATE TABLE "LeadInfo" (
    "id" TEXT NOT NULL,
    "lavaJatoId" TEXT NOT NULL,
    "status" "StatusLead" NOT NULL DEFAULT 'NOVO',
    "temperatura" INTEGER NOT NULL DEFAULT 0,
    "whatsappEnviado" BOOLEAN NOT NULL DEFAULT false,
    "whatsappRespondeu" BOOLEAN NOT NULL DEFAULT false,
    "emailEnviado" BOOLEAN NOT NULL DEFAULT false,
    "emailRespondeu" BOOLEAN NOT NULL DEFAULT false,
    "ligacaoFeita" BOOLEAN NOT NULL DEFAULT false,
    "ligacaoAtendeu" BOOLEAN NOT NULL DEFAULT false,
    "demonstracaoAgendada" BOOLEAN NOT NULL DEFAULT false,
    "demonstracaoRealizada" BOOLEAN NOT NULL DEFAULT false,
    "dataUltimoContato" TIMESTAMP(3),
    "dataProximoContato" TIMESTAMP(3),
    "notas" TEXT,
    "motivoPerda" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadInteracao" (
    "id" TEXT NOT NULL,
    "leadInfoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "resultado" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadInteracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AtividadeLog" (
    "id" TEXT NOT NULL,
    "lavaJatoId" TEXT,
    "usuarioId" TEXT,
    "usuarioNome" TEXT,
    "usuarioEmail" TEXT,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "metadata" TEXT,
    "pagina" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AtividadeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadInfo_lavaJatoId_key" ON "LeadInfo"("lavaJatoId");

-- CreateIndex
CREATE INDEX "LeadInfo_status_idx" ON "LeadInfo"("status");

-- CreateIndex
CREATE INDEX "LeadInfo_dataProximoContato_idx" ON "LeadInfo"("dataProximoContato");

-- CreateIndex
CREATE INDEX "LeadInteracao_leadInfoId_idx" ON "LeadInteracao"("leadInfoId");

-- CreateIndex
CREATE INDEX "LeadInteracao_createdAt_idx" ON "LeadInteracao"("createdAt");

-- CreateIndex
CREATE INDEX "AtividadeLog_lavaJatoId_idx" ON "AtividadeLog"("lavaJatoId");

-- CreateIndex
CREATE INDEX "AtividadeLog_usuarioId_idx" ON "AtividadeLog"("usuarioId");

-- CreateIndex
CREATE INDEX "AtividadeLog_tipo_idx" ON "AtividadeLog"("tipo");

-- CreateIndex
CREATE INDEX "AtividadeLog_createdAt_idx" ON "AtividadeLog"("createdAt");

-- AddForeignKey
ALTER TABLE "LeadInfo" ADD CONSTRAINT "LeadInfo_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteracao" ADD CONSTRAINT "LeadInteracao_leadInfoId_fkey" FOREIGN KEY ("leadInfoId") REFERENCES "LeadInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
