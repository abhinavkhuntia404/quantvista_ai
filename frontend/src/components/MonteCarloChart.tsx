"use client"

import { useMemo } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts"

interface MonteCarloData {
  sample_paths: number[][]
  current_price: number
  expected_price: number
  percentiles: { [key: string]: number }
  days: number
}

export default function MonteCarloChart({ data }: { data: MonteCarloData }) {
  const chartData = useMemo(() => {
    if (!data?.sample_paths?.length) return []

    const paths = data.sample_paths
    const numDays = paths.length
    const numPaths = Math.min(80, paths[0]?.length || 0)

    const result: any[] = []
    for (let day = 0; day < numDays; day++) {
      const point: any = { day }
      for (let p = 0; p < numPaths; p++) {
        point[`p${p}`] = paths[day]?.[p] || 0
      }
      // Add percentile lines
      if (paths[day]) {
        const dayPrices = paths[day].sort((a: number, b: number) => a - b)
        point.p5 = dayPrices[Math.floor(dayPrices.length * 0.05)]
        point.p50 = dayPrices[Math.floor(dayPrices.length * 0.50)]
        point.p95 = dayPrices[Math.floor(dayPrices.length * 0.95)]
      }
      result.push(point)
    }
    return result
  }, [data])

  if (!chartData.length) return <div className="text-sm text-center py-10" style={{ color: "var(--text-muted)" }}>No data</div>

  const numPaths = Math.min(80, data.sample_paths[0]?.length || 0)

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,148,0.06)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#64748b" }}
            label={{ value: "Trading Days", position: "bottom", fontSize: 10, fill: "#64748b", offset: -5 }}
            stroke="rgba(99,115,148,0.1)"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#64748b" }}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            stroke="rgba(99,115,148,0.1)"
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid rgba(99,115,148,0.15)",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#e2e8f0",
            }}
            formatter={(value, name) => {
              const v = Number(value)
              if (name === "p5") return [`$${v.toFixed(2)}`, "5th Percentile"]
              if (name === "p50") return [`$${v.toFixed(2)}`, "Median"]
              if (name === "p95") return [`$${v.toFixed(2)}`, "95th Percentile"]
              return null
            }}
          />
          {/* Individual paths */}
          {Array.from({ length: numPaths }).map((_, i) => (
            <Line
              key={i}
              type="monotone"
              dataKey={`p${i}`}
              stroke="#3b82f6"
              strokeWidth={0.5}
              strokeOpacity={0.08}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          ))}
          {/* Percentile lines */}
          <Line type="monotone" dataKey="p5" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          <Line type="monotone" dataKey="p50" stroke="#f59e0b" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="p95" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          <ReferenceLine y={data.current_price} stroke="#6366f1" strokeDasharray="3 3" strokeWidth={1} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        {[
          { label: "5th %ile", color: "#ef4444" },
          { label: "Median", color: "#f59e0b" },
          { label: "95th %ile", color: "#10b981" },
          { label: "Current", color: "#6366f1" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className="w-3 h-0.5 rounded" style={{ background: l.color }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
