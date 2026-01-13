import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lavify.com.br";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#06b6d4" },
    { media: "(prefers-color-scheme: dark)", color: "#0891b2" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lavify - Encontre o Melhor Lava Jato Perto de Você",
    template: "%s | Lavify",
  },
  description:
    "Encontre e agende lavagens no melhor lava jato da sua região. Compare preços, veja avaliações e receba seu carro brilhando. Rápido, fácil e seguro!",
  keywords: [
    "lava jato",
    "lavagem de carro",
    "lava rápido",
    "higienização veicular",
    "polimento automotivo",
    "lavagem a seco",
    "agendamento lava jato",
    "lava jato perto de mim",
    "lavagem completa",
    "estética automotiva",
  ],
  authors: [{ name: "Lavify" }],
  creator: "Lavify",
  publisher: "Lavify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Lavify",
    title: "Lavify - Encontre o Melhor Lava Jato Perto de Você",
    description:
      "Encontre e agende lavagens no melhor lava jato da sua região. Compare preços, veja avaliações e receba seu carro brilhando!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lavify - Seu carro brilhando em minutos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lavify - Encontre o Melhor Lava Jato Perto de Você",
    description:
      "Encontre e agende lavagens no melhor lava jato da sua região. Rápido, fácil e seguro!",
    images: ["/og-image.png"],
    creator: "@lavaborelive",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lavify",
  description:
    "Plataforma para encontrar e agendar serviços de lava jato. Compare preços, veja avaliações e agende online.",
  url: siteUrl,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-slate-50`}
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
