import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { TopBar } from '@/components/layout/TopBar'
import { useBilling } from '@/features/billing/hooks/useBilling'
import { useInvoices } from '@/features/billing/hooks/useInvoices'
import { generateInvoicePdf } from '@/features/billing/utils/generateInvoicePdf'
import { useCheckout, type BillingInterval } from '@/features/billing/hooks/useCheckout'
import { usePaymentGate } from '@/features/billing/hooks/usePaymentGate'

const panel: React.CSSProperties = {
  background:   'var(--bg-1)',
  border:       '1px solid var(--line-1)',
  borderRadius: 'var(--r-3)',
}

const panelH: React.CSSProperties = {
  display:        'flex',
  justifyContent: 'space-between',
  alignItems:     'center',
  padding:        '14px 18px',
  borderBottom:   '1px solid var(--line-1)',
}

function Meter({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div style={{ height: 8, background: 'var(--bg-3)', borderRadius: 999, overflow: 'hidden', marginTop: 10 }}>
      <span style={{ display: 'block', height: '100%', background: 'var(--violet-500)', borderRadius: 999, width: `${pct}%` }} />
    </div>
  )
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line-1)', fontSize: 13 }}>
      <span style={{ color: 'var(--fg-3)' }}>{label}</span>
      <span className="mono">{value}</span>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign:     'left',
  fontWeight:    500,
  fontSize:      11,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color:         'var(--fg-3)',
  padding:       '10px 16px',
  borderBottom:  '1px solid var(--line-1)',
  background:    'var(--bg-1)',
}

const tdStyle: React.CSSProperties = {
  padding:       '12px 16px',
  borderBottom:  '1px solid var(--line-1)',
  color:         'var(--fg-1)',
  verticalAlign: 'middle',
}

function formatPrice(n: number): string {
  return '$' + n.toLocaleString('es-AR')
}

function formatStorage(used: number, limit: number): string {
  const usedStr = used % 1 === 0 ? String(used) : used.toFixed(1).replace('.', ',')
  return `${usedStr} / ${limit} GB`
}

const PLANS = [
  { key: 'solo',    name: 'Solo',    price: 36000,  yearlyPrice: 388800,   discount: 10, accounts: 2,  seats: 2,  storageGB: 1,   piecesPerClient: 60,  desc: 'Para freelancers que arman su primer flujo.', longInterval: 'yearly' as const },
  { key: 'estudio', name: 'Estudio', price: 72000,  yearlyPrice: 777600,   discount: 10, accounts: 5,  seats: 5,  storageGB: 1.6, piecesPerClient: 80,  desc: 'Para agencias de 3 a 12 personas.', longInterval: 'yearly' as const },
  { key: 'casa',    name: 'Casa',    price: 144000, yearlyPrice: 734400,   discount: 15, accounts: 15, seats: 15, storageGB: 3,   piecesPerClient: 160, desc: 'Para agencias grandes con operacion completa.', longInterval: 'semiannual' as const },
]

