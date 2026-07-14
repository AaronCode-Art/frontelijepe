import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import type { EspecialistaMensaje, EspecialistaSesion } from "@/types";
import {
  Lock, Sparkles, Send, GraduationCap, Landmark, Calculator, HeartHandshake,
  Clock, CheckCircle2, ChevronRight,
} from "lucide-react";

interface Especialidad {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const ESPECIALIDADES: Especialidad[] = [
  { id: "vocacional", label: "Orientación Vocacional", desc: "Un psicólogo vocacional revisa tu perfil y responde tus dudas de carrera.", icon: <GraduationCap size={20} />, color: "#0059FF" },
  { id: "traslado", label: "Traslados y Convalidación", desc: "Especialista en trámites de traslado externo y convalidación de cursos.", icon: <Landmark size={20} />, color: "#7C3AED" },
  { id: "financiero", label: "Asesoría Financiera", desc: "Planifica el costo total de la carrera, becas y créditos educativos.", icon: <Calculator size={20} />, color: "#16A34A" },
  { id: "familiar", label: "Acompañamiento Familiar", desc: "Orientación para padres sobre cómo apoyar la decisión de sus hijos.", icon: <HeartHandshake size={20} />, color: "#D97706" },
];

// Respuestas de bienvenida simuladas por especialidad, en lo que un asesor humano real
// toma la conversación desde el panel de soporte (backend / especialistas.py).
const WELCOME: Record<string, string> = {
  vocacional: "¡Hola! Soy parte del equipo de orientación vocacional de ElijePe. Cuéntame en qué etapa de tu decisión estás y con gusto te ayudo a aclarar tus dudas.",
  traslado: "Hola, soy especialista en traslados y convalidación. Cuéntame de qué universidad vienes, cuántos ciclos llevas y a dónde quieres trasladarte.",
  financiero: "Hola, soy asesor financiero educativo. Cuéntame qué carrera y universidades estás evaluando para ayudarte a proyectar el costo real.",
  familiar: "Hola, con gusto te acompaño en este proceso como padre/madre de familia. Cuéntame qué es lo que más te preocupa de la decisión de tu hijo(a).",
};

function nowStr() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

export default function EspecialistasPage() {
  const { state, dispatch, navigate } = useApp();
  const user = state.user;
  const unlocked = !!user?.iaPremium;

  const [activeSesion, setActiveSesion] = useState<EspecialistaSesion | null>(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSesion?.messages.length]);

  if (!unlocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-5">
            <Lock size={26} className="text-[#7C3AED]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chat con especialistas</h2>
          <p className="text-sm text-gray-500 mb-6">
            Esta función está incluida en el acceso premium de ElijePe (pago único de S/. 10),
            junto con la IA mejorada y la creación de foros en la Comunidad.
          </p>
          <button
            onClick={() => navigate("ia")}
            className="w-full py-3 rounded-xl bg-[#7C3AED] text-white font-semibold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <Sparkles size={16} /> Desbloquear por S/. 10 <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  function startSesion(esp: Especialidad) {
    const session: EspecialistaSesion = {
      id: `esp-${Date.now()}`,
      especialidad: esp.label,
      estado: "activo",
      createdAt: new Date().toISOString(),
      messages: [
        { id: `m-${Date.now()}`, role: "especialista", content: WELCOME[esp.id], time: nowStr() },
      ],
    };
    setActiveSesion(session);
    dispatch({ type: "SAVE_ESPECIALISTA_SESION", session });
  }

  function sendMessage() {
    if (!input.trim() || !activeSesion) return;
    const userMsg: EspecialistaMensaje = { id: `m-${Date.now()}`, role: "user", content: input, time: nowStr() };
    const reply: EspecialistaMensaje = {
      id: `m-${Date.now() + 1}`,
      role: "especialista",
      content: "Gracias por el detalle. Un especialista humano revisará tu mensaje y te responderá por aquí en breve (tiempo promedio de respuesta: 15 min en horario de oficina). Mientras tanto, ¿hay algo más que quieras precisar?",
      time: nowStr(),
    };
    const updated: EspecialistaSesion = {
      ...activeSesion,
      messages: [...activeSesion.messages, userMsg, reply],
    };
    setActiveSesion(updated);
    dispatch({ type: "SAVE_ESPECIALISTA_SESION", session: updated });
    setInput("");
  }

  if (!activeSesion) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Chat con especialistas</h1>
          <p className="text-sm text-gray-500 mt-1">Elige el área en la que necesitas ayuda humana personalizada.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {ESPECIALIDADES.map((esp) => (
            <button
              key={esp.id}
              onClick={() => startSesion(esp)}
              className="text-left p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${esp.color}15`, color: esp.color }}
              >
                {esp.icon}
              </div>
              <p className="font-semibold text-gray-900 mb-1">{esp.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{esp.desc}</p>
            </button>
          ))}
        </div>

        {state.especialistaSesiones.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Conversaciones recientes</p>
            <div className="space-y-2">
              {state.especialistaSesiones.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSesion(s)}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.especialidad}</p>
                    <p className="text-xs text-gray-400">{s.messages.length} mensajes</p>
                  </div>
                  <CheckCircle2 size={14} className="text-green-500" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setActiveSesion(null)} className="text-sm text-gray-500 hover:text-blue-600">
          ← Volver
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} /> {activeSesion.especialidad}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {activeSesion.messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user" ? "bg-[#0059FF] text-white" : "bg-white border border-gray-100 text-gray-800"
              }`}
            >
              {m.content}
              <div className={`text-[10px] mt-1 ${m.role === "user" ? "text-white/60" : "text-gray-400"}`}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="pt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl bg-[#0059FF] text-white flex items-center justify-center disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
