import { useEffect, useState } from 'react';
import { Camera, DollarSign, Mail, Save, Trash2, X } from 'lucide-react';
import { MpLogo } from './MpLogo';
import { BRAND } from './brand';
import type { Student, Belt } from './types';
import BeltPath from './BeltPath';
import { currentRankLabel, formatShortDate, withProgress } from './data/grades';
import './StudentFile.css';

type Tab = 'datos' | 'pagos' | 'agenda' | 'progreso';

type Props = {
  student: Student;
  isMobile: boolean;
  role: string;
  sedes: { id: number; name: string }[];
  beltLabels: Record<Belt, string>;
  planLabels: Record<string, string>;
  isGeneratingPayment: boolean;
  weekStart: number;
  avatarUrl: string;
  formatCLP: (n: number) => string;
  formatDate: (d?: string | null, style?: 'numeric' | 'long' | 'short') => string;
  calculateAge: (d: string | null) => number;
  onClose: () => void;
  onSave: (student: Student) => void | Promise<unknown>;
  onChangePhoto: () => void;
  onViewPhoto: () => void;
  onAddFamily: () => void;
  onCreatePaymentLink: () => void;
  onSendReminder: () => void;
  onDelete: () => void;
  allowDelete?: boolean;
  onManualPay: (student: Student) => void;
};

const TABS: { id: Tab; label: string }[] = [
  { id: 'datos', label: 'Datos' },
  { id: 'pagos', label: 'Pagos' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'progreso', label: 'Progreso' },
];

const DEMO_PLANS = [
  { value: '2', label: 'Plan 2 clases' },
  { value: '3', label: 'Plan 3 clases' },
  { value: 'Ilimitado', label: 'Plan Libre' },
];

