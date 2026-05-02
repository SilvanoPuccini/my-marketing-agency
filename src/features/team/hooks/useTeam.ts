import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type TeamMemberRow = {
  id: string
  full_name: string
  role: string
  position: string | null
  is_active: boolean
  initials: string
  accountCount: number
  piecesDone: number
  piecesTotal: number
  loadPct: number
}

function mkInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

export function useTeam(agencyId: string | undefined) {
  return useQuery({
    queryKey: ['team', agencyId],
    enabled: !!agencyId,
    queryFn: async () => {
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      const wStart = weekStart.toISOString().split('T')[0]
      const wEnd = weekEnd.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('users')
        .select(`
          id, full_name, role, position, is_active,
          account_members(account_id),
          pieces!author_id(id, status, scheduled_date)
        `)
        .eq('agency_id', agencyId!)
        .eq('role', 'team_member')
        .order('full_name')

      if (error) throw error

      return (data ?? []).map((u): TeamMemberRow => {
        const members = u.account_members as { account_id: string }[]
        const pieces = u.pieces as { id: string; status: string; scheduled_date: string }[]

        const weekPieces = pieces.filter(
          (p) => p.scheduled_date >= wStart && p.scheduled_date <= wEnd
        )
        const done = weekPieces.filter((p) => p.status === 'published').length
        const total = weekPieces.length
        const loadPct = total > 0 ? Math.round((done / total) * 100) : 0

        return {
          id: u.id,
          full_name: u.full_name,
          role: u.role,
          position: u.position,
          is_active: u.is_active,
          initials: mkInitials(u.full_name),
          accountCount: members.length,
          piecesDone: done,
          piecesTotal: total,
          loadPct,
        }
      })
    },
  })
}
