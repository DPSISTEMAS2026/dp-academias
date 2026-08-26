import { appPath, BRAND } from './brand';
import { formatClp, founderPlanPrices, founderSlotsTotal } from './founderPlan';

export type CompanyPageId = 'faq' | 'terms' | 'privacy' | 'cookies' | 'notice';

export const COMPANY_NAV: { id: CompanyPageId; path: string; label: string }[] = [
  { id: 'notice', path: '/aviso-legal', label: 'Aviso legal' },
  { id: 'terms', path: '/terminos', label: 'Términos' },
  { id: 'privacy', path: '/privacidad', label: 'Privacidad' },
  { id: 'cookies', path: '/cookies', label: 'Cookies' },
  { id: 'faq', path: '/preguntas', label: 'Preguntas' },
];

export function companyHref(path: string) {
  return appPath(path);
}

export function isCompanyRoute(pathname = typeof window === 'undefined' ? '/' : window.location.pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  return COMPANY_NAV.some((item) => p === companyHref(item.path));
}

export function currentCompanyPage(pathname = typeof window === 'undefined' ? '/' : window.location.pathname): CompanyPageId | null {
  const p = pathname.replace(/\/+$/, '') || '/';
  return COMPANY_NAV.find((item) => p === companyHref(item.path))?.id ?? null;
}

export type DocBlock = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type CompanyDoc = {
  kicker: string;
  title: string;
  intro: string;
  blocks: DocBlock[];
  faqs?: { q: string; a: string }[];
};

const monthly = founderPlanPrices.monthly;
const semi = founderPlanPrices.semiannual;
const annual = founderPlanPrices.annual;

