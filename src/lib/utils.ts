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

export function getExchangeInfo(exchange: string, ticker: string): { name: string, flag: string, currency: string } {
  const t = ticker.toUpperCase()
  if (t.endsWith('.NS') || t.endsWith('.BO') || exchange === 'NSI' || exchange === 'BSE') {
    return { name: exchange === 'NSI' ? 'NSE India' : 'BSE India', flag: '🇮🇳', currency: 'INR' }
  }
  if (t.endsWith('.L') || exchange === 'LSE') return { name: 'London Stock Exchange', flag: '🇬🇧', currency: 'GBP' }
  if (t.endsWith('.T') || exchange === 'JPX') return { name: 'Tokyo Stock Exchange', flag: '🇯🇵', currency: 'JPY' }
  if (t.endsWith('.DE') || exchange === 'FRA') return { name: 'Frankfurt Stock Exchange', flag: '🇩🇪', currency: 'EUR' }
  if (t.endsWith('.HK') || exchange === 'HKG') return { name: 'Hong Kong Exchange', flag: '🇭🇰', currency: 'HKD' }
  if (t.endsWith('.AX') || exchange === 'ASX') return { name: 'Australian Securities Exchange', flag: '🇦🇺', currency: 'AUD' }
  if (t.endsWith('.SG') || exchange === 'SES') return { name: 'Singapore Exchange', flag: '🇸🇬', currency: 'SGD' }
  
  if (exchange === 'NMS' || exchange === 'NasdaqGS' || exchange === 'NASDAQ') return { name: 'NASDAQ', flag: '🇺🇸', currency: 'USD' }
  if (exchange === 'NYQ' || exchange === 'NYSE') return { name: 'NYSE', flag: '🇺🇸', currency: 'USD' }
  
  return { name: exchange || 'Global', flag: '🌐', currency: 'USD' }
}

export function getMarketStatus(): { status: string, color: string } {
  // Simplistic mock for now. In a real app, you'd check hours and holidays per exchange.
  const d = new Date()
  const day = d.getDay()
  if (day === 0 || day === 6) {
    return { status: "Market Closed (Weekend)", color: "var(--accent-red)" }
  }
  return { status: "Market Open", color: "var(--accent-green)" }
}

export function formatDateTime(date = new Date()) {
  return date.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true
  })
}
