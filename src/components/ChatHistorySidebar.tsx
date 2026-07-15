import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Sparkles, Plus, Clock, Search, Bot, Zap, CalendarDays } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { historialIA } from "@/services/api";
import type { ChatSession } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

function groupSessions(sessions: ChatSession[]): { label: string; items: ChatSession[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);

  const groups: Record<string, ChatSession[]> = {
    "Hoy": [],
    "Ayer": [],
    "Esta semana": [],
    "Anteriores": [],
  };

  sessions.forEach((s) => {
    const d = new Date(s.date);
    if (d >= today) groups["Hoy"].push(s);
    else if (d >= yesterday) groups["Ayer"].push(s);
    else if (d >= weekAgo) groups["Esta semana"].push(s);
    else groups["Anteriores"].push(s);
  });

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

const typeColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  ia: { bg: "bg-violet-light", text: "text-violet", icon: <Zap size={11} /> },
  faq: { bg: "bg-blue-50", text: "text-blue-600", icon: <Bot size={11} /> },
};

export default function ChatHistorySidebar({ open, onClose }: Props) {
  const { state, openChatSession, navigate, dispatch } = useApp();
  const [search, setSearch] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  // Refresh chat history from backend every time the sidebar opens
  useEffect(() => {
    if (!open || !state.user || state.user.isDemo || !state.user.id) return;
    let cancelled = false;
    historialIA(state.user.id)
      .then((data) => {
        if (cancelled || !data) return;
        const sessions: ChatSession[] = data.map((s: any) => ({
          id: s.id,
          type: "ia" as const,
          title: s.titulo || `Sesión IA`,
          date: s.created_at,
          messages: (s.mensajes || []).map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            time: new Date(m.created_at).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
          })),
        }));
        dispatch({ type: "LOAD_CHAT_SESSIONS", sessions });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [open, state.user]);

  const filteredSessions = useMemo(() => {
    const sessions = [...state.chatSessions]
      .filter((s) => s.type === "ia")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!search.trim()) return sessions;
    const q = search.toLowerCase();
    return sessions.filter(
      (s) => s.title.toLowerCase().includes(q) || s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [state.chatSessions, search]);

  const grouped = useMemo(() => groupSessions(filteredSessions), [filteredSessions]);

  function handleOpen(id: string) {
    openChatSession(id);
    onClose();
  }

  function handleNew() {
    navigate("ia");
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60]"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Historial de Chat IA"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col z-10"
          >
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-blue-50/50 to-transparent pointer-events-none" />

              <div className="relative flex items-center justify-between px-5 py-4 border-b border-gray-100/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet to-purple-400 flex items-center justify-center shadow-md shadow-violet/20">
                    <Sparkles size={15} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Historial de Chat IA</h3>
                    <p className="text-[10px] text-gray-400">{filteredSessions.length} conversaciones</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  aria-label="Cerrar historial"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X size={17} />
                </motion.button>
              </div>
            </div>

            <div className="px-4 pt-3 pb-2 space-y-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNew}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-md shadow-blue-200/50"
              >
                <Plus size={15} strokeWidth={2.5} /> Nuevo chat
              </motion.button>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar en conversaciones..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet/30 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin">
              {filteredSessions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-light to-purple-50 flex items-center justify-center mb-4 animate-float">
                    <Sparkles size={28} className="text-violet" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Sin conversaciones</p>
                  <p className="text-xs text-gray-400 max-w-[200px]">
                    {search ? "No se encontraron resultados para tu búsqueda" : "Empieza una nueva conversación con la IA"}
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {grouped.map((group, gi) => (
                    <div key={group.label}>
                      <div className="flex items-center gap-2 mb-2 mt-1">
                        <CalendarDays size={12} className="text-gray-400" />
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{group.label}</span>
                      </div>
                      <div className="space-y-1.5">
                        {group.items.map((s, si) => {
                          const typeStyle = typeColors[s.type] ?? typeColors.ia;
                          return (
                            <motion.button
                              key={s.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (gi * 0.05) + (si * 0.03), duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              whileHover={{ scale: 1.01, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOpen(s.id)}
                              className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-violet/20 hover:bg-gradient-to-r hover:from-violet-light/30 hover:to-blue-50/30 transition-all group"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className={`w-7 h-7 rounded-lg ${typeStyle.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                                  <span className={typeStyle.text}>{typeStyle.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 truncate group-hover:text-violet transition-colors">{s.title}</p>
                                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                                    <Clock size={10} />
                                    {new Date(s.date).toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    <span className="text-gray-300">·</span>
                                    <span>{s.messages.length} msgs</span>
                                  </div>
                                </div>
                                <MessageCircle size={14} className="text-gray-300 group-hover:text-violet shrink-0 mt-1 transition-colors" />
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
