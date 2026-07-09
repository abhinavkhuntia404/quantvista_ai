"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
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
            {["Features", "Pricing", "FAQ"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium transition-colors hover:text-blue-400"
                style={{ color: "var(--text-secondary)" }}>
                {item}
              </a>
            ))}
            <Link href="/dashboard" className="btn-primary text-sm">
              Launch App <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient grid-bg pt-20">
        <div className="orb orb-blue w-96 h-96 -top-20 -left-20" />
        <div className="orb orb-purple w-80 h-80 top-40 right-10" />
        <div className="orb orb-cyan w-64 h-64 bottom-20 left-1/3" />

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
              <Zap size={14} style={{ color: "var(--accent-blue)" }} />
              <span className="text-sm font-medium" style={{ color: "var(--accent-blue)" }}>
                Powered by Advanced Quantitative Models
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} custom={1}
              className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span style={{ color: "var(--text-primary)" }}>Quantitative</span>
              <br />
              <span className="gradient-text">Stock Analysis</span>
              <br />
              <span style={{ color: "var(--text-primary)" }}>Reimagined</span>
            </motion.h1>

            <motion.p variants={fadeInUp} custom={2}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}>
              Understand probability, risk, and future price scenarios with Monte Carlo simulations,
              Geometric Brownian Motion, and institutional-grade analytics.
            </motion.p>

            <motion.div variants={fadeInUp} custom={3} className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-3">
                Start Analyzing <ChevronRight size={18} />
              </Link>
              <a href="#features" className="btn-secondary text-base px-8 py-3">
                Explore Features
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} custom={4}
              className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { label: "Simulations/Analysis", value: "10,000+" },
                { label: "Quantitative Models", value: "10+" },
                { label: "Global Markets", value: "50+" },
                { label: "Risk Metrics", value: "15+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 glass-card p-2 md:p-4 relative overflow-hidden"
            style={{ boxShadow: "0 20px 80px rgba(59, 130, 246, 0.15)" }}
          >
            <div className="rounded-lg overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              {/* Mock dashboard header */}
              <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#10b981" }} />
                </div>
                <div className="flex-1 h-8 rounded-md" style={{ background: "var(--bg-secondary)", maxWidth: "400px" }}>
                  <div className="flex items-center gap-2 px-3 h-full">
                    <div className="w-4 h-4 rounded" style={{ background: "var(--text-muted)", opacity: 0.3 }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>Search AAPL, MSFT, TSLA...</span>
                  </div>
                </div>
              </div>
              {/* Mock dashboard grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                {["Price Chart", "Monte Carlo", "Distribution", "Risk Gauge"].map((title, i) => (
                  <div key={title} className="rounded-lg p-4" style={{ background: "var(--bg-secondary)", minHeight: "120px" }}>
                    <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>{title}</p>
                    <div className="flex items-end gap-1 mt-4" style={{ height: "60px" }}>
                      {Array.from({ length: 12 }).map((_, j) => (
                        <div key={j} className="flex-1 rounded-t"
                          style={{
                            background: `rgba(59, 130, 246, ${0.3 + Math.random() * 0.7})`,
                            height: `${20 + Math.random() * 80}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer} className="text-center mb-16">
            <motion.p variants={fadeInUp} custom={0}
              className="text-sm font-semibold tracking-widest uppercase mb-4"
              style={{ color: "var(--accent-blue)" }}>
              Features
            </motion.p>
            <motion.h2 variants={fadeInUp} custom={1}
              className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Institutional-Grade</span> Analytics
            </motion.h2>
            <motion.p variants={fadeInUp} custom={2}
              className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Every model used by hedge funds and quant teams — now accessible to every trader.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <TrendingUp size={24} />,
                title: "Monte Carlo Simulation",
                desc: "10,000+ simulated price paths to visualize all possible outcomes and their probabilities.",
                color: "var(--accent-blue)",
              },
              {
                icon: <LineChart size={24} />,
                title: "Geometric Brownian Motion",
                desc: "Theoretical price modeling with drift and diffusion for expected future distributions.",
                color: "var(--accent-cyan)",
              },
              {
                icon: <Shield size={24} />,
                title: "Value at Risk (VaR)",
                desc: "Know your worst-case scenario — parametric, historical, and conditional VaR.",
                color: "var(--accent-green)",
              },
              {
                icon: <Target size={24} />,
                title: "Confidence Intervals",
                desc: "50% to 99% confidence bands for precise price range forecasting.",
                color: "var(--accent-purple)",
              },
              {
                icon: <PieChart size={24} />,
                title: "Portfolio Analysis",
                desc: "Multi-asset correlation, diversification scoring, and portfolio risk metrics.",
                color: "var(--accent-orange)",
              },
              {
                icon: <Brain size={24} />,
                title: "AI Insights",
                desc: "Natural language analysis explaining what the numbers mean in plain English.",
                color: "var(--accent-pink)",
              },
            ].map((feature, i) => (
              <motion.div key={feature.title} variants={fadeInUp} custom={i} className="glass-card p-6 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
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

      {/* Pricing */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.div variants={fadeInUp} custom={0} className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--accent-green)" }}>Pricing</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Simple, <span className="gradient-text">Transparent</span> Pricing
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Free",
                  price: "$0",
                  desc: "Perfect for getting started",
                  features: ["5 analyses/day", "Basic models", "Price history charts", "CSV download"],
                  cta: "Get Started",
                  highlight: false,
                },
                {
                  name: "Pro",
                  price: "$29",
                  desc: "For serious traders",
                  features: ["Unlimited analyses", "All 10+ models", "PDF reports", "Portfolio analysis", "AI insights", "Priority support"],
                  cta: "Start Pro Trial",
                  highlight: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  desc: "For teams & institutions",
                  features: ["Everything in Pro", "API access", "Custom models", "Dedicated support", "SLA guarantee", "White-label option"],
                  cta: "Contact Sales",
                  highlight: false,
                },
              ].map((plan, i) => (
                <motion.div key={plan.name} variants={fadeInUp} custom={i + 1}
                  className={`glass-card p-8 relative ${plan.highlight ? "ring-2" : ""}`}
                  style={plan.highlight ? { borderColor: "var(--accent-blue)", boxShadow: "var(--shadow-glow)" } : {}}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: "var(--gradient-primary)" }}>
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>{plan.name}</h3>
                  <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{plan.desc}</p>
                  <p className="text-4xl font-black mb-6">
                    <span className="gradient-text">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>/mo</span>}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <CheckCircle2 size={16} style={{ color: "var(--accent-green)" }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={plan.highlight ? "btn-primary w-full justify-center" : "btn-secondary w-full justify-center"}>
                    {plan.cta}
                  </button>
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

      {/* Footer */}
      <footer className="py-12" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                  <BarChart3 size={18} color="white" />
                </div>
                <span className="font-bold gradient-text">QuantVista AI</span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Quantitative stock analysis for the modern trader.
              </p>
            </div>
            {[
              { title: "Product", links: ["Dashboard", "Models", "Portfolio", "Reports"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Disclaimer"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold mb-4 text-sm" style={{ color: "var(--text-primary)" }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm transition-colors hover:text-blue-400" style={{ color: "var(--text-muted)" }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              © 2026 QuantVista AI. For educational purposes only.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" style={{ color: "var(--text-muted)" }} className="hover:text-blue-400 transition-colors"><Globe size={18} /></a>
              <a href="#" style={{ color: "var(--text-muted)" }} className="hover:text-blue-400 transition-colors"><MessageCircle size={18} /></a>
              <a href="#" style={{ color: "var(--text-muted)" }} className="hover:text-blue-400 transition-colors"><Mail size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
