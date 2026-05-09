export const PLAN_LIMITS = {
  solo:    { accounts: 1,  users: 1  },
  estudio: { accounts: 5,  users: 5  },
  casa:    { accounts: 999, users: 999 }, // "ilimitado"
} as const

export type PlanId = keyof typeof PLAN_LIMITS

export function getPlanLimit(plan: PlanId) {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.solo
}
