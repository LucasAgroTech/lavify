"use client";

import { useState } from "react";
import { Droplets, Bell, X } from "lucide-react";

interface MobileHeaderProps {
  lavaJatoNome?: string;
  corPrimaria?: string;
  userName?: string;
}

// Notificações de exemplo (futuramente virá de uma API)
const mockNotifications = [
  { id: 1, title: "Novo agendamento", message: "Cliente João agendou para hoje às 14h", time: "5 min", unread: true },
  { id: 2, title: "Serviço concluído", message: "Lavagem completa do HB20 finalizada", time: "20 min", unread: true },
  { id: 3, title: "Estoque baixo", message: "Shampoo automotivo abaixo do mínimo", time: "1h", unread: false },
];

export function MobileHeader({ lavaJatoNome, corPrimaria, userName }: MobileHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter(n => n.unread).length;

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
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
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
                <h2 className="font-bold text-lg text-slate-800">Notificações</h2>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Lista de Notificações */}
              <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
                {mockNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {mockNotifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 ${notification.unread ? 'bg-cyan-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-cyan-500' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm text-slate-800 truncate">
                                {notification.title}
                              </p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-0.5">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 safe-area-pb">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-full py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

