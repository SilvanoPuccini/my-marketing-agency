-- =============================================================
-- 014_invoices_table.sql
-- Tabla de facturas por agencia con RLS.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.invoices (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id    uuid        NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  number       text        NOT NULL,
  period       text        NOT NULL,
  emision_date date        NOT NULL,
  concept      text        NOT NULL,
  subtotal     integer     NOT NULL,  -- en centavos ARS
  iva          integer     NOT NULL,  -- en centavos ARS
  total        integer     NOT NULL,  -- en centavos ARS
  status       text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ─── RLS ─────────────────────────────────────────────────────
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "invoices_select_agency"
ON public.invoices FOR SELECT
USING (
  agency_id = (SELECT agency_id FROM public.users WHERE id = auth.uid())
);

-- ─── Seed data ───────────────────────────────────────────────
-- Uses the first agency found in the agencies table.
DO $$
DECLARE
  v_agency_id uuid;
BEGIN
  SELECT id INTO v_agency_id FROM public.agencies LIMIT 1;
  IF v_agency_id IS NULL THEN
    RAISE NOTICE 'No agency found — skipping invoice seed.';
    RETURN;
  END IF;

  INSERT INTO public.invoices (agency_id, number, period, emision_date, concept, subtotal, iva, total, status) VALUES
    (v_agency_id, 'FC-A-0014', 'ABR 2026', '2026-05-01', 'Plan Estudio · mensual', 8400000, 1764000, 10164000, 'pending'),
    (v_agency_id, 'FC-A-0013', 'MAR 2026', '2026-04-01', 'Plan Estudio · mensual', 8400000, 1764000, 10164000, 'paid'),
    (v_agency_id, 'FC-A-0012', 'FEB 2026', '2026-03-01', 'Plan Estudio · mensual', 8400000, 1764000, 10164000, 'paid'),
    (v_agency_id, 'FC-A-0011', 'ENE 2026', '2026-02-01', 'Plan Estudio · mensual', 7200000, 1512000, 8712000,  'paid'),
    (v_agency_id, 'FC-A-0010', 'DIC 2025', '2026-01-01', 'Plan Estudio · mensual', 7200000, 1512000, 8712000,  'paid'),
    (v_agency_id, 'FC-A-0009', 'NOV 2025', '2025-12-01', 'Plan Estudio · mensual', 7200000, 1512000, 8712000,  'paid'),
    (v_agency_id, 'FC-A-0008', 'OCT 2025', '2025-11-01', 'Plan Estudio · mensual', 7200000, 1512000, 8712000,  'paid')
  ON CONFLICT DO NOTHING;
END $$;
