import jsPDF from "jspdf"

interface TokenAnalysis {
  riskScore: number
  breakdown: {
    walletConcentration: {
      score: number
      topWalletsPercentage: number
      details: string
    }
    liquidityAnalysis: {
      score: number
      liquidityRatio: number
      details: string
    }
    supplyDynamics: {
      score: number
      reservePercentage: number
      mintingRisk: boolean
      details: string
    }
    tradingVolume: {
      score: number
      volumeToHoldersRatio: number
      washTradingDetected: boolean
      details: string
    }
  }
  redFlags: string[]
  walletDistribution: {
    label: string
    value: number
    percentage: number
  }[]
  tokenInfo: {
    name: string
    symbol: string
    address: string
    marketCap: number
    volume24h: number
    price: number
  }
}

export function generatePDFReport(analysis: TokenAnalysis) {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("Crypto Scam Detection Report", 20, 30)

  // Token Info
  doc.setFontSize(16)
  doc.text(`${analysis.tokenInfo.name} (${analysis.tokenInfo.symbol})`, 20, 50)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Contract: ${analysis.tokenInfo.address}`, 20, 60)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 70)

  // Risk Score
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Risk Assessment", 20, 90)

  doc.setFontSize(24)
  doc.setTextColor(220, 38, 38) // red color
  doc.text(`${analysis.riskScore}/100`, 20, 110)

  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0) // black
  doc.setFont("helvetica", "normal")

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "Very High Risk"
    if (score >= 60) return "High Risk"
    if (score >= 40) return "Medium Risk"
    if (score >= 20) return "Low Risk"
    return "Very Low Risk"
  }

  doc.text(`Risk Level: ${getRiskLevel(analysis.riskScore)}`, 20, 125)

  // Market Data
  doc.setFont("helvetica", "bold")
  doc.text("Market Data", 20, 145)
  doc.setFont("helvetica", "normal")
  doc.text(`Market Cap: $${analysis.tokenInfo.marketCap.toLocaleString()}`, 20, 160)
  doc.text(`24h Volume: $${analysis.tokenInfo.volume24h.toLocaleString()}`, 20, 170)
  doc.text(`Price: $${analysis.tokenInfo.price.toFixed(6)}`, 20, 180)

  // Risk Breakdown
  doc.setFont("helvetica", "bold")
  doc.text("Risk Factor Breakdown", 20, 200)
  doc.setFont("helvetica", "normal")

  let yPos = 215
  doc.text(`Wallet Concentration (40%): ${analysis.breakdown.walletConcentration.score}/100`, 20, yPos)
  yPos += 10
  doc.text(`Liquidity Analysis (25%): ${analysis.breakdown.liquidityAnalysis.score}/100`, 20, yPos)
  yPos += 10
  doc.text(`Supply Dynamics (20%): ${analysis.breakdown.supplyDynamics.score}/100`, 20, yPos)
  yPos += 10
  doc.text(`Trading Volume (15%): ${analysis.breakdown.tradingVolume.score}/100`, 20, yPos)

  // Red Flags
  if (analysis.redFlags.length > 0) {
    yPos += 20
    doc.setFont("helvetica", "bold")
    doc.text("Red Flags Detected:", 20, yPos)
    doc.setFont("helvetica", "normal")

    analysis.redFlags.forEach((flag, index) => {
      yPos += 10
      if (yPos > 270) {
        doc.addPage()
        yPos = 30
      }
      doc.text(`• ${flag}`, 25, yPos)
    })
  }

  // Disclaimer
  if (yPos > 250) {
    doc.addPage()
    yPos = 30
  } else {
    yPos += 20
  }

  doc.setFontSize(10)
  doc.setFont("helvetica", "italic")
  doc.text("Disclaimer: This report is for informational purposes only and should not be", 20, yPos)
  doc.text("considered as financial advice. Always conduct your own research.", 20, yPos + 10)

  // Save the PDF
  doc.save(`${analysis.tokenInfo.symbol}_scam_analysis_report.pdf`)
}
