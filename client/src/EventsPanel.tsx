import { useEffect, useMemo, useState } from 'react';
import { Copy, ExternalLink, Plus, Trash2 } from 'lucide-react';
import type { AcademyEvent, EventRegistration } from './types';
import {
  SEED_EVENT_ID,
  emptyEvent,
  formatCLP,
  formatEventWhen,
  groupRegistrations,
  mediaUrl,
  slugify,
} from './data/events';
import { DEMO_LOCK, demoAlert } from './demo';
import './EventsPanel.css';

type Props = {
  apiUrl: string;
};

export default function EventsPanel({ apiUrl }: Props) {
  const [events, setEvents] = useState<AcademyEvent[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [draft, setDraft] = useState<AcademyEvent>(emptyEvent());
  const [regs, setRegs] = useState<EventRegistration[]>([]);
  const [filter, setFilter] = useState<'all' | 'student' | 'guest' | 'spectator' | 'pending' | 'paid'>('all');
  const [catFilter, setCatFilter] = useState('');
  const [hint, setHint] = useState('');
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<'datos' | 'logistica' | 'inscritos'>('datos');

  const load = async () => {
    const res = await fetch(`${apiUrl}/api/events`);
    const data = await res.json();
    const list: AcademyEvent[] = Array.isArray(data) ? data : [];
    setEvents(list);
    if (!selectedId && list[0]) {
      setSelectedId(list[0].id);
    }
  };

  const loadDetail = async (id: string) => {
    if (!id) return;
    const res = await fetch(`${apiUrl}/api/events/${id}`);
    const data = await res.json();
    if (data?.event) {
      setDraft(data.event);
      setRegs(data.registrations || []);
    }
  };

  useEffect(() => { load().catch(() => setHint('No se pudieron cargar los eventos.')); }, []);
  useEffect(() => { if (selectedId) loadDetail(selectedId).catch(() => {}); }, [selectedId]);

  const grouped = useMemo(() => groupRegistrations(regs), [regs]);
  const shown = regs.filter((r) => {
    if (filter === 'student' || filter === 'guest' || filter === 'spectator') return r.kind === filter;
    if (filter === 'pending' || filter === 'paid') return r.status === filter;
    return true;
  }).filter((r) => !catFilter || r.categoryName === catFilter);

  const setField = <K extends keyof AcademyEvent>(key: K, value: AcademyEvent[K]) => {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'title' && !prev.id) next.slug = slugify(String(value));
      return next;
    });
  };

  const upload = async (file: File, kind: 'photo' | 'rules') => {
    const res = await fetch(`${apiUrl}/api/upload`, { method: 'POST', headers: { 'X-Filename': file.name }, body: file });
    if (!res.ok) throw new Error('upload');
    const data = await res.json();
    if (kind === 'photo') setField('photo', data.url);
    else {
      setDraft((prev) => ({ ...prev, rulesUrl: data.url, rulesName: file.name }));
    }
  };

  const save = async (status?: AcademyEvent['status']) => {
    setSaving(true);
    try {
      const payload = { ...draft, status: status || draft.status, slug: slugify(draft.slug || draft.title) };
      const isNew = !draft.id;
      const res = await fetch(isNew ? `${apiUrl}/api/events` : `${apiUrl}/api/events/${draft.id}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      setHint(status === 'published' ? 'Evento publicado. El link público ya está activo.' : 'Evento guardado.');
      await load();
      setSelectedId(data.id);
      setDraft((prev) => ({ ...prev, ...data }));
    } catch (e: any) {
      setHint(e.message || 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!draft.id) return;
    if (DEMO_LOCK && draft.id === SEED_EVENT_ID) { demoAlert('events'); return; }
    const res = await fetch(`${apiUrl}/api/events/${draft.id}`, { method: 'DELETE' });
    if (!res.ok) { demoAlert('events'); return; }
    setSelectedId('');
    setDraft(emptyEvent());
    load();
  };

  const markPaid = async (reg: EventRegistration) => {
    const res = await fetch(`${apiUrl}/api/events/${draft.id}/registrations/${reg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'paid', method: 'Transferencia' }),
    });
    if (res.ok) loadDetail(draft.id);
  };

  const publicUrl = draft.slug ? `${window.location.origin}/evento/${draft.slug}` : '';

  return (
    <div className="ev-wrap">
      <div className="ev-picker">
        {events.map((ev) => (
          <button key={ev.id} type="button" className={`ev-chip${selectedId === ev.id ? ' is-on' : ''}`} onClick={() => { setSelectedId(ev.id); setTab('datos'); }}>
            <strong>{ev.title}</strong>
            <span>{ev.status === 'published' ? 'Publicado' : 'Borrador'} · {ev.registered || 0}</span>
          </button>
        ))}
        <button type="button" className="ev-chip add" onClick={() => { setSelectedId(''); setDraft(emptyEvent()); setRegs([]); setTab('datos'); }}>
          <Plus size={14} /> Nuevo
        </button>
      </div>

      <section className="ev-card">
        <div className="ev-head">
          <div>
            <div className="ev-kicker">{draft.id ? 'Editar' : 'Nuevo evento'}</div>
            <h2>{draft.title || 'Sin título'}</h2>
          </div>
          {draft.status === 'published' ? <span className="ev-pill">Publicado</span> : <span className="ev-pill warn">Borrador</span>}
        </div>

        <div className="ev-tabs" role="tablist">
          <button type="button" role="tab" className={tab === 'datos' ? 'is-on' : ''} onClick={() => setTab('datos')}>Datos</button>
          <button type="button" role="tab" className={tab === 'logistica' ? 'is-on' : ''} onClick={() => setTab('logistica')}>Lugar y pago</button>
          <button type="button" role="tab" className={tab === 'inscritos' ? 'is-on' : ''} onClick={() => setTab('inscritos')} disabled={!draft.id}>
            Inscritos{draft.id ? ` (${regs.length})` : ''}
          </button>
        </div>

        {tab === 'datos' && (
          <div className="ev-body">
            {draft.photo && <img className="ev-photo" src={mediaUrl(apiUrl, draft.photo)} alt="" />}
            <div className="ev-fields">
              <label>Nombre del evento
                <input value={draft.title} onChange={(e) => setField('title', e.target.value)} placeholder="Torneo Interacademias" />
              </label>
              <label>Link público
                <input value={draft.slug} onChange={(e) => setField('slug', slugify(e.target.value))} placeholder="torneo-interacademias" />
              </label>
            </div>
            <div className="ev-full">
              <label>Descripción
                <textarea value={draft.description} onChange={(e) => setField('description', e.target.value)} placeholder="Toda la info del evento va aquí." />
              </label>
            </div>
            <div className="ev-row-btns">
              <label className="ev-btn ghost">
                Subir foto
                <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, 'photo').catch(() => setHint('No se pudo subir la foto.')); }} />
              </label>
              <label className="ev-btn ghost">
                Subir bases (PDF)
                <input type="file" accept="application/pdf,image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, 'rules').catch(() => setHint('No se pudieron subir las bases.')); }} />
              </label>
              {draft.rulesUrl && <a className="ev-btn ghost" href={mediaUrl(apiUrl, draft.rulesUrl)} target="_blank" rel="noreferrer">Ver bases</a>}
            </div>
            {publicUrl && draft.status === 'published' && (
              <div className="ev-row-btns">
                <button type="button" className="ev-btn ghost" onClick={() => { navigator.clipboard.writeText(publicUrl); setHint('Link copiado.'); }}>
                  <Copy size={14} /> Copiar link
                </button>
                <a className="ev-btn ghost" href={publicUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={14} /> Ver página
                </a>
              </div>
            )}
          </div>
        )}

        {tab === 'logistica' && (
          <div className="ev-body">
            <div className="ev-fields">
              <label>Fecha
                <input type="date" value={draft.date} onChange={(e) => setField('date', e.target.value)} />
              </label>
              <label>Horario
                <div className="ev-times">
                  <input type="time" value={draft.startTime} onChange={(e) => setField('startTime', e.target.value)} />
                  <input type="time" value={draft.endTime} onChange={(e) => setField('endTime', e.target.value)} />
                </div>
              </label>
              <label className="span-all">Dirección
                <input value={draft.address} onChange={(e) => setField('address', e.target.value)} />
              </label>
              <label>Cupos competencia
                <input type="number" value={draft.capacity ?? ''} onChange={(e) => setField('capacity', e.target.value === '' ? null : Number(e.target.value))} />
              </label>
              <label>Precio competencia
                <input type="number" value={draft.price} onChange={(e) => setField('price', Number(e.target.value) || 0)} />
              </label>
              <label>Cupos asistentes
                <input type="number" value={draft.ticketCapacity ?? ''} onChange={(e) => setField('ticketCapacity', e.target.value === '' ? null : Number(e.target.value))} placeholder="Sin tope" />
              </label>
              <label>Precio entrada
                <input type="number" value={draft.ticketPrice || 0} onChange={(e) => setField('ticketPrice', Number(e.target.value) || 0)} />
              </label>
              <label className="span-all">Evento pagado
                <select value={draft.paid ? '1' : '0'} onChange={(e) => setField('paid', e.target.value === '1')}>
                  <option value="1">Sí, inscripción con pago</option>
                  <option value="0">Gratis</option>
                </select>
              </label>
            </div>
            {draft.date && <p className="ev-when">{formatEventWhen(draft)}</p>}
          </div>
        )}

        {tab === 'inscritos' && draft.id && (
          <div className="ev-body">
            <div className="ev-stats">
              <div className="ev-stat"><b>{regs.length}</b><span>Total</span></div>
              <div className="ev-stat"><b>{grouped.students.length}</b><span>Alumnos</span></div>
              <div className="ev-stat"><b>{grouped.guests.length}</b><span>Invitados</span></div>
              <div className="ev-stat"><b>{grouped.spectators.length}</b><span>Asistentes</span></div>
            </div>
            <p className="ev-when">La categoría IBJJF se calcula sola al inscribirse (edad, peso, género y cinturón).</p>
            <div className="ev-filters">
              {(['all', 'student', 'guest', 'spectator', 'paid', 'pending'] as const).map((f) => (
                <button key={f} type="button" className={filter === f ? 'is-on' : ''} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'Todos' : f === 'student' ? 'Alumnos' : f === 'guest' ? 'Invitados' : f === 'spectator' ? 'Asistentes' : f === 'paid' ? 'Pagados' : 'Pendientes'}
                </button>
              ))}
            </div>
            <div className="ev-cats">
              {Object.entries(grouped.byCategory).sort((a, b) => b[1].length - a[1].length).map(([name, list]) => (
                <button key={name} type="button" className={catFilter === name ? 'is-on' : ''} onClick={() => setCatFilter(catFilter === name ? '' : name)}>
                  <b>{list.length}</b>
                  <span>{name}</span>
                </button>
              ))}
            </div>
            <div className="ev-table-wrap">
              <table className="ev-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Categoría / RUT</th>
                    <th>Edad</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {shown.length === 0 && <tr><td colSpan={6}>Sin inscritos en este filtro.</td></tr>}
                  {shown.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.name}</strong>
                        <div className="ev-sub">{r.academy || r.email}</div>
                      </td>
                      <td>{r.kind === 'student' ? 'Alumno' : r.kind === 'spectator' ? 'Asistente' : 'Invitado'}</td>
                      <td>{r.kind === 'spectator' ? (r.documentId || '—') : r.categoryName}</td>
                      <td>{r.age ?? '—'}</td>
                      <td>
                        <span className={`ev-pill${r.status === 'paid' ? '' : ' warn'}`}>
                          {r.status === 'paid' ? `Pagado · ${formatCLP(r.amount)}` : `Pendiente · ${formatCLP(r.amount)}`}
                        </span>
                      </td>
                      <td>
                        {r.status !== 'paid' && (
                          <button type="button" className="ev-btn ghost" onClick={() => markPaid(r)}>Marcar pagado</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="ev-actions">
          <button type="button" className="ev-btn ghost" disabled={saving} onClick={() => save('draft')}>Guardar borrador</button>
          <button type="button" className="ev-btn" disabled={saving} onClick={() => save('published')}>Publicar evento</button>
          <button type="button" className="ev-btn danger" onClick={remove}><Trash2 size={14} /> Eliminar</button>
          {hint && <p className="ev-hint">{hint}</p>}
        </div>
      </section>
    </div>
  );
}
