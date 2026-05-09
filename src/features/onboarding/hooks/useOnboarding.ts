import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Chequea si la agencia del usuario ya tiene al menos una cuenta.
 * Si no tiene → necesita onboarding.
 */
export function useNeedsOnboarding() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ['onboarding-check', user?.agency_id],
    enabled: !!user?.agency_id && user.role === 'admin_agency',
    queryFn: async () => {
      const { count, error } = await supabase
        .from('accounts')
        .select('id', { count: 'exact', head: true })
        .eq('agency_id', user!.agency_id)
      if (error) throw error
      return { needsOnboarding: (count ?? 0) === 0 }
    },
    staleTime: 30_000,
  })
}
