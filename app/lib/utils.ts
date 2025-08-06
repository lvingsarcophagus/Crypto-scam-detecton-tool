import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { XCircle, AlertTriangle, CheckCircle } from "lucide-react"
import { RISK_LEVELS, RISK_COLORS, RISK_TEXT_COLORS } from "@/app/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRiskColor = (score: number) => {
  if (score >= 70) return RISK_COLORS.HIGH
  if (score >= 40) return RISK_COLORS.MEDIUM
  return RISK_COLORS.LOW
}

export const getRiskTextColor = (score: number) => {
  if (score >= 70) return RISK_TEXT_COLORS.HIGH
  if (score >= 40) return RISK_TEXT_COLORS.MEDIUM
  return RISK_TEXT_COLORS.LOW
}

export const getRiskLevel = (score: number) => {
  if (score >= 70) return RISK_LEVELS.HIGH
  if (score >= 40) return RISK_LEVELS.MEDIUM
  return RISK_LEVELS.LOW
}

export const getRiskIcon = (score: number) => {
  if (score >= 70) return XCircle
  if (score >= 40) return AlertTriangle
  return CheckCircle
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}
