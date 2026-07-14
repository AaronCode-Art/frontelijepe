import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { universities } from "@/data/universities";
import * as api from "@/services/api";
import type { ResultadoConvalidacion } from "@/services/api";
import StepProgress from "@/components/StepProgress";
import GuideCallout from "@/components/GuideCallout";
import {
  Upload, FileText, CheckCircle, Download, FileSpreadsheet,
  ChevronDown, ChevronUp, AlertCircle, XCircle, ArrowUpDown,
  Users, GraduationCap, UserCheck, ExternalLink, RefreshCw, Lock, Clock,
} from "lucide-react";

// Universidades con malla curricular de ejemplo ya cargada (ver schema_update.sql).
// Para el resto, el backend devolverá un error claro pidiendo cargar la malla real.
const UNIS_CON_MALLA_DEMO = [1, 2, 3];

type FilterStatus = "Todos" | "Convalidado" | "Revisar" | "No aplica" | "En curso";
type SortKey = "code" | "name" | "credits" | "status";

interface CursoFila {
  code: string;
  name: string;
  credits: number;
  status: "Convalidado" | "Revisar" | "No aplica" | "En curso";
  nota: number | null;
  estadoOrigen: string;
  similitud: number;
}

function mapEstado(estado: ResultadoConvalidacion["resultados"][number]["estado"]): CursoFila["status"] {
  if (estado === "convalidado") return "Convalidado";
  if (estado === "no_convalidado_nota_insuficiente") return "Revisar";
  if (estado === "en_curso") return "En curso";
  return "No aplica";
}

function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div role="status" aria-live="polite" className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
      <CheckCircle size={18} className="text-green-400" />
      <span className="text-sm">{msg}</span>
      <button onClick={onClose} aria-label="Cerrar aviso" className="ml-2 text-gray-400 hover:text-white">
        <XCircle size={16} />
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Convalidado") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        <CheckCircle size={11} /> Convalidado
      </span>
    );
  }
  if (status === "Revisar") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        <AlertCircle size={11} /> Revisar
      </span>
    );
  }
  if (status === "En curso") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        <Clock size={11} /> En curso
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
      <XCircle size={11} /> No aplica
    </span>
  );
}

