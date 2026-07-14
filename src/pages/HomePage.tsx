import { useState } from "react";
import { useApp } from "@/context/AppContext";
import UniCard from "@/components/UniCard";
import { universities } from "@/data/universities";
import type { Page } from "@/types";
import { Search, ArrowRight, GraduationCap, Repeat2, Users, CheckCircle } from "lucide-react";

export default function HomePage() {
  const { state, navigate, dispatch } = useApp();
  const { savedSearches, pinnedUnis } = state;
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (q: string) => {
    const query = q.trim();
    if (!query) return;
    dispatch({ type: "ADD_SAVED_SEARCH", query });
    navigate("explorar");
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(searchQuery);
  };

  const featuredUnis = pinnedUnis.length > 0
    ? universities.filter((u) => pinnedUnis.includes(u.id)).slice(0, 3)
    : universities.slice(0, 3);

  const segments: { label: string; sublabel: string; page: Page; icon: React.ReactNode; color: string }[] = [
    { label: "Soy Egresado", sublabel: "Elige tu primera carrera", page: "test", icon: <GraduationCap size={18} />, color: "bg-blue-600 text-white" },
    { label: "Quiero Trasladarme", sublabel: "Cambia de universidad", page: "simulador", icon: <Repeat2 size={18} />, color: "bg-[#7C3AED] text-white" },
    { label: "Soy Padre", sublabel: "Orienta a tu familia", page: "explorar", icon: <Users size={18} />, color: "bg-[#D91023] text-white" },
  ];

  const situationCards: {
    tipo: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    cta: string;
    page: Page;
    border: string;
    iconBg: string;
  }[] = [
    {
      tipo: "egresado",
      icon: <GraduationCap size={28} className="text-blue-600" />,
      title: "Estás terminando el colegio",
      description: "Descubre qué carrera va contigo según tus habilidades e intereses. Accede a datos reales de empleabilidad y costos actualizados 2026.",
      cta: "Hacer test vocacional",
      page: "test",
      border: "border-blue-200",
      iconBg: "bg-blue-50",
    },
    {
      tipo: "traslado",
      icon: <Repeat2 size={28} className="text-purple-600" />,
      title: "Quieres cambiar de universidad",
      description: "Compara programas, verifica convalidaciones y encuentra la mejor opción para continuar tus estudios sin perder créditos.",
      cta: "Usar el simulador",
      page: "simulador",
      border: "border-purple-200",
      iconBg: "bg-purple-50",
    },
    {
      tipo: "padre",
      icon: <Users size={28} className="text-red-600" />,
      title: "Apoyas a un estudiante",
      description: "Compara universidades por costo, modalidad y reputación. Toma decisiones informadas junto a tu hijo/a con datos verificados por SUNEDU.",
      cta: "Explorar universidades",
      page: "explorar",
      border: "border-red-200",
      iconBg: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#EEF3FF] to-white px-4 pt-10 pb-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Government badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 text-xs text-blue-700 font-medium shadow-sm mb-6">
            <span>🇵🇪</span> Verificada por SUNEDU · 2026
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
            Encuentra tu futuro{" "}
            <span className="text-[#0059FF]">con datos reales</span>
          </h1>
          <p className="text-gray-500 text-base mb-8 max-w-md mx-auto leading-relaxed">
            Compara universidades peruanas, mide tu empleabilidad esperada y toma la mejor decisión para tu carrera.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Busca universidad, carrera o región..."
              className="w-full pl-11 pr-14 py-3.5 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <button
              onClick={() => handleSearch(searchQuery)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0059FF] hover:bg-blue-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold transition-colors"
            >
              Buscar
            </button>
          </div>

          {/* Saved searches chips */}
          {savedSearches.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {savedSearches.slice(0, 5).map((s) => (
                <button
                  key={s}
                  onClick={() => { setSearchQuery(s); handleSearch(s); }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors shadow-sm"
                >
                  <Search size={10} /> {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Segment pills */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 justify-center flex-wrap">
            {segments.map((seg) => (
              <button
                key={seg.label}
                onClick={() => navigate(seg.page)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm shadow hover:opacity-90 transition-all ${seg.color}`}
              >
                {seg.icon}
                <span>{seg.label}</span>
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Situational cards */}
      <section className="px-4 py-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Entendemos tu situación</p>
          <h2 className="text-xl font-extrabold text-gray-800 text-center mb-6">
            ¿Cuál describe mejor tu momento?
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {situationCards.map((card) => (
              <div
                key={card.tipo}
                className={`bg-white rounded-2xl p-5 border ${card.border} shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex gap-4 items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-base mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">{card.description}</p>
                    <button
                      onClick={() => navigate(card.page)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {card.cta} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured institutions */}
      <section className="px-4 py-8 bg-[#F4F6F9]">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Instituciones destacadas</p>
          <h2 className="text-xl font-extrabold text-gray-800 text-center mb-2">
            Universidades verificadas SUNEDU
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6 flex items-center justify-center gap-1">
            <CheckCircle size={14} className="text-green-500" /> Datos actualizados al 2026
          </p>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {featuredUnis.map((uni) => (
              <UniCard key={uni.id} uni={uni} view="list" />
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate("explorar")}
              className="inline-flex items-center gap-2 bg-[#0059FF] hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl transition-colors shadow-md"
            >
              Ver todas las universidades <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
