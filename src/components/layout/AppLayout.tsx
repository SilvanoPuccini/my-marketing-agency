import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/Sidebar'
import { PageTransition } from '@/components/layout/PageTransition'
import { useUiStore } from '@/stores/ui.store'
import { useIsMobile } from '@/hooks/useIsMobile'
import { usePiecesRealtime } from '@/features/pieces/hooks/usePiecesRealtime'

export function AppLayout() {
  usePiecesRealtime()
  const isMobile = useIsMobile()
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const location = useLocation()

  // Cerrar sidebar al navegar en mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location.pathname, isMobile])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Backdrop overlay mobile */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(5,5,9,0.6)',
              zIndex: 30,
              backdropFilter: 'blur(2px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          // En mobile el content ocupa todo el ancho
          marginLeft: isMobile ? 0 : 240,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
    </div>
  )
}
