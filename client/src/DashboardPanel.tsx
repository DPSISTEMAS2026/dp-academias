import { useMemo, useState } from 'react';
import { Award, Calendar, Clock, CreditCard, Users } from 'lucide-react';
import type { Belt, ClassSlot, Student } from './types';
import { chileWeekday } from './data/attendance';
import { avatarSrc } from './brand';
import PanelTabs from './PanelTabs';
import './DashboardPanel.css';
import './panel-shell.css';

type Props = {
  students: Student[];
  slots: ClassSlot[];
  activeSedeId: number | null;
  onOpenStudent: (student: Student) => void;
  onGo: (tab: 'students' | 'payments' | 'schedule' | 'attendance' | 'grades') => void;
};

const BELTS: { id: Belt; label: string }[] = [
  { id: 'WHITE', label: 'Blanco' },
  { id: 'BLUE', label: 'Azul' },
  { id: 'PURPLE', label: 'Morado' },
  { id: 'BROWN', label: 'Marrón' },
  { id: 'BLACK', label: 'Negro' },
  { id: 'GRAY', label: 'Gris' },
];

function upcomingBirthdays(students: Student[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return students
    .filter((s) => s.birthDate)
    .map((s) => {
      const parts = s.birthDate!.split('-');
      const bMonth = parseInt(parts[1], 10) - 1;
      const bDay = parseInt(parts[2], 10);
      const next = new Date(today.getFullYear(), bMonth, bDay);
      const isToday = bMonth === today.getMonth() && bDay === today.getDate();
      if (next < today && !isToday) next.setFullYear(today.getFullYear() + 1);
      return { student: s, next, isToday };
    })
    .sort((a, b) => {
      if (a.isToday) return -1;
      if (b.isToday) return 1;
      return a.next.getTime() - b.next.getTime();
    })
    .slice(0, 4);
}

export default function DashboardPanel({ students, slots, activeSedeId, onOpenStudent, onGo }: Props) {
  const paid = students.filter((s) => s.isPaid).length;
  const pending = students.filter((s) => !s.isPaid);
  const todayName = chileWeekday();
  const todaySlots = useMemo(() => {
    return slots
      .filter((s) => s.day === todayName)
      .filter((s) => !activeSedeId || Number(s.sedeId) === Number(activeSedeId))
      .sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));
  }, [slots, todayName, activeSedeId]);
  const births = upcomingBirthdays(students);
  const maxBelt = Math.max(1, ...BELTS.map((b) => students.filter((s) => s.belt === b.id).length));

  const [tab, setTab] = useState<'hoy' | 'pagos' | 'academia'>('hoy');

  return (
    <div className="dash-wrap">
      <div className="dash-kpis">
        <button type="button" className="dash-kpi" onClick={() => onGo('students')}>
          <Users size={18} />
          <b>{students.length}</b>
          <span>Alumnos</span>
        </button>
        <button type="button" className="dash-kpi" onClick={() => onGo('payments')}>
          <Award size={18} />
          <b>{paid}</b>
          <span>Al día</span>
        </button>
        <button type="button" className={`dash-kpi${pending.length ? ' warn' : ''}`} onClick={() => onGo('payments')}>
          <CreditCard size={18} />
          <b>{pending.length}</b>
          <span>Pendientes</span>
        </button>
        <button type="button" className="dash-kpi" onClick={() => onGo('schedule')}>
          <Calendar size={18} />
          <b>{todaySlots.length}</b>
          <span>Clases hoy</span>
        </button>
      </div>

      <section className="dp-card">
        <div className="dp-head">
          <div>
            <div className="dp-kicker">Resumen</div>
            <h2>{tab === 'hoy' ? 'Clases de hoy' : tab === 'pagos' ? 'Mensualidades' : 'Academia'}</h2>
          </div>
        </div>
        <PanelTabs
          name="resumen"
          value={tab}
          onChange={(id) => setTab(id as typeof tab)}
          items={[
            { id: 'hoy', label: 'Hoy' },
            { id: 'pagos', label: `Pendientes (${pending.length})` },
            { id: 'academia', label: 'Grados' },
          ]}
        />
        {tab === 'hoy' && (
          <div>
            {todaySlots.length === 0 && <div className="dash-empty">No hay clases programadas para hoy.</div>}
            {todaySlots.slice(0, 8).map((slot) => (
              <div key={slot.id} className="dash-row static">
                <div className="dash-time"><Clock size={14} /> {slot.startTime}</div>
                <div className="dash-who">
                  <strong>{slot.name}</strong>
                  <span>{slot.teacher}{slot.capacity ? ` · ${slot.capacity} cupos` : ''}</span>
                </div>
              </div>
            ))}
            <div className="dp-body">
              <button type="button" className="dash-link" onClick={() => onGo('attendance')}>Tomar asistencia</button>
            </div>
          </div>
        )}
        {tab === 'pagos' && (
          <div>
            {pending.length === 0 && <div className="dash-empty">Nadie con pago pendiente.</div>}
            {pending.slice(0, 8).map((s) => (
              <button key={s.id} type="button" className="dash-row" onClick={() => onOpenStudent(s)}>
                <div className="dash-ava"><img src={avatarSrc(s.avatar)} alt="" /></div>
                <div className="dash-who">
                  <strong>{s.name}</strong>
                  <span>{BELTS.find((b) => b.id === s.belt)?.label || s.belt}</span>
                </div>
                <em>Pendiente</em>
              </button>
            ))}
            <div className="dp-body">
              <button type="button" className="dash-link" onClick={() => onGo('payments')}>Ver finanzas</button>
            </div>
          </div>
        )}
        {tab === 'academia' && (
          <div className="dp-body">
            <div className="dash-belts">
              {BELTS.map((b) => {
                const n = students.filter((s) => s.belt === b.id).length;
                return (
                  <div key={b.id} className="dash-belt">
                    <span className={`dash-dot belt-${b.id.toLowerCase()}`} />
                    <strong>{b.label}</strong>
                    <i style={{ width: `${(n / maxBelt) * 100}%` }} />
                    <em>{n}</em>
                  </div>
                );
              })}
            </div>
            {births.map((row) => (
              <button key={row.student.id} type="button" className="dash-row" onClick={() => onOpenStudent(row.student)}>
                <div className="dash-who">
                  <strong>{row.student.name}</strong>
                  <span>{row.isToday ? 'Cumple hoy' : row.next.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}</span>
                </div>
              </button>
            ))}
            <button type="button" className="dash-link" onClick={() => onGo('grades')}>Ver grados</button>
          </div>
        )}
      </section>
    </div>
  );
}
