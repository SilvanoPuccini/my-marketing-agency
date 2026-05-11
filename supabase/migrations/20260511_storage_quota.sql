-- Storage quota system per account
-- Tracks storage usage and enforces plan limits.
-- Limits: solo=1GB, estudio=1.6GB, casa=3GB
-- Hard block when quota exceeded.

-- Add storage tracking column
ALTER TABLE public.accounts
  ADD COLUMN IF NOT EXISTS storage_used_kb BIGINT NOT NULL DEFAULT 0;

-- Function: get storage limit in KB for an account
CREATE OR REPLACE FUNCTION public.get_account_storage_limit_kb(p_account_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _agency_id UUID;
  _plan TEXT;
BEGIN
  SELECT a.agency_id INTO _agency_id
  FROM public.accounts a
  WHERE a.id = p_account_id;

  SELECT ag.plan INTO _plan
  FROM public.agencies ag
  WHERE ag.id = _agency_id;

  -- 1 GB = 1048576 KB, 1.6 GB = 1677722 KB, 3 GB = 3145728 KB
  RETURN CASE _plan
    WHEN 'solo' THEN 1048576
    WHEN 'estudio' THEN 1677722
    WHEN 'casa' THEN 3145728
    ELSE 1048576
  END;
END;
$$;

-- Trigger function: BEFORE INSERT on piece_files — check quota + increment
CREATE OR REPLACE FUNCTION public.trigger_storage_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _account_id UUID;
  _limit_kb BIGINT;
  _current_kb BIGINT;
BEGIN
  SELECT p.account_id INTO _account_id
  FROM public.pieces p
  WHERE p.id = NEW.piece_id;

  _limit_kb := public.get_account_storage_limit_kb(_account_id);

  SELECT storage_used_kb INTO _current_kb
  FROM public.accounts
  WHERE id = _account_id;

  IF (_current_kb + NEW.file_size_kb) > _limit_kb THEN
    RAISE EXCEPTION 'Storage lleno. Usado: % KB, Limite: % KB, Archivo: % KB. Elimina archivos para liberar espacio.',
      _current_kb, _limit_kb, NEW.file_size_kb;
  END IF;

  UPDATE public.accounts
  SET storage_used_kb = storage_used_kb + NEW.file_size_kb
  WHERE id = _account_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_storage_on_file_insert ON public.piece_files;
CREATE TRIGGER check_storage_on_file_insert
  BEFORE INSERT ON public.piece_files
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_storage_check();

-- Trigger function: AFTER DELETE on piece_files — release storage
CREATE OR REPLACE FUNCTION public.trigger_storage_release()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _account_id UUID;
BEGIN
  SELECT p.account_id INTO _account_id
  FROM public.pieces p
  WHERE p.id = OLD.piece_id;

  UPDATE public.accounts
  SET storage_used_kb = GREATEST(0, storage_used_kb - OLD.file_size_kb)
  WHERE id = _account_id;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS release_storage_on_file_delete ON public.piece_files;
CREATE TRIGGER release_storage_on_file_delete
  AFTER DELETE ON public.piece_files
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_storage_release();
