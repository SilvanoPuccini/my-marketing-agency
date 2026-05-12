import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export type BillingInterval = 'monthly' | 'yearly' | 'semiannual'

export function useCheckout() {
  return useMutation({
    mutationFn: async ({ plan, interval = 'monthly' }: { plan: 'solo' | 'estudio' | 'casa'; interval?: BillingInterval }) => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No autenticado')

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan, interval }),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear checkout')
      return data as { url: string }
    },
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (e: Error) => toast.error(e.message),
  })
}
