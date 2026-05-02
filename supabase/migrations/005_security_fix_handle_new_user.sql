-- =============================================================
-- 005_security_fix_handle_new_user.sql
-- Revoca EXECUTE de PUBLIC (anon + authenticated)
-- El trigger puede llamarla igual porque corre como owner.
-- =============================================================
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
