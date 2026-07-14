import { useState } from "react";
import { Send, Twitter, Facebook, Instagram, Youtube, ExternalLink } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Page } from "@/types";

export default function Footer() {
  const { navigate } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const link = (label: string, page: Page, uniId?: number) => (
    <button
      onClick={() => navigate(page, uniId)}
      className="text-gray-400 hover:text-white text-sm transition-colors text-left"
    >
      {label}
    </button>
  );

  return (
    <footer className="bg-gray-900 text-white">
      {/* Inspirational banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-black leading-snug mb-4">
            🚀 Tu carrera perfecta está a un dato real de distancia.
            <br />
            <span className="text-yellow-300">¡El Perú necesita tu talento! ⭐</span>
          </p>
          <p className="text-blue-100 text-sm mb-6">
            Más de 120 universidades. Datos reales. Decisiones inteligentes.
          </p>
          {/* Quick access pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "🧠 Test Vocacional", page: "test" as Page },
              { label: "⚖️ Comparador", page: "comparador" as Page },
              { label: "💬 Comunidad", page: "comunidad" as Page },
            ].map((item) => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Logo + newsletter */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-2xl font-black">
              <span className="text-blue-400">Elige</span>
              <span className="inline-flex items-center justify-center text-white text-xs font-bold rounded px-1 py-0.5 ml-0.5 bg-red-600">
                Pe
              </span>
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-5 leading-relaxed">
            La plataforma #1 para elegir tu universidad en el Perú. Datos reales, comparaciones honestas.
          </p>
          {/* Social icons */}
          <div className="flex gap-3 mb-6">
            {[
              { icon: <Twitter size={16} />, label: "Twitter" },
              { icon: <Facebook size={16} />, label: "Facebook" },
              { icon: <Instagram size={16} />, label: "Instagram" },
              { icon: <Youtube size={16} />, label: "YouTube" },
            ].map(({ icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                {icon}
              </button>
            ))}
          </div>
          {/* Newsletter */}
          <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Newsletter gratuito
          </p>
          {subscribed ? (
            <p className="text-green-400 text-sm font-medium">✅ ¡Suscrito! Revisa tu correo.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                aria-label="Suscribirse"
              >
                <Send size={15} />
              </button>
            </form>
          )}
        </div>

        {/* Col 2: Plataforma */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Plataforma</h3>
          <div className="flex flex-col gap-3">
            {link("Explorar universidades", "explorar")}
            {link("Test vocacional", "test")}
            {link("Simulador de costos", "simulador")}
            {link("Comparador", "comparador")}
            {link("Mapa universitario", "mapa")}
            {link("Comunidad", "comunidad")}
            {link("Asesor IA", "ia")}
          </div>
        </div>

        {/* Col 3: Mi cuenta */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Mi Cuenta</h3>
          <div className="flex flex-col gap-3">
            {link("Mi perfil", "perfil")}
            {link("Mis favoritos", "favoritos")}
            {link("Dashboard financiero", "financiero")}
            {link("Historial IA", "chat-history")}
            {link("Notificaciones", "notificaciones")}
            {link("Mis resultados", "test")}
          </div>
        </div>

        {/* Col 4: Legal + contacto */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal y Contacto</h3>
          <div className="flex flex-col gap-3">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Términos de uso</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Política de datos</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contacto</a>
            <a
              href="https://www.sunedu.gob.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-yellow-400 text-sm transition-colors"
            >
              SUNEDU oficial <ExternalLink size={12} />
            </a>
            <a
              href="https://www.minedu.gob.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-yellow-400 text-sm transition-colors"
            >
              MINEDU oficial <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>🇵🇪</span>
            <span>Hecho con orgullo en el Perú</span>
            <span className="text-gray-700">|</span>
            <span>© {new Date().getFullYear()} ElijePe. Todos los derechos reservados.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Accesibilidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
