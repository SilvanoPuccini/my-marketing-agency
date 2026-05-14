import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { TopBar } from '@/components/layout/TopBar'
import { TableSkeleton } from '@/components/ui/page-skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { PieceDetailModal } from '@/features/pieces/components/PieceDetailModal'
import { InviteClientModal } from '@/features/accounts/components/InviteClientModal'
import { AccountForm, type AccountFormValues } from '@/features/accounts/components/AccountForm'
import { useUpdateAccount } from '@/features/accounts/hooks/useUpdateAccount'
import { useDeleteAccount } from '@/features/accounts/hooks/useDeleteAccount'
import { useAuthStore } from '@/stores/auth.store'
import { mkInitials, STATUS_LABELS, formatDateShort, formatBudget } from '@/lib/utils'

type AccountInfo = {
  id: string
  name: string
  handle: string | null
  industry: string | null
  contact_name: string | null
  contact_email: string | null
  monthly_budget: number | null
  is_active: boolean
}

type PieceRow = {
  id: string
  title: string
  type: string
  status: string
  scheduled_date: string
  scheduled_time: string | null
  platform: string | null
}

type MemberRow = { id: string; full_name: string; role: string; position: string | null }
type ClientRow = { id: string; full_name: string; email: string }

function useAccountDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['account', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, handle, industry, contact_name, contact_email, monthly_budget, is_active')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as AccountInfo
    },
  })
}

function useAccountPieces(accountId: string | undefined) {
  return useQuery({
    queryKey: ['account-pieces', accountId],
    enabled: !!accountId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('id, title, type, status, scheduled_date, scheduled_time, platform')
        .is('archived_at', null)
        .eq('account_id', accountId!)
        .order('scheduled_date', { ascending: false })
      if (error) throw error
      return (data ?? []) as PieceRow[]
    },
  })
}

function useAccountMembers(accountId: string | undefined) {
  return useQuery({
    queryKey: ['account-members', accountId],
    enabled: !!accountId,
    queryFn: async () => {
      const { data } = await supabase
        .from('account_members')
        .select('user_id, users(id, full_name, role, position)')
        .eq('account_id', accountId!)
      return (data ?? []).map((r) => {
        const u = r.users as unknown as MemberRow
        return { id: u.id, full_name: u.full_name, role: u.role, position: u.position }
      })
    },
  })
}

function useAccountClients(accountId: string | undefined) {
  return useQuery({
    queryKey: ['account-clients', accountId],
    enabled: !!accountId,
    queryFn: async () => {
      const { data } = await supabase
        .from('account_clients')
        .select('user_id, users(id, full_name, email)')
        .eq('account_id', accountId!)
      return (data ?? []).map((r) => {
        const u = r.users as unknown as ClientRow
        return { id: u.id, full_name: u.full_name, email: u.email }
      })
    },
  })
}

