export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',

  // Backoffice
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  CALENDAR: '/calendar',
  LIBRARY: '/library',
  REPORTS: '/reports',
  TEAM: '/team',
  BILLING: '/billing',
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Client portal
  PORTAL: '/portal',
  PORTAL_PIECE: (id: string) => `/portal/pieces/${id}`,
} as const
