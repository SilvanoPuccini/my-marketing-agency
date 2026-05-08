import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { usePiece, useUpdatePieceStatus, useAddComment } from '@/features/pieces/hooks/usePiece'
import { useCommentsRealtime } from '@/features/pieces/hooks/useCommentsRealtime'
import { useAuthStore } from '@/stores/auth.store'

const STATUS_LABELS: Record<string, string> = {
  draft:       'Borrador',
  sent_client: 'Enviada al cliente',
  approved:    'Aprobada',
  rejected:    'Cambios pedidos',
  published:   'Publicada',
}

const TYPE_LABELS: Record<string, string> = {
  post:     'Post · 1:1',
  reel:     'Reel · 9:16',
  story:    'Story · 9:16',
  ad:       'Aviso',
  blog:     'Blog',
  carrusel: 'Carrusel · 1:1',
}

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

function formatDate(dateStr: string, timeStr: string | null): string {
  const d = new Date(dateStr + 'T00:00:00')
  const wd = d.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase().replace('.', '')
  const day = d.getDate()
  const mo = d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase().replace('.', '')
  const time = timeStr?.slice(0, 5) ?? '--:--'
  return `${wd} ${day} ${mo} · ${time}`
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

function formatUpdatedAt(isoStr: string): string {
  const d = new Date(isoStr)
  const diff = Math.floor((Date.now() - d.getTime()) / 60000)
  if (diff < 1) return 'GUARDADO AHORA'
  if (diff < 60) return `GUARDADO HACE ${diff} MIN`
  if (diff < 1440) return `GUARDADO HACE ${Math.floor(diff / 60)} H`
  return `GUARDADO EL ${d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).toUpperCase().replace('.', '')}`
}

function Avatar({ init, violet, size = 24 }: { init: string; violet?: boolean; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: violet ? 'var(--violet-soft)' : 'var(--bg-3)',
        border: `1px solid ${violet ? 'var(--violet-soft)' : 'var(--line-2)'}`,
        color: violet ? 'var(--violet-400)' : 'var(--fg-1)',
        fontSize: size < 24 ? 10 : 11, fontWeight: 600, flexShrink: 0,
      }}
    >
      {init}
    </div>
  )
}

interface PieceDetailModalProps {
  pieceId: string
  onClose: () => void
  onNavigate?: (dir: 'prev' | 'next') => void
}

