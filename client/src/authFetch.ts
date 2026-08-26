const TOKEN_KEY = 'authToken';

const origFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url);
  const headers = new Headers(init?.headers || (typeof input !== 'string' && !(input instanceof URL) ? input.headers : undefined));
  const skipAuth = /\/api\/auth\/login|\/api\/webhooks|\/health|r2\.cloudflarestorage\.com|\.r2\.dev/.test(url);
  const isApi = url.includes('/api/');
  if (isApi && typeof window !== 'undefined' && !headers.has('X-Academy-Host')) {
    headers.set('X-Academy-Host', window.location.hostname);
  }
  if (!skipAuth && isApi) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
  }
  return origFetch(input, { ...init, headers });
};

export function saveAuthToken(token?: string) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
