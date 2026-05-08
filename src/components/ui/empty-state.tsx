interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <span style={{ fontSize: 36, marginBottom: 16 }}>{icon}</span>
      <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: 'var(--fg-1)' }}>
        {title}
      </h3>
      {description && (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-3)', maxWidth: 320, lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          style={{
            marginTop: 20,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 500,
            color: '#fff',
            borderRadius: 'var(--r-2)',
            border: '1px solid var(--violet-400)',
            background: 'var(--violet-500)',
            cursor: 'pointer',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
