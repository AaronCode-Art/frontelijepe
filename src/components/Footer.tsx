import { useState } from "react";
import { motion } from "motion/react";
import { Send, Twitter, Facebook, Instagram, Youtube, ExternalLink, Heart } from "lucide-react";
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
    <motion.button
      whileHover={{ x: 3 }}
      onClick={() => navigate(page, uniId)}
      className="text-gray-400 hover:text-white text-sm transition-colors text-left"
    >
      {label}
    </motion.button>
  );

  return (
    <footer className="bg-gray-900 text-white">
      {/* Inspirational banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-violet/60 to-indigo-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-violet/20 rounded-full blur-3xl" />
        </div>
        <div className="relative py-8 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-black leading-snug mb-4"
            >
              Tu carrera perfecta esta a un dato real de distancia.
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">
                El Perú necesita tu talento!
              </span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-blue-100/80 text-sm mb-6"
            >
              Mas de 120 universidades. Datos reales. Decisiones inteligentes.
            </motion.p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Test Vocacional", page: "test" as Page, icon: "🧠" },
                { label: "Comparador", page: "comparador" as Page, icon: "⚖️" },
                { label: "Comunidad", page: "comunidad" as Page, icon: "💬" },
              ].map((item, i) => (
                <motion.button
                  key={item.page}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.page)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-full text-sm font-semibold transition-all"
                >
                  {item.icon} {item.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: Logo + newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-2xl font-black">
              <span className="bg-gradient-to-r from-blue-400 to-cyan bg-clip-text text-transparent">Elige</span>
              <span className="inline-flex items-center justify-center text-white text-xs font-bold rounded-lg px-1.5 py-0.5 ml-0.5 bg-gradient-to-r from-red-500 to-red-400">
                Pe
              </span>
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-5 leading-relaxed">
            La plataforma #1 para elegir tu universidad en el Perú. Datos reales, comparaciones honestas.
          </p>
          <div className="flex gap-3 mb-6">
            {[
              { icon: <Twitter size={16} />, label: "Twitter" },
              { icon: <Facebook size={16} />, label: "Facebook" },
              { icon: <Instagram size={16} />, label: "Instagram" },
              { icon: <Youtube size={16} />, label: "YouTube" },
            ].map(({ icon, label }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={label}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                {icon}
              </motion.button>
            ))}
          </div>
          <p className="text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Newsletter gratuito
          </p>
          {subscribed ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald text-sm font-medium flex items-center gap-1.5"
            >
              <Heart size={14} className="fill-emerald" /> Suscrito! Revisa tu correo.
            </motion.p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="flex-1 bg-gray-800/80 border border-gray-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all shadow-sm shadow-blue-800/30"
                aria-label="Suscribirse"
              >
                <Send size={15} />
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Col 2: Plataforma */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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
        </motion.div>

        {/* Col 3: Mi cuenta */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Mi Cuenta</h3>
          <div className="flex flex-col gap-3">
            {link("Mi perfil", "perfil")}
            {link("Mis favoritos", "favoritos")}
            {link("Dashboard financiero", "financiero")}
            {link("Historial IA", "chat-history")}
            {link("Notificaciones", "notificaciones")}
            {link("Mis resultados", "test")}
          </div>
        </motion.div>

        {/* Col 4: Legal + contacto */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal y Contacto</h3>
          <div className="flex flex-col gap-3">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Politica de privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terminos de uso</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Politica de datos</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contacto</a>
            <a
              href="https://www.sunedu.gob.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-amber text-sm transition-colors"
            >
              SUNEDU oficial <ExternalLink size={12} />
            </a>
            <a
              href="https://www.minedu.gob.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-400 hover:text-amber text-sm transition-colors"
            >
              MINEDU oficial <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Hecho con orgullo en el Perú</span>
            <span className="text-gray-700">|</span>
            <span>&copy; {new Date().getFullYear()} ElijePe. Todos los derechos reservados.</span>
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
