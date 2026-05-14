import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { PieceDetailModal } from '@/features/pieces/components/PieceDetailModal'
import { CreatePieceModal } from '@/features/pieces/components/CreatePieceModal'
import { useCalendarPieces, buildCalendarDays } from '@/features/calendar/hooks/useCalendarPieces'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'
import { useIsMobile } from '@/hooks/useIsMobile'

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const WEEKDAYS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo']

const STATUS_COLORS: Record<string, string> = {
  draft:      'var(--status-draft)',
  sent_client:'var(--status-sent)',
  approved:   'var(--status-approved)',
  published:  'var(--status-published)',
  rejected:   'var(--status-rejected)',
}

const LEGEND = [
  { key: 'draft',       label: 'Borrador',  color: 'var(--status-draft)' },
  { key: 'sent_client', label: 'Enviada',   color: 'var(--status-sent)' },
  { key: 'approved',    label: 'Aprobada',  color: 'var(--status-approved)' },
  { key: 'rejected',    label: 'Cambios',   color: 'var(--status-rejected)' },
  { key: 'published',   label: 'Publicada', color: 'var(--status-published)' },
]

export function Calendar() {
  const now = new Date()
  const [year, setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [accountFilter, setAccountFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: pieces = [], isLoading } = useCalendarPieces(year, month)
  const { data: accounts = [] } = useAccounts()

  const days = buildCalendarDays(year, month)

  const piecesByDate = new Map<string, typeof pieces>()
  for (const p of pieces) {
    if (!piecesByDate.has(p.scheduled_date)) piecesByDate.set(p.scheduled_date, [])
    piecesByDate.get(p.scheduled_date)!.push(p)
  }

  const visiblePieces = (dateStr: string) => {
    const list = piecesByDate.get(dateStr) ?? []
    if (accountFilter === 'all') return list
    return list.filter((p) => p.account_id === accountFilter)
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const weekNumber = (() => {
    const d = new Date()
    const tmp = new Date(d.getTime())
    tmp.setHours(0,0,0,0)
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay()+6)%7))
    const w1 = new Date(tmp.getFullYear(),0,4)
    return 1 + Math.round(((tmp.getTime()-w1.getTime())/86400000 - 3 + ((w1.getDay()+6)%7))/7)
  })()

  const todayLabel = now.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }).replace('.','')

  const isMobile = useIsMobile()
  const selectedPieceList = pieces.length > 0 ? pieces.map(p => p.id) : []
  const selectedIdx = selectedPiece ? selectedPieceList.indexOf(selectedPiece) : -1

  // Agenda view (mobile): days that have pieces, sorted chronologically
  const agendaDays = days
    .filter((cell) => !cell.muted && visiblePieces(cell.dateStr).length > 0)
    .slice(0, 30)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Mi agencia', 'Calendario']}
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
          >
            + Nueva pieza
          </button>
        }
      />

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: '1px solid var(--line-1)', background: 'var(--bg-0)' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ ch: '‹', fn: prevMonth }, { ch: '›', fn: nextMonth }].map(({ ch, fn }) => (
            <button key={ch} onClick={fn}
              style={{ width: 28, height: 28, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: 14 }}>
              {ch}
            </button>
          ))}
        </div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>
          {MONTH_NAMES[month]} {year}
        </h2>
        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Semana {weekNumber} · Hoy {todayLabel}
          {isLoading ? ' · cargando...' : ` · ${pieces.length} piezas`}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()) }}
          style={{ padding: '5px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
          Hoy
        </button>
      </div>

      {/* Account filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '10px 24px', borderBottom: '1px solid var(--line-1)', fontSize: 12 }}>
        {[{ id: 'all', name: 'Todas las cuentas' }, ...accounts.map(a => ({ id: a.id, name: a.name }))].map((a) => (
          <button key={a.id} onClick={() => setAccountFilter(a.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', padding: '4px 10px',
              background: accountFilter === a.id ? 'var(--violet-soft)' : 'var(--bg-2)',
              border: `1px solid ${accountFilter === a.id ? 'transparent' : 'var(--line-2)'}`,
              borderRadius: 999, fontSize: 11,
              color: accountFilter === a.id ? 'var(--violet-400)' : 'var(--fg-2)', cursor: 'pointer',
            }}>
            {a.name}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {LEGEND.map((l) => (
          <span key={l.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--fg-3)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Grid — desktop */}
      {!isMobile && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid var(--line-1)', flex: 1 }}>
          {WEEKDAYS.map((d) => (
            <div key={d} style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', borderRight: '1px solid var(--line-1)', borderBottom: '1px solid var(--line-1)', background: 'var(--bg-1)' }}>
              {d}
            </div>
          ))}
          {days.map((cell) => {
            const cellPieces = visiblePieces(cell.dateStr)
            return (
              <div
                key={cell.dateStr}
                style={{
                  minHeight: 132, padding: 8,
                  borderRight: '1px solid var(--line-1)', borderBottom: '1px solid var(--line-1)',
                  background: cell.muted ? 'var(--bg-1)' : 'var(--bg-0)',
                  display: 'flex', flexDirection: 'column', gap: 4, cursor: 'cell',
                  boxShadow: cell.isToday ? 'inset 2px 2px 0 var(--violet-500), inset -2px -2px 0 var(--violet-500)' : 'none',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = cell.muted ? 'var(--bg-1)' : 'var(--bg-0)' }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: cell.isToday ? 'var(--violet-400)' : cell.muted ? 'var(--fg-4)' : 'var(--fg-2)', fontWeight: cell.isToday ? 600 : 400, marginBottom: 2 }}>
                  {cell.isToday ? `${cell.day} · HOY` : cell.day}
                </div>
                {cellPieces.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPiece(p.id)}
                    style={{
                      padding: '5px 7px', borderRadius: 4, fontSize: 11.5, fontWeight: 500,
                      lineHeight: 1.3, cursor: 'pointer', textAlign: 'left', width: '100%',
                      background: p.status === 'published' ? 'var(--violet-soft)' : 'var(--bg-2)',
                      border: 'none', borderLeft: `2px solid ${STATUS_COLORS[p.status] ?? 'var(--fg-3)'}`,
                      color: 'var(--fg-1)', display: 'flex', flexDirection: 'column', gap: 2,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-3)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = p.status === 'published' ? 'var(--violet-soft)' : 'var(--bg-2)' }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: STATUS_COLORS[p.status], letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {p.accounts?.name?.toUpperCase() ?? '—'} · {p.scheduled_time?.slice(0,5) ?? '--:--'} · {p.type.toUpperCase()}
                    </div>
                    {p.title}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* Agenda — mobile */}
      {isMobile && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isLoading && (
            <p style={{ color: 'var(--fg-3)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>Cargando…</p>
          )}
          {!isLoading && agendaDays.length === 0 && (
            <p style={{ color: 'var(--fg-3)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
              Sin piezas programadas este mes.
            </p>
          )}
          {agendaDays.map((cell) => (
            <div key={cell.dateStr}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase',
                letterSpacing: '0.08em', color: cell.isToday ? 'var(--violet-400)' : 'var(--fg-3)',
                fontWeight: cell.isToday ? 600 : 400, marginBottom: 8, paddingBottom: 6,
                borderBottom: '1px solid var(--line-1)',
              }}>
                {cell.isToday ? `Hoy · ${cell.dateStr}` : cell.dateStr}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {visiblePieces(cell.dateStr).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPiece(p.id)}
                    style={{
                      padding: '10px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                      lineHeight: 1.4, cursor: 'pointer', textAlign: 'left', width: '100%',
                      background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                      borderLeft: `3px solid ${STATUS_COLORS[p.status] ?? 'var(--fg-3)'}`,
                      color: 'var(--fg-1)', display: 'flex', flexDirection: 'column', gap: 4,
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: STATUS_COLORS[p.status], letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      {p.accounts?.name?.toUpperCase() ?? '—'} · {p.scheduled_time?.slice(0,5) ?? '--:--'} · {p.type.toUpperCase()}
                    </div>
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreatePieceModal onClose={() => setShowCreateModal(false)} />
      )}

      {selectedPiece && (
        <PieceDetailModal
          pieceId={selectedPiece}
          onClose={() => setSelectedPiece(null)}
          onNavigate={(dir) => {
            const idx = selectedIdx + (dir === 'next' ? 1 : -1)
            if (idx >= 0 && idx < selectedPieceList.length) setSelectedPiece(selectedPieceList[idx])
          }}
        />
      )}
    </div>
  )
}