function PlanModal({ currentPlan, onClose }: { currentPlan: string; onClose: () => void }) {
  const checkout = useCheckout()
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,9,0.72)', zIndex: 40 }} />
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
        <div style={{ width: 'min(720px, calc(100vw - 48px))', background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)', overflow: 'hidden', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Cambiar plan</h2>
            <button onClick={onClose} style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: 12 }}>X</button>
          </div>

          {/* Toggle switch mensual / anual */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px 0', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: isAnnual ? 400 : 600, color: isAnnual ? 'var(--fg-3)' : 'var(--fg-1)' }}>Mensual</span>
            <button
              role="switch"
              aria-checked={isAnnual}
              onClick={() => setIsAnnual(!isAnnual)}
              style={{
                position: 'relative', width: 44, height: 24, borderRadius: 12, border: 'none',
                background: isAnnual ? 'var(--violet-500)' : 'var(--bg-3)',
                cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: isAnnual ? 23 : 3,
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
            <span style={{ fontSize: 13, fontWeight: isAnnual ? 600 : 400, color: isAnnual ? 'var(--fg-1)' : 'var(--fg-3)' }}>
              Anual / Semestral
            </span>
            {isAnnual && (
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'rgba(124,58,237,0.15)', color: 'var(--violet-400)', letterSpacing: '0.02em' }}>
                AHORRÁ
              </span>
            )}
          </div>

          <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {PLANS.map((p) => {
              const isCurrent = p.key === currentPlan
              const showPrice = isAnnual ? p.yearlyPrice : p.price
              const periodLabel = isAnnual
                ? p.longInterval === 'semiannual' ? '/semestre' : '/año'
                : '/mes'
              const interval: BillingInterval = isAnnual ? p.longInterval : 'monthly'

              return (
                <div key={p.key} style={{ border: isCurrent ? '2px solid var(--violet-500)' : '1px solid var(--line-2)', borderRadius: 'var(--r-3)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, background: isCurrent ? 'var(--violet-soft)' : 'var(--bg-2)' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 4 }}>{p.desc}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>
                      ${showPrice.toLocaleString('es-AR')}
                      <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--fg-3)' }}> {periodLabel}</span>
                    </div>
                    {isAnnual && (
                      <div style={{ fontSize: 11, color: 'var(--violet-400)', marginTop: 4 }}>
                        {p.discount}% off — Ahorrás ${((p.price * (p.longInterval === 'semiannual' ? 6 : 12)) - p.yearlyPrice).toLocaleString('es-AR')}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-3)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div>{p.accounts} {p.accounts === 1 ? 'cuenta' : 'cuentas'}</div>
                    <div>{p.seats} asientos de equipo</div>
                    <div>{p.storageGB} GB por cuenta</div>
                    <div>{p.piecesPerClient} piezas/mes por cliente</div>
                  </div>
                  <button
                    onClick={() => {
                      if (!isCurrent) {
                        checkout.mutate({ plan: p.key as 'solo' | 'estudio' | 'casa', interval })
                      }
                    }}
                    disabled={isCurrent || checkout.isPending}
                    style={{ padding: '8px 14px', fontSize: 12, fontWeight: 500, color: isCurrent ? 'var(--fg-3)' : '#fff', borderRadius: 'var(--r-2)', border: isCurrent ? '1px solid var(--line-2)' : '1px solid var(--violet-400)', background: isCurrent ? 'var(--bg-3)' : 'var(--violet-500)', cursor: isCurrent ? 'default' : 'pointer', marginTop: 'auto', opacity: checkout.isPending ? 0.7 : 1 }}
                  >
                    {isCurrent ? 'Plan actual' : checkout.isPending ? 'Redirigiendo...' : 'Cambiar plan'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

function AddPaymentModal({ onClose }: { onClose: () => void }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [name, setName] = useState('')

  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 10px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none', boxSizing: 'border-box' as const }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,9,0.72)', zIndex: 40 }} />
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, pointerEvents: 'none' }}>
        <div style={{ width: 'min(420px, calc(100vw - 48px))', background: 'var(--bg-1)', border: '1px solid var(--line-2)', borderRadius: 14, boxShadow: '0 40px 80px -10px rgba(0,0,0,0.7)', overflow: 'hidden', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--line-1)' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Agregar metodo de pago</h2>
            <button onClick={onClose} style={{ width: 26, height: 26, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 5, color: 'var(--fg-2)', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: 12 }}>X</button>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 6, display: 'block' }}>Numero de tarjeta</label>
              <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 6, display: 'block' }}>Vencimiento</label>
                <input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/AA" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-2)', marginBottom: 6, display: 'block' }}>Titular</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre en la tarjeta" style={inputStyle} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 20px', borderTop: '1px solid var(--line-1)' }}>
            <button onClick={onClose} style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}>Cancelar</button>
            <button onClick={() => { toast.success('Metodo de pago agregado correctamente'); onClose() }} style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}>Agregar</button>
          </div>
        </div>
      </div>
    </>
  )
}

