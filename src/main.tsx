import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/queryClient'
import { AppRouter } from '@/routes/AppRouter'
import { initAuth } from '@/stores/auth.store'
import './index.css'

initAuth()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-2)',
            border: '1px solid var(--line-2)',
            color: 'var(--fg-1)',
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>,
)
