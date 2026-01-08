import { Metadata } from "next";
import PublicLayoutClient from "./PublicLayoutClient";

export const metadata: Metadata = {
  title: "Lavify - Encontre o Melhor Lava Jato Perto de Você",
  description:
    "Encontre e agende lavagens no melhor lava jato da sua região. Compare preços, veja avaliações e receba seu carro brilhando. Rápido, fácil e seguro!",
  keywords: [
    "lava jato",
    "lavagem de carro",
    "lava rápido",
    "agendamento lava jato",
    "lava jato perto de mim",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicLayoutClient>{children}</PublicLayoutClient>;
}
