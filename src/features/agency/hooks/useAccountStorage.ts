import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { getPlanLimit, type PlanId } from '@/lib/planLimits'

export function useAccountStorage() {
  const { user } = useAuthStore()
  return useQuery({
    queryKey: ['account-storage', user?.agency_id],
    enabled: !!user?.agency_id,
    queryFn: async () => {
      const agencyId = user!.agency_id

      const [agencyRes, accountsRes] = await Promise.all([
        supabase.from('agencies').select('plan').eq('id', agencyId).single(),
        supabase
          .from('accounts')
          .select('id, name, storage_used_kb')
          .eq('agency_id', agencyId)
          .order('name'),
      ])

      if (agencyRes.error) throw agencyRes.error
      if (accountsRes.error) throw accountsRes.error

      const plan = (agencyRes.data?.plan ?? 'solo') as PlanId
      const limits = getPlanLimit(plan)
      const limitKB = limits.storageGB * 1024 * 1024 // GB to KB

      const accounts = (accountsRes.data ?? []).map((acc) => ({
        id: acc.id,
        name: acc.name,
        usedKB: acc.storage_used_kb ?? 0,
        limitKB,
        percentage: limitKB > 0
          ? Math.round(((acc.storage_used_kb ?? 0) / limitKB) * 100)
          : 0,
      }))

      const totalUsedKB = accounts.reduce((sum, a) => sum + a.usedKB, 0)
      const totalLimitKB = limitKB * accounts.length

      return {
        plan,
        storageGB: limits.storageGB,
        accounts,
        totalUsedKB,
        totalLimitKB,
        totalPercentage: totalLimitKB > 0
          ? Math.round((totalUsedKB / totalLimitKB) * 100)
          : 0,
      }
    },
    staleTime: 30_000,
  })
}

export function formatKB(kb: number): string {
  if (kb < 1024) return `${kb} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  const gb = mb / 1024
  return `${gb.toFixed(2)} GB`
}
