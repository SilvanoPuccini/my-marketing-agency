import { motion } from 'framer-motion'

interface ConfirmDialogProps {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger'

  return (
    <>
      <motion.div
        onClick={onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,9,0.72)', zIndex: 60 }}
      />
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, pointerEvents: 'none' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: 'min(380px, calc(100vw - 48px))',
            background: 'var(--bg-1)',
            border: '1px solid var(--line-2)',
            borderRadius: 14,
            boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            pointerEvents: 'auto',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>
            {title}
          </h3>
          {description && (
            <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
              {description}
            </p>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: description ? 0 : 20 }}>
            <button
              onClick={onCancel}
              style={{
                flex: 1, padding: '9px 14px', fontSize: 13, fontWeight: 500,
                color: 'var(--fg-1)', borderRadius: 'var(--r-2)',
                border: '1px solid var(--line-2)', background: 'var(--bg-2)',
                cursor: 'pointer',
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1, padding: '9px 14px', fontSize: 13, fontWeight: 500,
                color: '#fff', borderRadius: 'var(--r-2)',
                border: `1px solid ${isDanger ? 'rgba(239,68,68,0.5)' : 'var(--violet-400)'}`,
                background: isDanger ? 'rgba(239,68,68,0.8)' : 'var(--violet-500)',
                cursor: 'pointer',
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
