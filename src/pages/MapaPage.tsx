import { useState, useMemo } from "react";
import { MapPin, Navigation, AlertCircle, RotateCcw, ChevronDown, Star, Eye, Filter } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { universities, getDistance } from "@/data/universities";

type LocationStatus = "idle" | "loading" | "granted" | "denied";
type SortBy = "distance" | "rating" | "cost" | "empleabilidad";
type FilterType = "Todas" | "Pública" | "Privada";

// Approximate Peru region centers
const PERU_REGIONS: { id: string; label: string; lat: number; lng: number; svgX: number; svgY: number }[] = [
  { id: "Lima", label: "Lima", lat: -12.05, lng: -77.03, svgX: 95, svgY: 195 },
  { id: "Arequipa", label: "Arequipa", lat: -16.41, lng: -71.54, svgX: 130, svgY: 255 },
  { id: "Trujillo", label: "Trujillo", lat: -8.11, lng: -79.03, svgX: 70, svgY: 135 },
  { id: "Cusco", label: "Cusco", lat: -13.52, lng: -71.97, svgX: 155, svgY: 215 },
  { id: "Piura", label: "Piura", lat: -5.19, lng: -80.63, svgX: 50, svgY: 90 },
  { id: "Iquitos", label: "Iquitos", lat: -3.75, lng: -73.25, svgX: 195, svgY: 75 },
  { id: "Puno", label: "Puno", lat: -15.84, lng: -70.02, svgX: 165, svgY: 245 },
  { id: "Chiclayo", label: "Chiclayo", lat: -6.77, lng: -79.84, svgX: 60, svgY: 110 },
  { id: "Huancayo", label: "Huancayo", lat: -12.07, lng: -75.21, svgX: 125, svgY: 190 },
  { id: "Tacna", label: "Tacna", lat: -18.01, lng: -70.25, svgX: 140, svgY: 285 },
];

function getRegionFromCoords(lat: number, lng: number): string {
  if (lat > -6.5) return "Piura";
  if (lat > -8.5 && lng < -78) return "Trujillo";
  if (lat > -7.5 && lng > -74) return "Iquitos";
  if (lat > -13 && lng < -76.5) return "Lima";
  if (lat > -13 && lng > -74) return "Huancayo";
  if (lat > -14.5 && lng > -70.5) return "Cusco";
  if (lat > -17 && lng < -72) return "Arequipa";
  if (lat > -16 && lng > -70.5) return "Puno";
  if (lat > -19) return "Tacna";
  return "Lima";
}

