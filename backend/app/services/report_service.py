"""
Report Generation Service — PDF and CSV reports
"""
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
)
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from typing import Dict, Any
import io

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "reports")


def generate_pdf_report(ticker: str, analysis_data: Dict[str, Any]) -> str:
    """Generate a comprehensive PDF report."""
    os.makedirs(REPORTS_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{ticker}_report_{timestamp}.pdf"
    filepath = os.path.join(REPORTS_DIR, filename)

    doc = SimpleDocTemplate(filepath, pagesize=A4,
                            topMargin=0.5*inch, bottomMargin=0.5*inch)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle', parent=styles['Title'],
        fontSize=24, textColor=colors.HexColor('#1a1a2e'),
        spaceAfter=20
    )
    heading_style = ParagraphStyle(
        'CustomHeading', parent=styles['Heading2'],
        fontSize=16, textColor=colors.HexColor('#16213e'),
        spaceBefore=15, spaceAfter=10
    )
    body_style = ParagraphStyle(
        'CustomBody', parent=styles['Normal'],
        fontSize=10, leading=14
    )

    elements = []

    # Title
    elements.append(Paragraph(f"QuantVista AI — Stock Analysis Report", title_style))
    elements.append(Paragraph(f"Ticker: {ticker}", heading_style))
    elements.append(Paragraph(
        f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}",
        body_style
    ))
    elements.append(Spacer(1, 20))

    # Summary
    if "future_price_range" in analysis_data:
        fpr = analysis_data["future_price_range"]
        elements.append(Paragraph("Price Forecast Summary", heading_style))

        summary_data = [
            ["Metric", "Value"],
            ["Current Price", f"${fpr.get('current_price', 0):.2f}"],
            ["Expected Price", f"${fpr.get('expected_price', 0):.2f}"],
            ["Median Price", f"${fpr.get('median_price', 0):.2f}"],
            ["5th Percentile", f"${fpr.get('percentile_5', 0):.2f}"],
            ["95th Percentile", f"${fpr.get('percentile_95', 0):.2f}"],
            ["Prob. of Increase", f"{fpr.get('prob_increase', 0)*100:.1f}%"],
            ["Prob. of Decrease", f"{fpr.get('prob_decrease', 0)*100:.1f}%"],
            ["Sharpe Ratio", f"{fpr.get('sharpe_ratio', 0):.2f}"],
            ["Risk Score", f"{fpr.get('risk_score', 0):.0f}/100"],
            ["Risk Category", fpr.get('risk_category', 'N/A')],
        ]

        table = Table(summary_data, colWidths=[200, 200])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0f0f0')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f8f8')]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 20))

    # Monte Carlo Chart
    if "monte_carlo" in analysis_data:
        mc = analysis_data["monte_carlo"]
        fig, ax = plt.subplots(figsize=(7, 4))
        paths = np.array(mc["sample_paths"])
        for i in range(min(100, paths.shape[1])):
            ax.plot(paths[:, i], alpha=0.05, color='#4361ee', linewidth=0.5)

        # Percentiles
        ax.axhline(y=mc["current_price"], color='white', linestyle='--', alpha=0.5, label='Current')
        ax.axhline(y=mc["percentiles"]["5th"], color='#ef476f', linestyle='--', alpha=0.7, label='5th %ile')
        ax.axhline(y=mc["percentiles"]["95th"], color='#06d6a0', linestyle='--', alpha=0.7, label='95th %ile')

        ax.set_facecolor('#0d1117')
        fig.patch.set_facecolor('#0d1117')
        ax.tick_params(colors='white')
        ax.set_title('Monte Carlo Simulation', color='white', fontsize=14)
        ax.set_xlabel('Trading Days', color='white')
        ax.set_ylabel('Price ($)', color='white')
        ax.legend(fontsize=8, facecolor='#161b22', edgecolor='#30363d', labelcolor='white')

        chart_path = os.path.join(REPORTS_DIR, f"{ticker}_mc_chart_{timestamp}.png")
        plt.savefig(chart_path, dpi=150, bbox_inches='tight', facecolor='#0d1117')
        plt.close()

        elements.append(Paragraph("Monte Carlo Simulation", heading_style))
        elements.append(Image(chart_path, width=6*inch, height=3.5*inch))
        elements.append(Spacer(1, 15))

    # Distribution Chart
    if "monte_carlo" in analysis_data:
        mc = analysis_data["monte_carlo"]
        fig, ax = plt.subplots(figsize=(7, 3.5))
        edges = mc["histogram_edges"]
        centers = [(edges[i] + edges[i+1])/2 for i in range(len(edges)-1)]
        ax.bar(centers, mc["final_prices_histogram"], width=(edges[1]-edges[0])*0.9,
               color='#4361ee', alpha=0.8, edgecolor='#3a0ca3')
        ax.axvline(x=mc["current_price"], color='#ef476f', linestyle='--', label='Current Price')
        ax.axvline(x=mc["expected_price"], color='#06d6a0', linestyle='--', label='Expected Price')

        ax.set_facecolor('#0d1117')
        fig.patch.set_facecolor('#0d1117')
        ax.tick_params(colors='white')
        ax.set_title('Price Distribution', color='white', fontsize=14)
        ax.set_xlabel('Price ($)', color='white')
        ax.set_ylabel('Frequency', color='white')
        ax.legend(fontsize=8, facecolor='#161b22', edgecolor='#30363d', labelcolor='white')

        dist_path = os.path.join(REPORTS_DIR, f"{ticker}_dist_chart_{timestamp}.png")
        plt.savefig(dist_path, dpi=150, bbox_inches='tight', facecolor='#0d1117')
        plt.close()

        elements.append(Paragraph("Price Distribution", heading_style))
        elements.append(Image(dist_path, width=6*inch, height=3*inch))
        elements.append(Spacer(1, 15))

    # AI Insight
    if "ai_insight" in analysis_data:
        elements.append(PageBreak())
        elements.append(Paragraph("AI Analysis", heading_style))
        insight_text = analysis_data["ai_insight"].replace("\n\n", "<br/><br/>")
        elements.append(Paragraph(insight_text, body_style))
        elements.append(Spacer(1, 20))

    # Confidence Intervals
    if "confidence_intervals" in analysis_data:
        ci = analysis_data["confidence_intervals"]
        elements.append(Paragraph("Confidence Intervals", heading_style))
        ci_data = [["Confidence", "Lower", "Upper", "Width"]]
        for level, vals in ci.get("intervals", {}).items():
            ci_data.append([
                level,
                f"${vals['lower']:.2f}",
                f"${vals['upper']:.2f}",
                f"${vals['width']:.2f}"
            ])
        if len(ci_data) > 1:
            table = Table(ci_data, colWidths=[100, 100, 100, 100])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f8f8')]),
            ]))
            elements.append(table)

    # Disclaimer
    elements.append(Spacer(1, 30))
    elements.append(Paragraph(
        "<i>Disclaimer: This report is for educational and informational purposes only. "
        "It does not constitute financial advice. Past performance does not guarantee future results. "
        "All models are probabilistic estimates, not predictions.</i>",
        ParagraphStyle('Disclaimer', parent=styles['Normal'], fontSize=8, textColor=colors.grey)
    ))

    doc.build(elements)

    # Clean up temp chart images
    for f in os.listdir(REPORTS_DIR):
        if f.endswith('.png') and ticker in f:
            try:
                os.remove(os.path.join(REPORTS_DIR, f))
            except Exception:
                pass

    return filename


