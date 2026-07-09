import os
import httpx
from typing import Dict, Any
import pandas as pd
from datetime import datetime, timedelta
from .base import MarketDataProvider

class FMPProvider(MarketDataProvider):
    """
    Financial Modeling Prep API Provider.
    Requires FMP_API_KEY environment variable.
    """
    def __init__(self):
        self.api_key = os.getenv("FMP_API_KEY")
        self.base_url = "https://financialmodelingprep.com/api/v3"
        if not self.api_key:
            raise ValueError("FMP_API_KEY environment variable is required to use FMPProvider")

    async def get_stock_info(self, ticker: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            # Get profile
            profile_url = f"{self.base_url}/profile/{ticker}?apikey={self.api_key}"
            profile_res = await client.get(profile_url)
            profile_data = profile_res.json()
            
            if not profile_data:
                raise ValueError(f"No profile found for {ticker}")
                
            info = profile_data[0]
            
            # Get key metrics
            metrics_url = f"{self.base_url}/key-metrics-ttm/{ticker}?apikey={self.api_key}"
            metrics_res = await client.get(metrics_url)
            metrics_data = metrics_res.json()
            metrics = metrics_data[0] if metrics_data else {}
            
            return {
                "ticker": ticker,
                "name": info.get("companyName", ticker),
                "sector": info.get("sector", "N/A"),
                "industry": info.get("industry", "N/A"),
                "market_cap": info.get("mktCap", 0),
                "currency": info.get("currency", "USD"),
                "pe_ratio": metrics.get("peRatioTTM"),
                "peg_ratio": metrics.get("pegRatioTTM"),
                "return_on_equity": metrics.get("roeTTM"),
                "debt_to_equity": metrics.get("debtToEquityTTM"),
                "profit_margin": metrics.get("netProfitMarginTTM"),
                "dividend_yield": metrics.get("dividendYieldPercentageTTM", 0) / 100 if metrics.get("dividendYieldPercentageTTM") else None,
                "beta": info.get("beta"),
                "current_price": info.get("price"),
                "previous_close": info.get("price"), # Approximate without full quote
                "description": info.get("description", ""),
                "exchange": info.get("exchangeShortName", "")
            }

    async def get_historical_data(self, ticker: str, period: str = "2y") -> pd.DataFrame:
        # FMP historical price endpoint
        url = f"{self.base_url}/historical-price-full/{ticker}?apikey={self.api_key}"
        async with httpx.AsyncClient() as client:
            res = await client.get(url)
            data = res.json()
            
            if "historical" not in data:
                raise ValueError(f"No historical data for {ticker}")
                
            df = pd.DataFrame(data["historical"])
            df["date"] = pd.to_datetime(df["date"])
            df.set_index("date", inplace=True)
            df.sort_index(inplace=True)
            
            # Rename columns to match expected format
            df = df.rename(columns={
                "open": "Open",
                "high": "High",
                "low": "Low",
                "close": "Close",
                "volume": "Volume"
            })
            
            # Filter by period (e.g., "2y")
            if period.endswith("y"):
                years = int(period[:-1])
                cutoff = datetime.now() - timedelta(days=365 * years)
                df = df[df.index >= cutoff]
                
            return df

    async def get_news(self, ticker: str) -> list:
        url = f"{self.base_url}/stock_news?tickers={ticker}&limit=10&apikey={self.api_key}"
        async with httpx.AsyncClient() as client:
            res = await client.get(url)
            data = res.json()
            
            return [{
                "title": item["title"],
                "summary": item["text"],
                "link": item["url"],
                "publisher": item["site"],
                "published": item["publishedDate"]
            } for item in data]
