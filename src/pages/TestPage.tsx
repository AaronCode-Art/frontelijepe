import { useState } from "react";
import { motion } from "motion/react";
import { useApp } from "@/context/AppContext";
import type { CareerResult } from "@/types";
import { testQuestions, iaDeepQuestions, CLUSTERS, CAREER_MAP } from "@/data/testQuestions";
import { universities } from "@/data/universities";
import { guardarResultadoTest, predecirML, type PrediccionML } from "@/services/api";
import {
  Rocket, ChevronLeft, ChevronRight, SkipForward, CheckCircle2,
  Trophy, Star, BookOpen, Brain, Users, DollarSign, GraduationCap,
  Target, TrendingUp, Building2, Sparkles, ArrowRight, RotateCcw,
} from "lucide-react";

// ─── Scoring ────────────────────────────────────────────────────────────────
function computeResults(answers: Record<number, string[]>): CareerResult[] {
  const clusterScores: Record<string, number> = {};
  testQuestions.forEach((q) => {
    const selected = answers[q.id] || [];
    selected.forEach((val) => {
      const opt = q.options.find((o) => o.value === val);
      if (opt) {
        Object.entries(opt.weights).forEach(([cluster, score]) => {
          clusterScores[cluster] = (clusterScores[cluster] || 0) + score;
        });
      }
    });
  });
  const results: CareerResult[] = [];
  Object.entries(clusterScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([cluster, score]) => {
      const careers = CAREER_MAP[cluster] || [];
      careers.slice(0, 2).forEach((c) => {
        results.push({ career: c.name, cluster: CLUSTERS[cluster], score, pct: 0, unis: c.unis });
      });
    });
  const maxScore = results[0]?.score || 1;
  results.forEach((r) => {
    r.pct = Math.min(98, Math.round((r.score / maxScore) * 85 + 10));
  });
  return results.slice(0, 6);
}

// ─── Block metadata ─────────────────────────────────────────────────────────
const BLOCK_ICONS: Record<string, React.ReactNode> = {
  "Intereses y Aficiones": <Star size={16} />,
  "Habilidades y Capacidades": <Brain size={16} />,
  "Entorno Laboral": <Building2 size={16} />,
  "Valores y Motivaciones": <Target size={16} />,
  "Estilo de Aprendizaje": <BookOpen size={16} />,
  "Contexto Socioeconómico": <DollarSign size={16} />,
  "Contexto Académico Actual": <GraduationCap size={16} />,
  "Expectativas Profesionales": <TrendingUp size={16} />,
};

const ALL_BLOCKS = [
  "Intereses y Aficiones",
  "Habilidades y Capacidades",
  "Entorno Laboral",
  "Valores y Motivaciones",
  "Estilo de Aprendizaje",
  "Contexto Socioeconómico",
  "Contexto Académico Actual",
  "Expectativas Profesionales",
];