def generate_csv_report(ticker: str, analysis_data: Dict[str, Any]) -> str:
    """Generate a CSV report with analysis results."""
    os.makedirs(REPORTS_DIR, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{ticker}_report_{timestamp}.csv"
    filepath = os.path.join(REPORTS_DIR, filename)

    rows = []

    if "future_price_range" in analysis_data:
        fpr = analysis_data["future_price_range"]
        rows.append({"Category": "Summary", "Metric": "Current Price", "Value": fpr.get("current_price", "")})
        rows.append({"Category": "Summary", "Metric": "Expected Price", "Value": fpr.get("expected_price", "")})
        rows.append({"Category": "Summary", "Metric": "Median Price", "Value": fpr.get("median_price", "")})
        rows.append({"Category": "Summary", "Metric": "5th Percentile", "Value": fpr.get("percentile_5", "")})
        rows.append({"Category": "Summary", "Metric": "95th Percentile", "Value": fpr.get("percentile_95", "")})
        rows.append({"Category": "Summary", "Metric": "Prob. Increase", "Value": fpr.get("prob_increase", "")})
        rows.append({"Category": "Summary", "Metric": "Prob. Decrease", "Value": fpr.get("prob_decrease", "")})
        rows.append({"Category": "Summary", "Metric": "Sharpe Ratio", "Value": fpr.get("sharpe_ratio", "")})
        rows.append({"Category": "Summary", "Metric": "Risk Score", "Value": fpr.get("risk_score", "")})

    if "volatility" in analysis_data:
        vol = analysis_data["volatility"]
        rows.append({"Category": "Volatility", "Metric": "5-Day", "Value": vol.get("volatility_5d", "")})
        rows.append({"Category": "Volatility", "Metric": "21-Day", "Value": vol.get("volatility_21d", "")})
        rows.append({"Category": "Volatility", "Metric": "63-Day", "Value": vol.get("volatility_63d", "")})
        rows.append({"Category": "Volatility", "Metric": "252-Day", "Value": vol.get("volatility_252d", "")})

    if "var" in analysis_data:
        var = analysis_data["var"]
        rows.append({"Category": "VaR", "Metric": "Historical VaR %", "Value": var.get("historical_var_pct", "")})
        rows.append({"Category": "VaR", "Metric": "Historical VaR $", "Value": var.get("historical_var_dollar", "")})
        rows.append({"Category": "VaR", "Metric": "Conditional VaR %", "Value": var.get("conditional_var_pct", "")})

    df = pd.DataFrame(rows)
    df.to_csv(filepath, index=False)

    return filename