export function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin_agency'
  const { data: account, isLoading } = useAccountDetail(id)
  const { data: pieces = [], isLoading: piecesLoading } = useAccountPieces(id)
  const { data: members = [] } = useAccountMembers(id)
  const { data: clients = [] } = useAccountClients(id)
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [showInviteClient, setShowInviteClient] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const updateAccount = useUpdateAccount()
  const deleteAccount = useDeleteAccount()

  const thStyle: React.CSSProperties = {
    textAlign: 'left', fontWeight: 500, fontSize: 11,
    letterSpacing: '0.04em', textTransform: 'uppercase',
    color: 'var(--fg-3)', padding: '10px 16px',
    borderBottom: '1px solid var(--line-1)', background: 'var(--bg-1)',
  }

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px', borderBottom: '1px solid var(--line-1)',
    color: 'var(--fg-1)', verticalAlign: 'middle',
  }

  const published = pieces.filter((p) => p.status === 'published').length
  const total = pieces.length

  async function handleEdit(values: AccountFormValues) {
    if (!account) return
    await updateAccount.mutateAsync({
      id: account.id,
      name: values.name,
      industry: values.industry || null,
      handle: values.handle || null,
      contact_name: values.contact_name || null,
      contact_email: values.contact_email || null,
      monthly_budget: values.monthly_budget ?? null,
    })
    setShowEdit(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Mi agencia', 'Cuentas', account?.name ?? 'Cargando...']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            {isAdmin && account && (
              <>
                <button
                  onClick={() => setShowEdit(!showEdit)}
                  style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                >
                  {showEdit ? 'Cancelar edicion' : 'Editar'}
                </button>
                <button
                  onClick={() => setShowInviteClient(true)}
                  style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
                >
                  + Invitar cliente
                </button>
              </>
            )}
            <button
              onClick={() => navigate('/accounts')}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >
              Volver
            </button>
          </div>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px' }}>
        {isLoading ? (
          <TableSkeleton rows={3} />
        ) : account ? (
          <>
            {/* Edit form */}
            {showEdit && isAdmin && (
              <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', padding: 20, marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>Editar cuenta</h3>
                <AccountForm
                  onSubmit={handleEdit}
                  submitLabel="Guardar cambios"
                  submittingLabel="Guardando..."
                  onCancel={() => setShowEdit(false)}
                  error={updateAccount.isError ? (updateAccount.error as Error)?.message : null}
                  autoFocusName={false}
                  initialValues={{
                    name: account.name,
                    industry: account.industry ?? '',
                    handle: account.handle ?? '',
                    contact_name: account.contact_name ?? '',
                    contact_email: account.contact_email ?? '',
                    monthly_budget: account.monthly_budget ?? undefined,
                  }}
                />
              </div>
            )}

            {/* Account header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--violet-soft)', border: '1px solid var(--violet-soft)',
                color: 'var(--violet-400)', fontSize: 16, fontWeight: 600,
              }}>
                {mkInitials(account.name)}
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
                  {account.name}
                </h2>
                <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
                  {[account.handle, account.industry].filter(Boolean).join(' · ')}
                  {!account.is_active && ' · En pausa'}
                </p>
              </div>
              <div style={{ flex: 1 }} />
              {isAdmin && (
                <button
                  onClick={() => updateAccount.mutate({ id: account.id, is_active: !account.is_active })}
                  disabled={updateAccount.isPending}
                  style={{
                    padding: '6px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    borderRadius: 'var(--r-2)',
                    background: account.is_active ? 'var(--bg-2)' : 'rgba(34,197,94,0.1)',
                    border: `1px solid ${account.is_active ? 'var(--line-2)' : 'rgba(34,197,94,0.3)'}`,
                    color: account.is_active ? 'var(--fg-2)' : 'var(--status-approved)',
                  }}
                >
                  {account.is_active ? 'Pausar' : 'Activar'}
                </button>
              )}
              <span className={`pill pill-${account.is_active ? 'approved' : 'draft'}`}>
                <span className="dot" />
                {account.is_active ? 'Activa' : 'En pausa'}
              </span>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Contacto', value: account.contact_name ?? '—' },
                { label: 'Email', value: account.contact_email ?? '—' },
                { label: 'Presupuesto mensual', value: formatBudget(account.monthly_budget) },
                { label: 'Piezas', value: `${published} publicadas / ${total} total` },
              ].map((card) => (
                <div key={card.label} style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--fg-3)', marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Members & Clients row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {/* Team members */}
              <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line-1)' }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Equipo asignado</h3>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase' }}>{members.length} MIEMBROS</span>
                </div>
                <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {members.length === 0 && <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>Sin miembros asignados</span>}
                  {members.map((m) => (
                    <Link
                      key={m.id}
                      to={`/team/${m.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '6px 8px', borderRadius: 'var(--r-2)',
                        textDecoration: 'none', color: 'var(--fg-1)',
                      }}
                    >
                      <div style={{
                        width: 24, height: 24, borderRadius: 999,
                        background: 'var(--bg-3)', border: '1px solid var(--line-2)',
                        display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 600,
                      }}>{mkInitials(m.full_name)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{m.full_name}</div>
                        {m.position && <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.position}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Clients */}
              <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line-1)' }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Clientes del portal</h3>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase' }}>{clients.length} CLIENTES</span>
                </div>
                <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {clients.length === 0 && <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>Sin clientes vinculados</span>}
                  {clients.map((c) => (
                    <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px' }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: 999,
                        background: 'var(--violet-soft)', border: '1px solid var(--violet-soft)',
                        display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 600,
                        color: 'var(--violet-400)',
                      }}>{mkInitials(c.full_name)}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{c.full_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{c.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pieces table */}
            <section style={{ background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Piezas</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {total} PIEZAS
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '35%' }}>Titulo</th>
                    <th style={thStyle}>Tipo</th>
                    <th style={thStyle}>Plataforma</th>
                    <th style={thStyle}>Fecha</th>
                    <th style={thStyle}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {piecesLoading && (
                    <tr>
                      <td colSpan={5} style={{ padding: 0 }}>
                        <TableSkeleton rows={4} />
                      </td>
                    </tr>
                  )}
                  {!piecesLoading && pieces.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 0 }}>
                        <EmptyState
                          icon="📋"
                          title="Sin piezas"
                          description="Esta cuenta todavia no tiene piezas asignadas."
                        />
                      </td>
                    </tr>
                  )}
                  {pieces.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPiece(p.id)}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--bg-3)' }) }}
                      onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'transparent' }) }}
                    >
                      <td style={{ ...tdStyle, fontWeight: 500 }}>{p.title}</td>
                      <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{p.type}</td>
                      <td style={{ ...tdStyle, color: 'var(--fg-3)' }}>{p.platform ?? '—'}</td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>{formatDateShort(p.scheduled_date)}</td>
                      <td style={tdStyle}>
                        <span className={`pill pill-${p.status}`}>
                          <span className="dot" />
                          {STATUS_LABELS[p.status] ?? p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Admin: Delete account */}
            {isAdmin && (
              <div style={{ marginTop: 24, padding: '14px 18px', background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)' }}>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{
                      padding: '8px 14px', fontSize: 13, fontWeight: 500,
                      background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 'var(--r-2)', cursor: 'pointer', color: '#EF4444',
                    }}
                  >
                    Eliminar cuenta
                  </button>
                ) : (
                  <div>
                    <p style={{ margin: '0 0 10px', fontSize: 12, color: '#EF4444' }}>
                      Se eliminara <strong>{account.name}</strong> y todas sus piezas. Esta accion no se puede deshacer.
                    </p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => deleteAccount.mutate(account.id, { onSuccess: () => navigate('/accounts') })}
                        disabled={deleteAccount.isPending}
                        style={{ padding: '7px 12px', fontSize: 12, fontWeight: 600, background: '#EF4444', border: 'none', borderRadius: 'var(--r-2)', cursor: 'pointer', color: '#fff' }}
                      >
                        {deleteAccount.isPending ? 'Eliminando...' : 'Confirmar'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        style={{ padding: '7px 12px', fontSize: 12, fontWeight: 500, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', cursor: 'pointer', color: 'var(--fg-2)' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <EmptyState icon="❌" title="Cuenta no encontrada" description="La cuenta que buscas no existe." />
        )}
      </div>

      {selectedPiece && (
        <PieceDetailModal
          pieceId={selectedPiece}
          onClose={() => setSelectedPiece(null)}
        />
      )}

      {showInviteClient && account && (
        <InviteClientModal
          accountId={account.id}
          accountName={account.name}
          onClose={() => setShowInviteClient(false)}
        />
      )}
    </div>
  )
}
