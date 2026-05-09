-- ============================================================================
-- RLS: Row Level Security por agency_id
-- Cada agencia solo ve y modifica sus propios datos.
--
-- Helper: get_user_agency_id() retorna el agency_id del usuario autenticado.
-- ============================================================================

-- Helper function
create or replace function public.get_user_agency_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select agency_id
  from public.users
  where id = auth.uid()
$$;

-- ── agencies ──────────────────────────────────────────────────────────────────
alter table public.agencies enable row level security;

create policy "agencies: users see own agency"
  on public.agencies for select
  using (id = public.get_user_agency_id());

create policy "agencies: admins update own agency"
  on public.agencies for update
  using (id = public.get_user_agency_id());

-- ── users ─────────────────────────────────────────────────────────────────────
alter table public.users enable row level security;

create policy "users: see own agency members"
  on public.users for select
  using (agency_id = public.get_user_agency_id());

create policy "users: admins insert to own agency"
  on public.users for insert
  with check (agency_id = public.get_user_agency_id());

create policy "users: admins update own agency members"
  on public.users for update
  using (agency_id = public.get_user_agency_id());

-- ── accounts ──────────────────────────────────────────────────────────────────
alter table public.accounts enable row level security;

create policy "accounts: see own agency"
  on public.accounts for select
  using (agency_id = public.get_user_agency_id());

create policy "accounts: insert to own agency"
  on public.accounts for insert
  with check (agency_id = public.get_user_agency_id());

create policy "accounts: update own agency"
  on public.accounts for update
  using (agency_id = public.get_user_agency_id());

create policy "accounts: delete own agency"
  on public.accounts for delete
  using (agency_id = public.get_user_agency_id());

-- ── account_members ───────────────────────────────────────────────────────────
alter table public.account_members enable row level security;

create policy "account_members: see own agency"
  on public.account_members for select
  using (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

create policy "account_members: insert own agency"
  on public.account_members for insert
  with check (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

create policy "account_members: delete own agency"
  on public.account_members for delete
  using (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

-- ── account_clients ───────────────────────────────────────────────────────────
alter table public.account_clients enable row level security;

create policy "account_clients: see own agency"
  on public.account_clients for select
  using (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

create policy "account_clients: insert own agency"
  on public.account_clients for insert
  with check (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

create policy "account_clients: delete own agency"
  on public.account_clients for delete
  using (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

-- ── pieces ────────────────────────────────────────────────────────────────────
alter table public.pieces enable row level security;

create policy "pieces: see own agency"
  on public.pieces for select
  using (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

create policy "pieces: insert own agency"
  on public.pieces for insert
  with check (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

create policy "pieces: update own agency"
  on public.pieces for update
  using (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

create policy "pieces: delete own agency"
  on public.pieces for delete
  using (
    account_id in (
      select id from public.accounts where agency_id = public.get_user_agency_id()
    )
  );

-- ── piece_files ───────────────────────────────────────────────────────────────
alter table public.piece_files enable row level security;

create policy "piece_files: see own agency"
  on public.piece_files for select
  using (
    piece_id in (
      select p.id from public.pieces p
      join public.accounts a on a.id = p.account_id
      where a.agency_id = public.get_user_agency_id()
    )
  );

create policy "piece_files: insert own agency"
  on public.piece_files for insert
  with check (
    piece_id in (
      select p.id from public.pieces p
      join public.accounts a on a.id = p.account_id
      where a.agency_id = public.get_user_agency_id()
    )
  );

create policy "piece_files: delete own agency"
  on public.piece_files for delete
  using (
    piece_id in (
      select p.id from public.pieces p
      join public.accounts a on a.id = p.account_id
      where a.agency_id = public.get_user_agency_id()
    )
  );

-- ── comments ──────────────────────────────────────────────────────────────────
alter table public.comments enable row level security;

create policy "comments: see own agency"
  on public.comments for select
  using (
    piece_id in (
      select p.id from public.pieces p
      join public.accounts a on a.id = p.account_id
      where a.agency_id = public.get_user_agency_id()
    )
  );

create policy "comments: insert own agency"
  on public.comments for insert
  with check (
    piece_id in (
      select p.id from public.pieces p
      join public.accounts a on a.id = p.account_id
      where a.agency_id = public.get_user_agency_id()
    )
  );

create policy "comments: delete own comments"
  on public.comments for delete
  using (author_id = auth.uid());
