import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

type InviteInput = {
  email: string
  full_name: string
  role: 'team_member' | 'client'
  account_id?: string
}

export function useInvite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: InviteInput) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No autenticado')

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(input),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al enviar invitación')
      return data
    },
    onSuccess: () => {
      toast.success('Invitación enviada')
      qc.invalidateQueries({ queryKey: ['team'] })
      qc.invalidateQueries({ queryKey: ['agency-usage'] })
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
