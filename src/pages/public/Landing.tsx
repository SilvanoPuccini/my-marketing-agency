import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backdropFilter: 'blur(12px)',
        background: 'rgba(10,10,15,0.72)',
        borderBottom: '1px solid var(--line-1)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          padding: '14px 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: 13,
              color: '#fff',
              boxShadow: '0 0 0 1px var(--violet-400) inset',
            }}
          >
            M
          </div>
          <span style={{ fontWeight: 600, letterSpacing: '-0.015em' }}>My Marketing Agency</span>
        </div>

        <nav style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {['Producto', 'Flujo', 'Precios', 'Casos'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                padding: '6px 12px',
                fontSize: 13,
                color: 'var(--fg-2)',
                borderRadius: 'var(--r-2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--fg-1)'
                e.currentTarget.style.background = 'var(--bg-2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--fg-2)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <span
          className="mono"
          style={{
            fontSize: 11,
            color: 'var(--fg-3)',
            padding: '4px 8px',
            border: '1px solid var(--line-2)',
            borderRadius: 'var(--r-1)',
          }}
        >
          ES‑AR
        </span>
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--fg-2)',
            borderRadius: 'var(--r-2)',
            border: '1px solid transparent',
            background: 'transparent',
          }}
        >
          Ingresar
        </Link>
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 14px',
            fontSize: 13,
            fontWeight: 500,
            color: '#fff',
            borderRadius: 'var(--r-2)',
            border: '1px solid var(--violet-400)',
            background: 'var(--violet-500)',
            boxShadow: '0 0 0 1px var(--violet-500), 0 1px 0 rgba(255,255,255,0.12) inset',
          }}
        >
          Empezar gratis
        </Link>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 48px' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--violet-400)',
          background: 'var(--violet-soft)',
          border: '1px solid var(--violet-soft)',
          padding: '4px 10px',
          borderRadius: 999,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: 'var(--violet-400)',
            boxShadow: '0 0 8px var(--violet-400)',
          }}
        />
        v2.4 · ahora con flujo de aprobación de cliente
      </span>

      <h1
        style={{
          margin: '24px 0 18px',
          fontSize: 64,
          lineHeight: 1.04,
          letterSpacing: '-0.035em',
          fontWeight: 600,
          maxWidth: 920,
        }}
      >
        La operación de tu agencia,{' '}
        <span
          style={{
            background: 'linear-gradient(180deg, var(--violet-400), var(--violet-500))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          en un solo lugar.
        </span>
        <br />
        <span style={{ color: 'var(--fg-3)' }}>Sin planillas, sin grupos de WhatsApp.</span>
      </h1>

      <p style={{ fontSize: 17, color: 'var(--fg-2)', maxWidth: 640, margin: 0, lineHeight: 1.55 }}>
        Calendario editorial, aprobaciones del cliente y reportes — pensado para agencias de
        marketing argentinas que manejan entre 5 y 50 cuentas. Llevá todo el ciclo, desde la idea
        hasta la publicación, con la prolijidad que tu cliente espera.
      </p>

      <div style={{ display: 'flex', gap: 10, marginTop: 28, alignItems: 'center' }}>
        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '11px 18px',
            fontSize: 14,
            fontWeight: 500,
            color: '#fff',
            borderRadius: 'var(--r-2)',
            border: '1px solid var(--violet-400)',
            background: 'var(--violet-500)',
          }}
        >
          Empezar gratis · 14 días
        </Link>
        <a
          href="#producto"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '11px 18px',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--fg-1)',
            borderRadius: 'var(--r-2)',
            border: '1px solid var(--line-2)',
            background: 'var(--bg-2)',
          }}
        >
          Ver el producto →
        </a>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 24,
          marginTop: 36,
          color: 'var(--fg-3)',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {['Sin tarjeta', 'Hosteado en AR', 'Setup en 10 min'].map((item) => (
          <span key={item}>
            <span style={{ color: 'var(--violet-500)' }}>▸ </span>
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      num: '01 / Calendario',
      title: 'Calendario editorial real',
      desc: 'Mensual, semanal, por cuenta o consolidado. Arrastrá una pieza para reagendarla, duplicála para una serie, marcá feriados argentinos.',
    },
    {
      num: '02 / Aprobaciones',
      title: 'Cliente aprueba en 2 clicks',
      desc: 'Portal limitado para tu cliente. Aprueba, pide cambios o comenta sobre la pieza. Sin emails, sin "te paso por WhatsApp".',
    },
    {
      num: '03 / Equipo',
      title: 'Roles sin fricción',
      desc: 'Director, account, diseñador, copy, cliente. Cada uno ve lo que tiene que ver — ni más, ni menos.',
    },
    {
      num: '04 / Cuentas',
      title: 'Una cuenta, todo el contexto',
      desc: 'Brief, marca, paleta, pauta mensual, links a Drive, contratos. La memoria de la agencia, ordenada.',
    },
    {
      num: '05 / Reportes',
      title: 'Reportes que el cliente entiende',
      desc: 'Métricas reales, sin chamuyo. Generá un PDF mensual con un click — con tu marca, no la nuestra.',
    },
    {
      num: '06 / Integraciones',
      title: 'Donde ya trabajás',
      desc: 'Drive, Notion, Meta Business Suite, WhatsApp Business. Importá briefs, exportá piezas, sin copiar y pegar.',
    },
  ]

  return (
    <section
      id="producto"
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '96px 32px',
        borderTop: '1px solid var(--line-1)',
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: 'var(--violet-400)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 12,
        }}
      >
        Producto
      </div>
      <h2
        style={{
          fontSize: 40,
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
          fontWeight: 600,
          maxWidth: 720,
          margin: '0 0 16px',
        }}
      >
        Lo que tu equipo necesita, sin lo que no.
      </h2>
      <p style={{ color: 'var(--fg-2)', maxWidth: 580, fontSize: 16, margin: 0 }}>
        Cinco años escuchando agencias argentinas. Lo construimos para resolver lo que se rompe —
        no para impresionar a un VC.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          background: 'var(--line-1)',
          border: '1px solid var(--line-1)',
          borderRadius: 'var(--r-3)',
          overflow: 'hidden',
          marginTop: 56,
        }}
      >
        {features.map((f) => (
          <div
            key={f.num}
            style={{
              background: 'var(--bg-0)',
              padding: 28,
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: 'var(--fg-3)',
                letterSpacing: '0.06em',
                marginBottom: 16,
              }}
            >
              {f.num}
            </div>
            <h3
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              {f.title}
            </h3>
            <p style={{ color: 'var(--fg-2)', margin: 0, fontSize: 14 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    {
      name: 'Solo',
      price: '$0',
      period: '/ mes',
      desc: 'Para freelancers que arman su primer flujo de cliente.',
      features: ['1 cuenta', 'Calendario y aprobaciones', '1 cliente externo', 'Reportes básicos'],
      cta: 'Empezar',
      featured: false,
    },
    {
      name: 'Estudio',
      price: '$84.000',
      period: '/ mes + IVA',
      desc: 'Para agencias de 3 a 12 personas con cartera activa.',
      features: [
        'Hasta 25 cuentas',
        'Equipo ilimitado',
        'Portal de cliente con tu marca',
        'Reportes en PDF · export Drive',
        'Soporte por WhatsApp',
      ],
      cta: 'Probar 14 días gratis',
      featured: true,
    },
    {
      name: 'Casa',
      price: 'A medida',
      period: '',
      desc: 'Para agencias grandes y holdings. SLA, SSO, infra dedicada.',
      features: ['Cuentas ilimitadas', 'SSO + auditoría', 'Onboarding dedicado', 'SLA 99.9%'],
      cta: 'Hablar con ventas',
      featured: false,
    },
  ]

  return (
    <section
      id="precios"
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '96px 32px',
        borderTop: '1px solid var(--line-1)',
      }}
    >
      <div className="mono" style={{ fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
        Precios
      </div>
      <h2 style={{ fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.1, fontWeight: 600, maxWidth: 720, margin: '0 0 16px' }}>
        Transparente. En pesos.
      </h2>
      <p style={{ color: 'var(--fg-2)', maxWidth: 580, fontSize: 16, margin: 0 }}>
        Sin pricing en dólares "porque queda lindo". Sin escalones que esconden funciones que
        necesitás. Cancelás cuando quieras.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 }}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              background: plan.featured
                ? 'linear-gradient(180deg, rgba(124,58,237,0.08), transparent 50%), var(--bg-1)'
                : 'var(--bg-1)',
              border: `1px solid ${plan.featured ? 'var(--violet-500)' : 'var(--line-1)'}`,
              borderRadius: 'var(--r-3)',
              padding: 28,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.featured ? '0 0 0 1px var(--violet-500), 0 24px 40px -16px var(--violet-glow)' : 'none',
            }}
          >
            {plan.featured && (
              <span
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 24,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: 'var(--violet-500)',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: 'var(--r-1)',
                }}
              >
                Más elegido
              </span>
            )}
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{plan.name}</h3>
            <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', margin: '12px 0 4px' }}>
              {plan.price}{' '}
              <small style={{ fontSize: 13, color: 'var(--fg-3)', fontWeight: 400 }}>{plan.period}</small>
            </div>
            <div style={{ color: 'var(--fg-2)', fontSize: 14, minHeight: 42 }}>{plan.desc}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ fontSize: 13, color: 'var(--fg-2)', display: 'flex', gap: 10 }}>
                  <span className="mono" style={{ color: 'var(--violet-400)' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '9px 14px',
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 'var(--r-2)',
                border: plan.featured ? '1px solid var(--violet-400)' : '1px solid var(--line-2)',
                background: plan.featured ? 'var(--violet-500)' : 'var(--bg-2)',
                color: plan.featured ? '#fff' : 'var(--fg-1)',
              }}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

