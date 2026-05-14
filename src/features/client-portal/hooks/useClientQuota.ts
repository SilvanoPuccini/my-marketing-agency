import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { getPlanLimit, type PlanId } from '@/lib/planLimits'

export function useClientQuota() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['client-quota', user?.id],
    enabled: !!user?.id && user?.role === 'client',
    queryFn: async () => {
      const userId = user!.id
      const now = new Date()
      const yearMonth = now.toISOString().slice(0, 7) // 'YYYY-MM'
      const firstDay = `${yearMonth}-01`
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const lastDay = nextMonth.toISOString().slice(0, 10)

      // Get client's account and agency plan
      const { data: clientData, error: clientError } = await supabase
        .from('account_clients')
        .select('account_id, accounts(agency_id, agencies(plan))')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle()

      if (clientError) throw clientError
      if (!clientData) return { used: 0, limit: 0, remaining: 0, atLimit: false, percentage: 0 }

      const plan = (
        (clientData.accounts as { agency_id: string; agencies: { plan: string } | null } | null)
          ?.agencies?.plan
      ) as PlanId ?? 'solo'
      const limits = getPlanLimit(plan)
      const pieceLimit = limits.piecesPerClient

      // Count actual pieces for this account in current month
      const { count, error: countError } = await supabase
        .from('pieces')
        .select('id', { count: 'exact', head: true })
        .eq('account_id', clientData.account_id)
        .is('archived_at', null)
        .in('status', ['sent_client', 'approved', 'rejected', 'published'])
        .gte('scheduled_date', firstDay)
        .lt('scheduled_date', lastDay)

      if (countError) throw countError

      const used = count ?? 0
      return {
        used,
        limit: pieceLimit,
        remaining: Math.max(0, pieceLimit - used),
        atLimit: used >= pieceLimit,
        percentage: pieceLimit > 0 ? Math.round((used / pieceLimit) * 100) : 0,
      }
    },
    staleTime: 10_000,
  })
}
