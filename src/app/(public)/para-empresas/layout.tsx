import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Para Empresas - Sistema de Gestão para Lava-Rápidos | Lavify",
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
};

export default function ParaEmpresasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout limpo sem header/footer do cliente - a página tem seus próprios
  return <>{children}</>;
}

