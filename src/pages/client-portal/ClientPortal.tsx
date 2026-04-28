import { Link } from 'react-router-dom'

const PENDING = [
  { kind: 'REEL', ratio: '9/16', title: 'Apertura de temporada', meta: 'REEL · LUN 28 ABR · 18:00', blurb: '"Volvemos con todo. Nueva carta, mismas brasas. Te esperamos en Palermo…"', version: 'v3 · 24 s', status: 'rejected', statusLabel: 'Cambios pedidos', play: true },
  { kind: 'POST', ratio: '1/1', title: 'Vino de la semana — Malbec 2021', meta: 'POST · MAR 29 ABR · 12:00', blurb: '"Para acompañar el bife de chorizo. Lo recomienda Tito en persona."', version: 'v1', status: 'sent', statusLabel: 'Para revisar', play: false },
  { kind: 'STORY', ratio: '9/16', title: 'Mesa libre esta noche', meta: 'STORY · MIÉ 30 ABR · 20:00', blurb: '"Quedan 2 mesas. Reservas por DM o al 11‑5547‑8821."', version: 'v1', status: 'sent', statusLabel: 'Para revisar', play: false },
]

const PUBLISHED = [
  { title: 'Reservas del fin de semana', meta: 'POST · DOM 26 ABR · 21:00 · INSTAGRAM', when: 'AYER' },
  { title: 'Detrás de la parrilla', meta: 'STORY · VIE 24 ABR · 20:00 · INSTAGRAM', when: 'VIE 24' },
  { title: 'Vino de la semana — Cabernet 2020', meta: 'POST · MAR 22 ABR · 12:00 · INSTAGRAM', when: 'MAR 22' },
  { title: 'Cómo se hace el bife de chorizo perfecto', meta: 'REEL · LUN 21 ABR · 19:00 · INSTAGRAM + TIKTOK', when: 'LUN 21' },
]

export function ClientPortal() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px' }}>
        {/* Hero block */}
        <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{
            background: 'radial-gradient(60% 80% at 100% 0%, rgba(124,58,237,0.10), transparent 60%), var(--bg-1)',
            border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 28,
          }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Hola Rocio
            </div>
            <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
              Hay 3 piezas esperando tu mirada.
            </h1>
            <p style={{ color: 'var(--fg-2)', margin: 0, maxWidth: 540 }}>
              Tu equipo de Estudio Pampas dejó listas las propuestas de esta semana. Tomate 5 minutos: aprobá lo que te guste, comentá lo que quieras cambiar.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <Link
                to="/portal/pieces/apr-0142"
                style={{ padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                Revisar la primera →
              </Link>
              <button style={{ padding: '9px 16px', fontSize: 13, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
                Ver el calendario completo
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h4 className="mono" style={{ margin: 0, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pendientes</h4>
              <div className="mono" style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--violet-400)', lineHeight: 1, marginTop: 4 }}>3</div>
              <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 13, marginTop: 4 }}>Piezas para que apruebes esta semana.</p>
            </div>
            <div style={{ height: 1, background: 'var(--line-1)' }} />
            {[
              { l: 'Aprobadas este mes', v: '9' },
              { l: 'Publicadas', v: '7' },
              { l: 'Próxima publicación', v: 'LUN 28 · 18:00' },
            ].map((kv) => (
              <div key={kv.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--fg-3)' }}>{kv.l}</span>
                <span className="mono">{kv.v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pending approval */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '32px 0 16px' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>Esperando tu aprobación</h2>
          <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>3 piezas · ordenadas por fecha de publicación</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {PENDING.map((p) => (
            <Link
              key={p.title}
              to="/portal/pieces/apr-0142"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--line-3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-1)' }}
              >
                <div style={{
                  aspectRatio: p.ratio,
                  background: 'repeating-linear-gradient(45deg, var(--bg-2) 0 12px, var(--bg-3) 12px 24px)',
                  borderBottom: '1px solid var(--line-1)',
                  display: 'grid', placeItems: 'center',
                  color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.06em', position: 'relative',
                }}>
                  <span style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span className={`pill pill-${p.status}`}><span className="dot" />{p.statusLabel}</span>
                  </span>
                  {p.play && (
                    <div style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center', color: '#fff' }}>▶</div>
                  )}
                  {!p.play && <span>[{p.kind}]</span>}
                </div>
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.meta}</div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.title}</h3>
                  <div style={{ color: 'var(--fg-2)', fontSize: 12.5, lineHeight: 1.45 }}>{p.blurb}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-2)', fontSize: 12, color: 'var(--fg-2)' }}>
                  <span>{p.version}</span>
                  <span style={{ color: 'var(--violet-400)', fontWeight: 500 }}>Revisar →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Published */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '32px 0 16px' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>Lo último publicado</h2>
          <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>Tu equipo cerró estas piezas en los últimos 7 días.</span>
        </div>

        <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
          {PUBLISHED.map((p) => (
            <div
              key={p.title}
              style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto auto', gap: 14, alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--line-1)', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 6, background: 'repeating-linear-gradient(45deg, var(--bg-3) 0 6px, var(--bg-4) 6px 12px)', border: '1px solid var(--line-1)' }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>{p.meta}</div>
              </div>
              <span className="pill pill-published"><span className="dot" />Publicada</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{p.when}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: 20, borderTop: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--fg-3)', fontSize: 12 }}>
          <span>¿Algo no cierra? Hablale a tu account, <strong style={{ color: 'var(--fg-2)' }}>Juan Pablo</strong> · jp@estudiopampas.com.ar</span>
          <span className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>VISTA DE CLIENTE · ESTUDIO PAMPAS</span>
        </div>
      </div>
    </div>
  )
}
