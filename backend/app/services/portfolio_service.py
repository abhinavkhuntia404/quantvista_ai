"""
Portfolio Analysis Service
"""
import numpy as np
import pandas as pd
from scipy.optimize import minimize
from typing import Dict, Any, List
from app.services.stock_service import get_stock_data


class PortfolioAnalyzer:
    """Analyze a portfolio of multiple stocks."""

    def __init__(self, tickers: List[str], weights: List[float] = None, period: str = "2y"):
        self.tickers = tickers
        n = len(tickers)
        self.weights = np.array(weights if weights else [1.0 / n] * n)
        self.period = period
        self.trading_days = 252

        # Fetch data
        self.price_data = {}
        self.returns_data = {}
        for ticker in tickers:
            df = get_stock_data(ticker, period=period)
            self.price_data[ticker] = df["Close"]
            self.returns_data[ticker] = np.log(df["Close"] / df["Close"].shift(1)).dropna()

        # Create returns DataFrame aligned by date
        self.returns_df = pd.DataFrame(self.returns_data).dropna()

    def analyze(self) -> Dict[str, Any]:
        """Run full portfolio analysis."""
        cov_matrix = self.returns_df.cov() * self.trading_days
        corr_matrix = self.returns_df.corr()

        # Portfolio return
        mean_returns = self.returns_df.mean() * self.trading_days
        portfolio_return = float(np.dot(self.weights, mean_returns))

        # Portfolio volatility
        portfolio_vol = float(
            np.sqrt(np.dot(self.weights.T, np.dot(cov_matrix, self.weights)))
        )

        # Sharpe ratio
        risk_free = 0.05
        sharpe = float((portfolio_return - risk_free) / portfolio_vol) if portfolio_vol > 0 else 0.0

        # Individual stock stats
        stock_stats = []
        for i, ticker in enumerate(self.tickers):
            ret = float(mean_returns.iloc[i]) if hasattr(mean_returns, 'iloc') else float(mean_returns[ticker])
            vol = float(self.returns_df[ticker].std() * np.sqrt(self.trading_days))
            stock_stats.append({
                "ticker": ticker,
                "weight": float(self.weights[i]),
                "annualized_return": ret,
                "annualized_volatility": vol,
                "sharpe_ratio": float((ret - risk_free) / vol) if vol > 0 else 0.0,
            })

        # Diversification ratio
        weighted_vols = sum(
            self.weights[i] * float(self.returns_df[t].std() * np.sqrt(self.trading_days))
            for i, t in enumerate(self.tickers)
        )
        diversification_ratio = float(weighted_vols / portfolio_vol) if portfolio_vol > 0 else 1.0
        diversification_score = min(100, max(0, (diversification_ratio - 1) * 100))

        # Portfolio VaR
        z_score = 1.645  # 95% confidence
        portfolio_var = float(portfolio_vol / np.sqrt(self.trading_days) * z_score)

        return {
            "tickers": self.tickers,
            "weights": self.weights.tolist(),
            "portfolio_return": portfolio_return,
            "portfolio_volatility": portfolio_vol,
            "sharpe_ratio": sharpe,
            "portfolio_var_95": portfolio_var,
            "diversification_ratio": diversification_ratio,
            "diversification_score": round(diversification_score, 1),
            "correlation_matrix": {
                "labels": self.tickers,
                "values": corr_matrix.values.tolist(),
            },
            "covariance_matrix": {
                "labels": self.tickers,
                "values": cov_matrix.values.tolist(),
            },
            "stock_stats": stock_stats,
        }
