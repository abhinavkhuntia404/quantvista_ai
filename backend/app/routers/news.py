"""
News Router — financial news and sentiment (simulated)
Uses a simple sentiment scoring approach since we don't want external API keys.
"""
from fastapi import APIRouter, HTTPException
import yfinance as yf
from datetime import datetime

router = APIRouter()


@router.get("/{ticker}")
async def get_stock_news(ticker: str):
    """Get latest news for a stock using yfinance."""
    try:
        stock = yf.Ticker(ticker.upper())
        news_items = stock.news if hasattr(stock, 'news') else []

        processed_news = []
        for item in news_items[:15]:
            # Simple sentiment from title keywords
            title = item.get("title", item.get("content", {}).get("title", ""))
            if isinstance(item.get("content"), dict):
                title = item["content"].get("title", title)

            summary = item.get("summary", "")
            if isinstance(item.get("content"), dict):
                summary = item["content"].get("summary", summary)

            link = item.get("link", item.get("url", ""))
            if isinstance(item.get("content"), dict):
                canonical = item["content"].get("canonicalUrl", {})
                link = canonical.get("url", link) if isinstance(canonical, dict) else link

            publisher = item.get("publisher", "")
            if isinstance(item.get("content"), dict):
                provider = item["content"].get("provider", {})
                publisher = provider.get("displayName", publisher) if isinstance(provider, dict) else publisher

            pub_date = item.get("providerPublishTime", None)
            if isinstance(item.get("content"), dict):
                pub_date = item["content"].get("pubDate", pub_date)

            sentiment = _simple_sentiment(title + " " + summary)

            processed_news.append({
                "title": title,
                "summary": summary[:200] if summary else "",
                "link": link,
                "publisher": publisher,
                "published": pub_date,
                "sentiment": sentiment,
            })

        # Overall sentiment
        if processed_news:
            sentiments = [n["sentiment"] for n in processed_news]
            positive = sentiments.count("Positive")
            negative = sentiments.count("Negative")
            neutral = sentiments.count("Neutral")
            total = len(sentiments)

            overall_score = (positive - negative) / total * 100 if total > 0 else 0
            if overall_score > 15:
                overall = "Bullish"
            elif overall_score < -15:
                overall = "Bearish"
            else:
                overall = "Neutral"
        else:
            overall = "Neutral"
            overall_score = 0
            positive = negative = neutral = 0

        return {
            "ticker": ticker.upper(),
            "news": processed_news,
            "sentiment_summary": {
                "overall": overall,
                "score": round(overall_score, 1),
                "positive_count": positive,
                "negative_count": negative,
                "neutral_count": neutral,
            },
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def _simple_sentiment(text: str) -> str:
    """Simple keyword-based sentiment analysis."""
    text_lower = text.lower()

    positive_words = [
        "surge", "soar", "rally", "gain", "profit", "growth", "beat",
        "bullish", "upgrade", "record", "high", "strong", "positive",
        "outperform", "buy", "revenue", "earnings", "up", "rise",
        "boost", "success", "innovative", "breakthrough", "optimistic",
    ]
    negative_words = [
        "crash", "plunge", "drop", "fall", "loss", "decline", "miss",
        "bearish", "downgrade", "low", "weak", "negative", "sell",
        "underperform", "risk", "warning", "down", "concern", "fear",
        "debt", "lawsuit", "investigation", "recession", "bankruptcy",
    ]

    pos_count = sum(1 for w in positive_words if w in text_lower)
    neg_count = sum(1 for w in negative_words if w in text_lower)

    if pos_count > neg_count:
        return "Positive"
    elif neg_count > pos_count:
        return "Negative"
    return "Neutral"
