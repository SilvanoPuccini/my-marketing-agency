import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useInviteMember } from '@/features/team/hooks/useInviteMember'

const schema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email:     z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  position:  z.string().optional(),
  role:      z.enum(['team_member', 'admin_agency', 'manager', 'creator']),
})

type FormValues = z.infer<typeof schema>

const ROLES = [
  { value: 'creator',      label: 'Creador',        desc: 'Crea y edita piezas en cuentas asignadas' },
  { value: 'manager',      label: 'Manager',        desc: 'Gestiona cuentas, aprueba piezas, ve reportes' },
  { value: 'team_member',  label: 'Miembro',        desc: 'Acceso general al dashboard del equipo' },
  { value: 'admin_agency', label: 'Administrador',  desc: 'Acceso total: billing, equipo, settings' },
] as const

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

function SuccessView({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 999, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'grid', placeItems: 'center', fontSize: 22 }}>
        ✓
      </div>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600 }}>Invitación enviada</h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)', maxWidth: 320 }}>
          Se envió un email a <strong>{email}</strong> con un enlace para configurar su cuenta y acceder al dashboard.
        </p>
      </div>
      <button
        onClick={onClose}
        style={{ width: '100%', padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
      >
        Cerrar
      </button>
    </div>
  )
}

interface InviteMemberModalProps {
  onClose: () => void
}

export function InviteMemberModal({ onClose }: InviteMemberModalProps) {
  const inviteMember = useInviteMember()
  const [sentEmail, setSentEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'creator', full_name: '', email: '', position: '' },
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
    setSentEmail(res.email)
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
            {sentEmail ? 'Invitación enviada' : 'Invitar persona al equipo'}
          </h2>
          <button
            onClick={onClose}
            style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
          >
            <X size={12} />
          </button>
        </div>

        {sentEmail ? (
          <SuccessView email={sentEmail} onClose={onClose} />
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
                <Field label="Rol *" error={errors.role?.message}>
                  <select {...register('role')} style={inputStyle}>
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Role description */}
              {(() => {
                const selectedRole = watch('role')
                const roleInfo = ROLES.find((r) => r.value === selectedRole)
                return roleInfo ? (
                  <div style={{ padding: '10px 12px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 'var(--r-2)', fontSize: 12, color: 'var(--violet-400)', lineHeight: 1.5 }}>
                    <strong>{roleInfo.label}:</strong> {roleInfo.desc}
                  </div>
                ) : null
              })()}

              <div style={{ padding: '10px 12px', background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-2)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>
                Se enviará un email con un enlace para que configure su contraseña y acceda al dashboard.
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
                {isSubmitting || inviteMember.isPending ? 'Enviando invitación…' : 'Enviar invitación'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
      </div>
    </>
  )
}
