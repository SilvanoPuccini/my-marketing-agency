import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { getPlanLimit, type PlanId } from '@/lib/planLimits'

export function useAgencyUsage() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ['agency-usage', user?.agency_id],
    enabled: !!user?.agency_id,
    queryFn: async () => {
      const agencyId = user!.agency_id

      const [agencyRes, accountsRes, seatsRes] = await Promise.all([
        supabase.from('agencies').select('plan').eq('id', agencyId).single(),
        supabase
          .from('accounts')
          .select('id')
          .eq('agency_id', agencyId),
        supabase
          .from('users')
          .select('id')
          .eq('agency_id', agencyId)
          .in('role', ['admin_agency', 'team_member', 'manager', 'creator']),
      ])

      const plan = (agencyRes.data?.plan ?? 'solo') as PlanId
      const limits = getPlanLimit(plan)
      const accountsUsed = accountsRes.data?.length ?? 0
      const seatsUsed = seatsRes.data?.length ?? 0

      return {
        plan,
        accounts: {
          used: accountsUsed,
          limit: limits.accounts,
          overflow: Math.max(0, accountsUsed - limits.accounts),
        },
        teamSeats: {
          used: seatsUsed,
          limit: limits.teamSeats,
          overflow: Math.max(0, seatsUsed - limits.teamSeats),
        },
        canCreateAccount: accountsUsed < limits.accounts,
        canAddTeamMember: seatsUsed < limits.teamSeats,
      }
    },
    staleTime: 30_000,
  })
}
