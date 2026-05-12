import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Suscribe a cambios en la tabla pieces (UPDATE de status).
 * Invalida las queries del dashboard, calendario y cuentas
 * cuando otra persona cambia el status de una pieza.
 *
 * Usar en componentes de alto nivel (Dashboard, Calendar, ClientPortal).
 */
export function usePiecesRealtime() {
  const qc = useQueryClient()

  useEffect(() => {
    function invalidateAll(pieceId?: string) {
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['dashboard', 'attention'] })
      qc.invalidateQueries({ queryKey: ['calendar'] })
      qc.invalidateQueries({ queryKey: ['accounts'] })
      qc.invalidateQueries({ queryKey: ['client-pieces'] })
      if (pieceId) {
        qc.invalidateQueries({ queryKey: ['piece', pieceId] })
        qc.invalidateQueries({ queryKey: ['account-pieces'] })
      }
    }

    const channel = supabase
      .channel('pieces:changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pieces' },
        (payload) => invalidateAll(payload.new?.id as string | undefined),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'pieces' },
        (payload) => invalidateAll(payload.new?.id as string | undefined),
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [qc])
}
