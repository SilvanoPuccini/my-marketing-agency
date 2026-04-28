import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { PieceDetailModal } from '@/features/pieces/components/PieceDetailModal'

interface CalPiece {
  id: string
  account: string
  time: string
  type: string
  title: string
  status: 'draft' | 'sent' | 'appr' | 'pub' | 'rej'
}

interface CalDay {
  day: number
  muted?: boolean
  today?: boolean
  pieces: CalPiece[]
}

const WEEKS: CalDay[][] = [
  [
    { day: 30, muted: true, pieces: [] },
    { day: 31, muted: true, pieces: [] },
    { day: 1, pieces: [{ id: 'p1', account: 'DON TITO', time: '19:00', type: 'POST', title: 'Lanzamiento carta otoño', status: 'pub' }, { id: 'p2', account: 'EMPANADAS', time: '12:00', type: 'STORY', title: 'Promo del día', status: 'sent' }] },
    { day: 2, pieces: [{ id: 'p3', account: 'TALAMPAYA', time: '09:00', type: 'CARRUSEL', title: '5 tips para emprender', status: 'appr' }] },
    { day: 3, pieces: [{ id: 'p4', account: 'CAFAYATE', time: '19:30', type: 'REEL', title: 'Receta semanal #11', status: 'draft' }] },
    { day: 4, pieces: [] },
    { day: 5, muted: true, pieces: [] },
  ],
  [
    { day: 6, pieces: [{ id: 'p5', account: 'BSAS CO.', time: '11:00', type: 'POST', title: 'Cliente del mes — Rocío', status: 'pub' }] },
    { day: 7, pieces: [{ id: 'p6', account: 'PAMPERO', time: '10:00', type: 'CARRUSEL', title: 'Nueva colección invierno', status: 'appr' }, { id: 'p7', account: 'CASA MATE', time: '17:00', type: 'REEL', title: 'Cómo cebar mate', status: 'sent' }] },
    { day: 8, pieces: [{ id: 'p8', account: 'DON TITO', time: '20:00', type: 'STORY', title: 'Detrás de la parrilla', status: 'pub' }] },
    { day: 9, pieces: [{ id: 'p9', account: 'CAFAYATE', time: '19:00', type: 'POST', title: 'Cata de Malbec 2019', status: 'rej' }] },
    { day: 10, pieces: [{ id: 'p10', account: 'ÑANDÚ', time: '11:30', type: 'POST', title: 'Caso Mercado Central', status: 'appr' }, { id: 'p11', account: 'TALAMPAYA', time: '16:00', type: 'STORY', title: 'Tour por la planta', status: 'sent' }] },
    { day: 11, pieces: [{ id: 'p12', account: 'EMPANADAS', time: '13:00', type: 'REEL', title: 'Empanada de la semana', status: 'pub' }] },
    { day: 12, muted: true, pieces: [] },
  ],
  [
    { day: 13, pieces: [{ id: 'p13', account: 'DON TITO', time: '18:00', type: 'REEL', title: 'Apertura de temporada', status: 'sent' }] },
    { day: 14, pieces: [{ id: 'p14', account: 'PAMPERO', time: '12:00', type: 'POST', title: 'Editorial Pampero‑Pilar', status: 'appr' }] },
    { day: 15, pieces: [{ id: 'p15', account: 'BSAS CO.', time: '10:00', type: 'CARRUSEL', title: 'Guía de barrios — Palermo', status: 'pub' }, { id: 'p16', account: 'LA TORRE', time: '17:00', type: 'POST', title: 'Recomendación del mes', status: 'pub' }] },
    { day: 16, pieces: [{ id: 'p17', account: 'CAFAYATE', time: '19:30', type: 'REEL', title: 'Receta semanal #12', status: 'draft' }] },
    { day: 17, pieces: [{ id: 'p18', account: 'CASA MATE', time: '09:00', type: 'STORY', title: 'Café del día', status: 'appr' }, { id: 'p19', account: 'DON TITO', time: '21:00', type: 'POST', title: 'Reservas del fin de semana', status: 'sent' }] },
    { day: 18, pieces: [{ id: 'p20', account: 'EMPANADAS', time: '13:00', type: 'REEL', title: 'Empanada de la semana', status: 'pub' }] },
    { day: 19, muted: true, pieces: [] },
  ],
  [
    { day: 20, pieces: [{ id: 'p21', account: 'TALAMPAYA', time: '11:00', type: 'POST', title: 'Nuevo plan flexible', status: 'pub' }] },
    { day: 21, pieces: [{ id: 'p22', account: 'ÑANDÚ', time: '10:00', type: 'CARRUSEL', title: '3 errores de UX', status: 'appr' }] },
    { day: 22, pieces: [{ id: 'p23', account: 'CAFAYATE', time: '19:00', type: 'REEL', title: 'Vendimia 2026 — parte 1', status: 'pub' }, { id: 'p24', account: 'PAMPERO', time: '16:00', type: 'STORY', title: 'Behind the scenes', status: 'sent' }] },
    { day: 23, pieces: [{ id: 'p25', account: 'DON TITO', time: '20:00', type: 'POST', title: 'Vino del mes', status: 'appr' }] },
    { day: 24, pieces: [{ id: 'p26', account: 'BSAS CO.', time: '11:00', type: 'CARRUSEL', title: 'Top 10 cafés', status: 'pub' }, { id: 'p27', account: 'LA TORRE', time: '17:00', type: 'POST', title: 'Llegó: novelas argentinas', status: 'pub' }] },
    { day: 25, pieces: [{ id: 'p28', account: 'EMPANADAS', time: '13:00', type: 'REEL', title: 'Empanada de la semana', status: 'pub' }] },
    { day: 26, muted: true, pieces: [] },
  ],
  [
    { day: 27, today: true, pieces: [{ id: 'p29', account: 'EMPANADAS', time: '12:00', type: 'STORY', title: 'Promo viernes 2x1', status: 'sent' }, { id: 'p30', account: 'DON TITO', time: '18:00', type: 'REEL', title: 'Detrás de la barra', status: 'draft' }] },
    { day: 28, pieces: [{ id: 'p31', account: 'DON TITO', time: '18:00', type: 'REEL', title: 'Apertura de temporada', status: 'rej' }] },
    { day: 29, pieces: [{ id: 'p32', account: 'TALAMPAYA', time: '09:00', type: 'CARRUSEL', title: '5 tips para emprender', status: 'sent' }, { id: 'p33', account: 'CASA MATE', time: '17:00', type: 'STORY', title: 'Tarde de feriado', status: 'draft' }] },
    { day: 30, pieces: [{ id: 'p34', account: 'CAFAYATE', time: '19:30', type: 'REEL', title: 'Receta semanal #14', status: 'rej' }] },
    { day: 1, muted: true, pieces: [] },
    { day: 2, muted: true, pieces: [] },
    { day: 3, muted: true, pieces: [] },
  ],
]

