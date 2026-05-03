import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useAccounts, type AccountRow } from '@/features/accounts/hooks/useAccounts'
import { CreateAccountModal } from '@/features/accounts/components/CreateAccountModal'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const wd = d.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase().replace('.', '')
  const day = d.getDate()
  const mo = d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase().replace('.', '')
  return `${wd} ${day} ${mo}`
}

function formatBudget(n: number | null): string {
  if (!n) return '$0'
  return `$${n.toLocaleString('es-AR')}`
}

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

function Avatar({ init, violet, small }: { init: string; violet?: boolean; small?: boolean }) {
  const size = small ? 22 : 28
  return (
    <div
      style={{
        width: size, height: size, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: violet ? 'var(--violet-soft)' : 'var(--bg-3)',
        border: `1px solid ${violet ? 'var(--violet-soft)' : 'var(--line-2)'}`,
        color: violet ? 'var(--violet-400)' : 'var(--fg-1)',
        fontSize: small ? 10 : 11, fontWeight: 600, flexShrink: 0,
      }}
    >
      {init}
    </div>
  )
}

function exportCsv(rows: AccountRow[]) {
  const header = ['Nombre', 'Handle', 'Industria', 'Manager', 'Presupuesto mensual', 'Progreso', 'Estado']
  const lines = rows.map((a) => [
    a.name, a.handle ?? '', a.industry ?? '', a.manager,
    a.monthly_budget ?? 0, `${a.done}/${a.total}`, a.label,
  ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
  const csv = '\uFEFF' + [header.join(','), ...lines].join('\r\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'cuentas.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

export function Accounts() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'list' | 'cards'>('list')
  const [showCreate, setShowCreate] = useState(false)
  const { data, isLoading, error } = useAccounts()

  const accounts = data ?? []

  const filters = [
    { key: 'all',     label: 'Todas',      count: accounts.length },
    { key: 'active',  label: 'Activas',    count: accounts.filter((a) => a.is_active).length },
    { key: 'paused',  label: 'En pausa',   count: accounts.filter((a) => !a.is_active).length },
    { key: 'delayed', label: 'Con demora', count: accounts.filter((a) => a.status === 'rejected').length },
  ]

  const filtered = accounts
    .filter((a) => {
      if (filter === 'active')  return a.is_active
      if (filter === 'paused')  return !a.is_active
      if (filter === 'delayed') return a.status === 'rejected'
      return true
    })
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))

  const activeCount = accounts.filter((a) => a.is_active).length
  const pausedCount = accounts.filter((a) => !a.is_active).length

  const thStyle: React.CSSProperties = {
    textAlign: 'left', fontWeight: 500, fontSize: 11,
    letterSpacing: '0.04em', textTransform: 'uppercase',
    color: 'var(--fg-3)', padding: '10px 16px',
    borderBottom: '1px solid var(--line-1)', background: 'var(--bg-1)',
  }
  const tdStyle: React.CSSProperties = {
    padding: '14px 16px', borderBottom: '1px solid var(--line-1)',
    color: 'var(--fg-1)', verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Mi agencia', 'Cuentas']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => exportCsv(filtered)}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >
              Exportar
            </button>
            <button
              onClick={() => setShowCreate(true)}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
            >
              + Nueva cuenta
            </button>
          </div>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Cuentas</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
            {isLoading
              ? 'Cargando...'
              : error
              ? `Error al cargar: ${(error as Error).message}`
              : `${activeCount} cuenta${activeCount !== 1 ? 's' : ''} activa${activeCount !== 1 ? 's' : ''}${pausedCount > 0 ? ` · ${pausedCount} en pausa` : ''}`
            }
          </p>
        </div>

        {/* Toolbar */}
        <div className="accounts-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 16 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cuenta…"
            style={{
              maxWidth: 280, width: '100%', padding: '9px 12px', fontSize: 13,
              background: 'var(--bg-2)', border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
            }}
          />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 10px',
                background: filter === f.key ? 'var(--violet-soft)' : 'var(--bg-2)',
                border: `1px solid ${filter === f.key ? 'transparent' : 'var(--line-2)'}`,
                borderRadius: 'var(--r-2)', fontSize: 12,
                color: filter === f.key ? 'var(--violet-400)' : 'var(--fg-2)',
                cursor: 'pointer',
              }}
            >
              {f.label} <span className="mono" style={{ opacity: 0.6 }}>{f.count}</span>
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'inline-flex', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: 2 }}>
            {(['list', 'cards'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{ background: view === v ? 'var(--bg-4)' : 'transparent', border: 0, color: view === v ? 'var(--fg-1)' : 'var(--fg-2)', padding: '4px 10px', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}
              >
                {v === 'list' ? 'Lista' : 'Tarjetas'}
              </button>
            ))}
          </div>
        </div>

        {/* List view */}
        {view === 'list' && (
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '30%' }}>Cuenta</th>
                  <th style={thStyle}>Account manager</th>
                  <th style={thStyle}>Pauta mensual</th>
                  <th style={thStyle}>Avance del mes</th>
                  <th style={thStyle}>Próxima entrega</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle} />
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: 'var(--fg-3)' }}>
                      Cargando cuentas...
                    </td>
                  </tr>
                )}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: 'var(--fg-3)' }}>
                      No hay cuentas que coincidan.
                    </td>
                  </tr>
                )}
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    style={{ opacity: a.is_active ? 1 : 0.55, cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--bg-3)' }) }}
                    onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'transparent' }) }}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar init={initials(a.name)} />
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{a.name}</div>
                          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                            {[a.handle, a.industry].filter(Boolean).join(' · ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar init={a.managerInitials} small />
                        {a.manager}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>
                      {formatBudget(a.monthly_budget)}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 96, height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                          <span style={{ display: 'block', height: '100%', background: 'var(--violet-500)', borderRadius: 999, width: `${a.progress}%` }} />
                        </div>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{a.done}/{a.total}</span>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>
                      {a.next ? formatDate(a.next) : '—'}
                    </td>
                    <td style={tdStyle}>
                      <span className={`pill pill-${a.status}`}>
                        <span className="dot" />
                        {a.label}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: 'var(--fg-3)' }}>›</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cards view */}
        {view === 'cards' && (
          <div>
            {isLoading && <div style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 32, fontSize: 13 }}>Cargando cuentas...</div>}
            {!isLoading && filtered.length === 0 && <div style={{ textAlign: 'center', color: 'var(--fg-3)', padding: 32, fontSize: 13 }}>No hay cuentas que coincidan.</div>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {filtered.map((a) => (
                <div
                  key={a.id}
                  style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', padding: 18, opacity: a.is_active ? 1 : 0.55, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-1)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar init={initials(a.name)} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                          {[a.handle, a.industry].filter(Boolean).join(' · ')}
                        </div>
                      </div>
                    </div>
                    <span className={`pill pill-${a.status}`}><span className="dot" />{a.label}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: '100%', height: 5, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: 'var(--violet-500)', borderRadius: 999, width: `${a.progress}%` }} />
                      </div>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>{a.done}/{a.total}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--fg-3)' }}>
                      <Avatar init={a.managerInitials} small />
                      {a.manager}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg-2)' }}>
                      {formatBudget(a.monthly_budget)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Mostrando {filtered.length} de {accounts.length}
          </span>
          <div style={{ flex: 1 }} />
          <span className="kbd">←</span>
          <span className="kbd">→</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>para navegar</span>
        </div>
      </div>

      {showCreate && <CreateAccountModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}
