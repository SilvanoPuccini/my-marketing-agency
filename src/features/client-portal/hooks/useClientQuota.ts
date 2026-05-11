import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { getPlanLimit, type PlanId } from '@/lib/planLimits'

type QuotaRow = {
  pieces_created: number
  pieces_limit: number
}

export function useClientQuota() {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['client-quota', user?.id],
    enabled: !!user?.id && user?.role === 'client',
    queryFn: async () => {
      const userId = user!.id
      const currentMonth = new Date().toISOString().slice(0, 7) // 'YYYY-MM'

      // client_piece_quota is not in generated types yet — query via REST
      const { data: session } = await supabase.auth.getSession()
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

      const [quotaResponse, profileRes] = await Promise.all([
        fetch(
          `${supabaseUrl}/rest/v1/client_piece_quota?user_id=eq.${userId}&year_month=eq.${currentMonth}&select=pieces_created,pieces_limit`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${session.session?.access_token ?? supabaseKey}`,
            },
          },
        ).then((r) => r.json()) as Promise<QuotaRow[]>,
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

      const quotaRow = Array.isArray(quotaResponse) ? quotaResponse[0] : null
      const used = quotaRow?.pieces_created ?? 0
      const limit = quotaRow?.pieces_limit ?? limits.piecesPerClient

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
