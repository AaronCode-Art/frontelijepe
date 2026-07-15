import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { universities } from "@/data/universities";
import type { University } from "@/types";
import {
  X, Plus, ChevronDown, ChevronUp, CheckCircle, XCircle,
  Star, Search, Download, Bookmark, Sparkles,
} from "lucide-react";
import {
  LineChart, Line, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "motion/react";

type SectionId = "general" | "costos" | "calidad" | "roi";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5 justify-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
        />
      ))}
    </span>
  );
}

function formatMoney(n: number) {
  if (n === 0) return "Gratuita";
  return `S/. ${n.toLocaleString("es-PE")}`;
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
      <CheckCircle size={18} className="text-green-400" />
      <span className="text-sm">{msg}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white">
        <XCircle size={16} />
      </button>
    </div>
  );
}

interface CellProps {
  value: React.ReactNode;
  highlight?: "best" | "worst" | "neutral";
}

function Cell({ value, highlight }: CellProps) {
  return (
    <td className={`px-3 py-3 text-center text-sm align-middle
      ${highlight === "best" ? "bg-green-50 text-green-800 font-semibold" : ""}
      ${highlight === "worst" ? "bg-red-50/50 text-red-700" : ""}
      ${highlight === "neutral" ? "text-gray-700" : ""}`}
    >
      {value}
    </td>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const points = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={80} height={28}>
      <LineChart data={points}>
        <Line dataKey="v" dot={false} stroke="#0059FF" strokeWidth={1.5} />
        <Tooltip
          contentStyle={{ fontSize: 10, padding: "2px 6px" }}
          formatter={(v: number) => `S/. ${v}`}
          labelFormatter={() => ""}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function ComparadorPage() {
  const { state, navigate, dispatch } = useApp();
  const compareIds = state.compareList;

  const compareUnis = useMemo(
    () => universities.filter((u) => compareIds.includes(u.id)),
    [compareIds],
  );

  const [openSections, setOpenSections] = useState<Set<SectionId>>(
    new Set(["general", "costos", "calidad", "roi"]),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function toggleSection(id: SectionId) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const availableUnis = universities.filter(
    (u) =>
      !compareIds.includes(u.id) &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.short.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Helper: find best/worst index across unis for a numeric metric
  function getBest(vals: number[], highIsBest = true) {
    if (vals.length === 0) return -1;
    return highIsBest
      ? vals.indexOf(Math.max(...vals))
      : vals.indexOf(Math.min(...vals.filter((v) => v > 0)));
  }
  function getWorst(vals: number[], highIsBest = true) {
    if (vals.length === 0) return -1;
    const nonZero = highIsBest ? vals : vals.filter((v) => v > 0);
    if (highIsBest) return vals.indexOf(Math.min(...vals));
    const minVal = Math.min(...nonZero);
    return vals.indexOf(minVal);
  }

  function cellHighlight(vals: number[], idx: number, highIsBest = true): "best" | "worst" | "neutral" {
    if (vals.length < 2) return "neutral";
    const bestIdx = getBest(vals, highIsBest);
    const worstIdx = getWorst(vals, highIsBest);
    if (idx === bestIdx) return "best";
    if (idx === worstIdx) return "worst";
    return "neutral";
  }

  if (compareUnis.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto px-4 py-20 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
          <Search size={32} className="text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Sin universidades para comparar</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Agrega al menos dos universidades desde el explorador para comenzar a comparar.
        </p>
        <button
          onClick={() => navigate("explorar")}
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          Ir a Explorar
        </button>
      </motion.div>
    );
  }

  const ratings = compareUnis.map((u) => u.rating);
  const empleabilidades = compareUnis.map((u) => u.empleabilidad);
  const pensions = compareUnis.map((u) => u.pensionMax);
  const pensionMins = compareUnis.map((u) => u.pensionMin);
  const matriculas = compareUnis.map((u) => u.matricula);
  const totalCosts = compareUnis.map((u) => u.pensionMax > 0 ? u.pensionMax * 50 : 0);
  const rois = compareUnis.map((u) => {
    const cost = u.pensionMax * 50 || 1;
    const emp = u.empleabilidad || 1;
    return Math.round((emp / cost) * 100000);
  });
  const annualVariations = compareUnis.map((u) => {
    const hist = u.costHistory.filter((v) => v > 0);
    if (hist.length < 2) return 0;
    return Math.round(((hist[hist.length - 1] - hist[0]) / hist[0]) * 100 / (hist.length - 1));
  });

  const SECTIONS: { id: SectionId; label: string }[] = [
    { id: "general", label: "Información General" },
    { id: "costos", label: "Costos" },
    { id: "calidad", label: "Calidad Académica" },
    { id: "roi", label: "Costo-Beneficio" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 flex-wrap gap-4"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Comparador de Universidades</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            {compareUnis.length}
          </span>
        </div>

        {/* Add university */}
        {compareUnis.length < 5 && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} /> Añadir universidad
            </motion.button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-gray-200 shadow-xl z-30">
                <div className="p-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-2">
                    <Search size={14} className="text-gray-400" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar universidad..."
                      className="flex-1 text-sm outline-none py-1 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>
                <ul className="max-h-52 overflow-y-auto py-1">
                  {availableUnis.slice(0, 12).map((u) => (
                    <li key={u.id}>
                      <button
                        className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-2"
                        onClick={() => {
                          dispatch({ type: "TOGGLE_COMPARE", id: u.id });
                          setShowDropdown(false);
                          setSearchQuery("");
                        }}
                      >
                        <img
                          src={`https://images.unsplash.com/${u.img}?auto=format&fit=crop&w=32&h=32&q=60`}
                          alt={u.short}
                          className="w-7 h-7 rounded object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{u.short}</p>
                          <p className="text-xs text-gray-400 truncate">{u.city}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                  {availableUnis.length === 0 && (
                    <li className="px-4 py-3 text-sm text-gray-400 text-center">Sin resultados</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Main table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Sticky header row */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-44 sticky left-0 bg-gray-50 z-10">
                  Criterio
                </th>
                {compareUnis.map((u) => (
                  <th key={u.id} className="px-3 py-4 text-center min-w-[150px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <img
                          src={`https://images.unsplash.com/${u.img}?auto=format&fit=crop&w=56&h=56&q=70`}
                          alt={u.short}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                        />
                        <button
                          onClick={() => dispatch({ type: "TOGGLE_COMPARE", id: u.id })}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{u.short}</p>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium
                          ${u.type === "Pública" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                          {u.type}
                        </span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SECTIONS.map((section) => (
                <>
                  {/* Section header row */}
                  <tr
                    key={`section-${section.id}`}
                    className="bg-gray-50 border-y border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSection(section.id)}
                  >
                    <td
                      colSpan={compareUnis.length + 1}
                      className="px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                          {section.label}
                        </span>
                        {openSections.has(section.id)
                          ? <ChevronUp size={14} className="text-gray-500" />
                          : <ChevronDown size={14} className="text-gray-500" />}
                      </div>
                    </td>
                  </tr>

                  {openSections.has(section.id) && (
                    <>
                      {/* GENERAL */}
                      {section.id === "general" && (
                        <>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Tipo</td>
                            {compareUnis.map((u) => (
                              <Cell key={u.id} highlight="neutral" value={
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                                  ${u.type === "Pública" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                  {u.type}
                                </span>
                              } />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Región / Ciudad</td>
                            {compareUnis.map((u) => (
                              <Cell key={u.id} highlight="neutral" value={<span className="text-xs">{u.region}<br /><span className="text-gray-400">{u.city}</span></span>} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Fundación</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(compareUnis.map((x) => x.founded), i, false)} value={u.founded} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Modalidad</td>
                            {compareUnis.map((u) => (
                              <Cell key={u.id} highlight="neutral" value={<span className="text-xs">{u.modalidad}</span>} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Nº Carreras</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(compareUnis.map((x) => x.careers), i)} value={u.careers} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">SUNEDU</td>
                            {compareUnis.map((u) => (
                              <Cell key={u.id} highlight={u.sunedu ? "best" : "worst"} value={
                                u.sunedu
                                  ? <CheckCircle size={16} className="mx-auto text-green-600" />
                                  : <XCircle size={16} className="mx-auto text-red-500" />
                              } />
                            ))}
                          </tr>
                        </>
                      )}

                      {/* COSTOS */}
                      {section.id === "costos" && (
                        <>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Pensión mínima</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(pensionMins, i, false)} value={<span className="text-xs">{formatMoney(u.pensionMin)}</span>} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Pensión máxima</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(pensions, i, false)} value={<span className="text-xs">{formatMoney(u.pensionMax)}</span>} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Matrícula</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(matriculas, i, false)} value={<span className="text-xs">{formatMoney(u.matricula)}</span>} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Costo total 5 años</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(totalCosts, i, false)} value={<span className="text-xs">{formatMoney(totalCosts[i])}</span>} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Variación anual</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(annualVariations, i, false)} value={
                                <span className="text-xs">{annualVariations[i] > 0 ? `+${annualVariations[i]}%` : "—"}</span>
                              } />
                            ))}
                          </tr>
                        </>
                      )}

                      {/* CALIDAD */}
                      {section.id === "calidad" && (
                        <>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Rating</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(ratings, i)} value={<StarRating rating={u.rating} />} />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Empleabilidad</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(empleabilidades, i)} value={
                                <span className="text-sm font-semibold">{u.empleabilidad}%</span>
                              } />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Carreras</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(compareUnis.map((x) => x.careers), i)} value={u.careers} />
                            ))}
                          </tr>
                        </>
                      )}

                      {/* ROI */}
                      {section.id === "roi" && (
                        <>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">ROI estimado</td>
                            {compareUnis.map((u, i) => (
                              <Cell key={u.id} highlight={cellHighlight(rois, i)} value={
                                <span className="text-xs font-mono">{rois[i]}</span>
                              } />
                            ))}
                          </tr>
                          <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                            <td className="px-4 py-3 text-xs font-medium text-gray-600 sticky left-0 bg-white">Tendencia costos</td>
                            {compareUnis.map((u) => (
                              <td key={u.id} className="px-3 py-3 text-center align-middle">
                                <div className="flex justify-center">
                                  {u.costHistory.some((v) => v > 0)
                                    ? <Sparkline data={u.costHistory} />
                                    : <span className="text-xs text-gray-400">Gratuita</span>
                                  }
                                </div>
                              </td>
                            ))}
                          </tr>
                        </>
                      )}
                    </>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center gap-3 mt-6 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => showToast("Comparación guardada correctamente.")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Bookmark size={15} /> Guardar comparación
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => showToast("Exportando comparación a PDF...")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Download size={15} /> Exportar PDF
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("ia")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 text-purple-700 text-sm font-medium hover:bg-purple-50 transition-colors"
        >
          <Sparkles size={15} /> Ver IA recomendación
        </motion.button>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
