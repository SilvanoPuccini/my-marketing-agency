-- =============================================================
-- 012_fix_all_rls_recursion.sql
-- Solución definitiva a la recursión infinita en RLS.
--
-- Problema: las policies de pieces/account_members hacen
-- SELECT FROM accounts, lo que dispara accounts_select_admin,
-- que ya está siendo evaluada → infinite recursion.
--
-- Solución: auth_account_ids() — SECURITY DEFINER que devuelve
-- los IDs de cuentas de la agencia SIN pasar por RLS.
-- =============================================================

-- ─── Helper function ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION auth_account_ids()
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM accounts
  WHERE agency_id = (SELECT agency_id FROM users WHERE id = auth.uid());
$$;

-- ─── account_members ─────────────────────────────────────────
DROP POLICY IF EXISTS "account_members_select" ON account_members;
CREATE POLICY "account_members_select"
ON account_members FOR SELECT
USING (account_id IN (SELECT auth_account_ids()));

-- ─── account_clients ─────────────────────────────────────────
DROP POLICY IF EXISTS "account_clients_select" ON account_clients;
CREATE POLICY "account_clients_select"
ON account_clients FOR SELECT
USING (
  account_id IN (SELECT auth_account_ids())
  OR user_id = auth.uid()
);

-- ─── pieces ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "pieces_select_agency" ON pieces;
CREATE POLICY "pieces_select_agency"
ON pieces FOR SELECT
USING (account_id IN (SELECT auth_account_ids()));

DROP POLICY IF EXISTS "pieces_insert_agency" ON pieces;
CREATE POLICY "pieces_insert_agency"
ON pieces FOR INSERT
WITH CHECK (
  account_id IN (SELECT auth_account_ids())
  AND auth_role() IN ('admin_agency', 'team_member')
);

DROP POLICY IF EXISTS "pieces_update_agency" ON pieces;
CREATE POLICY "pieces_update_agency"
ON pieces FOR UPDATE
USING (
  account_id IN (SELECT auth_account_ids())
  AND auth_role() IN ('admin_agency', 'team_member')
);

DROP POLICY IF EXISTS "pieces_delete_admin" ON pieces;
CREATE POLICY "pieces_delete_admin"
ON pieces FOR DELETE
USING (
  account_id IN (SELECT auth_account_ids())
  AND auth_role() = 'admin_agency'
);

-- ─── piece_files ─────────────────────────────────────────────
DROP POLICY IF EXISTS "piece_files_select_agency" ON piece_files;
CREATE POLICY "piece_files_select_agency"
ON piece_files FOR SELECT
USING (
  piece_id IN (
    SELECT id FROM pieces WHERE account_id IN (SELECT auth_account_ids())
  )
);

DROP POLICY IF EXISTS "piece_files_insert_agency" ON piece_files;
CREATE POLICY "piece_files_insert_agency"
ON piece_files FOR INSERT
WITH CHECK (
  auth_role() IN ('admin_agency', 'team_member')
  AND piece_id IN (
    SELECT id FROM pieces WHERE account_id IN (SELECT auth_account_ids())
  )
);

DROP POLICY IF EXISTS "piece_files_delete_agency" ON piece_files;
CREATE POLICY "piece_files_delete_agency"
ON piece_files FOR DELETE
USING (
  auth_role() IN ('admin_agency', 'team_member')
  AND piece_id IN (
    SELECT id FROM pieces WHERE account_id IN (SELECT auth_account_ids())
  )
);
