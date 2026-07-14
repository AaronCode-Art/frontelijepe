import { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import type { CareerResult } from "@/types";
import { iaDeepQuestions } from "@/data/testQuestions";
import * as api from "@/services/api";
import StepProgress from "@/components/StepProgress";
import GuideCallout from "@/components/GuideCallout";
import {
  Brain, Sparkles, Lock, CreditCard, Send, ChevronRight, ChevronLeft,
  CheckCircle2, Star, TrendingUp, Building2, DollarSign, BookOpen,
  Shield, User, MessageCircle, Zap, Globe, Award, SkipForward, Users, WifiOff,
} from "lucide-react";

const IA_STEPS = [{ label: "Plan" }, { label: "Pago" }, { label: "Tu perfil" }, { label: "Chat" }];

// ─── IA Response engine ───────────────────────────────────────────────────
interface IAContext {
  careers: CareerResult[];
  userName: string;
  userTipo: string;
  userRegion: string;
}

const RESPONSE_TEMPLATES: Record<string, (ctx: IAContext, msg: string) => string> = {
  default: (ctx) =>
    `Hola ${ctx.userName.split(" ")[0]}! Basándome en tu perfil vocacional, tienes una fuerte afinidad hacia **${ctx.careers[0]?.career || "Ingeniería de Sistemas"}**.

Te recomiendo enfocarte en tres aspectos clave:

- **Explorar el mercado laboral actual** en tu región — hay buenas oportunidades
- **Investigar los planes de estudio** de las universidades que te interesan
- **Consultar con egresados** de la carrera para tener una perspectiva real

¿Qué aspecto te genera más dudas? ¿Costos, universidades, o el campo laboral?`,

  carrera: (ctx) =>
    `Para tu perfil, las carreras con mayor potencial son:

**${ctx.careers[0]?.career || "Ingeniería de Sistemas"}** — ${ctx.careers[0]?.pct || 85}% de afinidad
Esta es tu carrera estrella. El mercado peruano la demanda con fuerza, especialmente en Lima y Arequipa.

**${ctx.careers[1]?.career || "Ingeniería Industrial"}** — ${ctx.careers[1]?.pct || 78}% de afinidad
Versátil y bien remunerada. Permite trabajar en múltiples sectores de la economía peruana.

**${ctx.careers[2]?.career || "Administración de Empresas"}** — ${ctx.careers[2]?.pct || 71}% de afinidad
Ideal si ves un perfil emprendedor en ti.

**Carrera Sugerida:** ${ctx.careers[0]?.career || "Ingeniería de Sistemas"}
**Porcentaje de Afinidad:** ${ctx.careers[0]?.pct || 85}%
**Opciones Recomendadas:** PUCP, UNI, UTEC para el perfil técnico — cada una con sus fortalezas específicas.`,

  universidad: (ctx) =>
    `Para **${ctx.careers[0]?.career || "tu carrera objetivo"}**, estas son mis recomendaciones según tu contexto en ${ctx.userRegion}:

**Top 3 universidades para ti:**

- **PUCP** — La mejor opción si buscas formación integral y red de contactos. Pensión desde S/. 980/mes.
- **UNI** — Si priorizas rigor técnico y bajo costo (pública gratuita). Examen muy selectivo.
- **UTEC** — Innovadora, con fuerte vínculo con el sector tecnológico. Pensión desde S/. 1,200/mes.

¿Quieres que profundice en alguna de ellas? Puedo darte información sobre becas, proceso de admisión o proyección salarial de sus egresados.`,

  costo: (ctx) =>
    `Analicemos la inversión real para **${ctx.careers[0]?.career || "tu carrera"}**:

**Universidades públicas (UNMSM, UNI, UNSA):**
- Costo anual: S/. 0 – S/. 600 (solo matrícula)
- Requiere pasar examen de admisión altamente competitivo

**Universidades privadas (rango medio):**
- Pensión: S/. 700 – S/. 1,200/mes
- Total en 5 años: aprox. S/. 42,000 – S/. 72,000

**Universidades privadas premium (PUCP, UP, UTEC):**
- Pensión: S/. 980 – S/. 2,100/mes
- Total en 5 años: aprox. S/. 58,000 – S/. 126,000

**Proyección de retorno:**
Un egresado de ${ctx.careers[0]?.career || "Ingeniería"} en Perú recupera la inversión en promedio en **3-5 años** post-titulación. El sueldo inicial en Lima ronda los S/. 2,500 – S/. 4,000.`,

  sueldo: (ctx) =>
    `Proyección salarial para **${ctx.careers[0]?.career || "tu carrera"}** en el mercado peruano (datos MTPE 2025):

**Al egresar (0-2 años de experiencia):**
S/. 2,000 – S/. 3,500 mensuales

**Con experiencia media (3-5 años):**
S/. 3,500 – S/. 6,000 mensuales

**Nivel senior (6-10 años):**
S/. 6,000 – S/. 12,000+ mensuales

**Posibilidades internacionales:**
En Chile, Colombia o España, profesionales peruanos de esta carrera promedian USD 1,800 – 3,500/mes.

¿Te interesa la proyección a 5 o 10 años en algún sector específico (tecnología, consultoría, salud pública)?`,

  traslado: (ctx) =>
    `Para un **traslado externo**, el proceso en Perú es así:

**Requisitos generales:**
- Haber cursado al menos 2 ciclos en la universidad de origen
- Promedio mínimo aprobatorio (varía por universidad: 12-14)
- Documentos: certificado de estudios, sílabos, carta de presentación

**Convalidación de cursos:**
Las universidades revisan tus sílabos y validan créditos equivalentes. En promedio convalidan **40-60%** de los cursos del primer año.

**Universidades con traslado más ágil:**
- UPN y UPC tienen procesos semestrales y bien estructurados
- PUCP solo admite traslados en casos muy específicos
- USIL es flexible con carreras de negocios y turismo

¿Quieres que te explique el proceso específico de alguna universidad?`,

  beca: (ctx) =>
    `Opciones de financiamiento que aplican a tu perfil:

**Beca 18 (Estado Peruano):**
Cubre el 100% de la carrera en universidades licenciadas. Requisitos: ser de bajos recursos, haber estudiado en colegio público, y buen rendimiento académico.

**Pronabec — Beca Permanencia:**
Para alumnos que ya están en la universidad y necesitan apoyo económico.

**Beca Generación 4 (PUCP, UP, UTEC):**
Cada universidad tiene su propio programa de becas socioeconómicas. PUCP otorga más de 1,200 becas al año.

**Crédito Educativo (Minedu-Cofide):**
Préstamo con tasas preferenciales para educación superior. Se paga después de egresar.

¿Quieres que te guíe paso a paso en la postulación a Beca 18?`,

  ingenieria: (ctx) =>
    `Las ingenierías con mayor empleabilidad en Perú 2025 según SUNEDU:

**1. Ingeniería de Sistemas / Software** ⬆️
Demanda crítica. Sueldo inicial Lima: S/. 2,800 – 4,500. Las empresas tech y fintech están contratando sin parar.

**2. Ingeniería Civil** 🏗️
Boom de infraestructura en regiones. Obras públicas y privadas. S/. 2,500 – 4,000 al inicio.

**3. Ingeniería Industrial** ⚙️
Muy versátil. Trabaja en manufactura, logística, consultoría. S/. 2,400 – 3,800 al inicio.

**4. Ingeniería de Minas** ⛏️
Alta demanda en Junín, Cajamarca, Cusco. Sueldo inicial puede superar S/. 4,500 con operaciones remotas.

Tu perfil se alinea más con: **${ctx.careers[0]?.career || "Ingeniería de Sistemas"}**.

**Carrera Sugerida:** ${ctx.careers[0]?.career || "Ingeniería de Sistemas"}
**Porcentaje de Afinidad:** ${ctx.careers[0]?.pct || 87}%
**Opciones Recomendadas:** UNI (pública, excelencia técnica), UTEC (innovación y empleabilidad), PUCP (formación integral).`,

  medicina: (ctx) =>
    `Medicina en Perú — lo que debes saber:

**Duración:** 7 años de pregrado + 1 año de internado + 3 años de residencia = **11 años mínimo**

**Universidades recomendadas:**
- **UNMSM** — Gratuita, muy selectiva, referente nacional
- **UPCH** — La mejor privada en salud, fuerte en investigación
- **UNFV** — Buena alternativa pública

**Costo total estimado:**
- UPCH: S/. 66,000 – 92,000 (toda la carrera)
- UNMSM: casi gratuita, pero la competencia en admisión es feroz

**Mercado laboral:**
El médico general gana S/. 3,500 – 6,000 al inicio en el sector público. Con especialidad: S/. 8,000 – 20,000+.

¿Te interesa alguna especialidad específica (pediatría, cirugía, salud pública)?`,

  padre: (ctx) =>
    `Entiendo que estás buscando la mejor opción para tu hijo/a. Aquí van los puntos clave:

**Para tomar la decisión correcta:**

- **Presupuesto:** Define cuánto pueden invertir mensualmente. Hay opciones desde S/. 0 (públicas) hasta S/. 2,100/mes (privadas premium).

- **Vocación del estudiante:** La carrera que elige con convicción tiene 3x más probabilidades de terminarse exitosamente.

- **Mercado laboral:** Prioriza carreras con alta empleabilidad en la región donde vivirán.

**Las carreras con mejor retorno de inversión en Perú 2025:**
Ingeniería de Sistemas, Medicina, Derecho (top unis), Administración en universidades con fuerte red empresarial.

**Mi recomendación:**
Que su hijo/a tome este test completo para tener datos objetivos antes de decidir. La orientación vocacional reduce en un 70% el riesgo de abandono universitario.`,

  egresado: (ctx) =>
    `Como egresado del colegio, estás en el momento clave. Aquí mi guía personalizada:

**Proceso de admisión 2025 — fechas clave:**
- Exámenes preuniversitarios: Marzo – Agosto
- Admisión directa (privadas): En curso todo el año
- Resultados de admisión públicas: Setiembre – Noviembre

**Estrategia recomendada para tu perfil:**

1. Postula a **2-3 universidades simultáneamente** para maximizar opciones
2. Considera la **academia preuniversitaria** si apuntas a universidad pública
3. Busca **becas desde ahora** — los procesos de Beca 18 abren en febrero

**Con tu perfil vocacional (${ctx.careers[0]?.career || "carrera objetivo"}):**
Las probabilidades de admisión son mejores en universidades privadas si tienes buen rendimiento escolar.

¿Quieres que te ayude a crear un plan de postulación paso a paso?`,

  financiero: (ctx) =>
    `**Proyección financiera a 5 años — ${ctx.careers[0]?.career || "tu carrera"}:**

| Año | Ingresos estimados | Acumulado |
|-----|-------------------|-----------|
| Año 1 (egreso) | S/. 2,500 – 3,200 | S/. 30,000+ |
| Año 2 | S/. 2,800 – 3,800 | S/. 66,000+ |
| Año 3 | S/. 3,200 – 4,500 | S/. 105,000+ |
| Año 4 | S/. 4,000 – 5,500 | S/. 153,000+ |
| Año 5 | S/. 4,500 – 7,000 | S/. 207,000+ |

**Inversión total estimada (5 años de carrera):**
- Universidad pública: S/. 2,500 – 5,000 (solo matrículas y materiales)
- Universidad privada media: S/. 45,000 – 70,000
- Universidad privada premium: S/. 70,000 – 120,000

**Punto de equilibrio:**
Recuperas la inversión entre **2.5 y 4 años** después de titularte, dependiendo de la universidad elegida.`,
};

function generateIAResponse(userMessage: string, ctx: IAContext): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("papá") || msg.includes("mamá") || msg.includes("padre") || msg.includes("madre") || msg.includes("hijo")) {
    return RESPONSE_TEMPLATES.padre(ctx, userMessage);
  }
  if (msg.includes("traslado") || msg.includes("cambiar de universidad") || msg.includes("convalidar")) {
    return RESPONSE_TEMPLATES.traslado(ctx, userMessage);
  }
  if (msg.includes("beca") || msg.includes("financiamiento") || msg.includes("pronabec") || msg.includes("beca 18")) {
    return RESPONSE_TEMPLATES.beca(ctx, userMessage);
  }
  if (msg.includes("sueldo") || msg.includes("salario") || msg.includes("ganaré") || msg.includes("cuánto gano")) {
    return RESPONSE_TEMPLATES.sueldo(ctx, userMessage);
  }
  if (msg.includes("costo") || msg.includes("precio") || msg.includes("pensión") || msg.includes("pagar")) {
    return RESPONSE_TEMPLATES.costo(ctx, userMessage);
  }
  if (msg.includes("universidad") || msg.includes("pucp") || msg.includes("utec") || msg.includes("unmsm") || msg.includes("uni ")) {
    return RESPONSE_TEMPLATES.universidad(ctx, userMessage);
  }
  if (msg.includes("medicina") || msg.includes("médico") || msg.includes("salud")) {
    return RESPONSE_TEMPLATES.medicina(ctx, userMessage);
  }
  if (msg.includes("ingeniería") || msg.includes("ingeniero") || msg.includes("sistemas") || msg.includes("software")) {
    return RESPONSE_TEMPLATES.ingenieria(ctx, userMessage);
  }
  if (msg.includes("financiero") || msg.includes("proyección") || msg.includes("retorno") || msg.includes("inversión")) {
    return RESPONSE_TEMPLATES.financiero(ctx, userMessage);
  }
  if (msg.includes("carrera") || msg.includes("estudiar") || msg.includes("elegir")) {
    return RESPONSE_TEMPLATES.carrera(ctx, userMessage);
  }
  if (ctx.userTipo === "padre") {
    return RESPONSE_TEMPLATES.padre(ctx, userMessage);
  }
  if (ctx.userTipo === "traslado") {
    return RESPONSE_TEMPLATES.traslado(ctx, userMessage);
  }
  if (ctx.userTipo === "egresado") {
    return RESPONSE_TEMPLATES.egresado(ctx, userMessage);
  }
  return RESPONSE_TEMPLATES.default(ctx, userMessage);
}

