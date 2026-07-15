import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, BarChart2, Pin, Star, Share2, Eye, X,
  MapPin, Users, GraduationCap, DollarSign, Tag, Plus, Check,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { University } from "@/types";
import Toast from "@/components/ui/Toast";
import Tooltip from "@/components/ui/Tooltip";
import Badge from "@/components/ui/Badge";

interface UniCardProps {
  uni: University;
  view?: "grid" | "list";
}

export default function UniCard({ uni, view = "grid" }: UniCardProps) {
  const { state, dispatch, navigate } = useApp();

  const isFav = state.favorites.includes(uni.id);
  const isCompare = state.compareList.includes(uni.id);
  const isPinned = state.pinnedUnis.includes(uni.id);
  const isViewed = state.viewedUnis.includes(uni.id);
  const userRating = state.ratings[uni.id] ?? 0;
  const uniTags = state.tags[uni.id] ?? [];

  const [quickView, setQuickView] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const tagRef = useRef<HTMLInputElement>(null);

  const handleNavigate = () => {
    dispatch({ type: "MARK_VIEWED", id: uni.id });
    navigate("detalle", uni.id);
  };

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_FAV", id: uni.id });
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompare && state.compareList.length >= 5) {
      setToast("Máximo 5 universidades para comparar");
      return;
    }
    dispatch({ type: "TOGGLE_COMPARE", id: uni.id });
  };

  const togglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "TOGGLE_PIN", id: uni.id });
  };

  const setRating = (e: React.MouseEvent, r: number) => {
    e.stopPropagation();
    dispatch({ type: "SET_RATING", id: uni.id, rating: r });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}?uni=${uni.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setToast("Enlace copiado al portapapeles");
    } catch {
      setToast("No se pudo copiar el enlace");
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !uniTags.includes(tag) && uniTags.length < 5) {
      dispatch({ type: "ADD_TAG", id: uni.id, tag });
    }
    setTagInput("");
    setShowTagInput(false);
  };

  const removeTag = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    dispatch({ type: "REMOVE_TAG", id: uni.id, tag });
  };

  const imgUrl = `https://images.unsplash.com/${uni.img}?w=600&q=80&fit=crop`;

  if (view === "list") {
    return (
      <>
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleNavigate}
          className="group flex gap-4 bg-white border border-gray-100/60 rounded-2xl p-4 hover:shadow-lg hover:shadow-blue-100/30 hover:border-blue-100/40 transition-all duration-300 cursor-pointer"
        >
          <div className="relative w-24 h-20 shrink-0 rounded-xl overflow-hidden">
            <img src={imgUrl} alt={uni.name} className="w-full h-full object-cover" />
            {isViewed && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Eye size={14} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-1">{uni.name}</h3>
                <p className="text-xs text-gray-400">{uni.short} · {uni.city}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Badge color={uni.type === "Pública" ? "#059669" : "#7C3AED"}>
                  {uni.type}
                </Badge>
                {uni.sunedu && <Badge color="#0059FF">SUNEDU</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1"><MapPin size={11} />{uni.region}</span>
              <span className="flex items-center gap-1"><GraduationCap size={11} />{uni.careers} carreras</span>
              <span className="flex items-center gap-1">
                <DollarSign size={11} />
                {uni.type === "Pública" ? "Gratuita" : `S/${uni.pensionMin}–${uni.pensionMax}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip label={isFav ? "Quitar favorito" : "Agregar a favoritos"}>
                <button onClick={toggleFav} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  <Heart size={14} className={isFav ? "fill-red-500 text-red-500" : "text-gray-400"} />
                </button>
              </Tooltip>
              <Tooltip label={isCompare ? "Quitar del comparador" : "Agregar al comparador"}>
                <button onClick={toggleCompare} className={`p-1.5 rounded-lg transition-colors ${isCompare ? "bg-purple-50" : "hover:bg-purple-50"}`}>
                  <BarChart2 size={14} className={isCompare ? "text-purple-600" : "text-gray-400"} />
                </button>
              </Tooltip>
              <Tooltip label="Compartir">
                <button onClick={handleShare} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <Share2 size={14} className="text-gray-400" />
                </button>
              </Tooltip>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

  return (
    <>
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Quick view modal */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setQuickView(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="relative h-40">
              <img src={imgUrl} alt={uni.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setQuickView(false)}
                className="absolute top-3 right-3 p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h2 className="font-bold text-gray-800 text-base leading-tight">{uni.name}</h2>
                  <p className="text-sm text-gray-400">{uni.short} · {uni.city}</p>
                </div>
                <Badge color={uni.type === "Pública" ? "#059669" : "#7C3AED"}>{uni.type}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{uni.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Carreras", value: uni.careers, icon: <GraduationCap size={14} /> },
                  { label: "Fundada", value: uni.founded, icon: <Star size={14} /> },
                  { label: "Empleabilidad", value: `${uni.empleabilidad}%`, icon: <Users size={14} /> },
                  { label: "Modalidad", value: uni.modalidad, icon: <MapPin size={14} /> },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-blue-500">{stat.icon}</span>
                    <div>
                      <p className="text-[10px] text-gray-400">{stat.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setQuickView(false); handleNavigate(); }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Ver perfil completo
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0, 89, 255, 0.08)" }}
        className="group bg-white border border-gray-100/60 rounded-2xl overflow-hidden transition-colors duration-300"
      >
        {/* Image */}
        <div className="relative h-44 overflow-hidden cursor-pointer" onClick={handleNavigate}>
          <img
            src={imgUrl}
            alt={uni.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge color={uni.type === "Pública" ? "#059669" : "#7C3AED"}>
              {uni.type}
            </Badge>
            {uni.sunedu && (
              <Badge color="#0059FF">SUNEDU ✓</Badge>
            )}
          </div>
          {/* Viewed indicator */}
          {isViewed && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 text-white text-[10px] rounded-full px-2 py-0.5">
              <Eye size={10} /> Visto
            </div>
          )}
          {/* Pinned indicator */}
          {isPinned && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-yellow-500 text-white text-[10px] rounded-full px-2 py-0.5 font-semibold">
              <Pin size={10} /> Fijado
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Header */}
          <div className="mb-2 cursor-pointer" onClick={handleNavigate}>
            <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 mb-0.5">
              {uni.name}
            </h3>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={11} /> {uni.city}, {uni.region}
            </p>
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-0.5 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={(e) => setRating(e, star)}
              >
                <Star
                  size={14}
                  className={star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                />
              </motion.button>
            ))}
            <span className="text-xs text-gray-400 ml-1">{uni.rating.toFixed(1)}</span>
          </div>

          {/* Empleabilidad */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Empleabilidad</span>
              <span className="text-xs font-semibold text-gray-700">{uni.empleabilidad}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
                style={{ width: `${uni.empleabilidad}%` }}
              />
            </div>
          </div>

          {/* Key stats */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <GraduationCap size={11} /> {uni.careers} carreras
            </span>
            <span className="flex items-center gap-1">
              <DollarSign size={11} />
              {uni.type === "Pública" ? "Gratuita" : `S/${uni.pensionMin}–${uni.pensionMax}`}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3 min-h-[20px]">
            {uniTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-medium rounded-full"
              >
                {tag}
                <button onClick={(e) => removeTag(e, tag)} className="hover:text-blue-900">
                  <X size={10} />
                </button>
              </span>
            ))}
            {uniTags.length < 5 && (
              showTagInput ? (
                <input
                  ref={tagRef}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addTag(); if (e.key === "Escape") setShowTagInput(false); }}
                  onBlur={addTag}
                  autoFocus
                  placeholder="Etiqueta..."
                  className="px-2 py-0.5 text-[11px] border border-blue-300 rounded-full outline-none w-20 focus:border-blue-500"
                />
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setShowTagInput(true); }}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 border border-dashed border-gray-300 text-gray-400 text-[11px] rounded-full hover:border-blue-400 hover:text-blue-500 transition-colors"
                >
                  <Tag size={9} /> Añadir
                </button>
              )
            )}
          </div>

          {/* Action strip */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100/60">
            <div className="flex items-center gap-1">
              <Tooltip label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleFav}
                  className={`p-2 rounded-lg transition-all ${isFav ? "bg-red-50 text-red-500" : "hover:bg-red-50 text-gray-400 hover:text-red-500"}`}
                >
                  <Heart size={15} className={isFav ? "fill-red-500" : ""} />
                </motion.button>
              </Tooltip>

              <Tooltip label={isCompare ? "Quitar del comparador" : "Agregar al comparador"}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={toggleCompare}
                  className={`p-2 rounded-lg transition-all ${isCompare ? "bg-purple-50 text-purple-600" : "hover:bg-purple-50 text-gray-400 hover:text-purple-600"}`}
                >
                  <BarChart2 size={15} />
                </motion.button>
              </Tooltip>

              <Tooltip label={isPinned ? "Desfijar" : "Fijar arriba"}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={togglePin}
                  className={`p-2 rounded-lg transition-all ${isPinned ? "bg-yellow-50 text-yellow-500" : "hover:bg-yellow-50 text-gray-400 hover:text-yellow-500"}`}
                >
                  <Pin size={15} />
                </motion.button>
              </Tooltip>

              <Tooltip label="Compartir enlace">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleShare}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <Share2 size={15} />
                </motion.button>
              </Tooltip>

              <Tooltip label="Vista rápida">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => { e.stopPropagation(); setQuickView(true); }}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                >
                  <Eye size={15} />
                </motion.button>
              </Tooltip>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleNavigate}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
            >
              Ver más <Plus size={12} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
