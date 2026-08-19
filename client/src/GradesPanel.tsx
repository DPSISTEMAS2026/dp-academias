import { useMemo, useState } from 'react';
import type { Student } from './types';
import { formatShortDate, withProgress } from './data/grades';
import PanelTabs from './PanelTabs';
import './GradesPanel.css';
import './panel-shell.css';

type Props = {
  students: Student[];
  onSave: (student: Student) => void;
};

export default function GradesPanel({ students, onSave }: Props) {
  const [belt, setBelt] = useState('ALL');
  const rows = useMemo(() => students.map(withProgress).filter((s) => belt === 'ALL' || s.belt === belt), [students, belt]);

  const patchDates = (student: Student, field: 'joinDate' | 'evaluationDate', value: string) => {
    const base = withProgress(student);
    const next: Student = {
      ...base,
      joinDate: field === 'joinDate' ? value : base.joinDate,
      evaluationDate: field === 'evaluationDate' ? value : (base.evaluationDate || base.progress?.evaluationDate),
      progress: {
        ...base.progress!,
        evaluationDate: field === 'evaluationDate' ? value : (base.progress?.evaluationDate || ''),
      },
    };
    onSave(next);
  };

  return (
    <div className="gr-wrap">
      <section className="gr-card">
        <div className="gr-head">
          <div>
            <div className="gr-kicker">Grados</div>
            <h2>Ingreso y evaluación</h2>
          </div>
        </div>
        <PanelTabs
          name="grados"
          value={belt}
          onChange={setBelt}
          items={[
            { id: 'ALL', label: 'Todos' },
            { id: 'GRAY', label: 'Gris' },
            { id: 'WHITE', label: 'Blanco' },
            { id: 'BLUE', label: 'Azul' },
            { id: 'PURPLE', label: 'Morado' },
            { id: 'BROWN', label: 'Marrón' },
            { id: 'BLACK', label: 'Negro' },
          ]}
        />
        <div className="gr-table-head">
          <span>Alumno</span>
          <span>Ingreso</span>
          <span>Fecha de evaluación</span>
        </div>
        {rows.map((s) => {
          const evalDate = s.progress?.evaluationDate || s.evaluationDate || '';
          return (
            <div className="gr-row" key={s.id}>
              <div>
                <div className="gr-name">{s.name}</div>
                <div className="gr-rank">{formatShortDate(s.joinDate) === '—' ? 'Sin fecha de ingreso' : `Desde ${formatShortDate(s.joinDate)}`}</div>
              </div>
              <label className="gr-date">
                <span>Ingreso</span>
                <input
                  type="date"
                  value={s.joinDate || ''}
                  onChange={(e) => patchDates(s, 'joinDate', e.target.value)}
                />
              </label>
              <label className="gr-date">
                <span>Evaluación</span>
                <input
                  type="date"
                  value={evalDate}
                  onChange={(e) => patchDates(s, 'evaluationDate', e.target.value)}
                />
              </label>
            </div>
          );
        })}
      </section>
    </div>
  );
}
