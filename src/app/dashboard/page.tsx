"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, TrendingUp, TrendingDown, Download, FileText,
  BarChart3, Activity, Shield, Brain, RefreshCw, Info,
  ChevronDown, DollarSign, Percent, AlertTriangle, Target,
  LayoutDashboard, Briefcase
} from "lucide-react"
import {
  searchStock, getFullAnalysis, getStockNews,
  downloadPdfReport, downloadCsvReport, downloadStockCsv, getTechnicals,
  type StockData, type AnalysisResult, type NewsResult, type TechnicalResult
} from "@/lib/api"
import { formatCurrency, formatPercent, formatMarketCap, getExchangeInfo, getMarketStatus, formatDateTime } from "@/lib/utils"
import PriceChart from "@/components/PriceChart"
import MonteCarloChart from "@/components/MonteCarloChart"
import DistributionChart from "@/components/DistributionChart"
import VolatilityChart from "@/components/VolatilityChart"
import RiskGauge from "@/components/RiskGauge"
import ConfidenceIntervalChart from "@/components/ConfidenceIntervalChart"
import NewsPanel from "@/components/NewsPanel"
import AdvancedSearch from "@/components/AdvancedSearch"
import TechnicalDashboard from "@/components/TechnicalDashboard"
import FundamentalDashboard from "@/components/FundamentalDashboard"
import { DownloadReportButton } from "@/components/pdf/DownloadReportButton"
const POPULAR_TICKERS = ["AAPL", "MSFT", "TSLA", "NVDA", "GOOGL", "AMZN", "RELIANCE.NS", "TCS.NS"]

