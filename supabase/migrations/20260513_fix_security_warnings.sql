-- Fix Supabase security linter warnings
-- 1. Remove broad SELECT policy on public bucket (app uses getPublicUrl, not list)
-- 2. Revoke EXECUTE from anon on all SECURITY DEFINER functions
-- 3. Add RLS policy to client_piece_quota

-- ═══════════════════════════════════════════════════════════════
-- 1. STORAGE: drop broad SELECT policy on public bucket
-- ═══════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "piece_files_read" ON storage.objects;

-- ═══════════════════════════════════════════════════════════════
-- 2. SECURITY DEFINER: revoke anon access
--    Trigger functions don't need EXECUTE from anyone (called by trigger system).
--    RLS helpers + business functions only need authenticated.
-- ═══════════════════════════════════════════════════════════════

-- Revoke from PUBLIC (which includes anon) on ALL security definer functions
-- Then grant back only to authenticated where needed.

-- Trigger functions: no one should call these via RPC
REVOKE EXECUTE ON FUNCTION public.enforce_account_limit()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_portal_client_limit()    FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_user_limit()             FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_piece_quota_check()      FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_storage_check()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_storage_release()        FROM PUBLIC, anon, authenticated;

-- RLS helper functions: only authenticated
REVOKE EXECUTE ON FUNCTION public.auth_account_ids()       FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.auth_agency_id()         FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.auth_role()              FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_agency_id()     FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.auth_account_ids()       TO authenticated;
GRANT  EXECUTE ON FUNCTION public.auth_agency_id()         TO authenticated;
GRANT  EXECUTE ON FUNCTION public.auth_role()              TO authenticated;
GRANT  EXECUTE ON FUNCTION public.get_user_agency_id()     TO authenticated;

-- Business logic functions: only authenticated
REVOKE EXECUTE ON FUNCTION public.check_and_increment_piece_quota(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_client_piece_limit(UUID)          FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_account_storage_limit_kb(UUID)    FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.check_and_increment_piece_quota(UUID) TO authenticated;
GRANT  EXECUTE ON FUNCTION public.get_client_piece_limit(UUID)          TO authenticated;
GRANT  EXECUTE ON FUNCTION public.get_account_storage_limit_kb(UUID)    TO authenticated;

-- ═══════════════════════════════════════════════════════════════
-- 3. RLS: add policy to client_piece_quota
--    This table is managed by SECURITY DEFINER functions only,
--    but users should be able to read their own quota.
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "users_read_own_quota"
  ON public.client_piece_quota
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
