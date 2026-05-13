import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { useTeamMember } from '@/features/team/hooks/useTeamMember'
import { useTeam } from '@/features/team/hooks/useTeam'
import { useUpdateMember } from '@/features/team/hooks/useUpdateMember'
import { useDeleteMember } from '@/features/team/hooks/useDeleteMember'
import { useAuthStore } from '@/stores/auth.store'
import { useAssignAccounts } from '@/features/team/hooks/useAssignAccounts'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { ROLE_LABELS } from '@/lib/roles'

const STATUS_PILL: Record<string, string> = {
  draft: 'pill-draft',
  sent_client: 'pill-sent',
  approved: 'pill-approved',
  rejected: 'pill-rejected',
  published: 'pill-violet',
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Borrador',
  sent_client: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Cambios pedidos',
  published: 'Publicada',
}

function formatDate(d: string): string {
  return new Date(d + 'T12:00:00').toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: undefined,
  }).toUpperCase()
}

function timeSince(dateStr: string): string {
  const created = new Date(dateStr)
  const now = new Date()
  const months = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth())
  if (months < 1) return 'Este mes'
  if (months < 12) return `${months} mes${months > 1 ? 'es' : ''}`
  const years = Math.floor(months / 12)
  const rem = months % 12
  return rem > 0 ? `${years} a ${rem} m` : `${years} año${years > 1 ? 's' : ''}`
}

const TEAM_ROLES = [
  { value: 'creator',      label: 'Creador' },
  { value: 'manager',      label: 'Manager' },
  { value: 'team_member',  label: 'Miembro' },
  { value: 'admin_agency', label: 'Administrador' },
] as const

