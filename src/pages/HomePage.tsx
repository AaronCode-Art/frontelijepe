import { useState } from "react";
import { motion } from "motion/react";
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
    { label: "Soy Egresado", sublabel: "Elige tu primera carrera", page: "test", icon: <GraduationCap size={18} />, color: "from-blue-600 to-blue-500 shadow-blue-200/50" },
    { label: "Quiero Trasladarme", sublabel: "Cambia de universidad", page: "simulador", icon: <Repeat2 size={18} />, color: "from-violet to-purple-500 shadow-violet/20" },
    { label: "Soy Padre", sublabel: "Orienta a tu familia", page: "explorar", icon: <Users size={18} />, color: "from-red-600 to-red-500 shadow-red-200/50" },
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
      title: "Estas terminando el colegio",
      description: "Descubre que carrera va contigo segun tus habilidades e intereses. Accede a datos reales de empleabilidad y costos actualizados 2026.",
      cta: "Hacer test vocacional",
      page: "test",
      border: "border-blue-100/60",
      iconBg: "bg-blue-50",
    },
    {
      tipo: "traslado",
      icon: <Repeat2 size={28} className="text-violet" />,
      title: "Quieres cambiar de universidad",
      description: "Compara programas, verifica convalidaciones y encuentra la mejor opcion para continuar tus estudios sin perder creditos.",
      cta: "Usar el simulador",
      page: "simulador",
      border: "border-violet/20",
      iconBg: "bg-violet-light",
    },
    {
      tipo: "padre",
      icon: <Users size={28} className="text-red-600" />,
      title: "Apoyas a un estudiante",
      description: "Compara universidades por costo, modalidad y reputacion. Toma decisiones informadas junto a tu hijo/a con datos verificados por SUNEDU.",
      cta: "Explorar universidades",
      page: "explorar",
      border: "border-red-100/60",
      iconBg: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EEF3FF] to-white px-4 pt-10 pb-12">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-violet/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-100/60 rounded-full px-4 py-1.5 text-xs text-blue-700 font-medium shadow-sm mb-6">
              <span>Verificada por SUNEDU &middot; 2026</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-3"
          >
            Encuentra tu futuro{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet bg-clip-text text-transparent">con datos reales</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-base mb-8 max-w-md mx-auto leading-relaxed"
          >
            Compara universidades peruanas, mide tu empleabilidad esperada y toma la mejor decision para tu carrera.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-md mx-auto mb-4"
          >
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKey}
              placeholder="Busca universidad, carrera o region..."
              className="w-full pl-11 pr-14 py-3.5 rounded-2xl border border-gray-200/60 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300/50 text-sm transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSearch(searchQuery)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm shadow-blue-200/30"
            >
              Buscar
            </motion.button>
          </motion.div>

          {savedSearches.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {savedSearches.slice(0, 5).map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => { setSearchQuery(s); handleSearch(s); }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-white/80 backdrop-blur-sm border border-gray-200/60 text-gray-600 text-xs rounded-full hover:border-blue-300/50 hover:text-blue-600 transition-all shadow-sm"
                >
                  <Search size={10} /> {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Segment pills */}
      <section className="px-4 py-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 justify-center flex-wrap">
            {segments.map((seg, i) => (
              <motion.button
                key={seg.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(seg.page)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white bg-gradient-to-r ${seg.color} shadow-lg transition-all`}
              >
                {seg.icon}
                <span>{seg.label}</span>
                <ArrowRight size={14} />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Situational cards */}
      <section className="px-4 py-8 bg-gray-50/50">
        <div className="max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2"
          >
            Entendemos tu situacion
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl font-extrabold text-gray-800 text-center mb-6"
          >
            Cual describe mejor tu momento?
          </motion.h2>
          <div className="grid grid-cols-1 gap-4">
            {situationCards.map((card, i) => (
              <motion.div
                key={card.tipo}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className={`bg-white rounded-2xl p-5 border ${card.border} shadow-sm hover:shadow-lg hover:shadow-blue-100/20 transition-all duration-300`}
              >
                <div className="flex gap-4 items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-base mb-1">{card.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">{card.description}</p>
                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={() => navigate(card.page)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {card.cta} <ArrowRight size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured institutions */}
      <section className="px-4 py-8 bg-[#F4F6F9]/50">
        <div className="max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2"
          >
            Instituciones destacadas
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl font-extrabold text-gray-800 text-center mb-2"
          >
            Universidades verificadas SUNEDU
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-sm text-gray-500 text-center mb-6 flex items-center justify-center gap-1"
          >
            <CheckCircle size={14} className="text-emerald" /> Datos actualizados al 2026
          </motion.p>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {featuredUnis.map((uni) => (
              <UniCard key={uni.id} uni={uni} view="list" />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("explorar")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-blue-200/40"
            >
              Ver todas las universidades <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