export default function DashboardPage() {
  const [ticker, setTicker] = useState("")
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(false)
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [news, setNews] = useState<NewsResult | null>(null)
  const [technicals, setTechnicals] = useState<TechnicalResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const handleSearch = useCallback(async (searchTicker?: string) => {
    const t = (searchTicker || ticker).trim().toUpperCase()
    if (!t) return

    setLoading(true)
    setError(null)
    setTicker(t)

    try {
      const [stockRes, analysisRes, newsRes] = await Promise.all([
        searchStock(t),
        getFullAnalysis(t, days),
        getStockNews(t).catch(() => null),
      ])
      setStockData(stockRes)
      setAnalysis(analysisRes)
      setNews(newsRes)

      try {
        const tech = await getTechnicals(t)
        setTechnicals(tech)
      } catch (err) {
        console.error("Technicals failed:", err)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load data. Check ticker and try again.")
      setStockData(null)
      setAnalysis(null)
    } finally {
      setLoading(false)
    }
  }, [ticker, days])

  const currentPrice = analysis?.current_price || stockData?.info?.current_price || 0
  const fpr = analysis?.future_price_range

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8 items-start md:items-center">
        <div className="flex-1 max-w-xl">
          <AdvancedSearch onSelect={handleSearch} initialTicker={ticker} />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
          <span className="text-[11px] font-medium px-2" style={{ color: "var(--text-muted)" }}>Horizon</span>
          {[7, 14, 30, 60, 90].map(d => (
            <button key={d}
              onClick={() => { setDays(d); if (stockData) handleSearch() }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={days === d
                ? { background: "var(--accent-blue)", color: "white", boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }
                : { color: "var(--text-secondary)" }
              }
            >
              {d}D
            </button>
          ))}
        </div>

        <button onClick={() => handleSearch()} className="btn-primary" id="analyze-button" disabled={loading}>
          {loading ? <RefreshCw size={15} className="animate-spin" /> : <BarChart3 size={15} />}
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {/* Popular tickers */}
      {!stockData && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>Popular stocks:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TICKERS.map(t => (
              <button key={t} onClick={() => { setTicker(t); handleSearch(t) }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                {t}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl mb-6 flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertTriangle size={18} style={{ color: "var(--accent-red)" }} />
          <span className="text-sm" style={{ color: "var(--accent-red)" }}>{error}</span>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-6 mb-6 animate-fade-in">
          <div className="skeleton" style={{ height: "180px", borderRadius: "var(--radius-lg)" }} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "88px", borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "280px", borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {stockData && analysis && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Stock Header */}
            <div className="glass-card p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: "var(--gradient-primary)" }} />
              
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                      {stockData.info.name}
                    </h1>
                    <span className="badge badge-blue text-sm">{stockData.info.ticker}</span>
                    
                    {(() => {
                      const ex = getExchangeInfo(stockData.info.exchange, stockData.info.ticker);
                      return (
                        <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5 bg-white/5 border border-white/10 text-white">
                          {ex.flag} {ex.name}
                        </span>
                      )
                    })()}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    {stockData.info.sector && stockData.info.sector !== "N/A" && (
                      <span className="text-xs px-2.5 py-1 rounded border"
                        style={{ background: "rgba(139,92,246,0.1)", borderColor: "rgba(139,92,246,0.2)", color: "var(--accent-purple)" }}>
                        Sector: {stockData.info.sector}
                      </span>
                    )}
                    {stockData.info.industry && stockData.info.industry !== "N/A" && (
                      <span className="text-xs px-2.5 py-1 rounded border"
                        style={{ background: "rgba(6,182,212,0.1)", borderColor: "rgba(6,182,212,0.2)", color: "var(--accent-cyan)" }}>
                        Industry: {stockData.info.industry}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-4">
                    {(() => {
                      const currency = getExchangeInfo(stockData.info.exchange, stockData.info.ticker).currency;
                      return (
                        <span className="text-5xl font-bold gradient-text tracking-tight">
                          {formatCurrency(currentPrice, currency)}
                        </span>
                      )
                    })()}
                    
                    {stockData.info.previous_close && (
                      <span className={`text-lg font-medium ${currentPrice >= stockData.info.previous_close ? "text-green-500" : "text-red-500"}`}>
                        {currentPrice >= stockData.info.previous_close ? "+" : ""}
                        {formatCurrency(currentPrice - stockData.info.previous_close, getExchangeInfo(stockData.info.exchange, stockData.info.ticker).currency)}
                        {" "}
                        ({formatPercent((currentPrice - stockData.info.previous_close) / stockData.info.previous_close)})
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-4 shrink-0 mt-2 lg:mt-0">
                  <div className="text-right">
                    {(() => {
                      const mkt = getMarketStatus();
                      return (
                        <div className="flex items-center justify-end gap-2 mb-1.5">
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: mkt.color }} />
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: mkt.color }}>
                            {mkt.status}
                          </span>
                        </div>
                      )
                    })()}
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      Updated {formatDateTime()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap justify-end gap-2 mt-2">
                    <button onClick={() => downloadStockCsv(stockData.info.ticker)}
                      className="btn-secondary text-xs px-3 py-2 h-auto">
                      <Download size={14} /> CSV Data
                    </button>
                    {analysis && technicals && (
                      <DownloadReportButton 
                        stockData={stockData} 
                        analysis={analysis} 
                        technicals={technicals} 
                        fileName={`QuantVista_${ticker}_Report.pdf`} 
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-5">
                {[
                  { label: "Market Cap", value: stockData.info.market_cap ? formatMarketCap(stockData.info.market_cap) : "N/A" },
                  { label: "P/E Ratio", value: stockData.info.pe_ratio?.toFixed(2) || "N/A" },
                  { label: "Beta", value: stockData.info.beta?.toFixed(2) || "N/A" },
                  { label: "52W High", value: stockData.info.fifty_two_week_high ? formatCurrency(stockData.info.fifty_two_week_high) : "N/A" },
                  { label: "52W Low", value: stockData.info.fifty_two_week_low ? formatCurrency(stockData.info.fifty_two_week_low) : "N/A" },
                  { label: "Div Yield", value: stockData.info.dividend_yield ? formatPercent(stockData.info.dividend_yield) : "N/A" },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 3: Hero & AI Recommendation */}
            {fpr && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Left side: AI Recommendation Card */}
                <div className="glass-card p-6 relative overflow-hidden h-full flex flex-col"
                  style={{ background: fpr.prob_increase > 0.5 ? "rgba(16,185,129,0.05)" : "rgba(239,68,68,0.05)",
                           borderColor: fpr.prob_increase > 0.5 ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)" }}>
                  <div className="absolute top-0 left-0 w-full h-1" 
                    style={{ background: fpr.prob_increase > 0.5 ? "var(--gradient-success)" : "var(--gradient-danger)" }} />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                        AI Recommendation
                      </p>
                      <h2 className="text-3xl font-black tracking-tight" style={{ color: fpr.prob_increase > 0.5 ? "var(--accent-green)" : "var(--accent-red)" }}>
                        {fpr.prob_increase > 0.6 ? "STRONG BUY" : fpr.prob_increase > 0.5 ? "BUY" : fpr.prob_increase > 0.4 ? "HOLD" : "SELL"}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                        Confidence
                      </p>
                      <h2 className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>
                        {(Math.max(fpr.prob_increase, 1 - fpr.prob_increase) * 100).toFixed(0)}%
                      </h2>
                    </div>
                  </div>
                  
                  <div className="flex-1 mt-2">
                    <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Why?</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      Quantitative models suggest a {fpr.prob_increase > 0.5 ? "bullish" : "bearish"} trend over the next {days} days. 
                      The median expected price is {formatCurrency(fpr.median_price, stockData.info.currency)}, representing a 
                      {' '}
                      <span style={{ color: fpr.median_price > currentPrice ? "var(--accent-green)" : "var(--accent-red)" }}>
                        {formatPercent((fpr.median_price - currentPrice) / currentPrice)}
                      </span>
                      {' '} expected return. 
                      Risk is evaluated as {analysis.risk_score?.category || "Moderate"} with a score of {analysis.risk_score?.total_score?.toFixed(0) || 50}/100.
                    </p>
                  </div>
                </div>

                {/* Right side: Scenario Analysis & Metrics */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Scenarios */}
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Scenario Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-sm font-medium" style={{ color: "var(--accent-green)" }}>Bull Case (95th %ile)</span>
                          <span className="font-bold">{formatCurrency(fpr.percentile_95, stockData.info.currency)}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-green-500" style={{ width: "95%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-sm font-medium" style={{ color: "var(--accent-blue)" }}>Base Case (Median)</span>
                          <span className="font-bold">{formatCurrency(fpr.median_price, stockData.info.currency)}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: "50%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-sm font-medium" style={{ color: "var(--accent-red)" }}>Bear Case (5th %ile)</span>
                          <span className="font-bold">{formatCurrency(fpr.percentile_5, stockData.info.currency)}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-red-500" style={{ width: "5%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Expected Return", value: formatPercent((fpr.expected_price - currentPrice) / currentPrice), icon: DollarSign, color: fpr.expected_price > currentPrice ? "var(--accent-green)" : "var(--accent-red)" },
                      { label: "Prob. Increase", value: `${(fpr.prob_increase * 100).toFixed(1)}%`, icon: Percent, color: fpr.prob_increase > 0.5 ? "var(--accent-green)" : "var(--accent-red)" },
                      { label: "Trend Strength", value: (Math.abs(fpr.prob_increase - 0.5) * 200).toFixed(0) + "/100", icon: TrendingUp, color: "var(--accent-purple)" },
                      { label: "Risk Score", value: `${fpr.risk_score?.toFixed(0) || 0}/100`, icon: Shield, color: fpr.risk_score < 50 ? "var(--accent-green)" : "var(--accent-red)" },
                    ].map((card, i) => (
                      <div key={card.label} className="glass-card p-4 flex flex-col justify-center bg-white/5 border-white/5 transition-all hover:bg-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <card.icon size={14} style={{ color: card.color }} />
                          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{card.label}</span>
                        </div>
                        <p className="text-xl font-bold" style={{ color: card.color }}>{card.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2"
              style={{ borderBottom: "1px solid var(--border)" }}>
              {[
                { id: "overview", label: "Overview", icon: LayoutDashboard },
                { id: "fundamentals", label: "Fundamentals", icon: Briefcase },
                { id: "technicals", label: "Technicals", icon: Activity },
                { id: "models", label: "Models", icon: Activity },
                { id: "risk", label: "Risk", icon: Shield },
                { id: "news", label: "News", icon: BarChart3 },
                { id: "ai", label: "AI Insight", icon: Brain },
              ].map(tab => (
                <button key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "active" : ""}`}>
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="chart-container">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Price History</h3>
                  <PriceChart data={stockData.history} />
                </div>
                <div className="chart-container">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                    Monte Carlo Simulation
                    <span className="text-xs font-normal ml-2" style={{ color: "var(--text-muted)" }}>
                      {analysis.monte_carlo?.simulations?.toLocaleString()} paths · {days} days
                    </span>
                  </h3>
                  <MonteCarloChart data={analysis.monte_carlo} />
                </div>
                <div className="chart-container">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Price Distribution</h3>
                  <DistributionChart data={analysis.monte_carlo} currentPrice={currentPrice} />
                </div>
                <div className="chart-container">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Risk Assessment</h3>
                  <RiskGauge score={analysis.risk_score?.total_score || 0} category={analysis.risk_score?.category || "N/A"} components={analysis.risk_score?.components} />
                </div>
              </div>
            )}

            {activeTab === "fundamentals" && (
              <motion.div
                key="fundamentals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FundamentalDashboard info={stockData.info} />
              </motion.div>
            )}

            {activeTab === "technicals" && technicals && (
              <motion.div
                key="technicals"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <TechnicalDashboard technicals={technicals} />
              </motion.div>
            )}

            {activeTab === "models" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Models table */}
                <div className="glass-card p-5 lg:col-span-2">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Simulation Models</h3>
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Model</th>
                          <th>Expected Price</th>
                          <th>Direction</th>
                          <th>Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Monte Carlo Simulation", data: analysis.monte_carlo },
                          { name: "Geometric Brownian Motion", data: analysis.gbm },
                        ].map(model => {
                          const expected = model.data?.expected_price || 0
                          const prob = model.data?.prob_increase || 0
                          const isUp = expected > currentPrice
                          return (
                            <tr key={model.name}>
                              <td className="font-medium">{model.name}</td>
                              <td className="font-semibold" style={{ color: isUp ? "var(--accent-green)" : "var(--accent-red)" }}>
                                {formatCurrency(expected)}
                              </td>
                              <td>
                                <span className={`badge ${isUp ? "badge-green" : "badge-red"}`}>
                                  {isUp ? "↑ Bullish" : "↓ Bearish"}
                                </span>
                              </td>
                              <td>{(prob * 100).toFixed(1)}%</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="chart-container">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Confidence Intervals</h3>
                  <ConfidenceIntervalChart data={analysis.confidence_intervals} currentPrice={currentPrice} />
                </div>

                <div className="chart-container">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                    Volatility (21-Day Rolling)
                  </h3>
                  <VolatilityChart data={analysis.volatility} />
                </div>

                {/* Scenario Analysis */}
                {analysis.scenario_analysis && (
                  <div className="glass-card p-5 lg:col-span-2">
                    <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Historical Scenario Analysis</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Best Day</p>
                        <p className="text-lg font-bold" style={{ color: "var(--accent-green)" }}>
                          {(analysis.scenario_analysis.best_day.return * 100).toFixed(2)}%
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{analysis.scenario_analysis.best_day.date}</p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Worst Day</p>
                        <p className="text-lg font-bold" style={{ color: "var(--accent-red)" }}>
                          {(analysis.scenario_analysis.worst_day.return * 100).toFixed(2)}%
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{analysis.scenario_analysis.worst_day.date}</p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Positive Days</p>
                        <p className="text-lg font-bold" style={{ color: "var(--accent-green)" }}>
                          {(analysis.scenario_analysis.positive_days_pct * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-4 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Skewness</p>
                        <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                          {analysis.scenario_analysis.skewness?.toFixed(3)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "risk" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="chart-container">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Risk Score</h3>
                  <RiskGauge score={analysis.risk_score?.total_score || 0} category={analysis.risk_score?.category || ""} components={analysis.risk_score?.components} />
                </div>

                {/* VaR */}
                {analysis.var && (
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Value at Risk (95%)</h3>
                    <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>{analysis.var.description}</p>
                    <div className="space-y-3">
                      {[
                        { label: "Historical VaR", pct: analysis.var.historical_var_pct, dollar: analysis.var.historical_var_dollar },
                        { label: "Parametric VaR", pct: analysis.var.parametric_var_pct, dollar: analysis.var.parametric_var_dollar },
                        { label: "Conditional VaR (CVaR)", pct: analysis.var.conditional_var_pct, dollar: analysis.var.conditional_var_dollar },
                      ].map(v => (
                        <div key={v.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{v.label}</span>
                          <div className="text-right">
                            <span className="text-sm font-bold" style={{ color: "var(--accent-red)" }}>
                              -{(v.pct * 100).toFixed(2)}%
                            </span>
                            <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
                              (${v.dollar.toFixed(2)})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Return metrics */}
                {analysis.expected_return && (
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Return & Risk Metrics</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Annualized Return", value: `${(analysis.expected_return.annualized_return * 100).toFixed(2)}%`, color: analysis.expected_return.annualized_return > 0 ? "var(--accent-green)" : "var(--accent-red)" },
                        { label: "Sharpe Ratio", value: analysis.expected_return.sharpe_ratio.toFixed(3), color: analysis.expected_return.sharpe_ratio > 1 ? "var(--accent-green)" : "var(--text-primary)" },
                        { label: "Sortino Ratio", value: analysis.expected_return.sortino_ratio.toFixed(3), color: "var(--text-primary)" },
                        { label: "Max Drawdown", value: `${(analysis.expected_return.max_drawdown * 100).toFixed(2)}%`, color: "var(--accent-red)" },
                        { label: "CAGR", value: `${(analysis.expected_return.cagr * 100).toFixed(2)}%`, color: analysis.expected_return.cagr > 0 ? "var(--accent-green)" : "var(--accent-red)" },
                      ].map(m => (
                        <div key={m.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{m.label}</span>
                          <span className="text-sm font-bold" style={{ color: m.color }}>{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="chart-container">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Volatility Chart</h3>
                  <VolatilityChart data={analysis.volatility} />
                </div>
              </div>
            )}

            {activeTab === "news" && (
              <NewsPanel news={news} />
            )}

            {activeTab === "ai" && analysis.ai_insight && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass-card p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: "var(--gradient-primary)" }} />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(139,92,246,0.15)" }}>
                      <Brain size={20} style={{ color: "var(--accent-purple)" }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>AI Analysis</h3>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Generated from quantitative models</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {analysis.ai_insight.split("\n\n").map((para: string, i: number) => (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {para}
                      </p>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-lg" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} style={{ color: "var(--accent-orange)", marginTop: "2px" }} />
                      <p className="text-xs" style={{ color: "var(--accent-orange)" }}>
                        This is a probabilistic analysis, not a prediction. Past performance does not guarantee future results.
                        Always do your own research and consult a financial advisor.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!stockData && !loading && !error && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-24 text-center relative">
          {/* Decorative orbs */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full opacity-[0.06] blur-[80px]" style={{ background: "var(--accent-blue)" }} />
            <div className="w-48 h-48 rounded-full opacity-[0.04] blur-[60px] -ml-20 -mt-20" style={{ background: "var(--accent-purple)" }} />
          </div>
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 animate-float mx-auto"
              style={{ background: "var(--gradient-primary)", boxShadow: "0 8px 32px rgba(59,130,246,0.25)" }}>
              <BarChart3 size={34} color="white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 gradient-text tracking-tight">Start Your Analysis</h2>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Search for any stock ticker to run quantitative analysis with Monte Carlo simulations,
              risk assessment, and AI-powered research insights.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
