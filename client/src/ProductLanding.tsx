import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Ticket,
  LayoutDashboard,
  Mail,
  MonitorSmartphone,
  ScanLine,
  Smartphone,
  Users,
  Video,
} from 'lucide-react';
import { BRAND, whatsappHref, asset } from './brand';
import { MpLogo } from './MpLogo';
import { OpenEventsCard } from './EventPublic';
import { AnimatePresence, motion } from 'framer-motion';
import './ProductLanding.css';

const SLIDES = [
  {
    image: asset('landing/01-recepcion.jpg'),
    kicker: 'Recepción',
    title: 'El control, desde el escritorio de la academia.',
    text: 'Alumnos, pagos y asistencia en el mismo lugar donde entra la clase.',
  },
  {
    image: asset('landing/02-material.jpg'),
    kicker: 'Material',
    title: 'El material de la clase, en el teléfono.',
    text: 'Publicas una vez. El alumno lo encuentra ordenado, cuando lo necesita.',
  },
  {
    image: asset('landing/03-sala.jpg'),
    kicker: 'Sala',
    title: 'La misma información, en la palma de la mano.',
    text: 'Horarios, cupos y fichas para quien da la clase y quien administra.',
  },
  {
    image: asset('landing/04-alumno.jpg'),
    kicker: 'Alumno',
    title: 'Reservar, pagar y entrar, desde el teléfono.',
    text: 'Entra a la página de la academia. Sin preguntar en recepción ni mandar el comprobante a mano.',
  },
  {
    image: asset('landing/05-acceso.jpg'),
    kicker: 'Asistencia',
    title: 'Entrada sin lista de papel.',
    text: 'El alumno escanea un QR. El sistema registra la asistencia.',
  },
];

const LAYERS = [
  { icon: LayoutDashboard, title: 'Panel de administración', text: 'Desde aquí operas la academia: alumnos, cobros y horarios.' },
  { icon: MonitorSmartphone, title: 'Página web', text: 'La web pública de tu academia, con tu identidad. El alumno también entra desde el celular.' },
  { icon: Smartphone, title: 'Alumno', text: 'Reserva, paga y ve su ficha en la página, desde el celular.' },
];

const SERVICES = [
  { icon: Clock3, title: 'Horarios', text: 'Armas la grilla una vez. Sirve para el panel, la página y para subir una historia a Instagram.' },
  { icon: Users, title: 'Alumnos', text: 'Un directorio con la ficha de cada persona: datos, pagos y quién es el apoderado.' },
  { icon: ScanLine, title: 'Asistencia', text: 'Tus alumnos escanean un QR al asistir. El sistema registra la asistencia.' },
  { icon: CreditCard, title: 'Finanzas', text: 'El sistema detecta la transferencia. Si pagan en efectivo u otra vía, lo anotas en un botón.' },
  { icon: Video, title: 'Biblioteca', text: 'Videos y documentos de la clase, publicados una vez y ordenados para el alumno.' },
  { icon: Award, title: 'Progreso', text: 'El nivel de cada alumno queda en su ficha. No se pierde cuándo avanzó.' },
  { icon: Ticket, title: 'Eventos', text: 'Seminario, torneo o workshop: inscripción y pago, sin un formulario aparte.' },
  { icon: Mail, title: 'Comunicaciones', text: 'Escribes un aviso y llega a la página y al correo. Una vez, a todos.' },
  { icon: MonitorSmartphone, title: 'Página web', text: 'La página de tu academia, con tu identidad. Mostramos lo que necesites.' },
];

