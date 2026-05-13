-- ============================================================================
-- TEAM RESTRUCTURE: Phase 1
-- 1. Fix CHECK constraint to allow manager/creator roles
-- 2. Add helper functions for scoped access
-- 3. Rewrite handle_new_user trigger for proper invitation support
-- 4. Rewrite ALL RLS policies with role-based filtering
-- 5. Grant DELETE on users + enforce_user_limit consistency
-- ============================================================================

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. CHECK CONSTRAINT: allow all 5 roles
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check
  CHECK (role IN ('admin_agency', 'manager', 'creator', 'team_member', 'client'));

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. HELPER FUNCTIONS for scoped access
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.auth_member_account_ids()
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT account_id FROM public.account_members WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.auth_client_account_ids()
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT account_id FROM public.account_clients WHERE user_id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.auth_member_account_ids() FROM anon;
REVOKE ALL ON FUNCTION public.auth_client_account_ids() FROM anon;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. REWRITE handle_new_user trigger
--    - Self-registration: creates agency + admin_agency (unchanged)
--    - Invitation: uses agency_id from metadata, accepts all 5 roles
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _agency_id UUID;
  _full_name TEXT;
  _role TEXT;
  _agency_name TEXT;
  _plan TEXT;
BEGIN
  _full_name := coalesce(NEW.raw_user_meta_data ->> 'full_name', 'Sin nombre');

  IF NEW.raw_user_meta_data ->> 'agency_id' IS NOT NULL THEN
    -- Invitation flow: join existing agency
    _agency_id := (NEW.raw_user_meta_data ->> 'agency_id')::UUID;
    _role := coalesce(NEW.raw_user_meta_data ->> 'role', 'team_member');

    IF _role NOT IN ('admin_agency', 'manager', 'creator', 'team_member', 'client') THEN
      _role := 'team_member';
    END IF;
  ELSE
    -- Self-registration flow: create new agency
    _agency_name := coalesce(NEW.raw_user_meta_data ->> 'agency_name', 'Mi agencia');
    _plan := coalesce(NEW.raw_user_meta_data ->> 'plan', 'solo');

    IF _plan NOT IN ('solo', 'estudio', 'casa') THEN
      _plan := 'solo';
    END IF;

    INSERT INTO public.agencies (name, plan)
    VALUES (_agency_name, _plan)
    RETURNING id INTO _agency_id;

    _role := 'admin_agency';
  END IF;

  INSERT INTO public.users (id, agency_id, email, full_name, role, is_active)
  VALUES (NEW.id, _agency_id, NEW.email, _full_name, _role, TRUE)
  ON CONFLICT (id) DO UPDATE SET
    agency_id = excluded.agency_id,
    full_name = excluded.full_name,
    role      = excluded.role;

  RETURN NEW;
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. DROP ALL EXISTING RLS POLICIES (clean slate)
-- ═══════════════════════════════════════════════════════════════════════════════

-- agencies
DROP POLICY IF EXISTS "agencies: users see own agency" ON public.agencies;
DROP POLICY IF EXISTS "agencies: admins update own agency" ON public.agencies;
DROP POLICY IF EXISTS "agencies_update_admin" ON public.agencies;

-- users
DROP POLICY IF EXISTS "users: see own agency members" ON public.users;
DROP POLICY IF EXISTS "users: admins insert to own agency" ON public.users;
DROP POLICY IF EXISTS "users: admins update own agency members" ON public.users;

-- accounts
DROP POLICY IF EXISTS "accounts: see own agency" ON public.accounts;
DROP POLICY IF EXISTS "accounts: insert to own agency" ON public.accounts;
DROP POLICY IF EXISTS "accounts: update own agency" ON public.accounts;
DROP POLICY IF EXISTS "accounts: delete own agency" ON public.accounts;

