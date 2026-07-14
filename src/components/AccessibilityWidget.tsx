import { useState, useRef, useEffect } from "react";
import { Accessibility, X, Minus, Plus, Contrast, Pause, Type, RotateCcw } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";

/**
 * Botón flotante disponible en TODA la app (ver App.tsx). Permite ajustar
 * tamaño de texto, alto contraste, reducir animaciones y usar una fuente más
 * cómoda para personas con dislexia — sin recargar la página ni depender de
 * configuración del navegador. Los cambios se guardan y se mantienen entre
 * sesiones.
 */
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
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Opciones de accesibilidad"
        title="Accesibilidad"
        className="fixed bottom-24 right-5 z-[60] w-12 h-12 rounded-full bg-[#0033CC] text-white shadow-lg flex items-center justify-center hover:bg-blue-800 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
      >
        <Accessibility size={22} />
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Opciones de accesibilidad"
          className="fixed bottom-40 right-5 z-[60] w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#0033CC] text-white">
            <div className="flex items-center gap-2">
              <Accessibility size={16} />
              <h2 className="text-sm font-bold">Accesibilidad</h2>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar panel de accesibilidad" className="hover:opacity-80">
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Tamaño de texto */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Type size={12} /> Tamaño de texto
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontScale(scaleSteps[Math.max(0, scaleIndex - 1)].value)}
                  disabled={scaleIndex === 0}
                  aria-label="Reducir tamaño de texto"
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <div className="flex-1 text-center text-xs text-gray-500">
                  {fontScale === "normal" ? "Normal" : fontScale === "grande" ? "Grande" : "Muy grande"}
                </div>
                <button
                  onClick={() => setFontScale(scaleSteps[Math.min(2, scaleIndex + 1)].value)}
                  disabled={scaleIndex === 2}
                  aria-label="Aumentar tamaño de texto"
                  className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Toggles */}
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

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 pt-1"
            >
              <RotateCcw size={12} /> Restablecer valores
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleRow({ icon, label, checked, onChange }: { icon: React.ReactNode; label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <span className="flex items-center gap-2 text-sm text-gray-700">
        <span className="text-gray-500">{icon}</span>
        {label}
      </span>
      <span
        className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${checked ? "bg-[#0033CC] justify-end" : "bg-gray-200 justify-start"}`}
      >
        <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
      </span>
    </button>
  );
}
