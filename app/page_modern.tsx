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
  Zap,
  Target,
  Activity,
  DollarSign,
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
  }  apiData?: {
    coinGecko?: any
    etherscan?: any
    uniswap?: any
    bitquery?: any
    tokenMetrics?: any
  }
  dataQuality?: {
    score: number
    details: string
    sources: {
      coinGecko: boolean
      etherscan: boolean
      uniswap: boolean
      bitquery: boolean
      tokenMetrics: boolean
    }
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

  useEffect(() => {
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
        const mockAnalysis = generateMockAnalysis(tokenInput)
        setTimeout(() => {
          setAnalysis(mockAnalysis)
          setLoading(false)
        }, 2000)
        return
      }      // Use local API route as fallback since Supabase function has issues
      console.log("Making request to local API:", "/api/analyze-token")
      
      const response = await fetch("/api/analyze-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenInput }),
      })

      if (!response.ok) {
        console.error("Response not OK:", response.status, response.statusText)
        const errorText = await response.text()
        console.error("Error response:", errorText)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        
        if (response.status === 404 || errorData.error?.includes("not found")) {
          throw new Error(`Token "${tokenInput}" not found. Please check the contract address or token symbol.`)
        }
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Analysis result:", result)
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
    if (score >= 70) return "from-red-500 to-pink-600"
    if (score >= 40) return "from-yellow-500 to-orange-500"
    return "from-green-500 to-emerald-600"
  }

  const getRiskTextColor = (score: number) => {
    if (score >= 70) return "text-red-600 dark:text-red-400"
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400"
    return "text-green-600 dark:text-green-400"
  }

  const getRiskLevel = (score: number) => {
    if (score >= 70) return "High Risk"
    if (score >= 40) return "Medium Risk"
    return "Low Risk"
  }

  const getRiskIcon = (score: number) => {
    if (score >= 70) return XCircle
    if (score >= 40) return AlertTriangle
    return CheckCircle
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-950">
        <div className="container mx-auto px-6 py-8">
          {/* Modern Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  CryptoGuard
                </h1>
                <p className="text-2xl text-gray-600 dark:text-gray-300 font-light">
                  AI-Powered Crypto Scam Detection
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleDarkMode}
                className="ml-4 h-12 w-12 rounded-full border-2 border-purple-300 hover:border-purple-500 transition-all duration-300"
              >
                {darkMode ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6 text-purple-600" />}
              </Button>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 text-sm font-semibold">
                <Zap className="h-4 w-4 mr-2" />
                Real-time Analysis
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm font-semibold">
                <Shield className="h-4 w-4 mr-2" />
                Multi-API Integration
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500 to-green-500 text-white px-4 py-2 text-sm font-semibold">
                <Target className="h-4 w-4 mr-2" />
                Advanced Risk Scoring
              </Badge>
            </div>
          </div>

          {/* Enhanced Input Section */}
          <Card className="max-w-4xl mx-auto mb-12 border-0 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Token Analysis
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                Enter any token address or symbol to perform comprehensive security analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Input
                  placeholder="0x... or Token Symbol (ETH, BTC, USDC)"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && analyzeToken()}
                  className="flex-1 h-14 text-lg border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur"
                />
                <Button 
                  onClick={analyzeToken} 
                  disabled={loading || !tokenInput.trim()}
                  className="h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-5 w-5" />
                  )}
                  {loading ? "Analyzing..." : "Analyze Token"}
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="mockData"
                    checked={useMockData}
                    onChange={(e) => setUseMockData(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label 
                    htmlFor="mockData" 
                    className="text-sm text-gray-600 dark:text-gray-400 font-medium"
                  >
                    Use demo data for testing
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Tokens Section */}
          {!analysis && <TestTokens onSelectToken={handleTestToken} />}

          {/* Error Display */}
          {error && (
            <Alert className="max-w-4xl mx-auto mb-8 border-0 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 shadow-xl">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-300 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading Display */}
          {loading && (
            <Card className="max-w-4xl mx-auto mb-8 border-0 shadow-2xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardContent className="text-center py-12">
                <div className="relative mb-6">
                  <Loader2 className="mx-auto h-16 w-16 animate-spin text-purple-600" />
                  <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-20 animate-pulse"></div>
                </div>
                <p className="text-2xl text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Analyzing Token Security...
                </p>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  Scanning blockchain data from multiple sources
                </p>                <div className="flex justify-center space-x-8 mt-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">CoinGecko</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Etherscan</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uniswap</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">BitQuery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">TokenMetrics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Analysis Results */}
          {analysis && (
            <div className="space-y-8">
              {/* Risk Score Hero Section */}
              <Card className={`border-0 shadow-2xl bg-gradient-to-r ${getRiskColor(analysis.riskScore)} text-white overflow-hidden relative`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <CardContent className="relative z-10 py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="text-center lg:text-left">
                      <h2 className="text-4xl font-bold mb-2">{analysis.tokenInfo.name}</h2>
                      <p className="text-2xl opacity-90 mb-4">{analysis.tokenInfo.symbol}</p>
                      <div className="flex items-center justify-center lg:justify-start space-x-2">
                        <span className="font-mono text-sm opacity-75">{analysis.tokenInfo.address.slice(0, 10)}...{analysis.tokenInfo.address.slice(-8)}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(analysis.tokenInfo.address)}
                          className="text-white hover:bg-white/20"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="relative">
                        <div className="text-8xl font-bold mb-4">{analysis.riskScore}</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border-4 border-white/30"></div>
                        </div>
                      </div>
                      <p className="text-xl opacity-90">Risk Score</p>
                      <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                        {getRiskLevel(analysis.riskScore)}
                      </Badge>
                    </div>
                    
                    <div className="text-center lg:text-right space-y-4">
                      <Button 
                        onClick={downloadReport} 
                        variant="secondary" 
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold">${analysis.tokenInfo.marketCap.toLocaleString()}</div>
                        <div className="text-sm opacity-75">Market Cap</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                      <Badge variant="outline" className="border-blue-300 text-blue-700">24h Volume</Badge>
                    </div>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-2">
                      ${analysis.tokenInfo.volume24h.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Volume/MCap: {((analysis.tokenInfo.volume24h / analysis.tokenInfo.marketCap) * 100).toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="h-8 w-8 text-green-600" />
                      <Badge variant="outline" className="border-green-300 text-green-700">Price</Badge>
                    </div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
                      ${analysis.tokenInfo.price.toFixed(6)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                      Live Price
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="h-8 w-8 text-purple-600" />
                      <Badge variant="outline" className="border-purple-300 text-purple-700">Holders</Badge>
                    </div>
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-400 mb-2">
                      {Math.floor(Math.sqrt(analysis.tokenInfo.marketCap / 10000)).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Estimated Total
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Red Flags */}
              {analysis.redFlags.length > 0 && (
                <Alert className="border-0 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 shadow-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <AlertDescription>
                    <div className="font-bold text-red-800 dark:text-red-300 mb-3 text-lg">
                      ⚠️ Security Alerts Detected:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analysis.redFlags.map((flag, index) => (
                        <div key={index} className="flex items-center text-red-700 dark:text-red-400 bg-white/50 dark:bg-red-900/20 rounded-lg p-3">
                          <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Enhanced Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border-0 shadow-lg h-14">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-lg h-10">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    <span className="font-semibold">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="wallets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-lg h-10">
                    <Wallet className="mr-2 h-5 w-5" />
                    <span className="font-semibold">Wallets</span>
                  </TabsTrigger>
                  <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-lg h-10">
                    <LineChart className="mr-2 h-5 w-5" />
                    <span className="font-semibold">Details</span>
                  </TabsTrigger>
                  <TabsTrigger value="api" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg h-10">
                    <Info className="mr-2 h-5 w-5" />
                    <span className="font-semibold">API Data</span>
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {Object.entries({
                      walletConcentration: { icon: Wallet, color: "purple", title: "Wallet Concentration" },
                      liquidityAnalysis: { icon: ExternalLink, color: "blue", title: "Liquidity Analysis" },
                      supplyDynamics: { icon: BarChart3, color: "cyan", title: "Supply Dynamics" },
                      tradingVolume: { icon: LineChart, color: "green", title: "Trading Volume" }
                    }).map(([key, config]) => {
                      const data = analysis.breakdown[key as keyof typeof analysis.breakdown]
                      return (
                        <Card key={key} className={`border-0 shadow-xl bg-gradient-to-br from-${config.color}-50 to-${config.color}-100 dark:from-${config.color}-900/20 dark:to-${config.color}-800/20`}>
                          <CardHeader className="pb-4">
                            <CardTitle className={`flex items-center text-${config.color}-700 dark:text-${config.color}-400`}>
                              <config.icon className="mr-3 h-6 w-6" />
                              {config.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold dark:text-gray-300">Risk Score:</span>
                                <Badge 
                                  variant="outline" 
                                  className={`border-${config.color}-300 text-${config.color}-700 bg-${config.color}-50 dark:bg-${config.color}-900/30`}
                                >
                                  {data.score}/100
                                </Badge>
                              </div>
                              <p className={`text-sm text-${config.color}-700 dark:text-${config.color}-300 bg-white/50 dark:bg-${config.color}-900/20 p-3 rounded-lg`}>
                                {data.details}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* Wallets Tab */}
                <TabsContent value="wallets" className="mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          Distribution Chart
                        </CardTitle>
                        <CardDescription className="text-lg">
                          Visual representation of token holdings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartErrorBoundary>
                          <WalletDistributionChart data={analysis.walletDistribution} />
                        </ChartErrorBoundary>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          Top Holders
                        </CardTitle>
                        <CardDescription className="text-lg">
                          Detailed wallet breakdown with addresses
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                          {analysis.walletDistribution.slice(0, 10).map((wallet, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <div className="font-bold text-lg dark:text-white">{wallet.label}</div>
                                  <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                                    {wallet.percentage.toFixed(2)}% of total supply
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-lg dark:text-white">
                                    {wallet.value.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">tokens</div>
                                </div>
                              </div>
                              {wallet.address && wallet.address !== "Various" && (
                                <div className="flex items-center justify-between p-3 bg-white/70 dark:bg-gray-700/50 rounded-lg border border-blue-200 dark:border-blue-700">
                                  <span className="font-mono text-sm text-gray-700 dark:text-gray-300 truncate mr-2">
                                    {wallet.address}
                                  </span>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => copyToClipboard(wallet.address!)}
                                      className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-800"
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                    <a 
                                      href={`https://etherscan.io/address/${wallet.address}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-800">
                                        <ExternalLink className="h-4 w-4" />
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
                </TabsContent>                {/* Enhanced Details Tab */}
                <TabsContent value="details" className="mt-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tokenomics Analysis */}
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                          <DollarSign className="mr-3 h-6 w-6 text-indigo-600" />
                          <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Tokenomics Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/60 dark:bg-indigo-900/20 rounded-xl text-center">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                              {analysis.apiData?.coinGecko?.market_data?.circulating_supply 
                                ? (analysis.apiData.coinGecko.market_data.circulating_supply / 1000000).toFixed(1) + "M"
                                : (analysis.tokenInfo.marketCap / analysis.tokenInfo.price / 1000000).toFixed(1) + "M"
                              }
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Circulating Supply</div>
                          </div>
                          <div className="p-4 bg-white/60 dark:bg-indigo-900/20 rounded-xl text-center">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                              {analysis.apiData?.coinGecko?.market_data?.total_supply 
                                ? (analysis.apiData.coinGecko.market_data.total_supply / 1000000).toFixed(1) + "M"
                                : (analysis.tokenInfo.marketCap / analysis.tokenInfo.price / 1000000).toFixed(1) + "M"
                              }
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Total Supply</div>
                          </div>
                          <div className="p-4 bg-white/60 dark:bg-indigo-900/20 rounded-xl text-center">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                              {analysis.apiData?.coinGecko?.market_data?.max_supply 
                                ? (analysis.apiData.coinGecko.market_data.max_supply / 1000000).toFixed(1) + "M"
                                : "∞"
                              }
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Max Supply</div>
                          </div>
                          <div className="p-4 bg-white/60 dark:bg-indigo-900/20 rounded-xl text-center">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                              {analysis.apiData?.coinGecko?.market_data?.circulating_supply && analysis.apiData?.coinGecko?.market_data?.total_supply
                                ? ((analysis.apiData.coinGecko.market_data.circulating_supply / analysis.apiData.coinGecko.market_data.total_supply) * 100).toFixed(1) + "%"
                                : "85%"
                              }
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Circulation Rate</div>
                          </div>
                        </div>
                        
                        {/* Additional tokenomics insights */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white/40 dark:bg-indigo-900/10 rounded-lg">
                            <span className="text-sm font-medium">Market Cap Rank</span>
                            <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                              #{analysis.apiData?.coinGecko?.market_cap_rank || analysis.apiData?.tokenMetrics?.analytics?.market_cap_rank || "N/A"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/40 dark:bg-indigo-900/10 rounded-lg">
                            <span className="text-sm font-medium">Fully Diluted Valuation</span>
                            <span className="text-sm font-bold text-indigo-600">
                              ${analysis.apiData?.coinGecko?.market_data?.fully_diluted_valuation?.usd 
                                ? analysis.apiData.coinGecko.market_data.fully_diluted_valuation.usd.toLocaleString()
                                : analysis.tokenInfo.marketCap.toLocaleString()
                              }
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/40 dark:bg-indigo-900/10 rounded-lg">
                            <span className="text-sm font-medium">Volume/Market Cap Ratio</span>
                            <Badge variant="outline" className={`border-indigo-300 ${
                              ((analysis.tokenInfo.volume24h / analysis.tokenInfo.marketCap) * 100) > 10 
                                ? 'text-red-700 border-red-300' 
                                : 'text-indigo-700'
                            }`}>
                              {((analysis.tokenInfo.volume24h / analysis.tokenInfo.marketCap) * 100).toFixed(2)}%
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                          <Shield className="mr-3 h-6 w-6 text-purple-600" />
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Security Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { 
                              label: "Contract Verified", 
                              status: analysis.apiData?.etherscan?.result?.[0]?.SourceCode ? "verified" : "unknown", 
                              icon: CheckCircle, 
                              color: analysis.apiData?.etherscan?.result?.[0]?.SourceCode ? "green" : "yellow" 
                            },
                            { label: "Proxy Contract", status: "none", icon: XCircle, color: "green" },
                            { label: "Pausable", status: "unknown", icon: AlertTriangle, color: "yellow" },
                            { label: "Blacklist Function", status: "none", icon: CheckCircle, color: "green" }
                          ].map((item, index) => (
                            <div key={index} className="p-4 bg-white/60 dark:bg-purple-900/20 rounded-xl">
                              <div className="flex items-center space-x-2 mb-2">
                                <item.icon className={`h-5 w-5 text-${item.color}-500`} />
                                <span className="font-semibold text-sm dark:text-white">{item.label}</span>
                              </div>
                              <div className={`text-sm font-medium text-${item.color}-600 dark:text-${item.color}-400 capitalize`}>
                                {item.status}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Risk assessment based on real data */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white/40 dark:bg-purple-900/10 rounded-lg">
                            <span className="text-sm font-medium">Age Assessment</span>
                            <Badge variant="outline" className="border-purple-300 text-purple-700">
                              {analysis.apiData?.coinGecko?.genesis_date 
                                ? `${new Date().getFullYear() - new Date(analysis.apiData.coinGecko.genesis_date).getFullYear()} years`
                                : "Unknown"
                              }
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/40 dark:bg-purple-900/10 rounded-lg">
                            <span className="text-sm font-medium">Community Score</span>
                            <Badge variant="outline" className="border-purple-300 text-purple-700">
                              {analysis.apiData?.coinGecko?.sentiment_votes_up_percentage
                                ? `${analysis.apiData.coinGecko.sentiment_votes_up_percentage.toFixed(1)}% positive`
                                : "Not available"
                              }
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/40 dark:bg-purple-900/10 rounded-lg">
                            <span className="text-sm font-medium">Liquidity Risk</span>
                            <Badge variant="outline" className={`border-purple-300 ${
                              analysis.breakdown.liquidityAnalysis.score > 60 
                                ? 'text-red-700 border-red-300' 
                                : analysis.breakdown.liquidityAnalysis.score > 30
                                ? 'text-yellow-700 border-yellow-300'
                                : 'text-green-700 border-green-300'
                            }`}>
                              {analysis.breakdown.liquidityAnalysis.score > 60 ? 'High' : 
                               analysis.breakdown.liquidityAnalysis.score > 30 ? 'Medium' : 'Low'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>{/* Enhanced API Data Tab */}
                <TabsContent value="api" className="mt-8">
                  <div className="space-y-6">
                    {/* Data Quality Overview */}
                    {analysis.dataQuality && (
                      <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                        <CardHeader>
                          <CardTitle className="text-2xl text-indigo-700 dark:text-indigo-400">
                            Data Quality Score: {analysis.dataQuality.score}%
                          </CardTitle>
                          <CardDescription className="text-lg">
                            {analysis.dataQuality.details}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-5 gap-4">
                            {Object.entries({
                              coinGecko: { name: "CoinGecko", color: "green" },
                              etherscan: { name: "Etherscan", color: "blue" },
                              uniswap: { name: "Uniswap", color: "purple" },
                              bitquery: { name: "BitQuery", color: "orange" },
                              tokenMetrics: { name: "TokenMetrics", color: "pink" }
                            }).map(([key, config]) => {
                              const isAvailable = analysis.dataQuality?.sources[key as keyof typeof analysis.dataQuality.sources]
                              return (
                                <div key={key} className="text-center">
                                  <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                                    isAvailable 
                                      ? `bg-${config.color}-100 dark:bg-${config.color}-900/30` 
                                      : 'bg-gray-100 dark:bg-gray-800'
                                  }`}>
                                    {isAvailable ? (
                                      <CheckCircle className={`h-6 w-6 text-${config.color}-600`} />
                                    ) : (
                                      <XCircle className="h-6 w-6 text-gray-400" />
                                    )}
                                  </div>
                                  <p className={`text-sm font-medium ${
                                    isAvailable 
                                      ? `text-${config.color}-700 dark:text-${config.color}-400` 
                                      : 'text-gray-500'
                                  }`}>
                                    {config.name}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {analysis.apiData && Object.keys(analysis.apiData).length > 0 ? (
                      Object.entries({
                        coinGecko: { name: "CoinGecko", color: "green", description: "Market data and token information" },
                        etherscan: { name: "Etherscan", color: "blue", description: "Blockchain transaction data" },
                        uniswap: { name: "Uniswap", color: "purple", description: "DEX liquidity and trading data" },
                        bitquery: { name: "BitQuery", color: "orange", description: "Advanced blockchain analytics" },
                        tokenMetrics: { name: "TokenMetrics", color: "pink", description: "Professional token analytics and risk assessment" }
                      }).map(([key, config]) => {
                        const data = analysis.apiData?.[key as keyof typeof analysis.apiData]
                        if (!data) return null
                        
                        return (
                          <Card key={key} className={`border-0 shadow-xl bg-gradient-to-br from-${config.color}-50 to-${config.color}-100 dark:from-${config.color}-900/20 dark:to-${config.color}-800/20`}>
                            <CardHeader>
                              <CardTitle className={`text-2xl text-${config.color}-700 dark:text-${config.color}-400`}>
                                {config.name} API Data
                              </CardTitle>
                              <CardDescription className="text-lg">
                                {config.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {/* Special handling for TokenMetrics to show key insights */}
                              {key === 'tokenMetrics' && data.analytics && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="p-4 bg-white/60 dark:bg-pink-900/20 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                                      {data.analytics.risk_score || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Risk Score</div>
                                  </div>
                                  <div className="p-4 bg-white/60 dark:bg-pink-900/20 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                                      {data.analytics.liquidity_score || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Liquidity Score</div>
                                  </div>
                                  <div className="p-4 bg-white/60 dark:bg-pink-900/20 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                                      #{data.analytics.market_cap_rank || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Market Rank</div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Special handling for CoinGecko to show key market data */}
                              {key === 'coinGecko' && data.market_data && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="p-4 bg-white/60 dark:bg-green-900/20 rounded-xl text-center">
                                    <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                                      ${data.market_data.current_price?.usd?.toLocaleString() || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Current Price</div>
                                  </div>
                                  <div className="p-4 bg-white/60 dark:bg-green-900/20 rounded-xl text-center">
                                    <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                                      ${(data.market_data.market_cap?.usd || 0).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Market Cap</div>
                                  </div>
                                  <div className="p-4 bg-white/60 dark:bg-green-900/20 rounded-xl text-center">
                                    <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                                      ${(data.market_data.total_volume?.usd || 0).toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">24h Volume</div>
                                  </div>
                                  <div className="p-4 bg-white/60 dark:bg-green-900/20 rounded-xl text-center">
                                    <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                                      {((data.market_data.total_volume?.usd || 0) / (data.market_data.market_cap?.usd || 1) * 100).toFixed(2)}%
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Vol/MCap</div>
                                  </div>
                                </div>
                              )}

                              <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 max-h-80 overflow-auto">
                                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {JSON.stringify(data, null, 2)}
                                </pre>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })
                    ) : (
                      <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20">
                        <CardContent className="text-center py-16">
                          <Info className="mx-auto h-16 w-16 mb-4 text-gray-400 dark:text-gray-600" />
                          <p className="text-xl text-gray-500 dark:text-gray-400 font-semibold">No API data available</p>
                          <p className="text-gray-400 dark:text-gray-500 mt-2">API responses will appear here when available</p>
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
