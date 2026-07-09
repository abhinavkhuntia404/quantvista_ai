"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, BookOpen, TrendingUp, Shield, Brain, ArrowLeft } from "lucide-react"
import Link from "next/link"

const VIDEOS = [
  {
    id: "PHe0bXAIuk0", // How The Economic Machine Works by Ray Dalio
    title: "How The Economic Machine Works",
    author: "Ray Dalio",
    category: "Macroeconomics",
    duration: "30:00"
  },
  {
    id: "p7HKvqRI_Bo", // William Ackman: Everything You Need to Know About Finance and Investing in Under an Hour
    title: "Everything You Need to Know About Finance",
    author: "Bill Ackman",
    category: "Investing 101",
    duration: "43:56"
  },
  {
    id: "WEDIj9JBTC8", // Options Trading for Beginners
    title: "Options Trading for Beginners",
    author: "projectfinance",
    category: "Derivatives",
    duration: "27:14"
  },
  {
    id: "ZCFkWDdmXG8", // Technical Analysis Secrets
    title: "Technical Analysis Secrets",
    author: "Rayner Teo",
    category: "Technical Analysis",
    duration: "1:45:00"
  },
  {
    id: "8R28P-3E0hA", // Warren Buffett Explains How To Calculate The Intrinsic Value Of A Stock
    title: "Calculating Intrinsic Value",
    author: "Warren Buffett",
    category: "Fundamental Analysis",
    duration: "12:15"
  },
  {
    id: "Ay-0V5Lq6Fw", // The GameStop Short Squeeze Explained
    title: "The GameStop Short Squeeze Explained",
    author: "Wall Street Millennial",
    category: "Case Studies",
    duration: "15:20"
  }
]

const CASE_STUDIES = [
  {
    title: "The 2008 Financial Crisis",
    summary: "How complex derivatives (MBS, CDOs) and subprime lending led to the collapse of Lehman Brothers and a global recession.",
    icon: Shield,
    color: "var(--accent-red)"
  },
  {
    title: "The Dot-Com Bubble (2000)",
    summary: "Excessive speculation in internet-based companies resulted in a massive market crash when capital dried up.",
    icon: TrendingUp,
    color: "var(--accent-blue)"
  },
  {
    title: "Renaissance Technologies (Medallion Fund)",
    summary: "How Jim Simons used purely quantitative models and machine learning to achieve 66% annualized returns.",
    icon: Brain,
    color: "var(--accent-purple)"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

export default function AcademyPage() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 mb-8 text-sm font-medium hover:text-blue-500 transition-colors" style={{ color: "var(--text-secondary)" }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(139,92,246,0.1)", color: "var(--accent-purple)" }}>
            <BookOpen size={14} />
            <span className="text-xs font-semibold uppercase tracking-widest">QuantVista Academy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Master the <span className="gradient-text">Markets</span></h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Institutional-grade education for the modern investor. Learn from hedge fund managers, economic cycles, and historical case studies.
          </p>
        </motion.div>

        {/* Video Player Modal/Section */}
        <AnimatePresence>
          {activeVideo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 rounded-2xl overflow-hidden glass-card shadow-2xl"
              style={{ borderColor: "var(--border-glow)" }}
            >
              <div className="relative pt-[56.25%] w-full bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md">
                <p className="font-semibold text-white">Currently Playing</p>
                <button onClick={() => setActiveVideo(null)} className="btn-secondary text-xs px-4 py-2">Close Player</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-2xl font-bold mb-6">Video Masterclasses</h2>
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {VIDEOS.map(video => (
            <motion.div key={video.id} variants={itemVariants} 
              className="stat-card group cursor-pointer hover:border-blue-500/50"
              onClick={() => setActiveVideo(video.id)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-900 group-hover:shadow-glow transition-all">
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600/90 flex items-center justify-center backdrop-blur-sm shadow-lg scale-90 group-hover:scale-110 transition-transform">
                    <Play size={20} color="white" className="ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white font-medium backdrop-blur-sm">
                  {video.duration}
                </div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold px-2 py-1 rounded bg-white/5" style={{ color: "var(--accent-blue)" }}>
                  {video.category}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1 line-clamp-2 leading-snug">{video.title}</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{video.author}</p>
            </motion.div>
          ))}
        </motion.div>

        <h2 className="text-2xl font-bold mb-6">Historical Case Studies</h2>
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {CASE_STUDIES.map(study => (
            <motion.div key={study.title} variants={itemVariants} className="stat-card">
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${study.color}15`, color: study.color }}>
                <study.icon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{study.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {study.summary}
              </p>
              <button className="mt-4 text-sm font-semibold flex items-center gap-1 transition-colors hover:gap-2" style={{ color: study.color }}>
                Read Study <ArrowLeft size={14} className="rotate-180" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
