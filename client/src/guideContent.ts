/** Guía de la demo: solo funciones de módulos. Nada de implementación, secretos ni otros proyectos. */

export type GuideTopic = {
  id: string;
  label: string;
  tab?: string;
  keywords: string[];
  answer: string;
};

export type GuideReply = {
  text: string;
  tab?: string;
  label?: string;
  blocked: boolean;
  topic: string | null;
};

const BLOCKED = [
  'codigo', 'código', 'source', 'github', 'gitlab', 'repositorio',
  'supabase', 'postgres', 'base de datos', 'schema', 'sql',
  'env', 'api key', 'apikey', 'token', 'secret', 'clave secreta',
  'prompt', 'cursor', 'openai', 'anthropic', 'modelo',
  'arquitectura', 'stack', 'react', 'vite', 'express', 'node',
  'como se hizo', 'cómo se hizo', 'como se program', 'cómo se program',
  'como esta hecho', 'cómo está hecho', 'como construyeron',
  'ranas', 'las ranas', 'produccion interna', 'producción interna',
  'qbim', 'prihphyt', 'password hash', 'jwt',
];

const PREFIX = /^(que es|que hace|para que sirve|para que es|como funciona|como uso|como se usa|mostrame|muestrame|muestra|explicame|explica|abrir|ir a|vamos a|ver|donde esta|donde queda)\s+/;

export const REFUSAL =
  'Eso no es parte del recorrido. Pregúntame por un módulo: alumnos, horarios, asistencia, pagos…';

export const WELCOME_ADMIN =
  'Hola. Te guío por el sitio, módulo a módulo. En cada uno te digo para qué sirve y qué trabajo a mano deja atrás: planillas, WhatsApp, listas de papel y formularios sueltos.';

export const WELCOME_STUDENT =
  'Hola. Esta es la vista del alumno. Te muestro para qué sirve cada parte y qué cambia respecto de preguntar en recepción o pagar por transferencia a ciegas.';

export const ADMIN_TOPICS: GuideTopic[] = [
  {
    id: 'resumen',
    label: 'Resumen',
    tab: 'dashboard',
    keywords: ['resumen', 'inicio', 'dashboard', 'hoy', 'pendientes', 'kpi', 'portada'],
    answer: 'Resumen es el pulso del día. Ves alumnos, quién debe y las clases de hoy. Antes el dueño cruzaba Excel, WhatsApp y la cabeza para saber cómo iba la academia. Acá está en una sola pantalla.',
  },
  {
    id: 'alumnos',
    label: 'Alumnos',
    tab: 'students',
    keywords: ['alumno', 'alumnos', 'ficha', 'perfil', 'foto', 'directorio', 'inscripcion'],
    answer: 'Alumnos es el directorio de la academia. Filtras, abres una ficha y ves datos, cinturón y pagos. Antes esas fichas vivían en papel, un Drive o mensajes al dueño. Se acaba perseguir datos por WhatsApp.',
  },
  {
    id: 'horarios',
    label: 'Horarios',
    tab: 'schedule',
    keywords: ['horario', 'horarios', 'clase', 'clases', 'cupo', 'instagram', 'grilla', 'profesor'],
    answer: 'Horarios es la grilla: día, hora, profesor, grupo y cupo. Es dinámica: cambias horarios y defines cupos, y queda lista para subir una historia a Instagram. La misma grilla alimenta el panel y la app del alumno.',
  },
  {
    id: 'asistencia',
    label: 'Asistencia',
    tab: 'attendance',
    keywords: ['asistencia', 'qr', 'escanear', 'pasar lista', 'presente', 'entrada', 'lista'],
    answer: 'Asistencia es el QR fijo de la academia, en la puerta. El alumno lo escanea al entrar: queda fecha y hora. Antes era un cuaderno o un visto en el grupo. El código no cambia.',
  },
  {
    id: 'grados',
    label: 'Grados',
    tab: 'grades',
    keywords: ['grado', 'grados', 'cinturon', 'cinturón', 'graduacion', 'evaluacion', 'cinta', 'promocion'],
    answer: 'Grados guarda ingreso, evaluación y cinturón. El camino de cintas está en la ficha. Antes eso vivía en un cuaderno o en la memoria del profesor. Acá no se pierde cuándo subió de cinta cada alumno.',
  },
  {
    id: 'eventos',
    label: 'Eventos',
    tab: 'events',
    keywords: ['evento', 'eventos', 'torneo', 'inscripcion', 'ibjjf', 'invitado', 'seminario'],
    answer: 'Eventos publica un seminario o un torneo y recibe inscritos. Antes un formulario de Google más una planilla aparte. Acá se anotan alumnos e invitados, y la categoría IBJJF se calcula sola con edad, peso, género y cinturón.',
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    tab: 'payments',
    keywords: ['finanza', 'finanzas', 'pago', 'pagos', 'mensualidad', 'cobro', 'cobros', 'plan', 'planes', 'mercadopago', 'plata'],
    answer: 'Finanzas: el sistema detecta la transferencia y marca al alumno al día. Si te pagan en efectivo o por otra vía, estás a un botón de anotarlo — desde el celular o cualquier lugar. Se acabó perseguir capturas y la hoja de morosos.',
  },
  {
    id: 'biblioteca',
    label: 'Biblioteca',
    tab: 'videos',
    keywords: ['biblioteca', 'video', 'videos', 'material', 'pdf', 'tecnica', 'técnica', 'documento'],
    answer: 'Biblioteca es el material técnico por disciplina y cinturón. El profesor publica; el alumno ve solo lo de su grado. Antes los videos se iban por WhatsApp y se perdían. Acá quedan ordenados y ves quién los miró.',
  },
  {
    id: 'comunicaciones',
    label: 'Comunicaciones',
    tab: 'communications',
    keywords: ['comunicacion', 'comunicaciones', 'aviso', 'avisos', 'cumple', 'cumpleaños', 'notificacion', 'mail'],
    answer: 'Comunicaciones manda un aviso al portal y al correo. Antes un mensaje al grupo que no le llega a todos, o un mail armado a mano. Acá escribes una vez, ves la previa y sale al alumno.',
  },
  {
    id: 'sitio',
    label: 'Sitio web',
    tab: 'website',
    keywords: ['sitio', 'web', 'portada', 'noticia', 'noticias', 'galeria', 'galería', 'hero'],
    answer: 'El sitio web se diseña a medida de tu academia. Mostramos todo lo que necesites — horarios, noticias, galería — manteniendo tu identidad. Lo editas en el panel y se publica; no hay una web paralela que encargar a alguien.',
  },
  {
    id: 'ajustes',
    label: 'Ajustes',
    tab: 'settings',
    keywords: ['ajuste', 'ajustes', 'kids', 'adultos', 'claves', 'sede', 'precio', 'precios', 'configuracion'],
    answer: 'Ajustes concentra precios kids y adultos, día de cobro y envío de accesos. Antes esas reglas vivían en un documento o en la cabeza de quien cobra. El selector de sede, arriba a la izquierda, cambia el recinto con el que estás trabajando.',
  },
  {
    id: 'demo',
    label: 'Esta demo',
    keywords: ['demo', 'recorrido', 'que puedo', 'qué puedo', 'borrar', 'candado', 'muestra', 'guia', 'guía'],
    answer: 'Esto es una demo de DP Sistemas. Toca un módulo y te explico qué automatiza. Puedes editar, pasar lista, registrar pagos y publicar. Lo de muestra no se borra, para que el recorrido se mantenga.',
  },
];

