import { Link } from 'react-router-dom'

// ── Shared button styles ───────────────────────────────────────────────────────
const btnPrimary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  padding: '9px 16px', fontSize: 13, fontWeight: 500,
  color: '#fff', borderRadius: 'var(--r-2)',
  border: '1px solid var(--violet-400)', background: 'var(--violet-500)',
  cursor: 'pointer',
}
const btnSecondary: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  padding: '9px 16px', fontSize: 13, fontWeight: 500,
  color: 'var(--fg-1)', borderRadius: 'var(--r-2)',
  border: '1px solid var(--line-2)', background: 'var(--bg-2)',
  cursor: 'pointer',
}
const btnPrimaryLg: React.CSSProperties = { ...btnPrimary, padding: '11px 18px', fontSize: 14 }
const btnSecondaryLg: React.CSSProperties = { ...btnSecondary, padding: '11px 18px', fontSize: 14 }

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(12px)', background: 'rgba(10,10,15,0.72)', borderBottom: '1px solid var(--line-1)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 32, padding: '14px 32px' }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: '#fff', boxShadow: '0 0 0 1px var(--violet-400) inset' }}>
            M
          </div>
          <span style={{ fontWeight: 600, letterSpacing: '-0.015em', color: 'var(--fg-1)' }}>My Marketing Agency</span>
        </Link>

        <nav style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
          {[
            { label: 'Producto', href: '#producto' },
            { label: 'Flujo',    href: '#flujo' },
            { label: 'Precios',  href: '#precios' },
            { label: 'Casos',    href: '#casos' },
            { label: 'Cambios',  href: '#cambios' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => {
                e.preventDefault()
                const id = href.replace('#', '')
                const el = document.getElementById(id)
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 70
                  window.scrollTo({ top: y, behavior: 'smooth' })
                }
              }}
              style={{ padding: '6px 12px', fontSize: 13, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', transition: 'color 120ms, background 120ms' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg-1)'; e.currentTarget.style.background = 'var(--bg-2)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-2)'; e.currentTarget.style.background = 'transparent' }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', padding: '4px 8px', border: '1px solid var(--line-2)', borderRadius: 'var(--r-1)' }}>
          ES‑AR
        </span>
        <Link to="/login" style={{ padding: '6px 14px', fontSize: 13, fontWeight: 500, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent' }}>
          Ingresar
        </Link>
        <Link to="/registro" style={{ ...btnPrimary, boxShadow: '0 0 0 1px var(--violet-500), 0 1px 0 rgba(255,255,255,0.12) inset' }}>
          Crear cuenta
        </Link>
      </div>
    </header>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 48px' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--violet-400)', background: 'var(--violet-soft)', border: '1px solid var(--violet-soft)', padding: '4px 10px', borderRadius: 999 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--violet-400)', boxShadow: '0 0 8px var(--violet-400)' }} />
        v2.4 · ahora con flujo de aprobación de cliente
      </span>

      <h1 style={{ margin: '24px 0 18px', fontSize: 64, lineHeight: 1.04, letterSpacing: '-0.035em', fontWeight: 600, maxWidth: 920 }}>
        La operación de tu agencia,{' '}
        <span style={{ background: 'linear-gradient(180deg, var(--violet-400), var(--violet-500))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
          en un solo lugar.
        </span>
        <br />
        <span style={{ color: 'var(--fg-3)' }}>Sin planillas, sin grupos de WhatsApp.</span>
      </h1>

      <p style={{ fontSize: 17, color: 'var(--fg-2)', maxWidth: 640, margin: 0, lineHeight: 1.55 }}>
        Calendario editorial, aprobaciones del cliente y reportes — pensado para agencias de marketing argentinas que manejan entre 5 y 50 cuentas. Llevá todo el ciclo, desde la idea hasta la publicación, con la prolijidad que tu cliente espera.
      </p>

      <div style={{ display: 'flex', gap: 10, marginTop: 28, alignItems: 'center' }}>
        <Link to="/registro" style={btnPrimaryLg}>Crear cuenta</Link>
        <a href="#producto" onClick={(e) => { e.preventDefault(); const el = document.getElementById('producto'); if (el) { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }) } }} style={btnSecondaryLg}>Ver el producto →</a>
      </div>

      <div style={{ display: 'flex', gap: 24, marginTop: 36, color: 'var(--fg-3)', fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {['Planes desde $36.000/mes', 'Hosteado en AR', 'Setup en 10 min'].map((item) => (
          <span key={item}><span style={{ color: 'var(--violet-500)' }}>▸ </span>{item}</span>
        ))}
      </div>
    </section>
  )
}

// ── Product Mock ──────────────────────────────────────────────────────────────
function ProductMock() {
  const CAL_DAYS = [
    { d: '30', muted: true, pills: [] },
    { d: '31', muted: true, pills: [] },
    { d: '01', pills: [{ label: 'Reel apertura', cls: 'draft' }] },
    { d: '02', pills: [{ label: 'Carrusel tips', cls: 'sent' }] },
    { d: '03', pills: [] },
    { d: '04', pills: [] },
    { d: '05', pills: [] },
    { d: '06', pills: [{ label: 'Story menú', cls: 'appr' }] },
    { d: '07', pills: [{ label: 'Post lanzamiento', cls: 'pub' }, { label: 'Reel BTS', cls: 'draft' }] },
    { d: '08', pills: [] },
    { d: '09', pills: [{ label: 'Pieza promo', cls: 'rej' }] },
    { d: '10', pills: [{ label: 'Carrusel', cls: 'sent' }] },
    { d: '11', pills: [] },
    { d: '12', pills: [] },
  ]

  const PILL_COLORS: Record<string, { bg: string; color: string }> = {
    draft: { bg: 'var(--status-draft-bg)',    color: 'var(--status-draft)' },
    sent:  { bg: 'var(--status-sent-bg)',     color: 'var(--status-sent)' },
    appr:  { bg: 'var(--status-approved-bg)', color: 'var(--status-approved)' },
    pub:   { bg: 'var(--status-published-bg)',color: 'var(--status-published)' },
    rej:   { bg: 'var(--status-rejected-bg)', color: 'var(--status-rejected)' },
  }

  return (
    <section style={{ maxWidth: 1200, margin: '24px auto 64px', padding: '0 32px' }}>
      <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.08)', position: 'relative' }}>
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: -1, borderRadius: 14, background: 'linear-gradient(180deg, rgba(124,58,237,0.12), transparent 30%)', pointerEvents: 'none', zIndex: 1 }} />

        {/* Browser bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid var(--line-1)', background: 'var(--bg-1)' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[0,1,2].map(i => <span key={i} style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--bg-4)' }} />)}
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
            app.mymarketing.com.ar / calendario / abril‑2026
          </div>
          <div style={{ width: 48 }} />
        </div>

        {/* App chrome */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 460, background: 'var(--bg-0)' }}>
          {/* Sidebar */}
          <aside style={{ background: 'var(--bg-1)', borderRight: '1px solid var(--line-1)', padding: '14px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 12px', borderBottom: '1px solid var(--line-1)', marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))' }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>MMA</span>
            </div>
            {['Panel', 'Cuentas', 'Calendario', 'Biblioteca', 'Reportes', 'Equipo'].map((item) => {
              const isActive = item === 'Calendario'
              return (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', fontSize: 12, borderRadius: 6, color: isActive ? 'var(--fg-1)' : 'var(--fg-2)', background: isActive ? 'var(--bg-2)' : 'transparent', boxShadow: isActive ? 'inset 2px 0 0 var(--violet-500)' : 'none', marginBottom: 2 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: isActive ? 'var(--violet-500)' : 'var(--fg-4)' }} />
                  {item}
                </div>
              )
            })}
          </aside>

          {/* Main */}
          <main style={{ padding: '16px 18px', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Abril 2026</h4>
                <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>12 PIEZAS · 3 PENDIENTES DE APROBACIÓN</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ padding: '4px 9px', fontSize: 11, borderRadius: 4, background: 'var(--bg-2)', color: 'var(--fg-2)', border: '1px solid var(--line-2)' }}>Filtrar</span>
                <span style={{ padding: '4px 9px', fontSize: 11, borderRadius: 4, background: 'var(--violet-500)', color: '#fff' }}>+ Nueva pieza</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
                <div key={d} className="mono" style={{ fontSize: 9, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 6px' }}>{d}</div>
              ))}
              {CAL_DAYS.map((cell) => (
                <div key={cell.d} style={{ background: cell.muted ? 'transparent' : 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 6, padding: 6, minHeight: 64, display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)' }}>
                  <span style={{ color: 'var(--fg-2)' }}>{cell.d}</span>
                  {cell.pills.map((pill) => (
                    <span key={pill.label} style={{ fontSize: 8.5, padding: '2px 4px', borderRadius: 3, background: PILL_COLORS[pill.cls].bg, color: PILL_COLORS[pill.cls].color, fontFamily: 'var(--font-sans)', fontWeight: 500, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {pill.label}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}

// ── Logos ─────────────────────────────────────────────────────────────────────
function Logos() {
  const agencies = ['Estudio Pampas', 'Plata Comunicación', 'Casa Mate', 'Ñandú Studio', 'Talampaya', 'Buenos Aires Co.']
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px 64px' }}>
      <div className="mono" style={{ textAlign: 'center', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-3)', marginBottom: 24 }}>
        Más de 240 agencias en Argentina ya operan con MMA
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24, alignItems: 'center' }}>
        {agencies.map((name) => (
          <span key={name} style={{ textAlign: 'center', fontWeight: 600, fontSize: 14, letterSpacing: '-0.015em', color: 'var(--fg-3)', opacity: 0.8 }}>
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    { num: '01 / Calendario',   title: 'Calendario editorial real',        desc: 'Mensual, semanal, por cuenta o consolidado. Arrastrá una pieza para reagendarla, duplicála para una serie, marcá feriados argentinos.' },
    { num: '02 / Aprobaciones', title: 'Cliente aprueba en 2 clicks',       desc: 'Portal limitado para tu cliente. Aprueba, pide cambios o comenta sobre la pieza. Sin emails, sin "te paso por WhatsApp".' },
    { num: '03 / Equipo',       title: 'Roles sin fricción',                desc: 'Director, account, diseñador, copy, cliente. Cada uno ve lo que tiene que ver — ni más, ni menos.' },
    { num: '04 / Cuentas',      title: 'Una cuenta, todo el contexto',      desc: 'Brief, marca, paleta, pauta mensual, links a Drive, contratos. La memoria de la agencia, ordenada.' },
    { num: '05 / Reportes',     title: 'Reportes que el cliente entiende',  desc: 'Métricas reales, sin chamuyo. Generá un PDF mensual con un click — con tu marca, no la nuestra.' },
    { num: '06 / Integraciones',title: 'Donde ya trabajás',                 desc: 'Drive, Notion, Meta Business Suite, WhatsApp Business. Importá briefs, exportá piezas, sin copiar y pegar.' },
  ]

  return (
    <section id="producto" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px', borderTop: '1px solid var(--line-1)' }}>
      <div className="mono" style={{ fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Producto</div>
      <h2 style={{ fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.1, fontWeight: 600, maxWidth: 720, margin: '0 0 16px' }}>
        Lo que tu equipo necesita, sin lo que no.
      </h2>
      <p style={{ color: 'var(--fg-2)', maxWidth: 580, fontSize: 16, margin: 0 }}>
        Cinco años escuchando agencias argentinas. Lo construimos para resolver lo que se rompe — no para impresionar a un VC.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--line-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden', marginTop: 56 }}>
        {features.map((f) => (
          <div key={f.num} style={{ background: 'var(--bg-0)', padding: 28, minHeight: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', letterSpacing: '0.06em', marginBottom: 16 }}>{f.num}</div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' }}>{f.title}</h3>
            <p style={{ color: 'var(--fg-2)', margin: 0, fontSize: 14 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Flow ──────────────────────────────────────────────────────────────────────
function Flow() {
  const steps = [
    { num: '01 · Borrador', title: 'Tu equipo arma la pieza',          desc: 'Copy, arte, fecha. Comentarios internos, sin que el cliente vea.',                         active: false },
    { num: '02 · Enviada',  title: 'Cliente recibe la propuesta',       desc: 'Notificación por mail. Vista limpia, sin sidebar de agencia.',                             active: true },
    { num: '03 · Aprobada o con cambios', title: 'Decisión, en contexto', desc: 'El cliente aprueba o anota cambios sobre la pieza misma.',                              active: false },
    { num: '04 · Publicada',title: 'Cierra el ciclo',                   desc: 'Marcás como publicada, queda en el histórico, suma al reporte.',                          active: false },
  ]

  return (
    <section id="flujo" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px', borderTop: '1px solid var(--line-1)', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'start' }}>
      <div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Flujo</div>
        <h2 style={{ fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.1, fontWeight: 600, maxWidth: 720, margin: '0 0 16px' }}>
          De la idea publicada, en un hilo.
        </h2>
        <p style={{ color: 'var(--fg-2)', maxWidth: 580, fontSize: 16, margin: '0 0 32px' }}>
          Cada pieza pasa por cuatro estados claros. Tu cliente sabe en qué está. Tu equipo sabe qué sigue.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--line-2)' }}>
          {steps.map((step) => (
            <div key={step.num} style={{ padding: '16px 0 16px 24px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: -5, top: 24, width: 9, height: 9, borderRadius: 999, background: step.active ? 'var(--violet-500)' : 'var(--bg-3)', border: `1px solid ${step.active ? 'var(--violet-500)' : 'var(--line-3)'}`, boxShadow: step.active ? '0 0 12px var(--violet-glow)' : 'none' }} />
              <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{step.num}</div>
              <h4 style={{ margin: '4px 0 4px', fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{step.title}</h4>
              <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 14 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flow card */}
      <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--line-1)', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Reel — apertura de temporada</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>EMP · LUN 13 ABR · 18:00</div>
          </div>
          <span className="pill pill-sent"><span className="dot" />Enviada</span>
        </div>
        <div style={{ aspectRatio: '4/3', borderRadius: 'var(--r-2)', background: 'repeating-linear-gradient(45deg, var(--bg-2) 0 10px, var(--bg-3) 10px 20px)', display: 'grid', placeItems: 'center', color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid var(--line-1)' }}>
          [ reel · 1080×1920 ]
        </div>
        <p style={{ margin: '14px 0 0', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
          "Volvemos con todo. Nueva carta, mismas brasas. Te esperamos en Palermo, miércoles a sábados desde las 19. #ParrillaPorteña #AperturaDeTemporada"
        </p>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <span style={{ ...btnSecondary, fontSize: 12 }}>Pedir cambios</span>
          <span style={{ ...btnPrimary, fontSize: 12 }}>Aprobar pieza</span>
        </div>
      </div>
    </section>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function Pricing() {
  const plans = [
    { name: 'Solo', price: '$36.000', period: '/ mes + IVA', desc: 'Para freelancers que arman su primer flujo de cliente.', features: ['1 cuenta', 'Calendario y aprobaciones', '1 usuario', 'Reportes básicos'], cta: 'Crear cuenta', featured: false },
    { name: 'Estudio', price: '$72.000', period: '/ mes + IVA', desc: 'Para agencias de 3 a 12 personas con cartera activa.', features: ['Hasta 5 cuentas', '5 usuarios', 'Portal de cliente con tu marca', 'Reportes en PDF · export Drive', 'Soporte por WhatsApp'], cta: 'Crear cuenta', featured: true },
    { name: 'Casa', price: '$144.000', period: '/ mes + IVA', desc: 'Para agencias grandes y holdings. Sin límites.', features: ['Cuentas ilimitadas', 'Usuarios ilimitados', 'Onboarding dedicado', 'Soporte prioritario'], cta: 'Crear cuenta', featured: false },
  ]

  return (
    <section id="precios" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px', borderTop: '1px solid var(--line-1)' }}>
      <div className="mono" style={{ fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Precios</div>
      <h2 style={{ fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.1, fontWeight: 600, maxWidth: 720, margin: '0 0 16px' }}>
        Transparente. En pesos.
      </h2>
      <p style={{ color: 'var(--fg-2)', maxWidth: 580, fontSize: 16, margin: 0 }}>
        Sin pricing en dólares "porque queda lindo". Sin escalones que esconden funciones que necesitás. Cancelás cuando quieras.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 48 }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{ background: plan.featured ? 'linear-gradient(180deg, rgba(124,58,237,0.08), transparent 50%), var(--bg-1)' : 'var(--bg-1)', border: `1px solid ${plan.featured ? 'var(--violet-500)' : 'var(--line-1)'}`, borderRadius: 'var(--r-3)', padding: 28, display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: plan.featured ? '0 0 0 1px var(--violet-500), 0 24px 40px -16px var(--violet-glow)' : 'none' }}>
            {plan.featured && (
              <span style={{ position: 'absolute', top: -10, right: 24, fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', background: 'var(--violet-500)', color: '#fff', padding: '4px 8px', borderRadius: 'var(--r-1)' }}>
                Más elegido
              </span>
            )}
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{plan.name}</h3>
            <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', margin: '12px 0 4px' }}>
              {plan.price}{' '}<small style={{ fontSize: 13, color: 'var(--fg-3)', fontWeight: 400 }}>{plan.period}</small>
            </div>
            <div style={{ color: 'var(--fg-2)', fontSize: 14, minHeight: 42 }}>{plan.desc}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ fontSize: 13, color: 'var(--fg-2)', display: 'flex', gap: 10 }}>
                  <span className="mono" style={{ color: 'var(--violet-400)' }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link to="/registro" style={{ ...(plan.featured ? btnPrimary : btnSecondary), marginTop: 'auto' }}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Casos ─────────────────────────────────────────────────────────────────────
function Casos() {
  return (
    <section id="casos" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px', borderTop: '1px solid var(--line-1)' }}>
      <div className="mono" style={{ fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Casos</div>
      <h2 style={{ fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.1, fontWeight: 600, maxWidth: 720, margin: '0 0 16px' }}>
        Agencias que dejaron las planillas.
      </h2>
      <p style={{ color: 'var(--fg-2)', maxWidth: 580, fontSize: 16, margin: 0 }}>
        Historias reales de equipos que pasaron a operar con MMA — y cómo se notó en las horas y en la facturación.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 1, background: 'var(--line-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden', marginTop: 56 }}>

        {/* Featured case */}
        <div style={{ background: 'radial-gradient(60% 80% at 100% 0%, rgba(124,58,237,0.10), transparent 60%), var(--bg-1)', padding: 36, display: 'flex', flexDirection: 'column', gridRow: 'span 2' }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', gap: 12 }}>
            <span>Estudio Pampas</span><span style={{ color: 'var(--fg-4)' }}>·</span><span>Buenos Aires · 12 personas</span>
          </div>
          <div style={{ marginTop: 24, fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em' }}>
            Cortar los grupos de WhatsApp con clientes — y recuperar 15 horas semanales.
          </div>
          <div style={{ marginTop: 16, fontSize: 24, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--fg-1)', flex: 1 }}>
            <span style={{ color: 'var(--violet-400)' }}>"</span>
            Pasamos de 4 horas semanales por cuenta solo en mensajería, a 20 minutos. Con 18 cuentas activas, eso es una persona entera que ahora hace estrategia.
            <span style={{ color: 'var(--violet-400)' }}>"</span>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--violet-400)' }}>LF</div>
            <div style={{ fontSize: 12, lineHeight: 1.35 }}>
              <b style={{ fontWeight: 600, color: 'var(--fg-1)', display: 'block' }}>Lucía Fernández</b>
              <span style={{ color: 'var(--fg-3)' }}>Directora · Estudio Pampas</span>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, borderTop: '1px dashed var(--line-2)', paddingTop: 16 }}>
            {[{ v: '−72%', l: 'Tiempo en mensajería' }, { v: '+9', l: 'Cuentas nuevas / año' }, { v: '1,4d', l: 'Tiempo de aprobación' }].map(s => (
              <div key={s.l}>
                <div className="mono" style={{ fontSize: 22, fontWeight: 600, color: 'var(--violet-400)', letterSpacing: '-0.02em' }}>{s.v}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div className="mono" style={{ marginTop: 16, fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}>
            Leer caso completo →
          </div>
        </div>

        {/* Case 2 */}
        <div style={{ background: 'var(--bg-0)', padding: 28, display: 'flex', flexDirection: 'column', minHeight: 320 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', gap: 12 }}>
            <span>Plata Comunicación</span><span style={{ color: 'var(--fg-4)' }}>·</span><span>Córdoba · 6</span>
          </div>
          <div style={{ marginTop: 16, fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>El cliente aprueba en el día, no en la semana.</div>
          <div style={{ marginTop: 16, fontSize: 18, lineHeight: 1.4, color: 'var(--fg-1)', flex: 1 }}>
            <span style={{ color: 'var(--violet-400)' }}>"</span>Antes mandaba JPG por mail y rezaba. Ahora ven, comentan y aprueban en una sola pantalla. Cierro el mes el 28, no el 6 del siguiente.<span style={{ color: 'var(--violet-400)' }}>"</span>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--violet-400)' }}>FN</div>
            <div style={{ fontSize: 12, lineHeight: 1.35 }}>
              <b style={{ fontWeight: 600, color: 'var(--fg-1)', display: 'block' }}>Federico Nuñez</b>
              <span style={{ color: 'var(--fg-3)' }}>Director · Plata Comunicación</span>
            </div>
          </div>
        </div>

        {/* Case 3 */}
        <div style={{ background: 'var(--bg-0)', padding: 28, display: 'flex', flexDirection: 'column', minHeight: 320 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', gap: 12 }}>
            <span>Ñandú Studio</span><span style={{ color: 'var(--fg-4)' }}>·</span><span>Rosario · 4</span>
          </div>
          <div style={{ marginTop: 16, fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>Dejamos de perder piezas en Drive.</div>
          <div style={{ marginTop: 16, fontSize: 18, lineHeight: 1.4, color: 'var(--fg-1)', flex: 1 }}>
            <span style={{ color: 'var(--violet-400)' }}>"</span>Cada cuenta tiene su brief, su paleta y su histórico en el mismo lugar. El nuevo del equipo se enchufa el primer día.<span style={{ color: 'var(--violet-400)' }}>"</span>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--bg-3)', border: '1px solid var(--line-2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--violet-400)' }}>SI</div>
            <div style={{ fontSize: 12, lineHeight: 1.35 }}>
              <b style={{ fontWeight: 600, color: 'var(--fg-1)', display: 'block' }}>Sofía Iglesias</b>
              <span style={{ color: 'var(--fg-3)' }}>Lead de diseño · Ñandú</span>
            </div>
          </div>
        </div>

        {/* Stat tiles */}
        {[
          { num: '240+',  lbl: 'Agencias activas en AR', desc: 'De freelancers con 2 cuentas a estudios con 40. La mayoría arranca con una sola cuenta para probar.', from: 'Datos a abril 2026' },
          { num: '18.4k', lbl: 'Piezas publicadas / mes',  desc: 'Reels, posts, carruseles y stories que pasaron por el flujo de aprobación de cliente este mes.',         from: 'Promedio rolling 90 días' },
          { num: '94%',   lbl: 'Renueva el plan al año',   desc: 'Las que no renuevan, casi siempre cerraron la agencia o se mudaron al exterior. Lo decimos sin filtro.',  from: 'Cohortes 2024 + 2025' },
        ].map((tile) => (
          <div key={tile.num} style={{ background: 'var(--bg-0)', padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div className="mono" style={{ fontSize: 36, fontWeight: 600, color: 'var(--violet-400)', letterSpacing: '-0.025em', lineHeight: 1 }}>{tile.num}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 8 }}>{tile.lbl}</div>
            <p style={{ margin: '16px 0 0', fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5, flex: 1 }}>{tile.desc}</p>
            <div className="mono" style={{ marginTop: 16, fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{tile.from}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Cambios ───────────────────────────────────────────────────────────────────
function Cambios() {
  const releases = [
    {
      ver: 'v2.4.1', date: '22 ABR 2026', tag: 'Fix', tagCls: { background: 'var(--status-approved-bg)', color: 'var(--status-approved)' },
      title: 'Arreglos rápidos sobre el flujo de aprobación',
      intro: 'Tres cositas que rompimos sin querer en v2.4 y que ya están corregidas. Si las viste, perdón. Si no las viste, mejor.',
      items: [
        { badge: 'Fix', badgeCls: { background: 'var(--status-approved-bg)', color: 'var(--status-approved)' }, text: <><b>Comentarios duplicados</b> — al pedir cambios desde el portal del cliente, el comentario podía guardarse dos veces si el wifi tartamudeaba.</> },
        { badge: 'Fix', badgeCls: { background: 'var(--status-approved-bg)', color: 'var(--status-approved)' }, text: <><b>Calendario en Safari iOS</b> — las piezas de los días 28–31 quedaban tapadas por el toolbar inferior.</> },
        { badge: 'Fix', badgeCls: { background: 'var(--status-approved-bg)', color: 'var(--status-approved)' }, text: <><b>Export PDF de reportes</b> — los caracteres con tilde se rompían cuando la cuenta tenía ñ.</> },
      ],
    },
    {
      ver: 'v2.4', date: '15 ABR 2026', tag: 'Major', tagCls: { background: 'var(--violet-soft)', color: 'var(--violet-400)' },
      title: 'Nuevo flujo de aprobación de cliente',
      intro: 'El cambio más grande del trimestre. Reescribimos el portal del cliente para que aprobar una pieza sea de verdad un click.',
      items: [
        { badge: 'Nuevo', badgeCls: { background: 'var(--violet-soft)', color: 'var(--violet-400)' }, text: <><b>Decisión grande, contexto al lado.</b> Aprobar / pedir cambios queda fijo en pantalla mientras el cliente lee el copy.</> },
        { badge: 'Nuevo', badgeCls: { background: 'var(--violet-soft)', color: 'var(--violet-400)' }, text: <><b>Atajos de teclado.</b> A aprobar, C cambios, → siguiente pieza.</> },
        { badge: 'Mejora', badgeCls: { background: 'var(--status-sent-bg)', color: 'var(--status-sent)' }, text: <><b>Notificaciones con preview.</b> El cliente ve la pieza antes de hacer click.</> },
        { badge: 'Mejora', badgeCls: { background: 'var(--status-sent-bg)', color: 'var(--status-sent)' }, text: <><b>Historial de versiones</b> visible para el cliente, con tabs v1 / v2 / v3.</> },
      ],
    },
    {
      ver: 'v2.3', date: '31 MAR 2026', tag: 'Minor', tagCls: { background: 'var(--status-sent-bg)', color: 'var(--status-sent)' },
      title: 'Carga del equipo y vista de capacidad',
      intro: 'Para directoras como Lucía: saber de un vistazo quién está al límite y quién puede tomar una pieza más.',
      items: [
        { badge: 'Nuevo',  badgeCls: { background: 'var(--violet-soft)', color: 'var(--violet-400)' },        text: <><b>Panel "Carga del equipo"</b> en el dashboard, con barras por persona y semana.</> },
        { badge: 'Mejora', badgeCls: { background: 'var(--status-sent-bg)', color: 'var(--status-sent)' },    text: <><b>Asignación múltiple</b> de piezas a varios miembros del equipo (copy + diseño + account).</> },
        { badge: 'Interno', badgeCls: { background: 'var(--bg-3)', color: 'var(--fg-3)' },                    text: <>Reescribimos el motor de notificaciones. Nadie debería notarlo, pero todo va más rápido.</> },
      ],
    },
  ]

  return (
    <section id="cambios" style={{ maxWidth: 1200, margin: '0 auto', padding: '96px 32px', borderTop: '1px solid var(--line-1)' }}>
      <div className="mono" style={{ fontSize: 11, color: 'var(--violet-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Cambios</div>
      <h2 style={{ fontSize: 40, letterSpacing: '-0.025em', lineHeight: 1.1, fontWeight: 600, maxWidth: 720, margin: '0 0 16px' }}>
        Cambios recientes.
      </h2>
      <p style={{ color: 'var(--fg-2)', maxWidth: 580, fontSize: 16, margin: 0 }}>
        Lo que entró, lo que mejoramos y lo que rompimos a propósito. Publicamos cada release acá — sin marketing‑speak.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, marginTop: 56, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 96, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { k: 'Versión actual', v: 'v2.4.1' },
            { k: 'Última release', v: '22 ABR 2026' },
            { k: 'Frecuencia',     v: '~CADA 2 SEM.' },
            { k: 'Estado',         v: '● OPERATIVO', green: true },
          ].map(row => (
            <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px dashed var(--line-2)', fontSize: 12 }}>
              <span style={{ color: 'var(--fg-3)' }}>{row.k}</span>
              <span className="mono" style={{ fontSize: 11, color: row.green ? 'var(--status-approved)' : 'var(--fg-1)' }}>{row.v}</span>
            </div>
          ))}

          <div style={{ marginTop: 12, background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: 14, fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--fg-1)', fontSize: 13, marginBottom: 6 }}>Recibí los cambios por mail</div>
            Una vez por mes, lo importante. Sin newsletters de cinco párrafos.
            <input type="email" placeholder="vos@tuestudio.com.ar" style={{ width: '100%', marginTop: 10, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: '8px 10px', color: 'var(--fg-1)', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', padding: 14, fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
            <div style={{ fontWeight: 600, color: 'var(--fg-1)', fontSize: 13, marginBottom: 6 }}>Pedí una feature</div>
            Tenés algo que falta y te haría la vida más fácil. Mandalo, lo leemos.
            <a href="#" style={{ display: 'inline-block', marginTop: 8, color: 'var(--violet-400)', fontSize: 12, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Abrir formulario →
            </a>
          </div>
        </aside>

        {/* Changelog */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {releases.map((r, idx) => (
            <article key={r.ver} style={{ padding: '24px 0', borderBottom: idx < releases.length - 1 ? '1px solid var(--line-1)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <span className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em' }}>{r.ver}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.date}</span>
                <span className="mono" style={{ fontSize: 10, padding: '2px 8px', borderRadius: 'var(--r-1)', textTransform: 'uppercase', letterSpacing: '0.06em', ...r.tagCls }}>{r.tag}</span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em' }}>{r.title}</h3>
              <p style={{ margin: '0 0 16px', color: 'var(--fg-2)', fontSize: 14, lineHeight: 1.55, maxWidth: 640 }}>{r.intro}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {r.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, fontSize: 13.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
                    <span className="mono" style={{ flexShrink: 0, fontSize: 9.5, padding: '2px 6px', borderRadius: 'var(--r-1)', textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'flex-start', marginTop: 1, minWidth: 56, textAlign: 'center', ...item.badgeCls }}>{item.badge}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer CTA ────────────────────────────────────────────────────────────────
function FooterCta() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto 64px', padding: '64px 48px', background: 'linear-gradient(135deg, var(--bg-1), var(--bg-2))', border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(60% 80% at 80% 50%, var(--violet-glow), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <h3 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.02em', maxWidth: 520 }}>Probalo con una de tus cuentas esta semana.</h3>
        <p style={{ color: 'var(--fg-2)', margin: '8px 0 0', maxWidth: 520 }}>Setup en 10 minutos. Si no te convence, te ayudamos a exportar todo a una planilla y listo.</p>
      </div>
      <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
        <Link to="/registro" style={btnSecondaryLg}>Ver demo</Link>
        <Link to="/registro" style={btnPrimaryLg}>Crear cuenta →</Link>
      </div>
    </div>
  )
}

// ── Landing ───────────────────────────────────────────────────────────────────
export function Landing() {
  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh' }}>
      <NavBar />
      <Hero />
      <ProductMock />
      <Logos />
      <Features />
      <Flow />
      <Pricing />
      <Casos />
      <Cambios />
      <FooterCta />
      <footer style={{ maxWidth: 1200, margin: '0 auto', padding: 32, borderTop: '1px solid var(--line-1)', display: 'flex', justifyContent: 'space-between', gap: 32, color: 'var(--fg-3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
        <div>© 2026 MMA · Hecho en Buenos Aires</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {([['Privacidad', '/privacidad'], ['Términos', '/terminos'], ['Estado', '/estado'], ['Contacto', '/contacto']] as const).map(([label, to]) => (
            <Link key={label} to={to} style={{ color: 'var(--fg-3)' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg-1)' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-3)' }}>
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
