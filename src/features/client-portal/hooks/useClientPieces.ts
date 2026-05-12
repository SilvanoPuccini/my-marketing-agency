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
  thumbnail_url: string | null
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

      // Get all pieces for this account with first file thumbnail
      const { data: pieces, error: piecesError } = await supabase
        .from('pieces')
        .select('id, title, type, status, copy, platform, scheduled_date, scheduled_time, piece_files(file_url, file_type)')
        .is('archived_at', null)
        .eq('account_id', accountId)
        .in('status', ['sent_client', 'approved', 'rejected', 'published'])
        .order('scheduled_date', { ascending: true })

      if (piecesError) throw piecesError

      const all = (pieces ?? []).map((p): ClientPiece => {
        const files = (p.piece_files ?? []) as { file_url: string; file_type: string }[]
        const imageFile = files.find(f => f.file_type?.startsWith('image/'))
        return {
          id: p.id,
          title: p.title,
          type: p.type,
          status: p.status,
          copy: p.copy,
          platform: p.platform,
          scheduled_date: p.scheduled_date,
          scheduled_time: p.scheduled_time,
          thumbnail_url: imageFile?.file_url ?? null,
        }
      })

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
