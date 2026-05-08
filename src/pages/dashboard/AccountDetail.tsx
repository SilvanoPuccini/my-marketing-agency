import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { TopBar } from '@/components/layout/TopBar'
import { TableSkeleton } from '@/components/ui/page-skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { PieceDetailModal } from '@/features/pieces/components/PieceDetailModal'

type AccountInfo = {
  id: string
  name: string
  handle: string | null
  industry: string | null
  contact_name: string | null
  contact_email: string | null
  monthly_budget: number | null
  is_active: boolean
}

type PieceRow = {
  id: string
  title: string
  type: string
  status: string
  scheduled_date: string
  scheduled_time: string | null
  platform: string | null
}

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent_client: 'Enviada',
  approved: 'Aprobada',
  rejected: 'Cambios',
  published: 'Publicada',
}

function useAccountDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['account', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('id, name, handle, industry, contact_name, contact_email, monthly_budget, is_active')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as AccountInfo
    },
  })
}

function useAccountPieces(accountId: string | undefined) {
  return useQuery({
    queryKey: ['account-pieces', accountId],
    enabled: !!accountId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pieces')
        .select('id, title, type, status, scheduled_date, scheduled_time, platform')
        .eq('account_id', accountId!)
        .order('scheduled_date', { ascending: false })
      if (error) throw error
      return (data ?? []) as PieceRow[]
    },
  })
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const wd = d.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase().replace('.', '')
  const day = d.getDate()
  const mo = d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase().replace('.', '')
  return `${wd} ${day} ${mo}`
}

function formatBudget(n: number | null): string {
  if (!n) return '—'
  return `$${n.toLocaleString('es-AR')}`
}

function initials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

export function AccountDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: account, isLoading } = useAccountDetail(id)
  const { data: pieces = [], isLoading: piecesLoading } = useAccountPieces(id)
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)

  const thStyle: React.CSSProperties = {
    textAlign: 'left', fontWeight: 500, fontSize: 11,
    letterSpacing: '0.04em', textTransform: 'uppercase',
    color: 'var(--fg-3)', padding: '10px 16px',
    borderBottom: '1px solid var(--line-1)', background: 'var(--bg-1)',
  }

  const tdStyle: React.CSSProperties = {
    padding: '12px 16px', borderBottom: '1px solid var(--line-1)',
    color: 'var(--fg-1)', verticalAlign: 'middle',
  }

  const published = pieces.filter((p) => p.status === 'published').length
  const total = pieces.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar
        breadcrumb={['Mi agencia', 'Cuentas', account?.name ?? 'Cargando…']}
        actions={
          <button
            onClick={() => navigate('/accounts')}
            style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--fg-1)', borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)', background: 'var(--bg-2)', cursor: 'pointer' }}
          >
            Volver
          </button>
        }
      />

      <div className="page-content" style={{ padding: '24px 32px' }}>
        {isLoading ? (
          <TableSkeleton rows={3} />
        ) : account ? (
          <>
            {/* Account header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--violet-soft)', border: '1px solid var(--violet-soft)',
                color: 'var(--violet-400)', fontSize: 16, fontWeight: 600,
              }}>
                {initials(account.name)}
              </div>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 4px' }}>
                  {account.name}
                </h2>
                <p style={{ color: 'var(--fg-3)', margin: 0, fontSize: 13 }}>
                  {[account.handle, account.industry].filter(Boolean).join(' · ')}
                  {!account.is_active && ' · En pausa'}
                </p>
              </div>
              <div style={{ flex: 1 }} />
              <span className={`pill pill-${account.is_active ? 'approved' : 'draft'}`}>
                <span className="dot" />
                {account.is_active ? 'Activa' : 'En pausa'}
              </span>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
              {[
                { label: 'Contacto', value: account.contact_name ?? '—' },
                { label: 'Email', value: account.contact_email ?? '—' },
                { label: 'Presupuesto mensual', value: formatBudget(account.monthly_budget) },
                { label: 'Piezas', value: `${published} publicadas / ${total} total` },
              ].map((card) => (
                <div key={card.label} style={{ background: 'var(--bg-1)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--fg-3)', marginBottom: 6 }}>{card.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Pieces table */}
            <section style={{ background: 'var(--bg-2)', border: '1px solid var(--line-1)', borderRadius: 'var(--r-3)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--line-1)' }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Piezas</h3>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {total} PIEZAS
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: '35%' }}>Titulo</th>
                    <th style={thStyle}>Tipo</th>
                    <th style={thStyle}>Plataforma</th>
                    <th style={thStyle}>Fecha</th>
                    <th style={thStyle}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {piecesLoading && (
                    <tr>
                      <td colSpan={5} style={{ padding: 0 }}>
                        <TableSkeleton rows={4} />
                      </td>
                    </tr>
                  )}
                  {!piecesLoading && pieces.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: 0 }}>
                        <EmptyState
                          icon="📋"
                          title="Sin piezas"
                          description="Esta cuenta todavia no tiene piezas asignadas."
                        />
                      </td>
                    </tr>
                  )}
                  {pieces.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedPiece(p.id)}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'var(--bg-3)' }) }}
                      onMouseLeave={(e) => { e.currentTarget.querySelectorAll('td').forEach((td) => { td.style.background = 'transparent' }) }}
                    >
                      <td style={{ ...tdStyle, fontWeight: 500 }}>{p.title}</td>
                      <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{p.type}</td>
                      <td style={{ ...tdStyle, color: 'var(--fg-3)' }}>{p.platform ?? '—'}</td>
                      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', color: 'var(--fg-3)' }}>{formatDate(p.scheduled_date)}</td>
                      <td style={tdStyle}>
                        <span className={`pill pill-${p.status}`}>
                          <span className="dot" />
                          {STATUS_LABELS[p.status] ?? p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        ) : (
          <EmptyState icon="❌" title="Cuenta no encontrada" description="La cuenta que buscas no existe." />
        )}
      </div>

      {selectedPiece && (
        <PieceDetailModal
          pieceId={selectedPiece}
          onClose={() => setSelectedPiece(null)}
        />
      )}
    </div>
  )
}
