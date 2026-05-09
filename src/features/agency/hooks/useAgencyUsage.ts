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

      // Fetch en paralelo: agencia, cuentas, usuarios
      const [agencyRes, accountsRes, usersRes] = await Promise.all([
        supabase.from('agencies').select('plan').eq('id', agencyId).single(),
        supabase.from('accounts').select('id', { count: 'exact', head: true }).eq('agency_id', agencyId),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('agency_id', agencyId),
      ])

      const plan = (agencyRes.data?.plan ?? 'solo') as PlanId
      const limits = getPlanLimit(plan)

      return {
        plan,
        accounts: { used: accountsRes.count ?? 0, limit: limits.accounts },
        users: { used: usersRes.count ?? 0, limit: limits.users },
        canCreateAccount: (accountsRes.count ?? 0) < limits.accounts,
        canAddUser: (usersRes.count ?? 0) < limits.users,
      }
    },
    staleTime: 30_000,
  })
}
