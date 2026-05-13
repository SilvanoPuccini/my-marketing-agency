import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCreateAccount } from '@/features/accounts/hooks/useCreateAccount'
import { AccountForm, type AccountFormValues } from './AccountForm'

interface CreateAccountModalProps {
  onClose: () => void
}

export function CreateAccountModal({ onClose }: CreateAccountModalProps) {
  const createAccount = useCreateAccount()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(values: AccountFormValues) {
    try {
      await createAccount.mutateAsync(values)
      onClose()
    } catch {
      // el error ya se muestra via toast y createAccount.error
    }
  }

  return (
    <>
      <motion.div
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,9,0.72)', zIndex: 40 }}
      />
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: 'min(520px, calc(100vw - 48px))',
          background: 'var(--bg-1)', border: '1px solid var(--line-2)',
          borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)',
          overflow: 'hidden', pointerEvents: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Nueva cuenta</h2>
          <button
            onClick={onClose}
            style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
          >
            <X size={12} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <AccountForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            error={createAccount.isError ? ((createAccount.error as Error)?.message ?? 'No se pudo crear la cuenta.') : null}
          />
        </div>
      </motion.div>
      </div>
    </>
  )
}
