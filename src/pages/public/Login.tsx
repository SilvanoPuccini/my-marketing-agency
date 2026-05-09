import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth.store'

const loginSchema = z.object({
  email:    z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  remember: z.boolean(),
})

type LoginValues = z.infer<typeof loginSchema>

export function Login() {
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: true },
  })

  async function onSubmit(values: LoginValues) {
    setServerError(null)
    const { error: authError, role } = await login(values.email, values.password)
    if (authError) {
      setServerError('Email o contraseña incorrectos.')
      return
    }
    navigate(role === 'client' ? '/portal' : '/dashboard')
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
      className="auth-layout"
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        background: 'var(--bg-0)',
      }}
    >
      {/* Left side — brand */}
      <aside
        className="auth-brand-panel"
        style={{
          background: 'var(--bg-1)',
          borderRight: '1px solid var(--line-1)',
          padding: '32px 48px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 360,
            height: 360,
            background: 'radial-gradient(closest-side, var(--violet-glow), transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        {/* Brand */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', textDecoration: 'none', color: 'inherit' }}
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

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: 420,
            position: 'relative',
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: 'var(--violet-400)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Para agencias · ES‑AR
          </div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: '0 0 16px',
            }}
          >
            La operación de tu agencia, en un solo lugar.
          </h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
            Calendario editorial, aprobaciones del cliente y reportes — sin planillas, sin grupos de
            WhatsApp.
          </p>

          <blockquote
            style={{
              marginTop: 48,
              borderLeft: '2px solid var(--violet-500)',
              padding: '4px 0 4px 16px',
              color: 'var(--fg-2)',
              maxWidth: 420,
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            "Cortamos los grupos de WhatsApp con clientes. Pasamos de 4 horas semanales perdidas a
            20 minutos. Es plata real."
            <cite
              style={{
                display: 'block',
                marginTop: 8,
                color: 'var(--fg-3)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                fontStyle: 'normal',
              }}
            >
              — Lucía Fernández · Directora, Estudio Pampas
            </cite>
          </blockquote>
        </div>

        <div
          className="mono"
          style={{ fontSize: 11, color: 'var(--fg-3)', position: 'relative' }}
        >
          v2.4.1 · sistemas operativos
        </div>
      </aside>

      {/* Right side — form */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
        }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{ width: '100%', maxWidth: 360 }}
        >
          <h2
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              margin: '0 0 6px',
            }}
          >
            Ingresá a tu cuenta
          </h2>
          <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 32px' }}>
            Te damos la bienvenida de vuelta. Iniciá sesión para continuar.
          </p>

          {/* SSO */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {['G  Google', '@  Email mágico'].map((label) => (
              <button
                key={label}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--fg-1)',
                  borderRadius: 'var(--r-2)',
                  border: '1px solid var(--line-2)',
                  background: 'var(--bg-2)',
                  width: '100%',
                }}
              >
                <span className="mono">{label}</span>
              </button>
            ))}
          </div>

          {/* Separator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              margin: '20px 0',
              color: 'var(--fg-3)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ flex: 1, height: 1, background: 'var(--line-1)' }} />
            o con email y contraseña
            <span style={{ flex: 1, height: 1, background: 'var(--line-1)' }} />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 14 }}>
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

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="pass"
              style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}
            >
              Contraseña
            </label>
            <input
              id="pass"
              type="password"
              {...register('password')}
              placeholder="••••••••"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            {errors.password && (
              <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.password.message}</p>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--fg-3)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" {...register('remember')} style={{ accentColor: 'var(--violet-500)' }} />
                Mantener sesión
              </label>
              <Link to="/recuperar-password" style={{ color: 'var(--violet-400)' }}>Olvidé mi contraseña</Link>
            </div>
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
            {isSubmitting ? 'Ingresando…' : 'Entrar al panel →'}
          </button>

          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
              color: 'var(--fg-3)',
              fontSize: 13,
            }}
          >
            ¿Sos nueva por acá?{' '}
            <Link to="/registro" style={{ color: 'var(--violet-400)' }}>
              Probá 14 días gratis
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
