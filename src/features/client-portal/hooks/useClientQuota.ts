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
      const currentMonth = new Date().toISOString().slice(0, 7) // 'YYYY-MM'

      // Fetch quota row and agency plan in parallel
      const [quotaRes, profileRes] = await Promise.all([
        supabase
          .from('client_piece_quota')
          .select('pieces_created, pieces_limit')
          .eq('user_id', userId)
          .eq('year_month', currentMonth)
          .maybeSingle(),
        supabase
          .from('users')
          .select('agency_id, agencies(plan)')
          .eq('id', userId)
          .single(),
      ])

      if (profileRes.error) throw profileRes.error

      const plan = (
        profileRes.data?.agencies as { plan: string } | null
      )?.plan as PlanId ?? 'solo'
      const limits = getPlanLimit(plan)

      const used = quotaRes.data?.pieces_created ?? 0
      const limit = quotaRes.data?.pieces_limit ?? limits.piecesPerClient

      return {
        used,
        limit,
        remaining: Math.max(0, limit - used),
        atLimit: used >= limit,
        percentage: limit > 0 ? Math.round((used / limit) * 100) : 0,
      }
    },
    staleTime: 10_000,
  })
}
