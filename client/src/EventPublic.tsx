import { useEffect, useMemo, useState } from 'react';
import type { AcademyEvent, Belt, EventRegistration, RegistrationKind, Student } from './types';
import { formatCLP, formatEventWhen, mediaUrl } from './data/events';
import { calculateIBJJFCategory } from './data/ibjjf';
import { BRAND, appPath } from './brand';
import { MpLogo } from './MpLogo';
import './EventPublic.css';

type Props = {
  slug: string;
  apiUrl: string;
};

const BELTS: Belt[] = ['GRAY', 'WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK'];

function currentStudent(): Student | null {
  try {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.id && user?.name ? user : null;
  } catch {
    return null;
  }
}

export default function EventPublic({ slug, apiUrl }: Props) {
  const [event, setEvent] = useState<AcademyEvent | null>(null);
  const [error, setError] = useState('');
  const [kind, setKind] = useState<RegistrationKind>(currentStudent() ? 'student' : 'guest');
  const student = currentStudent();
  const [form, setForm] = useState(() => ({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    documentId: student?.documentId || '',
    birthDate: student?.birthDate || '',
    weight: student?.weight ? String(student.weight) : '',
    gender: student?.gender || '',
    belt: student?.belt || 'WHITE',
    academy: '',
  }));
  const [done, setDone] = useState<EventRegistration | null>(null);
  const [sending, setSending] = useState(false);

  const fillFromStudent = (s: Student) => ({
    name: s.name || '',
    email: s.email || '',
    phone: s.phone || '',
    documentId: s.documentId || '',
    birthDate: s.birthDate || '',
    weight: s.weight ? String(s.weight) : '',
    gender: s.gender || '',
    belt: s.belt || 'WHITE',
    academy: '',
  });

  useEffect(() => {
    if (!student) return;
    setKind('student');
    setForm(fillFromStudent(student));
  }, [student?.id]);

  const goAsStudent = () => {
    if (student) {
      setKind('student');
      setForm(fillFromStudent(student));
      return;
    }
    const next = appPath(`/evento/${slug}`);
    sessionStorage.setItem('eventLoginNext', next);
    window.location.assign(`${appPath('/acceso')}?next=${encodeURIComponent(next)}`);
  };

  useEffect(() => {
    fetch(`${apiUrl}/api/events/public/${slug}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'No encontrado');
        setEvent(data);
      })
      .catch((e) => setError(e.message || 'Evento no disponible'));
  }, [apiUrl, slug]);

  const cat = useMemo(
    () => calculateIBJJFCategory(form.birthDate, form.weight ? Number(form.weight) : null, form.gender, form.belt),
    [form.birthDate, form.weight, form.gender, form.belt]
  );
  const remaining = event?.capacity != null ? Math.max(0, event.capacity - (event.registered || 0)) : null;

  const submit = async () => {
    if (!event) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          studentId: kind === 'student' ? student?.id : undefined,
          ...form,
          weight: form.weight ? Number(form.weight) : null,
          method: event.paid ? 'Mercado Pago' : 'Gratis',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo inscribir');
      setDone(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  if (!event && !error) {
    return <div className="ep"><div className="ep-main"><div className="ep-card">Cargando evento…</div></div></div>;
  }
  if (!event) {
    return <div className="ep"><div className="ep-main"><div className="ep-card"><p className="ep-err">{error}</p></div></div></div>;
  }

  return (
    <div className="ep">
      <header className="ep-hero">
        {event.photo && <img src={mediaUrl(apiUrl, event.photo)} alt="" />}
        <div className="ep-hero-copy">
          <div className="ep-kicker">{BRAND.academy}</div>
          <h1>{event.title}</h1>
          <div className="ep-meta">
            <span className="ep-chip">{formatEventWhen(event)}</span>
            {event.address && <span className="ep-chip">{event.address}</span>}
            <span className="ep-chip">{event.paid ? `Inscripción ${formatCLP(event.price)}` : 'Sin costo'}</span>
            {remaining != null && <span className="ep-chip">{remaining} cupos</span>}
          </div>
        </div>
      </header>

      <main className="ep-main">
        <section className="ep-card">
          <h2>Evento de ejemplo</h2>
          <p>Así se ve la inscripción pública de un torneo o seminario. Alumnos e invitados se anotan aquí.</p>
          {event.paid ? (
            <div className="ep-pay">
              <div className="ep-mp">
                <MpLogo height={40} />
              </div>
              <p>El pago entra por Mercado Pago. La pasarela confirma el cobro y deja inscrito a quien pagó: sin revisar transferencias a mano.</p>
            </div>
          ) : null}
        </section>

        <section className="ep-card">
          <h2>Categoría automática</h2>
          <p>En este evento de ejemplo no eliges categoría. Con fecha de nacimiento, peso, género y cinturón se calcula la división, igual que en la ficha del alumno.</p>
        </section>

        {event.rulesUrl && (
          <section className="ep-card">
            <h2>Bases</h2>
            <p>Descarga el reglamento del evento antes de inscribirte.</p>
            <p style={{ marginTop: 12 }}>
              <a href={mediaUrl(apiUrl, event.rulesUrl)} target="_blank" rel="noreferrer" style={{ color: '#006970', fontWeight: 800 }}>
                {event.rulesName || 'Ver bases'}
              </a>
            </p>
          </section>
        )}

        <section className="ep-card">
          {done ? (
            <div className="ep-ok">
              <div className="ep-kicker">Inscripción recibida</div>
              <h2>{done.name}</h2>
              <p>{done.kind === 'student' ? 'Alumno de la academia' : 'Invitado'} · {done.categoryName} · {done.age ?? '—'} años</p>
              <p style={{ marginTop: 12 }}>
                {done.status === 'paid'
                  ? 'Mercado Pago confirmó el pago. Quedas inscrito.'
                  : `Pendiente de pago ${formatCLP(done.amount)}. Cuando Mercado Pago confirme el cobro, quedas inscrito.`}
              </p>
            </div>
          ) : (
            <>
              <h2>Inscripción</h2>
              <p style={{ marginBottom: 14 }}>Completa tus datos. Si hay costo, Mercado Pago confirma el pago y quedas inscrito.</p>
              <div className="ep-tabs">
                <button type="button" className={kind === 'student' ? 'is-on' : ''} onClick={goAsStudent}>Soy alumno</button>
                <button type="button" className={kind === 'guest' ? 'is-on' : ''} onClick={() => setKind('guest')}>Vengo de otra academia</button>
              </div>
              {kind === 'student' && student && (
                <p style={{ marginBottom: 10, fontWeight: 700, color: '#006970' }}>Inscripción con la ficha de {student.name}.</p>
              )}
              {kind === 'student' && !student && (
                <p className="ep-err" style={{ marginBottom: 10 }}>Inicia sesión para usar tu ficha, o completa los datos como invitado.</p>
              )}
              <div className="ep-form">
                <label>Nombre<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
                <label>Correo<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
                <label>Teléfono<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
                <label>RUT / documento<input value={form.documentId} onChange={(e) => setForm({ ...form, documentId: e.target.value })} /></label>
                <label>Fecha de nacimiento<input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} /></label>
                <label>Peso (kg)<input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></label>
                <label>Género
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="">—</option>
                    <option value="MALE">Masculino</option>
                    <option value="FEMALE">Femenino</option>
                  </select>
                </label>
                <label>Cinturón
                  <select value={form.belt} onChange={(e) => setForm({ ...form, belt: e.target.value as Belt })}>
                    {BELTS.map((b) => <option key={b} value={b}>{b === 'WHITE' ? 'Blanco' : b === 'BLUE' ? 'Azul' : b === 'PURPLE' ? 'Morado' : b === 'BROWN' ? 'Marrón' : b === 'BLACK' ? 'Negro' : 'Gris'}</option>)}
                  </select>
                </label>
                {kind === 'guest' && (
                  <label className="span2">Academia de origen<input value={form.academy} onChange={(e) => setForm({ ...form, academy: e.target.value })} placeholder="Nombre de tu academia" /></label>
                )}
                <div className="span2" style={{ padding: '0.9rem 1rem', borderRadius: 14, background: cat.ready ? 'rgba(0,105,112,0.08)' : '#fafaf8', border: '1px solid rgba(22,22,22,0.08)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#006970', marginBottom: 6 }}>Tu categoría</div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{cat.fullCategoryString}</div>
                  {cat.age > 0 && <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: '#64748b' }}>{cat.age} años · {cat.ageCategory}</div>}
                </div>
                {error && <p className="ep-err span2">{error}</p>}
                <button type="button" className={`ep-submit${event.paid ? ' ep-submit-mp' : ''}`} disabled={sending || !cat.ready} onClick={submit}>
                  {event.paid ? (
                    <>
                      <span>Pagar e inscribirme · {formatCLP(event.price)}</span>
                      <MpLogo variant="white" height={28} />
                    </>
                  ) : (
                    'Inscribirme'
                  )}
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <div className="ep-foot">{BRAND.company} · {BRAND.url.replace('https://', '')}</div>
    </div>
  );
}

export function OpenEventsCard({ apiUrl, variant = 'app' }: { apiUrl: string; variant?: 'app' | 'landing' }) {
  const [items, setItems] = useState<AcademyEvent[]>([]);
  useEffect(() => {
    fetch(`${apiUrl}/api/events/public`)
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : [];
        setItems(list);
      })
      .catch(() => {});
  }, [apiUrl]);
  if (!items.length) return null;
  if (variant === 'landing') {
    return (
      <section className="dp-section" style={{ paddingTop: 0 }}>
        <div className="dp-section-wide">
          <div className="dp-kicker">Evento de ejemplo</div>
          <h2 style={{ marginTop: 8 }}>Inscripción y pago, aquí mismo</h2>
          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            {items.map((ev) => (
              <a key={ev.id} href={appPath(`/evento/${ev.slug}`)} style={{ display: 'block', background: '#fff', borderRadius: 18, padding: '1.1rem 1.3rem', border: '1px solid rgba(22,22,22,0.08)', textDecoration: 'none', color: '#161616' }}>
                <strong style={{ fontSize: '1.15rem' }}>{ev.title}</strong>
                <div style={{ marginTop: 6, color: '#64748b', fontWeight: 700, fontSize: 14 }}>{formatEventWhen(ev)} · {ev.address}</div>
                {ev.paid ? <div className="ep-mp-inline"><MpLogo height={32} /></div> : null}
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      {items.map((ev) => (
        <a key={ev.id} href={appPath(`/evento/${ev.slug}`)} style={{ display: 'block', padding: '1.2rem 1.3rem', background: 'var(--panel-card)', borderRadius: '1.2rem', border: '1px solid var(--panel-border)', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--logo-green)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Evento abierto</div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{ev.title}</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--panel-muted)', marginTop: 4 }}>{formatEventWhen(ev)}</div>
        </a>
      ))}
    </section>
  );
}
