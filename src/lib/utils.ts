import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Generates 2-char initials from a name */
export function mkInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
}

/** Piece status labels for display */
export const STATUS_LABELS: Record<string, string> = {
  draft:       'Borrador',
  in_progress: 'En progreso',
  review:      'En revisión',
  sent_client: 'Enviada al cliente',
  approved:    'Aprobada',
  rejected:    'Cambios pedidos',
  published:   'Publicada',
}

/** Format date as "LUN 15 MAY" */
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const wd = d.toLocaleDateString('es-AR', { weekday: 'short' }).toUpperCase().replace('.', '')
  const day = d.getDate()
  const mo = d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase().replace('.', '')
  return `${wd} ${day} ${mo}`
}

/** Format date with time as "LUN 15 MAY · 14:00" */
export function formatDateWithTime(dateStr: string, timeStr: string | null): string {
  const time = timeStr?.slice(0, 5) ?? '--:--'
  return `${formatDateShort(dateStr)} · ${time}`
}

/** Format date as "15 may 2026" */
export function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Format budget as "$250.000" */
export function formatBudget(n: number | null): string {
  if (!n) return '$0'
  return `$${n.toLocaleString('es-AR')}`
}

/** Monday-based week start/end for current week */
export function getCurrentWeekRange(): { wStart: string; wEnd: string } {
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  return {
    wStart: weekStart.toISOString().split('T')[0],
    wEnd: weekEnd.toISOString().split('T')[0],
  }
}
