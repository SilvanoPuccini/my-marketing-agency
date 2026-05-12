import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { toast } from 'sonner'

export type AgencySettingsData = {
  timezone?:      string
  language?:      string
  brand_color?:   string
  show_mma_logo?: boolean
  greeting?:      string
  notifications?: Record<string, boolean>
}

export type Agency = {
  id:       string
  name:     string
  plan:     string
  settings: AgencySettingsData
  stripe_subscription_id: string | null
}

export function useAgencySettings() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ['agency', user?.agency_id],
    enabled: !!user?.agency_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('id, name, plan, settings, stripe_subscription_id')
        .eq('id', user!.agency_id)
        .single()
      if (error) throw error
      return data as Agency
    },
  })
}

export function useUpdateAgency() {
  const { user } = useAuthStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, settings }: { name: string; settings: AgencySettingsData }) => {
      const { error } = await supabase
        .from('agencies')
        .update({ name, settings })
        .eq('id', user!.agency_id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['agency', user?.agency_id] })
      toast.success('Cambios guardados')
    },
    onError: () => toast.error('Error al guardar los cambios'),
  })
}
