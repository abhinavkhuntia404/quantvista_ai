import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuantVista AI — Quantitative Stock Analysis Platform",
  description: "Advanced quantitative stock analysis using Monte Carlo simulations, Geometric Brownian Motion, and probabilistic forecasting for smarter trading decisions.",
  keywords: ["stock analysis", "Monte Carlo", "quantitative finance", "trading", "risk analysis"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
