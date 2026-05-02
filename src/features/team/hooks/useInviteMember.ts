import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

// Cliente separado sin persistencia de sesión — para crear usuarios
// sin desloguear al admin actual
const supabaseSignup = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

function generateTempPassword(): string {
  const rand = Math.random().toString(36).slice(-8)
  return `${rand}A1!`
}

export type InviteMemberInput = {
  email:     string
  full_name: string
  position?: string
  role:      'team_member' | 'admin_agency'
}

export type InviteResult = {
  email:    string
  password: string
}

export function useInviteMember() {
  const qc = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (input: InviteMemberInput): Promise<InviteResult> => {
      if (!user) throw new Error('No autenticado')

      const tempPassword = generateTempPassword()

      // 1. Crear el usuario en auth.users via el cliente sin sesión
      const { data: signupData, error: signupError } = await supabaseSignup.auth.signUp({
        email:    input.email,
        password: tempPassword,
        options: {
          data: {
            full_name: input.full_name,
            role:      input.role,
            agency_id: user.agency_id,
          },
        },
      })

      if (signupError) throw signupError
      if (!signupData.user) throw new Error('No se pudo crear el usuario')

      // 2. El trigger handle_new_user crea la fila en users automáticamente.
      //    Actualizamos position si se proporcionó.
      if (input.position) {
        await supabase
          .from('users')
          .update({ position: input.position })
          .eq('id', signupData.user.id)
      }

      return { email: input.email, password: tempPassword }
    },

    onSuccess: () => {
      toast.success('Miembro agregado al equipo')
      qc.invalidateQueries({ queryKey: ['team'] })
    },
    onError: (e: Error) => {
      if (e.message.includes('already registered')) {
        toast.error('Ese email ya está registrado')
      } else {
        toast.error(e.message ?? 'No se pudo crear el usuario')
      }
    },
  })
}
