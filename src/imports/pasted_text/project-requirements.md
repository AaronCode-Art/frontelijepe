Eres mi asistente de desarrollo para "ElijePe" (antes ElijePe), una plataforma web de
orientación universitaria para Perú. El proyecto YA EXISTE como prototipo frontend
(React + Vite + Tailwind + shadcn/Radix, generado con Figma Make), con datos simulados
(mock data) en memoria — todavía NO hay backend real, base de datos ni conexión a SUNEDU.
Todo lo que pidas debe construirse como una simulación funcional dentro de este prototipo
(usando estado de React y/o localStorage para persistencia local), dejando preparada la
estructura para conectar un backend real más adelante.

═══════════════════════════════════
1. BUG CRÍTICO — Arreglar el login
═══════════════════════════════════
En la pantalla de login/registro, cada casilla de texto pierde el foco después de escribir
una sola letra, obligando a hacer clic de nuevo por cada carácter. Esto pasa porque el
componente de input está definido dentro del componente de la página (se recrea en cada
render). Solución: extraer el campo de texto a un componente independiente y estable
(fuera del componente de la página, recibiendo value/onChange por props), para que React
no lo desmonte en cada tecla. Verifica que esto se aplique a TODOS los inputs de login,
registro y cualquier otro formulario de la plataforma (test vocacional, simulador, perfil, etc).

═══════════════════════════════════
2. Comparador de universidades
═══════════════════════════════════
- Permitir comparar 2, 3, 4 o hasta 5 universidades al mismo tiempo (hoy está limitado a 3).
- Vista de comparación lado a lado con: costo total a 5 años, pensión, matrícula, empleabilidad,
  ranking, acreditación SUNEDU, modalidad, variación histórica de pensión.
- Indicar visualmente cuando se llega al máximo, sin romper el diseño.

═══════════════════════════════════
3. Chatbot de orientación 24/7
═══════════════════════════════════
- Chatbot con más de 100 respuestas a preguntas frecuentes sobre: admisión, costos,
  becas, convalidación, requisitos, modalidades, plazos.
- Accesible desde cualquier página (botón flotante).
- Si la pregunta no coincide con las respuestas frecuentes, debe ofrecer redirigir al
  asistente de IA premium (ver punto 5) o al simulador correspondiente.
- Guardar el historial de conversación por usuario (para que pueda revisarlo después),
  usando almacenamiento local por ahora.

═══════════════════════════════════
4. Test vocacional ampliado
═══════════════════════════════════
- Expandir el test actual (hoy son 4 pasos con tarjetas de selección) a un test de
  20 a 50 preguntas en total, organizadas en bloques temáticos (intereses, habilidades,
  entorno laboral, valores, estilo de aprendizaje, contexto socioeconómico, etc.).
- Cada respuesta se guarda por usuario (persistencia local), para poder ver el progreso
  y los resultados anteriores.
- El resultado debe mostrarse como un sistema de "afinidad" por carrera (en %), calculado
  con una lógica de scoring por coincidencia de respuestas (esto es una SIMULACIÓN de
  precisión, no un modelo de IA real entrenado — no prometas 95% de exactitud real, solo
  un sistema de matching que se siente preciso y está preparado para mejorar cuando haya
  un backend con datos reales).
- Si el usuario activa la IA premium (punto 5), debe hacerle preguntas adicionales más
  específicas (académicas y culturales) para refinar el resultado.

═══════════════════════════════════
5. Asistente "ElijePe IA" (función paga, S/ 3.99)
═══════════════════════════════════
Al terminar el test vocacional, ofrecer un upsell de S/ 3.99 para desbloquear "ElijePe IA",
un asistente conversacional con esta personalidad e instrucciones:

