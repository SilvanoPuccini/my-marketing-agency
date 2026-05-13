import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { useAuthStore } from '@/stores/auth.store'
import { useNeedsOnboarding } from '@/features/onboarding/hooks/useOnboarding'
import {
  useDashboardStats,
  useAttentionPieces,
  useTeamLoad,
  useAccountsWithPauta,
  useRecentActivity,
  getISOWeek,
  type Period,
} from '@/features/dashboard/hooks/useDashboard'
import { CreatePieceModal } from '@/features/pieces/components/CreatePieceModal'
import { PieceDetailModal } from '@/features/pieces/components/PieceDetailModal'

// ─── Helpers ─────────────────────────────────────────────────

function greeting(fullName: string): string {
  const h = new Date().getHours()
  const saludo = h < 12 ? 'Buen día' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
  return `${saludo}, ${fullName.split(' ')[0]} 👋`
}

function todayLabel(): string {
  const str = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 2) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ayer'
  return `hace ${days} d`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const wd = d.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase().replace('.', '')
  const day = d.getDate()
  const mo = d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase().replace('.', '')
  return `${wd} ${day} ${mo}`
}

function formatBudget(n: number): string {
  return `$${n.toLocaleString('es-AR')}`
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

function teamVariant(pct: number): string {
  if (pct >= 95) return 'warn'
  if (pct >= 75) return ''
  return 'ok'
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent_client: 'Esperando cliente',
  approved: 'Aprobado',
  rejected: 'Cambios pedidos',
  published: 'Publicado',
}

const STATUS_ACTIONS: Record<string, string> = {
  draft: 'guardó como borrador',
  sent_client: 'envió al cliente',
  approved: 'aprobó',
  rejected: 'pidió cambios en',
  published: 'publicó',
}

// ─── UI Components ────────────────────────────────────────────

function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span className={`pill pill-${status}`}>
      <span className="dot" />
      {label}
    </span>
  )
}


function Avatar({ initials: init, violet }: { initials: string; violet?: boolean }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: violet ? 'var(--violet-soft)' : 'var(--bg-3)',
        border: `1px solid ${violet ? 'var(--violet-soft)' : 'var(--line-2)'}`,
        color: violet ? 'var(--violet-400)' : 'var(--fg-1)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        flexShrink: 0,
      }}
    >
      {init}
    </div>
  )
}

const panel: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-1)',
  borderRadius: 'var(--r-3)',
}

const panelH: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 18px',
  borderBottom: '1px solid var(--line-1)',
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div style={{ padding: '24px 18px', color: 'var(--fg-3)', fontSize: 13, textAlign: 'center' }}>
      {message}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────

