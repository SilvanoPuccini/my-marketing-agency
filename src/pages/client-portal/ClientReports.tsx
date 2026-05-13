export function ClientReports() {
  return (
    <div style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
        Reportes
      </h2>
      <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 28px' }}>
        Métricas y reportes de tu cuenta.
      </p>

      <div style={{
        padding: 40, textAlign: 'center',
        background: 'var(--bg-1)', border: '1px solid var(--line-1)',
        borderRadius: 'var(--r-3)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
        <p style={{ color: 'var(--fg-2)', fontSize: 14, margin: '0 0 8px', fontWeight: 500 }}>
          Reportes próximamente
        </p>
        <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: 0 }}>
          Cuando tu agencia conecte las APIs de redes sociales, vas a poder ver métricas de alcance, engagement y crecimiento.
        </p>
      </div>
    </div>
  )
}
