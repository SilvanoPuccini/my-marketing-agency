import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'

const MEMBERS = [
  { initials: 'LF', name: 'Lucía Fernández', role: 'DIRECTORA · LF@ESTUDIOPAMPAS.COM.AR', dept: 'Dirección', accounts: '18 / 18', load: 70, loadDone: 10, loadTotal: 14, lastSeen: 'HOY 12:18', status: 'approved', label: 'Activa', barVariant: 'violet' },
  { initials: 'JP', name: 'Juan Pablo Gómez', role: 'ACCOUNT MANAGER · JP@…', dept: 'Account', accounts: '7', load: 100, loadDone: 14, loadTotal: 14, lastSeen: 'HOY 11:55', status: 'rejected', label: 'Sobrecargado', barVariant: 'warn' },
  { initials: 'CS', name: 'Camila Sosa', role: 'COPYWRITER · CS@…', dept: 'Copy', accounts: '5', load: 58, loadDone: 7, loadTotal: 12, lastSeen: 'HOY 12:18', status: 'approved', label: 'Disponible', barVariant: 'ok' },
  { initials: 'MR', name: 'Mateo Rodríguez', role: 'DISEÑADOR SR · MR@…', dept: 'Diseño', accounts: '6', load: 86, loadDone: 12, loadTotal: 14, lastSeen: 'HOY 12:10', status: 'sent', label: 'Activa', barVariant: 'violet' },
  { initials: 'SI', name: 'Sofía Iglesias', role: 'DISEÑADORA SR · SI@…', dept: 'Diseño', accounts: '4', load: 64, loadDone: 9, loadTotal: 14, lastSeen: 'HOY 10:30', status: 'approved', label: 'Disponible', barVariant: 'ok' },
  { initials: 'TA', name: 'Tomás Acuña', role: 'COPY JR · TA@…', dept: 'Copy', accounts: '3', load: 50, loadDone: 5, loadTotal: 10, lastSeen: 'AYER 18:42', status: 'approved', label: 'Disponible', barVariant: 'ok' },
  { initials: 'FN', name: 'Federico Núñez', role: 'ACCOUNT · FN@…', dept: 'Account', accounts: '5', load: 78, loadDone: 11, loadTotal: 14, lastSeen: 'HOY 09:14', status: 'sent', label: 'Activa', barVariant: 'violet' },
  { initials: 'VR', name: 'Valentina Rocha', role: 'DISEÑADORA · VR@…', dept: 'Diseño', accounts: '3', load: 42, loadDone: 6, loadTotal: 14, lastSeen: 'AYER 16:08', status: 'draft', label: 'Vacaciones', barVariant: 'ok' },
  { initials: 'NB', name: 'Nicolás Beltrán', role: 'ACCOUNT · NB@…', dept: 'Account', accounts: '6', load: 92, loadDone: 13, loadTotal: 14, lastSeen: 'HOY 08:45', status: 'sent', label: 'Activa', barVariant: 'violet' },
]

const FILTERS = [
  { key: 'all', label: 'Todos · 12' },
  { key: 'Dirección', label: 'Dirección · 1' },
  { key: 'Account', label: 'Account · 3' },
  { key: 'Diseño', label: 'Diseño · 4' },
  { key: 'Copy', label: 'Copy · 3' },
]

const barColor = (variant: string) => {
  if (variant === 'warn') return '#F59E0B'
  if (variant === 'ok') return 'var(--status-approved)'
  return 'var(--violet-500)'
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', fontWeight: 500, fontSize: 11, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: 'var(--fg-3)', padding: '10px 16px',
  borderBottom: '1px solid var(--line-1)', background: 'var(--bg-1)',
}

const tdStyle: React.CSSProperties = {
  padding: '14px 16px', borderBottom: '1px solid var(--line-1)',
  color: 'var(--fg-1)', verticalAlign: 'middle',
}

export function Team() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = MEMBERS
    .filter((m) => filter === 'all' || m.dept === filter)
    .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio Pampas', 'Equipo']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Exportar</button>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>+ Invitar persona</button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Equipo</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>12 personas · 4 roles · plan Estudio admite hasta 15 asientos.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 16 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar persona…"
            style={{ maxWidth: 280, width: '100%', padding: '9px 12px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }}
          />
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px',
                background: filter === f.key ? 'var(--violet-soft)' : 'var(--bg-2)',
                border: `1px solid ${filter === f.key ? 'transparent' : 'var(--line-2)'}`,
                borderRadius: 'var(--r-2)', fontSize: 12,
                color: filter === f.key ? 'var(--violet-400)' : 'var(--fg-2)', cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', fontSize: 12, color: 'var(--fg-2)', cursor: 'pointer' }}>
            + Filtro
          </button>
        </div>

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '28%' }}>Persona</th>
                <th style={thStyle}>Rol</th>
                <th style={thStyle}>Cuentas asignadas</th>
                <th style={thStyle}>Carga semanal</th>
                <th style={thStyle}>Última actividad</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.name}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--bg-3)' }) }}
                  onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'transparent' }) }}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.initials === 'LF' ? 'var(--violet-soft)' : 'var(--bg-3)', border: `1px solid ${m.initials === 'LF' ? 'var(--violet-soft)' : 'var(--line-2)'}`, color: m.initials === 'LF' ? 'var(--violet-400)' : 'var(--fg-1)', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                        {m.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>{m.dept}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{m.accounts}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 96, height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: barColor(m.barVariant), borderRadius: 999, width: `${m.load}%` }} />
                      </div>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.loadDone}/{m.loadTotal}</span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>{m.lastSeen}</td>
                  <td style={tdStyle}>
                    <span className={`pill pill-${m.status}`}><span className="dot" />{m.label}</span>
                  </td>
                  <td style={{ ...tdStyle, color: 'var(--fg-3)' }}>›</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
