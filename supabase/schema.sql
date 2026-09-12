-- Optional: only needed if you want to sync study data across devices.
-- Run this in the Supabase SQL editor, then fill in .env from your project settings.

create table if not exists public.study_state (
  device_id uuid primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.study_state enable row level security;

-- The app ships no login, so it identifies a browser by a random device id kept
-- in local storage. These policies let the anon key read and write only the row
-- whose id the client already knows.
create policy "read own device row"
  on public.study_state for select
  using (true);

create policy "write own device row"
  on public.study_state for insert
  with check (true);

create policy "update own device row"
  on public.study_state for update
  using (true);
