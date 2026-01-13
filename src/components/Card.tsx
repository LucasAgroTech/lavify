import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function Card({
  children,
  className = "",
  title,
  icon,
  action,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-slate-200 transition-all duration-300 ${className}`}
    >
      {(title || icon || action) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="font-bold text-lg text-slate-800">{title}</h3>
            )}
          </div>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: "cyan" | "green" | "amber" | "red" | "purple";
  subtitle?: string;
}

const colorVariants = {
  cyan: "from-cyan-500 to-blue-600 shadow-cyan-500/30",
  green: "from-emerald-500 to-green-600 shadow-emerald-500/30",
  amber: "from-amber-500 to-orange-600 shadow-amber-500/30",
  red: "from-red-500 to-rose-600 shadow-red-500/30",
  purple: "from-purple-500 to-violet-600 shadow-purple-500/30",
};

const bgColorVariants = {
  cyan: "bg-cyan-50/50",
  green: "bg-emerald-50/50",
  amber: "bg-amber-50/50",
  red: "bg-red-50/50",
  purple: "bg-purple-50/50",
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = "cyan",
  subtitle,
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 group ${bgColorVariants[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-slate-800 mt-3 group-hover:text-slate-900 transition-colors">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-full text-sm font-medium ${
              trend.positive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorVariants[color]} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

