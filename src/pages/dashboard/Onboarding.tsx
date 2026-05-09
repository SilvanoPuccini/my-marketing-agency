import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const accountSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  industry: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email('Email inválido').optional().or(z.literal('')),
})

type AccountValues = z.infer<typeof accountSchema>

const INDUSTRIES = [
  'Gastronomía', 'Moda', 'Salud', 'Educación', 'Tecnología',
  'Inmobiliaria', 'Fitness', 'Belleza', 'Turismo', 'Otro',
]

export function Onboarding() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [step, setStep] = useState<'welcome' | 'create'>(user ? 'welcome' : 'welcome')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: '', industry: '', contactName: '', contactEmail: '' },
  })

  async function onSubmit(values: AccountValues) {
    if (!user) return
    const { error } = await supabase.from('accounts').insert({
      agency_id: user.agency_id,
      name: values.name,
      industry: values.industry || null,
      contact_name: values.contactName || null,
      contact_email: values.contactEmail || null,
      is_active: true,
    })
    if (error) {
      toast.error(error.message)
      return
    }
    // Agregar al usuario como account_member
    const { data: account } = await supabase
      .from('accounts')
      .select('id')
      .eq('agency_id', user.agency_id)
      .eq('name', values.name)
      .single()
    if (account) {
      await supabase.from('account_members').insert({
        account_id: account.id,
        user_id: user.id,
      })
    }
    toast.success('¡Primera cuenta creada!')
    qc.invalidateQueries({ queryKey: ['onboarding-check'] })
    qc.invalidateQueries({ queryKey: ['accounts'] })
    qc.invalidateQueries({ queryKey: ['dashboard'] })
    navigate('/dashboard')
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
    boxSizing: 'border-box',
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
      <div style={{ width: '100%', maxWidth: 480 }}>
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
              Tu agencia <strong>{user?.agency_id ? '' : ''}</strong> está lista.
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
          </div>
        )}

        {step === 'create' && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                Nombre del cliente / marca *
              </label>
              <input
                {...register('name')}
                placeholder="Ej: Parrilla Don Tito"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
              />
              {errors.name && (
                <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.name.message}</p>
              )}
            </div>

            {/* Industry */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                Rubro
              </label>
              <select
                {...register('industry')}
                style={{ ...inputStyle, appearance: 'auto' }}
              >
                <option value="">Seleccionar...</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Contact name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                Nombre de contacto del cliente
              </label>
              <input
                {...register('contactName')}
                placeholder="Ej: Rocío Paz"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            {/* Contact email */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                Email del cliente
              </label>
              <input
                {...register('contactEmail')}
                type="email"
                placeholder="cliente@empresa.com"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--violet-soft)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line-2)'; e.currentTarget.style.boxShadow = 'none' }}
              />
              {errors.contactEmail && (
                <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.contactEmail.message}</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setStep('welcome')}
                style={{
                  padding: '11px 18px', fontSize: 14, fontWeight: 500,
                  color: 'var(--fg-2)', borderRadius: 'var(--r-2)',
                  border: '1px solid var(--line-2)', background: 'var(--bg-2)',
                  cursor: 'pointer',
                }}
              >
                Atrás
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1, padding: 11, fontSize: 14, fontWeight: 500,
                  color: '#fff', borderRadius: 'var(--r-2)',
                  border: '1px solid var(--violet-400)', background: 'var(--violet-500)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: '0 0 0 1px var(--violet-500), 0 1px 0 rgba(255,255,255,0.12) inset',
                }}
              >
                {isSubmitting ? 'Creando...' : 'Crear cuenta y empezar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
