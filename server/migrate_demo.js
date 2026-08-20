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

const forbidden = ['qbimxygcjjmosifsqbko', 'xtcxbxvbtxnmuaylrhmr'];
if (forbidden.includes(projectId)) {
  console.error('Refusing to migrate: this project ID is Ranas production or backup.');
  process.exit(1);
}

const encoded = encodeURIComponent(password);
const candidates = [
  `postgresql://postgres:${encoded}@db.${projectId}.supabase.co:5432/postgres`,
  `postgresql://postgres.${projectId}:${encoded}@aws-0-us-east-2.pooler.supabase.com:6543/postgres`,
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

async function tryConnect(connectionString) {
  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 6000,
  });
  await client.connect();
  return client;
}

async function runFile(client, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const stmts = splitStatements(sql);
  for (const stmt of stmts) {
    await client.query(stmt);
  }
  console.log('OK', path.basename(filePath), `(${stmts.length} statements)`);
}

async function seed(client) {
  await client.query(`
    insert into public.sedes (id, name, address, status) values
      (1, 'Sede Centro', 'Sede de ejemplo', 'Activa'),
      (2, 'Sede Norte', 'Sede de ejemplo', 'Activa'),
      (3, 'Sede Sur', 'Sede de ejemplo', 'Activa')
    on conflict (id) do update set
      name = excluded.name,
      address = excluded.address,
      status = excluded.status
  `);
  await client.query(`select setval(pg_get_serial_sequence('public.sedes', 'id'), 3, true)`);

  await client.query(`
    insert into public.admins (email, password_hash, role, sede_id) values
      ('contacto@dpsistemas.cl', 'admin123', 'superadmin', null)
    on conflict (email) do update set
      password_hash = excluded.password_hash,
      role = excluded.role,
      sede_id = excluded.sede_id
  `);

  const students = [
    ['1', 'Matías Soto', 'matias.soto@demo.cl', 'demo123', '+56911111111', 'WHITE', 34, 40, '2026-08', '2026-08-05', true, '3', 35000, '2008-03-12',
      [{ date: '2026-08-05', status: 'Completado', amount: 35000, method: 'Transferencia', transaction_id: '1842' }],
      [], '2025-01-10', '3 grados', '2025-01-10', 1, true, 68, 'MALE'],
    ['2', 'Camila Rojas', 'camila.rojas@demo.cl', 'demo123', '+56922222222', 'BLUE', 22, 40, null, null, false, '2', 25000, '1999-11-04',
      [], [], '2024-06-01', '0 grados', '2025-06-20', 1, true, 62, 'FEMALE'],
    ['3', 'Diego Pereira', 'diego.pereira@demo.cl', 'demo123', '+56933333333', 'WHITE', 18, 40, '2026-08', '2026-08-03', true, 'Ilimitado', 45000, '1995-07-22',
      [{ date: '2026-08-03', status: 'Completado', amount: 45000, method: 'Mercado Pago', transaction_id: '1840' }],
      [], '2025-03-01', '1er grado', '2025-03-01', 2, true, 80, 'MALE'],
    ['4', 'Sofía Muñoz', 'sofia.munoz@demo.cl', 'demo123', '+56987654321', 'GRAY', 12, 30, '2026-08', '2026-08-01', true, '2', 25000, '2014-05-12',
      [{ date: '2026-08-01', status: 'Completado', amount: 25000, method: 'Transferencia', transaction_id: '1833' }],
      [], '2025-03-15', 'Blanco', '2025-03-15', 1, true, 42, 'FEMALE'],
  ];

  for (const s of students) {
    await client.query(
      `insert into public.students (
        id, name, email, password, phone, belt, classesattended, classestonextbelt,
        lastpaymentmonth, lastpaymentdate, ispaid, plan, monthlyfee, birthdate,
        history, scheduledclasses, joindate, lastgrade, graduationdate, sede_id,
        terms_accepted, weight, gender
      ) values (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb,$17,$18,$19,$20,$21,$22,$23
      )
      on conflict (id) do update set
        name = excluded.name, email = excluded.email, password = excluded.password,
        ispaid = excluded.ispaid, plan = excluded.plan, monthlyfee = excluded.monthlyfee, sede_id = excluded.sede_id`,
      [...s.slice(0, 14), JSON.stringify(s[14]), JSON.stringify(s[15]), ...s.slice(16)]
    );
  }

  const weekStart = (() => {
    const d = new Date();
    const day = d.getDay() || 7;
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day + 1);
    return d.getTime();
  })();
  const adultWeek = [
    { day: 'Lunes', time: '19:30', name: 'Jiu Jitsu Adultos', timestamp: weekStart },
    { day: 'Martes', time: '19:00', name: 'Boxeo Kickboxing MMA', timestamp: weekStart },
    { day: 'Miércoles', time: '19:30', name: 'MMA', timestamp: weekStart },
    { day: 'Jueves', time: '19:00', name: 'Jiu Jitsu Adultos', timestamp: weekStart },
    { day: 'Viernes', time: '19:30', name: 'MMA · Boxeo · Jiu Jitsu', timestamp: weekStart },
  ];
  const kidsWeek = [
    { day: 'Martes', time: '18:00', name: 'Jiu Jitsu Kids', timestamp: weekStart },
    { day: 'Jueves', time: '18:00', name: 'Jiu Jitsu Kids', timestamp: weekStart },
    { day: 'Sábado', time: '11:00', name: 'Jiu Jitsu Kids', timestamp: weekStart },
  ];
  await client.query(`update public.students set scheduledclasses = $1::jsonb where id in ('1','2')`, [JSON.stringify(adultWeek)]);
  await client.query(`update public.students set scheduledclasses = $1::jsonb where id = '4'`, [JSON.stringify(kidsWeek)]);

  await client.query(`
    insert into public.news (id, title, body, img, link, label, date, stats, sede_id) values
      (1, 'Torneo Interacademias: 120 cupos abiertos',
       'Inscribe alumnos o invita a otras academias. Categorías por edad, peso y grado.',
       'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200', null, 'Eventos', '24 Oct, 2026',
       '[{"label":"Cupos","text":"120"},{"label":"Inscripción","text":"$15.000"}]'::jsonb, 1),
      (2, 'Nuevo horario de Jiu Jitsu y Kickboxing',
       'Configura una vez en el panel y se actualiza en la app del alumno.',
       'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200', null, 'Horarios', '18 Ago, 2026',
       '[{"label":"Sedes","text":"3"},{"label":"Disciplinas","text":"BJJ · KB · MMA"}]'::jsonb, 1),
      (3, 'Biblioteca técnica: Armbar desde guardia',
       'Publica videos y PDFs por cinturón, con seguimiento de progreso.',
       'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200', null, 'Material', '12 Ago, 2026',
       '[{"label":"Formato","text":"Video"},{"label":"Grados","text":"Blanco y Azul"}]'::jsonb, 1)
    on conflict (id) do update set title = excluded.title, body = excluded.body
  `);
  await client.query(`select setval('news_id_seq', (select coalesce(max(id), 1) from public.news))`);

  await client.query('delete from public.gallery');
  await client.query(`
    insert into public.gallery (img, size, sede_id) values
      ('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200', 'large', 1),
      ('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'small', 1),
      ('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', 'small', 1),
      ('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 'tall', 1),
      ('https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'wide', 1)
  `);

  await client.query(`alter table public.videos add column if not exists format text default 'video'`);
  await client.query(`alter table public.videos add column if not exists discipline text default 'Jiu Jitsu'`);
  await client.query(`alter table public.videos add column if not exists belts jsonb default '[]'::jsonb`);
  await client.query(`alter table public.videos add column if not exists authorized_only boolean default true`);
  await client.query(`alter table public.videos add column if not exists duration text default ''`);
  await client.query(`
    insert into public.videos (id, title, description, url, thumbnail, beltlevel, category, sede_id, format, discipline, belts, authorized_only, duration) values
      ('v1', 'Armbar desde guardia', 'Técnica base de Jiu Jitsu para cinturón blanco y azul.',
       '',
       'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
       'WHITE', 'Técnicas', 1, 'video', 'Jiu Jitsu', '["WHITE","BLUE"]'::jsonb, true, '06:24'),
      ('v2', 'Reglamento de competencia', 'Bases y puntaje para alumnos que van a torneo. Documento PDF.',
       'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
       'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
       'WHITE', 'Reglamento', 1, 'document', 'Jiu Jitsu', '["WHITE","BLUE","PURPLE"]'::jsonb, true, 'PDF'),
      ('v3', 'Caídas y desplazamientos kids', 'Material de kids para cinturón gris.',
       '',
       'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
       'GRAY', 'Preparación', 1, 'video', 'Jiu Jitsu', '["GRAY"]'::jsonb, true, '04:10')
    on conflict (id) do update set url = excluded.url, format = excluded.format, belts = excluded.belts, duration = excluded.duration, thumbnail = excluded.thumbnail
  `);

  await client.query(`delete from public.students where id not in ('1','2','3','4')`);
  await client.query(`update public.students set avatar = '/mascota-dp.png'`);
  await client.query(`
    update public.students set ficha = jsonb_build_object(
      'tutorName', 'Daniela Muñoz',
      'tutorRelation', 'Madre',
      'tutorPhone', '+56987654321',
      'tutorEmail', 'daniela.munoz@demo.cl',
      'emergencyName', 'María Muñoz',
      'emergencyRelation', 'Abuela',
      'emergencyPhone', '+56955550004',
      'allergies', 'Ninguna',
      'discipline', 'Jiu Jitsu Kids'
    ) where id = '4'
  `);
  await client.query(`
    update public.students set ficha = jsonb_build_object(
      'tutorName', '',
      'tutorRelation', '',
      'tutorPhone', '',
      'tutorEmail', '',
      'emergencyName', 'Andrea Soto',
      'emergencyRelation', 'Madre',
      'emergencyPhone', '+56911110001',
      'allergies', 'Ninguna',
      'discipline', 'Jiu Jitsu'
    ) where id = '1'
  `);
  await client.query(`update public.sedes set mp_access_token = null, mp_public_key = null`);
  await client.query(`delete from public.admins where email <> 'contacto@dpsistemas.cl'`);
  await client.query('delete from public.class_slots');
  await client.query(`
    insert into public.class_slots (id, name, day, start_time, end_time, teacher, sede_id, audience, sort_order, capacity) values
      ('s1', 'Jiu Jitsu', 'Lunes', '11:00', '12:00', 'Entrenador 1', 1, 'ADULTS', 1, 20),
      ('s2', 'Jiu Jitsu Adultos', 'Lunes', '19:30', '21:00', 'Entrenador 1', 1, 'ADULTS', 2, 20),
      ('s3', 'Jiu Jitsu Kids', 'Martes', '18:00', '19:00', 'Entrenadora 1', 1, 'KIDS', 3, 12),
      ('s4', 'Boxeo Kickboxing MMA', 'Martes', '19:00', '20:30', 'Entrenador 2', 1, 'ADULTS', 4, 20),
      ('s5', 'Kickboxing Kids', 'Miércoles', '16:45', '17:45', 'Entrenadora 1', 1, 'KIDS', 5, 12),
      ('s6', 'Jiu Jitsu', 'Miércoles', '11:00', '12:00', 'Entrenador 1', 1, 'ADULTS', 6, 20),
      ('s7', 'MMA', 'Miércoles', '19:30', '21:00', 'Entrenador 2', 1, 'ADULTS', 7, 20),
      ('s8', 'Jiu Jitsu Kids', 'Jueves', '18:00', '19:00', 'Entrenadora 1', 1, 'KIDS', 8, 12),
      ('s9', 'Jiu Jitsu Adultos', 'Jueves', '19:00', '20:30', 'Entrenador 1', 1, 'ADULTS', 9, 20),
      ('s10', 'Boxeo Kickboxing Jiu Jitsu Mujeres', 'Jueves', '20:30', '22:00', 'Entrenadora 1', 1, 'ADULTS', 10, 20),
      ('s11', 'Kickboxing Kids', 'Viernes', '16:45', '17:45', 'Entrenadora 1', 1, 'KIDS', 11, 12),
      ('s12', 'MMA · Boxeo · Jiu Jitsu', 'Viernes', '19:30', '21:00', 'Entrenador 2', 1, 'ADULTS', 12, 20),
      ('s13', 'Jiu Jitsu Kids', 'Sábado', '11:00', '12:00', 'Entrenadora 1', 1, 'KIDS', 13, 12),
      ('s14', 'Open Mat', 'Sábado', '12:00', '14:00', 'Entrenador 1', 1, 'BOTH', 14, null)
  `);

  const categories = [
    { id: 'c-kids', name: 'Kids', minAge: 6, maxAge: 15, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['GRAY', 'WHITE'], price: 10000 },
    { id: 'c-white', name: 'Adulto blanco', minAge: 16, maxAge: 99, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['WHITE'], price: 15000 },
    { id: 'c-blue', name: 'Adulto azul', minAge: 16, maxAge: 99, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['BLUE'], price: 15000 },
    { id: 'c-fem', name: 'Femenino', minAge: 12, maxAge: 99, minWeight: null, maxWeight: null, gender: 'FEMALE', belts: [], price: 15000 },
  ];
  await client.query(`alter table public.events add column if not exists ticket_price integer default 0`);
  await client.query(`alter table public.events add column if not exists ticket_capacity integer`);
  await client.query(
    `insert into public.events (
      id, slug, title, description, photo, rules_url, rules_name,
      event_date, start_time, end_time, address, capacity, paid, price, ticket_price, status, categories
    ) values (
      'ev1', 'torneo-interacademias', 'Torneo Interacademias',
      $1, $2, $3, 'Bases Torneo Interacademias.pdf',
      '2026-10-24', '09:00', '18:00', 'Sede de ejemplo', 120, true, 15000, 5000, 'published', $4::jsonb
    )
    on conflict (id) do update set title = excluded.title, description = excluded.description, status = excluded.status, categories = excluded.categories, address = excluded.address, ticket_price = excluded.ticket_price`,
    [
      'Este es un evento de ejemplo. Alumnos e invitados se inscriben aquí. El público compra una entrada nominativa. El pago entra por Mercado Pago.',
      'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600',
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      JSON.stringify(categories),
    ]
  );
  await client.query(`
    insert into public.event_registrations (
      id, event_id, kind, student_id, name, email, phone, document_id, birth_date, age, weight, gender, belt, academy,
      category_id, category_name, amount, status, method
    ) values
      ('er1', 'ev1', 'student', '1', 'Matías Soto', 'matias.soto@demo.cl', '+56911111111', '20.111.111-1', '2008-03-12', 18, 68, 'MALE', 'WHITE', 'Academia Demo', 'c-white', 'Adulto blanco', 15000, 'paid', 'Transferencia'),
      ('er2', 'ev1', 'student', '2', 'Camila Rojas', 'camila.rojas@demo.cl', '+56922222222', '15.222.222-2', '1999-11-04', 26, 62, 'FEMALE', 'BLUE', 'Academia Demo', 'c-blue', 'Adulto azul', 15000, 'pending', 'Transferencia'),
      ('er3', 'ev1', 'guest', null, 'Lucas Herrera', 'lucas.herrera@otra.cl', '+56944444444', '12.333.333-3', '1998-06-20', 28, 76, 'MALE', 'WHITE', 'Academia Cordillera', 'c-white', 'Adulto blanco', 15000, 'paid', 'Transferencia'),
      ('er4', 'ev1', 'spectator', null, 'Ana Fuentes', 'ana.fuentes@demo.cl', '', '16.444.444-4', '', null, null, '', '', '', 'entrada', 'Entrada asistente', 5000, 'paid', 'Mercado Pago')
    on conflict (id) do update set status = excluded.status
  `);
  console.log('OK seed');
}

async function main() {
  let client;
  let lastErr;
  for (const cs of candidates) {
    try {
      console.log('Trying', cs.replace(encoded, '***'));
      client = await tryConnect(cs);
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
    await runFile(client, path.join(__dirname, '../supabase/schema.sql'));
    await seed(client);
    const { rows } = await client.query('select count(*)::int as n from public.students');
    const sedes = await client.query('select count(*)::int as n from public.sedes');
    const admins = await client.query('select email, role from public.admins');
    console.log('Students:', rows[0].n, '| Sedes:', sedes.rows[0].n);
    console.log('Admins:', admins.rows);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
