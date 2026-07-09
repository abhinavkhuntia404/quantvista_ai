"use client"

import { StockInfo } from "@/lib/api"
import { formatCurrency, formatPercent, formatMarketCap, getExchangeInfo } from "@/lib/utils"
import { Building2, DollarSign, PieChart, TrendingUp, Briefcase } from "lucide-react"

export default function FundamentalDashboard({ info }: { info: StockInfo }) {
  if (!info) return null

  const currency = getExchangeInfo(info.exchange, info.ticker).currency

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Valuation Section */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <DollarSign size={18} style={{ color: "var(--accent-blue)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Valuation</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Market Cap</span>
              <span className="font-bold">{info.market_cap ? formatMarketCap(info.market_cap) : "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Enterprise Value</span>
              <span className="font-bold">{info.enterprise_value ? formatMarketCap(info.enterprise_value) : "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Trailing P/E</span>
              <span className="font-bold text-blue-400">{info.pe_ratio?.toFixed(2) || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Forward P/E</span>
              <span className="font-bold text-blue-400">{info.forward_pe?.toFixed(2) || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>PEG Ratio</span>
              <span className="font-bold">{info.peg_ratio?.toFixed(2) || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Price to Book (P/B)</span>
              <span className="font-bold">{info.price_to_book?.toFixed(2) || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Profitability Section */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <TrendingUp size={18} style={{ color: "var(--accent-green)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Profitability & Margins</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Return on Equity (ROE)</span>
              <span className="font-bold text-green-400">{info.return_on_equity ? formatPercent(info.return_on_equity) : "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Profit Margin</span>
              <span className="font-bold">{info.profit_margin ? formatPercent(info.profit_margin) : "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Operating Margin</span>
              <span className="font-bold">{info.operating_margin ? formatPercent(info.operating_margin) : "N/A"}</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4 relative">
              <div className="absolute left-0 top-0 bottom-0 bg-green-500" style={{ width: `${Math.min(100, Math.max(0, (info.profit_margin || 0) * 100))}%` }} />
            </div>
            <p className="text-xs text-center mt-1" style={{ color: "var(--text-muted)" }}>Profit Margin Visualized</p>
          </div>
        </div>

        {/* Financial Health & Dividends */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <Briefcase size={18} style={{ color: "var(--accent-purple)" }} />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Financial Health</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Debt to Equity</span>
              <span className={`font-bold ${info.debt_to_equity && info.debt_to_equity > 100 ? "text-red-400" : "text-green-400"}`}>
                {info.debt_to_equity ? (info.debt_to_equity / 100).toFixed(2) : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Dividend Yield</span>
              <span className="font-bold text-purple-400">{info.dividend_yield ? formatPercent(info.dividend_yield) : "0.00%"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Beta (1Y)</span>
              <span className="font-bold">{info.beta?.toFixed(2) || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>52W High</span>
              <span className="font-bold">{info.fifty_two_week_high ? formatCurrency(info.fifty_two_week_high, currency) : "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>52W Low</span>
              <span className="font-bold">{info.fifty_two_week_low ? formatCurrency(info.fifty_two_week_low, currency) : "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Company Description */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={18} style={{ color: "var(--text-primary)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Company Profile</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {info.description || "No company description available."}
        </p>
      </div>
    </div>
  )
}