[PEGAR AQUÍ TAL CUAL EL SYSTEM PROMPT QUE YA ESCRIBISTE: "Eres 'ElijePe IA'...".
Mantén el nombre tal cual y actualiza las reglas de comportamiento:
 - Quitar la regla de "Transparencia Financiera" obligatoria como eje central.
 - Mantener la opción de reportar un problema con los datos, pero usarla como entrada
   a la comunidad de usuarios en vivo (ver punto 8), no como panel de transparencia.
 - Mantener: enfoque en traslados (Ley Universitaria, convalidación), procesamiento de
   dudas/ansiedad por NLP, limitación de alcance, formato con negritas/viñetas y matriz
   de recomendación al final.]

Como es un prototipo, el cobro de S/ 3.99 puede simularse con una pantalla de pago
de prueba (mock), sin pasarela real todavía.
- Guardar el historial de chats con esta IA por usuario, para que pueda ver
  conversaciones y recomendaciones anteriores.

═══════════════════════════════════
6. Simulador de convalidación (mejorar el existente)
═══════════════════════════════════
- Mantener y mejorar el simulador ya existente: carga de récord académico, comparación
  con la malla curricular de la universidad destino.
- Agregar "reporte de brechas": lista clara de qué cursos sí convalidan, cuáles hay que
  revisar y cuáles no aplican, con estimado de ciclos restantes para egresar.

═══════════════════════════════════
7. Dashboard financiero (estilo Power BI) — solo para estudiantes que lo pidan
═══════════════════════════════════
- Panel opcional (no obligatorio en el flujo principal) con gráficos de la proyección
  financiera de la carrera elegida (uso de gráficos tipo barras/líneas, librería recharts
  o similar): pensión proyectada a 5 años, comparación entre universidades guardadas,
  evolución histórica de costos.
- Mostrar solo si el usuario es estudiante y elige activarlo desde su panel.

═══════════════════════════════════
8. Comunidad y foro
═══════════════════════════════════
- Reemplazar el panel actual de "transparencia de fuentes de datos" por una sección de
  Comunidad: foro de noticias + grupos de discusión por temas (tipo canales de Discord:
  por ejemplo "Traslados", "Becas", "Ingeniería", "Padres de familia").
- Mantener el botón de "Reportar un problema con los datos de una universidad" — pero
  ahora alimenta la comunidad: el reporte se puede ver como un hilo del foro donde otros
  usuarios opinan o confirman.

═══════════════════════════════════
9. Geolocalización
═══════════════════════════════════
- Pedir permiso de ubicación al usuario (opcional) y mostrar en el explorador de
  universidades cuáles están más cerca, con distancia aproximada y opción de ordenar
  "de más cercana a más lejana".

═══════════════════════════════════
10. Base de datos de universidades
═══════════════════════════════════
- Ampliar de 12 a un mínimo de 30, idealmente 50 universidades peruanas reales,
  licenciadas por SUNEDU, cubriendo Lima y al menos 8-10 regiones más (Arequipa,
  La Libertad, Cusco, Piura, Lambayeque, Junín, Áncash, Ica, Loreto, Puno, etc.),
  con su mezcla real de públicas y privadas.

═══════════════════════════════════
11. Footer
═══════════════════════════════════
- Rediseñar el footer con más detalle: tono alegre, motivador, con ganas de estudiar
  (no solo enlaces legales). Incluir mensaje inspiracional corto, accesos rápidos a
  test vocacional/comparador/comunidad, y los datos institucionales que ya tenías.

═══════════════════════════════════
ORGANIZACIÓN DEL CÓDIGO
═══════════════════════════════════
El código está hoy en un solo archivo App.tsx de más de 2800 líneas. Reorganízalo en
una estructura de carpetas limpia dentro de src/ separando páginas, componentes,
hooks, servicios, tipos y datos (ver la guía de estructura que ya tengo aparte).
No dividas en exceso: un componente solo se separa si se reutiliza en más de un lugar,
si es complejo por sí mismo (formularios, tarjetas, modales), o si así se evita que un
archivo crezca demasiado. Las piezas pequeñas y de un solo uso (un título, un botón
puntual de una sola pantalla) pueden quedarse dentro del archivo de su página.