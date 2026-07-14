import { useState } from "react";
import { Lightbulb, X } from "lucide-react";

/**
 * Caja de ayuda breve, en lenguaje simple, que se puede cerrar y no vuelve a
 * aparecer (se recuerda por `storageKey`). Pensada para dar UNA sola
 * indicación clara en el momento justo, en vez de sobrecargar toda la
 * pantalla con texto explicativo permanente.
 */
interface GuideCalloutProps {
  storageKey: string;
  title: string;
  children: React.ReactNode;
  color?: "blue" | "purple" | "green";
}

const COLORS = {
  blue: { bg: "bg-blue-50", border: "border-blue-100", icon: "text-blue-500", title: "text-blue-900", text: "text-blue-700" },
  purple: { bg: "bg-purple-50", border: "border-purple-100", icon: "text-purple-500", title: "text-purple-900", text: "text-purple-700" },
  green: { bg: "bg-green-50", border: "border-green-100", icon: "text-green-600", title: "text-green-900", text: "text-green-700" },
};

export default function GuideCallout({ storageKey, title, children, color = "blue" }: GuideCalloutProps) {
  const key = `elijepe_guia_cerrada_${storageKey}`;
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(key) === "1");
  const c = COLORS[color];

  if (dismissed) return null;

  function dismiss() {
    localStorage.setItem(key, "1");
    setDismissed(true);
  }

  return (
    <div role="note" className={`flex items-start gap-3 ${c.bg} border ${c.border} rounded-xl px-4 py-3 mb-5`}>
      <Lightbulb size={16} className={`${c.icon} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${c.title} mb-0.5`}>{title}</p>
        <div className={`text-xs ${c.text} leading-relaxed`}>{children}</div>
      </div>
      <button
        onClick={dismiss}
        aria-label="Entendido, no volver a mostrar esta ayuda"
        title="Entendido"
        className={`${c.icon} hover:opacity-70 flex-shrink-0`}
      >
        <X size={15} />
      </button>
    </div>
  );
}
