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

export function useCreateAccount() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  return useMutation({
    mutationFn: async (input: CreateAccountInput) => {
      if (!user) throw new Error('No autenticado')

      // Enforcement de límite por plan
      const [agencyRes, countRes] = await Promise.all([
        supabase.from('agencies').select('plan').eq('id', user.agency_id).single(),
        supabase.from('accounts').select('id', { count: 'exact', head: true }).eq('agency_id', user.agency_id),
      ])
      const plan = (agencyRes.data?.plan ?? 'solo') as PlanId
      const limits = getPlanLimit(plan)
      if ((countRes.count ?? 0) >= limits.accounts) {
        throw new Error(`Tu plan "${plan}" permite hasta ${limits.accounts} cuenta${limits.accounts > 1 ? 's' : ''}. Actualizá tu plan para agregar más.`)
      }

      const { error } = await supabase.from('accounts').insert({
        agency_id:      user.agency_id,
        name:           input.name,
        industry:       input.industry || null,
        handle:         input.handle || null,
        contact_name:   input.contact_name || null,
        contact_email:  input.contact_email || null,
        monthly_budget: input.monthly_budget ?? null,
        is_active:      true,
      })
      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Cuenta creada')
      qc.refetchQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (e: Error) => toast.error(e.message ?? 'No se pudo crear la cuenta'),
  })
}
