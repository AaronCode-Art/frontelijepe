import { useState } from "react";
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { AppNotification } from "@/types";

type TabFilter = "todas" | "no-leidas" | "info" | "exito" | "alerta";

const tabs: { key: TabFilter; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "no-leidas", label: "No leídas" },
  { key: "info", label: "Info" },
  { key: "exito", label: "Éxito" },
  { key: "alerta", label: "Alerta" },
];

const typeConfig: Record<AppNotification["type"], { icon: React.ElementType; dot: string; bg: string; label: string }> = {
  info: { icon: Info, dot: "bg-blue-500", bg: "bg-blue-50", label: "Info" },
  success: { icon: CheckCircle, dot: "bg-green-500", bg: "bg-green-50", label: "Éxito" },
  warning: { icon: AlertTriangle, dot: "bg-amber-500", bg: "bg-amber-50", label: "Alerta" },
};

export default function NotificacionesPage() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<TabFilter>("todas");

  const filtered = state.notifications.filter((n) => {
    if (activeTab === "todas") return true;
    if (activeTab === "no-leidas") return !n.read;
    if (activeTab === "info") return n.type === "info";
    if (activeTab === "exito") return n.type === "success";
    if (activeTab === "alerta") return n.type === "warning";
    return true;
  });

  const unreadCount = state.notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    dispatch({ type: "MARK_NOTIF_READ", id });
  };

  const markAllRead = () => {
    dispatch({ type: "MARK_ALL_NOTIF_READ" });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-[#0059FF]" />
              Notificaciones
              {unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: "#D91023" }}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:border-[#0059FF] hover:text-[#0059FF] transition-colors"
            >
              <CheckCheck className="w-4 h-4" /> Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const count = tab.key === "no-leidas"
              ? state.notifications.filter((n) => !n.read).length
              : tab.key !== "todas"
              ? state.notifications.filter((n) => {
                  if (tab.key === "info") return n.type === "info";
                  if (tab.key === "exito") return n.type === "success";
                  if (tab.key === "alerta") return n.type === "warning";
                  return false;
                }).length
              : 0;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all",
                  activeTab === tab.key
                    ? "bg-[#0059FF] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                ].join(" ")}
              >
                {tab.label}
                {count > 0 && (
                  <span className={[
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600",
                  ].join(" ")}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
              <Bell className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Sin notificaciones</h2>
            <p className="text-sm text-gray-400">
              {activeTab === "no-leidas" ? "Ya has leído todas las notificaciones." : "No hay notificaciones en esta categoría."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notif) => {
              const cfg = typeConfig[notif.type];
              const Icon = cfg.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markRead(notif.id)}
                  className={[
                    "bg-white rounded-2xl border p-4 transition-all",
                    !notif.read
                      ? "border-blue-100 shadow-sm cursor-pointer hover:shadow-md"
                      : "border-gray-100",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {/* Type icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                      <Icon className="w-4 h-4" style={{ color: notif.type === "info" ? "#0059FF" : notif.type === "success" ? "#059669" : "#D97706" }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-tight ${notif.read ? "font-medium text-gray-700" : "font-semibold text-gray-800"}`}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#0059FF" }} />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">{notif.time}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg}`}
                          style={{ color: notif.type === "info" ? "#0059FF" : notif.type === "success" ? "#059669" : "#D97706" }}>
                          {cfg.label}
                        </span>
                        {!notif.read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                            className="text-xs text-[#0059FF] hover:underline ml-auto"
                          >
                            Marcar como leída
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
