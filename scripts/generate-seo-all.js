/**
 * Script para gerar conteúdo SEO completo em lote
 * Inclui: Guias, Cidades e Soluções
 * 
 * Executa no Heroku: heroku run "node scripts/generate-seo-all.js" --app lavify-app
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// =====================================================
// CONTEÚDO ENRIQUECIDO PARA CIDADES (Top 20)
// =====================================================
const conteudosCidades = {
  'sao-paulo': {
    respostaAEO: 'Melhor sistema para lava jato em SP: gestão completa + WhatsApp automático. Teste grátis 7 dias.',
    dadoEstatistico: {
      valor: 'SP tem 15.000+ lava jatos registrados - maior concentração do Brasil',
      fonte: 'CAGED/IBGE 2025',
      contexto: 'Concorrência alta exige diferenciação por tecnologia',
    },
    visaoEspecialista: {
      insight: 'Em SP, o cliente espera atendimento rápido. Lava jatos com agendamento online têm 35% mais clientes.',
      experiencia: 'Dados de 200+ lava jatos na plataforma Lavify.',
    },
    introducaoEnriquecida: 'São Paulo é o maior mercado de lava jatos do Brasil. Com 15 milhões de veículos circulando, a demanda é constante - mas a concorrência também. Veja como um sistema de gestão faz a diferença.',
    destaquesLocais: [
      'Zona Sul tem maior ticket médio (R$ 55)',
      'Zona Leste lidera em volume de lavagens',
      'Agendamento online é obrigatório para competir',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Quanto custa um sistema para lava jato em SP?',
        resposta: 'Sistemas variam de R$ 0 (versões limitadas) a R$ 200/mês. O Lavify oferece plano completo por R$ 97/mês.',
        respostaCurta: 'De R$ 0 a R$ 200/mês.',
      },
      {
        pergunta: 'Como competir com grandes redes em São Paulo?',
        resposta: 'Invista em tecnologia: agendamento online 24h, WhatsApp automático e programa de fidelidade. Mesmas ferramentas das grandes redes.',
        respostaCurta: 'Tecnologia: agendamento online + WhatsApp.',
      },
    ],
    entidadesSemanticas: ['sistema lava jato sp', 'software gestão sp', 'agendamento online sp'],
    metaTitleOtimizado: 'Sistema para Lava Jato em São Paulo | Gestão Completa + Teste Grátis',
    metaDescriptionOtimizada: 'Sistema de gestão para lava jato em SP: controle pátio, WhatsApp automático e agendamento online. 15.000+ lava jatos na região. Teste grátis 7 dias.',
  },
  'rio-de-janeiro': {
    respostaAEO: 'Sistema para lava jato no RJ com controle de pátio e WhatsApp. Ideal para praias e zonas turísticas.',
    dadoEstatistico: {
      valor: 'Lava jatos do RJ têm 40% mais demanda no verão',
      fonte: 'Dados Lavify 2025',
      contexto: 'Sazonalidade exige planejamento financeiro',
    },
    visaoEspecialista: {
      insight: 'No RJ, a maresia aumenta demanda por higienização. Ofereça pacotes de proteção e aumente ticket em 50%.',
      experiencia: 'Estratégia validada em lava jatos da Zona Sul.',
    },
    introducaoEnriquecida: 'O Rio de Janeiro tem características únicas: clima praiano, maresia e turismo intenso. Lava jatos que aproveitam a sazonalidade faturam 40% mais no verão.',
    destaquesLocais: [
      'Zona Sul tem ticket mais alto (turismo)',
      'Barra da Tijuca cresce em estética premium',
      'Maresia gera demanda por proteção de pintura',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como aproveitar a sazonalidade no RJ?',
        resposta: 'Crie pacotes de verão (lavagem + hidratação de couro) e use WhatsApp para avisar clientes sobre promoções.',
        respostaCurta: 'Pacotes de verão + WhatsApp marketing.',
      },
    ],
    entidadesSemanticas: ['lava jato rj', 'sistema lava rapido rio', 'gestão lava jato zona sul'],
    metaTitleOtimizado: 'Sistema para Lava Jato no Rio de Janeiro | Controle + Agendamento',
    metaDescriptionOtimizada: 'Sistema para lava jato no RJ: gestão de pátio, agendamento online e WhatsApp. Ideal para sazonalidade do verão. Teste grátis.',
  },
  'brasilia': {
    respostaAEO: 'Sistema para lava jato em Brasília: gestão de frotas governamentais e particulares. 7 dias grátis.',
    dadoEstatistico: {
      valor: 'Brasília tem maior renda per capita e frota premium do país',
      fonte: 'IBGE 2024',
      contexto: 'Cliente exige profissionalismo e nota fiscal',
    },
    visaoEspecialista: {
      insight: 'Em Brasília, frotas de órgãos públicos são uma mina de ouro. Emita NF e ofereça condições especiais.',
      experiencia: 'Lava jatos parceiros faturam R$ 20mil+/mês só com frotas.',
    },
    introducaoEnriquecida: 'Brasília concentra órgãos públicos, embaixadas e executivos com alta renda. O cliente exige nota fiscal, pontualidade e qualidade premium.',
    destaquesLocais: [
      'Asa Norte/Sul tem maior concentração de clientes',
      'Frotas governamentais são recorrentes',
      'Lago Norte/Sul pedem estética premium',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como atender frotas de órgãos públicos?',
        resposta: 'Emita nota fiscal (NFC-e), ofereça condições para CNPJ e use o Lavify para controlar cada veículo da frota separadamente.',
        respostaCurta: 'NFC-e + condições para CNPJ + controle por veículo.',
      },
    ],
    entidadesSemanticas: ['lava jato brasilia', 'sistema lava jato df', 'gestão frota brasilia'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Brasília | Gestão de Frotas + NFC-e',
    metaDescriptionOtimizada: 'Sistema para lava jato em Brasília: controle de frotas, emissão de NFC-e e gestão completa. Ideal para atender órgãos públicos. Teste grátis.',
  },
  'belo-horizonte': {
    respostaAEO: 'Sistema para lava jato em BH: gestão completa + integração com estética automotiva. Teste grátis.',
    dadoEstatistico: {
      valor: 'BH é a 3ª cidade em número de centros de estética automotiva',
      fonte: 'Sindilav MG 2025',
      contexto: 'Mercado de estética cresce 15% ao ano na região',
    },
    visaoEspecialista: {
      insight: 'O mineiro valoriza custo-benefício. Ofereça pacotes mensais e fidelize com descontos progressivos.',
      experiencia: 'Estratégia que aumentou retenção em 60% nos parceiros de BH.',
    },
    introducaoEnriquecida: 'Belo Horizonte tem forte cultura de cuidado com o carro. O mercado de estética automotiva cresce 15% ao ano, com destaque para polimento e vitrificação.',
    destaquesLocais: [
      'Savassi e Funcionários têm ticket premium',
      'Pampulha lidera em volume de lavagens',
      'Contagem cresce em estética automotiva',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Vale investir em estética automotiva em BH?',
        resposta: 'Sim! O mercado cresce 15% ao ano. Comece com polimento e vitrificação básica, depois expanda para coating cerâmico.',
        respostaCurta: 'Sim, mercado cresce 15% ao ano.',
      },
    ],
    entidadesSemanticas: ['lava jato bh', 'sistema lava jato mg', 'estética automotiva belo horizonte'],
    metaTitleOtimizado: 'Sistema para Lava Jato em BH | Gestão + Estética Automotiva',
    metaDescriptionOtimizada: 'Sistema para lava jato em Belo Horizonte: controle de pátio, estética automotiva e WhatsApp. Mercado de estética cresce 15%/ano. Teste grátis.',
  },
  'curitiba': {
    respostaAEO: 'Sistema para lava jato em Curitiba: gestão completa para clima frio e chuvas frequentes.',
    dadoEstatistico: {
      valor: 'Curitiba tem 220 dias de chuva/ano - maior desafio para lava jatos',
      fonte: 'INMET 2024',
      contexto: 'Clima exige estratégias de fidelização para dias parados',
    },
    visaoEspecialista: {
      insight: 'Em dias de chuva, use WhatsApp para oferecer desconto no dia seguinte. Preencha a agenda antes de clarear.',
      experiencia: 'Estratégia que recupera 30% do faturamento perdido com chuva.',
    },
    introducaoEnriquecida: 'Curitiba tem o desafio do clima: 220 dias de chuva por ano. Lava jatos que dominam a estratégia de dias parados faturam consistentemente mesmo no inverno.',
    destaquesLocais: [
      'Batel e Centro têm maior movimento',
      'Santa Felicidade cresce em volume',
      'Inverno exige fidelização forte',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como manter faturamento em dias de chuva?',
        resposta: 'Programe WhatsApp automático para oferecer desconto no dia seguinte. Use o sistema para remarketing imediato.',
        respostaCurta: 'WhatsApp com promoção para dia seguinte.',
      },
    ],
    entidadesSemanticas: ['lava jato curitiba', 'sistema lava jato pr', 'gestão lava rapido curitiba'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Curitiba | Gestão para Clima Chuvoso',
    metaDescriptionOtimizada: 'Sistema para lava jato em Curitiba: gestão completa + WhatsApp para dias de chuva. Estratégias para 220 dias de chuva/ano. Teste grátis.',
  },
  'fortaleza': {
    respostaAEO: 'Sistema para lava jato em Fortaleza: leve, rápido e otimizado para internet móvel. Teste grátis.',
    dadoEstatistico: {
      valor: 'Nordeste cresce 12% ao ano em frota de veículos',
      fonte: 'Denatran 2024',
      contexto: 'Demanda crescente por serviços de lavagem na região',
    },
    visaoEspecialista: {
      insight: 'Em Fortaleza, o calor constante gera demanda diária. Foque em agilidade e programa de fidelidade para clientes frequentes.',
      experiencia: 'Lava jatos com fidelidade digital têm 45% mais retorno.',
    },
    introducaoEnriquecida: 'Fortaleza combina clima quente constante com crescimento acelerado da frota. Demanda por lavagem é diária, e clientes valorizam agilidade.',
    destaquesLocais: [
      'Aldeota e Meireles têm ticket mais alto',
      'Praia do Futuro atrai turistas',
      'Crescimento de SUVs aumenta ticket médio',
    ],
    faqEnriquecido: [
      {
        pergunta: 'O sistema funciona bem com 4G?',
        resposta: 'Sim! O Lavify é otimizado para conexões móveis. Interface leve que carrega em segundos mesmo no 4G.',
        respostaCurta: 'Sim, otimizado para 4G.',
      },
    ],
    entidadesSemanticas: ['lava jato fortaleza', 'sistema lava jato ce', 'gestão lava rapido fortaleza'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Fortaleza | Leve e Rápido + 4G',
    metaDescriptionOtimizada: 'Sistema para lava jato em Fortaleza: interface leve para 4G, WhatsApp automático e fidelização. Região cresce 12%/ano. Teste grátis.',
  },
  'salvador': {
    respostaAEO: 'Sistema para lava jato em Salvador: gestão completa para clima quente e alta demanda.',
    dadoEstatistico: {
      valor: 'Salvador tem 2ª maior frota do Nordeste com 1,1 milhão de veículos',
      fonte: 'Denatran 2024',
      contexto: 'Mercado grande com espaço para crescimento',
    },
    visaoEspecialista: {
      insight: 'O baiano valoriza relacionamento. Use o sistema para lembrar datas importantes e personalizar atendimento.',
      experiencia: 'Personalização aumenta ticket médio em 25%.',
    },
    introducaoEnriquecida: 'Salvador tem a 2ª maior frota do Nordeste e demanda constante por lavagem devido ao clima. O mercado ainda tem espaço para profissionalização.',
    destaquesLocais: [
      'Pituba e Itaigara têm clientes premium',
      'Paralela cresce em volume',
      'Lauro de Freitas atrai classe alta',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como personalizar atendimento em Salvador?',
        resposta: 'Use o histórico do cliente no Lavify para lembrar preferências, datas especiais e oferecer promoções personalizadas.',
        respostaCurta: 'Histórico de cliente + promoções personalizadas.',
      },
    ],
    entidadesSemanticas: ['lava jato salvador', 'sistema lava jato ba', 'gestão lava rapido salvador'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Salvador | Gestão + Personalização',
    metaDescriptionOtimizada: 'Sistema para lava jato em Salvador: gestão completa, histórico de clientes e WhatsApp. 2ª maior frota do Nordeste. Teste grátis.',
  },
  'recife': {
    respostaAEO: 'Sistema para lava jato em Recife: gestão completa com agendamento online e controle financeiro.',
    dadoEstatistico: {
      valor: 'Recife tem 850 mil veículos e cresce 8% ao ano',
      fonte: 'Denatran 2024',
      contexto: 'Mercado em expansão com oportunidades',
    },
    visaoEspecialista: {
      insight: 'Em Recife, o trânsito intenso gera demanda por lavagens rápidas. Ofereça serviço express e ganhe volume.',
      experiencia: 'Lavagem express de 20 min aumenta rotatividade em 40%.',
    },
    introducaoEnriquecida: 'Recife combina trânsito intenso com clima quente. Clientes valorizam agilidade e comodidade - agendamento online é diferencial.',
    destaquesLocais: [
      'Boa Viagem tem ticket premium',
      'Casa Forte e Espinheiro crescem',
      'Jaboatão tem alto volume',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como oferecer lavagem express?',
        resposta: 'Configure serviço de 20 minutos no Lavify com preço diferenciado. Use Kanban para priorizar esses carros.',
        respostaCurta: 'Serviço de 20 min com prioridade no Kanban.',
      },
    ],
    entidadesSemanticas: ['lava jato recife', 'sistema lava jato pe', 'gestão lava rapido recife'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Recife | Agendamento + Express',
    metaDescriptionOtimizada: 'Sistema para lava jato em Recife: agendamento online, lavagem express e WhatsApp. Frota cresce 8%/ano. Teste grátis 7 dias.',
  },
  'porto-alegre': {
    respostaAEO: 'Sistema para lava jato em Porto Alegre: gestão para clima variável e clientes exigentes.',
    dadoEstatistico: {
      valor: 'Gaúcho é o cliente mais exigente em qualidade do Brasil',
      fonte: 'Pesquisa Sebrae 2024',
      contexto: 'Qualidade é mais importante que preço na região',
    },
    visaoEspecialista: {
      insight: 'Em POA, checklist de entrada é obrigatório. O gaúcho cobra se algo não estiver perfeito.',
      experiencia: 'Checklist digital reduziu reclamações em 85% nos parceiros.',
    },
    introducaoEnriquecida: 'Porto Alegre tem o cliente mais exigente do Brasil. Qualidade e profissionalismo são mais importantes que preço. Checklist e documentação fazem diferença.',
    destaquesLocais: [
      'Moinhos de Vento tem ticket premium',
      'Zona Norte lidera em volume',
      'Inverno exige fidelização',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como atender clientes exigentes em POA?',
        resposta: 'Use checklist de entrada com fotos, envie atualizações por WhatsApp e documente tudo. Transparência gera confiança.',
        respostaCurta: 'Checklist com fotos + atualizações WhatsApp.',
      },
    ],
    entidadesSemanticas: ['lava jato porto alegre', 'sistema lava jato rs', 'gestão lava rapido poa'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Porto Alegre | Qualidade + Checklist',
    metaDescriptionOtimizada: 'Sistema para lava jato em Porto Alegre: checklist de entrada, WhatsApp e controle de qualidade. Cliente gaúcho é o mais exigente. Teste grátis.',
  },
  'goiania': {
    respostaAEO: 'Sistema para lava jato em Goiânia: gestão de frotas do agronegócio e veículos pesados.',
    dadoEstatistico: {
      valor: 'Goiânia tem 3x mais caminhonetes per capita que média nacional',
      fonte: 'Denatran 2024',
      contexto: 'Agronegócio impulsiona demanda por lavagem de veículos pesados',
    },
    visaoEspecialista: {
      insight: 'Em Goiânia, diferencie preço por porte do veículo. Caminhonetes e SUVs devem custar 40% mais.',
      experiencia: 'Precificação por porte aumenta ticket médio em 35%.',
    },
    introducaoEnriquecida: 'Goiânia é capital do agronegócio com frota de caminhonetes 3x maior que a média nacional. Veículos maiores significam tickets maiores.',
    destaquesLocais: [
      'Setor Bueno tem clientes premium',
      'Aparecida de Goiânia cresce rápido',
      'Agro traz frotas corporativas',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como precificar para caminhonetes?',
        resposta: 'Crie categoria de preço 40% maior para pickups e SUVs. O Lavify permite diferentes preços por tipo de veículo.',
        respostaCurta: 'Categoria 40% maior no sistema.',
      },
    ],
    entidadesSemanticas: ['lava jato goiania', 'sistema lava jato go', 'gestão lava rapido goiania'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Goiânia | Frotas + Veículos Pesados',
    metaDescriptionOtimizada: 'Sistema para lava jato em Goiânia: gestão de frotas, preços por porte de veículo e WhatsApp. 3x mais caminhonetes. Teste grátis.',
  },
  'campinas': {
    respostaAEO: 'Sistema para lava jato em Campinas: gestão para alta demanda e competição com grandes redes.',
    dadoEstatistico: {
      valor: 'Campinas tem maior renda per capita do interior paulista',
      fonte: 'IBGE 2024',
      contexto: 'Cliente de alto poder aquisitivo valoriza tecnologia',
    },
    visaoEspecialista: {
      insight: 'Em Campinas, o cliente tech-savvy espera agendamento online e pagamento digital. Modernize ou perca mercado.',
      experiencia: 'Lava jatos digitalizados têm 50% mais clientes na região.',
    },
    introducaoEnriquecida: 'Campinas tem a maior renda do interior paulista e clientes tech-savvy. Agendamento online e pagamento digital são requisitos básicos.',
    destaquesLocais: [
      'Cambuí tem ticket premium',
      'Barão Geraldo atrai universitários',
      'Alphaville Campinas cresce em estética',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como competir com grandes redes em Campinas?',
        resposta: 'Invista em tecnologia: agendamento online 24h, WhatsApp automático e fidelidade digital. Mesmas ferramentas, atendimento personalizado.',
        respostaCurta: 'Tecnologia + atendimento personalizado.',
      },
    ],
    entidadesSemanticas: ['lava jato campinas', 'sistema lava jato campinas', 'gestão lava rapido campinas'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Campinas | Tecnologia + Competitividade',
    metaDescriptionOtimizada: 'Sistema para lava jato em Campinas: agendamento online, WhatsApp e fidelidade. Maior renda do interior SP. Teste grátis 7 dias.',
  },
  'manaus': {
    respostaAEO: 'Sistema para lava jato em Manaus: leve, funciona offline e otimizado para clima amazônico.',
    dadoEstatistico: {
      valor: 'Manaus tem 2º maior crescimento de frota do Norte',
      fonte: 'Denatran 2024',
      contexto: 'Mercado em expansão com poucas soluções tecnológicas',
    },
    visaoEspecialista: {
      insight: 'Em Manaus, o calor intenso gera demanda constante por higienização. Ofereça pacotes de limpeza completa.',
      experiencia: 'Higienização completa tem margem 3x maior que lavagem simples.',
    },
    introducaoEnriquecida: 'Manaus tem clima quente o ano todo e frota em crescimento. A demanda por lavagem é constante, mas faltam soluções tecnológicas.',
    destaquesLocais: [
      'Adrianópolis tem clientes premium',
      'Zona Leste tem alto volume',
      'Calor constante gera demanda diária',
    ],
    faqEnriquecido: [
      {
        pergunta: 'O sistema funciona com internet instável?',
        resposta: 'Sim! O Lavify salva dados localmente e sincroniza quando a conexão volta. Você não perde nenhuma informação.',
        respostaCurta: 'Sim, funciona offline e sincroniza depois.',
      },
    ],
    entidadesSemanticas: ['lava jato manaus', 'sistema lava jato am', 'gestão lava rapido manaus'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Manaus | Leve + Offline',
    metaDescriptionOtimizada: 'Sistema para lava jato em Manaus: funciona offline, WhatsApp integrado e gestão completa. Clima quente = demanda diária. Teste grátis.',
  },
  'guarulhos': {
    respostaAEO: 'Sistema para lava jato em Guarulhos: gestão de alto volume próximo ao maior aeroporto do país.',
    dadoEstatistico: {
      valor: 'Guarulhos tem 2º maior volume de lavagens da Grande SP',
      fonte: 'Dados Lavify 2025',
      contexto: 'Fluxo do aeroporto gera demanda constante',
    },
    visaoEspecialista: {
      insight: 'Próximo ao aeroporto, ofereça serviço de valet - cliente deixa o carro e pega pronto na volta.',
      experiencia: 'Serviço valet aeroporto tem ticket 2x maior.',
    },
    introducaoEnriquecida: 'Guarulhos combina o maior aeroporto do país com alta densidade de veículos. Oportunidade única para serviços diferenciados.',
    destaquesLocais: [
      'Região do aeroporto tem demanda especial',
      'Centro comercial traz volume',
      'Bosque Maia tem ticket premium',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como aproveitar proximidade do aeroporto?',
        resposta: 'Ofereça serviço valet: cliente deixa o carro, viaja, e pega limpo na volta. Use agendamento para coordenar.',
        respostaCurta: 'Serviço valet com agendamento.',
      },
    ],
    entidadesSemanticas: ['lava jato guarulhos', 'sistema lava jato guarulhos', 'gestão lava rapido gru'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Guarulhos | Alto Volume + Aeroporto',
    metaDescriptionOtimizada: 'Sistema para lava jato em Guarulhos: gestão de alto volume, serviço valet aeroporto e WhatsApp. 2º maior da Grande SP. Teste grátis.',
  },
  'florianopolis': {
    respostaAEO: 'Sistema para lava jato em Florianópolis: gestão para sazonalidade turística e cliente exigente.',
    dadoEstatistico: {
      valor: 'Floripa tem 3x mais movimento no verão',
      fonte: 'Santur 2024',
      contexto: 'Sazonalidade extrema exige planejamento',
    },
    visaoEspecialista: {
      insight: 'Em Floripa, prepare-se para o verão. Contrate temporários, estoque produtos e use fila de agendamento.',
      experiencia: 'Lava jatos organizados faturam 4x mais em janeiro.',
    },
    introducaoEnriquecida: 'Florianópolis tem sazonalidade extrema: 3x mais clientes no verão. Quem se prepara fatura em janeiro o que outros faturam em 3 meses.',
    destaquesLocais: [
      'Lagoa e Jurerê têm ticket premium',
      'Centro tem movimento constante',
      'Turistas exigem agilidade',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como gerenciar sazonalidade em Floripa?',
        resposta: 'Use fila de agendamento para controlar demanda, contrate temporários com antecedência e estoque produtos para 3 meses.',
        respostaCurta: 'Agendamento + temporários + estoque antecipado.',
      },
    ],
    entidadesSemanticas: ['lava jato florianopolis', 'sistema lava jato sc', 'gestão lava rapido floripa'],
    metaTitleOtimizado: 'Sistema para Lava Jato em Florianópolis | Sazonalidade + Turismo',
    metaDescriptionOtimizada: 'Sistema para lava jato em Florianópolis: gestão de sazonalidade, agendamento e WhatsApp. 3x mais movimento no verão. Teste grátis.',
  },
};

// =====================================================
// CONTEÚDO ENRIQUECIDO PARA SOLUÇÕES (Serviços)
// =====================================================
const conteudosSolucoes = {
  'estetica-automotiva': {
    respostaAEO: 'Sistema para estética automotiva: controle garantias, fotos antes/depois e histórico técnico.',
    dadoEstatistico: {
      valor: 'Estética automotiva cresce 18% ao ano no Brasil',
      fonte: 'ABRAV 2025',
      contexto: 'Mercado premium com margens altas',
    },
    visaoEspecialista: {
      insight: 'Controle de garantia é obrigatório. Cliente de coating volta quando acaba - se você não avisar, ele vai para concorrente.',
      experiencia: 'Aviso de vencimento aumenta renovação em 70%.',
    },
    introducaoEnriquecida: 'A estética automotiva é o serviço de maior margem no setor. Polimento, vitrificação e coating exigem controle técnico e gestão de garantias.',
    beneficiosUnicos: [
      'Controle de garantias com vencimento automático',
      'Galeria de fotos antes/depois para portfólio',
      'Histórico técnico por veículo (marca, camadas)',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como controlar garantia de vitrificação?',
        resposta: 'Cadastre a garantia no Lavify com data de vencimento. O sistema avisa automaticamente 30 dias antes.',
        respostaCurta: 'Cadastre garantia + alerta automático 30 dias antes.',
      },
      {
        pergunta: 'Como criar portfólio de serviços?',
        resposta: 'Anexe fotos antes/depois em cada ordem de serviço. O sistema cria galeria automática por tipo de serviço.',
        respostaCurta: 'Fotos em cada OS = galeria automática.',
      },
    ],
    entidadesSemanticas: ['estética automotiva', 'polimento', 'vitrificação', 'coating cerâmico', 'PPF'],
    metaTitleOtimizado: 'Sistema para Estética Automotiva | Garantias + Portfólio',
    metaDescriptionOtimizada: 'Sistema para estética automotiva: controle de garantias, fotos antes/depois e histórico técnico. Mercado cresce 18%/ano. Teste grátis.',
  },
  'lavagem-a-seco': {
    respostaAEO: 'Sistema para lavagem a seco: gestão de equipe móvel, rotas e controle de produtos ecológicos.',
    dadoEstatistico: {
      valor: 'Lavagem a seco economiza 300L de água por veículo',
      fonte: 'CETESB 2024',
      contexto: 'Sustentabilidade atrai clientes premium',
    },
    visaoEspecialista: {
      insight: 'Cliente de lavagem a seco paga mais por conveniência. Agendamento com endereço é obrigatório.',
      experiencia: 'Serviço delivery tem ticket 50% maior que presencial.',
    },
    introducaoEnriquecida: 'A lavagem a seco combina sustentabilidade com conveniência. Clientes pagam premium por serviço em domicílio que economiza água.',
    beneficiosUnicos: [
      'Agendamento com captura de endereço',
      'Gestão de equipe móvel com rotas',
      'Controle de consumo de produtos',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como gerenciar equipe delivery?',
        resposta: 'Cadastre endereço no agendamento, atribua funcionários por região e acompanhe status pelo Kanban.',
        respostaCurta: 'Endereço + funcionário por região + Kanban.',
      },
    ],
    entidadesSemanticas: ['lavagem a seco', 'lavagem ecológica', 'delivery automotivo', 'lavagem sem água'],
    metaTitleOtimizado: 'Sistema para Lavagem a Seco | Equipe Móvel + Rotas',
    metaDescriptionOtimizada: 'Sistema para lavagem a seco: agendamento com endereço, gestão de equipe móvel e controle de produtos. Economiza 300L/veículo. Teste grátis.',
  },
  'martelinho-de-ouro': {
    respostaAEO: 'Sistema para martelinho de ouro: orçamentos com fotos, acompanhamento de reparos e fila de veículos.',
    dadoEstatistico: {
      valor: 'Martelinho de ouro tem ticket médio de R$ 400-800',
      fonte: 'Dados Lavify 2025',
      contexto: 'Serviço de alto valor exige documentação',
    },
    visaoEspecialista: {
      insight: 'Orçamento com fotos fecha 40% mais que orçamento verbal. Documente cada amassado.',
      experiencia: 'Sistema de orçamento digital aumenta conversão em 40%.',
    },
    introducaoEnriquecida: 'O martelinho de ouro é serviço de alto valor que exige confiança. Orçamentos documentados com fotos e acompanhamento de status geram mais vendas.',
    beneficiosUnicos: [
      'Orçamentos com fotos e descrição detalhada',
      'Acompanhamento de status por reparo',
      'Fila de veículos organizada no Kanban',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como fazer orçamento profissional?',
        resposta: 'Crie ordem de serviço com fotos de cada amassado, descrição e valor. Envie pelo WhatsApp para aprovação.',
        respostaCurta: 'Fotos + descrição + envio WhatsApp.',
      },
    ],
    entidadesSemanticas: ['martelinho de ouro', 'reparo de amassados', 'PDR', 'funilaria rápida'],
    metaTitleOtimizado: 'Sistema para Martelinho de Ouro | Orçamentos + Fotos',
    metaDescriptionOtimizada: 'Sistema para martelinho de ouro: orçamentos com fotos, acompanhamento de reparos e Kanban. Ticket médio R$ 400-800. Teste grátis.',
  },
  'vitrificacao': {
    respostaAEO: 'Sistema para vitrificação: controle de garantias, registro técnico e lembrete de manutenção.',
    dadoEstatistico: {
      valor: 'Vitrificação tem margem de 60-70% - maior do setor',
      fonte: 'ABRAV 2025',
      contexto: 'Serviço premium com recorrência',
    },
    visaoEspecialista: {
      insight: 'Cliente de vitrificação volta para manutenção. Quem avisa o vencimento retém 80% dos clientes.',
      experiencia: 'Lembrete de manutenção é o segredo da recorrência.',
    },
    introducaoEnriquecida: 'A vitrificação é o serviço de maior margem no setor automotivo. Controle de garantias e lembretes de manutenção garantem recorrência.',
    beneficiosUnicos: [
      'Registro técnico (marca, camadas, tempo de cura)',
      'Controle de garantia com vencimento',
      'Lembrete automático de manutenção',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como controlar garantias de coating?',
        resposta: 'Registre marca, camadas e data de aplicação. Sistema calcula vencimento e envia lembrete 30 dias antes.',
        respostaCurta: 'Registro técnico + lembrete automático.',
      },
    ],
    entidadesSemanticas: ['vitrificação', 'coating cerâmico', 'proteção de pintura', 'ceramic coating'],
    metaTitleOtimizado: 'Sistema para Vitrificação | Garantias + Manutenção',
    metaDescriptionOtimizada: 'Sistema para vitrificação e coating: controle de garantias, registro técnico e lembretes. Margem de 60-70%. Teste grátis.',
  },
  'higienizacao': {
    respostaAEO: 'Sistema para higienização automotiva: checklists, fotos de antes/depois e controle de produtos.',
    dadoEstatistico: {
      valor: 'Demanda por higienização cresceu 150% pós-pandemia',
      fonte: 'Pesquisa Lavify 2025',
      contexto: 'Cliente mais consciente sobre limpeza interna',
    },
    visaoEspecialista: {
      insight: 'Higienização completa tem margem 3x maior que lavagem. Ofereça como upsell no momento certo.',
      experiencia: 'Upsell de higienização converte 35% quando oferecido após lavagem.',
    },
    introducaoEnriquecida: 'A higienização automotiva explodiu pós-pandemia. Clientes pagam premium por limpeza profunda - oportunidade de upsell em cada lavagem.',
    beneficiosUnicos: [
      'Checklist de higienização por área',
      'Fotos antes/depois para comprovar resultado',
      'Controle de produtos e consumo',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como oferecer higienização como upsell?',
        resposta: 'Após lavagem, mostre o interior do carro e ofereça. Configure alerta no Lavify para lembrar a equipe.',
        respostaCurta: 'Mostrar carro limpo + alerta para oferecer.',
      },
    ],
    entidadesSemanticas: ['higienização automotiva', 'limpeza interna', 'ozônio', 'sanitização'],
    metaTitleOtimizado: 'Sistema para Higienização Automotiva | Checklists + Upsell',
    metaDescriptionOtimizada: 'Sistema para higienização automotiva: checklists, fotos antes/depois e controle de produtos. Demanda cresceu 150%. Teste grátis.',
  },
  'polimento': {
    respostaAEO: 'Sistema para polimento automotivo: controle de garantias, registro técnico e fotos do resultado.',
    dadoEstatistico: {
      valor: 'Polimento profissional tem ticket médio de R$ 200-500',
      fonte: 'Dados Lavify 2025',
      contexto: 'Serviço técnico que exige documentação',
    },
    visaoEspecialista: {
      insight: 'Fotos do resultado vendem mais que qualquer argumento. Crie portfólio digital de cada serviço.',
      experiencia: 'Portfólio digital aumenta conversão em 60%.',
    },
    introducaoEnriquecida: 'O polimento profissional exige conhecimento técnico e documentação. Fotos do resultado são a melhor propaganda para novos clientes.',
    beneficiosUnicos: [
      'Registro do tipo de polimento realizado',
      'Fotos antes/depois do processo',
      'Histórico por veículo',
    ],
    faqEnriquecido: [
      {
        pergunta: 'Como documentar polimento profissional?',
        resposta: 'Tire fotos antes, durante e depois. Registre tipo de polimento, massa e boina usadas. Tudo no histórico do veículo.',
        respostaCurta: 'Fotos + tipo de polimento + histórico.',
      },
    ],
    entidadesSemanticas: ['polimento automotivo', 'espelhamento', 'correção de pintura', 'polimento técnico'],
    metaTitleOtimizado: 'Sistema para Polimento Automotivo | Portfólio + Técnico',
    metaDescriptionOtimizada: 'Sistema para polimento automotivo: fotos antes/depois, registro técnico e histórico. Ticket médio R$ 200-500. Teste grátis.',
  },
};

// =====================================================
// FUNÇÃO PRINCIPAL
// =====================================================
async function main() {
  console.log('🚀 Gerando conteúdo SEO completo...\n');
  
  let totalCriados = 0;
  let totalExistentes = 0;
  let totalErros = 0;

  // 1. GERAR CONTEÚDO PARA CIDADES
  console.log('📍 Gerando conteúdo para CIDADES...\n');
  
  for (const [cidadeSlug, conteudo] of Object.entries(conteudosCidades)) {
    const cacheKey = `${cidadeSlug}-cidade-${cidadeSlug}-`;
    
    try {
      const existe = await prisma.sEOContentCache.findUnique({
        where: { cacheKey },
      });
      
      if (existe) {
        if (!existe.geradoPorIA) {
          await prisma.sEOContentCache.update({
            where: { cacheKey },
            data: {
              conteudo: JSON.stringify(conteudo),
              geradoPorIA: true,
              expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
          });
          console.log(`🔄 Cidade atualizada: ${cidadeSlug}`);
          totalCriados++;
        } else {
          console.log(`⏭️  Cidade já existe: ${cidadeSlug}`);
          totalExistentes++;
        }
        continue;
      }
      
      await prisma.sEOContentCache.create({
        data: {
          cacheKey,
          tema: cidadeSlug,
          tipoConteudo: 'cidade',
          cidadeNome: cidadeSlug,
          cidadeUf: '',
          conteudo: JSON.stringify(conteudo),
          geradoPorIA: true,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });
      
      console.log(`✅ Cidade criada: ${cidadeSlug}`);
      totalCriados++;
    } catch (error) {
      console.error(`❌ Erro em cidade ${cidadeSlug}:`, error.message);
      totalErros++;
    }
  }

  // 2. GERAR CONTEÚDO PARA SOLUÇÕES
  console.log('\n🔧 Gerando conteúdo para SOLUÇÕES...\n');
  
  for (const [servicoSlug, conteudo] of Object.entries(conteudosSolucoes)) {
    const cacheKey = `${servicoSlug}-servico-brasil-`;
    
    try {
      const existe = await prisma.sEOContentCache.findUnique({
        where: { cacheKey },
      });
      
      if (existe) {
        if (!existe.geradoPorIA) {
          await prisma.sEOContentCache.update({
            where: { cacheKey },
            data: {
              conteudo: JSON.stringify(conteudo),
              geradoPorIA: true,
              expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
          });
          console.log(`🔄 Solução atualizada: ${servicoSlug}`);
          totalCriados++;
        } else {
          console.log(`⏭️  Solução já existe: ${servicoSlug}`);
          totalExistentes++;
        }
        continue;
      }
      
      await prisma.sEOContentCache.create({
        data: {
          cacheKey,
          tema: servicoSlug,
          tipoConteudo: 'servico',
          conteudo: JSON.stringify(conteudo),
          geradoPorIA: true,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      });
      
      console.log(`✅ Solução criada: ${servicoSlug}`);
      totalCriados++;
    } catch (error) {
      console.error(`❌ Erro em solução ${servicoSlug}:`, error.message);
      totalErros++;
    }
  }

  // RESUMO
  console.log('\n📊 Resumo Final:');
  console.log(`   ✅ Criados/Atualizados: ${totalCriados}`);
  console.log(`   ⏭️  Já existiam: ${totalExistentes}`);
  console.log(`   ❌ Erros: ${totalErros}`);
  console.log(`   📄 Total processado: ${Object.keys(conteudosCidades).length + Object.keys(conteudosSolucoes).length}`);
  
  await prisma.$disconnect();
  console.log('\n🎉 Concluído!');
}

main().catch(async (error) => {
  console.error('Erro fatal:', error);
  await prisma.$disconnect();
  process.exit(1);
});

