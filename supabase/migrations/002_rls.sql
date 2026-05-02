-- =============================================================
-- 002_rls.sql — Row Level Security
-- My Marketing Agency
-- =============================================================

-- ─── Habilitar RLS en todas las tablas ───────────────────────
ALTER TABLE agencies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE pieces         ENABLE ROW LEVEL SECURITY;
ALTER TABLE piece_files    ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments       ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- AGENCIES
-- =============================================================

-- Cualquier usuario autenticado puede ver la agencia a la que pertenece
CREATE POLICY "agencies_select_own"
ON agencies FOR SELECT
USING (
  id IN (SELECT agency_id FROM users WHERE id = auth.uid())
);

-- =============================================================
-- USERS
-- =============================================================

-- Cada usuario ve su propio perfil
CREATE POLICY "users_select_own"
ON users FOR SELECT
USING (auth.uid() = id);

-- Admin ve todos los usuarios de su agencia
CREATE POLICY "users_select_agency_admin"
ON users FOR SELECT
USING (
  agency_id IN (
    SELECT agency_id FROM users
    WHERE id = auth.uid() AND role = 'admin_agency'
  )
);

-- Miembros del equipo ven a sus compañeros de agencia
CREATE POLICY "users_select_agency_member"
ON users FOR SELECT
USING (
  agency_id IN (
    SELECT agency_id FROM users
    WHERE id = auth.uid() AND role = 'team_member'
  )
);

-- Solo admin puede crear usuarios
CREATE POLICY "users_insert_admin"
ON users FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin_agency'
  )
);

-- Admin puede actualizar usuarios de su agencia
CREATE POLICY "users_update_admin"
ON users FOR UPDATE
USING (
  agency_id IN (
    SELECT agency_id FROM users
    WHERE id = auth.uid() AND role = 'admin_agency'
  )
);

-- Cada usuario puede actualizar su propio perfil
CREATE POLICY "users_update_own"
ON users FOR UPDATE
USING (auth.uid() = id);

-- =============================================================
-- ACCOUNTS
-- =============================================================

-- Admin ve todas las cuentas de su agencia
CREATE POLICY "accounts_select_admin"
ON accounts FOR SELECT
USING (
  agency_id IN (
    SELECT agency_id FROM users
    WHERE id = auth.uid() AND role = 'admin_agency'
  )
);

-- Miembro ve solo las cuentas asignadas
CREATE POLICY "accounts_select_member"
ON accounts FOR SELECT
USING (
  id IN (
    SELECT account_id FROM account_members WHERE user_id = auth.uid()
  )
);

-- Cliente ve solo su cuenta
CREATE POLICY "accounts_select_client"
ON accounts FOR SELECT
USING (
  id IN (
    SELECT account_id FROM account_clients WHERE user_id = auth.uid()
  )
);

-- Solo admin puede crear, editar y eliminar cuentas
CREATE POLICY "accounts_insert_admin"
ON accounts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin_agency'
  )
);

CREATE POLICY "accounts_update_admin"
ON accounts FOR UPDATE
USING (
  agency_id IN (
    SELECT agency_id FROM users
    WHERE id = auth.uid() AND role = 'admin_agency'
  )
);

CREATE POLICY "accounts_delete_admin"
ON accounts FOR DELETE
USING (
  agency_id IN (
    SELECT agency_id FROM users
    WHERE id = auth.uid() AND role = 'admin_agency'
  )
);

-- =============================================================
-- ACCOUNT_MEMBERS y ACCOUNT_CLIENTS
-- =============================================================

-- Solo admin gestiona asignaciones
CREATE POLICY "account_members_select"
ON account_members FOR SELECT
USING (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  )
);

CREATE POLICY "account_members_insert_admin"
ON account_members FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin_agency')
);

CREATE POLICY "account_members_delete_admin"
ON account_members FOR DELETE
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin_agency')
);

CREATE POLICY "account_clients_select"
ON account_clients FOR SELECT
USING (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
    )
  )
  OR user_id = auth.uid()
);

CREATE POLICY "account_clients_insert_admin"
ON account_clients FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin_agency')
);

-- =============================================================
-- PIECES
-- =============================================================

-- Admin y miembro asignado ven todas las piezas de sus cuentas
CREATE POLICY "pieces_select_agency"
ON pieces FOR SELECT
USING (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
        AND role IN ('admin_agency', 'team_member')
    )
  )
  OR
  account_id IN (
    SELECT account_id FROM account_members WHERE user_id = auth.uid()
  )
);

-- Cliente solo ve piezas enviadas, aprobadas, rechazadas o publicadas de su cuenta
CREATE POLICY "pieces_select_client"
ON pieces FOR SELECT
USING (
  account_id IN (
    SELECT account_id FROM account_clients WHERE user_id = auth.uid()
  )
  AND status IN ('sent_client', 'approved', 'rejected', 'published')
);

-- Admin y miembro asignado pueden crear piezas
CREATE POLICY "pieces_insert_agency"
ON pieces FOR INSERT
WITH CHECK (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
        AND role IN ('admin_agency', 'team_member')
    )
  )
);

-- Admin y miembro pueden editar piezas (control de estado en app)
CREATE POLICY "pieces_update_agency"
ON pieces FOR UPDATE
USING (
  account_id IN (
    SELECT id FROM accounts WHERE agency_id IN (
      SELECT agency_id FROM users WHERE id = auth.uid()
        AND role IN ('admin_agency', 'team_member')
    )
  )
);

-- Cliente solo puede aprobar o rechazar piezas en estado sent_client
CREATE POLICY "pieces_update_client"
ON pieces FOR UPDATE
USING (
  account_id IN (
    SELECT account_id FROM account_clients WHERE user_id = auth.uid()
  )
  AND status = 'sent_client'
)
WITH CHECK (
  status IN ('approved', 'rejected')
);

-- Solo admin puede eliminar piezas
CREATE POLICY "pieces_delete_admin"
ON pieces FOR DELETE
USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin_agency')
);

-- =============================================================
-- PIECE_FILES
-- =============================================================

CREATE POLICY "piece_files_select"
ON piece_files FOR SELECT
USING (
  piece_id IN (SELECT id FROM pieces)
);

CREATE POLICY "piece_files_insert_agency"
ON piece_files FOR INSERT
WITH CHECK (
  piece_id IN (
    SELECT p.id FROM pieces p
    JOIN accounts a ON p.account_id = a.id
    JOIN users u ON u.agency_id = a.agency_id
    WHERE u.id = auth.uid() AND u.role IN ('admin_agency', 'team_member')
  )
);

CREATE POLICY "piece_files_delete_agency"
ON piece_files FOR DELETE
USING (
  piece_id IN (
    SELECT p.id FROM pieces p
    JOIN accounts a ON p.account_id = a.id
    JOIN users u ON u.agency_id = a.agency_id
    WHERE u.id = auth.uid() AND u.role IN ('admin_agency', 'team_member')
  )
);

-- =============================================================
-- COMMENTS
-- =============================================================

-- Agencia ve todos los comentarios de sus piezas
-- Cliente ve comentarios de piezas de su cuenta
CREATE POLICY "comments_select"
ON comments FOR SELECT
USING (
  piece_id IN (SELECT id FROM pieces)
);

-- Cualquier usuario autenticado puede comentar en piezas que puede ver
CREATE POLICY "comments_insert"
ON comments FOR INSERT
WITH CHECK (
  author_id = auth.uid()
  AND piece_id IN (SELECT id FROM pieces)
);
