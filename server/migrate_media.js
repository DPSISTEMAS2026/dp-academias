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
if (projectId !== 'ydbefwfqkimznydpybss') {
  console.error('Solo el proyecto de producto.');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
const candidates = [
  `postgresql://postgres.${projectId}:${encoded}@aws-0-us-west-2.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.${projectId}:${encoded}@aws-0-us-west-2.pooler.supabase.com:6543/postgres`,
];

const sql = fs.readFileSync(path.join(__dirname, '../supabase/academy_media.sql'), 'utf8')
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n');
const stmts = sql.split(';').map((s) => s.trim()).filter(Boolean);

let client;
for (const cs of candidates) {
  try {
    client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
    await client.connect();
    break;
  } catch (e) {
    client = null;
  }
}
if (!client) {
  console.error('No se pudo conectar.');
  process.exit(1);
}
try {
  for (const stmt of stmts) await client.query(stmt);
  console.log('OK academy_media.sql');
} finally {
  await client.end();
}
