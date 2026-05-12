export const PLAN_LIMITS = {
  solo: {
    accounts: 2,
    teamSeats: 2,
    portalClientsPerAccount: 2,
    piecesPerClient: 60,
    storageGB: 1,
    archivalDays: 60,
  },
  estudio: {
    accounts: 5,
    teamSeats: 5,
    portalClientsPerAccount: 5,
    piecesPerClient: 80,
    storageGB: 1.6,
    archivalDays: 90,
  },
  casa: {
    accounts: 15,
    teamSeats: 15,
    portalClientsPerAccount: 15,
    piecesPerClient: 160,
    storageGB: 3,
    archivalDays: 180,
  },
} as const

export type PlanId = keyof typeof PLAN_LIMITS

export function getPlanLimit(plan: PlanId) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.solo
}
