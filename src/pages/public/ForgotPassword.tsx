import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

const forgotSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
})

type ForgotValues = z.infer<typeof forgotSchema>

export function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(values: ForgotValues) {
    setServerError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    setSent(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    fontSize: 13,
    background: 'var(--bg-2)',
    border: '1px solid var(--line-2)',
    borderRadius: 'var(--r-2)',
    color: 'var(--fg-1)',
    outline: 'none',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-0)',
        padding: 32,
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'inherit', marginBottom: 40 }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 14,
              color: '#fff',
              boxShadow: '0 0 0 1px var(--violet-400) inset',
            }}
          >
            M
          </div>
          <span style={{ fontWeight: 600, letterSpacing: '-0.015em', fontSize: 15 }}>
            My Marketing Agency
          </span>
        </Link>

        {sent ? (
          <div>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                margin: '0 0 12px',
              }}
            >
              Revisa tu email
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.55, margin: '0 0 24px' }}>
              Si el email existe en nuestro sistema, vas a recibir un link para restablecer tu contraseña. Revisa la carpeta de spam si no lo ves.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                fontSize: 13,
                fontWeight: 500,
                color: '#fff',
                borderRadius: 'var(--r-2)',
                border: '1px solid var(--violet-400)',
                background: 'var(--violet-500)',
                textDecoration: 'none',
              }}
            >
              Volver al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                margin: '0 0 6px',
              }}
            >
              Recuperar contraseña
            </h2>
            <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 32px' }}>
              Ingresa tu email y te mandamos un link para restablecer tu contraseña.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label
                htmlFor="email"
                style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}
              >
                Correo de trabajo
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="vos@tuestudio.com.ar"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
              />
              {errors.email && (
                <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>
              )}
            </div>

            {serverError && (
              <div style={{ marginBottom: 12, padding: '9px 12px', borderRadius: 'var(--r-2)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--status-rejected)', fontSize: 13 }}>
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ width: '100%', padding: 11, fontSize: 14, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, boxShadow: '0 0 0 1px var(--violet-500), 0 1px 0 rgba(255,255,255,0.12) inset' }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar link de recuperacion'}
            </button>

            <div
              style={{
                textAlign: 'center',
                marginTop: 20,
                color: 'var(--fg-3)',
                fontSize: 13,
              }}
            >
              <Link to="/login" style={{ color: 'var(--violet-400)' }}>
                Volver al login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
