import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClientPieces } from '@/features/client-portal/hooks/useClientPieces'
import { useAuthStore } from '@/stores/auth.store'
import { QuotaBanner } from '@/features/client-portal/components/QuotaBanner'
import { STATUS_LABELS, formatDateWithTime } from '@/lib/utils'
import { Pagination, usePaginated } from '@/components/ui/Pagination'

function formatPublished(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'HOY'
  if (d.toDateString() === yesterday.toDateString()) return 'AYER'
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).toUpperCase().replace('.', '')
}

export function ClientPortal() {
  const { user } = useAuthStore()
  const { data, isLoading } = useClientPieces(user?.id)
  const [pubPage, setPubPage] = useState(1)

  const firstName = user?.full_name?.split(' ')[0] ?? 'Cliente'
  const pendingCount = data?.pendingCount ?? 0
  const approvedCount = data?.approvedCount ?? 0
  const publishedCount = data?.publishedCount ?? 0
  const nextPiece = data?.pending[0]
  const pubPaged = usePaginated(data?.published ?? [], 5, pubPage)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      <div className="client-portal-content" style={{ maxWidth: 1080, margin: '0 auto', padding: '32px' }}>
        {isLoading ? (
          <div style={{ color: 'var(--fg-3)', fontSize: 14, padding: '60px 0', textAlign: 'center' }}>
            Cargando tu portal…
          </div>
        ) : (
          <>
            <QuotaBanner />

            {/* Hero block */}
            <section className="client-hero-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{
                background: 'radial-gradient(60% 80% at 100% 0%, rgba(124,58,237,0.10), transparent 60%), var(--bg-1)',
                border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 28,
              }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                  Hola, {firstName}
                </div>
                <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
                  {pendingCount > 0
                    ? `Hay ${pendingCount} pieza${pendingCount !== 1 ? 's' : ''} esperando tu mirada.`
                    : '¡Estás al día! No hay piezas pendientes.'}
                </h1>
                <p style={{ color: 'var(--fg-2)', margin: 0, maxWidth: 540 }}>
                  {pendingCount > 0
                    ? 'Tu equipo dejó listas las propuestas. Tomate 5 minutos: aprobá lo que te guste, comentá lo que quieras cambiar.'
                    : 'Tu equipo está trabajando en las próximas entregas. Te avisamos en cuanto haya algo nuevo para revisar.'}
                </p>
                {pendingCount > 0 && nextPiece && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <Link
                      to={`/portal/pieces/${nextPiece.id}`}
                      style={{ padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                    >
                      Revisar la primera →
                    </Link>
                  </div>
                )}
              </div>

              <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h4 className="mono" style={{ margin: 0, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pendientes</h4>
                  <div className="mono" style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--violet-400)', lineHeight: 1, marginTop: 4 }}>
                    {pendingCount}
                  </div>
                  <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 13, marginTop: 4 }}>
                    {pendingCount === 1 ? 'Pieza para que apruebes.' : 'Piezas para que apruebes.'}
                  </p>
                </div>
                <div style={{ height: 1, background: 'var(--line-1)' }} />
                {[
                  { l: 'Aprobadas este mes', v: String(approvedCount) },
                  { l: 'Publicadas',          v: String(publishedCount) },
                  { l: 'Próxima publicación',  v: nextPiece ? formatDateWithTime(nextPiece.scheduled_date, nextPiece.scheduled_time) : '—' },
                ].map((kv) => (
                  <div key={kv.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--fg-3)' }}>{kv.l}</span>
                    <span className="mono">{kv.v}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Pending approval */}
            {data && data.pending.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '32px 0 16px' }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>Esperando tu aprobación</h2>
                  <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>
                    {data.pending.length} pieza{data.pending.length !== 1 ? 's' : ''} · ordenadas por fecha
                  </span>
                </div>

                <div className="client-pieces-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                  {data.pending.map((p) => (
                    <Link
                      key={p.id}
                      to={`/portal/pieces/${p.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div
                        style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--line-3)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line-1)' }}
                      >
                        <div style={{
                          aspectRatio: '1/1',
                          background: p.thumbnail_url ? `url(${p.thumbnail_url}) center/cover no-repeat` : 'repeating-linear-gradient(45deg, var(--bg-2) 0 12px, var(--bg-3) 12px 24px)',
                          borderBottom: '1px solid var(--line-1)',
                          display: 'grid', placeItems: 'center', overflow: 'hidden',
                          color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 10,
                          textTransform: 'uppercase', letterSpacing: '0.06em', position: 'relative',
                        }}>
                          <span style={{ position: 'absolute', top: 10, left: 10 }}>
                            <span className={`pill pill-${p.status}`}><span className="dot" />{STATUS_LABELS[p.status] ?? p.status}</span>
                          </span>
                          {!p.thumbnail_url && (p.type === 'reel' || p.type === 'story') && (
                            <div style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center', color: '#fff' }}>▶</div>
                          )}
                          {!p.thumbnail_url && p.type !== 'reel' && p.type !== 'story' && <span>[{p.type.toUpperCase()}]</span>}
                        </div>
                        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {p.type.toUpperCase()} · {formatDateWithTime(p.scheduled_date, p.scheduled_time)}
                          </div>
                          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.title}</h3>
                          {p.copy && (
                            <div style={{ color: 'var(--fg-2)', fontSize: 12.5, lineHeight: 1.45 }}>
                              "{p.copy.slice(0, 80)}{p.copy.length > 80 ? '…' : ''}"
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-2)', fontSize: 12, color: 'var(--fg-2)' }}>
                          <span className="mono" style={{ fontSize: 10 }}>{p.platform ?? '—'}</span>
                          <span style={{ color: 'var(--violet-400)', fontWeight: 500 }}>Revisar →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Published */}
            {data && data.published.length > 0 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '32px 0 16px' }}>
                  <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>Lo último publicado</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>{data.published.length} pieza{data.published.length !== 1 ? 's' : ''}</span>
                    <Pagination page={pubPaged.safePage} totalPages={pubPaged.totalPages} onPrev={() => setPubPage(p => Math.max(1, p - 1))} onNext={() => setPubPage(p => p + 1)} />
                  </div>
                </div>

                <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
                  {pubPaged.paged.map((p) => (
                    <Link
                      key={p.id}
                      to={`/portal/pieces/${p.id}`}
                      className="client-published-row"
                      style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto auto', gap: 14, alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--line-1)', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <div className="client-pub-thumb" style={{
                        width: 36, height: 36, borderRadius: 6,
                        background: p.thumbnail_url ? `url(${p.thumbnail_url}) center/cover no-repeat` : 'repeating-linear-gradient(45deg, var(--bg-3) 0 6px, var(--bg-4) 6px 12px)',
                        border: '1px solid var(--line-1)',
                      }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 3 }}>
                          {p.type.toUpperCase()} · {formatDateWithTime(p.scheduled_date, p.scheduled_time)}{p.platform ? ` · ${p.platform.toUpperCase()}` : ''}
                        </div>
                      </div>
                      <span className="pill pill-published"><span className="dot" />Publicada</span>
                      <span className="client-pub-date mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                        {formatPublished(p.scheduled_date)}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div style={{ marginTop: 48, padding: 20, borderTop: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--fg-3)', fontSize: 12 }}>
              <span>¿Algo no cierra? Hablale a tu account manager.</span>
              <span className="mono" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>VISTA DE CLIENTE</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
