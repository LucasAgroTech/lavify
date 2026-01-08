import { prisma } from "./prisma";

interface ProdutoBaixoEstoque {
  id: string;
  nome: string;
  quantidade: number;
  pontoReposicao: number;
  unidade: string;
}

// Abate estoque quando OS é finalizada
export async function abaterEstoqueOS(osId: string): Promise<void> {
  // Busca a OS com seus itens e serviços
  const os = await prisma.ordemServico.findUnique({
    where: { id: osId },
    include: {
      itens: {
        include: {
          servico: {
            include: {
              produtos: {
                include: {
                  produto: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!os) throw new Error("OS não encontrada");

  // Para cada item da OS
  for (const item of os.itens) {
    // Para cada produto consumido pelo serviço
    for (const consumo of item.servico.produtos) {
      // Abate a quantidade do estoque
      await prisma.produto.update({
        where: { id: consumo.produtoId },
        data: {
          quantidade: {
            decrement: consumo.quantidade,
          },
        },
      });

      console.log(
        `[Estoque] Abatido ${consumo.quantidade}${consumo.produto.unidade} de ${consumo.produto.nome}`
      );
    }
  }
}

// Verifica produtos com estoque baixo de um lava jato específico
export async function verificarEstoqueBaixo(lavaJatoId: string): Promise<ProdutoBaixoEstoque[]> {
  const produtos = await prisma.produto.findMany({
    where: { lavaJatoId, ativo: true },
  });

  return produtos
    .filter((p) => p.quantidade <= p.pontoReposicao)
    .map((p) => ({
      id: p.id,
      nome: p.nome,
      quantidade: p.quantidade,
      pontoReposicao: p.pontoReposicao,
      unidade: p.unidade,
    }));
}

// Calcula custo de uma OS baseado nos produtos consumidos
export async function calcularCustoOS(osId: string): Promise<number> {
  const os = await prisma.ordemServico.findUnique({
    where: { id: osId },
    include: {
      itens: {
        include: {
          servico: {
            include: {
              produtos: {
                include: {
                  produto: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!os) return 0;

  let custoTotal = 0;

  for (const item of os.itens) {
    for (const consumo of item.servico.produtos) {
      custoTotal += consumo.quantidade * consumo.produto.custoPorUnidade;
    }
  }

  return custoTotal;
}

