-- CreateEnum
CREATE TYPE "RoleUsuario" AS ENUM ('ADMIN', 'GERENTE', 'ATENDENTE', 'LAVADOR');

-- CreateEnum
CREATE TYPE "StatusOS" AS ENUM ('AGUARDANDO', 'LAVANDO', 'FINALIZANDO', 'PRONTO', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "TipoPagamento" AS ENUM ('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'DINHEIRO', 'MENSALIDADE');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('RECEITA', 'DESPESA');

-- CreateTable
CREATE TABLE "LavaJato" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "logoUrl" TEXT,
    "corPrimaria" TEXT NOT NULL DEFAULT '#06b6d4',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT,

    CONSTRAINT "LavaJato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "role" "RoleUsuario" NOT NULL DEFAULT 'ATENDENTE',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lavaJatoId" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessao" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Sessao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "senha" TEXT,
    "pontosFidelidade" INTEGER NOT NULL DEFAULT 0,
    "saldoCashback" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "planoMensal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lavaJatoId" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Veiculo" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "cor" TEXT,
    "clienteId" TEXT NOT NULL,
    "lavaJatoId" TEXT,

    CONSTRAINT "Veiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION NOT NULL,
    "tempoEstimado" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "lavaJatoId" TEXT NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" TEXT NOT NULL,
    "codigo" INTEGER NOT NULL,
    "status" "StatusOS" NOT NULL DEFAULT 'AGUARDANDO',
    "dataEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "previsaoSaida" TIMESTAMP(3),
    "dataFinalizacao" TIMESTAMP(3),
    "clienteId" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "lavaJatoId" TEXT NOT NULL,
    "checklistEntrada" TEXT,
    "fotosAntes" TEXT,
    "fotosDepois" TEXT,
    "observacoes" TEXT,
    "total" DOUBLE PRECISION NOT NULL,
    "desconto" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "agendamentoId" TEXT,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemOrdem" (
    "id" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "osId" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,

    CONSTRAINT "ItemOrdem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT NOT NULL,
    "custoPorUnidade" DOUBLE PRECISION NOT NULL,
    "pontoReposicao" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "lavaJatoId" TEXT NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsumoProduto" (
    "id" TEXT NOT NULL,
    "quantidade" DOUBLE PRECISION NOT NULL,
    "servicoId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,

    CONSTRAINT "ConsumoProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financeiro" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "formaPagamento" "TipoPagamento",
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lavaJatoId" TEXT NOT NULL,
    "osId" TEXT,

    CONSTRAINT "Financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id" TEXT NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "observacoes" TEXT,
    "totalEstimado" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "veiculoId" TEXT NOT NULL,
    "lavaJatoId" TEXT NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgendamentoServico" (
    "id" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "agendamentoId" TEXT NOT NULL,
    "servicoId" TEXT NOT NULL,

    CONSTRAINT "AgendamentoServico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LavaJato_cnpj_key" ON "LavaJato"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "LavaJato_slug_key" ON "LavaJato"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Sessao_token_key" ON "Sessao"("token");

-- CreateIndex
CREATE INDEX "Cliente_lavaJatoId_idx" ON "Cliente"("lavaJatoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Veiculo_placa_lavaJatoId_key" ON "Veiculo"("placa", "lavaJatoId");

-- CreateIndex
CREATE INDEX "Veiculo_lavaJatoId_idx" ON "Veiculo"("lavaJatoId");

-- CreateIndex
CREATE INDEX "Servico_lavaJatoId_idx" ON "Servico"("lavaJatoId");

-- CreateIndex
CREATE INDEX "OrdemServico_lavaJatoId_idx" ON "OrdemServico"("lavaJatoId");

-- CreateIndex
CREATE INDEX "OrdemServico_status_idx" ON "OrdemServico"("status");

-- CreateIndex
CREATE UNIQUE INDEX "OrdemServico_codigo_lavaJatoId_key" ON "OrdemServico"("codigo", "lavaJatoId");

-- CreateIndex
CREATE UNIQUE INDEX "OrdemServico_agendamentoId_key" ON "OrdemServico"("agendamentoId");

-- CreateIndex
CREATE INDEX "Produto_lavaJatoId_idx" ON "Produto"("lavaJatoId");

-- CreateIndex
CREATE INDEX "Financeiro_lavaJatoId_idx" ON "Financeiro"("lavaJatoId");

-- CreateIndex
CREATE INDEX "Financeiro_data_idx" ON "Financeiro"("data");

-- CreateIndex
CREATE INDEX "Agendamento_clienteId_idx" ON "Agendamento"("clienteId");

-- CreateIndex
CREATE INDEX "Agendamento_lavaJatoId_idx" ON "Agendamento"("lavaJatoId");

-- CreateIndex
CREATE INDEX "Agendamento_dataHora_idx" ON "Agendamento"("dataHora");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Veiculo" ADD CONSTRAINT "Veiculo_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrdem" ADD CONSTRAINT "ItemOrdem_osId_fkey" FOREIGN KEY ("osId") REFERENCES "OrdemServico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemOrdem" ADD CONSTRAINT "ItemOrdem_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoProduto" ADD CONSTRAINT "ConsumoProduto_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsumoProduto" ADD CONSTRAINT "ConsumoProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financeiro" ADD CONSTRAINT "Financeiro_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financeiro" ADD CONSTRAINT "Financeiro_osId_fkey" FOREIGN KEY ("osId") REFERENCES "OrdemServico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "Veiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_lavaJatoId_fkey" FOREIGN KEY ("lavaJatoId") REFERENCES "LavaJato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoServico" ADD CONSTRAINT "AgendamentoServico_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendamentoServico" ADD CONSTRAINT "AgendamentoServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

