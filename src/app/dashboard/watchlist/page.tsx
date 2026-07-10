"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, Plus, Trash2, TrendingUp, TrendingDown, Search, BarChart3, RefreshCw } from "lucide-react"
import { searchStock, type StockData } from "@/lib/api"
import { formatCurrency, getExchangeInfo } from "@/lib/utils"

interface WatchlistItem {
  ticker: string
  name: string
  price: number
  change: number
  changePct: number
  currency: string
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [newTicker, setNewTicker] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addToWatchlist = async () => {
    const t = newTicker.trim().toUpperCase()
    if (!t || watchlist.some(w => w.ticker === t)) return

    setLoading(true)
    setError(null)
    try {
      const data: StockData = await searchStock(t)
      const info = data.info
      const ex = getExchangeInfo(info.exchange, info.ticker)
      const change = info.previous_close ? info.current_price - info.previous_close : 0
      const changePct = info.previous_close ? change / info.previous_close : 0

      setWatchlist(prev => [...prev, {
        ticker: info.ticker,
        name: info.name,
        price: info.current_price,
        change,
        changePct,
        currency: ex.currency,
      }])
      setNewTicker("")
    } catch (err: any) {
      setError(err.message || "Could not find ticker")
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(prev => prev.filter(w => w.ticker !== ticker))
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(251,191,36,0.12)" }}>
          <Star size={20} style={{ color: "var(--accent-amber)" }} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Track stocks you're interested in</p>
        </div>
      </div>

      {/* Add ticker */}
      <div className="glass-card p-5 mb-6" style={{ boxShadow: "none" }}>
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && addToWatchlist()}
              placeholder="Add ticker (e.g. AAPL, RELIANCE.NS)"
              className="search-input"
            />
          </div>
          <button onClick={addToWatchlist} className="btn-primary" disabled={loading}>
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}
            Add
          </button>
        </div>
        {error && (
          <p className="text-xs mt-2" style={{ color: "var(--accent-red)" }}>{error}</p>
        )}
      </div>

      {/* Watchlist Items */}
      <AnimatePresence>
        {watchlist.length > 0 ? (
          <div className="space-y-2">
            {watchlist.map((item, i) => (
              <motion.div
                key={item.ticker}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center justify-between group"
                style={{ boxShadow: "none" }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                    style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                    {item.ticker.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.ticker}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(item.price, item.currency)}</p>
                    <p className="text-xs flex items-center gap-1 justify-end"
                      style={{ color: item.change >= 0 ? "var(--accent-green)" : "var(--accent-red)" }}>
                      {item.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {item.change >= 0 ? "+" : ""}{(item.changePct * 100).toFixed(2)}%
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(item.ticker)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all hover:bg-red-500/10"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-float"
              style={{ background: "rgba(251,191,36,0.1)" }}>
              <Star size={28} style={{ color: "var(--accent-amber)" }} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No stocks in your watchlist</h3>
            <p className="text-sm max-w-xs" style={{ color: "var(--text-muted)" }}>
              Add tickers above to track stocks and quickly access their analysis.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
