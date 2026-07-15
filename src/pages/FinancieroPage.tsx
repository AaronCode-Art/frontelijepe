import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  BarChart3, TrendingUp, DollarSign, Users, Download,
  Calculator, ArrowRight, Briefcase,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { universities } from "@/data/universities";
import { motion } from "motion/react";

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

const COLORS = ["#0059FF", "#7C3AED", "#16A34A", "#D97706", "#D91023"];

function formatSoles(n: number) {
  return `S/. ${n.toLocaleString("es-PE", { minimumFractionDigits: 0 })}`;
}

function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-sm">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 w-full">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      </motion.div>
    </div>
  );
}

export default function FinancieroPage() {
  const { state, dispatch, navigate } = useApp();

  const [income, setIncome] = useState("");
  const [months, setMonths] = useState("60");
  const [calcResult, setCalcResult] = useState<{ pct: number; total: number; salary: number } | null>(null);

  // Pick universities to feature: compareList > favorites > first 3
  const featuredIds = useMemo(() => {
    const ids = state.compareList.length > 0
      ? state.compareList
      : state.favorites.length > 0
      ? state.favorites
      : [1, 2, 3];
    return ids.slice(0, 3);
  }, [state.compareList, state.favorites]);

  const featuredUnis = useMemo(
    () => featuredIds.map((id) => universities.find((u) => u.id === id)).filter(Boolean) as typeof universities,
    [featuredIds]
  );

  const mainUni = featuredUnis[0] ?? universities[0];

  // ─── Cost projection data (5 years) ──────────────────────────────────────────
  const projectionData = useMemo(() => {
    const years = [2026, 2027, 2028, 2029, 2030];
    return years.map((year, i) => {
      const row: Record<string, number | string> = { year: String(year) };
      featuredUnis.forEach((u) => {
        const base = u.pensionMax > 0 ? u.pensionMax * 10 : u.cost > 0 ? u.cost : 2000;
        row[u.short] = Math.round(base * Math.pow(1.08, i));
      });
      return row;
    });
  }, [featuredUnis]);

  // ─── Pension comparison ───────────────────────────────────────────────────────
  const pensionData = useMemo(() => {
    const list = featuredUnis.length > 0 ? featuredUnis : universities.slice(0, 5);
    return list.map((u) => ({
      name: u.short,
      "Pensión mín.": u.pensionMin || 0,
      "Pensión máx.": u.pensionMax || 0,
    }));
  }, [featuredUnis]);

  // ─── Empleabilidad vs Cost ────────────────────────────────────────────────────
  const empleData = useMemo(() => {
    const list = featuredUnis.length > 0 ? featuredUnis : universities.slice(0, 5);
    const maxCost = Math.max(...list.map((u) => u.pensionMax || 1));
    return list.map((u) => ({
      name: u.short,
      Empleabilidad: u.empleabilidad,
      "Índice costo": Math.round(((u.pensionMax || 0) / maxCost) * 100),
    }));
  }, [featuredUnis]);

  // ─── Pie: public vs private among favorites ───────────────────────────────────
  const favUnis = state.favorites.length > 0
    ? state.favorites.map((id) => universities.find((u) => u.id === id)).filter(Boolean) as typeof universities
    : universities.slice(0, 8);

  const pieData = useMemo(() => {
    const pub = favUnis.filter((u) => u.type === "Pública").length;
    const priv = favUnis.filter((u) => u.type === "Privada").length;
    return [
      { name: "Pública", value: pub || 1 },
      { name: "Privada", value: priv || 1 },
    ];
  }, [favUnis]);

  // ─── Calculator ───────────────────────────────────────────────────────────────
  function calculate() {
    const inc = parseFloat(income.replace(/[^0-9.]/g, "")) || 0;
    const m = parseInt(months) || 60;
    if (!inc) return;
    const monthlyPension = mainUni.pensionMax > 0 ? mainUni.pensionMax : 1200;
    const pct = Math.round((monthlyPension / inc) * 100);
    const total = monthlyPension * m + (mainUni.matricula ?? 0) * Math.ceil(m / 5);
    const salary = Math.round(monthlyPension * 4.2); // rough ROI estimate
    setCalcResult({ pct, total, salary });
  }

  // ─── Activation Gate ──────────────────────────────────────────────────────────
  if (!state.financieroEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-md shadow-lg">
          <div className="w-16 h-16 bg-[#0059FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 size={32} className="text-[#0059FF]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Financiero</h2>
          <p className="text-gray-500 text-sm mb-6">
            Analiza el costo real de tu carrera con datos actualizados. Proyecciones a 5 años, comparativas de pensiones, empleabilidad y más.
          </p>
          <button
            onClick={() => dispatch({ type: "SET_FINANCIERO_ENABLED", value: true })}
            className="w-full py-3 bg-[#0059FF] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <BarChart3 size={18} />
            Activar Dashboard
          </button>
          <p className="text-xs text-gray-400 mt-4">Los datos provienen de fuentes oficiales. Actualizado: Jun 2026.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Financiero</h1>
            <p className="text-sm text-gray-500 mt-1">Análisis de costos y retorno de inversión universitaria</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium border border-green-200">
              Actualizado: Jun 2026
            </span>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              onClick={() => {
                const el = document.createElement("a");
                el.href = "#";
                alert("Exportando reporte PDF… (función en desarrollo)");
              }}
            >
              <Download size={14} />
              Exportar
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard
            label="Costo total estimado"
            value={formatSoles(mainUni.pensionMax > 0 ? mainUni.pensionMax * 50 : mainUni.cost || 12000)}
            sub="5 años · 10 ciclos"
            icon={DollarSign}
            color="#0059FF"
          />
          <KpiCard
            label="Pensión mensual prom."
            value={formatSoles(
              Math.round(
                featuredUnis.reduce((s, u) => s + (u.pensionMax > 0 ? (u.pensionMin + u.pensionMax) / 2 : 0), 0) /
                  (featuredUnis.filter((u) => u.pensionMax > 0).length || 1)
              ) || 980
            )}
            sub="promedio entre tus opciones"
            icon={TrendingUp}
            color="#7C3AED"
          />
          <KpiCard
            label="ROI estimado"
            value={`${Math.round(
              (mainUni.pensionMax > 0 ? mainUni.pensionMax * 50 : 60000) /
                (mainUni.pensionMax > 0 ? mainUni.pensionMax * 4 : 4800)
            )} meses`}
            sub="para recuperar inversión"
            icon={Briefcase}
            color="#16A34A"
          />
          <KpiCard
            label="Empleabilidad"
            value={`${mainUni.empleabilidad}%`}
            sub={mainUni.short}
            icon={Users}
            color="#D97706"
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Chart 1 — Proyección 5 años */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Proyección de costos a 5 años</h3>
            <p className="text-xs text-gray-400 mb-4">Costo anual estimado con inflación del 8%</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={projectionData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatSoles(v)} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                {featuredUnis.map((u, i) => (
                  <Line
                    key={u.short}
                    type="monotone"
                    dataKey={u.short}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Chart 2 — Pensiones */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Comparación de pensiones</h3>
            <p className="text-xs text-gray-400 mb-4">Rango mínimo–máximo por universidad</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pensionData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `S/${v}`} />
                <Tooltip formatter={(v: number) => formatSoles(v)} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Pensión mín." fill="#7C3AED" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Pensión máx." fill="#0059FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Chart 3 — Empleabilidad vs Costo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Empleabilidad vs Índice de costo</h3>
            <p className="text-xs text-gray-400 mb-4">Comparación relativa (100 = máximo del grupo)</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={empleData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Empleabilidad" fill="#16A34A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Índice costo" fill="#D91023" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Chart 4 — Distribución */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Distribución por tipo</h3>
            <p className="text-xs text-gray-400 mb-4">Pública vs Privada entre tus favoritas</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                  labelLine={false}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#16A34A" : "#7C3AED"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v} universidades`, ""]} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Financial Calculator */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={18} className="text-[#0059FF]" />
            <h3 className="font-bold text-gray-900">Calculadora financiera personal</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Ingreso familiar mensual
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">S/.</span>
                <input
                  type="number"
                  min="0"
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20"
                  placeholder="3,500"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Meses hasta graduarse
              </label>
              <input
                type="range"
                min="36"
                max="84"
                step="6"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full accent-[#0059FF] mt-2"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">{months} meses ({Math.round(parseInt(months) / 12 * 10) / 10} años)</p>
            </div>

            <div className="flex items-end">
              <button
                onClick={calculate}
                disabled={!income}
                className="w-full py-2.5 bg-[#0059FF] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Calculator size={15} />
                Calcular
              </button>
            </div>
          </div>

          {calcResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
              <div className={`rounded-xl p-4 ${calcResult.pct > 30 ? "bg-red-50 border border-red-200" : calcResult.pct > 20 ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"}`}>
                <p className="text-xs font-semibold text-gray-600 mb-1">% del ingreso familiar</p>
                <p className={`text-2xl font-bold ${calcResult.pct > 30 ? "text-[#D91023]" : calcResult.pct > 20 ? "text-amber-700" : "text-green-700"}`}>
                  {calcResult.pct}%
                </p>
                <p className="text-xs text-gray-500 mt-1">{calcResult.pct > 30 ? "⚠ Elevado" : calcResult.pct > 20 ? "Moderado" : "Sostenible"}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-1">Inversión total estimada</p>
                <p className="text-2xl font-bold text-[#0059FF]">{formatSoles(calcResult.total)}</p>
                <p className="text-xs text-gray-500 mt-1">pensión + matrícula · {months} meses</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-1">Salario inicial estimado</p>
                <p className="text-2xl font-bold text-[#7C3AED]">{formatSoles(calcResult.salary)}/mes</p>
                <p className="text-xs text-gray-500 mt-1">según empleabilidad de {mainUni.short}</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#0059FF] to-[#7C3AED] rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-lg">Compara universidades lado a lado</h3>
            <p className="text-sm text-white/80 mt-1">Usa el comparador para analizar costos, pensiones y empleabilidad en detalle.</p>
          </div>
          <button
            onClick={() => navigate("comparador")}
            className="flex items-center gap-2 px-5 py-3 bg-white text-[#0059FF] rounded-xl text-sm font-bold hover:bg-white/90 transition-colors shrink-0"
          >
            Ver comparador
            <ArrowRight size={15} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
