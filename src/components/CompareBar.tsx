import { X, BarChart2, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { universities } from "@/data/universities";

export default function CompareBar() {
  const { state, dispatch, navigate } = useApp();
  const { compareList } = state;

  if (compareList.length === 0) return null;

  const compareUnis = compareList
    .map((id) => universities.find((u) => u.id === id))
    .filter(Boolean) as typeof universities;

  const atMax = compareList.length >= 5;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 pointer-events-none">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-3 pointer-events-auto">
        {/* Max warning */}
        {atMax && (
          <div className="flex items-center gap-1.5 text-amber-600 text-xs font-medium bg-amber-50 rounded-lg px-3 py-1.5 mb-2">
            <AlertTriangle size={13} />
            Máximo 5 universidades. Elimina una para agregar otra.
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Mini cards */}
          <div className="flex items-center gap-2 flex-1 overflow-x-auto pb-0.5 scrollbar-hide">
            {compareUnis.map((uni) => {
              const imgUrl = `https://images.unsplash.com/${uni.img}?w=120&q=70&fit=crop`;
              return (
                <div
                  key={uni.id}
                  className="relative shrink-0 flex flex-col items-center gap-1 group"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-100 group-hover:border-purple-400 transition-colors">
                    <img src={imgUrl} alt={uni.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => dispatch({ type: "TOGGLE_COMPARE", id: uni.id })}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      aria-label={`Quitar ${uni.short}`}
                    >
                      <X size={9} />
                    </button>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight max-w-[56px] truncate">
                    {uni.short}
                  </span>
                </div>
              );
            })}

            {/* Empty slots */}
            {compareList.length < 5 && Array.from({ length: Math.min(2, 5 - compareList.length) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="shrink-0 w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center"
              >
                <span className="text-gray-300 text-xs">+</span>
              </div>
            ))}
          </div>

          {/* Count badge + action */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400 font-medium">
              {compareList.length}/5 seleccionadas
            </span>
            <button
              onClick={() => navigate("comparador")}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-all active:scale-95 shadow-lg shadow-purple-200"
            >
              <BarChart2 size={15} />
              Comparar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
