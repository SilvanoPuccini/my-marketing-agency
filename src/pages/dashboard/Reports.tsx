import { TopBar } from '@/components/layout/TopBar'
import { useAuthStore } from '@/stores/auth.store'
import { useReports } from '@/features/reports/hooks/useReports'

const RECENT_REPORTS = [
  { type: 'PDF', title: 'Don Tito · Abril 2026',      sub: '14 páginas · con marca de cliente', when: 'HOY 09:14' },
  { type: 'PDF', title: 'Cafayate · Abril 2026',      sub: '22 páginas · con marca de cliente', when: 'AYER' },
  { type: 'PDF', title: 'Pampero · Abril 2026',       sub: '18 páginas · con marca de cliente', when: 'VIE 25' },
  { type: 'CSV', title: 'Consolidado Q1 2026',        sub: '18 cuentas · métricas crudas',      when: 'JUE 24' },
  { type: 'PDF', title: 'Talampaya · Marzo 2026',     sub: '10 páginas · con marca de cliente', when: 'MIÉ 23' },
]

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const panel: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-1)',
  borderRadius: 'var(--r-3)',
}

const panelH: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 18px',
  borderBottom: '1px solid var(--line-1)',
}

export function Reports() {
  const { user } = useAuthStore()
  const { data: reports, isLoading } = useReports(user?.agency_id)

  const now = new Date()
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`

  const stats = [
    {
      label: 'Piezas publicadas',
      value: isLoading ? '…' : String(reports?.publishedCount ?? 0),
      delta: `de ${reports?.total ?? 0} piezas este mes`,
      up: true,
    },
    { label: 'Alcance total',        value: '—', delta: 'Requiere API externa', up: true },
    { label: 'Engagement promedio',  value: '—', delta: 'Requiere API externa', up: true },
    {
      label: 'Tasa de aprobación',
      value: isLoading ? '…' : `${reports?.approvalRate ?? 0}%`,
      delta: reports?.approvalRate ? (reports.approvalRate >= 80 ? '▲ buen ritmo' : '▼ revisar flujo') : '—',
      up: (reports?.approvalRate ?? 0) >= 80,
    },
  ]

  const donutSegments = reports?.donutSegments ?? []
  const bars          = reports?.bars ?? []
  const topAccounts   = reports?.topAccounts ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Mi agencia', 'Reportes']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
              Exportar PDF
            </button>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>
              + Nuevo reporte
            </button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Reportes</h2>
            <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
              {isLoading ? 'Cargando…' : `${reports?.total ?? 0} piezas programadas este mes — ${monthLabel}.`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Mes anterior</button>
            <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent', cursor: 'pointer' }}>Trimestre</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden', marginBottom: 16 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'var(--bg-1)', padding: '18px 20px' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', margin: '4px 0 0' }}>{s.value}</div>
              <div className="mono" style={{ fontSize: 11, marginTop: 6, color: s.up ? 'var(--status-approved)' : 'var(--status-rejected)' }}>{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Chart + Donut */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Piezas programadas por semana</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{monthLabel.toUpperCase()}</span>
            </div>
            <div style={{
              height: 220, padding: 18,
              display: 'flex', alignItems: 'flex-end', gap: 8,
              borderBottom: '1px solid var(--line-1)',
              background: 'repeating-linear-gradient(to top, transparent 0 43px, var(--line-1) 43px 44px)',
            }}>
              {bars.length === 0 && !isLoading && (
                <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: 'var(--fg-3)', fontSize: 13 }}>
                  Sin piezas este mes
                </div>
              )}
              {bars.map((b) => (
                <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', maxWidth: 28, background: b.faded ? 'var(--bg-3)' : 'var(--violet-500)', borderRadius: '4px 4px 0 0', height: `${b.pct}%`, cursor: 'pointer' }} />
                  <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' }}>{b.label}</span>
                </div>
              ))}
            </div>
            <div className="mono" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Promedio: {reports?.avgPerWeek ?? 0} piezas/sem</span>
              <span>{reports?.peakBar ? `Pico: ${reports.peakBar.count} piezas (${reports.peakBar.label})` : '—'}</span>
            </div>
          </section>

          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Mix por formato</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{reports?.total ?? 0} PIEZAS</span>
            </div>
            <div style={{ width: 160, height: 160, margin: '16px auto', position: 'relative' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="60" fill="none" stroke="var(--bg-3)" strokeWidth="20" />
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.label}
                    cx="80" cy="80" r="60"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="20"
                    strokeDasharray={`${seg.dash} 377`}
                    strokeDashoffset={seg.offset}
                  />
                ))}
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                <div>
                  <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>{reports?.total ?? 0}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
                </div>
              </div>
            </div>
            {donutSegments.length === 0 && !isLoading && (
              <div style={{ padding: '14px 18px', color: 'var(--fg-3)', fontSize: 12, textAlign: 'center' }}>Sin piezas este mes</div>
            )}
            {donutSegments.map((seg) => (
              <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '1px solid var(--line-1)', fontSize: 13 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
                <span>{seg.label}</span>
                <span className="mono" style={{ marginLeft: 'auto', fontSize: 12 }}>{seg.value}</span>
              </div>
            ))}
          </section>
        </div>

        {/* Top accounts + Recent reports */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Top cuentas por piezas</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{monthLabel.toUpperCase()} · TOP 5</span>
            </div>
            {!isLoading && topAccounts.length === 0 && (
              <div style={{ padding: '24px 18px', color: 'var(--fg-3)', fontSize: 13, textAlign: 'center' }}>Sin cuentas con piezas este mes</div>
            )}
            {topAccounts.map((a) => (
              <div
                key={a.id}
                style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 14, alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--line-1)', cursor: 'default' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{a.initials}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{a.name}</div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>{a.count} piezas</div>
                </div>
                <span className="mono pill pill-approved">{a.count}</span>
              </div>
            ))}
          </section>

          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Reportes generados</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ÚLTIMOS 7</span>
            </div>
            {RECENT_REPORTS.map((r) => (
              <div
                key={r.title}
                style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto auto', gap: 14, alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--line-1)', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{r.type}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{r.title}</div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>{r.sub}</div>
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{r.when}</span>
                <span style={{ color: 'var(--fg-3)' }}>↓</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
