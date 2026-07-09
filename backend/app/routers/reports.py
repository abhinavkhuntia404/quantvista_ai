"""
Reports Router — generate and download PDF/CSV reports
"""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from app.services.stock_service import get_stock_data
from app.services.quant_engine import QuantEngine
from app.services.report_service import generate_pdf_report, generate_csv_report
import os

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "reports")
router = APIRouter()


@router.get("/pdf/{ticker}")
async def get_pdf_report(ticker: str, days: int = 30, period: str = "2y"):
    """Generate and download a PDF report."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        analysis = engine.run_all_models(days=days)
        filename = generate_pdf_report(ticker.upper(), analysis)
        filepath = os.path.join(REPORTS_DIR, filename)
        return FileResponse(
            filepath,
            media_type="application/pdf",
            filename=filename,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/csv/{ticker}")
async def get_csv_report(ticker: str, days: int = 30, period: str = "2y"):
    """Generate and download a CSV report."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        engine = QuantEngine(df["Close"], ticker=ticker.upper())
        analysis = engine.run_all_models(days=days)
        filename = generate_csv_report(ticker.upper(), analysis)
        filepath = os.path.join(REPORTS_DIR, filename)
        return FileResponse(
            filepath,
            media_type="text/csv",
            filename=filename,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
