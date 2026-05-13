import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { mkInitials, getCurrentWeekRange } from '@/lib/utils'

export type TeamMemberRow = {
  id: string
  full_name: string
  role: string
  position: string | null
  is_active: boolean
  initials: string
  accountCount: number
  weeklyPieces: number
  weeklyDone: number
}

export function useTeam(agencyId: string | undefined) {
  return useQuery({
    queryKey: ['team', agencyId],
    enabled: !!agencyId,
    queryFn: async () => {
      const { wStart, wEnd } = getCurrentWeekRange()

      const { data, error } = await supabase
        .from('users')
        .select(`
          id, full_name, role, position, is_active,
          account_members(account_id)
        `)
        .eq('agency_id', agencyId!)
        .in('role', ['admin_agency', 'manager', 'creator', 'team_member'])
        .order('full_name')

      if (error) throw error

      const userIds = (data ?? []).map(u => u.id)
      const { data: piecesData } = userIds.length > 0
        ? await supabase
            .from('pieces')
            .select('id, status, author_id')
            .is('archived_at', null)
            .in('author_id', userIds)
            .gte('scheduled_date', wStart)
            .lte('scheduled_date', wEnd)
        : { data: [] }

      const piecesByUser = new Map<string, { id: string; status: string }[]>()
      for (const p of (piecesData ?? [])) {
        if (!piecesByUser.has(p.author_id)) piecesByUser.set(p.author_id, [])
        piecesByUser.get(p.author_id)!.push(p)
      }

      return (data ?? []).map((u): TeamMemberRow => {
        const members = u.account_members as { account_id: string }[]
        const userPieces = piecesByUser.get(u.id) ?? []
        const done = userPieces.filter((p) => p.status === 'published').length

        return {
          id: u.id,
          full_name: u.full_name,
          role: u.role,
          position: u.position,
          is_active: u.is_active,
          initials: mkInitials(u.full_name),
          accountCount: members.length,
          weeklyPieces: userPieces.length,
          weeklyDone: done,
        }
      })
    },
  })
}
