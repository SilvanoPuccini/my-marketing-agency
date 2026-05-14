import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name:           z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  industry:       z.string().optional(),
  handle:         z.string().optional(),
  contact_name:   z.string().optional(),
  contact_email:  z.string().email('Email inválido').optional().or(z.literal('')),
  monthly_budget: z.coerce.number().min(0).optional(),
})

export type AccountFormValues = z.infer<typeof schema>

const INDUSTRIES = [
  'Gastronomía', 'Retail', 'Inmobiliaria', 'Salud',
  'Tecnología', 'Educación', 'Turismo', 'Indumentaria',
  'Fitness', 'Belleza', 'Moda', 'Otro',
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

interface AccountFormProps {
  onSubmit: (values: AccountFormValues) => Promise<void>
  submitLabel?: string
  submittingLabel?: string
  onCancel?: () => void
  cancelLabel?: string
  error?: string | null
  autoFocusName?: boolean
  initialValues?: Partial<AccountFormValues>
}

export function AccountForm({
  onSubmit,
  submitLabel = 'Crear cuenta',
  submittingLabel = 'Guardando…',
  onCancel,
  cancelLabel = 'Cancelar',
  error,
  autoFocusName = true,
  initialValues,
}: AccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues, unknown, AccountFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: initialValues?.name ?? '',
      industry: initialValues?.industry ?? '',
      handle: initialValues?.handle ?? '',
      contact_name: initialValues?.contact_name ?? '',
      contact_email: initialValues?.contact_email ?? '',
      monthly_budget: initialValues?.monthly_budget,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Nombre de la cuenta *" error={errors.name?.message}>
          <input
            {...register('name')}
            placeholder="Ej: Parrilla Don Tito"
            style={inputStyle}
            autoFocus={autoFocusName}
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

      {error && (
        <div style={{ marginTop: 12, padding: '9px 12px', borderRadius: 'var(--r-2)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--status-rejected)', fontSize: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
          >
            {cancelLabel}
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            flex: onCancel ? undefined : 1,
            padding: '8px 16px', fontSize: 13, fontWeight: 500,
            color: '#fff', borderRadius: 'var(--r-2)',
            border: '1px solid var(--violet-400)',
            background: isSubmitting ? 'var(--violet-600)' : 'var(--violet-500)',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  )
}
