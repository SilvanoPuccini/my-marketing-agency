import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type Invoice = {
  id: string
  agency_id: string
  number: string
  period: string
  emision_date: string
  concept: string
  subtotal: number
  iva: number
  total: number
  status: 'pending' | 'paid' | 'overdue'
  created_at: string
}

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('emision_date', { ascending: false })
      if (error) throw error
      return (data ?? []) as Invoice[]
    },
  })
}
