-- =============================================================
-- 003_functions.sql — Funciones SQL para el Dashboard
-- My Marketing Agency
-- =============================================================

-- ─── Conteo de piezas por estado para la agencia ─────────────
CREATE OR REPLACE FUNCTION pieces_by_status_count(p_agency_id UUID)
RETURNS TABLE(status TEXT, total BIGINT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT p.status, COUNT(*) AS total
  FROM pieces p
  JOIN accounts a ON p.account_id = a.id
  WHERE a.agency_id = p_agency_id
    AND a.is_active = TRUE
  GROUP BY p.status;
$$;

-- ─── Evolución mensual de piezas publicadas ──────────────────
CREATE OR REPLACE FUNCTION published_pieces_by_month(p_agency_id UUID, p_months INT DEFAULT 6)
RETURNS TABLE(month TEXT, total BIGINT)
LANGUAGE sql
SECURITY DEFINER
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

-- ─── Trigger: crear perfil en users al registrar en auth ─────
-- Se ejecuta automáticamente cuando Supabase Auth crea un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, agency_id, email, full_name, role)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'agency_id')::UUID,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'team_member')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
