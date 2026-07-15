import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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

const typeConfig: Record<AppNotification["type"], { icon: React.ElementType; dot: string; bg: string; gradient: string; label: string }> = {
  info: { icon: Info, dot: "bg-blue-500", bg: "bg-blue-50", gradient: "from-blue-500 to-blue-600", label: "Info" },
  success: { icon: CheckCircle, dot: "bg-emerald-500", bg: "bg-emerald-50", gradient: "from-emerald-500 to-green-600", label: "Éxito" },
  warning: { icon: AlertTriangle, dot: "bg-amber-500", bg: "bg-amber-50", gradient: "from-amber-500 to-orange-500", label: "Alerta" },
};

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

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

  const markRead = (id: string) => dispatch({ type: "MARK_NOTIF_READ", id });
  const markAllRead = () => dispatch({ type: "MARK_ALL_NOTIF_READ" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0059FF] to-[#0047CC] flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Bell className="w-5 h-5 text-white" />
              </div>
              Notificaciones
              {unreadCount > 0 && (
                <motion.span
                  className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-500 shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-11">
              {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
            </p>
          </div>
          {unreadCount > 0 && (
            <motion.button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200/80 text-sm font-medium text-gray-600 bg-white hover:border-[#0059FF] hover:text-[#0059FF] transition-colors shadow-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <CheckCheck className="w-4 h-4" /> Marcar todas como leídas
            </motion.button>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-1 bg-white rounded-xl border border-gray-100/80 p-1 mb-6 overflow-x-auto shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
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
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.key ? "text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="notif-tab"
                    className="absolute inset-0 bg-gradient-to-r from-[#0059FF] to-[#0047CC] rounded-lg shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {count > 0 && (
                  <span className={`relative z-10 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
              <Bell className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Sin notificaciones</h2>
            <p className="text-sm text-gray-400">
              {activeTab === "no-leidas" ? "Ya has leído todas las notificaciones." : "No hay notificaciones en esta categoría."}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="space-y-3"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((notif) => {
                const cfg = typeConfig[notif.type];
                const Icon = cfg.icon;

                return (
                  <motion.div
                    key={notif.id}
                    variants={fadeUp}
                    onClick={() => !notif.read && markRead(notif.id)}
                    className={`bg-white rounded-2xl border p-4 transition-all ${
                      !notif.read
                        ? "border-blue-100 shadow-sm cursor-pointer hover:shadow-md"
                        : "border-gray-100/80"
                    }`}
                    whileHover={!notif.read ? { x: 3 } : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${cfg.gradient} shadow-sm`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-tight ${notif.read ? "font-medium text-gray-700" : "font-semibold text-gray-800"}`}>
                            {notif.title}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            {!notif.read && (
                              <motion.span
                                className="w-2 h-2 rounded-full bg-[#0059FF]"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
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
                            <motion.button
                              onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                              className="text-xs text-[#0059FF] hover:underline ml-auto"
                              whileHover={{ scale: 1.05 }}
                            >
                              Marcar como leída
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
