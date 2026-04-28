import { create } from 'zustand'
import type { User } from '@/types/domain.types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

// Mock user for development
const MOCK_USER: User = {
  id: '1',
  agency_id: 'agency-1',
  email: 'lucia@estudiopampas.com.ar',
  full_name: 'Lucía Fernández',
  initials: 'LF',
  role: 'admin_agency',
  position: 'Directora',
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
}

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USER,
  isAuthenticated: true,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
