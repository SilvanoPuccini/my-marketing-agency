import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

const schema = z.object({
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof schema>

export function CompleteInvitation() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setUser, isLoading: authLoading } = useAuthStore()
  const [authChecked, setAuthChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const token = searchParams.get('token')
  const type = searchParams.get('type')

  // Si hay token en la URL, intentar setear la sesión
  useEffect(() => {
    async function trySetSession() {
      if (token && (type === 'invite' || !type)) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token,
        })
        if (sessionError) {
          setError('Este enlace expiró o es inválido. Pedí una nueva invitación.')
        }
      }
    }
    trySetSession()
  }, [token, type])

  // Esperar a que auth termine de cargar
  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true)
    }
  }, [authLoading])

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

    // 1. Verificar que haya usuario (sesión activa del invite)
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    if (!currentUser) {
      setError('No se encontró una sesión válida. Probá con el enlace del email de nuevo.')
      return
    }

    // 2. Obtener el token actual para poder actualizar el usuario
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setError('No se encontró una sesión válida. Probá con el enlace del email de nuevo.')
      return
    }

    // 3. Actualizar la contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: values.password,
    })

    if (updateError) {
      setError(updateError.message)
      return
    }

    // 4. Refrescar perfil y redirigir
    const { data: profile } = await supabase
      .from('users')
      .select('agency_id, role')
      .eq('id', currentUser.id)
      .single()

    const userData = {
      id: currentUser.id,
      agency_id: profile?.agency_id ?? '',
      email: currentUser.email ?? '',
      full_name: currentUser.user_metadata?.full_name ?? '',
      role: profile?.role ?? ('client' as const),
      initials: (currentUser.user_metadata?.full_name ?? 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n: string) => n[0].toUpperCase())
        .join(''),
    }

    setUser(userData as ReturnType<typeof setUser> extends (user: infer U) => void ? U : never)
    setSuccess(true)

    const isTeam = profile?.role === 'admin_agency' || profile?.role === 'team_member' || profile?.role === 'manager' || profile?.role === 'creator'
    setTimeout(() => {
      navigate(isTeam ? '/dashboard' : '/portal', { replace: true })
    }, 1200)
  }

  if (!authChecked) {
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
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px' }}>¡Cuenta lista!</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>Redirigiendo al portal...</p>
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
              placeholder="Mínimo 6 caracteres"
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
