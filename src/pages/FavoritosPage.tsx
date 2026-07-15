import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
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

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } } };

export default function FavoritosPage() {
  const { state, navigate } = useApp();
  const [sort, setSort] = useState<SortKey>("rating");
  const [filter, setFilter] = useState<FilterChip>("todas");
  const [view, setView] = useState<ViewMode>("grid");

  const favUnis = useMemo(() => {
    let list = universities.filter((u) => state.favorites.includes(u.id));
    if (filter === "publica") list = list.filter((u) => u.type === "Pública");
    else if (filter === "privada") list = list.filter((u) => u.type === "Privada");
    else if (filter === "lima") list = list.filter((u) => u.region === "Lima");
    else if (filter === "otras") list = list.filter((u) => u.region !== "Lima");

    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === "costo") list = [...list].sort((a, b) => a.pensionMin - b.pensionMin);
    else if (sort === "empleabilidad") list = [...list].sort((a, b) => b.empleabilidad - a.empleabilidad);

    return list;
  }, [state.favorites, filter, sort]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6 flex-wrap gap-3"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Heart className="w-5 h-5 text-white" />
              </div>
              Mis favoritos
            </h1>
            <p className="text-sm text-gray-500 mt-1 ml-11">
              {state.favorites.length} universidad{state.favorites.length !== 1 ? "es" : ""} guardada{state.favorites.length !== 1 ? "s" : ""}
            </p>
          </div>

          {state.favorites.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-200/80 p-1 shadow-sm">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 ml-2" />
                {sortOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setSort(opt.key)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      sort === opt.key ? "text-white" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {sort === opt.key && (
                      <motion.div
                        layoutId="sort-pill"
                        className="absolute inset-0 bg-gradient-to-r from-[#0059FF] to-[#0047CC] rounded-lg shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex bg-white rounded-xl border border-gray-200/80 p-1 shadow-sm">
                {([
                  { mode: "grid" as ViewMode, Icon: LayoutGrid },
                  { mode: "list" as ViewMode, Icon: List },
                ]).map(({ mode, Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setView(mode)}
                    className={`relative p-2 rounded-lg transition-all ${view === mode ? "text-white" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {view === mode && (
                      <motion.div
                        layoutId="view-pill"
                        className="absolute inset-0 bg-gradient-to-r from-[#0059FF] to-[#0047CC] rounded-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {state.favorites.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mb-6 shadow-lg shadow-red-100"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 text-rose-400" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No tienes favoritos aún</h2>
            <p className="text-gray-500 text-sm max-w-xs mb-8 leading-relaxed">
              Explora universidades y guarda las que más te interesen haciendo clic en el corazón.
            </p>
            <motion.button
              onClick={() => navigate("explorar")}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#0059FF] to-[#0047CC] shadow-lg shadow-blue-500/25"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Explorar universidades
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Filter chips */}
            <motion.div
              className="flex gap-2 flex-wrap mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {filterChips.map((chip) => (
                <motion.button
                  key={chip.key}
                  onClick={() => setFilter(chip.key)}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    filter === chip.key ? "text-white" : "bg-white text-gray-600 border-gray-200 hover:border-[#0059FF] hover:text-[#0059FF]"
                  }`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {filter === chip.key && (
                    <motion.div
                      layoutId="chip-pill"
                      className="absolute inset-0 bg-gradient-to-r from-[#0059FF] to-[#0047CC] rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{chip.label}</span>
                </motion.button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {favUnis.length === 0 ? (
                <motion.div
                  key="no-results"
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-gray-500 text-sm">No hay favoritos para este filtro.</p>
                  <motion.button
                    onClick={() => setFilter("todas")}
                    className="mt-3 text-sm text-[#0059FF] hover:underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    Ver todos los favoritos
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${view}-${filter}-${sort}`}
                  className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-3"}
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                >
                  {favUnis.map((uni) => (
                    <motion.div key={uni.id} variants={fadeUp} layout>
                      <UniCard uni={uni} view={view} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
