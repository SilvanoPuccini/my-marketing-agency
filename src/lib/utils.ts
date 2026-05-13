import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Generates 2-char initials from a name */
export function mkInitials(name: string): string {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
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
