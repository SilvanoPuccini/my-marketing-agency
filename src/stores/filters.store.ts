import { create } from 'zustand'
import type { PieceStatus, PieceType } from '@/types/domain.types'

interface FiltersState {
  calendarAccountFilter: string | null
  calendarStatusFilter: PieceStatus | null
  calendarMonth: number
  calendarYear: number
  accountsSearch: string
  accountsFilter: 'all' | 'active' | 'paused' | 'delayed'
  accountsView: 'list' | 'cards'
  librarySearch: string
  libraryTypeFilter: PieceType | 'all'
  setCalendarAccount: (accountId: string | null) => void
  setCalendarStatus: (status: PieceStatus | null) => void
  setCalendarMonth: (month: number, year: number) => void
  setAccountsSearch: (search: string) => void
  setAccountsFilter: (filter: FiltersState['accountsFilter']) => void
  setAccountsView: (view: FiltersState['accountsView']) => void
  setLibrarySearch: (search: string) => void
  setLibraryTypeFilter: (type: PieceType | 'all') => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  calendarAccountFilter: null,
  calendarStatusFilter: null,
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  accountsSearch: '',
  accountsFilter: 'all',
  accountsView: 'list',
  librarySearch: '',
  libraryTypeFilter: 'all',
  setCalendarAccount: (calendarAccountFilter) => set({ calendarAccountFilter }),
  setCalendarStatus: (calendarStatusFilter) => set({ calendarStatusFilter }),
  setCalendarMonth: (calendarMonth, calendarYear) => set({ calendarMonth, calendarYear }),
  setAccountsSearch: (accountsSearch) => set({ accountsSearch }),
  setAccountsFilter: (accountsFilter) => set({ accountsFilter }),
  setAccountsView: (accountsView) => set({ accountsView }),
  setLibrarySearch: (librarySearch) => set({ librarySearch }),
  setLibraryTypeFilter: (libraryTypeFilter) => set({ libraryTypeFilter }),
}))