export default function MapaPage() {
  const { navigate } = useApp();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [sortBy, setSortBy] = useState<SortBy>("distance");
  const [filterRegion, setFilterRegion] = useState("Todas");
  const [filterType, setFilterType] = useState<FilterType>("Todas");
  const [filterSunedu, setFilterSunedu] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const userRegion = userLocation ? getRegionFromCoords(userLocation.lat, userLocation.lng) : null;

  function requestLocation() {
    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("granted");
        setSortBy("distance");
      },
      () => setLocationStatus("denied")
    );
  }

  const allRegions = useMemo(() => {
    const r = Array.from(new Set(universities.map((u) => u.region))).sort();
    return ["Todas", ...r];
  }, []);

  const withDistances = useMemo(() => {
    return universities.map((u) => ({
      ...u,
      distance: userLocation ? getDistance(userLocation.lat, userLocation.lng, u.lat, u.lng) : null,
    }));
  }, [userLocation]);

  const filtered = useMemo(() => {
    let list = withDistances;
    if (filterRegion !== "Todas") list = list.filter((u) => u.region === filterRegion);
    if (filterType !== "Todas") list = list.filter((u) => u.type === filterType);
    if (filterSunedu) list = list.filter((u) => u.sunedu);
    return list.sort((a, b) => {
      if (sortBy === "distance" && a.distance !== null && b.distance !== null) return a.distance - b.distance;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "cost") return a.cost - b.cost;
      if (sortBy === "empleabilidad") return b.empleabilidad - a.empleabilidad;
      return 0;
    });
  }, [withDistances, filterRegion, filterType, filterSunedu, sortBy]);

  const regionsWithUnis = useMemo(() => new Set(universities.map((u) => u.region)), []);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Mapa de Universidades</h1>
          <p className="text-sm text-gray-500 mt-1">Encuentra las universidades más cercanas y filtra por región, tipo y más.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — Map visual + location */}
          <div className="lg:col-span-1 space-y-4">
            {/* Location Card */}
            {locationStatus === "idle" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-[#0059FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin size={24} className="text-[#0059FF]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Universidades cercanas a ti</h3>
                <p className="text-xs text-gray-500 mb-4">Activa tu ubicación para ver las universidades ordenadas por distancia.</p>
                <button
                  onClick={requestLocation}
                  className="w-full py-2.5 bg-[#0059FF] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation size={15} />
                  Activar ubicación
                </button>
              </div>
            )}

            {locationStatus === "loading" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                <div className="w-8 h-8 border-3 border-[#0059FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" style={{ borderWidth: 3 }} />
                <p className="text-sm text-gray-600">Obteniendo tu ubicación...</p>
              </div>
            )}

            {locationStatus === "denied" && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Permiso denegado</p>
                    <p className="text-xs text-amber-700 mt-1">No se pudo obtener tu ubicación. Mostrando todas las universidades.</p>
                    <button
                      onClick={() => setLocationStatus("idle")}
                      className="mt-3 text-xs text-amber-700 font-semibold underline flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> Intentar de nuevo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {locationStatus === "granted" && (
              <div className="bg-green-50 rounded-2xl border border-green-200 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-800">✓ Ubicación obtenida</p>
                    <p className="text-xs text-green-700">{userRegion ?? "Perú"} · {userLocation?.lat.toFixed(3)}, {userLocation?.lng.toFixed(3)}</p>
                  </div>
                  <button onClick={requestLocation} className="text-xs text-green-700 font-semibold flex items-center gap-1 hover:underline">
                    <RotateCcw size={11} /> Actualizar
                  </button>
                </div>
              </div>
            )}

            {/* Peru Map SVG */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800">Regiones</h3>
                <span className="text-xs text-gray-400">{regionsWithUnis.size} con universidades</span>
              </div>
              <div className="relative w-full" style={{ paddingBottom: "130%" }}>
                <svg
                  viewBox="0 0 270 360"
                  className="absolute inset-0 w-full h-full"
                  style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #bfdbfe 100%)", borderRadius: 12 }}
                >
                  {/* Simplified Peru shape */}
                  <path
                    d="M 85 30 L 65 50 L 40 75 L 35 100 L 45 125 L 55 140 L 60 165 L 80 175 L 90 195 L 85 215 L 95 230 L 105 250 L 115 265 L 125 280 L 135 295 L 145 305 L 155 295 L 160 275 L 170 255 L 175 240 L 185 225 L 195 210 L 205 195 L 215 175 L 220 155 L 215 135 L 205 115 L 200 95 L 210 75 L 205 55 L 190 40 L 170 30 L 140 25 L 110 25 Z"
                    fill="#dbeafe"
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                    className="drop-shadow"
                  />
                  {/* Amazon region suggestion */}
                  <path
                    d="M 160 30 L 190 40 L 210 75 L 220 110 L 215 135 L 205 155 L 215 145 L 225 130 L 235 115 L 240 95 L 235 70 L 220 50 L 200 35 L 180 30 Z"
                    fill="#bbf7d0"
                    stroke="#86efac"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                  {/* Coast region suggestion */}
                  <path
                    d="M 85 30 L 65 50 L 40 75 L 35 100 L 45 125 L 55 140 L 65 160 L 80 175 L 90 195 L 85 215 L 95 230 L 100 230 L 95 215 L 90 200 L 82 185 L 72 170 L 60 155 L 55 140 L 48 120 L 42 95 L 50 70 L 70 48 L 88 32 Z"
                    fill="#fef9c3"
                    stroke="#fde047"
                    strokeWidth="1"
                    opacity="0.6"
                  />

                  {/* Region dots and labels */}
                  {PERU_REGIONS.map((region) => {
                    const hasUnis = regionsWithUnis.has(region.id);
                    const isActive = filterRegion === region.id;
                    const isHovered = hoveredRegion === region.id;
                    const uniCount = universities.filter((u) => u.region === region.id).length;
                    return (
                      <g key={region.id}>
                        <circle
                          cx={region.svgX}
                          cy={region.svgY}
                          r={isActive || isHovered ? 10 : 7}
                          fill={
                            isActive
                              ? "#0059FF"
                              : hasUnis
                              ? "#7C3AED"
                              : "#d1d5db"
                          }
                          stroke="white"
                          strokeWidth="2"
                          className="cursor-pointer transition-all"
                          onClick={() => setFilterRegion(filterRegion === region.id ? "Todas" : region.id)}
                          onMouseEnter={() => setHoveredRegion(region.id)}
                          onMouseLeave={() => setHoveredRegion(null)}
                        />
                        {hasUnis && (
                          <text
                            x={region.svgX}
                            y={region.svgY}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize="7"
                            fill="white"
                            fontWeight="bold"
                            className="pointer-events-none"
                          >
                            {uniCount}
                          </text>
                        )}
                        <text
                          x={region.svgX + 13}
                          y={region.svgY + 1}
                          fontSize="8"
                          fill="#374151"
                          fontWeight={isActive ? "bold" : "normal"}
                          className="pointer-events-none"
                        >
                          {region.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* User location dot */}
                  {locationStatus === "granted" && userRegion && (() => {
                    const r = PERU_REGIONS.find((r) => r.id === userRegion);
                    if (!r) return null;
                    return (
                      <g>
                        <circle cx={r.svgX - 5} cy={r.svgY - 5} r={6} fill="#D91023" stroke="white" strokeWidth="2" />
                        <circle cx={r.svgX - 5} cy={r.svgY - 5} r={10} fill="none" stroke="#D91023" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
                      </g>
                    );
                  })()}
                </svg>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] inline-block" /> Con universidades</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D91023] inline-block" /> Tu ubicación</span>
              </div>
              {filterRegion !== "Todas" && (
                <button onClick={() => setFilterRegion("Todas")} className="mt-2 text-xs text-[#0059FF] font-medium hover:underline">
                  × Limpiar filtro de región
                </button>
              )}
            </div>
          </div>

          {/* RIGHT — Results */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Row */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1.5">
                  <Filter size={14} className="text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500">Ordenar:</span>
                </div>
                {(["distance", "rating", "cost", "empleabilidad"] as SortBy[]).map((s) => {
                  const labels = { distance: "Distancia", rating: "Rating", cost: "Costo", empleabilidad: "Empleabilidad" };
                  return (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      disabled={s === "distance" && !userLocation}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        sortBy === s
                          ? "bg-[#0059FF] text-white"
                          : "bg-[#F4F6F9] text-gray-600 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      {labels[s]}
                    </button>
                  );
                })}

                <div className="relative ml-auto">
                  <select
                    className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 appearance-none bg-[#F4F6F9] pr-7 focus:outline-none"
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                  >
                    {allRegions.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 appearance-none bg-[#F4F6F9] pr-7 focus:outline-none"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                  >
                    {["Todas", "Pública", "Privada"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-600 font-medium">
                  <input
                    type="checkbox"
                    className="accent-[#0059FF] w-3.5 h-3.5"
                    checked={filterSunedu}
                    onChange={(e) => setFilterSunedu(e.target.checked)}
                  />
                  Solo SUNEDU
                </label>
              </div>

              <p className="text-xs text-gray-400 mt-2">{filtered.length} universidades encontradas</p>
            </div>

            {/* University Cards */}
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                  <MapPin size={36} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No hay universidades con estos filtros.</p>
                  <button onClick={() => { setFilterRegion("Todas"); setFilterType("Todas"); setFilterSunedu(false); }} className="mt-3 text-sm text-[#0059FF] hover:underline">Limpiar filtros</button>
                </div>
              )}

              {filtered.map((uni) => (
                <div key={uni.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:border-[#0059FF]/30 hover:shadow-sm transition-all relative">
                  {/* Distance badge */}
                  {uni.distance !== null && (
                    <span className="absolute top-3 right-3 bg-[#0059FF] text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow">
                      {uni.distance.toFixed(1)} km
                    </span>
                  )}
                  {uni.distance === null && (
                    <span className="absolute top-3 right-3 bg-gray-100 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                      — km
                    </span>
                  )}

                  {/* Thumbnail */}
                  <div
                    className="w-16 h-16 rounded-xl bg-blue-50 shrink-0 overflow-hidden"
                  >
                    <img
                      src={`https://images.unsplash.com/${uni.img}?w=80&h=80&fit=crop&auto=format`}
                      alt={uni.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-12">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{uni.short}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        uni.type === "Pública" ? "bg-green-100 text-green-700" : "bg-purple-100 text-[#7C3AED]"
                      }`}>{uni.type}</span>
                      {uni.sunedu && <span className="text-xs bg-blue-50 text-[#0059FF] px-1.5 py-0.5 rounded font-medium">SUNEDU ✓</span>}
                    </div>
                    <p className="text-xs text-gray-500 mb-2 truncate">{uni.city}, {uni.region}</p>

                    {/* Empleabilidad bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 shrink-0">Emplea.</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${uni.empleabilidad}%`, background: uni.empleabilidad >= 85 ? "#16A34A" : uni.empleabilidad >= 70 ? "#D97706" : "#D91023" }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{uni.empleabilidad}%</span>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2 shrink-0 pr-2">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#D97706" className="text-[#D97706]" />
                      <span className="text-sm font-bold text-gray-900">{uni.rating.toFixed(1)}</span>
                    </div>
                    <button
                      onClick={() => navigate("detalle", uni.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0059FF] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye size={12} />
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
