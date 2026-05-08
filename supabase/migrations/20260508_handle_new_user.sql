-- ============================================================================
-- Trigger: handle_new_user
-- Se ejecuta automáticamente cuando un usuario se registra via supabase.auth.signUp()
--
-- Lee raw_user_meta_data del auth.users y crea:
--   1. Una agencia en public.agencies (con el plan elegido)
--   2. Un perfil en public.users (con role admin_agency, vinculado a la agencia)
--
-- Metadata esperada del signUp:
--   { full_name: string, agency_name: string, plan?: 'solo'|'estudio'|'casa' }
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
  _agency_name text;
  _plan text;
begin
  -- Extraer metadata del signup
  _full_name   := coalesce(new.raw_user_meta_data ->> 'full_name', 'Sin nombre');
  _agency_name := coalesce(new.raw_user_meta_data ->> 'agency_name', 'Mi agencia');
  _plan        := coalesce(new.raw_user_meta_data ->> 'plan', 'solo');

  -- Validar plan
  if _plan not in ('solo', 'estudio', 'casa') then
    _plan := 'solo';
  end if;

  -- Crear agencia
  insert into public.agencies (name, plan)
  values (_agency_name, _plan)
  returning id into _agency_id;

  -- Crear perfil de usuario vinculado a la agencia
  insert into public.users (id, agency_id, email, full_name, role, is_active)
  values (
    new.id,
    _agency_id,
    new.email,
    _full_name,
    'admin_agency',
    true
  );

  return new;
end;
$$;

-- Trigger que se ejecuta después de cada INSERT en auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