export default function SimuladorPage() {
  const { state, navigate } = useApp();
  const user = state.user;
  const esCuentaReal = !!user?.id && !user.isDemo;

  const [filter, setFilter] = useState<FilterStatus>("Todos");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortAsc, setSortAsc] = useState(true);
  const [visibleCount, setVisibleCount] = useState(7);
  const [brechaOpen, setBrechaOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [userType, setUserType] = useState<"Egresado" | "Traslado" | "Padre">("Egresado");

  const [file, setFile] = useState<File | null>(null);
  const [universidadId, setUniversidadId] = useState<number>(1);
  const [carrera, setCarrera] = useState("Ingeniería de Sistemas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoConvalidacion | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleAnalizar() {
    if (!file) return;
    if (!esCuentaReal) {
      setError("Necesitas iniciar sesión con una cuenta real (no Demo) para usar el simulador, porque el resultado queda guardado en tu historial.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await api.convalidarPDF(user!.id!, universidadId, carrera, file);
      setResultado(res);
    } catch (err) {
      setError(
        err instanceof api.ApiError
          ? err.message
          : "No se pudo conectar con el backend. Revisa que uvicorn esté corriendo."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFileChosen(f: File | null) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Sube el récord de notas en formato PDF.");
      return;
    }
    setError(null);
    setFile(f);
  }

  function reset() {
    setFile(null);
    setResultado(null);
    setError(null);
  }

  const courses: CursoFila[] = (resultado?.resultados ?? []).map((r, i) => ({
    code: `C${String(i + 1).padStart(2, "0")}`,
    name: r.curso_destino ?? r.curso_origen,
    credits: r.creditos_destino ?? 0,
    status: mapEstado(r.estado),
    nota: r.nota_origen,
    estadoOrigen: r.estado_origen,
    similitud: r.similitud,
  }));

  const filtered = courses
    .filter((c) => filter === "Todos" || c.status === filter)
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "code") cmp = a.code.localeCompare(b.code);
      else if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "credits") cmp = a.credits - b.credits;
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortAsc ? cmp : -cmp;
    });

  const convalidados = courses.filter((c) => c.status === "Convalidado");
  const revisar = courses.filter((c) => c.status === "Revisar");
  const noAplica = courses.filter((c) => c.status === "No aplica");
  const creditsValidados = convalidados.reduce((s, c) => s + c.credits, 0);
  const creditsRevisar = revisar.reduce((s, c) => s + c.credits, 0);
  const creditsNoAplica = noAplica.reduce((s, c) => s + c.credits, 0);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(true); }
  }

  const SortIcon = ({ k }: { k: SortKey }) => (
    <ArrowUpDown size={13} className={sortKey === k ? "text-blue-600" : "text-gray-400"} />
  );

  // Progreso real: % de cursos detectados que sí convalidaron
  const pct = resultado && resultado.total_cursos_detectados > 0
    ? Math.round((resultado.total_convalidados / resultado.total_cursos_detectados) * 100)
    : 0;
  const r = 40;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference * (1 - pct / 100);

  // ─── PANTALLA DE CARGA ────────────────────────────────────────────────────
  if (!resultado) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Simulador de Convalidación</h1>
        <p className="text-gray-500 mb-6">
          Sube el PDF de tu récord académico real y descubre, curso por curso, qué convalida en la
          universidad de destino, comparando tus notas contra su malla curricular.
        </p>

        <StepProgress
          steps={[{ label: "Datos" }, { label: "Subir PDF" }, { label: "Resultado" }]}
          current={file ? 1 : 0}
        />

        <GuideCallout storageKey="simulador-intro" title="Antes de empezar" color="blue">
          Este proceso toma 2 pasos y menos de 2 minutos: primero eliges universidad y carrera
          destino, luego subes tu PDF. No necesitas nada más — no se te va a pedir pago para ver
          el resultado.
        </GuideCallout>

        {!esCuentaReal && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 text-amber-700 text-sm rounded-xl px-4 py-3 mb-5">
            <Lock size={15} className="flex-shrink-0 mt-0.5" />
            <div>
              Estás en modo Demo. Para usar el simulador con tu récord real necesitas
              <button onClick={() => navigate("auth")} className="underline font-semibold mx-1">crear una cuenta o iniciar sesión</button>
              (el resultado se guarda en tu historial en la base de datos).
            </div>
          </div>
        )}

        {/* Selección de universidad y carrera destino */}
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Universidad destino</label>
            <select
              value={universidadId}
              onChange={(e) => setUniversidadId(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {universities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.short} {UNIS_CON_MALLA_DEMO.includes(u.id) ? "" : "(sin malla cargada aún)"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Carrera destino</label>
            <input
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Ej. Ingeniería de Sistemas"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 -mt-3 mb-6">
          Por ahora solo hay malla curricular de ejemplo cargada para "Ingeniería de Sistemas" en las
          universidades marcadas arriba. Para otras carreras/universidades, agrega su malla en la tabla
          <code className="mx-1 bg-gray-100 px-1 rounded">mallas_curriculares</code> (ver schema_update.sql).
        </p>

        {/* Drag & Drop Zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Subir récord académico en PDF. Presiona Enter para elegir el archivo, o arrástralo aquí."
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer
            ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40"}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChosen(e.dataTransfer.files?.[0] ?? null); }}
          onClick={() => document.getElementById("record-pdf-input")?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              document.getElementById("record-pdf-input")?.click();
            }
          }}
        >
          <input
            id="record-pdf-input"
            type="file"
            accept="application/pdf"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            onChange={(e) => handleFileChosen(e.target.files?.[0] ?? null)}
          />
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Upload size={28} className="text-blue-600" />
            </div>
          </div>
          {file ? (
            <>
              <p className="text-lg font-semibold text-gray-800 mb-1">{file.name}</p>
              <p className="text-sm text-gray-500 mb-6">{(file.size / 1024).toFixed(0)} KB — listo para analizar</p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-gray-800 mb-1">Sube tu Récord Académico (PDF)</p>
              <p className="text-sm text-gray-500 mb-6">
                Arrastra y suelta tu archivo aquí, o haz clic para seleccionarlo
              </p>
            </>
          )}

          <div className="flex justify-center gap-3 mb-5" onClick={(e) => e.stopPropagation()}>
            {(["Egresado", "Traslado", "Padre"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setUserType(t)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all
                  ${userType === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
              >
                {t === "Egresado" && <GraduationCap size={15} />}
                {t === "Traslado" && <RefreshCw size={15} />}
                {t === "Padre" && <Users size={15} />}
                {t}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400">Formato aceptado: PDF con texto seleccionable (no fotos escaneadas) — máx. 10MB</p>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            <AlertCircle size={15} className="flex-shrink-0 mt-0.5" /> {error}
          </div>
        )}

        <button
          onClick={handleAnalizar}
          disabled={!file || loading}
          className="mt-5 w-full py-3 rounded-xl bg-[#0059FF] text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analizando tu PDF...
            </>
          ) : (
            <>
              <UserCheck size={16} /> Analizar convalidación
            </>
          )}
        </button>
      </div>
    );
  }

  // ─── PANTALLA DE RESULTADOS ────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Simulador de Convalidación</h1>
        <p className="text-sm text-gray-500 mt-0.5 mb-4">Análisis basado en tu récord académico real (PDF)</p>
        <StepProgress
          steps={[{ label: "Datos" }, { label: "Subir PDF" }, { label: "Resultado" }]}
          current={2}
        />
      </div>

      <div className="flex gap-6 mb-6">
        {/* LEFT PANEL */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{file?.name ?? "récord_academico.pdf"}</p>
              <p className="text-xs text-gray-400">{resultado.total_cursos_detectados} cursos detectados</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              <CheckCircle size={11} /> Cargado
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Resumen Real</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-blue-700">{resultado.total_convalidados}</p>
                <p className="text-xs text-blue-600 mt-0.5 leading-tight">Cursos<br />Convalidados</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-purple-700">{resultado.total_creditos_convalidados}</p>
                <p className="text-xs text-purple-600 mt-0.5 leading-tight">Créditos<br />Convalidados</p>
              </div>
            </div>

            <div className="flex flex-col items-center mb-4">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
                <circle
                  cx="55" cy="55" r={r} fill="none"
                  stroke="#0059FF" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 55 55)"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
                <text x="55" y="51" textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">{pct}%</text>
                <text x="55" y="67" textAnchor="middle" fontSize="9" fill="#6B7280">convalidado</text>
              </svg>
              <p className="text-sm text-gray-600 font-medium">{resultado.total_convalidados} de {resultado.total_cursos_detectados} cursos</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => showToast("Función de exportar PDF pendiente de conectar.")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors"
              >
                <Download size={13} /> Descargar PDF
              </button>
              <button
                onClick={() => showToast("Función de exportar Excel pendiente de conectar.")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                <FileSpreadsheet size={13} /> Excel
              </button>
            </div>
          </div>

          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <RefreshCw size={14} /> Analizar otro archivo
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm font-semibold text-gray-800">Cursos analizados</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {(["Todos", "Convalidado", "Revisar", "No aplica", "En curso"] as FilterStatus[]).map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setVisibleCount(7); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all
                    ${filter === f
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {(["code", "name", "credits", "status"] as SortKey[]).map((k) => (
                    <th
                      key={k}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-800 transition-colors"
                      onClick={() => toggleSort(k)}
                    >
                      <span className="flex items-center gap-1">
                        {k === "code" ? "#" : k === "name" ? "Curso (récord → malla destino)" : k === "credits" ? "Créditos" : "Estado"}
                        <SortIcon k={k} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nota</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, visibleCount).map((c) => (
                  <tr key={c.code} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 font-medium">{c.code}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600 tabular-nums">{c.credits.toFixed(1)}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-gray-500 tabular-nums">{c.nota !== null ? c.nota.toFixed(1) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleCount < filtered.length && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Mostrando {Math.min(visibleCount, filtered.length)} de {filtered.length}
              </span>
              <button
                onClick={() => setVisibleCount((v) => v + 5)}
                className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                Cargar más <ChevronDown size={13} />
              </button>
            </div>
          )}

          <div className="px-5 py-4 border-t border-gray-100">
            <button
              onClick={() => showToast("Solicitud enviada a SUNEDU para revisión.")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors border border-red-200"
            >
              <ExternalLink size={15} /> Solicitar revisión SUNEDU
            </button>
          </div>

          <div className="border-t border-gray-100">
            <button
              className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setBrechaOpen((v) => !v)}
            >
              <span>Ver reporte de brechas completo</span>
              {brechaOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {brechaOpen && (
              <div className="px-5 pb-5">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Convalidados", items: convalidados, total: creditsValidados, color: "green" },
                    { label: "Para Revisar", items: revisar, total: creditsRevisar, color: "amber" },
                    { label: "No Aplican", items: noAplica, total: creditsNoAplica, color: "red" },
                  ].map(({ label, items, total, color }) => (
                    <div key={label} className={`rounded-xl p-3 bg-${color}-50 border border-${color}-100`}>
                      <p className={`text-xs font-semibold text-${color}-700 mb-2`}>{label}</p>
                      <ul className="space-y-1.5 mb-3">
                        {items.map((c) => (
                          <li key={c.code} className="flex justify-between text-xs text-gray-700">
                            <span className="truncate pr-2">{c.name}</span>
                            <span className={`font-medium text-${color}-700 flex-shrink-0`}>{c.credits}cr</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`pt-2 border-t border-${color}-200 flex justify-between text-xs font-semibold text-${color}-800`}>
                        <span>Total</span>
                        <span>{total.toFixed(1)} créditos</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            value: String(resultado.total_creditos_convalidados),
            label: "Créditos validados",
            sub: "en tu récord",
            color: "blue",
            onClick: () => showToast(`${resultado.total_creditos_convalidados} créditos convalidados según la malla cargada.`),
          },
          {
            value: String(resultado.total_cursos_detectados - resultado.total_convalidados),
            label: "Cursos pendientes",
            sub: "por revisar o sin equivalencia",
            color: "purple",
            onClick: () => showToast("Revisa el detalle en la tabla de arriba."),
          },
          {
            value: String(UNIS_CON_MALLA_DEMO.length),
            label: "Universidades con malla cargada",
            sub: "por ahora (datos de ejemplo)",
            color: "red",
            onClick: () => navigate("explorar"),
          },
        ].map(({ value, label, sub, color, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="bg-white rounded-2xl border border-gray-200 p-5 text-left hover:shadow-md transition-shadow group cursor-pointer"
          >
            <p className={`text-3xl font-bold text-${color === "blue" ? "[#0059FF]" : color === "purple" ? "[#7C3AED]" : "[#D91023]"} mb-1`}>
              {value}
            </p>
            <p className="text-sm font-semibold text-gray-800">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </button>
        ))}
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
