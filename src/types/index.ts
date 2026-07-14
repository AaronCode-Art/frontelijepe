export type Page =
  | "auth" | "dashboard" | "home" | "explorar" | "test"
  | "simulador" | "detalle" | "comparador" | "ia" | "comunidad"
  | "mapa" | "favoritos" | "perfil" | "notificaciones" | "financiero"
  | "chat-history" | "especialistas";

export interface User {
  id?: string;           // UUID real de PostgreSQL (Neon). Ausente/"demo" en sesiones de demo.
  isDemo?: boolean;      // true = entró con los botones de demo, no tiene cuenta real en la BD
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  telefono: string;
  region: string;
  tipo: "egresado" | "traslado" | "padre";
  avatar: string;
  iaPremium: boolean;
}

export interface University {
  id: number;
  name: string;
  short: string;
  type: "Pública" | "Privada";
  region: string;
  city: string;
  cost: number;
  pensionMin: number;
  pensionMax: number;
  matricula: number;
  rating: number;
  img: string;
  empleabilidad: number;
  sunedu: boolean;
  modalidad: "Presencial" | "Semipresencial" | "Virtual";
  nivel: string;
  careers: number;
  founded: number;
  lat: number;
  lng: number;
  description: string;
  costHistory: number[];
  website: string;
}

export interface TestQuestion {
  id: number;
  block: string;
  blockIcon: string;
  question: string;
  type: "multi" | "single" | "scale";
  options: { label: string; value: string; weights: Record<string, number> }[];
}

export interface CareerResult {
  career: string;
  cluster: string;
  score: number;
  pct: number;
  unis: number[];
}

export interface TestResult {
  date: string;
  answers: Record<number, string[]>;
  careers: CareerResult[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

export interface ChatSession {
  id: string;
  type: "faq" | "ia";
  title: string;
  date: string;
  messages: ChatMessage[];
}

export interface CommunityPost {
  id: string;
  channel: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  tags: string[];
  isReport?: boolean;
  relatedPage?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  desc: string;
  type: "info" | "success" | "warning";
  read: boolean;
  time: string;
}

// ─── Foros creados por usuarios (Comunidad) ───────────────────────────────
export interface CommunityChannel {
  id: string;
  label: string;
  icon: string;
  color: string;
  description?: string;
  createdBy?: string;
  isCustom?: boolean;
  backendId?: string; // UUID real del foro en PostgreSQL, si ya está sincronizado
}

// ─── Chat con especialistas (incluido en el acceso premium S/10) ─────────
export interface EspecialistaMensaje {
  id: string;
  role: "user" | "especialista";
  content: string;
  time: string;
}

export interface EspecialistaSesion {
  id: string;
  especialidad: string;
  estado: "en_cola" | "activo" | "cerrado";
  messages: EspecialistaMensaje[];
  createdAt: string;
}

// ─── Postulación / reserva de vacante ("comprar" universidad) ────────────
export interface Postulacion {
  id: string;
  uniId: number;
  uniName: string;
  carrera: string;
  estado: "reservado" | "en_revision" | "confirmado";
  fecha: string;
}

export interface AppState {
  user: User | null;
  favorites: number[];
  compareList: number[];
  testResults: TestResult[];
  currentTestAnswers: Record<number, string[]>;
  simuladorLoaded: boolean;
  notifications: AppNotification[];
  savedSearches: string[];
  viewedUnis: number[];
  ratings: Record<number, number>;
  tags: Record<number, string[]>;
  pinnedUnis: number[];
  chatSessions: ChatSession[];
  communityLikes: string[];
  financieroEnabled: boolean;
  customChannels: CommunityChannel[];
  especialistaSesiones: EspecialistaSesion[];
  postulaciones: Postulacion[];
}
