import { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useAuthStore } from '@/stores/auth.store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

const ROLE_LABELS: Record<string, string> = {
  admin_agency: 'Administrador',
  team_member:  'Miembro del equipo',
  client:       'Cliente',
}

const panel: React.CSSProperties = {
  background: 'var(--bg-1)',
  border: '1px solid var(--line-1)',
  borderRadius: 'var(--r-3)',
}

const panelH: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 18px', borderBottom: '1px solid var(--line-1)',
}

function useProfileAccounts(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile-accounts', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_members')
        .select('accounts(id, name)')
        .eq('user_id', userId!)
      if (error) throw error
      return (data ?? []).map((row) => row.accounts as { id: string; name: string } | null).filter(Boolean) as { id: string; name: string }[]
    },
  })
}

function useUpdateProfile() {
  const qc = useQueryClient()
  const { user, setUser } = useAuthStore()
  return useMutation({
    mutationFn: async ({ full_name, position }: { full_name: string; position: string }) => {
      const { error } = await supabase
        .from('users')
        .update({ full_name, position })
        .eq('id', user!.id)
      if (error) throw error
    },
    onSuccess: (_, vars) => {
      if (user) {
        const initials = vars.full_name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
        setUser({ ...user, full_name: vars.full_name, position: vars.position, initials })
      }
      qc.invalidateQueries({ queryKey: ['profile-accounts'] })
    },
  })
}

export function Profile() {
  const { user } = useAuthStore()
  const { data: accounts = [] } = useProfileAccounts(user?.id)
  const updateProfile = useUpdateProfile()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.full_name ?? '')
  const [position, setPosition] = useState(user?.position ?? '')

  if (!user) return null

  function handleSave() {
    updateProfile.mutate(
      { full_name: name.trim(), position: position.trim() },
      { onSuccess: () => setEditing(false) }
    )
  }

  function handleEdit() {
    setName(user!.full_name)
    setPosition(user!.position ?? '')
    setEditing(true)
  }

  const joinYear = new Date(user.created_at).getFullYear()
  const joinMonth = new Date(user.created_at).toLocaleDateString('es-AR', { month: 'short' }).toUpperCase().replace('.', '')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Equipo', user.full_name]}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            {!editing ? (
              <button
                onClick={handleEdit}
                style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
              >
                Editar perfil
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditing(false)}
                  style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={updateProfile.isPending}
                  style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
                >
                  Guardar
                </button>
              </>
            )}
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', padding: '28px 0 24px', borderBottom: '1px solid var(--line-1)', marginBottom: 24 }}>
          <div style={{ width: 88, height: 88, borderRadius: 'var(--r-3)', background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 32, color: '#fff', flexShrink: 0, boxShadow: '0 0 0 1px var(--violet-400) inset' }}>
            {user.initials}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360 }}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre completo"
                  style={{ padding: '9px 12px', fontSize: 18, fontWeight: 600, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none', letterSpacing: '-0.01em' }}
                />
                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Cargo o rol (ej: Account Manager)"
                  style={{ padding: '8px 12px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none' }}
                />
              </div>
            ) : (
              <>
                <h1 style={{ margin: 0, fontSize: 28, letterSpacing: '-0.02em', fontWeight: 600 }}>{user.full_name}</h1>
                <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
                  <span className="pill pill-violet"><span className="dot" />{user.position ?? ROLE_LABELS[user.role] ?? user.role}</span>
                  <span className="pill pill-approved"><span className="dot" />Activo</span>
                  <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>{user.email}</span>
                </div>
                <div className="mono" style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: 'var(--violet-500)' }}>▸</span> DESDE {joinMonth} {joinYear}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: 'var(--violet-500)' }}>▸</span> {accounts.length} CUENTAS
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
          {/* Assigned accounts */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Cuentas asignadas</h3>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{accounts.length}</span>
            </div>
            {accounts.length === 0 && (
              <div style={{ padding: '20px 18px', color: 'var(--fg-3)', fontSize: 13 }}>Sin cuentas asignadas.</div>
            )}
            {accounts.map((a) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--line-1)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                  {a.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')}
                </div>
                <div style={{ fontSize: 13 }}>{a.name}</div>
              </div>
            ))}
          </section>

          {/* Account info */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Mi cuenta</h3>
            </div>
            {[
              { label: 'Email', value: user.email },
              { label: 'Rol', value: ROLE_LABELS[user.role] ?? user.role },
              { label: 'Cargo', value: user.position ?? '—' },
              { label: 'Miembro desde', value: `${joinMonth} ${joinYear}` },
              { label: 'Estado', value: user.is_active ? 'Activo' : 'Inactivo' },
            ].map((kv) => (
              <div key={kv.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid var(--line-1)', fontSize: 13 }}>
                <span style={{ color: 'var(--fg-3)', fontSize: 12 }}>{kv.label}</span>
                <span>{kv.value}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