export function TeamMember() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: member, isLoading } = useTeamMember(id)
  const { data: allMembers = [] } = useTeam(user?.agency_id)
  const updateMember = useUpdateMember()
  const deleteMember = useDeleteMember()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingAccounts, setEditingAccounts] = useState(false)
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  const assignAccounts = useAssignAccounts()
  const { data: allAccounts = [] } = useAccounts()
  const isAdmin = user?.role === 'admin_agency'
  const isSelf = user?.id === id

  // Navigation between members
  const currentIdx = allMembers.findIndex((m) => m.id === id)
  const prevMember = currentIdx > 0 ? allMembers[currentIdx - 1] : null
  const nextMember = currentIdx < allMembers.length - 1 ? allMembers[currentIdx + 1] : null

  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: 'var(--fg-3)', fontSize: 14 }}>
        Cargando...
      </div>
    )
  }

  if (!member) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: 'var(--fg-3)', fontSize: 14 }}>
        Miembro no encontrado
      </div>
    )
  }

  const activePieces = member.pieces.filter((p) => p.status !== 'published')
  const createdDate = new Date(member.created_at).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' }).toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar breadcrumb={['Mi agencia', 'Equipo', member.full_name]} />

      <div className="page-content" style={{ padding: '24px 32px' }}>

        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 28,
          alignItems: 'flex-start', paddingBottom: 24,
          borderBottom: '1px solid var(--line-1)', marginBottom: 24,
        }}>
          {/* Avatar */}
          <div style={{
            width: 96, height: 96, borderRadius: 'var(--r-3)',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 34, color: '#fff',
            position: 'relative', flexShrink: 0,
          }}>
            {member.initials}
            <span style={{
              position: 'absolute', bottom: 4, right: 4,
              width: 16, height: 16, borderRadius: 999,
              background: member.is_active ? 'var(--status-approved)' : 'var(--status-draft)',
              border: '3px solid var(--bg-0)',
            }} />
          </div>

          {/* Info */}
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em' }}>
              {member.full_name}
            </h1>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {member.position && (
                <span className="pill pill-violet"><span className="dot" />{member.position}</span>
              )}
              <span className={`pill pill-${member.is_active ? 'approved' : 'draft'}`}>
                <span className="dot" />{member.is_active ? 'Activo' : 'Inactivo'}
              </span>
              <span className="faint mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                EN EL EQUIPO DESDE {createdDate}
              </span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 18, fontSize: 13, color: 'var(--fg-2)', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>@</span>
                {member.email}
              </span>
            </div>
          </div>

          {/* Navigation arrows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => prevMember && navigate(`/team/${prevMember.id}`)}
                disabled={!prevMember}
                style={{
                  width: 30, height: 30, background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                  borderRadius: 'var(--r-2)', color: prevMember ? 'var(--fg-2)' : 'var(--fg-4)',
                  display: 'grid', placeItems: 'center', cursor: prevMember ? 'pointer' : 'default',
                }}
              >‹</button>
              <button
                onClick={() => nextMember && navigate(`/team/${nextMember.id}`)}
                disabled={!nextMember}
                style={{
                  width: 30, height: 30, background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                  borderRadius: 'var(--r-2)', color: nextMember ? 'var(--fg-2)' : 'var(--fg-4)',
                  display: 'grid', placeItems: 'center', cursor: nextMember ? 'pointer' : 'default',
                }}
              >›</button>
            </div>
            {allMembers.length > 0 && (
              <span className="faint mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {currentIdx + 1} DE {allMembers.length} MIEMBROS
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1,
          background: 'var(--line-1)', border: '1px solid var(--line-1)',
          borderRadius: 'var(--r-3)', overflow: 'hidden', marginBottom: 24,
        }}>
          {[
            { label: 'Piezas totales', value: member.stats.totalPieces },
            { label: 'Tasa de aprobación', value: `${member.stats.approvalRate}%` },
            { label: 'Cuentas asignadas', value: member.accounts.length },
            { label: 'Carga esta semana', value: `${member.stats.weeklyLoad}` },
          ].map((s) => (
            <div key={s.label} style={{ background: 'var(--bg-1)', padding: '18px 20px' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
              <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>

          {/* Left: Pieces */}
          <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 18px', borderBottom: '1px solid var(--line-1)',
            }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Piezas asignadas</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                EN CURSO · {activePieces.length}
              </span>
            </div>
            {activePieces.length === 0 && (
              <div style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--fg-3)', fontSize: 13 }}>
                No tiene piezas asignadas actualmente.
              </div>
            )}
            {activePieces.slice(0, 8).map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/calendar`)}
                style={{
                  display: 'grid', gridTemplateColumns: '36px 1fr auto auto',
                  gap: 14, alignItems: 'center', padding: '12px 18px',
                  borderBottom: '1px solid var(--line-1)', cursor: 'pointer',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-2)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 6,
                  background: 'var(--bg-3)', border: '1px solid var(--line-1)',
                  display: 'grid', placeItems: 'center', fontSize: 10, color: 'var(--fg-3)',
                  fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                }}>{p.type.slice(0, 3)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>
                    {p.account_name} · {formatDate(p.scheduled_date)}
                    {p.scheduled_time ? ` · ${p.scheduled_time.slice(0, 5)}` : ''}
                  </div>
                </div>
                <span className={`pill ${STATUS_PILL[p.status] ?? 'pill-draft'}`}>
                  <span className="dot" />{STATUS_LABEL[p.status] ?? p.status}
                </span>
                <span style={{ color: 'var(--fg-3)' }}>›</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Accounts */}
            <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 18px', borderBottom: '1px solid var(--line-1)',
              }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Cuentas que atiende</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {member.accounts.length} ASIGNADAS
                  </span>
                  {isAdmin && !editingAccounts && (
                    <button
                      onClick={() => {
                        setSelectedAccountIds(member.accounts.map((a) => a.id))
                        setEditingAccounts(true)
                      }}
                      style={{
                        padding: '3px 8px', fontSize: 11, fontWeight: 500,
                        background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                        borderRadius: 'var(--r-2)', cursor: 'pointer', color: 'var(--violet-400)',
                      }}
                    >
                      Editar
                    </button>
                  )}
                </div>
              </div>

              {editingAccounts ? (
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
                    {allAccounts.map((acc) => {
                      const checked = selectedAccountIds.includes(acc.id)
                      return (
                        <label
                          key={acc.id}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                            borderRadius: 'var(--r-2)', cursor: 'pointer',
                            background: checked ? 'rgba(124,58,237,0.06)' : 'transparent',
                            border: `1px solid ${checked ? 'rgba(124,58,237,0.15)' : 'var(--line-1)'}`,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedAccountIds((prev) =>
                                checked ? prev.filter((id) => id !== acc.id) : [...prev, acc.id]
                              )
                            }}
                            style={{ accentColor: 'var(--violet-500)' }}
                          />
                          <span style={{ fontSize: 13 }}>{acc.name}</span>
                        </label>
                      )
                    })}
                    {allAccounts.length === 0 && (
                      <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>No hay cuentas creadas aún.</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button
                      onClick={() => {
                        assignAccounts.mutate(
                          { userId: member.id, accountIds: selectedAccountIds },
                          { onSuccess: () => setEditingAccounts(false) },
                        )
                      }}
                      disabled={assignAccounts.isPending}
                      style={{
                        flex: 1, padding: '7px 12px', fontSize: 12, fontWeight: 500,
                        background: 'var(--violet-500)', border: '1px solid var(--violet-400)',
                        borderRadius: 'var(--r-2)', cursor: 'pointer', color: '#fff',
                      }}
                    >
                      {assignAccounts.isPending ? 'Guardando…' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => setEditingAccounts(false)}
                      style={{
                        flex: 1, padding: '7px 12px', fontSize: 12, fontWeight: 500,
                        background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                        borderRadius: 'var(--r-2)', cursor: 'pointer', color: 'var(--fg-2)',
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px 18px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {member.accounts.length === 0 && (
                    <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>Sin cuentas asignadas</span>
                  )}
                  {member.accounts.map((acc) => (
                    <Link
                      key={acc.id}
                      to={`/accounts/${acc.id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 10px', background: 'var(--bg-2)',
                        border: '1px solid var(--line-2)', borderRadius: 999,
                        fontSize: 12, color: 'var(--fg-1)', textDecoration: 'none',
                      }}
                    >
                      <div style={{
                        width: 18, height: 18, borderRadius: 4,
                        background: 'var(--bg-4)', display: 'grid', placeItems: 'center',
                        fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600,
                      }}>{acc.initials}</div>
                      {acc.name}
                      <span className="mono" style={{ color: 'var(--fg-3)', fontSize: 10 }}>{acc.pieceCount}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Detalle</h3>
              </div>
              <div style={{ padding: '8px 18px 18px' }}>
                {/* Rol — editable by admin */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: 13, borderBottom: '1px dashed var(--line-1)' }}>
                  <span style={{ color: 'var(--fg-3)' }}>Rol</span>
                  {isAdmin && !isSelf ? (
                    <select
                      value={member.role}
                      onChange={(e) => updateMember.mutate({ id: member.id, role: e.target.value })}
                      style={{ padding: '4px 8px', fontSize: 12, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)' }}
                    >
                      {TEAM_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span>{ROLE_LABELS[member.role] ?? member.role}</span>
                  )}
                </div>

                {[
                  { k: 'Email', v: member.email },
                  { k: 'Posición', v: member.position ?? '—' },
                  { k: 'Ingreso', v: new Date(member.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase() },
                  { k: 'Antigüedad', v: timeSince(member.created_at) },
                ].map((row) => (
                  <div key={row.k} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0', fontSize: 13,
                    borderBottom: '1px dashed var(--line-1)',
                  }}>
                    <span style={{ color: 'var(--fg-3)' }}>{row.k}</span>
                    <span>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin actions */}
            {isAdmin && !isSelf && (
              <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line-1)' }}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Acciones</h3>
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Toggle active */}
                  <button
                    onClick={() => updateMember.mutate({ id: member.id, is_active: !member.is_active })}
                    disabled={updateMember.isPending}
                    style={{
                      width: '100%', padding: '9px 14px', fontSize: 13, fontWeight: 500,
                      background: member.is_active ? 'var(--bg-2)' : 'rgba(34,197,94,0.1)',
                      border: `1px solid ${member.is_active ? 'var(--line-2)' : 'rgba(34,197,94,0.3)'}`,
                      borderRadius: 'var(--r-2)', cursor: 'pointer',
                      color: member.is_active ? 'var(--fg-2)' : 'var(--status-approved)',
                    }}
                  >
                    {member.is_active ? 'Desactivar miembro' : 'Reactivar miembro'}
                  </button>

                  {/* Delete */}
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      style={{
                        width: '100%', padding: '9px 14px', fontSize: 13, fontWeight: 500,
                        background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 'var(--r-2)', cursor: 'pointer', color: '#EF4444',
                      }}
                    >
                      Eliminar del equipo
                    </button>
                  ) : (
                    <div style={{ padding: '12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r-2)' }}>
                      <p style={{ margin: '0 0 10px', fontSize: 12, color: '#EF4444' }}>
                        Se eliminará a <strong>{member.full_name}</strong> y todas sus piezas/comentarios. Esta acción no se puede deshacer.
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => {
                            deleteMember.mutate(member.id, {
                              onSuccess: () => navigate('/team'),
                            })
                          }}
                          disabled={deleteMember.isPending}
                          style={{
                            flex: 1, padding: '7px 12px', fontSize: 12, fontWeight: 600,
                            background: '#EF4444', border: 'none', borderRadius: 'var(--r-2)',
                            cursor: 'pointer', color: '#fff',
                          }}
                        >
                          {deleteMember.isPending ? 'Eliminando...' : 'Confirmar'}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          style={{
                            flex: 1, padding: '7px 12px', fontSize: 12, fontWeight: 500,
                            background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                            borderRadius: 'var(--r-2)', cursor: 'pointer', color: 'var(--fg-2)',
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
