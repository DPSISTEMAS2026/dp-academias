import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Save, Trash2, X } from 'lucide-react';
import type { ClassAudience, ClassSlot } from './types';
import { CLASS_NAMES, DAYS, TEACHERS, defaultCapacity, findConflicts, isOpenMat, nextFreeSlot } from './data/schedule';
import { DEMO_LOCK, DEMO_MSG } from './demo';
import { BRAND } from './brand';
import PanelTabs from './PanelTabs';
import './SchedulePanel.css';
import './panel-shell.css';

type Props = {
  slots: ClassSlot[];
  sedes: { id: number; name: string }[];
  activeSedeId: number | null;
  saving: boolean;
  onSave: (slots: ClassSlot[]) => void;
};

export default function SchedulePanel({ slots, sedes, activeSedeId, saving, onSave }: Props) {
  const [draft, setDraft] = useState<ClassSlot[]>(slots);
  const [saveHint, setSaveHint] = useState('');
  const [newIds, setNewIds] = useState<string[]>([]);
  const [flash, setFlash] = useState('');
  const [tab, setTab] = useState<'clases' | 'pieza'>('clases');
  const [posterOpen, setPosterOpen] = useState(false);
  const [compactPoster, setCompactPoster] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 860,
  );
  const newRowRef = useRef<HTMLTableRowElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraft(slots);
    setNewIds([]);
  }, [slots]);

  const conflicts = useMemo(() => findConflicts(draft), [draft]);
  const newestId = newIds[0] || '';

  useEffect(() => {
    if (!newestId) return;
    const row = newRowRef.current;
    const input = nameInputRef.current;
    row?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    input?.focus();
    input?.select();
  }, [newestId]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 859px)');
    const apply = () => setCompactPoster(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!posterOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPosterOpen(false); };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('ig-poster-open');
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('ig-poster-open');
      document.body.style.overflow = prev;
    };
  }, [posterOpen]);

  const setRow = (id: string, patch: Partial<ClassSlot>) => {
    setDraft((prev) => prev.map((row) => {
      if (row.id !== id) return row;
      const next = { ...row, ...patch };
      if (patch.name !== undefined && isOpenMat(patch.name)) next.capacity = null;
      return next;
    }));
  };

  const addRow = () => {
    const created = {
      ...nextFreeSlot(draft, activeSedeId || sedes[0]?.id || 1, draft.length + 1),
      name: '',
    };
    setDraft((prev) => [created, ...prev]);
    setNewIds((prev) => [created.id, ...prev]);
    setFlash(`Clase ${draft.length + 1} añadida arriba: ${created.day} ${created.startTime}–${created.endTime}. Completa el nombre y guarda.`);
    setSaveHint('');
  };

  const removeRow = (id: string) => {
    if (DEMO_LOCK && !String(id).startsWith('tmp-')) {
      setSaveHint(DEMO_MSG.classes);
      return;
    }
    setDraft((prev) => prev.filter((row) => row.id !== id));
    setNewIds((prev) => prev.filter((nid) => nid !== id));
  };

  const handleSave = () => {
    if (draft.some((row) => !row.name.trim())) {
      setSaveHint('Hay una clase sin nombre. Complétala o elimínala.');
      return;
    }
    if (conflicts.size > 0) {
      setSaveHint('Hay clases que se pisan. Ajústalas antes de guardar.');
      return;
    }
    setSaveHint('');
    setFlash('');
    onSave(draft);
  };

  const posterDays = DAYS;
  const timeRows = useMemo(() => {
    const uniq = Array.from(new Set(draft.map((s) => `${s.startTime}-${s.endTime}`)));
    return uniq.sort();
  }, [draft]);

  return (
    <div className="sch-wrap">
      <section className="sch-card">
        <header className="sch-head">
          <div>
            <div className="sch-kicker">Panel administrativo</div>
            <h2>Gestión de horarios</h2>
            <p className="sch-count">{draft.length} clase{draft.length === 1 ? '' : 's'} en la grilla</p>
          </div>
          <div className="sch-actions">
            <button type="button" className="sch-btn" onClick={addRow}>
              <Plus size={15} /> Nueva clase
            </button>
            <button type="button" className="sch-btn primary" disabled={saving} onClick={handleSave}>
              <Save size={15} /> Guardar horario
            </button>
          </div>
        </header>
        {flash && <div className="sch-flash">{flash}</div>}
        {conflicts.size > 0 && (
          <div className="sch-banner">
            {conflicts.size} clase{conflicts.size === 1 ? '' : 's'} se pisan (misma sede o mismo profesor). No se puede guardar así.
          </div>
        )}
        {saveHint && <div className="sch-banner">{saveHint}</div>}
        <PanelTabs
          name="horarios"
          value={tab}
          onChange={(id) => setTab(id as typeof tab)}
          items={[{ id: 'clases', label: 'Clases' }, { id: 'pieza', label: 'Historia' }]}
        />
        {tab === 'clases' && (
        <div className="sch-table-wrap">
          <table className="sch-table">
            <thead>
              <tr>
                <th>Clase</th>
                <th>Día</th>
                <th>Horario</th>
                <th>Profesor</th>
                <th>Sede</th>
                <th>Grupo</th>
                <th>Cupo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="sch-add-row">
                <td colSpan={8}>
                  <button type="button" onClick={addRow}>
                    <Plus size={16} /> Añadir clase al horario
                  </button>
                </td>
              </tr>
              {draft.length === 0 && (
                <tr>
                  <td colSpan={8}>Todavía no hay clases. Usa el botón de arriba.</td>
                </tr>
              )}
              {draft.map((row) => {
                const isNew = newIds.includes(row.id);
                return (
                <tr
                  key={row.id}
                  ref={row.id === newestId ? newRowRef : undefined}
                  className={`${conflicts.has(row.id) ? 'is-conflict' : ''} ${isNew ? 'is-new' : ''}`.trim()}
                  title={(conflicts.get(row.id) || []).join(' · ')}
                >
                  <td>
                    <div className="sch-name-cell">
                      {isNew && <span className="sch-new-tag">Nueva</span>}
                      <input
                        ref={row.id === newestId ? nameInputRef : undefined}
                        list="sch-class-names"
                        value={row.name}
                        placeholder="Nombre de la clase"
                        onChange={(e) => setRow(row.id, { name: e.target.value, capacity: defaultCapacity(e.target.value) })}
                      />
                    </div>
                  </td>
                  <td>
                    <select value={row.day} onChange={(e) => setRow(row.id, { day: e.target.value })}>
                      {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="sch-time">
                      <input type="time" value={row.startTime} onChange={(e) => setRow(row.id, { startTime: e.target.value })} />
                      <span>—</span>
                      <input type="time" value={row.endTime} onChange={(e) => setRow(row.id, { endTime: e.target.value })} />
                    </div>
                  </td>
                  <td>
                    <input
                      list="sch-teachers"
                      value={row.teacher}
                      onChange={(e) => setRow(row.id, { teacher: e.target.value })}
                    />
                  </td>
                  <td>
                    <select value={String(row.sedeId)} onChange={(e) => setRow(row.id, { sedeId: Number(e.target.value) })}>
                      {sedes.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.audience} onChange={(e) => setRow(row.id, { audience: e.target.value as ClassAudience })}>
                      <option value="ADULTS">Adultos</option>
                      <option value="KIDS">Kids</option>
                      <option value="BOTH">Todos</option>
                    </select>
                  </td>
                  <td>
                    <div className="sch-cupo">
                      <select
                        value={row.capacity == null ? 'unlimited' : 'limited'}
                        onChange={(e) => setRow(row.id, { capacity: e.target.value === 'unlimited' ? null : defaultCapacity(row.name) || 20 })}
                      >
                        <option value="limited">Limitado</option>
                        <option value="unlimited">Sin límite</option>
                      </select>
                      {row.capacity != null && (
                        <input
                          type="number"
                          min={1}
                          max={200}
                          value={row.capacity}
                          onChange={(e) => setRow(row.id, { capacity: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <button type="button" className="sch-icon-btn" onClick={() => removeRow(row.id)} aria-label="Eliminar clase">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
        <datalist id="sch-class-names">
          {CLASS_NAMES.map((n) => <option key={n} value={n} />)}
        </datalist>
        <datalist id="sch-teachers">
          {TEACHERS.map((n) => <option key={n} value={n} />)}
        </datalist>
        {tab === 'pieza' && (
        <div className="sch-ig">
          <h3>Para una historia</h3>
          <p className="sch-ig-lead">El horario es dinámico: cambias clases y cupos, y queda listo para subirlo a Instagram.</p>
          <button type="button" className="sch-ig-hit" onClick={() => setPosterOpen(true)}>
            <IgPoster slots={draft} days={posterDays} times={timeRows} compact />
            <span className="sch-ig-tap">Tocar para agrandar</span>
          </button>
        </div>
        )}
        {posterOpen && createPortal(
          <div className="sch-ig-lightbox" role="dialog" aria-label="Horario semanal">
            <button type="button" className="sch-ig-close" onClick={() => setPosterOpen(false)} aria-label="Cerrar">
              <X size={18} />
            </button>
            <div className="sch-ig-stage">
              <IgPoster slots={draft} days={posterDays} times={timeRows} large compact={compactPoster} />
            </div>
          </div>,
          document.body,
        )}
      </section>
    </div>
  );
}

const DAY_SHORT: Record<string, string> = {
  Lunes: 'LUN',
  Martes: 'MAR',
  Miércoles: 'MIÉ',
  Jueves: 'JUE',
  Viernes: 'VIE',
  Sábado: 'SÁB',
  Domingo: 'DOM',
};

function posterLabel(name: string, compact: boolean) {
  if (!compact) return name;
  return name
    .replace(/Jiu[\s-]?Jitsu/gi, 'JJ')
    .replace(/Kickboxing/gi, 'Kick')
    .replace(/Boxeo/gi, 'Box')
    .replace(/\s+·\s+/g, ' · ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function IgPoster({
  slots,
  days,
  times,
  large = false,
  compact = false,
}: {
  slots: ClassSlot[];
  days: string[];
  times: string[];
  large?: boolean;
  compact?: boolean;
}) {
  return (
    <article className={`sch-poster${large ? ' is-lg' : ''}${compact ? ' is-compact' : ''}`}>
      <img className="sch-poster-logo" src={BRAND.logoMark} alt="DP Sistemas" />
      <div className="sch-poster-academy">{BRAND.academy}</div>
      <div className="sch-grid">
        <div className="head">{compact ? '' : 'Hora'}</div>
        {days.map((d) => <div key={d} className="head">{DAY_SHORT[d] || d.slice(0, 3).toUpperCase()}</div>)}
        {times.map((range) => {
          const [start, end] = range.split('-');
          return (
            <Fragment key={range}>
              <div className="time"><b>{start}</b>{compact ? null : <span>{end}</span>}</div>
              {days.map((day) => {
                const hit = slots.find((s) => s.day === day && s.startTime === start && s.endTime === end);
                return <div key={`${range}-${day}`} className="cell">{hit ? posterLabel(hit.name, compact) : ''}</div>;
              })}
            </Fragment>
          );
        })}
      </div>
      <div className="sch-poster-foot">Horario semanal</div>
    </article>
  );
}
