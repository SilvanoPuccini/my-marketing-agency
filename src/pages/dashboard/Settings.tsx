import { useState, useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { TopBar } from '@/components/layout/TopBar'
import { useAgencySettings, useUpdateAgency } from '@/features/settings/hooks/useAgencySettings'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'

// ── Types ─────────────────────────────────────────────────────────────────────
type NotifKey = 'piece_approved' | 'piece_rejected' | 'new_comment' | 'daily_summary' | 'monthly_report'

type Form = {
  name:          string
  timezone:      string
  language:      string
  brand_color:   string
  show_mma_logo: boolean
  greeting:      string
  notifications: Record<NotifKey, boolean>
}

const DEFAULT_FORM: Form = {
  name:          '',
  timezone:      'America/Argentina/Buenos_Aires',
  language:      'es-AR',
  brand_color:   '#5B21B6',
  show_mma_logo: false,
  greeting:      '',
  notifications: {
    piece_approved: true,
    piece_rejected: true,
    new_comment:    true,
    daily_summary:  true,
    monthly_report: false,
  },
}

// ── Constants ─────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  { group: 'Estudio', items: [
    { key: 'general',  label: 'General' },
    { key: 'brand',    label: 'Marca y portales' },
    { key: 'notif',    label: 'Notificaciones' },
  ]},
  { group: 'Avanzado', items: [
    { key: 'seguridad', label: 'Seguridad' },
    { key: 'soporte', label: 'Soporte' },
    { key: 'export', label: 'Exportar datos' },
    { key: 'zona',   label: 'Zona peligrosa', danger: true },
  ]},
]

const BRAND_COLORS = ['#7C3AED', '#5B21B6', '#3B82F6', '#0EA5E9', '#10B981', '#EF4444', '#FAFAFA']

const NOTIFICATIONS: { key: NotifKey; label: string; desc: string }[] = [
  { key: 'piece_approved', label: 'Pieza aprobada por cliente',  desc: 'Notificar a la account asignada.'      },
  { key: 'piece_rejected', label: 'Pieza rechazada por cliente', desc: 'Notificar a account + diseñador.'      },
  { key: 'new_comment',    label: 'Comentario nuevo del cliente', desc: 'Notificar al asignado de la pieza.'   },
  { key: 'daily_summary',  label: 'Resumen diario 09:00',        desc: 'Estado del calendario del día.'        },
  { key: 'monthly_report', label: 'Reporte mensual',             desc: 'Cada cliente recibe el PDF el día 1.' },
]

// ── Sub-components ────────────────────────────────────────────────────────────
function Switch({ on, onChange }: { on: boolean; onChange?: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 36, height: 20, borderRadius: 999,
        background: on ? 'var(--violet-500)' : 'var(--bg-3)',
        position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 120ms',
      }}
    >
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
    <div className="settings-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
      <div>
        <div style={{ fontWeight: 500, fontSize: 13 }}>{label}</div>
        <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>{desc}</div>
      </div>
      {children}
      <div>{action}</div>
    </div>
  )
}

export function ComingSoon({ title, desc }: { title: string; desc: string }) {
  return (
    <>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{title}</h3>
        <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>{desc}</p>
      </div>
      <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-3)', border: '1px solid var(--line-2)', borderRadius: 999, padding: '4px 12px', fontSize: 11, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--fg-3)' }}>
          Próximamente
        </span>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--fg-3)' }}>Esta función estará disponible en la próxima versión.</p>
      </div>
    </>
  )
}

const sec: React.CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-1)',
  borderRadius: 'var(--r-3)', marginBottom: 16,
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px', fontSize: 13, background: 'var(--bg-2)',
  border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)',
  color: 'var(--fg-1)', outline: 'none',
}

