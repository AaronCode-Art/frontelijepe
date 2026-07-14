import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import UniCard from "@/components/UniCard";
import { universities, getDistance } from "@/data/universities";
import type { University } from "@/types";
import {
  Search, SlidersHorizontal, X, Grid2X2, List, Download, Printer,
  Share2, ChevronUp, ChevronDown, MapPin, Bookmark, ChevronRight,
} from "lucide-react";

type SortField = "rating" | "empleabilidad" | "cost" | "name";
type ViewMode = "grid" | "list";

const REGIONS = ["Lima", "Arequipa", "La Libertad", "Cusco", "Piura", "Lambayeque", "Junín", "Ica", "Ancash", "Cajamarca"];
const PAGE_SIZE = 6;

export default function ExplorarPage() {
  const { state, dispatch } = useApp();
  const { savedSearches } = state;

  // Filters
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState(100000);
  const [tipo, setTipo] = useState<"Todas" | "Pública" | "Privada">("Todas");
  const [region, setRegion] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [nivel, setNivel] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minEmpleabilidad, setMinEmpleabilidad] = useState(0);
  const [minCareers, setMinCareers] = useState(0);
  const [soloSunedu, setSoloSunedu] = useState(false);

  // Sort & view
  const [sortField, setSortField] = useState<SortField>("rating");
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);

  // Geolocation
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);

  const hasGeo = typeof navigator !== "undefined" && !!navigator.geolocation;

  const handleGeoSort = () => {
    if (userLat !== null) {
      setSortByDistance((v) => !v);
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setSortByDistance(true);
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  };

  const activeFilterCount = [
    search,
    budget < 100000 ? "budget" : "",
    tipo !== "Todas" ? tipo : "",
    region,
    modalidad,
    nivel,
    minEmpleabilidad > 0 ? "emp" : "",
    minCareers > 0 ? "car" : "",
    soloSunedu ? "sunedu" : "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch("");
    setBudget(100000);
    setTipo("Todas");
    setRegion("");
    setModalidad("");
    setNivel("");
    setMinEmpleabilidad(0);
    setMinCareers(0);
    setSoloSunedu(false);
    setSortByDistance(false);
    setPage(1);
  };

  const handleSaveSearch = () => {
    if (search.trim()) dispatch({ type: "ADD_SAVED_SEARCH", query: search.trim() });
  };

  const filtered = useMemo<University[]>(() => {
    let result = universities.filter((u) => {
      if (search) {
        const q = search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.short.toLowerCase().includes(q) && !u.region.toLowerCase().includes(q)) return false;
      }
      const effectiveCost = u.type === "Pública" ? 0 : u.cost;
      if (effectiveCost > budget) return false;
      if (tipo !== "Todas" && u.type !== tipo) return false;
      if (region && u.region !== region) return false;
      if (modalidad && u.modalidad !== modalidad) return false;
      if (nivel && u.nivel !== nivel) return false;
      if (u.empleabilidad < minEmpleabilidad) return false;
      if (u.careers < minCareers) return false;
      if (soloSunedu && !u.sunedu) return false;
      return true;
    });

    if (sortByDistance && userLat !== null && userLng !== null) {
      result = [...result].sort((a, b) =>
        getDistance(userLat, userLng!, a.lat, a.lng) - getDistance(userLat, userLng!, b.lat, b.lng)
      );
    } else {
      result = [...result].sort((a, b) => {
        let diff = 0;
        if (sortField === "rating") diff = b.rating - a.rating;
        else if (sortField === "empleabilidad") diff = b.empleabilidad - a.empleabilidad;
        else if (sortField === "cost") diff = (a.type === "Pública" ? 0 : a.cost) - (b.type === "Pública" ? 0 : b.cost);
        else if (sortField === "name") diff = a.name.localeCompare(b.name);
        return sortAsc ? -diff : diff;
      });
    }
    return result;
  }, [search, budget, tipo, region, modalidad, nivel, minEmpleabilidad, minCareers, soloSunedu, sortField, sortAsc, sortByDistance, userLat, userLng]);

  const displayed = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < filtered.length;

  const handleExport = () => {
    const text = filtered.map((u) => `${u.name} (${u.short}) - ${u.region} - ${u.type}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "universidades.txt";
    a.click();
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-blue-600" /> Filtros
                  {activeFilterCount > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </h2>
              </div>

              {/* Text search */}
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Universidad, carrera, región..."
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>
              {search && (
                <button
                  onClick={handleSaveSearch}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold mb-3 hover:underline"
                >
                  <Bookmark size={12} /> Guardar búsqueda
                </button>
              )}

              {/* Budget slider */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Presupuesto máximo: <span className="text-blue-600">S/.{budget === 100000 ? "Sin límite" : budget.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100000}
                  step={1000}
                  value={budget}
                  onChange={(e) => { setBudget(Number(e.target.value)); setPage(1); }}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>S/.0</span>
                  <span>S/.100,000</span>
                </div>
              </div>

              {/* Tipo */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Tipo</label>
                <div className="flex gap-2">
                  {(["Todas", "Pública", "Privada"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTipo(t); setPage(1); }}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${tipo === t ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Región */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Región</label>
                <select
                  value={region}
                  onChange={(e) => { setRegion(e.target.value); setPage(1); }}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Todas las regiones</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Modalidad */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Modalidad</label>
                <select
                  value={modalidad}
                  onChange={(e) => { setModalidad(e.target.value); setPage(1); }}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Todas</option>
                  <option value="Presencial">Presencial</option>
                  <option value="Semipresencial">Semipresencial</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>

              {/* Nivel */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 block mb-1.5">Nivel</label>
                <select
                  value={nivel}
                  onChange={(e) => { setNivel(e.target.value); setPage(1); }}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Todos</option>
                  <option value="Pregrado">Pregrado</option>
                  <option value="Posgrado">Posgrado</option>
                  <option value="Técnico">Técnico</option>
                </select>
              </div>

              {/* Advanced toggle */}
              <button
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex items-center justify-between w-full text-xs font-semibold text-blue-600 hover:text-blue-800 mb-2 py-1 border-t border-gray-100 pt-3"
              >
                Filtros avanzados
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronRight size={14} />}
              </button>

              {showAdvanced && (
                <div className="space-y-4 mb-4">
                  {/* Empleabilidad slider */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Empleabilidad mínima: <span className="text-blue-600">{minEmpleabilidad}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={minEmpleabilidad}
                      onChange={(e) => { setMinEmpleabilidad(Number(e.target.value)); setPage(1); }}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* Carreras slider */}
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Carreras mínimas: <span className="text-blue-600">{minCareers}</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={minCareers}
                      onChange={(e) => { setMinCareers(Number(e.target.value)); setPage(1); }}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* Solo SUNEDU */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soloSunedu}
                      onChange={(e) => { setSoloSunedu(e.target.checked); setPage(1); }}
                      className="w-4 h-4 accent-blue-600 rounded"
                    />
                    <span className="text-xs font-semibold text-gray-600">Solo universidades SUNEDU</span>
                  </label>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setPage(1)}
                  className="flex-1 py-2 bg-[#0059FF] hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Aplicar
                </button>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* ── Results ──────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {/* Results header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 flex flex-wrap gap-3 items-center justify-between">
              <p className="text-sm font-bold text-gray-700">
                <span className="text-blue-600">{filtered.length}</span> universidades encontradas
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Sort */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
                  {([
                    { field: "rating" as SortField, label: "Rating" },
                    { field: "empleabilidad" as SortField, label: "Empleo" },
                    { field: "cost" as SortField, label: "Costo" },
                    { field: "name" as SortField, label: "Nombre" },
                  ]).map((s) => (
                    <button
                      key={s.field}
                      onClick={() => {
                        if (sortField === s.field) setSortAsc((v) => !v);
                        else { setSortField(s.field); setSortAsc(false); }
                        setSortByDistance(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-0.5 transition-colors ${sortField === s.field && !sortByDistance ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      {s.label}
                      {sortField === s.field && !sortByDistance && (
                        sortAsc ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Geolocation */}
                {hasGeo && (
                  <button
                    onClick={handleGeoSort}
                    disabled={geoLoading}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${sortByDistance ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"}`}
                  >
                    <MapPin size={12} />
                    {geoLoading ? "Localizando..." : sortByDistance ? "Por cercanía ✓" : "Mostrar más cercanas"}
                  </button>
                )}

                {/* View toggle */}
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-400"}`}
                  >
                    <Grid2X2 size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-400"}`}
                  >
                    <List size={15} />
                  </button>
                </div>

                {/* Export/Print/Share */}
                <div className="flex items-center gap-1">
                  <button onClick={handleExport} title="Exportar" className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <Download size={15} />
                  </button>
                  <button onClick={() => window.print()} title="Imprimir" className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <Printer size={15} />
                  </button>
                  <button onClick={handleShare} title="Compartir" className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results grid/list */}
            {displayed.length > 0 ? (
              <>
                <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4" : "flex flex-col gap-3 mb-4"}>
                  {displayed.map((uni) => (
                    <UniCard
                      key={uni.id}
                      uni={uni}
                      view={viewMode === "list" ? "list" : "grid"}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="text-center">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-600 font-semibold px-6 py-2.5 rounded-2xl text-sm transition-colors shadow-sm"
                    >
                      Mostrar 6 más
                      <ChevronDown size={15} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <Search size={40} className="text-gray-200 mx-auto mb-3" />
                <p className="font-bold text-gray-600 text-base mb-1">Sin resultados</p>
                <p className="text-sm text-gray-400 mb-4">Prueba ajustando los filtros o ampliando el presupuesto.</p>
                <button
                  onClick={clearFilters}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
