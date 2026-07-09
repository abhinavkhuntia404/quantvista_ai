"use client"

import { useMemo } from "react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts"

interface VolatilityData {
  rolling_volatility: {
    dates: string[]
    values: number[]
  }
  volatility_5d: number
  volatility_21d: number
  volatility_63d: number
  volatility_252d: number
  regime: string
}

export default function VolatilityChart({ data }: { data: VolatilityData }) {
  const chartData = useMemo(() => {
    if (!data?.rolling_volatility?.dates?.length) return []
    return data.rolling_volatility.dates.map((date, i) => ({
      date,
      volatility: (data.rolling_volatility.values[i] * 100),
    }))
  }, [data])

  if (!chartData.length) return <div className="text-sm text-center py-10" style={{ color: "var(--text-muted)" }}>No data</div>

  const regimeColor = data.regime === "Low" ? "#10b981" :
    data.regime === "Moderate" ? "#f59e0b" :
    data.regime === "High" ? "#ef4444" : "#dc2626"

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ background: `${regimeColor}15`, color: regimeColor }}>
          {data.regime} Volatility
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Current: {(data.volatility_21d * 100).toFixed(1)}% annualized
        </span>
      </div>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,148,0.06)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "#64748b" }}
              tickFormatter={(v) => v.slice(5)}
              interval="preserveStartEnd"
              stroke="rgba(99,115,148,0.1)"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickFormatter={(v) => `${v.toFixed(0)}%`}
              stroke="rgba(99,115,148,0.1)"
              width={50}
            />
            <Tooltip
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(99,115,148,0.15)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e2e8f0",
              }}
              formatter={(value) => [`${Number(value).toFixed(2)}%`, "Volatility"]}
            />
            <Area
              type="monotone"
              dataKey="volatility"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#volGradient)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volatility stats */}
      <div className="grid grid-cols-4 gap-2 mt-3">
        {[
          { label: "5D", value: data.volatility_5d },
          { label: "21D", value: data.volatility_21d },
          { label: "63D", value: data.volatility_63d },
          { label: "252D", value: data.volatility_252d },
        ].map(v => (
          <div key={v.label} className="text-center p-2 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{v.label}</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {(v.value * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
