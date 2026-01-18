// Conteúdo rico e detalhado para páginas de SEO de guias
// Informações reais e verificáveis do mercado brasileiro

export interface ConteudoGuia {
  titulo: string;
  subtitulo: string;
  introducao: string;
  secoes: {
    titulo: string;
    conteudo: string;
    lista?: string[];
  }[];
  tabela?: {
    titulo: string;
    colunas: string[];
    linhas: string[][];
  };
  checklist?: { item: string; descricao: string }[];
  faq: { pergunta: string; resposta: string }[];
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEÚDO DETALHADO POR SLUG
// ═══════════════════════════════════════════════════════════════════════════

export function getConteudoRico(slug: string, cidade?: { nome: string; uf: string; regiao: string } | null): ConteudoGuia {
  const localidade = cidade ? ` em ${cidade.nome}` : "";
  const regiao = cidade?.regiao || "Brasil";
  
  // Multiplicador de preços por região
  const mult: Record<string, number> = { 
    "Sudeste": 1.2, 
    "Sul": 1.1, 
    "Centro-Oeste": 1.0, 
    "Nordeste": 0.85, 
    "Norte": 0.9, 
    "Brasil": 1.0 
  };
  const m = mult[regiao] || 1.0;
  const p = (v: number) => `R$ ${Math.round(v * m)},00`;
  const f = (min: number, max: number) => `${p(min)} - ${p(max)}`;

  // ═══════════════════════════════════════════════════════════════════════
  // COMO EMITIR NOTA FISCAL
  // ═══════════════════════════════════════════════════════════════════════
  if (slug.includes("como-emitir-nota-fiscal")) {
    return {
      titulo: `Como Emitir Nota Fiscal em Lava Jato${localidade}`,
      subtitulo: "Guia completo sobre obrigações fiscais para lava rápido em 2026",
      introducao: `Emitir nota fiscal é obrigatório para a maioria dos lava jatos no Brasil. Neste guia, explicamos como funciona a emissão de NF para serviços de lavagem automotiva, quais os tipos de nota, quando você precisa emitir e como fazer isso de forma simples${localidade}.`,
      secoes: [
        {
          titulo: "Quando o Lava Jato Precisa Emitir Nota Fiscal",
          conteudo: `Todo lava jato formalizado (MEI, ME ou EPP) é obrigado a emitir nota fiscal quando o cliente solicita. Para MEI, a obrigatoriedade é apenas quando o cliente é pessoa jurídica ou quando o cliente pessoa física solicita. Para ME e EPP, a emissão é obrigatória em todas as operações.\n\nA não emissão de nota fiscal configura sonegação fiscal e pode gerar multas de até 150% do valor do imposto devido, além de processos criminais em casos graves.`,
          lista: [
            "MEI: obrigatório para PJ e quando PF solicita",
            "ME/EPP: obrigatório em todas as vendas",
            "Limite MEI 2026: R$ 81.000/ano",
            "Multa por sonegação: até 150% do imposto"
          ]
        },
        {
          titulo: "Tipos de Nota Fiscal para Lava Jato",
          conteudo: `Lava jatos prestam serviços, então emitem NFS-e (Nota Fiscal de Serviço Eletrônica). Cada município tem seu próprio sistema de emissão. Você precisa se cadastrar no sistema da sua prefeitura${localidade ? ` (Prefeitura de ${cidade?.nome})` : ""} para emitir as notas.\n\nO código de serviço para lava jato geralmente é o 7.02 (Serviços de lavagem, lubrificação e polimento de veículos). O ISS (Imposto Sobre Serviços) varia de 2% a 5% dependendo do município.`,
          lista: [
            "NFS-e: Nota Fiscal de Serviço Eletrônica",
            "Código de serviço: 7.02 (lavagem de veículos)",
            "ISS: entre 2% e 5% (varia por cidade)",
            "Sistema: site da prefeitura local"
          ]
        },
        {
          titulo: "Passo a Passo para Emitir NFS-e",
          conteudo: `1. Acesse o site da prefeitura${localidade} e procure por "Nota Fiscal Eletrônica" ou "NFS-e"\n2. Faça o cadastro do seu CNPJ (primeira vez)\n3. Gere o certificado digital ou use login/senha\n4. Preencha os dados: CNPJ/CPF do cliente, descrição do serviço, valor\n5. Selecione o código 7.02 (lavagem de veículos)\n6. Emita a nota e envie por e-mail ou WhatsApp ao cliente`,
          lista: [
            "Cadastro único no site da prefeitura",
            "Certificado digital A1 ou A3 (ME/EPP)",
            "Dados do cliente: CPF/CNPJ e endereço",
            "Descrição clara do serviço prestado"
          ]
        },
        {
          titulo: "MEI: Regras Específicas",
          conteudo: `O MEI (Microempreendedor Individual) tem regras simplificadas. Paga um valor fixo mensal (DAS) que já inclui ISS. Em 2026, o limite de faturamento é R$ 81.000 por ano (média de R$ 6.750/mês).\n\nO MEI não é obrigado a ter contador, mas precisa fazer a Declaração Anual (DASN-SIMEI) até 31 de maio de cada ano. Se ultrapassar o limite de faturamento, será desenquadrado e passará a ME.`,
          lista: [
            "DAS mensal: ~R$ 70,00 (já inclui ISS)",
            "Limite 2026: R$ 81.000/ano",
            "Declaração Anual: até 31 de maio",
            "Não precisa de contador"
          ]
        }
      ],
      tabela: {
        titulo: "Comparativo: MEI x ME x EPP",
        colunas: ["Característica", "MEI", "ME", "EPP"],
        linhas: [
          ["Faturamento máximo/ano", "R$ 81.000", "R$ 360.000", "R$ 4,8 milhões"],
          ["Funcionários", "1", "Ilimitado", "Ilimitado"],
          ["Imposto mensal", "~R$ 70 (fixo)", "Simples Nacional", "Simples Nacional"],
          ["Contador obrigatório", "Não", "Sim", "Sim"],
          ["Emissão NF", "Opcional PF", "Obrigatória", "Obrigatória"]
        ]
      },
      faq: [
        { 
          pergunta: "Lava jato MEI precisa emitir nota fiscal?", 
          resposta: "Só é obrigatório quando o cliente é pessoa jurídica (empresa) ou quando o cliente pessoa física solicita. Para clientes PF que não pedem, não é obrigatório, mas é recomendado para controle." 
        },
        { 
          pergunta: "Qual imposto o lava jato paga sobre a nota?", 
          resposta: "O ISS (Imposto Sobre Serviços) varia de 2% a 5% dependendo do município. MEI já paga o ISS no DAS mensal fixo. ME e EPP pagam pelo Simples Nacional, que varia conforme faturamento." 
        },
        { 
          pergunta: "Como emitir nota fiscal pelo celular?", 
          resposta: "Muitas prefeituras têm apps para emissão de NFS-e. Procure o app da sua prefeitura na loja. Alternativamente, use sistemas de gestão como o Lavify que integram com a prefeitura e emitem notas automaticamente." 
        },
        { 
          pergunta: "Posso emitir nota fiscal sem CNPJ?", 
          resposta: "Não. Para emitir nota fiscal, você precisa ter um CNPJ ativo. A forma mais simples é abrir um MEI, que é gratuito e pode ser feito online em minutos pelo Portal do Empreendedor." 
        }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // COMO ABRIR LAVA JATO
  // ═══════════════════════════════════════════════════════════════════════
  if (slug.includes("como-abrir-lava-jato")) {
    return {
      titulo: `Como Abrir um Lava Jato${localidade}`,
      subtitulo: "Guia completo com investimento, documentação e passo a passo",
      introducao: `Abrir um lava jato${localidade} pode ser um excelente negócio. O setor de estética automotiva cresce cerca de 8% ao ano no Brasil. Neste guia, detalhamos todo o processo: desde a escolha do ponto até a documentação necessária, passando pelo investimento inicial e equipamentos essenciais.`,
      secoes: [
        {
          titulo: "Investimento Inicial: Quanto Custa Abrir um Lava Jato",
          conteudo: `O investimento para abrir um lava jato${localidade} varia de R$ 15.000 (estrutura simples) a R$ 150.000+ (estrutura completa com estética automotiva). Um lava jato de porte médio, com 2 boxes e equipamentos de qualidade, custa entre R$ 40.000 e R$ 70.000 para montar.\n\nO maior custo geralmente é a adequação do espaço (piso, drenagem, caixa separadora) e os equipamentos (lavadoras de alta pressão, aspiradores, compressor).`,
          lista: [
            "Lava jato simples: R$ 15.000 - R$ 30.000",
            "Lava jato médio (2 boxes): R$ 40.000 - R$ 70.000",
            "Lava jato completo: R$ 80.000 - R$ 150.000",
            "Centro de estética: R$ 150.000+"
          ]
        },
        {
          titulo: "Documentação e Legalização",
          conteudo: `Para abrir um lava jato regularizado${localidade}, você precisa de CNPJ, alvará de funcionamento, licença ambiental e registro no corpo de bombeiros. O processo completo leva de 30 a 90 dias dependendo do município.\n\nA licença ambiental é obrigatória porque lava jatos geram efluentes (água suja com óleo, graxa e produtos químicos) que precisam de tratamento antes de serem descartados.`,
          lista: [
            "CNPJ (MEI ou ME) - Portal do Empreendedor",
            "Inscrição Municipal - Prefeitura",
            "Alvará de Funcionamento - Prefeitura",
            "Licença Ambiental - Órgão ambiental estadual/municipal",
            "AVCB (Bombeiros) - Corpo de Bombeiros"
          ]
        },
        {
          titulo: "Escolha do Ponto Comercial",
          conteudo: `A localização é crucial para o sucesso. Priorize locais com alto fluxo de veículos, fácil acesso e estacionamento. Evite áreas residenciais exclusivas (podem ter restrições) e locais sem infraestrutura de água/esgoto.\n\nO ideal é um terreno de no mínimo 150m² para um lava jato pequeno, ou 300m²+ para estrutura completa. Verifique se o zoneamento permite atividade comercial/industrial.`,
          lista: [
            "Fluxo de veículos: próximo a avenidas movimentadas",
            "Visibilidade: fachada visível da rua",
            "Tamanho mínimo: 150m² (pequeno), 300m²+ (médio)",
            "Infraestrutura: água, esgoto, energia elétrica",
            "Zoneamento: verificar na prefeitura"
          ]
        },
        {
          titulo: "Equipamentos Essenciais",
          conteudo: `Os equipamentos são o coração do lava jato. Uma lavadora de alta pressão profissional (não doméstica!) é indispensável. Invista em equipamentos de qualidade - eles duram mais e trabalham melhor.\n\nMarcas recomendadas: WAP, Karcher, Jacto, Chiaperini. Evite equipamentos domésticos, eles não aguentam uso intensivo e quebram rápido.`,
          lista: [
            "Lavadora de alta pressão profissional: R$ 2.000 - R$ 8.000",
            "Aspirador industrial: R$ 800 - R$ 3.000",
            "Compressor de ar: R$ 1.500 - R$ 5.000",
            "Politriz rotativa e roto-orbital: R$ 500 - R$ 2.000",
            "Gerador de espuma (snow foam): R$ 300 - R$ 1.000",
            "Extratora para higienização: R$ 1.500 - R$ 4.000"
          ]
        },
        {
          titulo: "Caixa Separadora de Água e Óleo",
          conteudo: `A caixa separadora é OBRIGATÓRIA para lava jatos. Ela separa óleo e graxas da água antes de enviar para o esgoto. Sem ela, você não consegue licença ambiental e pode ser multado.\n\nO tamanho da caixa depende do volume de água utilizado. Para um lava jato de 2 boxes, uma caixa de 1.000 litros geralmente é suficiente. O custo varia de R$ 3.000 a R$ 15.000 dependendo do material e capacidade.`
        }
      ],
      tabela: {
        titulo: "Investimento Detalhado - Lava Jato Médio",
        colunas: ["Item", "Custo Estimado"],
        linhas: [
          ["Reforma/adequação do espaço", f(10000, 25000)],
          ["Caixa separadora de água e óleo", f(3000, 8000)],
          ["Lavadora de alta pressão (2x)", f(4000, 12000)],
          ["Aspirador industrial", f(800, 2000)],
          ["Compressor", f(1500, 4000)],
          ["Produtos iniciais (estoque)", f(2000, 5000)],
          ["Mobiliário e decoração", f(2000, 5000)],
          ["Documentação e taxas", f(1500, 4000)],
          ["Capital de giro (3 meses)", f(10000, 20000)],
          ["TOTAL ESTIMADO", f(35000, 85000)]
        ]
      },
      faq: [
        { 
          pergunta: `Quanto custa abrir um lava jato${localidade}?`, 
          resposta: `O investimento inicial${localidade} varia de R$ 15.000 (estrutura simples) a R$ 150.000+ (centro de estética completo). Um lava jato de porte médio custa entre ${f(40000, 70000)} para montar.` 
        },
        { 
          pergunta: "Precisa de licença ambiental para lava jato?", 
          resposta: "Sim, é obrigatório. Lava jatos geram efluentes que precisam de tratamento. Você precisa instalar uma caixa separadora de água e óleo e obter licença do órgão ambiental do seu estado ou município." 
        },
        { 
          pergunta: "Qual o faturamento médio de um lava jato?", 
          resposta: "Um lava jato de pequeno porte fatura entre R$ 8.000 e R$ 15.000/mês. Porte médio: R$ 15.000 a R$ 40.000/mês. Centros de estética automotiva podem faturar R$ 50.000 a R$ 150.000/mês." 
        },
        { 
          pergunta: "Lava jato dá lucro?", 
          resposta: "Sim, a margem de lucro de um lava jato bem administrado fica entre 30% e 50%. O segredo é controlar custos (principalmente água e produtos), ter bom fluxo de clientes e oferecer serviços com maior valor agregado (polimento, higienização)." 
        }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TABELA DE PREÇOS DE LAVAGEM
  // ═══════════════════════════════════════════════════════════════════════
  if (slug.includes("tabela-precos-lavagem")) {
    return {
      titulo: `Tabela de Preços de Lavagem Automotiva${localidade}`,
      subtitulo: `Valores atualizados do mercado para ${new Date().getFullYear()}`,
      introducao: `Confira os preços praticados no mercado de lavagem automotiva${localidade}. Esta tabela serve como referência para donos de lava jato precificarem seus serviços de forma competitiva, e para clientes entenderem os valores médios da região ${regiao}.`,
      secoes: [
        {
          titulo: "Como Definir Preços no Seu Lava Jato",
          conteudo: `A precificação correta é fundamental para a lucratividade. Considere seus custos fixos (aluguel, funcionários, luz, água), custos variáveis (produtos por lavagem) e a margem de lucro desejada. Um erro comum é precificar muito baixo para "ganhar no volume" - isso geralmente leva a prejuízo.\n\nCalcule o custo real de cada serviço: tempo do funcionário (salário/hora), produtos utilizados, água e energia. Some 30-50% de margem para chegar ao preço final.`,
          lista: [
            "Custo de mão de obra: salário ÷ horas trabalhadas",
            "Custo de produtos: R$ 3 a R$ 15 por lavagem",
            "Custo de água: R$ 1 a R$ 5 por lavagem",
            "Margem de lucro ideal: 30% a 50%"
          ]
        },
        {
          titulo: "Diferença de Preço por Tipo de Veículo",
          conteudo: `É prática padrão do mercado cobrar mais de veículos maiores. Um SUV ou pickup exige 40-60% mais tempo, produtos e água do que um carro popular. Defina pelo menos 3 faixas de preço: carros pequenos/médios, SUVs/pickups e utilitários/vans.\n\nAlguns lava jatos também diferenciam por nível de sujeira - veículos muito sujos podem ter acréscimo de 20-30%.`
        },
        {
          titulo: "Serviços com Maior Margem de Lucro",
          conteudo: `Serviços de estética automotiva têm margem muito maior que lavagem simples. Polimento, vitrificação, higienização e limpeza de motor são os campeões de rentabilidade. Um polimento de R$ 300 pode ter custo de R$ 50-80 (principalmente mão de obra).\n\nInvista em capacitação e equipamentos para oferecer esses serviços. É o caminho para aumentar o ticket médio e a lucratividade.`,
          lista: [
            "Polimento: margem de 60-70%",
            "Vitrificação: margem de 50-65%",
            "Higienização: margem de 55-70%",
            "Lavagem simples: margem de 35-45%"
          ]
        }
      ],
      tabela: {
        titulo: `Tabela de Preços - Lavagem Automotiva${localidade}`,
        colunas: ["Serviço", "Carro Popular", "SUV/Pickup", "Utilitário/Van"],
        linhas: [
          ["Lavagem Simples (externa)", f(25, 40), f(35, 55), f(50, 80)],
          ["Lavagem Completa (ext + int)", f(45, 70), f(65, 100), f(90, 140)],
          ["Lavagem + Cera", f(60, 90), f(85, 130), f(120, 180)],
          ["Lavagem Técnica de Motor", f(50, 80), f(70, 100), f(90, 130)],
          ["Higienização Interna", f(100, 180), f(140, 220), f(180, 300)],
          ["Higienização de Ar Condicionado", f(60, 100), f(70, 120), f(80, 140)],
          ["Limpeza de Bancos (tecido)", f(80, 150), f(100, 180), f(140, 250)],
          ["Limpeza de Bancos (couro)", f(100, 180), f(130, 220), f(180, 300)],
          ["Polimento Simples", f(180, 300), f(250, 400), f(350, 550)],
          ["Polimento Técnico (correção)", f(350, 600), f(500, 850), f(700, 1200)],
          ["Cristalização de Vidros", f(100, 180), f(130, 220), f(180, 300)],
          ["Impermeabilização de Tecidos", f(150, 250), f(200, 350), f(280, 450)]
        ]
      },
      faq: [
        { 
          pergunta: `Qual o preço médio de uma lavagem completa${localidade}?`, 
          resposta: `Uma lavagem completa (externa + interna) custa em média ${f(45, 70)} para carros populares e ${f(65, 100)} para SUVs${localidade}. Valores podem variar conforme o padrão do estabelecimento.` 
        },
        { 
          pergunta: "Por que SUVs pagam mais caro?", 
          resposta: "Veículos maiores exigem mais tempo de serviço (40-60% a mais), mais produtos de limpeza e mais água. O preço maior reflete esses custos adicionais." 
        },
        { 
          pergunta: "Vale a pena oferecer lavagem barata?", 
          resposta: "Cuidado com preços muito baixos. A margem de lucro em lavagem simples já é apertada (35-45%). Preço muito abaixo do mercado pode significar prejuízo ou qualidade inferior. Foque em agregar valor, não em preço baixo." 
        },
        { 
          pergunta: "Como aumentar o ticket médio?", 
          resposta: "Ofereça pacotes combinados (lavagem + cera, lavagem + higienização), crie programas de fidelidade, e treine sua equipe para oferecer serviços adicionais. Um upgrade de R$ 20-30 por cliente faz grande diferença no final do mês." 
        }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // TABELA DE PREÇOS ESTÉTICA AUTOMOTIVA
  // ═══════════════════════════════════════════════════════════════════════
  if (slug.includes("tabela-precos-estetica")) {
    return {
      titulo: `Tabela de Preços de Estética Automotiva${localidade}`,
      subtitulo: `Valores de polimento, vitrificação e detalhamento em ${new Date().getFullYear()}`,
      introducao: `A estética automotiva é o segmento mais rentável do setor de lavagem de veículos. Serviços como polimento técnico, vitrificação e coating cerâmico têm margens de lucro superiores a 50%. Confira os preços praticados${localidade} e entenda como precificar corretamente.`,
      secoes: [
        {
          titulo: "Polimento Automotivo: Tipos e Preços",
          conteudo: `O polimento remove arranhões, marcas de oxidação e hologramas da pintura. Existem diferentes níveis:\n\n• Polimento Simples (1 etapa): remove marcas leves, dá brilho. R$ 200-400\n• Polimento Técnico (2-3 etapas): correção de 70-90% dos defeitos. R$ 400-800\n• Polimento de Correção (3+ etapas): máxima correção, pintura espelhada. R$ 800-1.500\n\nO preço varia conforme tamanho do veículo, estado da pintura e nível de correção desejado.`,
          lista: [
            "Polimento simples: 2-3 horas de trabalho",
            "Polimento técnico: 4-8 horas de trabalho",
            "Polimento de correção: 8-16 horas de trabalho",
            "Custo de insumos: R$ 30-80 por veículo"
          ]
        },
        {
          titulo: "Vitrificação e Coating Cerâmico",
          conteudo: `A vitrificação cria uma camada protetora sobre a pintura. Existem diferentes níveis de proteção:\n\n• Selante sintético: proteção de 2-4 meses. R$ 150-300\n• Vitrificação simples: proteção de 6-12 meses. R$ 400-800\n• Coating cerâmico 9H: proteção de 2-5 anos. R$ 1.200-3.500\n• Coating profissional: proteção de 5+ anos. R$ 3.000-6.000\n\nO coating cerâmico exige preparação adequada (polimento prévio) para máxima durabilidade.`,
          lista: [
            "Selante: fácil aplicação, menor durabilidade",
            "Vitrificação: boa relação custo-benefício",
            "Coating 9H: proteção profissional duradoura",
            "PPF (película): proteção física contra riscos"
          ]
        },
        {
          titulo: "Higienização e Limpeza Interna",
          conteudo: `A higienização interna vai muito além de aspirar o carro. Inclui limpeza profunda de bancos, carpetes, forros, painéis e dutos de ar condicionado. É um serviço muito procurado por quem compra carro usado ou precisa remover odores.\n\nA margem de lucro é excelente: o custo de produtos fica entre R$ 20-50, enquanto o serviço é vendido por R$ 150-350.`,
          lista: [
            "Higienização simples: aspiração + limpeza de painéis",
            "Higienização completa: inclui bancos e carpetes",
            "Higienização profunda: inclui teto, portas, porta-malas",
            "Ozonização: eliminação de odores e bactérias"
          ]
        },
        {
          titulo: "Como Precificar Serviços de Estética",
          conteudo: `A precificação em estética automotiva considera principalmente o tempo de trabalho e o nível técnico exigido. Calcule:\n\n1. Custo/hora do profissional: R$ 30-80/hora\n2. Tempo estimado do serviço\n3. Custo de produtos/insumos\n4. Margem de lucro: 50-70%\n\nExemplo: Polimento técnico de 6 horas\n• Mão de obra: 6h x R$ 50 = R$ 300\n• Produtos: R$ 50\n• Total custo: R$ 350\n• Preço de venda (margem 50%): R$ 525-600`
        }
      ],
      tabela: {
        titulo: `Tabela de Preços - Estética Automotiva${localidade}`,
        colunas: ["Serviço", "Carro Pequeno/Médio", "SUV/Pickup", "Tempo Médio"],
        linhas: [
          ["Polimento Simples", f(200, 350), f(280, 450), "2-4 horas"],
          ["Polimento Técnico", f(400, 650), f(550, 850), "4-8 horas"],
          ["Polimento de Correção", f(800, 1400), f(1100, 1800), "8-16 horas"],
          ["Selante Sintético", f(150, 280), f(200, 380), "1-2 horas"],
          ["Vitrificação", f(450, 800), f(600, 1000), "2-4 horas"],
          ["Coating Cerâmico 9H", f(1200, 2500), f(1800, 3500), "1-2 dias"],
          ["Coating Profissional", f(3000, 5000), f(4000, 7000), "2-3 dias"],
          ["Higienização Interna", f(150, 280), f(200, 380), "2-4 horas"],
          ["Higienização + Ozonização", f(200, 350), f(280, 480), "3-5 horas"],
          ["Limpeza de Motor", f(80, 150), f(100, 200), "30-60 min"],
          ["Cristalização de Vidros", f(120, 200), f(150, 280), "1-2 horas"],
          ["Revitalização de Plásticos", f(100, 180), f(130, 250), "1-2 horas"],
          ["Revitalização de Faróis", f(80, 150), f(100, 180), "1-2 horas"],
          ["PPF Parcial (frontal)", f(2500, 5000), f(3500, 7000), "1-2 dias"],
          ["PPF Completo", f(8000, 15000), f(12000, 22000), "3-5 dias"]
        ]
      },
      faq: [
        { 
          pergunta: "Qual a diferença entre vitrificação e coating cerâmico?", 
          resposta: "A vitrificação tradicional dura de 6 a 12 meses. O coating cerâmico 9H é uma evolução, com durabilidade de 2 a 5 anos, maior resistência a produtos químicos e hidrofobicidade superior. O preço do coating é maior, mas o custo-benefício a longo prazo é melhor." 
        },
        { 
          pergunta: `Quanto custa um polimento completo${localidade}?`, 
          resposta: `Um polimento técnico (2-3 etapas) custa entre ${f(400, 650)} para carros pequenos e ${f(550, 850)} para SUVs${localidade}. Polimentos de correção com acabamento espelhado podem chegar a ${f(1100, 1800)}.` 
        },
        { 
          pergunta: "Estética automotiva dá lucro?", 
          resposta: "Sim, é o segmento mais rentável do setor. A margem de lucro em serviços de estética varia de 50% a 70%, muito superior à lavagem simples (35-45%). O segredo está na capacitação técnica e em equipamentos de qualidade." 
        },
        { 
          pergunta: "Preciso de curso para fazer polimento?", 
          resposta: "Altamente recomendado. Polimento mal feito pode danificar a pintura permanentemente. Invista em cursos de polimento e vitrificação - existem opções de R$ 500 a R$ 3.000 com certificação. O retorno do investimento é rápido." 
        }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LICENÇA AMBIENTAL
  // ═══════════════════════════════════════════════════════════════════════
  if (slug.includes("licenca-ambiental")) {
    return {
      titulo: `Licença Ambiental para Lava Jato${localidade}`,
      subtitulo: "Como obter e manter a licença ambiental do seu lava rápido",
      introducao: `A licença ambiental é obrigatória para lava jatos no Brasil. Isso porque a atividade gera efluentes (água com óleo, graxa e produtos químicos) que precisam ser tratados antes do descarte. Sem licença, você pode ser multado e até ter o estabelecimento fechado.`,
      secoes: [
        {
          titulo: "Por que Lava Jato Precisa de Licença Ambiental",
          conteudo: `Lava jatos são classificados como atividades potencialmente poluidoras. A água usada na lavagem carrega óleos, graxas, combustíveis, detergentes e produtos químicos que, se descartados diretamente no esgoto ou solo, causam contaminação ambiental.\n\nA legislação ambiental (Resolução CONAMA 430/2011) estabelece padrões para o descarte de efluentes. Para atender esses padrões, o lava jato precisa de sistema de tratamento de efluentes.`,
          lista: [
            "Efluentes contêm óleo, graxa e produtos químicos",
            "Descarte irregular é crime ambiental",
            "Multas podem chegar a R$ 50 milhões",
            "Estabelecimento pode ser interditado"
          ]
        },
        {
          titulo: "Caixa Separadora de Água e Óleo (CSAO)",
          conteudo: `A caixa separadora é o equipamento obrigatório para tratamento de efluentes em lava jatos. Ela funciona por diferença de densidade: o óleo (mais leve) flutua e fica retido, enquanto a água (mais pesada) passa para o esgoto.\n\nO dimensionamento depende do volume de efluentes gerado. Para um lava jato de 2 boxes, uma caixa de 1.000 a 2.000 litros é suficiente. Existem modelos pré-fabricados (fibra de vidro, PEAD) e podem ser construídas em alvenaria.`,
          lista: [
            "Caixa pré-fabricada: R$ 3.000 - R$ 12.000",
            "Caixa de alvenaria: R$ 5.000 - R$ 15.000",
            "Manutenção: limpeza a cada 2-4 semanas",
            "Descarte do óleo: empresa licenciada"
          ]
        },
        {
          titulo: "Como Obter a Licença Ambiental",
          conteudo: `O processo varia conforme o estado e município, mas geralmente envolve:\n\n1. Consulta prévia ao órgão ambiental\n2. Elaboração de projeto (pode exigir engenheiro)\n3. Instalação da caixa separadora\n4. Vistoria do órgão ambiental\n5. Emissão da licença\n\nO prazo varia de 30 a 120 dias. O custo inclui taxas do órgão (R$ 200-1.000), projeto técnico (R$ 500-2.000) e instalação da caixa separadora.`,
          lista: [
            "Órgão responsável: IBAMA, órgão estadual ou municipal",
            "Documentos: CNPJ, contrato do imóvel, projeto da CSAO",
            "Prazo: 30 a 120 dias",
            "Custo total: R$ 3.000 a R$ 20.000"
          ]
        },
        {
          titulo: "Manutenção e Renovação",
          conteudo: `A licença ambiental tem validade (geralmente 2 a 5 anos) e precisa ser renovada. Além disso, você deve manter a caixa separadora funcionando corretamente:\n\n• Limpeza regular: a cada 15-30 dias\n• Descarte correto do óleo coletado: empresa licenciada\n• Registro das manutenções: manter documentação\n• Guarda de comprovantes de descarte: 5 anos\n\nA fiscalização pode pedir esses documentos a qualquer momento.`
        }
      ],
      tabela: {
        titulo: "Custos para Licenciamento Ambiental",
        colunas: ["Item", "Custo Estimado"],
        linhas: [
          ["Taxa de licenciamento (órgão ambiental)", f(200, 1000)],
          ["Projeto técnico (se exigido)", f(500, 2000)],
          ["Caixa separadora (pré-fabricada)", f(3000, 8000)],
          ["Instalação hidráulica", f(1000, 3000)],
          ["Vistoria/consultoria", f(500, 1500)],
          ["TOTAL ESTIMADO", f(5000, 15000)]
        ]
      },
      faq: [
        { 
          pergunta: "Lava jato MEI precisa de licença ambiental?", 
          resposta: "Sim, a obrigatoriedade de licença ambiental independe do porte da empresa. Mesmo sendo MEI, se você opera um lava jato, precisa de licença. Em alguns municípios, MEIs podem ter processo simplificado." 
        },
        { 
          pergunta: "Qual o tamanho da caixa separadora para lava jato?", 
          resposta: "Depende do volume de efluentes. Para 1 box: 500-1.000 litros. Para 2 boxes: 1.000-2.000 litros. Para 3+ boxes: 2.000-5.000 litros. O ideal é consultar o órgão ambiental local para dimensionamento correto." 
        },
        { 
          pergunta: "Qual a multa por não ter licença ambiental?", 
          resposta: "As multas variam de R$ 500 a R$ 50 milhões, dependendo da gravidade e reincidência. Além da multa, o estabelecimento pode ser interditado e o responsável responder criminalmente por crime ambiental." 
        },
        { 
          pergunta: "Posso funcionar enquanto a licença está em análise?", 
          resposta: "Alguns órgãos emitem licença de operação provisória ou autorização de funcionamento enquanto o processo tramita. Consulte o órgão ambiental do seu município para saber se isso é possível." 
        }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // CHECKLIST DE ENTRADA
  // ═══════════════════════════════════════════════════════════════════════
  if (slug.includes("checklist-entrada")) {
    return {
      titulo: "Checklist de Entrada de Veículo para Lava Jato",
      subtitulo: "Modelo completo para proteger seu negócio de reclamações",
      introducao: `O checklist de entrada é essencial para evitar problemas com clientes. Documenta o estado do veículo antes do serviço, protegendo você de acusações de danos que já existiam. Estabelecimentos profissionais fazem checklist em 100% dos veículos.`,
      secoes: [
        {
          titulo: "Por que o Checklist é Indispensável",
          conteudo: `Sem checklist, você fica vulnerável a clientes de má-fé que alegam que um risco ou amassado foi causado pelo seu estabelecimento. Com o checklist assinado, você tem prova documental do estado anterior do veículo.\n\nAlém da proteção legal, o checklist também padroniza o atendimento, garante que nenhum item seja esquecido e profissionaliza a imagem do seu lava jato.`,
          lista: [
            "Proteção contra reclamações infundadas",
            "Documento com valor legal se assinado",
            "Padronização do atendimento",
            "Profissionalização da imagem"
          ]
        },
        {
          titulo: "Como Implementar na Prática",
          conteudo: `O checklist pode ser em papel (formulário impresso) ou digital (tablet/celular). A versão digital é mais eficiente porque permite adicionar fotos e já fica arquivada automaticamente.\n\nTreine toda a equipe para preencher o checklist corretamente. Ele deve ser feito ANTES de qualquer serviço, na presença do cliente quando possível. A assinatura do cliente é importante.`,
          lista: [
            "Fazer ANTES de iniciar o serviço",
            "Na presença do cliente (quando possível)",
            "Fotografar danos existentes",
            "Colher assinatura do cliente"
          ]
        }
      ],
      checklist: [
        { item: "1. Identificação do veículo", descricao: "Placa, modelo, cor, ano" },
        { item: "2. Quilometragem", descricao: "Anotar a quilometragem atual do odômetro" },
        { item: "3. Nível de combustível", descricao: "Marcar aproximadamente (1/4, 1/2, 3/4, cheio)" },
        { item: "4. Pertences no interior", descricao: "Perguntar se há objetos de valor; sugerir remoção" },
        { item: "5. Estado externo - lado esquerdo", descricao: "Verificar riscos, amassados, manchas na pintura" },
        { item: "6. Estado externo - lado direito", descricao: "Verificar riscos, amassados, manchas na pintura" },
        { item: "7. Estado externo - frente", descricao: "Faróis, para-choque, capô, grade" },
        { item: "8. Estado externo - traseira", descricao: "Lanternas, para-choque, tampa do porta-malas" },
        { item: "9. Estado externo - teto", descricao: "Verificar amassados (comum em granizo)" },
        { item: "10. Rodas e pneus", descricao: "Estado das rodas, calotas, condição dos pneus" },
        { item: "11. Vidros e retrovisores", descricao: "Trincas, lascados, posição dos retrovisores" },
        { item: "12. Antena", descricao: "Presença e estado da antena (se aplicável)" },
        { item: "13. Estado interno", descricao: "Bancos, painéis, carpetes - manchas, rasgos" },
        { item: "14. Funcionamento básico", descricao: "Testar se liga, vidros elétricos, travas" },
        { item: "15. Fotos", descricao: "Fotografar pelo menos 4 ângulos + danos específicos" },
        { item: "16. Assinatura do cliente", descricao: "Cliente assina confirmando o estado descrito" }
      ],
      faq: [
        { 
          pergunta: "Preciso fazer checklist em todos os carros?", 
          resposta: "Sim, recomendamos fortemente. Mesmo clientes frequentes podem alegar danos. O checklist leva menos de 2 minutos e evita muita dor de cabeça." 
        },
        { 
          pergunta: "E se o cliente não quiser assinar?", 
          resposta: "Informe que é procedimento padrão para segurança de ambas as partes. Se ainda assim recusar, faça o checklist mesmo assim, fotografe e anote que 'cliente recusou assinar'. Isso já é uma proteção." 
        },
        { 
          pergunta: "Checklist digital ou papel?", 
          resposta: "Digital é muito melhor. Permite fotos, fica arquivado automaticamente, é fácil de buscar depois. Sistemas como o Lavify têm checklist digital integrado com histórico por veículo." 
        },
        { 
          pergunta: "Quanto tempo guardo os checklists?", 
          resposta: "Recomendamos pelo menos 1 ano. Reclamações podem surgir dias ou semanas depois. Com sistema digital, o armazenamento é automático e não ocupa espaço físico." 
        }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // COMO FIDELIZAR CLIENTES
  // ═══════════════════════════════════════════════════════════════════════
  if (slug.includes("fidelizar-clientes")) {
    return {
      titulo: `Como Fidelizar Clientes no Lava Jato${localidade}`,
      subtitulo: "Estratégias práticas para fazer o cliente voltar sempre",
      introducao: `Fidelizar clientes é muito mais barato do que conquistar novos. Um cliente fiel visita seu lava jato regularmente, indica para amigos e é menos sensível a preço. Veja estratégias comprovadas para aumentar a retenção de clientes${localidade}.`,
      secoes: [
        {
          titulo: "Programa de Fidelidade: O Clássico que Funciona",
          conteudo: `O famoso "cartão fidelidade" existe porque funciona. A cada X lavagens, o cliente ganha uma grátis. O segredo está na configuração: muitas lavagens para ganhar desanima, poucas não gera lucro.\n\nRecomendação: 10 lavagens para ganhar 1 grátis é um bom equilíbrio. O custo da lavagem grátis (R$ 30-50) é compensado pelo valor do cliente ao longo do tempo.`,
          lista: [
            "Cartão físico: simples e tangível",
            "Cartão digital: prático e não perde",
            "Recomendação: 10 lavagens = 1 grátis",
            "ROI: cliente fiel gasta 3-5x mais no ano"
          ]
        },
        {
          titulo: "WhatsApp Marketing: Remarketing Inteligente",
          conteudo: `Use o WhatsApp para manter relacionamento com clientes. Mas cuidado: mensagens demais irritam. Estratégia recomendada:\n\n• 15-30 dias sem visita: lembrete gentil\n• Aniversário do cliente: desconto especial\n• Datas especiais: promoções sazonais\n• Novos serviços: informar novidades\n\nSempre dê opção de parar de receber (respeite quem pede).`,
          lista: [
            "Lembrete de retorno: 15-30 dias sem visita",
            "Promoção de aniversário: 10-15% de desconto",
            "Datas sazonais: Natal, Dia das Mães, etc.",
            "Frequência ideal: 2-4 mensagens por mês"
          ]
        },
        {
          titulo: "Experiência do Cliente: O Básico Bem Feito",
          conteudo: `Fidelização começa com um serviço bem feito. Parece óbvio, mas muitos esquecem:\n\n• Entrega no prazo prometido\n• Qualidade consistente\n• Atendimento educado e profissional\n• Ambiente limpo e organizado\n• Preço justo e transparente\n\nClientes não voltam para onde foram mal atendidos, não importa quantos descontos você ofereça.`,
          lista: [
            "Entregar no prazo: sempre",
            "Qualidade: consistente em todas as lavagens",
            "Atendimento: educado e profissional",
            "Ambiente: limpo e organizado"
          ]
        },
        {
          titulo: "Pacotes e Assinaturas",
          conteudo: `Outra forma de fidelizar é vender pacotes ou assinaturas:\n\n• Pacote de lavagens: 10 lavagens com desconto de 15-20%\n• Assinatura mensal: X lavagens por mês por valor fixo\n\nIsso garante receita recorrente e cria compromisso do cliente com seu estabelecimento. Funciona especialmente bem para clientes frequentes (2-4 lavagens/mês).`
        }
      ],
      faq: [
        { 
          pergunta: "Quantas lavagens para fidelidade?", 
          resposta: "A média do mercado é 10 lavagens para ganhar 1 grátis. Menos que isso pode não compensar financeiramente. Mais que isso pode desestimular o cliente." 
        },
        { 
          pergunta: "Fidelidade física ou digital?", 
          resposta: "Digital é muito melhor. Cartão físico se perde, se molha, cliente esquece em casa. No sistema digital, o histórico fica automaticamente vinculado ao cliente pelo telefone ou CPF." 
        },
        { 
          pergunta: "Como fazer remarketing sem incomodar?", 
          resposta: "Limite a 2-4 mensagens por mês. Sempre ofereça algo de valor (promoção, novidade). Respeite quem pede para parar. Personalize: usar o nome do cliente aumenta a taxa de resposta." 
        },
        { 
          pergunta: "Vale a pena fazer assinatura mensal?", 
          resposta: "Sim, para o perfil certo de cliente. Funciona bem para quem lava 2-4x por mês. O preço da assinatura deve ser 15-25% menor que o valor individual, garantindo economia pro cliente e receita recorrente pra você." 
        }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // EQUIPAMENTOS LAVA JATO
  // ═══════════════════════════════════════════════════════════════════════
  if (slug.includes("equipamentos")) {
    return {
      titulo: "Equipamentos para Lava Jato: Guia Completo",
      subtitulo: "Lista completa com marcas, modelos e preços atualizados",
      introducao: `Escolher os equipamentos certos faz toda a diferença na qualidade do serviço e na durabilidade do seu investimento. Neste guia, detalhamos cada equipamento essencial para lava jato, com recomendações de marcas e faixas de preço.`,
      secoes: [
        {
          titulo: "Lavadora de Alta Pressão",
          conteudo: `É o equipamento mais importante do lava jato. NUNCA use lavadora doméstica - ela não aguenta uso intensivo e quebra rápido. Invista em modelo profissional desde o início.\n\nCaracterísticas importantes:\n• Pressão mínima: 1.600 PSI (ideal: 2.000-3.000 PSI)\n• Vazão: 500-1.000 L/h\n• Motor: indução (mais durável) ou universal\n• Alimentação: bivolt ou 220V (mais potência)\n\nMarcas recomendadas: WAP, Karcher, Jacto, Eletroplas`,
          lista: [
            "WAP Excellent: R$ 2.500-4.000 (ótimo custo-benefício)",
            "Karcher HD 585: R$ 4.000-6.000 (durabilidade)",
            "Jacto J7600: R$ 5.000-8.000 (profissional)",
            "Vida útil: 3-5 anos com manutenção"
          ]
        },
        {
          titulo: "Aspirador Industrial",
          conteudo: `O aspirador para lava jato precisa ser industrial, não doméstico. Deve ter:\n\n• Motor potente (1.000-1.600W)\n• Tanque de grande capacidade (20-80L)\n• Função de sopro\n• Filtro lavável de qualidade\n\nEvite aspiradores domésticos de 6-12L - não têm potência nem durabilidade para uso profissional.`,
          lista: [
            "Lavor Wash: R$ 800-1.500 (bom custo-benefício)",
            "WAP GTW: R$ 1.200-2.000",
            "Karcher NT: R$ 1.500-3.000",
            "Jacto Clean: R$ 1.000-2.000"
          ]
        },
        {
          titulo: "Compressor de Ar",
          conteudo: `Usado para secar frestas, motor e acabamentos onde a água fica acumulada. Também pode alimentar pistolas de ar para limpeza.\n\n• Capacidade mínima: 100L\n• Pressão: 8-12 bar\n• Potência: 2-3 HP\n\nUm compressor de 100L atende bem um lava jato pequeno/médio. Para maior volume, considere 200L+.`,
          lista: [
            "Pressure: R$ 1.500-3.000",
            "Schulz: R$ 2.000-4.000",
            "Chiaperini: R$ 2.500-5.000"
          ]
        },
        {
          titulo: "Politriz e Equipamentos de Estética",
          conteudo: `Se você quer oferecer polimento e estética, vai precisar de:\n\n• Politriz rotativa: para corte e remoção de defeitos\n• Politriz roto-orbital: para acabamento e aplicação\n• Jogo de boinas e discos\n• Iluminação de inspeção (lanterna ou painel LED)\n\nMarcas recomendadas: Kers, Jescar, Mirka, SPTA (custo-benefício), Flex (profissional).`
        }
      ],
      tabela: {
        titulo: "Lista de Equipamentos e Preços",
        colunas: ["Equipamento", "Faixa de Preço", "Marcas Recomendadas"],
        linhas: [
          ["Lavadora de Alta Pressão", "R$ 2.000 - R$ 8.000", "WAP, Karcher, Jacto"],
          ["Aspirador Industrial (50L)", "R$ 800 - R$ 3.000", "Lavor, WAP, Karcher"],
          ["Compressor (100L)", "R$ 1.500 - R$ 4.000", "Pressure, Schulz"],
          ["Gerador de Espuma", "R$ 300 - R$ 1.500", "Snow Foam, SGT"],
          ["Politriz Rotativa", "R$ 400 - R$ 1.500", "Kers, Mirka, SPTA"],
          ["Politriz Roto-orbital", "R$ 300 - R$ 1.200", "Kers, Jescar, SPTA"],
          ["Extratora (higienização)", "R$ 1.500 - R$ 5.000", "WAP, Karcher, Lavor"],
          ["Aspirador de Pó (portátil)", "R$ 200 - R$ 600", "Black+Decker, WAP"]
        ]
      },
      faq: [
        { 
          pergunta: "Qual a melhor lavadora de alta pressão para lava jato?", 
          resposta: "Para uso profissional, recomendamos WAP Excellent (custo-benefício) ou Karcher HD (durabilidade). Invista pelo menos R$ 2.500-3.000 para um equipamento que aguente uso intensivo." 
        },
        { 
          pergunta: "Posso usar equipamentos domésticos no começo?", 
          resposta: "Não recomendamos. Equipamentos domésticos não foram projetados para uso intensivo e quebram rapidamente (semanas/meses). O 'barato' sai caro. Invista em equipamento profissional desde o início." 
        },
        { 
          pergunta: "Quanto investir em equipamentos para começar?", 
          resposta: "Equipamento básico (lavadora + aspirador + compressor + acessórios): R$ 8.000-15.000. Com estética (politriz, extratora): R$ 15.000-25.000. Equipamento completo de alta qualidade: R$ 25.000-40.000." 
        },
        { 
          pergunta: "Manutenção dos equipamentos é cara?", 
          resposta: "Não muito. A lavadora é o que mais exige: troca de óleo (R$ 30-50), peças de desgaste (R$ 100-300/ano). O segredo é manutenção preventiva: seguir manual, não forçar, limpar após uso." 
        }
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════════════
  // FALLBACK GENÉRICO (ÚLTIMO RECURSO)
  // ═══════════════════════════════════════════════════════════════════════
  return {
    titulo: `Guia Completo${localidade}`,
    subtitulo: "Informações úteis para donos de lava jato",
    introducao: `Este guia reúne informações importantes para empreendedores do setor de lava jato e estética automotiva${localidade}.`,
    secoes: [
      {
        titulo: "Informações Importantes",
        conteudo: `O setor de lava jato e estética automotiva${localidade} está em crescimento. Com a frota de veículos aumentando a cada ano, a demanda por serviços de lavagem e cuidados automotivos só cresce.\n\nPara ter sucesso nesse mercado, é fundamental profissionalizar a operação: usar bons equipamentos, treinar a equipe, controlar o financeiro e oferecer excelente atendimento ao cliente.`,
        lista: [
          "Invista em equipamentos de qualidade",
          "Treine sua equipe regularmente",
          "Controle financeiro rigoroso",
          "Atendimento excelente ao cliente"
        ]
      }
    ],
    faq: [
      { 
        pergunta: "Como ter sucesso com lava jato?", 
        resposta: "Os pilares são: localização estratégica, equipamentos de qualidade, equipe bem treinada, preços competitivos, atendimento excelente e controle financeiro. Use tecnologia para automatizar processos e ganhar eficiência." 
      },
      { 
        pergunta: "Qual sistema usar para gerenciar lava jato?", 
        resposta: "Um bom sistema de gestão como o Lavify ajuda a controlar agendamentos, financeiro, estoque, equipe e relacionamento com clientes. Automatiza tarefas repetitivas e dá visibilidade do negócio em tempo real." 
      }
    ]
  };
}

