import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

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
