import { useAuthStore } from '@/stores/auth.store'
import { useClientPieces } from '@/features/client-portal/hooks/useClientPieces'
import { Link } from 'react-router-dom'

const STATUS_LABELS: Record<string, string> = {
  approved: 'Aprobado',
  published: 'Publicado',
  rejected: 'Con cambios',
  sent_client: 'En revisión',
  draft: 'Borrador',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ClientHistory() {
  const { user } = useAuthStore()
  const { data, isLoading } = useClientPieces(user?.id)

  const allPieces = data?.pieces ?? []
  // Historico: todas las piezas de meses anteriores o ya terminadas
  const historicPieces = allPieces.filter(
    (p) => p.status === 'published' || p.status === 'approved',
  )

  return (
    <div style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
        Histórico
      </h2>
      <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 28px' }}>
        Todas las piezas aprobadas y publicadas de tu cuenta.
      </p>

      {isLoading && (
        <div style={{ color: 'var(--fg-3)', fontSize: 13, padding: 32, textAlign: 'center' }}>
          Cargando...
        </div>
      )}

      {!isLoading && historicPieces.length === 0 && (
        <div style={{
          padding: 40, textAlign: 'center',
          background: 'var(--bg-1)', border: '1px solid var(--line-1)',
          borderRadius: 'var(--r-3)',
        }}>
          <p style={{ color: 'var(--fg-3)', fontSize: 14, margin: 0 }}>
            Todavía no hay piezas finalizadas para mostrar.
          </p>
        </div>
      )}

      {!isLoading && historicPieces.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {historicPieces.map((p) => (
            <Link
              key={p.id}
              to={`/portal/pieces/${p.id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'var(--bg-1)', border: '1px solid var(--line-1)',
                borderRadius: 'var(--r-2)', textDecoration: 'none', color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {p.thumbnail_url && (
                  <div style={{
                    width: 36, height: 36, borderRadius: 6, overflow: 'hidden',
                    background: 'var(--bg-3)', flexShrink: 0,
                  }}>
                    <img src={p.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
                    {p.type.toUpperCase()} · {p.platform}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)' }}>
                  {p.scheduled_date ? formatDate(p.scheduled_date) : ''}
                </span>
                <span className={`pill pill-${p.status}`}>
                  <span className="dot" />
                  {STATUS_LABELS[p.status] ?? p.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
