import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type FontScale = "normal" | "grande" | "muy-grande";

interface AccessibilitySettings {
  fontScale: FontScale;
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setFontScale: (v: FontScale) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleDyslexiaFont: () => void;
  reset: () => void;
}

const STORAGE_KEY = "elijepe_accesibilidad";

const defaultSettings: AccessibilitySettings = {
  fontScale: "normal",
  highContrast: false,
  // Respetamos la preferencia del sistema operativo desde el arranque, sin
  // que la persona tenga que ir a buscar el botón para desactivar animaciones.
  reduceMotion: typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
  dyslexiaFont: false,
};

function loadSettings(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    /* localStorage no disponible o dato corrupto: usamos los valores por defecto */
  }
  return defaultSettings;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("a11y-contraste-alto", settings.highContrast);
    root.classList.toggle("a11y-reducir-movimiento", settings.reduceMotion);
    root.classList.toggle("a11y-fuente-dislexia", settings.dyslexiaFont);
    root.classList.remove("a11y-texto-grande", "a11y-texto-muy-grande");
    if (settings.fontScale === "grande") root.classList.add("a11y-texto-grande");
    if (settings.fontScale === "muy-grande") root.classList.add("a11y-texto-muy-grande");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const value: AccessibilityContextType = {
    ...settings,
    setFontScale: (fontScale) => setSettings((s) => ({ ...s, fontScale })),
    toggleHighContrast: () => setSettings((s) => ({ ...s, highContrast: !s.highContrast })),
    toggleReduceMotion: () => setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion })),
    toggleDyslexiaFont: () => setSettings((s) => ({ ...s, dyslexiaFont: !s.dyslexiaFont })),
    reset: () => setSettings(defaultSettings),
  };

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility debe usarse dentro de <AccessibilityProvider>");
  return ctx;
}
