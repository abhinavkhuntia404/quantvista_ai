import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { StockData, AnalysisResult, TechnicalResult } from '@/lib/api'

// Register standard fonts
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QxlF.ttf' },
    { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYlF.ttf', fontWeight: 'bold' }
  ]
})

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { marginBottom: 30, borderBottom: '2pt solid #2563eb', paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 5 },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2563eb', marginBottom: 10, borderBottom: '1pt solid #e2e8f0', paddingBottom: 5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, paddingVertical: 4, borderBottom: '1pt solid #f1f5f9' },
  label: { fontSize: 11, color: '#64748b' },
  value: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  disclaimer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, color: '#94a3b8', textAlign: 'center' },
  metricBox: { backgroundColor: '#f8fafc', padding: 10, borderRadius: 5, width: '48%' },
  flexRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }
})

interface ResearchReportProps {
  stockData: StockData
  analysis: AnalysisResult
  technicals: TechnicalResult
}

export const ResearchReport = ({ stockData, analysis, technicals }: ResearchReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Quantitative Research Report</Text>
        <Text style={styles.subtitle}>{stockData.info.name} ({stockData.info.ticker})</Text>
        <Text style={{ fontSize: 10, color: '#64748b', marginTop: 15 }}>Generated on: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* EXECUTIVE SUMMARY */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.flexRow}>
          <View style={styles.metricBox}>
            <Text style={styles.label}>Current Price</Text>
            <Text style={{ ...styles.value, fontSize: 18, marginTop: 5, color: '#2563eb' }}>${stockData.info.current_price?.toFixed(2) || analysis.current_price?.toFixed(2)}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.label}>Technical Sentiment</Text>
            <Text style={{ ...styles.value, fontSize: 18, marginTop: 5 }}>{technicals.summary.overall}</Text>
          </View>
        </View>
      </View>

      {/* FUNDAMENTALS */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Fundamental Analysis</Text>
        <View style={styles.row}><Text style={styles.label}>Sector</Text><Text style={styles.value}>{stockData.info.sector}</Text></View>
        <View style={styles.row}><Text style={styles.label}>P/E Ratio</Text><Text style={styles.value}>{stockData.info.pe_ratio?.toFixed(2) || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>PEG Ratio</Text><Text style={styles.value}>{stockData.info.peg_ratio?.toFixed(2) || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Return on Equity (ROE)</Text><Text style={styles.value}>{stockData.info.return_on_equity ? (stockData.info.return_on_equity * 100).toFixed(2) + '%' : 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Profit Margin</Text><Text style={styles.value}>{stockData.info.profit_margin ? (stockData.info.profit_margin * 100).toFixed(2) + '%' : 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Debt to Equity</Text><Text style={styles.value}>{stockData.info.debt_to_equity?.toFixed(2) || 'N/A'}</Text></View>
      </View>

      {/* TECHNICALS */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Technical Indicators</Text>
        <View style={styles.row}><Text style={styles.label}>RSI (14)</Text><Text style={styles.value}>{technicals.indicators.RSI.toFixed(2)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>MACD</Text><Text style={styles.value}>{technicals.indicators.MACD.toFixed(3)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>SMA (50)</Text><Text style={styles.value}>${technicals.indicators.SMA_50.toFixed(2)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Bullish Signals</Text><Text style={styles.value}>{technicals.summary.bullish_signals}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Bearish Signals</Text><Text style={styles.value}>{technicals.summary.bearish_signals}</Text></View>
      </View>

      {/* RISK & QUANTS */}
      <View style={{ marginBottom: 20 }}>
        <Text style={styles.sectionTitle}>Risk & Quantitative Models</Text>
        <View style={styles.row}><Text style={styles.label}>Risk Category</Text><Text style={styles.value}>{analysis.risk_score?.category || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Sharpe Ratio</Text><Text style={styles.value}>{analysis.expected_return?.sharpe_ratio?.toFixed(2) || 'N/A'}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Value at Risk (95%)</Text><Text style={styles.value}>{(analysis.var?.historical_var_pct * 100).toFixed(2)}%</Text></View>
        <View style={styles.row}><Text style={styles.label}>Max Drawdown</Text><Text style={styles.value}>{(analysis.expected_return?.max_drawdown * 100).toFixed(2)}%</Text></View>
      </View>

      {/* DISCLAIMER */}
      <Text style={styles.disclaimer}>
        Disclaimer: This report is generated automatically by QuantVista AI and does not constitute financial advice. Past performance is not indicative of future results. Please consult a registered financial advisor before making any investment decisions.
      </Text>
    </Page>
  </Document>
)
