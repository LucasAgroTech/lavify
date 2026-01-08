import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import LavaJatoClient from "./LavaJatoClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Gera metadata dinâmica para SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { slug },
      select: {
        nome: true,
        endereco: true,
        servicos: {
          where: { ativo: true },
          select: { nome: true, preco: true },
          take: 5,
        },
      },
    });

    if (!lavaJato) {
      return {
        title: "Lava Jato não encontrado",
        description: "O lava jato que você está procurando não foi encontrado.",
      };
    }

    const servicosTexto = lavaJato.servicos.map((s) => s.nome).join(", ");
    const precoMinimo = Math.min(...lavaJato.servicos.map((s) => s.preco));
    const precoMaximo = Math.max(...lavaJato.servicos.map((s) => s.preco));

    return {
      title: `${lavaJato.nome} - Agende sua Lavagem`,
      description: `Agende sua lavagem no ${lavaJato.nome}${lavaJato.endereco ? ` em ${lavaJato.endereco}` : ""}. Serviços: ${servicosTexto}. Preços a partir de R$ ${precoMinimo.toFixed(2)}.`,
      keywords: [
        lavaJato.nome,
        "lava jato",
        "lavagem de carro",
        "agendamento",
        ...(lavaJato.endereco ? [lavaJato.endereco] : []),
        ...lavaJato.servicos.map((s) => s.nome),
      ],
      openGraph: {
        title: `${lavaJato.nome} - Agende sua Lavagem | Lavify`,
        description: `Agende sua lavagem no ${lavaJato.nome}. Serviços a partir de R$ ${precoMinimo.toFixed(2)}. Rápido e fácil!`,
        type: "website",
        url: `/lavajato/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${lavaJato.nome} | Lavify`,
        description: `Agende sua lavagem no ${lavaJato.nome}. Preços: R$ ${precoMinimo.toFixed(2)} - R$ ${precoMaximo.toFixed(2)}`,
      },
      alternates: {
        canonical: `/lavajato/${slug}`,
      },
    };
  } catch (error) {
    console.error("Erro ao gerar metadata:", error);
    return {
      title: "Lava Jato | Lavify",
      description: "Encontre os melhores lava jatos perto de você.",
    };
  }
}

// JSON-LD para LocalBusiness
async function getJsonLd(slug: string) {
  try {
    const lavaJato = await prisma.lavaJato.findUnique({
      where: { slug },
      include: {
        servicos: { where: { ativo: true } },
      },
    });

    if (!lavaJato) return null;

    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `https://www.lavify.com.br/lavajato/${slug}`,
      name: lavaJato.nome,
      description: `Lava jato com serviços de lavagem automotiva`,
      url: `https://www.lavify.com.br/lavajato/${slug}`,
      telephone: lavaJato.telefone,
      address: lavaJato.endereco
        ? {
            "@type": "PostalAddress",
            streetAddress: lavaJato.endereco,
            addressCountry: "BR",
          }
        : undefined,
      priceRange: "$$",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Serviços de Lavagem",
        itemListElement: lavaJato.servicos.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.nome,
            description: s.descricao || s.nome,
          },
          price: s.preco,
          priceCurrency: "BRL",
        })),
      },
    };
  } catch {
    return null;
  }
}

export default async function LavaJatoPage({ params }: Props) {
  const { slug } = await params;
  const jsonLd = await getJsonLd(slug);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <LavaJatoClient slug={slug} />
    </>
  );
}
