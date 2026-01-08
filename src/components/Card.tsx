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
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}
    >
      {(title || icon || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                {icon}
              </div>
            )}
            {title && (
              <h3 className="font-semibold text-slate-800">{title}</h3>
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
}

const colorVariants = {
  cyan: "from-cyan-500 to-blue-600 shadow-cyan-500/30",
  green: "from-emerald-500 to-green-600 shadow-emerald-500/30",
  amber: "from-amber-500 to-orange-600 shadow-amber-500/30",
  red: "from-red-500 to-rose-600 shadow-red-500/30",
  purple: "from-purple-500 to-violet-600 shadow-purple-500/30",
};

export function StatCard({
  title,
  value,
  icon,
  trend,
  color = "cyan",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.positive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorVariants[color]} flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

