"use client";

import { useState, useEffect } from "react";
import { Droplets, Bell, X, Calendar, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

interface Notification {
  id: string;
  type: "agendamento";
  title: string;
  message: string;
  time: string;
  unread: boolean;
  href?: string;
}

interface MobileHeaderProps {
  lavaJatoNome?: string;
  corPrimaria?: string;
  userName?: string;
}

export function MobileHeader({ lavaJatoNome, corPrimaria, userName }: MobileHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar agendamentos pendentes
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/agendamentos?status=PENDENTE");
        if (res.ok) {
          const agendamentos = await res.json();
          
          // Transformar agendamentos em notificações
          const notifs: Notification[] = agendamentos.map((ag: {
            id: string;
            dataHora: string;
            cliente: { nome: string };
            veiculo: { modelo: string; placa: string };
            createdAt: string;
          }) => ({
            id: ag.id,
            type: "agendamento" as const,
            title: "Agendamento pendente",
            message: `${ag.cliente.nome} - ${ag.veiculo.modelo} (${ag.veiculo.placa})`,
            time: formatDistanceToNow(new Date(ag.createdAt), { addSuffix: true, locale: ptBR }),
            unread: true,
            href: "/agendamentos",
          }));
          
          setNotifications(notifs);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 z-40 lg:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${corPrimaria || "#06b6d4"}, #3b82f6)`,
              }}
            >
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-slate-800 text-sm truncate max-w-[140px]">
                {lavaJatoNome || "Lavify"}
              </h1>
              {userName && (
                <p className="text-[10px] text-slate-500">
                  Olá, {userName.split(" ")[0]}!
                </p>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-95"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {/* Badge de notificação */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Notificações */}
      {showNotifications && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setShowNotifications(false)}
          />
          
          {/* Panel */}
          <div className="fixed inset-x-0 top-0 z-50 lg:hidden animate-slide-in">
            <div className="bg-white rounded-b-2xl shadow-xl max-h-[70vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg text-slate-800">Notificações</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Lista de Notificações */}
              <div className="overflow-y-auto max-h-[calc(70vh-120px)]">
                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Carregando...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Tudo em dia! 🎉</p>
                    <p className="text-slate-400 text-sm mt-1">
                      Nenhum agendamento pendente
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notification) => (
                      <Link
                        key={notification.id}
                        href={notification.href || "#"}
                        onClick={() => setShowNotifications(false)}
                        className={`block p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors ${
                          notification.unread ? 'bg-cyan-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            notification.type === "agendamento" 
                              ? "bg-cyan-100" 
                              : "bg-slate-100"
                          }`}>
                            <Calendar className={`w-5 h-5 ${
                              notification.type === "agendamento" 
                                ? "text-cyan-600" 
                                : "text-slate-600"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm text-slate-800">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 safe-area-pb">
                {notifications.length > 0 ? (
                  <Link
                    href="/agendamentos"
                    onClick={() => setShowNotifications(false)}
                    className="block w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl text-center active:scale-[0.98] transition-transform"
                  >
                    Ver todos os agendamentos
                  </Link>
                ) : (
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Fechar
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
