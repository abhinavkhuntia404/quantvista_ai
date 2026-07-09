"""
Quantitative Analysis Engine
Implements Monte Carlo, GBM, VaR, and other quantitative models
"""
import numpy as np
import pandas as pd
from scipy import stats
from typing import Dict, Any, List, Optional
import warnings
warnings.filterwarnings("ignore")


class QuantEngine:
    """Core quantitative analysis engine for stock price modeling."""

    def __init__(self, prices: pd.Series, ticker: str = ""):
        self.prices = prices.dropna()
        self.ticker = ticker
        self.returns = np.log(self.prices / self.prices.shift(1)).dropna()
        self.current_price = float(self.prices.iloc[-1])
        self.mu = float(self.returns.mean())
        self.sigma = float(self.returns.std())
        self.trading_days = 252

    def monte_carlo_simulation(
        self, days: int = 30, simulations: int = 10000
    ) -> Dict[str, Any]:
        """
        Monte Carlo Simulation using Geometric Brownian Motion.
        Generates thousands of possible future price paths.
        """
        dt = 1 / self.trading_days
        annualized_mu = self.mu * self.trading_days
        annualized_sigma = self.sigma * np.sqrt(self.trading_days)

        # Generate random paths
        np.random.seed(42)
        Z = np.random.standard_normal((days, simulations))
        daily_returns = (annualized_mu - 0.5 * annualized_sigma**2) * dt + \
                        annualized_sigma * np.sqrt(dt) * Z

        price_paths = np.zeros((days + 1, simulations))
        price_paths[0] = self.current_price

        for t in range(1, days + 1):
            price_paths[t] = price_paths[t - 1] * np.exp(daily_returns[t - 1])

        final_prices = price_paths[-1]

        # Calculate percentiles
        percentiles = {
            "5th": float(np.percentile(final_prices, 5)),
            "25th": float(np.percentile(final_prices, 25)),
            "50th": float(np.percentile(final_prices, 50)),
            "75th": float(np.percentile(final_prices, 75)),
            "95th": float(np.percentile(final_prices, 95)),
        }

        # Sample paths for visualization (take 100 evenly spaced)
        sample_indices = np.linspace(0, simulations - 1, 200, dtype=int)
        sample_paths = price_paths[:, sample_indices].tolist()

        return {
            "model": "Monte Carlo Simulation",
            "description": "Simulates thousands of possible future price paths using random sampling based on historical volatility and drift. Each path represents one possible future scenario.",
            "current_price": self.current_price,
            "days": days,
            "simulations": simulations,
            "expected_price": float(np.mean(final_prices)),
            "median_price": float(np.median(final_prices)),
            "min_price": float(np.min(final_prices)),
            "max_price": float(np.max(final_prices)),
            "std_dev": float(np.std(final_prices)),
            "percentiles": percentiles,
            "prob_increase": float(np.mean(final_prices > self.current_price)),
            "prob_decrease": float(np.mean(final_prices < self.current_price)),
            "sample_paths": sample_paths,
            "final_prices_histogram": np.histogram(
                final_prices, bins=80
            )[0].tolist(),
            "histogram_edges": np.histogram(
                final_prices, bins=80
            )[1].tolist(),
        }

    def geometric_brownian_motion(self, days: int = 30) -> Dict[str, Any]:
        """
        Geometric Brownian Motion (GBM) analytical solution.
        Provides the theoretical expected price distribution.
        """
        dt = days / self.trading_days
        annualized_mu = self.mu * self.trading_days
        annualized_sigma = self.sigma * np.sqrt(self.trading_days)

        # GBM expected value
        expected_price = self.current_price * np.exp(annualized_mu * dt)
        # GBM variance
        variance = (self.current_price**2) * np.exp(2 * annualized_mu * dt) * \
                   (np.exp(annualized_sigma**2 * dt) - 1)
        std_dev = np.sqrt(variance)

        # Log-normal distribution parameters
        log_mean = np.log(self.current_price) + (annualized_mu - 0.5 * annualized_sigma**2) * dt
        log_std = annualized_sigma * np.sqrt(dt)

        # Percentiles from log-normal
        percentiles = {}
        for p in [5, 25, 50, 75, 95]:
            percentiles[f"{p}th"] = float(
                np.exp(stats.norm.ppf(p / 100, log_mean, log_std))
            )

        # Generate PDF for visualization
        x = np.linspace(
            max(0.01, self.current_price * 0.7),
            self.current_price * 1.3,
            200
        )
        pdf = stats.lognorm.pdf(
            x, s=log_std, scale=np.exp(log_mean)
        )

        return {
            "model": "Geometric Brownian Motion",
            "description": "A continuous-time stochastic model that assumes stock prices follow a log-normal distribution. It provides the theoretical expected price based on drift (trend) and volatility.",
            "current_price": self.current_price,
            "expected_price": float(expected_price),
            "median_price": percentiles["50th"],
            "std_dev": float(std_dev),
            "percentiles": percentiles,
            "prob_increase": float(1 - stats.norm.cdf(
                (np.log(self.current_price) - log_mean) / log_std
            )),
            "prob_decrease": float(stats.norm.cdf(
                (np.log(self.current_price) - log_mean) / log_std
            )),
            "annualized_drift": float(annualized_mu),
            "annualized_volatility": float(annualized_sigma),
            "pdf_x": x.tolist(),
            "pdf_y": pdf.tolist(),
        }

    def historical_volatility(self) -> Dict[str, Any]:
        """
        Calculate historical volatility metrics across multiple timeframes.
        """
        vol_5d = float(self.returns.tail(5).std() * np.sqrt(self.trading_days))
        vol_21d = float(self.returns.tail(21).std() * np.sqrt(self.trading_days))
        vol_63d = float(self.returns.tail(63).std() * np.sqrt(self.trading_days))
        vol_252d = float(self.returns.tail(252).std() * np.sqrt(self.trading_days))
        vol_all = float(self.returns.std() * np.sqrt(self.trading_days))

        # Rolling volatility for chart
        rolling_vol = self.returns.rolling(window=21).std() * np.sqrt(self.trading_days)
        rolling_vol = rolling_vol.dropna()

        # Volatility regime
        current_vol = vol_21d
        if current_vol < 0.15:
            regime = "Low"
        elif current_vol < 0.30:
            regime = "Moderate"
        elif current_vol < 0.50:
            regime = "High"
        else:
            regime = "Extreme"

        return {
            "model": "Historical Volatility",
            "description": "Measures the degree of price variation over different time periods. Higher volatility means wider price swings and greater uncertainty.",
            "volatility_5d": vol_5d,
            "volatility_21d": vol_21d,
            "volatility_63d": vol_63d,
            "volatility_252d": vol_252d,
            "volatility_all_time": vol_all,
            "regime": regime,
            "rolling_volatility": {
                "dates": rolling_vol.index.strftime("%Y-%m-%d").tolist()[-120:],
                "values": rolling_vol.values.tolist()[-120:],
            },
        }

    def value_at_risk(self, confidence: float = 0.95, horizon: int = 1) -> Dict[str, Any]:
        """
        Value at Risk (VaR) — estimates the maximum expected loss.
        """
        # Historical VaR
        historical_var = float(np.percentile(self.returns, (1 - confidence) * 100))
        historical_var_dollar = float(historical_var * self.current_price)

        # Parametric VaR (assumes normal distribution)
        z_score = stats.norm.ppf(1 - confidence)
        parametric_var = float(self.mu + z_score * self.sigma)
        parametric_var_dollar = float(parametric_var * self.current_price)

        # Multi-day VaR
        multi_day_var = float(parametric_var * np.sqrt(horizon))
        multi_day_var_dollar = float(multi_day_var * self.current_price)

        # Conditional VaR (Expected Shortfall)
        cvar_threshold = np.percentile(self.returns, (1 - confidence) * 100)
        cvar_returns = self.returns[self.returns <= cvar_threshold]
        cvar = float(cvar_returns.mean()) if len(cvar_returns) > 0 else float(historical_var)
        cvar_dollar = float(cvar * self.current_price)

        return {
            "model": "Value at Risk (VaR)",
            "description": f"Estimates the maximum expected loss at {confidence*100:.0f}% confidence level. There is only a {(1-confidence)*100:.0f}% chance the actual loss exceeds this amount on any given day.",
            "confidence_level": confidence,
            "horizon_days": horizon,
            "historical_var_pct": abs(historical_var),
            "historical_var_dollar": abs(historical_var_dollar),
            "parametric_var_pct": abs(parametric_var),
            "parametric_var_dollar": abs(parametric_var_dollar),
            "multi_day_var_pct": abs(multi_day_var),
            "multi_day_var_dollar": abs(multi_day_var_dollar),
            "conditional_var_pct": abs(cvar),
            "conditional_var_dollar": abs(cvar_dollar),
            "current_price": self.current_price,
        }

    def expected_return(self, days: int = 30) -> Dict[str, Any]:
        """
        Calculate expected return metrics.
        """
        daily_mean = float(self.mu)
        annualized_return = float(self.mu * self.trading_days)
        period_return = float(self.mu * days)
        expected_price = self.current_price * np.exp(self.mu * days)

        # CAGR
        total_days = len(self.prices)
        total_return = float(self.prices.iloc[-1] / self.prices.iloc[0])
        years = total_days / self.trading_days
        cagr = float((total_return ** (1 / years)) - 1) if years > 0 else 0.0

        # Risk-adjusted metrics
        risk_free_rate = 0.05  # Approximate
        sharpe_ratio = float(
            (annualized_return - risk_free_rate) /
            (self.sigma * np.sqrt(self.trading_days))
        ) if self.sigma > 0 else 0.0

        # Sortino Ratio
        downside_returns = self.returns[self.returns < 0]
        downside_std = float(downside_returns.std() * np.sqrt(self.trading_days))
        sortino_ratio = float(
            (annualized_return - risk_free_rate) / downside_std
        ) if downside_std > 0 else 0.0

        # Maximum Drawdown
        cumulative = (1 + self.returns).cumprod()
        rolling_max = cumulative.cummax()
        drawdown = (cumulative - rolling_max) / rolling_max
        max_drawdown = float(drawdown.min())

        return {
            "model": "Expected Return & Risk Metrics",
            "description": "Calculates expected returns based on historical performance and provides risk-adjusted metrics like Sharpe Ratio to evaluate return per unit of risk.",
            "daily_return": daily_mean,
            "annualized_return": annualized_return,
            "period_return": period_return,
            "expected_price": float(expected_price),
            "cagr": cagr,
            "sharpe_ratio": sharpe_ratio,
            "sortino_ratio": sortino_ratio,
            "max_drawdown": max_drawdown,
            "risk_free_rate": risk_free_rate,
            "current_price": self.current_price,
            "days": days,
        }

    def confidence_intervals(self, days: int = 30) -> Dict[str, Any]:
        """
        Calculate confidence intervals for future prices.
        """
        dt = days / self.trading_days
        annualized_mu = self.mu * self.trading_days
        annualized_sigma = self.sigma * np.sqrt(self.trading_days)

        log_mean = np.log(self.current_price) + \
                   (annualized_mu - 0.5 * annualized_sigma**2) * dt
        log_std = annualized_sigma * np.sqrt(dt)

        intervals = {}
        for ci in [0.50, 0.68, 0.80, 0.90, 0.95, 0.99]:
            alpha = (1 - ci) / 2
            lower = float(np.exp(stats.norm.ppf(alpha, log_mean, log_std)))
            upper = float(np.exp(stats.norm.ppf(1 - alpha, log_mean, log_std)))
            intervals[f"{int(ci*100)}%"] = {
                "lower": lower,
                "upper": upper,
                "width": upper - lower,
                "width_pct": (upper - lower) / self.current_price * 100,
            }

        return {
            "model": "Confidence Intervals",
            "description": f"Shows the range within which the stock price is expected to fall with different levels of confidence over {days} trading days.",
            "current_price": self.current_price,
            "days": days,
            "intervals": intervals,
        }

    def historical_scenario_analysis(self) -> Dict[str, Any]:
        """
        Analyze historical scenarios — best/worst periods, drawdowns.
        """
        # Best and worst days
        best_day = {
            "date": str(self.returns.idxmax().date()),
            "return": float(self.returns.max()),
        }
        worst_day = {
            "date": str(self.returns.idxmin().date()),
            "return": float(self.returns.min()),
        }

        # Best and worst months
        monthly_returns = self.returns.resample("ME").sum()
        best_month = {
            "date": str(monthly_returns.idxmax().date()),
            "return": float(monthly_returns.max()),
        }
        worst_month = {
            "date": str(monthly_returns.idxmin().date()),
            "return": float(monthly_returns.min()),
        }

        # Drawdown analysis
        cumulative = (1 + self.returns).cumprod()
        rolling_max = cumulative.cummax()
        drawdown = (cumulative - rolling_max) / rolling_max

        # Major drawdowns (>5%)
        major_drawdowns = []
        in_drawdown = False
        dd_start = None
        for i, (date, dd) in enumerate(drawdown.items()):
            if dd < -0.05 and not in_drawdown:
                in_drawdown = True
                dd_start = date
            elif dd >= -0.01 and in_drawdown:
                in_drawdown = False
                dd_slice = drawdown[dd_start:date]
                major_drawdowns.append({
                    "start": str(dd_start.date()),
                    "end": str(date.date()),
                    "max_drawdown": float(dd_slice.min()),
                    "duration_days": (date - dd_start).days,
                })

        # Return distribution stats
        skewness = float(stats.skew(self.returns.values))
        kurtosis = float(stats.kurtosis(self.returns.values))

        # Tail risk
        left_tail_5 = float(np.percentile(self.returns, 5))
        right_tail_95 = float(np.percentile(self.returns, 95))

        return {
            "model": "Historical Scenario Analysis",
            "description": "Examines historical price behavior including best/worst periods, drawdowns, and return distribution characteristics to understand tail risks.",
            "best_day": best_day,
            "worst_day": worst_day,
            "best_month": best_month,
            "worst_month": worst_month,
            "major_drawdowns": major_drawdowns[-5:],  # Last 5
            "skewness": skewness,
            "kurtosis": kurtosis,
            "left_tail_5pct": left_tail_5,
            "right_tail_95pct": right_tail_95,
            "total_trading_days": len(self.returns),
            "positive_days_pct": float(np.mean(self.returns > 0)),
            "negative_days_pct": float(np.mean(self.returns < 0)),
        }

    def probability_distribution(self) -> Dict[str, Any]:
        """
        Fit and analyze the probability distribution of returns.
        """
        returns_array = self.returns.values

        # Fit normal distribution
        norm_mu, norm_std = stats.norm.fit(returns_array)

        # Fit t-distribution (heavier tails)
        t_params = stats.t.fit(returns_array)

        # Normality tests
        try:
            jb_stat, jb_pvalue = stats.jarque_bera(returns_array)
        except Exception:
            jb_stat, jb_pvalue = 0.0, 1.0

        try:
            sw_stat, sw_pvalue = stats.shapiro(returns_array[:5000])
        except Exception:
            sw_stat, sw_pvalue = 0.0, 1.0

        # Histogram data
        hist_counts, hist_edges = np.histogram(returns_array, bins=60)

        # Q-Q plot data
        theoretical_quantiles = stats.norm.ppf(
            np.linspace(0.01, 0.99, 100)
        )
        sample_quantiles = np.percentile(
            returns_array,
            np.linspace(1, 99, 100)
        )

        return {
            "model": "Probability Distribution",
            "description": "Analyzes the statistical distribution of historical returns, testing for normality and fitting distributions to understand the likelihood of extreme moves.",
            "mean": float(norm_mu),
            "std": float(norm_std),
            "skewness": float(stats.skew(returns_array)),
            "kurtosis": float(stats.kurtosis(returns_array)),
            "is_normal": bool(jb_pvalue > 0.05),
            "jarque_bera_stat": float(jb_stat),
            "jarque_bera_pvalue": float(jb_pvalue),
            "shapiro_stat": float(sw_stat),
            "shapiro_pvalue": float(sw_pvalue),
            "histogram": {
                "counts": hist_counts.tolist(),
                "edges": hist_edges.tolist(),
            },
            "qq_plot": {
                "theoretical": theoretical_quantiles.tolist(),
                "sample": sample_quantiles.tolist(),
            },
            "t_distribution_df": float(t_params[0]),
        }

    def risk_score(self) -> Dict[str, Any]:
        """
        Generate a composite risk score (0-100).
        """
        vol_21d = self.returns.tail(21).std() * np.sqrt(self.trading_days)
        vol_252d = self.returns.tail(252).std() * np.sqrt(self.trading_days)

        # Volatility score (0-40)
        vol_score = min(40, float(vol_21d / 0.80 * 40))

        # Drawdown score (0-25)
        cumulative = (1 + self.returns).cumprod()
        rolling_max = cumulative.cummax()
        drawdown = (cumulative - rolling_max) / rolling_max
        max_dd = abs(float(drawdown.min()))
        dd_score = min(25, max_dd / 0.50 * 25)

        # Tail risk score (0-20)
        kurtosis_val = abs(float(stats.kurtosis(self.returns.values)))
        tail_score = min(20, kurtosis_val / 10 * 20)

        # Volatility trend score (0-15)
        vol_trend = float(vol_21d / vol_252d) if vol_252d > 0 else 1.0
        trend_score = min(15, max(0, (vol_trend - 0.5) / 1.5 * 15))

        total_score = vol_score + dd_score + tail_score + trend_score
        total_score = min(100, max(0, total_score))

        if total_score < 25:
            category = "Low Risk"
        elif total_score < 50:
            category = "Moderate Risk"
        elif total_score < 75:
            category = "High Risk"
        else:
            category = "Very High Risk"

        return {
            "total_score": round(total_score, 1),
            "category": category,
            "components": {
                "volatility": round(vol_score, 1),
                "drawdown": round(dd_score, 1),
                "tail_risk": round(tail_score, 1),
                "volatility_trend": round(trend_score, 1),
            },
        }

    def future_price_range(self, days: int = 30) -> Dict[str, Any]:
        """
        Consolidated future price range estimate.
        """
        mc = self.monte_carlo_simulation(days=days, simulations=10000)
        gbm = self.geometric_brownian_motion(days=days)
        var = self.value_at_risk()
        er = self.expected_return(days=days)
        ci = self.confidence_intervals(days=days)
        vol = self.historical_volatility()
        risk = self.risk_score()

        return {
            "ticker": self.ticker,
            "current_price": self.current_price,
            "analysis_days": days,
            "expected_price": mc["expected_price"],
            "median_price": mc["median_price"],
            "min_price": mc["min_price"],
            "max_price": mc["max_price"],
            "percentile_5": mc["percentiles"]["5th"],
            "percentile_95": mc["percentiles"]["95th"],
            "prob_increase": mc["prob_increase"],
            "prob_decrease": mc["prob_decrease"],
            "expected_volatility": vol["volatility_21d"],
            "sharpe_ratio": er["sharpe_ratio"],
            "risk_score": risk["total_score"],
            "risk_category": risk["category"],
            "var_95": var["parametric_var_pct"],
            "confidence_intervals": ci["intervals"],
        }

    def generate_ai_insight(self, days: int = 30) -> str:
        """
        Generate a natural language AI insight about the stock.
        """
        mc = self.monte_carlo_simulation(days=days, simulations=10000)
        vol = self.historical_volatility()
        var = self.value_at_risk()
        er = self.expected_return(days=days)
        risk = self.risk_score()
        ci = self.confidence_intervals(days=days)

        prob_up = mc["prob_increase"] * 100
        prob_down = mc["prob_decrease"] * 100
        ci_68 = ci["intervals"].get("68%", ci["intervals"].get("50%", {}))
        lower = ci_68.get("lower", mc["percentiles"]["25th"])
        upper = ci_68.get("upper", mc["percentiles"]["75th"])

        vol_regime = vol["regime"].lower()
        risk_cat = risk["category"].lower()
        sharpe = er["sharpe_ratio"]
        max_dd = abs(er["max_drawdown"]) * 100

        direction = "upward" if prob_up > 50 else "downward"
        bias_strength = "strong" if abs(prob_up - 50) > 15 else "slight" if abs(prob_up - 50) > 5 else "marginal"

        insight = (
            f"Based on {mc['simulations']:,} Monte Carlo simulations over {days} trading days, "
            f"the analysis suggests a {prob_up:.1f}% probability that {self.ticker} will trade higher "
            f"than its current price of ${self.current_price:.2f}. "
            f"\n\n"
            f"The 68% confidence interval places the expected price range between "
            f"${lower:.2f} and ${upper:.2f}, indicating a {bias_strength} {direction} bias. "
            f"\n\n"
            f"Current volatility is {vol_regime} at {vol['volatility_21d']*100:.1f}% annualized. "
            f"The Value at Risk (95% confidence) suggests a maximum daily loss of "
            f"${var['parametric_var_dollar']:.2f} ({var['parametric_var_pct']*100:.2f}%). "
            f"\n\n"
            f"The Sharpe Ratio of {sharpe:.2f} {'indicates favorable' if sharpe > 0.5 else 'suggests modest' if sharpe > 0 else 'reflects negative'} "
            f"risk-adjusted returns. Maximum historical drawdown was {max_dd:.1f}%. "
            f"\n\n"
            f"Overall risk assessment: {risk['category']} (score: {risk['total_score']:.0f}/100). "
            f"{'Downside risk remains within historical norms.' if risk['total_score'] < 50 else 'Elevated risk — consider position sizing carefully.'}"
        )

        return insight

    def run_all_models(self, days: int = 30) -> Dict[str, Any]:
        """Run all models and return comprehensive results."""
        return {
            "ticker": self.ticker,
            "current_price": self.current_price,
            "monte_carlo": self.monte_carlo_simulation(days=days),
            "gbm": self.geometric_brownian_motion(days=days),
            "volatility": self.historical_volatility(),
            "var": self.value_at_risk(),
            "expected_return": self.expected_return(days=days),
            "confidence_intervals": self.confidence_intervals(days=days),
            "scenario_analysis": self.historical_scenario_analysis(),
            "probability_distribution": self.probability_distribution(),
            "risk_score": self.risk_score(),
            "future_price_range": self.future_price_range(days=days),
            "ai_insight": self.generate_ai_insight(days=days),
        }
