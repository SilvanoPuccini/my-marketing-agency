import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAgencySettings } from '@/features/settings/hooks/useAgencySettings'
import { getPlanLimit, type PlanId } from '@/lib/planLimits'

const PLAN_LABELS: Record<string, string> = {
  solo:    'Solo',
  estudio: 'Estudio',
  casa:    'Casa',
}

const PLAN_PRICES: Record<string, number> = {
  solo:    26,
  estudio: 52,
  casa:    104,
}

export function useBilling() {
  const { data: agency, isLoading: agencyLoading } = useAgencySettings()

  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['billing-usage'],
    queryFn: async () => {
      const [accountsRes, seatsRes, storageRes] = await Promise.all([
        supabase.from('accounts').select('id', { count: 'exact', head: true }),
        supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .in('role', ['admin_agency', 'team_member', 'manager', 'creator'])
          .eq('is_active', true),
        supabase.from('piece_files').select('file_size_kb'),
      ])
      const totalStorageKB = (storageRes.data ?? []).reduce(
        (sum, f) => sum + (f.file_size_kb ?? 0),
        0,
      )
      return {
        accountsUsed: accountsRes.count ?? 0,
        seatsUsed:    seatsRes.count ?? 0,
        storageUsedGB: Math.round((totalStorageKB / 1024 / 1024) * 10) / 10,
      }
    },
  })

  const plan = (agency?.plan ?? 'solo') as PlanId
  const limits = getPlanLimit(plan)

  return {
    agency,
    accountsUsed:  usage?.accountsUsed  ?? 0,
    seatsUsed:     usage?.seatsUsed     ?? 0,
    storageUsedGB: usage?.storageUsedGB ?? 0,
    limits: {
      accounts:              limits.accounts,
      seats:                 limits.teamSeats,
      storageGB:             limits.storageGB,
      portalClientsPerAccount: limits.portalClientsPerAccount,
      piecesPerClient:       limits.piecesPerClient,
    },
    planLabel: PLAN_LABELS[plan] ?? plan,
    planPrice: PLAN_PRICES[plan] ?? 0,
    isLoading: agencyLoading || usageLoading,
  }
}
