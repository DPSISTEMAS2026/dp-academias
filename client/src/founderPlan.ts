/** Comercial del Plan Fundador. Cambiar acá, no en el componente visual. */

export const founderPlanEnabled = true;
export const founderSlotsTotal = 10;
/** Ocupación real. No se muestra “quedan N cupos” hasta tener este dato operativo. */
export const founderSlotsUsed = 0;

export type BillingCycle = 'monthly' | 'semiannual' | 'annual';

export const founderPlanPrices = {
  monthly: {
    firstYearPrice: 34990,
    renewalPrice: 24990,
    period: 'mes',
    billingDescription: 'Durante los primeros 12 meses',
    badge: 'Pago flexible',
  },
  semiannual: {
    firstYearPrice: 194900,
    renewalPrice: 134900,
    period: 'semestre',
    billingDescription: 'Durante los primeros 12 meses, en dos pagos semestrales',
    savings: 15040,
    badge: 'Ahorra por semestre',
  },
  annual: {
    firstYearPrice: 374900,
    renewalPrice: 254900,
    period: 'año',
    billingDescription: 'Un solo pago anticipado por los primeros 12 meses',
    savings: 44980,
    badge: 'Mejor precio',
    featured: true,
  },
} as const;

export const FOUNDER_CYCLES: { id: BillingCycle; label: string }[] = [
  { id: 'monthly', label: 'Mensual' },
  { id: 'semiannual', label: 'Semestral' },
  { id: 'annual', label: 'Anual' },
];

const clp = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

export function formatClp(value: number) {
  return `$${clp.format(value)}`;
}

export function cycleBadge(id: BillingCycle) {
  const cycle = founderPlanPrices[id];
  if (id === 'annual' && 'savings' in cycle) {
    return `Mejor precio — Ahorra ${formatClp(cycle.savings)}`;
  }
  if (id === 'semiannual' && 'savings' in cycle) {
    return `Ahorra ${formatClp(cycle.savings)} por ${cycle.period}`;
  }
  return cycle.badge;
}

/** Aviso operativo (no corta el alta). La mensualidad de DP no se cobra por alumno. */
export const studentSoftCap = 120;

export const founderConsultMessage =
  'Hola, mi academia necesita algo diferente al Plan Academia. Conversemos.';
