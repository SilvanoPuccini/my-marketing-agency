import { useParams, useNavigate, Link } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { useTeamMember } from '@/features/team/hooks/useTeamMember'
import { useTeam } from '@/features/team/hooks/useTeam'
import { useAuthStore } from '@/stores/auth.store'

const ROLE_LABELS: Record<string, string> = {
  admin_agency: 'Admin',
  team_member: 'Equipo',
  manager: 'Manager',
  creator: 'Creador',
}

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

export function TeamMember() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { data: member, isLoading } = useTeamMember(id)
  const { data: allMembers = [] } = useTeam(user?.agency_id)

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
            { label: 'Aprobadas sin cambios', value: `${member.stats.approvalRate}%` },
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
                onClick={() => navigate(`/portal/pieces/${p.id}`)}
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
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {member.accounts.length} ASIGNADAS
                </span>
              </div>
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
            </div>

            {/* Details */}
            <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Detalle</h3>
              </div>
              <div style={{ padding: '8px 18px 18px' }}>
                {[
                  { k: 'Rol', v: ROLE_LABELS[member.role] ?? member.role },
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

          </div>
        </div>
      </div>
    </div>
  )
}
