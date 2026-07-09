"use client"

import { TechnicalResult } from "@/lib/api"
import { Activity, ArrowDown, ArrowUp, Minus } from "lucide-react"

export default function TechnicalDashboard({ technicals }: { technicals: TechnicalResult }) {
  if (!technicals) return null

  const getSignalColor = (signal: string) => {
    if (signal.includes("Bullish")) return "var(--accent-green)"
    if (signal.includes("Bearish")) return "var(--accent-red)"
    return "var(--text-muted)"
  }
  
  const getSignalIcon = (signal: string) => {
    if (signal.includes("Bullish")) return <ArrowUp size={16} />
    if (signal.includes("Bearish")) return <ArrowDown size={16} />
    return <Minus size={16} />
  }

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6"
           style={{ background: getSignalColor(technicals.summary.overall).replace(')', ', 0.05)').replace('rgb', 'rgba') }}>
        
        <div>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
            Overall Technical Sentiment
          </h2>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black uppercase tracking-tight"
                style={{ color: getSignalColor(technicals.summary.overall) }}>
              {technicals.summary.overall}
            </h1>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="glass-card p-4 flex-1 text-center border-green-500/20 bg-green-500/5">
            <p className="text-sm font-medium text-green-500 mb-1">Bullish Signals</p>
            <p className="text-2xl font-bold text-green-400">{technicals.summary.bullish_signals}</p>
          </div>
          <div className="glass-card p-4 flex-1 text-center border-red-500/20 bg-red-500/5">
            <p className="text-sm font-medium text-red-500 mb-1">Bearish Signals</p>
            <p className="text-2xl font-bold text-red-400">{technicals.summary.bearish_signals}</p>
          </div>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Momentum (RSI) */}
        <div className="glass-card p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Relative Strength (RSI)</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>14-Day Period</p>
            </div>
            <Activity size={18} style={{ color: "var(--accent-blue)" }} />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{technicals.indicators.RSI.toFixed(2)}</span>
            <div className="flex items-center gap-1 font-semibold text-sm" style={{ color: getSignalColor(technicals.signals.RSI) }}>
              {getSignalIcon(technicals.signals.RSI)}
              {technicals.signals.RSI}
            </div>
          </div>
          {/* Visual Bar */}
          <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 relative">
            <div className="absolute top-0 bottom-0 bg-white/20 w-px" style={{ left: '30%' }} />
            <div className="absolute top-0 bottom-0 bg-white/20 w-px" style={{ left: '70%' }} />
            <div className="absolute top-0 bottom-0 rounded-full" 
                 style={{ width: '4px', background: 'var(--accent-blue)', left: `${Math.min(100, Math.max(0, technicals.indicators.RSI))}%`, marginLeft: '-2px' }} />
          </div>
          <div className="flex justify-between mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
            <span>Oversold (30)</span>
            <span>Overbought (70)</span>
          </div>
        </div>

        {/* Trend (MACD) */}
        <div className="glass-card p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>MACD (12, 26, 9)</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Trend following momentum</p>
            </div>
            <Activity size={18} style={{ color: "var(--accent-purple)" }} />
          </div>
          <div className="flex items-end justify-between mb-4">
            <span className="text-3xl font-bold">{technicals.indicators.MACD.toFixed(3)}</span>
            <div className="flex items-center gap-1 font-semibold text-sm" style={{ color: getSignalColor(technicals.signals.MACD) }}>
              {getSignalIcon(technicals.signals.MACD)}
              {technicals.signals.MACD}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white/5 p-2 rounded">
              <span className="text-xs block" style={{ color: "var(--text-muted)" }}>Signal</span>
              <span className="font-semibold">{technicals.indicators.MACD_Signal.toFixed(3)}</span>
            </div>
            <div className="bg-white/5 p-2 rounded">
              <span className="text-xs block" style={{ color: "var(--text-muted)" }}>Histogram</span>
              <span className="font-semibold">{technicals.indicators.MACD_Hist.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="glass-card p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Moving Averages</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Key Support/Resistance</p>
            </div>
            <Activity size={18} style={{ color: "var(--accent-cyan)" }} />
          </div>
          <div className="flex items-end justify-between mb-4">
            <div className="flex items-center gap-1 font-semibold text-sm" style={{ color: getSignalColor(technicals.signals.SMA_20_50_Cross) }}>
              {getSignalIcon(technicals.signals.SMA_20_50_Cross)}
              SMA Cross: {technicals.signals.SMA_20_50_Cross}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>SMA 20</span>
              <span className="font-semibold">${technicals.indicators.SMA_20.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>SMA 50</span>
              <span className="font-semibold">${technicals.indicators.SMA_50.toFixed(2)}</span>
            </div>
            {technicals.indicators.SMA_200 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>SMA 200</span>
                <span className="font-semibold">${technicals.indicators.SMA_200.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Volatility (Bollinger & ATR) */}
        <div className="glass-card p-5 md:col-span-2 lg:col-span-3">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Volatility & Bands</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Bollinger Upper Band</p>
              <p className="text-xl font-bold mb-2">${technicals.indicators.Upper_BB.toFixed(2)}</p>
            </div>
            
            <div className="border-l border-r px-4" style={{ borderColor: "var(--border)" }}>
              <p className="text-xs mb-1 text-center" style={{ color: "var(--text-muted)" }}>Band Signal</p>
              <div className="flex items-center justify-center h-full pb-4 gap-2 font-bold text-lg" 
                   style={{ color: getSignalColor(technicals.signals.Bollinger_Bands) }}>
                {getSignalIcon(technicals.signals.Bollinger_Bands)}
                {technicals.signals.Bollinger_Bands}
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Bollinger Lower Band</p>
              <p className="text-xl font-bold mb-2">${technicals.indicators.Lower_BB.toFixed(2)}</p>
            </div>

          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between" style={{ borderColor: "var(--border)" }}>
            <div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Average True Range (ATR): </span>
              <span className="text-sm font-semibold">${technicals.indicators.ATR.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>On-Balance Volume (OBV): </span>
              <span className="text-sm font-semibold">{(technicals.indicators.OBV / 1e6).toFixed(2)}M</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
