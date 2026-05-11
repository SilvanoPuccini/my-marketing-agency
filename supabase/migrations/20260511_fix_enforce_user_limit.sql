-- Fix enforce_user_limit: clients (role='client') must NOT count as team seats.
-- Correct limits: solo=2, estudio=5, casa=15

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
    AND role IN ('admin_agency', 'team_member');

  IF _current >= _limit THEN
    RAISE EXCEPTION 'Limite de asientos de equipo alcanzado (%). Plan: %. Maximo: %',
      _current, _plan, _limit;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_user_limit ON public.users;
CREATE TRIGGER check_user_limit
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_user_limit();
