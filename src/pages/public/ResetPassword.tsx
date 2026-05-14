import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

const schema = z
  .object({
    password: z.string().min(6, 'Minimo 6 caracteres'),
    confirmPassword: z.string().min(6, 'Minimo 6 caracteres'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function ResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    // Listen for Supabase auto-detecting the recovery token in the URL
    // (detectSessionInUrl is true by default). Using onAuthStateChange
    // avoids the auth lock race condition that getSession() causes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setReady(true)
    })

    // Also check if session already exists (auto-detection may have fired before mount)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setReady(true)
    })

    // If after 8s still no session, show error
    const timeout = setTimeout(() => {
      setReady((r) => {
        if (!r) setServerError('El link de recuperación es inválido o ya expiró. Solicitá uno nuevo.')
        return r
      })
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  async function onSubmit(values: FormValues) {
    setServerError(null)
    try {
      const { error } = await supabase.auth.updateUser({ password: values.password })
      if (error) {
        if (error.message.includes('same_password') || error.message.includes('same password')) {
          setServerError('Elegí una contraseña diferente a la anterior.')
        } else {
          setServerError(error.message)
        }
        return
      }
      // Sign out the recovery session — user will login with new password
      await supabase.auth.signOut()
      setDone(true)
    } catch (err) {
      setServerError((err as Error).message ?? 'Error inesperado. Intentá de nuevo.')
    }
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

        {done ? (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
              Contrasena actualizada
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.55, margin: '0 0 24px' }}>
              Tu contrasena fue cambiada correctamente. Ya podes iniciar sesion.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '9px 16px',
                fontSize: 13,
                fontWeight: 500,
                color: '#fff',
                borderRadius: 'var(--r-2)',
                border: '1px solid var(--violet-400)',
                background: 'var(--violet-500)',
                cursor: 'pointer',
              }}
            >
              Ir al login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
              Nueva contrasena
            </h2>
            <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 32px' }}>
              Ingresa tu nueva contrasena.
            </p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                Nueva contrasena
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="Minimo 6 caracteres"
                style={inputStyle}
                disabled={!ready}
                autoFocus
              />
              {errors.password && (
                <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.password.message}</p>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                Confirmar contrasena
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Repeti la contrasena"
                style={inputStyle}
                disabled={!ready}
              />
              {errors.confirmPassword && (
                <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.confirmPassword.message}</p>
              )}
            </div>

            {serverError && (
              <div style={{ marginBottom: 12, padding: '9px 12px', borderRadius: 'var(--r-2)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--status-rejected)', fontSize: 13 }}>
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !ready}
              style={{
                width: '100%',
                padding: 11,
                fontSize: 14,
                fontWeight: 500,
                color: '#fff',
                borderRadius: 'var(--r-2)',
                border: '1px solid var(--violet-400)',
                background: 'var(--violet-500)',
                cursor: isSubmitting || !ready ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || !ready ? 0.7 : 1,
                boxShadow: '0 0 0 1px var(--violet-500), 0 1px 0 rgba(255,255,255,0.12) inset',
              }}
            >
              {isSubmitting ? 'Guardando...' : 'Cambiar contrasena'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
