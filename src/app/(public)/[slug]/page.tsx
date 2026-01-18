import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getPaginaSEOBySlug,
  getAllPaginaSEOSlugs,
  getPaginasRelacionadas,
} from "@/lib/seo-keywords";
import type { PaginaSEO } from "@/lib/seo-keywords";
import {
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Zap,
  Shield,
  Clock,
  Smartphone,
  LayoutDashboard,
  Calendar,
  MessageCircle,
  Package,
  Users,
  TrendingUp,
  Droplets,
  ChevronRight,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Importante: apenas aceita slugs pré-gerados
export const dynamicParams = false;

// Gera as páginas estaticamente no build
export async function generateStaticParams() {
  const slugs = getAllPaginaSEOSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Gera metadados dinâmicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pagina = getPaginaSEOBySlug(slug);

  if (!pagina) {
    return {};
  }

  return {
    title: pagina.titulo,
    description: pagina.descricaoMeta,
    keywords: pagina.keywords,
    alternates: {
      canonical: `/${pagina.slug}`,
    },
    openGraph: {
      title: pagina.h1,
      description: pagina.descricaoMeta,
      type: "website",
    },
  };
}

// Conteúdo específico por tipo de página
function getConteudoPorTipo(pagina: PaginaSEO) {
  const conteudos: Record<string, { secoes: { titulo: string; texto: string }[]; beneficios: string[] }> = {
    "como-organizar-lava-rapido": {
      secoes: [
        {
          titulo: "Por que a Organização é Essencial no Lava Rápido?",
          texto: "Um lava rápido desorganizado perde dinheiro todos os dias. Carros esperando demais, clientes insatisfeitos, equipe sem saber o que fazer. A organização é a base de um negócio lucrativo. Com um sistema de gestão, você sabe exatamente onde cada carro está, quem está fazendo o quê, e quanto está faturando em tempo real."
        },
        {
          titulo: "Como o Sistema Kanban Organiza seu Pátio",
          texto: "O Kanban visual mostra todos os carros em colunas: Aguardando, Lavando, Finalizando e Pronto. Basta arrastar o card do carro para a próxima etapa. Sua equipe vê tudo em uma tela, sem precisar gritar ou procurar pelo pátio. É organização profissional sem complicação."
        },
        {
          titulo: "Agendamento Online: Organização que Começa Antes do Cliente Chegar",
          texto: "Com agendamento online, você sabe quantos carros virão amanhã. Pode organizar a equipe, os produtos e até fazer promoções em horários vazios. Clientes agendam 24h pelo celular, e você recebe notificação instantânea. Chega de fila descontrolada na segunda-feira."
        }
      ],
      beneficios: [
        "Kanban visual do pátio em tempo real",
        "Agendamento online 24 horas",
        "WhatsApp automático para avisar cliente",
        "Controle de estoque com alertas",
        "Relatórios de faturamento diário",
        "Gestão de equipe simplificada"
      ]
    },
    "como-controlar-patio-lava-jato": {
      secoes: [
        {
          titulo: "O Problema do Pátio Desorganizado",
          texto: "Quantas vezes você perdeu tempo procurando um carro no pátio? Ou o cliente ligou perguntando se já estava pronto e ninguém sabia? Um pátio desorganizado gera atrasos, erros e clientes irritados. O controle visual resolve isso de forma simples e profissional."
        },
        {
          titulo: "Sistema Kanban: Controle Visual Intuitivo",
          texto: "O Kanban divide seu pátio em colunas visuais. Cada carro é um card com placa, modelo, serviços e valor. Quando um funcionário começa a lavar, arrasta o card para 'Lavando'. Quando termina, arrasta para 'Pronto'. Simples assim. Todos veem o mesmo, em tempo real."
        },
        {
          titulo: "Aviso Automático ao Cliente via WhatsApp",
          texto: "Quando o card vai para 'Pronto', com um clique você envia WhatsApp automático: 'Seu carro está pronto para retirada!'. O cliente não precisa ligar, você não precisa lembrar de avisar. É profissionalismo que impressiona e fideliza."
        }
      ],
      beneficios: [
        "Visualização instantânea de todos os carros",
        "Arraste e solte para mudar status",
        "WhatsApp automático quando pronto",
        "Funciona no celular e computador",
        "Histórico de todas as lavagens",
        "Tempo médio por serviço"
      ]
    },
    "como-enviar-whatsapp-automatico-lava-jato": {
      secoes: [
        {
          titulo: "Por que Avisar o Cliente Automaticamente?",
          texto: "Cliente esperando é cliente insatisfeito. Quando você avisa na hora certa, o cliente vem buscar rápido, libera vaga no pátio e sai feliz. O WhatsApp automático faz isso por você: um clique e a mensagem personalizada é enviada. Sem precisar digitar, sem esquecer."
        },
        {
          titulo: "Como Funciona o WhatsApp Automático",
          texto: "No sistema Lavify, quando o carro fica pronto, aparece um botão 'Avisar Cliente'. Com um toque, abre o WhatsApp com a mensagem pronta: nome do cliente, placa do carro e texto personalizado. Você só confirma e envia. Leva 3 segundos."
        },
        {
          titulo: "Mensagens Personalizadas que Fidelizam",
          texto: "Você pode personalizar a mensagem com o nome do seu lava rápido, promoções e até pedir avaliação. 'Olá João, seu Civic placa ABC-1234 está pronto! Retire quando quiser. Obrigado por escolher o Lava Jato do Zé!' É atendimento profissional que diferencia."
        }
      ],
      beneficios: [
        "Aviso em 1 clique pelo WhatsApp",
        "Mensagem personalizada automática",
        "Nome do cliente e placa do carro",
        "Funciona direto no celular",
        "Aumenta rotatividade do pátio",
        "Melhora satisfação do cliente"
      ]
    },
    "como-fazer-agendamento-online-lava-rapido": {
      secoes: [
        {
          titulo: "Agendamento Online: Seu Lava Jato Aberto 24 Horas",
          texto: "Enquanto você dorme, clientes podem agendar lavagem para amanhã. Pelo celular, escolhem o serviço, a data e o horário. Você acorda com a agenda organizada. Isso é agendamento online: comodidade para o cliente, organização para você."
        },
        {
          titulo: "Como Funciona na Prática",
          texto: "Cada lava jato no Lavify tem uma página pública. O cliente acessa, vê os serviços e preços, escolhe o que quer e agenda. Você recebe notificação no celular. Pode confirmar, sugerir outro horário ou entrar em contato. Tudo registrado no sistema."
        },
        {
          titulo: "Benefícios do Agendamento Online",
          texto: "Menos tempo ao telefone, menos filas na porta, mais previsibilidade. Você sabe quantos carros virão, pode preparar a equipe e os produtos. Em horários vazios, pode criar promoções automáticas. É controle total da sua agenda de forma inteligente."
        }
      ],
      beneficios: [
        "Clientes agendam 24h pelo celular",
        "Página própria do seu lava jato",
        "Notificação instantânea de novos agendamentos",
        "Confirmação automática por WhatsApp",
        "Reduz filas e tempo de espera",
        "Previsibilidade de faturamento"
      ]
    },
    // ═══════════════════════════════════════════════════════════════════
    // GESTÃO DE FROTAS PRIVADAS
    // ═══════════════════════════════════════════════════════════════════
    "sistema-lavagem-frotas-empresariais": {
      secoes: [
        {
          titulo: "Por que Frotas Empresariais Precisam de Sistema Dedicado?",
          texto: "Locadoras, transportadoras e empresas com frota própria enfrentam um desafio único: controlar a higienização de dezenas ou centenas de veículos. Planilhas não dão conta. Você precisa saber qual veículo foi lavado, quando, por quem e quanto custou. O Lavify oferece controle completo com histórico por veículo, alertas de manutenção programada e relatórios gerenciais."
        },
        {
          titulo: "Controle por Veículo: Histórico Completo",
          texto: "Cada veículo da frota tem ficha própria no sistema. Você vê todas as lavagens realizadas, serviços aplicados, produtos utilizados e custos acumulados. Quando um gestor de frota pergunta 'quando foi a última higienização do veículo X?', você responde em segundos. É profissionalismo que gera confiança e contratos renovados."
        },
        {
          titulo: "Integração com Gestão de Frota",
          texto: "O Lavify permite exportar relatórios detalhados para integração com sistemas de gestão de frota. Custos por veículo, frequência de lavagem, tempo médio de atendimento — tudo documentado. Ideal para empresas que precisam prestar contas ou auditar custos operacionais."
        }
      ],
      beneficios: [
        "Ficha completa por veículo da frota",
        "Histórico de todas as higienizações",
        "Relatórios de custo por veículo",
        "Alertas de manutenção programada",
        "Exportação para sistemas de frota",
        "Contratos de frota com preços especiais"
      ]
    },
    "controle-higienizacao-frotas-agricolas": {
      secoes: [
        {
          titulo: "Higienização de Máquinas Agrícolas: Conformidade e Controle",
          texto: "Tratores, colheitadeiras, pulverizadores e implementos agrícolas exigem higienização especializada. Além da limpeza, há exigências sanitárias e de conformidade que precisam ser documentadas. O Lavify permite registrar cada procedimento, produtos utilizados e gerar laudos de conformidade para fiscalizações."
        },
        {
          titulo: "Controle de Produtos Especiais para Agro",
          texto: "Máquinas agrícolas exigem produtos específicos: desengraxantes para equipamentos, neutralizadores de defensivos, produtos para borrachas e mangueiras. O sistema controla o estoque desses produtos especiais, calcula custo por higienização e alerta quando estão acabando."
        },
        {
          titulo: "Rastreabilidade e Documentação para Auditorias",
          texto: "Empresas agrícolas são frequentemente auditadas. O Lavify gera relatórios completos de higienização por máquina, com datas, responsáveis e produtos utilizados. Você demonstra conformidade sanitária com documentação profissional, evitando multas e problemas com certificações."
        }
      ],
      beneficios: [
        "Controle por máquina/equipamento",
        "Registro de conformidade sanitária",
        "Gestão de produtos agrícolas especiais",
        "Laudos de higienização para auditorias",
        "Alertas de higienização programada",
        "Relatórios para certificações"
      ]
    },
    "software-lavagem-caminhoes-onibus": {
      secoes: [
        {
          titulo: "Lavagem de Veículos Pesados: Operação Especializada",
          texto: "Caminhões, ônibus e carretas exigem estrutura e gestão diferenciada. Mais tempo por lavagem, produtos específicos, equipe treinada. O Lavify foi adaptado para operações com veículos pesados: tempos de serviço maiores, checklist específico para cabine, carroceria e chassi, e controle de custos realista."
        },
        {
          titulo: "Gestão de Frotas de Transportadoras",
          texto: "Transportadoras precisam de controle rígido. Qual motorista trouxe o caminhão? Quando foi a última lavagem? Quanto está custando manter a frota limpa? O Lavify responde tudo isso com relatórios por veículo, por período e por tipo de serviço. Gestores tomam decisões baseadas em dados, não em achismos."
        },
        {
          titulo: "Atendimento a Frotas de Ônibus",
          texto: "Empresas de ônibus — urbanos, rodoviários ou fretamento — têm rotina intensa de higienização. O sistema permite criar pacotes de serviços específicos: lavagem externa, higienização de poltronas, limpeza de banheiro. Cada ônibus tem histórico, e você oferece um serviço profissional que fideliza frotas inteiras."
        }
      ],
      beneficios: [
        "Serviços específicos para pesados",
        "Controle por veículo da frota",
        "Checklist cabine/carroceria/chassi",
        "Relatórios para transportadoras",
        "Gestão de produtos para pesados",
        "Tempo de serviço diferenciado"
      ]
    },
    "sistema-lava-jato-locadoras-veiculos": {
      secoes: [
        {
          titulo: "Higienização para Locadoras: Velocidade e Qualidade",
          texto: "Locadoras de veículos vivem de rotatividade. Carro devolvido precisa estar limpo e pronto para o próximo cliente em horas. O Lavify otimiza esse fluxo: integra com o sistema da locadora, prioriza veículos com reserva, e garante que nenhum carro saia sujo para um cliente."
        },
        {
          titulo: "Checklist de Devolução Integrado",
          texto: "Quando o veículo chega da locação, o sistema registra o estado: sujeira do interior, condições externas, nível de combustível. Isso alimenta automaticamente a ordem de serviço de higienização. Tudo documentado, protegendo a locadora de reclamações e gerando histórico para precificação de danos."
        },
        {
          titulo: "Relatórios para Gestão de Frota da Locadora",
          texto: "Quanto custa manter cada veículo limpo? Quais carros dão mais trabalho? O Lavify gera relatórios que ajudam a locadora a tomar decisões: vender veículos problemáticos, ajustar preços de locação, ou identificar padrões de mau uso por determinados perfis de cliente."
        }
      ],
      beneficios: [
        "Integração com fluxo de locação",
        "Checklist de devolução digital",
        "Priorização por reserva",
        "Histórico por veículo",
        "Custo de higienização por carro",
        "Relatórios gerenciais para locadora"
      ]
    },
    // ═══════════════════════════════════════════════════════════════════
    // CONFORMIDADE E JURÍDICO
    // ═══════════════════════════════════════════════════════════════════
    "licenciamento-ambiental-lava-rapido": {
      secoes: [
        {
          titulo: "Por que o Licenciamento Ambiental é Obrigatório?",
          texto: "Lava rápidos geram efluentes com óleo, graxa, detergentes e resíduos químicos. A legislação ambiental brasileira exige que esses resíduos sejam tratados antes de descarte. Operar sem licença ambiental pode resultar em multas pesadas, interdição e até processo criminal. O primeiro passo para regularizar é entender o que sua cidade e estado exigem."
        },
        {
          titulo: "Documentação Necessária para Licenciamento",
          texto: "Geralmente você precisará de: CNPJ ativo, alvará de funcionamento, projeto de tratamento de efluentes assinado por engenheiro, comprovante de instalação de caixa separadora de água e óleo, e laudos de análise de efluentes. O processo varia por estado, mas o Lavify ajuda você a manter registros que comprovam conformidade contínua."
        },
        {
          titulo: "Como o Sistema Ajuda na Conformidade",
          texto: "O Lavify registra quantidade de água utilizada, produtos aplicados e volume estimado de efluentes por período. Esses dados são valiosos para relatórios ambientais e renovação de licenças. Você demonstra aos órgãos fiscalizadores que tem controle profissional da operação."
        }
      ],
      beneficios: [
        "Registro de consumo de água",
        "Controle de produtos químicos",
        "Relatórios para órgãos ambientais",
        "Histórico de operação documentado",
        "Dados para renovação de licença",
        "Comprovação de conformidade"
      ]
    },
    "tratamento-efluentes-lava-jato": {
      secoes: [
        {
          titulo: "O que são Efluentes de Lava Jato?",
          texto: "Efluentes são as águas residuais da lavagem: contêm óleo, graxa, detergentes, partículas de sujeira e produtos químicos. Descartar isso direto na rede de esgoto ou no solo é crime ambiental. A solução é o tratamento adequado, começando pela caixa separadora de água e óleo (SAO) e, dependendo do volume, sistemas mais completos."
        },
        {
          titulo: "Caixa Separadora de Água e Óleo (SAO)",
          texto: "A caixa SAO é obrigatória para lava rápidos. Ela separa óleo e graxa da água por diferença de densidade. A água tratada pode ser descartada na rede de esgoto (com autorização) ou reutilizada. O óleo coletado deve ser destinado a empresas especializadas. Mantenha laudos de destinação para comprovar conformidade."
        },
        {
          titulo: "Reuso de Água: Economia e Sustentabilidade",
          texto: "Sistemas de reuso permitem reutilizar até 80% da água da lavagem. O investimento inicial se paga em economia na conta de água e em diferencial competitivo. Clientes cada vez mais valorizam negócios sustentáveis. O Lavify ajuda a documentar sua economia de água para marketing verde."
        }
      ],
      beneficios: [
        "Documentação de tratamento",
        "Controle de destinação de resíduos",
        "Métricas de consumo de água",
        "Relatórios de economia hídrica",
        "Comprovantes para fiscalização",
        "Diferencial de marketing verde"
      ]
    },
    "contrato-estetica-automotiva": {
      secoes: [
        {
          titulo: "Por que Contratos Protegem seu Negócio?",
          texto: "Sem contrato, qualquer arranhão vira discussão. 'Isso já estava aí' versus 'vocês fizeram isso'. O contrato de prestação de serviços estabelece responsabilidades: o que você fará, o que não é sua culpa, e como serão resolvidas disputas. É proteção jurídica básica que todo profissional sério deve ter."
        },
        {
          titulo: "Cláusulas Essenciais para Estética Automotiva",
          texto: "Um bom contrato deve incluir: descrição dos serviços, valores e formas de pagamento, prazo de entrega, vistoria de entrada documentada, limitação de responsabilidade por danos pré-existentes, e foro para resolução de conflitos. O Lavify integra o checklist de entrada ao sistema, gerando documentação automatizada."
        },
        {
          titulo: "Checklist Digital como Prova",
          texto: "O checklist de entrada com fotos é sua melhor proteção. Antes de começar qualquer serviço, registre o estado do veículo: arranhões, amassados, pertences deixados. Com o Lavify, isso fica salvo digitalmente com data e hora. Se o cliente reclamar de algo que já existia, você tem a prova."
        }
      ],
      beneficios: [
        "Modelo de contrato incluso",
        "Checklist digital de entrada",
        "Registro fotográfico de danos",
        "Data e hora de cada registro",
        "Histórico por cliente/veículo",
        "Proteção contra reclamações"
      ]
    },
    "checklist-entrada-veiculo-lava-jato": {
      secoes: [
        {
          titulo: "Vistoria de Entrada: Sua Proteção Diária",
          texto: "Todo veículo que entra no lava jato deve passar por vistoria. Arranhões, amassados, partes soltas, pertences no interior. Se você não registrar, qualquer problema vira sua responsabilidade. Com o checklist digital do Lavify, a vistoria leva segundos e fica salva automaticamente."
        },
        {
          titulo: "Como Funciona o Checklist Digital",
          texto: "Na abertura da OS, o sistema exibe o checklist: para-choque, capô, portas, vidros, retrovisores, interior. Você marca o que encontrou e pode adicionar fotos. Tudo fica vinculado à ordem de serviço. Se o cliente questionar depois, você acessa o registro em segundos."
        },
        {
          titulo: "Benefícios Além da Proteção Jurídica",
          texto: "O checklist também ajuda na operação: você sabe se o carro tem antena para ter cuidado, se tem câmera de ré que precisa de atenção, ou se o cliente deixou pertences valiosos. É profissionalismo que evita problemas e impressiona clientes."
        }
      ],
      beneficios: [
        "Checklist digital em segundos",
        "Registro fotográfico integrado",
        "Histórico por veículo",
        "Proteção contra reclamações",
        "Alerta de itens especiais",
        "Documento com data e hora"
      ]
    },
    // ═══════════════════════════════════════════════════════════════════
    // ESTÉTICA AUTOMOTIVA SUSTENTÁVEL
    // ═══════════════════════════════════════════════════════════════════
    "estetica-automotiva-sustentavel": {
      secoes: [
        {
          titulo: "O Mercado de Estética Automotiva Sustentável",
          texto: "Consumidores estão cada vez mais conscientes. Eles querem saber de onde vêm os produtos, se são biodegradáveis, se a empresa economiza água. Estética automotiva sustentável não é apenas tendência: é diferencial competitivo real. Você atrai um público premium que paga mais por serviços alinhados com seus valores."
        },
        {
          titulo: "Métricas de Sustentabilidade no Sistema",
          texto: "O Lavify permite registrar e exibir suas métricas verdes: litros de água economizados, produtos biodegradáveis utilizados, resíduos corretamente destinados. Você pode usar esses números no marketing, nas redes sociais, e até em certificações ambientais."
        },
        {
          titulo: "Certificações e Selos Verdes",
          texto: "Algumas certificações ambientais exigem documentação de práticas sustentáveis. O Lavify gera relatórios que comprovam sua operação verde: consumo de água, produtos utilizados, tratamento de efluentes. É a base documental que você precisa para conquistar selos que diferenciam seu negócio."
        }
      ],
      beneficios: [
        "Métricas de economia de água",
        "Controle de produtos biodegradáveis",
        "Relatórios de sustentabilidade",
        "Dados para marketing verde",
        "Documentação para certificações",
        "Diferencial competitivo premium"
      ]
    },
    "sistema-lavagem-seco-automotiva": {
      secoes: [
        {
          titulo: "Lavagem a Seco: O Futuro da Estética Automotiva",
          texto: "Lavagem a seco usa produtos especiais que dispensam água corrente. É ideal para ambientes sem encanamento, condomínios, escritórios e eventos. O custo por lavagem é maior, mas o ticket médio também. É um nicho premium que cresce rapidamente, especialmente em grandes cidades."
        },
        {
          titulo: "Controle de Produtos Especiais",
          texto: "Produtos para lavagem a seco são mais caros e específicos. O Lavify controla o estoque com precisão, calcula custo real por serviço e alerta quando precisa repor. Você sabe exatamente sua margem em cada lavagem a seco realizada."
        },
        {
          titulo: "Atendimento em Domicílio e Corporativo",
          texto: "Lavagem a seco é perfeita para ir até o cliente: em casa, no trabalho, no shopping. O sistema permite agendar atendimentos externos, registrar localização e gerar rotas otimizadas. Você oferece conveniência total e cobra por isso."
        }
      ],
      beneficios: [
        "Gestão de produtos dry wash",
        "Custo preciso por lavagem",
        "Agendamento de atendimentos externos",
        "Controle de estoque específico",
        "Serviços premium com margem maior",
        "Operação em qualquer local"
      ]
    },
    "lavagem-sem-efluentes-sistema": {
      secoes: [
        {
          titulo: "Zero Efluentes: Máxima Conformidade Ambiental",
          texto: "Lavagem sem efluentes significa que nada é descartado no meio ambiente. Isso é possível com tecnologias de lavagem a seco, sistemas de reuso total de água, ou métodos de captura e tratamento completo. É o padrão ouro de sustentabilidade, exigido em alguns locais e valorizado em todos."
        },
        {
          titulo: "Tecnologias para Zero Efluentes",
          texto: "As principais são: lavagem a seco com produtos encapsuladores, sistemas de reuso com filtragem avançada, e lavagem com vapor (steam cleaning). Cada uma tem custos e aplicações diferentes. O Lavify se adapta a qualquer modelo, controlando os insumos específicos de cada tecnologia."
        },
        {
          titulo: "Documentação para Fiscalização",
          texto: "Operar sem efluentes é um diferencial, mas você precisa provar. O Lavify gera relatórios que demonstram sua operação limpa: nenhum descarte, todos os resíduos destinados corretamente, métricas de consumo. É a documentação que fiscalizadores e clientes conscientes querem ver."
        }
      ],
      beneficios: [
        "Operação sem descarte ambiental",
        "Conformidade máxima documentada",
        "Métricas de sustentabilidade",
        "Relatórios para fiscalização",
        "Marketing verde comprovado",
        "Adaptação a qualquer tecnologia"
      ]
    },
    "detalhamento-automotivo-premium": {
      secoes: [
        {
          titulo: "Gestão para Detalhamento de Alto Padrão",
          texto: "Detalhamento premium envolve serviços de alta complexidade: correção de pintura, vitrificação, aplicação de PPF, higienização de couro, tratamento de rodas. Cada serviço tem produtos específicos, tempo de execução maior e preço elevado. Você precisa de gestão à altura do seu padrão de serviço."
        },
        {
          titulo: "Controle de Produtos Importados e Especiais",
          texto: "Produtos de detalhamento premium frequentemente são importados e caros: polidores, ceras, cerâmicas, selantes. O Lavify controla cada ml utilizado, calcula custo real por serviço e evita desperdício. Você garante margem saudável mesmo com insumos de alto valor."
        },
        {
          titulo: "Gestão de Clientes VIP",
          texto: "Clientes de detalhamento premium têm expectativas altas. Eles querem acompanhar o serviço, receber fotos do progresso, ter histórico detalhado do veículo. O Lavify permite esse nível de atendimento: comunicação pelo WhatsApp, galeria de fotos por OS, e CRM completo do cliente VIP."
        }
      ],
      beneficios: [
        "Serviços de alta complexidade",
        "Controle de produtos premium",
        "Custo preciso por serviço",
        "Comunicação VIP com cliente",
        "Galeria de fotos por OS",
        "CRM para clientes premium"
      ]
    },
  };

  // Conteúdo padrão para páginas não mapeadas
  const conteudoPadrao = {
    secoes: [
      {
        titulo: `${pagina.h1}: A Solução Completa`,
        texto: "O Lavify é o sistema de gestão mais completo para lava rápidos. Desenvolvido especialmente para o mercado brasileiro, entende as necessidades do dono de lava jato que quer profissionalizar seu negócio sem complicação. Tudo funciona no celular e no computador, sem precisar instalar nada."
      },
      {
        titulo: "Funcionalidades que Fazem a Diferença",
        texto: "Kanban visual do pátio, agendamento online 24h, WhatsApp automático, controle de estoque com alertas, gestão financeira completa e controle de equipe. Tudo integrado em uma interface simples que sua equipe aprende em minutos. É tecnologia de ponta com a simplicidade que seu dia a dia exige."
      },
      {
        titulo: "Teste Grátis por 7 Dias",
        texto: "Não precisa pagar nada para testar. Cadastre-se em 2 minutos, sem cartão de crédito, e use todas as funcionalidades por 7 dias. Se gostar, escolhe o plano que cabe no seu bolso. Se não gostar, sem problema. Você não tem nada a perder."
      }
    ],
    beneficios: [
      "Kanban visual do pátio",
      "Agendamento online 24h",
      "WhatsApp automático",
      "Controle de estoque",
      "Gestão financeira",
      "100% online, sem instalação"
    ]
  };

  return conteudos[pagina.slug] || conteudoPadrao;
}

export default async function PaginaSEO({ params }: PageProps) {
  const { slug } = await params;
  const pagina = getPaginaSEOBySlug(slug);

  if (!pagina) {
    notFound();
  }

  const conteudo = getConteudoPorTipo(pagina);
  const paginasRelacionadas = getPaginasRelacionadas(slug, 4);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

  // JSON-LD Schema - SoftwareApplication
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lavify",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: pagina.descricaoMeta,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "199.90",
      priceCurrency: "BRL",
      description: "Teste grátis por 7 dias"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1847",
      bestRating: "5",
      worstRating: "1"
    },
  };

  // Breadcrumb Schema - Navegação estruturada
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Para Empresas",
        item: `${baseUrl}/para-empresas`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: pagina.h1.split(":")[0],
        item: `${baseUrl}/${pagina.slug}`
      }
    ]
  };

  // Article Schema - Para páginas de conteúdo/guias
  const articleLd = pagina.tipo === "guia" ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pagina.h1,
    description: pagina.descricaoMeta,
    author: {
      "@type": "Organization",
      name: "Lavify"
    },
    publisher: {
      "@type": "Organization",
      name: "Lavify",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/icon.svg`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/${pagina.slug}`
    },
    datePublished: "2026-01-01",
    dateModified: new Date().toISOString().split("T")[0]
  } : null;

  // HowTo Schema - Para páginas do tipo "problema" (como fazer)
  const howToLd = pagina.tipo === "problema" && pagina.slug.startsWith("como-") ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: pagina.h1,
    description: pagina.descricaoMeta,
    totalTime: "PT10M",
    tool: [
      {
        "@type": "HowToTool",
        name: "Sistema Lavify"
      },
      {
        "@type": "HowToTool",
        name: "Navegador de internet"
      }
    ],
    step: conteudo.secoes.map((secao, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: secao.titulo,
      text: secao.texto
    }))
  } : null;

  // FAQ Schema
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O sistema é realmente grátis para testar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! Você pode testar o Lavify por 7 dias gratuitamente, sem precisar de cartão de crédito. Todas as funcionalidades ficam liberadas durante o teste."
        }
      },
      {
        "@type": "Question",
        name: "Preciso instalar algum programa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Não! O Lavify funciona 100% online. Você acessa pelo navegador do celular ou computador. Não precisa baixar nem instalar nada."
        }
      },
      {
        "@type": "Question",
        name: "Funciona em qualquer celular?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! O Lavify funciona em qualquer celular com acesso à internet, seja Android ou iPhone. Basta abrir o navegador e acessar."
        }
      },
      {
        "@type": "Question",
        name: "Quanto custa o sistema para lava jato?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O Lavify tem plano gratuito para sempre e planos pagos a partir de R$49,90/mês. Você pode testar grátis por 7 dias antes de escolher."
        }
      },
      {
        "@type": "Question",
        name: "O sistema funciona para lava jato pequeno?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim! O Lavify foi pensado para atender desde lava rápidos com 1 funcionário até grandes operações com múltiplas unidades."
        }
      }
    ]
  };

  const estatisticas = [
    { valor: "-50%", label: "Tempo em gestão" },
    { valor: "+30%", label: "Aumento no faturamento" },
    { valor: "24h", label: "Agendamentos online" },
    { valor: "100%", label: "Controle pelo celular" },
  ];

  const funcionalidades = [
    { icon: LayoutDashboard, titulo: "Dashboard", descricao: "Faturamento em tempo real" },
    { icon: Calendar, titulo: "Agendamento", descricao: "Clientes agendam 24h" },
    { icon: MessageCircle, titulo: "WhatsApp", descricao: "Aviso automático" },
    { icon: Package, titulo: "Estoque", descricao: "Alertas de reposição" },
    { icon: Users, titulo: "Equipe", descricao: "Controle de acesso" },
    { icon: TrendingUp, titulo: "Relatórios", descricao: "Métricas do negócio" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      {articleLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
      )}
      {howToLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      )}

      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Lavify</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/entrar" className="text-white/70 hover:text-white font-medium hidden sm:block">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all text-sm"
            >
              Testar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-sm text-white/50">
        <Link href="/" className="hover:text-white/70">Home</Link>
        <ChevronRight className="inline-block w-3 h-3 mx-2" />
        <Link href="/para-empresas" className="hover:text-white/70">Para Empresas</Link>
        <ChevronRight className="inline-block w-3 h-3 mx-2" />
        <span className="text-white/70">{pagina.h1.split(":")[0]}</span>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Sistema de Gestão para Lava Rápido
          </div>

          {/* H1 */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {pagina.h1}
          </h1>

          {/* Descrição */}
          <p className="text-lg md:text-xl text-white/60 mb-8 max-w-3xl mx-auto">
            {pagina.descricaoMeta}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-emerald-500/30 transition-all text-lg"
            >
              ⚡ Testar Grátis Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/para-empresas"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all text-lg"
            >
              <Play className="w-5 h-5" />
              Ver Como Funciona
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              7 dias grátis
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Sem cartão de crédito
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Começa em 2 minutos
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {estatisticas.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                  {stat.valor}
                </p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          {conteudo.secoes.map((secao, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {secao.titulo}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                {secao.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            O que Você Ganha com o Lavify
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {conteudo.beneficios.map((beneficio, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl"
              >
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <span className="text-white/90">{beneficio}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Todas as Funcionalidades em Um Só Sistema
          </h2>
          <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">
            Tudo que seu lava rápido precisa para funcionar de forma profissional
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {funcionalidades.map((func, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <func.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="font-semibold text-lg mb-1">{func.titulo}</h3>
                <p className="text-white/60 text-sm">{func.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gradient-to-br from-cyan-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-xl md:text-2xl font-medium mb-2">
            "Finalmente um sistema que entende o lava jato brasileiro"
          </p>
          <p className="text-white/80">
            + de 1.800 lava rápidos já usam o Lavify
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            <details className="group bg-white/5 border border-white/10 rounded-xl p-5">
              <summary className="flex justify-between items-center font-semibold cursor-pointer list-none">
                O sistema é realmente grátis para testar?
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-open:rotate-90" />
              </summary>
              <p className="text-white/70 mt-4">
                Sim! Você pode testar o Lavify por 7 dias gratuitamente, sem precisar de cartão de crédito. Todas as funcionalidades ficam liberadas durante o teste.
              </p>
            </details>
            <details className="group bg-white/5 border border-white/10 rounded-xl p-5">
              <summary className="flex justify-between items-center font-semibold cursor-pointer list-none">
                Preciso instalar algum programa?
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-open:rotate-90" />
              </summary>
              <p className="text-white/70 mt-4">
                Não! O Lavify funciona 100% online. Você acessa pelo navegador do celular ou computador. Não precisa baixar nem instalar nada.
              </p>
            </details>
            <details className="group bg-white/5 border border-white/10 rounded-xl p-5">
              <summary className="flex justify-between items-center font-semibold cursor-pointer list-none">
                Funciona em qualquer celular?
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-open:rotate-90" />
              </summary>
              <p className="text-white/70 mt-4">
                Sim! O Lavify funciona em qualquer celular com acesso à internet, seja Android ou iPhone. Basta abrir o navegador e acessar.
              </p>
            </details>
            <details className="group bg-white/5 border border-white/10 rounded-xl p-5">
              <summary className="flex justify-between items-center font-semibold cursor-pointer list-none">
                Quanto custa após o período de teste?
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-open:rotate-90" />
              </summary>
              <p className="text-white/70 mt-4">
                Os planos começam em R$49,90/mês. Você escolhe o plano que melhor se adapta ao tamanho do seu lava jato. Tem plano desde o pequeno até o grande.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Páginas Relacionadas - Internal Linking */}
      {paginasRelacionadas.length > 0 && (
        <section className="py-16 bg-slate-800/30">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Conteúdo Relacionado
            </h2>
            <p className="text-white/60 text-center mb-10 max-w-2xl mx-auto">
              Explore mais artigos sobre gestão de lava rápido
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {paginasRelacionadas.map((paginaRel) => (
                <Link
                  key={paginaRel.slug}
                  href={`/${paginaRel.slug}`}
                  className="group p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                >
                  <span className="inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded bg-cyan-500/20 text-cyan-400 mb-3">
                    {paginaRel.tipo}
                  </span>
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
                    {paginaRel.h1.split(":")[0]}
                  </h3>
                  <p className="text-white/50 text-sm line-clamp-2">
                    {paginaRel.descricaoMeta.substring(0, 80)}...
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-cyan-400 text-sm font-medium">
                    Ler mais
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-emerald-600 to-green-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Profissionalizar seu Lava Rápido?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Teste grátis por 7 dias. Sem cartão, sem compromisso.
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:shadow-2xl transition-all text-lg"
          >
            Começar Agora Grátis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">Lavify</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-6 text-sm text-white/60">
              <Link href="/para-empresas" className="hover:text-white">Para Empresas</Link>
              <Link href="/encontrar" className="hover:text-white">Encontrar Lava Jato</Link>
              <Link href="/entrar" className="hover:text-white">Entrar</Link>
              <Link href="/cadastro" className="hover:text-white">Cadastrar</Link>
            </nav>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/40 text-sm">
            © 2026 Lavify. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

