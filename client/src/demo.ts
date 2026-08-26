/** En el producto (clientes de pago) se puede borrar con confirmación. La vitrina demo usa VITE_DEMO_LOCK=true. */
export const DEMO_LOCK = import.meta.env.VITE_DEMO_LOCK === 'true';

export const DEMO_MSG = {
  students: 'En la demo no se pueden borrar alumnos. El recorrido usa el mismo seed.',
  classes: 'En la demo no se pueden borrar clases del horario. Sí se pueden editar o añadir.',
  videos: 'En la demo no se puede borrar el material. Sí se puede publicar uno nuevo.',
  website: 'En la demo no se borra el contenido del sitio (videos, noticias o galería).',
  events: 'En la demo no se borra el evento de muestra. Sí se puede editar, publicar e inscribir.',
} as const;

export function demoAlert(kind: keyof typeof DEMO_MSG) {
  window.alert(DEMO_MSG[kind]);
}
