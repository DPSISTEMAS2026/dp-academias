import type { Belt, Student } from './types';
import { BELT_HEX, BELT_LABELS, beltPathFor, withProgress } from './data/grades';
import './BeltPath.css';

type Props = {
  student: Student;
};

export default function BeltPath({ student }: Props) {
  const me = withProgress(student);
  const path = beltPathFor(me);
  const current = me.belt;
  const idx = Math.max(0, path.indexOf(current));
  const stripes = me.progress?.stripes || 0;

  return (
    <div className="bp">
      {path.map((belt, i) => {
        const state = i < idx ? 'is-done' : i === idx ? 'is-now' : '';
        return (
          <div key={belt} className={`bp-step ${state}`}>
            <div
              className="bp-disc"
              style={{ background: i <= idx ? BELT_HEX[belt as Belt] : '#fff' }}
              title={BELT_LABELS[belt]}
            />
            <div className="bp-label">{BELT_LABELS[belt]}</div>
            {i === idx ? (
              <div className="bp-stripes" aria-hidden>
                {[0, 1, 2, 3].map((n) => <i key={n} className={n < stripes ? 'on' : ''} />)}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
