import { useState } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { useClientPieces } from '@/features/client-portal/hooks/useClientPieces'
import { Link } from 'react-router-dom'
import { STATUS_LABELS, formatDateLong } from '@/lib/utils'
import { Pagination, usePaginated } from '@/components/ui/Pagination'

const STATUS_FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'approved', label: 'Aprobadas' },
  { key: 'published', label: 'Publicadas' },
]

export function ClientHistory() {
  const { user } = useAuthStore()
  const { data, isLoading } = useClientPieces(user?.id)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const allPieces = [
    ...(data?.approved ?? []),
    ...(data?.published ?? []),
  ].sort(
    (a, b) => (b.scheduled_date ?? '').localeCompare(a.scheduled_date ?? ''),
  )

  const filtered = allPieces
    .filter((p) => statusFilter === 'all' || p.status === statusFilter)
    .filter((p) =>
      !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      (p.platform ?? '').toLowerCase().includes(search.toLowerCase()),
    )

  const { paged, totalPages, safePage } = usePaginated(filtered, 10, page)

  return (
    <div className="client-history-content" style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
        Histórico
      </h2>
      <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 20px' }}>
        Todas las piezas aprobadas y publicadas de tu cuenta.
      </p>

      {/* Search + filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por título, tipo o plataforma..."
          style={{
            maxWidth: 280, width: '100%', padding: '8px 12px', fontSize: 13,
            background: 'var(--bg-2)', border: '1px solid var(--line-2)',
            borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
          }}
        />
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => { setStatusFilter(f.key); setPage(1) }}
            style={{
              padding: '6px 10px', fontSize: 12,
              background: statusFilter === f.key ? 'var(--violet-soft)' : 'var(--bg-2)',
              border: `1px solid ${statusFilter === f.key ? 'transparent' : 'var(--line-2)'}`,
              borderRadius: 'var(--r-2)',
              color: statusFilter === f.key ? 'var(--violet-400)' : 'var(--fg-2)',
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
          {filtered.length} pieza{filtered.length !== 1 ? 's' : ''}
        </span>
        <Pagination page={safePage} totalPages={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => p + 1)} />
      </div>

      {isLoading && (
        <div style={{ color: 'var(--fg-3)', fontSize: 13, padding: 32, textAlign: 'center' }}>
          Cargando...
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div style={{
          padding: 40, textAlign: 'center',
          background: 'var(--bg-1)', border: '1px solid var(--line-1)',
          borderRadius: 'var(--r-3)',
        }}>
          <p style={{ color: 'var(--fg-3)', fontSize: 14, margin: 0 }}>
            {allPieces.length === 0
              ? 'Todavía no hay piezas finalizadas para mostrar.'
              : 'No hay piezas que coincidan con tu búsqueda.'}
          </p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {paged.map((p) => (
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
                  {p.scheduled_date ? formatDateLong(p.scheduled_date) : ''}
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
