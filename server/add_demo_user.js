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

async function connect() {
  for (const cs of candidates) {
    try {
      const client = new pg.Client({
        connectionString: cs,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 8000,
      });
      await client.connect();
      return client;
    } catch { /* next */ }
  }
  return null;
}

async function run() {
  const email = (process.argv[2] || '').trim().toLowerCase();
  const name = (process.argv.slice(3).join(' ') || email.split('@')[0].replace(/[._-]+/g, ' ')).replace(/\b\w/g, (c) => c.toUpperCase());
  if (!email || !email.includes('@')) {
    console.error('Uso: node add_demo_user.js correo@dominio.cl "Nombre Apellido"');
    process.exit(1);
  }

  const client = await connect();
  if (!client) process.exit(1);
  try {
    await client.query(`alter table public.admins add column if not exists access_until timestamptz`);
    await client.query(`alter table public.students add column if not exists access_until timestamptz`);
    const academy = (await client.query(`select id from public.academias where slug = 'dpdemo'`)).rows[0];
    const sede = (await client.query(`select id from public.sedes where academia_id = $1 order by id asc limit 1`, [academy.id])).rows[0];
    const until = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const { rows: admins } = await client.query(
      `select id from public.admins where academia_id = $1 and lower(email) = $2`,
      [academy.id, email],
    );
    if (admins[0]) {
      await client.query(
        `update public.admins set password_hash = 'admin26', role = 'superadmin', access_until = $1 where id = $2`,
        [until, admins[0].id],
      );
    } else {
      await client.query(
        `insert into public.admins (email, password_hash, role, academia_id, access_until) values ($1, 'admin26', 'superadmin', $2, $3)`,
        [email, academy.id, until],
      );
    }
    const { rows: st } = await client.query(
      `select id from public.students where academia_id = $1 and lower(email) = $2`,
      [academy.id, email],
    );
    const ficha = JSON.stringify({
      tutorName: 'Tutor demo',
      tutorPhone: '+56911111111',
      emergencyName: 'Contacto de emergencia',
      emergencyPhone: '+56922222222',
      allergies: 'Ninguna',
      discipline: 'Jiu Jitsu',
    });
    if (st[0]) {
      await client.query(
        `update public.students set name = $1, password = 'alumno26', access_until = $2, ficha = $3::jsonb where id = $4`,
        [name, until, ficha, st[0].id],
      );
    } else {
      const ids = (await client.query(`select id from public.students where academia_id = $1`, [academy.id])).rows;
      const taken = ids.map((r) => parseInt(String(r.id).split('_').pop(), 10)).filter((n) => !Number.isNaN(n));
      let n = 1;
      while (taken.includes(n)) n += 1;
      await client.query(
        `insert into public.students (
          id, academia_id, name, email, password, phone, belt, classesattended, classestonextbelt,
          ispaid, plan, monthlyfee, avatar, birthdate, history, scheduledclasses, joindate, sede_id,
          terms_accepted, weight, gender, ficha, access_until
        ) values (
          $1, $2, $3, $4, 'alumno26', '+56900000000', 'WHITE', 12, 40, true, '3', 35000, '/mascota-dp.png',
          '1990-01-15', '[]'::jsonb, '[]'::jsonb, $5, $6, true, 78, 'MALE', $7::jsonb, $8
        )`,
        [`${academy.id}_${n}`, academy.id, name, email, new Date().toISOString().slice(0, 10), sede.id, ficha, until],
      );
    }
    console.log(JSON.stringify({ email, name, until: until.toISOString(), admin: 'admin26', alumno: 'alumno26' }));
  } finally {
    await client.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
