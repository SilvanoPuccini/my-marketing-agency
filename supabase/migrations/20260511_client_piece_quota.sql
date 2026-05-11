-- Client piece quota system
-- Tracks monthly piece usage per portal client.
-- Limits: solo=60, estudio=80, casa=160 pieces/month per client.

-- Table
CREATE TABLE IF NOT EXISTS public.client_piece_quota (
    user_id        UUID       NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    year_month     VARCHAR(7) NOT NULL,  -- 'YYYY-MM'
    pieces_created INT        NOT NULL DEFAULT 0,
    pieces_limit   INT        NOT NULL,
    PRIMARY KEY (user_id, year_month)
);

CREATE INDEX IF NOT EXISTS idx_quota_user  ON public.client_piece_quota(user_id);
CREATE INDEX IF NOT EXISTS idx_quota_month ON public.client_piece_quota(year_month);

-- Function: get piece limit based on agency plan
CREATE OR REPLACE FUNCTION public.get_client_piece_limit(p_user_id UUID)
RETURNS INT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    _agency_id UUID;
    _plan TEXT;
BEGIN
    SELECT u.agency_id INTO _agency_id
    FROM public.users u
    WHERE u.id = p_user_id;

    SELECT a.plan INTO _plan
    FROM public.agencies a
    WHERE a.id = _agency_id;

    RETURN CASE _plan
        WHEN 'solo' THEN 60
        WHEN 'estudio' THEN 80
        WHEN 'casa' THEN 160
        ELSE 60
    END;
END;
$$;

-- Function: check quota and increment counter atomically (no race conditions)
CREATE OR REPLACE FUNCTION public.check_and_increment_piece_quota(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    _current_month VARCHAR(7);
    _limit INT;
    _used INT;
BEGIN
    _current_month := to_char(NOW(), 'YYYY-MM');
    _limit := public.get_client_piece_limit(p_user_id);

    -- Ensure row exists for current month
    INSERT INTO public.client_piece_quota (user_id, year_month, pieces_created, pieces_limit)
    VALUES (p_user_id, _current_month, 0, _limit)
    ON CONFLICT (user_id, year_month) DO NOTHING;

    -- Atomic check-and-increment: only updates if under limit
    UPDATE public.client_piece_quota
    SET pieces_created = pieces_created + 1
    WHERE user_id = p_user_id
      AND year_month = _current_month
      AND pieces_created < _limit;

    -- If UPDATE didn't match any row, quota exceeded
    IF NOT FOUND THEN
        SELECT pieces_created INTO _used
        FROM public.client_piece_quota
        WHERE user_id = p_user_id AND year_month = _current_month;

        RAISE EXCEPTION 'Cuota de piezas mensuales alcanzada. Limite: %. Usadas: %',
            _limit, COALESCE(_used, _limit);
    END IF;

    RETURN TRUE;
END;
$$;

-- Trigger: check quota BEFORE INSERT on pieces (only for clients)
CREATE OR REPLACE FUNCTION public.trigger_piece_quota_check()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    _author_role VARCHAR(20);
BEGIN
    SELECT role INTO _author_role
    FROM public.users
    WHERE id = NEW.author_id;

    -- Only enforce quota for portal clients
    IF _author_role = 'client' THEN
        PERFORM public.check_and_increment_piece_quota(NEW.author_id);
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_piece_quota_on_insert ON public.pieces;
CREATE TRIGGER check_piece_quota_on_insert
    BEFORE INSERT ON public.pieces
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_piece_quota_check();
