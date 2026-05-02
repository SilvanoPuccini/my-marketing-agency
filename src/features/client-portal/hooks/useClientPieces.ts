import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type ClientPiece = {
  id: string
  title: string
  type: string
  status: string
  copy: string | null
  platform: string | null
  scheduled_date: string
  scheduled_time: string | null
}

export type ClientAccountInfo = {
  accountId: string
  accountName: string
  pending: ClientPiece[]
  published: ClientPiece[]
  pendingCount: number
  approvedCount: number
  publishedCount: number
}

export function useClientPieces(userId: string | undefined) {
  return useQuery({
    queryKey: ['client-pieces', userId],
    enabled: !!userId,
    queryFn: async () => {
      // Get the account this client belongs to
      const { data: clientData, error: clientError } = await supabase
        .from('account_clients')
        .select('account_id, accounts(name)')
        .eq('user_id', userId!)
        .single()

      if (clientError) throw clientError
      if (!clientData) throw new Error('No account found for this client')

      const accountId = clientData.account_id
      const accountName = (clientData.accounts as { name: string } | null)?.name ?? '—'

      // Get all pieces for this account
      const { data: pieces, error: piecesError } = await supabase
        .from('pieces')
        .select('id, title, type, status, copy, platform, scheduled_date, scheduled_time')
        .eq('account_id', accountId)
        .in('status', ['sent_client', 'approved', 'rejected', 'published'])
        .order('scheduled_date', { ascending: true })

      if (piecesError) throw piecesError

      const all = (pieces ?? []) as ClientPiece[]

      return {
        accountId,
        accountName,
        pending:       all.filter((p) => p.status === 'sent_client' || p.status === 'rejected'),
        published:     all.filter((p) => p.status === 'published'),
        pendingCount:  all.filter((p) => p.status === 'sent_client').length,
        approvedCount: all.filter((p) => p.status === 'approved').length,
        publishedCount: all.filter((p) => p.status === 'published').length,
      } satisfies ClientAccountInfo
    },
  })
}
