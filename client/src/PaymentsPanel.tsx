import { useEffect, useState } from 'react';
import type { AutomationConfig, PlanFees, Student } from './types';
import { DEMO_PLANS, planLabel } from './data/plans';
import PanelTabs from './PanelTabs';
import { MpLogo } from './MpLogo';
import './PaymentsPanel.css';
import './panel-shell.css';

type Props = {
  students: Student[];
  fees: PlanFees;
  automation: AutomationConfig;
  formatCLP: (n: number) => string;
  onSaveFees: (fees: PlanFees) => void;
  onSaveAutomation: (auto: AutomationConfig) => void;
  onRegisterPayment: (studentId: string, date?: string) => void;
};

function dueLabel(day: number) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), Math.min(Math.max(day, 1), 28));
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' });
}

function identified(student: Student) {
  if (!student.isPaid) return '—';
  const last = student.history?.[student.history.length - 1] as { method?: string } | undefined;
  const method = last?.method || '';
  if (/manual|efectivo|cash/i.test(method)) return 'Anotado';
  if (/transfer/i.test(method)) return 'Detectada';
  if (/mercado/i.test(method)) return 'Automático';
  return 'Detectada';
}

export default function PaymentsPanel({
  students,
  fees,
  automation,
  formatCLP,
  onSaveFees,
  onSaveAutomation,
  onRegisterPayment,
}: Props) {
  const [draftFees, setDraftFees] = useState<PlanFees>(fees);
  const [draftAuto, setDraftAuto] = useState<AutomationConfig>({
    reminderEnabled: true,
    mercadoPago: true,
    transfer: true,
    ...automation,
  });
  const [hint, setHint] = useState('');
  const [tab, setTab] = useState<'planes' | 'cobros'>('cobros');

  useEffect(() => { setDraftFees(fees); }, [fees]);
  useEffect(() => {
    setDraftAuto((prev) => ({ ...prev, ...automation }));
  }, [automation]);

  const paid = students.filter((s) => s.isPaid);
  const pending = students.filter((s) => !s.isPaid);

  const setPlanPrice = (key: string, value: number) => {
    setDraftFees((prev) => ({
      ...prev,
      adults: { ...prev.adults, [key]: value },
      kids: { ...prev.kids, [key]: value },
    }));
  };

  const save = () => {
    onSaveFees(draftFees);
    onSaveAutomation(draftAuto);
    setHint('Configuración guardada.');
  };

  return (
    <div className="pay-wrap">
      <section className="pay-card">
        <div className="pay-head">
          <div className="pay-kicker">Finanzas</div>
          <h2>{tab === 'planes' ? 'Planes y mensualidades' : 'Control de pagos'}</h2>
        </div>
        <PanelTabs
          name="finanzas"
          value={tab}
          onChange={(id) => setTab(id as typeof tab)}
          items={[{ id: 'cobros', label: 'Cobros' }, { id: 'planes', label: 'Planes' }]}
        />
        {tab === 'planes' && (
          <div className="pay-body">
            {DEMO_PLANS.map((key) => (
              <div className="pay-plan" key={key}>
                <div>
                  <strong>{planLabel(key)}</strong>
                  <span>{key === 'Ilimitado' ? 'Reservas ilimitadas' : `${key} clases por semana`}</span>
                </div>
                <input
                  type="number"
                  step={1000}
                  value={draftFees.adults[key] ?? 0}
                  onChange={(e) => setPlanPrice(key, parseInt(e.target.value, 10) || 0)}
                />
              </div>
            ))}
            <div className="pay-row">
              <label>Vencimiento (día {draftAuto.reminderDay})</label>
              <input
                type="number"
                min={1}
                max={28}
                value={draftAuto.reminderDay}
                onChange={(e) => setDraftAuto({ ...draftAuto, reminderDay: Math.min(28, Math.max(1, parseInt(e.target.value, 10) || 5)) })}
              />
            </div>
            <div className="pay-row">
              <label>Recordatorio automático</label>
              <button
                type="button"
                className={`pay-toggle ${draftAuto.reminderEnabled !== false ? 'on' : 'off'}`}
                onClick={() => setDraftAuto({ ...draftAuto, reminderEnabled: draftAuto.reminderEnabled === false })}
              >
                {draftAuto.reminderEnabled !== false ? 'Activo' : 'Apagado'}
              </button>
            </div>
            <div className="pay-row">
              <label className="pay-mp-label"><MpLogo height={28} /></label>
              <button
                type="button"
                className={`pay-toggle ${draftAuto.mercadoPago !== false ? 'on' : 'off'}`}
                onClick={() => setDraftAuto({ ...draftAuto, mercadoPago: draftAuto.mercadoPago === false })}
              >
                {draftAuto.mercadoPago !== false ? 'Habilitado' : 'Off'}
              </button>
            </div>
            <div className="pay-row">
              <label>Transferencia</label>
              <button
                type="button"
                className={`pay-toggle ${draftAuto.transfer !== false ? 'on' : 'off'}`}
                onClick={() => setDraftAuto({ ...draftAuto, transfer: draftAuto.transfer === false })}
              >
                {draftAuto.transfer !== false ? 'Habilitado' : 'Off'}
              </button>
            </div>
            <button type="button" className="pay-save" onClick={save}>Guardar configuración</button>
            {hint ? <div className="pay-hint">{hint}</div> : null}
          </div>
        )}

        {tab === 'cobros' && (
        <div>
          <p className="pay-highlight">
            El sistema <strong>detecta la transferencia</strong> y deja al alumno al día.
            Si te pagan en efectivo o por otra vía, estás a un botón de anotarlo — desde el celular o cualquier lugar.
          </p>
          <div className="pay-stats">
            <div className="pay-stat ok">
              <span>Pagados</span>
              <strong>{paid.length}</strong>
            </div>
            <div className="pay-stat bad">
              <span>Pendientes</span>
              <strong>{pending.length}</strong>
            </div>
          </div>
          <table className="pay-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Plan</th>
                <th>Vence</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Pago</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{planLabel(s.plan)}</td>
                  <td>{dueLabel(draftAuto.reminderDay)}</td>
                  <td>{formatCLP(s.monthlyFee || 0)}</td>
                  <td>
                    <span className={`pay-pill ${s.isPaid ? 'ok' : 'bad'}`}>
                      {s.isPaid ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                  <td>
                    {s.isPaid ? (
                      <span className={`pay-pill ${identified(s) === 'Anotado' ? 'note' : 'ok'}`}>
                        {identified(s)}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="pay-ghost"
                        onClick={() => {
                          onRegisterPayment(s.id);
                        }}
                      >
                        Anotar pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </section>
    </div>
  );
}
