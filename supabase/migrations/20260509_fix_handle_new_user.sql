-- ============================================================================
-- Fix: handle_new_user — support invitations (team members & clients)
--
-- Before: always created a new agency and hardcoded role to admin_agency.
-- After:  if agency_id is in metadata (invitation), use existing agency
--         and read role from metadata. Only create agency for self-registration.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  _agency_id uuid;
  _full_name text;
  _role text;
  _agency_name text;
  _plan text;
begin
  _full_name := coalesce(new.raw_user_meta_data ->> 'full_name', 'Sin nombre');

  -- Check if this is an invitation (agency_id provided in metadata)
  if new.raw_user_meta_data ->> 'agency_id' is not null then
    -- Invitation flow: join existing agency
    _agency_id := (new.raw_user_meta_data ->> 'agency_id')::uuid;
    _role := coalesce(new.raw_user_meta_data ->> 'role', 'team_member');

    -- Validate role
    if _role not in ('admin_agency', 'team_member', 'client') then
      _role := 'team_member';
    end if;
  else
    -- Self-registration flow: create new agency
    _agency_name := coalesce(new.raw_user_meta_data ->> 'agency_name', 'Mi agencia');
    _plan := coalesce(new.raw_user_meta_data ->> 'plan', 'solo');

    if _plan not in ('solo', 'estudio', 'casa') then
      _plan := 'solo';
    end if;

    insert into public.agencies (name, plan)
    values (_agency_name, _plan)
    returning id into _agency_id;

    _role := 'admin_agency';
  end if;

  -- Create user profile
  insert into public.users (id, agency_id, email, full_name, role, is_active)
  values (new.id, _agency_id, new.email, _full_name, _role, true)
  on conflict (id) do update set
    agency_id = excluded.agency_id,
    full_name = excluded.full_name,
    role = excluded.role;

  return new;
end;
$$;
