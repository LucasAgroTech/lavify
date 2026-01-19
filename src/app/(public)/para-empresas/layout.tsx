import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lavify - Sistema para Lava-Rápido Completo",
  description:
    "Transforme seu lava-rápido em um negócio profissional. Gestão de pátio, estoque inteligente, financeiro integrado e fidelidade automática. Comece grátis!",
  keywords: [
    "sistema lava rapido",
    "gestão lava jato",
    "software lava rápido",
    "controle estoque lava jato",
    "sistema para lava rapido",
    "gestão de lava jato",
    "programa lava rápido",
    "app lava jato",
  ],
  openGraph: {
    title: "Lavify - Sistema de Gestão para Lava-Rápidos",
    description:
      "Chega de planilha e estoque acabando. Gerencie pátio, estoque e financeiro em um único sistema.",
    type: "website",
  },
  other: {
    // Preload para LCP mobile
    "link-preload-poster": "/hero-mobile-poster.jpg",
  },
};

export default function ParaEmpresasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout limpo sem header/footer do cliente - a página tem seus próprios
  return (
    <>
      {/* Preload para recursos críticos do LCP */}
      <link
        rel="preload"
        href="/hero-mobile-poster.jpg"
        as="image"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/hero-1.webp"
        as="image"
        fetchPriority="high"
      />
      {/* Preconnect para Vimeo (carrega quando clicar no vídeo) */}
      <link rel="preconnect" href="https://player.vimeo.com" />
      <link rel="preconnect" href="https://i.vimeocdn.com" />
      {children}
    </>
  );
}

