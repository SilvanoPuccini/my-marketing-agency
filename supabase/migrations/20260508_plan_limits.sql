-- ============================================================================
-- Trigger: enforce_account_limit
-- Valida que la agencia no supere el límite de cuentas de su plan
-- antes de permitir INSERT en accounts.
-- ============================================================================

create or replace function public.enforce_account_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  _plan text;
  _limit int;
  _current int;
begin
  -- Obtener plan de la agencia
  select plan into _plan
  from public.agencies
  where id = new.agency_id;

  -- Definir límites por plan
  _limit := case _plan
    when 'solo' then 1
    when 'estudio' then 5
    when 'casa' then 999
    else 1
  end;

  -- Contar cuentas actuales
  select count(*) into _current
  from public.accounts
  where agency_id = new.agency_id;

  if _current >= _limit then
    raise exception 'Límite de cuentas alcanzado para el plan "%". Máximo: %', _plan, _limit;
  end if;

  return new;
end;
$$;

drop trigger if exists check_account_limit on public.accounts;
create trigger check_account_limit
  before insert on public.accounts
  for each row
  execute function public.enforce_account_limit();

-- ============================================================================
-- Trigger: enforce_user_limit
-- Valida que la agencia no supere el límite de usuarios de su plan.
-- ============================================================================

create or replace function public.enforce_user_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  _plan text;
  _limit int;
  _current int;
begin
  select plan into _plan
  from public.agencies
  where id = new.agency_id;

  _limit := case _plan
    when 'solo' then 1
    when 'estudio' then 5
    when 'casa' then 999
    else 1
  end;

  select count(*) into _current
  from public.users
  where agency_id = new.agency_id;

  if _current >= _limit then
    raise exception 'Límite de usuarios alcanzado para el plan "%". Máximo: %', _plan, _limit;
  end if;

  return new;
end;
$$;

drop trigger if exists check_user_limit on public.users;
create trigger check_user_limit
  before insert on public.users
  for each row
  execute function public.enforce_user_limit();
