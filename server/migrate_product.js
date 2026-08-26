import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const url = process.env.SUPABASE_URL || '';
const password = process.env.SUPABASE_DB_PASSWORD || '';
const projectId = url.replace('https://', '').split('.')[0];

const forbidden = ['qbimxygcjjmosifsqbko', 'xtcxbxvbtxnmuaylrhmr', 'prihphytqvpkrrwptali'];
if (forbidden.includes(projectId)) {
  console.error('Refusing: Ranas, backup o DEMOACADEMIAS viejo.');
  process.exit(1);
}
if (projectId !== 'ydbefwfqkimznydpybss') {
  console.error('Este script solo corre en el proyecto de producto ydbefwfqkimznydpybss.');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
const candidates = [
  `postgresql://postgres.${projectId}:${encoded}@aws-0-us-west-2.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.${projectId}:${encoded}@aws-0-us-west-2.pooler.supabase.com:6543/postgres`,
];

function splitStatements(sql) {
  const stripped = sql
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('--')) return '';
      return line;
    })
    .join('\n');
  const stmts = [];
  let buf = '';
  let inSingle = false;
  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i];
    if (ch === "'" && stripped[i - 1] !== '\\') inSingle = !inSingle;
    if (!inSingle && ch === ';') {
      const s = buf.trim();
      if (s) stmts.push(s);
      buf = '';
      continue;
    }
    buf += ch;
  }
  const tail = buf.trim();
  if (tail) stmts.push(tail);
  return stmts;
}

async function main() {
  let client;
  let lastErr;
  for (const cs of candidates) {
    try {
      client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
      await client.connect();
      console.log('Connected.');
      break;
    } catch (e) {
      lastErr = e;
      console.log('Failed:', e.message);
    }
  }
  if (!client) {
    console.error('Could not connect.', lastErr?.message);
    process.exit(1);
  }
  try {
    const filePath = path.join(__dirname, '../supabase/tenants.sql');
    const stmts = splitStatements(fs.readFileSync(filePath, 'utf8'));
    for (const stmt of stmts) {
      await client.query(stmt);
    }
    console.log('OK tenants.sql', `(${stmts.length} statements)`);
    const academias = await client.query('select count(*)::int as n from public.academias');
    const students = await client.query('select count(*)::int as n from public.students');
    console.log('Academias:', academias.rows[0].n, '| Students:', students.rows[0].n, '(debe ser 0)');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
