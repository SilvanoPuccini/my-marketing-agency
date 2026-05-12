import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

/**
 * Procesa el token de confirmación de email de Supabase.
 * Supabase redirige aquí con hash params (#access_token=...&type=signup).
 * onAuthStateChange en auth.store.ts se encarga de setear el usuario.
 */
export function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleCallback() {
      // Supabase pone los tokens en el hash fragment
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const type = hashParams.get('type')

      if (type === 'signup' || type === 'magiclink' || type === 'recovery' || type === 'invite') {
        // getSession() parsea el hash automáticamente y establece la sesión
        const { error } = await supabase.auth.getSession()
        if (error) {
          setError(error.message)
          return
        }

        // Esperar a que onAuthStateChange actualice el store
        // Luego redirigir según el rol
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

          if (profile?.role === 'client') {
            navigate('/portal', { replace: true })
          } else {
            navigate('/dashboard', { replace: true })
          }
          return
        }
      }

      // Si no hay type reconocido, intentar recuperar sesión igual
      const { error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setError(sessionError.message)
        return
      }
      navigate('/dashboard', { replace: true })
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        background: 'var(--bg-0)', padding: 32,
      }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 12px' }}>Error de verificación</h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 14, margin: '0 0 24px' }}>{error}</p>
          <a
            href="/login"
            style={{
              display: 'inline-block', padding: '10px 20px', fontSize: 14,
              color: '#fff', background: 'var(--violet-500)', borderRadius: 'var(--r-2)',
              textDecoration: 'none', border: '1px solid var(--violet-400)',
            }}
          >
            Ir al login
          </a>
        </div>
      </div>
    )
  }

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
        <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>Verificando tu cuenta...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  )
}