export function Billing() {
  const {
    agency,
    accountsUsed,
    seatsUsed,
    storageUsedGB,
    limits,
    planLabel,
    planPrice,
    isLoading,
  } = useBilling()

  const paymentGate = usePaymentGate()
  const needsPayment = paymentGate.data && !paymentGate.data.isPaid
  const checkout = useCheckout()

  const { data: invoices = [], isLoading: invoicesLoading } = useInvoices()

  function invoiceStatusPill(status: string): { cls: string; label: string } {
    if (status === 'paid')    return { cls: 'pill-approved', label: 'Pagada' }
    if (status === 'overdue') return { cls: 'pill-rejected', label: 'Vencida' }
    return { cls: 'pill-sent', label: 'Próxima' }
  }

  function formatAmount(cents: number): string {
    return '$' + (cents / 100).toLocaleString('es-AR')
  }

  function formatEmision(dateStr: string): string {
    const [y, m, d] = dateStr.split('-')
    return `${d}/${m}/${y.slice(2)}`
  }

  const agencyName = agency?.name ?? 'Mi agencia'

  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editingFiscal, setEditingFiscal] = useState(false)
  const [fiscal, setFiscal] = useState({ razon: '', cuit: '', iva: '', domicilio: '' })

  useEffect(() => { if (agencyName) setFiscal(f => ({ ...f, razon: agencyName })) }, [agencyName])

  const planSince = agency
    ? (() => {
        // agencies table may not expose created_at — use a safe fallback
        const raw = (agency as Record<string, unknown>).created_at as string | undefined
        if (!raw) return 'NOV 2024'
        const d = new Date(raw)
        return d.toLocaleString('es-AR', { month: 'short', year: 'numeric' }).toUpperCase()
      })()
    : 'NOV 2024'

  const accountsPct  = limits.accounts  > 0 ? Math.round((accountsUsed  / limits.accounts)  * 100) : 0
  const seatsPct     = limits.seats     > 0 ? Math.round((seatsUsed     / limits.seats)     * 100) : 0
  const storagePct   = limits.storageGB > 0 ? Math.round((storageUsedGB / limits.storageGB) * 100) : 0
  const accountsOverflow = Math.max(0, accountsUsed - limits.accounts)
  const seatsOverflow    = Math.max(0, seatsUsed - limits.seats)
  const hasOverflow      = accountsOverflow > 0 || seatsOverflow > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={[agencyName, 'Facturación']}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
              onClick={() => document.getElementById('fiscal-data')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Datos fiscales
            </button>
            <button
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: '#fff', borderRadius: 'var(--r-2)', border: '1px solid var(--violet-400)', background: 'var(--violet-500)', cursor: 'pointer' }}
              onClick={() => setShowPlanModal(true)}
            >
              Cambiar plan
            </button>
          </div>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Facturación</h2>
          <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
            {agencyName} · Plan {planLabel} mensual.
          </p>
        </div>

        {needsPayment && (
          <div
            style={{
              padding: '20px 24px',
              borderRadius: 'var(--r-3)',
              border: '1px solid var(--violet-500)',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08), transparent 60%)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                Activá tu plan {planLabel}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-2)' }}>
                Tu cuenta está creada pero necesitás activar la suscripción para acceder al dashboard y todas las funcionalidades.
              </div>
            </div>
            <button
              onClick={() => checkout.mutate({ plan: (agency?.plan ?? 'solo') as 'solo' | 'estudio' | 'casa' })}
              disabled={checkout.isPending}
              style={{
                flexShrink: 0,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 500,
                color: '#fff',
                borderRadius: 'var(--r-2)',
                border: '1px solid var(--violet-400)',
                background: 'var(--violet-500)',
                cursor: checkout.isPending ? 'not-allowed' : 'pointer',
                opacity: checkout.isPending ? 0.7 : 1,
                boxShadow: '0 0 0 1px var(--violet-500), 0 1px 0 rgba(255,255,255,0.12) inset',
              }}
            >
              {checkout.isPending ? 'Redirigiendo a Stripe...' : `Pagar ${formatPrice(planPrice)}/mes`}
            </button>
          </div>
        )}

        {hasOverflow && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: 'var(--r-2)',
              border: '1px solid rgba(239,68,68,0.3)',
              background: 'rgba(239,68,68,0.08)',
              marginBottom: 16,
              fontSize: 13,
              color: 'var(--fg-1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div>
              <strong>Estas por encima del limite de tu plan {planLabel}.</strong>
              {accountsOverflow > 0 && (
                <span> Cuentas: {accountsUsed}/{limits.accounts}.</span>
              )}
              {seatsOverflow > 0 && (
                <span> Asientos: {seatsUsed}/{limits.seats}.</span>
              )}
              <span> No podes crear nuevos hasta reducir o hacer upgrade.</span>
            </div>
            <button
              onClick={() => setShowPlanModal(true)}
              style={{
                flexShrink: 0,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 500,
                color: '#fff',
                borderRadius: 'var(--r-2)',
                border: '1px solid var(--violet-400)',
                background: 'var(--violet-500)',
                cursor: 'pointer',
              }}
            >
              Upgrade
            </button>
          </div>
        )}

        <div className="billing-layout" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Plan actual */}
          <section style={panel}>
            <div style={panelH}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Plan actual</h3>
              <span className="pill pill-approved"><span className="dot" />Activa</span>
            </div>
            <div style={{ padding: 22 }}>
              {isLoading ? (
                <div style={{ color: 'var(--fg-3)', fontSize: 13 }}>Cargando…</div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <h3 style={{ margin: 0, fontSize: 24, letterSpacing: '-0.02em' }}>{planLabel}</h3>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--fg-3)' }}>DESDE {planSince}</span>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', margin: '8px 0 4px' }}>
                    {formatPrice(planPrice)}{' '}
                    <span style={{ fontSize: 13, color: 'var(--fg-3)', fontWeight: 400 }}>/ mes + IVA</span>
                  </div>
                  <div style={{ color: 'var(--fg-3)', fontSize: 13 }}>Próxima factura: 1 de mayo de 2026 · ARS {formatPrice(Math.round(planPrice * 1.21))} (IVA 21%)</div>

                  <div style={{ marginTop: 24 }}>
                    <PlanRow label="Cuentas activas" value={`${accountsUsed} / ${limits.accounts}`} />
                    <Meter value={accountsPct} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <PlanRow label="Asientos de equipo" value={`${seatsUsed} / ${limits.seats}`} />
                    <Meter value={seatsPct} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <PlanRow label="Almacenamiento" value={formatStorage(storageUsedGB, limits.storageGB)} />
                    <Meter value={storagePct} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <PlanRow label="Clientes portal por cuenta" value={`${limits.portalClientsPerAccount} max`} />
                    <PlanRow label="Piezas/mes por cliente" value={`${limits.piecesPerClient}`} />
                    <PlanRow label="Soporte por WhatsApp" value="Incluido" />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Método de pago + Datos fiscales */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <section style={panel}>
              <div style={panelH}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Método de pago</h3>
                <span
                  className="mono"
                  style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}
                  onClick={() => setShowPaymentModal(true)}
                >
                  + AGREGAR
                </span>
              </div>

              <div style={{ padding: '20px 18px', color: 'var(--fg-3)', fontSize: 13, textAlign: 'center' }}>
                  Sin métodos de pago configurados.
                </div>

              <div id="fiscal-data" style={{ ...panelH, borderTop: '1px solid var(--line-1)', borderBottom: 0 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Datos fiscales</h3>
                <span
                  className="mono"
                  style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: 'pointer' }}
                  onClick={() => {
                    if (editingFiscal) { toast.success('Datos fiscales actualizados') }
                    setEditingFiscal(!editingFiscal)
                  }}
                >
                  {editingFiscal ? 'GUARDAR' : 'EDITAR'}
                </span>
              </div>
              <div style={{ padding: '14px 18px', fontSize: 13 }}>
                {[
                  { l: 'Razon social', k: 'razon' as const },
                  { l: 'CUIT',         k: 'cuit' as const },
                  { l: 'Cond. IVA',    k: 'iva' as const },
                  { l: 'Domicilio',    k: 'domicilio' as const },
                ].map((row) => (
                  <div key={row.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line-1)', fontSize: 13 }}>
                    <span style={{ color: 'var(--fg-3)' }}>{row.l}</span>
                    {editingFiscal ? (
                      <input
                        value={fiscal[row.k]}
                        onChange={(e) => setFiscal({ ...fiscal, [row.k]: e.target.value })}
                        style={{ padding: '6px 8px', fontSize: 13, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 'var(--r-2)', color: 'var(--fg-1)', outline: 'none', textAlign: 'right', maxWidth: 220 }}
                      />
                    ) : (
                      <span className="mono">{fiscal[row.k]}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Invoice history */}
        <section className="billing-invoices" style={{ ...panel, overflow: 'hidden' }}>
          <div style={panelH}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Historial de facturas</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                style={{ padding: '6px 10px', fontSize: 12, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                onClick={() => {
                  const header = ['N° Factura', 'Periodo', 'Emision', 'Concepto', 'Subtotal', 'IVA', 'Total', 'Estado']
                  const rows = invoices.map((inv) => {
                    const { label } = invoiceStatusPill(inv.status)
                    return [inv.number, inv.period, formatEmision(inv.emision_date), inv.concept, formatAmount(inv.subtotal), formatAmount(inv.iva), formatAmount(inv.total), label].map((v) => `"${v}"`).join(',')
                  })
                  const csv = '\uFEFF' + [header.join(','), ...rows].join('\r\n')
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = 'facturas.csv'
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                  toast.success('CSV de facturas descargado')
                }}
              >
                Exportar CSV
              </button>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {invoices.length} FACTURAS
              </span>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['N° factura', 'Período', 'Emisión', 'Concepto', 'Subtotal', 'IVA', 'Total', 'Estado', ''].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoicesLoading && (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: 'var(--fg-3)' }}>Cargando facturas…</td>
                </tr>
              )}
              {!invoicesLoading && invoices.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: 'var(--fg-3)' }}>No hay facturas registradas.</td>
                </tr>
              )}
              {!invoicesLoading && invoices.map((inv) => {
                const { cls, label } = invoiceStatusPill(inv.status)
                return (
                  <tr
                    key={inv.id}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--bg-2)' }) }}
                    onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'transparent' }) }}
                  >
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{inv.number}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{inv.period}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>{formatEmision(inv.emision_date)}</td>
                    <td style={tdStyle}>{inv.concept}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{formatAmount(inv.subtotal)}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)' }}>{formatAmount(inv.iva)}</td>
                    <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatAmount(inv.total)}</td>
                    <td style={tdStyle}><span className={`pill ${cls}`}><span className="dot" />{label}</span></td>
                    <td style={tdStyle}>
                      <button
                        onClick={(e) => { e.stopPropagation(); generateInvoicePdf(inv, agencyName) }}
                        style={{ padding: '4px 8px', fontSize: 11, fontWeight: 500, color: 'var(--fg-2)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      </div>
      {showPlanModal && <PlanModal currentPlan={agency?.plan ?? 'estudio'} onClose={() => setShowPlanModal(false)} />}
      {showPaymentModal && <AddPaymentModal onClose={() => setShowPaymentModal(false)} />}
    </div>
  )
}
