import { useState } from 'react'
import { Link } from 'react-router-dom'

const COMMENTS = [
  { initials: 'RP', isClient: true, who: 'Vos', ts: 'VIE 25 · 16:08', text: 'El primer plano quedó muy oscuro. ¿Pueden levantar la luz o usar la toma de la barra?' },
  { initials: 'JP', isClient: false, who: 'Juan Pablo · Estudio Pampas', ts: 'VIE 25 · 17:22', text: 'Anotado, Rocío. Mateo lo re‑edita con la toma de la barra. Te lo mandamos lunes a la mañana.' },
  { initials: 'MR', isClient: false, who: 'Mateo · Estudio Pampas', ts: 'HOY · 09:14', text: 'Acá va v3 con la luz corregida y música instrumental más cálida. Cualquier cosa, gritame.' },
  { initials: 'RP', isClient: true, who: 'Vos', ts: 'HOY · 11:30', text: 'Ahí lo veo. Te confirmo en un rato.' },
]

const KV_DETAILS = [
  { k: 'Plataforma', v: 'Instagram + TikTok' },
  { k: 'Formato', v: 'Reel · 9:16 · 24 s' },
  { k: 'Programado', v: 'LUN 28 ABR · 18:00', mono: true },
  { k: 'Pauta sugerida', v: '$24.000 · 3 días' },
  { k: 'Editado por', v: 'Camila Sosa · Mateo Rodríguez' },
]

const VERSIONS = ['v3 · actual', 'v2', 'v1']