const STORIES = [
  {
    kicker: 'Panel',
    title: 'El panel de administración de tu academia.',
    text: 'Alumnos, cobros y horarios en un solo lugar. Quien da la clase y quien administra ven lo mismo.',
    mockup: asset('landing/mockups/alumnos.png') + '?v=2',
  },
  {
    kicker: 'Alumno',
    title: 'El alumno entra desde el celular.',
    text: 'Reserva, paga y ve su ficha en la página de la academia. Sin preguntar en recepción.',
    mockup: asset('landing/mockups/sitio-web.png') + '?v=2',
  },
  {
    kicker: 'Página web',
    title: 'La página web de tu academia, con tu identidad.',
    text: 'Horarios, novedades y lo que necesites mostrar. Lo editas en el panel y se publica.',
    mockup: asset('landing/mockups/sitio-web.png') + '?v=2',
  },
  {
    kicker: 'Horarios',
    title: 'Cambias clases y cupos: el horario queda listo.',
    text: 'La grilla alimenta el panel, la página y una historia para Instagram.',
    mockup: asset('landing/mockups/horarios.png') + '?v=2',
  },
  {
    kicker: 'Alumnos',
    title: 'La ficha de cada persona, en un directorio.',
    text: 'Datos, pagos y apoderados. Se acaba perseguir información por WhatsApp.',
    mockup: asset('landing/mockups/alumnos.png') + '?v=2',
  },
  {
    kicker: 'Asistencia',
    title: 'Tus alumnos escanean un QR al asistir.',
    text: 'El sistema registra la asistencia. Sin lista de papel en la puerta.',
    mockup: asset('landing/mockups/alumnos.png') + '?v=2',
  },
  {
    kicker: 'Finanzas',
    title: 'El sistema detecta la transferencia.',
    text: 'Si pagan en efectivo u otra vía, lo anotas en un botón: desde el celular o cualquier lugar.',
    mp: true,
    mockup: asset('landing/mockups/pagos.png') + '?v=2',
  },
  {
    kicker: 'Biblioteca',
    title: 'El material de la clase, ordenado.',
    text: 'El profesor publica una vez. El alumno lo encuentra. No se pierde en el grupo.',
    mockup: asset('landing/mockups/sitio-web.png') + '?v=2',
  },
  {
    kicker: 'Progreso',
    title: 'El nivel de cada alumno, en su ficha.',
    text: 'Queda registrado cuándo avanzó. No vive en un cuaderno ni en la memoria de alguien.',
    mockup: asset('landing/mockups/grados.png') + '?v=2',
  },
  {
    kicker: 'Eventos',
    title: 'Inscripción a un evento, sin formulario aparte.',
    text: 'Alumnos e invitados se anotan y pagan acá. Seminario, torneo o workshop.',
    mp: true,
    mockup: asset('landing/mockups/eventos.png') + '?v=2',
  },
  {
    kicker: 'Comunicaciones',
    title: 'Un aviso a la página y al correo.',
    text: 'Escribes una vez y llega a todos. No un mensaje al grupo que no le llega a la mitad.',
    mockup: asset('landing/mockups/comunicaciones.png') + '?v=2',
  },
];