function FooterCta() {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: '0 auto 64px',
        padding: '64px 48px',
        background: 'linear-gradient(135deg, var(--bg-1), var(--bg-2))',
        border: '1px solid var(--line-2)',
        borderRadius: 'var(--r-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(60% 80% at 80% 50%, var(--violet-glow), transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative' }}>
        <h3 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.02em', maxWidth: 520 }}>
          Probalo con una de tus cuentas esta semana.
        </h3>
        <p style={{ color: 'var(--fg-2)', margin: '8px 0 0', maxWidth: 520 }}>
          Setup en 10 minutos. Sin tarjeta. Si no te convence, te ayudamos a exportar todo.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 18px', fontSize: 14, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)' }}>
          Ver demo
        </Link>
        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '11px 18px', fontSize: 14, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)' }}>
          Empezar gratis →
        </Link>
      </div>
    </div>
  )
}

export function Landing() {
  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <NavBar />
      <Hero />
      <Features />
      <Pricing />
      <FooterCta />
      <footer
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 32,
          borderTop: '1px solid var(--line-1)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 32,
          color: 'var(--fg-3)',
          fontSize: 12,
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div>© 2026 MMA · Hecho en Buenos Aires</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Privacidad', 'Términos', 'Estado', 'Contacto'].map((l) => (
            <a key={l} href="#" style={{ color: 'var(--fg-3)' }}>
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
