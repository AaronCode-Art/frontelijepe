import { useApp } from "@/context/AppContext";
import UniCard from "@/components/UniCard";
import { universities } from "@/data/universities";
import type { Page } from "@/types";
import {
  Search, FlaskConical, Heart, BarChart2, Eye, ClipboardCheck,
  Compass, GraduationCap, Calculator, Users, Bell, DollarSign,
  ChevronRight, TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const { state, navigate, dispatch } = useApp();
  const { user, favorites, compareList, viewedUnis, notifications, financieroEnabled, currentTestAnswers, pinnedUnis } = state;

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
    {
      label: "Favoritos",
      value: favorites.length,
      icon: <Heart size={20} className="text-red-500" />,
      color: "bg-red-50",
      page: "favoritos" as Page,
    },
    {
      label: "Comparando",
      value: compareList.length,
      icon: <BarChart2 size={20} className="text-purple-600" />,
      color: "bg-purple-50",
      page: "comparador" as Page,
    },
    {
      label: "Visitadas",
      value: viewedUnis.length,
      icon: <Eye size={20} className="text-blue-500" />,
      color: "bg-blue-50",
      page: "explorar" as Page,
    },
    {
      label: `Test ${testProgress}/8`,
      value: `${Math.round((testProgress / 8) * 100)}%`,
      icon: <ClipboardCheck size={20} className="text-green-600" />,
      color: "bg-green-50",
      page: "test" as Page,
    },
  ];

  const quickActions = [
    { icon: <Compass size={24} className="text-blue-600" />, label: "Explorar", subtitle: "Busca por filtros", page: "explorar" as Page, bg: "bg-blue-50" },
    { icon: <FlaskConical size={24} className="text-purple-600" />, label: "Test Vocacional", subtitle: "Descubre tu carrera", page: "test" as Page, bg: "bg-purple-50" },
    { icon: <Calculator size={24} className="text-green-600" />, label: "Simulador", subtitle: "Estima tu admisión", page: "simulador" as Page, bg: "bg-green-50" },
    { icon: <Users size={24} className="text-orange-500" />, label: "Comunidad", subtitle: "Opiniones reales", page: "comunidad" as Page, bg: "bg-orange-50" },
    { icon: <Heart size={24} className="text-red-500" />, label: "Mis Favoritos", subtitle: `${favorites.length} guardadas`, page: "favoritos" as Page, bg: "bg-red-50" },
    { icon: <Bell size={24} className="text-yellow-500" />, label: "Notificaciones", subtitle: `${unreadCount} sin leer`, page: "notificaciones" as Page, bg: "bg-yellow-50" },
  ];

  const notifTypeColor: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0059FF] to-blue-700 text-white px-4 pt-8 pb-10">
        <div className="max-w-2xl mx-auto">
          <p className="text-blue-200 text-sm mb-1 uppercase tracking-wide font-medium">Panel principal</p>
          <h1 className="text-2xl font-bold mb-1">
            Bienvenido/a de vuelta, <span className="text-yellow-300">{user.nombre}</span>!
          </h1>
          <p className="text-blue-100 text-sm mb-6">{contextualMessage[user.tipo]}</p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate("explorar")}
              className="flex items-center gap-2 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow"
            >
              <Search size={16} /> Buscar universidades
            </button>
            <button
              onClick={() => navigate("test")}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <FlaskConical size={16} /> Continuar test
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {statCards.map((card) => (
            <button
              key={card.label}
              onClick={() => navigate(card.page)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-xl font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </button>
          ))}
        </div>

        {/* Quick actions grid */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Acciones rápidas</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.page)}
                className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${action.bg}`}>
                  {action.icon}
                </div>
                <p className="text-xs font-bold text-gray-800 leading-tight">{action.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{action.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Financial shortcut */}
        {financieroEnabled && (
          <button
            onClick={() => navigate("financiero")}
            className="w-full flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-6 hover:shadow-md transition-all text-left"
          >
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">Dashboard Financiero</p>
              <p className="text-xs text-gray-500">Simula costos, becas y financiamiento</p>
            </div>
            <TrendingUp size={18} className="text-green-500" />
          </button>
        )}

        {/* Saved universities */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">Mis universidades guardadas</h2>
            <button
              onClick={() => navigate("favoritos")}
              className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline"
            >
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          {favUnis.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {favUnis.map((uni) => (
                <UniCard key={uni.id} uni={uni} view="list" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <Heart size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Aún no has guardado universidades.</p>
              <button
                onClick={() => navigate("explorar")}
                className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
              >
                Explorar ahora
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800">Últimas novedades</h2>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">
                {unreadCount} nuevas
              </span>
            )}
          </div>
          {unreadNotifs.length > 0 ? (
            <div className="space-y-2">
              {unreadNotifs.map((notif) => (
                <div
                  key={notif.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-3 items-start cursor-pointer hover:shadow-md transition-all"
                  onClick={() => {
                    dispatch({ type: "MARK_NOTIF_READ", id: notif.id });
                    navigate("notificaciones");
                  }}
                >
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 mt-0.5 ${notifTypeColor[notif.type]}`}>
                    {notif.type === "success" ? "✓" : notif.type === "warning" ? "!" : "i"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{notif.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
              <Bell size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">Todo al día, sin novedades pendientes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
