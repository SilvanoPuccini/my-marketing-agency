import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Users,
  Calendar,
  Library,
  BarChart2,
  UsersRound,
  CreditCard,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
  count?: number | string
  section?: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', icon: <LayoutGrid size={15} />, label: 'Panel', section: 'Operación' },
  { to: '/accounts', icon: <Users size={15} />, label: 'Cuentas', count: 18 },
  { to: '/calendar', icon: <Calendar size={15} />, label: 'Calendario', count: 142 },
  { to: '/library', icon: <Library size={15} />, label: 'Biblioteca' },
  { to: '/reports', icon: <BarChart2 size={15} />, label: 'Reportes' },
  { to: '/team', icon: <UsersRound size={15} />, label: 'Equipo', count: 12, section: 'Estudio' },
  { to: '/billing', icon: <CreditCard size={15} />, label: 'Facturación' },
  { to: '/settings', icon: <Settings size={15} />, label: 'Ajustes' },
]

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  let currentSection: string | undefined

  return (
    <aside
      style={{
        background: 'var(--bg-1)',
        borderRight: '1px solid var(--line-1)',
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        width: 240,
        flexShrink: 0,
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '6px 8px 14px',
          marginBottom: 4,
          borderBottom: '1px solid var(--line-1)',
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 13,
            color: '#fff',
            boxShadow: '0 0 0 1px var(--violet-400) inset',
            flexShrink: 0,
          }}
        >
          M
        </div>
        <div>
          <div style={{ fontWeight: 600, letterSpacing: '-0.015em', fontSize: 14 }}>
            Estudio Pampas
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--fg-3)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            PLAN ESTUDIO · 18 / 25
          </div>
        </div>
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map((item) => {
        const showSection = item.section && item.section !== currentSection
        if (showSection) currentSection = item.section

        return (
          <div key={item.to}>
            {showSection && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-3)',
                  padding: '14px 10px 6px',
                }}
              >
                {item.section}
              </div>
            )}
            <NavLink
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '7px 10px',
                borderRadius: 'var(--r-2)',
                color: isActive ? 'var(--fg-1)' : 'var(--fg-2)',
                fontSize: 13,
                fontWeight: 500,
                transition: 'background 100ms ease, color 100ms ease',
                background: isActive ? 'var(--bg-2)' : 'transparent',
                boxShadow: isActive ? 'inset 2px 0 0 var(--violet-500)' : 'none',
                textDecoration: 'none',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = 'var(--bg-2)'
                el.style.color = 'var(--fg-1)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                if (!el.classList.contains('active')) {
                  el.style.background = ''
                  el.style.color = 'var(--fg-2)'
                }
              }}
            >
              <span style={{ opacity: 0.85, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {item.count !== undefined && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--fg-3)',
                  }}
                >
                  {item.count}
                </span>
              )}
            </NavLink>
          </div>
        )
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User footer */}
      <div
        style={{
          padding: '12px 8px',
          borderTop: '1px solid var(--line-1)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
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
            letterSpacing: '0.02em',
            flexShrink: 0,
          }}
        >
          {user?.initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.full_name}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--fg-3)',
              textTransform: 'uppercase',
            }}
          >
            {user?.position}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--fg-3)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
          }}
          title="Cerrar sesión"
        >
          <LogOut size={13} />
        </button>
      </div>
    </aside>
  )
}
