"use client"

import { useMemo } from "react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts"

interface PricePoint {
  date: string
  close: number
  volume: number
}

export default function PriceChart({ data }: { data: PricePoint[] }) {
  const chartData = useMemo(() => {
    // Show last 120 data points for clarity
    const sliced = data.slice(-120)
    return sliced.map(d => ({
      date: d.date,
      price: d.close,
      volume: d.volume,
    }))
  }, [data])

  const minPrice = Math.min(...chartData.map(d => d.price)) * 0.98
  const maxPrice = Math.max(...chartData.map(d => d.price)) * 1.02
  const priceChange = chartData.length > 1
    ? chartData[chartData.length - 1].price - chartData[0].price
    : 0
  const isPositive = priceChange >= 0

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3} />
              <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,148,0.08)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#64748b" }}
            tickFormatter={(v) => v.slice(5)}
            interval="preserveStartEnd"
            stroke="rgba(99,115,148,0.1)"
          />
          <YAxis
            domain={[minPrice, maxPrice]}
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
              fontSize: "12px",
              color: "#e2e8f0",
            }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
            labelFormatter={(l) => `Date: ${l}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: isPositive ? "#10b981" : "#ef4444" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
