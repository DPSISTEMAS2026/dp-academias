const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const SESSION_KEY = 'dp_click_session';

type ClickPayload = {
  sessionId: string;
  path: string;
  module: string;
  role: string;
  email: string;
  label: string;
  tag: string;
};

function sessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function context() {
  let email = '';
  let role = localStorage.getItem('role') || 'publico';
  try {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      const user = JSON.parse(raw);
      email = String(user?.email || '');
    }
  } catch {
    /* ignore */
  }
  const view = localStorage.getItem('viewMode') || '';
  if (view === 'landing') role = 'landing';
  if (window.location.pathname.startsWith('/acceso')) role = role === 'publico' ? 'login' : role;
  if (window.location.pathname.startsWith('/evento')) role = 'evento';
  return {
    sessionId: sessionId(),
    path: `${window.location.pathname}${window.location.search}`.slice(0, 180),
    module: localStorage.getItem('activeTab') || '',
    role: String(role).slice(0, 40),
    email: email.slice(0, 120),
  };
}

function labelFrom(el: EventTarget | null) {
  if (!(el instanceof Element)) return { label: '', tag: '' };
  if (el.closest('input, textarea, [data-telemetry="off"]')) {
    return { label: '', tag: '' };
  }
  const hit = el.closest('button, a, select, [role="button"], [role="tab"], summary') as HTMLElement | null;
  if (!hit || hit.closest('[data-telemetry="off"]')) return { label: '', tag: '' };

  const named = (hit.getAttribute('aria-label') || hit.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
  const visible = (hit.innerText || '').replace(/\s+/g, ' ').trim();
  let text = named || visible;
  if (text.length > 48) return { label: '', tag: '' };
  if (!text || /^button$/i.test(text)) return { label: '', tag: '' };

  return { label: text.slice(0, 60), tag: hit.tagName.toLowerCase() };
}

const queue: ClickPayload[] = [];
let flushTimer: number | null = null;

function flush() {
  if (!queue.length) return;
  const batch = queue.splice(0, 20);
  fetch(`${API_URL}/api/telemetry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: batch }),
    keepalive: true,
  }).catch(() => {});
}

function enqueue(row: ClickPayload) {
  queue.push(row);
  if (queue.length >= 8) {
    flush();
    return;
  }
  if (flushTimer) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    flush();
  }, 1200);
}

export function startTelemetry() {
  if (typeof window === 'undefined') return;
  if ((window as any).__dpTelemetry) return;
  (window as any).__dpTelemetry = true;

  document.addEventListener(
    'click',
    (e) => {
      if (window.location.pathname.replace(/\/+$/, '').endsWith('/interno')) return;
      const { label, tag } = labelFrom(e.target);
      if (!label) return;
      const extra = { ...context(), label, tag };
      if (/iniciar sesi[oó]n/i.test(label)) {
        const emailInput = document.querySelector<HTMLInputElement>('input[type="email"], input[name="email"]');
        if (emailInput?.value) extra.email = emailInput.value.trim().slice(0, 120);
      }
      enqueue(extra);
    },
    true
  );

  window.addEventListener('pagehide', flush);
}
