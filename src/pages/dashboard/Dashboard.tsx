import { TopBar } from '@/components/layout/TopBar'

const STATS = [
  {
    label: 'Piezas activas',
    value: '142',
    delta: '▲ 12 vs. mes pasado',
    deltaUp: true,
    spark: [30, 50, 40, 65, 55, 75, 90],
  },
  {
    label: 'Pendientes de aprobación',
    value: '8',
    delta: '▲ 3 desde ayer',
    deltaUp: false,
    spark: [40, 30, 50, 35, 60, 55, 80],
  },
  {
    label: 'Tiempo medio de aprobación',
    value: '1,4d',
    delta: '▼ 0,3d vs. mes pasado',
    deltaUp: true,
    spark: [80, 70, 75, 55, 60, 45, 40],
  },
  {
    label: 'Tasa de aprobación',
    value: '87%',
    delta: '▲ 4pp vs. mes pasado',
    deltaUp: true,
    spark: [55, 60, 50, 70, 75, 80, 88],
  },
]

const ATTENTION_ITEMS = [
  { title: 'Reel — apertura de temporada', account: 'Parrilla Don Tito · Reel · LUN 28 ABR · 18:00', status: 'rejected', label: 'Cambios pedidos', when: 'hace 2 h' },
  { title: 'Carrusel — 5 tips para emprender', account: 'Talampaya Coworking · Carrusel · MAR 29 ABR · 09:00', status: 'sent', label: 'Esperando cliente', when: 'hace 1 d' },
  { title: 'Story — promo viernes 2x1', account: 'Empanadas del Norte · Story · VIE 02 MAY · 12:00', status: 'draft', label: 'Borrador', when: 'hoy' },
  { title: 'Post — caso Cliente del Mes', account: 'Buenos Aires Co. · Post · JUE 01 MAY · 11:00', status: 'sent', label: 'Esperando cliente', when: 'hace 4 h' },
  { title: 'Reel — receta semanal #14', account: 'Vinos Cafayate · Reel · MIÉ 30 ABR · 19:30', status: 'rejected', label: 'Cambios pedidos', when: 'ayer' },
]

const TEAM_LOAD = [
  { name: 'Mateo Rodríguez · Diseño', done: 12, total: 14, pct: 86, variant: '' },
  { name: 'Camila Sosa · Copy', done: 7, total: 12, pct: 58, variant: 'ok' },
  { name: 'Juan Pablo Gómez · Account', done: 14, total: 14, pct: 100, variant: 'warn' },
  { name: 'Sofía Iglesias · Diseño', done: 9, total: 14, pct: 64, variant: 'ok' },
  { name: 'Tomás Acuña · Copy jr.', done: 5, total: 10, pct: 50, variant: 'ok' },
]

const ACTIVITY = [
  { initials: 'RP', name: 'Rocío Paz', action: 'aprobó', target: 'Reel — Volvemos con todo', account: 'PARRILLA DON TITO', when: 'HACE 14 MIN', violet: true },
  { initials: 'MR', name: 'Mateo Rodríguez', action: 'subió', target: '3 versiones del carrusel #ABR-014', account: 'TALAMPAYA', when: 'HACE 1 H', violet: false },
  { initials: 'CS', name: 'Camila Sosa', action: 'comentó en', target: 'Story promo viernes', account: 'EMPANADAS DEL NORTE', when: 'HACE 2 H', violet: false },
  { initials: 'FN', name: 'Federico Nuñez', action: 'pidió cambios en', target: 'Reel receta semanal #14', account: 'VINOS CAFAYATE', when: 'HACE 5 H', violet: false },
  { initials: 'JP', name: 'Juan Pablo Gómez', action: 'creó la cuenta', target: 'Librería La Torre', account: 'NUEVA CUENTA', when: 'AYER 18:42', violet: false },
]

const ACCOUNTS_PAUTA = [
  { initials: 'DT', name: 'Parrilla Don Tito', sub: 'Pauta · $480.000 · Meta + IG', pieces: '12 PIEZAS', status: 'approved', label: 'Al día' },
  { initials: 'EN', name: 'Empanadas del Norte', sub: 'Pauta · $260.000 · IG + TikTok', pieces: '8 PIEZAS', status: 'sent', label: '2 por aprobar' },
  { initials: 'TC', name: 'Talampaya Coworking', sub: 'Pauta · $180.000 · LinkedIn + IG', pieces: '14 PIEZAS', status: 'approved', label: 'Al día' },
  { initials: 'VC', name: 'Vinos Cafayate', sub: 'Pauta · $620.000 · IG + Meta + TikTok', pieces: '22 PIEZAS', status: 'rejected', label: 'Demora' },
  { initials: 'BC', name: 'Buenos Aires Co.', sub: 'Pauta · $340.000 · IG + LinkedIn', pieces: '10 PIEZAS', status: 'approved', label: 'Al día' },
]