-- account_members
DROP POLICY IF EXISTS "account_members: see own agency" ON public.account_members;
DROP POLICY IF EXISTS "account_members: insert own agency" ON public.account_members;
DROP POLICY IF EXISTS "account_members: delete own agency" ON public.account_members;

-- account_clients
DROP POLICY IF EXISTS "account_clients: see own agency" ON public.account_clients;
DROP POLICY IF EXISTS "account_clients: insert own agency" ON public.account_clients;
DROP POLICY IF EXISTS "account_clients: delete own agency" ON public.account_clients;

-- pieces
DROP POLICY IF EXISTS "pieces: see own agency" ON public.pieces;
DROP POLICY IF EXISTS "pieces: insert own agency" ON public.pieces;
DROP POLICY IF EXISTS "pieces: update own agency" ON public.pieces;
DROP POLICY IF EXISTS "pieces: delete own agency" ON public.pieces;

-- piece_files
DROP POLICY IF EXISTS "piece_files: see own agency" ON public.piece_files;
DROP POLICY IF EXISTS "piece_files: insert own agency" ON public.piece_files;
DROP POLICY IF EXISTS "piece_files: delete own agency" ON public.piece_files;

-- comments
DROP POLICY IF EXISTS "comments: see own agency" ON public.comments;
DROP POLICY IF EXISTS "comments: insert own agency" ON public.comments;
DROP POLICY IF EXISTS "comments: delete own comments" ON public.comments;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. NEW RLS POLICIES — role-based access control
--
-- Roles:
--   admin_agency  → full CRUD on all agency data
--   manager       → CRUD pieces for assigned accounts, see team
--   creator       → CRUD own pieces for assigned accounts
--   team_member   → read assigned accounts, CRUD pieces for assigned accounts
--   client        → portal only: see/approve/reject pieces sent to them
-- ═══════════════════════════════════════════════════════════════════════════════

-- ── agencies ────────────────────────────────────────────────────────────────

CREATE POLICY "agencies_select"
  ON public.agencies FOR SELECT
  USING (id = public.get_user_agency_id());

CREATE POLICY "agencies_update"
  ON public.agencies FOR UPDATE
  USING (
    id = public.get_user_agency_id()
    AND public.auth_role() = 'admin_agency'
  );

-- ── users ───────────────────────────────────────────────────────────────────

CREATE POLICY "users_select"
  ON public.users FOR SELECT
  USING (agency_id = public.get_user_agency_id());

