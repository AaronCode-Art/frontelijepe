import type { CommunityPost } from "../types";

export const communityChannels = [
  { id: "traslados", label: "Traslados", icon: "🔄", color: "#7C3AED" },
  { id: "becas", label: "Becas", icon: "🎓", color: "#16A34A" },
  { id: "ingenieria", label: "Ingeniería y Tech", icon: "⚙️", color: "#0059FF" },
  { id: "salud", label: "Salud y Medicina", icon: "🏥", color: "#EF4444" },
  { id: "negocios", label: "Negocios", icon: "💼", color: "#D97706" },
  { id: "padres", label: "Padres de Familia", icon: "👨‍👩‍👧", color: "#16A34A" },
  { id: "reportes", label: "Reportes de Datos", icon: "🚩", color: "#DC2626" },
  { id: "general", label: "General", icon: "💬", color: "#6B7280" },
];

export const initialPosts: CommunityPost[] = [
  // ─── Traslados ───────────────────────────────────────────────────────────────
  {
    id: "post-001",
    channel: "traslados",
    author: "Valentina Quispe",
    avatar: "VQ",
    title: "Me trasladé de la UCV a la PUCP — les cuento mi experiencia completa",
    content:
      "Hola a todos. Estuve 2 años en la UCV Trujillo estudiando Derecho. Decidí trasladarme a la PUCP porque conseguí una beca parcial y sentí que necesitaba un entorno más exigente. El proceso tardó casi 4 meses. Convalidaron 14 de mis 22 cursos aprobados. Los sílabos son clave: tienen que estar firmados por el secretario académico y con el sello de la facultad original, no solo impresiones del campus virtual. Si tienen preguntas sobre el proceso, con gusto respondo.",
    time: "hace 2 días",
    likes: 47,
    comments: 23,
    tags: ["UCV", "PUCP", "traslado externo", "Derecho", "convalidación"],
  },
  {
    id: "post-002",
    channel: "traslados",
    author: "Rodrigo Mamani",
    avatar: "RM",
    title: "¿Alguien se ha trasladado de una universidad que perdió licencia SUNEDU? Necesito consejos",
    content:
      "Estuve 3 ciclos en la Universidad Alas Peruanas antes de que les denegaran el licenciamiento. Ahora quiero trasladarme a la UNT (Trujillo) o a la UPAO. El problema es que no sé cuántos cursos me van a reconocer porque la UAP ya no es válida oficialmente. ¿Alguien pasó por algo similar? ¿Las universidades públicas son más flexibles en estos casos o más estrictas?",
    time: "hace 5 horas",
    likes: 31,
    comments: 18,
    tags: ["Alas Peruanas", "licencia denegada", "traslado urgente", "UNT", "UPAO"],
  },
  {
    id: "post-003",
    channel: "traslados",
    author: "Milagros Flores",
    avatar: "MF",
    title: "Guía rápida: documentos para traslado externo (actualizado 2026)",
    content:
      "Después de investigar mucho y hablar con admisión de 4 universidades distintas, armé esta lista. Para el 95% de universidades peruanas necesitas: (1) Certificado de estudios universitarios con sello fedateado — NO sirve el PDF del campus virtual, tiene que ser el original en papel. (2) Sílabo de cada curso, firmado y sellado por el secretario académico. (3) Constancia de no haber sido sancionado disciplinariamente. (4) DNI vigente. (5) Recibo de pago del proceso (va de S/150 a S/300). Espero les ayude.",
    time: "hace 1 semana",
    likes: 89,
    comments: 41,
    tags: ["guía", "documentos", "traslado", "2026", "tips"],
  },
  {
    id: "post-004",
    channel: "traslados",
    author: "César Huanca",
    avatar: "CH",
    title: "La UTP me convalidó solo 8 de 30 cursos al venir de la UANCV — mucho ojo con esto",
    content:
      "Venía de la UANCV (Puno) con 4 años de Ing. Civil. Al trasladarme a la UTP Lima pensé que me iban a convalidar bastante porque los nombres de los cursos eran casi iguales. Error. Me convalidaron solo los cursos básicos (Matemáticas I y II, Física I, Química). Todo lo de especialidad lo rechazaron porque los contenidos en el sílabo eran diferentes. Acabé empezando casi desde el 3er ciclo. Evalúen bien antes de trasladarse.",
    time: "hace 3 días",
    likes: 56,
    comments: 29,
    tags: ["UTP", "UANCV", "Ingeniería Civil", "convalidación", "advertencia"],
  },

  // ─── Becas ───────────────────────────────────────────────────────────────────
  {
    id: "post-005",
    channel: "becas",
    author: "Angie Chávez",
    avatar: "AC",
    title: "Pasé por el proceso de Beca 18 en 2025 — resuelvo todas sus dudas",
    content:
      "Logré la Beca 18 el año pasado y ahora estoy en el primer ciclo de Enfermería en la UPCH. El proceso es largo pero vale totalmente la pena. Los puntos que más pesan en la selección son: el SISFOH (fundamental estar en quintil 1 o 2), el promedio de secundaria (mínimo 14.00 pero en la práctica los seleccionados suelen tener 15+) y la entrevista personal. Prepárense para la entrevista: les preguntan por qué eligieron esa carrera y cómo van a retribuir a su comunidad.",
    time: "hace 4 días",
    likes: 124,
    comments: 67,
    tags: ["Beca 18", "Pronabec", "Enfermería", "UPCH", "experiencia real"],
  },
  {
    id: "post-006",
    channel: "becas",
    author: "Tomás Vega",
    avatar: "TV",
    title: "Beca Permanencia me salvó de abandonar la universidad — mi historia",
    content:
      "En el 4to ciclo de Ingeniería Industrial en la UNSA tuve una crisis económica fuerte: mi papá se accidentó y no podíamos pagar la pensión. Postulé a Beca Permanencia de Pronabec y me la dieron. Cubre S/930 mensuales para gastos de subsistencia más el pago de la pensión. El requisito es tener riesgo de abandono documentado y mantener un promedio mínimo de 12. Si alguien está en situación difícil, no abandones antes de preguntar por esta beca.",
    time: "hace 1 semana",
    likes: 98,
    comments: 44,
    tags: ["Beca Permanencia", "Pronabec", "UNSA", "Ingeniería Industrial", "crisis económica"],
  },
  {
    id: "post-007",
    channel: "becas",
    author: "Luciana Pizarro",
    avatar: "LP",
    title: "¿Convocatoria Beca 18 2026-II ya está abierta? Nadie da información clara",
    content:
      "Llevo semanas buscando en la web de Pronabec y no encuentro fecha exacta para la convocatoria del ciclo 2026-II. Algunos grupos de Facebook dicen que es en mayo, otros en julio. ¿Alguien tiene información confirmada? Sería buenísimo que ElijePe pudiera mostrar las fechas de convocatoria de Pronabec directamente en la plataforma para evitar esta confusión.",
    time: "hace 6 horas",
    likes: 22,
    comments: 31,
    tags: ["Beca 18", "convocatoria 2026", "fecha", "Pronabec"],
  },

  // ─── Ingeniería y Tech ────────────────────────────────────────────────────────
  {
    id: "post-008",
    channel: "ingenieria",
    author: "Bruno Salazar",
    avatar: "BS",
    title: "Comparativa real: UTEC vs UPC para Ingeniería de Software en 2026",
    content:
      "Estudié el primer año en UPC y me trasladé a UTEC. Les doy mi perspectiva honesta. UTEC: mayor enfoque en investigación y metodología científica, menor número de alumnos por clase (máx 30), laboratorios más modernos, ambiente más 'startup', pensión más cara (S/3,200 aprox). UPC: más infraestructura, más convenios con empresas para prácticas, más alumnos pero eso también significa mayor red de contactos, pensión un poco menor. Para quien quiere investigar: UTEC. Para quien quiere insertarse rápido al mercado: UPC.",
    time: "hace 2 días",
    likes: 143,
    comments: 78,
    tags: ["UTEC", "UPC", "Ingeniería Software", "comparativa", "opinión real"],
    relatedPage: "comparador",
  },
  {
    id: "post-009",
    channel: "ingenieria",
    author: "Alejandra Ruiz",
    avatar: "AR",
    title: "¿Sirven las certificaciones de AWS o Google para conseguir trabajo sin título?",
    content:
      "Estoy en 3er ciclo de Sistemas en la UNI y me pregunto si vale la pena sacar la certificación AWS Solutions Architect o Google Cloud mientras estudio. ¿Alguien con experiencia de reclutamiento puede opinar? Tengo un amigo que dice que con las certs consiguió trabajo sin terminar la carrera, pero otros dicen que sin el título te cierran muchas puertas en empresas formales.",
    time: "hace 12 horas",
    likes: 67,
    comments: 52,
    tags: ["AWS", "Google Cloud", "certificaciones", "trabajo sin título", "UNI", "Sistemas"],
  },
  {
    id: "post-010",
    channel: "ingenieria",
    author: "Erick Condori",
    avatar: "EC",
    title: "UNI vs PUCP para Ingeniería Civil — diferencias que nadie te dice",
    content:
      "Egresé de UNI hace 3 años y varios amigos estudiaron en PUCP. Las diferencias reales: UNI tiene un enfoque más técnico-matemático puro, exige más en teoría estructural. PUCP es más integral y conecta más la ingeniería con la gestión de proyectos y el lado empresarial. Ambos títulos son muy respetados en el mercado. La diferencia está en que UNI te da más base técnica para especializarte en estructuras, mientras que PUCP te prepara mejor para gestionar obras y liderar equipos.",
    time: "hace 5 días",
    likes: 88,
    comments: 35,
    tags: ["UNI", "PUCP", "Ingeniería Civil", "diferencia", "egresado"],
  },

  // ─── Salud y Medicina ─────────────────────────────────────────────────────────
  {
    id: "post-011",
    channel: "salud",
    author: "Daniela Torres",
    avatar: "DT",
    title: "Todo lo que nadie te dice antes de estudiar Medicina en Perú",
    content:
      "Estoy en el 8vo año de Medicina en la UNMSM (sí, son 7 años + internado). Antes de postular deben saber: (1) La carga es brutal, sobre todo del 3er al 5to año. (2) El internado es en hospitales del MINSA/EsSalud con horarios extenuantes y solo una propina de S/930/mes. (3) La especialización (residencia) es otro proceso de selección dificilísimo (CONAREME). (4) El retorno económico es real pero llega tarde: los primeros buenos sueldos vienen después de la especialización, a los 32-35 años. Si lo aman, vale cada segundo.",
    time: "hace 3 días",
    likes: 201,
    comments: 93,
    tags: ["Medicina", "UNMSM", "internado", "residencia", "realidad carrera"],
  },
  {
    id: "post-012",
    channel: "salud",
    author: "Gonzalo Palomino",
    avatar: "GP",
    title: "¿Enfermería en universidad o en instituto técnico? Comparativa honesta",
    content:
      "Llevo 6 meses investigando esto para mi hermana menor. Resumen: la Lic. en Enfermería universitaria (5 años) da acceso a cargos de jefatura, mayor sueldo tope (S/4,500-6,000 en el sector público), puede hacer especialización y docencia. El Técnico en Enfermería (3 años en IEST) da acceso a trabajo más rápido, sueldo inicial similar (S/1,800-2,500) pero con techo más bajo y sin acceso a cargos de gestión. Si tiene posibilidad económica, que haga la carrera universitaria.",
    time: "hace 1 semana",
    likes: 76,
    comments: 48,
    tags: ["Enfermería", "técnica vs universitaria", "instituto", "salud", "comparativa"],
  },

  // ─── Negocios ─────────────────────────────────────────────────────────────────
  {
    id: "post-013",
    channel: "negocios",
    author: "Adriana Cáceres",
    avatar: "AC",
    title: "Estudié en la U de Lima y en Esan — diferencias reales en el mundo laboral",
    content:
      "Tengo 28 años, estudié Administración en la Universidad de Lima (pregrado) y luego hice la maestría en ESAN. Desde mi experiencia: la U de Lima abre muchas puertas en empresas privadas de mediano y gran tamaño gracias al networking estudiantil. ESAN es el MBA más reconocido del Perú para mandos medios y gerenciales. La combinación es poderosa: con ambos, en mi sector (banca) pasé de analista a subgerente en 5 años. El costo total fue considerable pero el ROI fue claro.",
    time: "hace 4 días",
    likes: 112,
    comments: 57,
    tags: ["U de Lima", "ESAN", "Administración", "MBA", "carrera profesional"],
  },
  {
    id: "post-014",
    channel: "negocios",
    author: "Pablo Herrera",
    avatar: "PH",
    title: "¿Vale la pena Contabilidad en 2026 con tanta automatización llegando?",
    content:
      "Pregunta seria para los contadores que lean esto: mi mamá quiere que estudie Contabilidad porque 'siempre hay trabajo', pero yo me preocupa la automatización (IA contable, ERPs que hacen todo automático). Los contadores que conozco dicen que la contabilidad básica sí se va a automatizar pero la parte de interpretación, auditoría, planeamiento tributario y control interno sigue siendo de humanos. ¿Qué piensan? ¿Debería optar por Finanzas Corporativas en vez?",
    time: "hace 8 horas",
    likes: 44,
    comments: 61,
    tags: ["Contabilidad", "automatización", "IA", "Finanzas", "futuro carrera"],
  },

  // ─── Padres de Familia ────────────────────────────────────────────────────────
  {
    id: "post-015",
    channel: "padres",
    author: "Jorge Mendoza (Padre)",
    avatar: "JM",
    title: "Tengo presupuesto de S/800/mes — ¿qué universidades son realistas para mi hijo en Lima?",
    content:
      "Mi hijo quiere estudiar Ingeniería Industrial en Lima. Tengo S/800 mensuales para invertir en su educación (incluyendo transporte y materiales). Sé que las grandes universidades privadas están fuera de mi alcance. He mirado UTP, Telesup y la UNMSM. UNMSM sería lo ideal económicamente pero el nivel de competencia en el examen de admisión es muy alto. ¿Algún padre con experiencia similar que pueda orientarme?",
    time: "hace 2 días",
    likes: 38,
    comments: 42,
    tags: ["presupuesto", "Ingeniería Industrial", "Lima", "S/800", "UTP", "UNMSM", "padre"],
  },
  {
    id: "post-016",
    channel: "padres",
    author: "Rosa Mamani (Madre)",
    avatar: "RM",
    title: "Mi hija quiere estudiar Arte y me preocupa el empleo — ¿exagero?",
    content:
      "Mi hija de 17 años quiere estudiar Arte o Diseño Gráfico. Yo siempre soñé con que estudie algo más 'seguro' como Contabilidad o Administración. Pero veo que ella es muy talentosa y apasionada. ¿Algún padre o egresado de Diseño que pueda darme una perspectiva real sobre las posibilidades laborales? No quiero que sacrifique su pasión por el miedo mío, pero tampoco quiero que pase necesidades.",
    time: "hace 6 días",
    likes: 67,
    comments: 53,
    tags: ["Arte", "Diseño Gráfico", "preocupación padres", "empleo", "pasión"],
  },
  {
    id: "post-017",
    channel: "padres",
    author: "Manuel Quispe (Padre)",
    avatar: "MQ",
    title: "Comparé el costo total de 5 universidades para mi hijo — aquí los números",
    content:
      "Me pasé 2 semanas llamando a universidades y usando el simulador de ElijePe. Para la carrera de Administración en Lima, costo estimado 5 años (pensión + matrícula + materiales): PUCP: S/168,000. UPC: S/145,000. U. de Lima: S/120,000. UTP: S/58,000. UNMSM: S/12,500 (sin pensión, solo gastos). Mi hijo ingresó a la UNMSM en enero. El dinero que ahorramos lo vamos a usar para financiarle un idioma, certificaciones y prácticas pagas. A veces la pública bien aprovechada supera a la privada cara.",
    time: "hace 3 días",
    likes: 189,
    comments: 84,
    tags: ["comparativa costos", "5 años", "PUCP", "UPC", "UNMSM", "padre", "decisión"],
  },

  // ─── General ──────────────────────────────────────────────────────────────────
  {
    id: "post-018",
    channel: "general",
    author: "Sofía Paredes",
    avatar: "SP",
    title: "¿Alguien más siente que eligió la carrera equivocada en 1er año?",
    content:
      "Entré a Derecho en la U. de Lima porque era lo que mis papás querían. Estoy en el 2do ciclo y no me apasiona nada. Veo a mis amigos en Ingeniería o Diseño y los envidio la pasión que le ponen. ¿Es normal sentir esto en el primer año? ¿Cuántos cambiaron de carrera y no se arrepintieron? Necesito escuchar historias reales, no solo el 'sigue, es normal' de mis papás.",
    time: "hace 1 día",
    likes: 95,
    comments: 76,
    tags: ["cambio de carrera", "primer año", "indecisión", "equivocado", "Derecho"],
  },
  {
    id: "post-019",
    channel: "general",
    author: "Nicolás Ramírez",
    avatar: "NR",
    title: "Tip que me hubiera gustado saber antes de entrar a la universidad",
    content:
      "Estoy en mi último año y mirando hacia atrás, el consejo más valioso que daría: empieza las prácticas preprofesionales en el 4to ciclo, no en el 7mo como hice yo. La mayoría de mis compañeros que están mejor posicionados laboralmente son los que acumularon 2-3 empresas en su CV antes de graduarse. La universidad te da el conocimiento, pero las prácticas te dan el criterio y la red de contactos. No esperen a 'estar listos'.",
    time: "hace 1 semana",
    likes: 234,
    comments: 89,
    tags: ["consejo", "prácticas", "experiencia", "tip", "prácticas tempranas"],
  },
  {
    id: "post-020",
    channel: "general",
    author: "Karla Espinoza",
    avatar: "KE",
    title: "Estudiar en Cusco vs Lima — perspectiva de una estudiante de provincias",
    content:
      "Soy de Urubamba y tuve que elegir entre la UNSAAC en Cusco o venir a Lima a la UTP. Elegí Lima porque pensé que era mejor para conseguir trabajo. Un año después te digo: Lima fue la decisión correcta para Administración de Empresas por las prácticas y los contactos empresariales. Pero para Turismo y Hotelería, la UNSAAC hubiera sido la decisión obvia. Cada carrera tiene su 'mejor geografía'. Usen ElijePe para ver la empleabilidad por región.",
    time: "hace 4 días",
    likes: 71,
    comments: 38,
    tags: ["Cusco", "Lima", "provincias", "UNSAAC", "UTP", "decisión geográfica"],
  },
  {
    id: "post-021",
    channel: "general",
    author: "David Fuentes",
    avatar: "DF",
    title: "Inglés en la universidad: ¿estudiarlo solo o pagar academia?",
    content:
      "Tengo B1 de inglés y en mi carrera (Administración, USIL) me exigen llegar a B2 para graduarme. Estoy pensando en si tomar los cursos de inglés que da la propia USIL (que son parte del plan de estudios y están incluidos en la pensión) o pagar una academia externa como Británico o Icpna. ¿Alguien con experiencia en los centros de idiomas universitarios puede opinar? ¿Son tan buenos como los institutos especializados?",
    time: "hace 3 días",
    likes: 49,
    comments: 44,
    tags: ["inglés", "B2", "USIL", "Británico", "ICPNA", "idiomas universidad"],
  },

  // ─── Reportes de Datos ────────────────────────────────────────────────────────
  {
    id: "post-022",
    channel: "reportes",
    author: "Isabel Coronado",
    avatar: "IC",
    title: "REPORTE: La pensión de Administración en la USIL aparece desactualizada",
    content:
      "Hola equipo ElijePe. Quiero reportar que la pensión de la carrera de Administración en la USIL que muestra la plataforma es de S/1,100, pero según la página oficial de USIL actualizada en enero 2026, la pensión actual es de S/1,350 (escala 4). El aumento se aplicó desde el ciclo 2026-I. Por favor actualizar para que los estudiantes tengan información correcta al usar el simulador.",
    time: "hace 2 días",
    likes: 15,
    comments: 8,
    tags: ["USIL", "pensión", "precio desactualizado", "Administración"],
    isReport: true,
  },
  {
    id: "post-023",
    channel: "reportes",
    author: "Héctor Villanueva",
    avatar: "HV",
    title: "REPORTE: La UTP aparece como 'sin acreditación' pero Ingeniería Industrial ya está acreditada",
    content:
      "Revisé la ficha de UTP en ElijePe y aparece sin acreditación SINEACE para Ingeniería Industrial. Sin embargo, según el portal de SINEACE, la carrera obtuvo su acreditación en octubre de 2025 (resolución N° 123-2025-SINEACE/CDAH-P). Adjunto el link al portal oficial. Sería importante actualizarlo porque este dato influye en la decisión de muchos postulantes.",
    time: "hace 5 días",
    likes: 28,
    comments: 12,
    tags: ["UTP", "acreditación", "SINEACE", "Ingeniería Industrial", "dato incorrecto"],
    isReport: true,
  },
  {
    id: "post-024",
    channel: "reportes",
    author: "Pilar Arce",
    avatar: "PA",
    title: "REPORTE: Fecha de examen de admisión de la UNSA 2026-II está incorrecta",
    content:
      "La plataforma muestra el examen de admisión de la UNSA para el ciclo 2026-II el 15 de julio, pero según la Oficina Central de Admisión de la UNSA (confirmar en unsa.edu.pe), la nueva fecha es el 22 de julio de 2026 por reprogramación interna. Esto es crítico porque un estudiante podría perderse el examen con la fecha incorrecta. Por favor verificar con urgencia.",
    time: "hace 1 día",
    likes: 44,
    comments: 19,
    tags: ["UNSA", "fecha admisión", "error crítico", "2026-II", "Arequipa"],
    isReport: true,
  },
];
