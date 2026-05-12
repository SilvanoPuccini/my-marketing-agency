import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

// ── Scroll to top on mount ───────────────────────────────────────────────────
function ScrollReset() {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  return null
}

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

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 48,
  marginTop: 40,
}

const formCard: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}

const fieldWrap: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--fg-1)',
}

const inputStyle: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-1)',
  borderRadius: 'var(--r-3)',
  padding: '9px 12px',
  fontSize: 14,
  color: 'var(--fg-1)',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 120,
}

const btnSubmit: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  padding: '9px 20px', fontSize: 13, fontWeight: 500,
  color: '#fff', borderRadius: 'var(--r-3)',
  border: '1px solid var(--violet-500)', background: 'var(--violet-500)',
  cursor: 'pointer', alignSelf: 'flex-start',
}

const infoSection: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
}

const infoItem: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

const infoLabel: React.CSSProperties = {
  fontSize: 12,
  fontFamily: 'var(--font-mono)',
  color: 'var(--fg-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const infoValue: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--fg-1)',
}

export function Contact() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [sending, setSending] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      toast.error('Completá todos los campos antes de enviar.')
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setNombre('')
      setEmail('')
      setMensaje('')
      toast.success('¡Mensaje enviado! Te respondemos en menos de 24 horas.')
    }, 800)
  }

  return (
    <div style={wrap}>
      <ScrollReset />
      <div style={header}>
        <Link to="/" style={logo}>M</Link>
        <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>Contacto</span>
      </div>

      <div style={content}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Contacto</h1>
        <p style={{ fontSize: 14, color: 'var(--fg-3)', marginBottom: 0 }}>
          ¿Tenés alguna pregunta o querés saber más sobre MMA? Completá el formulario y te respondemos pronto.
        </p>

        <div style={grid}>
          <form style={formCard} onSubmit={handleSubmit} noValidate>
            <div style={fieldWrap}>
              <label style={labelStyle} htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle} htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="vos@agencia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={fieldWrap}>
              <label style={labelStyle} htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                placeholder="Contanos en qué podemos ayudarte..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                style={textareaStyle}
              />
            </div>

            <button type="submit" style={btnSubmit} disabled={sending}>
              {sending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>

          <div style={infoSection}>
            <div style={infoItem}>
              <span style={infoLabel}>Soporte técnico</span>
              <span style={infoValue}>soporte@mma.app</span>
              <span style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>
                Respuesta en menos de 24 h hábiles
              </span>
            </div>

            <div style={infoItem}>
              <span style={infoLabel}>Ventas y planes</span>
              <span style={infoValue}>ventas@mma.app</span>
              <span style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>
                Cotizaciones y demostraciones a medida
              </span>
            </div>

            <div style={infoItem}>
              <span style={infoLabel}>Privacidad y datos</span>
              <span style={infoValue}>privacidad@mma.app</span>
              <span style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>
                Solicitudes ARCO y cumplimiento normativo
              </span>
            </div>

            <div style={infoItem}>
              <span style={infoLabel}>Ubicación</span>
              <span style={infoValue}>Buenos Aires, Argentina</span>
              <span style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 2 }}>
                Zona horaria: ART (UTC−3)
              </span>
            </div>

            <div style={{ marginTop: 8, padding: '16px 20px', background: 'var(--bg-1)', borderRadius: 'var(--r-3)', border: '1px solid var(--line-1)' }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>¿Ya sos cliente?</div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>
                Iniciá sesión en tu panel para acceder al soporte directo.{' '}
                <Link to="/login" style={{ color: 'var(--violet-500)' }}>Iniciar sesión</Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid var(--line-1)' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--fg-3)',
              fontSize: 13,
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg-1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
