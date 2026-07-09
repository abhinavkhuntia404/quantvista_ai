import { API_BASE } from "./utils"

export interface StockInfo {
  ticker: string
  name: string
  sector: string
  industry: string
  market_cap: number
  currency: string
  pe_ratio: number | null
  forward_pe: number | null
  peg_ratio: number | null
  price_to_book: number | null
  enterprise_value: number | null
  return_on_equity: number | null
  debt_to_equity: number | null
  profit_margin: number | null
  operating_margin: number | null
  dividend_yield: number | null
  beta: number | null
  fifty_two_week_high: number | null
  fifty_two_week_low: number | null
  current_price: number | null
  previous_close: number | null
  description: string
  exchange: string
}

export interface PricePoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockData {
  info: StockInfo
  history: PricePoint[]
  data_points: number
  csv_available: boolean
}

export interface AnalysisResult {
  ticker: string
  current_price: number
  monte_carlo: any
  gbm: any
  volatility: any
  var: any
  expected_return: any
  confidence_intervals: any
  scenario_analysis: any
  probability_distribution: any
  risk_score: any
  future_price_range: any
  ai_insight: string
}

export interface PortfolioResult {
  tickers: string[]
  weights: number[]
  portfolio_return: number
  portfolio_volatility: number
  sharpe_ratio: number
  portfolio_var_95: number
  diversification_ratio: number
  diversification_score: number
  correlation_matrix: { labels: string[]; values: number[][] }
  stock_stats: any[]
}

export interface NewsItem {
  title: string
  summary: string
  link: string
  publisher: string
  published: string | null
  sentiment: "Positive" | "Negative" | "Neutral"
}

export interface NewsResult {
  ticker: string
  news: NewsItem[]
  sentiment_summary: {
    overall: string
    score: number
    positive_count: number
    negative_count: number
    neutral_count: number
  }
}

export interface TechnicalResult {
  current_price: number
  indicators: {
    RSI: number
    MACD: number
    MACD_Signal: number
    MACD_Hist: number
    SMA_20: number
    SMA_50: number
    SMA_200: number | null
    EMA_20: number
    Upper_BB: number
    Lower_BB: number
    ATR: number
    OBV: number
  }
  signals: Record<string, string>
  summary: {
    bullish_signals: number
    bearish_signals: number
    overall: string
  }
}

export interface SearchSuggestion {
  symbol: string
  shortname: string
  exchange: string
  type: string
  score: number
}

// API functions
export async function searchStock(ticker: string, period = "2y"): Promise<StockData> {
  const res = await fetch(`${API_BASE}/api/stocks/search/${ticker}?period=${period}`)
  if (!res.ok) throw new Error(`Failed to fetch stock data: ${res.statusText}`)
  return res.json()
}

export async function searchAutocomplete(query: string): Promise<SearchSuggestion[]> {
  if (!query) return []
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) return []
  return res.json()
}

export async function logRecentSearch(query: string, ticker?: string) {
  try {
    await fetch("/api/search/recent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, ticker }),
    })
  } catch (e) {
    // Fail silently, it's just logging
  }
}

export async function getRecentSearches() {
  try {
    const res = await fetch("/api/search/recent")
    if (!res.ok) return []
    return res.json()
  } catch (e) {
    return []
  }
}

export async function getFullAnalysis(ticker: string, days = 30, period = "2y"): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/api/analysis/full/${ticker}?days=${days}&period=${period}`)
  if (!res.ok) throw new Error(`Analysis failed: ${res.statusText}`)
  return res.json()
}

export async function getMonteCarloAnalysis(ticker: string, days = 30, simulations = 10000) {
  const res = await fetch(`${API_BASE}/api/analysis/monte-carlo/${ticker}?days=${days}&simulations=${simulations}`)
  if (!res.ok) throw new Error(`Monte Carlo failed: ${res.statusText}`)
  return res.json()
}

export async function getAIInsight(ticker: string, days = 30) {
  const res = await fetch(`${API_BASE}/api/analysis/insight/${ticker}?days=${days}`)
  if (!res.ok) throw new Error(`Insight failed: ${res.statusText}`)
  return res.json()
}

export async function getTechnicals(ticker: string, period = "2y"): Promise<TechnicalResult> {
  const res = await fetch(`${API_BASE}/api/analysis/technicals/${ticker}?period=${period}`)
  if (!res.ok) throw new Error(`Technicals failed: ${res.statusText}`)
  return res.json()
}

export async function analyzePortfolio(tickers: string[], weights?: number[]): Promise<PortfolioResult> {
  const res = await fetch(`${API_BASE}/api/portfolio/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tickers, weights }),
  })
  if (!res.ok) throw new Error(`Portfolio analysis failed: ${res.statusText}`)
  return res.json()
}

export async function getStockNews(ticker: string): Promise<NewsResult> {
  const res = await fetch(`${API_BASE}/api/news/${ticker}`)
  if (!res.ok) throw new Error(`News fetch failed: ${res.statusText}`)
  return res.json()
}

export function downloadPdfReport(ticker: string, days = 30) {
  window.open(`${API_BASE}/api/reports/pdf/${ticker}?days=${days}`, "_blank")
}

export function downloadCsvReport(ticker: string, days = 30) {
  window.open(`${API_BASE}/api/reports/csv/${ticker}?days=${days}`, "_blank")
}

export function downloadStockCsv(ticker: string) {
  window.open(`${API_BASE}/api/stocks/download/${ticker}`, "_blank")
}
