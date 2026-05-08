import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
import { useAccounts } from './useAccounts'

const mockData = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => mockData(),
      }),
    }),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useAccounts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('retorna cuentas con métricas calculadas', async () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const midMonth = new Date(now.getFullYear(), now.getMonth(), 15).toISOString().split('T')[0]

    mockData.mockResolvedValue({
      data: [
        {
          id: 'acc-1',
          name: 'Cliente Alpha',
          handle: '@alpha',
          industry: 'Tech',
          monthly_budget: 50000,
          is_active: true,
          pieces: [
            { status: 'published', scheduled_date: midMonth },
            { status: 'draft', scheduled_date: midMonth },
            { status: 'rejected', scheduled_date: start },
          ],
          account_members: [{ users: { full_name: 'Juan Perez' } }],
        },
      ],
      error: null,
    })

    const { result } = renderHook(() => useAccounts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(1)
    const acc = result.current.data![0]
    expect(acc.name).toBe('Cliente Alpha')
    expect(acc.handle).toBe('@alpha')
    expect(acc.total).toBe(3)
    expect(acc.done).toBe(1)
    expect(acc.status).toBe('rejected')
    expect(acc.label).toBe('Con demora')
    expect(acc.manager).toBe('Juan Perez')
    expect(acc.managerInitials).toBe('JP')
  })

  it('maneja array vacío', async () => {
    mockData.mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => useAccounts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(0)
  })

  it('cuenta sin piezas tiene progreso 0', async () => {
    mockData.mockResolvedValue({
      data: [
        {
          id: 'acc-2',
          name: 'Cliente Beta',
          handle: null,
          industry: null,
          monthly_budget: null,
          is_active: false,
          pieces: [],
          account_members: [],
        },
      ],
      error: null,
    })

    const { result } = renderHook(() => useAccounts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const acc = result.current.data![0]
    expect(acc.progress).toBe(0)
    expect(acc.done).toBe(0)
    expect(acc.total).toBe(0)
    expect(acc.next).toBeNull()
    expect(acc.is_active).toBe(false)
    expect(acc.manager).toBe('—')
    expect(acc.managerInitials).toBe('—')
  })

  it('propaga error de Supabase', async () => {
    mockData.mockResolvedValue({
      data: null,
      error: new Error('connection error'),
    })

    const { result } = renderHook(() => useAccounts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
