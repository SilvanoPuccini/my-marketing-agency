-- Add manager and creator roles to team seat counting.
-- These roles consume team seats like admin_agency and team_member.
-- Clients still don't consume seats.

CREATE OR REPLACE FUNCTION public.enforce_user_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _plan TEXT;
  _limit INT;
  _current INT;
BEGIN
  -- Portal clients do not consume a team seat
  IF NEW.role = 'client' THEN
    RETURN NEW;
  END IF;

  SELECT plan INTO _plan
  FROM public.agencies
  WHERE id = NEW.agency_id;

  _limit := CASE _plan
    WHEN 'solo' THEN 2
    WHEN 'estudio' THEN 5
    WHEN 'casa' THEN 15
    ELSE 2
  END;

  SELECT count(*) INTO _current
  FROM public.users
  WHERE agency_id = NEW.agency_id
    AND role IN ('admin_agency', 'team_member', 'manager', 'creator');

  IF _current >= _limit THEN
    RAISE EXCEPTION 'Limite de asientos de equipo alcanzado (%). Plan: %. Maximo: %',
      _current, _plan, _limit;
  END IF;

  RETURN NEW;
END;
$$;
