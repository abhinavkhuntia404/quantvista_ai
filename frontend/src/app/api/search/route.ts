import { NextResponse } from "next/server"
import { getCachedData, setCachedData } from "@/lib/redis"
import { API_BASE } from "@/lib/utils"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json([])
  }

  const cacheKey = `search:autocomplete:${query.toLowerCase()}`

  try {
    // 1. Check Redis Cache First
    const cachedResults = await getCachedData(cacheKey)
    if (cachedResults) {
      return NextResponse.json(cachedResults)
    }

    // 2. Cache Miss: Fetch from Python Backend
    const res = await fetch(`${API_BASE}/api/stocks/autocomplete?q=${encodeURIComponent(query)}`)
    if (!res.ok) {
      return NextResponse.json([], { status: 500 })
    }

    const data = await res.json()

    // 3. Store in Redis Cache (expire in 2 hours)
    await setCachedData(cacheKey, data, 7200)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json([], { status: 500 })
  }
}
