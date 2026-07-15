import React, { createContext, useContext, useCallback, useEffect, useReducer } from "react";
import { useNavigate, useLocation } from "react-router";
import type { AppState, User, Page, ChatSession, AppNotification, CommunityChannel, EspecialistaSesion, Postulacion } from "../types";
import { loadState, saveState } from "../services/storage";
import { historialIA } from "../services/api";

// ─── Route mapping ───────────────────────────────────────────────────────────
const PAGE_TO_PATH: Record<Page, string> = {
  auth: "/auth",
  dashboard: "/",
  home: "/",
  explorar: "/explorar",
  test: "/test",
  simulador: "/simulador",
  detalle: "/universidad",
  comparador: "/comparador",
  ia: "/ia",
  comunidad: "/comunidad",
  mapa: "/mapa",
  favoritos: "/favoritos",
  perfil: "/perfil",
  notificaciones: "/notificaciones",
  financiero: "/financiero",
  "chat-history": "/historial-ia",
  especialistas: "/especialistas",
};

const PATH_TO_PAGE: Record<string, Page> = {};
Object.entries(PAGE_TO_PATH).forEach(([page, path]) => {
  if (path !== "/") PATH_TO_PAGE[path] = page as Page;
});
PATH_TO_PAGE["/"] = "dashboard";

export function pageToPath(page: Page, uniId?: number): string {
  if (page === "detalle" && uniId !== undefined) return `/universidad/${uniId}`;
  return PAGE_TO_PATH[page] ?? "/";
}

export function pathToPage(pathname: string): { page: Page; uniId?: number } {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "universidad" && parts[1]) {
    const id = parseInt(parts[1], 10);
    return { page: "detalle", uniId: isNaN(id) ? undefined : id };
  }
  const path = "/" + (parts[0] ?? "");
  return { page: PATH_TO_PAGE[path] ?? "dashboard" };
}

// ─── Initial notifications ────────────────────────────────────────────────────
const defaultNotifications: AppNotification[] = [
  { id: "n1", title: "Nueva universidad verificada", desc: "UTEC acaba de renovar su licenciamiento SUNEDU 2026.", type: "success", read: false, time: "hace 2h" },
  { id: "n2", title: "Actualización de costos", desc: "Los aranceles 2026 de 12 universidades han sido actualizados.", type: "info", read: false, time: "hace 5h" },
  { id: "n3", title: "Tip del día", desc: "¿Sabías que la PUCP y la UNMSM tienen programas de doble titulación?", type: "info", read: true, time: "hace 1d" },
  { id: "n4", title: "Recuerda completar tu test", desc: "Tienes el test vocacional al 50%. ¡Termínalo para ver tus resultados!", type: "warning", read: true, time: "hace 2d" },
];

// ─── Default state ────────────────────────────────────────────────────────────
const defaultState: AppState = {
  user: null,
  favorites: [],
  compareList: [],
  testResults: [],
  currentTestAnswers: {},
  simuladorLoaded: false,
  notifications: defaultNotifications,
  savedSearches: ["Ingeniería Lima", "Medicina Pública", "Administración"],
  viewedUnis: [],
  ratings: {},
  tags: {},
  pinnedUnis: [2, 5],
  chatSessions: [],
  communityLikes: [],
  financieroEnabled: false,
  customChannels: [],
  especialistaSesiones: [],
  postulaciones: [],
};

