import { useState } from "react";
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

function SessionCard({ session, onClick }: { session: ChatSession; onClick: () => void }) {
  const preview = session.messages[0]?.content ?? "";
  const isIA = session.type === "ia";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isIA ? "bg-purple-50" : "bg-blue-50"}`}
          >
            {isIA
              ? <Zap className="w-5 h-5 text-purple-600" />
              : <HelpCircle className="w-5 h-5 text-[#0059FF]" />
            }
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">{session.title}</h3>
            <span
              className={`inline-block mt-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${isIA ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-[#0059FF]"}`}
            >
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
    </div>
  );
}

function ChatBubble({ role, content, time }: { role: "user" | "assistant"; content: string; time: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isUser ? "bg-[#0059FF]" : "bg-gray-200"}`}
      >
        {isUser
          ? <User className="w-3.5 h-3.5 text-white" />
          : <Bot className="w-3.5 h-3.5 text-gray-600" />
        }
      </div>
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-[#0059FF] text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-800 rounded-tl-sm"
          }`}
        >
          {content}
        </div>
        <p className="text-[10px] text-gray-400 px-1">{time}</p>
      </div>
    </div>
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
      <div className="min-h-screen bg-[#F4F6F9] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <button
            onClick={() => setExpandedSession(null)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0059FF] mb-5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Volver al historial
          </button>

          {/* Session header */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${expandedSession.type === "ia" ? "bg-purple-50" : "bg-blue-50"}`}>
                {expandedSession.type === "ia"
                  ? <Zap className="w-5 h-5 text-purple-600" />
                  : <HelpCircle className="w-5 h-5 text-[#0059FF]" />
                }
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
          </div>

          {/* Messages */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            {expandedSession.messages.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Sin mensajes en esta sesión</p>
            ) : (
              expandedSession.messages.map((msg) => (
                <ChatBubble key={msg.id} role={msg.role} content={msg.content} time={msg.time} />
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#0059FF]" /> Historial de chats
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {state.chatSessions.length} conversacion{state.chatSessions.length !== 1 ? "es" : ""} guardada{state.chatSessions.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Type filter */}
        <div className="flex gap-2 mb-6">
          {typeFilters.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={[
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
                typeFilter === key
                  ? "bg-[#0059FF] text-white border-[#0059FF]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0059FF] hover:text-[#0059FF]",
              ].join(" ")}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Sessions */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-5">
              <MessageSquare className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Sin conversaciones</h2>
            <p className="text-sm text-gray-400 max-w-xs">
              {typeFilter === "ia"
                ? "Aún no tienes conversaciones con la IA Premium."
                : typeFilter === "faq"
                ? "Aún no tienes conversaciones con el Asistente FAQ."
                : "No has iniciado ninguna conversación todavía."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onClick={() => setExpandedSession(session)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
