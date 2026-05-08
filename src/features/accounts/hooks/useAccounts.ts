import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

function monthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
  const today = now.toISOString().split('T')[0]
  return { start, end, today }
}

function deriveStatus(statuses: string[]): string {
  if (statuses.includes('rejected')) return 'rejected'
  if (statuses.includes('sent_client')) return 'sent_client'
  if (statuses.includes('draft')) return 'draft'
  if (statuses.every((s) => s === 'published' || s === 'approved')) return 'approved'
  return 'approved'
}

function deriveLabel(status: string): string {
  if (status === 'rejected') return 'Con demora'
  if (status === 'sent_client') return 'Esperando aprobación'
  if (status === 'draft') return 'En progreso'
  return 'Al día'
}

function mkInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

export type AccountRow = {
  id: string
  name: string
  handle: string | null
  industry: string | null
  monthly_budget: number | null
  is_active: boolean
  manager: string
  managerInitials: string
  done: number
  total: number
  progress: number
  next: string | null
  status: string
  label: string
}

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          id, name, handle, industry, monthly_budget, is_active,
          pieces(status, scheduled_date),
          account_members(users(full_name))
        `)
        .order('name')
      if (error) throw error

      const { start, end, today } = monthRange()

      return (data ?? []).map((acc): AccountRow => {
        const members = acc.account_members as { users: { full_name: string } | null }[] | null
        const firstMember = members?.[0]?.users?.full_name ?? null
        const managerName = firstMember ?? '—'
        const managerInitials = firstMember ? mkInitials(firstMember) : '—'

        const pieces = acc.pieces as { status: string; scheduled_date: string }[]

        const monthPieces = pieces.filter(
          (p) => p.scheduled_date >= start && p.scheduled_date <= end
        )
        const done = monthPieces.filter((p) => p.status === 'published').length
        const total = monthPieces.length
        const progress = total > 0 ? Math.round((done / total) * 100) : 0

        const upcoming = pieces
          .filter((p) => p.scheduled_date >= today && p.status !== 'published')
          .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
        const nextDate = upcoming[0]?.scheduled_date ?? null

        const allStatuses = pieces.map((p) => p.status)
        const status = deriveStatus(allStatuses)

        return {
          id: acc.id,
          name: acc.name,
          handle: acc.handle,
          industry: acc.industry,
          monthly_budget: acc.monthly_budget,
          is_active: acc.is_active,
          manager: managerName,
          managerInitials,
          done,
          total,
          progress,
          next: nextDate,
          status,
          label: deriveLabel(status),
        }
      })
    },
  })
}
