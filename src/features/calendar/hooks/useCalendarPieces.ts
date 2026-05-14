import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type CalendarPiece = {
  id: string
  title: string
  type: string
  status: string
  scheduled_date: string
  scheduled_time: string | null
  account_id: string
  accounts: { name: string } | null
}

export function useCalendarPieces(year: number, month: number) {
  const start = new Date(year, month, 1).toISOString().split('T')[0]
  const end = new Date(year, month + 1, 0).toISOString().split('T')[0]

  return useQuery({
    queryKey: ['calendar', year, month],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('id, title, type, status, scheduled_date, scheduled_time, account_id, accounts(name)')
        .is('archived_at', null)
        .gte('scheduled_date', start)
        .lte('scheduled_date', end)
        .order('scheduled_time', { ascending: true })
      if (error) throw error
      return (data ?? []) as CalendarPiece[]
    },
  })
}

export function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDow = (firstDay.getDay() + 6) % 7 // Mon = 0
  const today = new Date().toISOString().split('T')[0]

  const days: { dateStr: string; day: number; muted: boolean; isToday: boolean }[] = []

  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    const dateStr = d.toISOString().split('T')[0]
    days.push({ dateStr, day: d.getDate(), muted: true, isToday: dateStr === today })
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    const dateStr = date.toISOString().split('T')[0]
    days.push({ dateStr, day: d, muted: false, isToday: dateStr === today })
  }
  let n = 1
  while (days.length % 7 !== 0) {
    const d = new Date(year, month + 1, n++)
    const dateStr = d.toISOString().split('T')[0]
    days.push({ dateStr, day: d.getDate(), muted: true, isToday: dateStr === today })
  }
  return days
}
