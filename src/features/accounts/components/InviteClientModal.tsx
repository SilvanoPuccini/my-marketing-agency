import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Copy, Check } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'
import { getPlanLimit, type PlanId } from '@/lib/planLimits'

// Cliente sin persistencia de sesión — para crear usuarios sin desloguear al admin
const supabaseSignup = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

function generateTempPassword(): string {
  const rand = Math.random().toString(36).slice(-8)
  return `${rand}A1!`
}

const schema = z.object({
  full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
})

type FormValues = z.infer<typeof schema>

type InviteResult = {
  email: string
  password: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13,
  background: 'var(--bg-2)', border: '1px solid var(--line-2)',
  borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: 'var(--fg-2)', marginBottom: 6,
}

function SuccessView({ result, accountName, onClose }: { result: InviteResult; accountName: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const text = `Portal: ${accountName}\nEmail: ${result.email}\nContraseña temporal: ${result.password}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 999, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', display: 'grid', placeItems: 'center', fontSize: 22 }}>
        ✓
      </div>
      <div>
        <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600 }}>¡Cliente invitado!</h3>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)', maxWidth: 320 }}>
          Compartí estas credenciales con el cliente. Con ellas puede acceder al portal de aprobaciones de <strong>{accountName}</strong>.
        </p>
      </div>

      <div style={{ width: '100%', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Email</span>
            <span className="mono" style={{ fontSize: 12 }}>{result.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Contraseña temporal</span>
            <span className="mono" style={{ fontSize: 12, letterSpacing: '0.05em' }}>{result.password}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%' }}>
        <button
          onClick={handleCopy}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px 16px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copiado' : 'Copiar credenciales'}
        </button>
        <button
          onClick={onClose}
          style={{ flex: 1, padding: '9px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

interface InviteClientModalProps {
  accountId: string
  accountName: string
  onClose: () => void
}

export function InviteClientModal({ accountId, accountName, onClose }: InviteClientModalProps) {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  const [result, setResult] = useState<InviteResult | null>(null)

  // Check portal client limit for this account
  const { data: clientLimitInfo } = useQuery({
    queryKey: ['portal-client-limit', accountId],
    enabled: !!accountId && !!user?.agency_id,
    queryFn: async () => {
      const [agencyRes, clientsRes] = await Promise.all([
        supabase.from('agencies').select('plan').eq('id', user!.agency_id).single(),
        supabase
          .from('account_clients')
          .select('id', { count: 'exact', head: true })
          .eq('account_id', accountId),
      ])
      const plan = (agencyRes.data?.plan ?? 'solo') as PlanId
      const limits = getPlanLimit(plan)
      const used = clientsRes.count ?? 0
      return {
        used,
        limit: limits.portalClientsPerAccount,
        atLimit: used >= limits.portalClientsPerAccount,
      }
    },
  })
  const atClientLimit = clientLimitInfo?.atLimit ?? false

  const inviteClient = useMutation({
    mutationFn: async (input: FormValues): Promise<InviteResult> => {
      if (!user) throw new Error('No autenticado')

      const tempPassword = generateTempPassword()

      // 1. Crear usuario en auth con metadata de invitación
      const { data: signupData, error: signupError } = await supabaseSignup.auth.signUp({
        email: input.email,
        password: tempPassword,
        options: {
          data: {
            full_name: input.full_name,
            role: 'client',
            agency_id: user.agency_id,
          },
        },
      })

      if (signupError) {
        if (signupError.message.includes('already registered')) {
          throw new Error('Ese email ya está registrado. Usá otro email para el cliente.')
        }
        throw signupError
      }
      if (!signupData.user) throw new Error('No se pudo crear el usuario')

      // 2. Vincular cliente a la cuenta via account_clients
      await supabase.from('account_clients').insert({
        account_id: accountId,
        user_id: signupData.user.id,
      })

      return { email: input.email, password: tempPassword }
    },
    onSuccess: () => {
      toast.success('Cliente invitado')
      qc.invalidateQueries({ queryKey: ['account-clients'] })
      qc.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (e: Error) => toast.error(e.message ?? 'No se pudo invitar al cliente'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: '', email: '' },
  })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function onSubmit(values: FormValues) {
    const res = await inviteClient.mutateAsync(values)
    setResult(res)
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
            width: 'min(440px, calc(100vw - 48px))',
            background: 'var(--bg-1)', border: '1px solid var(--line-2)',
            borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
            overflow: 'hidden', pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
              {result ? 'Cliente invitado' : `Invitar cliente a ${accountName}`}
            </h2>
            <button
              onClick={onClose}
              style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
            >
              <X size={12} />
            </button>
          </div>

          {result ? (
            <SuccessView result={result} accountName={accountName} onClose={onClose} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nombre del cliente *</label>
                  <input
                    {...register('full_name')}
                    placeholder="Ej: Rocío Paz"
                    style={inputStyle}
                    autoFocus
                  />
                  {errors.full_name && (
                    <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.full_name.message}</p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Email del cliente *</label>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="cliente@empresa.com"
                    style={inputStyle}
                  />
                  {errors.email && (
                    <p style={{ color: 'var(--status-rejected)', fontSize: 11, marginTop: 4 }}>{errors.email.message}</p>
                  )}
                </div>

                {atClientLimit ? (
                  <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-2)', fontSize: 12, color: '#EF4444', lineHeight: 1.5 }}>
                    Limite de clientes portal alcanzado para esta cuenta ({clientLimitInfo?.used}/{clientLimitInfo?.limit}).
                    Actualiza tu plan para agregar mas clientes.
                  </div>
                ) : (
                  <div style={{ padding: '10px 12px', background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-2)', fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }}>
                    Se generara una contrasena temporal. Vas a poder copiarla para compartirla con el cliente.
                  </div>
                )}
              </div>

              {inviteClient.isError && (
                <div style={{ margin: '0 20px 4px', padding: '9px 12px', borderRadius: 'var(--r-2)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--status-rejected)', fontSize: 12 }}>
                  {(inviteClient.error as Error)?.message ?? 'No se pudo invitar al cliente.'}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--line-1)' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || inviteClient.isPending || atClientLimit}
                  style={{ padding: '8px 16px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: isSubmitting || inviteClient.isPending || atClientLimit ? 'var(--violet-600)' : 'var(--violet-500)', cursor: isSubmitting || inviteClient.isPending || atClientLimit ? 'not-allowed' : 'pointer', opacity: atClientLimit ? 0.5 : 1 }}
                >
                  {atClientLimit ? 'Limite alcanzado' : isSubmitting || inviteClient.isPending ? 'Creando…' : 'Invitar cliente'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </>
  )
}
