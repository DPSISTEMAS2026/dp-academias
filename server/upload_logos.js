import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import { putAcademyFile } from './r2.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const root = path.join(__dirname, '..');
const escorial = path.join(root, 'Diseño sin título (4).png');
const lomas = path.join(root, 'logo-lomasrico.png');

const url = process.env.SUPABASE_URL || '';
const password = process.env.SUPABASE_DB_PASSWORD || '';
const projectId = url.replace('https://', '').split('.')[0];
if (projectId !== 'ydbefwfqkimznydpybss') {
  console.error('Solo producto.');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
const cs = `postgresql://postgres.${projectId}:${encoded}@aws-0-us-west-2.pooler.supabase.com:5432/postgres`;

async function main() {
  if (!fs.existsSync(escorial) || !fs.existsSync(lomas)) {
    console.error('Faltan los PNG en la raíz del repo.');
    process.exit(1);
  }
  const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
  await client.connect();
  try {
    const jobs = [
      { slug: 'dpdemo', file: escorial, filename: 'logo-escorial.png', type: 'image/png' },
      { slug: 'diego', file: lomas, filename: 'logo-lomasrico.png', type: 'image/png' },
    ];
    for (const job of jobs) {
      const { rows } = await client.query('select id from public.academias where slug = $1', [job.slug]);
      const academiaId = rows[0]?.id;
      if (!academiaId) {
        console.error('No existe', job.slug);
        continue;
      }
      const body = fs.readFileSync(job.file);
      const put = await putAcademyFile({ academiaId, filename: job.filename, body, contentType: job.type });
      await client.query('update public.academias set logo_url = $1 where id = $2', [put.url, academiaId]);
      await client.query(
        `insert into public.academy_media (id, academia_id, cf_id, url, kind, bytes)
         values ($1, $2, $3, $4, 'logo', $5)
         on conflict (id) do update set url = excluded.url, bytes = excluded.bytes`,
        [`logo-${academiaId}`, academiaId, put.key, put.url, put.bytes],
      );
      console.log('OK', job.slug, put.bytes, 'B', put.url);
    }
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
