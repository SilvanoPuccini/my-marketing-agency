import { create } from 'zustand'
import type { PieceType } from '@/types/domain.types'

interface FiltersState {
  librarySearch: string
  libraryTypeFilter: PieceType | 'all'
  setLibrarySearch: (search: string) => void
  setLibraryTypeFilter: (type: PieceType | 'all') => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  librarySearch: '',
  libraryTypeFilter: 'all',
  setLibrarySearch: (librarySearch) => set({ librarySearch }),
  setLibraryTypeFilter: (libraryTypeFilter) => set({ libraryTypeFilter }),
}))
