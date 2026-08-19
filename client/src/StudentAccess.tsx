import { useEffect, useRef, useState } from 'react';
import { Check, Clock, ScanLine, X } from 'lucide-react';
import type { AttendanceRecord, ClassSlot, Student } from './types';
import { ACADEMY_QR, chileToday, formatCheckTime, isAcademyQr } from './data/attendance';
import { avatarSrc } from './brand';
import './StudentAccess.css';

type Props = {
  student: Student;
  slots: ClassSlot[];
  apiUrl: string;
  onClose: () => void;
};

export default function StudentAccess({ student, slots, apiUrl, onClose }: Props) {
  const [record, setRecord] = useState<AttendanceRecord | null>(null);
  const [scanState, setScanState] = useState<'off' | 'active' | 'busy'>('off');
  const [error, setError] = useState('');
  const handleRef = useRef<(raw: string) => void>(() => {});
  const lastScan = useRef({ code: '', at: 0 });

  const checkIn = async (raw = ACADEMY_QR) => {
    if (!isAcademyQr(raw)) {
      setError('Ese no es el QR de la academia. Apunta al código de la puerta.');
      return;
    }
    setScanState('busy');
    setError('');
    try {
      const res = await fetch(`${apiUrl}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, academyQr: ACADEMY_QR }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No se pudo registrar');
        setScanState('active');
        return;
      }
      setRecord(data.record || null);
    } catch (e: any) {
      setError(e.message || 'Error de red');
    } finally {
      setScanState((s) => (s === 'busy' ? 'active' : s));
    }
  };

  handleRef.current = (raw: string) => {
    const now = Date.now();
    if (raw === lastScan.current.code && now - lastScan.current.at < 2500) return;
    lastScan.current = { code: raw, at: now };
    checkIn(raw);
  };

  useEffect(() => {
    let stop = false;
    const poll = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/attendance/me?studentId=${encodeURIComponent(student.id)}&date=${chileToday()}`);
        const data = await res.json();
        if (stop) return;
        if (data.record) setRecord(data.record);
      } catch {}
    };
    poll();
    const t = setInterval(poll, 2500);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [apiUrl, student.id]);

  useEffect(() => {
    if (record) return;
    let cancelled = false;
    let scanner: { stop: () => Promise<void>; clear: () => void; getState?: () => number } | null = null;
    let running = false;
    const safeStop = (inst: typeof scanner, wasRunning: boolean) => {
      if (!inst) return;
      const state = inst.getState?.() ?? null;
      const live = wasRunning || state === 2 || state === 3;
      if (!live) {
        try { inst.clear(); } catch (_) {}
        return;
      }
      try {
        inst.stop().then(() => { try { inst.clear(); } catch (_) {} }).catch(() => { try { inst.clear(); } catch (_) {} });
      } catch {
        try { inst.clear(); } catch (_) {}
      }
    };
    (async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) return;
        const inst = new Html5Qrcode('sa-scan-box');
        scanner = inst;
        await inst.start(
          { facingMode: 'environment' },
          { fps: 8, qrbox: { width: 220, height: 220 } },
          (text: string) => handleRef.current(text),
          () => {},
        );
        if (cancelled) {
          safeStop(inst, true);
          return;
        }
        running = true;
        setScanState('active');
      } catch {
        if (!cancelled) setScanState('off');
      }
    })();
    return () => {
      cancelled = true;
      safeStop(scanner, running);
    };
  }, [record]);

  const slot = record ? slots.find((s) => s.id === record.slotId) : null;
  const confirmed = !!record;

  return (
    <div className="sa-overlay" onClick={onClose}>
      <div className="sa-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sa-top">
          <div>
            <div className="sa-kicker">Asistencia</div>
            <h2>{confirmed ? 'Asistencia registrada' : 'Escanear QR de la academia'}</h2>
          </div>
          <button className="sa-close" type="button" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>

        {!confirmed ? (
          <>
            <p className="sa-hint">El código de la puerta no cambia. Al escanearlo queda la fecha y la hora de tu entrada.</p>
            <div className="sa-scan-frame">
              <div className="sa-scan-box" id="sa-scan-box" />
            </div>
            <div className="sa-scan-status">
              <ScanLine size={16} />
              {scanState === 'active' ? 'Apunta al QR de la academia' : scanState === 'busy' ? 'Registrando…' : 'Cámara en pausa'}
            </div>
            {error ? <p className="sa-err">{error}</p> : null}
            <div className="sa-who">
              <img className="sa-ava" src={avatarSrc(student.avatar)} alt="" />
              <div>
                <strong>{student.name}</strong>
                <span className="sa-plan">{student.isPaid ? 'Plan activo' : 'Plan pendiente'}</span>
              </div>
            </div>
            <button type="button" className="sa-ready" onClick={() => checkIn(ACADEMY_QR)} disabled={scanState === 'busy'}>
              <Check size={18} /> Marcar asistencia
            </button>
          </>
        ) : (
          <div className="sa-ok-wrap">
            <div className="sa-ok-icon">
              <Check size={34} />
            </div>
            <h3>Asistencia confirmada</h3>
            <div className="sa-time">{formatCheckTime(record.checkedAt)}</div>
            {slot ? (
              <div className="sa-class">
                <strong>{slot.name}</strong>
                <span>{slot.day} · {slot.startTime}</span>
              </div>
            ) : null}
            <div className={`sa-inwin${record.withinWindow ? '' : ' sa-outwin'}`}>
              <Clock size={16} />
              {record.withinWindow ? 'Dentro del horario' : 'Fuera de horario'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
