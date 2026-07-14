import { useState } from "react";
import {
  User, Lock, AtSign, GraduationCap,
  BookOpen, Users, Check, AlertCircle, Shield, Database,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FormField } from "@/components/FormField";
import type { User as UserType } from "@/types";
import * as api from "@/services/api";
import { ApiError } from "@/services/api";

type TipoUser = "egresado" | "traslado" | "padre";

interface RegisterForm {
  nombre: string;
  apellido: string;
  tipo: TipoUser;
  email: string;
  password: string;
  terms: boolean;
}

interface LoginForm {
  email: string;
  password: string;
}

export default function AuthPage() {
  const { login } = useApp();
  const [tab, setTab] = useState<"login" | "register">("login");

  // ── Login form state ──────────────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<Partial<LoginForm>>({});
  const [loginTouched, setLoginTouched] = useState<Partial<Record<keyof LoginForm, boolean>>>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginServerError, setLoginServerError] = useState<string | null>(null);

  // ── Register form state ───────────────────────────────────────────────────
  const [regForm, setRegForm] = useState<RegisterForm>({
    nombre: "", apellido: "", tipo: "egresado",
    email: "", password: "", terms: false,
  });
  const [regErrors, setRegErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({});
  const [regTouched, setRegTouched] = useState<Partial<Record<keyof RegisterForm, boolean>>>({});
  const [regLoading, setRegLoading] = useState(false);
  const [regServerError, setRegServerError] = useState<string | null>(null);

  // ── Validation ────────────────────────────────────────────────────────────
  function validateLoginField(field: keyof LoginForm, value: string): string {
    if (field === "email") {
      if (!value) return "El email es requerido";
      if (!/\S+@\S+\.\S+/.test(value)) return "Email inválido";
    }
    if (field === "password") {
      if (!value) return "La contraseña es requerida";
      if (value.length < 6) return "Mínimo 6 caracteres";
    }
    return "";
  }

  function validateRegField(field: keyof RegisterForm, value: string | boolean): string {
    if (field === "nombre" && !value) return "El nombre es requerido";
    if (field === "apellido" && !value) return "El apellido es requerido";
    if (field === "email") {
      if (!value) return "El email es requerido";
      if (!/\S+@\S+\.\S+/.test(value as string)) return "Email inválido";
    }
    if (field === "password") {
      if (!value) return "La contraseña es requerida";
      if ((value as string).length < 8) return "Mínimo 8 caracteres";
    }
    if (field === "terms" && !value) return "Debes aceptar los términos";
    return "";
  }

  // ── Login handlers ────────────────────────────────────────────────────────
  const setLogin = (field: keyof LoginForm, val: string) => {
    setLoginForm((f) => ({ ...f, [field]: val }));
    if (loginTouched[field]) {
      setLoginErrors((e) => ({ ...e, [field]: validateLoginField(field, val) }));
    }
  };

  const blurLogin = (field: keyof LoginForm) => {
    setLoginTouched((t) => ({ ...t, [field]: true }));
    setLoginErrors((e) => ({ ...e, [field]: validateLoginField(field, loginForm[field]) }));
  };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const fields: (keyof LoginForm)[] = ["email", "password"];
    const newErrors: Partial<LoginForm> = {};
    const newTouched: Partial<Record<keyof LoginForm, boolean>> = {};
    fields.forEach((f) => { newErrors[f] = validateLoginField(f, loginForm[f]); newTouched[f] = true; });
    setLoginErrors(newErrors);
    setLoginTouched(newTouched);
    if (Object.values(newErrors).some(Boolean)) return;
    setLoginServerError(null);
    setLoginLoading(true);
    try {
      const u = await api.login(loginForm.email, loginForm.password);
      login({
        id: u.id, isDemo: false,
        nombre: u.nombre, apellido: u.apellido, email: u.email,
        dni: "", telefono: "", region: u.region ?? "Lima",
        tipo: (u.tipo as UserType["tipo"]) ?? "egresado",
        avatar: "", iaPremium: u.ia_premium,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setLoginServerError(
          err.status === 401
            ? "Correo o contraseña incorrectos."
            : `No se pudo conectar con el servidor (${err.message}). ¿Está corriendo el backend (uvicorn) en ${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}?`
        );
      } else {
        setLoginServerError("No se pudo conectar con el backend. Revisa que uvicorn esté corriendo.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // ── Register handlers ─────────────────────────────────────────────────────
  const setReg = (field: keyof RegisterForm, val: string | boolean) => {
    setRegForm((f) => ({ ...f, [field]: val }));
    if (regTouched[field]) {
      setRegErrors((e) => ({ ...e, [field]: validateRegField(field, val) }));
    }
  };

  const blurReg = (field: keyof RegisterForm) => {
    setRegTouched((t) => ({ ...t, [field]: true }));
    setRegErrors((e) => ({ ...e, [field]: validateRegField(field, regForm[field]) }));
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const fields = Object.keys(regForm) as (keyof RegisterForm)[];
    const newErrors: Partial<Record<keyof RegisterForm, string>> = {};
    const newTouched: Partial<Record<keyof RegisterForm, boolean>> = {};
    fields.forEach((f) => { newErrors[f] = validateRegField(f, regForm[f]); newTouched[f] = true; });
    setRegErrors(newErrors);
    setRegTouched(newTouched);
    if (Object.values(newErrors).some(Boolean)) return;
    setRegServerError(null);
    setRegLoading(true);
    try {
      const u = await api.registro({
        nombre: regForm.nombre, apellido: regForm.apellido, email: regForm.email,
        password: regForm.password, tipo: regForm.tipo,
      });
      login({
        id: u.id, isDemo: false,
        nombre: u.nombre, apellido: u.apellido, email: u.email,
        dni: "", telefono: "", region: u.region ?? "",
        tipo: (u.tipo as UserType["tipo"]) ?? regForm.tipo,
        avatar: "", iaPremium: u.ia_premium,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setRegServerError(
          err.status === 409
            ? "Ya existe una cuenta con ese correo. Intenta iniciar sesión."
            : `No se pudo conectar con el servidor (${err.message}). ¿Está corriendo el backend (uvicorn) en ${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}?`
        );
      } else {
        setRegServerError("No se pudo conectar con el backend. Revisa que uvicorn esté corriendo.");
      }
    } finally {
      setRegLoading(false);
    }
  };

  // ── Demo login ────────────────────────────────────────────────────────────
  // Estas cuentas NO existen en la base de datos real: son solo para probar
  // la interfaz rápido. Por eso van marcadas con isDemo=true, lo que bloquea
  // acciones que requieren una cuenta real (pagar el premium, postular,
  // crear foros, usar el simulador) hasta que el usuario se registre de verdad.
  const demoLogin = (tipo: TipoUser) => {
    const demos: Record<TipoUser, UserType> = {
      egresado: { id: "demo", isDemo: true, nombre: "Ana", apellido: "García (Demo)", email: "ana@demo.pe", dni: "12345678", telefono: "987654321", region: "Lima", tipo: "egresado", avatar: "", iaPremium: false },
      traslado: { id: "demo", isDemo: true, nombre: "Carlos", apellido: "Ramírez (Demo)", email: "carlos@demo.pe", dni: "87654321", telefono: "912345678", region: "Arequipa", tipo: "traslado", avatar: "", iaPremium: false },
      padre: { id: "demo", isDemo: true, nombre: "María", apellido: "López (Demo)", email: "maria@demo.pe", dni: "11223344", telefono: "945678123", region: "Cusco", tipo: "padre", avatar: "", iaPremium: false },
    };
    login(demos[tipo]);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ─────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] p-12 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0059FF 0%, #003BB5 60%, #001F6B 100%)" }}
      >
        {/* Background decorations */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-8 w-48 h-48 rounded-full bg-white/5" />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight">ElijePe</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight mb-4">
            Encuentra la universidad<br />
            <span className="text-blue-200">perfecta para ti</span>
          </h1>
          <p className="text-blue-100 text-base leading-relaxed max-w-xs">
            La plataforma de orientación universitaria más completa del Perú. Compara, explora y decide con datos reales.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <BookOpen className="w-5 h-5" />, val: "98+", label: "Universidades" },
            { icon: <Database className="w-5 h-5" />, val: "15+", label: "Fuentes de datos" },
            { icon: <Shield className="w-5 h-5" />, val: "Gratis", label: "Sin costo" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
              <div className="flex justify-center mb-2 text-blue-200">{stat.icon}</div>
              <p className="text-xl font-bold">{stat.val}</p>
              <p className="text-xs text-blue-200 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-blue-900 font-bold text-sm">JR</div>
            <div>
              <p className="font-semibold text-sm">José Ríos</p>
              <p className="text-xs text-blue-200">Ingresó a UTEC 2025</p>
            </div>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed italic">
            "ElijePe me ayudó a comparar 5 universidades de ingeniería y elegir la que mejor se adaptaba a mis metas."
          </p>
          <div className="flex gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 text-yellow-300">★</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F4F6F9] overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">ElijePe</span>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            {/* Tab toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              {(["login", "register"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "flex-1 py-2 px-4 rounded-xl text-sm font-semibold transition-all",
                    tab === t ? "bg-white text-[#0059FF] shadow-sm" : "text-gray-500 hover:text-gray-700",
                  ].join(" ")}
                >
                  {t === "login" ? "Iniciar sesión" : "Registrarse"}
                </button>
              ))}
            </div>

            {/* ── Login form ─────────────────────────────────────────────── */}
            {tab === "login" && (
              <form onSubmit={submitLogin} noValidate className="space-y-5">
                {loginServerError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {loginServerError}
                  </div>
                )}
                <FormField
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  placeholder="tucorreo@email.com"
                  value={loginForm.email}
                  onChange={(v) => setLogin("email", v)}
                  onBlur={() => blurLogin("email")}
                  error={loginErrors.email}
                  touched={loginTouched.email}
                  icon={AtSign}
                  autoFocus
                />
                <div>
                  <FormField
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="Tu contraseña"
                    value={loginForm.password}
                    onChange={(v) => setLogin("password", v)}
                    onBlur={() => blurLogin("password")}
                    error={loginErrors.password}
                    touched={loginTouched.password}
                    icon={Lock}
                  />
                  <div className="text-right mt-1">
                    <button type="button" className="text-xs text-[#0059FF] hover:underline">
                      Olvidé mi contraseña
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-70"
                  style={{ background: "#0059FF" }}
                >
                  {loginLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Ingresando...
                    </span>
                  ) : "Iniciar sesión"}
                </button>
              </form>
            )}

            {/* ── Register form ──────────────────────────────────────────── */}
            {tab === "register" && (
              <form onSubmit={submitRegister} noValidate className="space-y-4">
                {regServerError && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {regServerError}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Nombre"
                    name="nombre"
                    placeholder="Ana"
                    value={regForm.nombre}
                    onChange={(v) => setReg("nombre", v)}
                    onBlur={() => blurReg("nombre")}
                    error={regErrors.nombre}
                    touched={regTouched.nombre}
                    icon={User}
                    autoFocus
                  />
                  <FormField
                    label="Apellido"
                    name="apellido"
                    placeholder="García"
                    value={regForm.apellido}
                    onChange={(v) => setReg("apellido", v)}
                    onBlur={() => blurReg("apellido")}
                    error={regErrors.apellido}
                    touched={regTouched.apellido}
                    icon={User}
                  />
                </div>

                {/* Tipo selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Soy…
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "egresado", label: "Egresado", icon: GraduationCap },
                      { value: "traslado", label: "Traslado", icon: BookOpen },
                      { value: "padre", label: "Padre/Madre", icon: Users },
                    ] as { value: TipoUser; label: string; icon: React.ElementType }[]).map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setReg("tipo", value)}
                        className={[
                          "flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all",
                          regForm.tipo === value
                            ? "border-[#0059FF] bg-blue-50 text-[#0059FF]"
                            : "border-gray-200 text-gray-500 hover:border-gray-300",
                        ].join(" ")}
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                        {regForm.tipo === value && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>

                <FormField
                  label="Correo electrónico"
                  name="reg-email"
                  type="email"
                  placeholder="tucorreo@email.com"
                  value={regForm.email}
                  onChange={(v) => setReg("email", v)}
                  onBlur={() => blurReg("email")}
                  error={regErrors.email}
                  touched={regTouched.email}
                  icon={AtSign}
                />

                <p className="text-xs text-gray-400 -mt-1">
                  DNI, teléfono y región los completas después en tu perfil.
                </p>

                <FormField
                  label="Contraseña"
                  name="reg-password"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={regForm.password}
                  onChange={(v) => setReg("password", v)}
                  onBlur={() => blurReg("password")}
                  error={regErrors.password}
                  touched={regTouched.password}
                  icon={Lock}
                />

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regForm.terms}
                      onChange={(e) => setReg("terms", e.target.checked)}
                      onBlur={() => blurReg("terms")}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      Acepto los <button type="button" className="text-[#0059FF] hover:underline">términos</button> y la{" "}
                      <button type="button" className="text-[#0059FF] hover:underline">política de privacidad</button>
                    </span>
                  </label>
                  {regErrors.terms && regTouched.terms && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" /> {regErrors.terms}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-70"
                  style={{ background: "#0059FF" }}
                >
                  {regLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Creando cuenta...
                    </span>
                  ) : "Crear cuenta"}
                </button>
              </form>
            )}
          </div>

          {/* Demo quick access */}
          <div className="mt-5">
            <p className="text-center text-xs text-gray-400 mb-2.5 flex items-center gap-2">
              <span className="flex-1 h-px bg-gray-200" />
              O prueba sin registrarte
              <span className="flex-1 h-px bg-gray-200" />
            </p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { tipo: "egresado" as TipoUser, label: "Egresado", icon: GraduationCap },
                { tipo: "traslado" as TipoUser, label: "Traslado", icon: BookOpen },
                { tipo: "padre" as TipoUser, label: "Padre/Madre", icon: Users },
              ]).map(({ tipo, label, icon: Icon }) => (
                <button
                  key={tipo}
                  onClick={() => demoLogin(tipo)}
                  className="flex flex-col items-center gap-1 py-2.5 px-2 bg-white rounded-xl border border-gray-200 hover:border-[#0059FF] hover:bg-blue-50 text-xs font-semibold text-gray-600 hover:text-[#0059FF] transition-all"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
