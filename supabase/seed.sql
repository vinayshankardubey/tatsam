-- Local-dev seed: admin + two acharyas. Safe to re-run via `supabase db reset`.
-- These accounts log in with dev OTP 000000 against emails below.

do $$
declare
  admin_id    uuid := '00000000-0000-0000-0000-000000000a01';
  acharya_1   uuid := '00000000-0000-0000-0000-0000000000a1';
  acharya_2   uuid := '00000000-0000-0000-0000-0000000000a2';
  instance_id uuid := '00000000-0000-0000-0000-000000000000';
begin
  -- auth.users — idempotent
  insert into auth.users (
    id, instance_id, email, aud, role, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, is_sso_user, is_anonymous
  )
  values
    (admin_id,  instance_id, 'admin@tatsam.local',    'authenticated', 'authenticated', now(), '{}', '{}', now(), now(), false, false),
    (acharya_1, instance_id, 'acharya1@tatsam.local', 'authenticated', 'authenticated', now(), '{}', '{}', now(), now(), false, false),
    (acharya_2, instance_id, 'acharya2@tatsam.local', 'authenticated', 'authenticated', now(), '{}', '{}', now(), now(), false, false)
  on conflict (id) do nothing;

  -- profiles are auto-created by the handle_new_user trigger; patch fields.
  update public.profiles
     set role = 'admin',
         full_name = 'Vinay (Admin)',
         language = 'en'
   where id = admin_id;

  update public.profiles
     set role = 'acharya',
         full_name = 'Acharya Narayan Iyer',
         language = 'en'
   where id = acharya_1;

  update public.profiles
     set role = 'acharya',
         full_name = 'Acharya Meera Joshi',
         language = 'hi'
   where id = acharya_2;
end $$;
