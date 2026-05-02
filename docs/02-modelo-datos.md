# Etapa 2 — Modelo de Datos

## 2.1 Tecnologia Elegida

PostgreSQL gestionado por Supabase — justificado por:
- Naturaleza relacional clara entre entidades
- Necesidad de integridad referencial estricta
- Soporte nativo de Row Level Security
- Funcionalidades Realtime sobre tablas

## 2.2 Entidades del Sistema

| # | Entidad | Proposito |
|---|---------|-----------|
| 1 | `users` | Usuarios del sistema con credenciales y rol |
| 2 | `agencies` | Datos de la agencia de marketing |
| 3 | `accounts` | Cuentas-cliente que la agencia gestiona |
| 4 | `account_members` | Asignacion de miembros del equipo a cuentas |
| 5 | `account_clients` | Vinculacion de usuarios cliente con su cuenta |
| 6 | `pieces` | Piezas de contenido (posts, reels, ads, etc.) |
| 7 | `piece_files` | Archivos adjuntos a cada pieza |
| 8 | `comments` | Comentarios sobre cada pieza |

## 2.3 Cardinalidades clave

| Relacion | Cardinalidad | Significado |
|----------|-------------|-------------|
| agencies -> users | 1 : N | Una agencia tiene muchos usuarios |
| agencies -> accounts | 1 : N | Una agencia gestiona muchas cuentas-cliente |
| accounts <-> users (miembros) | N : M | Un miembro trabaja en muchas cuentas |
| accounts <-> users (clientes) | N : M | Una cuenta puede tener varios contactos cliente |
| accounts -> pieces | 1 : N | Una cuenta tiene muchas piezas |
| pieces -> piece_files | 1 : N | Una pieza puede tener varios archivos adjuntos |
| pieces -> comments | 1 : N | Una pieza tiene muchos comentarios |
| users -> comments | 1 : N | Un usuario crea muchos comentarios |

## 2.4 Definicion Tecnica de Tablas (SQL — PostgreSQL)

```sql
-- Tabla agencies
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla users
CREATE TABLE users (
  id UUID PRIMARY KEY, -- mismo ID que auth.users de Supabase
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  email VARCHAR(150) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin_agency', 'team_member', 'client')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_agency ON users(agency_id);
CREATE INDEX idx_users_role ON users(role);

-- Tabla accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  industry VARCHAR(50),
  contact_name VARCHAR(100),
  contact_email VARCHAR(150),
  contact_phone VARCHAR(30),
  plan VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_accounts_agency ON accounts(agency_id);

-- Tabla account_members (N:M entre accounts y users del equipo)
CREATE TABLE account_members (
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_id, user_id)
);

-- Tabla account_clients (N:M entre accounts y usuarios cliente)
CREATE TABLE account_clients (
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_id, user_id)
);

-- Tabla pieces
CREATE TABLE pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(150) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('post', 'reel', 'story', 'ad', 'blog')),
  copy TEXT,
  scheduled_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent_client', 'approved', 'rejected', 'published')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pieces_account ON pieces(account_id);
CREATE INDEX idx_pieces_status ON pieces(status);
CREATE INDEX idx_pieces_scheduled ON pieces(scheduled_date);

-- Tabla piece_files
CREATE TABLE piece_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  piece_id UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size_kb INT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_piece_files_piece ON piece_files(piece_id);

-- Tabla comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  piece_id UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comments_piece ON comments(piece_id);
```

## 2.5 Decisiones Tecnicas Clave

| Decision | Justificacion |
|----------|---------------|
| UUID en lugar de SERIAL | Mayor seguridad, compatibilidad nativa con Supabase Auth |
| TIMESTAMPTZ | Soporte de zonas horarias |
| CHECK constraints en roles y estados | Integridad de datos a nivel base de datos |
| Soft delete (is_active) | Permite recuperar registros eliminados |
| ON DELETE CASCADE | Si se elimina una cuenta, se eliminan sus piezas y comentarios |
| Indices en FKs y campos de filtrado | Optimiza queries del calendario y dashboard |
| Tabla users separada de auth.users | Permite extender el modelo sin tocar el sistema de auth |

## 2.6 DBML para dbdiagram.io

```
Table agencies {
  id uuid [pk]
  name varchar(100) [not null]
  created_at timestamptz [not null]
}

Table users {
  id uuid [pk]
  agency_id uuid [ref: > agencies.id, not null]
  email varchar(150) [unique, not null]
  full_name varchar(100) [not null]
  role varchar(20) [not null]
  avatar_url text
  is_active boolean [not null]
  created_at timestamptz [not null]
}

Table accounts {
  id uuid [pk]
  agency_id uuid [ref: > agencies.id, not null]
  name varchar(100) [not null]
  industry varchar(50)
  contact_name varchar(100)
  contact_email varchar(150)
  contact_phone varchar(30)
  plan varchar(50)
  is_active boolean [not null]
  created_at timestamptz [not null]
}

Table account_members {
  account_id uuid [ref: > accounts.id]
  user_id uuid [ref: > users.id]
  assigned_at timestamptz [not null]
  indexes { (account_id, user_id) [pk] }
}

Table account_clients {
  account_id uuid [ref: > accounts.id]
  user_id uuid [ref: > users.id]
  linked_at timestamptz [not null]
  indexes { (account_id, user_id) [pk] }
}

Table pieces {
  id uuid [pk]
  account_id uuid [ref: > accounts.id, not null]
  author_id uuid [ref: > users.id, not null]
  title varchar(150) [not null]
  type varchar(20) [not null]
  copy text
  scheduled_date date [not null]
  status varchar(20) [not null]
  rejection_reason text
  created_at timestamptz [not null]
  updated_at timestamptz [not null]
}

Table piece_files {
  id uuid [pk]
  piece_id uuid [ref: > pieces.id, not null]
  file_url text [not null]
  file_name varchar(255) [not null]
  file_type varchar(50) [not null]
  file_size_kb int [not null]
  uploaded_at timestamptz [not null]
}

Table comments {
  id uuid [pk]
  piece_id uuid [ref: > pieces.id, not null]
  author_id uuid [ref: > users.id, not null]
  content text [not null]
  created_at timestamptz [not null]
}
```
