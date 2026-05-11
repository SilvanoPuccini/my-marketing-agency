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
          account_members(account_id)
        `)
        .eq('agency_id', agencyId!)
        .in('role', ['admin_agency', 'team_member'])
        .order('full_name')

      if (error) throw error

      // Fetch weekly pieces per user separately (author_id FK may not exist)
      const wStart2 = wStart
      const wEnd2 = wEnd
      const userIds = (data ?? []).map(u => u.id)
      const { data: piecesData } = userIds.length > 0
        ? await supabase
            .from('pieces')
            .select('id, status, scheduled_date, author_id')
            .is('archived_at', null)
            .in('author_id', userIds)
            .gte('scheduled_date', wStart2)
            .lte('scheduled_date', wEnd2)
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
        const total = userPieces.length
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