function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span className={`pill pill-${status}`}>
      <span className="dot" />
      {label}
    </span>
  )
}

function Spark({ values }: { values: number[] }) {
  const max = Math.max(...values)
  return (
    <div style={{ height: 28, marginTop: 12, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
      {values.map((v, i) => (
        <span
          key={i}
          style={{
            flex: 1,
            background: v === max ? 'var(--violet-500)' : 'var(--violet-soft)',
            borderRadius: 1,
            height: `${v}%`,
          }}
        />
      ))}
    </div>
  )
}

function Avatar({ initials, violet }: { initials: string; violet?: boolean }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: violet ? 'var(--violet-soft)' : 'var(--bg-3)',
        border: `1px solid ${violet ? 'var(--violet-soft)' : 'var(--line-2)'}`,
        color: violet ? 'var(--violet-400)' : 'var(--fg-1)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

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

export function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio Pampas', 'Panel']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
              Hoy
            </button>
            <button style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>
              + Nueva pieza
            </button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
              Buen día, Lucía 👋
            </h2>
            <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
              Hoy es lunes 27 de abril. Tu equipo tiene 7 piezas para entregar esta semana.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Esta semana</button>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent', cursor: 'pointer' }}>Mes</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: 'var(--bg-1)', padding: '18px 20px' }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
              <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 4 }}>
                {s.value}
              </div>
              <div className="mono" style={{ fontSize: 11, marginTop: 6, color: s.deltaUp ? 'var(--status-approved)' : 'var(--status-rejected)' }}>
                {s.delta}
              </div>
              <Spark values={s.spark} />
            </div>
          ))}
        </div>

        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginTop: 24 }}>
          {/* Attention items */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>
                Necesitan tu atención
              </h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                8 PIEZAS · ORDENADAS POR URGENCIA
              </span>
            </div>
            {ATTENTION_ITEMS.map((item) => (
              <div
                key={item.title}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto auto auto',
                  gap: 14,
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--line-1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 6, background: 'repeating-linear-gradient(45deg, var(--bg-3) 0 6px, var(--bg-4) 6px 12px)', border: '1px solid var(--line-1)' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{item.account}</div>
                </div>
                <StatusPill status={item.status} label={item.label} />
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{item.when}</span>
                <span style={{ color: 'var(--fg-3)' }}>→</span>
              </div>
            ))}
          </section>

          {/* Team load */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>Carga del equipo</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>SEMANA 17</span>
            </div>
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {TEAM_LOAD.map((m) => (
                <div key={m.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</span>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{m.done} / {m.total}</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        borderRadius: 999,
                        width: `${m.pct}%`,
                        background: m.variant === 'warn' ? '#F59E0B' : m.variant === 'ok' ? 'var(--status-approved)' : 'var(--violet-500)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          {/* Recent activity */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Actividad reciente</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ÚLTIMAS 24 H</span>
            </div>
            <div style={{ padding: '6px 0' }}>
              {ACTIVITY.map((a) => (
                <div
                  key={a.name + a.when}
                  style={{ display: 'flex', gap: 12, padding: '12px 18px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <Avatar initials={a.initials} violet={a.violet} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                      <span style={{ fontWeight: 500 }}>{a.name}</span>
                      <span style={{ color: 'var(--fg-2)' }}> {a.action} </span>
                      <span style={{ color: 'var(--violet-400)' }}>{a.target}</span>
                    </div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, textTransform: 'uppercase' }}>
                      {a.account} · {a.when}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Accounts with pauta */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Cuentas con pauta este mes</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ABRIL · 14 ACTIVAS</span>
            </div>
            {ACCOUNTS_PAUTA.map((a) => (
              <div
                key={a.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto auto',
                  gap: 14,
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--line-1)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Avatar initials={a.initials} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{a.sub}</div>
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>{a.pieces}</span>
                <StatusPill status={a.status} label={a.label} />
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