CREATE POLICY "users_insert"
  ON public.users FOR INSERT
  WITH CHECK (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "users_update_admin"
  ON public.users FOR UPDATE
  USING (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "users_update_self"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- ── accounts ────────────────────────────────────────────────────────────────

CREATE POLICY "accounts_select_admin"
  ON public.accounts FOR SELECT
  USING (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "accounts_select_member"
  ON public.accounts FOR SELECT
  USING (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() IN ('manager', 'creator', 'team_member')
    AND id IN (SELECT public.auth_member_account_ids())
  );

CREATE POLICY "accounts_select_client"
  ON public.accounts FOR SELECT
  USING (
    public.auth_role() = 'client'
    AND id IN (SELECT public.auth_client_account_ids())
  );

CREATE POLICY "accounts_insert"
  ON public.accounts FOR INSERT
  WITH CHECK (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "accounts_update"
  ON public.accounts FOR UPDATE
  USING (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "accounts_delete"
  ON public.accounts FOR DELETE
  USING (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() = 'admin_agency'
  );

-- ── account_members ─────────────────────────────────────────────────────────

CREATE POLICY "account_members_select_admin"
  ON public.account_members FOR SELECT
  USING (
    account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "account_members_select_self"
  ON public.account_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "account_members_insert"
  ON public.account_members FOR INSERT
  WITH CHECK (
    account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "account_members_delete"
  ON public.account_members FOR DELETE
  USING (
    account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
    AND public.auth_role() = 'admin_agency'
  );

-- ── account_clients ─────────────────────────────────────────────────────────

CREATE POLICY "account_clients_select_admin"
  ON public.account_clients FOR SELECT
  USING (
    account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "account_clients_select_self"
  ON public.account_clients FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "account_clients_select_member"
  ON public.account_clients FOR SELECT
  USING (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND account_id IN (SELECT public.auth_member_account_ids())
  );

CREATE POLICY "account_clients_insert"
  ON public.account_clients FOR INSERT
  WITH CHECK (
    account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
    AND public.auth_role() = 'admin_agency'
  );

CREATE POLICY "account_clients_delete"
  ON public.account_clients FOR DELETE
  USING (
    account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
    AND public.auth_role() = 'admin_agency'
  );

-- ── pieces ──────────────────────────────────────────────────────────────────

CREATE POLICY "pieces_select_admin"
  ON public.pieces FOR SELECT
  USING (
    public.auth_role() = 'admin_agency'
    AND account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
  );

CREATE POLICY "pieces_select_member"
  ON public.pieces FOR SELECT
  USING (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND account_id IN (SELECT public.auth_member_account_ids())
  );

CREATE POLICY "pieces_select_client"
  ON public.pieces FOR SELECT
  USING (
    public.auth_role() = 'client'
    AND account_id IN (SELECT public.auth_client_account_ids())
    AND status IN ('sent_client', 'approved', 'rejected', 'published')
  );

CREATE POLICY "pieces_insert_admin"
  ON public.pieces FOR INSERT
  WITH CHECK (
    public.auth_role() = 'admin_agency'
    AND account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
  );

CREATE POLICY "pieces_insert_member"
  ON public.pieces FOR INSERT
  WITH CHECK (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND account_id IN (SELECT public.auth_member_account_ids())
    AND author_id = auth.uid()
  );

CREATE POLICY "pieces_update_admin"
  ON public.pieces FOR UPDATE
  USING (
    public.auth_role() = 'admin_agency'
    AND account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
  );

CREATE POLICY "pieces_update_member"
  ON public.pieces FOR UPDATE
  USING (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND author_id = auth.uid()
  );

CREATE POLICY "pieces_update_client"
  ON public.pieces FOR UPDATE
  USING (
    public.auth_role() = 'client'
    AND account_id IN (SELECT public.auth_client_account_ids())
    AND status IN ('sent_client', 'approved', 'rejected')
  );

CREATE POLICY "pieces_delete"
  ON public.pieces FOR DELETE
  USING (
    public.auth_role() = 'admin_agency'
    AND account_id IN (SELECT id FROM public.accounts WHERE agency_id = public.get_user_agency_id())
  );

-- ── piece_files ─────────────────────────────────────────────────────────────

CREATE POLICY "piece_files_select_admin"
  ON public.piece_files FOR SELECT
  USING (
    public.auth_role() = 'admin_agency'
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      JOIN public.accounts a ON a.id = p.account_id
      WHERE a.agency_id = public.get_user_agency_id()
    )
  );

CREATE POLICY "piece_files_select_member"
  ON public.piece_files FOR SELECT
  USING (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      WHERE p.account_id IN (SELECT public.auth_member_account_ids())
    )
  );

CREATE POLICY "piece_files_select_client"
  ON public.piece_files FOR SELECT
  USING (
    public.auth_role() = 'client'
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      WHERE p.account_id IN (SELECT public.auth_client_account_ids())
        AND p.status IN ('sent_client', 'approved', 'rejected', 'published')
    )
  );

CREATE POLICY "piece_files_insert_admin"
  ON public.piece_files FOR INSERT
  WITH CHECK (
    public.auth_role() = 'admin_agency'
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      JOIN public.accounts a ON a.id = p.account_id
      WHERE a.agency_id = public.get_user_agency_id()
    )
  );

CREATE POLICY "piece_files_insert_member"
  ON public.piece_files FOR INSERT
  WITH CHECK (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      WHERE p.account_id IN (SELECT public.auth_member_account_ids())
        AND p.author_id = auth.uid()
    )
  );

CREATE POLICY "piece_files_delete_admin"
  ON public.piece_files FOR DELETE
  USING (
    public.auth_role() = 'admin_agency'
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      JOIN public.accounts a ON a.id = p.account_id
      WHERE a.agency_id = public.get_user_agency_id()
    )
  );

CREATE POLICY "piece_files_delete_member"
  ON public.piece_files FOR DELETE
  USING (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      WHERE p.author_id = auth.uid()
    )
  );

-- ── comments ────────────────────────────────────────────────────────────────

CREATE POLICY "comments_select_admin"
  ON public.comments FOR SELECT
  USING (
    public.auth_role() = 'admin_agency'
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      JOIN public.accounts a ON a.id = p.account_id
      WHERE a.agency_id = public.get_user_agency_id()
    )
  );

