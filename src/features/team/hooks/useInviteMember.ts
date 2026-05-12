import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export type InviteMemberInput = {
  email:     string
  full_name: string
  position?: string
  role:      'team_member' | 'admin_agency' | 'manager' | 'creator'
}

export function useInviteMember() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (input: InviteMemberInput) => {
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
          body: JSON.stringify({
            email: input.email,
            full_name: input.full_name,
            role: input.role,
          }),
        },
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al invitar')

      // Update position if provided
      if (input.position && data.userId) {
        await supabase
          .from('users')
          .update({ position: input.position })
          .eq('id', data.userId)
      }

      return { email: input.email }
    },
    onSuccess: () => {
      toast.success('Invitación enviada por email')
      qc.invalidateQueries({ queryKey: ['team'] })
    },
    onError: (e: Error) => {
      if (e.message.includes('already registered') || e.message.includes('already been registered')) {
        toast.error('Ese email ya está registrado')
      } else {
        toast.error(e.message ?? 'No se pudo enviar la invitación')
      }
    },
  })
}
