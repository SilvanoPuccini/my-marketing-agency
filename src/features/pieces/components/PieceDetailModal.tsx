import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface PieceDetailModalProps {
  pieceId: string
  onClose: () => void
  onNavigate: (dir: 'prev' | 'next') => void
}

const PIECE_DATA = {
  id: 'PZA · ABR‑0142',
  title: 'Reel — Apertura de temporada',
  status: 'rejected',
  statusLabel: 'Cambios pedidos',
  account: 'Parrilla Don Tito',
  format: 'Reel · 9:16',
  platform: 'Instagram + TikTok',
  date: 'LUN 28 ABR · 18:00',
  pauta: 'Sí · $24.000',
  version: 'v3 (de 3)',
  team: [
    { initials: 'CS', name: 'Camila Sosa', role: 'COPY' },
    { initials: 'MR', name: 'Mateo Rodríguez', role: 'DISEÑO' },
    { initials: 'JP', name: 'Juan P. Gómez', role: 'ACCOUNT' },
    { initials: 'RP', name: 'Rocío Paz', role: 'CLIENTE', violet: true },
  ],
  timeline: [
    { color: 'var(--status-rejected)', who: 'Rocío Paz', action: 'pidió cambios — "el plano de la entrada quedó muy oscuro"', when: 'HOY · 11:42' },
    { color: 'var(--status-sent)', who: 'Juan P. Gómez', action: 'envió v3 al cliente', when: 'HOY · 09:15' },
    { color: 'var(--fg-3)', who: 'Mateo Rodríguez', action: 'subió 3ra versión del montaje', when: 'AYER · 18:30' },
    { color: 'var(--status-rejected)', who: 'Rocío Paz', action: 'pidió cambios sobre v2', when: 'VIE 25 · 16:08' },
    { color: 'var(--fg-3)', who: 'Camila Sosa', action: 'creó la pieza', when: 'MIÉ 23 · 10:00' },
  ],
  comments: [
    { initials: 'RP', name: 'Rocío Paz', ts: 'HOY 11:42', text: 'El plano de la entrada quedó muy oscuro. ¿Pueden subir un poco la luz o usar la toma de la barra que mandé el viernes? El resto, ¡fuego!', violet: true },
    { initials: 'JP', name: 'Juan P. Gómez', ts: 'HOY 11:55', text: 'Anotado. Mateo, ¿podés re‑editar usando la toma de la barra? La tenemos en Drive / Don Tito / Abril / RAW.', violet: false },
    { initials: 'MR', name: 'Mateo Rodríguez', ts: 'HOY 12:10', text: 'Dale, lo tengo listo en 2 h. ¿Mantenemos la música o probamos algo más tranqui para que pegue con la luz cálida?', violet: false },
    { initials: 'CS', name: 'Camila Sosa', ts: 'HOY 12:18', text: 'Probá con algo instrumental. El copy ya quedó cerrado, no hace falta que toque nada.', violet: false },
  ],
}

