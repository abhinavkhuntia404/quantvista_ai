import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

export function formatNumber(value: number, decimals = 2): string {
  if (Math.abs(value) >= 1e12) return `${(value / 1e12).toFixed(decimals)}T`
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(decimals)}B`
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(decimals)}M`
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(decimals)}K`
  return value.toFixed(decimals)
}

export function formatMarketCap(value: number): string {
  if (!value) return "N/A"
  return formatNumber(value, 2)
}

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
