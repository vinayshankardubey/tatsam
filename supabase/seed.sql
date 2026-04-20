-- Local-dev seed: admin + two acharyas. Safe to re-run via `supabase db reset`.
-- These accounts log in with dev OTP 000000 against emails below.

do $$
declare
  admin_id    uuid := '00000000-0000-0000-0000-000000000a01';
  acharya_1   uuid := '00000000-0000-0000-0000-0000000000a1';
  acharya_2   uuid := '00000000-0000-0000-0000-0000000000a2';
  instance_id uuid := '00000000-0000-0000-0000-000000000000';

  users constant jsonb := jsonb_build_array(
    jsonb_build_object('id', admin_id,  'email', 'admin@tatsam.local'),
    jsonb_build_object('id', acharya_1, 'email', 'acharya1@tatsam.local'),
    jsonb_build_object('id', acharya_2, 'email', 'acharya2@tatsam.local')
  );
  u jsonb;
begin
  -- auth.users — idempotent
  for u in select * from jsonb_array_elements(users)
  loop
    insert into auth.users (
      id, instance_id, email, aud, role, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, is_sso_user, is_anonymous,
      -- gotrue scans these as plain strings (not nullable strings), so NULLs crash it.
      encrypted_password,
      confirmation_token, recovery_token,
      email_change, email_change_token_current, email_change_token_new,
      phone_change, phone_change_token,
      reauthentication_token
    )
    values (
      (u->>'id')::uuid, instance_id, u->>'email', 'authenticated', 'authenticated', now(),
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      now(), now(), false, false,
      '', '', '', '', '', '', '', '', ''
    )
    on conflict (id) do nothing;

    -- auth.identities — required by gotrue for the email provider.
    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    )
    values (
      gen_random_uuid(), (u->>'id')::uuid,
      jsonb_build_object('sub', u->>'id', 'email', u->>'email', 'email_verified', true, 'provider', 'email'),
      'email', (u->>'id'), now(), now(), now()
    )
    on conflict (provider, provider_id) do nothing;
  end loop;

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
