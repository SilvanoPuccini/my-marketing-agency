import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Copy, Check } from 'lucide-react'
import { useInviteMember, type InviteResult } from '@/features/team/hooks/useInviteMember'

const schema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email:     z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  position:  z.string().optional(),
  role:      z.enum(['team_member', 'admin_agency']),
})

type FormValues = z.infer<typeof schema>

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

function SuccessView({ result, onClose }: { result: InviteResult; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const text = `Email: ${result.email}\nContraseña temporal: ${result.password}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 999, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'grid', placeItems: 'center', fontSize: 22 }}>
        ✓
      </div>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600 }}>¡Cuenta creada!</h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)', maxWidth: 320 }}>
          Compartí estas credenciales con el nuevo miembro del equipo. La contraseña es temporal.
        </p>
      </div>

      <div style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Email</span>
            <span className="mono" style={{ fontSize: 12 }}>{result.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Contraseña temporal</span>
            <span className="mono" style={{ fontSize: 12, letterSpacing: '0.05em' }}>{result.password}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%' }}>
        <button
          onClick={handleCopy}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado' : 'Copiar credenciales'}
        </button>
        <button
          onClick={onClose}
          style={{ flex: 1, padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

interface InviteMemberModalProps {
  onClose: () => void
}

export function InviteMemberModal({ onClose }: InviteMemberModalProps) {
  const inviteMember = useInviteMember()
  const [result, setResult] = useState<InviteResult | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'team_member', full_name: '', email: '', position: '' },
  })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onSubmit(values: FormValues) {
    const res = await inviteMember.mutateAsync(values)
    setResult(res)
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
          width: 'min(480px, calc(100vw - 48px))',
          background: 'var(--bg-1)', border: '1px solid var(--line-2)',
          borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
          overflow: 'hidden', pointerEvents: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>
            {result ? 'Invitación enviada' : 'Invitar persona al equipo'}
          </h2>
          <button
            onClick={onClose}
            style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
          >
            <X size={12} />
          </button>
        </div>

        {result ? (
          <SuccessView result={result} onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              <Field label="Nombre completo *" error={errors.full_name?.message}>
                <input
                  {...register('full_name')}
                  placeholder="Ej: Camila Sosa"
                  style={inputStyle}
                  autoFocus
                />
              </Field>

              <Field label="Email de trabajo *" error={errors.email?.message}>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="camila@tuestudio.com.ar"
                  style={inputStyle}
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Cargo" error={errors.position?.message}>
                  <input
                    {...register('position')}
                    placeholder="Ej: Diseñadora Sr."
                    style={inputStyle}
                  />
                </Field>
                <Field label="Rol en el sistema *" error={errors.role?.message}>
                  <select {...register('role')} style={inputStyle}>
                    <option value="team_member">Miembro del equipo</option>
                    <option value="admin_agency">Administrador</option>
                  </select>
                </Field>
              </div>

              <div style={{ padding: '10px 12px', background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-2)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>
                Se generará una contraseña temporal. Vas a poder copiarla para compartirla con el nuevo miembro.
              </div>
            </div>

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
                disabled={isSubmitting || inviteMember.isPending}
                style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: isSubmitting || inviteMember.isPending ? 'var(--violet-600)' : 'var(--violet-500)', cursor: isSubmitting || inviteMember.isPending ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting || inviteMember.isPending ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
      </div>
    </>
  )
}
