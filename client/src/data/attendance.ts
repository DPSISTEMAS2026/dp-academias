import type { ClassSlot, Student } from '../types';
import { timeToMin } from './schedule';

const TZ = 'America/Santiago';
const QR_PREFIX = 'DP-STU-';
export const ACADEMY_QR = 'DP-CHECKIN';

const DAY_EN: Record<string, string> = {
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
  Sunday: 'Domingo',
};

export function studentQrValue(id: string) {
  return `${QR_PREFIX}${id}`;
}

export function parseStudentQr(raw: string): string | null {
  const t = String(raw || '').trim();
  if (!t) return null;
  const prefixed = t.match(/^DP-STU-(.+)$/i);
  if (prefixed) return prefixed[1].trim();
  return t;
}

export function isAcademyQr(raw: string) {
  const t = String(raw || '').trim().toUpperCase();
  return t === ACADEMY_QR || t.includes('DP-CHECKIN');
}

export function chileToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}

export function chileWeekday() {
  const en = new Date().toLocaleDateString('en-US', { weekday: 'long', timeZone: TZ });
  return DAY_EN[en] || 'Lunes';
}

export function chileNowMinutes() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === 'hour')?.value || 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value || 0);
  return hour * 60 + minute;
}

export function chileNowTime() {
  const m = chileNowMinutes();
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export function withinClassWindow(start: string, end: string, pad = 15) {
  const now = chileNowMinutes();
  return now >= timeToMin(start) - pad && now <= timeToMin(end) + pad;
}

export function pickActiveSlot(slots: ClassSlot[], sedeId: number | null) {
  const scoped = sedeId ? slots.filter((s) => Number(s.sedeId) === Number(sedeId)) : slots;
  const pool = scoped.length ? scoped : slots;
  const today = chileWeekday();
  const todays = pool.filter((s) => s.day === today).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const now = chileNowMinutes();
  const live = todays.find((s) => now >= timeToMin(s.startTime) - 15 && now <= timeToMin(s.endTime) + 15);
  if (live) return live;
  const upcoming = todays.find((s) => timeToMin(s.startTime) - 15 > now);
  if (upcoming) return upcoming;
  return todays[0] || pool[0] || null;
}

export function initials(name?: string) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0] || 'DP').slice(0, 2).toUpperCase();
}

export function formatCheckTime(iso?: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: TZ,
    });
  } catch {
    return '—';
  }
}

export function isBookedThisWeek(student: Student, slot: ClassSlot, weekStart: number) {
  return (student.scheduledClasses || []).some(
    (sc) => sc.timestamp >= weekStart && sc.day === slot.day && sc.time === slot.startTime,
  );
}

export function expectedForSlot(students: Student[], slot: ClassSlot, weekStart: number) {
  const sameSede = students.filter((s) => !slot.sedeId || Number(s.sedeId || s.sede_id) === Number(slot.sedeId));
  const booked = sameSede.filter((s) => isBookedThisWeek(s, slot, weekStart));
  if (booked.length) return booked;
  return sameSede.filter((s) => {
    if (slot.audience === 'BOTH') return true;
    const birth = s.birthDate;
    if (!birth) return slot.audience !== 'KIDS';
    const age = Math.floor((Date.now() - new Date(birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return slot.audience === 'KIDS' ? age < 18 : age >= 18;
  });
}
