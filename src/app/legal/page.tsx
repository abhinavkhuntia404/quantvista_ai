"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, ArrowLeft } from "lucide-react"

export default function LegalPage() {
  return (
    <div className="min-h-screen p-6 md:p-12" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-medium hover:text-blue-500 transition-colors" style={{ color: "var(--text-secondary)" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 md:p-12">
          <div className="w-16 h-16 rounded-2xl mb-8 flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
            <Shield size={32} color="white" />
          </div>
          <h1 className="text-4xl font-bold mb-8">Legal & Compliance</h1>
          
          <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>1. Terms of Service</h2>
              <p>Welcome to QuantVista AI. By accessing or using our platform, you agree to be bound by these Terms of Service. Our services are intended for educational and informational purposes only. We provide quantitative analysis tools and financial data aggregation, but we do not guarantee the accuracy, completeness, or timeliness of the information provided.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>2. Financial Disclaimer</h2>
              <p className="font-semibold" style={{ color: "var(--accent-orange)" }}>QuantVista AI is not a registered investment advisor, broker-dealer, or financial institution.</p>
              <p className="mt-2">The information, charts, algorithms, and AI insights provided on this platform are for informational purposes only and do not constitute financial advice, investment recommendations, or an offer to buy or sell any securities. Trading involves significant risk of loss. Past performance is not indicative of future results. You should consult with a licensed financial professional before making any investment decisions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>3. Privacy Policy</h2>
              <p>We take your privacy seriously. QuantVista AI only collects information necessary to provide our services, such as authentication credentials via Google OAuth. We do not store sensitive personal financial data, bank account information, or Social Security numbers. All data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS protocols.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>4. Data Processing & Cache</h2>
              <p>To provide low-latency analytics, we cache popular search queries and market data in our Redis infrastructure. This data is anonymized and does not contain user-identifiable information. Financial market data is sourced from third-party APIs (e.g., Yahoo Finance) and is subject to their respective terms of use.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