CREATE POLICY "comments_select_member"
  ON public.comments FOR SELECT
  USING (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      WHERE p.account_id IN (SELECT public.auth_member_account_ids())
    )
  );

CREATE POLICY "comments_select_client"
  ON public.comments FOR SELECT
  USING (
    public.auth_role() = 'client'
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      WHERE p.account_id IN (SELECT public.auth_client_account_ids())
        AND p.status IN ('sent_client', 'approved', 'rejected', 'published')
    )
  );

CREATE POLICY "comments_insert_admin"
  ON public.comments FOR INSERT
  WITH CHECK (
    public.auth_role() = 'admin_agency'
    AND author_id = auth.uid()
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      JOIN public.accounts a ON a.id = p.account_id
      WHERE a.agency_id = public.get_user_agency_id()
    )
  );

CREATE POLICY "comments_insert_member"
  ON public.comments FOR INSERT
  WITH CHECK (
    public.auth_role() IN ('manager', 'creator', 'team_member')
    AND author_id = auth.uid()
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      WHERE p.account_id IN (SELECT public.auth_member_account_ids())
    )
  );

CREATE POLICY "comments_insert_client"
  ON public.comments FOR INSERT
  WITH CHECK (
    public.auth_role() = 'client'
    AND author_id = auth.uid()
    AND piece_id IN (
      SELECT p.id FROM public.pieces p
      WHERE p.account_id IN (SELECT public.auth_client_account_ids())
        AND p.status IN ('sent_client', 'approved', 'rejected')
    )
  );

CREATE POLICY "comments_delete_own"
  ON public.comments FOR DELETE
  USING (author_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. GRANT DELETE on users for admin member removal
-- ═══════════════════════════════════════════════════════════════════════════════
GRANT DELETE ON public.users TO authenticated;

CREATE POLICY "users_delete_admin"
  ON public.users FOR DELETE
  USING (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() = 'admin_agency'
    AND id != auth.uid()
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. enforce_user_limit consistency (same as 20260512, re-stated for clarity)
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.enforce_user_limit()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _plan TEXT;
  _limit INT;
  _current INT;
BEGIN
  IF NEW.role = 'client' THEN
    RETURN NEW;
  END IF;

  SELECT plan INTO _plan
  FROM public.agencies
  WHERE id = NEW.agency_id;

  _limit := CASE _plan
    WHEN 'solo' THEN 2
    WHEN 'estudio' THEN 5
    WHEN 'casa' THEN 15
    ELSE 2
  END;

  SELECT count(*) INTO _current
  FROM public.users
  WHERE agency_id = NEW.agency_id
    AND role IN ('admin_agency', 'manager', 'creator', 'team_member');

  IF _current >= _limit THEN
    RAISE EXCEPTION 'Limite de asientos de equipo alcanzado (%). Plan: %. Maximo: %',
      _current, _plan, _limit;
  END IF;

  RETURN NEW;
END;
$$;
