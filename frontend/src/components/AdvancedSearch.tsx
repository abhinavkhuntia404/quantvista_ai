"use client"

import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { Search, Loader2, TrendingUp, Building2, Globe2 } from "lucide-react"
import { searchAutocomplete, SearchSuggestion, logRecentSearch, getRecentSearches } from "@/lib/api"
import { motion, AnimatePresence } from "framer-motion"
import { Clock } from "lucide-react"

interface AdvancedSearchProps {
  onSelect: (ticker: string) => void
  initialTicker?: string
}

export default function AdvancedSearch({ onSelect, initialTicker = "" }: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialTicker)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setQuery(initialTicker)
    // Fetch recent searches on mount
    getRecentSearches().then(data => {
      if (Array.isArray(data)) setRecentSearches(data)
    })
  }, [initialTicker])

  useEffect(() => {
    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 1) {
        setSuggestions([])
        setOpen(false)
        return
      }

      setLoading(true)
      try {
        const results = await searchAutocomplete(query)
        setSuggestions(results)
        setOpen(true)
        setActiveIndex(-1)
      } catch (error) {
        console.error("Autocomplete error:", error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 300) // 300ms debounce
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        onSelect(query.toUpperCase())
        setOpen(false)
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0) {
        handleSelect(suggestions[activeIndex].symbol)
      } else {
        handleSelect(query.toUpperCase())
      }
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  const handleSelect = (ticker: string) => {
    setQuery(ticker)
    setOpen(false)
    onSelect(ticker)
    logRecentSearch(query, ticker)
  }

  const getIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'INDEX': return <Globe2 size={16} />
      case 'ETF': return <TrendingUp size={16} />
      case 'MUTUALFUND': return <TrendingUp size={16} />
      default: return <Building2 size={16} />
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <div className="relative flex items-center w-full">
        <Search size={18} className="absolute left-4" style={{ color: "var(--text-muted)" }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 0 && setOpen(true)}
          placeholder="Search companies, tickers, ETFs... (e.g., Apple, AAPL, RELIANCE.NS)"
          className="search-input"
          style={{ paddingRight: loading ? "40px" : "16px" }}
          autoComplete="off"
        />
        {loading && (
          <Loader2 size={18} className="absolute right-4 animate-spin" style={{ color: "var(--accent-blue)" }} />
        )}
      </div>

      <AnimatePresence>
        {open && (suggestions.length > 0 || (query.length === 0 && recentSearches.length > 0)) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden glass-card shadow-2xl"
            style={{ maxHeight: "400px", overflowY: "auto", zIndex: 100 }}
          >
            <div className="p-2">
              {query.length === 0 ? (
                <>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-3 pt-2" style={{ color: "var(--text-muted)" }}>
                    Recent Searches
                  </div>
                  {recentSearches.map((s, idx) => (
                    <div
                      key={`recent-${s.id}`}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                      onClick={() => handleSelect(s.ticker || s.query)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <Clock size={16} />
                        </div>
                        <div className="font-semibold text-sm truncate text-white">{s.ticker || s.query}</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-2 px-3 pt-2" style={{ color: "var(--text-muted)" }}>
                    Suggestions
                  </div>
                  {suggestions.map((s, idx) => {
                    const isActive = idx === activeIndex
                    return (
                      <div
                        key={`${s.symbol}-${idx}`}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-blue-500/15' : 'hover:bg-white/5'}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => handleSelect(s.symbol)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: isActive ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)" }}>
                            {getIcon(s.type)}
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-semibold text-sm truncate text-white">{s.symbol}</div>
                            <div className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>{s.shortname}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-3">
                          <span className="badge badge-blue text-[10px] py-0.5 px-2 mb-1">{s.exchange}</span>
                          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{s.type}</span>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
