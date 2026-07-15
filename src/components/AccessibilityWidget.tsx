import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Accessibility, X, Minus, Plus, Contrast, Pause, Type, RotateCcw } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";

export default function AccessibilityWidget() {
  const {
    fontScale, setFontScale, highContrast, toggleHighContrast,
    reduceMotion, toggleReduceMotion, dyslexiaFont, toggleDyslexiaFont, reset,
  } = useAccessibility();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const scaleSteps: { value: typeof fontScale; label: string }[] = [
    { value: "normal", label: "A" },
    { value: "grande", label: "A" },
    { value: "muy-grande", label: "A" },
  ];
  const scaleIndex = scaleSteps.findIndex((s) => s.value === fontScale);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Opciones de accesibilidad"
        title="Accesibilidad"
        className="fixed bottom-24 right-5 z-[60] w-12 h-12 rounded-full bg-gradient-to-r from-blue-800 to-blue-700 text-white shadow-lg shadow-blue-900/20 flex items-center justify-center hover:from-blue-700 hover:to-blue-600 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
      >
        <Accessibility size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-label="Opciones de accesibilidad"
            className="fixed bottom-40 right-5 z-[60] w-72 bg-white rounded-2xl shadow-2xl shadow-gray-300/40 border border-gray-100/60 overflow-hidden"
          >
            <div className="relative flex items-center justify-between px-4 py-3 text-white overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-700" />
              <div className="relative flex items-center gap-2">
                <Accessibility size={16} />
                <h2 className="text-sm font-bold">Accesibilidad</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                aria-label="Cerrar panel de accesibilidad"
                className="relative hover:opacity-80"
              >
                <X size={16} />
              </motion.button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Type size={12} /> Tamano de texto
                </p>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFontScale(scaleSteps[Math.max(0, scaleIndex - 1)].value)}
                    disabled={scaleIndex === 0}
                    aria-label="Reducir tamano de texto"
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <Minus size={14} />
                  </motion.button>
                  <div className="flex-1 text-center text-xs text-gray-500 font-medium">
                    {fontScale === "normal" ? "Normal" : fontScale === "grande" ? "Grande" : "Muy grande"}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFontScale(scaleSteps[Math.min(2, scaleIndex + 1)].value)}
                    disabled={scaleIndex === 2}
                    aria-label="Aumentar tamano de texto"
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>

              <ToggleRow
                icon={<Contrast size={15} />}
                label="Alto contraste"
                checked={highContrast}
                onChange={toggleHighContrast}
              />
              <ToggleRow
                icon={<Pause size={15} />}
                label="Reducir animaciones"
                checked={reduceMotion}
                onChange={toggleReduceMotion}
              />
              <ToggleRow
                icon={<span className="text-sm font-serif italic">Aa</span>}
                label="Fuente para dislexia"
                checked={dyslexiaFont}
                onChange={toggleDyslexiaFont}
              />

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={reset}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 pt-1 transition-colors"
              >
                <RotateCcw size={12} /> Restablecer valores
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ToggleRow({ icon, label, checked, onChange }: { icon: React.ReactNode; label: string; checked: boolean; onChange: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50/60 transition-colors"
    >
      <span className="flex items-center gap-2 text-sm text-gray-700">
        <span className="text-gray-500">{icon}</span>
        {label}
      </span>
      <span
        className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all duration-300 ${checked ? "bg-gradient-to-r from-blue-800 to-blue-700 justify-end" : "bg-gray-200 justify-start"}`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </span>
    </motion.button>
  );
}
