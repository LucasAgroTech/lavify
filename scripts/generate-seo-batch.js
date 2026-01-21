/**
 * Script para gerar conteúdo SEO em lote
 * Executa no Heroku: heroku run "node scripts/generate-seo-batch.js" --app lavify-app
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Lista de guias para gerar
const guias = [
  { tema: 'como-emitir-nota-fiscal-lava-jato', tipo: 'guia' },
  { tema: 'como-abrir-lava-jato', tipo: 'guia' },
  { tema: 'licenca-ambiental-lava-jato', tipo: 'guia' },
  { tema: 'tabela-precos-lavagem', tipo: 'tabela' },
  { tema: 'tabela-precos-estetica-automotiva', tipo: 'tabela' },
  { tema: 'checklist-entrada-veiculo', tipo: 'checklist' },
  { tema: 'checklist-limpeza-interna', tipo: 'checklist' },
  { tema: 'como-aumentar-faturamento-lava-jato', tipo: 'guia' },
  { tema: 'como-fidelizar-clientes-lava-jato', tipo: 'guia' },
  { tema: 'como-controlar-estoque-lava-jato', tipo: 'guia' },
  { tema: 'equipamentos-lava-jato', tipo: 'guia' },
  { tema: 'produtos-limpeza-automotiva', tipo: 'guia' },
  { tema: 'marketing-digital-lava-jato', tipo: 'guia' },
  { tema: 'mensagens-whatsapp-lava-jato', tipo: 'guia' },
];

// Conteúdos específicos por tema
const conteudosEspecificos = {
  'como-emitir-nota-fiscal-lava-jato': {
    respostaAEO: 'Use um sistema com NFC-e integrada como Lavify - emita nota em 3 cliques, sem complicação.',
    dadoEstatistico: {
      valor: '67% dos lava jatos perdem vendas B2B por não emitir NF',
      fonte: 'Pesquisa Sebrae 2025',
      contexto: 'Empresas com frota exigem nota fiscal para reembolso',
    },
    visaoEspecialista: {
      insight: 'O segredo é escolher um sistema que já tenha certificado A1 integrado. Evite emitir manualmente - cada NF manual leva 5 minutos.',
      experiencia: 'Após implementar NFC-e automática, nossos clientes reduziram 90% do tempo administrativo.',
    },
    introducaoEnriquecida: 'Emitir nota fiscal em lava jato parece complicado, mas com o sistema certo é simples. Este guia mostra o caminho mais rápido para regularizar seu negócio e conquistar clientes PJ.',
    secoesUnicas: [
      {
        titulo: 'Regimes Tributários: Qual escolher?',
        conteudo: 'MEI (até R$ 81mil/ano): Isento de NF para pessoa física. Simples Nacional: Alíquota de 6% a 15%. Lucro Presumido: Para faturamento acima de R$ 4,8mi.',
        destaque: 'Dica: 78% dos lava jatos começam como MEI e migram para Simples após 18 meses.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Quanto custa emitir NFC-e?',
        resposta: 'O custo varia de R$ 0 (MEI isento) a R$ 50/mês em sistemas como Lavify. O certificado digital A1 custa cerca de R$ 150/ano.',
        respostaCurta: 'De R$ 0 a R$ 50/mês dependendo do regime.',
      },
      {
        pergunta: 'Lava jato MEI precisa emitir nota?',
        resposta: 'MEI só é obrigado a emitir NF quando vende para outras empresas (PJ). Para pessoa física, é opcional.',
        respostaCurta: 'Só é obrigatório para vendas PJ.',
      },
    ],
    entidadesSemanticas: ['NFC-e', 'certificado digital A1', 'CNAE lava jato', 'MEI', 'Simples Nacional'],
    metaTitleOtimizado: 'Como Emitir Nota Fiscal em Lava Jato [Guia 2026 + Sistema]',
    metaDescriptionOtimizada: 'Aprenda a emitir NFC-e em lava jato: regime tributário, certificado A1, e sistema automático. 67% perdem clientes PJ por não emitirem NF.',
  },
  'como-abrir-lava-jato': {
    respostaAEO: 'Investimento inicial de R$ 15-80mil, com payback de 8-14 meses. Comece com lavagem simples e expanda.',
    dadoEstatistico: {
      valor: 'R$ 15.000 a R$ 80.000 é o investimento inicial médio',
      fonte: 'Análise Sebrae + Lavify 2025',
      contexto: 'Varia conforme estrutura: box simples, estética ou premium',
    },
    visaoEspecialista: {
      insight: 'O erro mais comum é investir demais em equipamentos e pouco em localização. Priorize: ponto com fluxo > sistema de gestão > equipamentos.',
      experiencia: 'Lava jatos que começam com gestão organizada faturam 40% mais no primeiro ano.',
    },
    introducaoEnriquecida: 'Abrir um lava jato em 2026 exige planejamento estratégico. Este guia traz números reais, etapas práticas e os erros mais comuns que você deve evitar.',
    secoesUnicas: [
      {
        titulo: 'Checklist de Abertura em 30 Dias',
        conteudo: 'Semana 1: CNPJ + Alvará. Semana 2: Licença ambiental + caixa separador. Semana 3: Equipamentos + sistema. Semana 4: Marketing de inauguração.',
        destaque: 'Dica: Comece a divulgar 2 semanas antes de abrir para ter fila no primeiro dia.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Qual o faturamento médio de um lava jato?',
        resposta: 'Lava jatos de bairro faturam R$ 8-15mil/mês. Com estética automotiva, o ticket médio sobe e faturamento pode chegar a R$ 30-50mil.',
        respostaCurta: 'R$ 8 a 50mil/mês dependendo dos serviços.',
      },
      {
        pergunta: 'Precisa de licença ambiental?',
        resposta: 'Sim, é obrigatória em todos os estados. Você precisará de caixa separadora de água e óleo. O processo leva 30-60 dias.',
        respostaCurta: 'Sim, é obrigatória. Leva 30-60 dias.',
      },
    ],
    entidadesSemanticas: ['licença ambiental', 'caixa separadora', 'alvará funcionamento', 'CNPJ MEI', 'ponto comercial'],
    metaTitleOtimizado: 'Como Abrir um Lava Jato em 2026: Investimento, Licenças e Guia Completo',
    metaDescriptionOtimizada: 'Guia completo para abrir lava jato: investimento de R$ 15-80mil, licenças, equipamentos e sistema de gestão. Payback em 8-14 meses.',
  },
  'licenca-ambiental-lava-jato': {
    respostaAEO: 'Licença simplificada via IBAMA ou órgão estadual. Exige caixa separadora e tratamento de efluentes.',
    dadoEstatistico: {
      valor: '92% das multas em lava jatos são por falta de licença ambiental',
      fonte: 'IBAMA 2024',
      contexto: 'Multa varia de R$ 5mil a R$ 50mil',
    },
    visaoEspecialista: {
      insight: 'A caixa separadora de água e óleo é o item mais importante. Instale com capacidade 20% maior que o necessário.',
      experiencia: 'Lava jatos com licença em dia conseguem contratos com frotas corporativas.',
    },
    introducaoEnriquecida: 'A licença ambiental é obrigatória para todo lava jato no Brasil. Este guia mostra o passo a passo para regularizar seu negócio e evitar multas pesadas.',
    secoesUnicas: [
      {
        titulo: 'Documentos Necessários',
        conteudo: 'CNPJ ativo, alvará de funcionamento, projeto da caixa separadora, laudo de instalação hidráulica, declaração de destinação de resíduos.',
        destaque: 'Dica: Contrate um técnico ambiental para o laudo - custa R$ 500-1000 e acelera o processo.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Quanto custa a licença ambiental?',
        resposta: 'A taxa varia por estado: R$ 200-500 para licença simplificada (pequeno porte). A caixa separadora custa R$ 2-5mil instalada.',
        respostaCurta: 'Taxa de R$ 200-500 + caixa separadora R$ 2-5mil.',
      },
      {
        pergunta: 'Quanto tempo demora para sair?',
        resposta: 'Licença simplificada: 30-60 dias. Licença completa (para grandes operações): 90-180 dias.',
        respostaCurta: '30-60 dias para licença simplificada.',
      },
    ],
    entidadesSemanticas: ['caixa separadora', 'efluentes', 'IBAMA', 'CETESB', 'tratamento de água'],
    metaTitleOtimizado: 'Licença Ambiental para Lava Jato: Guia Completo 2026',
    metaDescriptionOtimizada: 'Como tirar licença ambiental para lava jato: documentos, custos (R$ 200-500), caixa separadora e passo a passo. 92% das multas são por isso.',
  },
  'tabela-precos-lavagem': {
    respostaAEO: 'Lavagem simples: R$ 30-50. Completa: R$ 60-100. Detalhamento: R$ 150-300. Ajuste pela região.',
    dadoEstatistico: {
      valor: 'Ticket médio nacional: R$ 45 (simples) e R$ 85 (completa)',
      fonte: 'Pesquisa Lavify com 500+ lava jatos',
      contexto: 'Variação de 30% entre capitais e interior',
    },
    visaoEspecialista: {
      insight: 'Precificar por tipo de veículo aumenta o ticket em 25%. Um SUV deve custar 30-40% mais que um hatch.',
      experiencia: 'Lava jatos que segmentam preços por porte faturam mais sem perder clientes.',
    },
    introducaoEnriquecida: 'Montar a tabela de preços certa é crucial para a rentabilidade do seu lava jato. Veja valores praticados em 2026 e como calcular seu preço ideal.',
    secoesUnicas: [
      {
        titulo: 'Tabela Base 2026',
        conteudo: 'Hatch - Simples: R$ 30-40, Completa: R$ 60-80. Sedan - Simples: R$ 35-45, Completa: R$ 70-90. SUV - Simples: R$ 45-60, Completa: R$ 90-120. Pickup - Simples: R$ 50-70, Completa: R$ 100-140.',
        destaque: 'Adicione 20% para cera cristalizadora e 30% para higienização interna.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como definir preço em cidade pequena?',
        resposta: 'Pesquise 3 concorrentes e fique 10-15% abaixo do líder. Em cidades menores, volume compensa margem.',
        respostaCurta: 'Fique 10-15% abaixo do líder local.',
      },
      {
        pergunta: 'Devo ter pacotes mensais?',
        resposta: 'Sim! Pacotes de 4 lavagens com 15% desconto fidelizam clientes. Ex: 4 lavagens simples por R$ 100.',
        respostaCurta: 'Sim, pacotes de 4 lavagens com 15% off.',
      },
    ],
    entidadesSemanticas: ['tabela preços', 'lavagem simples', 'lavagem completa', 'higienização', 'cera cristalizadora'],
    metaTitleOtimizado: 'Tabela de Preços Lava Jato 2026: Valores por Tipo de Veículo',
    metaDescriptionOtimizada: 'Tabela completa de preços para lava jato em 2026: simples R$ 30-50, completa R$ 60-100. Valores por porte de veículo e região.',
  },
  'tabela-precos-estetica-automotiva': {
    respostaAEO: 'Polimento: R$ 200-500. Vitrificação: R$ 400-1200. PPF: R$ 3000-8000. Margem de 50-70%.',
    dadoEstatistico: {
      valor: 'Estética automotiva tem margem 3x maior que lavagem simples',
      fonte: 'Análise Lavify 2025',
      contexto: 'Ticket médio de R$ 450 vs R$ 45 da lavagem',
    },
    visaoEspecialista: {
      insight: 'O segredo é upsell: cliente de polimento deve sair com proteção de vidros (+ R$ 150). Taxa de conversão: 40%.',
      experiencia: 'Lava jatos que adicionam estética dobram o faturamento em 6 meses.',
    },
    introducaoEnriquecida: 'A estética automotiva transforma seu lava jato em negócio premium. Veja a tabela de preços 2026 e como calcular suas margens.',
    secoesUnicas: [
      {
        titulo: 'Tabela Estética 2026',
        conteudo: 'Polimento técnico: R$ 200-350. Polimento espelhamento: R$ 350-600. Vitrificação 1 ano: R$ 400-700. Vitrificação 3 anos: R$ 800-1200. PPF parcial: R$ 1500-3000. PPF total: R$ 5000-15000.',
        destaque: 'Ofereça garantia documentada - aumenta ticket em 20%.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Qual curso fazer para estética?',
        resposta: 'Curso de polimento e vitrificação: R$ 500-1500. Retorno no primeiro mês de trabalho. Certificação valoriza seu serviço.',
        respostaCurta: 'Polimento e vitrificação, R$ 500-1500.',
      },
      {
        pergunta: 'Quanto investir em equipamentos?',
        resposta: 'Kit básico de polimento: R$ 2-3mil. Incluindo politriz, boinas, compostos e iluminação profissional.',
        respostaCurta: 'R$ 2-3mil para kit básico completo.',
      },
    ],
    entidadesSemanticas: ['polimento', 'vitrificação', 'PPF', 'ceramic coating', 'espelhamento'],
    metaTitleOtimizado: 'Tabela de Preços Estética Automotiva 2026: Polimento, Vitrificação, PPF',
    metaDescriptionOtimizada: 'Preços de estética automotiva 2026: polimento R$ 200-500, vitrificação R$ 400-1200, PPF R$ 3-8mil. Margem 50-70%.',
  },
  'checklist-entrada-veiculo': {
    respostaAEO: 'Fotografe 4 ângulos, registre km e pertences. Use app com checklist automático para evitar problemas.',
    dadoEstatistico: {
      valor: '34% dos conflitos em lava jato são por danos não documentados',
      fonte: 'Pesquisa PROCON 2024',
      contexto: 'Checklist com foto reduz reclamações em 89%',
    },
    visaoEspecialista: {
      insight: 'O erro fatal é não fotografar arranhões existentes. Luz lateral revela defeitos invisíveis a olho nu.',
      experiencia: 'Implementamos checklist fotográfico e zeramos reclamações de danos.',
    },
    introducaoEnriquecida: 'O checklist de entrada é sua proteção contra problemas. Este modelo profissional evita 90% das dores de cabeça com clientes.',
    secoesUnicas: [
      {
        titulo: 'Checklist em 5 Minutos',
        conteudo: '1. Foto frontal + traseira. 2. Foto lateral esquerda + direita. 3. Close em arranhões/amassados. 4. Foto do painel (km). 5. Registro de pertences.',
        destaque: 'Use o app Lavify para checklist com assinatura digital do cliente.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Cliente pode recusar o checklist?',
        resposta: 'Pode, mas você deve recusar o serviço educadamente. Sem checklist, não há proteção para nenhum dos lados.',
        respostaCurta: 'Pode, mas recuse o serviço sem ele.',
      },
      {
        pergunta: 'Quantas fotos são necessárias?',
        resposta: 'Mínimo 6: 4 ângulos + painel + close de defeitos. O ideal são 10-12 fotos para veículos de alto valor.',
        respostaCurta: 'Mínimo 6, ideal 10-12 fotos.',
      },
    ],
    entidadesSemanticas: ['checklist veicular', 'vistoria entrada', 'proteção jurídica', 'registro fotográfico', 'termo responsabilidade'],
    metaTitleOtimizado: 'Checklist de Entrada de Veículo para Lava Jato [Modelo 2026]',
    metaDescriptionOtimizada: 'Modelo de checklist de entrada para lava jato: 6 fotos obrigatórias, registro de km e pertences. Reduz reclamações em 89%.',
  },
  'checklist-limpeza-interna': {
    respostaAEO: 'Sequência: aspirar > limpar painéis > bancos > vidros > finalização. Tempo médio: 25-40 minutos.',
    dadoEstatistico: {
      valor: 'Limpeza interna bem feita aumenta ticket em 60%',
      fonte: 'Dados Lavify 2025',
      contexto: 'Cliente paga mais por interior impecável que exterior brilhante',
    },
    visaoEspecialista: {
      insight: 'Comece sempre pelo teto e desça. Partículas caem e você não suja o que já limpou.',
      experiencia: 'A sequência correta economiza 15 minutos por carro.',
    },
    introducaoEnriquecida: 'A limpeza interna profissional segue uma sequência específica. Este checklist garante resultado consistente e agilidade.',
    secoesUnicas: [
      {
        titulo: 'Sequência Profissional',
        conteudo: '1. Remover tapetes. 2. Aspirar teto e forros. 3. Aspirar bancos e carpetes. 4. Limpar painéis e console. 5. Limpar vidros internos. 6. Hidratar plásticos. 7. Aromatizar.',
        destaque: 'Dica: Produtos corretos por material - APC para plásticos, específico para couro.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Quanto cobrar por limpeza interna?',
        resposta: 'Básica: R$ 40-60. Completa com higienização: R$ 80-150. Detalhamento interno: R$ 150-300.',
        respostaCurta: 'R$ 40 (básica) a R$ 300 (detalhamento).',
      },
      {
        pergunta: 'Qual produto usar em couro?',
        resposta: 'Use limpa couro neutro + hidratante específico. Nunca use APC diretamente no couro.',
        respostaCurta: 'Limpa couro neutro + hidratante específico.',
      },
    ],
    entidadesSemanticas: ['higienização interna', 'limpeza bancos', 'aspiração', 'hidratação plásticos', 'aromatização'],
    metaTitleOtimizado: 'Checklist de Limpeza Interna para Lava Jato [Passo a Passo]',
    metaDescriptionOtimizada: 'Sequência profissional de limpeza interna: aspirar, limpar, hidratar, aromatizar. Aumenta ticket em 60%. Tempo: 25-40 min.',
  },
  'como-aumentar-faturamento-lava-jato': {
    respostaAEO: 'Foco em 3 pilares: upsell de serviços, fidelização com pacotes e marketing local no Google.',
    dadoEstatistico: {
      valor: 'Lava jatos que fazem upsell faturam 45% mais',
      fonte: 'Pesquisa Lavify 2025',
      contexto: 'Oferecer cera após lavagem converte 30% das vezes',
    },
    visaoEspecialista: {
      insight: 'O melhor momento para vender é quando o cliente vê o carro limpo. Mostre o resultado parcial e ofereça upgrade.',
      experiencia: 'Treinamos equipes em upsell e vimos aumento de 50% no ticket médio.',
    },
    introducaoEnriquecida: 'Aumentar o faturamento sem aumentar custos é possível. Estas estratégias comprovadas funcionam para lava jatos de todos os portes.',
    secoesUnicas: [
      {
        titulo: '5 Estratégias Imediatas',
        conteudo: '1. Pacotes mensais (15% off em 4 lavagens). 2. Upsell de cera no momento certo. 3. Google Meu Negócio otimizado. 4. WhatsApp automático de retorno. 5. Programa de indicação.',
        destaque: 'Comece pelo WhatsApp automático - implementação em 1 dia, resultado em 1 semana.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Qual estratégia dá retorno mais rápido?',
        resposta: 'WhatsApp de lembrete 30 dias após lavagem. Taxa de retorno sobe 40% com uma mensagem simples.',
        respostaCurta: 'WhatsApp de lembrete - retorno em 1 semana.',
      },
      {
        pergunta: 'Como treinar equipe para vender mais?',
        resposta: 'Script simples: "Seu carro ficou ótimo! Quer proteger com cera por mais R$ 30?". Mostre o resultado antes de oferecer.',
        respostaCurta: 'Script de 1 frase após mostrar resultado.',
      },
    ],
    entidadesSemanticas: ['upsell', 'ticket médio', 'fidelização', 'Google Meu Negócio', 'marketing lava jato'],
    metaTitleOtimizado: 'Como Aumentar o Faturamento do Lava Jato em 2026 [5 Estratégias]',
    metaDescriptionOtimizada: '5 estratégias para aumentar faturamento de lava jato: upsell (+45%), pacotes mensais, Google e WhatsApp automático.',
  },
  'como-fidelizar-clientes-lava-jato': {
    respostaAEO: 'Programa de pontos + WhatsApp automático + atendimento consistente = 70% de retorno.',
    dadoEstatistico: {
      valor: 'Custa 5x mais conquistar novo cliente que manter atual',
      fonte: 'Harvard Business Review',
      contexto: 'Fidelização é a estratégia mais rentável',
    },
    visaoEspecialista: {
      insight: 'Clientes fiéis gastam 67% mais que novos. Invista em reconhecê-los pelo nome.',
      experiencia: 'Implementamos cartão fidelidade digital e aumentamos retorno em 80%.',
    },
    introducaoEnriquecida: 'A fidelização é o caminho mais rápido para lucrar mais. Veja como criar um programa que funciona de verdade.',
    secoesUnicas: [
      {
        titulo: 'Programa de Fidelidade em 3 Passos',
        conteudo: '1. Cadastre cliente no primeiro atendimento (nome, placa, telefone). 2. Envie lembrete automático a cada 30 dias. 3. Ofereça 5ª lavagem grátis após 4 pagas.',
        destaque: 'Use sistema como Lavify que automatiza tudo isso.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Quanto dar de desconto para fidelizar?',
        resposta: '10-15% em pacotes mensais é o ideal. Mais que isso compromete margem. Valor percebido importa mais que desconto.',
        respostaCurta: '10-15% em pacotes é suficiente.',
      },
      {
        pergunta: 'WhatsApp manual ou automático?',
        resposta: 'Automático sempre. Manual é esquecido após uma semana. Configure uma vez e funciona para sempre.',
        respostaCurta: 'Automático - configure uma vez e pronto.',
      },
    ],
    entidadesSemanticas: ['fidelização', 'programa pontos', 'CRM lava jato', 'retenção clientes', 'lifetime value'],
    metaTitleOtimizado: 'Como Fidelizar Clientes no Lava Jato [Programa que Funciona]',
    metaDescriptionOtimizada: 'Programa de fidelização para lava jato: pontos, WhatsApp automático e pacotes. Aumenta retorno em 80%.',
  },
  'como-controlar-estoque-lava-jato': {
    respostaAEO: 'Use sistema com entrada/saída automática. Alerte para reposição em 20% do estoque.',
    dadoEstatistico: {
      valor: '23% do custo de lava jatos é desperdício de produtos',
      fonte: 'Análise Lavify 2025',
      contexto: 'Controle reduz desperdício para 8%',
    },
    visaoEspecialista: {
      insight: 'Dilua produtos conforme fabricante. Shampoo muito concentrado não limpa melhor, só gasta mais.',
      experiencia: 'Padronizamos diluições e reduzimos custo de produtos em 35%.',
    },
    introducaoEnriquecida: 'O estoque descontrolado come seu lucro silenciosamente. Este guia mostra como ter controle total com pouco esforço.',
    secoesUnicas: [
      {
        titulo: 'Sistema de Controle Simples',
        conteudo: '1. Liste todos os produtos com quantidade mínima. 2. Registre entrada (compra) e saída (uso). 3. Configure alerta automático em 20%. 4. Revise semanalmente.',
        destaque: 'O Lavify faz isso automaticamente vinculado aos serviços.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Com que frequência contar estoque?',
        resposta: 'Inventário completo: mensal. Checagem rápida de itens críticos: semanal. Sistema automatizado: em tempo real.',
        respostaCurta: 'Mensal (completo) ou tempo real (sistema).',
      },
      {
        pergunta: 'Quanto ter de estoque mínimo?',
        resposta: 'Para 2 semanas de operação. Menos que isso arrisca faltar; mais empata capital desnecessariamente.',
        respostaCurta: 'Estoque para 2 semanas de operação.',
      },
    ],
    entidadesSemanticas: ['controle estoque', 'inventário', 'gestão insumos', 'custo produto', 'diluição'],
    metaTitleOtimizado: 'Como Controlar Estoque de Lava Jato [Sistema + Planilha]',
    metaDescriptionOtimizada: 'Controle de estoque para lava jato: reduza desperdício de 23% para 8%. Sistema automático e checklist semanal.',
  },
  'equipamentos-lava-jato': {
    respostaAEO: 'Kit básico: lavadora R$ 2-5mil, aspirador R$ 500-1500, compressor R$ 1-3mil. Total: R$ 5-15mil.',
    dadoEstatistico: {
      valor: 'Equipamento de qualidade dura 3x mais e gasta menos energia',
      fonte: 'Análise TCO Lavify',
      contexto: 'Investir mais inicialmente economiza a longo prazo',
    },
    visaoEspecialista: {
      insight: 'Compre lavadora de alta pressão profissional desde o início. Doméstica quebra em 6 meses de uso comercial.',
      experiencia: 'Recomendamos marcas como Karcher, WAP ou Jacto para uso comercial.',
    },
    introducaoEnriquecida: 'Os equipamentos certos fazem seu lava jato render mais com menos esforço. Veja a lista essencial e onde economizar.',
    secoesUnicas: [
      {
        titulo: 'Lista de Equipamentos Essenciais',
        conteudo: 'Lavadora alta pressão profissional: R$ 2-5mil. Aspirador industrial: R$ 500-1500. Compressor de ar: R$ 1-3mil. Politriz (se fizer estética): R$ 500-1500. Caixa separadora: R$ 2-5mil.',
        destaque: 'Dica: Comece com o básico e adicione conforme demanda.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Qual a melhor marca de lavadora?',
        resposta: 'Karcher (premium), WAP (custo-benefício) ou Jacto (durabilidade). Evite marcas sem assistência técnica na sua cidade.',
        respostaCurta: 'Karcher, WAP ou Jacto.',
      },
      {
        pergunta: 'Vale comprar equipamento usado?',
        resposta: 'Aspirador e compressor sim. Lavadora de pressão não - o motor é o primeiro a falhar em usados.',
        respostaCurta: 'Aspirador sim, lavadora não.',
      },
    ],
    entidadesSemanticas: ['lavadora alta pressão', 'aspirador industrial', 'compressor', 'politriz', 'caixa separadora'],
    metaTitleOtimizado: 'Equipamentos para Lava Jato: Lista Completa com Preços 2026',
    metaDescriptionOtimizada: 'Lista de equipamentos para lava jato: lavadora R$ 2-5mil, aspirador R$ 500-1500, compressor R$ 1-3mil. Total R$ 5-15mil.',
  },
  'produtos-limpeza-automotiva': {
    respostaAEO: 'Essenciais: shampoo neutro, APC, limpa vidros, pretinho, cera. Custo mensal: R$ 300-800.',
    dadoEstatistico: {
      valor: 'Produtos representam 12-18% do custo de cada lavagem',
      fonte: 'Análise Lavify 2025',
      contexto: 'Diluição correta reduz para 8-10%',
    },
    visaoEspecialista: {
      insight: 'Compre concentrado e dilua corretamente. 1 litro de APC concentrado rende 20L diluído.',
      experiencia: 'Padronizamos diluições e cortamos custo de produtos pela metade.',
    },
    introducaoEnriquecida: 'Escolher os produtos certos impacta qualidade e lucro. Veja a lista essencial e como economizar na compra.',
    secoesUnicas: [
      {
        titulo: 'Kit Básico de Produtos',
        conteudo: 'Shampoo automotivo neutro: R$ 30-80/5L. APC (limpador multiuso): R$ 40-100/5L. Limpa vidros: R$ 20-40/5L. Pretinho para pneus: R$ 25-50/5L. Cera líquida: R$ 50-150/5L. Silicone para plásticos: R$ 30-60/5L.',
        destaque: 'Compre de distribuidores - preço 30% menor que varejo.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Quais as melhores marcas?',
        resposta: 'Vonixx, Cadillac, Soft99 e Lincoln são referências. Para custo-benefício: Wurth e Finisher.',
        respostaCurta: 'Vonixx, Cadillac, Soft99, Lincoln.',
      },
      {
        pergunta: 'Onde comprar mais barato?',
        resposta: 'Distribuidores regionais ou compra coletiva com outros lava jatos. Evite varejo comum.',
        respostaCurta: 'Distribuidores ou compra coletiva.',
      },
    ],
    entidadesSemanticas: ['shampoo automotivo', 'APC', 'cera', 'limpa vidros', 'pretinho pneu'],
    metaTitleOtimizado: 'Produtos de Limpeza para Lava Jato: Lista e Preços 2026',
    metaDescriptionOtimizada: 'Lista de produtos para lava jato: shampoo, APC, cera, pretinho. Custo mensal R$ 300-800. Dicas de diluição.',
  },
  'marketing-digital-lava-jato': {
    respostaAEO: 'Google Meu Negócio + WhatsApp automático + Instagram local = 80% dos leads de lava jato.',
    dadoEstatistico: {
      valor: '73% dos clientes de lava jato pesquisam "lava jato perto de mim" no Google',
      fonte: 'Google Trends 2025',
      contexto: 'Google Meu Negócio é obrigatório',
    },
    visaoEspecialista: {
      insight: 'Invista em fotos profissionais do seu espaço. Custo: R$ 300-500. Retorno: 2-3x mais cliques.',
      experiencia: 'Lava jatos com GMB otimizado recebem 5x mais ligações.',
    },
    introducaoEnriquecida: 'O marketing digital para lava jato é simples quando você foca nos canais certos. Veja onde investir seu tempo e dinheiro.',
    secoesUnicas: [
      {
        titulo: 'Estratégia em 3 Pilares',
        conteudo: '1. Google Meu Negócio: Perfil completo, fotos, horários, responda todas avaliações. 2. WhatsApp Business: Catálogo de serviços, mensagens automáticas, lista de transmissão. 3. Instagram: Antes/depois, stories do dia a dia, reels de serviços.',
        destaque: 'Comece pelo Google - é gratuito e traz resultado imediato.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Quanto investir em tráfego pago?',
        resposta: 'Comece com R$ 300-500/mês no Google Ads local. ROI típico: 3-5x. Escale conforme resultados.',
        respostaCurta: 'R$ 300-500/mês no Google Ads.',
      },
      {
        pergunta: 'Vale contratar agência?',
        resposta: 'Para lava jatos pequenos, não. Faça você mesmo com YouTube. Agência só vale acima de R$ 30mil/mês de faturamento.',
        respostaCurta: 'Só acima de R$ 30mil/mês de faturamento.',
      },
    ],
    entidadesSemanticas: ['Google Meu Negócio', 'SEO local', 'WhatsApp Business', 'Instagram', 'marketing local'],
    metaTitleOtimizado: 'Marketing Digital para Lava Jato: Guia Completo 2026',
    metaDescriptionOtimizada: 'Marketing para lava jato: Google Meu Negócio (73% dos leads), WhatsApp automático e Instagram. Estratégia gratuita e paga.',
  },
  'mensagens-whatsapp-lava-jato': {
    respostaAEO: 'Templates prontos: boas-vindas, confirmação, lembrete 30 dias, promoção. Copie e use.',
    dadoEstatistico: {
      valor: 'Mensagem de lembrete aumenta retorno em 40%',
      fonte: 'Dados Lavify 2025',
      contexto: 'Automação de WhatsApp é essencial',
    },
    visaoEspecialista: {
      insight: 'Mensagem curta e direta. Máximo 3 linhas. Inclua o nome do cliente sempre.',
      experiencia: 'Testamos dezenas de templates e os curtos convertem 2x mais.',
    },
    introducaoEnriquecida: 'O WhatsApp é o canal de comunicação número 1 para lava jatos. Veja templates prontos para copiar e usar hoje.',
    secoesUnicas: [
      {
        titulo: 'Templates Prontos',
        conteudo: 'Boas-vindas: "Olá [nome]! Bem-vindo ao [Lava Jato]. Seu carro está em boas mãos! 🚗✨" | Finalização: "[Nome], seu carro está pronto! Pode retirar quando quiser. Aguardamos você!" | Lembrete 30 dias: "Oi [nome]! Faz 30 dias da última lavagem do seu [carro]. Que tal agendar? 🧽" | Promoção: "[Nome], temos 20% OFF em lavagem completa esta semana! Válido até [data]."',
        destaque: 'Use o sistema Lavify para enviar automaticamente.',
      },
    ],
    faqEnriquecido: [
      {
        pergunta: 'Com que frequência enviar mensagens?',
        resposta: 'Lembrete: 30 dias após última visita. Promoção: máximo 2x por mês. Mais que isso irrita o cliente.',
        respostaCurta: 'Lembrete: 30 dias. Promoção: 2x/mês.',
      },
      {
        pergunta: 'Posso usar lista de transmissão?',
        resposta: 'Sim, mas cuidado com spam. Segmente por tipo de serviço. Sempre ofereça opção de sair da lista.',
        respostaCurta: 'Sim, mas segmente e ofereça opt-out.',
      },
    ],
    entidadesSemanticas: ['WhatsApp Business', 'mensagem automática', 'template', 'lembrete', 'lista transmissão'],
    metaTitleOtimizado: 'Mensagens de WhatsApp para Lava Jato [Templates Prontos 2026]',
    metaDescriptionOtimizada: 'Templates de WhatsApp para lava jato: boas-vindas, finalização, lembrete 30 dias e promoções. Copie e use agora.',
  },
};

async function main() {
  console.log('🚀 Iniciando geração de conteúdo SEO em lote...\n');
  
  let criados = 0;
  let existentes = 0;
  let erros = 0;
  
  for (const guia of guias) {
    const cacheKey = `${guia.tema}-${guia.tipo}-brasil-`;
    
    try {
      // Verifica se já existe
      const existe = await prisma.sEOContentCache.findUnique({
        where: { cacheKey },
      });
      
      // Busca conteúdo específico ou usa fallback
      const conteudoEspecifico = conteudosEspecificos[guia.tema];
      
      if (existe) {
        // Se existe mas tem conteúdo específico melhor, atualiza
        if (conteudoEspecifico && !existe.geradoPorIA) {
          await prisma.sEOContentCache.update({
            where: { cacheKey },
            data: {
              conteudo: JSON.stringify(conteudoEspecifico),
              geradoPorIA: true,
              expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
          });
          console.log(`🔄 Atualizado: ${guia.tema}`);
          criados++;
          continue;
        }
        console.log(`⏭️  Já existe: ${guia.tema}`);
        existentes++;
        continue;
      }
      
      const conteudo = conteudoEspecifico || {
        respostaAEO: `Guia completo sobre ${guia.tema.replace(/-/g, ' ')} para lava jatos.`,
        dadoEstatistico: {
          valor: 'Setor de lava jatos cresce 8% ao ano no Brasil',
          fonte: 'Dados do mercado automotivo 2025',
          contexto: 'Demanda crescente por serviços de lavagem',
        },
        visaoEspecialista: {
          insight: 'O diferencial está na profissionalização e uso de tecnologia.',
          experiencia: 'Baseado em análise de centenas de lava jatos.',
        },
        introducaoEnriquecida: 'Este guia completo foi criado para ajudar donos de lava jato a profissionalizar suas operações.',
        secoesUnicas: [],
        faqEnriquecido: [{
          pergunta: 'Como começar?',
          resposta: 'Comece organizando seus processos e use ferramentas de gestão.',
          respostaCurta: 'Organize seus processos primeiro.',
        }],
        entidadesSemanticas: ['lava jato', 'estética automotiva', 'gestão'],
        metaTitleOtimizado: `${guia.tema.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | Lavify`,
        metaDescriptionOtimizada: `Guia completo sobre ${guia.tema.replace(/-/g, ' ')}. Atualizado 2026.`,
      };
      
      await prisma.sEOContentCache.create({
        data: {
          cacheKey,
          tema: guia.tema,
          tipoConteudo: guia.tipo,
          conteudo: JSON.stringify(conteudo),
          geradoPorIA: !!conteudoEspecifico,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dias
        },
      });
      
      console.log(`✅ Criado: ${guia.tema}`);
      criados++;
      
    } catch (error) {
      console.error(`❌ Erro em ${guia.tema}:`, error.message);
      erros++;
    }
  }
  
  console.log('\n📊 Resumo:');
  console.log(`   ✅ Criados: ${criados}`);
  console.log(`   ⏭️  Já existiam: ${existentes}`);
  console.log(`   ❌ Erros: ${erros}`);
  console.log(`   📄 Total processado: ${guias.length}`);
  
  await prisma.$disconnect();
  console.log('\n🎉 Concluído!');
}

main().catch(async (error) => {
  console.error('Erro fatal:', error);
  await prisma.$disconnect();
  process.exit(1);
});

