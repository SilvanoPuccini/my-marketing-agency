import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid, Users, Calendar, Library,
  BarChart2, UsersRound, CreditCard, Settings, LogOut,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useAgencySettings } from '@/features/settings/hooks/useAgencySettings'
import { supabase } from '@/lib/supabase'
import { PLAN_LIMITS, type PlanId } from '@/lib/planLimits'

interface NavItem {
  to:       string
  icon:     React.ReactNode
  label:    string
  count?:   number | string
  section?: string
}

function SidebarContent() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const { data: agency } = useAgencySettings()

  const { data: counts } = useQuery({
    queryKey: ['sidebar-counts'],
    queryFn: async () => {
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      const lastDay  = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

      const [accs, piecesMonth, team] = await Promise.all([
        supabase.from('accounts').select('id', { count: 'exact', head: true }),
        supabase
          .from('pieces')
          .select('id', { count: 'exact', head: true })
          .is('archived_at', null)
          .gte('scheduled_date', firstDay)
          .lte('scheduled_date', lastDay),
        supabase
          .from('users')
          .select('id', { count: 'exact', head: true })
          .in('role', ['admin_agency', 'team_member'])
          .eq('is_active', true),
      ])
      return {
        accounts: accs.count        ?? 0,
        pieces:   piecesMonth.count ?? 0,
        team:     team.count        ?? 0,
      }
    },
  })

  const agencyName  = agency?.name ?? 'Mi agencia'
  const plan        = agency?.plan ?? 'estudio'
  const planLimits  = PLAN_LIMITS[plan as PlanId] ?? PLAN_LIMITS.solo
  const brandLetter = agencyName.charAt(0).toUpperCase()

  const NAV_ITEMS: NavItem[] = [
    { to: '/dashboard', icon: <LayoutGrid size={15} />, label: 'Panel',       section: 'Operación' },
    { to: '/accounts',  icon: <Users size={15} />,      label: 'Cuentas',     count: counts?.accounts },
    { to: '/calendar',  icon: <Calendar size={15} />,   label: 'Calendario',  count: counts?.pieces   },
    { to: '/library',   icon: <Library size={15} />,    label: 'Biblioteca'   },
    { to: '/reports',   icon: <BarChart2 size={15} />,  label: 'Reportes'     },
    { to: '/team',      icon: <UsersRound size={15} />, label: 'Equipo',      section: 'Estudio', count: counts?.team },
    { to: '/billing',   icon: <CreditCard size={15} />, label: 'Facturación'  },
    { to: '/settings',  icon: <Settings size={15} />,   label: 'Ajustes'      },
  ]

  function handleLogout() {
    logout()
    navigate('/login')
  }

  let currentSection: string | undefined

  return (
    <aside
      style={{
        background:     'var(--bg-1)',
        borderRight:    '1px solid var(--line-1)',
        padding:        '16px 12px',
        display:        'flex',
        flexDirection:  'column',
        gap:            '4px',
        height:         '100vh',
        overflowY:      'auto',
        width:          240,
        flexShrink:     0,
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 14px', marginBottom: 4, borderBottom: '1px solid var(--line-1)' }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: '#fff', boxShadow: '0 0 0 1px var(--violet-400) inset', flexShrink: 0 }}>
          {brandLetter}
        </div>
        <div>
          <div style={{ fontWeight: 600, letterSpacing: '-0.015em', fontSize: 14 }}>{agencyName}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            PLAN {plan.toUpperCase()} · {counts?.accounts ?? 0} / {planLimits.accounts}
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', padding: '14px 10px 6px' }}>
                {item.section}
              </div>
            )}
            <NavLink
              to={item.to}
              style={({ isActive }) => ({
                display:    'flex',
                alignItems: 'center',
                gap:        10,
                padding:    '7px 10px',
                borderRadius: 'var(--r-2)',
                color:      isActive ? 'var(--fg-1)' : 'var(--fg-2)',
                fontSize:   13,
                fontWeight: 500,
                transition: 'background 100ms ease, color 100ms ease',
                background: isActive ? 'var(--bg-2)' : 'transparent',
                boxShadow:  isActive ? 'inset 2px 0 0 var(--violet-500)' : 'none',
                textDecoration: 'none',
              })}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.color = 'var(--fg-1)' }}
              onMouseLeave={(e) => { if (!e.currentTarget.getAttribute('aria-current')) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--fg-2)' } }}
            >
              <span style={{ opacity: 0.85, flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {item.count !== undefined && (
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>
                  {item.count}
                </span>
              )}
            </NavLink>
          </div>
        )
      })}

      <div style={{ flex: 1 }} />

      {/* User footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <NavLink
          to="/profile"
          style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, textDecoration: 'none' }}
        >
          <div style={{ width: 28, height: 28, borderRadius: 999, background: 'var(--violet-soft)', border: '1px solid var(--violet-soft)', color: 'var(--violet-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
            {user?.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--fg-1)' }}>
              {user?.full_name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' }}>
              {user?.position ?? user?.role}
            </div>
          </div>
        </NavLink>
        <button
          onClick={handleLogout}
          style={{ background: 'none', border: 'none', color: 'var(--fg-3)', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
          title="Cerrar sesión"
        >
          <LogOut size={13} />
        </button>
      </div>
    </aside>
  )
}

export function Sidebar() {
  const isMobile = useIsMobile()
  const { sidebarOpen } = useUiStore()

  if (!isMobile) {
    // Desktop: sidebar fija en el flujo del documento
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 20, width: 240 }}>
        <SidebarContent />
      </div>
    )
  }

  // Mobile: overlay con AnimatePresence
  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          key="mobile-sidebar"
          initial={{ x: -240 }}
          animate={{ x: 0 }}
          exit={{ x: -240 }}
          transition={{ type: 'spring', stiffness: 340, damping: 34 }}
          style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40, width: 240 }}
        >
          <SidebarContent />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