export default function StudentFile({
  student,
  isMobile,
  role,
  sedes,
  beltLabels,
  planLabels,
  isGeneratingPayment,
  weekStart,
  avatarUrl,
  formatCLP,
  formatDate,
  calculateAge,
  onClose,
  onSave,
  onChangePhoto,
  onViewPhoto,
  onAddFamily,
  onCreatePaymentLink,
  onSendReminder,
  onDelete,
  allowDelete = false,
  onManualPay,
}: Props) {
  const [tab, setTab] = useState<Tab>('datos');
  const [draft, setDraft] = useState<Student>(student);
  const [saving, setSaving] = useState(false);
  const [saveHint, setSaveHint] = useState('');
  const canEdit = role === 'admin' || role === 'superadmin';

  useEffect(() => {
    setDraft(student);
    setTab('datos');
    setSaveHint('');
    // #region agent log
    fetch('http://127.0.0.1:7384/ingest/9e21c8e3-483a-45df-aa40-cfd1021a0115',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'371f79'},body:JSON.stringify({sessionId:'371f79',hypothesisId:'A',location:'StudentFile.tsx:open',message:'ficha draft reset on id',data:{id:student.id,tab:'datos'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, [student.id]);

  const setField = <K extends keyof Student>(key: K, value: Student[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const saveFicha = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7384/ingest/9e21c8e3-483a-45df-aa40-cfd1021a0115',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'371f79'},body:JSON.stringify({sessionId:'371f79',hypothesisId:'C',location:'StudentFile.tsx:save',message:'guardar click',data:{id:draft.id,name:draft.name,phone:draft.phone||'',allergies:draft.allergies||'',tutorName:draft.tutorName||'',tab},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    setSaving(true);
    setSaveHint('');
    try {
      const result = await onSave(draft);
      const ok = result !== false;
      // #region agent log
      fetch('http://127.0.0.1:7384/ingest/9e21c8e3-483a-45df-aa40-cfd1021a0115',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'371f79'},body:JSON.stringify({sessionId:'371f79',hypothesisId:'D',location:'StudentFile.tsx:save-result',message:'guardar resultado',data:{id:draft.id,ok,resultType:typeof result,hint:ok?'Ficha guardada':'No se pudo guardar'},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setSaveHint(ok ? 'Ficha guardada' : 'No se pudo guardar');
    } catch {
      setSaveHint('No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const sedeName = sedes.find((s) => s.id === Number(draft.sedeId || draft.sede_id))?.name || '—';
  const age = draft.birthDate ? calculateAge(draft.birthDate) : null;
  const weekClasses = (draft.scheduledClasses || []).filter((sc) => sc.timestamp >= weekStart);
  const isAdmin = canEdit;

  return (
    <div className="sf-overlay" onClick={onClose}>
      <div className={`sf-panel${isMobile ? ' is-mobile' : ''}`} onClick={(e) => e.stopPropagation()}>
        <header className="sf-head">
          <div>
            <div className="sf-kicker">Ficha del alumno</div>
            <h2>{draft.name}</h2>
          </div>
          <button type="button" className="sf-icon-btn" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        <div className="sf-hero">
          <button type="button" className="sf-photo" onClick={onViewPhoto} title="Ver foto">
            <img
              src={avatarUrl || BRAND.mascotAvatar}
              alt={draft.name}
              onError={(e) => { e.currentTarget.src = BRAND.mascotAvatar; }}
            />
          </button>
          <div className="sf-hero-copy">
            {isAdmin && (
              <button type="button" className="sf-link" onClick={onChangePhoto}>
                <Camera size={14} /> Cambiar foto
              </button>
            )}
            <div className="sf-chips">
              <span>{draft.allergies || 'Sin alergias'}</span>
              <span>{draft.discipline || 'Sin disciplina'}</span>
              <span>{beltLabels[draft.belt] || draft.belt}</span>
              <span>{sedeName}</span>
            </div>
            {age !== null && (
              <p className="sf-meta">
                {formatDate(draft.birthDate, 'long')}
                {age !== null ? ` · ${age} años` : ''}
              </p>
            )}
          </div>
        </div>

        <nav className="sf-tabs" aria-label="Secciones de la ficha">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? 'is-active' : ''}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sf-body">
          {tab === 'datos' && (
            <div className="sf-grid">
              <label>
                Nombre
                <input value={draft.name || ''} onChange={(e) => setField('name', e.target.value)} disabled={!isAdmin} />
              </label>
              <label>
                Fecha de nacimiento
                <input type="date" value={draft.birthDate || ''} onChange={(e) => setField('birthDate', e.target.value)} disabled={!isAdmin} />
              </label>
              <label>
                Teléfono
                <input value={draft.phone || ''} onChange={(e) => setField('phone', e.target.value)} disabled={!isAdmin} />
              </label>
              <label>
                Correo
                <input value={draft.email || ''} onChange={(e) => setField('email', e.target.value)} disabled={!isAdmin} />
              </label>
              <label>
                Disciplina
                <input value={draft.discipline || ''} onChange={(e) => setField('discipline', e.target.value)} disabled={!isAdmin} placeholder="Jiu Jitsu Kids" />
              </label>
              <label>
                Alergias
                <input value={draft.allergies || ''} onChange={(e) => setField('allergies', e.target.value)} disabled={!isAdmin} placeholder="Ninguna" />
              </label>
              {isAdmin && sedes.length > 0 && (
                <label>
                  Sede
                  <select
                    value={String(draft.sedeId || draft.sede_id || '')}
                    onChange={(e) => setField('sedeId', Number(e.target.value))}
                  >
                    {sedes.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                Cinturón
                <select value={draft.belt} onChange={(e) => setField('belt', e.target.value as Belt)} disabled={!isAdmin}>
                  {Object.entries(beltLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </label>
              <label>
                Peso (kg)
                <input type="number" value={draft.weight || ''} onChange={(e) => setField('weight', parseFloat(e.target.value) || 0)} disabled={!isAdmin} />
              </label>
              <label>
                Género
                <select value={draft.gender || ''} onChange={(e) => setField('gender', e.target.value as 'MALE' | 'FEMALE')} disabled={!isAdmin}>
                  <option value="">—</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                </select>
              </label>

              <div className="sf-block">
                <h3>Contacto de emergencia</h3>
                <div className="sf-grid">
                  <label>
                    Nombre
                    <input value={draft.emergencyName || ''} onChange={(e) => setField('emergencyName', e.target.value)} disabled={!isAdmin} />
                  </label>
                  <label>
                    Relación
                    <input value={draft.emergencyRelation || ''} onChange={(e) => setField('emergencyRelation', e.target.value)} disabled={!isAdmin} placeholder="Madre, padre..." />
                  </label>
                  <label>
                    Teléfono
                    <input value={draft.emergencyPhone || ''} onChange={(e) => setField('emergencyPhone', e.target.value)} disabled={!isAdmin} />
                  </label>
                </div>
              </div>

              <div className="sf-block">
                <h3>Apoderado responsable</h3>
                <div className="sf-grid">
                  <label>
                    Nombre
                    <input value={draft.tutorName || ''} onChange={(e) => setField('tutorName', e.target.value)} disabled={!isAdmin} />
                  </label>
                  <label>
                    Relación
                    <input value={draft.tutorRelation || ''} onChange={(e) => setField('tutorRelation', e.target.value)} disabled={!isAdmin} />
                  </label>
                  <label>
                    Teléfono
                    <input value={draft.tutorPhone || ''} onChange={(e) => setField('tutorPhone', e.target.value)} disabled={!isAdmin} />
                  </label>
                  <label>
                    Correo
                    <input value={draft.tutorEmail || ''} onChange={(e) => setField('tutorEmail', e.target.value)} disabled={!isAdmin} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {tab === 'pagos' && (
            <div className="sf-stack">
              <div className="sf-status">
                <div className={draft.isPaid ? 'ok' : 'warn'}>
                  {draft.isPaid ? 'Mensualidad al día' : 'Pago pendiente'}
                </div>
                <p>{planLabels[String(draft.plan || '')] || draft.plan || 'Sin plan'} · {formatCLP(draft.monthlyFee || 0)}</p>
                <p>Último pago: {formatDate(draft.lastPaymentDate)}</p>
              </div>
              {isAdmin && (
                <div className="sf-grid">
                  <label>
                    Plan
                    <select value={String(draft.plan || '3')} onChange={(e) => setField('plan', e.target.value)}>
                      {DEMO_PLANS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Mensualidad
                    <input type="number" value={draft.monthlyFee || 0} onChange={(e) => setField('monthlyFee', parseInt(e.target.value, 10) || 0)} />
                  </label>
                </div>
              )}
              <table className="sf-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {(draft.history || []).filter((record: any) => record && !record._ficha && !record._competition_info).length === 0 && (
                    <tr><td colSpan={3}>Sin pagos registrados.</td></tr>
                  )}
                  {(draft.history || []).filter((record: any) => record && !record._ficha && !record._competition_info).map((record, idx) => (
                    <tr key={`${record.date}-${idx}`}>
                      <td>{formatDate(record.date)}</td>
                      <td>{formatCLP(record.amount)}</td>
                      <td>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isAdmin && (
                <div className="sf-actions">
                  <button type="button" className="sf-btn" onClick={() => onManualPay(draft)}>
                    <DollarSign size={16} /> Anotar pago
                  </button>
                  {!draft.isPaid && (
                    <button type="button" className="sf-btn sf-btn-mp" disabled={isGeneratingPayment} onClick={onCreatePaymentLink}>
                      <MpLogo height={24} />
                    </button>
                  )}
                  <button type="button" className="sf-btn ghost" onClick={onSendReminder}>
                    <Mail size={16} /> Recordatorio
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === 'agenda' && (
            <div className="sf-stack">
              {weekClasses.length === 0 && <p className="sf-empty">Sin clases reservadas esta semana.</p>}
              {weekClasses.map((sc, idx) => (
                <div key={`${sc.day}-${sc.time}-${idx}`} className="sf-class">
                  <strong>{sc.day}</strong>
                  <span>{sc.time} · {sc.name}</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'progreso' && (
            <div className="sf-stack">
              {(() => {
                const me = withProgress(draft);
                const hist = me.progress?.history || [];
                return (
                  <>
                    <div className="sf-status">
                      <div className="ok">{currentRankLabel(me.belt, me.progress?.stripes || 0)}</div>
                      <p>Ingreso {formatDate(me.joinDate, 'short')} · Evaluación {formatShortDate(me.progress?.evaluationDate)}</p>
                    </div>
                    <div className="sf-block">
                      <h3>Camino de cinturones</h3>
                      <BeltPath student={me} />
                    </div>
                    <div className="sf-block">
                      <h3>Graduaciones</h3>
                      {hist.length === 0 && <p className="sf-empty">Sin graduaciones registradas.</p>}
                      {hist.map((ev, i) => (
                        <div key={ev.id || i} className="sf-class">
                          <strong>{ev.label}</strong>
                          <span>{formatDate(ev.date, 'short')}</span>
                        </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        <footer className="sf-foot">
          {isAdmin && (
            <>
              <button type="button" className="sf-btn ghost" onClick={onAddFamily}>Añadir familiar</button>
              <button type="button" className="sf-btn primary" disabled={saving} onClick={saveFicha}>
                <Save size={16} /> {saving ? 'Guardando…' : saveHint === 'Ficha guardada' ? 'Guardada' : 'Guardar ficha'}
              </button>
              {allowDelete ? (
                <button type="button" className="sf-btn danger" onClick={onDelete}>
                  <Trash2 size={16} />
                </button>
              ) : (
                <button type="button" className="sf-btn ghost" onClick={onDelete} title="Bloqueado en la demo">
                  <Trash2 size={16} />
                </button>
              )}
            </>
          )}
        </footer>
      </div>
    </div>
  );
}
