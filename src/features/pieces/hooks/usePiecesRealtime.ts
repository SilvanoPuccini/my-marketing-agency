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
    const channel = supabase
      .channel('pieces:status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pieces',
        },
        (payload) => {
          const pieceId = payload.new?.id as string | undefined
          // Invalidar queries globales
          qc.invalidateQueries({ queryKey: ['dashboard'] })
          qc.invalidateQueries({ queryKey: ['dashboard', 'attention'] })
          qc.invalidateQueries({ queryKey: ['calendar'] })
          qc.invalidateQueries({ queryKey: ['accounts'] })
          qc.invalidateQueries({ queryKey: ['client-pieces'] })
          // Invalidar pieza específica si está abierta
          if (pieceId) {
            qc.invalidateQueries({ queryKey: ['piece', pieceId] })
            qc.invalidateQueries({ queryKey: ['account-pieces'] })
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [qc])
}
