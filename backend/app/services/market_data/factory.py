import os
import logging
from typing import Optional
from .base import MarketDataProvider
from .yahoo import YahooFinanceProvider
from .fmp import FMPProvider

logger = logging.getLogger(__name__)

class MarketDataFactory:
    """Factory to manage and fallback between market data providers."""
    
    _providers = {}
    _primary = "yahoo"  # Will be changed to 'finnhub' when implemented

    @classmethod
    def get_provider(cls, name: Optional[str] = None) -> MarketDataProvider:
        """Get the specified provider or the primary provider by default."""
        # Determine primary provider dynamically
        if os.getenv("FMP_API_KEY"):
            cls._primary = "fmp"
        else:
            cls._primary = "yahoo"
            
        target = name or cls._primary
        
        # Lazy initialization
        if "yahoo" not in cls._providers:
            cls._providers["yahoo"] = YahooFinanceProvider()
            
        if "fmp" not in cls._providers and os.getenv("FMP_API_KEY"):
            cls._providers["fmp"] = FMPProvider()
            
        try:
            return cls._providers[target]
        except KeyError:
            logger.warning(f"Provider {target} not configured. Falling back to Yahoo.")
            return cls._providers["yahoo"]

# Singleton instance for easy import
market_data_service = MarketDataFactory.get_provider()
