import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

type AssignAccountsInput = {
  userId: string
  accountIds: string[]
}

export function useAssignAccounts() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, accountIds }: AssignAccountsInput) => {
      // Remove all current assignments
      const { error: deleteError } = await supabase
        .from('account_members')
        .delete()
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      // Insert new assignments
      if (accountIds.length > 0) {
        const rows = accountIds.map((account_id) => ({
          account_id,
          user_id: userId,
        }))

        const { error: insertError } = await supabase
          .from('account_members')
          .insert(rows)

        if (insertError) throw insertError
      }
    },
    onSuccess: (_data, variables) => {
      toast.success(`${variables.accountIds.length} cuenta${variables.accountIds.length !== 1 ? 's' : ''} asignada${variables.accountIds.length !== 1 ? 's' : ''}`)
      qc.invalidateQueries({ queryKey: ['team'] })
      qc.invalidateQueries({ queryKey: ['team-member', variables.userId] })
    },
    onError: (e: Error) => {
      toast.error(e.message ?? 'No se pudieron asignar las cuentas')
    },
  })
}
