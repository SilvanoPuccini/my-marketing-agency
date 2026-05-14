import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { mkInitials } from '@/lib/utils'

const schema = z.object({
  password: z.string().min(6, 'Minimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Minimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contrasenas no coinciden',
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof schema>

export function CompleteInvitation() {
  const navigate = useNavigate()
  const [sessionReady, setSessionReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Supabase auto-detects the #access_token or ?code= in the URL
    // via detectSessionInUrl (default: true). We listen for the session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSessionReady(true)
      }
    })

    // Also check if session already exists (auto-detection may have fired before mount)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionReady(true)
      }
    })

    // If after 8s still no session, show error
    const timeout = setTimeout(() => {
      setSessionReady((ready) => {
        if (!ready) setError('Este enlace expiró o es inválido. Pedí una nueva invitación.')
        return ready
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
    setError(null)

    try {
      // 1. Verify active session
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        setError('No se encontró una sesión válida. Probá con el enlace del email de nuevo.')
        return
      }

      // 2. Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      })

      if (updateError) {
        if (updateError.message.includes('same_password') || updateError.message.includes('same password')) {
          setError('Elegí una contraseña diferente a la anterior.')
        } else {
          setError(updateError.message)
        }
        return
      }

      // 3. Sign out the invite token session to release the auth lock,
      //    then re-login with the new password for a clean session.
      await supabase.auth.signOut()

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: currentUser.email!,
        password: values.password,
      })

      if (loginError) {
        // Password was set successfully, but auto-login failed.
        // Send user to login page as fallback.
        setSuccess(true)
        setTimeout(() => navigate('/login', { replace: true }), 1500)
        return
      }

      // 4. Fetch profile and update auth store
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (profile) {
        useAuthStore.getState().setUser({
          ...profile,
          role: profile.role as 'admin_agency' | 'team_member' | 'manager' | 'creator' | 'client',
          initials: mkInitials(profile.full_name),
          position: profile.position ?? undefined,
          avatar_url: profile.avatar_url ?? undefined,
        })
      }

      // 5. Navigate based on role
      setSuccess(true)
      const isStaff = profile?.role === 'admin_agency' || profile?.role === 'team_member' || profile?.role === 'manager' || profile?.role === 'creator'
      const destination = isStaff ? '/dashboard' : '/portal'

      setTimeout(() => {
        navigate(destination, { replace: true })
      }, 800)
    } catch (err) {
      setError((err as Error).message ?? 'Error inesperado. Intentá de nuevo.')
    }
  }

  // Spinner while establishing session
  if (!sessionReady && !error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        background: 'var(--bg-0)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            border: '2px solid var(--violet-500)', borderTopColor: 'transparent',
            animation: 'spin 0.7s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>Verificando enlace...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        background: 'var(--bg-0)', padding: 32,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 999,
            background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
            display: 'grid', placeItems: 'center', margin: '0 auto 16px', fontSize: 22,
          }}>
            ✓
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>Cuenta lista!</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', placeItems: 'center',
      background: 'var(--bg-0)', padding: 32,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: '#fff',
          }}>
            M
          </div>
          <span style={{ fontWeight: 600, letterSpacing: '-0.015em', fontSize: 15 }}>
            My Marketing Agency
          </span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Establecé tu contraseña
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>
          Creá una contraseña para acceder a tu cuenta. Después podés cambiarla cuando quieras.
        </p>

        {error && (
          <div style={{
            marginBottom: 16, padding: '10px 14px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--r-2)', color: 'var(--status-rejected)', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
              Nueva contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              placeholder="Minimo 6 caracteres"
              autoFocus
              style={{
                width: '100%', padding: '9px 12px', fontSize: 13,
                background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.password && (
              <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
              Repetir contraseña
            </label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="Repetí la contraseña"
              style={{
                width: '100%', padding: '9px 12px', fontSize: 13,
                background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: 11, fontSize: 14, fontWeight: 500,
              color: '#fff', borderRadius: 'var(--r-2)',
              border: '1px solid var(--violet-400)', background: 'var(--violet-500)',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {isSubmitting ? 'Guardando...' : 'Crear cuenta e ingresar'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--fg-3)' }}>
          <Link to="/login" style={{ color: 'var(--violet-400)' }}>
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  )
}
