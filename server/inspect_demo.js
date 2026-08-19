import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const url = process.env.SUPABASE_URL || '';
const projectId = url.replace('https://', '').split('.')[0];
const encoded = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD || '');
const cs = `postgresql://postgres.${projectId}:${encoded}@aws-0-us-east-2.pooler.supabase.com:6543/postgres`;

const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
await client.connect();
console.log('PROJECT', projectId);
const students = await client.query('select id, name, email, left(coalesce(avatar,\'\'), 80) as avatar_head from public.students order by id');
console.log('STUDENTS', students.rowCount);
for (const r of students.rows) console.log(r.id, r.name, r.email, r.avatar_head);
const gal = await client.query('select id, left(img, 90) as img from public.gallery');
console.log('GALLERY', gal.rowCount);
for (const r of gal.rows) console.log(r.id, r.img);
await client.end();
