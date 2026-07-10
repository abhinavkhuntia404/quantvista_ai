import type { Metadata } from "next"
import "./globals.css"
import AuthProvider from "@/components/AuthProvider"
import { ThemeProvider } from "@/components/ThemeProvider"

export const metadata: Metadata = {
  title: "QuantVista AI — Institutional Quantitative Research Platform",
  description: "AI-powered financial research and quantitative analytics platform. Monte Carlo simulations, risk management, fundamental analysis, and AI-generated insights for smarter investment decisions.",
  keywords: ["quantitative analysis", "Monte Carlo", "financial research", "risk management", "AI analytics", "portfolio analysis", "stock analysis"],
  openGraph: {
    title: "QuantVista AI — Institutional Quantitative Research",
    description: "The world's most beautiful AI-powered financial research platform. Quantitative analysis, risk management, and AI-driven insights.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased noise-overlay" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
