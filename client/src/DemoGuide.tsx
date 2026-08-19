import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Send, X } from 'lucide-react';
import { BRAND } from './brand';
import {
  ADMIN_TOPICS,
  STUDENT_TOPICS,
  WELCOME_ADMIN,
  WELCOME_STUDENT,
  answerGuide,
} from './guideContent';
import './DemoGuide.css';

type Msg = {
  id: number;
  from: 'bot' | 'me';
  text: string;
  goTab?: string;
  goLabel?: string;
};

type Props = {
  mode: 'admin' | 'student';
  onGo: (tab: string) => void;
  moduleId?: string;
};

export default function DemoGuide({ mode, onGo, moduleId }: Props) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, from: 'bot', text: mode === 'admin' ? WELCOME_ADMIN : WELCOME_STUDENT },
  ]);
  const logRef = useRef<HTMLDivElement>(null);
  const prevModule = useRef(moduleId);
  const topics = (mode === 'admin' ? ADMIN_TOPICS : STUDENT_TOPICS).filter((t) => t.id !== 'demo');

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, open]);

  useEffect(() => {
    const prev = prevModule.current;
    prevModule.current = moduleId;
    if (!prev || !moduleId || prev === moduleId) return;
    setHidden(false);
    setOpen(true);
  }, [moduleId, mode]);

  const push = (msg: Omit<Msg, 'id'>) => {
    setMsgs((m) => [...m, { ...msg, id: Date.now() + Math.random() }]);
  };

  const minimize = () => {
    setOpen(false);
  };

  const dismiss = () => {
    setOpen(false);
    setHidden(true);
  };

  const pick = (label: string, tab?: string) => {
    const res = answerGuide(label, mode);
    push({
      from: 'bot',
      text: res.text,
      goTab: res.tab || tab,
      goLabel: res.label || label,
    });
  };

  const ask = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    push({ from: 'me', text: q });
    const res = answerGuide(q, mode);
    push({
      from: 'bot',
      text: res.text,
      goTab: res.tab,
      goLabel: res.label,
    });
    setText('');
  };

  const go = (tab: string) => {
    onGo(tab);
  };

  return (
    <div className={`dg${mode === 'student' ? ' is-student' : ''}${open ? ' is-open' : ''}${hidden ? ' is-hidden' : ''}`}>
      <div className="dg-panel" role="dialog" aria-label="Guía del sitio" aria-hidden={!open}>
        <div className="dg-hero">
          <img src={BRAND.mascotGuide} alt="" />
          <div>
            <strong>{mode === 'student' ? 'Te guío por tu vista' : 'Te guío por el sitio'}</strong>
            <p>{mode === 'student' ? 'Para qué sirve cada parte y qué deja de ser a mano.' : 'Módulo a módulo: para qué es y qué trabajo a mano automatiza.'}</p>
          </div>
          <button type="button" className="dg-close" onClick={minimize} aria-label="Minimizar guía" tabIndex={open ? 0 : -1}>
            <X size={18} />
          </button>
        </div>

        <div className="dg-log" ref={logRef}>
          {msgs.map((m) => (
            <div key={m.id} className={`dg-row ${m.from}`}>
              {m.from === 'bot' && <img className="dg-face" src={BRAND.mascotGuide} alt="" />}
              <div className={`dg-msg ${m.from}`}>
                <p>{m.text}</p>
                {m.from === 'bot' && m.goTab && m.goLabel && (
                  <button type="button" className="dg-go" onClick={() => go(m.goTab!)} tabIndex={open ? 0 : -1}>
                    Ir a {m.goLabel} <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="dg-topics" aria-label="Módulos">
          {topics.map((t) => (
            <button key={t.id} type="button" onClick={() => pick(t.label, t.tab)} tabIndex={open ? 0 : -1}>
              {t.label}
            </button>
          ))}
        </div>

        <form className="dg-form" onSubmit={(e) => { e.preventDefault(); ask(text); }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pregunta por un módulo…"
            maxLength={180}
            aria-label="Pregunta"
            tabIndex={open ? 0 : -1}
          />
          <button type="submit" aria-label="Enviar" tabIndex={open ? 0 : -1}><Send size={16} /></button>
        </form>
      </div>

      <div className="dg-fab-wrap">
        <button
          type="button"
          className="dg-dismiss"
          onClick={dismiss}
          aria-label="Ocultar guía"
          tabIndex={open || hidden ? -1 : 0}
        >
          <X size={14} />
        </button>
        <button
          type="button"
          className="dg-fab"
          onClick={() => setOpen(true)}
          aria-label="Abrir guía del sitio"
          tabIndex={open || hidden ? -1 : 0}
        >
          <span className="dg-hint">{mode === 'student' ? '¿Te guío por tu vista?' : '¿Te guío por el sitio?'}</span>
          <img src={BRAND.mascotGuide} alt="" />
        </button>
      </div>
    </div>
  );
}
