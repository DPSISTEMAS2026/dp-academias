import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const url = process.env.SUPABASE_URL || '';
const password = process.env.SUPABASE_DB_PASSWORD || '';
const projectId = url.replace('https://', '').split('.')[0];

if (['qbimxygcjjmosifsqbko', 'xtcxbxvbtxnmuaylrhmr', 'prihphytqvpkrrwptali'].includes(projectId)) {
  console.error('Refuse: Ranas, backup o DEMOACADEMIAS viejo.');
  process.exit(1);
}
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
const ADMIN_EMAIL = 'contacto@dpsistemas.cl';
const ADMIN_PASS = 'admin26';
const STUDENT_PASS = 'alumno26';
const MASCOT = '/mascota-dp.png';

function weekStart() {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day + 1);
  return d.getTime();
}

async function main() {
  let client;
  let lastErr;
  for (const cs of candidates) {
    try {
      client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
      await client.connect();
      break;
    } catch (e) {
      lastErr = e;
      client = null;
    }
  }
  if (!client) {
    console.error('No se pudo conectar.', lastErr?.message);
    process.exit(1);
  }

  try {
    await client.query(`alter table public.videos add column if not exists format text default 'video'`);
    await client.query(`alter table public.videos add column if not exists discipline text default 'Jiu Jitsu'`);
    await client.query(`alter table public.videos add column if not exists belts jsonb default '[]'::jsonb`);
    await client.query(`alter table public.videos add column if not exists authorized_only boolean default true`);
    await client.query(`alter table public.videos add column if not exists duration text default ''`);
    await client.query(`alter table public.events add column if not exists ticket_price integer default 0`);
    await client.query(`alter table public.events add column if not exists ticket_capacity integer`);

    const existing = await client.query('select id from public.academias where slug = $1', [SLUG]);
    let academiaId = existing.rows[0]?.id;
    if (!academiaId) {
      const ins = await client.query(
        `insert into public.academias (name, slug, color, logo_url, status, max_students, max_news, max_gallery, max_images)
         values ($1, $2, '#006970', $3, 'active', 80, 12, 8, 40)
         returning id`,
        ['Academia DPDEMO', SLUG, MASCOT],
      );
      academiaId = ins.rows[0].id;
      console.log('Academia creada', academiaId);
    } else {
      await client.query(
        `update public.academias set name = 'Academia DPDEMO', color = '#006970', logo_url = $2, max_students = 80, max_images = 40
         where id = $1`,
        [academiaId, MASCOT],
      );
      console.log('Academia existente', academiaId);
    }

    await client.query('delete from public.event_registrations where academia_id = $1', [academiaId]);
    await client.query('delete from public.events where academia_id = $1', [academiaId]);
    await client.query('delete from public.attendance where academia_id = $1', [academiaId]);
    await client.query('delete from public.material_progress where academia_id = $1', [academiaId]);
    await client.query('delete from public.gallery where academia_id = $1', [academiaId]);
    await client.query('delete from public.news where academia_id = $1', [academiaId]);
    await client.query('delete from public.videos where academia_id = $1', [academiaId]);
    await client.query('delete from public.class_slots where academia_id = $1', [academiaId]);
    await client.query('delete from public.students where academia_id = $1', [academiaId]);
    await client.query('delete from public.admins where academia_id = $1', [academiaId]);
    await client.query('delete from public.sedes where academia_id = $1', [academiaId]);

    const sedes = await client.query(
      `insert into public.sedes (name, address, status, academia_id) values
        ('Sede Centro', 'Sede de ejemplo', 'Activa', $1),
        ('Sede Norte', 'Sede de ejemplo', 'Activa', $1),
        ('Sede Sur', 'Sede de ejemplo', 'Activa', $1)
       returning id, name`,
      [academiaId],
    );
    const sedeCentro = sedes.rows.find((s) => s.name === 'Sede Centro').id;
    const sedeNorte = sedes.rows.find((s) => s.name === 'Sede Norte').id;

    await client.query(
      `insert into public.admins (email, password_hash, role, academia_id) values ($1, $2, 'superadmin', $3)`,
      [ADMIN_EMAIL, ADMIN_PASS, academiaId],
    );

    const adultWeek = [
      { day: 'Lunes', time: '19:30', name: 'Jiu Jitsu Adultos', timestamp: weekStart() },
      { day: 'Miércoles', time: '19:30', name: 'MMA', timestamp: weekStart() },
      { day: 'Viernes', time: '19:30', name: 'MMA · Boxeo · Jiu Jitsu', timestamp: weekStart() },
    ];
    const kidsWeek = [
      { day: 'Martes', time: '18:00', name: 'Jiu Jitsu Kids', timestamp: weekStart() },
      { day: 'Sábado', time: '11:00', name: 'Jiu Jitsu Kids', timestamp: weekStart() },
    ];

    const ownerFicha = {
      tutorName: '',
      tutorRelation: '',
      tutorPhone: '',
      tutorEmail: '',
      emergencyName: 'Contacto DP',
      emergencyRelation: 'Academia',
      emergencyPhone: '+56974342276',
      allergies: 'Ninguna',
      discipline: 'Jiu Jitsu',
      documentId: '11.111.111-1',
    };

    const kidsFicha = {
      tutorName: 'Daniela Muñoz',
      tutorRelation: 'Madre',
      tutorPhone: '+56987654321',
      tutorEmail: 'daniela.munoz@demo.cl',
      emergencyName: 'María Muñoz',
      emergencyRelation: 'Abuela',
      emergencyPhone: '+56955550004',
      allergies: 'Ninguna',
      discipline: 'Jiu Jitsu Kids',
      documentId: '22.444.444-4',
    };

    const students = [
      {
        id: `${academiaId}_1`,
        name: 'Demo DP',
        email: ADMIN_EMAIL,
        phone: '+56974342276',
        belt: 'WHITE',
        classes: 10,
        paid: true,
        plan: '3',
        fee: 34990,
        birth: '1990-01-15',
        sede: sedeCentro,
        weight: 75,
        gender: 'MALE',
        ficha: ownerFicha,
        schedule: adultWeek,
        history: [{ date: '2026-08-05', status: 'Completado', amount: 34990, method: 'Transferencia', transaction_id: 'dp1' }],
      },
      {
        id: `${academiaId}_2`,
        name: 'Matías Soto',
        email: 'matias.soto@demo.cl',
        phone: '+56911111111',
        belt: 'WHITE',
        classes: 34,
        paid: true,
        plan: '3',
        fee: 35000,
        birth: '2008-03-12',
        sede: sedeCentro,
        weight: 68,
        gender: 'MALE',
        ficha: { ...ownerFicha, emergencyName: 'Andrea Soto', emergencyPhone: '+56911110001', documentId: '20.111.111-1' },
        schedule: adultWeek,
        history: [{ date: '2026-08-05', status: 'Completado', amount: 35000, method: 'Transferencia', transaction_id: '1842' }],
      },
      {
        id: `${academiaId}_3`,
        name: 'Camila Rojas',
        email: 'camila.rojas@demo.cl',
        phone: '+56922222222',
        belt: 'BLUE',
        classes: 22,
        paid: false,
        plan: '2',
        fee: 25000,
        birth: '1999-11-04',
        sede: sedeCentro,
        weight: 62,
        gender: 'FEMALE',
        ficha: { ...ownerFicha, emergencyName: 'Luis Rojas', emergencyPhone: '+56922220002', documentId: '15.222.222-2' },
        schedule: adultWeek,
        history: [],
      },
      {
        id: `${academiaId}_4`,
        name: 'Diego Pereira',
        email: 'diego.pereira@demo.cl',
        phone: '+56933333333',
        belt: 'WHITE',
        classes: 18,
        paid: true,
        plan: 'Ilimitado',
        fee: 45000,
        birth: '1995-07-22',
        sede: sedeNorte,
        weight: 80,
        gender: 'MALE',
        ficha: { ...ownerFicha, emergencyName: 'Paula Pereira', emergencyPhone: '+56933330003', documentId: '12.333.333-3' },
        schedule: adultWeek,
        history: [{ date: '2026-08-03', status: 'Completado', amount: 45000, method: 'Transferencia', transaction_id: '1840' }],
      },
      {
        id: `${academiaId}_5`,
        name: 'Sofía Muñoz',
        email: 'sofia.munoz@demo.cl',
        phone: '+56987654321',
        belt: 'GRAY',
        classes: 12,
        paid: true,
        plan: '2',
        fee: 25000,
        birth: '2014-05-12',
        sede: sedeCentro,
        weight: 42,
        gender: 'FEMALE',
        ficha: kidsFicha,
        schedule: kidsWeek,
        history: [{ date: '2026-08-01', status: 'Completado', amount: 25000, method: 'Transferencia', transaction_id: '1833' }],
      },
    ];

    for (const s of students) {
      await client.query(
        `insert into public.students (
          id, academia_id, name, email, password, phone, belt, classesattended, classestonextbelt,
          lastpaymentmonth, lastpaymentdate, ispaid, plan, monthlyfee, avatar, birthdate,
          history, scheduledclasses, joindate, lastgrade, graduationdate, sede_id,
          terms_accepted, weight, gender, ficha
        ) values (
          $1,$2,$3,$4,$5,$6,$7,$8,40,
          $9,$10,$11,$12,$13,$14,$15,
          $16::jsonb,$17::jsonb,'2025-03-01','Blanco','2025-03-01',$18,
          true,$19,$20,$21::jsonb
        )`,
        [
          s.id, academiaId, s.name, s.email, STUDENT_PASS, s.phone, s.belt, s.classes,
          s.paid ? '2026-08' : null, s.paid ? '2026-08-05' : null, s.paid, s.plan, s.fee, MASCOT, s.birth,
          JSON.stringify(s.history), JSON.stringify(s.schedule), s.sede,
          s.weight, s.gender, JSON.stringify(s.ficha),
        ],
      );
    }

    await client.query(
      `insert into public.news (title, body, img, link, label, date, stats, sede_id, academia_id) values
        ('DPDEMO: Torneo Interacademias: 120 cupos abiertos',
         'Inscribe alumnos o invita a otras academias. Categorías por edad, peso y grado.',
         'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', null, 'Eventos', '24 Oct, 2026',
         '[{"label":"Cupos","text":"120"},{"label":"Inscripción","text":"$15.000"}]'::jsonb, $1, $2),
        ('Nuevo horario de Jiu Jitsu y Kickboxing',
         'Configura una vez en el panel y se actualiza en la app del alumno.',
         'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', null, 'Horarios', '18 Ago, 2026',
         '[{"label":"Sedes","text":"3"}]'::jsonb, $1, $2),
        ('Biblioteca técnica: Armbar desde guardia',
         'Publica videos y PDFs por cinturón, con seguimiento de progreso.',
         'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', null, 'Material', '12 Ago, 2026',
         '[{"label":"Formato","text":"Video"}]'::jsonb, $1, $2)`,
      [sedeCentro, academiaId],
    );

    await client.query(
      `insert into public.gallery (img, size, sede_id, academia_id) values
        ('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'large', $1, $2),
        ('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'small', $1, $2),
        ('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', 'small', $1, $2),
        ('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 'tall', $1, $2)`,
      [sedeCentro, academiaId],
    );

    await client.query(
      `insert into public.videos (id, title, description, url, thumbnail, beltlevel, category, sede_id, academia_id, format, discipline, belts, authorized_only, duration) values
        ($1, 'Armbar desde guardia', 'Técnica base de Jiu Jitsu.', '',
         'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
         'WHITE', 'Técnicas', $4, $5, 'video', 'Jiu Jitsu', '["WHITE","BLUE"]'::jsonb, true, '06:24'),
        ($2, 'Reglamento de competencia', 'Bases y puntaje. PDF de ejemplo.',
         'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
         'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
         'WHITE', 'Reglamento', $4, $5, 'document', 'Jiu Jitsu', '["WHITE","BLUE"]'::jsonb, true, 'PDF'),
        ($3, 'Caídas kids', 'Material de kids.', '',
         'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
         'GRAY', 'Preparación', $4, $5, 'video', 'Jiu Jitsu', '["GRAY"]'::jsonb, true, '04:10')`,
      [`${academiaId}_v1`, `${academiaId}_v2`, `${academiaId}_v3`, sedeCentro, academiaId],
    );

    await client.query(
      `insert into public.class_slots (id, name, day, start_time, end_time, teacher, sede_id, audience, sort_order, capacity, academia_id) values
        ($2, 'Jiu Jitsu Adultos', 'Lunes', '19:30', '21:00', 'Entrenador 1', $1, 'ADULTS', 1, 20, $8),
        ($3, 'Jiu Jitsu Kids', 'Martes', '18:00', '19:00', 'Entrenadora 1', $1, 'KIDS', 2, 12, $8),
        ($4, 'MMA', 'Miércoles', '19:30', '21:00', 'Entrenador 2', $1, 'ADULTS', 3, 20, $8),
        ($5, 'Jiu Jitsu Adultos', 'Jueves', '19:00', '20:30', 'Entrenador 1', $1, 'ADULTS', 4, 20, $8),
        ($6, 'MMA · Boxeo · Jiu Jitsu', 'Viernes', '19:30', '21:00', 'Entrenador 2', $1, 'ADULTS', 5, 20, $8),
        ($7, 'Open Mat', 'Sábado', '12:00', '14:00', 'Entrenador 1', $1, 'BOTH', 6, null, $8)`,
      [sedeCentro, `${academiaId}_s1`, `${academiaId}_s2`, `${academiaId}_s3`, `${academiaId}_s4`, `${academiaId}_s5`, `${academiaId}_s6`, academiaId],
    );

    const categories = [
      { id: 'c-kids', name: 'Kids', minAge: 6, maxAge: 15, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['GRAY', 'WHITE'], price: 10000 },
      { id: 'c-white', name: 'Adulto blanco', minAge: 16, maxAge: 99, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['WHITE'], price: 15000 },
      { id: 'c-blue', name: 'Adulto azul', minAge: 16, maxAge: 99, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['BLUE'], price: 15000 },
    ];
    const eventId = `${academiaId}_ev1`;
    await client.query(
      `insert into public.events (
        id, slug, title, description, photo, rules_url, rules_name,
        event_date, start_time, end_time, address, capacity, paid, price, ticket_price, status, categories, academia_id
      ) values (
        $1, 'torneo-interacademias', 'Torneo Interacademias',
        $2, $3, $4, 'Bases Torneo Interacademias.pdf',
        '2026-10-24', '09:00', '18:00', 'Sede de ejemplo', 120, true, 15000, 5000, 'published', $5::jsonb, $6
      )`,
      [
        eventId,
        'Evento de ejemplo de DPDEMO. Sin cobro real: Mercado Pago no está conectado.',
        'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200',
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        JSON.stringify(categories),
        academiaId,
      ],
    );

    await client.query(
      `insert into public.event_registrations (
        id, event_id, kind, student_id, name, email, phone, document_id, birth_date, age, weight, gender, belt, academy,
        category_id, category_name, amount, status, method, academia_id
      ) values
        ($1, $5, 'student', $6, 'Matías Soto', 'matias.soto@demo.cl', '+56911111111', '20.111.111-1', '2008-03-12', 18, 68, 'MALE', 'WHITE', 'Academia DPDEMO', 'c-white', 'Adulto blanco', 15000, 'paid', 'Transferencia', $7),
        ($2, $5, 'student', $8, 'Camila Rojas', 'camila.rojas@demo.cl', '+56922222222', '15.222.222-2', '1999-11-04', 26, 62, 'FEMALE', 'BLUE', 'Academia DPDEMO', 'c-blue', 'Adulto azul', 15000, 'pending', 'Transferencia', $7),
        ($3, $5, 'guest', null, 'Lucas Herrera', 'lucas.herrera@otra.cl', '+56944444444', '12.333.333-3', '1998-06-20', 28, 76, 'MALE', 'WHITE', 'Academia Cordillera', 'c-white', 'Adulto blanco', 15000, 'paid', 'Transferencia', $7),
        ($4, $5, 'spectator', null, 'Ana Fuentes', 'ana.fuentes@demo.cl', '', '16.444.444-4', '', null, null, '', '', '', 'entrada', 'Entrada asistente', 5000, 'paid', 'Transferencia', $7)`,
      [
        `${academiaId}_er1`, `${academiaId}_er2`, `${academiaId}_er3`, `${academiaId}_er4`,
        eventId, `${academiaId}_2`, academiaId, `${academiaId}_3`,
      ],
    );

    const counts = await client.query(
      `select
         (select count(*)::int from public.students where academia_id = $1) as students,
         (select count(*)::int from public.news where academia_id = $1) as news,
         (select count(*)::int from public.gallery where academia_id = $1) as gallery`,
      [academiaId],
    );
    console.log('OK DPDEMO', { academiaId, slug: SLUG, ...counts.rows[0] });
    console.log('Admin', ADMIN_EMAIL, ADMIN_PASS);
    console.log('Alumno', ADMIN_EMAIL, STUDENT_PASS);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
