import { NextResponse } from "next/server"
import { setCachedData } from "@/lib/redis"
import { API_BASE } from "@/lib/utils"

export const maxDuration = 60 // Max duration for Vercel Cron jobs

// This array contains the tickers that are popular and should be actively cached.
const CACHE_TARGETS = ["AAPL", "MSFT", "TSLA", "NVDA", "GOOGL"]

export async function GET(request: Request) {
  // Security check: ensure the request is actually coming from Vercel Cron
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 })
  }

  console.log("Starting background market data refresh...")

  try {
    const promises = CACHE_TARGETS.map(async (ticker) => {
      try {
        // 1. Fetch latest core stock data
        const stockRes = await fetch(`${API_BASE}/api/stocks/search/${ticker}?period=2y`)
        if (stockRes.ok) {
          const stockData = await stockRes.json()
          await setCachedData(`stock:${ticker}:2y`, stockData, 3600) // 1 hour cache
        }

        // 2. Fetch latest AI analysis 
        const analysisRes = await fetch(`${API_BASE}/api/analysis/full/${ticker}?days=30&period=2y`)
        if (analysisRes.ok) {
          const analysisData = await analysisRes.json()
          await setCachedData(`analysis:full:${ticker}:30:2y`, analysisData, 3600)
        }
        
        return { ticker, status: "success" }
      } catch (err) {
        console.error(`Failed to refresh cache for ${ticker}:`, err)
        return { ticker, status: "failed", error: String(err) }
      }
    })

    const results = await Promise.allSettled(promises)
    
    return NextResponse.json({
      success: true,
      message: "Market data refresh complete",
      results: results
    })
    
  } catch (error) {
    console.error("Cron Job Error:", error)
    return NextResponse.json({ error: "Cron execution failed" }, { status: 500 })
  }
}
