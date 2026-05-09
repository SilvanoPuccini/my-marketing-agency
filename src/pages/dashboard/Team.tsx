import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useTeam } from '@/features/team/hooks/useTeam'
import { useAuthStore } from '@/stores/auth.store'
import { InviteMemberModal } from '@/features/team/components/InviteMemberModal'
import { PlanLimitBanner } from '@/components/ui/plan-limit-banner'

const ROLE_LABELS: Record<string, string> = {
  admin_agency: 'Admin',
  team_member:  'Equipo',
  client:       'Cliente',
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
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const { data: members = [], isLoading } = useTeam(user?.agency_id)

  const filtered = members.filter((m) =>
    m.full_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showInvite && <InviteMemberModal onClose={() => setShowInvite(false)} />}
      <TopBar
        breadcrumb={['Mi agencia', 'Equipo']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                const header = ['Nombre', 'Rol', 'Cuentas', 'Estado']
                const rows = filtered.map(m => [m.full_name, m.role, m.accountCount, m.is_active ? 'Activo' : 'Inactivo'].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
                const csv = '\uFEFF' + [header.join(','), ...rows].join('\r\n')
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'equipo.csv'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
              }}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >Exportar</button>
            <button
              onClick={() => setShowInvite(true)}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
            >
              + Invitar persona
            </button>
          </div>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px' }}>
        <PlanLimitBanner type="users" />
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Equipo</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
            {isLoading ? 'Cargando…' : `${members.length} persona${members.length !== 1 ? 's' : ''} en el equipo`}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', marginBottom: 16 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar persona…"
            style={{ maxWidth: 280, width: '100%', padding: '9px 12px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }}
          />
        </div>

        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: '28%' }}>Persona</th>
                <th style={thStyle}>Rol</th>
                <th className="col-hide-mobile" style={thStyle}>Cuentas asignadas</th>
                <th className="col-hide-mobile" style={thStyle}>Carga semanal</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle} />
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: 'var(--fg-3)' }}>
                    Cargando equipo…
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: 'var(--fg-3)' }}>
                    {search ? 'No hay resultados para esa búsqueda.' : 'No hay miembros en el equipo todavía.'}
                  </td>
                </tr>
              )}
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  style={{ cursor: 'pointer', opacity: m.is_active ? 1 : 0.5 }}
                  onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--bg-3)' }) }}
                  onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'transparent' }) }}
                >
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-3)', border: '1px solid var(--line-2)', color: 'var(--fg-1)', fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                        {m.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{m.full_name}</div>
                        {m.position && (
                          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.position.toUpperCase()}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={tdStyle}>{ROLE_LABELS[m.role] ?? m.role}</td>
                  <td className="col-hide-mobile" style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{m.accountCount}</td>
                  <td className="col-hide-mobile" style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 96, height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden' }}>
                        <span style={{ display: 'block', height: '100%', background: m.loadPct >= 90 ? '#F59E0B' : 'var(--violet-500)', borderRadius: 999, width: `${m.loadPct}%` }} />
                      </div>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                        {m.piecesDone}/{m.piecesTotal}
                      </span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span className={`pill pill-${m.is_active ? 'approved' : 'draft'}`}>
                      <span className="dot" />{m.is_active ? 'Activo' : 'Inactivo'}
                    </span>
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
