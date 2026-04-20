-- PostgREST uses FKs to infer relationships. `readings.user_id` currently
-- references `auth.users(id)`, which PostgREST doesn't join to `public.profiles`.
-- Add an explicit FK to profiles so `readings.select("*, seeker:profiles(...)")`
-- resolves. The value is always equal to auth.users.id, so no data risk.

alter table public.readings
  add constraint readings_seeker_profile_fk
  foreign key (user_id) references public.profiles(id)
  on delete cascade;

-- Same story for acharya_id.
alter table public.readings
  add constraint readings_acharya_profile_fk
  foreign key (acharya_id) references public.profiles(id)
  on delete set null;

-- Reload PostgREST schema cache so the above is visible immediately.
notify pgrst, 'reload schema';
