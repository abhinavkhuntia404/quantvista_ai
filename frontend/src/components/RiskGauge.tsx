"use client"

import { motion } from "framer-motion"

interface RiskGaugeProps {
  score: number
  category: string
  components?: {
    volatility: number
    drawdown: number
    tail_risk: number
    volatility_trend: number
  }
}

export default function RiskGauge({ score, category, components }: RiskGaugeProps) {
  const normalizedScore = Math.min(100, Math.max(0, score))
  const angle = (normalizedScore / 100) * 180 - 90 // -90 to 90 degrees

  const getColor = (s: number) => {
    if (s < 25) return "#10b981"
    if (s < 50) return "#f59e0b"
    if (s < 75) return "#ef4444"
    return "#dc2626"
  }

  const color = getColor(normalizedScore)

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative" style={{ width: 220, height: 130 }}>
        <svg viewBox="0 0 220 130" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 20 120 A 90 90 0 0 1 200 120"
            fill="none"
            stroke="rgba(99,115,148,0.15)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Colored arc segments */}
          <path d="M 20 120 A 90 90 0 0 1 65 42" fill="none" stroke="#10b981" strokeWidth="16" strokeLinecap="round" strokeOpacity="0.3" />
          <path d="M 65 42 A 90 90 0 0 1 110 30" fill="none" stroke="#f59e0b" strokeWidth="16" strokeOpacity="0.3" />
          <path d="M 110 30 A 90 90 0 0 1 155 42" fill="none" stroke="#ef4444" strokeWidth="16" strokeOpacity="0.3" />
          <path d="M 155 42 A 90 90 0 0 1 200 120" fill="none" stroke="#dc2626" strokeWidth="16" strokeLinecap="round" strokeOpacity="0.3" />

          {/* Needle */}
          <motion.line
            x1="110"
            y1="120"
            x2="110"
            y2="45"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "110px 120px" }}
          />
          {/* Center dot */}
          <circle cx="110" cy="120" r="6" fill={color} />
          <circle cx="110" cy="120" r="3" fill="var(--bg-primary)" />
        </svg>

        {/* Score text */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <motion.p
            className="text-3xl font-black"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {normalizedScore.toFixed(0)}
          </motion.p>
        </div>
      </div>

      <p className="text-sm font-semibold mt-2" style={{ color }}>{category}</p>

      {/* Component breakdown */}
      {components && (
        <div className="w-full mt-4 space-y-2">
          {[
            { label: "Volatility", value: components.volatility, max: 40 },
            { label: "Drawdown", value: components.drawdown, max: 25 },
            { label: "Tail Risk", value: components.tail_risk, max: 20 },
            { label: "Vol Trend", value: components.volatility_trend, max: 15 },
          ].map((comp) => (
            <div key={comp.label}>
              <div className="flex justify-between mb-1">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{comp.label}</span>
                <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                  {comp.value.toFixed(1)}/{comp.max}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-secondary)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: getColor((comp.value / comp.max) * 100) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(comp.value / comp.max) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
