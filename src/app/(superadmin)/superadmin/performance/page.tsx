"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Server,
  Database,
  Users,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Loader2,
  TrendingUp,
  HardDrive,
  Zap,
  BarChart3,
  Clock,
  Car,
} from "lucide-react";

interface PerformanceData {
  timestamp: string;
  memory: {
    current: {
      heapUsed: number;
      heapTotal: number;
      rss: number;
      external: number;
    };
    quota: number;
    available: number;
    usagePercent: number;
  };
  database: {
    connectionPool: number;
    lavaJatos: { total: number; ativos: number };
    usuarios: number;
    clientes: number;
    ordens: { hoje: number; ultimos7Dias: number; mediaDiaria: number };
  };
  capacity: {
    estimatedConcurrentUsers: number;
    estimatedLavaJatosSimultaneos: number;
    dynoRecommendation: string;
  };
  performance: {
    uptime: string;
    metricsCollected: number;
    topMemoryFunctions: Array<{
      name: string;
      avgMemory: number;
      avgDuration: number;
      count: number;
    }>;
    highMemoryAlerts: Array<{
      name: string;
      count: number;
      avgMemory: number;
    }>;
  };
  alerts: string[];
  recommendations: string[];
}

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/superadmin/performance");
      if (!res.ok) throw new Error("Erro ao carregar dados");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 10000); // 10 segundos
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getMemoryColor = (percent: number) => {
    if (percent < 50) return "text-green-400";
    if (percent < 75) return "text-yellow-400";
    return "text-red-400";
  };

  const getMemoryBgColor = (percent: number) => {
    if (percent < 50) return "bg-green-500";
    if (percent < 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white">{error || "Erro ao carregar dados"}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Performance & Capacidade</h1>
              <p className="text-slate-400 text-sm">
                Monitoramento em tempo real do sistema
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh (10s)
            </label>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </button>
          </div>
        </div>

        {/* Alertas */}
        {data.alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {data.alerts.map((alert, i) => (
              <div
                key={i}
                className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                {alert}
              </div>
            ))}
          </div>
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Memória */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-cyan-400" />
                <span className="text-slate-400 text-sm">Memória RAM</span>
              </div>
              <span className={`text-2xl font-bold ${getMemoryColor(data.memory.usagePercent)}`}>
                {data.memory.usagePercent}%
              </span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full ${getMemoryBgColor(data.memory.usagePercent)} transition-all`}
                style={{ width: `${data.memory.usagePercent}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Em uso:</span>
                <span className="text-white ml-1">{data.memory.current.rss.toFixed(0)} MB</span>
              </div>
              <div>
                <span className="text-slate-500">Quota:</span>
                <span className="text-white ml-1">{data.memory.quota} MB</span>
              </div>
              <div>
                <span className="text-slate-500">Heap:</span>
                <span className="text-white ml-1">{data.memory.current.heapUsed.toFixed(0)} MB</span>
              </div>
              <div>
                <span className="text-slate-500">Livre:</span>
                <span className="text-green-400 ml-1">{data.memory.available.toFixed(0)} MB</span>
              </div>
            </div>
          </div>

          {/* Capacidade Estimada */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-violet-400" />
              <span className="text-slate-400 text-sm">Capacidade Estimada</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {data.capacity.estimatedConcurrentUsers}
            </div>
            <p className="text-slate-500 text-sm mb-3">usuários simultâneos</p>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Lava-Jatos simultâneos:</span>
                <span className="text-white">{data.capacity.estimatedLavaJatosSimultaneos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dyno recomendado:</span>
                <span className="text-cyan-400">{data.capacity.dynoRecommendation}</span>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400 text-sm">Banco de Dados</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Lava-Jatos</span>
                <span className="text-white font-semibold">
                  {data.database.lavaJatos.ativos}/{data.database.lavaJatos.total}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Usuários</span>
                <span className="text-white font-semibold">{data.database.usuarios}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Clientes</span>
                <span className="text-white font-semibold">{data.database.clientes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Connection Pool</span>
                <span className="text-cyan-400 font-semibold">{data.database.connectionPool}</span>
              </div>
            </div>
          </div>

          {/* Ordens */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Ordens de Serviço</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {data.database.ordens.hoje}
            </div>
            <p className="text-slate-500 text-sm mb-3">ordens hoje</p>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Últimos 7 dias:</span>
                <span className="text-white">{data.database.ordens.ultimos7Dias}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Média diária:</span>
                <span className="text-emerald-400">{data.database.ordens.mediaDiaria}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Detalhada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Uptime e Status */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Status do Sistema</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-500 text-xs mb-1">Uptime</p>
                <p className="text-xl font-bold text-white">{data.performance.uptime}</p>
              </div>
              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-500 text-xs mb-1">Métricas coletadas</p>
                <p className="text-xl font-bold text-white">{data.performance.metricsCollected}</p>
              </div>
              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-500 text-xs mb-1">Última atualização</p>
                <p className="text-sm text-white">
                  {new Date(data.timestamp).toLocaleTimeString("pt-BR")}
                </p>
              </div>
              <div className="bg-slate-900 rounded-xl p-4">
                <p className="text-slate-500 text-xs mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 text-sm font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Funções com alto uso de memória */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Funções por Uso de Memória</h2>
            </div>
            {data.performance.topMemoryFunctions.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma métrica coletada ainda.</p>
                <p className="text-xs mt-1">As métricas aparecerão conforme o sistema for usado.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.performance.topMemoryFunctions.map((fn, i) => (
                  <div key={fn.name} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs text-slate-400">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white truncate max-w-[200px]">
                          {fn.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {fn.avgMemory.toFixed(2)} MB
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 rounded-full mt-1">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{
                            width: `${Math.min((fn.avgMemory / 10) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recomendações */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Recomendações</h2>
          </div>
          <div className="space-y-2">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-slate-900 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guia de Capacidade */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            📊 Guia de Capacidade por Plano Heroku
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Plano</th>
                  <th className="text-center py-3 px-4 text-slate-400">Memória</th>
                  <th className="text-center py-3 px-4 text-slate-400">Usuários Sim.</th>
                  <th className="text-center py-3 px-4 text-slate-400">Lava-Jatos</th>
                  <th className="text-center py-3 px-4 text-slate-400">Connection Pool</th>
                  <th className="text-right py-3 px-4 text-slate-400">Preço/mês</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className={`border-b border-slate-700/50 ${data.memory.quota === 512 ? "bg-cyan-500/10" : ""}`}>
                  <td className="py-3 px-4 font-medium">
                    Basic {data.memory.quota === 512 && <span className="text-cyan-400">(Atual)</span>}
                  </td>
                  <td className="text-center py-3 px-4">512 MB</td>
                  <td className="text-center py-3 px-4">50-100</td>
                  <td className="text-center py-3 px-4">15-30</td>
                  <td className="text-center py-3 px-4">5</td>
                  <td className="text-right py-3 px-4">$7</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">Standard-1X</td>
                  <td className="text-center py-3 px-4">512 MB</td>
                  <td className="text-center py-3 px-4">100-200</td>
                  <td className="text-center py-3 px-4">30-60</td>
                  <td className="text-center py-3 px-4">10</td>
                  <td className="text-right py-3 px-4">$25</td>
                </tr>
                <tr className="border-b border-slate-700/50">
                  <td className="py-3 px-4 font-medium">Standard-2X</td>
                  <td className="text-center py-3 px-4">1 GB</td>
                  <td className="text-center py-3 px-4">200-400</td>
                  <td className="text-center py-3 px-4">60-120</td>
                  <td className="text-center py-3 px-4">15</td>
                  <td className="text-right py-3 px-4">$50</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium">Performance-M</td>
                  <td className="text-center py-3 px-4">2.5 GB</td>
                  <td className="text-center py-3 px-4">500-1000</td>
                  <td className="text-center py-3 px-4">150-300</td>
                  <td className="text-center py-3 px-4">20</td>
                  <td className="text-right py-3 px-4">$250</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