function Avatar({ initials, violet, size = 24 }: { initials: string; violet?: boolean; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: violet ? 'var(--violet-soft)' : 'var(--bg-3)',
        border: `1px solid ${violet ? 'var(--violet-soft)' : 'var(--line-2)'}`,
        color: violet ? 'var(--violet-400)' : 'var(--fg-1)',
        fontSize: size < 24 ? 10 : 11,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

export function PieceDetailModal({ pieceId: _pieceId, onClose, onNavigate }: PieceDetailModalProps) {
  const p = PIECE_DATA

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate('prev')
      if (e.key === 'ArrowRight') onNavigate('next')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, onNavigate])

  const sectionStyle: React.CSSProperties = {
    padding: '16px 20px',
    borderBottom: '1px solid var(--line-1)',
  }

  const sectionH: React.CSSProperties = {
    margin: '0 0 12px',
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--fg-3)',
    fontWeight: 500,
  }

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5,5,9,0.72)',
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <article
        style={{
          position: 'fixed',
          top: 24,
          right: 24,
          bottom: 24,
          width: 'min(960px, calc(100vw - 48px))',
          background: 'var(--bg-1)',
          border: '1px solid var(--line-2)',
          borderRadius: 14,
          boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          zIndex: 50,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 20px',
            borderBottom: '1px solid var(--line-1)',
          }}
        >
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.id}</span>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>{p.title}</span>
          <span className={`pill pill-${p.status}`}><span className="dot" />{p.statusLabel}</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {(['‹', '›'] as const).map((ch, i) => (
              <button
                key={ch}
                onClick={() => onNavigate(i === 0 ? 'prev' : 'next')}
                style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
              >
                {ch}
              </button>
            ))}
          </div>
          <span className="kbd">ESC</span>
          <button
            onClick={onClose}
            style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
            title="Cerrar"
          >
            <X size={12} />
          </button>
        </header>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden' }}>
          {/* Left — media + copy */}
          <div
            style={{
              overflowY: 'auto',
              padding: 24,
              background: 'radial-gradient(60% 80% at 50% 0%, rgba(124,58,237,0.06), transparent 60%), var(--bg-1)',
            }}
          >
            {/* Media */}
            <div
              style={{
                aspectRatio: '9/16',
                maxHeight: '60vh',
                margin: '0 auto',
                background: 'repeating-linear-gradient(45deg, var(--bg-2) 0 12px, var(--bg-3) 12px 24px)',
                border: '1px solid var(--line-2)',
                borderRadius: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--fg-3)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  marginBottom: 12,
                  backdropFilter: 'blur(4px)',
                  fontSize: 18,
                }}
              >
                ▶
              </div>
              [ reel · 1080×1920 · 0:24 ]
            </div>

            {/* Thumbs */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
              {[true, false, false].map((active, i) => (
                <div
                  key={i}
                  style={{
                    width: 48,
                    height: 70,
                    borderRadius: 6,
                    background: 'var(--bg-3)',
                    border: `1px solid ${active ? 'var(--violet-500)' : 'var(--line-2)'}`,
                    boxShadow: active ? '0 0 0 2px var(--violet-soft)' : 'none',
                  }}
                />
              ))}
            </div>

            <h2 style={{ margin: '24px 0 6px', fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>
              Apertura de temporada — Don Tito
            </h2>
            <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>COPY · 142 CAR.</span>
              <span>HASHTAGS · 6</span>
              <span>EDIT · CAMILA SOSA</span>
            </div>

            <div
              style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--line-1)',
                borderRadius: 'var(--r-2)',
                padding: 14,
                fontSize: 13,
                lineHeight: 1.55,
                color: 'var(--fg-2)',
                marginTop: 12,
              }}
            >
              ¡Volvemos con todo! 🔥 Nueva carta, mismas brasas. Te esperamos en Palermo de miércoles
              a sábado desde las 19. Reservas por DM o al 11‑5547‑8821.
              <br />
              <br />
              <span style={{ color: 'var(--violet-400)' }}>
                #ParrillaPorteña #DonTito #AperturaDeTemporada #PalermoSoho #BuenosAires #ComerEnBA
              </span>
            </div>
          </div>

          {/* Right — info */}
          <aside
            style={{
              borderLeft: '1px solid var(--line-1)',
              background: 'var(--bg-1)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Detail */}
            <div style={sectionStyle}>
              <h4 style={sectionH}>Detalle</h4>
              {[
                ['Cuenta', p.account],
                ['Formato', p.format],
                ['Plataforma', p.platform],
                ['Publicación', p.date],
                ['Pauta', p.pauta],
                ['Versión', p.version],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{k}</span>
                  <span style={{ color: 'var(--fg-1)', fontFamily: k === 'Publicación' || k === 'Versión' ? 'var(--font-mono)' : 'inherit', fontSize: k === 'Publicación' || k === 'Versión' ? 12 : 13 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Team */}
            <div style={sectionStyle}>
              <h4 style={sectionH}>Equipo asignado</h4>
              {p.team.map((m) => (
                <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar initials={m.initials} violet={m.violet} size={22} />
                    {m.name}
                  </span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.role}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div style={sectionStyle}>
              <h4 style={sectionH}>Historial</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {p.timeline.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 999, marginTop: 6, flexShrink: 0, background: t.color }} />
                    <div>
                      <div style={{ fontSize: 12, lineHeight: 1.45 }}>
                        <span style={{ fontWeight: 500 }}>{t.who}</span> {t.action}
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 3, textTransform: 'uppercase' }}>{t.when}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div style={{ ...sectionStyle, flex: 1, minHeight: 0 }}>
              <h4 style={sectionH}>Comentarios · 4</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {p.comments.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <Avatar initials={c.initials} violet={c.violet} />
                    <div>
                      <div>
                        <span style={{ fontWeight: 500, fontSize: 12, color: c.violet ? 'var(--violet-400)' : 'var(--fg-1)' }}>{c.name}</span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', marginLeft: 6, textTransform: 'uppercase' }}>{c.ts}</span>
                      </div>
                      <div style={{ color: 'var(--fg-2)', fontSize: 12.5, lineHeight: 1.5, marginTop: 3 }}>{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Comment input */}
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                  padding: 12,
                  background: 'var(--bg-2)',
                  border: '1px solid var(--line-2)',
                  borderRadius: 'var(--r-2)',
                  marginTop: 12,
                }}
              >
                <Avatar initials="LF" violet size={24} />
                <textarea
                  placeholder="Escribí un comentario… @ para mencionar"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 0,
                    resize: 'none',
                    color: 'var(--fg-1)',
                    fontSize: 12.5,
                    outline: 'none',
                    minHeight: 48,
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 20px',
            borderTop: '1px solid var(--line-1)',
            background: 'var(--bg-1)',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {['Duplicar', 'Mover de fecha'].map((label) => (
              <button
                key={label}
                style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent', cursor: 'pointer' }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>v3 · GUARDADO HACE 14 MIN</span>
          <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
            Marcar como publicada
          </button>
          <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>
            Reenviar al cliente →
          </button>
        </footer>
      </article>
    </>
  )
}
