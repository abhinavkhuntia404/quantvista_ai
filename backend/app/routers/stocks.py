"""
Stock Router — endpoints for stock data retrieval
"""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse
from app.services.stock_service import get_stock_data, get_stock_info, get_csv_path, list_saved_data
import os

router = APIRouter()


@router.get("/search/{ticker}")
async def search_stock(ticker: str, period: str = Query("2y", description="Data period")):
    """Search and download stock data."""
    try:
        df = get_stock_data(ticker.upper(), period=period)
        info = {}
        try:
            info = get_stock_info(ticker.upper())
        except Exception:
            info = {"ticker": ticker.upper(), "name": ticker.upper()}

        # Convert price history for frontend
        history = []
        for date, row in df.iterrows():
            history.append({
                "date": date.strftime("%Y-%m-%d"),
                "open": round(float(row.get("Open", 0)), 2),
                "high": round(float(row.get("High", 0)), 2),
                "low": round(float(row.get("Low", 0)), 2),
                "close": round(float(row.get("Close", 0)), 2),
                "volume": int(row.get("Volume", 0)),
            })

        return {
            "info": info,
            "history": history,
            "data_points": len(history),
            "csv_available": True,
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/download/{ticker}")
async def download_csv(ticker: str, period: str = "2y"):
    """Download stock data as CSV."""
    csv_path = get_csv_path(ticker.upper(), period)
    if not os.path.exists(csv_path):
        # Try to download first
        try:
            get_stock_data(ticker.upper(), period=period)
        except Exception as e:
            raise HTTPException(status_code=404, detail=str(e))

    if os.path.exists(csv_path):
        return FileResponse(
            csv_path,
            media_type="text/csv",
            filename=f"{ticker.upper()}_{period}.csv"
        )
    raise HTTPException(status_code=404, detail="CSV file not found")


@router.get("/saved")
async def get_saved_data():
    """List all saved stock data files."""
    return {"files": list_saved_data()}
