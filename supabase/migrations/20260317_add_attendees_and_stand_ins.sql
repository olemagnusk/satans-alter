-- Align concerts table with app schema: attendees as text[] and stand_ins as text[]

alter table public.concerts
  alter column attendees drop not null;

alter table public.concerts
  alter column attendees type text[]
  using null;

alter table public.concerts
  add column if not exists stand_ins text[];

