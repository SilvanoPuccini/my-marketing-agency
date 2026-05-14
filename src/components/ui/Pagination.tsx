import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button
        onClick={onPrev}
        disabled={page === 1}
        aria-label="Página anterior"
        style={{
          width: 26, height: 26, display: 'grid', placeItems: 'center',
          borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)',
          background: page === 1 ? 'transparent' : 'var(--bg-2)',
          color: page === 1 ? 'var(--fg-4)' : 'var(--fg-2)',
          cursor: page === 1 ? 'default' : 'pointer',
          opacity: page === 1 ? 0.4 : 1,
        }}
      >
        <ChevronLeft size={14} />
      </button>
      <span className="mono" style={{ fontSize: 10, color: 'var(--fg-3)', minWidth: 28, textAlign: 'center' }}>
        {page}/{totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        aria-label="Página siguiente"
        style={{
          width: 26, height: 26, display: 'grid', placeItems: 'center',
          borderRadius: 'var(--r-2)', border: '1px solid var(--line-2)',
          background: page === totalPages ? 'transparent' : 'var(--bg-2)',
          color: page === totalPages ? 'var(--fg-4)' : 'var(--fg-2)',
          cursor: page === totalPages ? 'default' : 'pointer',
          opacity: page === totalPages ? 0.4 : 1,
        }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

/** Paginate an array client-side */
export function usePaginated<T>(items: T[], pageSize: number, page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const paged = items.slice(start, start + pageSize)
  return { paged, totalPages, safePage }
}
