-- =============================================================
-- 011_fix_rls_recursion_account_members.sql
-- Fix: infinite recursion en account_members_select y pieces_select_agency
-- La política vieja en account_members hacía:
--   users → accounts → pieces → account_members → loop infinito
-- Solución: usar auth_agency_id() (SECURITY DEFINER) directamente
-- =============================================================

DROP POLICY IF EXISTS "account_members_select" ON account_members;

CREATE POLICY "account_members_select"
ON account_members FOR SELECT
USING (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id = auth_agency_id()
  )
);

-- La política de pieces referenciaba account_members, cerrando el ciclo
DROP POLICY IF EXISTS "pieces_select_agency" ON pieces;

CREATE POLICY "pieces_select_agency"
ON pieces FOR SELECT
USING (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id = auth_agency_id()
  )
);
