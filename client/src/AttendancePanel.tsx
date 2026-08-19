import { useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronRight, Clock, MapPin, Users } from 'lucide-react';
import type { AttendanceRecord, ClassSlot, Student } from './types';
import {
  ACADEMY_QR,
  chileToday,
  expectedForSlot,
  formatCheckTime,
  pickActiveSlot,
  withinClassWindow,
} from './data/attendance';
import PanelTabs from './PanelTabs';
import { avatarSrc } from './brand';
import QRCode from 'react-qr-code';
import './AttendancePanel.css';
import './panel-shell.css';

type Props = {
  slots: ClassSlot[];
  students: Student[];
  sedes: { id: number; name: string }[];
  activeSedeId: number | null;
  apiUrl: string;
  weekStart: number;
};

export default function AttendancePanel({ slots, students, sedes, activeSedeId, apiUrl, weekStart }: Props) {
  const scoped = useMemo(
    () => (activeSedeId ? slots.filter((s) => Number(s.sedeId) === Number(activeSedeId)) : slots),
    [slots, activeSedeId],
  );
  const [slotId, setSlotId] = useState(() => pickActiveSlot(slots, activeSedeId)?.id || '');
  const slot = scoped.find((s) => s.id === slotId) || pickActiveSlot(scoped, activeSedeId);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [tab, setTab] = useState<'qr' | 'lista'>('qr');
  const [manual, setManual] = useState('');
  const [flash, setFlash] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const picked = pickActiveSlot(slots, activeSedeId);
    if (picked) setSlotId(picked.id);
  }, [slots, activeSedeId]);

  const load = async (id = slot?.id) => {
    if (!id) return;
    try {
      const res = await fetch(`${apiUrl}/api/attendance?date=${chileToday()}&slotId=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.tableMissing ? 'Falta crear la tabla de asistencia. Revisa el esquema demo.' : (data.error || 'No se pudo cargar'));
        return;
      }
      setError('');
      setRecords(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || 'Error de red');
    }
  };

  useEffect(() => {
    load(slot?.id);
    const t = setInterval(() => load(slot?.id), 2500);
    return () => clearInterval(t);
  }, [slot?.id, apiUrl]);

  const checkIn = async (studentId: string, present = true) => {
    if (!studentId || !slot) return;
    try {
      const res = await fetch(`${apiUrl}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, slotId: slot.id, date: chileToday(), present }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo registrar');
        return;
      }
      setError('');
      if (present) {
        const name = data.student?.name || studentId;
        const time = formatCheckTime(data.record?.checkedAt);
        const planBit = data.planMax && data.planMax < 99 ? ` · ${data.weekUsed} de ${data.planMax} esta semana` : '';
        setFlash(`${name} · ${data.already ? 'Ya estaba presente' : 'Presente'} · ${time}${planBit}`);
      } else {
        setFlash('Registro anulado');
      }
      await load(slot.id);
    } catch (e: any) {
      setError(e.message || 'Error de red');
    }
  };

  const expected = slot ? expectedForSlot(students, slot, weekStart) : [];
  const presentIds = new Set(records.map((r) => r.studentId));
  const extra = records
    .filter((r) => !expected.some((s) => s.id === r.studentId))
    .map((r) => students.find((s) => s.id === r.studentId))
    .filter(Boolean) as Student[];
  const rows = [...expected, ...extra];
  const presentCount = rows.filter((s) => presentIds.has(s.id)).length;
  const absentCount = Math.max(0, rows.length - presentCount);
  const sedeName = sedes.find((s) => Number(s.id) === Number(slot?.sedeId))?.name || 'Sede';
  const enrolled = expected.length;
  const cap = slot?.capacity;
  const inWindow = slot ? withinClassWindow(slot.startTime, slot.endTime) : false;

  return (
    <div className="att-wrap">
      <section className="att-card">
        <div className="att-head">
          <div>
            <div className="att-kicker">Registro</div>
            <h2>Control de clase</h2>
          </div>
        </div>
        <div className="att-body">
          <select className="att-select" value={slot?.id || ''} onChange={(e) => setSlotId(e.target.value)}>
            {scoped.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.day} {s.startTime}
              </option>
            ))}
          </select>
        </div>
        <PanelTabs
          name="asistencia"
          value={tab}
          onChange={(id) => setTab(id as typeof tab)}
          items={[{ id: 'qr', label: 'QR academia' }, { id: 'lista', label: `Lista (${presentCount}/${rows.length})` }]}
        />
      <div className={tab === 'qr' ? '' : 'dp-hide'}>
        <div className="att-body">
            <div className="att-meta">
              <div className="att-chip">
                <Calendar size={16} />
                <div>
                  <span>Clase</span>
                  <strong>{slot ? `${slot.name}` : '—'}</strong>
                </div>
              </div>
              <div className="att-chip">
                <Clock size={16} />
                <div>
                  <span>Horario</span>
                  <strong>{slot ? `${slot.day} · ${slot.startTime}` : '—'}</strong>
                </div>
              </div>
              <div className="att-chip">
                <MapPin size={16} />
                <div>
                  <span>Sede</span>
                  <strong>{sedeName}</strong>
                </div>
              </div>
              <div className="att-chip">
                <Users size={16} />
                <div>
                  <span>Cupos</span>
                  <strong>{cap ? `${enrolled} de ${cap} cupos` : `${enrolled} inscritos`}</strong>
                </div>
              </div>
            </div>
            {cap ? (
              <div className="att-bar">
                <i style={{ width: `${Math.min(100, (enrolled / cap) * 100)}%` }} />
              </div>
            ) : null}
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: inWindow ? '#006970' : '#b45309' }}>
              {inWindow ? 'Dentro de la ventana de ingreso (±15 min)' : 'Fuera de horario · igual se puede marcar'}
            </div>
          </div>
          <div className="att-body">
            <div className="att-poster">
              <QRCode value={ACADEMY_QR} size={188} />
            </div>
            <p className="att-scan-hint">
              Este código <strong>no cambia</strong>. Déjalo en la puerta: el alumno lo escanea y queda fecha y hora de la entrada.
            </p>
            <form
              className="att-manual"
              onSubmit={(e) => {
                e.preventDefault();
                if (!manual.trim()) return;
                checkIn(manual.trim(), true);
                setManual('');
              }}
            >
              <input
                value={manual}
                onChange={(e) => setManual(e.target.value)}
                placeholder="ID del alumno"
              />
              <button type="submit">Registrar</button>
            </form>
          </div>
      </div>

      {flash ? <div className="att-flash">{flash}</div> : null}
      {error ? <div className="att-error">{error}</div> : null}

      <div className={tab === 'lista' ? '' : 'dp-hide'}>
        <div className="att-live-head">
          <h2>Asistencia en vivo</h2>
          <div className="att-stats">
            <span className="ok">{presentCount} presentes</span>
            <span className="bad">{absentCount} ausentes</span>
          </div>
        </div>
        {rows.length === 0 ? (
          <div className="att-empty">No hay alumnos esperados para esta clase.</div>
        ) : (
          rows.map((s) => {
            const rec = records.find((r) => r.studentId === s.id);
            const present = !!rec;
            return (
              <button
                key={s.id}
                className="att-row"
                type="button"
                onClick={() => checkIn(s.id, !present)}
              >
                <div className="att-ava"><img src={avatarSrc(s.avatar)} alt="" /></div>
                <div className="att-name">{s.name}</div>
                <div className="att-time">{present ? formatCheckTime(rec?.checkedAt) : '—'}</div>
                <span className={`att-badge ${present ? 'ok' : 'bad'}`}>
                  <i className={`att-dot${present ? '' : ' off'}`} style={present ? undefined : { background: '#ef4444' }} />
                  {present ? 'Presente' : 'Sin registro'}
                </span>
                <ChevronRight size={16} color="#94a3b8" />
              </button>
            );
          })
        )}
      </div>
      </section>
    </div>
  );
}
