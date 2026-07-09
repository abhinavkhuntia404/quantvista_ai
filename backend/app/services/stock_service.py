"""
Stock Data Service — fetches and caches stock data using the Market Data Provider Abstraction.
"""
import os
import pandas as pd
from typing import Dict, Any, List
from datetime import datetime

from .market_data.factory import market_data_service

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")

def resolve_ticker(query: str) -> str:
    """Resolve a company name or ticker query to a formal ticker symbol using the active provider."""
    return market_data_service.resolve_ticker(query)

def search_tickers(query: str) -> list:
    """Get search suggestions for a query using the active provider."""
    return market_data_service.search_tickers(query)

def get_stock_data(
    ticker: str,
    period: str = "2y",
    interval: str = "1d"
) -> pd.DataFrame:
    """Download stock data using the active provider and cache to CSV."""
    os.makedirs(DATA_DIR, exist_ok=True)

    # Fetch data through abstraction layer
    df = market_data_service.get_stock_data(ticker, period, interval)

    # Save to CSV (basic file caching)
    csv_path = os.path.join(DATA_DIR, f"{ticker.replace('.', '_')}_{period}.csv")
    df.to_csv(csv_path)

    return df

def get_stock_info(ticker: str) -> Dict[str, Any]:
    """Get stock metadata and info using the active provider."""
    return market_data_service.get_stock_info(ticker)

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
