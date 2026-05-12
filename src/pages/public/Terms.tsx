import { useEffect } from 'react'
import { Link } from 'react-router-dom'

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

const h1style: React.CSSProperties = {
  fontSize: 28, fontWeight: 700, marginBottom: 8,
}

const subtitle: React.CSSProperties = {
  color: 'var(--fg-3)', fontSize: 13,
  fontFamily: 'var(--font-mono)',
  marginBottom: 48,
}

const h2style: React.CSSProperties = {
  fontSize: 16, fontWeight: 600, marginTop: 40, marginBottom: 12,
}

const pstyle: React.CSSProperties = {
  fontSize: 14, lineHeight: 1.7, color: 'var(--fg-1)', marginBottom: 12,
}

const liStyle: React.CSSProperties = {
  fontSize: 14, lineHeight: 1.7, color: 'var(--fg-1)', marginBottom: 6,
}

export function Terms() {
  return (
    <div style={wrap}>
      <ScrollReset />
      <div style={header}>
        <Link to="/" style={logo}>M</Link>
        <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>Términos y Condiciones</span>
      </div>

      <div style={content}>
        <h1 style={h1style}>Términos y Condiciones</h1>
        <p style={subtitle}>Última actualización: 1 de mayo de 2026</p>

        <p style={pstyle}>
          Estos Términos y Condiciones ("Términos") regulan el acceso y uso de la plataforma
          <strong> MMA – My Marketing Agency</strong> ("Plataforma", "Servicio"), operada por <strong>MMA SRL</strong>.
          Al registrarte o usar el Servicio, aceptás estos Términos en su totalidad. Si no estás de acuerdo,
          no uses la Plataforma.
        </p>

        <h2 style={h2style}>1. Definiciones</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={liStyle}><strong>Cuenta:</strong> acceso registrado a la Plataforma bajo un correo y contraseña.</li>
          <li style={liStyle}><strong>Agencia:</strong> usuario que contrata un plan y gestiona clientes desde el backoffice.</li>
          <li style={liStyle}><strong>Cliente:</strong> usuario invitado por una Agencia para revisar contenidos vía Portal.</li>
          <li style={liStyle}><strong>Contenido:</strong> textos, imágenes, videos y archivos subidos por usuarios.</li>
          <li style={liStyle}><strong>Plan:</strong> nivel de suscripción que determina límites y funcionalidades disponibles.</li>
        </ul>

        <h2 style={h2style}>2. Registro y cuenta</h2>
        <p style={pstyle}>
          Para acceder al backoffice debés tener al menos 18 años y proporcionar información veraz y actualizada.
          Sos responsable de mantener la confidencialidad de tus credenciales y de toda la actividad que ocurra bajo tu cuenta.
          Notificanos de inmediato ante cualquier acceso no autorizado a <strong>soporte@mma.app</strong>.
        </p>

        <h2 style={h2style}>3. Planes y facturación</h2>
        <p style={pstyle}>
          La Plataforma ofrece los siguientes planes de suscripción mensual (precios en ARS + IVA):
        </p>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={liStyle}><strong>Solo</strong> – $36.000/mes + IVA. 1 cuenta de cliente, 2 asientos de equipo, 60 piezas/mes por portal, 1 GB de almacenamiento.</li>
          <li style={liStyle}><strong>Estudio</strong> – $72.000/mes + IVA. 5 cuentas de cliente, 5 asientos de equipo, 80 piezas/mes por portal, 1.6 GB por cuenta.</li>
          <li style={liStyle}><strong>Casa</strong> – $144.000/mes + IVA. 15 cuentas de cliente, 15 asientos de equipo, 160 piezas/mes por portal, 3 GB por cuenta.</li>
        </ul>
        <p style={pstyle}>
          Los precios están expresados en USD e incluyen IVA donde corresponda. La facturación se realiza al inicio
          de cada período. Los cargos no son reembolsables salvo lo dispuesto en la Sección 11.
        </p>

        <h2 style={h2style}>4. Período de prueba</h2>
        <p style={pstyle}>
          Los planes Starter y Pro incluyen 14 días de prueba gratuita. No se requiere tarjeta de crédito durante ese período.
          Al finalizar la prueba, podés suscribirte o la cuenta pasa al modo lectura hasta que elijas un plan.
        </p>

        <h2 style={h2style}>5. Límites de uso</h2>
        <p style={pstyle}>
          Cada plan tiene límites de cuentas de clientes, almacenamiento y llamadas a la API (donde aplique). Si superás
          consistentemente los límites de tu plan te contactaremos para ofrecerte un upgrade. No interrumpiremos el servicio
          sin previo aviso de 7 días.
        </p>

        <h2 style={h2style}>6. Uso permitido</h2>
        <p style={pstyle}>
          Podés usar la Plataforma para gestionar contenido de marketing, aprobar piezas con clientes y colaborar con tu equipo.
          Queda expresamente prohibido:
        </p>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={liStyle}>Usar el Servicio para actividades ilegales, fraudulentas o dañinas.</li>
          <li style={liStyle}>Hacer ingeniería inversa, descompilar o intentar extraer el código fuente.</li>
          <li style={liStyle}>Subir contenido que infrinja derechos de propiedad intelectual de terceros.</li>
          <li style={liStyle}>Intentar acceder a cuentas o datos de otros usuarios.</li>
          <li style={liStyle}>Usar bots o scripts para sobrecargar la infraestructura.</li>
          <li style={liStyle}>Revender o sublicenciar el acceso a la Plataforma sin autorización expresa.</li>
        </ul>

        <h2 style={h2style}>7. Propiedad intelectual</h2>
        <p style={pstyle}>
          La Plataforma, su diseño, código y marca son propiedad de MMA SRL y están protegidos por leyes de propiedad
          intelectual. El Contenido que subís sigue siendo tuyo — nos otorgás únicamente una licencia limitada para
          almacenarlo y mostrarlo dentro del Servicio.
        </p>

        <h2 style={h2style}>8. Privacidad</h2>
        <p style={pstyle}>
          El tratamiento de datos personales se rige por nuestra{' '}
          <Link to="/privacidad" style={{ color: 'var(--violet-500)' }}>Política de Privacidad</Link>,
          que forma parte integral de estos Términos.
        </p>

        <h2 style={h2style}>9. Disponibilidad del servicio</h2>
        <p style={pstyle}>
          Nos comprometemos a mantener una disponibilidad del 99,9% mensual ("SLA"). Los mantenimientos programados se
          anunciarán con al menos 48 horas de anticipación en <Link to="/estado" style={{ color: 'var(--violet-500)' }}>mma.app/estado</Link>.
          En caso de incumplimiento del SLA, podés solicitar un crédito proporcional dentro de los 30 días siguientes.
        </p>

        <h2 style={h2style}>10. Limitación de responsabilidad</h2>
        <p style={pstyle}>
          En la máxima medida permitida por la ley, MMA SRL no será responsable por daños indirectos, incidentales o
          consecuentes. La responsabilidad total de MMA SRL no superará el monto abonado por vos en los últimos 12 meses.
        </p>

        <h2 style={h2style}>11. Cancelación y reembolsos</h2>
        <p style={pstyle}>
          Podés cancelar tu suscripción en cualquier momento desde <strong>Ajustes → Facturación</strong>. La cancelación
          surte efecto al final del período en curso. Para suscripciones anuales, ofrecemos reembolso proporcional durante
          los primeros 30 días desde la contratación si la cancelación se solicita por escrito.
        </p>

        <h2 style={h2style}>12. Terminación de cuenta</h2>
        <p style={pstyle}>
          Podemos suspender o terminar tu cuenta si incumplís estos Términos, sin perjuicio de otras acciones legales.
          Te notificaremos por correo antes de cualquier suspensión, salvo en casos de violación grave o riesgo para
          otros usuarios.
        </p>

        <h2 style={h2style}>13. Modificaciones</h2>
        <p style={pstyle}>
          Podemos actualizar estos Términos. Te notificaremos por correo con 15 días de anticipación ante cambios
          materiales. El uso continuado implica aceptación de los nuevos Términos.
        </p>

        <h2 style={h2style}>14. Ley aplicable y jurisdicción</h2>
        <p style={pstyle}>
          Estos Términos se rigen por las leyes de la República Argentina. Cualquier controversia se somete a los
          tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, con renuncia expresa a cualquier otro fuero.
        </p>

        <h2 style={h2style}>15. Contacto</h2>
        <p style={pstyle}>
          Consultas sobre estos Términos: <strong>legal@mma.app</strong> o{' '}
          <Link to="/contacto" style={{ color: 'var(--violet-500)' }}>formulario de contacto</Link>.
        </p>

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
