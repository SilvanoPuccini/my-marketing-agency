import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export function useDeleteMember() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', memberId)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Miembro eliminado del equipo')
      qc.invalidateQueries({ queryKey: ['team'] })
      qc.invalidateQueries({ queryKey: ['sidebar-counts'] })
      qc.invalidateQueries({ queryKey: ['agency-usage'] })
    },
    onError: (e: Error) => {
      toast.error(e.message ?? 'No se pudo eliminar el miembro')
    },
  })
}
