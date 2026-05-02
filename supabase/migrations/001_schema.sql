-- =============================================================
-- 001_schema.sql — Tablas, índices y trigger de updated_at
-- My Marketing Agency
-- =============================================================

-- ─── AGENCIES ────────────────────────────────────────────────
CREATE TABLE agencies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  plan       VARCHAR(20)  NOT NULL DEFAULT 'estudio'
               CHECK (plan IN ('solo', 'estudio', 'casa')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ─── USERS ───────────────────────────────────────────────────
-- id = mismo UUID que auth.users de Supabase Auth
CREATE TABLE users (
  id         UUID         PRIMARY KEY,
  agency_id  UUID         NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  email      VARCHAR(150) UNIQUE NOT NULL,
  full_name  VARCHAR(100) NOT NULL,
  position   VARCHAR(100),
  role       VARCHAR(20)  NOT NULL
               CHECK (role IN ('admin_agency', 'team_member', 'client')),
  avatar_url TEXT,
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_agency ON users(agency_id);
CREATE INDEX idx_users_role   ON users(role);

-- ─── ACCOUNTS ────────────────────────────────────────────────
CREATE TABLE accounts (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id      UUID         NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name           VARCHAR(100) NOT NULL,
  handle         VARCHAR(100),
  industry       VARCHAR(50),
  contact_name   VARCHAR(100),
  contact_email  VARCHAR(150),
  contact_phone  VARCHAR(30),
  plan           VARCHAR(50),
  monthly_budget NUMERIC(12, 2),
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_accounts_agency ON accounts(agency_id);

-- ─── ACCOUNT_MEMBERS (N:M equipo ↔ cuentas) ─────────────────
CREATE TABLE account_members (
  account_id  UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_id, user_id)
);

-- ─── ACCOUNT_CLIENTS (N:M clientes ↔ cuentas) ───────────────
CREATE TABLE account_clients (
  account_id UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  linked_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_id, user_id)
);

-- ─── PIECES ──────────────────────────────────────────────────
CREATE TABLE pieces (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       UUID         NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  author_id        UUID         NOT NULL REFERENCES users(id),
  title            VARCHAR(150) NOT NULL,
  type             VARCHAR(20)  NOT NULL
                     CHECK (type IN ('post', 'reel', 'story', 'ad', 'blog', 'carrusel')),
  copy             TEXT,
  platform         VARCHAR(50),
  scheduled_date   DATE         NOT NULL,
  scheduled_time   TIME,
  status           VARCHAR(20)  NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft', 'sent_client', 'approved', 'rejected', 'published')),
  rejection_reason TEXT,
  has_pauta        BOOLEAN      NOT NULL DEFAULT FALSE,
  pauta_amount     NUMERIC(12, 2),
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pieces_account   ON pieces(account_id);
CREATE INDEX idx_pieces_status    ON pieces(status);
CREATE INDEX idx_pieces_scheduled ON pieces(scheduled_date);
CREATE INDEX idx_pieces_author    ON pieces(author_id);

-- ─── PIECE_FILES ─────────────────────────────────────────────
CREATE TABLE piece_files (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  piece_id     UUID         NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  file_url     TEXT         NOT NULL,
  file_name    VARCHAR(255) NOT NULL,
  file_type    VARCHAR(50)  NOT NULL,
  file_size_kb INT          NOT NULL,
  uploaded_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_piece_files_piece ON piece_files(piece_id);

-- ─── COMMENTS ────────────────────────────────────────────────
CREATE TABLE comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  piece_id   UUID        NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  author_id  UUID        NOT NULL REFERENCES users(id),
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comments_piece ON comments(piece_id);

-- ─── TRIGGER: updated_at automático en pieces ────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pieces_updated_at
  BEFORE UPDATE ON pieces
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
