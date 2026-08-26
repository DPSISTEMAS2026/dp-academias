import { useEffect, useState } from 'react';
import { fetchPublicJson } from './publicCache';

type NewsItem = {
  id?: number;
  title?: string;
  body?: string;
  img?: string;
  date?: string;
  label?: string;
};

type GalleryItem = { img?: string; size?: string };
type Slot = { id: string; name: string; day: string; startTime: string; endTime: string };

export function NewsWidget({ apiUrl }: { apiUrl: string }) {
  const [items, setItems] = useState<NewsItem[] | null>(null);
  useEffect(() => {
    fetchPublicJson<NewsItem[]>(`${apiUrl}/api/news`, 'news')
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]));
  }, [apiUrl]);
  if (!items) return <p className="dpw-muted">Cargando noticias…</p>;
  if (!items.length) return <p className="dpw-muted">Aún no hay noticias. Publícalas en Sitio web → Noticias.</p>;
  return (
    <div className="dpw-news">
      {items.map((n) => (
        <article key={n.id || n.title} className="dpw-news-card">
          {n.img ? <img src={n.img} alt="" /> : null}
          <div>
            <span>{n.label} · {n.date}</span>
            <h3>{n.title}</h3>
            <p>{n.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function GalleryWidget({ apiUrl }: { apiUrl: string }) {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  useEffect(() => {
    fetchPublicJson<GalleryItem[]>(`${apiUrl}/api/gallery`, 'gallery')
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]));
  }, [apiUrl]);
  if (!items) return <p className="dpw-muted">Cargando galería…</p>;
  if (!items.length) return <p className="dpw-muted">Aún no hay fotos en la galería.</p>;
  return (
    <div className="dpw-gallery">
      {items.map((g, i) => (
        <img key={g.img || i} src={g.img} alt="" className={g.size || 'small'} />
      ))}
    </div>
  );
}

export function ScheduleWidget({ apiUrl }: { apiUrl: string }) {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  useEffect(() => {
    fetchPublicJson<Slot[]>(`${apiUrl}/api/schedule`, 'schedule')
      .then((d) => setSlots(Array.isArray(d) ? d : []))
      .catch(() => setSlots([]));
  }, [apiUrl]);
  if (!slots) return <p className="dpw-muted">Cargando horario…</p>;
  if (!slots.length) return <p className="dpw-muted">Aún no hay clases en el horario.</p>;
  return (
    <ul className="dpw-schedule">
      {slots.map((s) => (
        <li key={s.id}>
          <strong>{s.day}</strong>
          <span>{s.startTime}–{s.endTime}</span>
          <em>{s.name}</em>
        </li>
      ))}
    </ul>
  );
}
