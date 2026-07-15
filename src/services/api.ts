/**
 * Cliente central de la API. Todo el frontend habla con el backend
 * (Python + FastAPI + PostgreSQL en Neon) a través de este archivo.
 *
 * Configura la URL del backend en un archivo .env (raíz del proyecto):
 *   VITE_API_URL=http://localhost:8000
 *
 * Si no defines VITE_API_URL, se usa http://localhost:8000 por defecto
 * (ahí es donde corre `uvicorn app.main:app --reload --port 8000`).
 */
import type { CareerResult } from "@/types";

const API_URL = import.meta.env.VITE_API_URL ?? "https://backendelijpe.onrender.com";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers:
      options.body instanceof FormData
        ? options.headers
        : { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail ?? detail;
    } catch {
      /* respuesta sin JSON */
    }
    throw new ApiError(detail, res.status);
  }
  return res.json() as Promise<T>;
}

// ─── AUTH ──────────────────────────────────────────────────────────────────
export interface BackendUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  tipo: string;
  region: string | null;
  ia_premium: boolean;
  created_at: string;
}

export function registro(body: {
  nombre: string; apellido: string; email: string; password: string;
  dni?: string; telefono?: string; tipo?: string; region?: string;
}) {
  return request<BackendUser>("/api/auth/registro", { method: "POST", body: JSON.stringify(body) });
}

export function login(email: string, password: string) {
  return request<BackendUser>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

// ─── UNIVERSIDADES / POSTULACIONES ──────────────────────────────────────────
export function listarUniversidades(params?: { region?: string; tipo?: string }) {
  const qs = new URLSearchParams(params as Record<string, string>).toString();
  return request<any[]>(`/api/universidades${qs ? `?${qs}` : ""}`);
}

export function postular(usuario_id: string, universidad_id: number, carrera: string) {
  return request<any>("/api/universidades/postular", {
    method: "POST",
    body: JSON.stringify({ usuario_id, universidad_id, carrera }),
  });
}

export function misPostulaciones(usuario_id: string) {
  return request<any[]>(`/api/universidades/postulaciones/${usuario_id}`);
}

// ─── IA ──────────────────────────────────────────────────────────────────
export interface ChatIAResponse {
  sesion_id: string;
  answer: string;
  universidades_referenciadas: number[];
  usa_ia_generativa: boolean;
}

export function chatIA(usuario_id: string, mensaje: string, sesion_id?: string) {
  return request<ChatIAResponse>("/api/ia/chat", {
    method: "POST",
    body: JSON.stringify({ usuario_id, mensaje, sesion_id }),
  });
}

export function historialIA(usuario_id: string) {
  return request<any[]>(`/api/ia/historial/${usuario_id}`);
}

export interface SaludoIA {
  saludo: string;
  preguntas_sugeridas: string[];
}

export function saludoIA(usuario_id: string) {
  return request<SaludoIA>(`/api/ia/saludo/${usuario_id}`);
}

// ─── PAGOS ──────────────────────────────────────────────────────────────
export function desbloquearPremium(usuario_id: string, metodo: string = "tarjeta") {
  return request<any>("/api/pagos/desbloquear-premium", {
    method: "POST",
    body: JSON.stringify({ usuario_id, metodo }),
  });
}

// ─── ESPECIALISTAS ─────────────────────────────────────────────────────
export function iniciarSesionEspecialista(usuario_id: string, especialidad: string) {
  return request<any>("/api/especialistas/sesiones", {
    method: "POST",
    body: JSON.stringify({ usuario_id, especialidad }),
  });
}

export function enviarMensajeEspecialista(sesion_id: string, role: "user" | "especialista", content: string) {
  return request<any>("/api/especialistas/mensajes", {
    method: "POST",
    body: JSON.stringify({ sesion_id, role, content }),
  });
}

// ─── FOROS (COMUNIDAD) ──────────────────────────────────────────────────
export function listarForos() {
  return request<any[]>("/api/foros");
}

export function crearForo(body: { usuario_id: string; nombre: string; descripcion?: string; icono?: string; color?: string }) {
  return request<any>("/api/foros", { method: "POST", body: JSON.stringify(body) });
}

export function crearPost(body: { foro_id: string; autor_id: string; titulo: string; contenido: string; tags?: string[] }) {
  return request<any>("/api/foros/posts", { method: "POST", body: JSON.stringify(body) });
}

export function listarPosts(foro_id: string) {
  return request<any[]>(`/api/foros/${foro_id}/posts`);
}

export function comentarPost(body: { post_id: string; autor_id: string; contenido: string }) {
  return request<any>("/api/foros/posts/comentarios", { method: "POST", body: JSON.stringify(body) });
}

export function listarComentarios(post_id: string) {
  return request<any[]>(`/api/foros/posts/${post_id}/comentarios`);
}

// ─── SIMULADOR (PDF real de convalidación) ──────────────────────────────
export interface ResultadoConvalidacion {
  simulacion_id: string;
  total_cursos_detectados: number;
  total_convalidados: number;
  total_creditos_convalidados: number;
  resultados: {
    curso_origen: string;
    nota_origen: number | null; // null cuando el curso está "En Curso" o "Retirado" (aún sin nota)
    estado_origen: string; // aprobado | desaprobado | en curso | retirado | ...(tal cual figura en tu récord)
    curso_destino: string | null;
    creditos_destino: number | null;
    similitud: number;
    estado: "convalidado" | "no_convalidado_nota_insuficiente" | "sin_equivalencia" | "en_curso";
  }[];
}

export async function convalidarPDF(usuario_id: string, universidad_id: number, carrera: string, file: File) {
  const form = new FormData();
  form.append("usuario_id", usuario_id);
  form.append("universidad_id", String(universidad_id));
  form.append("carrera", carrera);
  form.append("file", file);
  return request<ResultadoConvalidacion>("/api/simulador/convalidar", { method: "POST", body: form });
}

export function historialSimulaciones(usuario_id: string) {
  return request<any[]>(`/api/simulador/historial/${usuario_id}`);
}

// ─── TEST VOCACIONAL ────────────────────────────────────────────────────────
// Persiste el resultado real (respuestas + carreras calculadas a partir de
// ellas) para que el chat de IA lo lea y recomiende en base al test real,
// no de forma genérica.
export function guardarResultadoTest(
  usuario_id: string,
  respuestas: Record<number, string[]>,
  carreras: CareerResult[]
) {
  return request<{ id: string; created_at: string }>("/api/test/resultado", {
    method: "POST",
    body: JSON.stringify({ usuario_id, respuestas, carreras }),
  });
}

export function obtenerUltimoResultadoTest(usuario_id: string) {
  return request<{ respuestas: Record<number, string[]>; carreras: CareerResult[]; created_at: string } | null>(
    `/api/test/resultado/${usuario_id}`
  );
}
