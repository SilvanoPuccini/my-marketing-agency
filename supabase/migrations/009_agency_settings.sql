-- =============================================================
-- 009_agency_settings.sql
-- Add settings JSONB column to agencies for flexible config
-- =============================================================

ALTER TABLE agencies
  ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{}';
