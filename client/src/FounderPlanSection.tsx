import { useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { useReducedMotion, AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CalendarDays,
  CircleUser,
  Globe,
  GraduationCap,
  Headphones,
  Infinity as InfinityIcon,
  Ticket,
  Users,
  Wallet,
} from 'lucide-react';
import { BRAND, whatsappHref, appPath } from './brand';
import {
  FOUNDER_CYCLES,
  cycleBadge,
  formatClp,
  founderConsultMessage,
  founderPlanEnabled,
  founderPlanPrices,
  type BillingCycle,
} from './founderPlan';
import './FounderPlanSection.css';

const INCLUDES = [
  { icon: Globe, text: 'Página web personalizada para la academia.' },
  { icon: Users, text: 'Gestión de alumnos y mensualidades.' },
  { icon: CalendarDays, text: 'Horarios, cupos y asistencia.' },
  { icon: Ticket, text: 'Eventos e inscripciones.' },
  { icon: BookOpen, text: 'Material de apoyo.' },
  { icon: CircleUser, text: 'Perfil para cada alumno.' },
  { icon: Headphones, text: 'Soporte y actualizaciones.' },
  { icon: GraduationCap, text: 'Implementación incluida.' },
  { icon: Wallet, text: 'Sin pago inicial.' },
  { icon: InfinityIcon, text: 'Sin cobros por cantidad de alumnos dentro del Plan Academia.' },
];

type Props = {
  onLogin: () => void;
};

export default function FounderPlanSection({ onLogin }: Props) {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const reduceMotion = useReducedMotion();
  const radios = useRef<Array<HTMLButtonElement | null>>([]);
  const price = founderPlanPrices[cycle];
  const featured = cycle === 'annual';
  const loginHref = appPath('/acceso');

  const selectCycle = useCallback((id: BillingCycle, index: number) => {
    setCycle(id);
    radios.current[index]?.focus();
  }, []);

  const onCycleKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const i = FOUNDER_CYCLES.findIndex((item) => item.id === cycle);
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (i + 1) % FOUNDER_CYCLES.length;
      selectCycle(FOUNDER_CYCLES[next].id, next);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = (i - 1 + FOUNDER_CYCLES.length) % FOUNDER_CYCLES.length;
      selectCycle(FOUNDER_CYCLES[next].id, next);
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectCycle(FOUNDER_CYCLES[0].id, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      selectCycle(FOUNDER_CYCLES[2].id, 2);
    }
  };

  const fade = {
    duration: reduceMotion ? 0.01 : 0.22,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <section className="dp-section dp-plans" id="planes" aria-labelledby="dp-plans-title">
      <div className="dp-section-wide">
        <header className="dp-plans-head">
          <div className="dp-kicker">Planes y precios</div>
          <h2 id="dp-plans-title">Un plan claro para comenzar</h2>
          <p className="dp-lead">
            Estamos creciendo junto a nuestras primeras academias. Por eso creamos el Plan Academia: una propuesta especial de lanzamiento que incluye la implementación, la página web y toda la plataforma de gestión.
          </p>
        </header>

        <div
          className="dp-plan-cycles"
          role="radiogroup"
          aria-label="Modalidad de pago"
          onKeyDown={onCycleKey}
        >
          {FOUNDER_CYCLES.map((item, index) => {
            const selected = item.id === cycle;
            return (
              <button
                key={item.id}
                ref={(el) => { radios.current[index] = el; }}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                className={`dp-plan-cycle${selected ? ' is-selected' : ''}${item.id === 'annual' ? ' is-featured' : ''}`}
                onClick={() => setCycle(item.id)}
              >
                <span>{item.label}</span>
                {item.id === 'annual' ? <em>Mejor precio</em> : null}
              </button>
            );
          })}
        </div>

        <div className="dp-plan-layout">
          <article className={`dp-plan-card${featured ? ' is-best' : ''}`}>
            <div className="dp-plan-card-top">
              <div className="dp-plan-brand">
                <img src={BRAND.logoLight} alt="DP Sistemas y Automatizaciones" />
                <div>
                  <div className="dp-plan-label">Plan Academia</div>
                  {founderPlanEnabled ? (
                    <p className="dp-plan-slots">Cupos limitados</p>
                  ) : null}
                </div>
              </div>
            </div>

            <h3>Web + plataforma de gestión para tu academia</h3>
            <p className="dp-plan-intro">
              Todo lo que necesitas para administrar tu academia y entregar una mejor experiencia a tus alumnos.
            </p>

            <div className="dp-plan-price-block" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={cycle}
                  className="dp-plan-price-swap"
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={fade}
                >
                  <div className={`dp-plan-badge${featured ? ' is-best' : ''}`}>{cycleBadge(cycle)}</div>
                  <p className="dp-plan-price">
                    <span className="dp-plan-amount">{formatClp(price.firstYearPrice)}</span>
                    <span className="dp-plan-iva">+ IVA / {price.period}</span>
                  </p>
                  <p className="dp-plan-term">{price.billingDescription}</p>
                  <p className="dp-plan-renew">
                    Luego {formatClp(price.renewalPrice)} + IVA / {price.period}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <h4 className="dp-plan-includes-title">Qué incluye</h4>
            <ul className="dp-plan-includes">
              {INCLUDES.map((item) => (
                <li key={item.text}>
                  <item.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="dp-plan-actions">
              <a
                className="dp-btn dp-btn-solid dp-btn-lg"
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Solicitar acceso a la demo
              </a>
              <a className="dp-btn dp-btn-line dp-btn-lg" href={loginHref} onClick={(event) => {
                event.preventDefault();
                onLogin();
              }}>
                Iniciar sesión
              </a>
            </div>

            <p className="dp-plan-legal">
              Los valores no incluyen IVA. El precio de lanzamiento se aplica durante los primeros 12 meses desde la activación. Posteriormente se cobra el valor de renovación correspondiente a la modalidad seleccionada. Los planes semestral y anual se pagan anticipadamente para acceder al descuento.
            </p>
          </article>

          <aside className="dp-plan-soon">
            <div className="dp-kicker">Próximamente</div>
            <h3>Nuevas soluciones para academias en crecimiento</h3>
            <p>
              Estamos preparando nuevas alternativas para academias con múltiples sedes, equipos más grandes e integraciones especiales.
            </p>
            <div className="dp-soon-mascot">
              <p className="dp-soon-bubble">¿Tu academia necesita algo diferente? Conversemos.</p>
              <img src={BRAND.mascotGuide} alt="Mascota de DP Sistemas" />
            </div>
            <a
              className="dp-btn dp-btn-solid"
              href={whatsappHref(founderConsultMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar una solución
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