// ─── Markdown renderer ─────────────────────────────────────────────────────
function renderContent(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  let inTable = false;
  let tableRows: string[][] = [];

  function flushTable() {
    if (tableRows.length === 0) return;
    const header = tableRows[0];
    const body = tableRows.slice(2);
    elements.push(
      <div key={key++} className="overflow-x-auto my-2">
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr>
              {header.map((h, i) => (
                <th key={i} className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 text-left border border-gray-200">
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5 text-gray-700 border border-gray-200">
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  }

  function renderInline(t: string) {
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={i} className="font-semibold text-gray-900">
          {p.slice(2, -2)}
        </strong>
      ) : (
        p
      )
    );
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("|")) {
      inTable = true;
      tableRows.push(line.split("|").filter((c) => c !== ""));
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (!line.trim()) {
      elements.push(<div key={key++} className="h-2" />);
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key++} className="flex items-start gap-1.5 text-sm text-gray-700 leading-relaxed">
          <span className="text-[#0059FF] mt-1 flex-shrink-0">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </li>
      );
    } else if (line.startsWith("**Carrera Sugerida:**") || line.startsWith("**Porcentaje") || line.startsWith("**Opciones")) {
      elements.push(
        <div key={key++} className="bg-[#0059FF]/5 border border-[#0059FF]/20 rounded-xl p-3 my-2">
          <p className="text-sm font-medium text-gray-800">{renderInline(line)}</p>
        </div>
      );
    } else {
      elements.push(
        <p key={key++} className="text-sm text-gray-700 leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  }

  if (inTable) flushTable();
  return <div className="space-y-1">{elements}</div>;
}

// ─── Quick chips ──────────────────────────────────────────────────────────
const INITIAL_CHIPS = [
  "Recomiéndame universidades",
  "¿Cuánto ganaré?",
  "Opciones de traslado",
  "Ver becas disponibles",
  "Proyección financiera 5 años",
  "¿Cuál carrera me recomiendas?",
];

const FOLLOWUP_CHIPS = [
  "Habla sobre costos",
  "¿Qué tan difícil es el examen?",
  "Comparar universidades",
  "¿Hay trabajo en mi región?",
  "¿Cuánto dura la carrera?",
  "Opciones de pago a plazos",
];

// Mismo mapeo que app/ai_engine.py (construir_saludo) del backend, para que
// las cuentas Demo (sin usuario real en la BD) y los casos sin conexión
// también reciban un saludo acorde a su rol, no uno genérico.
function saludoLocalPorTipo(tipo: string | undefined): { frase: string; preguntas: string[] } {
  const mapa: Record<string, { frase: string; preguntas: string[] }> = {
    egresado: {
      frase: "Veo que acabas de terminar el colegio y estás eligiendo tu carrera y universidad.",
      preguntas: [
        "¿Qué carrera me conviene según lo que me gusta?",
        "¿Cuáles son las universidades con mejor empleabilidad?",
        "¿Qué becas puedo postular como egresado?",
      ],
    },
    traslado: {
      frase: "Veo que ya estás en la universidad y quieres trasladarte a otra.",
      preguntas: [
        "¿Qué cursos se me convalidarían si me traslado?",
        "¿Qué documentos necesito para un traslado externo?",
        "¿Qué universidades tienen el mejor proceso de convalidación?",
      ],
    },
    padre: {
      frase: "Veo que eres padre o madre de familia, buscando la mejor decisión para tu hijo(a).",
      preguntas: [
        "¿Cuál es el costo total de la carrera a 5 años?",
        "¿Qué universidades tienen mejor relación costo-beneficio?",
        "¿Qué becas o financiamiento existen para reducir el costo?",
      ],
    },
  };
  return mapa[tipo ?? ""] ?? {
    frase: "Cuéntame qué estás buscando y te ayudo a encontrar la mejor opción.",
    preguntas: FOLLOWUP_CHIPS,
  };
}

type Phase = "paywall" | "payment" | "deep-questions" | "chat";

export default function IAPage() {
  const { state, dispatch, selectedChatSessionId, navigate } = useApp();
  const [phase, setPhase] = useState<Phase>(state.user?.iaPremium ? "chat" : "paywall");
  const [deepIdx, setDeepIdx] = useState(0);
  const [deepAnswers, setDeepAnswers] = useState<Record<number, string[]>>({});
  const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; content: string; time: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chips, setChips] = useState(INITIAL_CHIPS);
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [sesionId, setSesionId] = useState<string | undefined>(undefined);
  const [offlineMode, setOfflineMode] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const lastResult = state.testResults[0];
  const careers: CareerResult[] = lastResult?.careers || [];
  const userName = state.user ? `${state.user.nombre} ${state.user.apellido}` : "Estudiante";
  const iaCtx: IAContext = {
    careers,
    userName,
    userTipo: state.user?.tipo || "egresado",
    userRegion: state.user?.region || "Lima",
  };

  useEffect(() => {
    // Auto-scroll SOLO dentro del contenedor de mensajes (nunca la página
    // completa). Antes se usaba bottomRef.scrollIntoView(), que si el
    // contenedor no está bien acotado en altura termina moviendo toda la
    // ventana en vez del chat — eso era el "se baja la página" al enviar.
    const el = messagesContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  // Si el usuario abrió una sesión desde el sidebar de historial, la cargamos
  // (solo si tiene el acceso premium activo; si no, lo mandamos al paywall).
  useEffect(() => {
    if (!selectedChatSessionId) return;
    const found = state.chatSessions.find((s) => s.id === selectedChatSessionId);
    if (found && state.user?.iaPremium) {
      setMessages(found.messages.map((m) => ({ id: m.id, role: m.role, content: m.content, time: m.time })));
      setSesionId(found.id.startsWith("local-") ? undefined : found.id);
      setChips(FOLLOWUP_CHIPS);
      setPhase("chat");
    } else if (found) {
      setPhase("paywall");
    }
  }, [selectedChatSessionId]);

  // Saludo inicial personalizado: nombre + rol elegido al registrarse
  // (egresado / traslado / padre) + preguntas sugeridas para ese perfil.
  useEffect(() => {
    if (phase !== "chat" || messages.length > 0) return;

    async function cargarSaludo() {
      let fraseRol = "Cuéntame qué estás buscando y te ayudo a encontrar la mejor opción.";
      let preguntas = FOLLOWUP_CHIPS;

      if (state.user?.id && !state.user.isDemo) {
        try {
          const res = await api.saludoIA(state.user.id);
          fraseRol = res.saludo.replace(/^¡Hola,?\s*[^!]*!\s*/i, ""); // ya ponemos el nombre abajo, evitamos duplicarlo
          preguntas = res.preguntas_sugeridas;
        } catch {
          const local = saludoLocalPorTipo(state.user.tipo);
          fraseRol = local.frase;
          preguntas = local.preguntas;
        }
      } else if (state.user?.tipo) {
        const local = saludoLocalPorTipo(state.user.tipo);
        fraseRol = local.frase;
        preguntas = local.preguntas;
      }

      const greeting = `¡Hola${state.user ? `, ${state.user.nombre}` : ""}! Soy tu orientador vocacional con inteligencia artificial. 🎓

${fraseRol}

${careers.length > 0 ? `Tu carrera con mayor afinidad es **${careers[0].career}** (${careers[0].pct}% de afinidad). ¿Exploramos juntos las mejores opciones?` : "¿Por dónde quieres empezar?"}`;

      setMessages([{ id: "welcome", role: "assistant", content: greeting, time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) }]);
      setChips(preguntas);
    }

    cargarSaludo();
  }, [phase]);

  async function handlePay() {
    if (!cardNum || !cardName || !expiry || !cvv) return;
    if (!state.user || state.user.isDemo || !state.user.id) {
      setPayError("Estás en modo Demo. Crea una cuenta real (o inicia sesión) para poder pagar el acceso premium.");
      return;
    }
    setPayError(null);
    setPaying(true);
    try {
      await api.desbloquearPremium(state.user.id, "tarjeta");
      dispatch({ type: "UNLOCK_IA_PREMIUM" });
      setPhase("deep-questions");
    } catch (err) {
      setPayError(
        err instanceof api.ApiError
          ? `No se pudo procesar el pago: ${err.message}`
          : "No se pudo conectar con el servidor. Revisa que el backend (uvicorn) esté corriendo."
      );
    } finally {
      setPaying(false);
    }
  }

  function handleDeepAnswer(value: string) {
    const q = iaDeepQuestions[deepIdx];
    const updated = { ...deepAnswers, [q.id]: [value] };
    setDeepAnswers(updated);
    setTimeout(() => {
      if (deepIdx < iaDeepQuestions.length - 1) {
        setDeepIdx((i) => i + 1);
      } else {
        setPhase("chat");
      }
    }, 300);
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isTyping) return;
    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: text,
      time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
    };
    const historyBeforeReply = [...messages, userMsg];
    setMessages(historyBeforeReply);
    setInput("");
    setIsTyping(true);
    setChips(FOLLOWUP_CHIPS);

    let replyText: string;
    let usedBackend = false;
    // OJO: usamos una variable local (no el estado `sesionId` directamente)
    // porque setSesionId() es asíncrono — si leyéramos el estado más abajo,
    // en este mismo call todavía tendría el valor viejo (closure obsoleto),
    // y cada mensaje terminaba guardándose bajo un id de sesión distinto,
    // rompiendo tanto el historial del sidebar como la continuidad del chat.
    let idSesionActual = sesionId;

    if (state.user?.id && !state.user.isDemo) {
      try {
        const res = await api.chatIA(state.user.id, text, idSesionActual);
        replyText = res.answer;
        idSesionActual = res.sesion_id;
        setSesionId(res.sesion_id);
        usedBackend = true;
        setOfflineMode(false);
      } catch {
        // Backend caído o sin conexión: seguimos funcionando con el motor local
        // para que el chat nunca se quede "colgado" en la demo.
        replyText = generateIAResponse(text, iaCtx);
        setOfflineMode(true);
      }
    } else {
      // Cuenta demo: no tiene id real en la BD, usamos siempre el motor local.
      replyText = generateIAResponse(text, iaCtx);
    }

    const assistantMsg = {
      id: (Date.now() + 1).toString(),
      role: "assistant" as const,
      content: replyText,
      time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
    };
    const finalHistory = [...historyBeforeReply, assistantMsg];
    setMessages(finalHistory);

    // Guardamos la sesión localmente (para el sidebar de historial) con un id
    // propio por conversación. Si ya hablamos con el backend, usamos su
    // sesion_id real (siempre el mismo durante toda la conversación); si no,
    // usamos un id local estable para no perder el hilo.
    const idParaGuardar = usedBackend && idSesionActual ? idSesionActual : `local-${idSesionActual ?? userMsg.id}`;
    dispatch({
      type: "SAVE_CHAT_SESSION",
      session: {
        id: idParaGuardar,
        type: "ia",
        title: finalHistory[0]?.content.slice(0, 48) || `Sesión IA — ${new Date().toLocaleDateString("es-PE")}`,
        date: new Date().toISOString(),
        messages: finalHistory,
      },
    });
    setIsTyping(false);
  }

  // ─── PAYWALL ──────────────────────────────────────────────────────────────
  if (phase === "paywall") {
    return (
      <div className="min-h-screen bg-[#F4F6F9] py-8 px-4">
        <div className="max-w-lg mx-auto">
          <StepProgress steps={IA_STEPS} current={0} />
          <div className="bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-3xl p-7 text-white mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Brain size={28} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">ElijePe IA</span>
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">PREMIUM</span>
                </div>
                <p className="text-purple-200 text-sm">Tu orientador vocacional con IA</p>
              </div>
            </div>

            <div className="text-center py-4 mb-4">
              <p className="text-5xl font-black mb-1">S/. 10.00</p>
              <p className="text-purple-200 text-sm">Pago único · Acceso de por vida</p>
            </div>

            <ul className="space-y-2.5 mb-6">
              {[
                { icon: <Brain size={15} />, text: "Análisis psicológico profundo de tu perfil" },
                { icon: <TrendingUp size={15} />, text: "Cruce con datos reales MTPE y SUNEDU 2025" },
                { icon: <DollarSign size={15} />, text: "Proyección financiera a 5 años por carrera" },
                { icon: <User size={15} />, text: "Perfil psicológico vocacional detallado" },
                { icon: <Building2 size={15} />, text: "Recomendación personalizada de 3 universidades" },
                { icon: <MessageCircle size={15} />, text: "Chat ilimitado con IA de orientación 24/7" },
                { icon: <User size={15} />, text: "Chat personalizado con especialistas humanos" },
                { icon: <Users size={15} />, text: "Crea tus propios foros en la Comunidad" },
              ].map((b) => (
                <li key={b.text} className="flex items-center gap-2.5 text-sm text-purple-100">
                  <div className="text-yellow-300 flex-shrink-0">{b.icon}</div>
                  {b.text}
                </li>
              ))}
            </ul>

            {careers.length > 0 && (
              <div className="bg-white/10 rounded-xl p-3 mb-5">
                <p className="text-xs text-purple-200 mb-2 font-medium">Tu perfil actual (test básico):</p>
                {careers.slice(0, 2).map((c) => (
                  <div key={c.career} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{c.career}</span>
                    <span className="text-yellow-300 font-bold text-sm">{c.pct}%</span>
                  </div>
                ))}
              </div>
            )}

            {state.user?.isDemo && (
              <div className="bg-white/15 border border-white/25 rounded-xl p-3 mb-4 flex items-start gap-2">
                <Lock size={14} className="flex-shrink-0 mt-0.5 text-yellow-300" />
                <p className="text-xs text-purple-100">
                  Estás con una cuenta <strong>Demo</strong>: no se puede comprar el acceso premium
                  con ella. Crea una cuenta real o inicia sesión para desbloquear ElijePe IA.
                </p>
              </div>
            )}

            <button
              onClick={() => (state.user?.isDemo ? navigate("auth") : setPhase("payment"))}
              className="w-full py-3.5 bg-white text-[#7C3AED] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors text-base"
            >
              <Lock size={18} />
              {state.user?.isDemo ? "Crear cuenta para desbloquear" : "Desbloquear ElijePe IA"}
              <ChevronRight size={16} />
            </button>
          </div>

          <p className="text-center text-xs text-gray-400">
            Pago seguro mediante pasarela SSL cifrada. Sin suscripción ni cobros recurrentes.
          </p>
        </div>
      </div>
    );
  }

  // ─── PAYMENT ──────────────────────────────────────────────────────────────
  if (phase === "payment") {
    return (
      <div className="min-h-screen bg-[#F4F6F9] py-8 px-4">
        <div className="max-w-md mx-auto">
          <StepProgress steps={IA_STEPS} current={1} />
          <button onClick={() => setPhase("paywall")} className="flex items-center gap-1 text-gray-500 text-sm mb-5 hover:text-gray-700">
            <ChevronLeft size={16} />
            Volver
          </button>
          <GuideCallout storageKey="ia-payment" title="Solo 4 datos" color="purple">
            El pago es único (no es una suscripción). Después de esto no se te va a volver a
            pedir pagar por esto.
          </GuideCallout>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Datos de pago</h2>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">SSL seguro</span>
              </div>
            </div>

            <div className="bg-[#F4F6F9] rounded-xl p-4 mb-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">ElijePe IA Premium</p>
                <p className="text-xs text-gray-500">Pago único, sin suscripción</p>
              </div>
              <span className="text-xl font-black text-[#7C3AED]">S/. 10.00</span>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Número de tarjeta</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/30 focus:border-[#0059FF]"
                    placeholder="0000 0000 0000 0000"
                    value={cardNum}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNum(v.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    maxLength={19}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nombre en la tarjeta</label>
                <input
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/30 focus:border-[#0059FF]"
                  placeholder="NOMBRE APELLIDO"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Vencimiento</label>
                  <input
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/30 focus:border-[#0059FF]"
                    placeholder="MM/YY"
                    value={expiry}
                    maxLength={5}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                      setExpiry(v);
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">CVV</label>
                  <input
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/30 focus:border-[#0059FF]"
                    placeholder="123"
                    value={cvv}
                    maxLength={4}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    type="password"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-center mb-5">
              {["VISA", "Mastercard", "Yape", "Plin"].map((b) => (
                <span key={b} className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-medium">
                  {b}
                </span>
              ))}
            </div>

            {payError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2.5 mb-4">
                <Lock size={13} className="flex-shrink-0 mt-0.5" /> {payError}
                {state.user?.isDemo && (
                  <button onClick={() => navigate("auth")} className="ml-auto underline font-semibold shrink-0">
                    Crear cuenta
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={paying || !cardNum || !cardName || !expiry || !cvv}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                paying || !cardNum || !cardName || !expiry || !cvv
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#7C3AED] text-white hover:bg-purple-700 shadow-sm"
              }`}
            >
              {paying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Pagar S/. 10.00
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── DEEP QUESTIONS ───────────────────────────────────────────────────────
  if (phase === "deep-questions") {
    const dq = iaDeepQuestions[deepIdx];
    const selected = deepAnswers[dq.id] || [];
    const pct = Math.round(((deepIdx + 1) / iaDeepQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-[#F4F6F9] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <StepProgress steps={IA_STEPS} current={2} />
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#4F46E5] rounded-2xl p-4 mb-4 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles size={16} className="text-yellow-300" />
              <span className="font-bold text-sm tracking-wide">ANÁLISIS IA PROFUNDO</span>
            </div>
            <p className="text-purple-200 text-xs">Estas preguntas refinan tu perfil al 95%+ de precisión</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Pregunta {deepIdx + 1} de {iaDeepQuestions.length}</span>
              <span className="text-sm font-bold text-[#7C3AED]">{pct}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7C3AED] rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 flex items-center justify-center">
                <Brain size={16} className="text-[#7C3AED]" />
              </div>
              <span className="text-xs font-semibold text-[#7C3AED] uppercase tracking-wide">{dq.block}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-5 leading-snug">{dq.question}</h2>

            <div className="grid gap-2">
              {dq.options.map((opt) => {
                const isSelected = selected.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleDeepAnswer(opt.value)}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                      isSelected
                        ? "bg-[#7C3AED]/5 border-[#7C3AED] text-[#7C3AED]"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#7C3AED]/40 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                          isSelected ? "bg-[#7C3AED] border-[#7C3AED]" : "border-gray-300"
                        }`}
                      />
                      {opt.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setDeepIdx((i) => Math.max(0, i - 1))}
              disabled={deepIdx === 0}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Atrás
            </button>
            <button
              onClick={() => {
                if (deepIdx < iaDeepQuestions.length - 1) setDeepIdx((i) => i + 1);
                else setPhase("chat");
              }}
              className="flex items-center gap-1 text-gray-400 text-sm px-3 py-2.5 hover:text-gray-600"
            >
              <SkipForward size={14} />
              Omitir
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── CHAT ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F4F6F9]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-xl flex items-center justify-center">
          <Brain size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">ElijePe IA</span>
            <span className="text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full font-bold">PREMIUM</span>
          </div>
          <p className="text-xs text-gray-500 truncate">
            Orientador vocacional para {state.user?.nombre || "ti"}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {offlineMode ? (
            <>
              <WifiOff size={13} className="text-amber-500" />
              <span className="text-xs text-amber-600" title="No se pudo contactar al backend; usando respuestas locales">Modo local</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span className="text-xs text-gray-500">En línea</span>
            </>
          )}
        </div>
      </div>

      {/* Desktop layout wrapper */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar (desktop only) */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 p-4 flex-shrink-0">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Tu perfil</h3>
          {state.user && (
            <div className="bg-[#F4F6F9] rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#0059FF]/10 rounded-full flex items-center justify-center">
                  <User size={16} className="text-[#0059FF]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{state.user.nombre}</p>
                  <p className="text-xs text-gray-500 capitalize">{state.user.tipo}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">📍 {state.user.region}</p>
            </div>
          )}

          {careers.length > 0 && (
            <>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Top carreras</h3>
              <div className="space-y-2 mb-4">
                {careers.slice(0, 3).map((c, i) => (
                  <div key={c.career} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 truncate mr-2">{c.career}</span>
                    <span className="font-bold text-[#0059FF] flex-shrink-0">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Preguntas rápidas</h3>
          <div className="space-y-1.5">
            {INITIAL_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="w-full text-left text-xs text-gray-600 bg-[#F4F6F9] hover:bg-blue-50 hover:text-[#0059FF] px-3 py-2 rounded-lg transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#0059FF] text-white rounded-tr-sm"
                      : "bg-white border border-gray-100 rounded-tl-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    renderContent(msg.content)
                  )}
                  <p className={`text-xs mt-1.5 ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain size={14} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chips */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="flex-shrink-0 text-xs bg-white border border-gray-200 text-gray-600 hover:border-[#0059FF] hover:text-[#0059FF] hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors font-medium"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex gap-2 flex-shrink-0">
            <input
              className="flex-1 bg-[#F4F6F9] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/30 text-gray-900 placeholder-gray-400"
              placeholder="Escribe tu consulta vocacional..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                input.trim() && !isTyping
                  ? "bg-[#0059FF] text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
