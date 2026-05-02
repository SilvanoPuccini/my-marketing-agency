-- =============================================================
-- 010_relax_accounts_insert.sql
-- Permite que team_member también pueda crear cuentas.
-- El admin sigue siendo el único que puede eliminarlas.
-- =============================================================

DROP POLICY IF EXISTS "accounts_insert_admin" ON accounts;

CREATE POLICY "accounts_insert_staff"
ON accounts FOR INSERT
WITH CHECK (
  auth_role() IN ('admin_agency', 'team_member')
  AND agency_id = auth_agency_id()
);
