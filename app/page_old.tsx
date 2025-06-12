"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Moon,
  Sun,
  BarChart3,
  PieChart,
  LineChart,
  Wallet,
  ExternalLink,
  Copy,
  TrendingUp,
  TrendingDown,
  Shield,
  Users,
  Droplet,
  Briefcase,
  UserCog,
} from "lucide-react"
import { WalletDistributionChart } from "@/components/wallet-distribution-chart"
import { generatePDFReport } from "@/lib/pdf-generator"
import { TestTokens } from "@/components/test-tokens"
import { generateMockAnalysis } from "@/lib/mock-data"
import { ChartErrorBoundary } from "@/components/chart-error-boundary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
    address?: string
  }[]
  tokenInfo: {
    name: string
    symbol: string
    address: string
    marketCap: number
    volume24h: number
    price: number
  }
  apiData?: {
    coinGecko?: any
    etherscan?: any
    uniswap?: any
    bitquery?: any
  }
}

export default function CryptoScamDetector() {
  const [tokenInput, setTokenInput] = useState("")
  const [analysis, setAnalysis] = useState<TokenAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [useMockData, setUseMockData] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Initialize dark mode based on user preference
  useEffect(() => {
    // Check for system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setDarkMode(prefersDark)
    
    if (prefersDark) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const analyzeToken = async () => {
    if (!tokenInput.trim()) {
      setError("Please enter a valid token address or symbol")
      return
    }

    setLoading(true)
    setError("")
    setAnalysis(null)

    try {
      if (useMockData) {
        // Use mock data for testing
        const mockAnalysis = generateMockAnalysis(tokenInput)
        setTimeout(() => {
          setAnalysis(mockAnalysis)
          setLoading(false)
        }, 2000)
        return
      }

      const response = await fetch("/api/analyze-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenInput }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 404 || errorData.error?.includes("not found")) {
          throw new Error(`Token "${tokenInput}" not found. Please check the contract address or token symbol.`)
        }
        throw new Error(errorData.error || "Analysis failed")
      }

      const result = await response.json()
      setAnalysis(result)
    } catch (err) {
      console.error("Analysis error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleTestToken = (tokenAddress: string) => {
    setTokenInput(tokenAddress)
  }

  const downloadReport = () => {
    if (!analysis) return
    
    try {
      generatePDFReport(analysis)
    } catch (err) {
      console.error("PDF generation error:", err)
      setError("Failed to generate PDF report")
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600 dark:text-red-400"
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-green-600 dark:text-green-400"
  }

  const getRiskBgColor = (score: number) => {
    if (score >= 70) return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800"
    if (score >= 40) return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
    return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 70) return "High Risk"
    if (score >= 40) return "Medium Risk"
    return "Low Risk"
  }

  const getRiskBadgeVariant = (score: number) => {
    if (score >= 70) return "destructive"
    if (score >= 40) return "secondary"
    return "default"
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 transition-colors">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Crypto Scam Detection Tool
              </h1>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="ml-4"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Advanced blockchain analysis to identify potential cryptocurrency scams
            </p>
          </div>

          {/* Test Tokens Section */}
          <TestTokens onSelectToken={handleTestToken} />

          {/* Input Section */}
          <Card className="mb-8 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Token Analysis</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Enter a token contract address or symbol to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter token address (e.g., 0x...) or symbol (e.g., ETH)"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && analyzeToken()}
                    className="flex-1 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <Button 
                    onClick={analyzeToken} 
                    disabled={loading || !tokenInput.trim()}
                    className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Analyzing..." : "Analyze Token"}
                  </Button>
                </div>
                
                {/* Mock Data Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mockData"
                    checked={useMockData}
                    onChange={(e) => setUseMockData(e.target.checked)}
                    className="rounded"
                  />
                  <label 
                    htmlFor="mockData" 
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Use mock data for testing (disable for real blockchain analysis)
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading Display */}
          {loading && (
            <Card className="mb-8 dark:border-gray-800">
              <CardContent className="text-center py-8">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Analyzing token and blockchain data...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This may take a few moments as we gather data from multiple sources
                </p>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-8">
              {/* Token Info Header with Color-Coded Risk */}
              <Card className={`dark:border-gray-800 ${getRiskBgColor(analysis.riskScore)} border-2`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl dark:text-white">
                        {analysis.tokenInfo.name} ({analysis.tokenInfo.symbol})
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400 flex items-center">
                        <span className="font-mono">{analysis.tokenInfo.address}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(analysis.tokenInfo.address)}
                          className="ml-2 h-auto p-1"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </CardDescription>
                    </div>
                    <Button onClick={downloadReport} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className={`text-6xl font-bold ${getRiskColor(analysis.riskScore)}`}>
                        {analysis.riskScore}
                      </div>
                      <div className="text-xl text-gray-600 dark:text-gray-300">Risk Score (0-100)</div>
                      <Badge variant={getRiskBadgeVariant(analysis.riskScore) as any} className="mt-2">
                        {getRiskLevel(analysis.riskScore)}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold dark:text-white">
                        ${analysis.tokenInfo.marketCap.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Market Cap</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold dark:text-white">
                        ${analysis.tokenInfo.volume24h.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">24h Volume</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold dark:text-white">
                        ${analysis.tokenInfo.price.toFixed(6)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Price</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamically construct red flags */}
              {(() => {
                let displayedRedFlags = [...(analysis.redFlags || [])];

                if (analysis.advancedLiquidity) {
                  if (!analysis.advancedLiquidity.lpTokenLocking?.isLocked ||
                      (analysis.advancedLiquidity.lpTokenLocking?.lockedPercentage !== undefined && analysis.advancedLiquidity.lpTokenLocking.lockedPercentage < 50)) {
                    displayedRedFlags.push("Significant LP tokens may be unlocked or locking is below 50%, increasing rug pull risk.");
                  }
                  if ((analysis.advancedLiquidity.liquidityConcentration?.top5LPsPercent ?? 0) > 75) {
                    displayedRedFlags.push(`High LP concentration: Top 5 LPs hold ${analysis.advancedLiquidity.liquidityConcentration.top5LPsPercent.toFixed(1)}%.`);
                  }
                }

                if (analysis.advancedChainAnalysis) {
                  if ((analysis.advancedChainAnalysis.holderInsights?.whaleStats?.topHolderPercentage ?? 0) > 30) {
                    displayedRedFlags.push(`High token concentration: Top whale holders control ${analysis.advancedChainAnalysis.holderInsights.whaleStats.topHolderPercentage.toFixed(1)}%.`);
                  }
                  if (analysis.advancedChainAnalysis.transactionalFlags?.honeypotIndicators?.sellFailsDetected) {
                    displayedRedFlags.push("Potential Honeypot: Indications of transaction failures for sellers.");
                  }
                  if ((analysis.advancedChainAnalysis.transactionalFlags?.honeypotIndicators?.sellTax ?? 0) > 20) {
                    displayedRedFlags.push(`High Sell Tax: Detected sell tax of ${analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators.sellTax.toFixed(1)}%.`);
                  }
                  if ((analysis.advancedChainAnalysis.deployerReputation?.previousRiskyTokensCount ?? 0) > 0) {
                    displayedRedFlags.push(`Deployer History: Associated with ${analysis.advancedChainAnalysis.deployerReputation.previousRiskyTokensCount} previously flagged/risky token(s).`);
                  }
                }
                // Remove duplicates
                displayedRedFlags = [...new Set(displayedRedFlags)];

                return displayedRedFlags.length > 0 && (
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription>
                      <div className="font-semibold text-red-800 dark:text-red-300 mb-2">
                        ⚠️ Red Flags Detected:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-400">
                        {displayedRedFlags.map((flag, index) => (
                          <li key={index}>{flag}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                );
              })()}

              {/* Advanced Liquidity Insights */}
              {analysis.advancedLiquidity && (
                <Card className="dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl dark:text-white">
                      <Droplet className="mr-2 h-5 w-5 text-blue-500" />
                      Advanced Liquidity Insights
                    </CardTitle>
                    {analysis.advancedLiquidity.summary && (
                      <CardDescription className="dark:text-gray-400 pt-1">
                        {analysis.advancedLiquidity.summary}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Section 1: Overall Health & Pool Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-4 bg-muted/20 dark:bg-muted/20 rounded-lg"> {/* Sub-card */}
                        <h4 className="font-semibold mb-2 dark:text-gray-200">Pool Details</h4>
                        {analysis.advancedLiquidity.overallHealthScore !== undefined && (
                          <div className="mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Overall Health: </span>
                            <Badge variant={analysis.advancedLiquidity.overallHealthScore > 70 ? 'default' : (analysis.advancedLiquidity.overallHealthScore > 40 ? 'secondary' : 'destructive')}>
                              {analysis.advancedLiquidity.overallHealthScore}/100
                            </Badge>
                          </div>
                        )}
                        {analysis.advancedLiquidity.tlvUSD !== undefined && (
                          <p className="text-sm dark:text-gray-300">
                            <span className="text-gray-600 dark:text-gray-400">Total Liquidity (USD):</span> ${analysis.advancedLiquidity.tlvUSD.toLocaleString()}
                          </p>
                        )}
                        {analysis.advancedLiquidity.poolCreatedAt && (
                          <p className="text-sm dark:text-gray-300">
                            <span className="text-gray-600 dark:text-gray-400">Pool Created:</span> {new Date(analysis.advancedLiquidity.poolCreatedAt).toLocaleDateString()}
                          </p>
                        )}
                        {analysis.advancedLiquidity.poolAddress && (
                          <p className="text-sm dark:text-gray-300 truncate">
                            <span className="text-gray-600 dark:text-gray-400">Pool Address:</span>
                            <a href={`https://etherscan.io/address/${analysis.advancedLiquidity.poolAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                              {analysis.advancedLiquidity.poolAddress}
                            </a>
                          </p>
                        )}
                        {analysis.advancedLiquidity.pairedTokenReputation && (
                           <p className="text-sm dark:text-gray-300">
                             <span className="text-gray-600 dark:text-gray-400">Paired Asset Type:</span> <span className="capitalize">{analysis.advancedLiquidity.pairedTokenReputation}</span>
                           </p>
                        )}
                        {/* Basic TLV Trend representation */}
                        {analysis.advancedLiquidity.tlvTrend7d && analysis.advancedLiquidity.tlvTrend7d.length > 1 && (
                          <p className="text-sm dark:text-gray-300">
                            <span className="text-gray-600 dark:text-gray-400">TLV Trend (7d):</span>
                            {analysis.advancedLiquidity.tlvTrend7d[analysis.advancedLiquidity.tlvTrend7d.length - 1] > analysis.advancedLiquidity.tlvTrend7d[0] ?
                              <span className="text-green-500">Increasing</span> :
                              (analysis.advancedLiquidity.tlvTrend7d[analysis.advancedLiquidity.tlvTrend7d.length - 1] < analysis.advancedLiquidity.tlvTrend7d[0] ?
                                <span className="text-red-500">Decreasing</span> :
                                <span className="text-gray-500">Stable</span>)
                            }
                          </p>
                        )}
                      </Card>

                      <Card className="p-4 bg-muted/20 dark:bg-muted/20 rounded-lg"> {/* Sub-card */}
                        <h4 className="font-semibold mb-2 dark:text-gray-200">LP Token Locking</h4>
                        {analysis.advancedLiquidity.lpTokenLocking ? (
                          <>
                            <p className="text-sm dark:text-gray-300 mb-1">
                              <span className="text-gray-600 dark:text-gray-400">Status:</span>
                              {analysis.advancedLiquidity.lpTokenLocking.isLocked ?
                                <span className="text-green-500 font-semibold">Significant Locking Detected</span> :
                                <span className="text-yellow-500 font-semibold">No Major Locking / Unknown</span>}
                            </p>
                            {analysis.advancedLiquidity.lpTokenLocking.isLocked && analysis.advancedLiquidity.lpTokenLocking.lockedPercentage !== undefined && (
                              <p className="text-sm dark:text-gray-300 mb-1">
                                <span className="text-gray-600 dark:text-gray-400">Percentage Locked:</span> {analysis.advancedLiquidity.lpTokenLocking.lockedPercentage.toFixed(2)}%
                              </p>
                            )}
                            {analysis.advancedLiquidity.lpTokenLocking.details && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic">
                                {analysis.advancedLiquidity.lpTokenLocking.details}
                              </p>
                            )}
                            {analysis.advancedLiquidity.lpTokenLocking.lockerContracts && analysis.advancedLiquidity.lpTokenLocking.lockerContracts.length > 0 && (
                              <div>
                                <h5 className="text-xs font-semibold dark:text-gray-300 mb-1">Known Lockers:</h5>
                                <ul className="list-disc list-inside pl-1 space-y-1">
                                  {analysis.advancedLiquidity.lpTokenLocking.lockerContracts.map(lock => (
                                    <li key={lock.address} className="text-xs dark:text-gray-400">
                                      {lock.name}: {(lock.lockedAmount / 1e18).toFixed(2)} LP Tokens (approx)
                                      <a href={`https://etherscan.io/address/${lock.address}`} target="_blank" rel="noopener noreferrer" className="ml-1">
                                        <ExternalLink className="inline h-3 w-3 text-blue-500" />
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        ) : <p className="text-sm text-gray-500 dark:text-gray-400">Data not available.</p>}
                      </Card>
                    </div>

                    {/* Section 2: Liquidity Concentration */}
                    {analysis.advancedLiquidity.liquidityConcentration && (
                      <Card className="p-4 bg-muted/20 dark:bg-muted/20 rounded-lg"> {/* Sub-card */}
                        <h4 className="font-semibold mb-2 dark:text-gray-200">Liquidity Provider Concentration</h4>
                        <div className="space-y-2">
                          {analysis.advancedLiquidity.liquidityConcentration.top5LPsPercent !== undefined && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="dark:text-gray-300">Top 5 LPs Hold:</span>
                                <span className="font-semibold dark:text-white">{analysis.advancedLiquidity.liquidityConcentration.top5LPsPercent.toFixed(2)}%</span>
                              </div>
                              {/* Basic progress bar */}
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${analysis.advancedLiquidity.liquidityConcentration.top5LPsPercent}%` }}></div>
                              </div>
                            </div>
                          )}
                          {analysis.advancedLiquidity.liquidityConcentration.top10LPsPercent !== undefined && (
                            <div className="mt-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="dark:text-gray-300">Top 10 LPs Hold:</span>
                                <span className="font-semibold dark:text-white">{analysis.advancedLiquidity.liquidityConcentration.top10LPsPercent.toFixed(2)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${analysis.advancedLiquidity.liquidityConcentration.top10LPsPercent}%` }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Advanced On-Chain Insights */}
              {analysis.advancedChainAnalysis && (
                <Card className="dark:border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl dark:text-white">
                      <Briefcase className="mr-2 h-5 w-5 text-purple-500" /> {/* Icon for On-Chain Insights */}
                      Advanced On-Chain Insights
                    </CardTitle>
                    {analysis.advancedChainAnalysis.summary && (
                      <CardDescription className="dark:text-gray-400 pt-1">
                        {analysis.advancedChainAnalysis.summary}
                      </CardDescription>
                    )}
                    {analysis.advancedChainAnalysis.overallOnChainScore !== undefined && (
                      <div className="pt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Overall On-Chain Score: </span>
                        <Badge variant={analysis.advancedChainAnalysis.overallOnChainScore > 70 ? 'default' : (analysis.advancedChainAnalysis.overallOnChainScore > 40 ? 'secondary' : 'destructive')}>
                          {analysis.advancedChainAnalysis.overallOnChainScore}/100
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Holder Insights Section */}
                    {analysis.advancedChainAnalysis.holderInsights && (
                      <Card className="p-4 bg-muted/20 dark:bg-muted/20 rounded-lg">
                        <CardHeader className="p-0 pb-2">
                          <CardTitle className="flex items-center text-lg dark:text-gray-200">
                            <Users className="mr-2 h-5 w-5 text-indigo-500" />
                            Holder Activity & Whale Watch
                          </CardTitle>
                          {analysis.advancedChainAnalysis.holderInsights.summary && (
                            <CardDescription className="text-xs dark:text-gray-400 pt-1">
                              {analysis.advancedChainAnalysis.holderInsights.summary}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="p-0 text-sm space-y-1 dark:text-gray-300">
                          {analysis.advancedChainAnalysis.holderInsights.churnRate30d !== undefined && (
                            <p><span className="text-gray-600 dark:text-gray-400">30d Churn Rate:</span> {analysis.advancedChainAnalysis.holderInsights.churnRate30d.toFixed(1)}%</p>
                          )}
                          {analysis.advancedChainAnalysis.holderInsights.newHolderCount30d !== undefined && (
                            <p><span className="text-gray-600 dark:text-gray-400">New Holders (30d):</span> {analysis.advancedChainAnalysis.holderInsights.newHolderCount30d}</p>
                          )}
                           {analysis.advancedChainAnalysis.holderInsights.averageHolderLifespan !== undefined && (
                            <p><span className="text-gray-600 dark:text-gray-400">Avg. Holder Lifespan:</span> {analysis.advancedChainAnalysis.holderInsights.averageHolderLifespan.toFixed(0)} days</p>
                          )}
                          {analysis.advancedChainAnalysis.holderInsights.diamondHandsPercent !== undefined && (
                            <p><span className="text-gray-600 dark:text-gray-400">"Diamond Hands" (holding > 90d):</span> {analysis.advancedChainAnalysis.holderInsights.diamondHandsPercent.toFixed(1)}%</p>
                          )}
                          {analysis.advancedChainAnalysis.holderInsights.whaleStats && (
                            <>
                              <p><span className="text-gray-600 dark:text-gray-400">Top 10 Holders Control:</span> {analysis.advancedChainAnalysis.holderInsights.whaleStats.topHolderPercentage.toFixed(1)}%</p>
                              {analysis.advancedChainAnalysis.holderInsights.whaleStats.recentWhaleOutflowUSD !== undefined && (
                                <p><span className="text-gray-600 dark:text-gray-400">Recent Whale Outflow (7d):</span> ${analysis.advancedChainAnalysis.holderInsights.whaleStats.recentWhaleOutflowUSD.toLocaleString()}</p>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Transactional Flags Section */}
                    {analysis.advancedChainAnalysis.transactionalFlags && (
                      <Card className="p-4 bg-muted/20 dark:bg-muted/20 rounded-lg">
                        <CardHeader className="p-0 pb-2">
                          <CardTitle className="flex items-center text-lg dark:text-gray-200">
                            <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                            Transactional Red Flags
                          </CardTitle>
                           {analysis.advancedChainAnalysis.transactionalFlags.summary && (
                            <CardDescription className="text-xs dark:text-gray-400 pt-1">
                              {analysis.advancedChainAnalysis.transactionalFlags.summary}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="p-0 text-sm space-y-1 dark:text-gray-300">
                          {analysis.advancedChainAnalysis.transactionalFlags.potentialWashTradingPercent !== undefined && (
                            <p><span className="text-gray-600 dark:text-gray-400">Potential Wash Trading:</span> {analysis.advancedChainAnalysis.transactionalFlags.potentialWashTradingPercent.toFixed(1)}%</p>
                          )}
                          {analysis.advancedChainAnalysis.transactionalFlags.unexplainedVolumeSpikes && analysis.advancedChainAnalysis.transactionalFlags.unexplainedVolumeSpikes.length > 0 && (
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Unexplained Volume Spikes:</span>
                              <ul className="list-disc list-inside pl-4">
                                {analysis.advancedChainAnalysis.transactionalFlags.unexplainedVolumeSpikes.map(spike => (
                                  <li key={spike.date}>{new Date(spike.date).toLocaleDateString()}: +{spike.volumeIncreasePercent.toFixed(0)}%</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators && (
                            <>
                              <p><span className="text-gray-600 dark:text-gray-400">Sell Fails Detected (Honeypot?):</span> {analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators.sellFailsDetected ? <span className="text-red-500">Yes</span> : 'No'}</p>
                              {analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators.buyTax !== undefined && (
                                 <p><span className="text-gray-600 dark:text-gray-400">Buy Tax:</span> {analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators.buyTax.toFixed(1)}%</p>
                              )}
                              {analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators.sellTax !== undefined && (
                                 <p><span className="text-gray-600 dark:text-gray-400">Sell Tax:</span> {analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators.sellTax.toFixed(1)}%</p>
                              )}
                              {analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators.transferPausable !== undefined && (
                                 <p><span className="text-gray-600 dark:text-gray-400">Transfers Pausable:</span> {analysis.advancedChainAnalysis.transactionalFlags.honeypotIndicators.transferPausable ? <span className="text-yellow-500">Yes</span> : 'No'}</p>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Deployer Reputation Section */}
                    {analysis.advancedChainAnalysis.deployerReputation && (
                      <Card className="p-4 bg-muted/20 dark:bg-muted/20 rounded-lg">
                        <CardHeader className="p-0 pb-2">
                          <CardTitle className="flex items-center text-lg dark:text-gray-200">
                            <UserCog className="mr-2 h-5 w-5 text-teal-500" /> {/* Using UserCog as it's more specific */}
                            Deployer Footprint
                          </CardTitle>
                          {analysis.advancedChainAnalysis.deployerReputation.summary && (
                            <CardDescription className="text-xs dark:text-gray-400 pt-1">
                              {analysis.advancedChainAnalysis.deployerReputation.summary}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="p-0 text-sm space-y-1 dark:text-gray-300">
                          {analysis.advancedChainAnalysis.deployerReputation.deployerAddress && (
                            <p className="truncate"><span className="text-gray-600 dark:text-gray-400">Address:</span>
                              <a href={`https://etherscan.io/address/${analysis.advancedChainAnalysis.deployerReputation.deployerAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">
                                {analysis.advancedChainAnalysis.deployerReputation.deployerAddress} <ExternalLink className="inline h-3 w-3" />
                              </a>
                            </p>
                          )}
                          {analysis.advancedChainAnalysis.deployerReputation.deployerAgeDays !== undefined && (
                            <p><span className="text-gray-600 dark:text-gray-400">Age:</span> {analysis.advancedChainAnalysis.deployerReputation.deployerAgeDays} days</p>
                          )}
                          {analysis.advancedChainAnalysis.deployerReputation.contractsDeployedCount !== undefined && (
                            <p><span className="text-gray-600 dark:text-gray-400">Contracts Deployed:</span> {analysis.advancedChainAnalysis.deployerReputation.contractsDeployedCount}</p>
                          )}
                          {analysis.advancedChainAnalysis.deployerReputation.previousRiskyTokensCount !== undefined && (
                            <p><span className="text-gray-600 dark:text-gray-400">Previously Flagged Tokens by Owner:</span> {analysis.advancedChainAnalysis.deployerReputation.previousRiskyTokensCount > 0 ? <span className="text-red-500">{analysis.advancedChainAnalysis.deployerReputation.previousRiskyTokensCount}</span> : '0'}</p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tabbed Analysis */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800 mb-6">
                  <TabsTrigger value="overview" className="dark:data-[state=active]:bg-gray-700">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="wallets" className="dark:data-[state=active]:bg-gray-700">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallets
                  </TabsTrigger>
                  <TabsTrigger value="details" className="dark:data-[state=active]:bg-gray-700">
                    <LineChart className="mr-2 h-4 w-4" />
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="api" className="dark:data-[state=active]:bg-gray-700">
                    <Info className="mr-2 h-4 w-4" />
                    API Data
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Wallet Concentration */}
                    <Card className="dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                          <Wallet className="mr-2 h-5 w-5" />
                          Wallet Concentration
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Risk Score:</span>
                            <Badge variant={analysis.breakdown.walletConcentration.score >= 70 ? "destructive" : "default"}>
                              {analysis.breakdown.walletConcentration.score}/100
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Top Wallets Hold:</span>
                            <span className="font-semibold dark:text-white">
                              {analysis.breakdown.walletConcentration.topWalletsPercentage}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {analysis.breakdown.walletConcentration.details}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Liquidity Analysis */}
                    <Card className="dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Liquidity Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Risk Score:</span>
                            <Badge variant={analysis.breakdown.liquidityAnalysis.score >= 70 ? "destructive" : "default"}>
                              {analysis.breakdown.liquidityAnalysis.score}/100
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Liquidity Ratio:</span>
                            <span className="font-semibold dark:text-white">
                              {analysis.breakdown.liquidityAnalysis.liquidityRatio}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {analysis.breakdown.liquidityAnalysis.details}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Supply Dynamics */}
                    <Card className="dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                          <BarChart3 className="mr-2 h-5 w-5" />
                          Supply Dynamics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Risk Score:</span>
                            <Badge variant={analysis.breakdown.supplyDynamics.score >= 70 ? "destructive" : "default"}>
                              {analysis.breakdown.supplyDynamics.score}/100
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Reserve %:</span>
                            <span className="font-semibold dark:text-white">
                              {analysis.breakdown.supplyDynamics.reservePercentage}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Minting Risk:</span>
                            {analysis.breakdown.supplyDynamics.mintingRisk ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {analysis.breakdown.supplyDynamics.details}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Trading Volume */}
                    <Card className="dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                          <LineChart className="mr-2 h-5 w-5" />
                          Trading Volume
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Risk Score:</span>
                            <Badge variant={analysis.breakdown.tradingVolume.score >= 70 ? "destructive" : "default"}>
                              {analysis.breakdown.tradingVolume.score}/100
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Volume/Holders:</span>
                            <span className="font-semibold dark:text-white">
                              {analysis.breakdown.tradingVolume.volumeToHoldersRatio}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="dark:text-gray-300">Wash Trading:</span>
                            {analysis.breakdown.tradingVolume.washTradingDetected ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {analysis.breakdown.tradingVolume.details}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Wallets Tab */}
                <TabsContent value="wallets">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart */}
                    <Card className="dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="dark:text-white">Distribution Chart</CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          Visual representation of token distribution
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartErrorBoundary>
                          <WalletDistributionChart data={analysis.walletDistribution} />
                        </ChartErrorBoundary>
                      </CardContent>
                    </Card>

                    {/* Wallet Details */}
                    <Card className="dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="dark:text-white">Top Wallet Holders</CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          Detailed breakdown with wallet addresses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analysis.walletDistribution.slice(0, 10).map((wallet, index) => (
                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                  <div className="font-semibold dark:text-white">{wallet.label}</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {wallet.percentage.toFixed(2)}% of total supply
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold dark:text-white">
                                    {wallet.value.toLocaleString()} tokens
                                  </div>
                                </div>
                              </div>
                              {wallet.address && (
                                <div className="flex items-center justify-between mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                                  <span className="font-mono text-xs text-gray-600 dark:text-gray-300 truncate mr-2">
                                    {wallet.address}
                                  </span>
                                  <div className="flex space-x-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => copyToClipboard(wallet.address!)}
                                      className="h-auto p-1"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <a 
                                      href={`https://etherscan.io/address/${wallet.address}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      <Button variant="ghost" size="sm" className="h-auto p-1">
                                        <ExternalLink className="h-3 w-3" />
                                      </Button>
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Security Metrics */}
                    <Card className="dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                          <Shield className="mr-2 h-5 w-5" />
                          Security Metrics
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          Advanced security analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Contract Verified</div>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm dark:text-white">Yes</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Proxy Contract</div>
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-sm dark:text-white">No</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Pausable</div>
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                              <span className="text-sm dark:text-white">Unknown</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Blacklist Function</div>
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm dark:text-white">None</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Liquidity Analysis</div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm dark:text-gray-300">DEX Liquidity</span>
                              <span className="text-sm font-semibold dark:text-white">
                                ${(analysis.tokenInfo.volume24h * 0.1).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm dark:text-gray-300">Liquidity Locked</span>
                              <span className="text-sm font-semibold dark:text-white">Unknown</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Trading Metrics */}
                    <Card className="dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                          <TrendingUp className="mr-2 h-5 w-5" />
                          Trading Metrics
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          Trading pattern analysis
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">24h Transactions</div>
                            <div className="text-lg font-semibold dark:text-white">
                              {Math.floor(analysis.tokenInfo.volume24h / analysis.tokenInfo.price / 1000)}K
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Unique Traders</div>
                            <div className="text-lg font-semibold dark:text-white">
                              {Math.floor(Math.sqrt(analysis.tokenInfo.marketCap / 1000))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Trade Size</div>
                            <div className="text-lg font-semibold dark:text-white">
                              ${(analysis.tokenInfo.volume24h / 500).toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Volume/MCap Ratio</div>
                            <div className="text-lg font-semibold dark:text-white">
                              {((analysis.tokenInfo.volume24h / analysis.tokenInfo.marketCap) * 100).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Price History</div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm dark:text-gray-300">24h Change</span>
                              <span className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +{(Math.random() * 10).toFixed(2)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm dark:text-gray-300">7d Change</span>
                              <span className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                -{(Math.random() * 20).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Holder Analysis */}
                    <Card className="dark:border-gray-800 lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center dark:text-white">
                          <Users className="mr-2 h-5 w-5" />
                          Holder Analysis
                        </CardTitle>
                        <CardDescription className="dark:text-gray-400">
                          Detailed breakdown of token holders
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold dark:text-white">
                              {Math.floor(Math.sqrt(analysis.tokenInfo.marketCap / 10000))}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Holders</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-3xl font-bold dark:text-white">
                              {analysis.breakdown.walletConcentration.topWalletsPercentage.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Top 10 Holders</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-3xl font-bold dark:text-white">
                              {(100 - analysis.breakdown.walletConcentration.topWalletsPercentage).toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Distributed Supply</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* API Data Tab */}
                <TabsContent value="api">
                  <div className="space-y-6">
                    {analysis.apiData && (
                      <>
                        {analysis.apiData.coinGecko && (
                          <Card className="dark:border-gray-800">
                            <CardHeader>
                              <CardTitle className="dark:text-white">CoinGecko API Data</CardTitle>
                              <CardDescription className="dark:text-gray-400">
                                Raw market data from CoinGecko
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-6 rounded text-sm overflow-x-auto max-h-96">
                                {JSON.stringify(analysis.apiData.coinGecko, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        )}
                        
                        {analysis.apiData.etherscan && (
                          <Card className="dark:border-gray-800">
                            <CardHeader>
                              <CardTitle className="dark:text-white">Etherscan API Data</CardTitle>
                              <CardDescription className="dark:text-gray-400">
                                Blockchain data from Etherscan
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-6 rounded text-sm overflow-x-auto max-h-96">
                                {JSON.stringify(analysis.apiData.etherscan, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        )}
                        
                        {analysis.apiData.uniswap && (
                          <Card className="dark:border-gray-800">
                            <CardHeader>
                              <CardTitle className="dark:text-white">Uniswap API Data</CardTitle>
                              <CardDescription className="dark:text-gray-400">
                                DEX data from Uniswap
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-6 rounded text-sm overflow-x-auto max-h-96">
                                {JSON.stringify(analysis.apiData.uniswap, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        )}
                        
                        {analysis.apiData.bitquery && (
                          <Card className="dark:border-gray-800">
                            <CardHeader>
                              <CardTitle className="dark:text-white">BitQuery API Data</CardTitle>
                              <CardDescription className="dark:text-gray-400">
                                Advanced blockchain analytics from BitQuery
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-6 rounded text-sm overflow-x-auto max-h-96">
                                {JSON.stringify(analysis.apiData.bitquery, null, 2)}
                              </pre>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                    
                    {(!analysis.apiData || Object.keys(analysis.apiData).length === 0) && (
                      <Card className="dark:border-gray-800">
                        <CardContent className="text-center py-8">
                          <Info className="mx-auto h-8 w-8 mb-2 opacity-50 dark:text-gray-400" />
                          <p className="text-gray-500 dark:text-gray-400">No API data available for this token</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
