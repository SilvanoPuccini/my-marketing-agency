import { useClientQuota } from '../hooks/useClientQuota'

export function QuotaBanner() {
  const { data } = useClientQuota()
  if (!data) return null

  const { used, limit, percentage, atLimit } = data

  const barColor = atLimit
    ? '#EF4444'
    : percentage >= 80
      ? '#F59E0B'
      : 'var(--violet-500)'

  return (
    <div
      style={{
        padding: '12px 18px',
        borderRadius: 'var(--r-2)',
        border: `1px solid ${atLimit ? 'rgba(239,68,68,0.3)' : 'var(--line-2)'}`,
        background: atLimit ? 'rgba(239,68,68,0.08)' : 'var(--bg-2)',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-2)' }}>
          Piezas este mes
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            color: atLimit ? '#EF4444' : 'var(--fg-1)',
          }}
        >
          {used}/{limit}
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: 6,
          background: 'var(--bg-3)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(percentage, 100)}%`,
            background: barColor,
            borderRadius: 999,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {atLimit && (
        <p style={{ margin: '8px 0 0', fontSize: 12, color: '#EF4444' }}>
          Alcanzaste el limite mensual de piezas. Se renueva el proximo mes.
        </p>
      )}
    </div>
  )
}
