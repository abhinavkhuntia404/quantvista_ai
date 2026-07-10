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
  CheckCircle2, ChevronDown, Activity, Layers, Sparkles,
  Lock, Globe, BookOpen, Cpu, BarChart2, Gauge
} from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const CAPABILITIES = [
  { icon: Brain, title: "AI-Powered Research", desc: "Neural networks digest thousands of data points to generate institutional-grade investment theses and probabilistic insights.", color: "var(--accent-purple)", gradient: "from-purple-500/10 to-violet-500/10" },
  { icon: LineChart, title: "Monte Carlo Engine", desc: "Run 10,000+ stochastic simulations instantly. Visualize probability distributions of future asset prices with confidence intervals.", color: "var(--accent-blue)", gradient: "from-blue-500/10 to-cyan-500/10" },
  { icon: Shield, title: "Risk Intelligence", desc: "Calculate VaR, CVaR, Sharpe Ratios, maximum drawdown, and beta — all in real-time with institutional precision.", color: "var(--accent-emerald)", gradient: "from-emerald-500/10 to-teal-500/10" },
  { icon: Target, title: "PDF Reports", desc: "Generate gorgeous, branded A4 research reports instantly — technicals, fundamentals, and risk analysis ready for board meetings.", color: "var(--accent-amber)", gradient: "from-amber-500/10 to-orange-500/10" },
  { icon: Activity, title: "Technical Analysis", desc: "RSI, MACD, Bollinger Bands, moving averages, and 20+ indicators with real-time signal generation.", color: "var(--accent-cyan)", gradient: "from-cyan-500/10 to-blue-500/10" },
  { icon: PieChart, title: "Portfolio Analytics", desc: "Multi-asset correlation matrices, diversification scoring, and optimal weight suggestions for portfolio construction.", color: "var(--accent-rose)", gradient: "from-rose-500/10 to-pink-500/10" },
]

