import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Hash, Flag, MessageCircle, Heart, Share2, Plus, X, Search,
  Users, ChevronDown, Send, AlertTriangle, Lock, Sparkles, TrendingUp, Flame
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
      className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white"
      style={{ background: `linear-gradient(135deg, ${TIPO_COLORS[tipo] ?? "#6B7280"}, ${TIPO_COLORS[tipo] ?? "#6B7280"}dd)` }}
    >
      {TIPO_LABELS[tipo] ?? tipo}
    </span>
  );
}

export default function ComunidadPage() {
  const { state, dispatch, navigate } = useApp();
  const user = state.user;

  const [activeChannel, setActiveChannel] = useState("general");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "", isReport: false, channel: "general" });
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [quickMessage, setQuickMessage] = useState("");
  const [showNewForo, setShowNewForo] = useState(false);
  const [newForo, setNewForo] = useState({ label: "", description: "" });
  const [backendForoMap, setBackendForoMap] = useState<Record<string, string>>({});
  const [postBackendId, setPostBackendId] = useState<Record<string, string>>({});
  const [commentsByPost, setCommentsByPost] = useState<Record<string, { id: string; author: string; tipo: string; content: string; time: string }[]>>({});
  const [commentsLoading, setCommentsLoading] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState("");
  const [foroSyncError, setForoSyncError] = useState(false);
  const [postsLoaded, setPostsLoaded] = useState(false);

  const esCuentaReal = !!user?.id && !user.isDemo;

  function normalizar(nombre: string) {
    return nombre.trim().toLowerCase();
  }

  async function loadComments(postId: string, backendPostId: string) {
    setCommentsLoading((p) => ({ ...p, [postId]: true }));
    try {
      const rows = await api.listarComentarios(backendPostId);
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: rows.map((c: any) => ({
          id: c.id,
          author: `${c.autor_nombre} ${c.autor_apellido}`,
          tipo: "egresado",
          content: c.contenido,
          time: new Date(c.created_at).toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
        })),
      }));
    } catch {
      setForoSyncError(true);
    } finally {
      setCommentsLoading((p) => ({ ...p, [postId]: false }));
    }
  }

  function toggleExpand(postId: string) {
    const opening = expandedPost !== postId;
    setExpandedPost(opening ? postId : null);
    const backendPostId = postBackendId[postId];
    if (opening && backendPostId) {
      loadComments(postId, backendPostId);
    }
  }

  useEffect(() => {
    api.listarForos()
      .then(async (backendForos) => {
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

        const channelIdFor = (foro: (typeof backendForos)[number]) => {
          const base = baseChannels.find((c) => normalizar(c.label) === normalizar(foro.nombre));
          return base?.id ?? foro.id;
        };

        const results = await Promise.all(
          backendForos.map((f) =>
            api.listarPosts(f.id).then((rows) => ({ foro: f, rows })).catch(() => ({ foro: f, rows: [] as any[] }))
          )
        );

        const newPostBackendId: Record<string, string> = {};
        const realPosts: CommunityPost[] = [];
        for (const { foro, rows } of results) {
          const channelId = channelIdFor(foro);
          for (const p of rows) {
            realPosts.push({
              id: p.id,
              channel: channelId,
              author: `${p.autor_nombre} ${p.autor_apellido}`,
              avatar: `${p.autor_nombre[0]}${p.autor_apellido[0]}`,
              title: p.titulo,
              content: p.contenido,
              time: new Date(p.created_at).toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
              likes: 0,
              comments: 0,
              tags: p.tags ?? [],
            });
            newPostBackendId[p.id] = p.id;
          }
        }
        setPostBackendId((prev) => ({ ...prev, ...newPostBackendId }));
        setPosts(realPosts);
        setPostsLoaded(true);
      })
      .catch(() => {
        setForoSyncError(true);
        setPosts(initialPosts);
        setPostsLoaded(true);
      });
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
        setForoSyncError(true);
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
    <div className="flex h-[calc(100vh-64px)] bg-[#F0F2F5] overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside className="hidden md:flex w-72 flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white shrink-0 shadow-xl">
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-violet flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users size={18} />
            </div>
            <div>
              <div className="font-bold text-sm leading-tight">ElijePe</div>
              <div className="text-xs text-white/40 font-medium">Comunidad</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
          <div className="px-4 mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Canales</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => (puedeCrearForos ? setShowNewForo(true) : navigate("ia"))}
              title={puedeCrearForos ? "Crear foro" : "Desbloquea con acceso premium"}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
            >
              {puedeCrearForos ? <Plus size={14} /> : <Lock size={11} />}
            </motion.button>
          </div>
          <div className="space-y-0.5 px-2">
            {communityChannels.map((ch) => {
              const isActive = activeChannel === ch.id;
              const isReport = ch.id === "reportes";
              return (
                <motion.button
                  key={ch.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-white/10 text-white shadow-sm shadow-black/10"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  {isReport ? (
                    <Flag size={15} className="text-red-400 shrink-0" />
                  ) : ch.isCustom ? (
                    <span className="shrink-0 text-sm leading-none">{ch.icon}</span>
                  ) : (
                    <Hash size={15} className="shrink-0" style={{ color: isActive ? ch.color : undefined }} />
                  )}
                  <span className="text-sm flex-1 truncate font-medium">{ch.label}</span>
                  {postsByChannel[ch.id] > 0 && !isActive && (
                    <span className="text-[10px] text-white/20 font-medium">{postsByChannel[ch.id]}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {user && (
          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: `linear-gradient(135deg, ${getAvatarColor(user.nombre)}, ${getAvatarColor(user.nombre)}cc)` }}
                >
                  {user.nombre[0]}{user.apellido[0]}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald rounded-full border-2 border-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{user.nombre}</div>
                <TipoBadge tipo={user.tipo} />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Channel Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 sm:px-6 py-3 flex items-center gap-3 shrink-0 shadow-sm shadow-gray-100/50">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {currentChannel?.id === "reportes" ? (
              <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                <Flag size={15} className="text-red-500" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <Hash size={15} className="text-blue-500" />
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-gray-900 text-sm">{currentChannel?.label}</span>
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline">
                {channelPosts.length} publicaciones
              </span>
            </div>
          </div>

          <div className="md:hidden">
            <select
              className="text-sm border border-gray-200/60 rounded-xl px-3 py-1.5 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={activeChannel}
              onChange={(e) => setActiveChannel(e.target.value)}
            >
              {communityChannels.map((ch) => (
                <option key={ch.id} value={ch.id}>{ch.label}</option>
              ))}
            </select>
          </div>

          <div className="relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="pl-9 pr-3 py-2 text-sm border border-gray-200/60 rounded-xl bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300/50 w-52 transition-all"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md shadow-blue-200/30 shrink-0"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">Nueva publicación</span>
          </motion.button>
        </div>

        {/* Reportes banner */}
        <AnimatePresence>
          {activeChannel === "reportes" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60 px-4 sm:px-6 py-3 shrink-0 overflow-hidden"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={14} className="text-amber-600" />
                </div>
                <p className="text-xs text-amber-800">
                  <strong>Tus reportes ayudan a mejorar la calidad de datos.</strong>{" "}
                  El equipo ElijePe revisa cada reporte en menos de 48 horas.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 scrollbar-thin">
          {channelPosts.length === 0 && postsLoaded && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-violet-light flex items-center justify-center mb-5 animate-float">
                <MessageCircle size={36} className="text-blue-300" />
              </div>
              <p className="font-bold text-gray-600 text-lg mb-1">Sin publicaciones</p>
              <p className="text-sm text-gray-400 max-w-xs">Sé el primero en publicar en este canal y activa la conversación</p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {channelPosts.map((post, i) => {
              const isExpanded = expandedPost === post.id;
              const isLiked = state.communityLikes.includes(post.id);
              const likeCount = post.likes + (isLiked ? 1 : 0);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  layout
                  className="bg-white rounded-2xl border border-gray-100/60 overflow-hidden hover:shadow-lg hover:shadow-blue-100/20 hover:border-blue-100/40 transition-all duration-300"
                >
                  <div className="p-4 sm:p-5">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${getAvatarColor(post.author)}, ${getAvatarColor(post.author)}cc)` }}
                      >
                        {getInitials(post.author)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-gray-800">{post.author}</span>
                          <TipoBadge tipo={
                            post.author.includes("(Padre)") || post.author.includes("(Madre)")
                              ? "padre"
                              : post.channel === "traslados"
                              ? "traslado"
                              : "egresado"
                          } />
                          {post.isReport && (
                            <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-semibold border border-red-100/60">
                              <AlertTriangle size={9} />
                              Reporte
                            </span>
                          )}
                          <span className="text-[11px] text-gray-400 ml-auto">{post.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 text-sm mb-2 leading-snug">{post.title}</h3>

                    {/* Content */}
                    <p className={`text-sm text-gray-600 leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {post.tags.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] bg-blue-50/60 text-blue-600 px-2.5 py-0.5 rounded-full font-medium border border-blue-100/40"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-100/60">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          isLiked
                            ? "bg-red-50 text-red-500"
                            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                        }`}
                      >
                        <Heart size={13} fill={isLiked ? "currentColor" : "none"} />
                        {likeCount}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleExpand(post.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
                      >
                        <MessageCircle size={13} />
                        {(commentsByPost[post.id] ?? []).length}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all ml-auto"
                      >
                        <Share2 size={13} />
                        <span className="hidden sm:inline">Compartir</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ x: 2 }}
                        onClick={() => toggleExpand(post.id)}
                        className="text-xs text-blue-600 font-semibold px-3 py-1.5 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        {isExpanded ? "Menos" : "Leer más"}
                      </motion.button>
                    </div>
                  </div>

                  {/* Expanded: comments */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100/60 bg-gradient-to-b from-gray-50/80 to-white px-4 sm:px-5 py-4 space-y-3">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Comentarios</p>
                          {commentsLoading[post.id] && (
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <div className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
                              Cargando...
                            </div>
                          )}
                          {!commentsLoading[post.id] && (commentsByPost[post.id] ?? []).length === 0 && (
                            <p className="text-xs text-gray-400 py-2">Sé el primero en comentar.</p>
                          )}
                          <div className="space-y-2.5">
                            {(commentsByPost[post.id] ?? []).map((c, ci) => (
                              <motion.div
                                key={c.id ?? ci}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: ci * 0.05 }}
                                className="flex gap-2.5"
                              >
                                <div
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${getAvatarColor(c.author)}, ${getAvatarColor(c.author)}cc)` }}
                                >
                                  {getInitials(c.author)}
                                </div>
                                <div className="bg-white rounded-xl px-3 py-2 text-sm flex-1 border border-gray-100/60 shadow-sm">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-xs text-gray-700">{c.author}</span>
                                    <TipoBadge tipo={c.tipo} />
                                    <span className="text-[10px] text-gray-400 ml-auto">{c.time}</span>
                                  </div>
                                  <p className="text-gray-600 text-xs leading-relaxed">{c.content}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="flex gap-2 pt-1">
                            <input
                              className="flex-1 text-sm border border-gray-200/60 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300/50 transition-all"
                              placeholder="Escribe un comentario..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => submitComment(post.id)}
                              disabled={!newComment.trim()}
                              className="px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-40 shadow-sm shadow-blue-200/30"
                            >
                              <Send size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom input */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/60 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex gap-2.5">
            <div className="flex-1 flex items-center gap-2.5 bg-gray-50/80 rounded-2xl px-4 py-3 border border-gray-200/60 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300/50 transition-all">
              <Hash size={15} className="text-gray-400 shrink-0" />
              <input
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder={`Escribe en #${currentChannel?.label.toLowerCase()}...`}
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleQuickMessage(); }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickMessage}
              disabled={!quickMessage.trim()}
              className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-200/30"
            >
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* NEW POST MODAL */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowNewPost(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-violet-50 pointer-events-none" />
                <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-100/60">
                  <h2 className="font-bold text-gray-900">Nueva publicación</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNewPost(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-xl p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Canal</label>
                  <div className="relative">
                    <select
                      className="w-full border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm appearance-none bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Título</label>
                  <input
                    className="w-full border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300/50 transition-all"
                    placeholder="¿Cuál es tu publicación?"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Contenido</label>
                  <textarea
                    className="w-full border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300/50 resize-none transition-all"
                    rows={4}
                    placeholder="Comparte tu experiencia, pregunta o información..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Etiquetas <span className="text-gray-400 normal-case font-normal">(separadas por coma)</span></label>
                  <input
                    className="w-full border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300/50 transition-all"
                    placeholder="traslado, PUCP, Derecho"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  />
                </div>
                <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border border-gray-200/60 hover:bg-gray-50/50 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-red-500"
                    checked={newPost.isReport}
                    onChange={(e) => setNewPost({ ...newPost, isReport: e.target.checked, channel: e.target.checked ? "reportes" : newPost.channel })}
                  />
                  <div>
                    <span className="text-sm font-semibold text-red-500">Es un reporte de datos</span>
                    <p className="text-xs text-gray-400">Se publicará en el canal de Reportes.</p>
                  </div>
                </label>
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowNewPost(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200/60 text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSubmitPost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-40 shadow-md shadow-blue-200/30"
                >
                  Publicar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: CREAR FORO */}
      <AnimatePresence>
        {showNewForo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNewForo(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-crear-foro"
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-purple-50 pointer-events-none" />
                <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-100/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet to-purple-500 flex items-center justify-center shadow-sm shadow-violet/20">
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <h3 id="titulo-crear-foro" className="font-bold text-gray-900">Crear nuevo foro</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowNewForo(false)}
                    aria-label="Cerrar"
                    className="text-gray-400 hover:text-gray-600 rounded-xl p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <GuideCallout storageKey="comunidad-crear-foro" title="Un buen foro en 2 pasos" color="purple">
                  Ponle un nombre claro y específico (ej. "Postulantes Medicina 2026" en vez de solo
                  "Ayuda"), así otros lo encuentran fácil.
                </GuideCallout>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nombre del foro</label>
                  <input
                    className="w-full border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet/30 transition-all"
                    placeholder="Ej. Postulantes Arquitectura 2026"
                    value={newForo.label}
                    onChange={(e) => setNewForo({ ...newForo, label: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Descripción</label>
                  <textarea
                    className="w-full border border-gray-200/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet/20 focus:border-violet/30 resize-none transition-all"
                    rows={3}
                    placeholder="¿De qué tratará este foro?"
                    value={newForo.description}
                    onChange={(e) => setNewForo({ ...newForo, description: e.target.value })}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Serás el moderador de este foro. Otros usuarios con acceso premium podrán publicar y comentar.
                </p>
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowNewForo(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200/60 text-sm text-gray-600 hover:bg-gray-50 transition-all font-medium"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleCreateForo}
                  disabled={!newForo.label.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet to-purple-500 text-white text-sm font-semibold hover:from-violet/90 hover:to-purple-500/90 transition-all disabled:opacity-40 shadow-md shadow-violet/20"
                >
                  Crear foro
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
