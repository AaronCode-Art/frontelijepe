import { motion } from "motion/react";
import { useApp } from "@/context/AppContext";
import UniCard from "@/components/UniCard";
import { universities } from "@/data/universities";
import type { Page } from "@/types";
import {
  Search, FlaskConical, Heart, BarChart2, Eye, ClipboardCheck,
  Compass, GraduationCap, Calculator, Users, Bell, DollarSign,
  ChevronRight, TrendingUp,
} from "lucide-react";

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

export default function DashboardPage() {
  const { state, navigate, dispatch } = useApp();
  const { user, favorites, compareList, viewedUnis, notifications, financieroEnabled, currentTestAnswers } = state;

  if (!user) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const testProgress = Object.keys(currentTestAnswers).length;
  const favUnis = universities.filter((u) => favorites.includes(u.id)).slice(0, 3);
  const unreadNotifs = notifications.filter((n) => !n.read).slice(0, 4);

  const contextualMessage: Record<string, string> = {
    egresado: "Explora las mejores opciones para continuar tu formación profesional.",
    traslado: "Encuentra universidades que acepten traslado con tus créditos aprobados.",
    padre: "Apoya la decisión académica de tu familia con datos verificados.",
  };

  const statCards = [
    { label: "Favoritos", value: favorites.length, icon: <Heart size={20} className="text-red-500" />, color: "bg-gradient-to-br from-red-50 to-red-100/50", page: "favoritos" as Page },
    { label: "Comparando", value: compareList.length, icon: <BarChart2 size={20} className="text-purple-600" />, color: "bg-gradient-to-br from-purple-50 to-purple-100/50", page: "comparador" as Page },
    { label: "Visitadas", value: viewedUnis.length, icon: <Eye size={20} className="text-blue-500" />, color: "bg-gradient-to-br from-blue-50 to-blue-100/50", page: "explorar" as Page },
    { label: `Test ${testProgress}/8`, value: `${Math.round((testProgress / 8) * 100)}%`, icon: <ClipboardCheck size={20} className="text-emerald-600" />, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", page: "test" as Page },
  ];

  const quickActions = [
    { icon: <Compass size={22} className="text-blue-600" />, label: "Explorar", subtitle: "Busca por filtros", page: "explorar" as Page, bg: "bg-gradient-to-br from-blue-50 to-blue-100/50" },
    { icon: <FlaskConical size={22} className="text-purple-600" />, label: "Test Vocacional", subtitle: "Descubre tu carrera", page: "test" as Page, bg: "bg-gradient-to-br from-purple-50 to-purple-100/50" },
    { icon: <Calculator size={22} className="text-emerald-600" />, label: "Simulador", subtitle: "Estima tu admisión", page: "simulador" as Page, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50" },
    { icon: <Users size={22} className="text-orange-500" />, label: "Comunidad", subtitle: "Opiniones reales", page: "comunidad" as Page, bg: "bg-gradient-to-br from-orange-50 to-orange-100/50" },
    { icon: <Heart size={22} className="text-red-500" />, label: "Favoritos", subtitle: `${favorites.length} guardadas`, page: "favoritos" as Page, bg: "bg-gradient-to-br from-red-50 to-red-100/50" },
    { icon: <Bell size={22} className="text-amber-500" />, label: "Notificaciones", subtitle: `${unreadCount} sin leer`, page: "notificaciones" as Page, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50" },
  ];

  const notifTypeColor: Record<string, string> = {
    success: "bg-emerald-100 text-emerald-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden text-white px-5 pt-10 pb-14">
        {/* Multi-color gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0059FF] via-[#2563EB] to-[#7C3AED]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

        {/* Animated decorative blobs */}
        <motion.div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-400/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-amber-300/15 to-orange-300/5 blur-2xl"
          animate={{ scale: [1, 1.1, 1], x: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -top-10 left-1/3 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-400/5 blur-3xl"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Dot pattern overlay */}
        <motion.div className="absolute inset-0 opacity-[0.04]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white/80">Panel principal</span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl font-black mb-2 leading-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Bienvenido/a de vuelta,{" "}
            <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 bg-clip-text text-transparent">
              {user.nombre}
            </span>
            <motion.span
              className="inline-block ml-1"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, delay: 0.6, ease: "easeInOut" }}
            >
              👋
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-white/60 text-base mb-7 max-w-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {contextualMessage[user.tipo]}
          </motion.p>

          <motion.div
            className="flex gap-3 flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => navigate("explorar")}
              className="flex items-center gap-2 bg-white text-[#0059FF] font-bold px-6 py-3 rounded-2xl transition-all text-sm shadow-xl shadow-black/15"
              whileHover={{ scale: 1.04, y: -2, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.25)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Search size={17} /> Buscar universidades
            </motion.button>
            <motion.button
              onClick={() => navigate("test")}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-2xl transition-all text-sm backdrop-blur-md"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <FlaskConical size={17} /> Continuar test
            </motion.button>
          </motion.div>

          {/* Mini stats row */}
          <motion.div
            className="flex gap-6 mt-7 pt-5 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { val: favorites.length, label: "Favoritos", icon: <Heart size={13} className="text-pink-300" /> },
              { val: viewedUnis.length, label: "Visitadas", icon: <Eye size={13} className="text-cyan-300" /> },
              { val: `${Math.round((testProgress / 8) * 100)}%`, label: "Test", icon: <ClipboardCheck size={13} className="text-amber-300" /> },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">{s.icon}</div>
                <div>
                  <p className="text-sm font-bold leading-none">{s.val}</p>
                  <p className="text-[10px] text-white/50 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-5">
        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {statCards.map((card) => (
            <motion.button
              key={card.label}
              onClick={() => navigate(card.page)}
              variants={fadeUp}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80 text-left hover:shadow-md transition-shadow"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </motion.button>
          ))}
        </motion.div>

        {/* Quick actions grid */}
        <div className="mb-6">
          <motion.h2
            className="text-base font-bold text-gray-800 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Acciones rápidas
          </motion.h2>
          <motion.div
            className="grid grid-cols-3 gap-3"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                onClick={() => navigate(action.page)}
                variants={fadeUp}
                className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100/80 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${action.bg}`}>
                  {action.icon}
                </div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{action.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{action.subtitle}</p>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Financial shortcut */}
        {financieroEnabled && (
          <motion.button
            onClick={() => navigate("financiero")}
            className="w-full flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/60 rounded-2xl p-4 mb-6 hover:shadow-md transition-all text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center shrink-0">
              <DollarSign size={24} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">Dashboard Financiero</p>
              <p className="text-xs text-gray-500">Simula costos, becas y financiamiento</p>
            </div>
            <TrendingUp size={18} className="text-emerald-500" />
          </motion.button>
        )}

        {/* Saved universities */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <motion.h2
              className="text-base font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Mis universidades guardadas
            </motion.h2>
            <motion.button
              onClick={() => navigate("favoritos")}
              className="text-sm text-[#0059FF] font-semibold flex items-center gap-1 hover:underline"
              whileHover={{ x: 3 }}
            >
              Ver todas <ChevronRight size={14} />
            </motion.button>
          </div>
          {favUnis.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 gap-4"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {favUnis.map((uni) => (
                <motion.div key={uni.id} variants={fadeUp}>
                  <UniCard uni={uni} view="list" />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl p-8 text-center border border-gray-100/80"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Heart size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Aún no has guardado universidades.</p>
              <motion.button
                onClick={() => navigate("explorar")}
                className="mt-3 text-sm font-semibold text-[#0059FF] hover:underline"
                whileHover={{ scale: 1.05 }}
              >
                Explorar ahora
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <motion.h2
              className="text-base font-bold text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Últimas novedades
            </motion.h2>
            {unreadCount > 0 && (
              <motion.span
                className="text-xs bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold px-2 py-0.5 rounded-full shadow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {unreadCount} nuevas
              </motion.span>
            )}
          </div>
          {unreadNotifs.length > 0 ? (
            <motion.div
              className="space-y-2"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {unreadNotifs.map((notif) => (
                <motion.div
                  key={notif.id}
                  variants={fadeUp}
                  className="bg-white rounded-2xl p-4 border border-gray-100/80 shadow-sm flex gap-3 items-start cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    dispatch({ type: "MARK_NOTIF_READ", id: notif.id });
                    navigate("notificaciones");
                  }}
                  whileHover={{ x: 4 }}
                >
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${notifTypeColor[notif.type]}`}>
                    {notif.type === "success" ? "✓" : notif.type === "warning" ? "!" : "i"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{notif.time}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-2xl p-6 text-center border border-gray-100/80"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Bell size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Todo al día, sin novedades pendientes.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
