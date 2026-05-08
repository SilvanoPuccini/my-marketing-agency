import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { usePiece, useAddComment, useUpdatePieceStatus } from './usePiece'

const mockSingle = vi.fn()
const mockUpdate = vi.fn()
const mockInsert = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: (table: string) => {
      if (table === 'pieces') {
        return {
          select: () => ({
            eq: () => ({
              order: () => ({
                single: () => mockSingle(),
              }),
            }),
          }),
          update: () => ({
            eq: () => mockUpdate(),
          }),
        }
      }
      if (table === 'comments') {
        return {
          insert: () => mockInsert(),
        }
      }
      return {}
    },
  },
}))

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    user: { id: 'user-1', initials: 'TU', role: 'admin_agency' },
  }),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('usePiece', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna pieza con comentarios', async () => {
    const mockPiece = {
      id: 'piece-1',
      title: 'Post Instagram',
      type: 'post',
      copy: 'Copy de prueba',
      platform: 'Instagram',
      scheduled_date: '2024-03-15',
      scheduled_time: '10:00',
      status: 'draft',
      rejection_reason: null,
      has_pauta: false,
      pauta_amount: null,
      updated_at: '2024-03-10T12:00:00Z',
      accounts: { name: 'Cliente A' },
      comments: [
        { id: 'c-1', content: 'Buen copy', created_at: '2024-03-10T10:00:00Z', users: { full_name: 'Juan' } },
      ],
    }

    mockSingle.mockResolvedValue({ data: mockPiece, error: null })

    const { result } = renderHook(() => usePiece('piece-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.title).toBe('Post Instagram')
    expect(result.current.data?.comments).toHaveLength(1)
    expect(result.current.data?.accounts?.name).toBe('Cliente A')
  })

  it('no ejecuta query sin id', () => {
    const { result } = renderHook(() => usePiece(null), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('propaga error de Supabase', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: new Error('not found'),
    })

    const { result } = renderHook(() => usePiece('bad-id'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useUpdatePieceStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('actualiza estado con transición válida', async () => {
    mockUpdate.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useUpdatePieceStatus(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: 'piece-1', status: 'sent_client', currentStatus: 'draft' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('rechaza transición inválida (draft → published)', async () => {
    const { result } = renderHook(() => useUpdatePieceStatus(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: 'piece-1', status: 'published', currentStatus: 'draft' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toContain('sent_client')
  })

  it('maneja error de Supabase', async () => {
    mockUpdate.mockResolvedValue({ error: new Error('update failed') })

    const { result } = renderHook(() => useUpdatePieceStatus(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ id: 'piece-1', status: 'sent_client', currentStatus: 'draft' })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe('useAddComment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('agrega comentario', async () => {
    mockInsert.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAddComment(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ pieceId: 'piece-1', content: 'Muy bueno!' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('maneja error al comentar', async () => {
    mockInsert.mockResolvedValue({ error: new Error('insert failed') })

    const { result } = renderHook(() => useAddComment(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ pieceId: 'piece-1', content: 'test' })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
