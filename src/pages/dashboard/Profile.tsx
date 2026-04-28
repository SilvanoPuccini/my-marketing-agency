import { TopBar } from '@/components/layout/TopBar'

const ACTIVITY = [
  { dot: 'violet', text: 'Aprobó "Reel apertura temporada" para', bold: 'Don Tito', when: 'HOY · 12:18' },
  { dot: 'violet', text: 'Reasignó "Carrusel 5 tips" a Camila Sosa', when: 'HOY · 11:42' },
  { dot: 'green', text: 'Cerró el reporte mensual de', bold: 'Vinos Cafayate', extra: '· 22 páginas', when: 'HOY · 10:08' },
  { dot: 'violet', text: 'Comentó en "Story menú": "Subamos la saturación del fondo, queda apagado en feed."', when: 'AYER · 18:30' },
  { dot: 'gray', text: 'Invitó a Federico Núñez como Account', when: 'AYER · 14:12' },
  { dot: 'green', text: 'Aprobó 8 piezas de', bold: 'Buenos Aires Co.', extra: 'en lote', when: 'VIE 25 · 16:55' },
  { dot: 'violet', text: 'Creó la cuenta', bold: 'Talampaya Outdoors', extra: 'y subió el brief inicial', when: 'VIE 25 · 09:20' },
  { dot: 'violet', text: 'Cambió el plan de Pampero Indumentaria de Mensual a Trimestral', when: 'JUE 24 · 17:08' },
]

const ACCOUNTS = [
  { initials: 'DT', name: 'Parrilla Don Tito', pieces: '12 PIEZAS' },
  { initials: 'VC', name: 'Vinos Cafayate', pieces: '22 PIEZAS' },
  { initials: 'PA', name: 'Pampero Indumentaria', pieces: '15 PIEZAS' },
  { initials: 'EN', name: 'Empanadas del Norte', pieces: '8 PIEZAS' },
  { initials: 'BC', name: 'Buenos Aires Co.', pieces: '10 PIEZAS' },
  { initials: 'TA', name: 'Talampaya Outdoors', pieces: '6 PIEZAS' },
  { initials: 'CM', name: 'Casa Mate', pieces: '9 PIEZAS' },
]

const PERMISSIONS = [
  'Crear cuentas',
  'Invitar miembros',
  'Editar facturación',
  'Eliminar cuentas',
  'Acceso a API',
]

const STATS = [
  { label: 'Piezas revisadas (abr)', value: '142' },
  { label: 'Tiempo promedio de revisión', value: '12 min' },
  { label: 'Aprobadas a la primera', value: '87%' },
]

const dotColor = (dot: string) => {
  if (dot === 'green') return 'var(--status-approved)'
  if (dot === 'gray') return 'var(--bg-3)'
  return 'var(--violet-500)'
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

export function Profile() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Equipo', 'Lucía Fernández']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Editar perfil</button>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>Mensaje directo</button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '28px 0 24px', borderBottom: '1px solid var(--line-1)', marginBottom: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: 'var(--r-3)', background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 32, color: '#fff', flexShrink: 0, boxShadow: '0 0 0 1px var(--violet-400) inset' }}>
            LF
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600 }}>Lucía Fernández</h1>
            <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
              <span className="pill pill-violet"><span className="dot" />Directora</span>
              <span className="pill pill-approved"><span className="dot" />Activa ahora</span>
              <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>lucia@estudiopampas.com.ar · +54 9 11 5847 9921</span>
            </div>
            <div className="mono" style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {['EN MMA DESDE NOV 2024', 'BUENOS AIRES, AR', 'UTC−3', '18 / 18 CUENTAS'].map((m) => (
                <span key={m} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: 'var(--violet-500)' }}>▸</span> {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--line-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden', marginBottom: 16 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: 'var(--bg-1)', padding: '14px 16px' }}>
              <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          {/* Activity */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Actividad reciente</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>ÚLTIMOS 7 DÍAS</span>
            </div>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 18px', borderBottom: '1px solid var(--line-1)', alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: dotColor(a.dot), marginTop: 6, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--fg-1)' }}>
                    {a.text}{a.bold && <> <strong style={{ fontWeight: 500 }}>{a.bold}</strong></>}{a.extra && ` ${a.extra}`}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{a.when}</div>
                </div>
              </div>
            ))}
          </section>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Assigned accounts */}
            <section style={panel}>
              <div style={panelH}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Cuentas asignadas</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>18 · DIRECTORA</span>
              </div>
              {ACCOUNTS.map((a) => (
                <div key={a.initials} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--line-1)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 10 }}>{a.initials}</div>
                  <div style={{ fontSize: 13 }}>{a.name}</div>
                  <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--fg-3)' }}>{a.pieces}</span>
                </div>
              ))}
              <div className="mono" style={{ display: 'flex', justifyContent: 'center', fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '10px 18px', cursor: 'pointer' }}>
                Ver las 18 cuentas →
              </div>
            </section>

            {/* Permissions */}
            <section style={panel}>
              <div style={panelH}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Permisos</h3>
              </div>
              {PERMISSIONS.map((p) => (
                <div key={p} style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 18, alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--line-1)' }}>
                  <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>{p}</span>
                  <span className="pill pill-approved"><span className="dot" />Sí</span>
                  <div />
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
