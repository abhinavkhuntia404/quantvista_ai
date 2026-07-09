"""
Portfolio Router — endpoints for portfolio analysis
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.portfolio_service import PortfolioAnalyzer

router = APIRouter()


class PortfolioRequest(BaseModel):
    tickers: List[str]
    weights: Optional[List[float]] = None
    period: str = "2y"


@router.post("/analyze")
async def analyze_portfolio(request: PortfolioRequest):
    """Analyze a portfolio of stocks."""
    try:
        if len(request.tickers) < 2:
            raise HTTPException(status_code=400, detail="At least 2 stocks required for portfolio analysis")

        if request.weights and len(request.weights) != len(request.tickers):
            raise HTTPException(status_code=400, detail="Weights must match number of tickers")

        if request.weights and abs(sum(request.weights) - 1.0) > 0.01:
            raise HTTPException(status_code=400, detail="Weights must sum to 1.0")

        analyzer = PortfolioAnalyzer(
            tickers=[t.upper() for t in request.tickers],
            weights=request.weights,
            period=request.period,
        )
        return analyzer.analyze()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
