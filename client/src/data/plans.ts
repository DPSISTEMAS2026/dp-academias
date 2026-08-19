export function planWeeklyMax(plan?: string | null) {
  const p = String(plan || '').toLowerCase();
  if (p.includes('ilimitado') || p.includes('libre')) return 99;
  const match = String(plan || '').match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 2;
}

export function planLabel(plan?: string | null) {
  const p = String(plan || '');
  if (/ilimitado|libre/i.test(p)) return 'Plan Libre';
  const n = planWeeklyMax(p);
  if (n >= 99) return 'Plan Libre';
  return `Plan ${n} clases`;
}

export function chileWeekStartDate(d = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(d);
  const y = Number(parts.find((x) => x.type === 'year')?.value);
  const m = Number(parts.find((x) => x.type === 'month')?.value);
  const day = Number(parts.find((x) => x.type === 'day')?.value);
  const wd = new Date(Date.UTC(y, m - 1, day)).getUTCDay() || 7;
  const monday = new Date(Date.UTC(y, m - 1, day - (wd - 1)));
  return monday.toISOString().slice(0, 10);
}

export const DEMO_PLANS = ['2', '3', 'Ilimitado'] as const;
