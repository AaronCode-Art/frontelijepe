import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Bot, User, ChevronLeft, Clock, Zap, HelpCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { ChatSession } from "@/types";

type TypeFilter = "all" | "ia" | "faq";

const typeFilters: { key: TypeFilter; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "Todas", icon: MessageSquare },
  { key: "ia", label: "IA Premium", icon: Zap },
  { key: "faq", label: "Asistente FAQ", icon: HelpCircle },
];

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

function SessionCard({ session, onClick }: { session: ChatSession; onClick: () => void }) {
  const preview = session.messages[0]?.content ?? "";
  const isIA = session.type === "ia";

  return (
    <motion.div
      onClick={onClick}
      variants={fadeUp}
      className="bg-white rounded-2xl border border-gray-100/80 p-5 cursor-pointer group hover:shadow-md transition-shadow"
      whileHover={{ y: -2, x: 3 }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isIA ? "bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm shadow-purple-500/20" : "bg-gradient-to-br from-[#0059FF] to-[#0047CC] shadow-sm shadow-blue-500/20"
          }`}>
            {isIA ? <Zap className="w-5 h-5 text-white" /> : <HelpCircle className="w-5 h-5 text-white" />}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">{session.title}</h3>
            <span className={`inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${isIA ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
              {isIA ? "IA Premium" : "Asistente FAQ"}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatDate(session.date)}
          </p>
          <p className="text-xs text-gray-400 mt-1">{session.messages.length} msg</p>
        </div>
      </div>

      {preview && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3 pl-[52px]">
          {preview}
        </p>
      )}

      <div className="flex justify-end">
        <span className="text-xs font-semibold text-[#0059FF] group-hover:underline flex items-center gap-1">
          Ver conversación →
        </span>
      </div>
    </motion.div>
  );
}

function ChatBubble({ role, content, time }: { role: "user" | "assistant"; content: string; time: string }) {
  const isUser = role === "user";
  return (
    <motion.div
      className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        isUser ? "bg-gradient-to-br from-[#0059FF] to-[#0047CC]" : "bg-gradient-to-br from-gray-200 to-gray-300"
      }`}>
        {isUser ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-gray-600" />}
      </div>
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-[#0059FF] to-[#0047CC] text-white rounded-tr-sm shadow-sm"
            : "bg-gray-100 text-gray-800 rounded-tl-sm"
        }`}>
          {content}
        </div>
        <p className="text-[10px] text-gray-400 px-1">{time}</p>
      </div>
    </motion.div>
  );
}

export default function ChatHistoryPage() {
  const { state } = useApp();
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [expandedSession, setExpandedSession] = useState<ChatSession | null>(null);

  const filtered = state.chatSessions.filter((s) => {
    if (typeFilter === "ia") return s.type === "ia";
    if (typeFilter === "faq") return s.type === "faq";
    return true;
  });

  if (expandedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.button
            onClick={() => setExpandedSession(null)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0059FF] mb-5 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -3 }}
          >
            <ChevronLeft className="w-4 h-4" /> Volver al historial
          </motion.button>

          <motion.div
            className="bg-white rounded-2xl border border-gray-100/80 p-5 mb-4 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                expandedSession.type === "ia" ? "bg-gradient-to-br from-purple-500 to-violet-600" : "bg-gradient-to-br from-[#0059FF] to-[#0047CC]"
              }`}>
                {expandedSession.type === "ia" ? <Zap className="w-5 h-5 text-white" /> : <HelpCircle className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 text-sm">{expandedSession.title}</h2>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {formatDate(expandedSession.date)}
                  <span className="mx-1">·</span>
                  {expandedSession.messages.length} mensajes
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl border border-gray-100/80 p-5 space-y-4 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {expandedSession.messages.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Sin mensajes en esta sesión</p>
            ) : (
              expandedSession.messages.map((msg, i) => (
                <ChatBubble key={msg.id} role={msg.role} content={msg.content} time={msg.time} />
              ))
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0059FF] to-[#0047CC] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Historial de chats
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-11">
            {state.chatSessions.length} conversacion{state.chatSessions.length !== 1 ? "es" : ""} guardada{state.chatSessions.length !== 1 ? "s" : ""}
          </p>
        </motion.div>

        <motion.div
          className="flex gap-2 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {typeFilters.map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                typeFilter === key ? "text-white" : "bg-white text-gray-600 border-gray-200 hover:border-[#0059FF] hover:text-[#0059FF]"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {typeFilter === key && (
                <motion.div
                  layoutId="chat-filter"
                  className="absolute inset-0 bg-gradient-to-r from-[#0059FF] to-[#0047CC] rounded-xl shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{label}</span>
            </motion.button>
          ))}
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-20 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
              <MessageSquare className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Sin conversaciones</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              {typeFilter === "ia" ? "Aún no tienes conversaciones con la IA Premium."
                : typeFilter === "faq" ? "Aún no tienes conversaciones con el Asistente FAQ."
                : "No has iniciado ninguna conversación todavía."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((session) => (
              <SessionCard key={session.id} session={session} onClick={() => setExpandedSession(session)} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
