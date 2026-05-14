import { Menu, Search } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useUiStore } from '@/stores/ui.store'

interface TopBarProps {
  breadcrumb: string[]
  actions?: React.ReactNode
}

export function TopBar({ breadcrumb, actions }: TopBarProps) {
  const isMobile = useIsMobile()
  const { toggleSidebar } = useUiStore()

  return (
    <div
      className="topbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 24px',
        borderBottom: '1px solid var(--line-1)',
        background: 'var(--bg-0)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Hamburger — mobile only */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--fg-2)',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
          aria-label="Abrir menú"
        >
          <Menu size={18} />
        </button>
      )}

      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'var(--fg-3)',
          fontSize: 13,
        }}
      >
        {breadcrumb.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && (
              <span style={{ color: 'var(--fg-4)' }}>/</span>
            )}
            <span style={{ color: i === breadcrumb.length - 1 ? 'var(--fg-1)' : 'var(--fg-3)' }}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Search — hidden on mobile */}
      <div style={{ flex: 1, maxWidth: 420, position: 'relative', display: isMobile ? 'none' : undefined }}>
        <Search
          size={13}
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--fg-3)',
          }}
        />
        <input
          placeholder="Buscar cuenta, pieza, persona…"
          style={{
            width: '100%',
            background: 'var(--bg-2)',
            border: '1px solid var(--line-1)',
            borderRadius: 'var(--r-2)',
            padding: '7px 12px 7px 30px',
            fontSize: 13,
            color: 'var(--fg-1)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--line-3)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--line-1)'
          }}
        />
      </div>

      {/* Actions slot */}
      {actions}
    </div>
  )
}
