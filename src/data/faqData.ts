export interface FAQEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  relatedPage?: string; // "test" | "simulador" | "explorar" | "comparador" | "ia"
}

export const faqCategories = [
  "Admisión y Postulación",
  "Costos y Becas",
  "Traslados y Convalidaciones",
  "SUNEDU y Licenciamiento",
  "Modalidades y Carreras",
  "Plataforma ElijePe",
  "Test Vocacional",
  "Vida Universitaria",
  "Empleabilidad y Mercado Laboral",
  "Padres de Familia",
];

export const faqData: FAQEntry[] = [
  // ─── Admisión y Postulación (12 entries) ────────────────────────────────────
  {
    id: "adm-001",
    category: "Admisión y Postulación",
    question: "¿Cuáles son los procesos de admisión que existen en las universidades peruanas en 2026?",
    answer:
      "Las universidades peruanas ofrecen distintas modalidades: examen de admisión ordinario (presencial o virtual), admisión por rendimiento escolar (primeros puestos de secundaria), admisión por traslado externo, admisión para deportistas calificados y admisión especial para personas con discapacidad. Cada universidad fija sus propias fechas y requisitos. En 2026 muchas universidades han expandido sus convocatorias a dos o tres veces por año.",
    keywords: ["admisión", "postulación", "examen", "ingreso", "proceso", "modalidad"],
    relatedPage: "explorar",
  },
  {
    id: "adm-002",
    category: "Admisión y Postulación",
    question: "¿Cuándo son los plazos de postulación para universidades en 2026?",
    answer:
      "Los plazos varían por universidad. En general, el ciclo 2026-I tiene postulaciones entre noviembre 2025 y enero 2026, y el ciclo 2026-II entre mayo y julio 2026. Algunas universidades como la UPC y USIL tienen admisión continua durante todo el año. Te recomendamos ingresar a la página oficial de cada universidad o usar el comparador de ElijePe para ver las fechas actualizadas.",
    keywords: ["plazo", "fecha", "postulación", "2026", "ciclo", "convocatoria", "calendario"],
    relatedPage: "explorar",
  },
  {
    id: "adm-003",
    category: "Admisión y Postulación",
    question: "¿Qué documentos necesito para postular a una universidad?",
    answer:
      "Los documentos más comunes son: DNI vigente, certificado de estudios secundarios (original o fedateado), partida de nacimiento, foto tamaño carnet, recibo de pago de inscripción y, en algunos casos, carta de presentación del colegio. Para modalidades especiales (traslado, deportistas, etc.) se solicitan documentos adicionales. Verifica los requisitos específicos en la página de admisión de la universidad elegida.",
    keywords: ["documentos", "requisitos", "postular", "DNI", "certificado", "inscripción"],
    relatedPage: "explorar",
  },
  {
    id: "adm-004",
    category: "Admisión y Postulación",
    question: "¿Puedo postular a más de una universidad al mismo tiempo?",
    answer:
      "Sí, puedes postular a tantas universidades como desees de forma simultánea, siempre que los exámenes no coincidan en horario. No existe restricción legal al respecto. Sin embargo, considera que cada proceso tiene un costo de inscripción y dedicar tiempo de preparación a varios exámenes puede dispersar tu estudio. ElijePe te recomienda enfocarte en dos o tres opciones que realmente se ajusten a tu perfil.",
    keywords: ["postular varias", "dos universidades", "simultáneo", "varias universidades"],
    relatedPage: "comparador",
  },
  {
    id: "adm-005",
    category: "Admisión y Postulación",
    question: "¿Qué es la admisión por rendimiento escolar y cómo accedo a ella?",
    answer:
      "Es una modalidad que permite ingresar sin examen a los primeros puestos de secundaria (generalmente el primero o los cinco primeros puestos de la promoción). Debes acreditar tu puesto con una constancia de la UGEL o de tu colegio. Universidades como la UNMSM, PUCP y muchas regionales ofrecen esta modalidad. Los cupos son limitados y conviene solicitarla antes de que concluya el año escolar.",
    keywords: ["rendimiento escolar", "primer puesto", "sin examen", "primeros puestos", "UGEL"],
    relatedPage: "explorar",
  },
  {
    id: "adm-006",
    category: "Admisión y Postulación",
    question: "¿Cuántos créditos tiene normalmente una carrera universitaria en Perú?",
    answer:
      "Según la Ley Universitaria 30220, las carreras de pregrado deben tener un mínimo de 200 créditos académicos. En la práctica, la mayoría oscila entre 200 y 240 créditos. Carreras como Medicina tienen más (alrededor de 280-300 créditos más internado). Ingeniería suele estar entre 220 y 240 créditos, mientras que Administración y carreras de Ciencias Sociales rondan los 200-210.",
    keywords: ["créditos", "carrera", "cuántos créditos", "duración", "plan de estudios"],
    relatedPage: "explorar",
  },
  {
    id: "adm-007",
    category: "Admisión y Postulación",
    question: "¿Qué puntaje se necesita para ingresar a la UNMSM o PUCP?",
    answer:
      "En la UNMSM el puntaje mínimo aprobatorio es 825 puntos sobre 1200, pero el puntaje real de ingreso varía por carrera y año. Carreras muy competidas como Medicina pueden requerir más de 1100 puntos. En la PUCP el proceso es diferente: se evalúan aptitudes y el puntaje de corte varía por facultad. Para 2026, consulta los resultados de admisión en sus portales oficiales o usa el simulador de ElijePe.",
    keywords: ["puntaje", "UNMSM", "PUCP", "puntaje de corte", "ingreso", "nota"],
    relatedPage: "simulador",
  },
  {
    id: "adm-008",
    category: "Admisión y Postulación",
    question: "¿Qué diferencia hay entre una universidad pública y privada en el proceso de admisión?",
    answer:
      "Las universidades públicas suelen tener un único examen escrito centralizado con alta competencia y cupos limitados. Las privadas ofrecen mayor variedad de modalidades (examen, entrevista, rendimiento escolar, admisión continua) y, en general, más flexibilidad en los plazos. Las privadas también pueden tener procesos de admisión más frecuentes y resultados más rápidos.",
    keywords: ["pública", "privada", "diferencia", "admisión", "examen", "competencia"],
    relatedPage: "comparador",
  },
  {
    id: "adm-009",
    category: "Admisión y Postulación",
    question: "¿Cómo funciona la admisión especial para deportistas calificados?",
    answer:
      "Los deportistas con calificación del Instituto Peruano del Deporte (IPD) pueden postular por esta modalidad en la mayoría de universidades. Necesitas presentar tu acreditación vigente como deportista calificado (nivel nacional o internacional). Los cupos son muy reducidos (1-3 por carrera) y en algunos casos debes superar una nota mínima en el examen regular o una entrevista.",
    keywords: ["deportista", "calificado", "IPD", "cupo especial", "admisión deportiva"],
  },
  {
    id: "adm-010",
    category: "Admisión y Postulación",
    question: "¿Puedo ingresar a la universidad si terminé el colegio hace varios años?",
    answer:
      "Sí, no existe límite de edad ni de años desde que terminaste el colegio para postular a una universidad. Solo necesitas acreditar haber concluido la educación secundaria. Muchas universidades valoran la experiencia laboral previa en sus procesos de entrevista. Algunas ofrecen programas especialmente diseñados para adultos trabajadores.",
    keywords: ["años después", "adultos", "volver a estudiar", "sin límite de edad", "egresado antiguo"],
    relatedPage: "explorar",
  },
  {
    id: "adm-011",
    category: "Admisión y Postulación",
    question: "¿Qué es el examen de admisión preuniversitario y cómo me preparo?",
    answer:
      "Es el examen que toman las academias preuniversitarias para simular las condiciones del examen real de admisión. Evalúa razonamiento matemático, razonamiento verbal, aptitud numérica, y en algunos casos conocimientos específicos por área. Para prepararte, se recomienda al menos 6 meses de academia, practicar exámenes anteriores disponibles en los portales de cada universidad y reforzar tus áreas más débiles.",
    keywords: ["preuniversitario", "academia", "preparación", "simulacro", "examen de práctica"],
    relatedPage: "simulador",
  },
  {
    id: "adm-012",
    category: "Admisión y Postulación",
    question: "¿Qué universidades tienen mayor número de postulantes en Perú?",
    answer:
      "Las universidades con mayor demanda en 2026 son: UNMSM (más de 75,000 postulantes por año), UNI, PUCP, UPC, UNSA (Arequipa) y UNAP (Iquitos). La competencia es especialmente alta en carreras de Medicina, Derecho y Administración. En provincias, las universidades nacionales concentran la mayor parte de la demanda local.",
    keywords: ["más postulantes", "competencia", "demanda", "universidades populares", "UNMSM"],
    relatedPage: "explorar",
  },

  // ─── Costos y Becas (11 entries) ─────────────────────────────────────────────
  {
    id: "cos-001",
    category: "Costos y Becas",
    question: "¿Cuánto cuesta estudiar en una universidad privada en Perú en 2026?",
    answer:
      "El costo mensual varía ampliamente. Las universidades privadas de alto costo (PUCP, UP, UPC, UTEC) oscilan entre S/ 1,200 y S/ 3,500 por mes según la carrera. Las de costo medio (UCV, UTP, USIL, Telesup) van de S/ 400 a S/ 1,000. Las de bajo costo pueden arrancar desde S/ 200 al mes. Estas cifras no incluyen materiales, transporte ni alimentación. Usa el simulador de costos de ElijePe para estimar el total a 5 años.",
    keywords: ["costo", "precio", "pensión", "mensualidad", "cuánto cuesta", "privada"],
    relatedPage: "simulador",
  },
  {
    id: "cos-002",
    category: "Costos y Becas",
    question: "¿Qué es la Beca 18 y cómo puedo postular?",
    answer:
      "Beca 18 es el programa estrella de Pronabec que financia estudios universitarios o técnicos completos para jóvenes de bajos recursos con alto rendimiento académico. Cubre matrícula, pensiones, alimentación, alojamiento, útiles y pasajes. Para postular en 2026 debes: ser peruano, tener entre 14 y 22 años (hasta 25 para modalidades especiales), pertenecer al quintil 1 o 2 del SISFOH, haber obtenido un promedio mínimo de 14 en secundaria y no tener estudios superiores previos.",
    keywords: ["Beca 18", "Pronabec", "beca completa", "postular", "requisitos", "financiamiento"],
    relatedPage: "explorar",
  },
  {
    id: "cos-003",
    category: "Costos y Becas",
    question: "¿Qué otras becas ofrece Pronabec además de Beca 18?",
    answer:
      "Pronabec administra varias becas: Beca Permanencia (para universitarios en riesgo de abandono), Beca Continuidad (para quienes interrumpieron estudios), Beca Especial para Personas con Discapacidad, Beca Egreso (para titulación), Beca Presidente de la República (para posgrado en el extranjero) y programas de intercambio como Alianza del Pacífico. Cada beca tiene convocatorias independientes. Visita pronabec.gob.pe para conocer las convocatorias abiertas en 2026.",
    keywords: ["Pronabec", "becas", "permanencia", "continuidad", "discapacidad", "egreso", "Alianza Pacífico"],
    relatedPage: "explorar",
  },
  {
    id: "cos-004",
    category: "Costos y Becas",
    question: "¿Qué son las escalas de pago y cómo funcionan?",
    answer:
      "Las escalas de pago son un sistema de pensiones diferenciadas según la capacidad económica del estudiante. La universidad evalúa los ingresos familiares (declaración de renta, recibos de pago, etc.) y asigna una escala. La escala 1 paga la pensión más baja y la más alta (ej. escala 5 o 6) paga el costo real del servicio. Este sistema existe en la mayoría de universidades privadas peruanas y puede representar un ahorro de 30% a 70% para familias de bajos ingresos.",
    keywords: ["escalas de pago", "pensión diferenciada", "capacidad económica", "escala", "pensión reducida"],
    relatedPage: "simulador",
  },
  {
    id: "cos-005",
    category: "Costos y Becas",
    question: "¿Existen créditos educativos para pagar la universidad?",
    answer:
      "Sí. Las principales opciones son: (1) Crédito Mype Educativo del Banco de la Nación para estudiantes en universidades licenciadas; (2) Préstamos educativos de bancos privados (BCP, BBVA, Interbank) que financian hasta el 100% de la pensión con tasas de 12-20% anual; (3) Financiamiento propio de las universidades (muchas ofrecen crédito directo sin banco); (4) Pronabec Crédito-Beca para universidades privadas seleccionadas.",
    keywords: ["crédito educativo", "préstamo", "financiamiento", "banco", "pagar universidad", "cuotas"],
    relatedPage: "simulador",
  },
  {
    id: "cos-006",
    category: "Costos y Becas",
    question: "¿Cuánto cuesta estudiar en una universidad pública?",
    answer:
      "Las universidades públicas tienen aranceles muy bajos o gratuitos para el pregrado. La matrícula semestral puede ir de S/ 50 a S/ 200. Sin embargo, hay costos indirectos importantes: materiales de laboratorio, uniforme, transporte y, en algunas carreras, equipos específicos. La gratuidad real depende de la situación socioeconómica del estudiante (el 30% de bajos recursos estudia completamente gratis). El gran costo en universidades públicas es el tiempo de preparación preuniversitaria.",
    keywords: ["universidad pública", "gratuita", "costo bajo", "matrícula", "arancel", "pública gratis"],
    relatedPage: "explorar",
  },
  {
    id: "cos-007",
    category: "Costos y Becas",
    question: "¿Las universidades dan becas propias? ¿Cómo accedo a ellas?",
    answer:
      "La mayoría de universidades privadas tienen programas propios de becas parciales o totales: becas por rendimiento académico (mantener promedio mayor a 15 o 16), becas para hermanos de estudiantes actuales, becas deportivas, becas artísticas y becas socioeconómicas. Para acceder debes solicitarlas en el área de Bienestar Universitario al inicio de cada semestre, presentar documentación que acredite el mérito o la necesidad económica.",
    keywords: ["beca propia", "beca universidad", "rendimiento", "bienestar", "beca parcial", "descuento"],
    relatedPage: "explorar",
  },
  {
    id: "cos-008",
    category: "Costos y Becas",
    question: "¿Qué es el seguro médico estudiantil y cuánto cuesta?",
    answer:
      "El seguro médico universitario (SIS Universitario) cubre atención en hospitales del MINSA y está disponible para estudiantes a tiempo completo. Muchas universidades lo incluyen en la matrícula sin costo adicional. El Seguro Integral de Salud (SIS) es gratuito si perteneces al quintil 1 o 2. Las universidades privadas de mayor costo suelen incluir un seguro privado adicional con cobertura ampliada. Consulta con tu universidad si ya tienes cobertura incluida.",
    keywords: ["seguro médico", "SIS", "salud estudiante", "cobertura", "seguro universitario"],
  },
  {
    id: "cos-009",
    category: "Costos y Becas",
    question: "¿Beca 18 cubre también las universidades privadas?",
    answer:
      "Sí, Beca 18 cubre tanto universidades públicas como privadas, pero solo en aquellas que hayan firmado convenio con Pronabec y estén licenciadas por SUNEDU. En 2026 hay más de 60 universidades convenio. El becario puede elegir su carrera dentro del catálogo aprobado por Pronabec, que incluye las carreras consideradas prioritarias para el desarrollo del país.",
    keywords: ["Beca 18 privada", "convenio Pronabec", "universidades Beca 18", "licenciada Pronabec"],
    relatedPage: "explorar",
  },
  {
    id: "cos-010",
    category: "Costos y Becas",
    question: "¿Cuánto cuesta el proceso de admisión (inscripción al examen)?",
    answer:
      "El costo de inscripción al examen de admisión varía: universidades públicas cobran entre S/ 30 y S/ 150; universidades privadas entre S/ 80 y S/ 250. Algunas universidades privadas tienen inscripción gratuita como estrategia de captación. Este monto no se devuelve si no ingresaste o si decidiste no presentarte al examen.",
    keywords: ["inscripción", "costo admisión", "pagar examen", "postulación", "derecho de inscripción"],
  },
  {
    id: "cos-011",
    category: "Costos y Becas",
    question: "¿Qué es el Fondo Nacional de Becas y Crédito Educativo (Fonabec)?",
    answer:
      "Fonabec es el fondo que gestiona Pronabec para financiar todas sus becas y créditos educativos. No es un programa al que postules directamente; es el instrumento financiero detrás de Beca 18, Beca Permanencia, Crédito-Beca y otros programas. Cuando postulas a cualquier programa de Pronabec, el financiamiento proviene de este fondo, que es alimentado por el presupuesto del Estado peruano.",
    keywords: ["Fonabec", "Pronabec fondo", "qué es Fonabec", "financiamiento educativo estatal"],
  },

  // ─── Traslados y Convalidaciones (11 entries) ────────────────────────────────
  {
    id: "tras-001",
    category: "Traslados y Convalidaciones",
    question: "¿Qué es un traslado externo y cómo funciona en Perú?",
    answer:
      "Un traslado externo es el proceso por el que un estudiante que ya cursó al menos un año en una universidad se cambia a otra universidad diferente. La nueva universidad evalúa si reconoce (convalida) los cursos aprobados en la institución anterior. Está regulado por la Ley 30220 y cada universidad tiene su propio reglamento. No es un derecho automático: la universidad de destino decide cuántos créditos acepta.",
    keywords: ["traslado externo", "cambio de universidad", "trasladar", "nueva universidad", "reconocimiento"],
  },
  {
    id: "tras-002",
    category: "Traslados y Convalidaciones",
    question: "¿Qué documentos necesito para solicitar un traslado externo?",
    answer:
      "Los documentos más comunes son: solicitud dirigida al Decano o Director de Admisión, certificado de estudios universitarios con notas y créditos aprobados, silabo de cada curso a convalidar (firmado y sellado por la universidad de origen), constancia de no tener sanciones disciplinarias, recibo de pago del proceso de traslado, DNI y, en algunos casos, carta de presentación del docente tutor.",
    keywords: ["documentos traslado", "silabo", "certificado universitario", "convalidar", "solicitud traslado"],
  },
  {
    id: "tras-003",
    category: "Traslados y Convalidaciones",
    question: "¿Cuántos créditos puedo convalidar al trasladarme de universidad?",
    answer:
      "Depende completamente del reglamento de la universidad receptora y de la similitud entre los planes de estudios. En general, puedes convalidar entre el 40% y el 80% de los cursos aprobados. Los cursos de Humanidades y Estudios Generales suelen tener mayor porcentaje de convalidación. Los cursos de especialidad son más difíciles de convalidar si los contenidos difieren. Algunas universidades establecen un tope máximo de créditos convalidables.",
    keywords: ["cuántos créditos", "convalidar", "porcentaje", "plan de estudios", "traslado créditos"],
  },
  {
    id: "tras-004",
    category: "Traslados y Convalidaciones",
    question: "¿Puedo trasladarme de una universidad no licenciada a una licenciada?",
    answer:
      "Sí, y de hecho muchos estudiantes de universidades que perdieron el licenciamiento SUNEDU se trasladaron en 2023-2025. Las universidades licenciadas tienen procedimientos especiales para estos casos, facilitando la convalidación de cursos. Sin embargo, los cursos cursados en una universidad no licenciada no tienen valor oficial, por lo que la nueva universidad puede decidir cuántos reconoce según sus propios criterios académicos.",
    keywords: ["no licenciada", "licenciada", "traslado no licenciada", "Universidad denegada", "cambio post denegación"],
  },
  {
    id: "tras-005",
    category: "Traslados y Convalidaciones",
    question: "¿Qué es la convalidación interna dentro de la misma universidad?",
    answer:
      "La convalidación interna ocurre cuando cambias de carrera dentro de la misma universidad. Muchos cursos generales o de ciencias básicas aplican para varias carreras, por lo que no tienes que repetirlos. Por ejemplo, si pasas de Ingeniería Industrial a Ingeniería de Sistemas, los cursos de Matemáticas, Física y Estadística probablemente se convaliden. El proceso es más ágil que el traslado externo porque los contenidos son estandarizados dentro de la institución.",
    keywords: ["convalidación interna", "cambio de carrera", "misma universidad", "cursos comunes", "traslado interno"],
  },
  {
    id: "tras-006",
    category: "Traslados y Convalidaciones",
    question: "¿Cuánto tiempo demora el proceso de traslado externo?",
    answer:
      "El proceso completo puede tomar entre 2 y 6 meses dependiendo de la universidad. Incluye: presentación de solicitud, evaluación de sílabos por cada departamento académico, resolución decanal de convalidación, y matrícula en el nuevo ciclo. Es importante iniciar el trámite con anticipación para no perder el ciclo académico. Algunas universidades tienen ventanas específicas de solicitud (generalmente entre semestres).",
    keywords: ["cuánto demora", "tiempo traslado", "proceso", "meses", "duración trámite"],
  },
  {
    id: "tras-007",
    category: "Traslados y Convalidaciones",
    question: "¿Mi nota promedio cambia cuando me traslado de universidad?",
    answer:
      "Depende de la política de la universidad receptora. Algunas incorporan las notas de los cursos convalidados al cálculo del promedio ponderado acumulado; otras inician un promedio limpio desde cero con los cursos cursados en la nueva institución. También puede afectar si aspiras a graduarte con mención honorífica, ya que muchas universidades exigen un promedio mínimo calculado solo sobre cursos cursados en esa institución.",
    keywords: ["promedio traslado", "nota", "promedio acumulado", "convalidación notas", "mención honorífica"],
  },
  {
    id: "tras-008",
    category: "Traslados y Convalidaciones",
    question: "¿Qué dice la Ley 30220 sobre los traslados universitarios?",
    answer:
      "La Ley Universitaria 30220 establece en su artículo 103 que los estudiantes tienen derecho a solicitar traslado externo entre universidades, cumpliendo los requisitos de la institución receptora. Reconoce la libertad de las universidades para establecer sus propios reglamentos de convalidación, pero prohíbe condiciones arbitrarias o discriminatorias. SUNEDU supervisa que los reglamentos no vulneren los derechos del estudiante.",
    keywords: ["Ley 30220", "artículo 103", "derecho traslado", "SUNEDU traslado", "norma legal"],
  },
  {
    id: "tras-009",
    category: "Traslados y Convalidaciones",
    question: "¿Puedo convalidar estudios hechos en el extranjero?",
    answer:
      "Sí. Para convalidar estudios del extranjero necesitas que el diploma o certificado esté apostillado (si el país firmó el Convenio de La Haya) o legalizado consulado. Los documentos deben estar traducidos al español por un traductor oficial certificado. La universidad peruana evaluará la equivalencia de los cursos. Para el reconocimiento de títulos extranjeros de posgrado interviene la ANR (ahora reemplazada por SUNEDU para el reconocimiento oficial).",
    keywords: ["estudios extranjero", "convalidar extranjero", "apostilla", "traducción oficial", "reconocimiento título"],
  },
  {
    id: "tras-010",
    category: "Traslados y Convalidaciones",
    question: "¿Cuánto cuesta el trámite de traslado y convalidación?",
    answer:
      "Los costos varían por universidad, pero en promedio: el derecho de solicitud de traslado cuesta entre S/ 100 y S/ 300. La convalidación por curso puede costar entre S/ 20 y S/ 80 adicionales. Algunas universidades cobran un monto fijo por paquete de convalidación. Además, debes considerar los costos de obtener los documentos en tu universidad de origen (certificado de estudios, constancias, copias de sílabos).",
    keywords: ["costo traslado", "precio convalidación", "derecho de trámite", "cuánto pagar traslado"],
  },
  {
    id: "tras-011",
    category: "Traslados y Convalidaciones",
    question: "¿Puedo perder créditos si me traslado a una universidad mejor rankeada?",
    answer:
      "Es posible. Universidades de mayor exigencia académica pueden ser más estrictas al convalidar cursos de instituciones con menor nivel. Por ejemplo, la PUCP o la UNI pueden convalidar solo el 30-50% de los créditos de una universidad de menor costo si los contenidos no son equivalentes. Evalúa si el 'reinicio' de ciclos vale la pena considerando la reputación del título que obtendrás al final.",
    keywords: ["perder créditos", "universidad mejor", "rankeada", "reiniciar", "créditos rechazados"],
    relatedPage: "comparador",
  },

  // ─── SUNEDU y Licenciamiento (11 entries) ────────────────────────────────────
  {
    id: "sun-001",
    category: "SUNEDU y Licenciamiento",
    question: "¿Qué es SUNEDU y para qué sirve?",
    answer:
      "SUNEDU (Superintendencia Nacional de Educación Superior Universitaria) es el organismo del Estado peruano encargado de regular y supervisar la calidad del sistema universitario. Fue creado por la Ley 30220 en 2014. Su función principal es otorgar el licenciamiento institucional a las universidades que demuestren cumplir condiciones básicas de calidad (CBC), y fiscalizar su funcionamiento continuo.",
    keywords: ["SUNEDU", "qué es", "organismo", "supervisión", "calidad universitaria", "ente rector"],
  },
  {
    id: "sun-002",
    category: "SUNEDU y Licenciamiento",
    question: "¿Qué significa que una universidad esté licenciada por SUNEDU?",
    answer:
      "Significa que la universidad cumple con las Condiciones Básicas de Calidad (CBC) definidas por la ley: infraestructura adecuada, docentes titulados y calificados, planes de estudio válidos, servicios estudiantiles, investigación y gestión transparente. Un título de una universidad licenciada es reconocido oficialmente por el Estado peruano y tiene validez para empleos públicos, colegiaturas profesionales y estudios de posgrado.",
    keywords: ["licenciada", "qué significa", "condiciones básicas", "validez título", "reconocida"],
  },
  {
    id: "sun-003",
    category: "SUNEDU y Licenciamiento",
    question: "¿Qué pasa si estudio en una universidad no licenciada?",
    answer:
      "Si una universidad no obtuvo o perdió el licenciamiento SUNEDU, el título que emita no tiene validez oficial. No podrás ejercer profesiones reguladas (médico, abogado, ingeniero colegiado), no podrás trabajar en el sector público con ese título, ni acceder a posgrados en universidades serias. Además, la universidad tiene la obligación de comunicarte esto y facilitar tu traslado a una institución licenciada.",
    keywords: ["no licenciada", "título no válido", "sin licencia", "consecuencias", "peligro", "universidad cerrada"],
  },
  {
    id: "sun-004",
    category: "SUNEDU y Licenciamiento",
    question: "¿Cómo sé si una universidad está licenciada antes de postular?",
    answer:
      "Puedes verificarlo en el portal oficial de SUNEDU: sunedu.gob.pe → 'Registro de Universidades Licenciadas'. También ElijePe muestra el estado de licenciamiento de cada universidad en su ficha de detalle. En 2026, aproximadamente 93 universidades tienen licenciamiento vigente. Si la universidad que te interesa no aparece en esa lista, no está autorizada para operar.",
    keywords: ["verificar licenciamiento", "cómo saber", "portal SUNEDU", "lista licenciadas", "consultar"],
    relatedPage: "explorar",
  },
  {
    id: "sun-005",
    category: "SUNEDU y Licenciamiento",
    question: "¿Cuántas universidades hay en Perú y cuántas están licenciadas en 2026?",
    answer:
      "En Perú existen actualmente alrededor de 150 universidades registradas, pero solo aproximadamente 93 cuentan con licenciamiento vigente de SUNEDU en 2026. El proceso de licenciamiento iniciado en 2015 resultó en la clausura de más de 50 universidades que no cumplían condiciones básicas de calidad. La cifra exacta puede variar; verifica en sunedu.gob.pe para datos actualizados.",
    keywords: ["cuántas universidades", "Perú", "licenciadas", "total", "número", "2026"],
    relatedPage: "explorar",
  },
  {
    id: "sun-006",
    category: "SUNEDU y Licenciamiento",
    question: "¿La acreditación es lo mismo que el licenciamiento?",
    answer:
      "No. El licenciamiento es obligatorio y verifica que la universidad cumple condiciones mínimas de calidad. La acreditación es voluntaria y certifica excelencia académica por encima del estándar mínimo. En Perú, la acreditación de carreras la otorga el SINEACE (Sistema Nacional de Evaluación, Acreditación y Certificación de la Calidad Educativa). Tener una carrera acreditada es un diferencial positivo pero no obligatorio.",
    keywords: ["acreditación", "licenciamiento", "diferencia", "SINEACE", "calidad", "obligatorio voluntario"],
  },
  {
    id: "sun-007",
    category: "SUNEDU y Licenciamiento",
    question: "¿Una universidad extranjera necesita licenciamiento SUNEDU para operar en Perú?",
    answer:
      "Sí. Si una universidad extranjera desea otorgar títulos con validez en Perú a través de programas presenciales en territorio peruano, necesita cumplir la normativa de SUNEDU. Los programas puramente en línea de universidades extranjeras para estudiantes peruanos tienen reglas distintas; sus títulos deben ser revalidados en el Perú para tener validez oficial si la institución no cuenta con reconocimiento SUNEDU.",
    keywords: ["extranjera", "universidad foránea", "SUNEDU extranjera", "título extranjero válido", "revalidación"],
  },
  {
    id: "sun-008",
    category: "SUNEDU y Licenciamiento",
    question: "¿Qué universidades peruanas perdieron el licenciamiento y cuándo?",
    answer:
      "Entre 2019 y 2023, SUNEDU denegó el licenciamiento a más de 50 universidades. Entre las más conocidas: Universidad Inca Garcilaso de la Vega (denegado 2023, en proceso legal), Universidad Alas Peruanas (denegado 2022), Universidad de Ciencias y Humanidades (denegado 2021), UIGV. Estas instituciones tuvieron que cesar operaciones o están en proceso de cese. Los estudiantes afectados fueron derivados a universidades licenciadas.",
    keywords: ["denegadas", "perdieron licencia", "cerradas", "Alas Peruanas", "UIGV", "lista"],
  },
  {
    id: "sun-009",
    category: "SUNEDU y Licenciamiento",
    question: "¿Qué son las Condiciones Básicas de Calidad (CBC) que evalúa SUNEDU?",
    answer:
      "Las 8 CBC que evalúa SUNEDU son: (1) Existencia de objetivos académicos, grados y títulos a otorgar; (2) Oferta educativa compatible con los instrumentos de planeamiento; (3) Infraestructura y equipamiento adecuados; (4) Líneas de investigación a ser desarrolladas; (5) Verificación de la disponibilidad de personal docente calificado; (6) Servicios educacionales complementarios básicos; (7) Mecanismos de mediación e inserción laboral; (8) Transparencia de universidades.",
    keywords: ["CBC", "condiciones básicas", "8 condiciones", "calidad", "SUNEDU evalúa", "requisitos licencia"],
  },
  {
    id: "sun-010",
    category: "SUNEDU y Licenciamiento",
    question: "¿Con qué frecuencia SUNEDU renueva el licenciamiento de las universidades?",
    answer:
      "El licenciamiento inicial tiene una vigencia de 6 años. Antes de que venza, la universidad debe solicitar el relicenciamiento demostrando que mantiene y ha mejorado las condiciones de calidad. SUNEDU también puede realizar supervisiones en cualquier momento y, si detecta incumplimientos graves, puede iniciar proceso de revocatoria antes del vencimiento. Es importante verificar la fecha de vigencia del licenciamiento al elegir tu universidad.",
    keywords: ["renovación", "vigencia", "relicenciamiento", "6 años", "cuándo vence", "supervisión"],
  },
  {
    id: "sun-011",
    category: "SUNEDU y Licenciamiento",
    question: "¿Dónde puedo denunciar irregularidades en una universidad?",
    answer:
      "Puedes presentar tu denuncia directamente en SUNEDU a través de su portal web (sunedu.gob.pe → 'Mesa de Partes Virtual') o presencialmente en sus oficinas de Lima y regiones. También puedes acudir a la Defensoría del Pueblo, que tiene una Oficina de Defensa Universitaria, o al Indecopi si hay problemas de cobros irregulares. Tus datos como denunciante pueden mantenerse en reserva.",
    keywords: ["denuncia", "irregularidades", "reportar", "SUNEDU denuncia", "Defensoría", "Indecopi"],
  },

  // ─── Modalidades y Carreras (11 entries) ─────────────────────────────────────
  {
    id: "mod-001",
    category: "Modalidades y Carreras",
    question: "¿Qué diferencia hay entre estudiar presencial, semipresencial y virtual?",
    answer:
      "Presencial: clases en campus, horarios fijos, mayor interacción social y acceso a laboratorios. Semipresencial (híbrido): combina clases en campus (generalmente 1-2 días por semana) con clases virtuales; ideal para trabajadores. Virtual (online): 100% en línea, máxima flexibilidad horaria, requiere autodisciplina alta. En Perú, SUNEDU exige que incluso los programas virtuales cumplan estándares de calidad y que las prácticas y evaluaciones sean supervisadas.",
    keywords: ["presencial", "virtual", "semipresencial", "híbrido", "modalidad", "online", "diferencia"],
    relatedPage: "explorar",
  },
  {
    id: "mod-002",
    category: "Modalidades y Carreras",
    question: "¿Un título virtual tiene el mismo valor que uno presencial en Perú?",
    answer:
      "Legalmente, sí: ambos tienen el mismo valor si la universidad está licenciada por SUNEDU. Sin embargo, en el mercado laboral la percepción puede variar según el empleador y el sector. En sectores como tecnología, marketing digital y gestión empresarial la modalidad virtual es ampliamente aceptada. En sectores como salud, ingeniería civil o educación pública, los empleadores pueden preferir titulados presenciales por las prácticas y laboratorios involucrados.",
    keywords: ["título virtual", "valor", "reconocido", "empleador", "presencial vs virtual", "mismo valor"],
    relatedPage: "comparador",
  },
  {
    id: "mod-003",
    category: "Modalidades y Carreras",
    question: "¿Qué es la doble titulación y qué universidades la ofrecen en Perú?",
    answer:
      "La doble titulación (o doble grado) permite obtener dos títulos universitarios —generalmente de dos instituciones, una peruana y una extranjera— mediante un programa conjunto. Al concluir recibes ambos diplomas. En Perú, la PUCP tiene acuerdos con universidades de España, Francia y México. La UPC tiene convenios con universidades de España y EE.UU. El costo suele ser más alto que un programa regular.",
    keywords: ["doble titulación", "doble grado", "dos títulos", "convenio extranjero", "PUCP", "UPC"],
    relatedPage: "explorar",
  },
  {
    id: "mod-004",
    category: "Modalidades y Carreras",
    question: "¿Cuáles son las carreras con mayor demanda laboral en Perú en 2026?",
    answer:
      "Las carreras con mayor demanda laboral en Perú en 2026 son: Ingeniería de Sistemas / Software (alta demanda por digitalización), Ingeniería Industrial, Administración de Empresas, Enfermería (especialmente en regiones), Contabilidad y Finanzas, Psicología, Arquitectura y Diseño de Interiores, Nutrición y Dietética, y carreras relacionadas con ciberseguridad y ciencia de datos. Estas tendencias pueden variar por región.",
    keywords: ["demanda laboral", "carreras demandadas", "futuro", "mercado", "mejores carreras", "2026"],
    relatedPage: "explorar",
  },
  {
    id: "mod-005",
    category: "Modalidades y Carreras",
    question: "¿Qué es una carrera técnica vs una carrera universitaria?",
    answer:
      "Las carreras técnicas se estudian en Institutos de Educación Superior Tecnológica (IEST) y duran 2-3 años, otorgando el título de Técnico o Profesional Técnico. Las universitarias se estudian en universidades (mínimo 5 años) y otorgan el Grado de Bachiller y el Título Profesional. Los técnicos tienen salida laboral más rápida y menor costo, pero los universitarios acceden a rangos salariales más altos a largo plazo y a puestos de mayor responsabilidad.",
    keywords: ["técnica", "universitaria", "diferencia", "instituto", "técnico", "IEST", "5 años"],
    relatedPage: "explorar",
  },
  {
    id: "mod-006",
    category: "Modalidades y Carreras",
    question: "¿Puedo estudiar dos carreras universitarias al mismo tiempo?",
    answer:
      "Sí, aunque es exigente. Algunas universidades permiten la doble carrera en una misma institución con créditos compartidos. Otras permiten matricularse simultáneamente en dos universidades distintas (lo que implica pagar doble y gestionar dos horarios). La carga académica es considerable: tendrías entre 40 y 50 créditos por semestre. Es más frecuente estudiar una carrera principal y luego hacer una segunda en modalidad acelerada.",
    keywords: ["dos carreras", "doble carrera", "simultáneo", "dos universidades", "segunda carrera"],
  },
  {
    id: "mod-007",
    category: "Modalidades y Carreras",
    question: "¿Cuánto tiempo se necesita para graduarse y titularse en Perú?",
    answer:
      "Para obtener el Grado de Bachiller generalmente necesitas concluir todos los créditos de la carrera (5 años promedio). Para el Título Profesional, debes presentar una tesis o trabajo de suficiencia. Este proceso adicional puede tomar de 6 meses a 2 años más. Algunas universidades facilitan la titulación por examen de suficiencia. El tiempo total desde el ingreso hasta el título suele ser de 6 a 8 años.",
    keywords: ["graduarse", "titularse", "bachiller", "título", "tesis", "cuánto tiempo", "años"],
  },
  {
    id: "mod-008",
    category: "Modalidades y Carreras",
    question: "¿Qué carreras tienen más oportunidades en regiones fuera de Lima?",
    answer:
      "En regiones peruanas hay alta demanda de: Ingeniería de Minas y Metalurgia (Puno, Moquegua, Cajamarca), Ingeniería Agroindustrial (La Libertad, Ica, Arequipa), Medicina y Enfermería (en todos los departamentos), Ingeniería Civil y Arquitectura (ciudades en crecimiento), Turismo y Hotelería (Cusco, Puno, San Martín), y Educación (docentes en zonas rurales con bonificaciones especiales del Estado).",
    keywords: ["regiones", "provincias", "fuera de Lima", "carreras regionales", "oportunidades locales"],
    relatedPage: "explorar",
  },
  {
    id: "mod-009",
    category: "Modalidades y Carreras",
    question: "¿Existe la modalidad de estudios nocturnos en universidades peruanas?",
    answer:
      "Sí, muchas universidades privadas ofrecen horarios nocturnos (generalmente de 7:00 PM a 10:30 PM) diseñados para estudiantes que trabajan durante el día. Universidades como UTP, USIL, UCV, Telesup y ULADECH tienen turnos nocturnos activos. Los programas nocturnos suelen tener las mismas horas académicas que los diurnos, distribuidas en más sesiones semanales. Verifica con la universidad si la carrera específica que te interesa tiene turno noche.",
    keywords: ["nocturno", "noche", "turno", "trabajar y estudiar", "horario noche", "tiempo parcial"],
    relatedPage: "explorar",
  },
  {
    id: "mod-010",
    category: "Modalidades y Carreras",
    question: "¿Las carreras de Humanidades tienen futuro laboral en Perú?",
    answer:
      "Sí, aunque requieren mayor planificación de carrera. Carreras como Comunicaciones, Psicología, Trabajo Social, Historia y Literatura tienen demanda en sectores como medios de comunicación, ONGs, educación, sector público y empresas de recursos humanos. La clave está en especialización y complementación con habilidades digitales. El salario inicial puede ser menor que en ingenierías, pero las oportunidades de crecimiento a mediano plazo son reales.",
    keywords: ["humanidades", "futuro", "comunicaciones", "psicología", "trabajo", "empleo humanidades"],
    relatedPage: "explorar",
  },
  {
    id: "mod-011",
    category: "Modalidades y Carreras",
    question: "¿Qué es la carrera de Ingeniería de Software y cómo se diferencia de Sistemas?",
    answer:
      "Ingeniería de Software se enfoca específicamente en el diseño, desarrollo, pruebas y mantenimiento de software con énfasis en metodologías de desarrollo, calidad y gestión de proyectos. Ingeniería de Sistemas tiene un alcance más amplio: incluye infraestructura tecnológica, redes, bases de datos, sistemas de información empresarial y también programación. Ambas tienen alta demanda laboral; Software tiende a salarios más altos en el sector tecnológico puro.",
    keywords: ["Ingeniería Software", "Ingeniería Sistemas", "diferencia", "programación", "TI"],
    relatedPage: "comparador",
  },

  // ─── Plataforma ElijePe (10 entries) ─────────────────────────────────────────
  {
    id: "eli-001",
    category: "Plataforma ElijePe",
    question: "¿Qué es ElijePe y cómo me puede ayudar?",
    answer:
      "ElijePe es una plataforma peruana de orientación universitaria que centraliza información actualizada sobre las universidades del país. Ofrece: comparador de universidades, simulador de costos a 5 años, test vocacional con inteligencia artificial, explorador de carreras y universidades, asistente IA para consultas personalizadas y una comunidad de estudiantes. Es gratuita y está diseñada para ayudarte a tomar la mejor decisión al elegir dónde y qué estudiar.",
    keywords: ["ElijePe", "qué es", "plataforma", "ayuda", "orientación", "cómo funciona"],
    relatedPage: "ia",
  },
  {
    id: "eli-002",
    category: "Plataforma ElijePe",
    question: "¿Los datos de ElijePe son confiables y están actualizados?",
    answer:
      "ElijePe actualiza su base de datos de universidades y carreras periódicamente, usando como fuentes: el portal oficial de SUNEDU, las páginas web de cada universidad y reportes del MINEDU. Indicamos la fecha de última actualización en cada ficha. Sin embargo, los precios de pensiones y las fechas de admisión pueden cambiar; siempre recomendamos confirmar los datos directamente con la universidad antes de tomar decisiones definitivas.",
    keywords: ["confiable", "actualizado", "fuentes", "datos correctos", "información válida", "veracidad"],
  },
  {
    id: "eli-003",
    category: "Plataforma ElijePe",
    question: "¿ElijePe tiene alguna afiliación con universidades o recibe pagos de ellas?",
    answer:
      "ElijePe es una plataforma independiente. No recibimos pagos de universidades para mejorar su posición en rankings o resultados de búsqueda. Las universidades destacadas lo están por sus métricas objetivas. Podemos tener acuerdos comerciales de publicidad claramente etiquetados, pero estos no influyen en los rankings ni en las comparaciones. Nuestra misión es darte información imparcial para que decidas con libertad.",
    keywords: ["afiliación", "pagos", "independiente", "imparcial", "publicidad", "ranking pagado"],
  },
  {
    id: "eli-004",
    category: "Plataforma ElijePe",
    question: "¿Cómo funciona el comparador de universidades de ElijePe?",
    answer:
      "Puedes seleccionar hasta 3 universidades simultáneamente y compararlas en: costos de pensión y matrícula, duración de la carrera, modalidades disponibles, estado de licenciamiento SUNEDU, acreditaciones, ratio estudiante/docente, infraestructura, empleabilidad de egresados y reputación en el mercado. Los datos se presentan visualmente para facilitar la comparación.",
    keywords: ["comparador", "cómo comparar", "comparar universidades", "cuántas", "criterios comparación"],
    relatedPage: "comparador",
  },
  {
    id: "eli-005",
    category: "Plataforma ElijePe",
    question: "¿El asistente IA de ElijePe puede ayudarme a elegir carrera?",
    answer:
      "Sí. El asistente IA de ElijePe puede conversar contigo sobre tus intereses, habilidades, expectativas salariales y situación geográfica para sugerirte carreras y universidades que se ajusten a tu perfil. No reemplaza la orientación vocacional profesional, pero es un primer filtro muy útil. Funciona las 24 horas y puede responder preguntas específicas sobre cualquier carrera o universidad del sistema.",
    keywords: ["asistente IA", "inteligencia artificial", "chatbot", "orientación IA", "elegir carrera IA"],
    relatedPage: "ia",
  },
  {
    id: "eli-006",
    category: "Plataforma ElijePe",
    question: "¿Mis datos personales están seguros en ElijePe?",
    answer:
      "ElijePe cumple con la Ley 29733 de Protección de Datos Personales del Perú. Tus datos no se venden a terceros. Los resultados de tu test vocacional y tus preferencias de carrera se usan solo para personalizar tu experiencia en la plataforma. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento desde Configuración → Privacidad → Eliminar cuenta.",
    keywords: ["datos personales", "privacidad", "seguridad", "LGPD", "Ley 29733", "eliminar cuenta", "información segura"],
  },
  {
    id: "eli-007",
    category: "Plataforma ElijePe",
    question: "¿Puedo usar ElijePe desde el celular?",
    answer:
      "Sí. ElijePe está diseñada como aplicación web progresiva (PWA) completamente optimizada para dispositivos móviles. Funciona bien en Android e iOS desde el navegador, sin necesidad de descargar una app. También puedes 'instalarla' en tu pantalla de inicio para acceso rápido. En 2026 estamos desarrollando la app nativa para App Store y Google Play.",
    keywords: ["celular", "móvil", "app", "smartphone", "Android", "iOS", "PWA"],
  },
  {
    id: "eli-008",
    category: "Plataforma ElijePe",
    question: "¿Cómo reporto un error en los datos de una universidad en ElijePe?",
    answer:
      "Puedes reportar datos incorrectos de dos formas: (1) Desde la ficha de la universidad, clic en el ícono de bandera '⚑ Reportar error' y describe el problema; (2) Desde la sección Comunidad → canal 'Reportes de Datos' donde la comunidad puede validar el reporte. Nuestro equipo de datos revisa todos los reportes en un máximo de 5 días hábiles.",
    keywords: ["reportar error", "dato incorrecto", "actualizar información", "corregir", "reportar"],
    relatedPage: "ia",
  },
  {
    id: "eli-009",
    category: "Plataforma ElijePe",
    question: "¿ElijePe tiene información de institutos técnicos además de universidades?",
    answer:
      "Por ahora ElijePe se enfoca en universidades licenciadas por SUNEDU. La expansión a Institutos de Educación Superior Tecnológica (IEST) y Escuelas de Educación Superior Pedagógica (EESP) está en nuestro roadmap para el segundo semestre de 2026. Si estudias o planeas estudiar en un instituto técnico, puedes usar nuestra sección de Comunidad para hacer preguntas a otros estudiantes.",
    keywords: ["institutos técnicos", "IEST", "técnica", "no universidades", "roadmap"],
  },
  {
    id: "eli-010",
    category: "Plataforma ElijePe",
    question: "¿ElijePe es gratuita? ¿Habrá versión de pago?",
    answer:
      "Las funciones principales de ElijePe (comparador, explorador, test vocacional básico, comunidad) son completamente gratuitas y lo seguirán siendo. Estamos explorando una versión Premium que ofrecería: informes detallados de orientación vocacional, comparaciones ilimitadas, alertas de admisión personalizadas y acceso a sesiones con orientadores profesionales. El modelo freemium asegura que la herramienta siga siendo accesible para todos.",
    keywords: ["gratuita", "precio", "pago", "premium", "costo ElijePe", "freemium"],
  },

  // ─── Test Vocacional (10 entries) ─────────────────────────────────────────────
  {
    id: "test-001",
    category: "Test Vocacional",
    question: "¿Cómo funciona el test vocacional de ElijePe?",
    answer:
      "El test vocacional de ElijePe evalúa 6 dimensiones: intereses académicos, habilidades percibidas, valores laborales, preferencia de entorno de trabajo, expectativas económicas y tolerancia a la carga académica. Consta de aproximadamente 40 preguntas y toma entre 15 y 20 minutos. Al finalizar, el sistema genera un perfil con tus 3 principales tipos de afinidad vocacional y te sugiere carreras y universidades alineadas.",
    keywords: ["test vocacional", "cómo funciona", "preguntas", "duración", "dimensiones", "resultado"],
    relatedPage: "test",
  },
  {
    id: "test-002",
    category: "Test Vocacional",
    question: "¿Qué tan confiable es el test vocacional de ElijePe?",
    answer:
      "El test está basado en modelos psicométricos validados (Holland RIASEC adaptado al contexto peruano) y ha sido revisado por psicólogos vocacionales. La confiabilidad estadística (alfa de Cronbach) es superior a 0.82 en las pruebas de validación. Sin embargo, ningún test es infalible: los resultados son una orientación, no un veredicto. Te recomendamos usarlo junto con conversaciones con orientadores y profesionales de las carreras que te interesan.",
    keywords: ["confiable", "fiable", "precisión", "científico", "RIASEC", "psicométrico", "válido"],
    relatedPage: "test",
  },
  {
    id: "test-003",
    category: "Test Vocacional",
    question: "¿Puedo repetir el test vocacional si no estoy satisfecho con el resultado?",
    answer:
      "Sí, puedes repetir el test las veces que quieras. Sin embargo, ten en cuenta que si respondes con más honestidad la segunda vez los resultados suelen ser más representativos. Guardar múltiples resultados te permite ver la consistencia de tus respuestas. En la sección 'Mis Resultados' puedes comparar los resultados de diferentes intentos.",
    keywords: ["repetir test", "volver a hacer", "segunda vez", "mismo resultado", "varios intentos"],
    relatedPage: "test",
  },
  {
    id: "test-004",
    category: "Test Vocacional",
    question: "¿El test vocacional reemplaza a un orientador vocacional profesional?",
    answer:
      "No, el test es una herramienta de autoconocimiento y primer acercamiento. Un orientador vocacional profesional puede explorar aspectos más profundos: historia familiar, experiencias pasadas, miedos y motivaciones que un cuestionario no captura. Te recomendamos usar el test de ElijePe como punto de partida y, si tienes dudas persistentes, buscar orientación con un psicólogo especialista en vocación.",
    keywords: ["orientador", "psicólogo", "profesional", "reemplaza", "complemento", "diferencia"],
    relatedPage: "test",
  },
  {
    id: "test-005",
    category: "Test Vocacional",
    question: "¿Qué es el modelo RIASEC y cómo lo usa ElijePe?",
    answer:
      "RIASEC es un modelo de orientación vocacional desarrollado por el psicólogo John Holland que clasifica los intereses en 6 tipos: Realista (R), Investigador (I), Artístico (A), Social (S), Emprendedor (E) y Convencional (C). Cada persona tiene una combinación de estos tipos. ElijePe usa una adaptación del RIASEC con ejemplos y carreras del contexto peruano para hacer los resultados más relevantes localmente.",
    keywords: ["RIASEC", "Holland", "tipos vocacionales", "modelo", "realista investigador artístico"],
    relatedPage: "test",
  },
  {
    id: "test-006",
    category: "Test Vocacional",
    question: "¿A qué edad es ideal hacer el test vocacional?",
    answer:
      "El test es más útil entre los 15 y 17 años, cuando el estudiante ya tiene suficiente autoconocimiento pero aún puede orientar sus estudios. Sin embargo, es válido a cualquier edad: adultos que quieren cambiar de carrera también lo usan con buenos resultados. En menores de 14 años los resultados pueden ser menos estables porque los intereses aún están en formación.",
    keywords: ["edad", "cuándo hacer", "15 años", "adultos", "cambio carrera", "ideal"],
    relatedPage: "test",
  },
  {
    id: "test-007",
    category: "Test Vocacional",
    question: "¿El resultado del test me dice qué universidad elegir?",
    answer:
      "El test te sugiere carreras alineadas con tu perfil, y luego ElijePe te muestra las universidades que ofrecen esas carreras con sus características. La plataforma no 'elige' por ti: te da información y sugerencias para que tú decidas. Factores como ubicación, costo, modalidad y reputación son personales y dependen de tu situación específica.",
    keywords: ["qué universidad elegir", "resultado", "sugerencia", "elegir por mí", "recomendación"],
    relatedPage: "test",
  },
  {
    id: "test-008",
    category: "Test Vocacional",
    question: "¿El test evalúa mis notas del colegio?",
    answer:
      "No directamente. El test evalúa tus intereses, valores y habilidades autopercibidas, no tus calificaciones. Sin embargo, hay preguntas sobre áreas en las que te sientes más competente, lo que guarda relación con tu desempeño académico. Si quieres incluir tus notas en el análisis, puedes hacerlo a través del Simulador de Admisión, que cruza tu rendimiento con los puntajes de corte históricos.",
    keywords: ["notas", "calificaciones", "rendimiento académico", "colegios", "promedio"],
    relatedPage: "test",
  },
  {
    id: "test-009",
    category: "Test Vocacional",
    question: "¿Puedo compartir mi resultado del test vocacional?",
    answer:
      "Sí. Desde la pantalla de resultados puedes generar un enlace compartible o descargar un PDF con tu perfil vocacional para compartirlo con padres, orientadores o amigos. El enlace puede configurarse como privado (solo con el link) o público. Muchos estudiantes lo comparten con sus familias para iniciar conversaciones sobre su elección de carrera.",
    keywords: ["compartir resultado", "PDF", "enlace", "mostrar padres", "exportar"],
    relatedPage: "test",
  },
  {
    id: "test-010",
    category: "Test Vocacional",
    question: "¿Hay sesgo de género en el test vocacional de ElijePe?",
    answer:
      "Hemos trabajado activamente para eliminar sesgos de género. Los ejemplos y las carreras sugeridas no están filtradas por género. Hemos validado que los resultados no están estadísticamente sesgados entre hombres y mujeres con perfil similar. Sin embargo, si sientes que alguna pregunta es tendenciosa, usa el botón 'Reportar pregunta' al final del test para ayudarnos a mejorarlo.",
    keywords: ["sesgo género", "discriminación", "género", "mujer", "hombre", "neutral"],
    relatedPage: "test",
  },

  // ─── Vida Universitaria (11 entries) ─────────────────────────────────────────
  {
    id: "vid-001",
    category: "Vida Universitaria",
    question: "¿Cómo funciona el sistema de créditos universitarios en Perú?",
    answer:
      "Un crédito académico en Perú equivale a 16 horas de clase teórica o 32 horas de práctica. Un semestre normal tiene entre 18 y 24 créditos, distribuidos en 5-7 cursos. Si repruebas un curso, debes repetirlo pagando nuevamente los créditos correspondientes. Los créditos acumulados determinan si puedes avanzar a ciclos superiores y son la base para calcular tu promedio ponderado.",
    keywords: ["créditos", "cómo funcionan", "horas", "semestre", "repetir", "sistema créditos"],
  },
  {
    id: "vid-002",
    category: "Vida Universitaria",
    question: "¿Qué es el régimen semestral y el régimen anual en la universidad?",
    answer:
      "El régimen semestral divide el año en dos periodos de aproximadamente 18 semanas (ciclo I: marzo-julio; ciclo II: agosto-diciembre). Es el más común en Perú. El régimen anual tiene un solo periodo de 36 semanas y es menos frecuente (algunas universidades públicas lo mantienen). El semestral da más flexibilidad: si repruebas un curso, puedes repetirlo en el siguiente semestre sin esperar todo un año.",
    keywords: ["semestral", "anual", "ciclo", "régimen", "cuántos meses", "calendario académico"],
  },
  {
    id: "vid-003",
    category: "Vida Universitaria",
    question: "¿Existe alojamiento universitario (residencias) en universidades peruanas?",
    answer:
      "Las residencias universitarias son escasas en el Perú. Solo algunas universidades públicas (UNMSM, PUCP, UNI) tienen residencias para estudiantes de provincias, generalmente con cupos muy limitados y procesos de selección propios. La mayoría de estudiantes buscan cuartos de alquiler cerca del campus (S/ 350-800/mes en Lima). Sitios como Facebook Marketplace y grupos universitarios son las principales vías para encontrar alojamiento.",
    keywords: ["alojamiento", "residencia universitaria", "cuarto", "vivir cerca universidad", "hospedaje"],
  },
  {
    id: "vid-004",
    category: "Vida Universitaria",
    question: "¿Cómo son los horarios en la universidad? ¿Es tan cargado como dicen?",
    answer:
      "Los horarios universitarios típicos en Perú son de lunes a viernes entre 8:00 AM y 6:00 PM, con bloques de 90-120 minutos por curso. En promedio tienes entre 25 y 30 horas de clase por semana en los primeros ciclos. Además, se esperan entre 10 y 15 horas adicionales de estudio fuera de clases. Las carreras de ingeniería y salud son las más exigentes en carga horaria. Los últimos ciclos pueden ser más flexibles según las electivas que elijas.",
    keywords: ["horario", "carga", "horas clase", "cuántas horas", "exigente", "semana"],
  },
  {
    id: "vid-005",
    category: "Vida Universitaria",
    question: "¿Qué son los créditos extracurriculares y cuántos necesito?",
    answer:
      "Los créditos extracurriculares son actividades fuera del plan de estudios que la universidad exige para graduarse: talleres culturales, deportes, voluntariado, idiomas, actividades de extensión. La mayoría de universidades exige entre 2 y 8 créditos extracurriculares. Pueden obtenerse en cursos de idiomas (muy comunes), talleres de música o danza, participación en organizaciones estudiantiles o programas de voluntariado certificados.",
    keywords: ["extracurriculares", "créditos fuera del plan", "idiomas", "voluntariado", "cuántos", "requisito graduación"],
  },
  {
    id: "vid-006",
    category: "Vida Universitaria",
    question: "¿Qué es el 'servis' universitario y cómo accedo a él?",
    answer:
      "El 'servis' o servicio universitario es el conjunto de beneficios que ofrecen las universidades: comedor subsidiado, tópico de salud, biblioteca, laboratorios de cómputo, gimnasio, centros culturales y deportivos. Para acceder debes ser estudiante matriculado y, en algunos casos, presentar carné universitario actualizado. Los estudiantes con beca o escala baja suelen tener acceso preferente a los servicios subsidiados.",
    keywords: ["servicios universitarios", "comedor", "biblioteca", "salud", "tópico", "beneficios"],
  },
  {
    id: "vid-007",
    category: "Vida Universitaria",
    question: "¿Qué pasa si desaparezco o abandono la universidad sin avisar?",
    answer:
      "Si dejas de matricularte sin formalizar tu retiro, quedas registrado como 'abandono' y podrías perder el derecho a recuperar tus documentos originales retenidos. Algunos contratos universitarios privados incluyen cláusulas de deuda por ciclos no cursados. Lo correcto es solicitar formalmente la reserva de matrícula (máximo 2 años en la mayoría de universidades) o el retiro definitivo para que tu récord quede en orden.",
    keywords: ["abandono", "dejar universidad", "retiro", "reserva de matrícula", "deserción", "deuda"],
  },
  {
    id: "vid-008",
    category: "Vida Universitaria",
    question: "¿Puedo trabajar mientras estudio la universidad?",
    answer:
      "Sí, y es muy común en Perú. Se estima que más del 40% de universitarios peruanos trabajan mientras estudian. Las modalidades semipresencial y nocturna están diseñadas para ello. Para lograrlo con éxito: elige una carrera cuyo horario sea compatible con tu trabajo, no sobrecargues créditos en los primeros ciclos, y aprovecha al máximo los materiales en línea de tus cursos. La clave es gestión del tiempo.",
    keywords: ["trabajar", "estudiar y trabajar", "part time", "trabajo mientras universidad", "tiempo parcial"],
  },
  {
    id: "vid-009",
    category: "Vida Universitaria",
    question: "¿Qué es una práctica preprofesional y cuándo la hago?",
    answer:
      "Las prácticas preprofesionales son experiencias laborales supervisadas que la universidad exige como requisito de graduación. Generalmente se realizan a partir del 6.° o 7.° ciclo y tienen una duración mínima de 3 a 6 meses. Deben ser en empresas o instituciones relacionadas con tu carrera y generar un informe de prácticas. Muchas universidades tienen oficinas de bolsa laboral que facilitan encontrar empresas.",
    keywords: ["prácticas", "preprofesional", "empresa", "cuándo", "requisito graduación", "bolsa laboral"],
  },
  {
    id: "vid-010",
    category: "Vida Universitaria",
    question: "¿Qué es la vida de 'cachimbo' y cómo adaptarse al primer año?",
    answer:
      "'Cachimbo' es el término peruano para el estudiante de primer año universitario. El primer año es el de mayor riesgo de deserción: el cambio de metodología (de memorización a comprensión crítica), la mayor autonomía y la vida social nueva pueden abrumar. Para adaptarte: únete a grupos de estudio desde el primer mes, visita la oficina de tutoría (que todas las universidades deben tener por ley), y no subestimes los cursos de 'estudios generales'.",
    keywords: ["cachimbo", "primer año", "adaptación", "primer ciclo", "deserción", "ingresante"],
  },
  {
    id: "vid-011",
    category: "Vida Universitaria",
    question: "¿Existen organizaciones estudiantiles activas en las universidades peruanas?",
    answer:
      "Sí. En la mayoría de universidades existen centros federados por facultad y un centro de estudiantes o federación universitaria general. También hay organizaciones por interés: emprendimiento (ENACTUS, AIESEC), tecnología (clubes de robótica, IA), voluntariado (Techo, Un Techo para Mi País), deportes y cultura. Participar desde el primer año amplia tu red de contactos y enriquece tu perfil profesional.",
    keywords: ["organizaciones estudiantiles", "club", "federación", "AIESEC", "ENACTUS", "actividades"],
  },

  // ─── Empleabilidad y Mercado Laboral (12 entries) ────────────────────────────
  {
    id: "emp-001",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Cuánto gana en promedio un recién egresado universitario en Perú?",
    answer:
      "Según datos del Observatorio Laboral del MTPE 2025, el salario promedio de un egresado universitario en Perú varía entre S/ 1,800 y S/ 3,500 en el primer trabajo. Las carreras con mayor salario inicial son: Ingeniería de Software (S/ 3,000-4,500), Medicina (S/ 3,500 en EsSalud), Ingeniería de Minas (S/ 3,500-5,000 en empresas mineras). Las de menor salario inicial son: Educación (S/ 1,600-2,200) y algunas Humanidades (S/ 1,500-2,000).",
    keywords: ["salario", "sueldo", "cuánto gana", "egresado", "primer trabajo", "ingreso"],
    relatedPage: "explorar",
  },
  {
    id: "emp-002",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Cuánto tiempo se demora en conseguir trabajo después de graduarse?",
    answer:
      "En Perú, el tiempo promedio de inserción laboral para egresados universitarios es de 4 a 10 meses. Sin embargo, si hiciste prácticas durante la carrera, el tiempo puede reducirse a 1-3 meses. Las carreras con inserción laboral más rápida son: Ingeniería de Sistemas, Enfermería, Contabilidad y Administración. Las más lentas: Derecho (donde conseguir el primer trabajo sin conexiones puede tomar más de un año), Comunicaciones y Psicología.",
    keywords: ["conseguir trabajo", "tiempo", "inserción laboral", "después de graduarse", "empleo rápido"],
  },
  {
    id: "emp-003",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Importa la universidad de la que me gradúo para conseguir trabajo?",
    answer:
      "Sí importa, especialmente en Lima y para empleadores del sector formal. Las universidades más valoradas por empresas peruanas son: PUCP, UPC, UP, UTEC y UNI (en ingenierías). En el sector público, el filtro es menos exigente; lo que más pesa es el título y el concurso de méritos. Sin embargo, las habilidades demostradas, la experiencia en prácticas y la red de contactos pueden superar el 'nombre' de la universidad.",
    keywords: ["importa universidad", "nombre universidad", "empleadores", "reputación", "brand universitario"],
    relatedPage: "comparador",
  },
  {
    id: "emp-004",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Cuáles son las habilidades más buscadas por empleadores peruanos en 2026?",
    answer:
      "Las habilidades más demandadas por empleadores peruanos en 2026 son: pensamiento crítico y resolución de problemas, comunicación efectiva oral y escrita, competencias digitales (Excel avanzado, análisis de datos, uso de IA), inglés (B2 o superior), trabajo en equipo y liderazgo, adaptabilidad al cambio, conocimientos en ciberseguridad básica y gestión de proyectos (metodologías ágiles como Scrum). El dominio del inglés sigue siendo el diferenciador más valorado.",
    keywords: ["habilidades", "empleadores", "soft skills", "inglés", "Excel", "2026", "competencias"],
  },
  {
    id: "emp-005",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Vale la pena hacer un posgrado o máster después de la universidad en Perú?",
    answer:
      "En muchos sectores sí. Un MBA o maestría puede incrementar el salario entre 30% y 60% respecto al mismo profesional sin posgrado, según datos de LinkedIn Perú 2025. Es más rentable si lo haces con 2-4 años de experiencia laboral previa. Los posgrados en el extranjero (especialmente España, EE.UU. y Chile) son especialmente valorados. La clave es elegir posgrados acreditados y relevantes para tu sector.",
    keywords: ["posgrado", "maestría", "MBA", "vale la pena", "salario posgrado", "máster"],
  },
  {
    id: "emp-006",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Qué sectores económicos están creciendo más en Perú y generan más empleo?",
    answer:
      "Los sectores con mayor crecimiento de empleo formal en Perú en 2026 son: tecnología e informática, agroindustria de exportación (especialmente en La Libertad e Ica), minería y energías renovables, construcción e infraestructura (impulsados por los juegos de Lima 2027), turismo (post-recuperación pandémica) y servicios de salud. El sector tecnológico lidera en salarios, mientras que la agroindustria lidera en volumen de empleo.",
    keywords: ["sectores", "crecimiento", "empleo", "economía", "minería", "tecnología", "Perú 2026"],
  },
  {
    id: "emp-007",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Cuánto gana un ingeniero de sistemas vs un administrador de empresas en Perú?",
    answer:
      "Comparativa 2026 aproximada: Ingeniero de Sistemas con 0-2 años de experiencia: S/ 3,000-4,500/mes; con 5 años: S/ 6,000-9,000. Administrador de Empresas con 0-2 años: S/ 1,800-2,800; con 5 años: S/ 3,500-6,000. Los picos más altos para sistemas se dan en empresas de software y fintech; para administradores, en multinacionales y banca. La brecha tiende a reducirse a nivel gerencial.",
    keywords: ["sueldo ingeniero sistemas", "administrador", "comparativa salarios", "cuánto gana", "diferencia"],
    relatedPage: "comparador",
  },
  {
    id: "emp-008",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿El trabajo remoto es común para egresados universitarios en Perú?",
    answer:
      "Sí, especialmente en tecnología, marketing digital, diseño, contabilidad y gestión de proyectos. En Lima, alrededor del 35% de los empleos del sector formal tienen opción de trabajo remoto o híbrido en 2026. En regiones, el porcentaje es menor (15-20%). Las empresas que contratan talento remoto para Perú incluyen startups latinoamericanas y empresas norteamericanas que externalizan trabajo a desarrolladores y diseñadores peruanos.",
    keywords: ["trabajo remoto", "home office", "teletrabajo", "virtual", "remoto", "freelance"],
  },
  {
    id: "emp-009",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Qué es el 'ratio de empleabilidad' que muestra ElijePe y cómo se calcula?",
    answer:
      "El ratio de empleabilidad es un indicador que estima qué porcentaje de egresados de una carrera específica en una universidad específica consigue empleo formal en los primeros 12 meses post-graduación. Se calcula cruzando datos del Ministerio de Trabajo (Planilla Electrónica), reportes de SUNEDU sobre seguimiento de egresados y encuestas propias de cada universidad. Es uno de los indicadores más relevantes para evaluar el retorno de tu inversión educativa.",
    keywords: ["ratio empleabilidad", "empleabilidad", "indicador", "cómo se calcula", "empleo egresados"],
    relatedPage: "explorar",
  },
  {
    id: "emp-010",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Vale la pena estudiar Derecho en Perú considerando la saturación del mercado?",
    answer:
      "Derecho es una de las carreras más saturadas en Lima, con más de 20,000 abogados colegiados y alta competencia. Sin embargo, hay nichos con alta demanda: Derecho Corporativo y Tributario (salarios de S/ 5,000-15,000), Derecho Laboral, Compliance y Propiedad Intelectual. Si estudias en una universidad de alto prestigio (PUCP, U. Lima) y te especializas, tienes buenas perspectivas. Si estudias en una universidad de baja reputación, el panorama es más difícil.",
    keywords: ["Derecho", "saturado", "mercado laboral derecho", "abogados", "vale la pena", "especialización"],
  },
  {
    id: "emp-011",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Cuáles son las carreras con mayor proyección salarial a 10 años en Perú?",
    answer:
      "Las carreras con mayor crecimiento salarial proyectado a 10 años en Perú según estudios del MTPE son: (1) Ciencia de Datos e IA; (2) Ingeniería de Software; (3) Medicina especializada (Anestesiología, Cardiología, Radiología); (4) Ingeniería de Minas y Petróleo (sujeta a ciclos de precios internacionales); (5) Administración con especialización financiera; (6) Psicología Organizacional y (7) Arquitectura e Ingeniería Ambiental.",
    keywords: ["proyección salarial", "futuro", "10 años", "crecimiento", "mejor carrera largo plazo"],
    relatedPage: "explorar",
  },
  {
    id: "emp-012",
    category: "Empleabilidad y Mercado Laboral",
    question: "¿Qué tan importante es el inglés para conseguir trabajo en Perú?",
    answer:
      "El inglés es el diferenciador laboral más mencionado por reclutadores peruanos. Un profesional con inglés B2-C1 puede ganar entre 20% y 50% más que uno sin inglés en el mismo rol. Es especialmente crítico en: tecnología, exportaciones, turismo, banca internacional, consultoría y empresas multinacionales. En regiones, el inglés también da ventaja para trabajar en proyectos mineros o turísticos con presencia extranjera.",
    keywords: ["inglés", "idioma", "importancia", "salario con inglés", "diferenciador", "B2"],
  },

  // ─── Padres de Familia (12 entries) ──────────────────────────────────────────
  {
    id: "pad-001",
    category: "Padres de Familia",
    question: "¿Cómo puedo comparar universidades para ayudar a mi hijo a elegir la mejor opción?",
    answer:
      "ElijePe tiene un comparador diseñado especialmente para facilitar esta decisión. Evalúa: estado de licenciamiento SUNEDU (lo más importante para garantizar validez del título), costo total estimado a 5 años, ratio de empleabilidad de egresados, modalidades disponibles, ubicación y seguridad del campus, y reputación en el mercado laboral. No hay una 'mejor' universidad en absoluto; la mejor es la que se ajusta al perfil de tu hijo y a las posibilidades económicas de la familia.",
    keywords: ["comparar universidades", "padres", "cómo elegir", "mejor universidad", "ayudar hijo"],
    relatedPage: "comparador",
  },
  {
    id: "pad-002",
    category: "Padres de Familia",
    question: "¿Cuánto dinero necesito ahorrar para pagar la universidad de mi hijo?",
    answer:
      "El costo total a 5 años depende del tipo de universidad. Estimados 2026: Universidad privada de alto costo (PUCP, UPC, UP): S/ 90,000-180,000 incluyendo pensiones, matrícula y materiales. Privada de costo medio: S/ 35,000-70,000. Privada de bajo costo: S/ 15,000-30,000. Universidad pública: S/ 5,000-15,000 (mayormente gastos indirectos). Usa el Simulador de ElijePe para calcular el costo específico de la carrera que le interesa a tu hijo.",
    keywords: ["cuánto cuesta", "ahorro", "presupuesto", "5 años", "costo total", "planificación"],
    relatedPage: "simulador",
  },
  {
    id: "pad-003",
    category: "Padres de Familia",
    question: "¿Cómo sé si la universidad que eligió mi hijo es de calidad?",
    answer:
      "Los indicadores más confiables de calidad son: (1) Licenciamiento SUNEDU vigente (obligatorio); (2) Acreditaciones del SINEACE de sus carreras (voluntario pero diferenciador); (3) Posición en rankings nacionales como Ranking Universitario Peruano de SUNEDU; (4) Ratio de empleabilidad de egresados; (5) Calidad de la plana docente (porcentaje de docentes con maestría o doctorado). ElijePe muestra todos estos indicadores en cada ficha de universidad.",
    keywords: ["calidad universidad", "cómo saber", "indicadores", "ranking", "verificar", "buena universidad"],
    relatedPage: "explorar",
  },
  {
    id: "pad-004",
    category: "Padres de Familia",
    question: "¿Qué es Beca 18 y mi hijo puede postular si trabaja por las noches?",
    answer:
      "Beca 18 exige dedicación exclusiva a los estudios: no permite trabajar mientras se recibe la beca. La beca cubre todos los gastos precisamente para que el becario pueda estudiar a tiempo completo. Si tu hijo trabaja actualmente, debería considerar si puede dejar el trabajo durante los años de universidad. Si la situación económica lo requiere, existen otras opciones como el crédito educativo de Pronabec que sí es compatible con trabajar.",
    keywords: ["Beca 18", "trabajar con beca", "dedicación exclusiva", "compatible trabajo"],
  },
  {
    id: "pad-005",
    category: "Padres de Familia",
    question: "¿Puedo deducir los gastos de universidad de mi hijo de mis impuestos en Perú?",
    answer:
      "Sí, la SUNAT permite deducir gastos de educación universitaria como gasto deducible adicional a la UIT. Para 2026, puedes deducir hasta el 30% de los gastos en universidades peruanas licenciadas, colegiatura e institutos bajo ciertas condiciones, como parte de las deducciones adicionales para trabajadores en cuarta y quinta categoría. Guarda todos los comprobantes electrónicos de pensiones y matrícula.",
    keywords: ["deducción impuestos", "SUNAT", "gastos educación", "impuesto renta", "factura universidad", "deducción UIT"],
  },
  {
    id: "pad-006",
    category: "Padres de Familia",
    question: "¿Qué pasa si mi hijo empieza la universidad y quiere cambiar de carrera?",
    answer:
      "Es más común de lo que parece: alrededor del 30% de universitarios peruanos cambian de carrera durante los primeros 2 años. El proceso depende de si el cambio es en la misma universidad (traslado interno, generalmente más sencillo) o a otra universidad (traslado externo). Pueden convalidarse cursos comunes. Lo importante es que tome la decisión temprano (preferentemente en el 1.° o 2.° ciclo) para minimizar la pérdida de tiempo y dinero.",
    keywords: ["cambiar carrera", "hijo cambia carrera", "traslado", "qué hacer", "primer año"],
  },
  {
    id: "pad-007",
    category: "Padres de Familia",
    question: "¿Existen seguros para proteger la inversión educativa si mi hijo enferma o yo pierdo el trabajo?",
    answer:
      "Sí. Varias aseguradoras peruanas (Rímac, Pacífico, La Positiva) ofrecen seguros de protección de pagos educativos que cubren las pensiones universitarias en caso de desempleo involuntario, incapacidad temporal o fallecimiento del padre/madre. Algunas universidades incluyen cláusulas de congelamiento de deuda por situaciones de emergencia. Consulta con tu universidad o con tu empresa aseguradora.",
    keywords: ["seguro educativo", "protección inversión", "desempleo", "enfermedad", "cubrir pensiones"],
  },
  {
    id: "pad-008",
    category: "Padres de Familia",
    question: "¿Cómo involucrarme en la vida universitaria de mi hijo sin ser invasivo?",
    answer:
      "La transición a la universidad implica mayor autonomía para el joven. Puedes apoyar sin invadir: conoce el nombre de su asesor académico o tutor universitario (a quien puedes contactar si hay problemas serios), revisa juntos el avance de créditos una vez por semestre, pregunta sobre sus prácticas y proyectos sin presionar por notas específicas, y muestra interés genuino por su carrera eligiendo. La confianza mutua facilita que tu hijo te busque cuando realmente necesite ayuda.",
    keywords: ["involucrar padres", "vida universitaria hijo", "apoyo sin presionar", "comunicación", "confianza"],
  },
  {
    id: "pad-009",
    category: "Padres de Familia",
    question: "¿Qué hago si mi hijo no sabe qué carrera estudiar?",
    answer:
      "Es completamente normal. Las recomendaciones son: (1) Hacer el test vocacional de ElijePe juntos y conversar sobre los resultados; (2) Consultar con el psicólogo orientador del colegio; (3) Acompañarlo a visitar las ferias universitarias que organizan las universidades en los meses previos al ciclo de admisión; (4) Hablar con profesionales de las carreras que le llaman la atención; (5) Si no está seguro, considerar iniciar con un año de estudios generales en una universidad que los ofrezca.",
    keywords: ["no sabe qué estudiar", "indecisión", "orientar hijo", "qué hacer", "ayudar elegir carrera"],
    relatedPage: "test",
  },
  {
    id: "pad-010",
    category: "Padres de Familia",
    question: "¿Las universidades ubicadas fuera de Lima son de menor calidad?",
    answer:
      "No necesariamente. Hay universidades regionales excelentes: la UNSA (Arequipa) y la UNSAAC (Cusco) tienen carreras de muy alta calidad y buenos ratios de empleabilidad local. La UNTRM (Chachapoyas) y la UNCP (Huancayo) destacan en sus respectivas regiones. La calidad varía por carrera, no por ciudad. Además, estudiar en la región de tu hijo puede reducir costos significativamente al no necesitar alojamiento fuera de casa.",
    keywords: ["universidades región", "fuera Lima", "provincias", "calidad regional", "Arequipa", "Cusco"],
    relatedPage: "explorar",
  },
  {
    id: "pad-011",
    category: "Padres de Familia",
    question: "¿Cuánto tiempo libre tiene un universitario en Perú? ¿Habrá tiempo para trabajar?",
    answer:
      "Depende de la carrera, el ciclo y la modalidad. En los primeros ciclos de ingenierías o ciencias de la salud, la carga académica puede llegar a 40-45 horas semanales (clases + estudio). En carreras de ciencias sociales o primer ciclo de administrativas, puede ser de 25-35 horas. La jornada laboral estándar es de 48 horas semanales; combinarla con 30-35 horas de estudio es difícil pero posible con buena organización y modalidades nocturnas o semipresenciales.",
    keywords: ["tiempo libre", "trabajar y estudiar", "horas", "cuánto tiempo", "combinar trabajo estudio"],
  },
  {
    id: "pad-012",
    category: "Padres de Familia",
    question: "¿Cómo evaluar si una universidad privada justifica su costo frente a una pública?",
    answer:
      "Compara estos factores: (1) Empleabilidad real: ¿los egresados de esa privada consiguen trabajo más rápido o con mejor salario? (2) Acreditaciones: ¿tiene la carrera acreditada por SINEACE? (3) Red de contactos y prácticas: ¿tiene convenios con empresas del sector? (4) Infraestructura: laboratorios, tecnología, campus seguro. (5) Costo de oportunidad: ¿podría ingresar a una pública con preparación adicional? El ElijePe Simulador de ROI calcula el retorno estimado de la inversión para carreras específicas.",
    keywords: ["privada vs pública", "vale la pena privada", "costo beneficio", "ROI", "justifica costo"],
    relatedPage: "simulador",
  },
];
