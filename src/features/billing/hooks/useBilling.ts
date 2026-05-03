import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAgencySettings } from '@/features/settings/hooks/useAgencySettings'

const PLAN_LIMITS = {
  solo:    { accounts: 8,  seats: 3,  storageGB: 20 },
  estudio: { accounts: 25, seats: 15, storageGB: 100 },
  casa:    { accounts: 999, seats: 50, storageGB: 500 },
} as const

const PLAN_LABELS: Record<string, string> = {
  solo:    'Solo',
  estudio: 'Estudio',
  casa:    'Casa',
}

const PLAN_PRICES: Record<string, number> = {
  solo:    36000,
  estudio: 84000,
  casa:    210000,
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
          .in('role', ['admin_agency', 'team_member'])
          .eq('is_active', true),
        supabase.from('piece_files').select('file_size_kb'),
      ])
      const storageKB = (storageRes.data ?? []).reduce(
        (sum, f) => sum + (f.file_size_kb ?? 0),
        0,
      )
      return {
        accountsUsed: accountsRes.count ?? 0,
        seatsUsed:    seatsRes.count ?? 0,
        storageUsedGB: Math.round((storageKB / 1024 / 1024) * 10) / 10,
      }
    },
  })

  const plan = (agency?.plan ?? 'estudio') as keyof typeof PLAN_LIMITS
  const limits = PLAN_LIMITS[plan] ?? PLAN_LIMITS.estudio

  return {
    agency,
    accountsUsed:  usage?.accountsUsed  ?? 0,
    seatsUsed:     usage?.seatsUsed     ?? 0,
    storageUsedGB: usage?.storageUsedGB ?? 0,
    limits,
    planLabel: PLAN_LABELS[plan] ?? plan,
    planPrice: PLAN_PRICES[plan] ?? 0,
    isLoading: agencyLoading || usageLoading,
  }
}
