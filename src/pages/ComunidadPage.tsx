import { useState, useEffect } from "react";
import {
  Hash, Flag, MessageCircle, Heart, Share2, Plus, X, Search,
  Users, ChevronDown, Send, AlertTriangle, Bell, Lock, Sparkles
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { CommunityPost, CommunityChannel } from "@/types";
import { communityChannels as baseChannels, initialPosts } from "@/data/communityData";
import * as api from "@/services/api";
import GuideCallout from "@/components/GuideCallout";

const FORO_ICONS = ["💬", "📚", "🎯", "🌎", "💡", "🔬", "🎨", "⚡"];
const FORO_COLORS = ["#0059FF", "#7C3AED", "#16A34A", "#D97706", "#DC2626", "#0891B2"];

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = ["#0059FF", "#7C3AED", "#16A34A", "#D97706", "#D91023", "#0891B2"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % colors.length;
  return colors[h];
}

const TIPO_COLORS: Record<string, string> = {
  egresado: "#0059FF",
  traslado: "#7C3AED",
  padre: "#16A34A",
};

const TIPO_LABELS: Record<string, string> = {
  egresado: "Egresado",
  traslado: "Traslado",
  padre: "Padre",
};

function TipoBadge({ tipo }: { tipo: string }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
      style={{ background: TIPO_COLORS[tipo] ?? "#6B7280" }}
    >
      {TIPO_LABELS[tipo] ?? tipo}
    </span>
  );
}

interface MockComment {
  id?: string;
  author: string;
  tipo: string;
  content: string;
  time: string;
}

const MOCK_COMMENTS: MockComment[] = [
  { author: "Andrea Soto", tipo: "traslado", content: "Gracias por compartir esta experiencia, me ayudó mucho en mi decisión.", time: "hace 1 hora" },
  { author: "Carlos Lúcar", tipo: "egresado", content: "Totalmente de acuerdo con lo que mencionas, viví algo muy similar.", time: "hace 3 horas" },
];

