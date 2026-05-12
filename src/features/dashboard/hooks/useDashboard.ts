import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type Period = 'today' | 'week' | 'month'

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const diffToMon = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setDate(now.getDate() + diffToMon)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return {
    start: mon.toISOString().split('T')[0],
    end: sun.toISOString().split('T')[0],
    weekNumber: getISOWeek(now),
  }
}

function getPeriodRange(period: Period) {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  if (period === 'today') return { start: today, end: today }
  if (period === 'week') {
    const { start, end } = getWeekRange()
    return { start, end }
  }
  // month
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  return { start, end }
}

function getISOWeek(d: Date): number {
  const tmp = new Date(d.getTime())
  tmp.setHours(0, 0, 0, 0)
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7))
  const w1 = new Date(tmp.getFullYear(), 0, 4)
  return 1 + Math.round(((tmp.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7)
}

function getPreviousPeriodRange(period: Period) {
  const now = new Date()
  if (period === 'today') {
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const d = yesterday.toISOString().split('T')[0]
    return { start: d, end: d }
  }
  if (period === 'week') {
    const { start } = getWeekRange()
    const prevEnd = new Date(start + 'T00:00:00')
    prevEnd.setDate(prevEnd.getDate() - 1)
    const prevStart = new Date(prevEnd)
    prevStart.setDate(prevEnd.getDate() - 6)
    return {
      start: prevStart.toISOString().split('T')[0],
      end: prevEnd.toISOString().split('T')[0],
    }
  }
  // previous month
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  const prevStart = new Date(prevEnd.getFullYear(), prevEnd.getMonth(), 1)
  return {
    start: prevStart.toISOString().split('T')[0],
    end: prevEnd.toISOString().split('T')[0],
  }
}

function countStatuses(data: { status: string }[]) {
  const map: Record<string, number> = {}
  for (const row of data) map[row.status] = (map[row.status] ?? 0) + 1
  const active = (map.draft ?? 0) + (map.sent_client ?? 0) + (map.approved ?? 0) + (map.rejected ?? 0)
  const pending = map.sent_client ?? 0
  const decided = (map.approved ?? 0) + (map.rejected ?? 0)
  const approvalRate = decided > 0 ? Math.round(((map.approved ?? 0) / decided) * 100) : 0
  return { active, pending, approvalRate }
}

export function useDashboardStats(agencyId: string | undefined, period: Period = 'week') {
  const { start, end } = getPeriodRange(period)
  const prev = getPreviousPeriodRange(period)
  return useQuery({
    queryKey: ['dashboard', 'stats', agencyId, period],
    enabled: !!agencyId,
    queryFn: async () => {
      const [current, previous] = await Promise.all([
        supabase
          .from('pieces')
          .select('status')
          .is('archived_at', null)
          .gte('scheduled_date', start)
          .lte('scheduled_date', end),
        supabase
          .from('pieces')
          .select('status')
          .is('archived_at', null)
          .gte('scheduled_date', prev.start)
          .lte('scheduled_date', prev.end),
      ])
      if (current.error) throw current.error
      const stats = countStatuses(current.data ?? [])
      const prevStats = countStatuses(previous.data ?? [])
      return {
        ...stats,
        prevActive: prevStats.active,
        prevPending: prevStats.pending,
        prevApprovalRate: prevStats.approvalRate,
      }
    },
  })
}

export type AttentionPiece = {
  id: string
  title: string
  type: string
  status: string
  updated_at: string
  scheduled_date: string
  scheduled_time: string | null
  accounts: { name: string } | null
  thumbnail_url: string | null
}

export function useAttentionPieces(agencyId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'attention', agencyId],
    enabled: !!agencyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('id, title, type, status, updated_at, scheduled_date, scheduled_time, accounts(name), piece_files(file_url, file_type)')
        .is('archived_at', null)
        .in('status', ['draft', 'sent_client', 'rejected'])
        .order('updated_at', { ascending: false })
        .limit(8)
      if (error) throw error
      return (data ?? []).map((p): AttentionPiece => {
        const files = (p.piece_files ?? []) as { file_url: string; file_type: string }[]
        const imageFile = files.find(f => f.file_type?.startsWith('image/'))
        return {
          id: p.id,
          title: p.title,
          type: p.type,
          status: p.status,
          updated_at: p.updated_at,
          scheduled_date: p.scheduled_date,
          scheduled_time: p.scheduled_time,
          accounts: p.accounts as { name: string } | null,
          thumbnail_url: imageFile?.file_url ?? null,
        }
      })
    },
  })
}

export type TeamMemberLoad = {
  id: string
  fullName: string
  position: string | null
  done: number
  total: number
  pct: number
}

export function useTeamLoad(agencyId: string | undefined) {
  const { start, end, weekNumber } = getWeekRange()
  return useQuery({
    queryKey: ['dashboard', 'team-load', agencyId, start],
    enabled: !!agencyId,
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('author_id, status, users!author_id(full_name, position)')
        .is('archived_at', null)
        .gte('scheduled_date', start)
        .lte('scheduled_date', end)
      if (error) throw error

      const map = new Map<string, Omit<TeamMemberLoad, 'id' | 'pct'>>()
      for (const piece of data ?? []) {
        const user = piece.users as { full_name: string; position: string | null } | null
        if (!map.has(piece.author_id)) {
          map.set(piece.author_id, {
            fullName: user?.full_name ?? '—',
            position: user?.position ?? null,
            done: 0,
            total: 0,
          })
        }
        const entry = map.get(piece.author_id)!
        entry.total++
        if (piece.status === 'published') entry.done++
      }

      return Array.from(map.entries()).map(([id, v]) => ({
        id,
        ...v,
        pct: v.total > 0 ? Math.round((v.done / v.total) * 100) : 0,
      }))
    },
    meta: { weekNumber },
  })
}

export function useAccountsWithPauta(agencyId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'pauta', agencyId],
    enabled: !!agencyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, monthly_budget, plan, is_active')
        .not('monthly_budget', 'is', null)
        .gt('monthly_budget', 0)
        .eq('is_active', true)
        .order('monthly_budget', { ascending: false })
        .limit(5)
      if (error) throw error
      return data ?? []
    },
  })
}

export type ActivityItem = {
  id: string
  title: string
  status: string
  updated_at: string
  accounts: { name: string } | null
  users: { full_name: string } | null
}

export function useRecentActivity(agencyId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard', 'activity', agencyId],
    enabled: !!agencyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('id, title, status, updated_at, accounts(name), users!author_id(full_name)')
        .is('archived_at', null)
        .order('updated_at', { ascending: false })
        .limit(5)
      if (error) throw error
      return (data ?? []) as ActivityItem[]
    },
  })
}

export { getISOWeek }
