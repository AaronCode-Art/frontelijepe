import { useState } from "react";
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => navigate("dashboard")}
          className="flex items-center gap-1.5 shrink-0 group"
        >
          <span className="text-2xl font-black tracking-tight">
            <span style={{ color: "#0059FF" }}>Elige</span>
            <span
              className="inline-flex items-center justify-center text-white text-xs font-bold rounded px-1 py-0.5 ml-0.5"
              style={{ backgroundColor: "#D91023" }}
            >
              Pe
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <button
            onClick={() => navigate("explorar")}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Buscar universidades"
          >
            <Search size={18} />
          </button>

          {/* Favorites */}
          <button
            onClick={() => navigate("favoritos")}
            className="relative p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Favoritos"
          >
            <Heart size={18} />
            {favCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {favCount > 9 ? "9+" : favCount}
              </span>
            )}
          </button>

          {/* Historial de Chat IA (slide-over) */}
          <button
            onClick={() => setChatHistoryOpen(true)}
            className="relative p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            aria-label="Historial de Chat IA"
            title="Historial de Chat IA"
          >
            <Sparkles size={18} />
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate("notificaciones")}
            className="relative p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <ChatHistorySidebar open={chatHistoryOpen} onClose={() => setChatHistoryOpen(false)} />

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((p) => !p)}
              className="hidden md:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                {state.user.nombre?.[0]?.toUpperCase() ?? <User size={14} />}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">
                {state.user.nombre}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-800">{state.user.nombre} {state.user.apellido}</p>
                    <p className="text-xs text-gray-400">{state.user.email}</p>
                  </div>
                  {userMenuItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => { navigate(item.page); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Salir
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Menú"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {navLinks.map((link) => {
              const active = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => { navigate(link.page); setMenuOpen(false); }}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              );
            })}
          </div>
          <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                {state.user.nombre?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{state.user.nombre}</p>
                <p className="text-xs text-gray-400">{state.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="text-sm text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
