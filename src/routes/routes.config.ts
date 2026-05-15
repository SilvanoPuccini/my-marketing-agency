export const ROUTES = {
  // Public — static
  HOME: '/',
  LOGIN: '/login',

  // Public — rarely visited
  REGISTER: '/registro',
  AUTH_CALLBACK: '/auth/callback',
  COMPLETE_INVITATION: '/complete-invitation',
  FORGOT_PASSWORD: '/recuperar-password',
  RESET_PASSWORD: '/reset-password',
  PRIVACY: '/privacidad',
  TERMS: '/terminos',
  STATUS: '/estado',
  CONTACT: '/contacto',

  // Onboarding
  ONBOARDING: '/onboarding',

  // Backoffice
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  ACCOUNT_DETAIL: '/accounts/:id',
  CALENDAR: '/calendar',
  LIBRARY: '/library',
  REPORTS: '/reports',
  TEAM: '/team',
  TEAM_MEMBER: '/team/:id',
  BILLING: '/billing',
  SETTINGS: '/settings',
  PROFILE: '/profile',

  // Client portal
  PORTAL: {
    ROOT: '/portal',
    HISTORY: '/portal/history',
    REPORTS: '/portal/reports',
    PIECE: '/portal/pieces/:id',
    PROFILE: '/portal/profile',
  },

  // Helpers (for navigation, not for Route path=)
  portalPiece: (id: string) => `/portal/pieces/${id}`,
  accountDetail: (id: string) => `/accounts/${id}`,
  teamMember: (id: string) => `/team/${id}`,
} as const
