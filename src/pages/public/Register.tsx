import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  agencyName: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Mínimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

type RegisterValues = z.infer<typeof registerSchema>

export function Register() {
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', agencyName: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit(values: RegisterValues) {
    setServerError(null)

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          agency_name: values.agencyName,
        },
      },
    })

    if (error) {
      setServerError(error.message)
      return
    }

    toast.success('Cuenta creada. Revisá tu email para confirmar.')
    navigate('/login')
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
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        background: 'var(--bg-0)',
      }}
    >
      {/* Left side — brand */}
      <aside
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
            14 dias gratis · sin tarjeta
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
            Empeza a organizar tu agencia hoy.
          </h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
            Calendario editorial, aprobaciones del cliente y reportes — todo en un solo lugar.
            Setup en 10 minutos.
          </p>
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
            Crea tu cuenta
          </h2>
          <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 32px' }}>
            Completa tus datos para arrancar. Es gratis por 14 dias.
          </p>

          {/* Full name */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="fullName"
              style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}
            >
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              {...register('fullName')}
              placeholder="Juan Perez"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            {errors.fullName && (
              <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.fullName.message}</p>
            )}
          </div>

          {/* Agency name */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="agencyName"
              style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}
            >
              Nombre de la agencia
            </label>
            <input
              id="agencyName"
              type="text"
              {...register('agencyName')}
              placeholder="Pixel Studio"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            {errors.agencyName && (
              <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.agencyName.message}</p>
            )}
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
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Minimo 6 caracteres"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            {errors.password && (
              <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="confirmPassword"
              style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}
            >
              Repetir contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Repetir contraseña"
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
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
            disabled={isSubmitting}
            style={{ width: '100%', padding: 11, fontSize: 14, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, boxShadow: '0 0 0 1px var(--violet-500), 0 1px 0 rgba(255,255,255,0.12) inset' }}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta gratis'}
          </button>

          <div
            style={{
              textAlign: 'center',
              marginTop: 20,
              color: 'var(--fg-3)',
              fontSize: 13,
            }}
          >
            ¿Ya tenes cuenta?{' '}
            <Link to="/login" style={{ color: 'var(--violet-400)' }}>
              Inicia sesion
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
