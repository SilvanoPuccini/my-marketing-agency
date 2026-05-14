import { useState } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { mkInitials } from '@/lib/utils'

const panel: React.CSSProperties = {
  background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)',
}
const panelH: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '14px 18px', borderBottom: '1px solid var(--line-1)',
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: 13,
  background: 'var(--bg-2)', border: '1px solid var(--line-2)',
  borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none',
  boxSizing: 'border-box',
}

function useUpdateClientName() {
  const { user, setUser } = useAuthStore()
  return useMutation({
    mutationFn: async (full_name: string) => {
      const { error } = await supabase
        .from('users')
        .update({ full_name })
        .eq('id', user!.id)
      if (error) throw error
    },
    onSuccess: (_, full_name) => {
      if (user) {
        setUser({ ...user, full_name, initials: mkInitials(full_name) })
      }
      toast.success('Nombre actualizado')
    },
    onError: () => toast.error('No se pudo actualizar el nombre'),
  })
}

function useChangePassword() {
  return useMutation({
    mutationFn: async ({ current, next }: { current: string; next: string }) => {
      // Verify current password by re-authenticating
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser?.email) throw new Error('No se pudo verificar el usuario')

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password: current,
      })
      if (signInError) throw new Error('La contraseña actual es incorrecta')

      const { error } = await supabase.auth.updateUser({ password: next })
      if (error) throw error
    },
    onSuccess: () => toast.success('Contraseña actualizada'),
    onError: (e: Error) => toast.error(e.message),
  })
}

export function ClientProfile() {
  const { user } = useAuthStore()
  const updateName = useUpdateClientName()
  const changePassword = useChangePassword()

  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState(user?.full_name ?? '')

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')

  if (!user) return null

  function handleSaveName() {
    const trimmed = name.trim()
    if (trimmed.length < 2) return toast.error('El nombre debe tener al menos 2 caracteres')
    updateName.mutate(trimmed, { onSuccess: () => setEditingName(false) })
  }

  function handleChangePassword() {
    if (!currentPw) return toast.error('Ingresá tu contraseña actual')
    if (newPw.length < 6) return toast.error('La nueva contraseña debe tener al menos 6 caracteres')
    if (newPw !== confirmPw) return toast.error('Las contraseñas no coinciden')
    changePassword.mutate(
      { current: currentPw, next: newPw },
      { onSuccess: () => { setCurrentPw(''); setNewPw(''); setConfirmPw('') } },
    )
  }

  return (
    <div style={{ padding: '32px', maxWidth: 640, margin: '0 auto' }}>
      <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
        Mi perfil
      </h2>
      <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 28px' }}>
        Administrá tu información personal y contraseña.
      </p>

      {/* Profile info */}
      <section style={{ ...panel, marginBottom: 16 }}>
        <div style={panelH}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Información personal</h3>
          {!editingName && (
            <button
              onClick={() => { setName(user.full_name); setEditingName(true) }}
              style={{ padding: '4px 10px', fontSize: 12, color: 'var(--violet-400)', background: 'transparent', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', cursor: 'pointer' }}
            >
              Editar
            </button>
          )}
        </div>
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 999,
              background: 'linear-gradient(135deg, var(--violet-500), var(--violet-600))',
              display: 'grid', placeItems: 'center',
              color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18,
            }}>
              {user.initials}
            </div>
            <div>
              {editingName ? (
                <div className="client-profile-name-edit" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ ...inputStyle, width: 240 }}
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={updateName.isPending}
                    style={{ padding: '8px 12px', fontSize: 12, color: '#fff', background: 'var(--violet-500)', border: '1px solid var(--violet-400)', borderRadius: 'var(--r-2)', cursor: 'pointer' }}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    style={{ padding: '8px 12px', fontSize: 12, color: 'var(--fg-2)', background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{user.full_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{user.email}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Change password */}
      <section style={panel}>
        <div style={panelH}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Cambiar contraseña</h3>
        </div>
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>Contraseña actual</label>
            <input
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>Nueva contraseña</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              style={inputStyle}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--fg-3)', marginBottom: 4 }}>Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <button
              onClick={handleChangePassword}
              disabled={changePassword.isPending || !currentPw || !newPw}
              style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 500,
                color: '#fff', borderRadius: 'var(--r-2)',
                border: '1px solid var(--violet-400)',
                background: changePassword.isPending ? 'var(--violet-600)' : 'var(--violet-500)',
                cursor: changePassword.isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {changePassword.isPending ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
