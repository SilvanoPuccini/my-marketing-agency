import { useState } from 'react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { TopBar } from '@/components/layout/TopBar'
import { useAuthStore } from '@/stores/auth.store'
import { useReports } from '@/features/reports/hooks/useReports'
import { supabase } from '@/lib/supabase'

function useRecentReports(agencyId: string | undefined) {
  return useQuery({
    queryKey: ['recent-reports', agencyId],
    enabled: !!agencyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('id, title, status, updated_at, type, accounts(name)')
        .is('archived_at', null)
        .eq('status', 'published')
        .order('updated_at', { ascending: false })
        .limit(7)
      if (error) throw error
      return (data ?? []).map((p) => {
        const acc = p.accounts as { name: string } | null
        const when = new Date(p.updated_at)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - when.getTime()) / 86400000)
        let whenLabel = when.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }).toUpperCase().replace('.', '')
        if (diffDays === 0) whenLabel = `HOY ${when.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`
        else if (diffDays === 1) whenLabel = 'AYER'
        return {
          type: p.type?.toUpperCase().slice(0, 4) ?? 'POST',
          title: `${acc?.name ?? '—'} · ${p.title}`,
          sub: `${p.type} · publicado`,
          when: whenLabel,
        }
      })
    },
  })
}

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
  const [reportMonth, setReportMonth] = useState(new Date().getMonth())
  const [reportYear, setReportYear] = useState(new Date().getFullYear())

  const { data: reports, isLoading } = useReports(user?.agency_id, reportMonth, reportYear)
  const { data: recentReports = [] } = useRecentReports(user?.agency_id)

  const monthLabel = `${MONTH_NAMES[reportMonth]} ${reportYear}`

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
            <button
              onClick={() => {
                const topAccountsRows = topAccounts.length > 0
                  ? topAccounts.map(a => `<tr><td>${a.name}</td><td style="text-align:right">${a.count}</td></tr>`).join('')
                  : '<tr><td colspan="2" style="color:#888;text-align:center">Sin cuentas con piezas este mes</td></tr>'
                const donutRows = donutSegments.length > 0
                  ? donutSegments.map(s => `<tr><td><span style="display:inline-block;width:10px;height:10px;background:${s.color};border-radius:2px;margin-right:6px"></span>${s.label}</td><td style="text-align:right">${s.value}</td></tr>`).join('')
                  : '<tr><td colspan="2" style="color:#888;text-align:center">Sin piezas este mes</td></tr>'
                const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reporte ${monthLabel}</title><style>
                  *{box-sizing:border-box;margin:0;padding:0}
                  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111;padding:40px;max-width:800px;margin:0 auto}
                  h1{font-size:22px;font-weight:700;margin-bottom:4px}
                  .sub{font-size:13px;color:#666;margin-bottom:32px}
                  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#ddd;border:1px solid #ddd;border-radius:8px;overflow:hidden;margin-bottom:32px}
                  .stat{background:#fff;padding:16px}
                  .stat-label{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#888;margin-bottom:4px}
                  .stat-value{font-size:24px;font-weight:700;font-variant-numeric:tabular-nums}
                  .stat-delta{font-size:11px;color:#888;margin-top:4px}
                  h2{font-size:14px;font-weight:600;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #eee}
                  section{margin-bottom:28px}
                  table{width:100%;border-collapse:collapse;font-size:13px}
                  th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#888;padding:6px 0;border-bottom:1px solid #eee}
                  td{padding:8px 0;border-bottom:1px solid #f4f4f4}
                  .grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
                  @media print{body{padding:24px}}
                </style></head><body>
                  <h1>Reporte mensual &middot; ${monthLabel}</h1>
                  <p class="sub">Generado el ${new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <div class="stats">
                    ${stats.map(s => `<div class="stat"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-delta">${s.delta}</div></div>`).join('')}
                  </div>
                  <div class="grid">
                    <section>
                      <h2>Top cuentas por piezas</h2>
                      <table><thead><tr><th>Cuenta</th><th style="text-align:right">Piezas</th></tr></thead><tbody>${topAccountsRows}</tbody></table>
                    </section>
                    <section>
                      <h2>Mix por formato</h2>
                      <table><thead><tr><th>Formato</th><th style="text-align:right">Piezas</th></tr></thead><tbody>${donutRows}</tbody></table>
                    </section>
                  </div>
                </body></html>`
                const w = window.open('', '_blank')
                if (!w) { toast.error('No se pudo abrir la ventana de impresión'); return }
                w.document.write(html)
                w.document.close()
                w.focus()
                w.print()
              }}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >
              Exportar PDF
            </button>
            <button
              onClick={() => {
                if (!reports || reports.total === 0) {
                  toast.info('No hay datos para generar reporte este mes')
                  return
                }
                const header = ['Metrica', 'Valor']
                const rows = [
                  ['Piezas publicadas', String(reports.publishedCount ?? 0)],
                  ['Piezas totales', String(reports.total ?? 0)],
                  ['Tasa de aprobacion', `${reports.approvalRate ?? 0}%`],
                  ['Promedio por semana', String(reports.avgPerWeek ?? 0)],
                ]
                if (reports.topAccounts) {
                  reports.topAccounts.forEach((a: { name: string; count: number }) => {
                    rows.push([`Top cuenta: ${a.name}`, String(a.count)])
                  })
                }
                const csv = '\uFEFF' + [header.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\r\n')
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `reporte-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
                toast.success('Reporte descargado')
              }}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
            >
              + Nuevo reporte
            </button>
          </div>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Reportes</h2>
            <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
              {isLoading ? 'Cargando…' : `${reports?.total ?? 0} piezas programadas este mes — ${monthLabel}.`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                if (reportMonth === 0) { setReportYear(y => y - 1); setReportMonth(11) }
                else setReportMonth(m => m - 1)
              }}
              style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >
              Mes anterior
            </button>
            <button
              onClick={() => {
                if (reportMonth === 11) { setReportYear(y => y + 1); setReportMonth(0) }
                else setReportMonth(m => m + 1)
              }}
              style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
            >
              Mes siguiente
            </button>
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
        <div className="reports-charts" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
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
        <div className="reports-bottom" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
            {recentReports.length === 0 && !isLoading && (
              <div style={{ padding: '24px 18px', color: 'var(--fg-3)', fontSize: 13, textAlign: 'center' }}>Sin reportes publicados aún</div>
            )}
            {recentReports.map((r) => (
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
