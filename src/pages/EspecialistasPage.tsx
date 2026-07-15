import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "@/context/AppContext";
import type { EspecialistaMensaje, EspecialistaSesion } from "@/types";
import {
  Lock, Sparkles, Send, GraduationCap, Landmark, Calculator, HeartHandshake,
  Clock, CheckCircle2, ChevronRight, ArrowLeft,
} from "lucide-react";

interface Especialidad {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const ESPECIALIDADES: Especialidad[] = [
  { id: "vocacional", label: "Orientación Vocacional", desc: "Un psicólogo vocacional revisa tu perfil y responde tus dudas de carrera.", icon: <GraduationCap size={20} />, color: "#0059FF", gradient: "from-[#0059FF] to-blue-600" },
  { id: "traslado", label: "Traslados y Convalidación", desc: "Especialista en trámites de traslado externo y convalidación de cursos.", icon: <Landmark size={20} />, color: "#7C3AED", gradient: "from-purple-500 to-violet-600" },
  { id: "financiero", label: "Asesoría Financiera", desc: "Planifica el costo total de la carrera, becas y créditos educativos.", icon: <Calculator size={20} />, color: "#16A34A", gradient: "from-emerald-500 to-green-600" },
  { id: "familiar", label: "Acompañamiento Familiar", desc: "Orientación para padres sobre cómo apoyar la decisión de sus hijos.", icon: <HeartHandshake size={20} />, color: "#D97706", gradient: "from-amber-500 to-orange-500" },
];

const WELCOME: Record<string, string> = {
  vocacional: "¡Hola! Soy parte del equipo de orientación vocacional de ElijePe. Cuéntame en qué etapa de tu decisión estás y con gusto te ayudo a aclarar tus dudas.",
  traslado: "Hola, soy especialista en traslados y convalidación. Cuéntame de qué universidad vienes, cuántos ciclos llevas y a dónde quieres trasladarte.",
  financiero: "Hola, soy asesor financiero educativo. Cuéntame qué carrera y universidades estás evaluando para ayudarte a proyectar el costo real.",
  familiar: "Hola, con gusto te acompaño en este proceso como padre/madre de familia. Cuéntame qué es lo que más te preocupa de la decisión de tu hijo(a).",
};

function nowStr() {
  return new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

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
        <motion.div
          className="max-w-md w-full bg-white rounded-3xl border border-gray-100/80 shadow-xl shadow-gray-200/50 p-8 text-center"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-purple-500/25"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Lock size={26} className="text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chat con especialistas</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Esta función está incluida en el acceso premium de ElijePe (pago único de S/. 10),
            junto con la IA mejorada y la creación de foros en la Comunidad.
          </p>
          <motion.button
            onClick={() => navigate("ia")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={16} /> Desbloquear por S/. 10 <ChevronRight size={16} />
          </motion.button>
        </motion.div>
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
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">Chat con especialistas</h1>
          <p className="text-sm text-gray-500 mt-1">Elige el área en la que necesitas ayuda humana personalizada.</p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {ESPECIALIDADES.map((esp) => (
            <motion.button
              key={esp.id}
              onClick={() => startSesion(esp)}
              variants={fadeUp}
              className="text-left p-5 bg-white rounded-2xl border border-gray-100/80 hover:shadow-md transition-shadow"
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${esp.gradient} shadow-sm`}>
                <span className="text-white">{esp.icon}</span>
              </div>
              <p className="font-semibold text-gray-900 mb-1">{esp.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{esp.desc}</p>
            </motion.button>
          ))}
        </motion.div>

        {state.especialistaSesiones.length > 0 && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Conversaciones recientes</p>
            <div className="space-y-2">
              {state.especialistaSesiones.map((s) => (
                <motion.button
                  key={s.id}
                  onClick={() => setActiveSesion(s)}
                  className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100/80 hover:bg-gray-50 transition-colors text-left"
                  whileHover={{ x: 3 }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.especialidad}</p>
                    <p className="text-xs text-gray-400">{s.messages.length} mensajes</p>
                  </div>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={() => setActiveSesion(null)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0059FF] transition-colors"
          whileHover={{ x: -3 }}
        >
          <ArrowLeft size={16} /> Volver
        </motion.button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} /> {activeSesion.especialidad}
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <AnimatePresence>
          {activeSesion.messages.map((m) => (
            <motion.div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-gradient-to-br from-[#0059FF] to-[#0047CC] text-white shadow-sm"
                  : "bg-white border border-gray-100 text-gray-800 shadow-sm"
              }`}>
                {m.content}
                <div className={`text-[10px] mt-1 ${m.role === "user" ? "text-white/60" : "text-gray-400"}`}>{m.time}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="pt-4 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe tu mensaje..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20 focus:border-[#0059FF]/40 transition-all"
        />
        <motion.button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0059FF] to-[#0047CC] text-white flex items-center justify-center disabled:opacity-40 shadow-sm"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <Send size={16} />
        </motion.button>
      </div>
    </div>
  );
}
