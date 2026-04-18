-- Tatsam initial schema: profiles (1:1 auth.users) + readings

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  phone        text,
  dob          date,
  tob          time,
  birth_place  text,
  language     text not null default 'en',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create a profile row when a new auth user signs up via OTP.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Keep updated_at fresh on profile edits.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- readings
-- ─────────────────────────────────────────────────────────────
create type public.reading_plan as enum ('darshan', 'signature', 'legacy');
create type public.reading_status as enum ('pending', 'in_review', 'delivered', 'cancelled');

create table public.readings (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  plan           public.reading_plan   not null,
  status         public.reading_status not null default 'pending',
  acharya_name   text,
  seeker_note    text,
  report_url     text,
  delivered_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index readings_user_id_created_at_idx
  on public.readings (user_id, created_at desc);

alter table public.readings enable row level security;

create policy "readings: read own"
  on public.readings for select
  using (auth.uid() = user_id);

create policy "readings: insert own"
  on public.readings for insert
  with check (auth.uid() = user_id);

-- Seekers can update only their own seeker_note while still pending.
create policy "readings: update own note while pending"
  on public.readings for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id);

create trigger readings_set_updated_at
  before update on public.readings
  for each row execute procedure public.set_updated_at();
