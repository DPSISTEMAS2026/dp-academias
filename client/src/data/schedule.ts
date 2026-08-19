import type { ClassAudience, ClassSlot } from '../types';

export const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const CLASS_NAMES = [
  'Jiu Jitsu',
  'Jiu Jitsu Adultos',
  'Jiu Jitsu Kids',
  'Kickboxing Kids',
  'Boxeo Kickboxing MMA',
  'MMA',
  'MMA · Boxeo · Jiu Jitsu',
  'Boxeo Kickboxing Jiu Jitsu Mujeres',
  'Open Mat',
];

export const TEACHERS = ['Entrenador 1', 'Entrenador 2', 'Entrenadora 1'];

export function isOpenMat(name?: string) {
  return /open\s*mat/i.test(name || '');
}

export function defaultCapacity(name: string): number | null {
  if (isOpenMat(name)) return null;
  if (/kids/i.test(name)) return 12;
  return 20;
}

export function timeToMin(t: string) {
  const [h, m] = String(t || '00:00').split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function addMinutes(t: string, mins: number) {
  const total = timeToMin(t) + mins;
  const h = Math.max(0, Math.floor(total / 60));
  const m = ((total % 60) + 60) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return timeToMin(aStart) < timeToMin(bEnd) && timeToMin(bStart) < timeToMin(aEnd);
}

export function findConflicts(slots: ClassSlot[]) {
  const map = new Map<string, string[]>();
  const add = (id: string, msg: string) => {
    const prev = map.get(id) || [];
    if (!prev.includes(msg)) map.set(id, [...prev, msg]);
  };
  for (let i = 0; i < slots.length; i++) {
    const a = slots[i];
    if (timeToMin(a.endTime) <= timeToMin(a.startTime)) {
      add(a.id, 'La hora de término debe ser posterior al inicio');
    }
    for (let j = i + 1; j < slots.length; j++) {
      const b = slots[j];
      if (a.day !== b.day) continue;
      if (!timesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) continue;
      if (Number(a.sedeId) === Number(b.sedeId)) {
        add(a.id, `Choca en la misma sede con ${b.name} (${b.startTime}–${b.endTime})`);
        add(b.id, `Choca en la misma sede con ${a.name} (${a.startTime}–${a.endTime})`);
      }
      const ta = (a.teacher || '').trim().toLowerCase();
      const tb = (b.teacher || '').trim().toLowerCase();
      if (ta && tb && ta === tb) {
        add(a.id, `${a.teacher} ya está en ${b.name} a las ${b.startTime}`);
        add(b.id, `${b.teacher} ya está en ${a.name} a las ${a.startTime}`);
      }
    }
  }
  return map;
}

export function nextFreeSlot(slots: ClassSlot[], sedeId: number, sortOrder: number): ClassSlot {
  const starts = ['08:00', '09:00', '10:00', '11:00', '12:00', '16:00', '16:45', '18:00', '19:00', '19:30', '20:00', '20:30'];
  for (const day of DAYS.slice(0, 6)) {
    for (const startTime of starts) {
      const endTime = addMinutes(startTime, 60);
      const probe: ClassSlot = {
        id: '__probe__',
        name: 'Jiu Jitsu',
        day,
        startTime,
        endTime,
        teacher: 'Entrenador 1',
        sedeId,
        audience: 'ADULTS',
        sortOrder,
        capacity: 20,
      };
      if (!findConflicts([...slots, probe]).has('__probe__')) {
        return { ...probe, id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
      }
    }
  }
  return {
    id: `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: 'Jiu Jitsu',
    day: 'Domingo',
    startTime: '10:00',
    endTime: '11:00',
    teacher: 'Entrenador 1',
    sedeId,
    audience: 'ADULTS',
    sortOrder,
    capacity: 20,
  };
}

export const DEFAULT_SLOTS: ClassSlot[] = [
  { id: 's1', name: 'Jiu Jitsu', day: 'Lunes', startTime: '11:00', endTime: '12:00', teacher: 'Entrenador 1', sedeId: 1, audience: 'ADULTS', sortOrder: 1, capacity: 20 },
  { id: 's2', name: 'Jiu Jitsu Adultos', day: 'Lunes', startTime: '19:30', endTime: '21:00', teacher: 'Entrenador 1', sedeId: 1, audience: 'ADULTS', sortOrder: 2, capacity: 20 },
  { id: 's3', name: 'Jiu Jitsu Kids', day: 'Martes', startTime: '18:00', endTime: '19:00', teacher: 'Entrenadora 1', sedeId: 1, audience: 'KIDS', sortOrder: 3, capacity: 12 },
  { id: 's4', name: 'Boxeo Kickboxing MMA', day: 'Martes', startTime: '19:00', endTime: '20:30', teacher: 'Entrenador 2', sedeId: 1, audience: 'ADULTS', sortOrder: 4, capacity: 20 },
  { id: 's5', name: 'Kickboxing Kids', day: 'Miércoles', startTime: '16:45', endTime: '17:45', teacher: 'Entrenadora 1', sedeId: 1, audience: 'KIDS', sortOrder: 5, capacity: 12 },
  { id: 's6', name: 'Jiu Jitsu', day: 'Miércoles', startTime: '11:00', endTime: '12:00', teacher: 'Entrenador 1', sedeId: 1, audience: 'ADULTS', sortOrder: 6, capacity: 20 },
  { id: 's7', name: 'MMA', day: 'Miércoles', startTime: '19:30', endTime: '21:00', teacher: 'Entrenador 2', sedeId: 1, audience: 'ADULTS', sortOrder: 7, capacity: 20 },
  { id: 's8', name: 'Jiu Jitsu Kids', day: 'Jueves', startTime: '18:00', endTime: '19:00', teacher: 'Entrenadora 1', sedeId: 1, audience: 'KIDS', sortOrder: 8, capacity: 12 },
  { id: 's9', name: 'Jiu Jitsu Adultos', day: 'Jueves', startTime: '19:00', endTime: '20:30', teacher: 'Entrenador 1', sedeId: 1, audience: 'ADULTS', sortOrder: 9, capacity: 20 },
  { id: 's10', name: 'Boxeo Kickboxing Jiu Jitsu Mujeres', day: 'Jueves', startTime: '20:30', endTime: '22:00', teacher: 'Entrenadora 1', sedeId: 1, audience: 'ADULTS', sortOrder: 10, capacity: 20 },
  { id: 's11', name: 'Kickboxing Kids', day: 'Viernes', startTime: '16:45', endTime: '17:45', teacher: 'Entrenadora 1', sedeId: 1, audience: 'KIDS', sortOrder: 11, capacity: 12 },
  { id: 's12', name: 'MMA · Boxeo · Jiu Jitsu', day: 'Viernes', startTime: '19:30', endTime: '21:00', teacher: 'Entrenador 2', sedeId: 1, audience: 'ADULTS', sortOrder: 12, capacity: 20 },
  { id: 's13', name: 'Jiu Jitsu Kids', day: 'Sábado', startTime: '11:00', endTime: '12:00', teacher: 'Entrenadora 1', sedeId: 1, audience: 'KIDS', sortOrder: 13, capacity: 12 },
  { id: 's14', name: 'Open Mat', day: 'Sábado', startTime: '12:00', endTime: '14:00', teacher: 'Entrenador 1', sedeId: 1, audience: 'BOTH', sortOrder: 14, capacity: null },
];

export function groupByDay(slots: ClassSlot[], audience?: ClassAudience) {
  const filtered = audience
    ? slots.filter((s) => s.audience === audience || s.audience === 'BOTH')
    : slots;
  return DAYS
    .filter((day) => filtered.some((s) => s.day === day))
    .map((day) => ({
      day,
      classes: filtered
        .filter((s) => s.day === day)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map((s) => ({
          time: s.startTime,
          endTime: s.endTime,
          name: s.name,
          teacher: s.teacher,
          sedeId: s.sedeId,
          audience: s.audience,
          capacity: s.capacity ?? null,
        })),
    }));
}