export function Dashboard() {
  const { user } = useAuthStore()
  const agencyId = user?.agency_id
  const onboarding = useNeedsOnboarding()
  const [showCreate, setShowCreate] = useState(false)
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [period, setPeriod] = useState<Period>('week')

  const isAdmin = user?.role === 'admin_agency'
  const isManager = user?.role === 'manager'

  const stats = useDashboardStats(agencyId, period)
  const attention = useAttentionPieces(agencyId)
  const teamLoad = useTeamLoad(agencyId)
  const pauta = useAccountsWithPauta(agencyId)
  const activity = useRecentActivity(agencyId)

  // Only admin gets redirected to onboarding
  const skippedOnboarding = sessionStorage.getItem('skipped-onboarding') === '1'
  if (isAdmin && onboarding.data?.needsOnboarding && !skippedOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  const weekNumber = getISOWeek(new Date())

  function deltaLabel(current: number, prev: number, suffix = ''): { text: string; up: boolean } {
    const diff = current - prev
    if (diff === 0) return { text: 'Sin cambio', up: true }
    const sign = diff > 0 ? '+' : ''
    return { text: `${sign}${diff}${suffix} vs. período anterior`, up: diff > 0 }
  }

  const activeDelta = stats.data ? deltaLabel(stats.data.active, stats.data.prevActive) : { text: '—', up: true }
  const pendingDelta = stats.data ? deltaLabel(stats.data.pending, stats.data.prevPending) : { text: '—', up: true }
  const rateDelta = stats.data ? deltaLabel(stats.data.approvalRate, stats.data.prevApprovalRate, '%') : { text: '—', up: true }

  const statsCards = [
    {
      label: 'Piezas activas',
      value: stats.isLoading ? '—' : String(stats.data?.active ?? 0),
      delta: stats.isLoading ? '—' : activeDelta.text,
      deltaUp: activeDelta.up,
    },
    {
      label: 'Pendientes de aprobación',
      value: stats.isLoading ? '—' : String(stats.data?.pending ?? 0),
      delta: stats.isLoading ? '—' : pendingDelta.text,
      deltaUp: !pendingDelta.up, // fewer pending is good
    },
    {
      label: 'Publicadas',
      value: stats.isLoading ? '—' : String((stats.data?.active ?? 0) - (stats.data?.pending ?? 0)),
      delta: stats.isLoading ? '—' : `En el período actual`,
      deltaUp: true,
    },
    {
      label: 'Tasa de aprobación',
      value: stats.isLoading ? '—' : `${stats.data?.approvalRate ?? 0}%`,
      delta: stats.isLoading ? '—' : rateDelta.text,
      deltaUp: rateDelta.up,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={[user?.agency_id ? 'Mi agencia' : 'Panel', 'Panel']}
        actions={
          <button
            onClick={() => setShowCreate(true)}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
          >
            + Nueva pieza
          </button>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
              {user ? greeting(user.full_name) : 'Buen día 👋'}
            </h2>
            <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
              Hoy es {todayLabel()}.
              {(stats.data?.pending ?? 0) > 0
                ? ` Tenés ${stats.data!.pending} pieza${stats.data!.pending !== 1 ? 's' : ''} esperando aprobación.`
                : ' Todo al día por ahora.'}
            </p>
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: 8 }}>
              {(['today', 'week', 'month'] as Period[]).map((p) => {
                const label = p === 'today' ? 'Hoy' : p === 'week' ? 'Esta semana' : 'Mes'
                const active = period === p
                return (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer', borderRadius: 'var(--r-2)', border: active ? '1px solid var(--violet-400)' : '1px solid var(--line-2)', background: active ? 'var(--violet-soft)' : 'var(--bg-2)', color: active ? 'var(--violet-400)' : 'var(--fg-2)' }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
          {statsCards.map((s) => (
            <div key={s.label} style={{ background: 'var(--bg-1)', padding: '18px 20px' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
              <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>
                {s.value}
              </div>
              <div className="mono" style={{ fontSize: 11, marginTop: 6, color: s.deltaUp ? 'var(--status-approved)' : 'var(--status-rejected)' }}>
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Row 1 */}
        <div className="dashboard-row" style={{ display: 'grid', gridTemplateColumns: isAdmin ? '2fr 1fr' : '1fr', gap: 16, marginTop: 24 }}>
          {/* Attention items */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
                Necesitan tu atención
              </h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {attention.isLoading ? '—' : `${attention.data?.length ?? 0} PIEZAS`} · ORDENADAS POR URGENCIA
              </span>
            </div>
            {attention.isLoading && <div style={{ padding: '12px 18px' }}>{[1,2,3].map(i => <div key={i} style={{ height: 48, background: 'var(--bg-2)', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />)}</div>}
            {!attention.isLoading && (attention.data?.length ?? 0) === 0 && (
              <EmptyRow message="No hay piezas pendientes. ¡Todo en orden!" />
            )}
            {attention.data?.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPiece(item.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto auto auto',
                  gap: 14,
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--line-1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: item.thumbnail_url ? `url(${item.thumbnail_url}) center/cover no-repeat` : 'repeating-linear-gradient(45deg, var(--bg-3) 0 6px, var(--bg-4) 6px 12px)',
                  border: '1px solid var(--line-1)',
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
                    {item.accounts?.name ?? '—'} · {item.type} · {formatDate(item.scheduled_date)}
                    {item.scheduled_time ? ` · ${item.scheduled_time.slice(0, 5)}` : ''}
                  </div>
                </div>
                <StatusPill status={item.status} label={STATUS_LABELS[item.status] ?? item.status} />
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{relativeTime(item.updated_at)}</span>
                <span style={{ color: 'var(--fg-3)' }}>→</span>
              </div>
            ))}
          </section>

          {/* Team load — admin only */}
          {isAdmin && (
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Carga del equipo</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                SEMANA {weekNumber}
              </span>
            </div>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {teamLoad.isLoading && <div style={{ padding: 18 }}>{[1,2,3].map(i => <div key={i} style={{ height: 32, background: 'var(--bg-2)', borderRadius: 6, marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite' }} />)}</div>}
              {!teamLoad.isLoading && (teamLoad.data?.length ?? 0) === 0 && (
                <EmptyRow message="Sin piezas programadas esta semana." />
              )}
              {teamLoad.data?.map((m) => {
                const variant = teamVariant(m.pct)
                return (
                  <div key={m.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>
                        {m.fullName}{m.position ? ` · ${m.position}` : ''}
                      </span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.done} / {m.total}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
                      <span
                        style={{
                          display: 'block',
                          height: '100%',
                          borderRadius: 999,
                          width: `${m.pct}%`,
                          background: variant === 'warn' ? '#F59E0B' : variant === 'ok' ? 'var(--status-approved)' : 'var(--violet-500)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          )}
        </div>

        {/* Row 2 — admin sees both, manager sees activity only */}
        {(isAdmin || isManager) && (
        <div className="dashboard-row" style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: 16, marginTop: 16 }}>
          {/* Recent activity */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Actividad reciente</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ÚLTIMAS ACTUALIZACIONES</span>
            </div>
            <div style={{ padding: '6px 0' }}>
              {activity.isLoading && <div style={{ padding: '6px 18px' }}>{[1,2,3].map(i => <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}><div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--bg-3)', animation: 'pulse 1.5s ease-in-out infinite' }} /><div style={{ flex: 1, height: 16, background: 'var(--bg-2)', borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} /></div>)}</div>}
              {!activity.isLoading && (activity.data?.length ?? 0) === 0 && (
                <EmptyRow message="Sin actividad reciente." />
              )}
              {activity.data?.map((a) => (
                <div
                  key={a.id}
                  style={{ display: 'flex', gap: 12, padding: '12px 18px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <Avatar initials={initials(a.users?.full_name ?? '?')} violet={a.status === 'approved'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 500 }}>{a.users?.full_name ?? 'Alguien'}</span>
                      <span style={{ color: 'var(--fg-2)' }}> {STATUS_ACTIONS[a.status] ?? 'actualizó'} </span>
                      <span style={{ color: 'var(--violet-400)' }}>{a.title}</span>
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, textTransform: 'uppercase' }}>
                      {a.accounts?.name ?? '—'} · {relativeTime(a.updated_at).toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Accounts with pauta — admin only */}
          {isAdmin && (
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Cuentas con pauta este mes</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {pauta.isLoading ? '—' : `${pauta.data?.length ?? 0} ACTIVAS`}
              </span>
            </div>
            {pauta.isLoading && <div style={{ padding: '12px 18px' }}>{[1,2].map(i => <div key={i} style={{ height: 44, background: 'var(--bg-2)', borderRadius: 6, marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />)}</div>}
            {!pauta.isLoading && (pauta.data?.length ?? 0) === 0 && (
              <EmptyRow message="Sin cuentas con pauta este mes." />
            )}
            {pauta.data?.map((a) => (
              <div
                key={a.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto',
                  gap: 14,
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--line-1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Avatar initials={initials(a.name)} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
                    Pauta · {formatBudget(a.monthly_budget ?? 0)}
                    {a.plan ? ` · ${a.plan}` : ''}
                  </div>
                </div>
                <StatusPill status="approved" label="Al día" />
              </div>
            ))}
          </section>
          )}
        </div>
        )}
      </div>

      {showCreate && (
        <CreatePieceModal onClose={() => setShowCreate(false)} />
      )}

      {selectedPiece && (
        <PieceDetailModal
          pieceId={selectedPiece}
          onClose={() => setSelectedPiece(null)}
        />
      )}
    </div>
  )
}
