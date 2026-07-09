"use client"

import { useState, useEffect } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Download, Loader2 } from "lucide-react"
import { ResearchReport } from "./ResearchReport"
import { StockData, AnalysisResult, TechnicalResult } from "@/lib/api"

interface DownloadReportButtonProps {
  stockData: StockData
  analysis: AnalysisResult
  technicals: TechnicalResult
  fileName: string
}

export function DownloadReportButton({ stockData, analysis, technicals, fileName }: DownloadReportButtonProps) {
  const [isClient, setIsClient] = useState(false)

  // Hydration fix for React-PDF in Next.js
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <PDFDownloadLink
      document={<ResearchReport stockData={stockData} analysis={analysis} technicals={technicals} />}
      fileName={fileName}
      className="btn-primary flex items-center gap-2 text-sm"
    >
      {/* @ts-ignore */}
      {({ blob, url, loading, error }) =>
        loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Generating...
          </>
        ) : (
          <>
            <Download size={16} /> Download Report
          </>
        )
      }
    </PDFDownloadLink>
  )
}
