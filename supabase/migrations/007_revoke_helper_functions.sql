-- =============================================================
-- 007_revoke_helper_functions.sql
-- Revocar acceso REST a funciones helper de RLS
-- Son internas — no deben ser llamadas via /rest/v1/rpc/
-- =============================================================

REVOKE EXECUTE ON FUNCTION public.auth_agency_id() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.auth_role()      FROM anon, authenticated;
