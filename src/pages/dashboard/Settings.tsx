import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'

const NAV_SECTIONS = [
  { group: 'Estudio', items: [
    { key: 'general', label: 'General' },
    { key: 'brand', label: 'Marca y portales' },
    { key: 'dominios', label: 'Dominios' },
    { key: 'integ', label: 'Integraciones' },
    { key: 'notif', label: 'Notificaciones' },
  ]},
  { group: 'Acceso', items: [
    { key: 'sso', label: 'SSO y seguridad' },
    { key: 'api', label: 'API y webhooks' },
  ]},
  { group: 'Avanzado', items: [
    { key: 'export', label: 'Exportar datos' },
    { key: 'zona', label: 'Zona peligrosa', danger: true },
  ]},
]

const INTEGRATIONS = [
  { name: 'Google Drive', desc: 'Importar briefs y exportar entregables.', status: 'approved', statusLabel: 'Conectado · lucia@estudiopampas.com.ar', btnLabel: 'Desconectar', btnStyle: 'ghost' },
  { name: 'Meta Business Suite', desc: 'Publicar piezas aprobadas, leer métricas.', status: 'approved', statusLabel: 'Conectado · 14 cuentas', btnLabel: 'Gestionar', btnStyle: 'ghost' },
  { name: 'WhatsApp Business', desc: 'Notificar a clientes cuando hay piezas para aprobar.', status: 'sent', statusLabel: 'Pendiente de verificar', btnLabel: 'Continuar', btnStyle: 'secondary' },
  { name: 'Notion', desc: 'Sincronizar briefs con bases de Notion.', status: null, statusLabel: 'No conectado', btnLabel: 'Conectar', btnStyle: 'secondary' },
  { name: 'Slack', desc: 'Avisos en canales internos.', status: null, statusLabel: 'No conectado', btnLabel: 'Conectar', btnStyle: 'secondary' },
]

const NOTIFICATIONS = [
  { label: 'Pieza aprobada por cliente', desc: 'Notificar a la account asignada.', on: true },
  { label: 'Pieza rechazada por cliente', desc: 'Notificar a account + diseñador.', on: true },
  { label: 'Comentario nuevo del cliente', desc: 'Notificar al asignado de la pieza.', on: true },
  { label: 'Resumen diario 09:00', desc: 'Estado del calendario del día.', on: true },
  { label: 'Reporte mensual', desc: 'Cada cliente recibe el PDF el día 1.', on: false },
]

const BRAND_COLORS = ['#7C3AED', '#5B21B6', '#3B82F6', '#0EA5E9', '#10B981', '#EF4444', '#FAFAFA']

function Switch({ on }: { on: boolean }) {
  return (
    <div style={{
      width: 36, height: 20, borderRadius: 999,
      background: on ? 'var(--violet-500)' : 'var(--bg-3)',
      position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 120ms',
    }}>
      <div style={{
        position: 'absolute', top: 2,
        left: on ? 18 : 2, width: 16, height: 16,
        borderRadius: 999, background: on ? '#fff' : 'var(--fg-2)',
        transition: 'left 120ms',
      }} />
    </div>
  )
}

function RowI({ label, desc, children, action }: { label: string; desc: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{label}</div>
        <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>{desc}</div>
      </div>
      {children}
      <div>{action}</div>
    </div>
  )
}

const sec: React.CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-1)',
  borderRadius: 'var(--r-3)', marginBottom: 16,
}