export function getCompanyDoc(id: CompanyPageId): CompanyDoc {
  if (id === 'faq') {
    return {
      kicker: 'Ayuda',
      title: 'Preguntas frecuentes',
      intro: `Resolvemos las dudas habituales sobre ${BRAND.legalName}, el Plan Fundador y el uso de la plataforma.`,
      blocks: [],
      faqs: [
        {
          q: '¿Quién opera este sitio?',
          a: `${BRAND.legalName}, RUT ${BRAND.rut}, empresa constituida en Chile. El correo de contacto es ${BRAND.email}.`,
        },
        {
          q: '¿El mensual, el semestral y el anual son planes distintos?',
          a: 'No. Es un solo producto, el Plan Fundador, con tres modalidades de pago. Cambia el periodo y el precio; no el alcance del servicio.',
        },
        {
          q: '¿Cómo solicito la demo?',
          a: `Escríbenos por WhatsApp o a ${BRAND.email}. Después de una reunión habilitamos un acceso de prueba por 24 horas a un correo que tú indiques.`,
        },
        {
          q: '¿Los precios incluyen IVA?',
          a: 'No. Los valores publicados son netos. Al IVA vigente en Chile se suma en la facturación.',
        },
        {
          q: '¿Qué precios rigen el primer año y después?',
          a: `Durante los primeros 12 meses desde la activación: ${formatClp(monthly.firstYearPrice)} + IVA al mes, ${formatClp(semi.firstYearPrice)} + IVA al semestre o ${formatClp(annual.firstYearPrice)} + IVA al año. Luego se aplica el valor de renovación de la misma modalidad: ${formatClp(monthly.renewalPrice)}, ${formatClp(semi.renewalPrice)} o ${formatClp(annual.renewalPrice)} + IVA, respectivamente. Semestral y anual se pagan por anticipado.`,
        },
        {
          q: '¿Hay cupos de lanzamiento?',
          a: `Sí. El Plan Fundador está pensado para las primeras ${founderSlotsTotal} academias que activen su suscripción. No publicamos un contador de cupos restantes si no proviene de un dato real.`,
        },
        {
          q: '¿Sirve si mi academia no es de artes marciales?',
          a: 'Sí. La demostración pública usa el ejemplo de artes marciales. Si haces pilates, yoga u otra disciplina, adaptamos la implementación a tu academia.',
        },
        {
          q: '¿Hay cobro por cantidad de alumnos?',
          a: 'No. El precio es el de la modalidad elegida. Si una academia supera unos 120 alumnos te avisamos para revisar operación y soporte; el alta no se corta por eso.',
        },
        {
          q: '¿Y si tengo varias sedes?',
          a: 'Las sedes no se limitan. La mensualidad de DP es por perfil de cobro: si una sede recibe en Mercado Pago de una persona y otra sede en otra cuenta, cada perfil paga su mensualidad. Si todas cobran en la misma cuenta, es una sola.',
        },
        {
          q: '¿Quién es responsable de los datos de los alumnos?',
          a: 'La academia. Tú decides qué datos cargas (fichas, pagos, asistencia, menores de edad). DP trata esos datos para prestar el servicio, según tus instrucciones y la ley chilena. El detalle está en la Política de privacidad.',
        },
        {
          q: '¿Cómo se paga el servicio de DP?',
          a: 'Te informamos el medio al activar la suscripción (transferencia u otro pactado). Los cobros a tus alumnos, si usas Mercado Pago u otro procesador, son de tu academia y se rigen por el contrato de ese proveedor.',
        },
        {
          q: '¿Puedo terminar el contrato?',
          a: 'Sí. Avísanos por escrito al correo de contacto. Las modalidades semestral y anual ya pagadas no se reembolsan salvo pacto distinto o lo que exija la ley. El mensual se puede no renovar al cierre del periodo en curso.',
        },
        {
          q: '¿Dónde están los términos y el tratamiento de datos?',
          a: 'En este mismo sitio: Aviso legal, Términos y condiciones, Política de privacidad y Cookies. El pie de página enlaza cada documento.',
        },
      ],
    };
  }

  if (id === 'notice') {
    return {
      kicker: 'Empresa',
      title: 'Aviso legal',
      intro: `Identificación de ${BRAND.legalName} como titular de este sitio y del servicio de gestión para academias.`,
      blocks: [
        {
          heading: '1. Titular',
          paragraphs: [
            `Este sitio y la plataforma de academias son operados por ${BRAND.legalName}, sociedad por acciones constituida en Chile.`,
            `RUT: ${BRAND.rut}.`,
            `Correo: ${BRAND.email}.`,
            `Sitio del producto: ${BRAND.site}.`,
            `Sitio corporativo: ${BRAND.url}.`,
          ],
        },
        {
          heading: '2. Actividad',
          paragraphs: [
            'Diseñamos, implementamos y operamos software de gestión para academias (página web, alumnos, mensualidades, horarios, asistencia, eventos, material de apoyo y funciones asociadas), bajo la marca DP Sistemas.',
          ],
        },
        {
          heading: '3. Comunicaciones',
          paragraphs: [
            `Las notificaciones relacionadas con el sitio, el contrato o los datos personales se envían a ${BRAND.email}. También puedes escribirnos por WhatsApp al número publicado en este sitio. No inventamos un domicilio comercial en esta página: el domicilio para facturación y notificaciones formales se indica en la factura electrónica o en la orden de servicio.`,
          ],
        },
        {
          heading: '4. Propiedad intelectual',
          paragraphs: [
            'El software, la marca, el logo oficial, la mascota, los textos y el diseño de este sitio pertenecen a DP o a sus licenciantes. No está permitido copiarlos, revenderlos ni presentarse como DP sin autorización escrita.',
            'Los contenidos que una academia carga (logo, fotos, textos, datos de alumnos) siguen siendo de esa academia o de quien corresponda. DP solo los aloja para prestar el servicio.',
          ],
        },
        {
          heading: '5. Contenido del sitio',
          paragraphs: [
            'La información comercial (planes, precios, cupos de lanzamiento) se actualiza en este sitio. Si un precio del sitio y el de una cotización escrita discrepan, prima lo pactado por escrito para esa academia.',
            'Los módulos que se muestran en la demostración ilustran el producto. El alcance exacto de cada implementación se confirma al activar el servicio.',
          ],
        },
        {
          heading: '6. Enlaces y terceros',
          paragraphs: [
            'Este sitio puede enlazar a WhatsApp, Mercado Pago u otros servicios. Esas plataformas tienen sus propias condiciones. DP no responde por el contenido o la disponibilidad de sitios de terceros.',
          ],
        },
        {
          heading: '7. Ley aplicable',
          paragraphs: [
            `Este aviso se rige por las leyes de ${BRAND.jurisdiction}. Para controversias relativas al sitio, los tribunales ordinarios de justicia de Chile.`,
          ],
        },
      ],
    };
  }

  if (id === 'terms') {
    return {
      kicker: 'Contrato',
      title: 'Términos y condiciones',
      intro: `Condiciones del servicio de software para academias prestado por ${BRAND.legalName}. Al solicitar la demo, contratar el Plan Fundador o usar la plataforma, aceptas estas condiciones.`,
      blocks: [
        {
          heading: '1. Partes',
          paragraphs: [
            `Proveedor: ${BRAND.legalName}, RUT ${BRAND.rut} (“DP”, “nosotros”).`,
            'Cliente: la academia, escuela o persona jurídica o natural que contrata el servicio para administrar su actividad (“el Cliente” o “la Academia”).',
            'Si actúas en nombre de una academia, declaras tener poder para obligarla.',
          ],
        },
        {
          heading: '2. Objeto',
          paragraphs: [
            'DP pone a disposición una plataforma web para la gestión de academias, que puede incluir sitio público, panel de administración, fichas de alumnos, mensualidades, horarios, cupos, asistencia, eventos, material de apoyo, perfiles de alumno y funciones que se vayan habilitando.',
            'El servicio se presta en modalidad SaaS (acceso en línea). No se entrega el código fuente ni se cede la titularidad del software.',
          ],
        },
        {
          heading: '3. Demo',
          paragraphs: [
            'El acceso de demostración es gratuito, por 24 horas salvo pacto distinto, y se habilita después de una conversación. La demo puede usar datos de ejemplo. No constituye un contrato indefinido ni garantiza cupo en el Plan Fundador.',
          ],
        },
        {
          heading: '4. Plan Fundador',
          paragraphs: [
            'Existe un único producto comercial llamado Plan Fundador, con tres modalidades de pago: mensual, semestral y anual. No son tres planes con distinto alcance.',
            `Precios de lanzamiento (netos, sin IVA), vigentes ${BRAND.legalUpdated}, durante los primeros 12 meses desde la activación: ${formatClp(monthly.firstYearPrice)} / mes; ${formatClp(semi.firstYearPrice)} / semestre; ${formatClp(annual.firstYearPrice)} / año.`,
            `Renovación, misma modalidad: ${formatClp(monthly.renewalPrice)} / mes; ${formatClp(semi.renewalPrice)} / semestre; ${formatClp(annual.renewalPrice)} / año.`,
            'Las modalidades semestral y anual se pagan por anticipado para acceder al descuento. El IVA se factura adicionalmente según la normativa chilena.',
            `El Plan Fundador está disponible para las primeras ${founderSlotsTotal} academias que activen su suscripción, mientras esa condición comercial siga publicada.`,
            'Sin pago inicial de implementación y sin cobro por cantidad de alumnos. Si una academia supera unos 120 alumnos, DP avisa para revisar operación; eso no corta el alta.',
            'Las sedes no tienen tope. La mensualidad de DP se factura por perfil de cobro (cuenta de Mercado Pago u otro medio equivalente que reciba el dinero de los alumnos). Si dos sedes cobran en cuentas distintas, cada perfil paga su mensualidad. Si cobran en la misma cuenta, es una sola.',
          ],
        },
        {
          heading: '5. Activación, facturación y mora',
          paragraphs: [
            'El contrato se activa cuando DP confirma el alta y el Cliente paga el primer periodo de la modalidad elegida, salvo que se pacte otra fecha.',
            'Las facturas se emiten a nombre del Cliente, con los datos tributarios que este entregue. Es obligación del Cliente mantener RUT, razón social y correo de facturación al día.',
            'El atraso en el pago puede suspender el acceso hasta regularizar, previa comunicación al correo registrado. La suspensión no extingue las sumas ya devengadas.',
          ],
        },
        {
          heading: '6. Obligaciones del Cliente',
          paragraphs: [
            'Usar la plataforma de forma lícita y solo para su academia.',
            'Custodiar usuarios y contraseñas. El acceso con esas credenciales se entiende realizado por el Cliente.',
            'Cargar información veraz. En el caso de menores de edad, contar con el resguardo legal que corresponda (autorización de padre, madre o tutor, y base jurídica para el tratamiento).',
            'No intentar vulnerar la seguridad del sistema ni extraer datos de otras academias.',
            'Informar a sus alumnos, apoderados y colaboradores, cuando la ley lo exija, que utiliza un sistema de gestión y quién es DP.',
          ],
        },
        {
          heading: '7. Datos personales',
          paragraphs: [
            'Respecto de los datos de alumnos, apoderados, profesores y visitantes que el Cliente ingresa, el Cliente es responsable del tratamiento. DP actúa como encargado, solo para prestar y mejorar el servicio, según la Política de privacidad y las instrucciones lícitas del Cliente.',
            'El detalle de finalidades, derechos y encargados técnicos está en /privacidad.',
          ],
        },
        {
          heading: '8. Pagos de alumnos y Mercado Pago',
          paragraphs: [
            'Si el Cliente habilita cobros a alumnos (por ejemplo Mercado Pago), el contrato de ese medio de pago es entre el Cliente y el proveedor de pagos. DP no es emisor de esos cobros ni garantiza la acreditación de transferencias de terceros.',
            'Las comisiones de pasarelas, si las hay, no están incluidas en el Plan Fundador salvo que se indique por escrito.',
          ],
        },
        {
          heading: '9. Disponibilidad y soporte',
          paragraphs: [
            'DP procura un servicio continuo, con mantenimiento y actualizaciones incluidas en el Plan Fundador. No se promete una disponibilidad del 100 %. Pueden existir ventanas de mantenimiento o incidentes de infraestructura de terceros (alojamiento, red, almacenamiento).',
            `El soporte se canaliza a ${BRAND.email} o WhatsApp en días hábiles de Chile, en horario razonable de oficina, salvo incidentes graves.`,
          ],
        },
        {
          heading: '10. Responsabilidad',
          paragraphs: [
            'DP responde por dolo o culpa grave conforme a la ley chilena. No responde por lucro cesante, pérdida de alumnado o decisiones de negocio del Cliente, ni por contenidos ilícitos que el Cliente publique.',
            'En la medida permitida por la ley, la responsabilidad total de DP por un periodo de facturación se limita a lo efectivamente pagado por el Cliente a DP en los tres meses anteriores al hecho.',
            'El Cliente es responsable de las copias de seguridad de la información que esté obligado a conservar por su actividad (por ejemplo, registros contables propios).',
          ],
        },
        {
          heading: '11. Duración y término',
          paragraphs: [
            'El contrato es de plazo indefinido y se factura por la modalidad elegida.',
            'El Cliente puede no renovar el mensual al vencimiento del periodo en curso, avisando por escrito antes de la fecha de cobro siguiente.',
            'Las modalidades semestral y anual cubren el periodo ya pagado. No hay devolución prorrateada salvo acuerdo escrito o mandato legal.',
            'DP puede terminar el contrato por incumplimiento grave, uso ilícito o impago, con aviso al correo del Cliente.',
            'Al término, DP podrá desactivar el acceso. El Cliente puede pedir una exportación razonable de sus datos durante 30 días, en el formato que el sistema permita. Después, DP podrá eliminar o anonimizar la información de esa academia, salvo obligación legal de conservar.',
          ],
        },
        {
          heading: '12. Cambios de estas condiciones',
          paragraphs: [
            'DP puede actualizar estos términos para reflejar cambios legales o del servicio. La fecha de vigencia se publica al inicio del documento. Si el cambio es sustancial, se avisará al correo de la academia. El uso continuado después de esa fecha implica aceptación, sin perjuicio de los derechos irrenunciables que la ley reconozca.',
          ],
        },
        {
          heading: '13. Ley y jurisdicción',
          paragraphs: [
            `Estos términos se rigen por las leyes de ${BRAND.jurisdiction}. Cualquier disputa se somete a los tribunales ordinarios de justicia de Chile.`,
            'Si alguna cláusula se declara inválida, el resto permanece en vigor.',
          ],
        },
      ],
    };
  }

  if (id === 'privacy') {
    return {
      kicker: 'Datos personales',
      title: 'Política de privacidad',
      intro: `${BRAND.legalName} trata datos personales conforme a la Ley N° 19.628 sobre protección de la vida privada y a las normas que la complementen, incluida la Ley N° 21.719 en lo que resulte aplicable. Esta política explica qué datos usamos, para qué y cómo puedes ejercer tus derechos.`,
      blocks: [
        {
          heading: '1. Responsable',
          paragraphs: [
            `Responsable del tratamiento de los datos del sitio comercial y de la cuenta de la academia ante DP: ${BRAND.legalName}, RUT ${BRAND.rut}, correo ${BRAND.email}.`,
            'Respecto de fichas de alumnos, apoderados, asistencia, pagos de alumnos y contenidos que la academia carga, la academia es responsable de ese banco de datos. DP es encargado: trata esos datos por cuenta de la academia para operar la plataforma.',
          ],
        },
        {
          heading: '2. Datos que recabamos',
          bullets: [
            'Contacto comercial: nombre, correo, teléfono o WhatsApp, y el mensaje que nos escribes al pedir demo o una solución.',
            'Cuenta de la academia: nombre de la academia, usuarios administradores, correo, credenciales (almacenadas de forma que permitan autenticar), plan contratado y facturación.',
            'Datos que la academia ingresa: alumnos, apoderados, documentos de identidad, fechas de nacimiento, pagos, asistencia, eventos, imágenes y material de clase.',
            'Uso del sistema: páginas visitadas, módulo usado, rol, identificador de sesión y, si hay sesión iniciada, el correo asociado, para soporte y mejora del producto.',
            'Datos técnicos mínimos: dirección IP, tipo de navegador y fecha, en registros de servidor necesarios para seguridad.',
          ],
        },
        {
          heading: '3. Finalidades',
          bullets: [
            'Atender solicitudes de demo y comerciales.',
            'Prestar, mantener y mejorar la plataforma.',
            'Facturar, cobrar y cumplir obligaciones tributarias y contables.',
            'Autenticar usuarios y prevenir abusos.',
            'Enviar avisos operativos del servicio (no publicidad de terceros).',
            'Cumplir órdenes legales o requerimientos de autoridad competente.',
          ],
        },
        {
          heading: '4. Base del tratamiento',
          paragraphs: [
            'Ejecución del contrato de servicio o medidas precontractuales (demo, cotización).',
            'Interés legítimo en la seguridad del sistema y la mejora del producto, sin prevalecer sobre tus derechos.',
            'Cumplimiento de obligaciones legales (tributarias, conservaciones mínimas).',
            'Consentimiento, cuando una funcionalidad lo pida de forma específica.',
            'La academia debe contar con su propia base jurídica para tratar datos de alumnos y, en particular, de menores de edad.',
          ],
        },
        {
          heading: '5. Encargados y transferencias',
          paragraphs: [
            'Para operar el servicio usamos proveedores de infraestructura. Hoy el producto se apoya, entre otros, en alojamiento de aplicación, base de datos, almacenamiento de archivos (imágenes y logos en almacenamiento de objetos) y, si la academia lo activa, pasarelas de pago.',
            'Esos proveedores pueden tratar datos fuera de Chile. El Cliente acepta esa transferencia como necesaria para un servicio en la nube. DP elige proveedores con medidas de seguridad habituales del rubro y contratos de encargo cuando corresponde.',
            'WhatsApp (Meta) interviene solo si tú nos escribes por ese canal; rigen además las políticas de Meta.',
          ],
        },
        {
          heading: '6. Conservación',
          paragraphs: [
            'Datos de contacto de una demo no contratada: el tiempo necesario para responder y un plazo razonable posterior, salvo que pidas su eliminación.',
            'Datos de clientes activos: mientras dure el contrato y, después, los plazos de conservación contable y tributaria de Chile.',
            'Datos de alumnos: mientras la academia los mantenga en la plataforma y hasta 30 días después del término, salvo instrucción distinta o deber legal.',
          ],
        },
        {
          heading: '7. Derechos',
          paragraphs: [
            'Puedes solicitar información, rectificación, cancelación o bloqueo de tus datos personales, y oponerte a tratamientos no necesarios para el contrato, en los términos de la ley chilena.',
            `Escríbenos a ${BRAND.email} con el asunto “Datos personales”, indicando tu nombre, RUT y qué pides. Si la solicitud se refiere a datos de un alumno, debe hacerla la academia responsable o quien acredite legitimación.`,
            'Responderemos en un plazo razonable y, cuando la ley fije uno, dentro de ese plazo. Si eres alumno o apoderado, en muchos casos el canal correcto es la propia academia.',
          ],
        },
        {
          heading: '8. Seguridad',
          paragraphs: [
            'Aplicamos acceso autenticado, aislamiento entre academias (cada una ve sus datos) y almacenamiento de archivos fuera de la base de datos en texto plano masivo. Ningún sistema es infalible: si tomamos conocimiento de un incidente que afecte datos personales, informaremos a quien corresponda según la ley y el contrato.',
          ],
        },
        {
          heading: '9. Menores de edad',
          paragraphs: [
            'La plataforma puede usarse en academias con niños y adolescentes. DP no decide recabar esos datos: los ingresa la academia. El Cliente debe cumplir la normativa sobre menores y obtener las autorizaciones que correspondan.',
            'El sitio comercial no está dirigido a que un menor contrate por sí mismo el Plan Fundador.',
          ],
        },
        {
          heading: '10. Cookies y lecturas similares',
          paragraphs: [
            'Usamos almacenamiento local y de sesión para que el sitio funcione (sesión, preferencias de vista, seguridad). El detalle está en la Política de cookies. No vendemos listas de contactos ni insertamos publicidad de terceros en este sitio.',
          ],
        },
        {
          heading: '11. Actualizaciones',
          paragraphs: [
            `Esta política rige desde el ${BRAND.legalUpdated}. Si cambia de forma relevante, actualizaremos esta página y, si corresponde, avisaremos al correo de la academia.`,
          ],
        },
      ],
    };
  }

  return {
    kicker: 'Navegación',
    title: 'Política de cookies',
    intro: 'Explicamos qué guardamos en tu navegador para que el sitio y el panel funcionen. No usamos redes publicitarias ni píxeles de anuncios en este producto.',
    blocks: [
      {
        heading: '1. Qué es una cookie o un almacenamiento local',
        paragraphs: [
          'Una cookie es un pequeño archivo que el sitio puede guardar en tu dispositivo. Este producto también usa localStorage y sessionStorage del navegador, que cumplen una función parecida: recordar sesión o preferencias sin perfilarte para publicidad.',
        ],
      },
      {
        heading: '2. Qué usamos y para qué',
        bullets: [
          'Esenciales de sesión: token de inicio de sesión, rol y usuario, para que no tengas que identificarte en cada clic.',
          'Preferencia de vista: si estás en el landing, el acceso o el panel, para no perder el contexto al recargar.',
          'Versión de almacenamiento: evita mezclar datos de una versión anterior del producto en el mismo navegador.',
          'Identificador de sesión de uso: un código temporal para agrupar clics de la misma visita y mejorar el producto (módulos más usados, errores de flujo). Si hay sesión, puede asociarse el correo de la cuenta.',
        ],
      },
      {
        heading: '3. Base y carácter necesario',
        paragraphs: [
          'Estas tecnologías son necesarias para prestar el servicio que pides (entrar al panel, mantener la academia aislada, no perder el trabajo). No hay una capa opcional de marketing en este sitio.',
          'Si bloqueas todo almacenamiento, el login y el panel pueden dejar de funcionar.',
        ],
      },
      {
        heading: '4. Conservación',
        paragraphs: [
          'La sesión del panel permanece hasta que cierras sesión o se limpia el almacenamiento. Los identificadores de pestaña se borran al cerrar el navegador. Puedes eliminar cookies y datos del sitio desde la configuración de tu navegador.',
        ],
      },
      {
        heading: '5. Terceros',
        paragraphs: [
          'Al usar WhatsApp, Mercado Pago u otros botones, esos sitios pueden instalar sus propias cookies. Rigen sus políticas.',
          'La infraestructura (alojamiento y red) puede registrar datos técnicos habituales de seguridad, independientes de las cookies del navegador.',
        ],
      },
      {
        heading: '6. Contacto',
        paragraphs: [
          `Consultas sobre cookies o datos: ${BRAND.email}. Más detalle en la Política de privacidad.`,
        ],
      },
    ],
  };
}
