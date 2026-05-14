import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { usePiecesRealtime } from '@/features/pieces/hooks/usePiecesRealtime'
import { useAuthStore } from '@/stores/auth.store'
import { useClientPieces } from '@/features/client-portal/hooks/useClientPieces'
import { useAgencySettings } from '@/features/settings/hooks/useAgencySettings'
import { LogoutConfirmDialog } from '@/components/ui/LogoutConfirmDialog'

export function ClientLayout() {
  usePiecesRealtime()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { data } = useClientPieces(user?.id)
  const { data: agency } = useAgencySettings()
  const logoUrl = agency?.settings?.logo_url
  const [showLogout, setShowLogout] = useState(false)

  const clientName = user?.full_name ?? 'Cliente'
  const clientInitials = user?.initials ?? '?'
  const accountName = data?.accountName ?? '—'
  const agencyName = agency?.name ?? 'Mi agencia'

  const now = new Date()
  const monthLabel = now.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      {/* Client nav */}
      <header
        className="client-nav"
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
        {/* Brand: agency logo + agency name / client name */}
        <div className="client-nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={agencyName}
              style={{ width: 26, height: 26, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
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
                flexShrink: 0,
              }}
            >
              {agencyName.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, letterSpacing: '-0.015em', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {agencyName}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--fg-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {accountName}
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div className="client-nav-links">
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
                  whiteSpace: 'nowrap',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div style={{ flex: 1 }} />

        <span
          className="mono client-month-label"
          style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase' }}
        >
          {monthLabel}
        </span>

        {/* User profile + logout */}
        <div className="client-nav-user" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            to="/portal/profile"
            className="client-profile-link"
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--violet-400)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit' }}
          >
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
                flexShrink: 0,
              }}
            >
              {clientInitials}
            </div>
            <span className="client-user-name" style={{ fontSize: 13 }}>{clientName}</span>
          </Link>
          <button
            onClick={() => setShowLogout(true)}
            style={{
              background: 'none', border: 'none',
              color: 'var(--fg-3)', cursor: 'pointer',
              padding: 4, display: 'flex', alignItems: 'center',
              marginLeft: 4,
            }}
            title="Cerrar sesión"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <Outlet />

      {showLogout && (
        <LogoutConfirmDialog
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  )
}
