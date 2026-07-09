"use client"

import { useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell
} from "recharts"

interface DistributionData {
  final_prices_histogram: number[]
  histogram_edges: number[]
  current_price: number
  expected_price: number
}

export default function DistributionChart({
  data,
  currentPrice,
}: {
  data: DistributionData
  currentPrice: number
}) {
  const chartData = useMemo(() => {
    if (!data?.final_prices_histogram?.length) return []

    return data.final_prices_histogram.map((count: number, i: number) => {
      const center = (data.histogram_edges[i] + data.histogram_edges[i + 1]) / 2
      return {
        price: center,
        count,
        label: `$${center.toFixed(0)}`,
      }
    })
  }, [data])

  if (!chartData.length) return <div className="text-sm text-center py-10" style={{ color: "var(--text-muted)" }}>No data</div>

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} barCategoryGap={0}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,115,148,0.06)" />
          <XAxis
            dataKey="price"
            tick={{ fontSize: 9, fill: "#64748b" }}
            tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
            interval="preserveStartEnd"
            stroke="rgba(99,115,148,0.1)"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#64748b" }}
            stroke="rgba(99,115,148,0.1)"
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid rgba(99,115,148,0.15)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#e2e8f0",
            }}
            formatter={(value) => [Number(value), "Frequency"]}
            labelFormatter={(l) => `Price: $${Number(l).toFixed(2)}`}
          />
          <ReferenceLine x={currentPrice} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Current", fill: "#ef4444", fontSize: 10 }} />
          <ReferenceLine x={data.expected_price} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Expected", fill: "#10b981", fontSize: 10 }} />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.price < currentPrice ? "rgba(239,68,68,0.6)" : "rgba(59,130,246,0.6)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
