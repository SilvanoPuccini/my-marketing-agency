-- Explicit GRANTs for all public tables.
-- Required after Supabase stops auto-exposing public tables (Oct 30, 2026).
-- Each table gets only the operations it actually needs per role.

-- ═══════════════════════════════════════════════════════════════
-- agencies: authenticated reads + admin updates
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, UPDATE ON public.agencies TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agencies TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- users: authenticated reads own + updates own profile
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- accounts: authenticated CRUD
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounts TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- account_members: authenticated reads + inserts
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, INSERT, DELETE ON public.account_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.account_members TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- account_clients: authenticated reads + inserts
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, INSERT, DELETE ON public.account_clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.account_clients TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- pieces: authenticated full CRUD
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pieces TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pieces TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- piece_files: authenticated insert + read + delete
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, INSERT, DELETE ON public.piece_files TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.piece_files TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- comments: authenticated insert + read
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, INSERT ON public.comments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- invoices: authenticated read + insert + update
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT, INSERT, UPDATE ON public.invoices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO service_role;

-- ═══════════════════════════════════════════════════════════════
-- client_piece_quota: authenticated read only (writes via SECURITY DEFINER)
-- ═══════════════════════════════════════════════════════════════
GRANT SELECT ON public.client_piece_quota TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_piece_quota TO service_role;