function StoryDeck() {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const [dir, setDir] = useState(1);
  const startX = useRef<number | null>(null);
  const story = STORIES[i];
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fade = {
    duration: reduceMotion ? 0.01 : 0.42,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  const step = useCallback((nextDir: number) => {
    setDir(nextDir);
    setI((cur) => (cur + nextDir + STORIES.length) % STORIES.length);
  }, []);

  useEffect(() => {
    if (hold) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const timer = window.setInterval(() => step(1), 6500);
    return () => window.clearInterval(timer);
  }, [hold, step]);

  return (
    <div
      className="dp-story"
      aria-roledescription="carrusel"
      aria-label="Plataforma"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onTouchStart={(e) => { startX.current = e.touches[0].clientX; setHold(true); }}
      onTouchEnd={(e) => {
        if (startX.current !== null) {
          const delta = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(delta) > 40) step(delta < 0 ? 1 : -1);
        }
        startX.current = null;
        setHold(false);
      }}
    >
      <div className="dp-story-copy">
        <article className="dp-fit-inner" aria-live="polite">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={story.kicker}
              className="dp-story-swap"
              custom={dir}
              initial={{ opacity: 0, x: dir * 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -18 }}
              transition={fade}
            >
              <div className="dp-story-text">
                <div className="dp-kicker">{story.kicker}</div>
                <h2>{story.title}</h2>
                <p>{story.text}</p>
              </div>
              <div className="dp-story-mock" aria-hidden="true">
                <img src={story.mockup} alt="" />
              </div>
              <div className="dp-story-cta">
                {'mp' in story && story.mp ? <MpLogo height={36} /> : null}
                <a
                  className="dp-btn dp-btn-solid"
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escríbenos <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </article>
        <div className="dp-deck-nav">
          <button type="button" className="dp-deck-arrow" aria-label="Anterior" onClick={() => step(-1)}>
            <ChevronLeft size={18} />
          </button>
          <span className="dp-deck-name">{story.kicker}</span>
          <button type="button" className="dp-deck-arrow" aria-label="Siguiente" onClick={() => step(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = {
  onEnter: () => void;
  apiUrl?: string;
};

export default function ProductLanding({ onEnter, apiUrl }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback((direction: number) => {
    setIndex((current) => (current + direction + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('dp-on-landing');
    return () => document.documentElement.classList.remove('dp-on-landing');
  }, []);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const timer = window.setInterval(() => go(1), 7000);
    return () => window.clearInterval(timer);
  }, [paused, go]);

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 48) go(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const slide = SLIDES[index];

  return (
    <div className="dp-landing">
      <nav className="dp-nav">
        <a className="dp-nav-brand" href={BRAND.url} target="_blank" rel="noreferrer">
          <img src={BRAND.logoMark} alt="DP Sistemas" />
          <div>
            <div className="dp-brand-name">DP Sistemas</div>
            <div className="dp-brand-sub">y Automatizaciones</div>
          </div>
        </a>
        <div className="dp-nav-actions">
          <a className="dp-nav-link" href="#plataforma">Qué es</a>
          <a className="dp-btn dp-btn-ghost" href={whatsappHref()} target="_blank" rel="noopener noreferrer">Solicitar acceso</a>
        </div>
      </nav>

      <section
        className="dp-slider"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carrusel"
        aria-label="Módulos de la plataforma"
      >
        {SLIDES.map((item, i) => (
          <div
            key={item.image}
            className={`dp-slide${i === index ? ' is-active' : ''}`}
            style={{ backgroundImage: `url(${item.image})` }}
            aria-hidden={i !== index}
          />
        ))}
        <div className="dp-slide-shade" />
        <div className="dp-slide-copy" aria-live="polite">
          <div className="dp-kicker">{slide.kicker}</div>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
        </div>
        <div className="dp-slider-ui">
          <div className="dp-slide-count">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <i />
            <span>{String(SLIDES.length).padStart(2, '0')}</span>
          </div>
          <div className="dp-slider-controls">
            <button className="dp-slider-btn" type="button" aria-label="Situación anterior" onClick={() => go(-1)}>
              <ChevronLeft size={18} />
            </button>
            <div className="dp-dots">
              {SLIDES.map((item, i) => (
                <button
                  key={item.kicker}
                  className={`dp-dot${i === index ? ' is-active' : ''}`}
                  type="button"
                  aria-label={item.kicker}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <button className="dp-slider-btn" type="button" aria-label="Situación siguiente" onClick={() => go(1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="dp-section dp-platform" id="plataforma">
        <div className="dp-section-wide">
          <div className="dp-platform-head">
            <div>
              <div className="dp-kicker">Plataforma</div>
              <h2>Panel de administración y página web para tu academia.</h2>
            </div>
            <p className="dp-lead">
              Esta demo es de academias de artes marciales. Si haces pilates, yoga u otra disciplina, te ayudamos de la misma manera.
            </p>
          </div>

          <StoryDeck />
        </div>
      </section>

      {apiUrl ? <OpenEventsCard apiUrl={apiUrl} variant="landing" /> : null}

      <section className="dp-section dp-access-wrap" id="acceso">
        <div className="dp-access">
          <div className="dp-access-status">Sistema privado · 24 h</div>
          <h2>Hablemos de tu academia.</h2>
          <p className="dp-lead">
            Después de una reunión habilitamos el demo 24 horas a un correo. Esta demo es artes marciales; si haces pilates, yoga u otra disciplina, te ayudamos de la misma manera.
          </p>
          <div className="dp-access-actions">
            <a className="dp-btn dp-btn-solid dp-btn-lg" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
              Escribir a DP Sistemas <ArrowRight size={18} />
            </a>
            <button className="dp-btn dp-btn-line" type="button" onClick={onEnter}>
              Ya me habilitaron el acceso
            </button>
          </div>
          <p className="dp-access-note">{BRAND.email}</p>
        </div>
      </section>

      <footer className="dp-footer">
        <a className="dp-footer-brand" href={BRAND.url} target="_blank" rel="noreferrer">
          <img src={BRAND.logoMark} alt="DP Sistemas" />
          <div>
            <strong>DP Sistemas</strong>
            <span>y Automatizaciones</span>
          </div>
        </a>
        <a className="dp-btn dp-btn-solid" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
          Contacto <ArrowRight size={16} />
        </a>
      </footer>
    </div>
  );
}
