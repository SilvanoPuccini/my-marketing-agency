-- =============================================================
-- 006_rls_fix_recursion.sql
-- Fix: RLS recursion en tabla users
-- Las policies que hacen SELECT sobre users desde dentro de users
-- causan recursión infinita → 500. Solución: helper functions
-- con SECURITY DEFINER que bypassean RLS.
-- =============================================================

-- ─── Helpers SECURITY DEFINER ────────────────────────────────

CREATE OR REPLACE FUNCTION auth_agency_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT agency_id FROM users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION auth_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$;

-- ─── Reemplazar policies recursivas en USERS ─────────────────

DROP POLICY IF EXISTS "users_select_agency_admin"  ON users;
DROP POLICY IF EXISTS "users_select_agency_member" ON users;
DROP POLICY IF EXISTS "users_insert_admin"         ON users;
DROP POLICY IF EXISTS "users_update_admin"         ON users;

CREATE POLICY "users_select_agency_admin"
ON users FOR SELECT
USING (
  agency_id = auth_agency_id()
  AND auth_role() = 'admin_agency'
);

CREATE POLICY "users_select_agency_member"
ON users FOR SELECT
USING (
  agency_id = auth_agency_id()
  AND auth_role() = 'team_member'
);

CREATE POLICY "users_insert_admin"
ON users FOR INSERT
WITH CHECK (auth_role() = 'admin_agency');

CREATE POLICY "users_update_admin"
ON users FOR UPDATE
USING (
  agency_id = auth_agency_id()
  AND auth_role() = 'admin_agency'
);

-- ─── Reemplazar policies recursivas en ACCOUNTS ──────────────

DROP POLICY IF EXISTS "accounts_select_admin"  ON accounts;
DROP POLICY IF EXISTS "accounts_insert_admin"  ON accounts;
DROP POLICY IF EXISTS "accounts_update_admin"  ON accounts;
DROP POLICY IF EXISTS "accounts_delete_admin"  ON accounts;

CREATE POLICY "accounts_select_admin"
ON accounts FOR SELECT
USING (agency_id = auth_agency_id());

CREATE POLICY "accounts_insert_admin"
ON accounts FOR INSERT
WITH CHECK (
  auth_role() = 'admin_agency'
  AND agency_id = auth_agency_id()
);

CREATE POLICY "accounts_update_admin"
ON accounts FOR UPDATE
USING (
  agency_id = auth_agency_id()
  AND auth_role() = 'admin_agency'
);

CREATE POLICY "accounts_delete_admin"
ON accounts FOR DELETE
USING (
  agency_id = auth_agency_id()
  AND auth_role() = 'admin_agency'
);

-- ─── Reemplazar policies recursivas en PIECES ────────────────

DROP POLICY IF EXISTS "pieces_select_agency"  ON pieces;
DROP POLICY IF EXISTS "pieces_insert_agency"  ON pieces;
DROP POLICY IF EXISTS "pieces_update_agency"  ON pieces;
DROP POLICY IF EXISTS "pieces_delete_admin"   ON pieces;

CREATE POLICY "pieces_select_agency"
ON pieces FOR SELECT
USING (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id = auth_agency_id()
  )
  OR
  account_id IN (
    SELECT account_id FROM account_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "pieces_insert_agency"
ON pieces FOR INSERT
WITH CHECK (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id = auth_agency_id()
  )
  AND auth_role() IN ('admin_agency', 'team_member')
);

CREATE POLICY "pieces_update_agency"
ON pieces FOR UPDATE
USING (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id = auth_agency_id()
  )
  AND auth_role() IN ('admin_agency', 'team_member')
);

CREATE POLICY "pieces_delete_admin"
ON pieces FOR DELETE
USING (auth_role() = 'admin_agency');

-- ─── Reemplazar policies recursivas en ACCOUNT_MEMBERS ───────

DROP POLICY IF EXISTS "account_members_insert_admin" ON account_members;
DROP POLICY IF EXISTS "account_members_delete_admin" ON account_members;

CREATE POLICY "account_members_insert_admin"
ON account_members FOR INSERT
WITH CHECK (auth_role() = 'admin_agency');

CREATE POLICY "account_members_delete_admin"
ON account_members FOR DELETE
USING (auth_role() = 'admin_agency');

-- ─── Reemplazar policies recursivas en ACCOUNT_CLIENTS ───────

DROP POLICY IF EXISTS "account_clients_insert_admin" ON account_clients;

CREATE POLICY "account_clients_insert_admin"
ON account_clients FOR INSERT
WITH CHECK (auth_role() = 'admin_agency');

-- ─── Reemplazar policies recursivas en PIECE_FILES ───────────

DROP POLICY IF EXISTS "piece_files_insert_agency" ON piece_files;
DROP POLICY IF EXISTS "piece_files_delete_agency" ON piece_files;

CREATE POLICY "piece_files_insert_agency"
ON piece_files FOR INSERT
WITH CHECK (
  auth_role() IN ('admin_agency', 'team_member')
  AND piece_id IN (
    SELECT p.id FROM pieces p
    JOIN accounts a ON p.account_id = a.id
    WHERE a.agency_id = auth_agency_id()
  )
);

CREATE POLICY "piece_files_delete_agency"
ON piece_files FOR DELETE
USING (
  auth_role() IN ('admin_agency', 'team_member')
  AND piece_id IN (
    SELECT p.id FROM pieces p
    JOIN accounts a ON p.account_id = a.id
    WHERE a.agency_id = auth_agency_id()
  )
);

-- ─── Agencies ─────────────────────────────────────────────────

DROP POLICY IF EXISTS "agencies_select_own" ON agencies;

CREATE POLICY "agencies_select_own"
ON agencies FOR SELECT
USING (id = auth_agency_id());
