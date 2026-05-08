import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from './auth.store'

// Mock Supabase
const mockSignIn = vi.fn()
const mockSignOut = vi.fn()
const mockSelect = vi.fn()

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => mockSignIn(...args),
      signOut: (...args: unknown[]) => mockSignOut(...args),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => mockSelect(),
        }),
      }),
    }),
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    })
    vi.clearAllMocks()
  })

  it('tiene estado inicial correcto', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(state.isLoading).toBe(true)
  })

  it('setUser actualiza user y isAuthenticated', () => {
    const mockUser = {
      id: '1',
      agency_id: 'agency-1',
      email: 'test@test.com',
      full_name: 'Test User',
      role: 'admin_agency' as const,
      initials: 'TU',
      is_active: true,
      created_at: '2024-01-01',
    }

    useAuthStore.getState().setUser(mockUser)

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.isAuthenticated).toBe(true)
  })

  it('setUser(null) desautentica', () => {
    useAuthStore.getState().setUser({
      id: '1',
      agency_id: 'a',
      email: 'a@a.com',
      full_name: 'A',
      role: 'admin_agency',
      initials: 'A',
      is_active: true,
      created_at: '',
    })

    useAuthStore.getState().setUser(null)

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('login exitoso retorna rol', async () => {
    mockSignIn.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })
    mockSelect.mockResolvedValue({
      data: { role: 'admin_agency' },
    })

    const result = await useAuthStore.getState().login('test@test.com', 'password123')

    expect(result.error).toBeNull()
    expect(result.role).toBe('admin_agency')
    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123',
    })
  })

  it('login fallido retorna error', async () => {
    mockSignIn.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    })

    const result = await useAuthStore.getState().login('bad@test.com', 'wrong')

    expect(result.error).toBe('Invalid login credentials')
    expect(result.role).toBeNull()
  })

  it('logout limpia el estado', async () => {
    mockSignOut.mockResolvedValue({ error: null })

    // Set authenticated state first
    useAuthStore.getState().setUser({
      id: '1',
      agency_id: 'a',
      email: 'a@a.com',
      full_name: 'A',
      role: 'admin_agency',
      initials: 'A',
      is_active: true,
      created_at: '',
    })

    await useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('setLoading actualiza isLoading', () => {
    useAuthStore.getState().setLoading(false)
    expect(useAuthStore.getState().isLoading).toBe(false)

    useAuthStore.getState().setLoading(true)
    expect(useAuthStore.getState().isLoading).toBe(true)
  })
})
