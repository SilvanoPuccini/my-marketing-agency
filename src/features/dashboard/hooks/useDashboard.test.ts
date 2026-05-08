import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useDashboardStats, useAttentionPieces, useRecentActivity, getISOWeek } from './useDashboard'

// Mock Supabase
const mockData = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        gte: () => ({
          lte: () => mockData(),
        }),
        in: () => ({
          order: () => ({
            limit: () => mockData(),
          }),
        }),
        order: () => ({
          limit: () => mockData(),
        }),
        not: () => ({
          gt: () => ({
            eq: () => ({
              order: () => ({
                limit: () => mockData(),
              }),
            }),
          }),
        }),
      }),
    }),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useDashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna estadisticas calculadas desde pieces', async () => {
    mockData.mockResolvedValue({
      data: [
        { status: 'draft' },
        { status: 'draft' },
        { status: 'sent_client' },
        { status: 'approved' },
        { status: 'approved' },
        { status: 'rejected' },
        { status: 'published' },
      ],
      error: null,
    })

    const { result } = renderHook(
      () => useDashboardStats('agency-1', 'week'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // active = draft(2) + sent_client(1) + approved(2) + rejected(1) = 6
    expect(result.current.data?.active).toBe(6)
    // pending = sent_client = 1
    expect(result.current.data?.pending).toBe(1)
    // approvalRate = approved(2) / decided(2+1) = 67%
    expect(result.current.data?.approvalRate).toBe(67)
  })

  it('no ejecuta query sin agencyId', () => {
    const { result } = renderHook(
      () => useDashboardStats(undefined, 'week'),
      { wrapper: createWrapper() },
    )

    expect(result.current.fetchStatus).toBe('idle')
  })

  it('maneja array vacio', async () => {
    mockData.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(
      () => useDashboardStats('agency-1', 'month'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.active).toBe(0)
    expect(result.current.data?.pending).toBe(0)
    expect(result.current.data?.approvalRate).toBe(0)
  })
})

describe('useAttentionPieces', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna piezas que necesitan atencion', async () => {
    const mockPieces = [
      { id: '1', title: 'Post IG', type: 'post', status: 'draft', updated_at: '2024-01-01', scheduled_date: '2024-01-05', scheduled_time: null, accounts: { name: 'Cliente A' } },
      { id: '2', title: 'Reel', type: 'reel', status: 'rejected', updated_at: '2024-01-02', scheduled_date: '2024-01-06', scheduled_time: '10:00', accounts: { name: 'Cliente B' } },
    ]

    mockData.mockResolvedValue({ data: mockPieces, error: null })

    const { result } = renderHook(
      () => useAttentionPieces('agency-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].title).toBe('Post IG')
  })
})

describe('useRecentActivity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna actividad reciente', async () => {
    const mockActivity = [
      { id: '1', title: 'Post', status: 'published', updated_at: '2024-01-01', accounts: { name: 'Acme' }, users: { full_name: 'Juan' } },
    ]

    mockData.mockResolvedValue({ data: mockActivity, error: null })

    const { result } = renderHook(
      () => useRecentActivity('agency-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].title).toBe('Post')
  })
})

describe('getISOWeek', () => {
  it('calcula semana ISO correctamente', () => {
    // 2024-01-01 is Monday of week 1
    expect(getISOWeek(new Date(2024, 0, 1))).toBe(1)
    // 2024-12-30 is Monday of week 1 of 2025
    expect(getISOWeek(new Date(2024, 11, 30))).toBe(1)
  })
})
