-- =============================================================
-- 004_security_fixes.sql — Hardening de funciones SQL
-- My Marketing Agency
-- =============================================================

-- ─── Fix 1: set_updated_at — agregar search_path ─────────────
-- Trigger function, no debe llamarse via REST
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION set_updated_at() FROM anon, authenticated;

-- ─── Fix 2: handle_new_user — revocar acceso REST ────────────
-- Es un trigger, no una función pública. Ya tiene SET search_path.
REVOKE EXECUTE ON FUNCTION handle_new_user() FROM anon, authenticated;

-- ─── Fix 3: pieces_by_status_count — SECURITY INVOKER ────────
-- Con SECURITY INVOKER el RLS del usuario autenticado filtra
-- naturalmente. No necesitamos bypassearlo.
CREATE OR REPLACE FUNCTION pieces_by_status_count(p_agency_id UUID)
RETURNS TABLE(status TEXT, total BIGINT)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT p.status, COUNT(*) AS total
  FROM pieces p
  JOIN accounts a ON p.account_id = a.id
  WHERE a.agency_id = p_agency_id
    AND a.is_active = TRUE
  GROUP BY p.status;
$$;

REVOKE EXECUTE ON FUNCTION pieces_by_status_count(UUID) FROM anon;

-- ─── Fix 4: published_pieces_by_month — SECURITY INVOKER ─────
CREATE OR REPLACE FUNCTION published_pieces_by_month(p_agency_id UUID, p_months INT DEFAULT 6)
RETURNS TABLE(month TEXT, total BIGINT)
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    TO_CHAR(DATE_TRUNC('month', p.scheduled_date), 'Mon YYYY') AS month,
    COUNT(*) AS total
  FROM pieces p
  JOIN accounts a ON p.account_id = a.id
  WHERE a.agency_id = p_agency_id
    AND p.status = 'published'
    AND p.scheduled_date >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month' * (p_months - 1)
  GROUP BY DATE_TRUNC('month', p.scheduled_date)
  ORDER BY DATE_TRUNC('month', p.scheduled_date);
$$;

REVOKE EXECUTE ON FUNCTION published_pieces_by_month(UUID, INT) FROM anon;
