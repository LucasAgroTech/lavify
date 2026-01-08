import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
}

const variantClasses = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-cyan-100 text-cyan-700",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
    >
      {children}
    </span>
  );
}

// Badge específico para status da OS
const statusConfig = {
  AGUARDANDO: { label: "Aguardando", variant: "warning" as const },
  LAVANDO: { label: "Lavando", variant: "info" as const },
  FINALIZANDO: { label: "Finalizando", variant: "info" as const },
  PRONTO: { label: "Pronto", variant: "success" as const },
  ENTREGUE: { label: "Entregue", variant: "default" as const },
};

export function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status] || statusConfig.AGUARDANDO;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

