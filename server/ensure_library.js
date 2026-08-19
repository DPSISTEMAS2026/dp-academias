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

await client.query(`alter table public.videos add column if not exists format text default 'video'`);
await client.query(`alter table public.videos add column if not exists discipline text default 'Jiu Jitsu'`);
await client.query(`alter table public.videos add column if not exists belts jsonb default '[]'::jsonb`);
await client.query(`alter table public.videos add column if not exists authorized_only boolean default true`);
await client.query(`alter table public.videos add column if not exists duration text default ''`);

await client.query(`
  create table if not exists public.material_progress (
    id text primary key,
    student_id text not null,
    video_id text not null references public.videos(id) on delete cascade,
    progress integer default 0,
    views integer default 0,
    saved boolean default false,
    updated_at timestamptz default now()
  )
`);
await client.query(`
  create unique index if not exists material_progress_unique
    on public.material_progress (student_id, video_id)
`);
await client.query(`alter table public.material_progress enable row level security`);
await client.query(`drop policy if exists material_progress_all on public.material_progress`);
await client.query(`create policy material_progress_all on public.material_progress for all using (true) with check (true)`);
await client.query(`grant all on public.material_progress to anon, authenticated`);

await client.query(`
  insert into public.videos (id, title, description, url, thumbnail, beltlevel, category, sede_id, format, discipline, belts, authorized_only, duration) values
    ('v1', 'Armbar desde guardia', 'Técnica base de Jiu Jitsu para cinturón blanco y azul.',
     'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
     'WHITE', 'Técnicas', 1, 'video', 'Jiu Jitsu', '["WHITE","BLUE"]'::jsonb, true, '06:24'),
    ('v2', 'Reglamento de competencia', 'Bases y puntaje para alumnos que van a torneo. Documento PDF.',
     'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
     'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
     'WHITE', 'Reglamento', 1, 'document', 'Jiu Jitsu', '["WHITE","BLUE","PURPLE"]'::jsonb, true, 'PDF'),
    ('v3', 'Caídas y desplazamientos kids', 'Material de kids para cinturón gris.',
     'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
     'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
     'GRAY', 'Preparación', 1, 'video', 'Jiu Jitsu', '["GRAY"]'::jsonb, true, '04:10')
  on conflict (id) do update set
    title = excluded.title,
    description = excluded.description,
    format = excluded.format,
    discipline = excluded.discipline,
    belts = excluded.belts,
    authorized_only = excluded.authorized_only,
    duration = excluded.duration,
    thumbnail = excluded.thumbnail,
    category = excluded.category
`);

await client.query(`
  insert into public.material_progress (id, student_id, video_id, progress, views, saved) values
    ('1-v1', '1', 'v1', 75, 4, true),
    ('1-v2', '1', 'v2', 100, 2, false),
    ('2-v1', '2', 'v1', 40, 1, false),
    ('4-v3', '4', 'v3', 20, 1, true)
  on conflict (id) do update set progress = excluded.progress, views = excluded.views, saved = excluded.saved
`);

const videos = await client.query('select id, format, belts, duration from public.videos order by id');
const progress = await client.query('select student_id, video_id, progress from public.material_progress');
console.log('videos', videos.rows);
console.log('progress', progress.rows);
await client.end();
