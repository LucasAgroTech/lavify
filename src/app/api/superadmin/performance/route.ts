import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getPerformanceReport, getMemoryUsage } from "@/lib/performance-monitor";

// Verificar autenticação de superadmin
async function verificarSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("superadmin_token")?.value;

  if (!token) return null;

  const sessao = await prisma.sessaoSuperAdmin.findUnique({
    where: { token },
    include: { superAdmin: true },
  });

  if (!sessao || sessao.expiresAt < new Date()) return null;

  return sessao.superAdmin;
}

export async function GET() {
  try {
    const superAdmin = await verificarSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Dados do sistema
    const memory = getMemoryUsage();
    const report = getPerformanceReport();

    // Contagens do banco
    const [
      totalLavaJatos,
      lavaJatosAtivos,
      totalUsuarios,
      totalClientes,
      ordensHoje,
      ordensUltimos7Dias,
    ] = await Promise.all([
      prisma.lavaJato.count(),
      prisma.lavaJato.count({ where: { ativo: true } }),
      prisma.usuario.count(),
      prisma.cliente.count(),
      prisma.ordemServico.count({
        where: {
          dataEntrada: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.ordemServico.count({
        where: {
          dataEntrada: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // Estimativas de capacidade
    const memoryAvailable = 512 - memory.rss; // Quota - uso atual
    const estimatedConcurrentUsers = Math.floor(memoryAvailable / 3); // ~3MB por usuário ativo
    const connectionPoolUsage = 5; // Configurado

    // Alertas
    const alerts: string[] = [];

    if (memory.rss > 400) {
      alerts.push("⚠️ Memória alta (>400MB). Considere upgrade do dyno.");
    }

    if (memory.heapUsed > memory.heapTotal * 0.9) {
      alerts.push("⚠️ Heap quase cheio. Possível memory leak.");
    }

    if (report.highMemoryAlerts.length > 0) {
      alerts.push(
        `🔍 ${report.highMemoryAlerts.length} função(ões) com alto uso de memória detectadas.`
      );
    }

    // Recomendações
    const recommendations: string[] = [];

    if (totalLavaJatos > 50 && connectionPoolUsage <= 5) {
      recommendations.push(
        "Considere aumentar PRISMA_CONNECTION_LIMIT para 10."
      );
    }

    if (ordensUltimos7Dias / 7 > 100) {
      recommendations.push(
        "Volume alto de OS. Considere cache de consultas frequentes."
      );
    }

    if (memory.rss < 200) {
      recommendations.push(
        "✅ Uso de memória saudável. Sistema estável."
      );
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      memory: {
        current: memory,
        quota: 512,
        available: memoryAvailable,
        usagePercent: Math.round((memory.rss / 512) * 100),
      },
      database: {
        connectionPool: connectionPoolUsage,
        lavaJatos: {
          total: totalLavaJatos,
          ativos: lavaJatosAtivos,
        },
        usuarios: totalUsuarios,
        clientes: totalClientes,
        ordens: {
          hoje: ordensHoje,
          ultimos7Dias: ordensUltimos7Dias,
          mediaDiaria: Math.round(ordensUltimos7Dias / 7),
        },
      },
      capacity: {
        estimatedConcurrentUsers,
        estimatedLavaJatosSimultaneos: Math.floor(estimatedConcurrentUsers / 3),
        dynoRecommendation:
          memory.rss > 350
            ? "Standard-1X (1GB)"
            : memory.rss > 200
            ? "Basic (512MB) - Atual"
            : "Eco (512MB)",
      },
      performance: {
        uptime: `${Math.floor(report.uptime / 3600)}h ${Math.floor((report.uptime % 3600) / 60)}m`,
        metricsCollected: report.totalMetrics,
        topMemoryFunctions: report.functionStats.slice(0, 5),
        highMemoryAlerts: report.highMemoryAlerts,
      },
      alerts,
      recommendations,
    });
  } catch (error) {
    console.error("Erro ao obter métricas de performance:", error);
    return NextResponse.json(
      { error: "Erro ao obter métricas" },
      { status: 500 }
    );
  }
}

