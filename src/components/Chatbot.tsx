import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, ExternalLink, ChevronRight, Bot } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { ChatSession } from "@/types";
import { faqData, faqCategories } from "@/data/faqData";
import type { FAQEntry } from "@/data/faqData";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
  relatedPage?: string;
  noMatch?: boolean;
}

// ─── Matching logic ───────────────────────────────────────────────────────────
function findAnswer(query: string): FAQEntry | null {
  const q = query.toLowerCase();
  const scored = faqData.map((entry) => {
    let score = 0;
    entry.keywords.forEach((kw) => {
      if (q.includes(kw.toLowerCase())) score += 2;
    });
    if (q.includes(entry.question.toLowerCase().slice(0, 20))) score += 5;
    entry.category
      .toLowerCase()
      .split(" ")
      .forEach((w) => {
        if (q.includes(w)) score += 1;
      });
    return { entry, score };
  });
  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best.score > 1 ? best.entry : null;
}

function getTopCategoriesForQuery(query: string): string[] {
  const q = query.toLowerCase();
  const catScores: Record<string, number> = {};
  faqData.forEach((entry) => {
    let s = 0;
    entry.keywords.forEach((kw) => { if (q.includes(kw.toLowerCase())) s++; });
    catScores[entry.category] = (catScores[entry.category] ?? 0) + s;
  });
  return Object.entries(catScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);
}

function getQuestionsForCategory(cat: string): FAQEntry[] {
  return faqData.filter((e) => e.category === cat).slice(0, 5);
}

function uid() {
  return Math.random().toString(36).slice(2);
}

function nowTime() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

const WELCOME =
  "¡Hola! Soy el Asistente ElijePe 👋 ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre admisión, costos, becas, traslados o cualquier duda universitaria.";

const SUGGESTED = [
  "¿Qué es el licenciamiento SUNEDU?",
  "¿Cómo funciona Beca 18?",
  "¿Cómo hago un traslado universitario?",
  "¿Cuánto cuesta estudiar en una universidad privada?",
  "¿Qué es la convalidación de créditos?",
  "¿Cómo usar el simulador?",
];

