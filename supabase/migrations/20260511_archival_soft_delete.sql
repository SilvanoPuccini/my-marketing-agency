-- Archival: soft delete with archived_at column
-- No table espejo. Portal/dashboard queries filter WHERE archived_at IS NULL.
-- Archival days: solo=60, estudio=90, casa=180

ALTER TABLE public.pieces
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_pieces_archived ON public.pieces(archived_at)
  WHERE archived_at IS NULL;
