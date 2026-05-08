import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useCommentsRealtime(pieceId: string | null) {
  const qc = useQueryClient()

  useEffect(() => {
    if (!pieceId) return

    const channel = supabase
      .channel(`comments:piece:${pieceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `piece_id=eq.${pieceId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ['piece', pieceId] })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pieceId, qc])
}
