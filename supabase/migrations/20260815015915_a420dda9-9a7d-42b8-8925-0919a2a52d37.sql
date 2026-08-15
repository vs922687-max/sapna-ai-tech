create table if not exists public.site_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

grant select, insert on public.site_visits to anon, authenticated;
grant all on public.site_visits to service_role;

alter table public.site_visits enable row level security;

drop policy if exists "Anyone can read visit count" on public.site_visits;
create policy "Anyone can read visit count"
  on public.site_visits
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can record a visit" on public.site_visits;
create policy "Anyone can record a visit"
  on public.site_visits
  for insert
  to anon, authenticated
  with check (true);