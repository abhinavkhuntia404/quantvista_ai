"use client"

import { useMemo } from "react"
import dynamic from "next/dynamic"

// Dynamically import plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full animate-pulse bg-white/5 rounded-lg flex items-center justify-center text-sm text-slate-500">Loading interactive chart...</div> 
})

interface PricePoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function PriceChart({ data }: { data: PricePoint[] }) {
  const chartData = useMemo(() => {
    return {
      x: data.map(d => d.date),
      open: data.map(d => d.open),
      high: data.map(d => d.high),
      low: data.map(d => d.low),
      close: data.map(d => d.close),
      volume: data.map(d => d.volume),
      colors: data.map(d => d.close >= d.open ? '#10b981' : '#ef4444')
    }
  }, [data])

  return (
    <div style={{ width: "100%", height: 500 }}>
      <Plot
        data={[
          {
            x: chartData.x,
            close: chartData.close,
            high: chartData.high,
            low: chartData.low,
            open: chartData.open,
            increasing: { line: { color: '#10b981' } },
            decreasing: { line: { color: '#ef4444' } },
            type: 'candlestick',
            name: 'Price',
            yaxis: 'y'
          },
          {
            x: chartData.x,
            y: chartData.volume,
            type: 'bar',
            name: 'Volume',
            yaxis: 'y2',
            marker: { color: chartData.colors, opacity: 0.3 }
          }
        ]}
        layout={{
          autosize: true,
          margin: { l: 50, r: 20, t: 20, b: 40 },
          paper_bgcolor: 'transparent',
          plot_bgcolor: 'transparent',
          font: { color: '#94a3b8', family: 'Inter' },
          dragmode: 'zoom',
          hovermode: 'x unified',
          xaxis: {
            rangeslider: { visible: false },
            showgrid: true,
            gridcolor: 'rgba(99,115,148,0.1)',
            type: 'date',
            zeroline: false
          },
          yaxis: {
            domain: [0.3, 1],
            showgrid: true,
            gridcolor: 'rgba(99,115,148,0.1)',
            zeroline: false,
          },
          yaxis2: {
            domain: [0, 0.25],
            showgrid: false,
            showticklabels: false,
            zeroline: false
          },
          showlegend: false,
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
        config={{ 
          displayModeBar: true, 
          scrollZoom: true,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          displaylogo: false
        }}
      />
    </div>
  )
}
