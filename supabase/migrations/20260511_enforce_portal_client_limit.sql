-- New trigger: enforce_portal_client_limit
-- Limits how many portal clients (role='client') can be added per account.
-- Limits: solo=2, estudio=5, casa=15

CREATE OR REPLACE FUNCTION public.enforce_portal_client_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _agency_id UUID;
  _plan TEXT;
  _limit INT;
  _current INT;
BEGIN
  SELECT agency_id INTO _agency_id
  FROM public.accounts
  WHERE id = NEW.account_id;

  SELECT plan INTO _plan
  FROM public.agencies
  WHERE id = _agency_id;

  _limit := CASE _plan
    WHEN 'solo' THEN 2
    WHEN 'estudio' THEN 5
    WHEN 'casa' THEN 15
    ELSE 2
  END;

  SELECT count(*) INTO _current
  FROM public.account_clients ac
  JOIN public.users u ON u.id = ac.user_id
  WHERE ac.account_id = NEW.account_id
    AND u.role = 'client';

  IF _current >= _limit THEN
    RAISE EXCEPTION 'Limite de clientes portal alcanzado para esta cuenta. Plan: %. Maximo: %',
      _plan, _limit;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_portal_client_limit ON public.account_clients;
CREATE TRIGGER check_portal_client_limit
  BEFORE INSERT ON public.account_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_portal_client_limit();
