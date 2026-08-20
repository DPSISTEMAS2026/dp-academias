import { useEffect, useState } from 'react';
import { BRAND } from './brand';

type ClickRow = {
  id: string;
  created_at: string;
  session_id: string;
  path: string;
  module: string;
  role: string;
  email: string;
  label: string;
};

const KEY_STORAGE = 'dp_interno_key';

type Props = { apiUrl: string };

export default function InternalClicks({ apiUrl }: Props) {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '');
  const [draft, setDraft] = useState('');
  const [rows, setRows] = useState<ClickRow[]>([]);
  const [error, setError] = useState('');
  const [unlocked, setUnlocked] = useState(!!sessionStorage.getItem(KEY_STORAGE));

  const load = (secret: string) => {
    const url = `${apiUrl}/api/telemetry?key=${encodeURIComponent(secret)}`;
    fetch(url)
      .then(async (res) => {
        if (res.status === 404) throw new Error('La API de producción aún no actualizó. Espera el deploy de Render y recarga.');
        if (res.status === 401) throw new Error('Clave incorrecta');
        if (!res.ok) throw new Error(`No se pudo leer la actividad (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Respuesta inválida de la API');
        setRows(data);
        setError('');
        setUnlocked(true);
        sessionStorage.setItem(KEY_STORAGE, secret);
      })
      .catch((err) => {
        setUnlocked(false);
        sessionStorage.removeItem(KEY_STORAGE);
        setError(err instanceof Error ? err.message : 'No se pudo entrar.');
      });
  };

  useEffect(() => {
    if (!key) return;
    load(key);
    const t = window.setInterval(() => load(key), 15000);
    return () => window.clearInterval(t);
  }, [key, apiUrl]);

  return (
    <div data-telemetry="off" style={{ minHeight: '100vh', background: '#0f1412', color: '#e7eeec', fontFamily: 'Outfit, system-ui, sans-serif', padding: '2rem 1.2rem 3rem' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7aa3a0' }}>DP Sistemas · interno</p>
        <h1 style={{ margin: '0.35rem 0 0.4rem', fontSize: 28, fontWeight: 700 }}>{BRAND.companyShort} · clics de producción</h1>
        <p style={{ margin: '0 0 1.4rem', color: '#93a4a2', fontSize: 14 }}>No sale en el panel de la academia. Solo esta URL.</p>

        {!unlocked && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setKey(draft.trim());
            }}
            style={{ display: 'flex', gap: 8, marginBottom: 18 }}
          >
            <input
              type="password"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Clave interna"
              style={{ flex: 1, padding: '0.75rem 0.9rem', borderRadius: 10, border: '1px solid #2a3b38', background: '#151c1a', color: '#fff' }}
            />
            <button type="submit" style={{ background: '#006970', color: '#fff', border: 0, borderRadius: 10, padding: '0.75rem 1rem', fontWeight: 700, cursor: 'pointer' }}>
              Ver
            </button>
          </form>
        )}
        {error && <p style={{ color: '#f0a8a8', fontSize: 13 }}>{error}</p>}

        {unlocked && (
          <div>
            <p style={{ fontSize: 13, color: '#7aa3a0' }}>{rows.length} eventos recientes · se actualiza solo</p>
            {rows.length === 0 && <p style={{ color: '#93a4a2' }}>Todavía no hay clics en esta base.</p>}
            {rows.map((row) => (
              <div key={row.id} style={{ padding: '0.85rem 0', borderTop: '1px solid #243330' }}>
                <div style={{ fontWeight: 700 }}>{row.label}</div>
                <div style={{ fontSize: 12, color: '#8aa09d', marginTop: 4 }}>
                  {new Date(row.created_at).toLocaleString('es-CL')}
                  {row.path ? ` · ${row.path}` : ''}
                  {row.module ? ` · ${row.module}` : ''}
                  {row.role ? ` · ${row.role}` : ''}
                  {row.email ? ` · ${row.email}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
