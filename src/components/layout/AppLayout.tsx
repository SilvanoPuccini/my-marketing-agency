import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'

export function AppLayout() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr',
        minHeight: '100vh',
      }}
    >
      <Sidebar />
      <main style={{ minWidth: 0, overflow: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  )
}
