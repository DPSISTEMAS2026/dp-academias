import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const url = process.env.SUPABASE_URL || '';
const projectId = url.replace('https://', '').split('.')[0];
const forbidden = ['qbimxygcjjmosifsqbko', 'xtcxbxvbtxnmumuaylrhmr', 'xtcxbxvbtxnmuaylrhmr'];
if (['qbimxygcjjmosifsqbko', 'xtcxbxvbtxnmuaylrhmr'].includes(projectId)) {
  console.error('Refusing: Ranas project');
  process.exit(1);
}

const encoded = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD || '');
const cs = `postgresql://postgres.${projectId}:${encoded}@aws-0-us-east-2.pooler.supabase.com:6543/postgres`;
const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
await client.connect();

await client.query(`
  create table if not exists public.events (
    id text primary key,
    slug text not null unique,
    title text not null,
    description text default '',
    photo text default '',
    rules_url text default '',
    rules_name text default '',
    event_date text,
    start_time text default '',
    end_time text default '',
    address text default '',
    capacity integer,
    paid boolean default true,
    price integer default 0,
    status text default 'draft',
    categories jsonb default '[]'::jsonb,
    created_at timestamptz default now()
  )
`);
await client.query(`
  create table if not exists public.event_registrations (
    id text primary key,
    event_id text not null references public.events(id) on delete cascade,
    kind text not null default 'guest',
    student_id text,
    name text not null,
    email text,
    phone text,
    document_id text,
    birth_date text,
    age integer,
    weight numeric,
    gender text,
    belt text,
    academy text,
    category_id text,
    category_name text,
    amount integer default 0,
    status text default 'pending',
    method text,
    created_at timestamptz default now()
  )
`);
await client.query(`
  create unique index if not exists event_reg_student_unique
    on public.event_registrations (event_id, student_id)
    where student_id is not null
`);
await client.query(`alter table public.events enable row level security`);
await client.query(`alter table public.event_registrations enable row level security`);
await client.query(`drop policy if exists events_all on public.events`);
await client.query(`drop policy if exists event_registrations_all on public.event_registrations`);
await client.query(`create policy events_all on public.events for all using (true) with check (true)`);
await client.query(`create policy event_registrations_all on public.event_registrations for all using (true) with check (true)`);
await client.query(`grant all on public.events to anon, authenticated`);
await client.query(`grant all on public.event_registrations to anon, authenticated`);

const categories = JSON.stringify([
  { id: 'c-kids', name: 'Kids', minAge: 6, maxAge: 15, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['GRAY', 'WHITE'], price: 10000 },
  { id: 'c-white', name: 'Adulto blanco', minAge: 16, maxAge: 99, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['WHITE'], price: 15000 },
  { id: 'c-blue', name: 'Adulto azul', minAge: 16, maxAge: 99, minWeight: null, maxWeight: null, gender: 'ANY', belts: ['BLUE'], price: 15000 },
  { id: 'c-fem', name: 'Femenino', minAge: 12, maxAge: 99, minWeight: null, maxWeight: null, gender: 'FEMALE', belts: [], price: 15000 },
]);

await client.query(
  `insert into public.events (
    id, slug, title, description, photo, rules_url, rules_name,
    event_date, start_time, end_time, address, capacity, paid, price, status, categories
  ) values (
    'ev1', 'torneo-interacademias', 'Torneo Interacademias',
    $1, $2, $3, 'Bases Torneo Interacademias.pdf',
    '2026-10-24', '09:00', '18:00', 'Sede de ejemplo', 120, true, 15000, 'published', $4::jsonb
  )
  on conflict (id) do update set title = excluded.title, description = excluded.description, status = excluded.status, categories = excluded.categories, photo = excluded.photo, address = excluded.address, event_date = excluded.event_date`,
  [
    'Este es un evento de ejemplo. Alumnos e invitados se inscriben aquí. El pago entra por Mercado Pago: la pasarela confirma el cobro y deja inscrito a quien pagó.',
    'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1600',
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    categories,
  ]
);

await client.query(`
  insert into public.event_registrations (
    id, event_id, kind, student_id, name, email, phone, document_id, birth_date, age, weight, gender, belt, academy,
    category_id, category_name, amount, status, method
  ) values
    ('er1', 'ev1', 'student', '1', 'Matías Soto', 'matias.soto@demo.cl', '+56911111111', '20.111.111-1', '2008-03-12', 18, 68, 'MALE', 'WHITE', 'Academia Demo', 'c-white', 'Adulto blanco', 15000, 'paid', 'Transferencia'),
    ('er2', 'ev1', 'student', '2', 'Camila Rojas', 'camila.rojas@demo.cl', '+56922222222', '15.222.222-2', '1999-11-04', 26, 62, 'FEMALE', 'BLUE', 'Academia Demo', 'c-blue', 'Adulto azul', 15000, 'pending', 'Transferencia'),
    ('er3', 'ev1', 'guest', null, 'Lucas Herrera', 'lucas.herrera@otra.cl', '+56944444444', '12.333.333-3', '1998-06-20', 28, 76, 'MALE', 'WHITE', 'Academia Cordillera', 'c-white', 'Adulto blanco', 15000, 'paid', 'Transferencia')
  on conflict (id) do update set status = excluded.status
`);

const ev = await client.query('select id, slug, status from public.events');
const regs = await client.query('select kind, count(*)::int as n from public.event_registrations group by kind');
console.log('events', ev.rows);
console.log('registrations', regs.rows);
await client.end();
