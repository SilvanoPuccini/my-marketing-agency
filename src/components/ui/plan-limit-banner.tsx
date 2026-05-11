import { Link } from 'react-router-dom'
import { useAgencyUsage } from '@/features/agency/hooks/useAgencyUsage'

type LimitType = 'accounts' | 'teamSeats'

export function PlanLimitBanner({ type }: { type: LimitType }) {
  const { data } = useAgencyUsage()
  if (!data) return null

  const { used, limit, overflow } = data[type]
  const atLimit = used >= limit
  const nearLimit = used >= limit - 1 && !atLimit

  if (!atLimit && !nearLimit) return null

  const label = type === 'accounts' ? 'cuentas' : 'asientos de equipo'
  const singular = type === 'accounts' ? 'cuenta' : 'asiento'

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
        {overflow > 0 ? (
          <>
            Estas por encima del limite de {label} de tu plan <strong>{data.plan}</strong> ({used}/{limit}).
            Considera hacer upgrade o reducir {label}.
          </>
        ) : atLimit ? (
          <>
            Llegaste al limite de {label} de tu plan <strong>{data.plan}</strong> ({used}/{limit}).
            Actualiza tu plan para agregar mas.
          </>
        ) : (
          <>
            Te queda <strong>1 {singular}</strong> disponible en tu plan <strong>{data.plan}</strong> ({used}/{limit}).
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
