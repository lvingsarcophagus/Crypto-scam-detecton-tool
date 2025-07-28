import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRiskColor = (score: number) => {
  if (score >= 70) return "text-red-600 dark:text-red-400"
  if (score >= 40) return "text-yellow-600 dark:text-yellow-400"
  return "text-green-600 dark:text-green-400"
}

export const getRiskBgColor = (score: number) => {
  if (score >= 70) return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800"
  if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
  return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800"
}

export const getRiskLevel = (score: number) => {
  if (score >= 70) return "High Risk"
  if (score >= 40) return "Medium Risk"
  return "Low Risk"
}

export const getRiskBadgeVariant = (score: number) => {
  if (score >= 70) return "destructive"
  if (score >= 40) return "secondary"
  return "default"
}
