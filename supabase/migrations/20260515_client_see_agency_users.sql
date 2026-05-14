-- Allow clients to see basic info of users in their agency.
-- Required for comment author names in the client portal.
-- Replaces the restrictive users_select_client that only allowed id = auth.uid().

DROP POLICY IF EXISTS "users_select_client" ON public.users;

CREATE POLICY "users_select_client"
  ON public.users FOR SELECT
  USING (
    public.auth_role() = 'client'
    AND agency_id = public.get_user_agency_id()
  );
