import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useCreateAccount } from '@/features/accounts/hooks/useCreateAccount'

const schema = z.object({
  name:           z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  industry:       z.string().optional(),
  handle:         z.string().optional(),
  contact_name:   z.string().optional(),
  contact_email:  z.string().email('Email inválido').optional().or(z.literal('')),
  monthly_budget: z.coerce.number().min(0).optional(),
})

type FormValues = z.infer<typeof schema>

const INDUSTRIES = [
  'Gastronomía', 'Retail', 'Inmobiliaria', 'Salud',
  'Tecnología', 'Educación', 'Turismo', 'Indumentaria', 'Otro',
]

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

interface CreateAccountModalProps {
  onClose: () => void
}

export function CreateAccountModal({ onClose }: CreateAccountModalProps) {
  const createAccount = useCreateAccount()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', industry: '', handle: '', contact_name: '', contact_email: '' },
  })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onSubmit(values: FormValues) {
    try {
      await createAccount.mutateAsync(values)
      onClose()
    } catch {
      // el error ya se muestra via toast y createAccount.error
    }
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
          width: 'min(520px, calc(100vw - 48px))',
          background: 'var(--bg-1)', border: '1px solid var(--line-2)',
          borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
          overflow: 'hidden', pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Nueva cuenta</h2>
          <button
            onClick={onClose}
            style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
          >
            <X size={12} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            <Field label="Nombre de la cuenta *" error={errors.name?.message}>
              <input
                {...register('name')}
                placeholder="Ej: Parrilla Don Tito"
                style={inputStyle}
                autoFocus
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Industria" error={errors.industry?.message}>
                <select {...register('industry')} style={inputStyle}>
                  <option value="">Seleccioná…</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </Field>
              <Field label="Handle (@)" error={errors.handle?.message}>
                <input
                  {...register('handle')}
                  placeholder="@dontitoparrilla"
                  style={inputStyle}
                />
              </Field>
            </div>

            <div style={{ height: 1, background: 'var(--line-1)' }} />
            <p style={{ margin: 0, fontSize: 12, color: 'var(--fg-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contacto del cliente
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Nombre del contacto" error={errors.contact_name?.message}>
                <input
                  {...register('contact_name')}
                  placeholder="Ej: Rocío Paz"
                  style={inputStyle}
                />
              </Field>
              <Field label="Email del contacto" error={errors.contact_email?.message}>
                <input
                  type="email"
                  {...register('contact_email')}
                  placeholder="rocio@empresa.com"
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Presupuesto mensual (ARS)" error={errors.monthly_budget?.message}>
              <input
                type="number"
                min={0}
                {...register('monthly_budget')}
                placeholder="Ej: 250000"
                style={inputStyle}
              />
            </Field>
          </div>

          {createAccount.isError && (
            <div style={{ margin: '0 20px 4px', padding: '9px 12px', borderRadius: 'var(--r-2)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--status-rejected)', fontSize: 12 }}>
              {(createAccount.error as Error)?.message ?? 'No se pudo crear la cuenta. Verificá tus permisos.'}
            </div>
          )}
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
              disabled={isSubmitting || createAccount.isPending}
              style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: isSubmitting || createAccount.isPending ? 'var(--violet-600)' : 'var(--violet-500)', cursor: isSubmitting || createAccount.isPending ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting || createAccount.isPending ? 'Guardando…' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </motion.div>
      </div>
    </>
  )
}
