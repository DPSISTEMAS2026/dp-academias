import type { Belt, GradeEvent, Student, StudentProgress } from '../types';

export const BELT_ORDER: Belt[] = ['GRAY', 'WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK'];

export const BELT_LABELS: Record<Belt, string> = {
  WHITE: 'Blanco',
  BLUE: 'Azul',
  PURPLE: 'Morado',
  BROWN: 'Marrón',
  BLACK: 'Negro',
  GRAY: 'Gris',
};

export const BELT_HEX: Record<Belt, string> = {
  WHITE: '#f4f4f5',
  BLUE: '#2563eb',
  PURPLE: '#7c3aed',
  BROWN: '#78350f',
  BLACK: '#111111',
  GRAY: '#94a3b8',
};

export function stripeLabel(n: number) {
  if (n <= 0) return 'Sin grados';
  if (n === 1) return '1er grado';
  if (n === 3) return '3er grado';
  return `${n}º grado`;
}

export function currentRankLabel(belt: Belt, stripes: number) {
  const base = `Cinturón ${BELT_LABELS[belt].toLowerCase()}`;
  return stripes > 0 ? `${base} · ${stripeLabel(stripes)}` : base;
}

export function beltPathFor(student: Student): Belt[] {
  const kids = student.belt === 'GRAY' || /kids/i.test(student.discipline || '');
  if (kids) return ['GRAY', 'WHITE', 'BLUE', 'PURPLE'];
  return ['WHITE', 'BLUE', 'PURPLE', 'BROWN', 'BLACK'];
}

export function addMonths(iso: string, months: number) {
  const [y, m, d] = (iso || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  const dt = new Date(y, m - 1 + months, d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

export function defaultEvalDate(student: Student) {
  if (student.id === '1') return '2026-09-15';
  if (student.id === '2') return '2026-10-04';
  if (student.id === '3') return '2026-08-30';
  if (student.id === '4') return '2026-11-20';
  return student.joinDate ? addMonths(student.joinDate, 6) : '';
}

export function formatShortDate(iso?: string | null) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function emptyProgress(): StudentProgress {
  return { stripes: 0, techniquesDone: 0, techniquesTotal: 20, evaluation: 0, notes: '', history: [] };
}

export function defaultProgress(student: Student): StudentProgress {
  const fromLast = /(\d+)/.exec(student.lastGrade || '');
  const stripes = fromLast ? Math.min(4, Number(fromLast[1])) : 0;
  const belt = student.belt || 'WHITE';
  const history: GradeEvent[] = [];
  if (student.joinDate) {
    history.push({
      id: 'join',
      label: `Cinturón ${BELT_LABELS[belt].toLowerCase()}`,
      belt,
      stripes: 0,
      date: student.joinDate,
    });
  }
  if (stripes >= 1) history.push({ id: 'g1', label: '1er grado', belt, stripes: 1, date: '2025-06-15' });
  if (stripes >= 2) history.push({ id: 'g2', label: '2º grado', belt, stripes: 2, date: '2025-12-10' });
  if (stripes >= 3) history.push({ id: 'g3', label: '3er grado', belt, stripes: 3, date: student.graduationDate || '2026-01-10' });
  return {
    stripes,
    techniquesDone: 0,
    techniquesTotal: 20,
    evaluation: 0,
    evaluationDate: student.evaluationDate || defaultEvalDate(student),
    notes: '',
    history,
  };
}

export function withProgress(student: Student): Student {
  const p = student.progress && Array.isArray(student.progress.history)
    ? { ...defaultProgress(student), ...student.progress, history: student.progress.history }
    : defaultProgress(student);
  if (!p.evaluationDate) p.evaluationDate = student.evaluationDate || defaultEvalDate(student);
  return { ...student, progress: p, evaluationDate: p.evaluationDate };
}
