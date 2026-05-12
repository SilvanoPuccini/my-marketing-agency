import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Checks if the agency has an active Stripe subscription.
 * Returns { isPaid, isLoading } — used by AppLayout to gate dashboard access.
 * Only checks for admin_agency and team_member roles.
 */
export function usePaymentGate() {
  const { user } = useAuthStore()
  const isAgencyUser = user?.role === 'admin_agency' || user?.role === 'team_member'

  return useQuery({
    queryKey: ['payment-gate', user?.agency_id],
    enabled: !!user?.agency_id && isAgencyUser,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agencies')
        .select('stripe_subscription_id')
        .eq('id', user!.agency_id)
        .single()

      if (error) throw error
      return { isPaid: !!data?.stripe_subscription_id }
    },
    staleTime: 60_000,
  })
}
