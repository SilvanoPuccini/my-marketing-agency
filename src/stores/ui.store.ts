import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  activeModal: string | null
  activePieceId: string | null
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  openModal: (modal: string, pieceId?: string) => void
  closeModal: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  activePieceId: null,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openModal: (activeModal, activePieceId) => set({ activeModal, activePieceId: activePieceId ?? null }),
  closeModal: () => set({ activeModal: null, activePieceId: null }),
}))
