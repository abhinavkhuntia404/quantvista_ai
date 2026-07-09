import yfinance as yf
import pandas as pd
import httpx
import urllib.parse
from typing import Dict, Any, List
from .base import MarketDataProvider

class YahooFinanceProvider(MarketDataProvider):
    """Yahoo Finance implementation of the Market Data Provider."""
    
    def get_stock_data(self, ticker: str, period: str = "2y", interval: str = "1d") -> pd.DataFrame:
        stock = yf.Ticker(ticker)
        df = stock.history(period=period, interval=interval)
        if df.empty:
            raise ValueError(f"No data found for ticker: {ticker} via Yahoo Finance")
        return df
        
    def get_stock_info(self, ticker: str) -> Dict[str, Any]:
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
            "peg_ratio": info.get("trailingPegRatio", None),
            "price_to_book": info.get("priceToBook", None),
            "enterprise_value": info.get("enterpriseValue", None),
            "return_on_equity": info.get("returnOnEquity", None),
            "debt_to_equity": info.get("debtToEquity", None),
            "profit_margin": info.get("profitMargins", None),
            "operating_margin": info.get("operatingMargins", None),
            "dividend_yield": info.get("dividendYield", None),
            "beta": info.get("beta", None),
            "fifty_two_week_high": info.get("fiftyTwoWeekHigh", None),
            "fifty_two_week_low": info.get("fiftyTwoWeekLow", None),
            "avg_volume": info.get("averageVolume", None),
            "description": info.get("longBusinessSummary", ""),
            "website": info.get("website", ""),
            "previous_close": info.get("previousClose", None),
            "current_price": info.get("currentPrice", info.get("regularMarketPrice", None)),
        }
        
    def search_tickers(self, query: str) -> List[Dict[str, Any]]:
        query = query.strip()
        if not query:
            return []
            
        try:
            url = f"https://query2.finance.yahoo.com/v1/finance/search?q={urllib.parse.quote(query)}&quotesCount=8&newsCount=0"
            headers = {'User-Agent': 'Mozilla/5.0'}
            
            with httpx.Client() as client:
                response = client.get(url, headers=headers, timeout=5.0)
                if response.status_code == 200:
                    quotes = response.json().get('quotes', [])
                    results = []
                    for q in quotes:
                        if 'symbol' in q and q.get('quoteType') in ['EQUITY', 'ETF', 'MUTUALFUND', 'INDEX']:
                            results.append({
                                "symbol": q.get('symbol', ''),
                                "shortname": q.get('shortname', q.get('longname', '')),
                                "exchange": q.get('exchDisp', q.get('exchange', '')),
                                "type": q.get('typeDisp', q.get('quoteType', '')),
                            })
                    return results
        except Exception:
            pass
        return []

    def resolve_ticker(self, query: str) -> str:
        results = self.search_tickers(query)
        if results:
            return results[0]["symbol"]
        return query.upper()
