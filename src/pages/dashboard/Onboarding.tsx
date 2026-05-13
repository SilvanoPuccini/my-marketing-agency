import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { useCreateAccount } from '@/features/accounts/hooks/useCreateAccount'
import { useNeedsOnboarding } from '@/features/onboarding/hooks/useOnboarding'
import { AccountForm, type AccountFormValues } from '@/features/accounts/components/AccountForm'

export function Onboarding() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const createAccount = useCreateAccount()
  const onboarding = useNeedsOnboarding()
  const [step, setStep] = useState<'welcome' | 'create'>('welcome')

  // Si ya tiene cuentas (recargó la página), ir al dashboard
  if (onboarding.data && !onboarding.data.needsOnboarding) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(values: AccountFormValues) {
    if (!user) return
    try {
      await createAccount.mutateAsync(values)
      navigate('/dashboard')
    } catch {
      // useCreateAccount already shows toast.error
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div style={{ width: '100%', maxWidth: 520 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: '#fff',
            }}
          >
            M
          </div>
          <span style={{ fontWeight: 600, letterSpacing: '-0.015em', fontSize: 15 }}>
            My Marketing Agency
          </span>
        </div>

        {step === 'welcome' && (
          <div>
            {/* Progress */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--violet-500)' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--bg-3)' }} />
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
              ¡Bienvenido{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p style={{ color: 'var(--fg-2)', fontSize: 15, margin: '0 0 32px', lineHeight: 1.5 }}>
              Tu agencia está lista.
              Vamos a configurar tu primera cuenta de cliente para que puedas empezar a trabajar.
            </p>

            <div
              style={{
                background: 'var(--bg-1)', border: '1px solid var(--line-1)',
                borderRadius: 'var(--r-3)', padding: 20, marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                Lo que vas a poder hacer:
              </div>
              {[
                'Crear piezas y organizarlas en el calendario',
                'Enviar piezas al cliente para aprobación',
                'Ver reportes y métricas de la cuenta',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--fg-2)', marginBottom: 8 }}>
                  <span style={{ color: 'var(--violet-400)', fontFamily: 'var(--font-mono)' }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('create')}
              style={{
                width: '100%', padding: 11, fontSize: 14, fontWeight: 500,
                color: '#fff', borderRadius: 'var(--r-2)',
                border: '1px solid var(--violet-400)', background: 'var(--violet-500)',
                cursor: 'pointer',
                boxShadow: '0 0 0 1px var(--violet-500), 0 1px 0 rgba(255,255,255,0.12) inset',
              }}
            >
              Crear mi primera cuenta
            </button>
            <button
              onClick={() => {
                sessionStorage.setItem('skipped-onboarding', '1')
                navigate('/dashboard')
              }}
              style={{
                width: '100%', padding: 11, marginTop: 8, fontSize: 13,
                color: 'var(--fg-3)', borderRadius: 'var(--r-2)',
                border: 'none', background: 'transparent',
                cursor: 'pointer',
              }}
            >
              Saltar por ahora →
            </button>
          </div>
        )}

        {step === 'create' && (
          <div>
            {/* Progress */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--violet-500)' }} />
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--violet-500)' }} />
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
              Tu primera cuenta
            </h2>
            <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 28px' }}>
              Una "cuenta" es un cliente de tu agencia. Podés agregar más después.
            </p>

            <AccountForm
              onSubmit={handleSubmit}
              onCancel={() => setStep('welcome')}
              cancelLabel="Atrás"
              submitLabel="Crear cuenta y empezar"
              submittingLabel="Creando..."
              error={createAccount.isError ? ((createAccount.error as Error)?.message ?? 'No se pudo crear la cuenta.') : null}
            />
          </div>
        )}
      </div>
    </div>
  )
}
