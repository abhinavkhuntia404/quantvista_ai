<p align="center">
  <img src="public/logo.png" alt="QuantVista AI" width="80" height="80" style="border-radius: 16px;" />
</p>

<h1 align="center">QuantVista AI</h1>

<p align="center">
  <strong>AI-Powered Financial Research & Quantitative Analytics Platform</strong>
</p>

<p align="center">
  <a href="https://quantvista-kappa.vercel.app">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a>
</p>

---

## Overview

QuantVista AI is an institutional-grade quantitative research platform that combines **AI, statistics, and financial engineering** to help users make better-informed financial decisions. It is **not** a stock prediction tool — it's a research platform focused on:

- **Quantitative Finance** — Monte Carlo simulations, Geometric Brownian Motion
- **Risk Management** — VaR, CVaR, Sharpe Ratio, Maximum Drawdown
- **Fundamental Analysis** — P/E, Market Cap, Dividend Yields, Financial Ratios
- **Technical Analysis** — RSI, MACD, Bollinger Bands, Moving Averages
- **AI-Generated Research** — Natural language investment theses from quantitative models
- **Portfolio Analytics** — Correlation matrices, diversification scoring
- **News Intelligence** — Real-time financial news aggregation

## Features

| Feature | Description |
|---------|-------------|
| 🧠 AI Research | Neural network-generated investment analysis with probabilistic insights |
| 📊 Monte Carlo Engine | 10,000+ stochastic simulations for price probability distributions |
| 🛡️ Risk Intelligence | VaR, CVaR, Sharpe Ratio, Sortino Ratio, Beta, Max Drawdown |
| 📈 Technical Dashboard | RSI, MACD, Bollinger Bands, SMA/EMA with signal generation |
| 💼 Portfolio Analytics | Multi-asset correlation, diversification scoring, weight optimization |
| 📄 PDF Reports | Institutional-grade A4 research reports (downloadable) |
| ⭐ Watchlist | Track stocks with real-time price updates |
| 🎓 Academy | Video masterclasses and historical case studies |
| 🌗 Dark/Light Theme | Premium dark-first design with smooth theme switching |
| 🔐 Authentication | Google OAuth via NextAuth.js |

## Tech Stack

### Frontend
- **Next.js 16** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Smooth animations and page transitions
- **Recharts / Plotly.js** — Interactive financial charts
- **Radix UI** — Accessible component primitives
- **Lucide Icons** — Premium icon library

### Backend
- **Python / FastAPI** — High-performance REST API
- **Yahoo Finance API** — Real-time market data
- **NumPy / SciPy** — Quantitative computations
- **Pandas** — Data analysis and manipulation

### Infrastructure
- **Vercel** — Frontend hosting with edge deployment
- **Render** — Backend API hosting
- **Prisma + PostgreSQL** — Database ORM
- **Upstash Redis** — Session caching
- **NextAuth.js** — Authentication (Google OAuth)

## Design Philosophy

The UI is inspired by the best elements of **Apple**, **Bloomberg Terminal**, **Stripe Dashboard**, and **Linear** — combining:

- 🖤 Premium dark-first glassmorphism design
- ✨ Animated aurora background effects
- 📐 Clean typography with Inter font family
- 🎯 Data-rich but clutter-free layouts
- 💫 Smooth micro-animations via Framer Motion
- 🏗️ Enterprise SaaS layout with collapsible sidebar

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL database

### Frontend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Environment Variables
```
DATABASE_URL=          # PostgreSQL connection string
NEXTAUTH_SECRET=       # Random secret for NextAuth
NEXTAUTH_URL=          # http://localhost:3000
GOOGLE_CLIENT_ID=      # Google OAuth client ID
GOOGLE_CLIENT_SECRET=  # Google OAuth client secret
NEXT_PUBLIC_API_URL=   # Backend API URL
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Disclaimer

QuantVista AI provides financial modeling software and data analytics for **informational and educational purposes only**. We are not a registered investment advisor. The information provided does not constitute financial advice. Trading involves significant risk of loss. Past performance is not indicative of future results. Always consult a licensed financial professional before making investment decisions.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/abhinavkhuntia404">Abhinav Khuntia</a>
</p>
