import { useEffect } from "react";
import { X, MessageCircle, Sparkles, Plus, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ChatHistorySidebar({ open, onClose }: Props) {
  const { state, openChatSession, navigate } = useApp();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const sesiones = [...state.chatSessions]
    .filter((s) => s.type === "ia")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function handleOpen(id: string) {
    openChatSession(id);
    onClose();
  }

  function handleNew() {
    navigate("ia");
    onClose();
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} aria-hidden="true" />}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Historial de Chat IA"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#7C3AED]" />
            <h3 className="font-bold text-gray-900">Historial de Chat IA</h3>
          </div>
          <button onClick={onClose} aria-label="Cerrar historial" className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={handleNew}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0059FF] text-white text-sm font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            <Plus size={15} /> Nuevo chat
          </button>

          {sesiones.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Aún no tienes conversaciones con la IA. Empieza una desde la pestaña "IA".
            </p>
          ) : (
            <div className="space-y-2">
              {sesiones.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleOpen(s.id)}
                  className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle size={13} className="text-[#7C3AED] shrink-0" />
                    <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={11} />
                    {new Date(s.date).toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    <span>· {s.messages.length} mensajes</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
