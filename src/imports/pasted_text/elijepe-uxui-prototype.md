Act como un diseñador UX/UI Senior especializado en Sistemas Web Gubernamentales y EdTech. Genera un prototipo funcional interactivo de alta fidelidad basado en los wireframes de baja fidelidad provistos para la plataforma oficial "ElijePe" (Orientación Estudiantil - Gobierno del Perú, 2026).

--- LINEAMIENTOS VISUALES GENERALES ---
- Nombre de la Marca/Logo: "ElijePe" (Tipografía limpia, institucional, moderna).
- Paleta de Colores: Azul Principal (rgb(0, 89, 255)), Blanco Puro para fondos, Gris Claro (#F4F6F9) para tarjetas y fondos secundarios, y acentos institucionales mínimos (Rojo Perú para sutiles marcas del gobierno en footer/header).
- Estética: Familiar, limpia, estructurada, muy dinámica y simple. Tipografía Sans-Serif legible (Inter o Roboto). Iconografía lineal consistente.
- Componentes comunes: Cada página debe incluir un Header superior idéntico (Logo ElijePe a la izquierda; links a "Explorar", "Test Vocacional", "Simulador"; a la derecha Avatar/Name de usuario con dropdown) y un Footer idéntico e institucional con datos del Ministerio de Educación, enlaces legales y contacto.

--- ARQUITECTURA DE PÁGINAS Y FLUJO INTEGRADO (CORREGIDO) ---

PÁGINA 1: HOME PRINCIPAL (Basada en image_49dd2b.png)
- Sección Hero: Título central "Encuentra tu futuro con datos reales". Subtexto sobre universidades licenciadas y costos en Perú. Barra de búsqueda centralizada redondeada.
- Tres Botones Segmentados (Corrección de etiquetas del wireframe): Mostrar tres botones claros en píldora: [Soy Egresado], [Quiero Trasladarme], [Soy Padre de Familia].
- Sección "ENTENDEMOS TU SITUACIÓN": Tres tarjetas grises con iconos y descripción:
  1. Recién Egresado (Botón de acción: "Ver Test Vocacional ->")
  2. Universitario Traslado (Botón de acción: "Simulador de créditos ->")
  3. Padre de Familia (Botón de acción: "Comparador de Uni ->")
- Sección "INSTITUCIONES DESTACADAS": Tres tarjetas ordenadas que muestran previsualizaciones de universidades con el texto "INFORMACIÓN".

PÁGINA 2: EXPLORAR Y BUSCADOR AVANZADO (Basada en image_49dd63.png)
- Layout: Grid de dos columnas. 
  * Columna Izquierda (Sidebar de Filtros Fijo): Buscador superior, Slider interactivo de Presupuesto (S/. 0 a S/. 100,000), Dropdowns estilizados para: Tipo de Institución (Pública/Privada), Localidad (Región/Distrito), Modalidad (Presencial/Semipresencial) y Nivel Académico. Botones [Aplicar Filtros] en color rgb(0, 89, 255) y [Limpiar].
  * Columna Derecha (Resultados): Título "RESULTADO: UNIVERSIDADES ENCONTRADAS". Grid de 3x3 tarjetas de universidades. Cada tarjeta tiene una etiqueta clara en la parte superior derecha ([Pública] o [Privada]), foto de la institución, "Nombre de la U" y un botón estilizado [Ver más].
- Parte inferior: Botón centrado [Mostrar más].

PÁGINA 3: MODULO TEST VOCACIONAL IA (Basada en image_49ddef.png)
- Layout: Caja de cuestionario centralizado para reducir la ansiedad del estudiante.
- Contenido Izquierdo: Mensaje de bienvenida: "Hola, empecemos tu camino. Nuestro motor de IA analizará tus intereses...".
- Indicador de Progreso: Barra de carga estilizada que marca "Paso 1: Intereses y pasiones | 25% COMPLETADO".
- Zona Interactiva: Grid de 6 tarjetas seleccionables con iconos vectoriales minimalistas y la palabra "Tecnología", "Ciencias", "Artes", etc. (Corregir repetición del wireframe para mostrar variedad de áreas).
- Botones de Control: En la base, botón secundario [Omitir por ahora] a la izquierda y botón primario destacado [Continuar paso 2 ->] a la derecha.
- Sidebar Derecho: Tarjeta flotante "AYUDA + IA" con texto explicativo, un botón para [Sincronizar datos] y un placeholder gráfico que dice "Visualiza tu futuro ideal y alcánzalo".

PÁGINA 4: SIMULADOR DE CONVALIDACIÓN (Basada en image_49de2b.png)
- Cabecera del Módulo: Título "Simulador de convalidación" con instrucciones claras para arrastrar el récord académico en PDF verificado por SUNEDU.
- Zona de Carga (Drag & Drop): Recuadro grande punteado con icono de nube "Sube tu Récord Académico - Arrastra tu PDF aquí o haz clic para buscar".
- Panel de Resultados Dividido (Dashboard):
  * Sub-columna Izquierda: Tarjeta para volver a subir archivo, Tarjeta de "RESUMEN PROYECTADO" que muestra en bloques numéricos grandes: "14 Cursos Convalidados", "~4 Ciclos Restantes" y un anillo de progreso circular que indica "Progreso de Grado: 42%". Botón inferior para [Descargar reporte PDF].
  * Sub-columna Derecha (Tabla de Análisis Completa): Tabla interactiva estructurada con columnas: CÓDIGO, CURSO DE DESTINO, CRÉDITOS, ESTADO. Los estados deben usar Badges de color pastel: "Convalidado" (Verde), "Revisar" (Amarillo), "No aplica" (Rojo).
- Fila de KPIs Inferior: Tres tarjetas horizontales que consolidan: [45 Créditos validados], [7 Ciclos estimados] y [03 Instituciones compatibles].

--- NUEVAS PÁGINAS CREADAS PARA FLUJO COMPLETO (CORRECCIÓN DE CONECTIVIDAD) ---

PÁGINA 5: DETALLE DE LA UNIVERSIDAD Y PANEL COMPARATIVO (Página faltante de conexión)
- Diseña la vista cuando el usuario hace clic en [Ver más] desde la Página 2 o 4.
- Sección Superior: Nombre de la Universidad destacado, estado de licenciamiento de SUNEDU, y un botón flotante permanente: [Añadir al Panel Comparativo].
- Sección Central: Pestañas navegables entre: "Malla Curricular", "Costos e Incremento Anual Histórico" y "Tasas de Empleabilidad".
- Componente Comparador Flotante: Un contenedor en la parte inferior de la pantalla que se activa al seleccionar universidades, mostrando las miniaturas de hasta 3 instituciones elegidas y un botón azul brillante: [Comparar Ahora].

Genera este sistema web manteniendo consistencia absoluta en espaciados (múltiplos de 8px), radios de curvatura suaves (8px para tarjetas, 24px para botones tipo píldora) y con un diseño interactivo que conecte lógicamente los clics entre la Home, el Buscador, la IA Vocacional y el Simulador PDF.