export default function ComunidadPage() {
  const { state, dispatch, navigate } = useApp();
  const user = state.user;

  const [activeChannel, setActiveChannel] = useState("general");
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "", isReport: false, channel: "general" });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [quickMessage, setQuickMessage] = useState("");
  const [showNewForo, setShowNewForo] = useState(false);
  const [newForo, setNewForo] = useState({ label: "", description: "" });
  const [backendForoMap, setBackendForoMap] = useState<Record<string, string>>({}); // nombre normalizado -> UUID real
  const [postBackendId, setPostBackendId] = useState<Record<string, string>>({}); // id local del post -> UUID real
  // Antes esto arrancaba vacío y en el render se mostraba MOCK_COMMENTS como
  // "relleno" solo mientras no hubiera comentarios reales; en cuanto el
  // usuario comentaba, se cambiaba de fuente de datos y los 3 comentarios
  // de ejemplo desaparecían de golpe (parecía que "se borraban"). Ahora se
  // siembran una sola vez al montar, como cualquier otro comentario real, y
  // los nuevos siempre se agregan al mismo arreglo, nunca lo reemplazan.
  const [commentsByPost, setCommentsByPost] = useState<Record<string, { id: string; author: string; tipo: string; content: string; time: string }[]>>(() => {
    const seed: Record<string, { id: string; author: string; tipo: string; content: string; time: string }[]> = {};
    initialPosts.forEach((p) => {
      seed[p.id] = MOCK_COMMENTS.map((c, i) => ({ ...c, id: `${p.id}-seed-${i}` }));
    });
    return seed;
  });
  const [newComment, setNewComment] = useState("");
  const [foroSyncError, setForoSyncError] = useState(false);

  const esCuentaReal = !!user?.id && !user.isDemo;

  function normalizar(nombre: string) {
    return nombre.trim().toLowerCase();
  }

  // Al entrar a Comunidad, traemos los foros reales de la BD y armamos el
  // mapa nombre -> UUID, para poder publicar/comentar contra el backend
  // incluso en los canales predefinidos (General, Admisión, etc.).
  useEffect(() => {
    api.listarForos()
      .then((backendForos) => {
        const map: Record<string, string> = {};
        const nuevosCustom: CommunityChannel[] = [];
        for (const f of backendForos) {
          map[normalizar(f.nombre)] = f.id;
          const yaExiste =
            baseChannels.some((c) => normalizar(c.label) === normalizar(f.nombre)) ||
            state.customChannels.some((c) => c.backendId === f.id);
          if (!f.es_predefinido && !yaExiste) {
            nuevosCustom.push({
              id: f.id, backendId: f.id, label: f.nombre, description: f.descripcion,
              icon: f.icono, color: f.color, isCustom: true,
            });
          }
        }
        setBackendForoMap(map);
        nuevosCustom.forEach((ch) => dispatch({ type: "CREATE_FORO", channel: ch }));
      })
      .catch(() => setForoSyncError(true));
  }, []);

  const puedeCrearForos = !!user?.iaPremium;
  const communityChannels: CommunityChannel[] = [...baseChannels, ...state.customChannels];
  const currentChannel = communityChannels.find((c) => c.id === activeChannel);

  async function handleCreateForo() {
    if (!newForo.label.trim()) return;
    const icon = FORO_ICONS[state.customChannels.length % FORO_ICONS.length];
    const color = FORO_COLORS[state.customChannels.length % FORO_COLORS.length];
    const localId = `foro-${Date.now()}`;
    let backendId: string | undefined;

    if (esCuentaReal) {
      try {
        const creado = await api.crearForo({
          usuario_id: user!.id!,
          nombre: newForo.label.trim(),
          descripcion: newForo.description.trim(),
          icono: icon,
          color,
        });
        backendId = creado.id;
        setBackendForoMap((prev) => ({ ...prev, [normalizar(newForo.label)]: creado.id }));
      } catch {
        setForoSyncError(true); // seguimos igual: el foro queda local, aunque no persista en la BD
      }
    }

    const channel: CommunityChannel = {
      id: backendId ?? localId,
      backendId,
      label: newForo.label.trim(),
      description: newForo.description.trim(),
      icon, color,
      createdBy: user ? `${user.nombre} ${user.apellido}` : "Usuario",
      isCustom: true,
    };
    dispatch({ type: "CREATE_FORO", channel });
    setNewForo({ label: "", description: "" });
    setShowNewForo(false);
    setActiveChannel(channel.id);
  }
  async function submitComment(postId: string) {
    if (!newComment.trim()) return;
    const local = {
      id: `c-${Date.now()}`,
      author: user ? `${user.nombre} ${user.apellido}` : "Usuario",
      tipo: user?.tipo ?? "egresado",
      content: newComment.trim(),
      time: "ahora",
    };
    setCommentsByPost((prev) => ({ ...prev, [postId]: [...(prev[postId] ?? []), local] }));
    setNewComment("");

    const backendPostId = postBackendId[postId];
    if (esCuentaReal && backendPostId) {
      try {
        await api.comentarPost({ post_id: backendPostId, autor_id: user!.id!, contenido: local.content });
      } catch {
        setForoSyncError(true);
      }
    }
  }

  const channelPosts = posts.filter(
    (p) =>
      p.channel === activeChannel &&
      (searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  function handleLike(postId: string) {
    dispatch({ type: "TOGGLE_COMMUNITY_LIKE", postId });
  }

  async function handleSubmitPost() {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const localId = `post-${Date.now()}`;
    const channelId = newPost.isReport ? "reportes" : newPost.channel;
    const post: CommunityPost = {
      id: localId,
      channel: channelId,
      author: user ? `${user.nombre} ${user.apellido}` : "Usuario",
      avatar: user ? `${user.nombre[0]}${user.apellido[0]}` : "U",
      title: newPost.title,
      content: newPost.content,
      time: "ahora",
      likes: 0,
      comments: 0,
      tags: newPost.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isReport: newPost.isReport,
    };
    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", tags: "", isReport: false, channel: activeChannel });
    setShowNewPost(false);
    if (newPost.isReport) setActiveChannel("reportes");

    const targetChannel = communityChannels.find((c) => c.id === channelId);
    const foroId = backendForoMap[normalizar(targetChannel?.label ?? "")];
    if (esCuentaReal && foroId) {
      try {
        const creado = await api.crearPost({
          foro_id: foroId, autor_id: user!.id!,
          titulo: post.title, contenido: post.content, tags: post.tags,
        });
        setPostBackendId((prev) => ({ ...prev, [localId]: creado.id }));
      } catch {
        setForoSyncError(true);
      }
    }
  }

  async function handleQuickMessage() {
    if (!quickMessage.trim()) return;
    const localId = `post-${Date.now()}`;
    const post: CommunityPost = {
      id: localId,
      channel: activeChannel,
      author: user ? `${user.nombre} ${user.apellido}` : "Usuario",
      avatar: user ? `${user.nombre[0]}${user.apellido[0]}` : "U",
      title: quickMessage,
      content: quickMessage,
      time: "ahora",
      likes: 0,
      comments: 0,
      tags: [],
    };
    setPosts([post, ...posts]);
    setQuickMessage("");

    const foroId = backendForoMap[normalizar(currentChannel?.label ?? "")];
    if (esCuentaReal && foroId) {
      try {
        const creado = await api.crearPost({
          foro_id: foroId, autor_id: user!.id!,
          titulo: post.title, contenido: post.content,
        });
        setPostBackendId((prev) => ({ ...prev, [localId]: creado.id }));
      } catch {
        setForoSyncError(true);
      }
    }
  }

  const postsByChannel = communityChannels.reduce<Record<string, number>>((acc, ch) => {
    acc[ch.id] = posts.filter((p) => p.channel === ch.id).length;
    return acc;
  }, {});

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F4F6F9] overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col bg-[#1e1f22] text-white shrink-0">
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0059FF] flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">ElijePe</div>
              <div className="text-xs text-white/50">Comunidad</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 mb-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Canales</span>
            <button
              onClick={() => (puedeCrearForos ? setShowNewForo(true) : navigate("ia"))}
              title={puedeCrearForos ? "Crear foro" : "Desbloquea con el acceso premium (S/. 10)"}
              className="w-5 h-5 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              {puedeCrearForos ? <Plus size={14} /> : <Lock size={11} />}
            </button>
          </div>
          {communityChannels.map((ch) => {
            const isActive = activeChannel === ch.id;
            const isReport = ch.id === "reportes";
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md mx-1 text-left transition-colors group ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                {isReport ? (
                  <Flag size={16} className="text-[#D91023] shrink-0" />
                ) : ch.isCustom ? (
                  <span className="shrink-0 text-sm leading-none">{ch.icon}</span>
                ) : (
                  <Hash size={16} className="shrink-0" style={{ color: isActive ? ch.color : undefined }} />
                )}
                <span className="text-sm flex-1 truncate">{ch.label}</span>
                {postsByChannel[ch.id] > 0 && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-white/40 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {user && (
          <div className="p-3 border-t border-white/10 bg-black/20">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ background: getAvatarColor(user.nombre) }}
              >
                {user.nombre[0]}{user.apellido[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.nombre}</div>
                <TipoBadge tipo={user.tipo} />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Channel Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {currentChannel?.id === "reportes" ? (
              <Flag size={18} className="text-[#D91023] shrink-0" />
            ) : (
              <Hash size={18} className="text-gray-400 shrink-0" />
            )}
            <div className="min-w-0">
              <span className="font-bold text-gray-900 text-sm">{currentChannel?.label}</span>
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline">
                {channelPosts.length} publicaciones
              </span>
            </div>
          </div>

          {/* Mobile channel selector */}
          <div className="md:hidden">
            <select
              className="text-sm border border-gray-200 rounded-lg px-2 py-1"
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value)}
            >
              {communityChannels.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.label}</option>
              ))}
            </select>
          </div>

          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20 w-48"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0059FF] text-white text-sm rounded-lg hover:bg-blue-700 transition-colors shrink-0"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Nueva publicación</span>
          </button>
        </div>

        {/* Reportes banner */}
        {activeChannel === "reportes" && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2 shrink-0">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              <strong>Tus reportes ayudan a mejorar la calidad de datos para toda la comunidad.</strong>{" "}
              El equipo ElijePe revisa cada reporte y actualiza la plataforma en menos de 48 horas.
            </p>
          </div>
        )}

        {/* Posts */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {channelPosts.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No hay publicaciones aquí aún.</p>
              <p className="text-sm mt-1">¡Sé el primero en publicar!</p>
            </div>
          )}

          {channelPosts.map((post) => {
            const isExpanded = expandedPost === post.id;
            const isLiked = state.communityLikes.includes(post.id);
            const likeCount = post.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: getAvatarColor(post.author) }}
                    >
                      {getInitials(post.author)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-gray-900">{post.author}</span>
                        <TipoBadge tipo={
                          post.author.includes("(Padre)") || post.author.includes("(Madre)")
                            ? "padre"
                            : post.channel === "traslados"
                            ? "traslado"
                            : "egresado"
                        } />
                        {post.isReport && (
                          <span className="flex items-center gap-1 text-xs bg-red-50 text-[#D91023] px-2 py-0.5 rounded-full font-medium border border-red-100">
                            <AlertTriangle size={10} />
                            Reporte de datos
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{post.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug">{post.title}</h3>

                  {/* Content preview / full */}
                  <p
                    className={`text-sm text-gray-600 leading-relaxed ${
                      isExpanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {post.content}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-[#F4F6F9] text-gray-600 px-2 py-0.5 rounded-full border border-gray-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        isLiked
                          ? "bg-red-50 text-[#D91023]"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
                      {likeCount}
                    </button>
                    <button
                      onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <MessageCircle size={13} />
                      {(commentsByPost[post.id] ?? []).length}
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors ml-auto">
                      <Share2 size={13} />
                      Compartir
                    </button>
                    <button
                      onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                      className="text-xs text-[#0059FF] font-medium px-2.5 py-1.5 hover:underline"
                    >
                      {isExpanded ? "Menos" : "Leer más"}
                    </button>
                  </div>
                </div>

                {/* Expanded: comments */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comentarios</p>
                    {(commentsByPost[post.id] ?? []).map((c, i) => (
                      <div key={c.id ?? i} className="flex gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: getAvatarColor(c.author) }}
                        >
                          {getInitials(c.author)}
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2 text-sm flex-1 border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-xs">{c.author}</span>
                            <TipoBadge tipo={c.tipo} />
                            <span className="text-xs text-gray-400 ml-auto">{c.time}</span>
                          </div>
                          <p className="text-gray-700 text-xs">{c.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <input
                        className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20"
                        placeholder="Escribe un comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        disabled={!newComment.trim()}
                        className="px-3 py-2 bg-[#0059FF] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Discord-style bottom input */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 shrink-0">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#F4F6F9] rounded-xl px-3 py-2.5 border border-gray-200 focus-within:ring-2 focus-within:ring-[#0059FF]/20">
              <Hash size={15} className="text-gray-400 shrink-0" />
              <input
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder={`Escribe un mensaje en #${currentChannel?.label.toLowerCase()}...`}
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleQuickMessage(); }}
              />
            </div>
            <button
              onClick={handleQuickMessage}
              disabled={!quickMessage.trim()}
              className="px-3 py-2.5 bg-[#0059FF] text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* NEW POST MODAL */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowNewPost(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Nueva publicación</h2>
              <button onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-gray-600 rounded-lg p-1">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Canal</label>
                <div className="relative">
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm appearance-none bg-[#F4F6F9] focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20"
                    value={newPost.isReport ? "reportes" : newPost.channel}
                    onChange={(e) => setNewPost({ ...newPost, channel: e.target.value, isReport: e.target.value === "reportes" })}
                  >
                    {communityChannels.map((ch) => (
                      <option key={ch.id} value={ch.id}>{ch.icon} {ch.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Título</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20"
                  placeholder="¿Cuál es tu publicación?"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Contenido</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20 resize-none"
                  rows={5}
                  placeholder="Comparte tu experiencia, pregunta o información..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Etiquetas <span className="text-gray-400 normal-case font-normal">(separadas por coma)</span></label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059FF]/20"
                  placeholder="traslado, PUCP, Derecho"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-[#D91023]"
                  checked={newPost.isReport}
                  onChange={(e) => setNewPost({ ...newPost, isReport: e.target.checked, channel: e.target.checked ? "reportes" : newPost.channel })}
                />
                <div>
                  <span className="text-sm font-medium text-[#D91023]">Es un reporte de datos</span>
                  <p className="text-xs text-gray-500">Se publicará en el canal de Reportes para revisión del equipo.</p>
                </div>
              </label>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setShowNewPost(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button
                onClick={handleSubmitPost}
                disabled={!newPost.title.trim() || !newPost.content.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#0059FF] text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREAR FORO (incluido en el acceso premium S/. 10) */}
      {showNewForo && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowNewForo(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowNewForo(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-crear-foro"
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#7C3AED]" />
                <h3 id="titulo-crear-foro" className="font-bold text-gray-900">Crear nuevo foro</h3>
              </div>
              <button onClick={() => setShowNewForo(false)} aria-label="Cerrar" className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <GuideCallout storageKey="comunidad-crear-foro" title="Un buen foro en 2 pasos" color="purple">
                Ponle un nombre claro y específico (ej. "Postulantes Medicina 2026" en vez de solo
                "Ayuda"), así otros lo encuentran fácil. La descripción es opcional.
              </GuideCallout>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Nombre del foro</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                  placeholder="Ej. Postulantes Arquitectura 2026"
                  value={newForo.label}
                  onChange={(e) => setNewForo({ ...newForo, label: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Descripción</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 resize-none"
                  rows={3}
                  placeholder="¿De qué tratará este foro?"
                  value={newForo.description}
                  onChange={(e) => setNewForo({ ...newForo, description: e.target.value })}
                />
              </div>
              <p className="text-xs text-gray-400">
                Serás el moderador de este foro. Otros usuarios con acceso premium podrán publicar y comentar en él.
              </p>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setShowNewForo(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Cancelar</button>
              <button
                onClick={handleCreateForo}
                disabled={!newForo.label.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#7C3AED] text-white text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-40"
              >
                Crear foro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
