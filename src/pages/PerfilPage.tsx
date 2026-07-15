import { useState } from "react";
import { motion } from "motion/react";
import {
  User, Mail, CreditCard, Phone, MapPin, Edit2, Save, X,
  Heart, Eye, BookOpen, Bell, LogOut, Check, ClipboardCheck,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { FormField } from "@/components/FormField";

const PERU_REGIONS = [
  "Lima", "Arequipa", "La Libertad", "Piura", "Cusco",
  "Junín", "Lambayeque", "Áncash", "Loreto", "Ica",
];

interface ProfileForm {
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
  region: string;
}

interface NotifPrefs {
  nuevasUnis: boolean;
  costos: boolean;
  testRecordatorio: boolean;
  noticias: boolean;
}

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

export default function PerfilPage() {
  const { state, logout, dispatch } = useApp();
  const user = state.user!;

  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState<ProfileForm>({
    nombre: user.nombre, apellido: user.apellido, dni: user.dni,
    telefono: user.telefono, email: user.email, region: user.region,
  });
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileForm, boolean>>>({});

  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    nuevasUnis: true, costos: true, testRecordatorio: false, noticias: false,
  });

  const initials = `${user.nombre[0] ?? ""}${user.apellido[0] ?? ""}`.toUpperCase();

  function validate(field: keyof ProfileForm, value: string): string {
    if (field === "nombre" && !value) return "El nombre es requerido";
    if (field === "apellido" && !value) return "El apellido es requerido";
    if (field === "dni" && !/^\d{8}$/.test(value)) return "El DNI debe tener 8 dígitos";
    if (field === "telefono" && !/^\d{9}$/.test(value)) return "El teléfono debe tener 9 dígitos";
    if (field === "email") {
      if (!value) return "El email es requerido";
      if (!/\S+@\S+\.\S+/.test(value)) return "Email inválido";
    }
    if (field === "region" && !value) return "Selecciona una región";
    return "";
  }

  const setField = (field: keyof ProfileForm, val: string) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validate(field, val) }));
  };

  const blur = (field: keyof ProfileForm) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field, form[field]) }));
  };

  const handleSave = () => {
    const fields = Object.keys(form) as (keyof ProfileForm)[];
    const newErrors: Partial<ProfileForm> = {};
    const newTouched: Partial<Record<keyof ProfileForm, boolean>> = {};
    fields.forEach((f) => { newErrors[f] = validate(f, form[f]); newTouched[f] = true; });
    setErrors(newErrors);
    setTouched(newTouched);
    if (Object.values(newErrors).some(Boolean)) return;
    dispatch({ type: "LOGIN", payload: { ...user, ...form } });
    setEditing(false);
    showToast("Perfil actualizado correctamente");
  };

  const handleCancel = () => {
    setForm({ nombre: user.nombre, apellido: user.apellido, dni: user.dni, telefono: user.telefono, email: user.email, region: user.region });
    setErrors({});
    setTouched({});
    setEditing(false);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const tipoBadge: Record<string, string> = { egresado: "Egresado", traslado: "Traslado", padre: "Padre/Madre" };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50 to-blue-50/20 py-8 px-4">
      {/* Toast */}
      {toast && (
        <motion.div
          className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-3 rounded-xl shadow-lg shadow-emerald-500/25 text-sm font-medium"
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Check className="w-4 h-4" /> {toast}
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-2xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Mi perfil
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* ── Left column ──────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Avatar & user info */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6 text-center">
              <motion.div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 bg-gradient-to-br from-[#0059FF] via-[#0047CC] to-[#001F6B] shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.08 }}
              >
                {initials}
              </motion.div>
              <h2 className="text-lg font-bold text-gray-800">{user.nombre} {user.apellido}</h2>
              <p className="text-sm text-gray-500 mb-3">{user.email}</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#0059FF] to-[#0047CC]">
                {tipoBadge[user.tipo] ?? user.tipo}
              </span>
              {user.iaPremium && (
                <div className="mt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700">
                    IA Premium
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" /> {user.region}
              </p>
            </motion.div>

            {/* Activity stats */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Actividad</h3>
              <div className="space-y-3">
                {[
                  { icon: <Heart className="w-4 h-4 text-red-400" />, label: "Favoritos", value: state.favorites.length },
                  { icon: <Eye className="w-4 h-4 text-blue-400" />, label: "Universidades vistas", value: state.viewedUnis.length },
                  { icon: <BookOpen className="w-4 h-4 text-emerald-400" />, label: "Tests completados", value: state.testResults.length },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-gray-600">{stat.icon} {stat.label}</span>
                    <span className="text-sm font-bold text-gray-800">{stat.value}</span>
                  </div>
                ))}
              </div>

              {state.testResults.length === 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progreso del test</span>
                    <span className="text-xs font-semibold text-gray-700">
                      {Object.keys(state.currentTestAnswers).length}/20
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#0059FF] to-[#0047CC]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(Object.keys(state.currentTestAnswers).length / 20) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right column ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal info form */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0059FF] to-[#0047CC] flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  Información personal
                </h3>
                {editing ? (
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleCancel}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <X className="w-3.5 h-3.5" /> Cancelar
                    </motion.button>
                    <motion.button
                      onClick={handleSave}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#0059FF] to-[#0047CC] shadow-sm"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Save className="w-3.5 h-3.5" /> Guardar
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-[#0059FF] hover:text-[#0059FF] transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Editar
                  </motion.button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Nombre" name="edit-nombre" placeholder="Tu nombre" value={form.nombre} onChange={(v) => setField("nombre", v)} onBlur={() => blur("nombre")} error={errors.nombre} touched={touched.nombre} icon={User} />
                    <FormField label="Apellido" name="edit-apellido" placeholder="Tu apellido" value={form.apellido} onChange={(v) => setField("apellido", v)} onBlur={() => blur("apellido")} error={errors.apellido} touched={touched.apellido} icon={User} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="DNI" name="edit-dni" placeholder="12345678" value={form.dni} onChange={(v) => setField("dni", v.replace(/\D/g, "").slice(0, 8))} onBlur={() => blur("dni")} error={errors.dni} touched={touched.dni} icon={CreditCard} />
                    <FormField label="Teléfono" name="edit-telefono" placeholder="987654321" value={form.telefono} onChange={(v) => setField("telefono", v.replace(/\D/g, "").slice(0, 9))} onBlur={() => blur("telefono")} error={errors.telefono} touched={touched.telefono} icon={Phone} />
                  </div>
                  <FormField label="Correo electrónico" name="edit-email" type="email" placeholder="tucorreo@email.com" value={form.email} onChange={(v) => setField("email", v)} onBlur={() => blur("email")} error={errors.email} touched={touched.email} icon={Mail} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Región</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        value={form.region}
                        onChange={(e) => setField("region", e.target.value)}
                        onBlur={() => blur("region")}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white appearance-none"
                      >
                        <option value="">Selecciona tu región</option>
                        {PERU_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: User, label: "Nombre", value: user.nombre },
                    { icon: User, label: "Apellido", value: user.apellido },
                    { icon: CreditCard, label: "DNI", value: user.dni },
                    { icon: Phone, label: "Teléfono", value: user.telefono },
                    { icon: Mail, label: "Email", value: user.email },
                    { icon: MapPin, label: "Región", value: user.region },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl">
                      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-sm font-medium text-gray-800 truncate">{value || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Mis postulaciones */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0059FF] to-[#0047CC] flex items-center justify-center">
                  <ClipboardCheck className="w-3.5 h-3.5 text-white" />
                </div>
                Mis postulaciones
              </h3>
              {state.postulaciones.length === 0 ? (
                <p className="text-sm text-gray-400">
                  Aún no has reservado ninguna vacante. Explora universidades y postula desde su ficha.
                </p>
              ) : (
                <div className="space-y-3">
                  {state.postulaciones.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.uniName}</p>
                        <p className="text-xs text-gray-400 truncate">{p.carrera}</p>
                      </div>
                      <span className={[
                        "text-xs font-semibold px-2.5 py-1 rounded-full shrink-0",
                        p.estado === "reservado" ? "bg-amber-100 text-amber-700" :
                        p.estado === "en_revision" ? "bg-blue-100 text-blue-700" :
                        "bg-emerald-100 text-emerald-700",
                      ].join(" ")}>
                        {p.estado === "reservado" ? "Reservado" : p.estado === "en_revision" ? "En revisión" : "Confirmado"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Notification preferences */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0059FF] to-[#0047CC] flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-white" />
                </div>
                Preferencias de notificaciones
              </h3>
              <div className="space-y-4">
                {([
                  { key: "nuevasUnis", label: "Nuevas universidades", desc: "Cuando se agreguen nuevas instituciones" },
                  { key: "costos", label: "Actualización de costos", desc: "Cambios en pensiones y aranceles" },
                  { key: "testRecordatorio", label: "Recordatorios del test", desc: "Para completar tu test vocacional" },
                  { key: "noticias", label: "Noticias educativas", desc: "Información relevante del sector" },
                ] as { key: keyof NotifPrefs; label: string; desc: string }[]).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !p[key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                        notifPrefs[key] ? "bg-gradient-to-r from-[#0059FF] to-[#0047CC]" : "bg-gray-200"
                      }`}
                    >
                      <motion.span
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ left: notifPrefs[key] ? "24px" : "4px" }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Danger zone */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm border border-red-100/80 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-4">Sesión</h3>
              <motion.button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" /> Cerrar sesión
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
