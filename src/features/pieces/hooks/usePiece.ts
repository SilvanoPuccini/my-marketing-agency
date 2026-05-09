import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { getTransitionError } from '@/features/pieces/utils/pieceTransitions'
import type { PieceStatus, UserRole } from '@/types/domain.types'

export type PieceDetail = {
  id: string
  title: string
  type: string
  copy: string | null
  platform: string | null
  scheduled_date: string
  scheduled_time: string | null
  status: string
  rejection_reason: string | null
  has_pauta: boolean
  pauta_amount: number | null
  updated_at: string
  accounts: { name: string } | null
  comments: Array<{
    id: string
    content: string
    created_at: string
    users: { full_name: string } | null
  }>
}

export function usePiece(id: string | null) {
  return useQuery({
    queryKey: ['piece', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select(`
          id, title, type, copy, platform, scheduled_date, scheduled_time,
          status, rejection_reason, has_pauta, pauta_amount, updated_at,
          accounts(name),
          comments(id, content, created_at, users!author_id(full_name))
        `)
        .eq('id', id!)
        .order('created_at', { referencedTable: 'comments', ascending: true })
        .single()
      if (error) throw error
      return data as PieceDetail
    },
  })
}

export function useUpdatePieceStatus() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      currentStatus,
      rejection_reason,
    }: {
      id: string
      status: string
      currentStatus: string
      rejection_reason?: string
    }) => {
      const role = user?.role as UserRole | undefined
      if (!role) throw new Error('No autenticado')

      const transitionError = getTransitionError(
        currentStatus as PieceStatus,
        status as PieceStatus,
        role,
      )
      if (transitionError) throw new Error(transitionError)

      const { error } = await supabase
        .from('pieces')
        .update({ status, ...(rejection_reason !== undefined ? { rejection_reason } : {}) })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_, { id, status }) => {
      const labels: Record<string, string> = {
        sent_client: 'Pieza enviada al cliente',
        published:   'Pieza marcada como publicada',
        approved:    'Pieza aprobada',
        rejected:    'Cambios solicitados',
        draft:       'Pieza vuelta a borrador',
      }
      toast.success(labels[status] ?? 'Estado actualizado')
      qc.invalidateQueries({ queryKey: ['piece', id] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['dashboard', 'attention'] })
      qc.invalidateQueries({ queryKey: ['calendar'] })
      qc.invalidateQueries({ queryKey: ['client-pieces'] })
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo actualizar el estado'),
  })
}

export function useAddComment() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  return useMutation({
    mutationFn: async ({ pieceId, content }: { pieceId: string; content: string }) => {
      if (!user) throw new Error('No autenticado')
      const { error } = await supabase
        .from('comments')
        .insert({ piece_id: pieceId, author_id: user.id, content })
      if (error) throw error
    },
    onSuccess: (_, { pieceId }) => {
      toast.success('Comentario enviado')
      qc.invalidateQueries({ queryKey: ['piece', pieceId] })
    },
    onError: (e: Error) => toast.error(e.message || 'No se pudo enviar el comentario'),
  })
}

export type CreatePieceInput = {
  account_id: string
  title: string
  type: string
  copy?: string
  platform?: string
  scheduled_date: string
  scheduled_time?: string
  has_pauta: boolean
  pauta_amount?: number
}

export function useCreatePiece() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  return useMutation({
    mutationFn: async (input: CreatePieceInput): Promise<string> => {
      if (!user) throw new Error('No autenticado')
      const { data, error } = await supabase.from('pieces').insert({
        account_id:     input.account_id,
        author_id:      user.id,
        title:          input.title,
        type:           input.type,
        copy:           input.copy || null,
        platform:       input.platform || null,
        scheduled_date: input.scheduled_date,
        scheduled_time: input.scheduled_time || null,
        has_pauta:      input.has_pauta,
        pauta_amount:   input.has_pauta ? (input.pauta_amount ?? null) : null,
        status:         'draft',
      }).select('id').single()
      if (error) throw error
      return data.id
    },
    onSuccess: () => {
      toast.success('Pieza creada')
      qc.invalidateQueries({ queryKey: ['calendar'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      qc.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (e: Error) => toast.error(e.message ?? 'No se pudo crear la pieza'),
  })
}
