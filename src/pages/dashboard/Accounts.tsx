import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'

const ACCOUNTS = [
  { initials: 'DT', name: 'Parrilla Don Tito', handle: '@donti.parrilla · gastronomía', manager: 'JP', managerName: 'Juan P. Gómez', budget: '$480.000', progress: 75, done: 9, total: 12, next: 'LUN 28 ABR', status: 'rejected', label: 'Cambios pedidos', active: true },
  { initials: 'EN', name: 'Empanadas del Norte', handle: '@empanadas.norte · gastronomía', manager: 'CS', managerName: 'Camila Sosa', budget: '$260.000', progress: 50, done: 4, total: 8, next: 'VIE 02 MAY', status: 'sent', label: '2 por aprobar', active: true },
  { initials: 'TC', name: 'Talampaya Coworking', handle: '@talampaya.cowork · b2b', manager: 'JP', managerName: 'Juan P. Gómez', budget: '$180.000', progress: 92, done: 13, total: 14, next: 'MAR 29 ABR', status: 'approved', label: 'Al día', active: true },
  { initials: 'VC', name: 'Vinos Cafayate', handle: '@vinoscafayate · bebidas', manager: 'LF', managerName: 'Lucía Fernández', budget: '$620.000', progress: 38, done: 8, total: 22, next: 'MIÉ 30 ABR', status: 'rejected', label: 'Demora', active: true, violet: true },
  { initials: 'BC', name: 'Buenos Aires Co.', handle: '@buenosaires.co · retail', manager: 'CS', managerName: 'Camila Sosa', budget: '$340.000', progress: 80, done: 8, total: 10, next: 'JUE 01 MAY', status: 'approved', label: 'Al día', active: true },
  { initials: 'PA', name: 'Pampero Indumentaria', handle: '@pampero.ar · moda', manager: 'SI', managerName: 'Sofía Iglesias', budget: '$520.000', progress: 60, done: 9, total: 15, next: 'LUN 05 MAY', status: 'approved', label: 'Al día', active: true },
  { initials: 'LT', name: 'Librería La Torre', handle: '@latorre.libros · cultura', manager: 'JP', managerName: 'Juan P. Gómez', budget: '$140.000', progress: 25, done: 2, total: 8, next: 'SÁB 03 MAY', status: 'draft', label: 'Onboarding', active: true },
  { initials: 'CM', name: 'Casa Mate Café', handle: '@casamate.bsas · gastronomía', manager: 'CS', managerName: 'Camila Sosa', budget: '$220.000', progress: 70, done: 7, total: 10, next: 'MAR 06 MAY', status: 'published', label: 'Publicada hoy', active: true },
  { initials: 'ÑS', name: 'Ñandú Studio', handle: '@nandustudio · b2b', manager: 'SI', managerName: 'Sofía Iglesias', budget: '$390.000', progress: 88, done: 14, total: 16, next: 'JUE 08 MAY', status: 'approved', label: 'Al día', active: true },
  { initials: 'TR', name: 'Turismo Recoleta', handle: '@turismorecoleta · turismo · pausada', manager: '', managerName: '— sin asignar', budget: '$0', progress: 0, done: 0, total: 0, next: '—', status: 'draft', label: 'Pausada', active: false },
]

const FILTERS = [
  { key: 'all', label: 'Todas', count: 18 },
  { key: 'active', label: 'Activas', count: 15 },
  { key: 'paused', label: 'En pausa', count: 3 },
  { key: 'delayed', label: 'Con demora', count: 2 },
]

function Avatar({ initials, violet, small }: { initials: string; violet?: boolean; small?: boolean }) {
  const size = small ? 22 : 28
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: violet ? 'var(--violet-soft)' : 'var(--bg-3)',
        border: `1px solid ${violet ? 'var(--violet-soft)' : 'var(--line-2)'}`,
        color: violet ? 'var(--violet-400)' : 'var(--fg-1)',
        fontSize: small ? 10 : 11,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

export function Accounts() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = ACCOUNTS.filter((a) => {
    if (filter === 'active') return a.active && a.status !== 'draft'
    if (filter === 'paused') return !a.active || a.status === 'draft'
    if (filter === 'delayed') return a.status === 'rejected'
    return true
  }).filter((a) => a.name.toLowerCase().includes(search.toLowerCase()))

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    fontWeight: 500,
    fontSize: 11,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--fg-3)',
    padding: '10px 16px',
    borderBottom: '1px solid var(--line-1)',
    background: 'var(--bg-1)',
  }

  const tdStyle: React.CSSProperties = {
    padding: '14px 16px',
    borderBottom: '1px solid var(--line-1)',
    color: 'var(--fg-1)',
    verticalAlign: 'middle',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio Pampas', 'Cuentas']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
              Exportar
            </button>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>
              + Nueva cuenta
            </button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Cuentas</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>18 cuentas activas · 3 en pausa · plan Estudio admite hasta 25.</p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 16 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cuenta…"
            style={{
              maxWidth: 280,
              width: '100%',
              padding: '9px 12px',
              fontSize: 13,
              background: 'var(--bg-2)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-2)',
              color: 'var(--fg-1)',
              outline: 'none',
            }}
          />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 10px',
                background: filter === f.key ? 'var(--violet-soft)' : 'var(--bg-2)',
                border: `1px solid ${filter === f.key ? 'transparent' : 'var(--line-2)'}`,
                borderRadius: 'var(--r-2)',
                fontSize: 12,
                color: filter === f.key ? 'var(--violet-400)' : 'var(--fg-2)',
                cursor: 'pointer',
              }}
            >
              {f.label}{' '}
              <span className="mono" style={{ opacity: 0.6 }}>{f.count}</span>
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: 'inline-flex', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: 2 }}>
            <button style={{ background: 'var(--bg-4)', border: 0, color: 'var(--fg-1)', padding: '4px 10px', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}>Lista</button>
            <button style={{ background: 'transparent', border: 0, color: 'var(--fg-2)', padding: '4px 10px', fontSize: 12, borderRadius: 4, cursor: 'pointer' }}>Tarjetas</button>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '32%' }}>Cuenta</th>
                <th style={thStyle}>Account manager</th>
                <th style={thStyle}>Pauta mensual</th>
                <th style={thStyle}>Avance del mes</th>
                <th style={thStyle}>Próxima entrega</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr
                  key={a.name}
                  style={{ opacity: a.active ? 1 : 0.55, cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--bg-3)' }) }}
                  onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'transparent' }) }}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar initials={a.initials} violet={a.violet} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{a.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{a.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Avatar initials={a.manager} small />
                      {a.managerName}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{a.budget}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 96, height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: 'var(--violet-500)', borderRadius: 999, width: `${a.progress}%` }} />
                      </div>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{a.done}/{a.total}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>{a.next}</td>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Mostrando {filtered.length} de 18
          </span>
          <div style={{ flex: 1 }} />
          <span className="kbd">←</span>
          <span className="kbd">→</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>para navegar</span>
        </div>
      </div>
    </div>
  )
}
