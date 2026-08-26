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

const SLUG = 'dpdemo';
const KEEP_ADMINS = new Set(['contacto@dpsistemas.cl', 'cmoranr94@gmail.com', 'rkardo.115@gmail.com']);
const PERMANENT_EMAILS = new Set(['contacto@dpsistemas.cl', 'rkardo.115@gmail.com']);
const KEEP_STUDENT_EMAILS = new Set([
  'contacto@dpsistemas.cl',
  'matias.soto@demo.cl',
  'camila.rojas@demo.cl',
  'diego.pereira@demo.cl',
  'sofia.munoz@demo.cl',
  'cmoranr94@gmail.com',
]);
const GUEST_DELETE = [
  'edfisica.rodriguez@gmail.com',
  'adan.r.soto1@icloud.com',
  'nsolzt@gmail.com',
  'petardosnoporfavor@gmail.com',
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
    } catch {
      /* try next */
    }
  }
  return null;
}

async function nextStudentId(client, academiaId) {
  const { rows } = await client.query('select id from public.students where academia_id = $1', [academiaId]);
  const taken = rows.map((r) => parseInt(String(r.id).split('_').pop(), 10)).filter((n) => !Number.isNaN(n));
  let n = 1;
  while (taken.includes(n)) n += 1;
  return `${academiaId}_${n}`;
}

async function upsertGuest(client, { academiaId, sedeId, email, name, adminPass }) {
  const until = PERMANENT_EMAILS.has(email) ? null : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const { rows: admins } = await client.query(
    'select id from public.admins where academia_id = $1 and lower(email) = $2',
    [academiaId, email],
  );
  if (admins[0]) {
    await client.query(
      `update public.admins set password_hash = $1, role = 'superadmin', sede_id = null, access_until = $2 where id = $3`,
      [adminPass, until, admins[0].id],
    );
  } else {
    await client.query(
      `insert into public.admins (email, password_hash, role, academia_id, access_until)
       values ($1, $2, 'superadmin', $3, $4)`,
      [email, adminPass, academiaId, until],
    );
  }

  const ficha = {
    tutorName: 'Tutor demo',
    tutorPhone: '+56911111111',
    emergencyName: 'Contacto de emergencia',
    emergencyPhone: '+56922222222',
    allergies: 'Ninguna',
    discipline: 'Jiu Jitsu',
  };
  const { rows: st } = await client.query(
    'select id from public.students where academia_id = $1 and lower(email) = $2',
    [academiaId, email],
  );
  const studentRow = {
    name,
    email,
    password: 'alumno26',
    phone: '+56900000000',
    belt: 'WHITE',
    classesattended: 12,
    classestonextbelt: 40,
    ispaid: true,
    plan: '3',
    monthlyfee: 35000,
    avatar: '/mascota-dp.png',
    birthdate: '1990-01-15',
    history: [{ date: '2026-08-05', status: 'Completado', amount: 35000, method: 'Transferencia' }],
    scheduledclasses: [],
    joindate: '2026-03-01',
    sede_id: sedeId,
    terms_accepted: true,
    weight: 78,
    gender: 'MALE',
    ficha,
    access_until: until,
  };
  if (st[0]) {
    await client.query(
      `update public.students set
        name = $1, password = $2, phone = $3, belt = $4, ispaid = $5, plan = $6, monthlyfee = $7,
        birthdate = $8, sede_id = $9, weight = $10, gender = $11, ficha = $12::jsonb, access_until = $13
       where id = $14`,
      [
        studentRow.name, studentRow.password, studentRow.phone, studentRow.belt, studentRow.ispaid,
        studentRow.plan, studentRow.monthlyfee, studentRow.birthdate, studentRow.sede_id,
        studentRow.weight, studentRow.gender, JSON.stringify(studentRow.ficha), until, st[0].id,
      ],
    );
  } else {
    const id = await nextStudentId(client, academiaId);
    await client.query(
      `insert into public.students (
        id, academia_id, name, email, password, phone, belt, classesattended, classestonextbelt,
        ispaid, plan, monthlyfee, avatar, birthdate, history, scheduledclasses, joindate, sede_id,
        terms_accepted, weight, gender, ficha, access_until
      ) values (
        $1, $2, $3, $4, $5, $6, $7, 12, 40, true, $8, $9, $10, $11, $12::jsonb, '[]'::jsonb, $13, $14,
        true, $15, $16, $17::jsonb, $18
      )`,
      [
        id, academiaId, studentRow.name, email, studentRow.password, studentRow.phone, studentRow.belt,
        studentRow.plan, studentRow.monthlyfee, studentRow.avatar, studentRow.birthdate,
        JSON.stringify(studentRow.history), studentRow.joindate, sedeId, studentRow.weight,
        studentRow.gender, JSON.stringify(studentRow.ficha), until,
      ],
    );
  }
  return until ? until.toISOString() : null;
}

async function main() {
  const ricardoEmail = (process.argv[2] || '').trim().toLowerCase();

  const client = await connect();
  if (!client) {
    console.error('No hay conexión a Postgres.');
    process.exit(1);
  }

  try {
    await client.query(`alter table public.admins add column if not exists access_until timestamptz`);
    await client.query(`alter table public.students add column if not exists access_until timestamptz`);

    const academy = (await client.query('select id from public.academias where slug = $1', [SLUG])).rows[0];
    if (!academy) throw new Error('No está la academia dpdemo');
    const academiaId = academy.id;
    const sede = (await client.query(
      'select id from public.sedes where academia_id = $1 order by id asc limit 1',
      [academiaId],
    )).rows[0];
    if (!sede) throw new Error('dpdemo no tiene sede');

    const beforeAdmins = (await client.query(
      'select email, role from public.admins where academia_id = $1 order by email',
      [academiaId],
    )).rows;
    console.log('admins antes', beforeAdmins.map((r) => r.email));

    for (const email of GUEST_DELETE) {
      await client.query('delete from public.admins where academia_id = $1 and lower(email) = $2', [academiaId, email]);
      const st = await client.query(
        'select id from public.students where academia_id = $1 and lower(email) = $2',
        [academiaId, email],
      );
      for (const row of st.rows) {
        await client.query('delete from public.attendance where student_id = $1', [row.id]);
        await client.query('delete from public.material_progress where student_id = $1', [row.id]);
        await client.query('delete from public.event_registrations where student_id = $1', [row.id]);
        await client.query('delete from public.students where id = $1 and academia_id = $2', [row.id, academiaId]);
      }
    }

    const carlosUntil = await upsertGuest(client, {
      academiaId,
      sedeId: sede.id,
      email: 'cmoranr94@gmail.com',
      name: 'Carlos Moran',
      adminPass: 'admin26',
    });
    let ricardoUntil = null;
    if (ricardoEmail && ricardoEmail.includes('@')) {
      ricardoUntil = await upsertGuest(client, {
        academiaId,
        sedeId: sede.id,
        email: ricardoEmail,
        name: 'Ricardo Morales',
        adminPass: 'admin26',
      });
    }

    const afterAdmins = (await client.query(
      'select email, role, access_until from public.admins where academia_id = $1 order by email',
      [academiaId],
    )).rows;
    const afterStudents = (await client.query(
      'select id, name, email, access_until from public.students where academia_id = $1 order by id',
      [academiaId],
    )).rows;
    console.log(JSON.stringify({
      academiaId,
      carlosUntil,
      ricardoUntil,
      ricardoEmail,
      admins: afterAdmins,
      students: afterStudents.map((s) => ({ id: s.id, name: s.name, email: s.email, access_until: s.access_until })),
    }, null, 2));
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