// ─── Actions ─────────────────────────────────────────────────────────────────
type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "TOGGLE_FAV"; id: number }
  | { type: "TOGGLE_COMPARE"; id: number }
  | { type: "TOGGLE_PIN"; id: number }
  | { type: "SET_RATING"; id: number; rating: number }
  | { type: "ADD_TAG"; id: number; tag: string }
  | { type: "REMOVE_TAG"; id: number; tag: string }
  | { type: "MARK_NOTIF_READ"; id: string }
  | { type: "MARK_ALL_NOTIF_READ" }
  | { type: "ADD_SAVED_SEARCH"; query: string }
  | { type: "MARK_VIEWED"; id: number }
  | { type: "SET_TEST_ANSWER"; step: number; answers: string[] }
  | { type: "CLEAR_TEST" }
  | { type: "SAVE_TEST_RESULT"; result: AppState["testResults"][0] }
  | { type: "SET_SIMULADOR_LOADED"; value: boolean }
  | { type: "SAVE_CHAT_SESSION"; session: ChatSession }
  | { type: "LOAD_CHAT_SESSIONS"; sessions: ChatSession[] }
  | { type: "TOGGLE_COMMUNITY_LIKE"; postId: string }
  | { type: "SET_FINANCIERO_ENABLED"; value: boolean }
  | { type: "UNLOCK_IA_PREMIUM" }
  | { type: "CREATE_FORO"; channel: CommunityChannel }
  | { type: "SAVE_ESPECIALISTA_SESION"; session: EspecialistaSesion }
  | { type: "ADD_POSTULACION"; postulacion: Postulacion };

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...defaultState, notifications: state.notifications };
    case "TOGGLE_FAV":
      return { ...state, favorites: state.favorites.includes(action.id) ? state.favorites.filter((f) => f !== action.id) : [...state.favorites, action.id] };
    case "TOGGLE_COMPARE": {
      const max = 5;
      if (state.compareList.includes(action.id)) return { ...state, compareList: state.compareList.filter((f) => f !== action.id) };
      if (state.compareList.length >= max) return state;
      return { ...state, compareList: [...state.compareList, action.id] };
    }
    case "TOGGLE_PIN":
      return { ...state, pinnedUnis: state.pinnedUnis.includes(action.id) ? state.pinnedUnis.filter((f) => f !== action.id) : [...state.pinnedUnis, action.id] };
    case "SET_RATING":
      return { ...state, ratings: { ...state.ratings, [action.id]: action.rating } };
    case "ADD_TAG":
      return { ...state, tags: { ...state.tags, [action.id]: [...(state.tags[action.id] || []), action.tag].slice(0, 5) } };
    case "REMOVE_TAG":
      return { ...state, tags: { ...state.tags, [action.id]: (state.tags[action.id] || []).filter((t) => t !== action.tag) } };
    case "MARK_NOTIF_READ":
      return { ...state, notifications: state.notifications.map((n) => n.id === action.id ? { ...n, read: true } : n) };
    case "MARK_ALL_NOTIF_READ":
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case "ADD_SAVED_SEARCH":
      return { ...state, savedSearches: [action.query, ...state.savedSearches.filter((s) => s !== action.query)].slice(0, 8) };
    case "MARK_VIEWED":
      return { ...state, viewedUnis: [...new Set([...state.viewedUnis, action.id])] };
    case "SET_TEST_ANSWER":
      return { ...state, currentTestAnswers: { ...state.currentTestAnswers, [action.step]: action.answers } };
    case "CLEAR_TEST":
      return { ...state, currentTestAnswers: {} };
    case "SAVE_TEST_RESULT":
      return { ...state, testResults: [action.result, ...state.testResults].slice(0, 10) };
    case "SET_SIMULADOR_LOADED":
      return { ...state, simuladorLoaded: action.value };
    case "SAVE_CHAT_SESSION":
      return { ...state, chatSessions: [action.session, ...state.chatSessions.filter((s) => s.id !== action.session.id)].slice(0, 20) };
    case "LOAD_CHAT_SESSIONS":
      return { ...state, chatSessions: action.sessions.slice(0, 20) };
    case "TOGGLE_COMMUNITY_LIKE":
      return { ...state, communityLikes: state.communityLikes.includes(action.postId) ? state.communityLikes.filter((id) => id !== action.postId) : [...state.communityLikes, action.postId] };
    case "SET_FINANCIERO_ENABLED":
      return { ...state, financieroEnabled: action.value };
    case "UNLOCK_IA_PREMIUM":
      return { ...state, user: state.user ? { ...state.user, iaPremium: true } : state.user };
    case "CREATE_FORO":
      return { ...state, customChannels: [...state.customChannels, action.channel] };
    case "SAVE_ESPECIALISTA_SESION":
      return {
        ...state,
        especialistaSesiones: [
          action.session,
          ...state.especialistaSesiones.filter((s) => s.id !== action.session.id),
        ].slice(0, 20),
      };
    case "ADD_POSTULACION":
      return { ...state, postulaciones: [action.postulacion, ...state.postulaciones] };
    default:
      return state;
  }
}

// ─── Context type ─────────────────────────────────────────────────────────────
interface AppContextType {
  state: AppState;
  page: Page;
  selectedUniId: number | null;
  selectedChatSessionId: string | null;
  navigate: (p: Page, uniId?: number) => void;
  openChatSession: (sessionId: string) => void;
  login: (u: User) => void;
  logout: () => void;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const [selectedChatSessionId, setSelectedChatSessionId] = React.useState<string | null>(null);

  const [state, dispatch] = useReducer(reducer, defaultState, (def) => {
    const saved = loadState();
    return saved ? { ...def, ...saved, notifications: def.notifications } : def;
  });

  // Derive page from URL
  const { page: currentPage, uniId: urlUniId } = pathToPage(location.pathname);

  // Auto-save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Fetch chat history from backend when user logs in
  useEffect(() => {
    if (!state.user || state.user.isDemo || !state.user.id) return;
    let cancelled = false;
    historialIA(state.user.id)
      .then((data) => {
        if (cancelled || !data) return;
        const sessions: ChatSession[] = data.map((s: any) => ({
          id: s.id,
          type: "ia" as const,
          title: s.titulo || `Sesión IA`,
          date: s.created_at,
          messages: (s.mensajes || []).map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            time: new Date(m.created_at).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
          })),
        }));
        dispatch({ type: "LOAD_CHAT_SESSIONS", sessions });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [state.user]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!state.user && currentPage !== "auth") {
      routerNavigate("/auth", { replace: true });
    }
  }, [state.user, currentPage, routerNavigate]);

  const navigate = useCallback((p: Page, uniId?: number) => {
    const path = pageToPath(p, uniId);
    routerNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [routerNavigate]);

  const openChatSession = useCallback((sessionId: string) => {
    setSelectedChatSessionId(sessionId);
    routerNavigate("/ia");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [routerNavigate]);

  const login = useCallback((u: User) => {
    dispatch({ type: "LOGIN", payload: u });
    routerNavigate("/", { replace: true });
  }, [routerNavigate]);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    routerNavigate("/auth", { replace: true });
  }, [routerNavigate]);

  return (
    <AppContext.Provider value={{ state, page: currentPage, selectedUniId: urlUniId ?? null, selectedChatSessionId, navigate, openChatSession, login, logout, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
