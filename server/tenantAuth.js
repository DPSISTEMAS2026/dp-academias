import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

function jwtSecret() {
  return process.env.JWT_SECRET || '';
}
const DP_HOSTS = new Set(
  (process.env.DP_HOSTS || 'academias.dpsistemas.cl,localhost,127.0.0.1')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean)
);

export function requestHost(req) {
  const academyHost = (req.get('x-academy-host') || '').split(',')[0].trim().toLowerCase();
  const raw = (academyHost || req.get('x-forwarded-host') || req.get('host') || '').split(',')[0].trim().toLowerCase();
  return raw.split(':')[0].replace(/^www\./, '');
}

/** dpdemo.localhost → dpdemo (pruebas locales con dos hosts). */
export function slugFromLocalHost(host) {
  if (!host || !host.endsWith('.localhost')) return null;
  const label = host.slice(0, -'.localhost'.length).split('.').pop();
  return label && label !== 'localhost' ? label : null;
}

export function isDpMarketingHost(host) {
  return DP_HOSTS.has(host);
}

function b64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

export function signToken(payload, hours = 12) {
  const secret = jwtSecret();
  if (!secret) throw new Error('Falta JWT_SECRET');
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const body = b64url({
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + hours * 3600,
  });
  const sig = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token) {
  const secret = jwtSecret();
  if (!secret || !token) return null;
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function attachAuth(req, _res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  req.auth = verifyToken(token);
  next();
}

export function requireAuth(req, res, next) {
  if (!req.auth) {
    return res.status(401).json({ error: 'Sesión requerida.' });
  }
  if (req.auth.role !== 'dp_staff' && !req.auth.academia_id) {
    return res.status(401).json({ error: 'Token sin academia.' });
  }
  next();
}

export function requireAcademyAuth(req, res, next) {
  if (!req.auth?.academia_id) {
    return res.status(401).json({ error: 'Entrá con el usuario de tu academia.' });
  }
  next();
}

export function internalKeyOk(req) {
  const expected = process.env.INTERNAL_KEY || process.env.TELEMETRY_KEY || '';
  if (!expected) return false;
  const got = req.get('x-internal-key') || req.get('x-telemetry-key') || '';
  return got === expected;
}

const ACADEMY_COLS = 'id, slug, name, logo_url, color, custom_domain, status';

export function demoAcademySlug() {
  return String(process.env.DEMO_ACADEMY_SLUG || 'dpdemo').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'dpdemo';
}

async function fetchAcademyBySlug(supabase, slug) {
  if (!slug) return { data: null, error: null };
  const { data, error } = await supabase
    .from('academias')
    .select(ACADEMY_COLS)
    .eq('slug', String(slug).toLowerCase())
    .maybeSingle();
  if (error) console.error('[ACADEMY] slug', slug, error.message);
  return { data: data || null, error };
}

export async function academyByHostOrSlug(supabase, req, slugFromBody) {
  const host = requestHost(req);
  const slug = slugFromBody || slugFromLocalHost(host);
  if (slug) {
    const { data } = await fetchAcademyBySlug(supabase, slug);
    if (data) return data;
  }
  if (!host || isDpMarketingHost(host)) return null;
  const { data, error } = await supabase
    .from('academias')
    .select(ACADEMY_COLS)
    .or(`custom_domain.eq.${host},slug.eq.${host}`)
    .maybeSingle();
  if (error) console.error('[ACADEMY] host', host, error.message);
  return data || null;
}

/**
 * Login:
 * - tuacademia.cl → esa academia (custom_domain)
 * - academias.dpsistemas.cl / localhost → academia demo (slug dpdemo, o la primera si falta el slug)
 */
export async function academyForLogin(supabase, req, { slug } = {}) {
  const host = requestHost(req);
  const direct = await academyByHostOrSlug(supabase, req, slug);
  if (direct) return { academy: direct, via: slug ? 'slug' : 'host', ids: [Number(direct.id)] };

  if (!isDpMarketingHost(host)) return { academy: null, via: 'none', ids: [] };

  const demo = await fetchAcademyBySlug(supabase, demoAcademySlug());
  if (demo.data) return { academy: demo.data, via: 'demo', ids: [Number(demo.data.id)] };

  const { data: rows, error } = await supabase
    .from('academias')
    .select(ACADEMY_COLS)
    .order('id', { ascending: true })
    .limit(1);
  if (error) console.error('[ACADEMY] first', error.message);
  const first = rows && rows[0] ? rows[0] : null;
  return { academy: first, via: first ? 'first' : 'none', ids: first ? [Number(first.id)] : [] };
}

export function tenantId(req) {
  return req.auth?.academia_id ? Number(req.auth.academia_id) : null;
}

export function sedeQueryAllowed(req, requestedSedeId) {
  if (req.auth?.role === 'dp_staff') return requestedSedeId || null;
  if (req.auth?.role === 'admin_sede' && req.auth.sede_id) {
    return Number(req.auth.sede_id);
  }
  if (requestedSedeId && req.auth?.role === 'superadmin') return Number(requestedSedeId);
  return requestedSedeId ? Number(requestedSedeId) : null;
}
