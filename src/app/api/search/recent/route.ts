import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { query, ticker } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Store in Prisma database
    await prisma.recentSearch.create({
      data: {
        userId: session.user.id,
        query: query,
        ticker: ticker || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Recent search log error:", error)
    return NextResponse.json({ error: "Failed to log search" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch the 5 most recent searches for this user
    const searches = await prisma.recentSearch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return NextResponse.json(searches)
  } catch (error) {
    console.error("Fetch recent search error:", error)
    return NextResponse.json({ error: "Failed to fetch searches" }, { status: 500 })
  }
}
