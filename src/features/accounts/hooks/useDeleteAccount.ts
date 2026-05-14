import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export function useDeleteAccount() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('accounts')
        .delete()
        .eq('id', accountId)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Cuenta eliminada')
      qc.invalidateQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['agency-usage'] })
      qc.invalidateQueries({ queryKey: ['sidebar-counts'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (e: Error) => {
      toast.error(e.message ?? 'No se pudo eliminar la cuenta')
    },
  })
}
