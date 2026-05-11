-- Fix enforce_account_limit: casa from 999 to 15

CREATE OR REPLACE FUNCTION public.enforce_account_limit()
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
  SELECT plan INTO _plan
  FROM public.agencies
  WHERE id = NEW.agency_id;

  _limit := CASE _plan
    WHEN 'solo' THEN 1
    WHEN 'estudio' THEN 5
    WHEN 'casa' THEN 15
    ELSE 1
  END;

  SELECT count(*) INTO _current
  FROM public.accounts
  WHERE agency_id = NEW.agency_id;

  IF _current >= _limit THEN
    RAISE EXCEPTION 'Limite de cuentas alcanzado. Plan: %. Maximo: %', _plan, _limit;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_account_limit ON public.accounts;
CREATE TRIGGER check_account_limit
  BEFORE INSERT ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_account_limit();
