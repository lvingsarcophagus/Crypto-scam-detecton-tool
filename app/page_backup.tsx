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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const analyzeToken = async () => {
    if (!tokenInput.trim()) {
      setError("Please enter a token contract address or name")
      return
    }

    setLoading(true)
    setError("")
    setAnalysis(null)

    try {
      if (useMockData) {
        // Use mock data directly (bypass API)
        const mockResult = generateMockAnalysis(tokenInput.trim())
        setAnalysis(mockResult)
      } else {
        // Try to use the API
        const response = await fetch("/api/analyze-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: tokenInput.trim() }),
        })

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`)
        }

        const result = await response.json()
        setAnalysis(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze token")
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Very High", color: "destructive", icon: XCircle }
    if (score >= 60) return { level: "High", color: "destructive", icon: AlertTriangle }
    if (score >= 40) return { level: "Medium", color: "secondary", icon: AlertTriangle }
    if (score >= 20) return { level: "Low", color: "secondary", icon: CheckCircle }
    return { level: "Very Low", color: "default", icon: CheckCircle }
  }

  const handleDownloadReport = () => {
    if (analysis) {
      generatePDFReport(analysis)
    }
  }

  const handleTestTokenSelect = (token: string) => {
    setTokenInput(token)
    // Optionally auto-analyze
    // analyzeToken()
  }

  // Add this function before the return statement
  const getValidWalletDistribution = (analysis: TokenAnalysis | null) => {
    if (!analysis || !analysis.walletDistribution || !Array.isArray(analysis.walletDistribution)) {
      // Return default fallback data
      return [{ label: "No data available", value: 0, percentage: 100 }]
    }

    // Validate each item in the array
    const validItems = analysis.walletDistribution.filter(
      (item) =>
        item &&
        typeof item.label === "string" &&
        typeof item.percentage === "number" &&
        !isNaN(item.percentage) &&
        item.percentage >= 0,
    )

    if (validItems.length === 0) {
      return [{ label: "Invalid data", value: 0, percentage: 100 }]
    }

    return validItems
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-4 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Crypto Scam Detector</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Analyze cryptocurrency tokens for potential scams using advanced tokenomics metrics
            </p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Input Section */}
        <Card className="max-w-2xl mx-auto dark:border-gray-800">
          <CardHeader>
            <CardTitle>Token Analysis</CardTitle>
            <CardDescription>Enter a token contract address or name to analyze its risk profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter token contract address or name (e.g., 0x... or USDC)"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyzeToken()}
                className="flex-1 dark:bg-gray-800 dark:border-gray-700"
              />
              <Button onClick={analyzeToken} disabled={loading} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Analyze
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useMockData"
                  checked={useMockData}
                  onChange={(e) => setUseMockData(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="useMockData" className="text-sm text-gray-600 dark:text-gray-300">
                  Use demo data (bypass Edge Function)
                </label>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Info className="h-3 w-3 mr-1" />
                <span>Select this if Edge Function is not deployed</span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Test Tokens Section */}
        {!analysis && <TestTokens onTokenSelect={handleTestTokenSelect} />}

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6">
            {/* Risk Score Overview */}
            <Card className="dark:border-gray-800">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <CardTitle className="text-2xl dark:text-white">
                      {analysis.tokenInfo.name} ({analysis.tokenInfo.symbol})
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {analysis.tokenInfo.address}
                    </CardDescription>
                  </div>
                  <Button onClick={handleDownloadReport} variant="outline" size="sm" className="ml-auto dark:border-gray-700 dark:text-gray-300">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="space-y-2">
                  <div className="text-6xl font-bold text-red-600 dark:text-red-500">{analysis.riskScore}</div>
                  <div className="text-xl text-gray-600 dark:text-gray-300">Risk Score (0-100)</div>
                  <Badge variant={getRiskLevel(analysis.riskScore).color as any} className="text-lg px-4 py-2">
                    {React.createElement(getRiskLevel(analysis.riskScore).icon, { className: "h-4 w-4 mr-2" })}
                    {getRiskLevel(analysis.riskScore).level} Risk
                  </Badge>
                </div>

                {/* Token Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-semibold dark:text-white">${analysis.tokenInfo.marketCap.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Market Cap</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold dark:text-white">${analysis.tokenInfo.volume24h.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">24h Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold dark:text-white">${analysis.tokenInfo.price.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Price</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Red Flags */}
            {analysis.redFlags.length > 0 && (
              <Alert variant="destructive" className="dark:bg-red-900/30 dark:border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Red Flags Detected:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.redFlags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Tabs for different views */}
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="wallets" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>Wallets</span>
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  <span>Details</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  <span>API Data</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Risk Breakdown */}
                  <Card className="dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>Risk Breakdown</CardTitle>
                      <CardDescription>Detailed analysis of tokenomics factors</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <div className="font-semibold dark:text-white">Wallet Concentration (40%)</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{analysis.breakdown.walletConcentration.details}</div>
                          </div>
                          <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                            {analysis.breakdown.walletConcentration.score}/100
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <div className="font-semibold dark:text-white">Liquidity Analysis (25%)</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{analysis.breakdown.liquidityAnalysis.details}</div>
                          </div>
                          <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                            {analysis.breakdown.liquidityAnalysis.score}/100
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <div className="font-semibold dark:text-white">Supply Dynamics (20%)</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{analysis.breakdown.supplyDynamics.details}</div>
                          </div>
                          <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                            {analysis.breakdown.supplyDynamics.score}/100
                          </Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div>
                            <div className="font-semibold dark:text-white">Trading Volume (15%)</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{analysis.breakdown.tradingVolume.details}</div>
                          </div>
                          <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                            {analysis.breakdown.tradingVolume.score}/100
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Token Details */}
                  <Card className="dark:border-gray-800">
                    <CardHeader>
                      <CardTitle>Token Details</CardTitle>
                      <CardDescription>Key information about this token</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
                          <div className="font-medium dark:text-white">{analysis.tokenInfo.name}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Symbol</div>
                          <div className="font-medium dark:text-white">{analysis.tokenInfo.symbol}</div>
                        </div>
                        
                        <div className="space-y-2 col-span-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Contract Address</div>
                          <div className="font-medium font-mono text-sm break-all dark:text-white">{analysis.tokenInfo.address}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Price</div>
                          <div className="font-medium dark:text-white">${analysis.tokenInfo.price.toFixed(6)}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap</div>
                          <div className="font-medium dark:text-white">${analysis.tokenInfo.marketCap.toLocaleString()}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">24h Volume</div>
                          <div className="font-medium dark:text-white">${analysis.tokenInfo.volume24h.toLocaleString()}</div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Volume/Market Cap</div>
                          <div className="font-medium dark:text-white">
                            {(analysis.tokenInfo.volume24h / analysis.tokenInfo.marketCap * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">External Links</div>
                        <div className="flex flex-wrap gap-2">
                          <a 
                            href={`https://etherscan.io/address/${analysis.tokenInfo.address}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View on Etherscan <ExternalLink size={12} />
                          </a>
                          
                          <a 
                            href={`https://www.coingecko.com/en/coins/${analysis.tokenInfo.symbol.toLowerCase()}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View on CoinGecko <ExternalLink size={12} />
                          </a>
                          
                          <a 
                            href={`https://dexscreener.com/ethereum/${analysis.tokenInfo.address}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View on DexScreener <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Wallets Tab */}
              <TabsContent value="wallets">
                <Card className="dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>Wallet Distribution</CardTitle>
                    <CardDescription>Token distribution among top holders with wallet addresses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartErrorBoundary>
                      <WalletDistributionChart data={getValidWalletDistribution(analysis)} />
                    </ChartErrorBoundary>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details">
                <Card className="dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>Detailed Metrics</CardTitle>
                    <CardDescription>In-depth analysis of token metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Info className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>Detailed metrics coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Data Tab */}
              <TabsContent value="api">
                <Card className="dark:border-gray-800">
                  <CardHeader>
                    <CardTitle>API Data</CardTitle>
                    <CardDescription>Raw data from blockchain APIs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Info className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>API data integration coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
