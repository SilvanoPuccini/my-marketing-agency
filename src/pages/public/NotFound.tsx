import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div
          className="mono"
          style={{
            fontSize: 72, fontWeight: 700, letterSpacing: '-0.04em',
            background: 'linear-gradient(180deg, var(--violet-400), var(--violet-600))',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: '8px 0 12px', letterSpacing: '-0.02em' }}>
          Página no encontrada
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 14, margin: '0 0 28px', lineHeight: 1.5 }}>
          La página que buscás no existe o fue movida. Verificá la URL o volvé al inicio.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Link
            to="/"
            style={{
              padding: '10px 18px', fontSize: 14, fontWeight: 500,
              color: 'var(--fg-1)', borderRadius: 'var(--r-2)',
              border: '1px solid var(--line-2)', background: 'var(--bg-2)',
              textDecoration: 'none',
            }}
          >
            Ir al inicio
          </Link>
          <Link
            to="/dashboard"
            style={{
              padding: '10px 18px', fontSize: 14, fontWeight: 500,
              color: '#fff', borderRadius: 'var(--r-2)',
              border: '1px solid var(--violet-400)', background: 'var(--violet-500)',
              textDecoration: 'none',
            }}
          >
            Ir al panel
          </Link>
        </div>
      </div>
    </div>
  )
}
