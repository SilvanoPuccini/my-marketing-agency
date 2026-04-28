import { TopBar } from '@/components/layout/TopBar'

const STATS = [
  { label: 'Piezas publicadas', value: '142', delta: '▲ 12 vs. marzo', up: true },
  { label: 'Alcance total', value: '1,84M', delta: '▲ 18% vs. marzo', up: true },
  { label: 'Engagement promedio', value: '4,7%', delta: '▲ 0,4pp', up: true },
  { label: 'Tasa de aprobación', value: '87%', delta: '▲ 4pp', up: true },
]

const BARS = [
  { label: 'S14', pct: 42 },
  { label: 'S15', pct: 58 },
  { label: 'S16', pct: 70 },
  { label: 'S17', pct: 88 },
  { label: 'S18', pct: 65 },
  { label: 'S19', pct: 30, faded: true },
]

const DONUT_SEGMENTS = [
  { color: '#7C3AED', label: 'Reels', value: '57 · 40%', dash: 151, offset: 0 },
  { color: '#3B82F6', label: 'Posts', value: '43 · 30%', dash: 113, offset: -151 },
  { color: '#10B981', label: 'Carruseles', value: '28 · 20%', dash: 75, offset: -264 },
  { color: '#7A7A88', label: 'Stories', value: '14 · 10%', dash: 38, offset: -339 },
]

const TOP_ACCOUNTS = [
  { initials: 'VC', name: 'Vinos Cafayate', sub: '22 piezas · alcance 412k', reach: '412k', status: 'approved', delta: '+24%' },
  { initials: 'DT', name: 'Parrilla Don Tito', sub: '12 piezas · alcance 318k', reach: '318k', status: 'approved', delta: '+18%' },
  { initials: 'PA', name: 'Pampero Indumentaria', sub: '15 piezas · alcance 267k', reach: '267k', status: 'approved', delta: '+11%' },
  { initials: 'BC', name: 'Buenos Aires Co.', sub: '10 piezas · alcance 198k', reach: '198k', status: 'sent', delta: '+3%' },
  { initials: 'EN', name: 'Empanadas del Norte', sub: '8 piezas · alcance 142k', reach: '142k', status: 'rejected', delta: '−7%' },
]

const RECENT_REPORTS = [
  { type: 'PDF', title: 'Don Tito · Abril 2026', sub: '14 páginas · con marca de cliente', when: 'HOY 09:14' },
  { type: 'PDF', title: 'Cafayate · Abril 2026', sub: '22 páginas · con marca de cliente', when: 'AYER' },
  { type: 'PDF', title: 'Pampero · Abril 2026', sub: '18 páginas · con marca de cliente', when: 'VIE 25' },
  { type: 'CSV', title: 'Consolidado Q1 2026', sub: '18 cuentas · métricas crudas', when: 'JUE 24' },
  { type: 'PDF', title: 'Talampaya · Marzo 2026', sub: '10 páginas · con marca de cliente', when: 'MIÉ 23' },
]

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio Pampas', 'Reportes']}
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
            <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>Métricas consolidadas de las 18 cuentas activas — Abril 2026.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Mes anterior</button>
            <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent', cursor: 'pointer' }}>Trimestre</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden', marginBottom: 16 }}>
          {STATS.map((s) => (
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
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Piezas publicadas por semana</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ABRIL 2026</span>
            </div>
            <div style={{
              height: 220, padding: 18,
              display: 'flex', alignItems: 'flex-end', gap: 8,
              borderBottom: '1px solid var(--line-1)',
              background: 'repeating-linear-gradient(to top, transparent 0 43px, var(--line-1) 43px 44px)',
            }}>
              {BARS.map((b) => (
                <div key={b.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', maxWidth: 28, background: b.faded ? 'var(--bg-3)' : 'var(--violet-500)', borderRadius: '4px 4px 0 0', height: `${b.pct}%`, cursor: 'pointer' }} />
                  <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase' }}>{b.label}</span>
                </div>
              ))}
            </div>
            <div className="mono" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <span>Promedio: 28 piezas/sem</span>
              <span>Pico: 42 piezas (S17)</span>
            </div>
          </section>

          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Mix por formato</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>142 PIEZAS</span>
            </div>
            <div style={{ width: 160, height: 160, margin: '16px auto', position: 'relative' }}>
              <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="80" cy="80" r="60" fill="none" stroke="var(--bg-3)" strokeWidth="20" />
                {DONUT_SEGMENTS.map((seg) => (
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
                  <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>142</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</div>
                </div>
              </div>
            </div>
            {DONUT_SEGMENTS.map((seg) => (
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
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Top cuentas por alcance</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ABRIL · TOP 5</span>
            </div>
            {TOP_ACCOUNTS.map((a) => (
              <div
                key={a.name}
                style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto auto', gap: 14, alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--line-1)', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{a.initials}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 13 }}>{a.name}</div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>{a.sub}</div>
                </div>
                <span className="mono" style={{ fontSize: 12 }}>{a.reach}</span>
                <span className={`pill pill-${a.status}`}><span className="dot" />{a.delta}</span>
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