const STATUS_COLORS: Record<string, string> = {
  draft: 'var(--status-draft)',
  sent: 'var(--status-sent)',
  appr: 'var(--status-approved)',
  pub: 'var(--status-published)',
  rej: 'var(--status-rejected)',
}

const ACCOUNTS_FILTER = ['Todas las cuentas', 'Don Tito', 'Empanadas del Norte', 'Talampaya', 'Vinos Cafayate']
const LEGEND = [
  { key: 'draft', label: 'Borrador', color: 'var(--status-draft)' },
  { key: 'sent', label: 'Enviada', color: 'var(--status-sent)' },
  { key: 'appr', label: 'Aprobada', color: 'var(--status-approved)' },
  { key: 'rej', label: 'Cambios', color: 'var(--status-rejected)' },
  { key: 'pub', label: 'Publicada', color: 'var(--status-published)' },
]

export function Calendar() {
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [accountFilter, setAccountFilter] = useState('Todas las cuentas')
  const navigate = useNavigate()

  function handlePieceClick(id: string) {
    setSelectedPiece(id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio Pampas', 'Calendario']}
        actions={
          <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>
            + Nueva pieza
          </button>
        }
      />

      {/* Calendar toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: '1px solid var(--line-1)', background: 'var(--bg-0)' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['‹', '›'].map((ch) => (
            <button
              key={ch}
              style={{ width: 28, height: 28, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: 14 }}
            >
              {ch}
            </button>
          ))}
        </div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>Abril 2026</h2>
        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Semana 17 · Hoy lun 27
        </span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'inline-flex', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: 2 }}>
          {['Mes', 'Semana', 'Lista'].map((v, i) => (
            <button key={v} style={{ background: i === 0 ? 'var(--bg-4)' : 'transparent', border: 0, color: i === 0 ? 'var(--fg-1)' : 'var(--fg-2)', padding: '5px 10px', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}>
              {v}
            </button>
          ))}
        </div>
        <button style={{ padding: '5px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
          Hoy
        </button>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '10px 24px', borderBottom: '1px solid var(--line-1)', fontSize: 12, color: 'var(--fg-3)' }}>
        {ACCOUNTS_FILTER.map((a) => (
          <button
            key={a}
            onClick={() => setAccountFilter(a)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              background: accountFilter === a ? 'var(--violet-soft)' : 'var(--bg-2)',
              border: `1px solid ${accountFilter === a ? 'transparent' : 'var(--line-2)'}`,
              borderRadius: 999,
              fontSize: 11,
              color: accountFilter === a ? 'var(--violet-400)' : 'var(--fg-2)',
              cursor: 'pointer',
            }}
          >
            {a}
          </button>
        ))}
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 999, fontSize: 11, color: 'var(--fg-2)', cursor: 'pointer' }}>
          + 14
        </button>
        <div style={{ flex: 1 }} />
        {LEGEND.map((l) => (
          <span key={l.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid var(--line-1)', flex: 1 }}>
        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d) => (
          <div
            key={d}
            style={{
              padding: '10px 12px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--fg-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              borderRight: '1px solid var(--line-1)',
              borderBottom: '1px solid var(--line-1)',
              background: 'var(--bg-1)',
            }}
          >
            {d}
          </div>
        ))}

        {WEEKS.flatMap((week) =>
          week.map((cell) => (
            <div
              key={`${cell.day}-${cell.muted}`}
              style={{
                minHeight: 132,
                padding: 8,
                borderRight: '1px solid var(--line-1)',
                borderBottom: '1px solid var(--line-1)',
                background: cell.muted ? 'var(--bg-1)' : cell.today ? 'var(--bg-0)' : 'var(--bg-0)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                cursor: 'cell',
                boxShadow: cell.today ? 'inset 2px 2px 0 var(--violet-500), inset -2px -2px 0 var(--violet-500)' : 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = cell.muted ? 'var(--bg-1)' : 'var(--bg-0)' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: cell.today ? 'var(--violet-400)' : cell.muted ? 'var(--fg-4)' : 'var(--fg-2)',
                  fontWeight: cell.today ? 600 : 400,
                  marginBottom: 2,
                }}
              >
                {cell.today ? `${cell.day} · HOY` : cell.day}
              </div>
              {cell.pieces.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePieceClick(p.id)}
                  style={{
                    padding: '5px 7px',
                    borderRadius: 4,
                    fontSize: 11.5,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    cursor: 'pointer',
                    borderLeft: `2px solid ${STATUS_COLORS[p.status]}`,
                    background: p.status === 'pub' ? 'var(--violet-soft)' : 'var(--bg-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    textAlign: 'left',
                    border: 'none',
                    borderLeftStyle: 'solid',
                    borderLeftWidth: 2,
                    borderLeftColor: STATUS_COLORS[p.status],
                    color: 'var(--fg-1)',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = p.status === 'pub' ? 'var(--violet-soft)' : 'var(--bg-2)' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9.5,
                      color: STATUS_COLORS[p.status],
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {p.account} · {p.time} · {p.type}
                  </div>
                  {p.title}
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      {selectedPiece && (
        <PieceDetailModal
          pieceId={selectedPiece}
          onClose={() => setSelectedPiece(null)}
          onNavigate={(dir) => {
            void navigate
            void dir
          }}
        />
      )}
    </div>
  )
}
