import { useEffect, useMemo, useState } from 'react';
import type { Belt, Student, Video } from './types';
import PanelTabs from './PanelTabs';
import './LibraryPanel.css';
import './panel-shell.css';

type ProgressRow = {
  studentId: string;
  progress: number;
  views: number;
  saved: boolean;
};

type Props = {
  apiUrl: string;
  videos: Video[];
  students: Student[];
  onVideosChange: (next: Video[]) => void;
};

const BELTS: { id: Belt; label: string }[] = [
  { id: 'GRAY', label: 'Gris' },
  { id: 'WHITE', label: 'Blanco' },
  { id: 'BLUE', label: 'Azul' },
  { id: 'PURPLE', label: 'Morado' },
  { id: 'BROWN', label: 'Marrón' },
  { id: 'BLACK', label: 'Negro' },
];

const emptyForm = (): Omit<Video, 'id'> => ({
  title: '',
  description: '',
  url: '',
  thumbnail: '',
  targetAudience: 'BOTH',
  category: 'Técnicas',
  format: 'video',
  discipline: 'Jiu Jitsu',
  belts: ['WHITE', 'BLUE'],
  authorizedOnly: true,
  duration: '06:24',
});

function youtubeId(url: string) {
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return m ? m[1] : '';
}

export default function LibraryPanel({ apiUrl, videos, students, onVideosChange }: Props) {
  const [form, setForm] = useState(emptyForm());
  const [selectedId, setSelectedId] = useState(videos[0]?.id || '');
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [hint, setHint] = useState('');
  const [tab, setTab] = useState<'publicar' | 'seguimiento'>('seguimiento');

  const selected = videos.find((v) => v.id === selectedId) || videos[0];

  useEffect(() => {
    if (!selected?.id) return;
    fetch(`${apiUrl}/api/material-progress?videoId=${selected.id}`)
      .then((r) => r.json())
      .then((d) => setProgress(Array.isArray(d) ? d : []))
      .catch(() => setProgress([]));
  }, [apiUrl, selected?.id]);

  const tracking = useMemo(() => {
    return students.map((s) => {
      const row = progress.find((p) => String(p.studentId) === String(s.id));
      const pct = row?.progress || 0;
      return {
        student: s,
        progress: pct,
        views: row?.views || 0,
        status: pct >= 100 ? 'Completado' : pct > 0 ? 'En progreso' : 'Sin ver',
      };
    }).filter((r) => {
      const belts = selected?.belts || [];
      if (!belts.length) return true;
      return belts.includes(r.student.belt);
    });
  }, [students, progress, selected]);

  const views = tracking.reduce((a, r) => a + r.views, 0);

  const toggleBelt = (belt: Belt) => {
    const cur = form.belts || [];
    setForm({ ...form, belts: cur.includes(belt) ? cur.filter((b) => b !== belt) : [...cur, belt] });
  };

  const publish = async () => {
    if (!form.title || !form.url) {
      setHint('Faltan título y enlace o archivo.');
      return;
    }
    const id = youtubeId(form.url);
    const payload = {
      ...form,
      thumbnail: form.thumbnail || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''),
    };
    const res = await fetch(`${apiUrl}/api/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setHint(data.error || 'No se pudo publicar.');
      return;
    }
    onVideosChange([...videos, data]);
    setSelectedId(data.id);
    setForm(emptyForm());
    setHint('Material publicado.');
  };

  const yt = youtubeId(form.url);

  return (
    <div className="lb-wrap">
      <div className="dp-picker">
        {videos.map((v) => (
          <button key={v.id} type="button" className={`dp-chip${selected?.id === v.id ? ' is-on' : ''}`} onClick={() => { setSelectedId(v.id); setTab('seguimiento'); }}>
            <strong>{v.title}</strong>
            <span>{v.format === 'document' ? 'Documento' : 'Video'} · {v.duration || v.category}</span>
          </button>
        ))}
      </div>
      <section className="lb-card">
        <div className="lb-head">
          <div>
            <div className="lb-kicker">Biblioteca</div>
            <h2>{tab === 'publicar' ? 'Publicar material' : (selected?.title || 'Seguimiento')}</h2>
          </div>
        </div>
        <PanelTabs
          name="biblioteca"
          value={tab}
          onChange={(id) => setTab(id as typeof tab)}
          items={[{ id: 'seguimiento', label: 'Seguimiento' }, { id: 'publicar', label: 'Publicar' }]}
        />
        {tab === 'publicar' && (
          <div className="lb-body">
            <div className="lb-fields">
              <label>Título
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Armbar desde guardia" />
              </label>
              <label>Formato
                <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value as Video['format'] })}>
                  <option value="video">Video</option>
                  <option value="document">Documento</option>
                </select>
              </label>
              <label>Disciplina
                <select value={form.discipline} onChange={(e) => setForm({ ...form, discipline: e.target.value })}>
                  <option>Jiu Jitsu</option>
                  <option>Kickboxing</option>
                  <option>MMA</option>
                </select>
              </label>
              <label>Categoría
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option>Técnicas</option>
                  <option>Reglamento</option>
                  <option>Preparación</option>
                </select>
              </label>
              <label className="span2" style={{ gridColumn: '1 / -1' }}>Enlace o archivo
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value, duration: form.duration || (form.format === 'video' ? '06:24' : 'PDF') })} placeholder="https://youtube.com/..." />
              </label>
              <label>Duración
                <input value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="06:24" />
              </label>
              <label>
                Subir archivo
                <input type="file" accept={form.format === 'document' ? '.pdf,image/*' : 'video/*,image/*'} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const res = await fetch(`${apiUrl}/api/upload`, { method: 'POST', headers: { 'X-Filename': file.name }, body: file });
                  const data = await res.json();
                  if (res.ok) setForm((f) => ({ ...f, url: data.url, duration: f.format === 'document' ? 'PDF' : f.duration }));
                }} />
              </label>
            </div>
            <div>
              <div className="lb-kicker" style={{ marginBottom: 8 }}>Disponible para</div>
              <div className="lb-belts">
                {BELTS.map((b) => (
                  <button type="button" key={b.id} className={(form.belts || []).includes(b.id) ? 'on' : ''} onClick={() => toggleBelt(b.id)}>{b.label}</button>
                ))}
              </div>
            </div>
            <div className="lb-preview">
              {yt ? <img src={`https://img.youtube.com/vi/${yt}/hqdefault.jpg`} alt="" /> : <span>{form.format === 'document' ? 'Documento' : 'Vista previa'}</span>}
              {form.duration && <span>{form.duration}</span>}
            </div>
            <label className="lb-toggle">
              Solo alumnos autorizados
              <input type="checkbox" checked={form.authorizedOnly !== false} onChange={(e) => setForm({ ...form, authorizedOnly: e.target.checked })} />
            </label>
            <button type="button" className="lb-btn" onClick={publish}>Publicar material</button>
            {hint && <p style={{ margin: 0, fontWeight: 700, color: '#006970', fontSize: 13 }}>{hint}</p>}
          </div>
        )}

        {tab === 'seguimiento' && selected && (
          <>
          <div className="lb-stats">
            <div className="lb-stat"><b>{tracking.length}</b><span>Alumnos con acceso</span></div>
            <div className="lb-stat"><b>{views}</b><span>Visualizaciones</span></div>
          </div>
          <table className="lb-table">
            <thead>
              <tr><th>Alumno</th><th>Estado</th><th>Progreso</th><th>Vistas</th></tr>
            </thead>
            <tbody>
              {tracking.map((row) => (
                <tr key={row.student.id}>
                  <td><strong>{row.student.name}</strong></td>
                  <td><span className={`lb-pill${row.status === 'Completado' ? '' : ' warn'}`}>{row.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="lb-bar"><i style={{ width: `${row.progress}%` }} /></div>
                      {row.progress}%
                    </div>
                  </td>
                  <td>{row.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}
      </section>
    </div>
  );
}