export function ClientApproval() {
  const [activeVersion, setActiveVersion] = useState('v3 · actual')
  const [comment, setComment] = useState('')
  const [approved, setApproved] = useState(false)
  const [rejected, setRejected] = useState(false)

  const panel: React.CSSProperties = {
    background: 'var(--bg-1)',
    border: '1px solid var(--line-1)',
    borderRadius: 'var(--r-3)',
  }

  const panelH: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 18px', borderBottom: '1px solid var(--line-1)',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 32px 64px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-3)', fontSize: 13, marginBottom: 16 }}>
          <Link to="/portal" style={{ color: 'var(--fg-3)', textDecoration: 'none' }}>Tu mes</Link>
          <span style={{ color: 'var(--fg-4)' }}>/</span>
          <span style={{ color: 'var(--fg-1)' }}>Apertura de temporada</span>
        </div>

        {/* Review header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <span className="pill pill-sent" style={{ marginBottom: 12 }}><span className="dot" />Para tu revisión · v3</span>
            <h1 style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em' }}>Apertura de temporada</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--fg-2)', fontSize: 14 }}>Reel · Instagram + TikTok · publicación programada lunes 28 de abril, 18:00.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PIEZA 1 DE 3</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'flex-end' }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 26, height: 4, borderRadius: 999, background: i === 0 ? 'var(--violet-500)' : 'var(--bg-3)' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
              <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent', cursor: 'pointer' }}>‹ Anterior</button>
              <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Siguiente ›</button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'flex-start' }}>
          {/* Media side — sticky */}
          <section style={{ background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 20, position: 'sticky', top: 80 }}>
            {/* Version + ratio tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {VERSIONS.map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveVersion(v)}
                  className="mono"
                  style={{
                    padding: '5px 10px', fontSize: 10, borderRadius: 'var(--r-1)',
                    border: '1px solid var(--line-2)', textTransform: 'uppercase', letterSpacing: '0.06em',
                    cursor: 'pointer',
                    background: activeVersion === v ? 'var(--violet-soft)' : 'transparent',
                    borderColor: activeVersion === v ? 'transparent' : 'var(--line-2)',
                    color: activeVersion === v ? 'var(--violet-400)' : 'var(--fg-3)',
                  }}
                >
                  {v}
                </button>
              ))}
              <div style={{ flex: 1 }} />
              {['9:16', '1:1 preview'].map((r) => (
                <button key={r} className="mono" style={{ padding: '5px 10px', fontSize: 10, borderRadius: 'var(--r-1)', border: '1px solid var(--line-2)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer', background: 'transparent', color: 'var(--fg-3)' }}>
                  {r}
                </button>
              ))}
            </div>

            {/* Media placeholder */}
            <div style={{
              aspectRatio: '9/16', maxWidth: 360, margin: '0 auto',
              background: 'repeating-linear-gradient(45deg, var(--bg-2) 0 12px, var(--bg-3) 12px 24px)',
              border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.06em', position: 'relative',
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center', color: '#fff', marginBottom: 12, backdropFilter: 'blur(4px)' }}>▶</div>
              [ reel · 1080×1920 · 0:24 ]
            </div>

            {/* Scrubber */}
            <div style={{ maxWidth: 360, margin: '14px auto 0', height: 6, background: 'var(--bg-3)', borderRadius: 999, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '32%', background: 'var(--violet-500)', borderRadius: 999 }} />
            </div>
            <div className="mono" style={{ maxWidth: 360, margin: '6px auto 0', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)' }}>
              <span>0:08</span><span>0:24</span>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Descargar borrador</button>
              <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Ver en pantalla completa</button>
            </div>
          </section>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Decision card */}
            <div style={{
              background: 'radial-gradient(60% 80% at 100% 0%, rgba(124,58,237,0.10), transparent 60%), var(--bg-1)',
              border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 20,
              ...(approved ? { borderColor: 'var(--status-approved)' } : rejected ? { borderColor: 'var(--status-rejected)' } : {}),
            }}>
              <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>
                {approved ? '¡Aprobado!' : rejected ? 'Cambios solicitados.' : '¿Te parece bien para publicar?'}
              </h3>
              <p style={{ margin: '0 0 16px', color: 'var(--fg-2)', fontSize: 13 }}>
                {approved
                  ? 'La pieza fue aprobada. El equipo la programará para la fecha indicada.'
                  : rejected
                    ? 'El equipo ya fue notificado y tomará tus comentarios.'
                    : 'Si necesitás cambios, dejalos como comentario abajo y tu equipo los toma. Si todo cierra, aprobamos y se programa solo.'}
              </p>
              {!approved && !rejected && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setRejected(true)}
                    style={{ flex: 1, padding: 12, fontSize: 14, borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', color: 'var(--fg-1)', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Pedir cambios
                  </button>
                  <button
                    onClick={() => setApproved(true)}
                    style={{ flex: 1, padding: 12, fontSize: 14, borderRadius: 'var(--r-2)', border: '1px solid var(--status-approved)', background: 'var(--status-approved)', color: '#062a1d', cursor: 'pointer', fontWeight: 600 }}
                  >
                    ✓ Aprobar pieza
                  </button>
                </div>
              )}
              {!approved && !rejected && (
                <div className="mono" style={{ display: 'flex', gap: 8, marginTop: 16, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', alignItems: 'center' }}>
                  <span className="kbd">A</span> aprobar &nbsp;·&nbsp;
                  <span className="kbd">C</span> pedir cambios &nbsp;·&nbsp;
                  <span className="kbd">→</span> siguiente
                </div>
              )}
            </div>

            {/* Caption */}
            <section style={panel}>
              <div style={panelH}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Texto que va con la pieza</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>142 CARACT.</span>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-1)', background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-2)', padding: 16 }}>
                  ¡Volvemos con todo! Nueva carta, mismas brasas. Te esperamos en Palermo de miércoles a sábado desde las 19. Reservas por DM o al 11‑5547‑8821.
                  <br /><br />
                  <span style={{ color: 'var(--violet-400)' }}>#ParrillaPorteña #DonTito #AperturaDeTemporada #PalermoSoho #BuenosAires #ComerEnBA</span>
                </div>
                <div className="mono" style={{ marginTop: 14, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
                  ⎘ Copiar texto
                </div>
              </div>
            </section>

            {/* Piece details */}
            <section style={panel}>
              <div style={panelH}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Detalle de la pieza</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PZA · ABR‑0142</span>
              </div>
              <div style={{ padding: '16px 18px' }}>
                {KV_DETAILS.map((kv) => (
                  <div key={kv.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: 13, borderBottom: '1px dashed var(--line-1)' }}>
                    <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{kv.k}</span>
                    <span className={kv.mono ? 'mono' : ''} style={kv.mono ? { fontSize: 12 } : {}}>{kv.v}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Comment thread */}
            <section style={panel}>
              <div style={panelH}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Conversación · 4</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CON TU EQUIPO</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '16px 18px' }}>
                {COMMENTS.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.isClient ? 'var(--violet-soft)' : 'var(--bg-3)', border: `1px solid ${c.isClient ? 'var(--violet-soft)' : 'var(--line-2)'}`, color: c.isClient ? 'var(--violet-400)' : 'var(--fg-1)', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                      {c.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                        <span style={{ fontWeight: 500, fontSize: 12.5, color: c.isClient ? 'var(--violet-400)' : 'var(--fg-1)' }}>{c.who}</span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.ts}</span>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--fg-2)' }}>{c.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ margin: '0 18px 18px', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: 12, display: 'flex', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--violet-soft)', border: '1px solid var(--violet-soft)', color: 'var(--violet-400)', fontSize: 10, fontWeight: 600, flexShrink: 0 }}>RP</div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribí un comentario o pedido de cambio…"
                  style={{ flex: 1, background: 'transparent', border: 0, resize: 'vertical', minHeight: 56, color: 'var(--fg-1)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                />
                <button style={{ alignSelf: 'flex-end', padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-3)', cursor: 'pointer' }}>
                  Enviar
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
