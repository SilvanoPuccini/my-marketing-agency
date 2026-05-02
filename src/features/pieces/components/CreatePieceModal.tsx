import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useCreatePiece } from '@/features/pieces/hooks/usePiece'
import { useAccounts } from '@/features/accounts/hooks/useAccounts'

const schema = z.object({
  account_id:     z.string().min(1, 'Seleccioná una cuenta'),
  title:          z.string().min(3, 'Mínimo 3 caracteres').max(150, 'Máximo 150 caracteres'),
  type:           z.enum(['post', 'reel', 'story', 'ad', 'blog', 'carrusel'], {
    errorMap: () => ({ message: 'Seleccioná un tipo' }),
  }),
  scheduled_date: z.string().min(1, 'La fecha es obligatoria'),
  scheduled_time: z.string().optional(),
  copy:           z.string().optional(),
  platform:       z.string().optional(),
  has_pauta:      z.boolean(),
  pauta_amount:   z.coerce.number().min(0).optional(),
})

type FormValues = z.infer<typeof schema>

const TYPE_OPTIONS = [
  { value: 'post',     label: 'Post' },
  { value: 'reel',     label: 'Reel' },
  { value: 'story',    label: 'Story' },
  { value: 'carrusel', label: 'Carrusel' },
  { value: 'ad',       label: 'Aviso' },
  { value: 'blog',     label: 'Blog' },
]

const PLATFORM_OPTIONS = [
  'Instagram', 'TikTok', 'Facebook',
  'Instagram + TikTok', 'Instagram + Facebook', 'Todas',
]

interface CreatePieceModalProps {
  onClose: () => void
  defaultAccountId?: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13,
  background: 'var(--bg-2)', border: '1px solid var(--line-2)',
  borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
  boxSizing: 'border-box',
}

const errorStyle: React.CSSProperties = {
  color: 'var(--status-rejected)', fontSize: 11, marginTop: 4,
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--fg-2)', marginBottom: 6,
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  )
}

export function CreatePieceModal({ onClose, defaultAccountId }: CreatePieceModalProps) {
  const { data: accounts = [] } = useAccounts()
  const createPiece = useCreatePiece()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      account_id:     defaultAccountId ?? '',
      has_pauta:      false,
      scheduled_date: new Date().toISOString().split('T')[0],
    },
  })

  const hasPauta = watch('has_pauta')

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onSubmit(values: FormValues) {
    await createPiece.mutateAsync(values)
    onClose()
  }

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

      {/* Centering wrapper */}
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: 'min(560px, calc(100vw - 48px))',
          background: 'var(--bg-1)', border: '1px solid var(--line-2)',
          borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
          overflow: 'hidden', pointerEvents: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
            Nueva pieza
          </h2>
          <button
            onClick={onClose}
            style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
          >
            <X size={12} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>

            {/* Cuenta */}
            <Field label="Cuenta *" error={errors.account_id?.message}>
              <select {...register('account_id')} style={inputStyle}>
                <option value="">Seleccioná una cuenta…</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </Field>

            {/* Título */}
            <Field label="Título *" error={errors.title?.message}>
              <input
                {...register('title')}
                placeholder="Ej: Reel apertura de temporada"
                style={inputStyle}
              />
            </Field>

            {/* Tipo + Plataforma */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Tipo *" error={errors.type?.message}>
                <select {...register('type')} style={inputStyle}>
                  <option value="">Seleccioná un tipo…</option>
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Plataforma" error={errors.platform?.message}>
                <select {...register('platform')} style={inputStyle}>
                  <option value="">Seleccioná…</option>
                  {PLATFORM_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Fecha + Hora */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Fecha de publicación *" error={errors.scheduled_date?.message}>
                <input
                  type="date"
                  {...register('scheduled_date')}
                  style={inputStyle}
                />
              </Field>
              <Field label="Hora" error={errors.scheduled_time?.message}>
                <input
                  type="time"
                  {...register('scheduled_time')}
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Copy */}
            <Field label="Copy / Texto" error={errors.copy?.message}>
              <textarea
                {...register('copy')}
                placeholder="Texto que acompaña la pieza, hashtags, etc."
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5, fontFamily: 'inherit' }}
              />
            </Field>

            {/* Pauta */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
                <input
                  type="checkbox"
                  {...register('has_pauta')}
                  style={{ width: 16, height: 16, accentColor: 'var(--violet-500)', cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--fg-1)', fontWeight: 500 }}>Tiene pauta</span>
              </label>
              {hasPauta && (
                <div style={{ marginTop: 10 }}>
                  <Field label="Monto de pauta (ARS)" error={errors.pauta_amount?.message}>
                    <input
                      type="number"
                      min={0}
                      {...register('pauta_amount')}
                      placeholder="Ej: 24000"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--line-1)', background: 'var(--bg-1)' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createPiece.isPending}
              style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: isSubmitting || createPiece.isPending ? 'var(--violet-600)' : 'var(--violet-500)', cursor: isSubmitting || createPiece.isPending ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting || createPiece.isPending ? 'Guardando…' : 'Crear pieza'}
            </button>
          </div>
        </form>
      </motion.div>
      </div>
    </>
  )
}
