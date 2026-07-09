"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  BarChart3, TrendingUp, Shield, Brain, LineChart,
  ChevronRight, Star, Zap, Target, PieChart, ArrowRight,
  CheckCircle2, Mail, ChevronDown, Globe, MessageCircle
} from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: session, status } = useSession()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const isSignedIn = status === "authenticated"

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <BarChart3 size={22} color="white" />
            </div>
            <div>
              <span className="text-lg font-bold gradient-text">QuantVista</span>
              <span className="text-lg font-light" style={{ color: "var(--text-secondary)" }}> AI</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "FAQ"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition-colors hover:text-blue-400"
                style={{ color: "var(--text-secondary)" }}>
                {item}
              </a>
            ))}
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="btn-primary text-sm">
                  Dashboard <ArrowRight size={16} />
                </Link>
                <Link href="/api/auth/signout" className="text-sm font-medium hover:text-blue-400" style={{ color: "var(--text-secondary)" }}>
                  Sign Out
                </Link>
              </>
            ) : (
              <Link href="/api/auth/signin" className="btn-primary text-sm flex items-center gap-2">
                Sign In <ArrowRight size={16} />
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 glass-light border border-blue-500/20 shadow-xl shadow-blue-500/10">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">QuantVista AI 2.0 is live</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              Institutional Grade <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-gradient-shift bg-[length:200%_auto]">
                Quantitative Analysis
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Harness the power of Monte Carlo simulations, Geometric Brownian Motion, and AI-driven market insights. Built for modern investors.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={isSignedIn ? "/dashboard" : "/api/auth/signin"} 
                className="btn-primary text-lg px-8 py-4 rounded-full shadow-2xl shadow-blue-500/30 hover:scale-105 transition-transform">
                Start Analyzing Free <ArrowRight size={20} />
              </Link>
              <a href="#features" className="px-8 py-4 rounded-full font-medium transition-all hover:bg-white/5 border border-transparent hover:border-white/10" style={{ color: "var(--text-primary)" }}>
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Hero Dashboard Image */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-20 relative mx-auto max-w-5xl"
            style={{ y }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-10 h-full w-full" />
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/20">
              <Image 
                src="/hero-dashboard.png" 
                alt="QuantVista Dashboard Interface" 
                width={1200} 
                height={675}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 relative z-20" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">World-Class Analytics Engine</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Everything you need to analyze, simulate, and generate alpha in one luxurious platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card 1 */}
            <div className="md:col-span-2 stat-card group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Brain size={160} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h3 className="text-3xl font-bold mb-3">AI-Powered Research</h3>
                <p style={{ color: "var(--text-secondary)" }} className="max-w-md text-lg">
                  Our neural networks digest thousands of data points to provide natural language investment theses and probabilistic price targets.
                </p>
              </div>
            </div>

            {/* Square Card 1 */}
            <div className="stat-card group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <LineChart size={100} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h3 className="text-xl font-bold mb-3">Monte Carlo Engine</h3>
                <p style={{ color: "var(--text-secondary)" }} className="text-sm">
                  Run 10,000+ simulations instantly to visualize the probability distribution of future asset prices.
                </p>
              </div>
            </div>

            {/* Square Card 2 */}
            <div className="stat-card group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield size={100} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h3 className="text-xl font-bold mb-3">Risk Assessment</h3>
                <p style={{ color: "var(--text-secondary)" }} className="text-sm">
                  Calculate Value at Risk (VaR), Sharpe Ratios, and maximum drawdown metrics in real-time.
                </p>
              </div>
            </div>

            {/* Large Card 2 */}
            <div className="md:col-span-2 stat-card group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={160} />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end">
                <h3 className="text-3xl font-bold mb-3">Institutional PDF Reports</h3>
                <p style={{ color: "var(--text-secondary)" }} className="max-w-md text-lg">
                  Generate gorgeous, branded A4 research reports instantly. Contains technicals, fundamentals, and risk analysis ready for board meetings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent-cyan)" }}>
                How It Works
              </p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Three Steps to <span className="gradient-text-accent">Smarter Decisions</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Search Any Stock", desc: "Enter any ticker — US, Indian, or global markets. Historical data downloads automatically." },
                { step: "02", title: "Run Analysis", desc: "10+ quantitative models run simultaneously. Monte Carlo, VaR, GBM, and more." },
                { step: "03", title: "Get Insights", desc: "Interactive charts, risk scores, confidence intervals, and AI-generated explanations." },
              ].map((item, i) => (
                <motion.div key={item.step} variants={fadeInUp} custom={i + 1} className="relative">
                  <div className="glass-card p-8 text-center h-full">
                    <span className="text-5xl font-black gradient-text opacity-30">{item.step}</span>
                    <h3 className="text-xl font-semibold mt-4 mb-3" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="py-24" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent-purple)" }}>Testimonials</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Trusted by <span className="gradient-text">Traders Worldwide</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Alex Chen", role: "Day Trader", text: "QuantVista's Monte Carlo simulations changed how I view risk. I can see the probability of different outcomes before entering any trade.", stars: 5 },
                { name: "Priya Sharma", role: "Portfolio Manager", text: "The portfolio analysis tools are exceptional. Correlation matrices and diversification scoring help me build stronger portfolios.", stars: 5 },
                { name: "Marcus Webb", role: "Retail Investor", text: "Finally, institutional-grade analysis without the institutional price tag. The AI insights make complex quant data accessible.", stars: 5 },
              ].map((t, i) => (
                <motion.div key={t.name} variants={fadeInUp} custom={i + 1} className="glass-card p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{ background: "var(--gradient-primary)" }}>
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent-orange)" }}>FAQ</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {[
                { q: "Is this financial advice?", a: "No. QuantVista AI is an educational and analytical tool. It provides probability-based scenarios, not predictions. Always consult a financial advisor for investment decisions." },
                { q: "What markets are supported?", a: "Any stock available on Yahoo Finance — US (AAPL, MSFT), Indian (RELIANCE.NS, TCS.NS), European, Asian, and more." },
                { q: "How accurate are the simulations?", a: "Monte Carlo simulations show the range of possible outcomes based on historical data. They're not predictions — they're probability distributions that help you understand risk." },
                { q: "Can I analyze a portfolio?", a: "Yes! Add multiple stocks, set weights, and get portfolio-level risk, return, correlation matrix, and diversification analysis." },
                { q: "Is my data secure?", a: "All data is fetched from public APIs (Yahoo Finance). We don't store personal financial data." },
              ].map((faq, i) => (
                <motion.div key={i} variants={fadeInUp} custom={i + 1}
                  className="glass-card overflow-hidden cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="flex items-center justify-between p-5">
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{faq.q}</span>
                    <ChevronDown size={18} style={{
                      color: "var(--text-muted)",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.3s ease",
                    }} />
                  </div>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="orb orb-blue w-80 h-80 -bottom-40 -right-20" />
        <div className="orb orb-purple w-60 h-60 top-0 left-10" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeInUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Analyze Smarter</span>?
            </motion.h2>
            <motion.p variants={fadeInUp} custom={1} className="text-lg mb-10" style={{ color: "var(--text-secondary)" }}>
              Join thousands of traders using quantitative analysis to understand risk and opportunity.
            </motion.p>
            <motion.div variants={fadeInUp} custom={2}>
              <Link href="/dashboard" className="btn-primary text-lg px-10 py-4">
                Launch QuantVista AI <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Standard Legal Footer */}
      <footer className="border-t py-12 px-6" style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg" style={{ background: "var(--gradient-primary)" }}>
                  <BarChart3 size={18} color="white" />
                </div>
                <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>QuantVista AI</span>
              </div>
              <p className="text-sm max-w-sm" style={{ color: "var(--text-muted)" }}>
                Advanced quantitative analysis and AI-driven market intelligence for modern investors.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Platform</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><Link href="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</Link></li>
                <li><Link href="#features" className="hover:text-blue-500 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-500 transition-colors">Data Processing Agreement</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t text-xs text-center" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            <p className="mb-2 uppercase tracking-widest font-semibold" style={{ color: "var(--text-secondary)" }}>Disclaimer</p>
            <p className="max-w-5xl mx-auto leading-relaxed">
              QuantVista AI provides financial modeling software and data analytics. We are not a registered investment advisor, broker-dealer, or financial institution. The information, charts, algorithms, and AI insights provided on this platform are for informational and educational purposes only and do not constitute financial advice, investment recommendations, or an offer to buy or sell any securities. Trading stocks, options, and other financial instruments involves significant risk of loss. Past performance of any trading system or methodology is not necessarily indicative of future results. You should carefully consider whether trading is suitable for you in light of your financial condition and consult with a licensed financial professional before making any investment decisions.
            </p>
            <p className="mt-6">© {new Date().getFullYear()} QuantVista AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
