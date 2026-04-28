import { Search } from 'lucide-react'

interface TopBarProps {
  breadcrumb: string[]
  actions?: React.ReactNode
}

export function TopBar({ breadcrumb, actions }: TopBarProps) {
  return (
    <div
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

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
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
            padding: '7px 36px 7px 30px',
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
        <span
          className="kbd"
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Actions slot */}
      {actions}
    </div>
  )
}
