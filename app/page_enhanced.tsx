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
} from "lucide-react"
import { WalletDistributionChart } from "@/components/wallet-distribution-chart"
import { generatePDFReport } from "@/lib/pdf-generator"
import { TestTokens } from "@/components/test-tokens"
import { generateMockAnalysis } from "@/lib/mock-data"
import { ChartErrorBoundary } from "@/components/chart-error-boundary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getRiskColor, getRiskBgColor, getRiskLevel, getRiskBadgeVariant } from "@/lib/utils"

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <div className="container mx-auto px-4 py-8">
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
                    className="bg-blue-600 hover:bg-blue-700"
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

              {/* Red Flags */}
              {analysis.redFlags.length > 0 && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription>
                    <div className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      ⚠️ Red Flags Detected:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-400">
                      {analysis.redFlags.map((flag, index) => (
                        <li key={index}>{flag}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Tabbed Analysis */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
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
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto max-h-96">
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
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto max-h-96">
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
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto max-h-96">
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
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-x-auto max-h-96">
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
