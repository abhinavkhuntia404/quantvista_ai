import pandas as pd
import numpy as np
from typing import Dict, Any

class TechnicalAnalysisEngine:
    """Calculates technical indicators for a given stock price DataFrame."""

    def __init__(self, df: pd.DataFrame):
        self.df = df.copy()
        # Ensure we have required columns
        required_cols = ["Open", "High", "Low", "Close", "Volume"]
        for col in required_cols:
            if col not in self.df.columns:
                raise ValueError(f"Missing required column for TA: {col}")

    def calculate_sma(self, period=20) -> pd.Series:
        return self.df["Close"].rolling(window=period).mean()

    def calculate_ema(self, period=20) -> pd.Series:
        return self.df["Close"].ewm(span=period, adjust=False).mean()

    def calculate_rsi(self, period=14) -> pd.Series:
        delta = self.df["Close"].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        # Use exponential moving average for RSI like TradingView
        gain = delta.where(delta > 0, 0).ewm(alpha=1/period, adjust=False).mean()
        loss = (-delta.where(delta < 0, 0)).ewm(alpha=1/period, adjust=False).mean()
        
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi

    def calculate_macd(self, fast=12, slow=26, signal=9):
        exp1 = self.df["Close"].ewm(span=fast, adjust=False).mean()
        exp2 = self.df["Close"].ewm(span=slow, adjust=False).mean()
        macd_line = exp1 - exp2
        signal_line = macd_line.ewm(span=signal, adjust=False).mean()
        histogram = macd_line - signal_line
        return macd_line, signal_line, histogram

    def calculate_bollinger_bands(self, period=20, std_dev=2):
        sma = self.calculate_sma(period)
        rolling_std = self.df["Close"].rolling(window=period).std()
        upper_band = sma + (rolling_std * std_dev)
        lower_band = sma - (rolling_std * std_dev)
        return upper_band, lower_band

    def calculate_atr(self, period=14) -> pd.Series:
        high_low = self.df["High"] - self.df["Low"]
        high_close = np.abs(self.df["High"] - self.df["Close"].shift())
        low_close = np.abs(self.df["Low"] - self.df["Close"].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = np.max(ranges, axis=1)
        return true_range.rolling(window=period).mean()

    def calculate_obv(self) -> pd.Series:
        obv = (np.sign(self.df["Close"].diff()) * self.df["Volume"]).fillna(0).cumsum()
        return obv
        
    def get_all_indicators(self) -> Dict[str, Any]:
        """Run all TA and return the latest values and signal summary."""
        if len(self.df) < 50:
            return {"error": "Not enough data for technical analysis (minimum 50 days)."}
            
        rsi = self.calculate_rsi()
        macd, macd_signal, macd_hist = self.calculate_macd()
        sma_20 = self.calculate_sma(20)
        sma_50 = self.calculate_sma(50)
        sma_200 = self.calculate_sma(200)
        ema_20 = self.calculate_ema(20)
        upper_bb, lower_bb = self.calculate_bollinger_bands()
        atr = self.calculate_atr()
        obv = self.calculate_obv()
        
        current_close = self.df["Close"].iloc[-1]
        
        # Extract latest values
        latest = {
            "RSI": float(rsi.iloc[-1]),
            "MACD": float(macd.iloc[-1]),
            "MACD_Signal": float(macd_signal.iloc[-1]),
            "MACD_Hist": float(macd_hist.iloc[-1]),
            "SMA_20": float(sma_20.iloc[-1]),
            "SMA_50": float(sma_50.iloc[-1]),
            "SMA_200": float(sma_200.iloc[-1]) if len(self.df) >= 200 else None,
            "EMA_20": float(ema_20.iloc[-1]),
            "Upper_BB": float(upper_bb.iloc[-1]),
            "Lower_BB": float(lower_bb.iloc[-1]),
            "ATR": float(atr.iloc[-1]),
            "OBV": float(obv.iloc[-1]),
        }
        
        # Generate Signals
        signals = {
            "RSI": "Oversold (Bullish)" if latest["RSI"] < 30 else "Overbought (Bearish)" if latest["RSI"] > 70 else "Neutral",
            "MACD": "Bullish" if latest["MACD"] > latest["MACD_Signal"] else "Bearish",
            "SMA_20_50_Cross": "Bullish" if latest["SMA_20"] > latest["SMA_50"] else "Bearish",
            "Price_vs_SMA50": "Bullish" if current_close > latest["SMA_50"] else "Bearish",
            "Bollinger_Bands": "Oversold (Bullish)" if current_close < latest["Lower_BB"] else "Overbought (Bearish)" if current_close > latest["Upper_BB"] else "Neutral",
        }
        
        bullish_count = list(signals.values()).count("Bullish") + list(signals.values()).count("Oversold (Bullish)")
        bearish_count = list(signals.values()).count("Bearish") + list(signals.values()).count("Overbought (Bearish)")
        
        overall_signal = "Strong Bullish" if bullish_count >= 4 else "Bullish" if bullish_count > bearish_count else "Strong Bearish" if bearish_count >= 4 else "Bearish" if bearish_count > bullish_count else "Neutral"
        
        return {
            "current_price": float(current_close),
            "indicators": latest,
            "signals": signals,
            "summary": {
                "bullish_signals": bullish_count,
                "bearish_signals": bearish_count,
                "overall": overall_signal
            }
        }
