/**
 * Indicador de pasos para procesos largos (Simulador, pago de IA, registro).
 * Ayuda a que la persona sepa siempre dónde está y cuánto le falta — reduce
 * la sensación de "sobrecarga" y la probabilidad de abandonar a mitad del
 * proceso porque no sabe cuánto queda.
 */
interface Step {
  label: string;
}

interface StepProgressProps {
  steps: Step[];
  current: number; // índice 0-based del paso activo
}

export default function StepProgress({ steps, current }: StepProgressProps) {
  return (
    <nav aria-label="Progreso del proceso" className="mb-6">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step.label} className="flex-1 flex items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  aria-current={active ? "step" : undefined}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                    ${done ? "bg-[#16A34A] text-white" : active ? "bg-[#0059FF] text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <span className={`text-[11px] text-center max-w-[80px] leading-tight ${active ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1.5 mb-4 transition-colors ${done ? "bg-[#16A34A]" : "bg-gray-200"}`} />
              )}
            </li>
          );
        })}
      </ol>
      <p className="sr-only" aria-live="polite">
        Paso {current + 1} de {steps.length}: {steps[current]?.label}
      </p>
    </nav>
  );
}
