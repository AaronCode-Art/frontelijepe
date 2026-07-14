import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { universities, getDistance } from "@/data/universities";
import type { University } from "@/types";
import {
  ArrowLeft, Heart, GitCompareArrows, Share2, Star, MapPin,
  Briefcase, BookOpen, Calendar, CheckCircle, ExternalLink,
  ChevronRight, TrendingUp, ClipboardCheck, X, Sparkles,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import CompareBar from "@/components/CompareBar";

type TabId = "malla" | "costos" | "empleabilidad" | "ubicacion";

const CICLOS: Record<string, string[]> = {
  "I":   ["Introducción a la Administración", "Matemáticas Básicas", "Redacción Académica", "Informática Básica"],
  "II":  ["Contabilidad General", "Estadística I", "Economía General", "Inglés I"],
  "III": ["Finanzas I", "Marketing I", "Gestión de RRHH", "Estadística II"],
  "IV":  ["Finanzas II", "Investigación de Mercados", "Derecho Empresarial", "Proyectos de Inversión"],
};

const SALARY_DATA = [
  { area: "Administración", min: 2200, max: 4800 },
  { area: "Ingeniería", min: 3000, max: 6500 },
  { area: "Salud", min: 2800, max: 5200 },
  { area: "Humanidades", min: 1800, max: 3400 },
  { area: "Tecnología", min: 3500, max: 7200 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600 font-medium">{rating.toFixed(1)}</span>
    </span>
  );
}

function formatMoney(n: number) {
  if (n === 0) return "Gratuita";
  return `S/. ${n.toLocaleString("es-PE")}`;
}

export default function DetallePage() {
  const { state, navigate, selectedUniId, dispatch } = useApp();
  const uni: University = universities.find((u) => u.id === selectedUniId) || universities[0];

  const [activeTab, setActiveTab] = useState<TabId>("malla");
  const [isFav, setIsFav] = useState(state.favorites.includes(uni.id));
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [tooltipCourse, setTooltipCourse] = useState<string | null>(null);
  const [showPostular, setShowPostular] = useState(false);
  const [carreraPostular, setCarreraPostular] = useState("");
  const [postulado, setPostulado] = useState(false);

  useEffect(() => {
    setIsFav(state.favorites.includes(uni.id));
  }, [uni.id, state.favorites]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
      );
    }
  }, []);

  const years = [2021, 2022, 2023, 2024, 2025];
  const costHistoryData = years.map((y, i) => ({ year: String(y), cost: uni.costHistory[i] }));

  const yaPostulado = state.postulaciones.some((p) => p.uniId === uni.id);

  function confirmarPostulacion() {
    if (!carreraPostular.trim()) return;
    dispatch({
      type: "ADD_POSTULACION",
      postulacion: {
        id: `post-${Date.now()}`,
        uniId: uni.id,
        uniName: uni.name,
        carrera: carreraPostular.trim(),
        estado: "reservado",
        fecha: new Date().toISOString(),
      },
    });
    setPostulado(true);
    setTimeout(() => {
      setShowPostular(false);
      setPostulado(false);
      setCarreraPostular("");
    }, 1800);
  }

  // Projected cost 5 more years at 8%
  const lastCost = uni.costHistory[4] || 0;
  const projectedCosts = [1, 2, 3, 4, 5].map((n) => ({
    year: String(2025 + n),
    cost: Math.round(lastCost * Math.pow(1.08, n)),
  }));

  const totalCareerCost = uni.type === "Pública"
    ? 0
    : uni.pensionMax * 10 * 5; // 10 months * 5 years

  const nearbyUnis = universities
    .filter((u) => u.region === uni.region && u.id !== uni.id)
    .sort((a, b) => {
      const da = getDistance(uni.lat, uni.lng, a.lat, a.lng);
      const db = getDistance(uni.lat, uni.lng, b.lat, b.lng);
      return da - db;
    })
    .slice(0, 3);

  const distanceFromUser = userPos
    ? getDistance(userPos.lat, userPos.lng, uni.lat, uni.lng)
    : null;

  const TABS: { id: TabId; label: string }[] = [
    { id: "malla", label: "Malla Curricular" },
    { id: "costos", label: "Costos Históricos" },
    { id: "empleabilidad", label: "Empleabilidad" },
    { id: "ubicacion", label: "Ubicación" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-32">
      {/* Back */}
      <button
        onClick={() => navigate("explorar")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors"
      >
        <ArrowLeft size={16} /> Volver a explorar
      </button>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <img
          src={`https://images.unsplash.com/${uni.img}?auto=format&fit=crop&w=1200&h=400&q=80`}
          alt={uni.name}
          className="w-full h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Action buttons top-right */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => { dispatch({ type: "TOGGLE_FAV", id: uni.id }); setIsFav((v) => !v); }}
            className={`p-2.5 rounded-xl backdrop-blur-sm border transition-all
              ${isFav ? "bg-red-500 border-red-500 text-white" : "bg-white/20 border-white/30 text-white hover:bg-white/30"}`}
          >
            <Heart size={16} className={isFav ? "fill-white" : ""} />
          </button>
          <button
            onClick={() => dispatch({ type: "TOGGLE_COMPARE", id: uni.id })}
            className={`p-2.5 rounded-xl backdrop-blur-sm border transition-all
              ${state.compareList.includes(uni.id)
                ? "bg-blue-500 border-blue-500 text-white"
                : "bg-white/20 border-white/30 text-white hover:bg-white/30"}`}
          >
            <GitCompareArrows size={16} />
          </button>
          <button className="p-2.5 rounded-xl bg-white/20 border border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all">
            <Share2 size={16} />
          </button>
        </div>

        {/* Badges bottom-left */}
        <div className="absolute bottom-20 left-5 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border
            ${uni.type === "Pública"
              ? "bg-green-500/80 text-white border-green-400"
              : "bg-blue-500/80 text-white border-blue-400"}`}>
            {uni.type}
          </span>
          {uni.sunedu && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm flex items-center gap-1">
              <CheckCircle size={11} /> SUNEDU
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            {uni.modalidad}
          </span>
        </div>

        {/* Name */}
        <div className="absolute bottom-5 left-5 right-5">
          <h1 className="text-2xl font-bold text-white leading-tight">{uni.name}</h1>
          <p className="text-white/70 text-sm">{uni.short}</p>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { icon: <MapPin size={15} />, value: `${uni.city}, ${uni.region}`, label: "Ubicación" },
          { icon: <Star size={15} />, value: <StarRating rating={uni.rating} />, label: "Rating" },
          { icon: <Briefcase size={15} />, value: `${uni.empleabilidad}%`, label: "Empleabilidad" },
          { icon: <BookOpen size={15} />, value: `${uni.careers} carreras`, label: "Oferta" },
          { icon: <Calendar size={15} />, value: String(uni.founded), label: "Fundación" },
        ].map(({ icon, value, label }, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 px-3 py-3 flex flex-col items-center text-center shadow-sm">
            <div className="text-blue-500 mb-1">{icon}</div>
            <div className="text-sm font-semibold text-gray-800">{value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-3 text-sm font-medium transition-all
                ${activeTab === t.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* TAB 1: MALLA */}
          {activeTab === "malla" && (
            <div className="space-y-4">
              {Object.entries(CICLOS).map(([ciclo, cursos]) => (
                <div key={ciclo}>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Ciclo {ciclo}</p>
                  <div className="flex flex-wrap gap-2">
                    {cursos.map((curso) => (
                      <div key={curso} className="relative">
                        <button
                          className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800 font-medium hover:bg-blue-100 transition-colors"
                          onMouseEnter={() => setTooltipCourse(curso)}
                          onMouseLeave={() => setTooltipCourse(null)}
                        >
                          {curso}
                        </button>
                        {tooltipCourse === curso && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                            4.0 créditos
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: COSTOS */}
          {activeTab === "costos" && (
            <div>
              {uni.type === "Pública" ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Universidad Gratuita</p>
                      <p className="text-sm text-green-600">Ingreso por concurso de admisión</p>
                    </div>
                  </div>
                  <ul className="space-y-1.5">
                    {["Matrícula gratuita", "Sin pensiones mensuales", "Exoneración de derechos académicos", "Comedor universitario subvencionado"].map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle size={13} /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Pensión mínima</p>
                      <p className="text-lg font-bold text-gray-800">{formatMoney(uni.pensionMin)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Pensión máxima</p>
                      <p className="text-lg font-bold text-gray-800">{formatMoney(uni.pensionMax)}</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Costo total 5 años</p>
                      <p className="text-lg font-bold text-blue-700">{formatMoney(totalCareerCost)}</p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-700 mb-3">Historial 2021–2025 (pensión máxima)</p>
                  <div className="space-y-2 mb-6">
                    {costHistoryData.map(({ year, cost }) => {
                      const max = Math.max(...uni.costHistory);
                      const pct = max > 0 ? (cost / max) * 100 : 0;
                      return (
                        <div key={year} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-10">{year}</span>
                          <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 w-20 text-right">{formatMoney(cost)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={15} className="text-amber-600" />
                      <p className="text-sm font-semibold text-amber-800">Proyección 5 años (8% anual)</p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {projectedCosts.map(({ year, cost }) => (
                        <div key={year} className="text-center">
                          <p className="text-xs text-amber-600">{year}</p>
                          <p className="text-sm font-bold text-amber-800">{formatMoney(cost)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: EMPLEABILIDAD */}
          {activeTab === "empleabilidad" && (
            <div>
              {/* Gauge */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg viewBox="0 0 120 120" className="w-full h-full">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                    <circle
                      cx="60" cy="60" r="48" fill="none"
                      stroke="#0059FF" strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - uni.empleabilidad / 100)}`}
                      transform="rotate(-90 60 60)"
                    />
                    <text x="60" y="55" textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827">
                      {uni.empleabilidad}%
                    </text>
                    <text x="60" y="72" textAnchor="middle" fontSize="9" fill="#6B7280">empleabilidad</text>
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800 mb-1">Índice de Empleabilidad</p>
                  <p className="text-sm text-gray-500 mb-3">{uni.short} tiene un {uni.empleabilidad}% de inserción laboral.</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 inline-block">
                    <p className="text-sm font-semibold text-blue-800">
                      83% trabaja en su área a los 12 meses
                    </p>
                  </div>
                </div>
              </div>

              {/* Sector breakdown */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Distribución por sector</p>
              <div className="space-y-2.5 mb-6">
                {[
                  { label: "Sector Privado", pct: 48, color: "bg-blue-500" },
                  { label: "Sector Público", pct: 35, color: "bg-purple-500" },
                  { label: "Emprendimiento", pct: 12, color: "bg-amber-500" },
                  { label: "Investigación", pct: 5, color: "bg-green-500" },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-32">{label}</span>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Salary chart */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Rango salarial por área (S/.)</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={SALARY_DATA} layout="vertical" margin={{ left: 80, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="area" type="category" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip formatter={(v: number) => `S/. ${v.toLocaleString()}`} />
                  <Bar dataKey="min" fill="#BFDBFE" name="Mínimo" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="max" fill="#0059FF" name="Máximo" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <button
                onClick={() => navigate("simulador")}
                className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <ChevronRight size={16} /> Simular convalidación
              </button>
            </div>
          )}

          {/* TAB 4: UBICACIÓN */}
          {activeTab === "ubicacion" && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Ciudad</p>
                  <p className="font-semibold text-gray-800">{uni.city}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Región</p>
                  <p className="font-semibold text-gray-800">{uni.region}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Coordenadas</p>
                  <p className="font-mono text-sm text-gray-700">{uni.lat.toFixed(4)}, {uni.lng.toFixed(4)}</p>
                </div>
                {distanceFromUser !== null && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Distancia desde ti</p>
                    <p className="font-semibold text-blue-700">{distanceFromUser.toFixed(1)} km</p>
                  </div>
                )}
              </div>

              {/* Map placeholder */}
              <div className="rounded-xl bg-gray-100 border border-gray-200 h-36 flex flex-col items-center justify-center mb-5 gap-2">
                <MapPin size={24} className="text-gray-400" />
                <p className="text-sm text-gray-500">Vista de mapa disponible</p>
                <button
                  onClick={() => navigate("mapa")}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <ExternalLink size={12} /> Ver en mapa
                </button>
              </div>

              {nearbyUnis.length > 0 && (
                <>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Universidades cercanas en {uni.region}
                  </p>
                  <div className="space-y-2">
                    {nearbyUnis.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => navigate("detalle", u.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-all text-left"
                      >
                        <img
                          src={`https://images.unsplash.com/${u.img}?auto=format&fit=crop&w=60&h=60&q=70`}
                          alt={u.short}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.city} · {getDistance(uni.lat, uni.lng, u.lat, u.lng).toFixed(1)} km</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA: Postular / reservar vacante en esta universidad */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="bg-gradient-to-r from-[#0059FF] to-[#7C3AED] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div>
            <p className="font-bold text-lg flex items-center gap-2">
              <ClipboardCheck size={20} /> ¿Listo para dar el siguiente paso?
            </p>
            <p className="text-sm text-white/80 mt-1">
              Reserva tu vacante en {uni.short} y te contactamos para guiarte en el proceso de admisión.
            </p>
          </div>
          <button
            onClick={() => setShowPostular(true)}
            disabled={yaPostulado}
            className="shrink-0 px-6 py-3 rounded-xl bg-white text-[#0059FF] font-semibold hover:bg-blue-50 transition-colors disabled:opacity-70 disabled:cursor-default"
          >
            {yaPostulado ? "✓ Ya reservaste tu vacante" : "Postular / Reservar vacante"}
          </button>
        </div>
      </div>

      {showPostular && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowPostular(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowPostular(false)}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="titulo-postular" className="bg-white rounded-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {!postulado ? (
              <>
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-[#0059FF]" />
                    <h3 id="titulo-postular" className="font-bold text-gray-900">Reservar vacante en {uni.short}</h3>
                  </div>
                  <button onClick={() => setShowPostular(false)} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Carrera de interés</label>
                    <input
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20"
                      placeholder="Ej. Ingeniería de Sistemas"
                      value={carreraPostular}
                      onChange={(e) => setCarreraPostular(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Esto no es un pago ni una matrícula: es una preinscripción para que un asesor de {uni.short}
                    y nuestro equipo de especialistas te contacten con los siguientes pasos del proceso de admisión.
                  </p>
                </div>
                <div className="flex gap-3 px-5 pb-5">
                  <button onClick={() => setShowPostular(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
                  <button
                    onClick={confirmarPostulacion}
                    disabled={!carreraPostular.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-[#0059FF] text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40"
                  >
                    Confirmar
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-600" />
                </div>
                <p className="font-bold text-gray-900 mb-1">¡Vacante reservada!</p>
                <p className="text-sm text-gray-500">Puedes ver el estado de tu postulación en tu perfil.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <CompareBar />
    </div>
  );
}
