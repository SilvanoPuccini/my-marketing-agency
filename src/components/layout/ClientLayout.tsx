import { Outlet, NavLink } from 'react-router-dom'
import { usePiecesRealtime } from '@/features/pieces/hooks/usePiecesRealtime'

interface ClientLayoutProps {
  accountName?: string
  agencyName?: string
  clientName?: string
  clientInitials?: string
}

export function ClientLayout({
  accountName = 'Parrilla Don Tito',
  agencyName = 'Estudio Pampas',
  clientName = 'Rocío Paz',
  clientInitials = 'RP',
}: ClientLayoutProps) {
  usePiecesRealtime()
  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      {/* Client nav */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--line-1)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            M
          </div>
          <div>
            <div style={{ fontWeight: 600, letterSpacing: '-0.015em', fontSize: 14 }}>
              {accountName}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--fg-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Vista de cliente · gestionado por {agencyName}
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
          {[
            { to: '/portal', label: 'Tu mes' },
            { to: '/portal/history', label: 'Histórico' },
            { to: '/portal/reports', label: 'Reportes' },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              style={({ isActive }) => ({
                padding: '6px 12px',
                fontSize: 13,
                color: isActive ? 'var(--fg-1)' : 'var(--fg-2)',
                borderRadius: 'var(--r-2)',
                background: isActive ? 'var(--bg-2)' : 'transparent',
                textDecoration: 'none',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <span
          className="mono"
          style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase' }}
        >
          ABRIL 2026
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: 'var(--violet-soft)',
              border: '1px solid var(--violet-soft)',
              color: 'var(--violet-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {clientInitials}
          </div>
          <span style={{ fontSize: 13 }}>{clientName}</span>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
