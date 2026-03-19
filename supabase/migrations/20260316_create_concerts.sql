-- Initial concerts table schema (local + managed via migrations)

create table if not exists public.concerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  band_name text not null,
  support_band_1 text,
  support_band_2 text,
  booker text,
  attendees text[],
  stand_ins text[],
  date date not null,
  score_main integer check (score_main between 1 and 6),
  score_support_1 integer check (score_support_1 between 1 and 6),
  score_support_2 integer check (score_support_2 between 1 and 6),
  venue text,
  alcohol_level integer,
  note text,
  images jsonb,
  created_by uuid references auth.users (id)
);

comment on table public.concerts is 'Concert entries for internal dashboard';

