"use client"

import { motion } from "framer-motion"
import { ExternalLink, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import type { NewsResult } from "@/lib/api"

export default function NewsPanel({ news }: { news: NewsResult | null }) {
  if (!news) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          News data unavailable. Search a stock to load news.
        </p>
      </div>
    )
  }

  const sentimentColor = news.sentiment_summary.overall === "Bullish"
    ? "var(--accent-green)"
    : news.sentiment_summary.overall === "Bearish"
    ? "var(--accent-red)"
    : "var(--accent-orange)"

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sentiment Summary */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Market Sentiment
        </h3>
        <div className="flex flex-col items-center">
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
            style={{ background: `${sentimentColor}15`, border: `2px solid ${sentimentColor}` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span className="text-2xl font-black" style={{ color: sentimentColor }}>
              {news.sentiment_summary.score > 0 ? "+" : ""}{news.sentiment_summary.score.toFixed(0)}
            </span>
          </motion.div>
          <p className="text-lg font-bold" style={{ color: sentimentColor }}>
            {news.sentiment_summary.overall}
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4 w-full">
            <div className="text-center p-2 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
              <ThumbsUp size={14} className="mx-auto mb-1" style={{ color: "var(--accent-green)" }} />
              <p className="text-lg font-bold" style={{ color: "var(--accent-green)" }}>
                {news.sentiment_summary.positive_count}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Positive</p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
              <Minus size={14} className="mx-auto mb-1" style={{ color: "var(--accent-orange)" }} />
              <p className="text-lg font-bold" style={{ color: "var(--accent-orange)" }}>
                {news.sentiment_summary.neutral_count}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Neutral</p>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: "var(--bg-secondary)" }}>
              <ThumbsDown size={14} className="mx-auto mb-1" style={{ color: "var(--accent-red)" }} />
              <p className="text-lg font-bold" style={{ color: "var(--accent-red)" }}>
                {news.sentiment_summary.negative_count}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Negative</p>
            </div>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="lg:col-span-2 space-y-3">
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          Latest News
        </h3>
        {news.news.length === 0 ? (
          <div className="glass-card p-4 text-center">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No recent news available.</p>
          </div>
        ) : (
          news.news.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex items-start gap-3 group"
            >
              <div
                className="w-2 h-2 rounded-full mt-2 shrink-0"
                style={{
                  background:
                    item.sentiment === "Positive" ? "var(--accent-green)" :
                    item.sentiment === "Negative" ? "var(--accent-red)" : "var(--accent-orange)"
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium leading-tight" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h4>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={14} style={{ color: "var(--text-muted)" }} />
                    </a>
                  )}
                </div>
                {item.summary && (
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                    {item.summary}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2">
                  {item.publisher && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{item.publisher}</span>
                  )}
                  <span className={`badge text-xs ${
                    item.sentiment === "Positive" ? "badge-green" :
                    item.sentiment === "Negative" ? "badge-red" : "badge-yellow"
                  }`}>
                    {item.sentiment}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
