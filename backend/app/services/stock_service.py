"""
Stock Data Service — fetches and caches stock data using yfinance
"""
import yfinance as yf
import pandas as pd
import os
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import httpx
import urllib.parse


DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")


def resolve_ticker(query: str) -> str:
    """Resolve a company name or ticker query to a formal ticker symbol using Yahoo Finance."""
    query = query.strip()
    if not query:
        return ""
        
    try:
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={urllib.parse.quote(query)}"
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        
        with httpx.Client() as client:
            response = client.get(url, headers=headers, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                quotes = data.get('quotes', [])
                if quotes and len(quotes) > 0:
                    # Return the first found symbol
                    return quotes[0].get('symbol', query.upper())
    except Exception as e:
        print(f"Error resolving ticker: {e}")
        
    return query.upper()


def get_stock_data(
    ticker: str,
    period: str = "2y",
    interval: str = "1d"
) -> pd.DataFrame:
    """Download stock data and save to CSV."""
    os.makedirs(DATA_DIR, exist_ok=True)

    stock = yf.Ticker(ticker)
    df = stock.history(period=period, interval=interval)

    if df.empty:
        raise ValueError(f"No data found for ticker: {ticker}")

    # Save to CSV
    csv_path = os.path.join(DATA_DIR, f"{ticker.replace('.', '_')}_{period}.csv")
    df.to_csv(csv_path)

    return df


def get_stock_info(ticker: str) -> Dict[str, Any]:
    """Get stock metadata and info."""
    stock = yf.Ticker(ticker)
    info = stock.info

    return {
        "ticker": ticker,
        "name": info.get("longName", info.get("shortName", ticker)),
        "sector": info.get("sector", "N/A"),
        "industry": info.get("industry", "N/A"),
        "market_cap": info.get("marketCap", 0),
        "currency": info.get("currency", "USD"),
        "exchange": info.get("exchange", "N/A"),
        "pe_ratio": info.get("trailingPE", None),
        "forward_pe": info.get("forwardPE", None),
        "dividend_yield": info.get("dividendYield", None),
        "beta": info.get("beta", None),
        "fifty_two_week_high": info.get("fiftyTwoWeekHigh", None),
        "fifty_two_week_low": info.get("fiftyTwoWeekLow", None),
        "avg_volume": info.get("averageVolume", None),
        "description": info.get("longBusinessSummary", ""),
        "website": info.get("website", ""),
        "previous_close": info.get("previousClose", None),
        "open": info.get("open", None),
        "day_low": info.get("dayLow", None),
        "day_high": info.get("dayHigh", None),
        "current_price": info.get("currentPrice", info.get("regularMarketPrice", None)),
    }


def get_csv_path(ticker: str, period: str = "2y") -> str:
    """Get path to saved CSV file."""
    return os.path.join(DATA_DIR, f"{ticker.replace('.', '_')}_{period}.csv")


def list_saved_data() -> list:
    """List all saved CSV files."""
    os.makedirs(DATA_DIR, exist_ok=True)
    files = []
    for f in os.listdir(DATA_DIR):
        if f.endswith(".csv"):
            path = os.path.join(DATA_DIR, f)
            files.append({
                "filename": f,
                "size_kb": round(os.path.getsize(path) / 1024, 2),
                "modified": datetime.fromtimestamp(
                    os.path.getmtime(path)
                ).isoformat(),
            })
    return files
