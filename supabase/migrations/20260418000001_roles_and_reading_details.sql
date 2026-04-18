-- Roles, acharya assignment, reading timeline/remedies/messages.

-- ─────────────────────────────────────────────────────────────
-- role on profiles
-- ─────────────────────────────────────────────────────────────
create type public.user_role as enum ('seeker', 'acharya', 'admin');

alter table public.profiles
  add column role public.user_role not null default 'seeker';

create index profiles_role_idx on public.profiles (role);

-- Seekers can still read/update only themselves; role changes are reserved
-- for service_role (admin API) — block client updates to role.
create or replace function public.block_self_role_update()
returns trigger
language plpgsql
as $$
begin
  if (new.role is distinct from old.role) and current_setting('request.jwt.claim.role', true) <> 'service_role' then
    raise exception 'profiles.role cannot be updated by the user';
  end if;
  return new;
end;
$$;

create trigger profiles_block_self_role_update
  before update on public.profiles
  for each row execute procedure public.block_self_role_update();

-- ─────────────────────────────────────────────────────────────
-- readings: assignable acharya
-- ─────────────────────────────────────────────────────────────
alter table public.readings
  add column acharya_id uuid references auth.users(id) on delete set null,
  add column price_inr  integer,
  add column acharya_summary text;

create index readings_acharya_id_status_idx on public.readings (acharya_id, status);

-- Acharya can read readings assigned to them.
create policy "readings: acharya read assigned"
  on public.readings for select
  using (auth.uid() = acharya_id);

-- Acharya can update readings assigned to them (status, acharya_name, notes, report_url).
create policy "readings: acharya update assigned"
  on public.readings for update
  using (auth.uid() = acharya_id)
  with check (auth.uid() = acharya_id);

-- ─────────────────────────────────────────────────────────────
-- reading_events (timeline)
-- ─────────────────────────────────────────────────────────────
create table public.reading_events (
  id          uuid primary key default gen_random_uuid(),
  reading_id  uuid not null references public.readings(id) on delete cascade,
  kind        text not null, -- 'created' | 'assigned' | 'status_change' | 'note' | 'report_uploaded' | 'delivered'
  payload     jsonb not null default '{}',
  actor_id    uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index reading_events_reading_id_created_at_idx
  on public.reading_events (reading_id, created_at desc);

alter table public.reading_events enable row level security;

create policy "reading_events: seeker read own"
  on public.reading_events for select
  using (exists (
    select 1 from public.readings r
    where r.id = reading_id and r.user_id = auth.uid()
  ));

create policy "reading_events: acharya read assigned"
  on public.reading_events for select
  using (exists (
    select 1 from public.readings r
    where r.id = reading_id and r.acharya_id = auth.uid()
  ));

-- Inserts are only from server (service_role) or via trigger.
create or replace function public.log_reading_created()
returns trigger
language plpgsql
as $$
begin
  insert into public.reading_events (reading_id, kind, actor_id, payload)
  values (new.id, 'created', new.user_id, jsonb_build_object('plan', new.plan));
  return new;
end;
$$;

create trigger readings_log_created
  after insert on public.readings
  for each row execute procedure public.log_reading_created();

create or replace function public.log_reading_status_change()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status then
    insert into public.reading_events (reading_id, kind, actor_id, payload)
    values (
      new.id,
      case when new.status = 'delivered' then 'delivered' else 'status_change' end,
      coalesce(new.acharya_id, auth.uid()),
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;
  if new.acharya_id is distinct from old.acharya_id and new.acharya_id is not null then
    insert into public.reading_events (reading_id, kind, actor_id, payload)
    values (new.id, 'assigned', new.acharya_id, jsonb_build_object('acharya_id', new.acharya_id));
  end if;
  if new.report_url is distinct from old.report_url and new.report_url is not null then
    insert into public.reading_events (reading_id, kind, actor_id, payload)
    values (new.id, 'report_uploaded', coalesce(new.acharya_id, auth.uid()),
            jsonb_build_object('url', new.report_url));
  end if;
  return new;
end;
$$;

create trigger readings_log_status_change
  after update on public.readings
  for each row execute procedure public.log_reading_status_change();

-- ─────────────────────────────────────────────────────────────
-- reading_remedies
-- ─────────────────────────────────────────────────────────────
create type public.remedy_category as enum ('mantra', 'gemstone', 'ritual', 'practice', 'charity');

create table public.reading_remedies (
  id          uuid primary key default gen_random_uuid(),
  reading_id  uuid not null references public.readings(id) on delete cascade,
  category    public.remedy_category not null,
  title       text not null,
  detail      text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index reading_remedies_reading_id_idx on public.reading_remedies (reading_id);

alter table public.reading_remedies enable row level security;

create policy "reading_remedies: seeker read own"
  on public.reading_remedies for select
  using (exists (
    select 1 from public.readings r
    where r.id = reading_id and r.user_id = auth.uid()
  ));

create policy "reading_remedies: acharya all assigned"
  on public.reading_remedies for all
  using (exists (
    select 1 from public.readings r
    where r.id = reading_id and r.acharya_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.readings r
    where r.id = reading_id and r.acharya_id = auth.uid()
  ));

-- ─────────────────────────────────────────────────────────────
-- reading_messages (seeker ↔ acharya thread)
-- ─────────────────────────────────────────────────────────────
create table public.reading_messages (
  id          uuid primary key default gen_random_uuid(),
  reading_id  uuid not null references public.readings(id) on delete cascade,
  sender_id   uuid not null references auth.users(id) on delete cascade,
  body        text not null check (length(body) between 1 and 4000),
  created_at  timestamptz not null default now()
);

create index reading_messages_reading_id_created_at_idx
  on public.reading_messages (reading_id, created_at asc);

alter table public.reading_messages enable row level security;

create policy "reading_messages: seeker read own"
  on public.reading_messages for select
  using (exists (
    select 1 from public.readings r
    where r.id = reading_id and r.user_id = auth.uid()
  ));

create policy "reading_messages: acharya read assigned"
  on public.reading_messages for select
  using (exists (
    select 1 from public.readings r
    where r.id = reading_id and r.acharya_id = auth.uid()
  ));

create policy "reading_messages: seeker insert own"
  on public.reading_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.readings r
      where r.id = reading_id and r.user_id = auth.uid()
    )
  );

create policy "reading_messages: acharya insert assigned"
  on public.reading_messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.readings r
      where r.id = reading_id and r.acharya_id = auth.uid()
    )
  );
