import { Link } from 'react-router-dom'

const wrap: React.CSSProperties = {
  background: 'var(--bg-0)',
  minHeight: '100vh',
  fontFamily: 'var(--font-sans)',
  color: 'var(--fg-1)',
}

const header: React.CSSProperties = {
  borderBottom: '1px solid var(--line-1)',
  padding: '16px 32px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
}

const logo: React.CSSProperties = {
  width: 32, height: 32,
  borderRadius: 'var(--r-3)',
  background: 'var(--violet-500)',
  color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, fontSize: 16,
  textDecoration: 'none',
}

const content: React.CSSProperties = {
  maxWidth: 800,
  margin: '0 auto',
  padding: '48px 32px 80px',
}

const heroBanner: React.CSSProperties = {
  background: '#16a34a1a',
  border: '1px solid #16a34a40',
  borderRadius: 'var(--r-3)',
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 40,
}

const dot: React.CSSProperties = {
  width: 10, height: 10,
  borderRadius: '50%',
  background: '#16a34a',
  flexShrink: 0,
}

const serviceRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 0',
  borderBottom: '1px solid var(--line-1)',
}

const badge: React.CSSProperties = {
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  fontWeight: 600,
  color: '#16a34a',
  background: '#16a34a1a',
  border: '1px solid #16a34a40',
  borderRadius: 'var(--r-3)',
  padding: '3px 10px',
}

const metaRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 13,
  color: 'var(--fg-3)',
  fontFamily: 'var(--font-mono)',
  marginTop: 8,
}

const historyBar: React.CSSProperties = {
  display: 'flex',
  gap: 2,
  marginTop: 32,
}

const barSegment: React.CSSProperties = {
  flex: 1,
  height: 28,
  borderRadius: 3,
  background: '#16a34a',
}

const incidents: React.CSSProperties = {
  marginTop: 48,
}

const h2style: React.CSSProperties = {
  fontSize: 16, fontWeight: 600, marginBottom: 16,
}

const incidentCard: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-1)',
  borderRadius: 'var(--r-3)',
  padding: '16px 20px',
  fontSize: 13,
  color: 'var(--fg-3)',
  fontFamily: 'var(--font-mono)',
}

const services = [
  { name: 'Aplicación web', desc: 'Panel de agencia y portal de clientes' },
  { name: 'API', desc: 'Endpoints REST y autenticación' },
  { name: 'Base de datos', desc: 'PostgreSQL · Supabase' },
  { name: 'Storage', desc: 'Almacenamiento de archivos y medios' },
  { name: 'Auth', desc: 'Inicio de sesión y gestión de sesiones' },
]

export function Status() {
  return (
    <div style={wrap}>
      <div style={header}>
        <Link to="/" style={logo}>M</Link>
        <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>Estado del Servicio</span>
      </div>

      <div style={content}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Estado del Servicio</h1>

        <div style={heroBanner}>
          <div style={dot} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Todos los sistemas operativos</div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>
              Sin incidentes activos · Última verificación hace 2 minutos
            </div>
          </div>
        </div>

        <div>
          {services.map((s) => (
            <div key={s.name} style={serviceRow}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>{s.desc}</div>
              </div>
              <span style={badge}>Operativo</span>
            </div>
          ))}
        </div>

        <div style={metaRow}>
          <span>Uptime últimos 90 días</span>
          <span style={{ color: '#16a34a', fontWeight: 600 }}>99,97%</span>
        </div>

        <div style={historyBar} title="Historial de disponibilidad — últimos 90 días">
          {Array.from({ length: 90 }).map((_, i) => (
            <div key={i} style={{ ...barSegment, opacity: i === 43 ? 0.35 : 1 }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', marginTop: 6 }}>
          <span>90 días atrás</span>
          <span>Hoy</span>
        </div>

        <div style={incidents}>
          <h2 style={h2style}>Historial de incidentes recientes</h2>
          <div style={incidentCard}>
            Sin incidentes registrados en los últimos 90 días.
          </div>
        </div>

        <div style={{ marginTop: 48, padding: '20px 24px', background: 'var(--bg-1)', borderRadius: 'var(--r-3)', border: '1px solid var(--line-1)' }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Suscribirse a actualizaciones</div>
          <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 12 }}>
            Recibí notificaciones por correo ante cualquier incidente o mantenimiento programado.
          </div>
          <a href="mailto:status@mma.app?subject=Suscripción%20a%20alertas"
            style={{ fontSize: 13, color: 'var(--violet-500)', fontFamily: 'var(--font-mono)' }}>
            status@mma.app →
          </a>
        </div>
      </div>
    </div>
  )
}
