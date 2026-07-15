import { motion, AnimatePresence } from "motion/react";
import { X, BarChart2, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { universities } from "@/data/universities";

export default function CompareBar() {
  const { state, dispatch, navigate } = useApp();
  const { compareList } = state;

  const compareUnis = compareList
    .map((id) => universities.find((u) => u.id === id))
    .filter(Boolean) as typeof universities;

  const atMax = compareList.length >= 5;

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-gray-100/60 shadow-xl shadow-gray-300/30 rounded-2xl p-3 pointer-events-auto">
            {atMax && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-1.5 text-amber-600 text-xs font-medium bg-amber-light rounded-xl px-3 py-1.5 mb-2"
              >
                <AlertTriangle size={13} />
                Maximo 5 universidades. Elimina una para agregar otra.
              </motion.div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-0.5 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {compareUnis.map((uni, i) => {
                    const imgUrl = `https://images.unsplash.com/${uni.img}?w=120&q=70&fit=crop`;
                    return (
                      <motion.div
                        key={uni.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25, delay: i * 0.05 }}
                        layout
                        className="relative shrink-0 flex flex-col items-center gap-1 group"
                      >
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-100 group-hover:border-violet/30 transition-colors shadow-sm">
                          <img src={imgUrl} alt={uni.name} className="w-full h-full object-cover" />
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => dispatch({ type: "TOGGLE_COMPARE", id: uni.id })}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            aria-label={`Quitar ${uni.short}`}
                          >
                            <X size={9} />
                          </motion.button>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight max-w-[56px] truncate">
                          {uni.short}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {compareList.length < 5 && Array.from({ length: Math.min(2, 5 - compareList.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="shrink-0 w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center"
                  >
                    <span className="text-gray-300 text-xs">+</span>
                  </div>
                ))}
              </div>

              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className="text-xs text-gray-400 font-medium">
                  {compareList.length}/5 seleccionadas
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("comparador")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet to-purple-500 hover:from-violet/90 hover:to-purple-500/90 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet/20"
                >
                  <BarChart2 size={15} />
                  Comparar Ahora
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
