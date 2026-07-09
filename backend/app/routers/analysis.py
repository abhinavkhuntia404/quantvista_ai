"""
Analysis Router — endpoints for quantitative analysis
"""
from fastapi import APIRouter, HTTPException, Query
from app.services.stock_service import get_stock_data
from app.services.quant_engine import QuantEngine

router = APIRouter()


@router.get("/full/{ticker}")
async def full_analysis(
    ticker: str,
    days: int = Query(30, description="Forecast horizon in trading days"),
    period: str = Query("2y", description="Historical data period"),
):
    """Run all quantitative models on a stock."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        results = engine.run_all_models(days=days)
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/monte-carlo/{ticker}")
async def monte_carlo(
    ticker: str,
    days: int = 30,
    simulations: int = 10000,
    period: str = "2y",
):
    """Run Monte Carlo simulation."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        return engine.monte_carlo_simulation(days=days, simulations=simulations)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/gbm/{ticker}")
async def gbm_analysis(ticker: str, days: int = 30, period: str = "2y"):
    """Run Geometric Brownian Motion analysis."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        return engine.geometric_brownian_motion(days=days)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/volatility/{ticker}")
async def volatility_analysis(ticker: str, period: str = "2y"):
    """Get historical volatility analysis."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        return engine.historical_volatility()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/var/{ticker}")
async def var_analysis(ticker: str, confidence: float = 0.95, period: str = "2y"):
    """Get Value at Risk analysis."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        return engine.value_at_risk(confidence=confidence)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/risk-score/{ticker}")
async def risk_score(ticker: str, period: str = "2y"):
    """Get composite risk score."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        return engine.risk_score()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/insight/{ticker}")
async def ai_insight(ticker: str, days: int = 30, period: str = "2y"):
    """Get AI-generated natural language insight."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        return {"insight": engine.generate_ai_insight(days=days)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