export const STUDENT_TOPICS: GuideTopic[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    tab: 'dashboard',
    keywords: ['inicio', 'home', 'reservar', 'reserva', 'clase', 'horario', 'semanal'],
    answer: 'En Inicio ves tu mensualidad y reservas la clase de la semana. Antes había que escribirle al profesor o preguntar en recepción si había cupo. Acá tu plan limita las clases; Open Mat no gasta ese cupo.',
  },
  {
    id: 'acceso',
    label: 'Asistencia',
    tab: 'access',
    keywords: ['qr', 'acceso', 'tatami', 'entrar', 'escanear', 'entrada', 'asistencia'],
    answer: 'Escaneas el QR de la academia, el de la puerta. No cambia. Al leerlo queda la fecha y la hora de tu entrada. Antes era firmar una lista o que alguien te anotara a ojo.',
  },
  {
    id: 'perfil',
    label: 'Mi perfil',
    tab: 'settings',
    keywords: ['perfil', 'foto', 'ficha', 'grado', 'contraseña', 'password', 'clave', 'datos'],
    answer: 'Mi perfil es tu ficha: cinturón, categoría, foto y clave. Antes esos datos los tenía solo la academia. Acá los ves y puedes actualizar foto o contraseña sin pedir que te los cambien a mano.',
  },
  {
    id: 'biblio-alumno',
    label: 'Biblioteca',
    tab: 'dashboard',
    keywords: ['biblioteca', 'video', 'material', 'tecnica', 'técnica'],
    answer: 'La biblioteca te deja el material de tu cinturón. Antes el profesor mandaba un video al grupo y a la semana ya no se encontraba. Acá queda ordenado y marcas lo que ya viste.',
  },
  {
    id: 'pago-alumno',
    label: 'Pago',
    tab: 'dashboard',
    keywords: ['pago', 'pagar', 'mensualidad', 'cobro', 'pendiente', 'plata', 'cuota'],
    answer: 'Si debes la mensualidad, el cobro aparece en Inicio. El sistema detecta la transferencia. Si pagaste en efectivo u otra vía, la academia lo anota en un botón, desde el celular o cualquier lugar. Se acabó mandar el comprobante por WhatsApp.',
  },
];

function fold(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

export function isBlockedQuestion(raw: string) {
  const q = ` ${fold(raw)} `;
  return BLOCKED.some((w) => {
    const f = fold(w);
    if (f.length <= 5) return q.includes(` ${f} `) || q.includes(` ${f}.`) || q.includes(` ${f},`);
    return q.includes(f);
  });
}

export function answerGuide(raw: string, mode: 'admin' | 'student'): GuideReply {
  const welcome = mode === 'admin' ? WELCOME_ADMIN : WELCOME_STUDENT;
  let q = fold(raw);
  if (!q) return { text: welcome, blocked: false, topic: null };
  if (isBlockedQuestion(raw)) return { text: REFUSAL, blocked: true, topic: null };
  q = q.replace(PREFIX, '').trim() || q;

  const topics = mode === 'admin' ? ADMIN_TOPICS : STUDENT_TOPICS;
  let best: GuideTopic | null = null;
  let score = 0;
  for (const t of topics) {
    const label = fold(t.label);
    let hits = t.keywords.filter((k) => q.includes(fold(k))).length;
    if (q === label) hits += 5;
    else if (q.includes(label)) hits += 3;
    if (hits > score) {
      score = hits;
      best = t;
    }
  }
  if (!best || score === 0) {
    return {
      text: 'Toca un módulo abajo. Te digo para qué sirve y qué forma de trabajar a mano corrige.',
      blocked: false,
      topic: null,
    };
  }
  return { text: best.answer, tab: best.tab, label: best.label, blocked: false, topic: best.id };
}
