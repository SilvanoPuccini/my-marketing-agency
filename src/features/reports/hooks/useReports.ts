import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const CIRCUMFERENCE = 377

const TYPE_COLORS: Record<string, string> = {
  reel:     '#7C3AED',
  post:     '#3B82F6',
  carrusel: '#10B981',
  story:    '#7A7A88',
  ad:       '#F59E0B',
  blog:     '#EF4444',
}

const TYPE_LABELS: Record<string, string> = {
  reel:     'Reels',
  post:     'Posts',
  carrusel: 'Carruseles',
  story:    'Stories',
  ad:       'Ads',
  blog:     'Blog',
}

function getISOWeek(d: Date): number {
  const tmp = new Date(d.getTime())
  tmp.setHours(0, 0, 0, 0)
  tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7))
  const w1 = new Date(tmp.getFullYear(), 0, 4)
  return 1 + Math.round(((tmp.getTime() - w1.getTime()) / 86400000 - 3 + ((w1.getDay() + 6) % 7)) / 7)
}

export function useReports(agencyId: string | undefined, month?: number, year?: number) {
  const now = new Date()
  const m = month ?? now.getMonth()
  const y = year ?? now.getFullYear()
  const monthStart = new Date(y, m, 1).toISOString().split('T')[0]
  const monthEnd   = new Date(y, m + 1, 0).toISOString().split('T')[0]
  const currentWeek = getISOWeek(now)

  return useQuery({
    queryKey: ['reports', agencyId, monthStart],
    enabled: !!agencyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('id, type, status, scheduled_date, accounts(id, name)')
        .is('archived_at', null)
        .gte('scheduled_date', monthStart)
        .lte('scheduled_date', monthEnd)
      if (error) throw error
      const pieces = data ?? []

      // ── Published count ───────────────────────────────────────
      const publishedCount = pieces.filter((p) => p.status === 'published').length

      // ── Approval rate ─────────────────────────────────────────
      const approved = pieces.filter((p) => p.status === 'approved').length
      const rejected = pieces.filter((p) => p.status === 'rejected').length
      const decided = approved + rejected
      const approvalRate = decided > 0 ? Math.round((approved / decided) * 100) : 0

      // ── Type breakdown → donut segments ──────────────────────
      const typeCounts = new Map<string, number>()
      for (const p of pieces) {
        typeCounts.set(p.type, (typeCounts.get(p.type) ?? 0) + 1)
      }
      const total = pieces.length
      const sortedTypes = [...typeCounts.entries()].sort((a, b) => b[1] - a[1])
      let cumOffset = 0
      const donutSegments = sortedTypes.map(([type, count]) => {
        const dash = total > 0 ? Math.round((count / total) * CIRCUMFERENCE) : 0
        const seg = {
          color:  TYPE_COLORS[type] ?? '#7A7A88',
          label:  TYPE_LABELS[type] ?? type,
          value:  `${count} · ${total > 0 ? Math.round((count / total) * 100) : 0}%`,
          dash,
          offset: -cumOffset,
        }
        cumOffset += dash
        return seg
      })

      // ── Weekly bars ───────────────────────────────────────────
      const weekMap = new Map<number, number>()
      for (const p of pieces) {
        const week = getISOWeek(new Date(p.scheduled_date))
        weekMap.set(week, (weekMap.get(week) ?? 0) + 1)
      }
      const sortedWeeks = [...weekMap.entries()].sort((a, b) => a[0] - b[0])
      const maxCount = sortedWeeks.reduce((m, [, c]) => Math.max(m, c), 1)
      const bars = sortedWeeks.map(([week, count]) => ({
        label: `S${week}`,
        pct:   Math.round((count / maxCount) * 100),
        faded: week > currentWeek,
        count,
      }))

      const avgPerWeek  = bars.length > 0 ? Math.round(bars.reduce((s, b) => s + b.count, 0) / bars.length) : 0
      const peakBar     = bars.length > 0 ? bars.reduce((best, b) => b.count > best.count ? b : best) : null

      // ── Top accounts by piece count ───────────────────────────
      const accountMap = new Map<string, { name: string; count: number }>()
      for (const p of pieces) {
        const acc = p.accounts as { id: string; name: string } | null
        if (!acc) continue
        if (!accountMap.has(acc.id)) accountMap.set(acc.id, { name: acc.name, count: 0 })
        accountMap.get(acc.id)!.count++
      }
      const topAccounts = [...accountMap.entries()]
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([id, v]) => ({
          id,
          name:     v.name,
          initials: v.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase(),
          count:    v.count,
        }))

      return { publishedCount, approvalRate, total, donutSegments, bars, topAccounts, avgPerWeek, peakBar }
    },
  })
}