export function PieceDetailModal({ pieceId, onClose, onNavigate }: PieceDetailModalProps) {
  const { user } = useAuthStore()
  const { data: piece, isLoading } = usePiece(pieceId)
  const updateStatus = useUpdatePieceStatus()
  const addComment = useAddComment()
  useCommentsRealtime(pieceId)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate?.('prev')
      if (e.key === 'ArrowRight') onNavigate?.('next')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, onNavigate])

  function handleSendComment() {
    const content = commentText.trim()
    if (!content) return
    addComment.mutate({ pieceId, content }, { onSuccess: () => setCommentText('') })
  }

  function handleResend() {
    updateStatus.mutate({ id: pieceId, status: 'sent_client', currentStatus: status })
  }

  function handleMarkPublished() {
    updateStatus.mutate({ id: pieceId, status: 'published', currentStatus: status })
  }

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

  const status = piece?.status ?? 'draft'
  const userInitials = user?.initials ?? '?'

  return (
    <>
      {/* Scrim */}
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,9,0.72)', zIndex: 40 }}
      />

      {/* Modal */}
      <motion.article
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'fixed', top: 24, right: 24, bottom: 24,
          width: 'min(960px, calc(100vw - 48px))',
          background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 14,
          boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
          display: 'grid', gridTemplateRows: 'auto 1fr auto',
          zIndex: 50, overflow: 'hidden',
        }}
      >
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--line-1)' }}>
          {isLoading ? (
            <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>Cargando…</span>
          ) : (
            <>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {piece?.type?.toUpperCase() ?? '—'}
              </span>
              <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>{piece?.title}</span>
              <span className={`pill pill-${status}`}><span className="dot" />{STATUS_LABELS[status] ?? status}</span>
            </>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 4 }}>
            {(['‹', '›'] as const).map((ch, i) => (
              <button
                key={ch}
                onClick={() => onNavigate?.(i === 0 ? 'prev' : 'next')}
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
          >
            <X size={12} />
          </button>
        </header>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden' }}>
          {/* Left — media + copy */}
          <div style={{ overflowY: 'auto', padding: 24, background: 'radial-gradient(60% 80% at 50% 0%, rgba(124,58,237,0.06), transparent 60%), var(--bg-1)' }}>
            {/* Media placeholder */}
            <div
              style={{
                aspectRatio: piece?.type === 'post' || piece?.type === 'carrusel' ? '1/1' : '9/16',
                maxHeight: '60vh', margin: '0 auto',
                background: 'repeating-linear-gradient(45deg, var(--bg-2) 0 12px, var(--bg-3) 12px 24px)',
                border: '1px solid var(--line-2)', borderRadius: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', display: 'grid', placeItems: 'center', color: '#fff', marginBottom: 12, backdropFilter: 'blur(4px)', fontSize: 18 }}>
                {piece?.type === 'reel' || piece?.type === 'story' ? '▶' : '□'}
              </div>
              [ {piece?.type ?? '—'} ]
            </div>

            <h2 style={{ margin: '24px 0 6px', fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>
              {isLoading ? 'Cargando…' : piece?.title}
            </h2>
            <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>{piece?.accounts?.name ?? '—'}</span>
              {piece?.platform && <span>{piece.platform}</span>}
            </div>

            {piece?.copy && (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-2)', padding: 14, fontSize: 13, lineHeight: 1.55, color: 'var(--fg-2)', marginTop: 12, whiteSpace: 'pre-wrap' }}>
                {piece.copy}
              </div>
            )}

            {!piece?.copy && !isLoading && (
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-2)', padding: 14, fontSize: 13, color: 'var(--fg-3)', marginTop: 12, fontStyle: 'italic' }}>
                Sin copy todavía.
              </div>
            )}
          </div>

          {/* Right — info */}
          <aside style={{ borderLeft: '1px solid var(--line-1)', background: 'var(--bg-1)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Detail */}
            <div style={sectionStyle}>
              <h4 style={sectionH}>Detalle</h4>
              {[
                ['Cuenta',      piece?.accounts?.name ?? '—'],
                ['Formato',     TYPE_LABELS[piece?.type ?? ''] ?? piece?.type ?? '—'],
                ['Plataforma',  piece?.platform ?? '—'],
                ['Publicación', piece ? formatDate(piece.scheduled_date, piece.scheduled_time) : '—'],
                ['Pauta',       piece?.has_pauta ? `Sí · $${piece.pauta_amount?.toLocaleString('es-AR') ?? '—'}` : 'No'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', fontSize: 13 }}>
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{k}</span>
                  <span style={{ color: 'var(--fg-1)', fontFamily: k === 'Publicación' ? 'var(--font-mono)' : 'inherit', fontSize: k === 'Publicación' ? 12 : 13 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Timeline via comments */}
            {piece && piece.comments.length > 0 && (
              <div style={sectionStyle}>
                <h4 style={sectionH}>Historial</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[...piece.comments].reverse().map((c) => (
                    <div key={c.id} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 999, marginTop: 6, flexShrink: 0, background: 'var(--fg-3)' }} />
                      <div>
                        <div style={{ fontSize: 12, lineHeight: 1.45 }}>
                          <span style={{ fontWeight: 500 }}>{c.users?.full_name ?? '—'}</span> comentó
                        </div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 3, textTransform: 'uppercase' }}>
                          {formatTs(c.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div style={{ ...sectionStyle, flex: 1, minHeight: 0 }}>
              <h4 style={sectionH}>
                Comentarios{piece ? ` · ${piece.comments.length}` : ''}
              </h4>

              {isLoading && (
                <div style={{ color: 'var(--fg-3)', fontSize: 12 }}>Cargando comentarios…</div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {piece?.comments.map((c) => (
                  <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                    <Avatar init={initials(c.users?.full_name ?? '?')} violet={false} />
                    <div>
                      <div>
                        <span style={{ fontWeight: 500, fontSize: 12, color: 'var(--fg-1)' }}>
                          {c.users?.full_name ?? '—'}
                        </span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', marginLeft: 6, textTransform: 'uppercase' }}>
                          {formatTs(c.created_at)}
                        </span>
                      </div>
                      <div style={{ color: 'var(--fg-2)', fontSize: 12.5, lineHeight: 1.5, marginTop: 3 }}>{c.content}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: 12, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', marginTop: 12 }}>
                <Avatar init={userInitials} violet size={24} />
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSendComment() }}
                  placeholder="Escribí un comentario… ⌘Enter para enviar"
                  style={{ flex: 1, background: 'transparent', border: 0, resize: 'none', color: 'var(--fg-1)', fontSize: 12.5, outline: 'none', minHeight: 48, fontFamily: 'var(--font-sans)' }}
                />
                <button
                  onClick={handleSendComment}
                  disabled={!commentText.trim() || addComment.isPending}
                  style={{ alignSelf: 'flex-end', padding: '5px 10px', fontSize: 11, fontWeight: 500, color: commentText.trim() ? '#fff' : 'var(--fg-3)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: commentText.trim() ? 'var(--violet-500)' : 'var(--bg-3)', cursor: commentText.trim() ? 'pointer' : 'not-allowed' }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-1)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {piece?.rejection_reason && (
              <span style={{ fontSize: 12, color: 'var(--status-rejected)', padding: '5px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r-2)' }}>
                {piece.rejection_reason}
              </span>
            )}
          </div>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
            {piece ? formatUpdatedAt(piece.updated_at) : '—'}
          </span>
          {status !== 'published' && (
            <button
              onClick={handleMarkPublished}
              disabled={updateStatus.isPending}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >
              Marcar como publicada
            </button>
          )}
          {(status === 'draft' || status === 'rejected') && (
            <button
              onClick={handleResend}
              disabled={updateStatus.isPending}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
            >
              Reenviar al cliente →
            </button>
          )}
        </footer>
      </motion.article>
    </>
  )
}
