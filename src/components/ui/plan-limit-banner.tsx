import { Link } from 'react-router-dom'
import { useAgencyUsage } from '@/features/agency/hooks/useAgencyUsage'

type LimitType = 'accounts' | 'users'

export function PlanLimitBanner({ type }: { type: LimitType }) {
  const { data } = useAgencyUsage()
  if (!data) return null

  const { used, limit } = data[type]
  const atLimit = used >= limit
  const nearLimit = used >= limit - 1 && !atLimit

  if (!atLimit && !nearLimit) return null

  const label = type === 'accounts' ? 'cuentas' : 'usuarios'

  return (
    <div
      style={{
        padding: '12px 18px',
        borderRadius: 'var(--r-2)',
        border: `1px solid ${atLimit ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`,
        background: atLimit ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 16,
      }}
    >
      <div style={{ fontSize: 13, color: 'var(--fg-1)' }}>
        {atLimit ? (
          <>
            Llegaste al límite de {label} de tu plan <strong>{data.plan}</strong> ({used}/{limit}).
            Actualizá tu plan para agregar más.
          </>
        ) : (
          <>
            Te queda <strong>1 {type === 'accounts' ? 'cuenta' : 'usuario'}</strong> disponible en tu plan <strong>{data.plan}</strong> ({used}/{limit}).
          </>
        )}
      </div>
      <Link
        to="/billing"
        style={{
          flexShrink: 0,
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 500,
          color: '#fff',
          borderRadius: 'var(--r-2)',
          border: '1px solid var(--violet-400)',
          background: 'var(--violet-500)',
          textDecoration: 'none',
        }}
      >
        Ver planes
      </Link>
    </div>
  )
}
