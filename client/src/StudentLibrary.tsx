import { useEffect, useMemo, useState } from 'react';
import type { Student, Video } from './types';
import PanelTabs from './PanelTabs';
import './LibraryPanel.css';
import './panel-shell.css';

type Props = {
  apiUrl: string;
  student: Student;
  videos: Video[];
  onOpen: (video: Video) => void;
};

type Mine = { progress: number; views: number; saved: boolean };

export default function StudentLibrary({ apiUrl, student, videos, onOpen }: Props) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<'all' | 'video' | 'document'>('all');
  const [mine, setMine] = useState<Record<string, Mine>>({});

  const visible = useMemo(() => {
    return videos.filter((v) => {
      const belts = v.belts || [];
      if (belts.length && !belts.includes(student.belt)) return false;
      if (kind !== 'all' && (v.format || 'video') !== kind) return false;
      if (q && !`${v.title} ${v.category} ${v.discipline}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [videos, student.belt, kind, q]);

  useEffect(() => {
    fetch(`${apiUrl}/api/material-progress?studentId=${student.id}`)
      .then((r) => r.json())
      .then((rows) => {
        const map: Record<string, Mine> = {};
        (Array.isArray(rows) ? rows : []).forEach((row: any) => {
          map[row.videoId] = { progress: row.progress || 0, views: row.views || 0, saved: !!row.saved };
        });
        setMine(map);
      })
      .catch(() => {});
  }, [apiUrl, student.id, student.belt, videos]);

  const open = async (video: Video) => {
    const cur = mine[video.id] || { progress: 0, views: 0, saved: false };
    const next = { ...cur, views: cur.views + 1, progress: Math.max(cur.progress, 25) };
    setMine((m) => ({ ...m, [video.id]: next }));
    await fetch(`${apiUrl}/api/material-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: student.id, videoId: video.id, ...next }),
    }).catch(() => {});
    onOpen(video);
  };

  const mark = async (video: Video, progress: number) => {
    const cur = mine[video.id] || { progress: 0, views: 0, saved: false };
    const next = { ...cur, progress };
    setMine((m) => ({ ...m, [video.id]: next }));
    await fetch(`${apiUrl}/api/material-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: student.id, videoId: video.id, ...next }),
    }).catch(() => {});
  };

  return (
    <section className="lb-card" style={{ marginBottom: '6rem' }}>
      <div className="lb-head">
        <div>
          <div className="lb-kicker">Biblioteca</div>
          <h2>Material de apoyo</h2>
        </div>
      </div>
      <PanelTabs
        name="biblioteca-alumno"
        value={kind}
        onChange={(id) => setKind(id as typeof kind)}
        items={[
          { id: 'all', label: 'Todos' },
          { id: 'video', label: 'Videos' },
          { id: 'document', label: 'Documentos' },
        ]}
      />
      <div className="lb-body">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar material" />
      </div>
      {visible.map((v) => {
        const row = mine[v.id];
        const pct = row?.progress || 0;
        return (
          <div key={v.id} className="lb-item" style={{ display: 'block' }}>
            <button type="button" onClick={() => open(v)} style={{ display: 'flex', gap: 12, width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0, color: 'inherit' }}>
              {v.thumbnail ? <img src={v.thumbnail} alt="" /> : <div className="lb-thumb" />}
              <div style={{ flex: 1 }}>
                <strong>{v.title}</strong>
                <span>{v.format === 'document' ? 'Documento' : 'Video'}{v.duration ? ` · ${v.duration}` : ''} · {v.discipline || 'Jiu Jitsu'}</span>
                <div className="lb-bar" style={{ marginTop: 8, width: '100%' }}><i style={{ width: `${pct}%` }} /></div>
                <span>{pct ? `${pct}% completado` : 'Sin comenzar'}</span>
              </div>
            </button>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="button" className="lb-btn" onClick={() => { mark(v, Math.max(pct, 75)); open(v); }}>Continuar viendo</button>
              <button type="button" className="lb-btn ghost" onClick={() => mark(v, 100)}>Completar</button>
            </div>
          </div>
        );
      })}
      {visible.length === 0 && <div className="lb-body">No hay material para tu grado todavía.</div>}
    </section>
  );
}
