import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const url = process.env.SUPABASE_URL || '';
const projectId = url.replace('https://', '').split('.')[0];
const forbidden = ['qbimxygcjjmosifsqbko', 'xtcxbxvbtxnmuaylrhmr'];
if (forbidden.includes(projectId)) {
  console.error('Refusing: Ranas project');
  process.exit(1);
}

const encoded = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD || '');
const cs = `postgresql://postgres.${projectId}:${encoded}@aws-0-us-east-2.pooler.supabase.com:6543/postgres`;
const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
await client.connect();

await client.query(`
  create table if not exists public.attendance (
    id text primary key,
    student_id text not null references public.students(id) on delete cascade,
    slot_id text,
    class_date date not null,
    checked_at timestamptz default now(),
    within_window boolean default true
  )
`);
await client.query(`
  create unique index if not exists attendance_unique_checkin
    on public.attendance (student_id, slot_id, class_date)
`);
await client.query(`alter table public.attendance enable row level security`);
await client.query(`drop policy if exists attendance_all on public.attendance`);
await client.query(`create policy attendance_all on public.attendance for all using (true) with check (true)`);
await client.query(`grant all on public.attendance to anon, authenticated`);

const d = new Date();
const day = d.getDay() || 7;
d.setHours(0, 0, 0, 0);
d.setDate(d.getDate() - day + 1);
const weekStart = d.getTime();
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

const n = await client.query('select count(*)::int as n from public.attendance');
console.log('OK attendance table. rows:', n.rows[0].n, 'weekStart', weekStart);
await client.end();
