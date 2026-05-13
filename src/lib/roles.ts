export const ROLE_LABELS: Record<string, string> = {
  admin_agency: 'Admin',
  manager:      'Manager',
  creator:      'Creador',
  team_member:  'Equipo',
  client:       'Cliente',
}

export const ROLE_LABELS_LONG: Record<string, string> = {
  admin_agency: 'Administrador',
  manager:      'Manager',
  creator:      'Creador de contenido',
  team_member:  'Miembro del equipo',
  client:       'Cliente',
}

import type { UserRole } from '@/types/domain.types'

/** Roles that are agency staff (not clients) */
export const STAFF_ROLES: UserRole[] = ['admin_agency', 'manager', 'creator', 'team_member']

/** Nav items each role can see */
export const NAV_ACCESS: Record<string, string[]> = {
  admin_agency: ['/dashboard', '/accounts', '/calendar', '/library', '/reports', '/team', '/billing', '/settings'],
  manager:      ['/dashboard', '/accounts', '/calendar', '/library', '/reports'],
  creator:      ['/dashboard', '/calendar', '/library'],
  team_member:  ['/dashboard', '/calendar', '/library'],
  client:       [],
}
