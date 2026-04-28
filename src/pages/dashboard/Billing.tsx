import { TopBar } from '@/components/layout/TopBar'

const INVOICES = [
  { num: 'FC-A-0014', period: 'ABR 2026', emision: '01/05/26', concept: 'Plan Estudio · mensual', sub: '$84.000', iva: '$17.640', total: '$101.640', status: 'sent', label: 'Próxima' },
  { num: 'FC-A-0013', period: 'MAR 2026', emision: '01/04/26', concept: 'Plan Estudio · mensual', sub: '$84.000', iva: '$17.640', total: '$101.640', status: 'approved', label: 'Pagada' },
  { num: 'FC-A-0012', period: 'FEB 2026', emision: '01/03/26', concept: 'Plan Estudio · mensual', sub: '$84.000', iva: '$17.640', total: '$101.640', status: 'approved', label: 'Pagada' },
  { num: 'FC-A-0011', period: 'ENE 2026', emision: '01/02/26', concept: 'Plan Estudio · mensual', sub: '$72.000', iva: '$15.120', total: '$87.120', status: 'approved', label: 'Pagada' },
  { num: 'FC-A-0010', period: 'DIC 2025', emision: '01/01/26', concept: 'Plan Estudio · mensual', sub: '$72.000', iva: '$15.120', total: '$87.120', status: 'approved', label: 'Pagada' },
  { num: 'FC-A-0009', period: 'NOV 2025', emision: '01/12/25', concept: 'Plan Estudio · mensual', sub: '$72.000', iva: '$15.120', total: '$87.120', status: 'approved', label: 'Pagada' },
  { num: 'FC-A-0008', period: 'OCT 2025', emision: '01/11/25', concept: 'Plan Estudio · mensual', sub: '$72.000', iva: '$15.120', total: '$87.120', status: 'approved', label: 'Pagada' },
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

function Meter({ value }: { value: number }) {
  return (
    <div style={{ height: 8, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden', marginTop: 10 }}>
      <span style={{ display: 'block', height: '100%', background: 'var(--violet-500)', borderRadius: 999, width: `${value}%` }} />
    </div>
  )
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-1)', fontSize: 13 }}>
      <span style={{ color: 'var(--fg-3)' }}>{label}</span>
      <span className="mono">{value}</span>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', fontWeight: 500, fontSize: 11, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: 'var(--fg-3)', padding: '10px 16px',
  borderBottom: '1px solid var(--line-1)', background: 'var(--bg-1)',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 16px', borderBottom: '1px solid var(--line-1)',
  color: 'var(--fg-1)', verticalAlign: 'middle',
}

export function Billing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio Pampas', 'Facturación']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Datos fiscales</button>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>Cambiar plan</button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Facturación</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>Estudio Pampas SRL · CUIT 30-71234567-8 · Plan Estudio mensual.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Plan actual */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Plan actual</h3>
              <span className="pill pill-approved"><span className="dot" />Activa</span>
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.02em' }}>Estudio</h3>
                <span className="mono" style={{ fontSize: 12, color: 'var(--fg-3)' }}>DESDE NOV 2024</span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
                $84.000{' '}
                <span style={{ fontSize: 13, color: 'var(--fg-3)', fontWeight: 400 }}>/ mes + IVA</span>
              </div>
              <div style={{ color: 'var(--fg-3)', fontSize: 13 }}>Próxima factura: 1 de mayo de 2026 · ARS 101.640 (IVA 21%)</div>

              <div style={{ marginTop: 24 }}>
                <PlanRow label="Cuentas activas" value="18 / 25" />
                <Meter value={72} />
              </div>
              <div style={{ marginTop: 16 }}>
                <PlanRow label="Asientos de equipo" value="12 / 15" />
                <Meter value={80} />
              </div>
              <div style={{ marginTop: 16 }}>
                <PlanRow label="Almacenamiento" value="28,4 / 100 GB" />
                <Meter value={28} />
              </div>
              <div style={{ marginTop: 16 }}>
                <PlanRow label="Portales de cliente" value="14 ilimitados" />
                <PlanRow label="Reportes PDF con marca propia" value="Incluido" />
                <PlanRow label="Soporte por WhatsApp" value="Incluido" />
              </div>
            </div>
          </section>

          {/* Método de pago + Datos fiscales */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <section style={panel}>
              <div style={panelH}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Método de pago</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>+ AGREGAR</span>
              </div>

              {[
                { brand: 'VISA', num: '•••• •••• •••• 4288', exp: 'VENCE 09/28 · L. FERNÁNDEZ', primary: true },
                { brand: 'MAS', num: '•••• •••• •••• 1102', exp: 'VENCE 03/27 · ESTUDIO PAMPAS SRL', primary: false },
              ].map((card) => (
                <div key={card.num} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: '1px solid var(--line-1)' }}>
                  <div style={{ width: 44, height: 30, borderRadius: 4, background: 'linear-gradient(135deg, #1a1a26, #2c2c3a)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-2)' }}>
                    {card.brand}
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 13 }}>{card.num}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{card.exp}</div>
                  </div>
                  {card.primary && (
                    <div style={{ marginLeft: 'auto' }}>
                      <span className="pill pill-violet"><span className="dot" />Principal</span>
                    </div>
                  )}
                </div>
              ))}

              <div style={{ ...panelH, borderTop: '1px solid var(--line-1)', borderBottom: 0 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Datos fiscales</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>EDITAR</span>
              </div>
              <div style={{ padding: '14px 18px', fontSize: 13 }}>
                {[
                  { l: 'Razón social', v: 'Estudio Pampas SRL', mono: false },
                  { l: 'CUIT', v: '30-71234567-8', mono: true },
                  { l: 'Cond. IVA', v: 'Resp. Inscripto', mono: true },
                  { l: 'Domicilio', v: 'Honduras 4900, CABA', mono: false },
                ].map((row) => (
                  <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-1)', fontSize: 13 }}>
                    <span style={{ color: 'var(--fg-3)' }}>{row.l}</span>
                    <span className={row.mono ? 'mono' : ''}>{row.v}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Invoice history */}
        <section style={{ ...panel, overflow: 'hidden' }}>
          <div style={panelH}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Historial de facturas</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Exportar CSV</button>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>14 FACTURAS</span>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['N° factura', 'Período', 'Emisión', 'Concepto', 'Subtotal', 'IVA', 'Total', 'Estado', ''].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr
                  key={inv.num}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--bg-2)' }) }}
                  onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'transparent' }) }}
                >
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{inv.num}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{inv.period}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>{inv.emision}</td>
                  <td style={tdStyle}>{inv.concept}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{inv.sub}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{inv.iva}</td>
                  <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{inv.total}</td>
                  <td style={tdStyle}><span className={`pill pill-${inv.status}`}><span className="dot" />{inv.label}</span></td>
                  <td style={{ ...tdStyle, color: 'var(--fg-3)' }}>↓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
