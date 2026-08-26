const PREFIX = 'dp_pub_';
const TTL_MS = 10 * 60 * 1000;

function cacheKey(name: string) {
  const host = typeof window !== 'undefined' ? window.location.host : '';
  return `${PREFIX}${host}:${name}`;
}

export function readPublicCache<T>(name: string): T | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(name));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || Date.now() - Number(parsed.t) > TTL_MS) return null;
    return parsed.v as T;
  } catch {
    return null;
  }
}

export function writePublicCache(name: string, value: unknown) {
  try {
    sessionStorage.setItem(cacheKey(name), JSON.stringify({ t: Date.now(), v: value }));
  } catch {
    /* quota */
  }
}

export function clearPublicCache() {
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

export async function fetchPublicJson<T>(url: string, name: string): Promise<T> {
  const hit = readPublicCache<T>(name);
  if (hit != null) return hit;
  const res = await fetch(url);
  const data = await res.json();
  writePublicCache(name, data);
  return data as T;
}
