import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

type UpdateAccountInput = {
  id: string
  name?: string
  industry?: string | null
  handle?: string | null
  contact_name?: string | null
  contact_email?: string | null
  monthly_budget?: number | null
  is_active?: boolean
}

export function useUpdateAccount() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateAccountInput) => {
      const { error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      toast.success('Cuenta actualizada')
      qc.invalidateQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['account', variables.id] })
      qc.invalidateQueries({ queryKey: ['agency-usage'] })
      qc.invalidateQueries({ queryKey: ['sidebar-counts'] })
    },
    onError: (e: Error) => {
      toast.error(e.message ?? 'No se pudo actualizar la cuenta')
    },
  })
}