// ─── Component ────────────────────────────────────────────────────────────────
export function Chatbot() {
  const { state, dispatch, navigate } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [chatSessionId] = useState(uid);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: uid(), role: "bot", content: WELCOME, time: nowTime() },
      ]);
    }
  }, [isOpen]);

  // Save session when closing
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const session: ChatSession = {
        id: chatSessionId,
        type: "faq",
        title: messages.find((m) => m.role === "user")?.content.slice(0, 40) ?? "Conversación FAQ",
        date: new Date().toLocaleDateString("es-PE"),
        messages: messages.map((m) => ({
          id: m.id,
          role: m.role === "bot" ? "assistant" : "user",
          content: m.content,
          time: m.time,
        })),
      };
      dispatch({ type: "SAVE_CHAT_SESSION", session });
    }
  }, [isOpen]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: uid(), role: "user", content: text, time: nowTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setActiveCategory(null);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const match = findAnswer(text);
      if (match) {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            content: match.answer,
            time: nowTime(),
            relatedPage: match.relatedPage,
          },
        ]);
      } else {
        const topCats = getTopCategoriesForQuery(text);
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "bot",
            content:
              "No encontré una respuesta exacta para esa consulta. ¿Quieres hablar con ElijePe IA premium para una respuesta más detallada? También puedes reformular tu pregunta o elegir una categoría:",
            time: nowTime(),
            noMatch: true,
            relatedPage: "ia",
          },
        ]);
        if (topCats.length > 0) setActiveCategory(topCats[0]);
      }
    }, 1000);
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    sendMessage(inputVal);
  }

  if (!state.user) return null;

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#0059FF] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          style={{ boxShadow: "0 0 0 0 rgba(0,89,255,0.4)" }}
          aria-label="Abrir asistente"
        >
          <style>{`
            @keyframes chatPulse {
              0% { box-shadow: 0 0 0 0 rgba(0,89,255,0.4); }
              70% { box-shadow: 0 0 0 14px rgba(0,89,255,0); }
              100% { box-shadow: 0 0 0 0 rgba(0,89,255,0); }
            }
            .chat-pulse { animation: chatPulse 2s ease-out infinite; }
          `}</style>
          <span className="chat-pulse absolute inset-0 rounded-full" />
          <MessageCircle size={24} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D91023] rounded-full text-[10px] font-bold flex items-center justify-center shadow">
            ?
          </span>
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-96 max-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ maxWidth: "calc(100vw - 24px)" }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#0059FF] text-white shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold leading-tight">Asistente ElijePe</div>
              <div className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                En línea
              </div>
            </div>
            <button
              onClick={() => {
                dispatch({ type: "SAVE_CHAT_SESSION", session: {
                  id: chatSessionId,
                  type: "faq",
                  title: messages.find((m) => m.role === "user")?.content.slice(0, 40) ?? "FAQ",
                  date: new Date().toLocaleDateString("es-PE"),
                  messages: messages.map((m) => ({ id: m.id, role: m.role === "bot" ? "assistant" as const : "user" as const, content: m.content, time: m.time })),
                }});
                navigate("chat-history");
                setIsOpen(false);
              }}
              className="text-white/70 hover:text-white text-xs underline mr-2"
            >
              Historial
            </button>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white rounded-lg p-1">
              <X size={16} />
            </button>
          </div>

          {/* Categories row */}
          <div className="flex gap-2 px-3 py-2 overflow-x-auto shrink-0 bg-[#F4F6F9] border-b border-gray-200 scrollbar-hide">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-[#0059FF] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#0059FF]/40"
                }`}
              >
                {cat.split(" ")[0]}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {/* Suggested questions (before first user message) */}
            {messages.length <= 1 && (
              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium">Preguntas frecuentes:</p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-left text-xs text-[#0059FF] bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 hover:bg-blue-100 transition-colors flex items-center justify-between gap-2"
                    >
                      <span>{q}</span>
                      <ChevronRight size={12} className="shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category browse mode */}
            {activeCategory && (
              <div className="bg-[#F4F6F9] rounded-xl p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">{activeCategory}</p>
                <div className="space-y-1">
                  {getQuestionsForCategory(activeCategory).map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => { sendMessage(entry.question); }}
                      className="w-full text-left text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-[#0059FF]/40 hover:text-[#0059FF] transition-colors"
                    >
                      {entry.question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages list */}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {msg.role === "bot" && (
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-5 h-5 bg-[#0059FF] rounded-full flex items-center justify-center">
                        <Bot size={11} className="text-white" />
                      </div>
                      <span className="text-xs text-gray-400">Asistente ElijePe</span>
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#0059FF] text-white rounded-tr-sm"
                        : "bg-[#F4F6F9] text-gray-800 border border-gray-200 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Related page button */}
                  {msg.relatedPage && !msg.noMatch && (
                    <button
                      onClick={() => { navigate(msg.relatedPage as Parameters<typeof navigate>[0]); setIsOpen(false); }}
                      className="flex items-center gap-1 text-xs text-[#0059FF] font-medium hover:underline mt-0.5"
                    >
                      <ExternalLink size={11} />
                      Ver en plataforma →
                    </button>
                  )}

                  {/* No match: IA CTA + top categories */}
                  {msg.noMatch && (
                    <div className="mt-1 space-y-1.5">
                      <button
                        onClick={() => { navigate("ia"); setIsOpen(false); }}
                        className="flex items-center gap-1.5 text-xs bg-[#7C3AED] text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        <Bot size={12} />
                        Ir a ElijePe IA →
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] text-gray-400">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#F4F6F9] border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <form onSubmit={handleSubmit} className="flex gap-2 px-3 py-3 border-t border-gray-200 shrink-0 bg-white">
            <input
              className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20 bg-[#F4F6F9]"
              placeholder="Escribe tu pregunta..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="px-3 py-2.5 bg-[#0059FF] text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
