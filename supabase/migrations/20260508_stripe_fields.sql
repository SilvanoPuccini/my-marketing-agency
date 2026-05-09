-- ============================================================================
-- Agregar campos de Stripe a agencies para el billing
-- ============================================================================

alter table public.agencies
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;
