import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const url = process.env.SUPABASE_URL || '';
const projectId = url.replace('https://', '').split('.')[0];
if (['qbimxygcjjmosifsqbko', 'xtcxbxvbtxnmuaylrhmr'].includes(projectId)) {
  console.error('Refusing: Ranas project');
  process.exit(1);
}

const encoded = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD || '');
const cs = `postgresql://postgres.${projectId}:${encoded}@aws-0-us-east-2.pooler.supabase.com:6543/postgres`;
const client = new pg.Client({ connectionString: cs, ssl: { rejectUnauthorized: false } });
await client.connect();

await client.query(`
  create table if not exists public.demo_clicks (
    id text primary key,
    created_at timestamptz default now(),
    session_id text not null,
    path text default '',
    module text default '',
    role text default '',
    email text default '',
    label text default '',
    tag text default ''
  )
`);
await client.query(`create index if not exists demo_clicks_created_at on public.demo_clicks (created_at desc)`);
await client.query(`alter table public.demo_clicks enable row level security`);
await client.query(`drop policy if exists demo_clicks_all on public.demo_clicks`);
await client.query(`create policy demo_clicks_all on public.demo_clicks for all using (true) with check (true)`);
await client.query(`grant all on public.demo_clicks to anon, authenticated`);

console.log('demo_clicks ready');
await client.end();
