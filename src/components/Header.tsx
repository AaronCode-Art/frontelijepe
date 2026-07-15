import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, Bell, User, ChevronDown, Menu, X, Home, Compass, FlaskConical, Calculator, Users, HeartHandshake, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Page } from "@/types";
import ChatHistorySidebar from "@/components/ChatHistorySidebar";

interface HeaderProps {
  page?: Page;
}

const navLinks: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: "Inicio", page: "home", icon: <Home size={15} /> },
  { label: "Explorar", page: "explorar", icon: <Compass size={15} /> },
  { label: "Test Vocacional", page: "test", icon: <FlaskConical size={15} /> },
  { label: "Simulador", page: "simulador", icon: <Calculator size={15} /> },
  { label: "Comunidad", page: "comunidad", icon: <Users size={15} /> },
  { label: "Especialistas", page: "especialistas", icon: <HeartHandshake size={15} /> },
];

export default function Header({ page: pageProp }: HeaderProps) {
  const { state, page: contextPage, navigate, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);

  const currentPage = pageProp ?? contextPage;

  if (!state.user) return null;

  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const favCount = state.favorites.length;

  const userMenuItems: { label: string; page: Page }[] = [
    { label: "Perfil", page: "perfil" },
    { label: "Favoritos", page: "favoritos" },
    { label: "Dashboard Financiero", page: "financiero" },
    { label: "Historial IA", page: "chat-history" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/60 shadow-[0_1px_3px_rgba(0,89,255,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <motion.button
          onClick={() => navigate("dashboard")}
          className="flex items-center gap-1.5 shrink-0 group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Elige</span>
            <span className="inline-flex items-center justify-center text-white text-xs font-bold rounded-lg px-1.5 py-0.5 ml-0.5 bg-gradient-to-r from-red-500 to-red-600 shadow-sm shadow-red-200/50">
              Pe
            </span>
          </span>
        </motion.button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = currentPage === link.page;
            return (
              <motion.button
                key={link.page}
                onClick={() => navigate(link.page)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {link.icon}
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("explorar")}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100/70 transition-colors"
            aria-label="Buscar universidades"
          >
            <Search size={18} />
          </motion.button>

          {/* Favorites */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("favoritos")}
            className="relative p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50/70 transition-colors"
            aria-label="Favoritos"
          >
            <Heart size={18} />
            <AnimatePresence>
              {favCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 bg-gradient-to-r from-red-500 to-red-400 text-white text-[10px] font-bold rounded-full shadow-sm"
                >
                  {favCount > 9 ? "9+" : favCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Historial de Chat IA */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setChatHistoryOpen(true)}
            className="relative p-2 rounded-xl text-gray-400 hover:text-violet hover:bg-violet-light/50 transition-colors"
            aria-label="Historial de Chat IA"
            title="Historial de Chat IA"
          >
            <Sparkles size={18} />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("notificaciones")}
            className="relative p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell size={18} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-bold rounded-full shadow-sm"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <ChatHistorySidebar open={chatHistoryOpen} onClose={() => setChatHistoryOpen(false)} />

          {/* User menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserMenuOpen((p) => !p)}
              className="hidden md:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gray-50/80 hover:bg-gray-100 border border-gray-200/60 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-200/50">
                {state.user.nombre?.[0]?.toUpperCase() ?? <User size={14} />}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">
                {state.user.nombre}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 py-2 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-gray-800">{state.user.nombre} {state.user.apellido}</p>
                      <p className="text-xs text-gray-400 truncate">{state.user.email}</p>
                    </div>
                    {userMenuItems.map((item, i) => (
                      <motion.button
                        key={item.page}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => { navigate(item.page); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50/60 hover:text-blue-600 transition-colors flex items-center gap-2"
                      >
                        {item.label}
                      </motion.button>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50/60 transition-colors"
                      >
                        Salir
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100/70 transition-colors"
            aria-label="Menú"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-gray-100/60 bg-white"
          >
            <div className="px-4 pt-3 pb-5 space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {navLinks.map((link, i) => {
                  const active = currentPage === link.page;
                  return (
                    <motion.button
                      key={link.page}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => { navigate(link.page); setMenuOpen(false); }}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-all ${
                        active
                          ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </motion.button>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {state.user.nombre?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{state.user.nombre}</p>
                    <p className="text-[11px] text-gray-400">{state.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="text-sm text-red-500 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50/60 transition-colors"
                >
                  Salir
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