const STATS = [
  { value: "10,000+", label: "Simulations per analysis" },
  { value: "50+", label: "Quantitative metrics" },
  { value: "20+", label: "Technical indicators" },
  { value: "0.3s", label: "Average response time" },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { data: session, status } = useSession()
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const isSignedIn = status === "authenticated"

  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg-primary)" }}>
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="QuantVista AI" width={36} height={36} className="rounded-lg" />
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>QuantVista</span>
              <span className="text-lg font-light tracking-tight" style={{ color: "var(--text-muted)" }}>AI</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {["Features", "How It Works", "FAQ"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="btn-ghost text-sm">
                {item}
              </a>
            ))}
            <div className="w-px h-5 mx-2" style={{ background: "var(--border)" }} />
            <ThemeToggle />
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="btn-primary text-sm ml-2">
                  Dashboard <ArrowRight size={14} />
                </Link>
              </>
            ) : (
              <Link href="/api/auth/signin" className="btn-primary text-sm ml-2">
                Get Started <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-10 glass-card cursor-default" style={{ boxShadow: "none", transform: "none" }}>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium tracking-wide" style={{ color: "var(--text-secondary)" }}>
                Quantitative Research Platform — Now Live
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tight text-balance">
              Institutional-Grade{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text animate-gradient-shift">
                Financial Research
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-normal leading-relaxed text-balance" style={{ color: "var(--text-secondary)" }}>
              Harness Monte Carlo simulations, Geometric Brownian Motion, and AI-driven analytics.
              Make better-informed decisions with quantitative precision.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={isSignedIn ? "/dashboard" : "/api/auth/signin"}
                className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/20">
                Start Analyzing Free <ArrowRight size={18} />
              </Link>
              <a href="#features" className="btn-secondary text-base px-8 py-3.5 rounded-xl">
                Explore Platform
              </a>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map((stat, i) => (
              <div key={stat.label} className="text-center p-4">
                <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CAPABILITIES BENTO GRID ═══ */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent-blue)" }}>
                Platform Capabilities
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
                Everything You Need for{" "}
                <span className="gradient-text">Quantitative Research</span>
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                A complete analytical suite combining AI, statistics, and financial engineering.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CAPABILITIES.map((cap, i) => (
                <motion.div key={cap.title} variants={fadeInUp} custom={i + 1}
                  className="glass-card p-7 group relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cap.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: `color-mix(in srgb, ${cap.color} 12%, transparent)` }}>
                      <cap.icon size={22} style={{ color: cap.color }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 tracking-tight">{cap.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{cap.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-28 px-6 relative z-10" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent-emerald)" }}>
                How It Works
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Three Steps to <span className="gradient-text-accent">Smarter Decisions</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Search Any Stock", desc: "Enter any ticker — US, Indian, or global markets. Data loads instantly from worldwide exchanges.", icon: Globe },
                { step: "02", title: "Run Analysis", desc: "10+ quantitative models run simultaneously — Monte Carlo, VaR, GBM, technicals, and AI insights.", icon: Cpu },
                { step: "03", title: "Get Insights", desc: "Interactive charts, risk scores, confidence intervals, and downloadable institutional PDF reports.", icon: Sparkles },
              ].map((item, i) => (
                <motion.div key={item.step} variants={fadeInUp} custom={i + 1}>
                  <div className="glass-card p-8 h-full text-center relative">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                      style={{ background: "var(--gradient-primary)" }}>
                      <item.icon size={22} color="white" />
                    </div>
                    <span className="text-4xl font-black gradient-text opacity-20 absolute top-4 right-5">{item.step}</span>
                    <h3 className="text-lg font-semibold mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TRUST SECTION ═══ */}
      <section className="py-28 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent-purple)" }}>
                Trusted Platform
              </p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Built for <span className="gradient-text">Serious Research</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Alex Chen", role: "Day Trader", text: "The Monte Carlo simulations completely changed how I view risk. I can see probability distributions before entering any trade.", stars: 5 },
                { name: "Priya Sharma", role: "Portfolio Manager", text: "Correlation matrices and portfolio scoring help me build stronger, better-diversified portfolios. Exceptional analysis tools.", stars: 5 },
                { name: "Marcus Webb", role: "Retail Investor", text: "Institutional-grade analysis without the institutional price tag. The AI insights make complex quant data accessible and actionable.", stars: 5 },
              ].map((t, i) => (
                <motion.div key={t.name} variants={fadeInUp} custom={i + 1} className="glass-card p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={14} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "var(--gradient-primary)" }}>
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-28 px-6 relative z-10" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0} className="text-center mb-12">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent-amber)" }}>FAQ</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Common <span className="gradient-text-warm">Questions</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {[
                { q: "Is this financial advice?", a: "No. QuantVista AI is an educational and analytical tool. It provides probability-based scenarios, not predictions. Always consult a qualified financial advisor for investment decisions." },
                { q: "What markets are supported?", a: "Any stock available on Yahoo Finance — US (AAPL, MSFT), Indian (RELIANCE.NS, TCS.NS), European, Asian, and more." },
                { q: "How accurate are the simulations?", a: "Monte Carlo simulations show the range of possible outcomes based on historical data. They're probability distributions that help you understand risk — not crystal-ball predictions." },
                { q: "Can I analyze a portfolio?", a: "Yes. Add multiple stocks, set weights, and get portfolio-level risk, return, correlation matrix, and diversification analysis." },
                { q: "Is my data secure?", a: "All data is fetched from public APIs (Yahoo Finance). We don't store personal financial information or trading data." },
              ].map((faq, i) => (
                <motion.div key={i} variants={fadeInUp} custom={i + 1}
                  className="glass-card overflow-hidden cursor-pointer"
                  style={{ boxShadow: "none" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="flex items-center justify-between p-5">
                    <span className="font-medium text-sm">{faq.q}</span>
                    <ChevronDown size={16} style={{
                      color: "var(--text-muted)",
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }} />
                  </div>
                  {openFaq === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {faq.a}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-32 relative overflow-hidden z-10">
        <div className="orb orb-blue w-96 h-96 -bottom-48 -right-24" />
        <div className="orb orb-purple w-72 h-72 top-0 left-10" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.h2 variants={fadeInUp} custom={0} className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to <span className="gradient-text">Research Smarter</span>?
            </motion.h2>
            <motion.p variants={fadeInUp} custom={1} className="text-base mb-10" style={{ color: "var(--text-secondary)" }}>
              Join researchers and traders using quantitative analysis to understand risk and opportunity.
            </motion.p>
            <motion.div variants={fadeInUp} custom={2}>
              <Link href={isSignedIn ? "/dashboard" : "/api/auth/signin"} className="btn-primary text-base px-10 py-4 rounded-xl">
                Launch QuantVista AI <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t py-12 px-6 relative z-10" style={{ background: "var(--bg-primary)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="QuantVista AI" width={32} height={32} className="rounded-lg" />
                <span className="font-bold text-base">QuantVista AI</span>
              </div>
              <p className="text-sm max-w-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                AI-powered financial research and quantitative analytics for modern investors and institutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><Link href="/academy" className="hover:text-blue-400 transition-colors">Academy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><Link href="/legal/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Disclaimer</p>
            <p className="text-xs max-w-4xl mx-auto leading-relaxed" style={{ color: "var(--text-muted)" }}>
              QuantVista AI provides financial modeling software and data analytics for informational and educational purposes only. We are not a registered investment advisor. The information provided does not constitute financial advice. Trading involves significant risk of loss. Past performance is not indicative of future results. Consult a licensed financial professional before making investment decisions.
            </p>
            <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>© {new Date().getFullYear()} QuantVista AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
