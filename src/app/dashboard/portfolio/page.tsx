"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Trash2, BarChart3, RefreshCw, Briefcase,
  TrendingUp, Shield, PieChart, AlertTriangle
} from "lucide-react"
import { analyzePortfolio, type PortfolioResult } from "@/lib/api"
import { formatPercent } from "@/lib/utils"

export default function PortfolioPage() {
  const [tickers, setTickers] = useState<string[]>(["AAPL", "MSFT"])
  const [weights, setWeights] = useState<string[]>(["0.5", "0.5"])
  const [newTicker, setNewTicker] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PortfolioResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const addTicker = () => {
    if (!newTicker.trim()) return
    const t = newTicker.trim().toUpperCase()
    if (tickers.includes(t)) return
    const newCount = tickers.length + 1
    const equalWeight = (1 / newCount).toFixed(4)
    setTickers([...tickers, t])
    setWeights(Array(newCount).fill(equalWeight))
    setNewTicker("")
  }

  const removeTicker = (index: number) => {
    if (tickers.length <= 2) return
    const newTickers = tickers.filter((_, i) => i !== index)
    const equalWeight = (1 / newTickers.length).toFixed(4)
    setTickers(newTickers)
    setWeights(Array(newTickers.length).fill(equalWeight))
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    try {
      const w = weights.map(Number)
      const sum = w.reduce((a, b) => a + b, 0)
      const normalized = w.map(v => v / sum) // Normalize to sum to 1
      const res = await analyzePortfolio(tickers, normalized)
      setResult(res)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(139,92,246,0.15)" }}>
          <Briefcase size={20} style={{ color: "var(--accent-purple)" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Portfolio Analysis</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Analyze risk, return, and diversification</p>
        </div>
      </div>

      {/* Portfolio Builder */}
      <div className="glass-card p-5 mb-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Build Portfolio</h3>

        <div className="space-y-2 mb-4">
          {tickers.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 p-3 rounded-lg text-sm font-medium"
                style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                {t}
              </div>
              <div className="relative w-28">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={weights[i]}
                  onChange={(e) => {
                    const newWeights = [...weights]
                    newWeights[i] = e.target.value
                    setWeights(newWeights)
                  }}
                  className="w-full p-3 rounded-lg text-sm text-right"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                  style={{ color: "var(--text-muted)" }}>wt</span>
              </div>
              <button onClick={() => removeTicker(i)}
                className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                style={{ color: "var(--text-muted)" }}
                disabled={tickers.length <= 2}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && addTicker()}
            placeholder="Add ticker (e.g. GOOGL)"
            className="flex-1 p-3 rounded-lg text-sm"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              outline: "none",
            }}
          />
          <button onClick={addTicker} className="btn-secondary text-sm">
            <Plus size={16} /> Add
          </button>
          <button onClick={handleAnalyze} className="btn-primary text-sm" disabled={loading}>
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <BarChart3 size={16} />}
            Analyze
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl mb-6 flex items-center gap-3"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <AlertTriangle size={18} style={{ color: "var(--accent-red)" }} />
          <span className="text-sm" style={{ color: "var(--accent-red)" }}>{error}</span>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Portfolio Return", value: `${(result.portfolio_return * 100).toFixed(2)}%`, icon: TrendingUp, color: result.portfolio_return > 0 ? "var(--accent-green)" : "var(--accent-red)" },
                { label: "Portfolio Volatility", value: `${(result.portfolio_volatility * 100).toFixed(2)}%`, icon: BarChart3, color: "var(--accent-orange)" },
                { label: "Sharpe Ratio", value: result.sharpe_ratio.toFixed(3), icon: Shield, color: result.sharpe_ratio > 1 ? "var(--accent-green)" : "var(--text-primary)" },
                { label: "Diversification", value: `${result.diversification_score.toFixed(0)}/100`, icon: PieChart, color: "var(--accent-purple)" },
              ].map((card, i) => (
                <motion.div key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="stat-card">
                  <div className="flex items-center gap-2 mb-2">
                    <card.icon size={14} style={{ color: card.color }} />
                    <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{card.label}</span>
                  </div>
                  <p className="text-xl font-bold" style={{ color: card.color }}>{card.value}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stock Stats */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Individual Stocks</h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticker</th>
                      <th>Weight</th>
                      <th>Return</th>
                      <th>Volatility</th>
                      <th>Sharpe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.stock_stats.map((s: any) => (
                      <tr key={s.ticker}>
                        <td className="font-medium">{s.ticker}</td>
                        <td>{(s.weight * 100).toFixed(1)}%</td>
                        <td style={{ color: s.annualized_return > 0 ? "var(--accent-green)" : "var(--accent-red)" }}>
                          {(s.annualized_return * 100).toFixed(2)}%
                        </td>
                        <td>{(s.annualized_volatility * 100).toFixed(2)}%</td>
                        <td>{s.sharpe_ratio.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Correlation Matrix */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Correlation Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-center">
                    <thead>
                      <tr>
                        <th className="p-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}></th>
                        {result.correlation_matrix.labels.map(l => (
                          <th key={l} className="p-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{l}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.correlation_matrix.labels.map((row, i) => (
                        <tr key={row}>
                          <td className="p-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{row}</td>
                          {result.correlation_matrix.values[i].map((val: number, j: number) => {
                            const intensity = Math.abs(val)
                            const color = val > 0
                              ? `rgba(16, 185, 129, ${intensity * 0.4})`
                              : `rgba(239, 68, 68, ${intensity * 0.4})`
                            return (
                              <td key={j} className="p-2 text-xs font-medium rounded"
                                style={{
                                  background: i === j ? "rgba(59,130,246,0.15)" : color,
                                  color: "var(--text-primary)"
                                }}>
                                {val.toFixed(2)}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
            style={{ background: "rgba(139,92,246,0.15)" }}>
            <PieChart size={28} style={{ color: "var(--accent-purple)" }} />
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Add stocks and click Analyze to see portfolio metrics.
          </p>
        </div>
      )}
    </div>
  )
}
