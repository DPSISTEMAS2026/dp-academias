-- Fotos en Cloudflare R2. En Postgres solo URL + bytes (para el tope de 8 GB).
create table if not exists public.academy_media (
  id text primary key,
  academia_id bigint not null references public.academias(id) on delete cascade,
  cf_id text not null,
  url text not null,
  kind text default 'image',
  bytes bigint not null default 0,
  created_at timestamptz default now()
);

alter table public.academy_media add column if not exists bytes bigint not null default 0;
create index if not exists academy_media_academia on public.academy_media (academia_id);
alter table public.academias add column if not exists max_images integer default 80;
alter table public.academias add column if not exists max_storage_bytes bigint default 33554432;
