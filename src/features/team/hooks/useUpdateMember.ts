import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

type UpdateMemberInput = {
  id: string
  role?: string
  position?: string
  is_active?: boolean
}

export function useUpdateMember() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateMemberInput) => {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: (_data, variables) => {
      const msgs: string[] = []
      if (variables.role) msgs.push('Rol actualizado')
      if (variables.position !== undefined) msgs.push('Cargo actualizado')
      if (variables.is_active !== undefined) msgs.push(variables.is_active ? 'Miembro reactivado' : 'Miembro desactivado')
      toast.success(msgs.join('. ') || 'Miembro actualizado')
      qc.invalidateQueries({ queryKey: ['team'] })
      qc.invalidateQueries({ queryKey: ['team-member', variables.id] })
      qc.invalidateQueries({ queryKey: ['sidebar-counts'] })
    },
    onError: (e: Error) => {
      toast.error(e.message ?? 'No se pudo actualizar el miembro')
    },
  })
}
