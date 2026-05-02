-- =============================================================
-- 008_agencies_rls.sql
-- Add UPDATE policy on agencies for admin_agency role
-- =============================================================

DROP POLICY IF EXISTS "agencies_update_admin" ON agencies;

CREATE POLICY "agencies_update_admin"
ON agencies FOR UPDATE
USING (
  id = auth_agency_id()
  AND auth_role() = 'admin_agency'
);
