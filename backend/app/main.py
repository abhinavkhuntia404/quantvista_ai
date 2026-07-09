"""
QuantVista AI - FastAPI Backend
Quantitative Stock Analysis Platform
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import stocks, analysis, portfolio, reports, news
import os

app = FastAPI(
    title="QuantVista AI API",
    description="Quantitative Stock Analysis API — probability-based price forecasting",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure data and reports directories exist
os.makedirs("data", exist_ok=True)
os.makedirs("reports", exist_ok=True)

# Mount static files for reports
app.mount("/reports", StaticFiles(directory="reports"), name="reports")
app.mount("/data", StaticFiles(directory="data"), name="data")

# Routers
app.include_router(stocks.router, prefix="/api/stocks", tags=["Stocks"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Analysis"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(news.router, prefix="/api/news", tags=["News"])


@app.get("/")
async def root():
    return {"message": "QuantVista AI API is running", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
