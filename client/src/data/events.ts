import type { AcademyEvent, Belt, EventCategory, EventRegistration } from '../types';

export const SEED_EVENT_ID = 'ev1';

export function slugify(value: string) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'evento';
}

export function ageFromBirth(iso?: string | null) {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  const now = new Date();
  let age = now.getFullYear() - y;
  const md = now.getMonth() + 1 - m;
  if (md < 0 || (md === 0 && now.getDate() < d)) age -= 1;
  return age;
}

export function categoryFits(cat: EventCategory, info: { age: number | null; weight: number | null; gender?: string; belt?: string }) {
  if (cat.minAge != null && (info.age == null || info.age < cat.minAge)) return false;
  if (cat.maxAge != null && (info.age == null || info.age > cat.maxAge)) return false;
  if (cat.minWeight != null && (info.weight == null || info.weight < cat.minWeight)) return false;
  if (cat.maxWeight != null && (info.weight == null || info.weight > cat.maxWeight)) return false;
  if (cat.gender && cat.gender !== 'ANY' && info.gender && info.gender !== cat.gender) return false;
  if (cat.belts?.length && info.belt && !cat.belts.includes(info.belt as Belt)) return false;
  return true;
}

export function suggestCategory(event: AcademyEvent, info: { age: number | null; weight: number | null; gender?: string; belt?: string }) {
  return (event.categories || []).find((c) => categoryFits(c, info)) || event.categories?.[0] || null;
}

export function categoryLabel(cat: EventCategory) {
  const bits: string[] = [cat.name];
  if (cat.minAge != null || cat.maxAge != null) {
    bits.push(`${cat.minAge ?? '—'}–${cat.maxAge ?? '—'} años`);
  }
  if (cat.gender === 'MALE') bits.push('Masculino');
  if (cat.gender === 'FEMALE') bits.push('Femenino');
  if (cat.belts?.length) bits.push(cat.belts.map((b) => b.charAt(0) + b.slice(1).toLowerCase()).join('/'));
  return bits.join(' · ');
}

export function formatCLP(n: number) {
  return `$${Number(n || 0).toLocaleString('es-CL')}`;
}

export function formatEventWhen(event: Pick<AcademyEvent, 'date' | 'startTime' | 'endTime'>) {
  if (!event.date) return 'Fecha por confirmar';
  const [y, m, d] = event.date.split('-').map(Number);
  const date = y && m && d
    ? new Date(y, m - 1, d).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : event.date;
  const time = [event.startTime, event.endTime].filter(Boolean).join(' – ');
  return time ? `${date} · ${time}` : date;
}

export function mediaUrl(api: string, src?: string | null) {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('blob:')) return src;
  return `${api}${src}`;
}

export function emptyCategory(): EventCategory {
  return {
    id: `c${Date.now()}`,
    name: '',
    minAge: null,
    maxAge: null,
    minWeight: null,
    maxWeight: null,
    gender: 'ANY',
    belts: [],
    price: 15000,
  };
}

export function emptyEvent(): AcademyEvent {
  return {
    id: '',
    slug: '',
    title: '',
    description: '',
    photo: '',
    rulesUrl: '',
    rulesName: '',
    date: '',
    startTime: '09:00',
    endTime: '18:00',
    address: '',
    capacity: 120,
    paid: true,
    price: 15000,
    status: 'draft',
    categories: [],
  };
}

export function groupRegistrations(rows: EventRegistration[]) {
  const students = rows.filter((r) => r.kind === 'student');
  const guests = rows.filter((r) => r.kind === 'guest');
  const byCategory: Record<string, EventRegistration[]> = {};
  rows.forEach((r) => {
    const key = r.categoryName || 'Sin categoría';
    byCategory[key] = byCategory[key] || [];
    byCategory[key].push(r);
  });
  return { students, guests, byCategory, paid: rows.filter((r) => r.status === 'paid'), pending: rows.filter((r) => r.status === 'pending') };
}
