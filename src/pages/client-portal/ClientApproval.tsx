import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePiece, useUpdatePieceStatus, useAddComment } from '@/features/pieces/hooks/usePiece'
import { useCommentsRealtime } from '@/features/pieces/hooks/useCommentsRealtime'
import { useAuthStore } from '@/stores/auth.store'
import { mkInitials } from '@/lib/utils'

const TYPE_RATIO: Record<string, string> = {
  post: '1/1', reel: '9/16', story: '9/16', carrusel: '1/1', ad: '1/1', blog: '1/1',
}

function formatDateFull(dateStr: string, timeStr: string | null): string {
  const d = new Date(dateStr + 'T00:00:00')
  const wd = d.toLocaleDateString('es-AR', { weekday: 'long' })
  const day = d.getDate()
  const mo = d.toLocaleDateString('es-AR', { month: 'long' })
  const time = timeStr?.slice(0, 5) ?? '--:--'
  return `${wd} ${day} de ${mo}, ${time}`
}

function formatTs(isoStr: string): string {
  const d = new Date(isoStr)
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const time = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === now.toDateString()) return `HOY ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `AYER ${time}`
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).toUpperCase().replace('.', '') + ` · ${time}`
}

const panel: React.CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)',
}

const panelH: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 18px', borderBottom: '1px solid var(--line-1)',
}

export function ClientApproval() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { data: piece, isLoading } = usePiece(id ?? null)
  const updateStatus = useUpdatePieceStatus()
  const addComment = useAddComment()
  useCommentsRealtime(id ?? null)

  const [comment, setComment] = useState('')
  const [localStatus, setLocalStatus] = useState<string | null>(null)

  useEffect(() => {
    if (piece) setLocalStatus(piece.status)
  }, [piece?.status])

  const status = localStatus ?? piece?.status ?? 'sent_client'
  const approved = status === 'approved'
  const rejected = status === 'rejected'

  const userInitials = user?.initials ?? '?'
  const isClient = user?.role === 'client'

  function handleApprove() {
    if (!id) return
    updateStatus.mutate({ id, status: 'approved', currentStatus: status }, { onSuccess: () => setLocalStatus('approved') })
  }

  function handleReject() {
    if (!id) return
    const reason = comment.trim() || undefined
    updateStatus.mutate(
      { id, status: 'rejected', currentStatus: status, rejection_reason: reason },
      {
        onSuccess: () => {
          setLocalStatus('rejected')
          // If there was a comment, also post it as a comment
          if (reason) {
            addComment.mutate({ pieceId: id, content: reason }, { onSuccess: () => setComment('') })
          }
        },
      },
    )
  }

  function handleSendComment() {
    const content = comment.trim()
    if (!content || !id) return
    addComment.mutate({ pieceId: id, content }, { onSuccess: () => setComment('') })
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT') return
      if (e.key === 'a' || e.key === 'A') handleApprove()
      if (e.key === 'c' || e.key === 'C') handleReject()
    }
    if (!approved && !rejected) {
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
  }, [approved, rejected, id])

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-0)', display: 'grid', placeItems: 'center', color: 'var(--fg-3)' }}>
        Cargando pieza…
      </div>
    )
  }

  if (!piece) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-0)', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--fg-3)' }}>
          <div style={{ fontSize: 16, marginBottom: 12 }}>Pieza no encontrada.</div>
          <Link to="/portal" style={{ color: 'var(--violet-400)', textDecoration: 'none' }}>← Volver al portal</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-0)' }}>
      <main className="client-approval-content" style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 32px 64px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--fg-3)', fontSize: 13, marginBottom: 16 }}>
          <Link to="/portal" style={{ color: 'var(--fg-3)', textDecoration: 'none' }}>Tu mes</Link>
          <span style={{ color: 'var(--fg-4)' }}>/</span>
          <span style={{ color: 'var(--fg-1)' }}>{piece.title}</span>
        </div>

        {/* Review header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
          <div>
            <span className={`pill pill-${status}`} style={{ marginBottom: 12 }}>
              <span className="dot" />
              {status === 'sent_client' ? 'Para tu revisión' : status === 'approved' ? 'Aprobada' : status === 'rejected' ? 'Cambios pedidos' : status === 'published' ? 'Publicada' : status}
            </span>
            <h1 style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em' }}>{piece.title}</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--fg-2)', fontSize: 14 }}>
              {piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}
              {piece.platform ? ` · ${piece.platform}` : ''}
              {piece.scheduled_date ? ` · programado para el ${formatDateFull(piece.scheduled_date, piece.scheduled_time)}` : ''}
            </p>
          </div>
        </div>

        <div className="client-approval-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'flex-start' }}>
          {/* Media side */}
          <section className="client-approval-media" style={{ background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 20, position: 'sticky', top: 80 }}>
            {/* Media */}
            {(() => {
              const files = piece.piece_files ?? []
              const firstFile = files[0]
              const isImage = firstFile?.file_type?.startsWith('image/')
              const isVideo = firstFile?.file_type?.startsWith('video/')

              if (firstFile && isImage) {
                return (
                  <img
                    src={firstFile.file_url}
                    alt={firstFile.file_name}
                    style={{ width: '100%', maxWidth: 360, margin: '0 auto', display: 'block', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', objectFit: 'contain', background: 'var(--bg-2)' }}
                  />
                )
              }
              if (firstFile && isVideo) {
                return (
                  <video
                    src={firstFile.file_url}
                    controls
                    style={{ width: '100%', maxWidth: 360, margin: '0 auto', display: 'block', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)' }}
                  />
                )
              }
              return (
                <div style={{
                  aspectRatio: TYPE_RATIO[piece.type] ?? '1/1', maxWidth: 360, margin: '0 auto',
                  background: 'repeating-linear-gradient(45deg, var(--bg-2) 0 12px, var(--bg-3) 12px 24px)',
                  border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Sin archivos subidos
                </div>
              )
            })()}
          </section>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Decision card — only for clients, only in review states */}
            {isClient && status !== 'published' && (
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
                      ? 'El equipo fue notificado y tomará tus comentarios.'
                      : 'Si necesitás cambios, dejalos como comentario abajo. Si todo cierra, aprobamos y se programa solo.'}
                </p>
                {!approved && !rejected && (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={handleReject}
                      disabled={updateStatus.isPending}
                      style={{ flex: 1, padding: 12, fontSize: 14, borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', color: 'var(--fg-1)', cursor: 'pointer', fontWeight: 500 }}
                    >
                      Pedir cambios
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={updateStatus.isPending}
                      style={{ flex: 1, padding: 12, fontSize: 14, borderRadius: 'var(--r-2)', border: '1px solid var(--status-approved)', background: 'var(--status-approved)', color: '#062a1d', cursor: 'pointer', fontWeight: 600 }}
                    >
                      ✓ Aprobar pieza
                    </button>
                  </div>
                )}
                {!approved && !rejected && (
                  <div className="mono" style={{ display: 'flex', gap: 8, marginTop: 16, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', alignItems: 'center' }}>
                    <span className="kbd">A</span> aprobar &nbsp;·&nbsp;
                    <span className="kbd">C</span> pedir cambios
                  </div>
                )}
              </div>
            )}

            {/* Caption / copy */}
            {piece.copy && (
              <section style={panel}>
                <div style={panelH}>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Texto que va con la pieza</h3>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {piece.copy.length} CARACT.
                  </span>
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-1)', background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-2)', padding: 16, whiteSpace: 'pre-wrap' }}>
                    {piece.copy}
                  </div>
                </div>
              </section>
            )}

            {/* Piece details */}
            <section style={panel}>
              <div style={panelH}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Detalle de la pieza</h3>
              </div>
              <div style={{ padding: '16px 18px' }}>
                {[
                  { k: 'Plataforma', v: piece.platform ?? '—' },
                  { k: 'Formato', v: piece.type },
                  { k: 'Programado', v: formatDateFull(piece.scheduled_date, piece.scheduled_time), mono: true },
                  { k: 'Pauta sugerida', v: piece.has_pauta ? `$${piece.pauta_amount?.toLocaleString('es-AR') ?? '—'}` : 'Sin pauta' },
                ].map((kv) => (
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
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Conversación · {piece.comments.length}</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>CON TU EQUIPO</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '16px 18px' }}>
                {piece.comments.length === 0 && (
                  <div style={{ color: 'var(--fg-3)', fontSize: 13 }}>Sin comentarios todavía.</div>
                )}
                {piece.comments.map((c) => {
                  const isMe = c.author_id === user?.id
                  return (
                    <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isMe ? 'var(--violet-soft)' : 'var(--bg-3)',
                        border: `1px solid ${isMe ? 'var(--violet-soft)' : 'var(--line-2)'}`,
                        color: isMe ? 'var(--violet-400)' : 'var(--fg-1)',
                        fontSize: 10, fontWeight: 600, flexShrink: 0,
                      }}>
                        {mkInitials(c.users?.full_name ?? '?')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                          <span style={{ fontWeight: 500, fontSize: 12.5, color: isMe ? 'var(--violet-400)' : 'var(--fg-1)' }}>
                            {isMe ? 'Vos' : c.users?.full_name ?? '—'}
                          </span>
                          <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {formatTs(c.created_at)}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--fg-2)' }}>{c.content}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ margin: '0 18px 18px', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: 12, display: 'flex', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--violet-soft)', border: '1px solid var(--violet-soft)', color: 'var(--violet-400)',
                  fontSize: 10, fontWeight: 600, flexShrink: 0,
                }}>
                  {userInitials}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribí un comentario o pedido de cambio…"
                  style={{ flex: 1, background: 'transparent', border: 0, resize: 'vertical', minHeight: 56, color: 'var(--fg-1)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                />
                <button
                  onClick={handleSendComment}
                  disabled={!comment.trim() || addComment.isPending}
                  style={{ alignSelf: 'flex-end', padding: '6px 10px', fontSize: 12, color: comment.trim() ? '#fff' : 'var(--fg-3)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: comment.trim() ? 'var(--violet-500)' : 'var(--bg-3)', cursor: comment.trim() ? 'pointer' : 'not-allowed' }}
                >
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
