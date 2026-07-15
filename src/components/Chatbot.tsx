import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, ExternalLink, ChevronRight, Bot, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { ChatSession } from "@/types";
import { faqData, faqCategories } from "@/data/faqData";
import type { FAQEntry } from "@/data/faqData";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
  relatedPage?: string;
  noMatch?: boolean;
}

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
  "¡Hola! Soy el Asistente ElijePe ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre admisión, costos, becas, traslados o cualquier duda universitaria.";

const SUGGESTED = [
  "¿Qué es el licenciamiento SUNEDU?",
  "¿Cómo funciona Beca 18?",
  "¿Cómo hago un traslado universitario?",
  "¿Cuánto cuesta estudiar en una universidad privada?",
  "¿Qué es la convalidación de créditos?",
  "¿Cómo usar el simulador?",
];

export function Chatbot() {
  const { state, dispatch, navigate } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [chatSessionId] = useState(uid);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: uid(), role: "bot", content: WELCOME, time: nowTime() },
      ]);
    }
  }, [isOpen]);

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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg shadow-blue-200/50 flex items-center justify-center animate-pulse-glow"
            aria-label="Abrir asistente"
          >
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-400 rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm animate-pop-in">
              ?
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-40 w-96 max-h-[600px] flex flex-col bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100/60 overflow-hidden"
            style={{ maxWidth: "calc(100vw - 24px)" }}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 px-4 py-3 text-white shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-violet/80" />
              <div className="relative flex items-center gap-3 w-full">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold leading-tight">Asistente ElijePe</div>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
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
                  className="relative text-white/70 hover:text-white text-xs underline mr-2"
                >
                  Historial
                </button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="relative text-white/70 hover:text-white rounded-lg p-1"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 px-3 py-2 overflow-x-auto shrink-0 bg-gray-50/80 border-b border-gray-100 scrollbar-hide">
              {faqCategories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm shadow-blue-200/50"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300/50 hover:text-blue-600"
                  }`}
                >
                  {cat.split(" ")[0]}
                </motion.button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 scrollbar-thin">
              <AnimatePresence initial={false}>
                {messages.length <= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className="text-xs text-gray-400 mb-2 font-medium">Preguntas frecuentes:</p>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTED.map((q, i) => (
                        <motion.button
                          key={q}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          whileHover={{ x: 2 }}
                          onClick={() => sendMessage(q)}
                          className="text-left text-xs text-blue-600 bg-blue-50/60 border border-blue-100/60 rounded-xl px-3 py-2 hover:bg-blue-100/60 hover:border-blue-200/60 transition-all flex items-center justify-between gap-2"
                        >
                          <span>{q}</span>
                          <ChevronRight size={12} className="shrink-0 text-blue-400" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {activeCategory && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50/80 rounded-xl p-3 border border-gray-100"
                >
                  <p className="text-xs font-semibold text-gray-600 mb-2">{activeCategory}</p>
                  <div className="space-y-1">
                    {getQuestionsForCategory(activeCategory).map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => { sendMessage(entry.question); }}
                        className="w-full text-left text-xs text-gray-600 bg-white border border-gray-200/60 rounded-lg px-3 py-2 hover:border-blue-300/50 hover:text-blue-600 transition-all"
                      >
                        {entry.question}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      {msg.role === "bot" && (
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
                            <Bot size={11} className="text-white" />
                          </div>
                          <span className="text-xs text-gray-400">Asistente ElijePe</span>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm shadow-sm shadow-blue-200/30"
                            : "bg-gray-50 text-gray-700 border border-gray-100 rounded-tl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>

                      {msg.relatedPage && !msg.noMatch && (
                        <button
                          onClick={() => { navigate(msg.relatedPage as Parameters<typeof navigate>[0]); setIsOpen(false); }}
                          className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline mt-0.5"
                        >
                          <ExternalLink size={11} />
                          Ver en plataforma
                        </button>
                      )}

                      {msg.noMatch && (
                        <motion.button
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { navigate("ia"); setIsOpen(false); }}
                          className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet to-purple-500 text-white px-3 py-1.5 rounded-lg hover:from-violet/90 hover:to-purple-500/90 transition-all font-medium shadow-sm shadow-violet/20 mt-1"
                        >
                          <Sparkles size={12} />
                          Ir a ElijePe IA
                        </motion.button>
                      )}

                      <span className="text-[10px] text-gray-400">{msg.time}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2 px-3 py-3 border-t border-gray-100 shrink-0 bg-white/80 backdrop-blur-sm">
              <input
                className="flex-1 text-sm border border-gray-200/60 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300/50 bg-gray-50/50 transition-all placeholder-gray-400"
                placeholder="Escribe tu pregunta..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isTyping}
              />
              <motion.button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-blue-200/30"
              >
                <Send size={15} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
