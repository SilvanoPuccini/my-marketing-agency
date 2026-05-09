-- ============================================================================
-- Cleanup: remove duplicate RLS policies from old migrations
-- The new policies (20260508_rls_policies.sql) use get_user_agency_id().
-- The old ones (002, 006, 010, 012) used auth_agency_id() and caused 500s.
-- ============================================================================

-- accounts
DROP POLICY IF EXISTS "accounts_delete_admin" ON accounts;
DROP POLICY IF EXISTS "accounts_insert_staff" ON accounts;
DROP POLICY IF EXISTS "accounts_select_admin" ON accounts;
DROP POLICY IF EXISTS "accounts_select_client" ON accounts;
DROP POLICY IF EXISTS "accounts_select_member" ON accounts;
DROP POLICY IF EXISTS "accounts_update_admin" ON accounts;

-- users
DROP POLICY IF EXISTS "users_insert_admin" ON users;
DROP POLICY IF EXISTS "users_select_agency_admin" ON users;
DROP POLICY IF EXISTS "users_select_agency_member" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_admin" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;

-- pieces
DROP POLICY IF EXISTS "pieces_delete_admin" ON pieces;
DROP POLICY IF EXISTS "pieces_insert_agency" ON pieces;
DROP POLICY IF EXISTS "pieces_select_agency" ON pieces;
DROP POLICY IF EXISTS "pieces_select_client" ON pieces;
DROP POLICY IF EXISTS "pieces_update_agency" ON pieces;
DROP POLICY IF EXISTS "pieces_update_client" ON pieces;

-- account_clients
DROP POLICY IF EXISTS "account_clients_insert_admin" ON account_clients;
DROP POLICY IF EXISTS "account_clients_select" ON account_clients;

-- account_members
DROP POLICY IF EXISTS "account_members_delete_admin" ON account_members;
DROP POLICY IF EXISTS "account_members_insert_admin" ON account_members;
DROP POLICY IF EXISTS "account_members_select" ON account_members;

-- comments
DROP POLICY IF EXISTS "comments_insert" ON comments;
DROP POLICY IF EXISTS "comments_select" ON comments;

-- piece_files
DROP POLICY IF EXISTS "piece_files_delete_agency" ON piece_files;
DROP POLICY IF EXISTS "piece_files_insert_agency" ON piece_files;
DROP POLICY IF EXISTS "piece_files_select" ON piece_files;
DROP POLICY IF EXISTS "piece_files_select_agency" ON piece_files;