export function Settings() {
  const [active, setActive] = useState('general')
  const [notifications, setNotifications] = useState(NOTIFICATIONS.map((n) => n.on))
  const [brandColor, setBrandColor] = useState('#5B21B6')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Estudio Pampas', 'Ajustes']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent', cursor: 'pointer' }}>Descartar</button>
            <button style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>Guardar cambios</button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Ajustes del estudio</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>Identidad, marca, integraciones y notificaciones — aplica a todo Estudio Pampas.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
          {/* Side nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 76, alignSelf: 'start' }}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.group}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 8px 6px' }}>
                  {section.group}
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActive(item.key)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '7px 10px', fontSize: 13,
                      color: item.danger ? 'var(--status-rejected)' : active === item.key ? 'var(--fg-1)' : 'var(--fg-2)',
                      borderRadius: 'var(--r-2)', border: 0,
                      background: active === item.key ? 'var(--bg-2)' : 'transparent',
                      boxShadow: active === item.key ? 'inset 2px 0 0 var(--violet-500)' : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div>
            {/* General */}
            <section style={sec} id="general">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>General</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Identidad básica del estudio.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <RowI label="Nombre del estudio" desc="Visible para tu equipo y en facturas.">
                  <input defaultValue="Estudio Pampas" style={{ padding: '8px 10px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }} />
                </RowI>
                <RowI label="URL del workspace" desc="Sub‑dominio para acceder al panel.">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input defaultValue="estudiopampas" style={{ padding: '8px 10px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }} />
                    <span className="mono" style={{ fontSize: 12, color: 'var(--fg-3)' }}>.mymarketing.com.ar</span>
                  </div>
                </RowI>
                <RowI label="Zona horaria" desc="Usada en calendarios y reportes.">
                  <select style={{ padding: '8px 10px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }}>
                    <option>America/Argentina/Buenos_Aires (UTC−3)</option>
                    <option>America/Argentina/Cordoba</option>
                    <option>America/Argentina/Mendoza</option>
                  </select>
                </RowI>
                <RowI label="Idioma por defecto" desc="Para nuevos miembros y clientes.">
                  <select style={{ padding: '8px 10px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }}>
                    <option>Español (Argentina) · vos</option>
                    <option>Español (neutro) · tú</option>
                  </select>
                </RowI>
              </div>
            </section>

            {/* Marca */}
            <section style={sec} id="brand">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Marca y portales de cliente</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Cómo ven los clientes su portal y los reportes en PDF.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <RowI label="Logo" desc="PNG o SVG, máx 2 MB.">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 'var(--r-2)', background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>EP</div>
                    <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Subir nuevo</button>
                    <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent', cursor: 'pointer' }}>Quitar</button>
                  </div>
                </RowI>
                <RowI label="Color de marca" desc="Acento en el portal de cliente y en los PDF.">
                  <div style={{ display: 'flex', gap: 8 }}>
                    {BRAND_COLORS.map((c) => (
                      <div
                        key={c}
                        onClick={() => setBrandColor(c)}
                        style={{
                          width: 28, height: 28, borderRadius: 6, background: c,
                          border: '1px solid var(--line-2)', cursor: 'pointer',
                          boxShadow: brandColor === c ? '0 0 0 2px var(--bg-0), 0 0 0 4px var(--violet-500)' : 'none',
                        }}
                      />
                    ))}
                  </div>
                </RowI>
                <RowI label="Mostrar logo de MMA" desc={'"Powered by MMA" al pie del portal.'}>
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Off — los clientes no verán nuestra marca.</span>
                  <Switch on={false} />
                </RowI>
                <RowI label="Saludo por defecto" desc="Aparece arriba del portal de cada cliente.">
                  <input defaultValue="Hola — esta es tu mesa de trabajo en Estudio Pampas." style={{ width: '100%', padding: '8px 10px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }} />
                </RowI>
              </div>
            </section>

            {/* Integraciones */}
            <section style={sec} id="integ">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Integraciones</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Conectá las herramientas donde ya trabaja tu equipo.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>
                {INTEGRATIONS.map((intg) => (
                  <div key={intg.name} style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{intg.name}</div>
                      <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>{intg.desc}</div>
                    </div>
                    {intg.status ? (
                      <span className={`pill pill-${intg.status}`}><span className="dot" />{intg.statusLabel}</span>
                    ) : (
                      <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{intg.statusLabel}</span>
                    )}
                    <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>
                      {intg.btnLabel}
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Notificaciones */}
            <section style={sec} id="notif">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Notificaciones</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Qué te avisamos por email — cada persona puede sobrescribir esto desde su perfil.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>
                {NOTIFICATIONS.map((n, i) => (
                  <div key={n.label} style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{n.label}</div>
                      <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>{n.desc}</div>
                    </div>
                    <div />
                    <div onClick={() => setNotifications((prev) => prev.map((v, j) => j === i ? !v : v))}>
                      <Switch on={notifications[i]} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Zona peligrosa */}
            <section style={{ ...sec, borderColor: 'rgba(239,68,68,0.3)' }} id="zona">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(239,68,68,0.3)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--status-rejected)' }}>Zona peligrosa</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Acciones irreversibles. Pensálo dos veces.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>Transferir titularidad del estudio</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>Pasar la propiedad a otro miembro con rol Director.</div>
                  </div>
                  <div />
                  <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Transferir</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--status-rejected)' }}>Eliminar el estudio</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>Borra todas las cuentas, piezas y portales. No se puede recuperar.</div>
                  </div>
                  <div />
                  <button style={{ padding: '6px 10px', fontSize: 12, color: 'var(--status-rejected)', borderRadius: 'var(--r-2)', border: '1px solid rgba(239,68,68,0.3)', background: 'var(--bg-2)', cursor: 'pointer' }}>Eliminar estudio</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
