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

export function Privacy() {
  return (
    <div style={wrap}>
      <div style={header}>
        <Link to="/" style={logo}>M</Link>
        <span style={{ fontSize: 14, color: 'var(--fg-3)' }}>Política de Privacidad</span>
      </div>

      <div style={content}>
        <h1 style={h1style}>Política de Privacidad</h1>
        <p style={subtitle}>Última actualización: 1 de mayo de 2026</p>

        <p style={pstyle}>
          En <strong>MMA – My Marketing Agency</strong> ("nosotros", "nuestro", "la Plataforma") nos comprometemos a proteger
          tu privacidad. Esta Política describe qué información recopilamos, cómo la usamos y qué derechos tenés sobre ella.
          Al usar la Plataforma, aceptás las prácticas descritas aquí.
        </p>

        <h2 style={h2style}>1. Responsable del tratamiento</h2>
        <p style={pstyle}>
          El responsable del tratamiento de tus datos personales es <strong>MMA SRL</strong>, con domicilio en
          Ciudad Autónoma de Buenos Aires, Argentina. Podés contactarnos en <strong>privacidad@mma.app</strong>.
        </p>

        <h2 style={h2style}>2. Datos que recopilamos</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={liStyle}><strong>Datos de cuenta:</strong> nombre, dirección de correo electrónico y contraseña (encriptada).</li>
          <li style={liStyle}><strong>Datos de uso:</strong> páginas visitadas, acciones realizadas, tiempos de sesión y dirección IP.</li>
          <li style={liStyle}><strong>Datos de facturación:</strong> nombre en tarjeta, últimos 4 dígitos y país (nunca almacenamos números completos de tarjeta).</li>
          <li style={liStyle}><strong>Contenidos:</strong> textos, imágenes y archivos que subís a la Plataforma.</li>
          <li style={liStyle}><strong>Comunicaciones:</strong> mensajes que nos enviás a través del formulario de contacto o soporte.</li>
        </ul>

        <h2 style={h2style}>3. Cómo usamos tu información</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={liStyle}>Prestarte el servicio y gestionar tu cuenta.</li>
          <li style={liStyle}>Procesar pagos y enviar comprobantes.</li>
          <li style={liStyle}>Enviarte notificaciones relacionadas con el servicio (no publicidad sin consentimiento).</li>
          <li style={liStyle}>Mejorar la Plataforma mediante análisis agregados y anónimos.</li>
          <li style={liStyle}>Cumplir obligaciones legales y resolver disputas.</li>
        </ul>

        <h2 style={h2style}>4. Almacenamiento e infraestructura</h2>
        <p style={pstyle}>
          Los datos se almacenan en <strong>Supabase</strong> (PostgreSQL gestionado), con servidores ubicados en la región
          <strong> US East (N. Virginia)</strong>. Supabase cumple con SOC 2 Type II y cifra los datos en reposo (AES-256)
          y en tránsito (TLS 1.2+). Podés consultar la política de privacidad de Supabase en{' '}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--violet-500)' }}>supabase.com/privacy</a>.
        </p>

        <h2 style={h2style}>5. Cookies y tecnologías similares</h2>
        <p style={pstyle}>
          Usamos cookies estrictamente necesarias para mantener tu sesión activa y cookies analíticas (propias) para entender
          cómo se usa la Plataforma. No usamos cookies de terceros con fines publicitarios. Podés desactivar las cookies
          analíticas desde tu configuración de cuenta en <strong>Ajustes → Privacidad</strong>.
        </p>

        <h2 style={h2style}>6. Compartir datos con terceros</h2>
        <p style={pstyle}>
          No vendemos ni alquilamos tus datos. Podemos compartir información únicamente con:
        </p>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={liStyle}><strong>Supabase</strong> – infraestructura de base de datos y autenticación.</li>
          <li style={liStyle}><strong>Stripe</strong> – procesamiento de pagos.</li>
          <li style={liStyle}><strong>Resend</strong> – envío de correos transaccionales.</li>
          <li style={liStyle}><strong>Autoridades competentes</strong> – cuando la ley lo exija.</li>
        </ul>

        <h2 style={h2style}>7. Retención de datos</h2>
        <p style={pstyle}>
          Conservamos tus datos mientras tu cuenta esté activa. Al cancelar la suscripción, tus datos se eliminan en un plazo
          de 90 días, salvo que la legislación aplicable exija un período mayor.
        </p>

        <h2 style={h2style}>8. Tus derechos</h2>
        <p style={pstyle}>
          De acuerdo con la Ley 25.326 de Protección de Datos Personales (Argentina) y el RGPD (para usuarios de la UE),
          tenés derecho a:
        </p>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          <li style={liStyle}><strong>Acceder</strong> a los datos que tenemos sobre vos.</li>
          <li style={liStyle}><strong>Rectificar</strong> datos inexactos o incompletos.</li>
          <li style={liStyle}><strong>Suprimir</strong> ("derecho al olvido") tus datos personales.</li>
          <li style={liStyle}><strong>Portabilidad</strong> — exportar tus datos en formato estándar.</li>
          <li style={liStyle}><strong>Oponerte</strong> al tratamiento para ciertos fines.</li>
        </ul>
        <p style={pstyle}>
          Para ejercer estos derechos, enviá un correo a <strong>privacidad@mma.app</strong> con el asunto
          "Solicitud de derechos ARCO". Respondemos en un plazo máximo de 30 días hábiles.
        </p>

        <h2 style={h2style}>9. Seguridad</h2>
        <p style={pstyle}>
          Implementamos medidas técnicas y organizativas razonables: cifrado TLS en todas las comunicaciones, acceso con
          principio de mínimo privilegio, auditorías periódicas y autenticación de dos factores (2FA) disponible para todos
          los usuarios.
        </p>

        <h2 style={h2style}>10. Cambios a esta política</h2>
        <p style={pstyle}>
          Podemos actualizar esta política ocasionalmente. Te notificaremos por correo electrónico con al menos 15 días de
          anticipación ante cambios sustanciales. El uso continuado de la Plataforma tras la vigencia del cambio implica
          aceptación.
        </p>

        <h2 style={h2style}>11. Contacto</h2>
        <p style={pstyle}>
          ¿Preguntas sobre privacidad? Escribinos a <strong>privacidad@mma.app</strong> o usá nuestro{' '}
          <Link to="/contacto" style={{ color: 'var(--violet-500)' }}>formulario de contacto</Link>.
        </p>
      </div>
    </div>
  )
}
