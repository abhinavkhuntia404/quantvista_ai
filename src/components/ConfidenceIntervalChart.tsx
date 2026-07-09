"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from "recharts"

interface ConfidenceData {
  intervals: {
    [key: string]: {
      lower: number
      upper: number
      width: number
      width_pct: number
    }
  }
  current_price: number
}

export default function ConfidenceIntervalChart({
  data,
  currentPrice,
}: {
  data: ConfidenceData
  currentPrice: number
}) {
  if (!data?.intervals) return <div className="text-sm text-center py-10" style={{ color: "var(--text-muted)" }}>No data</div>

  const chartData = Object.entries(data.intervals).map(([level, vals]) => ({
    level,
    lower: vals.lower,
    upper: vals.upper,
    range: vals.upper - vals.lower,
    base: vals.lower,
  }))

  const colors = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"]

  return (
    <div>
      <div className="space-y-3">
        {chartData.map((ci, i) => {
          const totalRange = chartData[chartData.length - 1]?.upper - chartData[chartData.length - 1]?.lower || 1
          const minPrice = chartData[chartData.length - 1]?.lower || 0
          const leftPct = ((ci.lower - minPrice) / totalRange) * 100
          const widthPct = (ci.range / totalRange) * 100

          return (
            <div key={ci.level}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: colors[i % colors.length] }}>
                  {ci.level} Confidence
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  ${ci.lower.toFixed(2)} — ${ci.upper.toFixed(2)}
                </span>
              </div>
              <div className="h-6 rounded-lg relative overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                <div
                  className="h-full rounded-lg transition-all duration-700"
                  style={{
                    background: `${colors[i % colors.length]}30`,
                    border: `1px solid ${colors[i % colors.length]}50`,
                    marginLeft: `${leftPct}%`,
                    width: `${widthPct}%`,
                  }}
                />
                {/* Current price marker */}
                <div
                  className="absolute top-0 h-full w-0.5"
                  style={{
                    left: `${((currentPrice - minPrice) / totalRange) * 100}%`,
                    background: "#ef4444",
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-2 mt-3 justify-center">
        <div className="w-3 h-0.5" style={{ background: "#ef4444" }} />
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Current Price: ${currentPrice.toFixed(2)}</span>
      </div>
    </div>
  )
}
