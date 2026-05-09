import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useInvite } from '@/features/team/hooks/useInvite'

const schema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
})

type FormValues = z.infer<typeof schema>

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13,
  background: 'var(--bg-2)', border: '1px solid var(--line-2)',
  borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--fg-2)', marginBottom: 6,
}

interface InviteClientModalProps {
  accountId: string
  accountName: string
  onClose: () => void
}

export function InviteClientModal({ accountId, accountName, onClose }: InviteClientModalProps) {
  const invite = useInvite()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', email: '' },
  })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onSubmit(values: FormValues) {
    await invite.mutateAsync({
      email: values.email,
      full_name: values.full_name,
      role: 'client',
      account_id: accountId,
    })
    onClose()
  }

  return (
    <>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,9,0.72)', zIndex: 40 }}
      />
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: 'min(440px, calc(100vw - 48px))',
            background: 'var(--bg-1)', border: '1px solid var(--line-2)',
            borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
            overflow: 'hidden', pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Invitar cliente</h2>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--fg-3)' }}>
                Se enviará un email de invitación para acceder al portal de {accountName}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
            >
              <X size={12} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Nombre del cliente *</label>
                <input
                  {...register('full_name')}
                  placeholder="Ej: Rocío Paz"
                  style={inputStyle}
                  autoFocus
                />
                {errors.full_name && (
                  <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Email del cliente *</label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="cliente@empresa.com"
                  style={inputStyle}
                />
                {errors.email && (
                  <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>
                )}
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-2)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>
                El cliente recibirá un email para configurar su contraseña y acceder al portal de aprobaciones.
              </div>
            </div>

            {invite.isError && (
              <div style={{ margin: '0 20px 4px', padding: '9px 12px', borderRadius: 'var(--r-2)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--status-rejected)', fontSize: 12 }}>
                {(invite.error as Error)?.message ?? 'No se pudo enviar la invitación.'}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--line-1)' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || invite.isPending}
                style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: isSubmitting || invite.isPending ? 'var(--violet-600)' : 'var(--violet-500)', cursor: isSubmitting || invite.isPending ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting || invite.isPending ? 'Enviando…' : 'Enviar invitación'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  )
}
