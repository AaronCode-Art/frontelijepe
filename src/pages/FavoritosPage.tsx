import { useState, useMemo } from "react";
import { Heart, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { useApp } from "@/context/AppContext";
import UniCard from "@/components/UniCard";
import { universities } from "@/data/universities";

type SortKey = "rating" | "costo" | "empleabilidad";
type FilterChip = "todas" | "publica" | "privada" | "lima" | "otras";
type ViewMode = "grid" | "list";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "rating", label: "Por rating" },
  { key: "costo", label: "Por costo" },
  { key: "empleabilidad", label: "Por empleabilidad" },
];

const filterChips: { key: FilterChip; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "publica", label: "Pública" },
  { key: "privada", label: "Privada" },
  { key: "lima", label: "Lima" },
  { key: "otras", label: "Otras regiones" },
];

export default function FavoritosPage() {
  const { state, navigate } = useApp();
  const [sort, setSort] = useState<SortKey>("rating");
  const [filter, setFilter] = useState<FilterChip>("todas");
  const [view, setView] = useState<ViewMode>("grid");

  const favUnis = useMemo(() => {
    let list = universities.filter((u) => state.favorites.includes(u.id));

    // Filter
    if (filter === "publica") list = list.filter((u) => u.type === "Pública");
    else if (filter === "privada") list = list.filter((u) => u.type === "Privada");
    else if (filter === "lima") list = list.filter((u) => u.region === "Lima");
    else if (filter === "otras") list = list.filter((u) => u.region !== "Lima");

    // Sort
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "costo") list = [...list].sort((a, b) => a.pensionMin - b.pensionMin);
    else if (sort === "empleabilidad") list = [...list].sort((a, b) => b.empleabilidad - a.empleabilidad);

    return list;
  }, [state.favorites, filter, sort]);

  return (
    <div className="min-h-screen bg-[#F4F6F9] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#D91023]" /> Mis favoritos
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {state.favorites.length} universidad{state.favorites.length !== 1 ? "es" : ""} guardada{state.favorites.length !== 1 ? "s" : ""}
            </p>
          </div>

          {state.favorites.length > 0 && (
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200 p-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 ml-2" />
                {sortOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSort(opt.key)}
                    className={[
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      sort === opt.key
                        ? "bg-[#0059FF] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                <button
                  onClick={() => setView("grid")}
                  className={[
                    "p-2 rounded-lg transition-all",
                    view === "grid" ? "bg-[#0059FF] text-white" : "text-gray-400 hover:text-gray-600",
                  ].join(" ")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={[
                    "p-2 rounded-lg transition-all",
                    view === "list" ? "bg-[#0059FF] text-white" : "text-gray-400 hover:text-gray-600",
                  ].join(" ")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {state.favorites.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6"
              style={{ background: "linear-gradient(135deg, #FEE2E2, #FECDD3)" }}
            >
              <Heart className="w-12 h-12 text-[#D91023]" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No tienes favoritos aún</h2>
            <p className="text-gray-500 text-sm max-w-xs mb-8 leading-relaxed">
              Explora universidades y guarda las que más te interesen haciendo clic en el corazón.
            </p>
            <button
              onClick={() => navigate("explorar")}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
              style={{ background: "#0059FF" }}
            >
              Explorar universidades
            </button>
          </div>
        ) : (
          <>
            {/* Filter chips */}
            <div className="flex gap-2 flex-wrap mb-6">
              {filterChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => setFilter(chip.key)}
                  className={[
                    "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all",
                    filter === chip.key
                      ? "bg-[#0059FF] text-white border-[#0059FF]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#0059FF] hover:text-[#0059FF]",
                  ].join(" ")}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* No results for filter */}
            {favUnis.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-sm">No hay favoritos para este filtro.</p>
                <button
                  onClick={() => setFilter("todas")}
                  className="mt-3 text-sm text-[#0059FF] hover:underline"
                >
                  Ver todos los favoritos
                </button>
              </div>
            ) : (
              <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-3"}>
                {favUnis.map((uni) => (
                  <UniCard key={uni.id} uni={uni} view={view} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
