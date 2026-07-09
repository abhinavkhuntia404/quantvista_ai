import type { Metadata } from "next"
import "./globals.css"
import AuthProvider from "@/components/AuthProvider"
import { ThemeProvider } from "@/components/ThemeProvider"

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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-500" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        
        {/* Google Translate Script for Local Indian Languages */}
        <div id="google_translate_element" className="fixed bottom-4 left-4 z-[100] opacity-30 hover:opacity-100 transition-opacity" style={{ transform: "scale(0.8)", transformOrigin: "bottom left" }}></div>
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en', 
                includedLanguages: 'en,hi,bn,te,mr,ta,ur,gu,kn,ml,pa,or', 
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `
        }} />
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
      </body>
    </html>
  )
}