// ── Component ─────────────────────────────────────────────────────────────────
export function Settings() {
  const { data: agency, isLoading } = useAgencySettings()
  const updateAgency = useUpdateAgency()
  const qc = useQueryClient()

  const [form, setForm]               = useState<Form>(DEFAULT_FORM)
  const [saved, setSaved]             = useState<Form>(DEFAULT_FORM)
  const [active, setActive]           = useState('general')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Initialize form when agency data loads
  useEffect(() => {
    if (!agency) return
    const s = agency.settings ?? {}
    const f: Form = {
      name:          agency.name,
      timezone:      s.timezone      ?? 'America/Argentina/Buenos_Aires',
      language:      s.language      ?? 'es-AR',
      brand_color:   s.brand_color   ?? '#5B21B6',
      show_mma_logo: s.show_mma_logo ?? false,
      greeting:      s.greeting      ?? `Hola — esta es tu mesa de trabajo en ${agency.name}.`,
      notifications: {
        piece_approved: s.notifications?.piece_approved ?? true,
        piece_rejected: s.notifications?.piece_rejected ?? true,
        new_comment:    s.notifications?.new_comment    ?? true,
        daily_summary:  s.notifications?.daily_summary  ?? true,
        monthly_report: s.notifications?.monthly_report ?? false,
      },
    }
    setForm(f)
    setSaved(f)
    // Load existing logo
    if (s.logo_url) setLogoUrl(s.logo_url)
  }, [agency])

  const isDirty = JSON.stringify(form) !== JSON.stringify(saved)

  const workspaceSlug = form.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'tu-agencia'

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleNotif(key: NotifKey) {
    setForm(f => ({ ...f, notifications: { ...f.notifications, [key]: !f.notifications[key] } }))
  }

  function handleSave() {
    const { name, ...settings } = form
    updateAgency.mutate({ name, settings }, { onSuccess: () => setSaved(form) })
  }

  function handleDiscard() {
    setForm(saved)
  }

  function goTo(id: string) {
    setActive(id)
  }

  async function handleChangePassword() {
    if (!pwForm.current) { toast.error('Ingresá tu contraseña actual'); return }
    if (pwForm.next.length < 6) { toast.error('La nueva contraseña debe tener al menos 6 caracteres'); return }
    if (pwForm.next !== pwForm.confirm) { toast.error('Las contraseñas no coinciden'); return }
    setPwLoading(true)
    // Verify current password by re-signing in
    const { user } = useAuthStore.getState()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? '',
      password: pwForm.current,
    })
    if (signInError) {
      setPwLoading(false)
      toast.error('La contraseña actual es incorrecta')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: pwForm.next })
    setPwLoading(false)
    if (error) {
      if (error.message.includes('same_password') || error.message.includes('same password')) {
        toast.error('Elegí una contraseña diferente a la anterior.')
      } else {
        toast.error(error.message)
      }
      return
    }
    toast.success('Contraseña actualizada')
    setPwForm({ current: '', next: '', confirm: '' })
  }

  async function handleLogoUpload(file: File) {
    if (!agency) return
    if (file.size > 2 * 1024 * 1024) { toast.error('El archivo no puede superar 2 MB'); return }
    if (!file.type.startsWith('image/')) { toast.error('Solo se permiten imágenes (PNG, SVG, JPG)'); return }
    setLogoUploading(true)
    const ext = file.name.split('.').pop() ?? 'png'
    const path = `${agency.id}/logo.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(path, file, { upsert: true })
    if (uploadError) {
      setLogoUploading(false)
      toast.error('Error al subir el logo: ' + uploadError.message)
      return
    }
    const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path)
    const publicUrl = urlData.publicUrl + '?t=' + Date.now()
    // Save logo_url in agency settings
    const newSettings = { ...(agency.settings ?? {}), logo_url: publicUrl }
    await supabase.from('agencies').update({ settings: newSettings }).eq('id', agency.id)
    setLogoUrl(publicUrl)
    setLogoUploading(false)
    qc.invalidateQueries({ queryKey: ['agency'] })
    toast.success('Logo actualizado')
  }

  async function handleExportCSV() {
    const tid = toast.loading('Preparando exportación…')
    try {
      const { data, error } = await supabase
        .from('pieces')
        .select('title, type, status, platform, scheduled_date, scheduled_time, has_pauta, pauta_amount, accounts(name)')
        .order('scheduled_date', { ascending: false })
      if (error) throw error
      const header = 'Título,Tipo,Estado,Plataforma,Fecha,Hora,Tiene Pauta,Monto Pauta,Cuenta'
      const rows = (data ?? []).map(p => {
        const acc = p.accounts as { name: string } | null
        return [
          `"${p.title.replace(/"/g, '""')}"`,
          p.type, p.status, p.platform ?? '',
          p.scheduled_date, p.scheduled_time ?? '',
          p.has_pauta ? 'Sí' : 'No',
          p.pauta_amount ?? '',
          `"${(acc?.name ?? '').replace(/"/g, '""')}"`,
        ].join(',')
      })
      const csv = '\uFEFF' + [header, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `piezas-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('CSV descargado', { id: tid })
    } catch {
      toast.error('Error al exportar', { id: tid })
    }
  }

  // ── Export: Cuentas-cliente ───────────────────────────────────────────────
  async function handleExportAccountsCSV() {
    const tid = toast.loading('Preparando exportación…')
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('name, industry, contact_name, contact_email, contact_phone, plan, is_active, created_at')
        .order('name', { ascending: true })
      if (error) throw error
      const header = 'Nombre,Rubro,Contacto,Email,Teléfono,Plan,Activa,Alta'
      const rows = (data ?? []).map(a => [
        `"${a.name.replace(/"/g, '""')}"`,
        a.industry ?? '',
        `"${(a.contact_name ?? '').replace(/"/g, '""')}"`,
        a.contact_email ?? '',
        a.contact_phone ?? '',
        a.plan ?? '',
        a.is_active ? 'Sí' : 'No',
        a.created_at ? a.created_at.split('T')[0] : '',
      ].join(','))
      const csv = '\uFEFF' + [header, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cuentas-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('CSV de cuentas descargado', { id: tid })
    } catch {
      toast.error('Error al exportar cuentas', { id: tid })
    }
  }

  // ── Export: Equipo ────────────────────────────────────────────────────────
  async function handleExportTeamCSV() {
    const tid = toast.loading('Preparando exportación…')
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, email, role, position, is_active, created_at')
        .order('full_name', { ascending: true })
      if (error) throw error
      const header = 'Nombre,Email,Rol,Cargo,Activo,Alta'
      const rows = (data ?? []).map(u => [
        `"${u.full_name.replace(/"/g, '""')}"`,
        u.email,
        u.role,
        `"${(u.position ?? '').replace(/"/g, '""')}"`,
        u.is_active ? 'Sí' : 'No',
        u.created_at ? u.created_at.split('T')[0] : '',
      ].join(','))
      const csv = '\uFEFF' + [header, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `equipo-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('CSV del equipo descargado', { id: tid })
    } catch {
      toast.error('Error al exportar equipo', { id: tid })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={[agency?.name ?? 'Mi agencia', 'Ajustes']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDiscard}
              disabled={!isDirty || updateAgency.isPending}
              style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid transparent', background: 'transparent', cursor: isDirty ? 'pointer' : 'default', opacity: isDirty ? 1 : 0.4 }}
            >
              Descartar
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || updateAgency.isPending || isLoading}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: isDirty ? 'pointer' : 'default', opacity: isDirty ? 1 : 0.5 }}
            >
              {updateAgency.isPending ? 'Guardando…' : isDirty ? '● Guardar cambios' : 'Guardar cambios'}
            </button>
          </div>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Ajustes del estudio</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
            Configuración general de {form.name || agency?.name || 'tu agencia'}.
          </p>
        </div>

        <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>

          {/* ── Side nav ── */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 76, alignSelf: 'start', minHeight: 'fit-content' }}>
            {NAV_SECTIONS.map((section) => (
              <div key={section.group}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 8px 6px' }}>
                  {section.group}
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => goTo(item.key)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '7px 10px', fontSize: 13,
                      color: (item as { danger?: boolean }).danger ? 'var(--status-rejected)' : active === item.key ? 'var(--fg-1)' : 'var(--fg-2)',
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

          {/* ── Sections ── */}
          <div>

            {/* General */}
            {active === 'general' && <section style={sec} id="general">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>General</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Identidad básica del estudio.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <RowI label="Nombre del estudio" desc="Visible para tu equipo y en facturas.">
                  <input
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder={isLoading ? 'Cargando…' : 'Nombre de tu agencia'}
                    style={inputStyle}
                  />
                </RowI>

                <RowI label="URL del workspace" desc="Sub‑dominio para acceder al panel.">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      readOnly
                      value={workspaceSlug}
                      title="Derivado del nombre de la agencia"
                      style={{ ...inputStyle, color: 'var(--fg-3)', cursor: 'default' }}
                    />
                    <span className="mono" style={{ fontSize: 12, color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>.mymarketing.com.ar</span>
                  </div>
                </RowI>

                <RowI label="Zona horaria" desc="Usada en calendarios y reportes.">
                  <select value={form.timezone} onChange={(e) => set('timezone', e.target.value)} style={inputStyle}>
                    <option value="America/Argentina/Buenos_Aires">America/Argentina/Buenos_Aires (UTC−3)</option>
                    <option value="America/Argentina/Cordoba">America/Argentina/Cordoba</option>
                    <option value="America/Argentina/Mendoza">America/Argentina/Mendoza</option>
                    <option value="America/Argentina/Salta">America/Argentina/Salta</option>
                  </select>
                </RowI>

                <RowI label="Idioma por defecto" desc="Para nuevos miembros y clientes.">
                  <select value={form.language} onChange={(e) => set('language', e.target.value)} style={inputStyle}>
                    <option value="es-AR">Español (Argentina) · vos</option>
                    <option value="es">Español (neutro) · tú</option>
                    <option value="en">English</option>
                  </select>
                </RowI>
              </div>
            </section>}

            {/* Marca y portales */}
            {active === 'brand' && <section style={sec} id="brand">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Marca y portales de cliente</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Cómo ven los clientes su portal y los reportes en PDF.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <RowI label="Logo" desc="PNG o SVG, máx 2 MB.">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" style={{ width: 56, height: 56, borderRadius: 'var(--r-2)', objectFit: 'contain', background: 'var(--bg-2)', border: '1px solid var(--line-2)' }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: 'var(--r-2)', background: `linear-gradient(135deg, ${form.brand_color}, var(--violet-600))`, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {form.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'EP'}
                      </div>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/svg+xml,image/jpeg,image/webp"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleLogoUpload(file)
                        e.target.value = ''
                      }}
                    />
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      disabled={logoUploading}
                      style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: logoUploading ? 'not-allowed' : 'pointer', opacity: logoUploading ? 0.5 : 1 }}
                    >
                      {logoUploading ? 'Subiendo…' : 'Subir nuevo'}
                    </button>
                  </div>
                </RowI>

                <RowI label="Color de marca" desc="Acento en el portal de cliente y en los PDF.">
                  <div style={{ display: 'flex', gap: 8 }}>
                    {BRAND_COLORS.map((c) => (
                      <div
                        key={c}
                        onClick={() => set('brand_color', c)}
                        style={{
                          width: 28, height: 28, borderRadius: 6, background: c,
                          border: '1px solid var(--line-2)', cursor: 'pointer',
                          boxShadow: form.brand_color === c ? '0 0 0 2px var(--bg-0), 0 0 0 4px var(--violet-500)' : 'none',
                          transition: 'box-shadow 120ms',
                        }}
                      />
                    ))}
                  </div>
                </RowI>

                <RowI
                  label="Mostrar logo de MMA"
                  desc='"Powered by MMA" al pie del portal.'
                  action={<Switch on={form.show_mma_logo} onChange={() => set('show_mma_logo', !form.show_mma_logo)} />}
                >
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>
                    {form.show_mma_logo ? 'On — los clientes verán nuestra marca.' : 'Off — los clientes no verán nuestra marca.'}
                  </span>
                </RowI>

                <RowI label="Saludo por defecto" desc="Aparece arriba del portal de cada cliente.">
                  <input
                    value={form.greeting}
                    onChange={(e) => set('greeting', e.target.value)}
                    placeholder="Ej: Hola — bienvenido a tu mesa de trabajo."
                    style={{ ...inputStyle, width: '100%' }}
                  />
                </RowI>
              </div>
            </section>}

            {/* Notificaciones */}
            {active === 'notif' && <section style={sec} id="notif">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Notificaciones</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Qué te avisamos por email — cada persona puede sobrescribir esto desde su perfil.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.key} style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{n.label}</div>
                      <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>{n.desc}</div>
                    </div>
                    <div />
                    <Switch on={form.notifications[n.key]} onChange={() => toggleNotif(n.key)} />
                  </div>
                ))}
              </div>
            </section>}

            {/* Seguridad */}
            {active === 'seguridad' && <section style={sec} id="seguridad">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Seguridad</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Cambiar tu contraseña de acceso.</p>
              </div>
              <div style={{ padding: '18px 20px', maxWidth: 400 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={pwForm.current}
                      onChange={(e) => setPwForm(p => ({ ...p, current: e.target.value }))}
                      placeholder="Tu contraseña actual"
                      style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ height: 1, background: 'var(--line-1)', margin: '4px 0' }} />
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={pwForm.next}
                      onChange={(e) => setPwForm(p => ({ ...p, next: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 6, fontWeight: 500 }}>
                      Repetir nueva contraseña
                    </label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="Repetí la contraseña"
                      style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={pwLoading || !pwForm.current || !pwForm.next || !pwForm.confirm}
                    style={{
                      padding: '9px 14px', fontSize: 13, fontWeight: 500,
                      color: '#fff', borderRadius: 'var(--r-2)',
                      border: '1px solid var(--violet-400)', background: 'var(--violet-500)',
                      cursor: pwLoading ? 'not-allowed' : 'pointer',
                      opacity: pwLoading || !pwForm.current || !pwForm.next || !pwForm.confirm ? 0.5 : 1,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {pwLoading ? 'Guardando…' : 'Cambiar contraseña'}
                  </button>
                </div>
              </div>
            </section>}

            {/* Soporte */}
            {active === 'soporte' && <section style={sec} id="soporte">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Soporte</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Contactá al equipo de MMA directamente desde acá.</p>
              </div>
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="settings-support-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 16 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>Soporte técnico</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10 }}>Problemas con la plataforma, errores o consultas técnicas.</div>
                    <a href="mailto:soporte@mma.app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', textDecoration: 'none', cursor: 'pointer' }}>
                      Enviar email
                    </a>
                  </div>
                  <div style={{ background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 16 }}>
                    <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 4 }}>Ventas y planes</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 10 }}>Upgrades, planes personalizados o preguntas sobre facturación.</div>
                    <a href="mailto:ventas@mma.app" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-3)', textDecoration: 'none', cursor: 'pointer' }}>
                      Enviar email
                    </a>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
                  Tiempo de respuesta: menos de 24 h hábiles · Lun a Vie · ART (UTC−3)
                </div>
              </div>
            </section>}

            {/* Exportar datos */}
            {active === 'export' && <section style={sec} id="export">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Exportar datos</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Descargá toda la información de tu agencia en formatos abiertos.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>

                {/* Piezas CSV — existente */}
                <div className="settings-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>Piezas — CSV</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>Todas las piezas con estado, fecha y cuenta.</div>
                  </div>
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Todas las piezas · formato UTF-8</span>
                  <button
                    onClick={handleExportCSV}
                    style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                  >
                    Descargar CSV
                  </button>
                </div>

                {/* Cuentas-cliente CSV — nuevo */}
                <div className="settings-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>Cuentas-cliente — CSV</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>Todas las cuentas con contacto, plan y estado.</div>
                  </div>
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Todas las cuentas · formato UTF-8</span>
                  <button
                    onClick={handleExportAccountsCSV}
                    style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                  >
                    Descargar CSV
                  </button>
                </div>

                {/* Equipo CSV — nuevo */}
                <div className="settings-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>Equipo — CSV</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>Miembros del equipo con rol, cargo y estado.</div>
                  </div>
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Todos los miembros · formato UTF-8</span>
                  <button
                    onClick={handleExportTeamCSV}
                    style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                  >
                    Descargar CSV
                  </button>
                </div>

                {/* Backup completo — existente */}
                <div className="settings-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>Backup completo</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>Piezas, cuentas y equipo en un ZIP.</div>
                  </div>
                  <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>Todas las tablas</span>
                  <button
                    onClick={() => toast.info('Backup completo disponible próximamente')}
                    style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                  >
                    Próximamente
                  </button>
                </div>

              </div>
            </section>}

            {/* Zona peligrosa */}
            {active === 'zona' && <section style={{ ...sec, borderColor: 'rgba(239,68,68,0.3)' }} id="zona">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(239,68,68,0.3)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--status-rejected)' }}>Zona peligrosa</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--fg-3)', fontSize: 12 }}>Acciones irreversibles. Pensálo dos veces.</p>
              </div>
              <div style={{ padding: '18px 20px' }}>

                {/* Transferir */}
                <div className="settings-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>Transferir titularidad del estudio</div>
                    <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>Pasar la propiedad a otro miembro con rol Admin.</div>
                  </div>
                  <div />
                  <button
                    onClick={() => toast.info('Para transferir la titularidad contactá a soporte: hola@mymarketing.com.ar')}
                    style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                  >
                    Transferir
                  </button>
                </div>

                {/* Eliminar */}
                <div style={{ padding: '10px 0' }}>
                  <div className="settings-row" style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: 18, alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--status-rejected)' }}>Eliminar el estudio</div>
                      <div style={{ color: 'var(--fg-3)', fontSize: 12, marginTop: 2 }}>Borra todas las cuentas, piezas y portales. No se puede recuperar.</div>
                    </div>
                    <div />
                    <button
                      onClick={() => { setShowDeleteConfirm(true); setDeleteInput('') }}
                      style={{ padding: '6px 10px', fontSize: 12, color: 'var(--status-rejected)', borderRadius: 'var(--r-2)', border: '1px solid rgba(239,68,68,0.3)', background: 'var(--bg-2)', cursor: 'pointer' }}
                    >
                      Eliminar estudio
                    </button>
                  </div>

                  {showDeleteConfirm && (
                    <div style={{ marginTop: 16, padding: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--r-2)' }}>
                      <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--fg-1)' }}>
                        Esta acción es <strong>irreversible</strong>. Escribí <strong style={{ fontFamily: 'var(--font-mono)' }}>{form.name}</strong> para confirmar:
                      </p>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          value={deleteInput}
                          onChange={(e) => setDeleteInput(e.target.value)}
                          placeholder={form.name}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                          onClick={() => {
                            if (deleteInput !== form.name) { toast.error('El nombre no coincide'); return }
                            toast.info('Para eliminar tu agencia, contactá a soporte: soporte@mma.app con el asunto "Eliminar agencia".')
                            setShowDeleteConfirm(false)
                            setDeleteInput('')
                          }}
                          disabled={deleteInput !== form.name}
                          style={{ padding: '8px 14px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid rgba(239,68,68,0.5)', background: deleteInput === form.name ? '#DC2626' : 'var(--bg-3)', cursor: deleteInput === form.name ? 'pointer' : 'not-allowed', transition: 'background 150ms' }}
                        >
                          Confirmar eliminación
                        </button>
                        <button
                          onClick={() => { setShowDeleteConfirm(false); setDeleteInput('') }}
                          style={{ padding: '8px 14px', fontSize: 12, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>}

          </div>
        </div>
      </div>
    </div>
  )
}
