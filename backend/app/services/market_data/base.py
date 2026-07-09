from abc import ABC, abstractmethod
import pandas as pd
from typing import Dict, Any, List

class MarketDataProvider(ABC):
    """Abstract Base Class for all Market Data Providers (Finnhub, Yahoo, Twelve Data, etc.)"""
    
    @abstractmethod
    def get_stock_data(self, ticker: str, period: str = "2y", interval: str = "1d") -> pd.DataFrame:
        """Fetch historical OHLCV data."""
        pass
        
    @abstractmethod
    def get_stock_info(self, ticker: str) -> Dict[str, Any]:
        """Fetch fundamental data and metadata."""
        pass
        
    @abstractmethod
    def search_tickers(self, query: str) -> List[Dict[str, Any]]:
        """Search for tickers based on a query."""
        pass
        
    @abstractmethod
    def resolve_ticker(self, query: str) -> str:
        """Resolve a company name to a formal ticker symbol."""
        pass
