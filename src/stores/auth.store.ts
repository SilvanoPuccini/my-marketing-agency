import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types/domain.types'

function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<{ error: string | null; role: string | null }>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message, role: null }
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single()
    return { error: null, role: profile?.role ?? null }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, isAuthenticated: false })
  },
}))

// Inicializa auth: verifica sesión existente y escucha cambios
export async function initAuth() {
  const { setUser, setLoading } = useAuthStore.getState()

  const fetchProfile = async (userId: string): Promise<User | null> => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!data) return null

    return {
      ...data,
      initials: getInitials(data.full_name),
      position: data.position ?? undefined,
      avatar_url: data.avatar_url ?? undefined,
    }
  }

  // Verifica si ya hay sesión activa (recarga de página)
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    const profile = await fetchProfile(session.user.id)
    setUser(profile)
  }
  setLoading(false)

  // Escucha cambios de auth (login, logout, token refresh)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT') {
      useAuthStore.getState().setUser(null)
      return
    }
    if (session?.user) {
      const profile = await fetchProfile(session.user.id)
      useAuthStore.getState().setUser(profile)
    }
  })
}
