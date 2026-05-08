import type { PieceStatus, UserRole } from '@/types/domain.types'

/**
 * Transiciones válidas del ciclo de vida de una pieza.
 *
 * Flujo principal:
 *   draft → sent_client → approved → published
 *                       → rejected → draft (corrección)
 *
 * Reglas por rol:
 *   - admin_agency / team_member: controlan el flujo interno (draft, sent_client, published)
 *   - client: solo puede aprobar o rechazar piezas que le fueron enviadas
 */

const TRANSITIONS: Record<PieceStatus, PieceStatus[]> = {
  draft:       ['sent_client'],
  sent_client: ['approved', 'rejected', 'draft'],
  approved:    ['published', 'draft'],
  rejected:    ['draft'],
  published:   [],
}

const CLIENT_TRANSITIONS: Record<PieceStatus, PieceStatus[]> = {
  draft:       [],
  sent_client: ['approved', 'rejected'],
  approved:    [],
  rejected:    [],
  published:   [],
}

export function getValidTransitions(
  currentStatus: PieceStatus,
  role: UserRole,
): PieceStatus[] {
  if (role === 'client') {
    return CLIENT_TRANSITIONS[currentStatus] ?? []
  }
  return TRANSITIONS[currentStatus] ?? []
}

export function isValidTransition(
  from: PieceStatus,
  to: PieceStatus,
  role: UserRole,
): boolean {
  return getValidTransitions(from, role).includes(to)
}

export function getTransitionError(
  from: PieceStatus,
  to: PieceStatus,
  role: UserRole,
): string | null {
  if (isValidTransition(from, to, role)) return null

  if (role === 'client') {
    if (from !== 'sent_client') {
      return 'Solo podés aprobar o rechazar piezas que fueron enviadas para revision'
    }
    return `No podés cambiar el estado a "${to}"`
  }

  if (from === 'published') {
    return 'Una pieza publicada no puede cambiar de estado'
  }

  const allowed = TRANSITIONS[from]
  if (allowed.length === 0) {
    return `La pieza en estado "${from}" no puede cambiar de estado`
  }

  return `No se puede pasar de "${from}" a "${to}". Estados permitidos: ${allowed.join(', ')}`
}
