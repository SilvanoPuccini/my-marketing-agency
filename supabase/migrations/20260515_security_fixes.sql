-- ============================================================================
-- SECURITY FIXES: Accounts + Client Portal audit
-- 1. pieces_update_client: restrict destination status via WITH CHECK
-- 2. users_select: clients can only see their own record
-- 3. handle_new_user: don't overwrite existing user's agency
-- ============================================================================

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. pieces_update_client — client can only set approved or rejected
-- ═══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "pieces_update_client" ON public.pieces;

CREATE POLICY "pieces_update_client"
  ON public.pieces FOR UPDATE
  USING (
    public.auth_role() = 'client'
    AND account_id IN (SELECT public.auth_client_account_ids())
    AND status IN ('sent_client', 'approved', 'rejected')
  )
  WITH CHECK (
    public.auth_role() = 'client'
    AND status IN ('approved', 'rejected')
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. users_select — split into role-based policies
--    admin/manager/creator/team_member see all agency users
--    client sees only self
-- ═══════════════════════════════════════════════════════════════════════════════

DROP POLICY IF EXISTS "users_select" ON public.users;

CREATE POLICY "users_select_staff"
  ON public.users FOR SELECT
  USING (
    agency_id = public.get_user_agency_id()
    AND public.auth_role() IN ('admin_agency', 'manager', 'creator', 'team_member')
  );

CREATE POLICY "users_select_client"
  ON public.users FOR SELECT
  USING (
    public.auth_role() = 'client'
    AND id = auth.uid()
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. handle_new_user — don't overwrite if user already exists in another agency
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
  _existing_agency UUID;
BEGIN
  _full_name := coalesce(NEW.raw_user_meta_data ->> 'full_name', 'Sin nombre');

  -- Check if user already exists in users table
  SELECT agency_id INTO _existing_agency
  FROM public.users
  WHERE id = NEW.id;

  IF NEW.raw_user_meta_data ->> 'agency_id' IS NOT NULL THEN
    -- Invitation flow: join existing agency
    _agency_id := (NEW.raw_user_meta_data ->> 'agency_id')::UUID;
    _role := coalesce(NEW.raw_user_meta_data ->> 'role', 'team_member');

    IF _role NOT IN ('admin_agency', 'manager', 'creator', 'team_member', 'client') THEN
      _role := 'team_member';
    END IF;

    -- If user already belongs to a DIFFERENT agency, don't overwrite
    IF _existing_agency IS NOT NULL AND _existing_agency != _agency_id THEN
      RAISE EXCEPTION 'El usuario ya pertenece a otra agencia';
    END IF;
  ELSE
    -- Self-registration flow: create new agency
    -- If user already exists, skip (don't create duplicate agency)
    IF _existing_agency IS NOT NULL THEN
      RETURN NEW;
    END IF;

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
    full_name = excluded.full_name,
    role      = excluded.role;

  RETURN NEW;
END;
$$;