const RANK_COLORS = [
  { bar: "#F59E0B", label: "text-yellow-600", badge: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { bar: "#9CA3AF", label: "text-gray-500", badge: "bg-gray-50 text-gray-600 border-gray-200" },
  { bar: "#D97706", label: "text-amber-600", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { bar: "#0059FF", label: "text-blue-600", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  { bar: "#7C3AED", label: "text-purple-600", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  { bar: "#059669", label: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

type Phase = "intro" | "test" | "results";

export default function TestPage() {
  const { state, dispatch, navigate } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>(state.currentTestAnswers || {});
  const [phase, setPhase] = useState<Phase>("intro");
  const [results, setResults] = useState<CareerResult[]>([]);
  const [saved, setSaved] = useState(false);
  const [mlRanking, setMlRanking] = useState<PrediccionML[] | null>(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlInfo, setMlInfo] = useState<{ tipo: string; muestras_entrenamiento: number; accuracy_test: number } | null>(null);

  const q = testQuestions[currentQuestion];
  const totalQuestions = testQuestions.length;
  const progressPct = Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  const currentBlockIdx = ALL_BLOCKS.indexOf(q?.block ?? "");
  const answeredCount = Object.keys(answers).length;

  // ─── Handlers ─────────────────────────────────────────────────────────────
  function toggleOption(value: string) {
    const current = answers[q.id] || [];
    let next: string[];
    if (q.type === "multi") {
      next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    } else {
      next = [value];
    }
    const updated = { ...answers, [q.id]: next };
    setAnswers(updated);
    dispatch({ type: "SET_TEST_ANSWER", step: q.id, answers: next });

    if (q.type === "single" || q.type === "scale") {
      setTimeout(() => advance(updated), 300);
    }
  }

  function advance(ans = answers) {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((c) => c + 1);
    } else {
      finishTest(ans);
    }
  }

  function goBack() {
    if (currentQuestion > 0) setCurrentQuestion((c) => c - 1);
  }

  function skip() {
    advance();
  }

  function finishTest(ans = answers) {
    const computed = computeResults(ans);
    setResults(computed);
    setPhase("results");

    // Se guarda de inmediato en el backend para que el chat de IA ya lo vea
    // en el momento, sin depender de que el usuario presione "Guardar".
    if (state.user?.id) {
      guardarResultadoTest(state.user.id, ans, computed).catch((err) =>
        console.error("No se pudo guardar el resultado del test en el backend:", err)
      );
    }

    // Predicción con un modelo de Machine Learning real (Random Forest)
    // entrenado en el backend, además del cálculo local por suma de pesos.
    setMlLoading(true);
    predecirML(ans)
      .then((r) => {
        setMlRanking(r.ranking);
        setMlInfo(r.modelo);
      })
      .catch((err) => console.error("No se pudo obtener la predicción de Machine Learning:", err))
      .finally(() => setMlLoading(false));
  }

  function saveResults() {
    const result = {
      date: new Date().toISOString(),
      answers,
      careers: results,
    };
    dispatch({ type: "SAVE_TEST_RESULT", result });
    setSaved(true);
  }

  function restartTest() {
    setCurrentQuestion(0);
    setAnswers({});
    dispatch({ type: "CLEAR_TEST" });
    setPhase("intro");
    setSaved(false);
    setResults([]);
  }

  // ─── INTRO PHASE ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 text-center"
          >
            <div className="w-20 h-20 bg-[#0059FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket size={36} className="text-[#0059FF]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Vocacional ElijePe</h1>
            <p className="text-gray-500 mb-1">38 preguntas · 8 bloques · ~10 min</p>
            <p className="text-gray-600 text-sm mb-6">
              Descubre qué carreras universitarias se alinean con tus intereses, habilidades y contexto personal.
              Nuestro algoritmo analiza múltiples dimensiones para darte resultados precisos.
            </p>

            {/* Blocks overview */}
            <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-2 mb-6 text-left">
              {ALL_BLOCKS.map((block) => (
                <motion.div key={block} variants={fadeUp} className="flex items-center gap-2 p-2 rounded-lg bg-[#F4F6F9]">
                  <div className="w-7 h-7 rounded-full bg-[#0059FF]/10 flex items-center justify-center text-[#0059FF] flex-shrink-0">
                    {BLOCK_ICONS[block]}
                  </div>
                  <span className="text-xs text-gray-700 font-medium leading-tight">{block}</span>
                </motion.div>
              ))}
            </motion.div>

            {answeredCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <RotateCcw size={16} className="text-amber-600" />
                <span className="text-sm text-amber-700">
                  Tienes {answeredCount} preguntas respondidas. Puedes continuar desde donde lo dejaste.
                </span>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (answeredCount > 0) {
                  const lastAnswered = Math.max(
                    ...Object.keys(answers).map(Number).map((id) => testQuestions.findIndex((q) => q.id === id))
                  );
                  setCurrentQuestion(Math.min(lastAnswered + 1, totalQuestions - 1));
                }
                setPhase("test");
              }}
              className="w-full py-3 bg-[#0059FF] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Rocket size={18} />
              {answeredCount > 0 ? "Continuar test" : "Comenzar test"}
            </motion.button>

            {state.testResults.length > 0 && (
              <button
                onClick={() => {
                  setResults(state.testResults[0].careers);
                  setPhase("results");
                }}
                className="w-full mt-3 py-2.5 text-[#0059FF] text-sm font-medium hover:underline"
              >
                Ver resultados anteriores →
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── TEST PHASE ───────────────────────────────────────────────────────────
  if (phase === "test") {
    const selectedAnswers = answers[q.id] || [];
    const isAnswered = selectedAnswers.length > 0;
    const isLast = currentQuestion === totalQuestions - 1;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 py-6 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Pregunta {currentQuestion + 1} de {totalQuestions}
              </span>
              <span className="text-sm font-bold text-[#0059FF]">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[#0059FF] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Block breadcrumb dots */}
            <div className="flex items-center gap-1.5">
              {ALL_BLOCKS.map((block, i) => {
                const blockQuestions = testQuestions.filter((bq) => bq.block === block);
                const blockDone = blockQuestions.every((bq) => answers[bq.id]?.length > 0);
                const isCurrent = i === currentBlockIdx;
                return (
                  <div
                    key={block}
                    title={block}
                    className={`rounded-full transition-all duration-300 ${
                      blockDone
                        ? "w-4 h-4 bg-[#0059FF] flex items-center justify-center"
                        : isCurrent
                        ? "w-4 h-4 bg-[#0059FF]/20 border-2 border-[#0059FF]"
                        : "w-2.5 h-2.5 bg-gray-200"
                    }`}
                  >
                    {blockDone && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                );
              })}
              <span className="ml-2 text-xs text-gray-500 font-medium truncate">{q.block}</span>
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            key={currentQuestion}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#0059FF]/10 flex items-center justify-center text-[#0059FF]">
                {BLOCK_ICONS[q.block]}
              </div>
              <span className="text-xs font-semibold text-[#0059FF] uppercase tracking-wide">{q.block}</span>
              {q.type === "multi" && (
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Selección múltiple</span>
              )}
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-5 leading-snug">{q.question}</h2>

            {/* Scale type */}
            {q.type === "scale" && (
              <div className="flex gap-2">
                {q.options.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleOption(opt.value)}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-200 border-2 ${
                      selectedAnswers.includes(opt.value)
                        ? "bg-[#0059FF] border-[#0059FF] text-white shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#0059FF]/40 hover:bg-blue-50"
                    }`}
                    title={opt.label}
                  >
                    {opt.value}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Single / Multi grid */}
            {(q.type === "single" || q.type === "multi") && (
              <div className={`grid gap-2 ${q.options.length <= 4 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                {q.options.map((opt) => {
                  const selected = selectedAnswers.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleOption(opt.value)}
                      className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${
                        selected
                          ? "bg-[#0059FF]/5 border-[#0059FF] text-[#0059FF]"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#0059FF]/40 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                            selected ? "bg-[#0059FF] border-[#0059FF]" : "border-gray-300"
                          }`}
                        />
                        {opt.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
              Atrás
            </button>

            <button
              onClick={skip}
              className="flex items-center gap-1 px-3 py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              <SkipForward size={14} />
              Omitir
            </button>

            <button
              onClick={() => advance()}
              disabled={!isAnswered && q.type !== "scale"}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isAnswered
                  ? "bg-[#0059FF] text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLast ? (
                <>
                  <CheckCircle2 size={16} />
                  Finalizar test
                </>
              ) : (
                <>
                  Siguiente
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS PHASE ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#0059FF] to-[#7C3AED] rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">¡Tu perfil vocacional está listo!</h1>
          <p className="text-gray-500 text-sm">Basado en tus {Object.keys(answers).length} respuestas</p>
        </motion.div>

        {/* Machine Learning prediction */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={18} className="text-[#7C3AED]" />
            <h2 className="font-bold text-gray-900 text-sm">Confirmado con Machine Learning</h2>
          </div>
          {mlLoading && (
            <p className="text-sm text-gray-400">Consultando el modelo entrenado...</p>
          )}
          {!mlLoading && mlRanking && (
            <>
              <div className="space-y-2">
                {mlRanking.slice(0, 3).map((r) => (
                  <div key={r.cluster} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-700 w-40 truncate">{r.cluster_nombre}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.probabilidad}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" as const }}
                        className="h-full bg-gradient-to-r from-[#7C3AED] to-[#0059FF] rounded-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-12 text-right">{r.probabilidad}%</span>
                  </div>
                ))}
              </div>
              {mlInfo && (
                <p className="text-[11px] text-gray-400 mt-3">
                  Modelo: {mlInfo.tipo}, entrenado con {mlInfo.muestras_entrenamiento.toLocaleString("es-PE")} perfiles
                  simulados (accuracy de prueba: {(mlInfo.accuracy_test * 100).toFixed(0)}%).
                </p>
              )}
            </>
          )}
          {!mlLoading && !mlRanking && (
            <p className="text-sm text-gray-400">No se pudo consultar el modelo de Machine Learning ahora mismo.</p>
          )}
        </div>

        {/* Top 6 Career Cards */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3 mb-6">
          {results.map((r, i) => {
            const rank = RANK_COLORS[i] || RANK_COLORS[5];
            return (
              <motion.div key={r.career} variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                      <h3 className="font-bold text-gray-900 text-base">{r.career}</h3>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${rank.badge}`}>
                      {r.cluster}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${rank.label}`}>{r.pct}%</span>
                    <p className="text-xs text-gray-400">afinidad</p>
                  </div>
                </div>
                {/* Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${r.pct}%`, backgroundColor: rank.bar }}
                  />
                </div>
                {/* Suggested unis */}
                {r.unis.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {r.unis.slice(0, 3).map((uid) => {
                      const uni = universities.find((u) => u.id === uid);
                      if (!uni) return null;
                      return (
                        <span
                          key={uid}
                          className="text-xs bg-[#F4F6F9] text-gray-600 px-2 py-1 rounded-lg font-medium"
                        >
                          {uni.short} — {uni.type}
                        </span>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Actions */}
        <div className="space-y-3 mb-6">
          {!saved ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveResults}
              className="w-full py-3 bg-[#0059FF] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <CheckCircle2 size={18} />
              Guardar resultados
            </motion.button>
          ) : (
            <div className="w-full py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              Resultados guardados
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("comparador")}
            className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Building2 size={18} />
            Ver en el Comparador
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={restartTest}
            className="w-full py-2.5 text-gray-400 text-sm flex items-center justify-center gap-1 hover:text-gray-600 transition-colors"
          >
            <RotateCcw size={14} />
            Reiniciar test
          </motion.button>
        </div>

        {/* IA Upsell — cambia según si ya tiene el acceso premium activo */}
        {state.user?.iaPremium ? (
          <div className="bg-gradient-to-br from-[#0059FF] to-[#0033CC] rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-yellow-300" />
              <span className="font-bold text-lg">ElijePe IA</span>
              <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full font-bold">DESBLOQUEADO</span>
            </div>
            <p className="text-blue-100 text-sm mb-5 leading-relaxed">
              Ya tienes el acceso premium activo. Usa el analizador con IA para cruzar los resultados
              de este test con datos reales de empleabilidad y recibir universidades recomendadas.
            </p>
            <button
              onClick={() => navigate("ia")}
              className="w-full py-3 bg-white text-[#0059FF] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
            >
              Analizador mejorado con IA
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-yellow-300" />
              <span className="font-bold text-lg">ElijePe IA</span>
              <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">PREMIUM</span>
            </div>
            <p className="text-purple-100 text-sm mb-4 leading-relaxed">
              Obtén un análisis profundo con cruce de datos reales del MTPE y SUNEDU, proyecciones salariales
              y recomendaciones personalizadas de universidades. Todo por solo{" "}
              <span className="text-white font-bold">S/. 10.00</span> único pago.
            </p>
            <ul className="space-y-1.5 mb-5">
              {[
                "Análisis psicológico de tu perfil vocacional",
                "Cruce con datos reales de empleabilidad SUNEDU",
                "Proyección financiera a 5 años por carrera",
                "Recomendación personalizada de 3 universidades",
                "Chat ilimitado con tu orientador IA",
                "Chat con especialistas + creación de foros",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-purple-100">
                  <CheckCircle2 size={14} className="text-yellow-300 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("ia")}
              className="w-full py-3 bg-white text-[#7C3AED] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-50 transition-colors"
            >
              Desbloquear ElijePe IA — S/. 10.00
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
