import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface MemberAccount {
  id: string
  name: string
  initials: string
  pieceCount: number
}

export interface MemberPiece {
  id: string
  title: string
  type: string
  status: string
  scheduled_date: string
  scheduled_time: string | null
  rejection_reason: string | null
  account_name: string
}

export interface MemberDetail {
  id: string
  full_name: string
  email: string
  role: string
  position: string | null
  is_active: boolean
  created_at: string
  initials: string
  accounts: MemberAccount[]
  pieces: MemberPiece[]
  stats: {
    totalPieces: number
    approvedFirstTry: number
    approvalRate: number
    weeklyLoad: number
    weeklyCapacity: number
  }
}

function mkInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

export function useTeamMember(memberId: string | undefined) {
  return useQuery({
    queryKey: ['team-member', memberId],
    enabled: !!memberId,
    queryFn: async (): Promise<MemberDetail> => {
      // Fetch user profile
      const { data: user, error } = await supabase
        .from('users')
        .select('id, full_name, email, role, position, is_active, created_at')
        .eq('id', memberId!)
        .single()
      if (error || !user) throw error ?? new Error('User not found')

      // Fetch accounts via account_members
      const { data: memberLinks } = await supabase
        .from('account_members')
        .select('account_id, accounts(id, name)')
        .eq('user_id', memberId!)

      const accountIds = (memberLinks ?? []).map((l) => {
        const acc = l.accounts as unknown as { id: string; name: string }
        return acc
      }).filter(Boolean)

      // Fetch all pieces by this author (not archived)
      const { data: pieces } = await supabase
        .from('pieces')
        .select('id, title, type, status, scheduled_date, scheduled_time, rejection_reason, account_id, accounts(name)')
        .eq('author_id', memberId!)
        .is('archived_at', null)
        .order('scheduled_date', { ascending: true })

      const allPieces = pieces ?? []

      // Piece counts per account
      const pieceCounts = new Map<string, number>()
      for (const p of allPieces) {
        pieceCounts.set(p.account_id, (pieceCounts.get(p.account_id) ?? 0) + 1)
      }

      const accounts: MemberAccount[] = accountIds.map((acc) => ({
        id: acc.id,
        name: acc.name,
        initials: mkInitials(acc.name),
        pieceCount: pieceCounts.get(acc.id) ?? 0,
      }))

      // Weekly load
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      const wStart = weekStart.toISOString().split('T')[0]
      const wEnd = weekEnd.toISOString().split('T')[0]
      const weeklyPieces = allPieces.filter(
        (p) => p.scheduled_date >= wStart && p.scheduled_date <= wEnd
      )

      // Stats
      const totalPieces = allPieces.length
      const approvedPieces = allPieces.filter((p) => p.status === 'approved' || p.status === 'published')
      const rejectedPieces = allPieces.filter((p) => p.status === 'rejected')
      const approvedFirstTry = approvedPieces.length
      const approvalRate = totalPieces > 0
        ? Math.round((approvedFirstTry / Math.max(1, approvedFirstTry + rejectedPieces.length)) * 100)
        : 0

      const memberPieces: MemberPiece[] = allPieces.map((p) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        status: p.status,
        scheduled_date: p.scheduled_date,
        scheduled_time: p.scheduled_time,
        rejection_reason: p.rejection_reason,
        account_name: (p.accounts as unknown as { name: string })?.name ?? '',
      }))

      return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        position: user.position,
        is_active: user.is_active,
        created_at: user.created_at,
        initials: mkInitials(user.full_name),
        accounts,
        pieces: memberPieces,
        stats: {
          totalPieces,
          approvedFirstTry,
          approvalRate,
          weeklyLoad: weeklyPieces.length,
          weeklyCapacity: 14,
        },
      }
    },
  })
}
