import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { getPlanLimit, type PlanId } from '@/lib/planLimits'

export type CreateAccountInput = {
  name: string
  industry?: string
  handle?: string
  contact_name?: string
  contact_email?: string
  monthly_budget?: number
}

async function autoInviteClientIfNeeded(
  accountId: string,
  contactEmail: string,
  contactName: string,
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invite`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        email: contactEmail,
        full_name: contactName || contactEmail.split('@')[0],
        role: 'client',
        account_id: accountId,
      }),
    },
  )
  const data = await res.json()
  if (!res.ok) {
    console.warn('Auto-invite failed:', data.error)
  }
}

export function useCreateAccount() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  return useMutation({
    mutationFn: async (input: CreateAccountInput) => {
      if (!user) throw new Error('No autenticado')

      // Enforcement de límite por plan
      const [agencyRes, countRes] = await Promise.all([
        supabase.from('agencies').select('plan').eq('id', user.agency_id).single(),
        supabase.from('accounts').select('id').eq('agency_id', user.agency_id),
      ])
      const plan = (agencyRes.data?.plan ?? 'solo') as PlanId
      const limits = getPlanLimit(plan)
      if ((countRes.data?.length ?? 0) >= limits.accounts) {
        throw new Error(`Tu plan "${plan}" permite hasta ${limits.accounts} cuenta${limits.accounts > 1 ? 's' : ''}. Actualizá tu plan para agregar más.`)
      }

      const { data: accountData, error } = await supabase.from('accounts').insert({
        agency_id:      user.agency_id,
        name:           input.name,
        industry:       input.industry || null,
        handle:         input.handle || null,
        contact_name:   input.contact_name || null,
        contact_email:  input.contact_email || null,
        monthly_budget: input.monthly_budget ?? null,
        is_active:      true,
      }).select('id').single()

      if (error) throw error
      if (!accountData) throw new Error('No se pudo crear la cuenta')

      // Agregar al creador como account_member
      const { error: memberError } = await supabase.from('account_members').insert({
        account_id: accountData.id,
        user_id: user.id,
      })
      if (memberError) console.warn('account_members insert failed:', memberError.message)

      // Auto-invite: si tiene email de contacto, enviar invitación al cliente
      if (input.contact_email) {
        await autoInviteClientIfNeeded(
          accountData.id,
          input.contact_email,
          input.contact_name ?? '',
        )
      }

      return accountData
    },
    onSuccess: () => {
      toast.success('Cuenta creada')
      qc.refetchQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['onboarding-check'] })
      qc.invalidateQueries({ queryKey: ['agency-usage'] })
      qc.invalidateQueries({ queryKey: ['sidebar-counts'] })
    },
    onError: (e: Error) => toast.error(e.message ?? 'No se pudo crear la cuenta'),
  })
}
