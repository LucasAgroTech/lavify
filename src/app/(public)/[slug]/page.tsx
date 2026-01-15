import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  getPaginaSEOBySlug,
  getAllPaginaSEOSlugs,
  PaginaSEO,
} from "@/lib/seo-keywords";
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
  params: {
    slug: string;
  };
}

// Gera as páginas estaticamente no build
export async function generateStaticParams() {
  const slugs = getAllPaginaSEOSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Gera metadados dinâmicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pagina = getPaginaSEOBySlug(params.slug);

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

export default function PaginaSEO({ params }: PageProps) {
  const pagina = getPaginaSEOBySlug(params.slug);

  if (!pagina) {
    notFound();
  }

  const conteudo = getConteudoPorTipo(pagina);

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Lavify",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: pagina.descricaoMeta,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      description: "Teste grátis por 7 dias"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1847",
    },
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

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

