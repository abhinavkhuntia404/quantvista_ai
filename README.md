# QuantVista AI

> Quantitative Stock Analysis Platform — Monte Carlo, GBM, VaR, and more.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)

## Overview

QuantVista AI is a full-stack quantitative stock analysis platform that helps traders understand **probability**, **risk**, and **possible future price scenarios** using institutional-grade quantitative finance models.

## Features

- **Monte Carlo Simulation** — 10,000+ simulated price paths
- **Geometric Brownian Motion** — Analytical price forecasting
- **Value at Risk (VaR)** — Historical, Parametric, and Conditional
- **Historical Volatility** — Multi-timeframe rolling volatility
- **Confidence Intervals** — 50% to 99% price bands
- **Risk Score** — Composite 0-100 risk assessment
- **Portfolio Analysis** — Correlation, diversification, multi-asset risk
- **AI Insights** — Natural language analysis
- **News & Sentiment** — Real-time financial news with sentiment scoring
- **PDF/CSV Reports** — Downloadable analysis reports with charts
- **Interactive Charts** — Price history, Monte Carlo paths, distributions, risk gauges

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, TailwindCSS |
| Backend | FastAPI (Python) |
| Charts | Recharts |
| Data | yfinance, pandas, numpy, scipy |
| Reports | ReportLab (PDF), matplotlib |

## Project Structure

```
quantvista-ai/
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx       # Main dashboard
│   │   │   │   └── portfolio/
│   │   │   │       └── page.tsx   # Portfolio analysis
│   │   │   ├── globals.css        # Global styles
│   │   │   └── layout.tsx         # Root layout
│   │   ├── components/            # Chart components
│   │   └── lib/                   # API service & utilities
│   ├── package.json
│   └── .env.local
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── main.py               # FastAPI app
│   │   ├── routers/              # API endpoints
│   │   │   ├── stocks.py
│   │   │   ├── analysis.py
│   │   │   ├── portfolio.py
│   │   │   ├── reports.py
│   │   │   └── news.py
│   │   └── services/             # Business logic
│   │       ├── quant_engine.py   # Core quantitative models
│   │       ├── stock_service.py  # Data fetching (yfinance)
│   │       ├── portfolio_service.py
│   │       └── report_service.py
│   ├── data/                     # Saved CSV data
│   ├── reports/                  # Generated reports
│   └── requirements.txt
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:8000`.

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/stocks/search/{ticker}` | Search and download stock data |
| GET | `/api/stocks/download/{ticker}` | Download CSV data |
| GET | `/api/analysis/full/{ticker}` | Run all models |
| GET | `/api/analysis/monte-carlo/{ticker}` | Monte Carlo simulation |
| GET | `/api/analysis/insight/{ticker}` | AI-generated insight |
| POST | `/api/portfolio/analyze` | Portfolio analysis |
| GET | `/api/reports/pdf/{ticker}` | Generate PDF report |
| GET | `/api/reports/csv/{ticker}` | Generate CSV report |
| GET | `/api/news/{ticker}` | Financial news & sentiment |

## Docker

```bash
docker-compose up --build
```

## Disclaimer

This application is for **educational and informational purposes only**. It does not constitute financial advice. All models produce probability-based estimates, not predictions. Past performance does not guarantee future results.

## License

MIT
